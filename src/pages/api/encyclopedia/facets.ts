import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { checkRateLimit, createOptionsHandler } from '../../../utils/api-utils';
import { jsonResponse } from '../../../utils/encyclopedia-api';

export const prerender = false;

const countValues = (values: string[]) => Object.fromEntries(
  [...new Set(values)].sort().map((value) => [value, values.filter((candidate) => candidate === value).length])
);

export const GET: APIRoute = async ({ request }) => {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  const entries = await getCollection('encyclopedia');
  const letters = entries.map((entry) => (entry.data.sortName || entry.data.title).charAt(0).toUpperCase());
  return jsonResponse({
    status: 'success',
    data: {
      total: entries.length,
      categories: countValues(entries.map((entry) => entry.data.category)),
      entryTypes: countValues(entries.map((entry) => entry.data.entryType)),
      statuses: countValues(entries.map((entry) => entry.data.status)),
      letters: countValues(letters),
    },
  });
};

export const OPTIONS = createOptionsHandler();
