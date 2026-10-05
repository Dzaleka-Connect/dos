import type { APIRoute } from 'astro';
import { boundedText } from '../../../lib/insights/transport';
export const prerender = false;
export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin');
  if (origin !== new URL(request.url).origin) return new Response('Forbidden', { status: 403 });
  const params = new URLSearchParams(await boundedText(request, 128)), exclude = params.get('exclude') === '1';
  return new Response(exclude ? 'Your visits from this browser are now excluded from EmDash statistics. You can close this tab.' : 'Your visits from this browser are included again, unless your browser sends Do Not Track or Global Privacy Control. You can close this tab.', { headers: {
    'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex',
    'Set-Cookie': `dos_statistics_optout=${exclude ? '1' : ''}; Path=/; Max-Age=${exclude ? 31536000 : 0}; Secure; HttpOnly; SameSite=Lax`,
  } });
};

export const GET: APIRoute = ({ url }) => {
  const exclude = url.searchParams.get('exclude') === '1';
  return new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Statistics preference</title><main style="font:18px system-ui;max-width:36rem;margin:4rem auto;padding:1rem"><h1>${exclude ? 'Exclude' : 'Include'} this browser</h1><p>This changes only your browser’s participation in the private EmDash statistics. Do Not Track and Global Privacy Control still take priority.</p><form method="post"><input type="hidden" name="exclude" value="${exclude ? '1' : '0'}"><button style="font:inherit;padding:.6rem 1rem" type="submit">Confirm preference</button></form></main></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
};
