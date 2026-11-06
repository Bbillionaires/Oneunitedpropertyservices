/**
 * Quote request data model + delivery.
 *
 * The form UI only calls `submitQuote()`, which posts multipart/form-data to
 * /api/quote (src/pages/api/quote.ts). That function emails the request to the
 * business through Resend. To deliver somewhere else (a CRM, a webhook), point
 * PUBLIC_QUOTE_ENDPOINT at that endpoint or change the API route; the frontend
 * stays the same.
 */

export interface QuoteRequest {
  propertyType: string;
  services: string[];
  servicesOther?: string;
  units?: number;
  buildings?: number;
  squareFeet?: number;
  propertyCount?: number;
  address: string;
  frequency: string;
  program?: string;
  notes?: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  preferredContact: string;
  /** Where the request originated, e.g. "/quote/". */
  source: string;
  submittedAt: string;
}

export type SubmitResult = { status: 'sent' };

export class QuoteSubmitError extends Error {}

const ENDPOINT: string = import.meta.env.PUBLIC_QUOTE_ENDPOINT || '/api/quote';

/** Stay under the ~4.5 MB serverless request limit. */
const PHOTO_BUDGET = 3.8 * 1024 * 1024;
const MAX_EDGE = 1600;

/** Re-encode a photo as a ≤1600px JPEG. Returns null if the browser can't decode it (e.g. HEIC in Chrome). */
async function shrinkPhoto(file: File): Promise<Blob | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    return await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.8));
  } catch {
    return null;
  }
}

export async function submitQuote(payload: QuoteRequest, photos: File[]): Promise<SubmitResult> {
  const body = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === '') continue;
    if (Array.isArray(value)) value.forEach((v) => body.append(key, v));
    else body.append(key, String(value));
  }

  let used = 0;
  let skipped = 0;
  for (const [i, file] of photos.entries()) {
    const shrunk = (await shrinkPhoto(file)) ?? (file.size < 1.5 * 1024 * 1024 ? file : null);
    if (!shrunk || used + shrunk.size > PHOTO_BUDGET) {
      skipped++;
      continue;
    }
    used += shrunk.size;
    body.append('photos', shrunk, `photo-${i + 1}.jpg`);
  }
  if (skipped) body.append('notes', `(${skipped} photo${skipped > 1 ? 's' : ''} could not be attached from the website form.)`);

  let res: Response;
  try {
    res = await fetch(ENDPOINT, { method: 'POST', body, headers: { Accept: 'application/json' } });
  } catch {
    throw new QuoteSubmitError('We couldn’t reach the server. Check your connection and try again.');
  }
  if (!res.ok) {
    throw new QuoteSubmitError(
      res.status === 503
        ? 'Our online form is temporarily unavailable. Please try again a little later.'
        : 'Something went wrong sending your request. Please try again.',
    );
  }
  return { status: 'sent' };
}
