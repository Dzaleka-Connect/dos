import type { APIRoute } from 'astro';
import { randomBytes } from 'node:crypto';
import { makeChallenge } from '../../lib/submissions/proof';
import { submissionTarget } from '../../lib/submissions/targets';
export const prerender = false;
export const GET: APIRoute = ({ request, clientAddress, cookies }) => {
  const headers = { 'Cache-Control': 'private, no-store', 'Vary': 'Cookie' };
  const secret = process.env.DOS_SUBMISSION_SECRET;
  if (!secret || secret.length < 32) return Response.json({ error: 'Submissions are temporarily unavailable.' }, { status: 503, headers });
  const url = new URL(request.url);
  const targetUrl = new URL(url.searchParams.get('target') || '/', url.origin);
  const target = targetUrl.origin === url.origin ? submissionTarget(targetUrl) : null;
  if (!target || request.headers.get('sec-fetch-site') === 'cross-site') return Response.json({ error: 'Invalid form.' }, { status: 400, headers });
  let client = cookies.get('dos_form_client')?.value;
  if (!client || !/^[a-f0-9]{32}$/.test(client)) {
    client = randomBytes(16).toString('hex');
    cookies.set('dos_form_client', client, { httpOnly: true, secure: url.protocol === 'https:', sameSite: 'strict', path: '/', maxAge: 86400 });
  }
  return Response.json(makeChallenge(target, clientAddress, client, secret), { headers });
};
