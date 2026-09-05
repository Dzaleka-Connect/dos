import type { APIRoute } from 'astro';
import { getSeasonalFallbackAlerts, type WeatherAlert } from '../../data/weather';

export const prerender = false;

function stripXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function classifyAlert(text: string): WeatherAlert['type'] {
  const lower = text.toLowerCase();

  if (
    lower.includes('storm') ||
    lower.includes('flood') ||
    lower.includes('cyclone') ||
    lower.includes('severe')
  ) {
    return 'severe';
  }

  if (
    lower.includes('warning') ||
    lower.includes('rain') ||
    lower.includes('wind') ||
    lower.includes('thunder')
  ) {
    return 'warning';
  }

  return 'info';
}

export const GET: APIRoute = async () => {
  try {
    const response = await fetch('https://www.metmalawi.gov.mw/api/cap/rss.xml', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Weather alerts upstream returned ${response.status}`);
    }

    const xml = await response.text();
    const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 10);

    const alerts = itemMatches
      .map((match) => {
        const item = match[1];
        const title = stripXml(item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || 'Weather alert');
        const description = stripXml(item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || title);
        const publishedAtRaw = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1];

        return {
          title,
          description,
          type: classifyAlert(`${title} ${description}`),
          publishedAt: publishedAtRaw ? new Date(publishedAtRaw).toISOString() : undefined,
        } satisfies WeatherAlert;
      })
      .filter((alert) => alert.title && alert.description);

    return new Response(JSON.stringify(alerts.length > 0 ? alerts : getSeasonalFallbackAlerts()), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=900',
      },
    });
  } catch (error) {
    console.error('Error fetching weather alerts:', error);

    return new Response(JSON.stringify(getSeasonalFallbackAlerts()), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  }
};
