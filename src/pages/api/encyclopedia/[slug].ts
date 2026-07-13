import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { checkRateLimit, createOptionsHandler } from '../../../utils/api-utils';
import { encyclopediaJsonLd, jsonResponse, serializeEncyclopediaEntry } from '../../../utils/encyclopedia-api';

export const prerender = false;

export const GET: APIRoute = async ({ params, request, url }) => {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  const entries = await getCollection('encyclopedia');
  const entry = entries.find((candidate) => candidate.id === params.slug);
  if (!entry) {
    return jsonResponse({ status: 'error', message: 'Encyclopedia entry not found' }, 404);
  }

  const wantsJsonLd = url.searchParams.get('format') === 'jsonld'
    || request.headers.get('accept')?.includes('application/ld+json');
  if (wantsJsonLd) {
    return jsonResponse(encyclopediaJsonLd(entry), 200, { 'Content-Type': 'application/ld+json; charset=utf-8' });
  }

  return jsonResponse({
    status: 'success',
    data: { entry: serializeEncyclopediaEntry(entry, true) },
    links: {
      self: `https://services.dzaleka.com/api/encyclopedia/${entry.id}`,
      html: `https://services.dzaleka.com/encyclopedia/${entry.id}`,
      jsonld: `https://services.dzaleka.com/api/encyclopedia/${entry.id}?format=jsonld`,
      collection: 'https://services.dzaleka.com/api/encyclopedia',
    },
  });
};

export const OPTIONS = createOptionsHandler();
