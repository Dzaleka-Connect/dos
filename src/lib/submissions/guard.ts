import { submissionTarget } from './targets';
import { verifyProof } from './proof';
import { signSubmission, validSignature } from './contract';
import { correctionError, spamError } from './spam';
export const guardFailure = (error: string, status = 403) => Response.json({ error }, { status, headers: { 'Cache-Control': 'no-store', ...(status === 429 ? { 'Retry-After': '3600' } : {}) } });
export async function checkSubmission(request: Request, ip: string, secret = process.env.DOS_SUBMISSION_SECRET, send: typeof fetch = fetch): Promise<Response | null> {
  const url = new URL(request.url), target = submissionTarget(url);
  if (!target) return guardFailure('Unknown submission form.', 400);
  if (!secret || secret.length < 32) return guardFailure('Submissions are temporarily unavailable. Please try again.', 503);
  if (request.headers.get('origin') !== url.origin || request.headers.get('sec-fetch-site') === 'cross-site') return guardFailure('Please submit from this website.');
  try {
    const reader = request.body?.getReader();
    if (!reader) return guardFailure('The form is empty.', 400);
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) {
      const chunk = await reader.read(); if (chunk.done) break;
      size += chunk.value.length;
      if (size > 4 * 1024 * 1024) { void reader.cancel(); return guardFailure('Your submission is too large. Attachments must total less than 4 MB.', 413); }
      chunks.push(chunk.value);
    }
    const body = Buffer.concat(chunks);
    // Only the existing CMS release-test route can suppress delivery safely.
    if (url.pathname === '/api/submissions' && validSignature(body.toString(), secret, request.headers.get('x-dos-timestamp'), request.headers.get('x-dos-test-signature'))) return null;
    let fields: Record<string, unknown>;
    if (request.headers.get('content-type')?.includes('application/json')) fields = JSON.parse(body.toString());
    else fields = Object.fromEntries(await new Request(request.url, { method: 'POST', headers: request.headers, body }).formData());
    if (!fields || Array.isArray(fields) || typeof fields !== 'object' || Object.keys(fields).length > 100) return guardFailure('Invalid form details.', 400);
    const error = spamError(fields) || (target === '/api/submissions?form=service-correction' ? correctionError(fields) : null);
    if (error) return guardFailure(error, 422);
    const token = request.headers.get('x-dos-proof') || String(fields._dos_proof || '');
    const work = request.headers.get('x-dos-work') || String(fields._dos_work || '');
    const claim = verifyProof(token, work, target, ip, secret);
    if (!claim) return guardFailure('Verification expired or failed. Please try submitting again.');
    const payload = JSON.stringify(claim), timestamp = String(Date.now());
    const response = await send('https://cms.dzaleka.com/_emdash/api/plugins/dos-submissions/guard', { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(15000), body: payload, headers: { Origin: 'https://cms.dzaleka.com', 'Content-Type': 'text/plain', 'x-dos-timestamp': timestamp, 'x-dos-signature': signSubmission(payload, secret, timestamp) } });
    if (!response.ok) return guardFailure('Verification is temporarily unavailable. Your form has not been sent.', 503);
    const result = (await response.json())?.data;
    if (result?.accepted === true) return null;
    return result?.reason === 'rate' ? guardFailure('Too many submissions. Please wait an hour and try again.', 429) : guardFailure('This verification has already been used. Please try again.');
  } catch { return guardFailure('Your submission could not be verified. Please try again.', 503); }
}
