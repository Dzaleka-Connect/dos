import type { APIRoute } from 'astro';
import { slugField, referrerHost } from '../../lib/insights/contract';
import { eventMetadata, sendInsights, shouldTrack } from '../../lib/insights/transport';
export const prerender = false;
export const GET: APIRoute = async ({ request, params, clientAddress }) => {
  const headers = { 'Cache-Control': 'no-store', 'Netlify-CDN-Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' };
  if (!slugField.safeParse(params.slug).success) return new Response('Link not found.', { status: 404, headers });
  try {
    const track = request.method !== 'HEAD' && shouldTrack(request) && process.env.DOS_SUBMISSION_SECRET;
    const event = track ? { ...eventMetadata(request, clientAddress, process.env.DOS_SUBMISSION_SECRET!), name: 'link_click', path: `/go/${params.slug}`, target: '', referrer: referrerHost(request.headers.get('referer') || ''), source: '', medium: '', campaign: '', link_id: '' } : undefined;
    const result = await sendInsights({ operation: 'resolve', slug: params.slug, event });
    if (result.status === 302) return new Response(null, { status: 302, headers: { ...headers, Location: result.destination } });
    return new Response(result.status === 410 ? 'This link is no longer available. Visit https://services.dzaleka.com for current information.' : 'Link not found.', { status: result.status, headers });
  } catch { return new Response('This link is temporarily unavailable. Please try again.', { status: 503, headers: { ...headers, 'Retry-After': '30' } }); }
};
export const HEAD = GET;
