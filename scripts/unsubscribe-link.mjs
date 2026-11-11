#!/usr/bin/env node
/**
 * Generate a signed unsubscribe link for one email address.
 *
 *   UNSUBSCRIBE_SIGNING_SECRET=... node scripts/unsubscribe-link.mjs person@example.com [validDays]
 *
 * Same format as src/lib/unsubscribe-token.ts and buildUnsubscribeUrl() in
 * integrations/google-apps-script/Unsubscribe.gs.
 */
import { createHmac } from 'node:crypto';

const [email, days = '365'] = process.argv.slice(2);
const secret = process.env.UNSUBSCRIBE_SIGNING_SECRET;
if (!email || !secret) {
  console.error('Usage: UNSUBSCRIBE_SIGNING_SECRET=... node scripts/unsubscribe-link.mjs <email> [validDays]');
  process.exit(1);
}
const now = Math.floor(Date.now() / 1000);
const payload = Buffer.from(
  JSON.stringify({ v: 1, e: email.trim().toLowerCase(), iat: now, exp: now + Number(days) * 86400 }),
).toString('base64url');
const sig = createHmac('sha256', secret).update(payload).digest('base64url');
console.log(`https://oneunitedpropertyservices.com/unsubscribe?t=${payload}.${sig}`);
