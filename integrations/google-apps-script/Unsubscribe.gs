/**
 * One United Property Services — unsubscribe backend (Google Apps Script).
 *
 * Paste this file into an Apps Script project (ideally bound to the spreadsheet
 * that contains the "Suppression List" tab) and deploy it as a web app.
 * The website's /api/unsubscribe function calls doPost() after it has verified
 * the signed link; this script records the address and reports back.
 *
 * Script Properties (Project Settings → Script Properties):
 *   SHARED_SECRET    Long random string. Must equal Vercel's UNSUBSCRIBE_APPS_SCRIPT_SECRET.
 *   SIGNING_SECRET   Long random string. Must equal Vercel's UNSUBSCRIBE_SIGNING_SECRET.
 *                    Used by buildUnsubscribeUrl() to create links for your emails.
 *   SPREADSHEET_ID   Optional. Only needed if this script is NOT bound to the spreadsheet.
 *
 * Sheet layout: the "Suppression List" tab keeps one row per address, with the
 * email in EMAIL_COLUMN (column A by default). New rows are written as:
 *   Email | Unsubscribed At | Source | Link Issued At
 * Adjust EMAIL_COLUMN / appendRow below if your existing tab uses other columns.
 */

const SHEET_NAME = 'Suppression List';
const EMAIL_COLUMN = 1; // 1 = column A
const SITE_URL = 'https://oneunitedpropertyservices.com';

/* ------------------------------------------------------------------ */
/* Web app endpoint                                                    */
/* ------------------------------------------------------------------ */

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOut_({ ok: false, error: 'bad_request' });
  }

  const props = PropertiesService.getScriptProperties();
  const expected = props.getProperty('SHARED_SECRET');
  if (!expected || !body || body.secret !== expected) {
    return jsonOut_({ ok: false, error: 'unauthorized' });
  }
  if (body.action !== 'unsubscribe') return jsonOut_({ ok: false, error: 'unknown_action' });

  const email = normalizeEmail_(body.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return jsonOut_({ ok: false, error: 'invalid_email' });

  // Serialize writes so two clicks can't create duplicate rows.
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return jsonOut_({ ok: false, error: 'busy' });
  try {
    const sheet = getSuppressionSheet_();
    if (!sheet) return jsonOut_({ ok: false, error: 'sheet_not_found' });

    if (findEmailRow_(sheet, email) > 0) {
      return jsonOut_({ ok: true, status: 'already_unsubscribed' });
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Email', 'Unsubscribed At', 'Source', 'Link Issued At']);
    }
    sheet.appendRow([email, new Date(), String(body.source || 'website'), String(body.tokenIssuedAt || '')]);
    SpreadsheetApp.flush();

    // Confirm the write before reporting success.
    if (findEmailRow_(sheet, email) <= 0) return jsonOut_({ ok: false, error: 'write_not_confirmed' });
    return jsonOut_({ ok: true, status: 'recorded' });
  } catch (err) {
    console.error(err);
    return jsonOut_({ ok: false, error: 'server_error' });
  } finally {
    lock.releaseLock();
  }
}

/* ------------------------------------------------------------------ */
/* Helpers for sending marketing email — use these so opted-out        */
/* addresses are never emailed again.                                  */
/* ------------------------------------------------------------------ */

/** True if the address is on the Suppression List. */
function isSuppressed(email) {
  const sheet = getSuppressionSheet_();
  return !!sheet && findEmailRow_(sheet, normalizeEmail_(email)) > 0;
}

/** Returns only the addresses that are NOT on the Suppression List. */
function filterSuppressed(emails) {
  const sheet = getSuppressionSheet_();
  const blocked = new Set(sheet ? readEmails_(sheet) : []);
  return emails.filter(function (e) {
    return !blocked.has(normalizeEmail_(e));
  });
}

/**
 * Signed, recipient-specific unsubscribe link for an email footer.
 * Format matches the website's verifier (src/lib/unsubscribe-token.ts).
 */
function buildUnsubscribeUrl(email, validDays) {
  const secret = PropertiesService.getScriptProperties().getProperty('SIGNING_SECRET');
  if (!secret) throw new Error('Set the SIGNING_SECRET script property first.');
  const now = Math.floor(Date.now() / 1000);
  const claims = { v: 1, e: normalizeEmail_(email), iat: now, exp: now + (validDays || 365) * 86400 };
  const payload = b64url_(Utilities.newBlob(JSON.stringify(claims)).getBytes());
  const sig = b64url_(Utilities.computeHmacSha256Signature(payload, secret, Utilities.Charset.UTF_8));
  return SITE_URL + '/unsubscribe?t=' + payload + '.' + sig;
}

/**
 * Example: send one marketing email safely. Skips suppressed addresses and
 * adds the unsubscribe link. Adapt to your own templates.
 */
function sendMarketingEmail(to, subject, htmlBody) {
  if (isSuppressed(to)) return false;
  const url = buildUnsubscribeUrl(to);
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

function getSuppressionSheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  const ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
  return ss ? ss.getSheetByName(SHEET_NAME) : null;
}

function readEmails_(sheet) {
  const last = sheet.getLastRow();
  if (last < 1) return [];
  return sheet
    .getRange(1, EMAIL_COLUMN, last, 1)
    .getValues()
    .map(function (r) {
      return normalizeEmail_(r[0]);
    });
}

/** 1-based row of the email, or 0 if not present. */
function findEmailRow_(sheet, email) {
  const list = readEmails_(sheet);
  const i = list.indexOf(email);
  return i === -1 ? 0 : i + 1;
}

function normalizeEmail_(email) {
  return String(email || '').trim().toLowerCase();
}

function b64url_(bytes) {
  return Utilities.base64EncodeWebSafe(bytes).replace(/=+$/, '');
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
