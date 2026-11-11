/**
 * Signed, recipient-specific unsubscribe tokens (server-side only).
 *
 * Format:  <payload>.<signature>
 *   payload   = base64url(JSON {"v":1,"e":"<email>","iat":<unix>,"exp":<unix>})
 *   signature = base64url(HMAC-SHA256(UNSUBSCRIBE_SIGNING_SECRET, payload))
 * Base64url padding ("=") is stripped from both parts. The Apps Script helper
 * `buildUnsubscribeUrl()` in integrations/google-apps-script/Unsubscribe.gs
 * produces the same format, so links can be generated wherever emails are sent.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

export interface UnsubscribeClaims {
  email: string;
  issuedAt: number;
  expiresAt: number;
}

export type VerifyResult =
  | { ok: true; claims: UnsubscribeClaims }
  | { ok: false; reason: 'invalid' | 'expired' };

const b64url = (buf: Buffer) => buf.toString('base64url');
const unpad = (s: string) => s.replace(/=+$/, '');

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

const sign = (payload: string, secret: string) =>
  b64url(createHmac('sha256', secret).update(payload, 'utf8').digest());

export function createUnsubscribeToken(email: string, secret: string, validDays = 365): string {
  const now = Math.floor(Date.now() / 1000);
  const payload = b64url(
    Buffer.from(JSON.stringify({ v: 1, e: normalizeEmail(email), iat: now, exp: now + validDays * 86400 }), 'utf8'),
  );
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyUnsubscribeToken(token: string, secret: string, now = Date.now()): VerifyResult {
  if (typeof token !== 'string' || token.length > 2048) return { ok: false, reason: 'invalid' };
  const parts = token.trim().split('.');
  if (parts.length !== 2) return { ok: false, reason: 'invalid' };
  const payload = unpad(parts[0]);
  const given = Buffer.from(unpad(parts[1]), 'base64url');
  const expected = Buffer.from(sign(payload, secret), 'base64url');
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return { ok: false, reason: 'invalid' };

  let data: { v?: number; e?: unknown; iat?: unknown; exp?: unknown };
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return { ok: false, reason: 'invalid' };
  }
  if (data.v !== 1 || typeof data.e !== 'string' || typeof data.exp !== 'number') return { ok: false, reason: 'invalid' };
  const email = normalizeEmail(data.e);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { ok: false, reason: 'invalid' };
  if (data.exp * 1000 < now) return { ok: false, reason: 'expired' };

  return {
    ok: true,
    claims: { email, issuedAt: typeof data.iat === 'number' ? data.iat : 0, expiresAt: data.exp },
  };
}
