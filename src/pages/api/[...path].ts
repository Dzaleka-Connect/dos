import type { APIRoute } from 'astro';
import { problemResponse } from '../../utils/api-errors';
import { apiHeaders } from '../../utils/api-utils';
import { API_CATALOG_PATH, OPENAPI_PATH } from '../../data/agentDiscovery';

export const prerender = false;

/**
 * Catch-all for unknown /api/* paths.
 *
 * Without this, an unrecognised API path falls through to the HTML 404 page,
 * which an agent cannot parse. Astro gives concrete routes priority over this
 * rest parameter, so only genuinely unmatched paths reach it.
 */
const notFound: APIRoute = ({ request, params }) => {
  const path = params.path ? `/api/${params.path}` : '/api';
  return problemResponse(
    'collection_not_found',
    `No API endpoint at ${path}.`,
    apiHeaders(request, {
      Link: `<${OPENAPI_PATH}>; rel="service-desc", <${API_CATALOG_PATH}>; rel="api-catalog"`,
    }),
    path
  );
};

export const GET = notFound;
export const POST = notFound;
export const PUT = notFound;
export const PATCH = notFound;
export const DELETE = notFound;

export const OPTIONS: APIRoute = ({ request }) =>
  new Response(null, {
    status: 204,
    headers: apiHeaders(request, { Allow: 'GET, POST, OPTIONS' }),
  });
