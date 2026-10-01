// Responses that depend on who is asking must never be shared from the CDN.
const visitorSpecific = ['/api/geolocation', '/api/status', '/api/analytics/'];

/**
 * Pages rendered on request read live CMS content. Netlify's CDN reuses each
 * response for 60 seconds and refreshes it in the background, so a busy page
 * runs one function a minute instead of one per visit (and makes far fewer CMS
 * calls). Published changes appear within about a minute. Previews, errors,
 * Markdown for agents and visitor-specific answers are never cached.
 */
export function withCdnCaching(request: Request, pathname: string, response: Response, markdown = false) {
  const headers = new Headers(response.headers);
  const ownPolicy = headers.get('Cache-Control') ?? '';
  const cacheable = ['GET', 'HEAD'].includes(request.method) && [200, 404].includes(response.status) &&
    !/private|no-store/.test(ownPolicy) && !markdown &&
    !visitorSpecific.some((path) => pathname === path || pathname.startsWith(path));
  if (cacheable) {
    headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
    headers.set('Netlify-CDN-Cache-Control', 'public, durable, s-maxage=60, stale-while-revalidate=300');
    headers.set('Netlify-Vary', 'header=Accept');
  } else {
    if (!/private/.test(ownPolicy)) headers.set('Cache-Control', 'no-store');
    headers.set('Netlify-CDN-Cache-Control', 'no-store');
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
