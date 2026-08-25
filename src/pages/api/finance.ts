import type { APIRoute } from 'astro';
import { apiHeaders } from '../../utils/api-utils';
import { problemResponse } from '../../utils/api-errors';

// Server-rendered: prerendering emits an extension-less static file, which is
// served as application/octet-stream and carries none of the API headers.
export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    // UNHCR Malawi 2025 funding snapshot — as of 31 July 2025.
    // Source: UNHCR Global Focus, reporting.unhcr.org
    const data = {
      budget: 26300000,
      funded: 4679887,
      gap: 21620113,
      lastUpdated: '2025-07-31T00:00:00Z',
      source: 'https://reporting.unhcr.org/operational/operations/malawi'
    };

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: apiHeaders(request, { 'Cache-Control': 'public, max-age=3600' })
    });
  } catch (error) {
    console.error('Error with UNHCR data:', error);
    return problemResponse(
      'internal_error',
      `Failed to get UNHCR funding data: ${error instanceof Error ? error.message : String(error)}`,
      apiHeaders(request),
      new URL(request.url).pathname
    );
  }
};
