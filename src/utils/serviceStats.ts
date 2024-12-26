import type { CollectionEntry } from 'astro:content';

export interface ServiceStats {
  total: number;
  featured: number;
  verified: number;
  active: number;
  categories: number;
}

export function calculateServiceStats(services: CollectionEntry<'services'>[]): ServiceStats {
  return {
    total: services.length,
    featured: services.filter(s => s.data.featured).length,
    verified: services.filter(s => s.data.verified).length,
    active: services.filter(s => s.data.status !== 'inactive').length,
    categories: new Set(services.map(s => s.data.category)).size
  };
}
