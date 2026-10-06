/**
 * Quote request data model + delivery adapter.
 *
 * The form UI only ever calls `submitQuote()`. To connect a CRM, email
 * service, database, or API, change the implementation here (or point
 * PUBLIC_QUOTE_ENDPOINT at an endpoint that accepts multipart/form-data) —
 * the frontend does not need to be redesigned.
 *
 * Until an endpoint is configured, `submitQuote()` returns `{ status: 'preview' }`
 * and the UI states plainly that the request was NOT sent.
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

export type SubmitResult = { status: 'sent' } | { status: 'preview'; payload: QuoteRequest; photoCount: number };

export class QuoteSubmitError extends Error {}

const ENDPOINT: string | undefined = import.meta.env.PUBLIC_QUOTE_ENDPOINT || undefined;

export const isQuoteDeliveryConfigured = () => Boolean(ENDPOINT);

export async function submitQuote(payload: QuoteRequest, photos: File[]): Promise<SubmitResult> {
  if (!ENDPOINT) {
    // No backend yet — do not pretend the request was delivered.
    if (import.meta.env.DEV) console.info('[quote] Preview mode — payload not sent:', payload, photos);
    return { status: 'preview', payload, photoCount: photos.length };
  }

  const body = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === '') continue;
    if (Array.isArray(value)) value.forEach((v) => body.append(key, v));
    else body.append(key, String(value));
  }
  photos.forEach((file) => body.append('photos', file, file.name));

  let res: Response;
  try {
    res = await fetch(ENDPOINT, { method: 'POST', body, headers: { Accept: 'application/json' } });
  } catch {
    throw new QuoteSubmitError('We couldn’t reach the server. Check your connection and try again.');
  }
  if (!res.ok) throw new QuoteSubmitError('Something went wrong sending your request. Please try again.');
  return { status: 'sent' };
}
