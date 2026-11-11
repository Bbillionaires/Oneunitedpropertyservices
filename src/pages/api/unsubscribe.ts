/**
 * POST /api/unsubscribe — verifies a signed unsubscribe token, then asks the
 * Google Apps Script backend to record the address in the "Suppression List"
 * sheet. Success is only reported when the backend confirms the write.
 *
 * Accepts either:
 *   - JSON {"token": "..."} from the /unsubscribe page, or
 *   - RFC 8058 one-click: POST /api/unsubscribe?t=<token> with body
 *     "List-Unsubscribe=One-Click" (for mail clients' built-in unsubscribe).
 *
 * Environment variables (Vercel → Project → Settings → Environment Variables):
 *   UNSUBSCRIBE_SIGNING_SECRET       HMAC secret used to sign links (same value as the
 *                                    Apps Script property SIGNING_SECRET)
 *   UNSUBSCRIBE_APPS_SCRIPT_URL      The Apps Script web app URL (…/exec)
 *   UNSUBSCRIBE_APPS_SCRIPT_SECRET   Shared secret the Apps Script checks (its SHARED_SECRET property)
 *
 * Responses: { status: 'recorded' | 'already_unsubscribed' | 'invalid' | 'expired' | 'unavailable' | 'error' }
 */
import type { APIRoute } from 'astro';
import { verifyUnsubscribeToken } from '@/lib/unsubscribe-token';

export const prerender = false;

const env = (key: string): string | undefined =>
  (import.meta.env as Record<string, string | undefined>)[key] || process.env[key] || undefined;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

async function readToken(request: Request): Promise<string> {
  const fromQuery = new URL(request.url).searchParams.get('t');
  const type = request.headers.get('content-type') ?? '';
  try {
    if (type.includes('application/json')) {
      const body = (await request.json()) as { token?: unknown };
      if (typeof body.token === 'string') return body.token;
    } else if (type.includes('form')) {
      const form = await request.formData();
      const t = form.get('token');
      if (typeof t === 'string') return t;
    }
  } catch {
    /* fall through to the query string */
  }
  return fromQuery ?? '';
}

export const POST: APIRoute = async ({ request }) => {
  const signingSecret = env('UNSUBSCRIBE_SIGNING_SECRET');
  const scriptUrl = env('UNSUBSCRIBE_APPS_SCRIPT_URL');
  const scriptSecret = env('UNSUBSCRIBE_APPS_SCRIPT_SECRET');
  if (!signingSecret || !scriptUrl || !scriptSecret) {
    console.error(
      '[unsubscribe] Not configured: set UNSUBSCRIBE_SIGNING_SECRET, UNSUBSCRIBE_APPS_SCRIPT_URL and UNSUBSCRIBE_APPS_SCRIPT_SECRET.',
    );
    return json(503, { status: 'unavailable' });
  }

  const token = await readToken(request);
  const verified = verifyUnsubscribeToken(token, signingSecret);
  if (!verified.ok) return json(verified.reason === 'expired' ? 410 : 400, { status: verified.reason });

  type ScriptReply = { ok?: boolean; status?: string };
  let result = null as ScriptReply | null;
  try {
    const res = await fetch(scriptUrl, {
      method: 'POST',
      // Apps Script web apps answer with a redirect to the result; follow it.
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: scriptSecret,
        action: 'unsubscribe',
        email: verified.claims.email,
        source: 'website',
        tokenIssuedAt: verified.claims.issuedAt ? new Date(verified.claims.issuedAt * 1000).toISOString() : '',
        requestedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (res.ok) result = (await res.json().catch(() => null)) as ScriptReply | null;
    else console.error('[unsubscribe] Apps Script HTTP', res.status);
  } catch (err) {
    console.error('[unsubscribe] Apps Script request failed', err instanceof Error ? err.message : err);
  }

  // Only a confirmed write (or a confirmed existing record) counts as success.
  if (result?.ok === true && (result.status === 'recorded' || result.status === 'already_unsubscribed')) {
    return json(200, { status: result.status });
  }
  if (result) console.error('[unsubscribe] Apps Script did not confirm:', JSON.stringify(result).slice(0, 300));
  return json(502, { status: 'error' });
};
