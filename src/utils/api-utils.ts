import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// CORS headers for all API endpoints
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting middleware for API endpoints
 * Limits requests based on IP address
 * @param request The incoming request
 * @returns null if allowed, Response if rate limited
 */
export function checkRateLimit(request: Request): Response | null {
  // Get client IP from headers (supports various proxy configurations)
  const clientIP =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') || // Cloudflare
    'unknown';

  const now = Date.now();
  const rateLimitData = rateLimitMap.get(clientIP);

  // Clean up expired entries periodically
  if (Math.random() < 0.01) { // 1% chance to clean up
    for (const [ip, data] of rateLimitMap.entries()) {
      if (now > data.resetTime) {
        rateLimitMap.delete(ip);
      }
    }
  }

  if (!rateLimitData || now > rateLimitData.resetTime) {
    // First request or window expired
    rateLimitMap.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return null;
  }

  if (rateLimitData.count >= MAX_REQUESTS_PER_WINDOW) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((rateLimitData.resetTime - now) / 1000);
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter
      }),
      {
        status: 429,
        headers: {
          ...corsHeaders,
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitData.resetTime.toString()
        }
      }
    );
  }

  // Increment counter
  rateLimitData.count++;
  return null;
}

/**
 * Process collection data to standardize the response format
 * @param collection The collection data to process
 * @param collectionName The name of the collection
 * @returns Processed collection data
 */
export function processCollectionData(collection: any[], collectionName: string) {
  return collection.map(item => {
    // Extract the data we want to return
    let itemData: Record<string, any> = {};
    
    // Add id and collection info
    itemData.id = item.id;
    itemData.collection = collectionName;
    
    // Add slug if it exists
    if (item.id !== undefined) {
      itemData.id = item.id;
    }
    
    // Extract data from the item
    if (item.data && typeof item.data === 'object') {
      // If item has a data property, use that
      itemData = { ...itemData, ...item.data };
    } else {
      // Otherwise use the item itself, excluding certain properties
      const { id, slug, collection, ...rest } = item;
      itemData = { ...itemData, ...rest };
    }
    
    return itemData;
  });
}

/**
 * Create a standardized GET handler for a collection
 * @param collectionName The name of the collection to fetch
 * @returns An APIRoute handler for GET requests
 */
export function createGetHandler(collectionName: string): APIRoute {
  return async ({ request }) => {
    try {
      // Check rate limit
      const rateLimitResponse = checkRateLimit(request);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }

      console.log(`GET request received to /api/${collectionName}`);

      // Fetch the collection
      const collection = await getCollection(collectionName);
      console.log(`Found ${collection.length} ${collectionName}`);

      // Process the collection data
      const processedData = processCollectionData(collection, collectionName);

      // Return the response
      return new Response(
        JSON.stringify({
          status: 'success',
          count: processedData.length,
          data: {
            [collectionName]: processedData
          }
        }),
        { status: 200, headers: corsHeaders }
      );
    } catch (error) {
      console.error(`Error in GET handler for ${collectionName}:`, error);
      return new Response(
        JSON.stringify({
          status: 'error',
          message: `Failed to fetch ${collectionName}`,
          error: error instanceof Error ? error.message : String(error)
        }),
        { status: 500, headers: corsHeaders }
      );
    }
  };
}

/**
 * Create a standardized OPTIONS handler for CORS
 * @returns An APIRoute handler for OPTIONS requests
 */
export function createOptionsHandler(): APIRoute {
  return async () => {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  };
}

/**
 * Create a standardized POST handler for a collection
 * @param collectionName The name of the collection to fetch
 * @returns An APIRoute handler for POST requests
 */
export function createPostHandler(collectionName: string): APIRoute {
  return async ({ request }) => {
    try {
      // Check rate limit
      const rateLimitResponse = checkRateLimit(request);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }

      console.log(`POST request received to /api/${collectionName}`);

      // Fetch the collection
      const collection = await getCollection(collectionName);
      console.log(`Found ${collection.length} ${collectionName}`);

      // Process the collection data
      const processedData = processCollectionData(collection, collectionName);

      // Parse the request body for any filters or options
      let options: any = {};
      try {
        const body = await request.json();
        options = body.options || {};
      } catch (error) {
        console.log('No request body or invalid JSON');
      }

      // Prepare the response
      const response: Record<string, any> = {
        status: 'success',
        count: processedData.length,
        data: {
          [collectionName]: processedData
        }
      };

      // Add metadata if requested
      if (options.includeMetadata) {
        response.metadata = {
          exportDate: new Date().toISOString(),
          collection: collectionName
        };
      }

      // Add stats if requested
      if (options.includeStats) {
        response.stats = {
          totalItems: processedData.length,
          collection: collectionName
        };
      }

      // Return the response
      return new Response(
        JSON.stringify(response),
        { status: 200, headers: corsHeaders }
      );
    } catch (error) {
      console.error(`Error in POST handler for ${collectionName}:`, error);
      return new Response(
        JSON.stringify({
          status: 'error',
          message: `Failed to fetch ${collectionName}`,
          error: error instanceof Error ? error.message : String(error)
        }),
        { status: 500, headers: corsHeaders }
      );
    }
  };
} 