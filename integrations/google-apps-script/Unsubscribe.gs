/**
 * One United Property Services — unsubscribe backend (Google Apps Script).
 *
 * Paste this file into its OWN Apps Script project (script.google.com → New project),
 * separate from any existing automation scripts, and deploy it as a web app.
 * Every name except doPost is prefixed with "unsub" so it can't collide with other code;
 * doPost must keep its name, which is why this lives in a separate project.
 * The website's /api/unsubscribe function calls doPost() after it has verified
 * the signed link; this script records the address and reports back.
 *
 * Script Properties (Project Settings → Script Properties):
 *   SHARED_SECRET    Long random string. Must equal Vercel's UNSUBSCRIBE_APPS_SCRIPT_SECRET.
 *   SIGNING_SECRET   Long random string. Must equal Vercel's UNSUBSCRIBE_SIGNING_SECRET.
 *                    Used by unsubBuildUrl() to create links for your emails.
 *   SPREADSHEET_ID   The ID of the spreadsheet with the "Suppression List" tab (the long code
 *                    between /d/ and /edit in the sheet's URL). Required for a separate project.
 *
 * Sheet layout: the "Suppression List" tab keeps one row per address, with the
 * email in UNSUB_EMAIL_COLUMN (column A by default). New rows are written as:
 *   Email | Unsubscribed At | Source | Link Issued At
 * Adjust UNSUB_EMAIL_COLUMN / appendRow below if your existing tab uses other columns.
 */

const UNSUB_SHEET_NAME = 'Suppression List';
const UNSUB_EMAIL_COLUMN = 1; // 1 = column A
const UNSUB_SITE_URL = 'https://oneunitedpropertyservices.com';

/* ------------------------------------------------------------------ */
/* Web app endpoint                                                    */
/* ------------------------------------------------------------------ */

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return unsubJsonOut_({ ok: false, error: 'bad_request' });
  }

  const props = PropertiesService.getScriptProperties();
  const expected = props.getProperty('SHARED_SECRET');
  if (!expected || !body || body.secret !== expected) {
    return unsubJsonOut_({ ok: false, error: 'unauthorized' });
  }
  if (body.action !== 'unsubscribe') return unsubJsonOut_({ ok: false, error: 'unknown_action' });

  const email = unsubNormalizeEmail_(body.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return unsubJsonOut_({ ok: false, error: 'invalid_email' });

  // Serialize writes so two clicks can't create duplicate rows.
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return unsubJsonOut_({ ok: false, error: 'busy' });
  try {
    const sheet = unsubGetSheet_();
    if (!sheet) return unsubJsonOut_({ ok: false, error: 'sheet_not_found' });

    if (unsubFindEmailRow_(sheet, email) > 0) {
      return unsubJsonOut_({ ok: true, status: 'already_unsubscribed' });
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Email', 'Unsubscribed At', 'Source', 'Link Issued At']);
    }
    sheet.appendRow([email, new Date(), String(body.source || 'website'), String(body.tokenIssuedAt || '')]);
    SpreadsheetApp.flush();

    // Confirm the write before reporting success.
    if (unsubFindEmailRow_(sheet, email) <= 0) return unsubJsonOut_({ ok: false, error: 'write_not_confirmed' });
    return unsubJsonOut_({ ok: true, status: 'recorded' });
  } catch (err) {
    console.error(err);
    return unsubJsonOut_({ ok: false, error: 'server_error' });
  } finally {
    lock.releaseLock();
  }
}

/* ------------------------------------------------------------------ */
/* Helpers for sending marketing email — use these so opted-out        */
/* addresses are never emailed again.                                  */
/* ------------------------------------------------------------------ */

/** True if the address is on the Suppression List. */
function unsubIsSuppressed(email) {
  const sheet = unsubGetSheet_();
  return !!sheet && unsubFindEmailRow_(sheet, unsubNormalizeEmail_(email)) > 0;
}

/** Returns only the addresses that are NOT on the Suppression List. */
function unsubFilterSuppressed(emails) {
  const sheet = unsubGetSheet_();
  const blocked = new Set(sheet ? unsubReadEmails_(sheet) : []);
  return emails.filter(function (e) {
    return !blocked.has(unsubNormalizeEmail_(e));
  });
}

/**
 * Signed, recipient-specific unsubscribe link for an email footer.
 * Format matches the website's verifier (src/lib/unsubscribe-token.ts).
 */
function unsubBuildUrl(email, validDays) {
  const secret = PropertiesService.getScriptProperties().getProperty('SIGNING_SECRET');
  if (!secret) throw new Error('Set the SIGNING_SECRET script property first.');
  const now = Math.floor(Date.now() / 1000);
  const claims = { v: 1, e: unsubNormalizeEmail_(email), iat: now, exp: now + (validDays || 365) * 86400 };
  const payload = unsubB64url_(Utilities.newBlob(JSON.stringify(claims)).getBytes());
  const sig = unsubB64url_(Utilities.computeHmacSha256Signature(payload, secret, Utilities.Charset.UTF_8));
  return UNSUB_SITE_URL + '/unsubscribe?t=' + payload + '.' + sig;
}

/**
 * Example: send one marketing email safely. Skips suppressed addresses and
 * adds the unsubscribe link. Adapt to your own templates.
 */
function unsubSendMarketingEmail(to, subject, htmlBody) {
  if (unsubIsSuppressed(to)) return false;
  const url = unsubBuildUrl(to);
  GmailApp.sendEmail(to, subject, 'Unsubscribe: ' + url, {
    htmlBody:
      htmlBody +
      '<p style="font-size:12px;color:#777">Don’t want these emails? <a href="' + url + '">Unsubscribe</a>.</p>',
    name: 'One United Property Services',
  });
  return true;
}

/* ------------------------------------------------------------------ */
/* Internals                                                           */
/* ------------------------------------------------------------------ */

function unsubGetSheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  const ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
  return ss ? ss.getSheetByName(UNSUB_SHEET_NAME) : null;
}

function unsubReadEmails_(sheet) {
  const last = sheet.getLastRow();
  if (last < 1) return [];
  return sheet
    .getRange(1, UNSUB_EMAIL_COLUMN, last, 1)
    .getValues()
    .map(function (r) {
      return unsubNormalizeEmail_(r[0]);
    });
}

/** 1-based row of the email, or 0 if not present. */
function unsubFindEmailRow_(sheet, email) {
  const list = unsubReadEmails_(sheet);
  const i = list.indexOf(email);
  return i === -1 ? 0 : i + 1;
}

function unsubNormalizeEmail_(email) {
  return String(email || '').trim().toLowerCase();
}

function unsubB64url_(bytes) {
  return Utilities.base64EncodeWebSafe(bytes).replace(/=+$/, '');
}

function unsubJsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
