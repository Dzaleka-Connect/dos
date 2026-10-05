import { eventMetadata, shouldTrack } from '../insights/transport';
import { createHmac } from 'node:crypto';
import { fieldsSchema, signSubmission, validSignature, value, type Submission } from './contract';

export const forms: Record<string, string> = {
  'service-registration': '/services/register',
  'service-correction': '/services/update-request',
  'event-submission': '/events/organize',
  'job-submission': '/jobs/post',
};
const maxBytes = 65536;
export async function relaySubmission(request: Request, clientAddress: string, secret: string | undefined, send: typeof fetch = fetch) {
  const fail = (message: string, status: number) => Response.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
  const url = new URL(request.url);
  const form = url.searchParams.get('form') || '';
  if (!Object.hasOwn(forms, form)) return fail('Unknown form.', 400);
  if (!secret || secret.length < 32) return fail('Submissions are temporarily unavailable. Please try again.', 503);
  const origin = request.headers.get('origin');
  if (origin && origin !== url.origin) return fail('Please submit from this website.', 403);
  if (Number(request.headers.get('content-length')) > maxBytes) return fail('Your submission is too large.', 413);
  let fields: Submission['fields'];
  let test = false;
  try {
    const reader = request.body?.getReader();
    if (!reader) return fail('The form is empty.', 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > maxBytes) { await reader.cancel(); return fail('Your submission is too large.', 413); }
      chunks.push(chunk.value);
    }
    const body = Buffer.concat(chunks);
    // Release verification uses the server credential to exercise the whole
    // public route without sending synthetic notifications to reviewers.
    const verification = request.headers.get('x-dos-test-signature');
    if (verification) {
      if (!validSignature(body.toString(), secret, request.headers.get('x-dos-timestamp'), verification)) return fail('Invalid verification signature.', 403);
      test = true;
    }
    if (request.headers.get('content-type')?.includes('application/json')) fields = fieldsSchema.parse(JSON.parse(body.toString()));
    else {
      const data = await new Request(request.url, { method: 'POST', headers: request.headers, body }).formData();
      const entries: Record<string, string | string[]> = {};
      for (const key of new Set(data.keys())) {
        const values = data.getAll(key);
        if (values.some(item => typeof item !== 'string' && item.size)) return fail('Upload the attachment before submitting.', 400);
        const strings = values.filter((item): item is string => typeof item === 'string');
        if (strings.length) entries[key] = strings.length === 1 ? strings[0] : strings;
      }
      fields = fieldsSchema.parse(entries);
    }
    if (value(fields, '_gotcha')) return Response.json({ ok: true });
    const required = form === 'service-registration' ? ['orgName', 'orgType', 'orgDescription', 'serviceDescription', 'serviceCategory', 'email', 'phone', 'availability']
      : form === 'service-correction' ? ['name', 'email', 'title']
      : form === 'event-submission' ? ['title', 'description', 'date', 'location', 'category', 'organizerName', 'organizerEmail']
      : ['title', 'description', 'organization', 'location', 'type', 'category', 'deadline', 'email'];
    if (required.some(key => !value(fields, key))) return fail('Complete the required fields.', 400);
    const email = value(fields, form === 'event-submission' ? 'organizerEmail' : 'email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Enter a valid email address.', 400);
    for (const key of ['website', 'facebook', 'twitter', 'instagram', 'linkedin', 'logoUrl', 'imageUrl', 'listingUrl', 'registrationUrl']) {
      const link = value(fields, key);
      if (link && !['http:', 'https:'].includes(new URL(link).protocol)) return fail('Use an http or https website link.', 400);
    }
    for (const key of ['date', 'endDate', 'deadline', 'registrationDeadline']) {
      if (value(fields, key) && !Number.isFinite(Date.parse(value(fields, key)))) return fail('Enter a valid date.', 400);
    }
    // Formspree routing fields are controlled here, never by submitted input.
    for (const key of Object.keys(fields)) if (key.startsWith('_')) delete fields[key];
  } catch { return fail('Check your form details and try again.', 400); }
  const input: Submission = { form, fields, sourcePath: forms[form], test,
    clientHash: createHmac('sha256', secret).update(clientAddress).digest('hex') };
  if (shouldTrack(request) && !request.headers.get('cookie')?.includes('dos_statistics_optout=1')) {
    const meta = eventMetadata(request, clientAddress, secret);
    const campaign = (key: string) => {
      try { const value = new URL(request.headers.get('referer') || '').searchParams.get(`utm_${key}`) || ''; return /^[a-zA-Z0-9 _.-]{0,80}$/.test(value) ? value : ''; } catch { return ''; }
    };
    input.analytics = { visitor: meta.visitor, device: meta.device, browser: meta.browser, source: campaign('source'), medium: campaign('medium'), campaign: campaign('campaign') };
  }
  const body = JSON.stringify(input);
  const timestamp = String(Date.now());
  try {
    const response = await send('https://cms.dzaleka.com/_emdash/api/plugins/dos-submissions/receive', {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(25000), body,
      headers: { Origin: 'https://cms.dzaleka.com', 'Content-Type': 'text/plain', 'x-dos-timestamp': timestamp, 'x-dos-signature': signSubmission(body, secret, timestamp) },
    });
    const result = await response.json();
    if (!response.ok || result?.data?.accepted !== true) return fail('Your submission could not be saved. Please try again.', 503);
    if (!request.headers.get('accept')?.includes('application/json')) return new Response(null, { status: 303, headers: { Location: '/submissions/received', 'Cache-Control': 'no-store' } });
    return Response.json({ ok: true, id: result.data.id }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return fail('Your submission could not be confirmed. Retrying will not create a duplicate.', 503); }
}
