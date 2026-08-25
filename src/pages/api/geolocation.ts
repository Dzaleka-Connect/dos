import type { APIRoute } from 'astro';
import { apiHeaders } from '../../utils/api-utils';

// Server-rendered: this endpoint is request-dependent.
export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'DzalekaOnlineServices/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`IP geolocation upstream returned ${response.status}`);
    }

    const ipData = await response.json();

    return new Response(
      JSON.stringify({
        country: ipData.country_name || null,
        region: ipData.region || null,
        city: ipData.city || null,
        source: 'ip'
      }),
      {
        status: 200,
        headers: apiHeaders(request, { 'Cache-Control': 'public, max-age=3600' })
      }
    );
  } catch (error) {
    console.warn('Geolocation proxy failed:', error);

    return new Response(
      JSON.stringify({
        country: null,
        region: null,
        city: null,
        source: 'unavailable'
      }),
      {
        status: 200,
        headers: apiHeaders(request, { 'Cache-Control': 'no-store' })
      }
    );
  }
};
