import type { APIRoute } from 'astro';

type WeatherAlert = {
  title: string;
  description: string;
  type: 'info' | 'warning' | 'severe';
  publishedAt?: string;
};

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

function fallbackAlerts(): WeatherAlert[] {
  return [
    {
      title: 'Weather alerts temporarily unavailable',
      description:
        'Live weather alerts could not be loaded from the upstream weather source. Check again later for updated conditions.',
      type: 'info',
      publishedAt: new Date().toISOString(),
    },
  ];
}

export const GET: APIRoute = async () => {
  try {
    const response = await fetch('https://www.metmalawi.gov.mw/api/cap/rss.xml');

    if (!response.ok) {
      throw new Error(`Weather alerts upstream returned ${response.status}`);
    }

    const xml = await response.text();
    const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 10);

    const alerts = itemMatches
      .map((match) => {
        const item = match[1];
        const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
        const descriptionMatch = item.match(/<description>([\s\S]*?)<\/description>/);
        const pubDateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);

        const title = stripXml(titleMatch?.[1] || 'Weather alert');
        const description = stripXml(descriptionMatch?.[1] || title);

        return {
          title,
          description,
          type: classifyAlert(`${title} ${description}`),
          publishedAt: pubDateMatch?.[1] ? new Date(pubDateMatch[1]).toISOString() : undefined,
        } satisfies WeatherAlert;
      })
      .filter((alert) => alert.title && alert.description);

    return new Response(JSON.stringify(alerts.length > 0 ? alerts : fallbackAlerts()), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=900',
      },
    });
  } catch (error) {
    console.error('Error fetching weather alerts:', error);

    return new Response(JSON.stringify(fallbackAlerts()), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  }
};
