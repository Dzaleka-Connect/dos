import type { APIRoute } from 'astro';
import { browserEventSchema, excludedPath } from '../../../lib/insights/contract';
import { boundedText, browserEvent, sendInsights, shouldTrack } from '../../../lib/insights/transport';
export const prerender = false;
export const POST: APIRoute = async ({ request, clientAddress }) => {
  const headers = { 'Cache-Control': 'no-store' };
  if (request.headers.get('origin') !== new URL(request.url).origin) return new Response(null, { status: 403, headers });
  if (!shouldTrack(request)) return new Response(null, { status: 204, headers });
  let input;
  try { input = browserEventSchema.parse(JSON.parse(await boundedText(request))); } catch { return new Response(null, { status: 400, headers }); }
  if (excludedPath(input.path)) return new Response(null, { status: 204, headers });
  if (!process.env.DOS_SUBMISSION_SECRET) return new Response(null, { status: 503, headers });
  try { await sendInsights({ operation: 'event', event: browserEvent(request, clientAddress, process.env.DOS_SUBMISSION_SECRET, input) }); return new Response(null, { status: 204, headers }); }
  catch { return new Response(null, { status: 503, headers }); }
};
