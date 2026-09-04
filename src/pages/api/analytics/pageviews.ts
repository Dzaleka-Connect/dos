import type { APIRoute } from 'astro';
import { apiHeaders } from '../../../utils/api-utils';
import { problemResponse } from '../../../utils/api-errors';

// Server-rendered so the shared header machinery runs. Prerendering emits a
// static blob, which is why this route carried no Deprecation or Sunset header
// even after being listed in DEPRECATIONS.
export const prerender = false;

/**
 * DEPRECATED. Scheduled for removal on 1 March 2027.
 *
 * This route has always returned a hardcoded zero; it never reported real
 * pageviews. Those come from the analytics the site loads in its layout. It is
 * registered in src/utils/api-deprecation.ts, so every response carries the
 * Deprecation, Sunset and Link headers, and the OpenAPI document flags it.
 *
 * Delete this file once the sunset date has passed, and drop its entry from
 * DEPRECATIONS, openApiOperations, api-docs.astro and api-reference.md.
 */
export const GET: APIRoute = async ({ request }) => {
  try {
    return new Response(JSON.stringify({ totalViews: 0 }), {
      status: 200,
      headers: apiHeaders(request),
    });
  } catch (error) {
    return problemResponse(
      'internal_error',
      `Failed to get page views: ${error instanceof Error ? error.message : String(error)}`,
      apiHeaders(request),
      new URL(request.url).pathname
    );
  }
};
