import type { HandlerEvent } from '@netlify/functions';
import { checkSubmission, guardFailure } from './guard';
export async function checkNetlifySubmission(event: HandlerEvent) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(event.headers)) if (value) headers.set(key, value);
  const ip = headers.get('x-nf-client-connection-ip');
  const rejection = !ip ? guardFailure('Verification is temporarily unavailable.', 503) : await checkSubmission(new Request(event.rawUrl, {
    method: 'POST', headers, body: Buffer.from(event.body || '', event.isBase64Encoded ? 'base64' : 'utf8'),
  }), ip);
  return rejection ? { statusCode: rejection.status, headers: Object.fromEntries(rejection.headers), body: await rejection.text() } : null;
}
