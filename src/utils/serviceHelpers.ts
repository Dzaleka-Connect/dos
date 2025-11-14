import type { CollectionEntry } from 'astro:content';

/**
 * Filter services based on a search query
 * Searches across title, description, category, tags, location, and slug
 * @param services - Array of service entries to filter
 * @param searchQuery - Search query string
 * @returns Filtered array of services matching the query
 */
export function filterServices(
  services: CollectionEntry<'services'>[],
  searchQuery: string
): CollectionEntry<'services'>[] {
  // If no search query, return all services
  if (!searchQuery) {
    return services;
  }

  // For search, use case-insensitive matching
  const query = searchQuery.toLowerCase().trim();

  return services.filter(service => {
    // Check all searchable fields
    const searchableFields = [
      service.data.title,
      service.data.description,
      service.data.category,
      ...(service.data.tags || []),
      service.data.location?.address,
      service.data.location?.city,
      service.slug
    ].filter(Boolean); // Remove undefined/null values

    return searchableFields.some(field =>
      field.toString().toLowerCase().includes(query)
    );
  });
}

/**
 * Sort services by specified criteria
 * @param services - Array of service entries to sort
 * @param sortBy - Sort criteria: 'featured', 'name', or 'newest'
 * @returns Sorted array of services
 */
export function sortServices(
  services: CollectionEntry<'services'>[],
  sortBy: string = 'featured'
): CollectionEntry<'services'>[] {
  if (!services || !Array.isArray(services)) {
    return [];
  }

  return [...services].sort((a, b) => {
    // Ensure we have valid data objects
    if (!a?.data || !b?.data) {
      return 0;
    }

    switch (sortBy) {
      case 'featured':
        // First sort by featured status
        if (a.data.featured !== b.data.featured) {
          return a.data.featured ? -1 : 1;
        }
        // Then sort alphabetically by title
        return (a.data.title || '').localeCompare(b.data.title || '');

      case 'name':
        return (a.data.title || '').localeCompare(b.data.title || '');

      case 'newest':
        const dateA = new Date(a.data.lastUpdated || 0);
        const dateB = new Date(b.data.lastUpdated || 0);
        return dateB.getTime() - dateA.getTime();

      default:
        return 0;
    }
  });
}

/**
 * Calculate statistics for service collection
 * @param services - Array of service entries to analyze
 * @returns Object containing service statistics (total, featured, verified, active, categories)
 */
export function calculateServiceStats(services: CollectionEntry<'services'>[]) {
  const totalServices = services.length;
  const featuredServices = services.filter(s => s.data.featured).length;
  const verifiedServices = services.filter(s => s.data.verified).length;
  const activeServices = services.filter(s => s.data.status !== 'inactive').length;

  const categories = new Set(services.map(s => s.data.category));

  return {
    total: totalServices,
    featured: featuredServices,
    verified: verifiedServices,
    active: activeServices,
    categories: categories.size
  };
}