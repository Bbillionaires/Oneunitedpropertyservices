/**
 * POST /api/quote — receives the quote form (multipart/form-data) and emails it
 * to the business through Resend (https://resend.com). Runs as a Vercel
 * serverless function; every other page on the site stays static.
 *
 * Required environment variables (set in Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY     Resend API key with sending access
 *   QUOTE_TO_EMAIL     Where requests are delivered (comma-separate for several)
 *   QUOTE_FROM_EMAIL   Sender on a domain verified in Resend,
 *                      e.g. "One United Quotes <quotes@send.oneunitedpropertyservices.com>"
 */
import type { APIRoute } from 'astro';
import { propertyOptions, serviceOptions, frequencyOptions, contactMethodOptions } from '@/data/quoteForm';

export const prerender = false;

const MAX_PHOTOS = 8;
// Vercel caps request bodies at ~4.5 MB; the browser shrinks photos before upload.
const MAX_PHOTO_BYTES = 4 * 1024 * 1024;

const LABELS: Record<string, string> = {
  propertyType: 'Property type',
  services: 'Services',
  servicesOther: 'Other service',
  address: 'Property address',
  units: 'Units',
  buildings: 'Buildings',
  squareFeet: 'Square footage',
  propertyCount: 'Number of properties',
  frequency: 'Frequency',
  program: 'Program',
  notes: 'Notes',
  name: 'Name',
  company: 'Company',
  phone: 'Phone',
  email: 'Email',
  preferredContact: 'Preferred contact',
  source: 'Submitted from',
};
const REQUIRED = ['propertyType', 'services', 'address', 'frequency', 'name', 'phone', 'email'];

/** Turn form codes ("gas-station", "monthly") into the labels the customer saw. */
const DISPLAY: Record<string, { value: string; label: string }[]> = {
  propertyType: propertyOptions,
  services: serviceOptions,
  frequency: frequencyOptions,
  preferredContact: contactMethodOptions,
};
const display = (key: string, value: string) =>
  DISPLAY[key]?.find((o) => o.value === value)?.label ?? value;

const env = (key: string): string | undefined =>
  (import.meta.env as Record<string, string | undefined>)[key] || process.env[key] || undefined;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const clean = (v: FormDataEntryValue) => (typeof v === 'string' ? v.trim().slice(0, 4000) : '');

export const POST: APIRoute = async ({ request }) => {
  const apiKey = env('RESEND_API_KEY');
  const to = env('QUOTE_TO_EMAIL');
  const from = env('QUOTE_FROM_EMAIL');
  if (!apiKey || !to || !from) {
    console.error('[quote] Delivery not configured: set RESEND_API_KEY, QUOTE_TO_EMAIL and QUOTE_FROM_EMAIL.');
    return json(503, { error: 'not_configured' });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, { error: 'bad_request' });
  }

  // Honeypot: bots fill the hidden "website" field. Pretend success, send nothing.
  if (clean(form.get('website') ?? '')) return json(200, { ok: true });

  const fields: Record<string, string> = {};
  for (const key of Object.keys(LABELS)) {
    const values = form.getAll(key).map(clean).filter(Boolean).map((v) => display(key, v));
    if (values.length) fields[key] = values.join(', ');
  }
  const missing = REQUIRED.filter((k) => !fields[k]);
  if (missing.length) return json(422, { error: 'missing_fields', fields: missing });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email)) return json(422, { error: 'invalid_email' });

  const photos = form.getAll('photos').filter((p): p is File => p instanceof File && p.size > 0).slice(0, MAX_PHOTOS);
  const attachments: { filename: string; content: string }[] = [];
  let total = 0;
  for (const [i, file] of photos.entries()) {
    if (!file.type.startsWith('image/')) continue;
    total += file.size;
    if (total > MAX_PHOTO_BYTES) break;
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    attachments.push({
      filename: `property-photo-${i + 1}.${ext}`,
      content: Buffer.from(await file.arrayBuffer()).toString('base64'),
    });
  }

  const rows = Object.entries(fields)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#555;font-weight:600;white-space:nowrap;vertical-align:top">${escapeHtml(
          LABELS[k],
        )}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#15181c">${escapeHtml(v).replace(/\n/g, '<br>')}</td></tr>`,
    )
    .join('');
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px">
  <h2 style="margin:0 0 4px;color:#15181c">New property quote request</h2>
  <p style="margin:0 0 16px;color:#555">From ${escapeHtml(fields.name)}${fields.company ? ` · ${escapeHtml(fields.company)}` : ''}. Reply to this email to respond.</p>
  <table style="border-collapse:collapse;width:100%;font-size:14px">${rows}</table>
  <p style="margin:16px 0 0;color:#777;font-size:12px">${attachments.length} photo${attachments.length === 1 ? '' : 's'} attached.</p>
</div>`;
  const text = Object.entries(fields)
    .map(([k, v]) => `${LABELS[k]}: ${v}`)
    .join('\n');

  const res = await fetch(env('RESEND_API_URL') ?? 'https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: to.split(',').map((s) => s.trim()).filter(Boolean),
      reply_to: fields.email,
      subject: `Quote request: ${fields.name}${fields.company ? ` (${fields.company})` : ''} — ${fields.propertyType}`,
      html,
      text,
      attachments,
    }),
  });

  if (!res.ok) {
    console.error('[quote] Resend error', res.status, await res.text().catch(() => ''));
    return json(502, { error: 'send_failed' });
  }
  return json(200, { ok: true });
};
