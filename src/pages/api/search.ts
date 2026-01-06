import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { corsHeaders, checkRateLimit } from '../../utils/api-utils';

export const prerender = false;

/**
 * Search result cache
 * Cache structure: Map<cacheKey, { results: any, timestamp: number }>
 */
const searchCache = new Map<string, { results: any; timestamp: number }>();

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100; // Maximum number of cached queries

/**
 * Generate cache key from search parameters
 * @param query - Search query
 * @param collections - Collections to search
 * @param limit - Result limit
 * @returns Cache key string
 */
function getCacheKey(query: string, collections: string[], limit: number): string {
  return `${query.toLowerCase()}:${collections.sort().join(',')}:${limit}`;
}

/**
 * Get cached search results if available and not expired
 * @param cacheKey - Cache key
 * @returns Cached results or null
 */
function getCachedResults(cacheKey: string): any | null {
  const cached = searchCache.get(cacheKey);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > CACHE_TTL) {
    // Cache expired, remove it
    searchCache.delete(cacheKey);
    return null;
  }

  return cached.results;
}

/**
 * Store search results in cache
 * @param cacheKey - Cache key
 * @param results - Search results to cache
 */
function setCachedResults(cacheKey: string, results: any): void {
  // If cache is full, remove oldest entry
  if (searchCache.size >= MAX_CACHE_SIZE) {
    const firstKey = searchCache.keys().next().value;
    if (firstKey) {
      searchCache.delete(firstKey);
    }
  }

  searchCache.set(cacheKey, {
    results,
    timestamp: Date.now()
  });
}

/**
 * Clean up expired cache entries
 * Called periodically to prevent memory bloat
 */
function cleanupCache(): void {
  const now = Date.now();
  for (const [key, value] of searchCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      searchCache.delete(key);
    }
  }
}

// Clean up cache every 10 minutes
setInterval(cleanupCache, 10 * 60 * 1000);

/**
 * Server-side search API endpoint
 * Searches across multiple collections (services, events, resources, etc.)
 *
 * Query parameters:
 * - q: search query (required)
 * - collections: comma-separated list of collections to search (optional, defaults to all)
 * - limit: max number of results per collection (optional, default 10)
 */
export const GET: APIRoute = async ({ request, url }) => {
  try {
    // Check rate limit
    const rateLimitResponse = checkRateLimit(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const query = url.searchParams.get('q');
    if (!query || query.trim().length < 2) {
      return new Response(
        JSON.stringify({
          status: 'error',
          message: 'Search query must be at least 2 characters long'
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    const searchTerm = query.toLowerCase().trim();
    const requestedCollections = url.searchParams.get('collections')?.split(',') || [
      'services',
      'events',
      'resources',
      'news',
      'photos',
      'jobs',
      'docs'
    ];
    const limit = parseInt(url.searchParams.get('limit') || '10');

    // Check cache first
    const cacheKey = getCacheKey(searchTerm, requestedCollections, limit);
    const cachedResults = getCachedResults(cacheKey);

    if (cachedResults) {
      return new Response(
        JSON.stringify({
          ...cachedResults,
          cached: true,
          cacheAge: Date.now() - searchCache.get(cacheKey)!.timestamp
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'X-Cache': 'HIT',
            'Cache-Control': 'public, max-age=300' // 5 minutes
          }
        }
      );
    }

    const results: Record<string, any[]> = {};
    let totalResults = 0;

    // Search each collection
    for (const collectionName of requestedCollections) {
      try {
        const collection = await getCollection(collectionName as any);
        const searchResults = collection
          .filter(item => {
            // Search in common fields
            const searchableText = [
              item.data.title,
              item.data.name,
              item.data.description,
              item.data.category,
              item.data.tags?.join(' '),
              item.id
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();

            return searchableText.includes(searchTerm);
          })
          .slice(0, limit)
          .map(item => ({
            slug: item.id,
            title: item.data.title || item.data.name,
            description: item.data.description,
            category: item.data.category,
            collection: collectionName,
            url: `/${collectionName}/${item.id}`,
            image: item.data.image || item.data.logo,
            featured: item.data.featured || false
          }));

        if (searchResults.length > 0) {
          results[collectionName] = searchResults;
          totalResults += searchResults.length;
        }
      } catch (error) {
        console.warn(`Failed to search collection ${collectionName}:`, error);
      }
    }

    // Prepare response data
    const responseData = {
      status: 'success',
      query: query,
      totalResults,
      results
    };

    // Cache the results
    setCachedResults(cacheKey, responseData);

    return new Response(
      JSON.stringify({
        ...responseData,
        cached: false
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'X-Cache': 'MISS',
          'Cache-Control': 'public, max-age=300' // 5 minutes
        }
      }
    );
  } catch (error) {
    console.error('Search API error:', error);
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Search failed',
        error: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: corsHeaders }
    );
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
};
