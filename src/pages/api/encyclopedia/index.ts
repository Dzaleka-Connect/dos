import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { checkRateLimit, createOptionsHandler } from '../../../utils/api-utils';
import { ENCYCLOPEDIA_URL, jsonResponse, searchableText, serializeEncyclopediaEntry } from '../../../utils/encyclopedia-api';

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  const q = url.searchParams.get('q')?.trim().toLowerCase() || '';
  const category = url.searchParams.get('category')?.trim().toLowerCase() || '';
  const type = url.searchParams.get('type')?.trim().toLowerCase() || '';
  const status = url.searchParams.get('status')?.trim().toLowerCase() || '';
  const featured = url.searchParams.get('featured');
  const includeBody = url.searchParams.get('include')?.split(',').includes('body') || false;
  const requestedPage = Number.parseInt(url.searchParams.get('page') || '1', 10);
  const requestedPerPage = Number.parseInt(url.searchParams.get('perPage') || '20', 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const perPage = Math.min(100, Number.isFinite(requestedPerPage) && requestedPerPage > 0 ? requestedPerPage : 20);
  const sort = url.searchParams.get('sort') === 'updated' ? 'updated' : 'title';
  const order = url.searchParams.get('order') === 'desc' ? 'desc' : 'asc';

  let entries = await getCollection('encyclopedia');
  entries = entries.filter((entry) => {
    if (q && !searchableText(entry).includes(q)) return false;
    if (category && entry.data.category.toLowerCase() !== category) return false;
    if (type && entry.data.entryType.toLowerCase() !== type) return false;
    if (status && entry.data.status.toLowerCase() !== status) return false;
    if (featured === 'true' && !entry.data.featured) return false;
    if (featured === 'false' && entry.data.featured) return false;
    return true;
  });

  entries.sort((a, b) => {
    const compared = sort === 'updated'
      ? a.data.lastReviewed.getTime() - b.data.lastReviewed.getTime()
      : (a.data.sortName || a.data.title).localeCompare(b.data.sortName || b.data.title);
    return order === 'desc' ? -compared : compared;
  });

  const total = entries.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const offset = (page - 1) * perPage;
  const pageEntries = page > totalPages ? [] : entries.slice(offset, offset + perPage);
  const query = new URLSearchParams(url.searchParams);
  const pageUrl = (targetPage: number) => {
    query.set('page', String(targetPage));
    return `${ENCYCLOPEDIA_URL.replace('/encyclopedia', '/api/encyclopedia')}?${query.toString()}`;
  };

  return jsonResponse({
    status: 'success',
    data: { entries: pageEntries.map((entry) => serializeEncyclopediaEntry(entry, includeBody)) },
    meta: { total, page, perPage, totalPages, sort, order },
    links: {
      self: pageUrl(page),
      first: pageUrl(1),
      previous: page > 1 ? pageUrl(page - 1) : null,
      next: page < totalPages ? pageUrl(page + 1) : null,
      last: pageUrl(totalPages),
    },
    license: {
      name: 'Dzaleka Online Services Open License',
      url: 'https://services.dzaleka.com/open-license',
      attribution: 'Dzaleka Encyclopedia, Dzaleka Online Services',
    },
  }, 200, {}, request);
};

export const OPTIONS = createOptionsHandler();
