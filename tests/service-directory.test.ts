import { describe, expect, it } from 'vitest';
import { getServiceDirectory } from '../src/utils/serviceDirectory';

type Service = Parameters<typeof getServiceDirectory>[0][number];
const services: Service[] = Array.from({ length: 15 }, (_, index) => ({
  id: `service-${index}`,
  collection: 'services',
  data: {
    title: index === 14 ? 'ReFAN' : `Service ${String(index).padStart(2, '0')}`,
    category: index % 2 ? 'Education' : 'Community & Humanitarian',
    description: index === 14 ? 'Educational support for orphaned children' : 'Language classes',
    status: 'active',
    tags: index === 14 ? ['Foster parents'] : [],
    location: { address: 'Dzaleka Refugee Camp', city: 'Dowa' },
    lastUpdated: new Date(2026, 0, index + 1),
  },
}));

describe('service directory search and pagination', () => {
  it('finds a listing beyond the first page of the complete collection', () => {
    const result = getServiceDirectory(services, new URLSearchParams({ q: 'refan' }));
    expect(result.entries.map(entry => entry.id)).toEqual(['service-14']);
    expect(result.total).toBe(1);
  });

  it('matches words across title, tags and location without case or accents', () => {
    const result = getServiceDirectory(services, new URLSearchParams({ q: ' RÉFAN  foster Dowa ' }));
    expect(result.entries.map(entry => entry.id)).toEqual(['service-14']);
  });

  it('applies filters and sorting before paging, preserving filters in page links', () => {
    const result = getServiceDirectory(services, new URLSearchParams({ q: 'language', category: 'Education', sort: 'newest', page: '2' }));
    expect(result.total).toBe(7);
    expect(result.entries.map(entry => entry.id)).toEqual(['service-1']);
    expect(result.searchParams.get('q')).toBe('language');
    expect(result.searchParams.get('category')).toBe('Education');
    expect(result.searchParams.get('sort')).toBe('newest');
    expect(result.searchParams.has('page')).toBe(false);
  });

  it('returns an empty result without a phantom second page', () => {
    const result = getServiceDirectory(services, new URLSearchParams({ q: 'no such service', page: '2' }));
    expect(result.entries).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.currentPage).toBe(1);
  });

  it('ignores an unknown category so the selected filter matches the results', () => {
    const result = getServiceDirectory(services, new URLSearchParams({ category: 'Unknown category' }));
    expect(result.category).toBe('');
    expect(result.total).toBe(services.length);
    expect(result.searchParams.has('category')).toBe(false);
  });

  it.each(['NaN', '-2', '1.5', 'Infinity'])('handles an invalid page %s', page => {
    expect(getServiceDirectory(services, new URLSearchParams({ page })).currentPage).toBe(1);
  });

  it('clamps an out-of-range page and leaves the source order unchanged', () => {
    const before = services.map(service => service.id);
    const result = getServiceDirectory(services, new URLSearchParams({ page: '999', sort: 'unknown' }));
    expect(result.currentPage).toBe(3);
    expect(result.sort).toBe('featured');
    expect(services.map(service => service.id)).toEqual(before);
  });
});
