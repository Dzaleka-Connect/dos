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
      service.id
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

/**
 * Get the current open/closed status of a service based on its hours
 * @param hours - The hours string (e.g., "Mon-Fri: 9:00 AM - 5:00 PM")
 * @returns 'open' | 'closed' | null
 */
export function getServiceStatus(hours: string | undefined | null): 'open' | 'closed' | null {
  if (!hours || typeof hours !== 'string') return null;

  try {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTime = now.getHours() * 100 + now.getMinutes();

    // Simplify the input string to standard format
    // 1. Replace "Monday" with "Mon", etc.
    const normalizedHours = hours.toLowerCase()
      .replace(/monday/g, 'mon')
      .replace(/tuesday/g, 'tue')
      .replace(/wednesday/g, 'wed')
      .replace(/thursday/g, 'thu')
      .replace(/friday/g, 'fri')
      .replace(/saturday/g, 'sat')
      .replace(/sunday/g, 'sun')
      // 2. Replace comma separator with colon if colon is missing
      .replace(/, /g, ': ');

    const schedules = normalizedHours.split('\n');
    let isOpen = false;
    let hasValidSchedule = false;

    for (const schedule of schedules) {
      // Split by first colon or common separators
      const parts = schedule.split(/:|,\s+/);
      if (parts.length < 2) continue;

      const days = parts[0];
      // Join the rest as times (handling cases like "8:00 AM - 5:00 PM")
      const times = parts.slice(1).join(':');

      if (!days || !times) continue;

      // Parse days
      const dayParts = days.split('-');
      let startDay, endDay;

      const dayMap: Record<string, number> = {
        'sun': 0, 'mon': 1, 'tue': 2, 'wed': 3,
        'thu': 4, 'fri': 5, 'sat': 6
      };

      if (dayParts.length === 2) {
        // Range: Mon-Fri
        startDay = dayMap[dayParts[0].trim()];
        endDay = dayMap[dayParts[1].trim()];
      } else {
        // Single day: Mon
        const singleDay = dayMap[days.trim()];
        if (typeof singleDay === 'number') {
          startDay = singleDay;
          endDay = singleDay;
        }
      }

      if (typeof startDay !== 'number' || typeof endDay !== 'number') continue;

      // Parse times
      const timeParts = times.split(/ - | to /); // Handle " - " or " to "
      if (timeParts.length !== 2) continue;

      const [startTimeStr, endTimeStr] = timeParts;

      const parseTime = (timeStr: string) => {
        try {
          const cleanTime = timeStr.trim();
          const isPM = cleanTime.includes('pm');
          const isAM = cleanTime.includes('am');

          let [hours, minutes] = cleanTime.replace(/[a-z]+/g, '').split(':');
          let h = parseInt(hours);
          const m = minutes ? parseInt(minutes) : 0;

          if (isNaN(h)) return null;

          if (isPM && h !== 12) h += 12;
          if (isAM && h === 12) h = 0;

          return h * 100 + m;
        } catch (e) {
          return null;
        }
      };

      const startTime = parseTime(startTimeStr);
      const endTime = parseTime(endTimeStr);

      if (startTime === null || endTime === null) continue;

      hasValidSchedule = true;

      // Check availability
      if (day >= startDay && day <= endDay) {
        if (currentTime >= startTime && currentTime < endTime) {
          isOpen = true;
          break; // Found an open slot
        }
      }
    }

    if (!hasValidSchedule) return null;
    return isOpen ? 'open' : 'closed';

  } catch (error) {
    console.error('Error parsing service hours:', error);
    return null;
  }
}