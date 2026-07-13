import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { checkRateLimit, createOptionsHandler } from '../../../utils/api-utils';
import { jsonResponse } from '../../../utils/encyclopedia-api';

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  const q = url.searchParams.get('q')?.trim().toLowerCase() || '';
  if (q.length < 2) return jsonResponse({ status: 'error', message: 'Query must contain at least 2 characters' }, 400);
  const requestedLimit = Number.parseInt(url.searchParams.get('limit') || '8', 10);
  const limit = Math.min(20, Number.isFinite(requestedLimit) && requestedLimit > 0 ? requestedLimit : 8);
  const entries = await getCollection('encyclopedia');
  const suggestions = entries
    .map((entry) => {
      const title = entry.data.title.toLowerCase();
      const aliases = (entry.data.aliases || []).join(' ').toLowerCase();
      const summary = entry.data.summary.toLowerCase();
      const score = title === q ? 100 : title.startsWith(q) ? 80 : aliases.startsWith(q) ? 70 : title.includes(q) ? 60 : aliases.includes(q) ? 50 : summary.includes(q) ? 20 : 0;
      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.entry.data.title.localeCompare(b.entry.data.title))
    .slice(0, limit)
    .map(({ entry }) => ({
      id: entry.id,
      title: entry.data.title,
      summary: entry.data.summary,
      category: entry.data.category,
      entryType: entry.data.entryType,
      image: entry.data.image,
      url: `https://services.dzaleka.com/encyclopedia/${entry.id}`,
    }));

  return jsonResponse({ status: 'success', query: q, count: suggestions.length, data: { suggestions } });
};

export const OPTIONS = createOptionsHandler();
