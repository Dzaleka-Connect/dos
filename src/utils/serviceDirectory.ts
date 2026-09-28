import type { CollectionEntry } from 'astro:content';
import { filterServices, sortServices } from './serviceHelpers';

export const SERVICES_PER_PAGE = 6;
export const serviceCategorySlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

export function getServiceDirectory(services: CollectionEntry<'services'>[], params: URLSearchParams) {
  const query = (params.get('q') || '').trim();
  const requestedCategory = params.get('category') || '';
  const category = services.some(service => service.data.category === requestedCategory) ? requestedCategory : '';
  const requestedSort = params.get('sort');
  const sort = requestedSort === 'name' || requestedSort === 'newest' ? requestedSort : 'featured';
  const matches = sortServices(filterServices(services, query).filter(service => !category || service.data.category === category), sort);
  const totalPages = Math.max(1, Math.ceil(matches.length / SERVICES_PER_PAGE));
  const requestedPage = Number(params.get('page') || 1);
  const currentPage = Number.isSafeInteger(requestedPage) ? Math.min(totalPages, Math.max(1, requestedPage)) : 1;
  const start = (currentPage - 1) * SERVICES_PER_PAGE;
  const searchParams = new URLSearchParams();
  if (query) searchParams.set('q', query);
  if (category) searchParams.set('category', category);
  if (sort !== 'featured') searchParams.set('sort', sort);
  return { query, category, sort, total: matches.length, totalPages, currentPage, start, entries: matches.slice(start, start + SERVICES_PER_PAGE), searchParams };
}
