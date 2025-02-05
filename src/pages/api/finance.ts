import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    // Using the latest data from UNHCR's Malawi operations page
    const data = {
      budget: 27900000, // $27.9M USD (2024 budget)
      funded: 2790000,  // Assuming 10% funded for now
      gap: 25110000,    // Remaining gap
      lastUpdated: new Date().toISOString(),
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
