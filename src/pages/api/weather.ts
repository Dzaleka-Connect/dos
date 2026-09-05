import type { APIRoute } from 'astro';
import { getSeasonalFallbackWeather } from '../../data/weather';

export const prerender = false;

function cleanCell(cell: string) {
  return cell
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/°C/g, '')
    .replace(/km\/h/g, '')
    .replace(/mm/g, '')
    .replace(/°/g, '')
    .trim();
}

function getWeatherCondition(cell: string) {
  const altMatch = cell.match(/<img[^>]*alt="([^"]*)"[^>]*>/i);
  if (altMatch?.[1]) return altMatch[1].trim();

  const titleMatch = cell.match(/title="([^"]*)"/i);
  if (titleMatch?.[1]) return titleMatch[1].trim();

  const srcMatch = cell.match(/<img[^>]*src="([^"]*)"[^>]*>/i);
  if (srcMatch?.[1]) {
    const src = srcMatch[1].toLowerCase();
    if (src.includes('rain')) return 'Rain';
    if (src.includes('storm') || src.includes('thunder')) return 'Thunderstorm';
    if (src.includes('cloud')) return 'Cloudy';
    if (src.includes('clear') || src.includes('sun')) return 'Clear';
  }

  const text = cleanCell(cell);
  return text || 'Unknown';
}

export const GET: APIRoute = async () => {
  try {
    const response = await fetch('https://www.metmalawi.gov.mw/weather/daily-table/dowa/', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Weather upstream returned ${response.status}`);
    }

    const html = await response.text();

    const location = html.match(/<h2[^>]*>([^<]+)<\/h2>/i)?.[1]?.trim() || 'Dowa District';
    const date = html.match(/<h5[^>]*>([^<]+)<\/h5>/i)?.[1]?.trim() || new Date().toLocaleDateString();
    const tableMarkup = html.match(/<table[^>]*>([\s\S]*?)<\/table>/i)?.[1];

    if (!tableMarkup) {
      throw new Error('Weather table not found');
    }

    const rows = tableMarkup.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
    const dataRows = rows.slice(1);

    if (dataRows.length === 0) {
      throw new Error('Weather rows not found');
    }

    const parseRow = (row: string) => {
      const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];

      return {
        time: cleanCell(cells[0] || ''),
        condition: getWeatherCondition(cells[1] || ''),
        maxTemp: cleanCell(cells[2] || ''),
        minTemperature: cleanCell(cells[3] || ''),
        rainfall: cleanCell(cells[4] || ''),
        windSpeed: cleanCell(cells[5] || ''),
        windDirection: cleanCell(cells[6] || ''),
      };
    };

    const current = parseRow(dataRows[0]);
    const hourly = dataRows.slice(0, 6).map(parseRow);

    const payload = {
      location,
      date,
      forecast: {
        current: {
          temperature: current.maxTemp || current.minTemperature || '',
          minTemperature: current.minTemperature || '',
          maxTemp: current.maxTemp || '',
          condition: current.condition || 'Unknown',
          time: current.time || '',
          rainfall: current.rainfall || '',
          windSpeed: current.windSpeed || '',
          windDirection: current.windDirection || '',
        },
        hourly,
      },
      lastUpdated: new Date().toISOString(),
      stale: false,
      source: 'met-malawi-live' as const,
      sourceLabel: 'MET Malawi live feed',
      sourceNote: 'Live district forecast pulled from the Malawi Meteorological Department public weather table.',
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=900',
      },
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);

    return new Response(JSON.stringify(getSeasonalFallbackWeather()), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  }
};
