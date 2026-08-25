import type { APIRoute } from 'astro';
import { apiHeaders, checkRateLimit } from '../../utils/api-utils';
import { deprecationPolicyDocument } from '../../utils/api-deprecation';
import { SITE_URL, API_DOCS_URL } from '../../data/agentDiscovery';

// Server-rendered so the response carries the standard API headers and the
// document's checkedAt timestamp is current.
export const prerender = false;

/**
 * /api/deprecation-policy - machine-readable versioning and deprecation policy.
 *
 * Agents can read this to learn how removals are signalled before integrating,
 * and to see whether anything they depend on is scheduled for retirement.
 */
function buildHeaders(request: Request) {
  return apiHeaders(request, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
    Link: `<${API_DOCS_URL}#versioning>; rel="service-doc"; type="text/html"`,
  });
}

export const GET: APIRoute = async ({ request }) => {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  return new Response(JSON.stringify(deprecationPolicyDocument(SITE_URL), null, 2), {
    status: 200,
    headers: buildHeaders(request),
  });
};

export const HEAD: APIRoute = async ({ request }) =>
  new Response(null, { status: 200, headers: buildHeaders(request) });

export const OPTIONS: APIRoute = async ({ request }) =>
  new Response(null, {
    status: 204,
    headers: apiHeaders(request, { Allow: 'GET, HEAD, OPTIONS' }),
  });
