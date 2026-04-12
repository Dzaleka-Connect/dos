import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
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
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Error with UNHCR data:', error);
    return new Response(JSON.stringify({ error: 'Failed to get UNHCR data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
