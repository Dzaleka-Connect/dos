import { createHmac, randomUUID } from 'node:crypto';
import { signSubmission } from '../submissions/contract';
import { botAgent, canonicalPath, browserFor, deviceFor, pluginPath, referrerHost, type BrowserEvent } from './contract';
import type { EventRow } from './store';

export function eventMetadata(request: Request, address: string, secret: string, now = new Date()) {
  const agent = request.headers.get('user-agent') || '';
  const at = now.toISOString(), day = new Date(now.getTime() + 7200000).toISOString().slice(0, 10);
  return { id: randomUUID(), at, day, visitor: createHmac('sha256', secret).update(`insights:${day}:${address}:${agent}`).digest('hex'), device: deviceFor(agent), browser: browserFor(agent) };
}
export function shouldTrack(request: Request) { return !request.headers.get('cookie')?.split(';').some(cookie => cookie.trim() === 'dos_statistics_optout=1') && request.headers.get('dnt') !== '1' && request.headers.get('sec-gpc') !== '1' && !botAgent(request.headers.get('user-agent') || '') && !request.headers.get('purpose')?.includes('prefetch') && !request.headers.get('sec-purpose')?.includes('prefetch'); }
export function browserEvent(request: Request, address: string, secret: string, input: BrowserEvent): EventRow {
  return { ...eventMetadata(request, address, secret), ...input, path: canonicalPath(input.path), referrer: referrerHost(input.referrer), link_id: '', target: /^[a-z0-9.-]{1,253}$/i.test(input.target) ? input.target : '' };
}
export async function sendInsights(input: unknown, secret = process.env.DOS_SUBMISSION_SECRET, send: typeof fetch = fetch) {
  if (!secret || secret.length < 32) throw new Error('Statistics connection is not configured.');
  const body = JSON.stringify({ domain: 'dos-insights-v1', input }), timestamp = String(Date.now());
  const response = await send(`https://cms.dzaleka.com${pluginPath}receive`, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(8000), body,
    headers: { 'Content-Type': 'text/plain', Origin: 'https://cms.dzaleka.com', 'x-dos-timestamp': timestamp, 'x-dos-signature': signSubmission(body, secret, timestamp) } });
  if (!response.ok) throw new Error('Statistics service unavailable.');
  const result = await response.json();
  if (!result.success || !result.data?.ok) throw new Error('Statistics request failed.');
  return result.data;
}
export async function boundedText(request: Request, max = 4096) {
  const reader = request.body?.getReader(); if (!reader) throw new Error('Empty request');
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) { const chunk = await reader.read(); if (chunk.done) break; size += chunk.value.byteLength; if (size > max) { await reader.cancel(); throw new Error('Request too large'); } chunks.push(chunk.value); }
  return Buffer.concat(chunks).toString();
}
