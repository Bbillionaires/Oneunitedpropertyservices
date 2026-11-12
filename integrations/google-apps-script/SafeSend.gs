/**
 * One United Property Services — safe marketing email sending.
 *
 * Paste this into your EXISTING automation Apps Script project as its own file
 * (+ next to Files → Script → name it "SafeSend"). Every name starts with
 * "oneUnited" so it can't clash with your other code.
 *
 * Script Properties needed in THAT project (gear icon → Script Properties):
 *   UNSUB_SPREADSHEET_ID   Same value as SPREADSHEET_ID in the unsubscribe project.
 *   UNSUB_SIGNING_SECRET   Same value as SIGNING_SECRET in the unsubscribe project.
 *
 * Use it for MARKETING emails only. Replace
 *   GmailApp.sendEmail(to, subject, body, { htmlBody: html })
 * with
 *   oneUnitedSendMarketing(to, subject, html)
 * It skips anyone on the "Suppression List" tab, adds their personal
 * unsubscribe link, and returns true if sent / false if skipped.
 * If the Suppression List can't be read it throws an error instead of sending.
 */

const ONEUNITED_SITE_URL = 'https://oneunitedpropertyservices.com';
let oneUnitedSuppressedCache_ = null;

function oneUnitedSendMarketing(to, subject, htmlBody, options) {
  const email = oneUnitedNormalize_(to);
  if (!email || oneUnitedIsUnsubscribed(email)) return false;
  const url = oneUnitedUnsubscribeUrl(email);
  const footer =
    '<p style="font-size:12px;color:#777;margin-top:24px">' +
    'Don’t want these emails? <a href="' + url + '">Unsubscribe</a>.</p>';
  const opts = Object.assign({ name: 'One United Property Services' }, options || {});
  opts.htmlBody = htmlBody + footer;
  const plain = String(htmlBody).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  GmailApp.sendEmail(email, subject, plain + '\n\nUnsubscribe: ' + url, opts);
  return true;
}

/** True if the address is on the Suppression List. */
function oneUnitedIsUnsubscribed(email) {
  if (!oneUnitedSuppressedCache_) {
    const id = PropertiesService.getScriptProperties().getProperty('UNSUB_SPREADSHEET_ID');
    if (!id) throw new Error('Add the UNSUB_SPREADSHEET_ID script property first.');
    const sheet = SpreadsheetApp.openById(id).getSheetByName('Suppression List');
    if (!sheet) throw new Error('The "Suppression List" tab was not found.');
    const last = sheet.getLastRow();
    const rows = last ? sheet.getRange(1, 1, last, 1).getValues() : [];
    oneUnitedSuppressedCache_ = new Set(rows.map(function (r) { return oneUnitedNormalize_(r[0]); }));
  }
  return oneUnitedSuppressedCache_.has(oneUnitedNormalize_(email));
}

/** Personal, signed unsubscribe link (valid 365 days). */
function oneUnitedUnsubscribeUrl(email) {
  const secret = PropertiesService.getScriptProperties().getProperty('UNSUB_SIGNING_SECRET');
  if (!secret) throw new Error('Add the UNSUB_SIGNING_SECRET script property first.');
  const now = Math.floor(Date.now() / 1000);
  const claims = { v: 1, e: oneUnitedNormalize_(email), iat: now, exp: now + 365 * 86400 };
  const payload = oneUnitedB64_(Utilities.newBlob(JSON.stringify(claims)).getBytes());
  const sig = oneUnitedB64_(Utilities.computeHmacSha256Signature(payload, secret, Utilities.Charset.UTF_8));
  return ONEUNITED_SITE_URL + '/unsubscribe?t=' + payload + '.' + sig;
}

function oneUnitedNormalize_(email) {
  return String(email || '').trim().toLowerCase();
}

function oneUnitedB64_(bytes) {
  return Utilities.base64EncodeWebSafe(bytes).replace(/=+$/, '');
}
