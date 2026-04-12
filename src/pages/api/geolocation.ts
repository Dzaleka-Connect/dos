import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
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
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        }
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
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    );
  }
};
