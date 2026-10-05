import { applySiteSettings, redirectResponse } from '../../src/lib/news/site-response.mjs';

export default async function cmsSite(request, context) {
  if (context.site?.id && context.site.id !== 'f3ccff67-a393-4e11-b887-9a29d67477b1') return context.next();
  const url = new URL(request.url);
  if (!['GET', 'HEAD'].includes(request.method) || /^\/(?:_|api\/|go\/|admin\/)/.test(url.pathname) ||
      (/\.[a-z0-9]{1,10}$/i.test(url.pathname) && url.pathname !== '/robots.txt')) return context.next();
  let data;
  try {
    const response = await fetch(`https://cms.dzaleka.com/_dos/public/site.json?path=${encodeURIComponent(url.pathname)}`, {
      redirect: 'error', signal: AbortSignal.timeout(8000), headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error('CMS settings unavailable');
    data = await response.json();
    if (data.version !== 1 || !data.settings) throw new Error('Invalid settings');
  } catch {
    // Existing public pages remain available during a CMS settings outage.
    return context.next();
  }
  const redirect = redirectResponse(data.redirect, url);
  if (redirect) return redirect;
  if (url.pathname === '/robots.txt' && data.settings.robotsTxt) {
    return new Response(data.settings.robotsTxt, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=60' } });
  }
  const response = await context.next();
  if (request.method === 'HEAD' || !response.headers.get('content-type')?.includes('text/html')) return response;
  const headers = new Headers(response.headers);
  headers.delete('content-length'); headers.delete('content-encoding'); headers.delete('etag');
  return new Response(applySiteSettings(await response.text(), data.settings), { status: response.status, statusText: response.statusText, headers });
}
