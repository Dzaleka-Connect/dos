import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { problemResponse } from './api-errors';

// Header, versioning and rate-limit logic lives in ./api-headers so it can be
// imported (and tested) without pulling in the Astro content layer.
export {
  API_VERSION,
  corsHeaders,
  rateLimitHeaders,
  apiHeaders,
  checkRateLimit,
} from './api-headers';

import { apiHeaders, checkRateLimit } from './api-headers';

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
        { status: 200, headers: apiHeaders(request) }
      );
    } catch (error) {
      console.error(`Error in GET handler for ${collectionName}:`, error);
      return problemResponse(
        'internal_error',
        `Failed to fetch ${collectionName}: ${error instanceof Error ? error.message : String(error)}`,
        apiHeaders(request),
        new URL(request.url).pathname
      );
    }
  };
}

/**
 * Create a standardized OPTIONS handler for CORS
 * @returns An APIRoute handler for OPTIONS requests
 */
export function createOptionsHandler(): APIRoute {
  return async ({ request }) => {
    return new Response(null, {
      status: 204,
      headers: apiHeaders(request, { Allow: 'GET, POST, OPTIONS' })
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
        { status: 200, headers: apiHeaders(request) }
      );
    } catch (error) {
      console.error(`Error in POST handler for ${collectionName}:`, error);
      return problemResponse(
        'internal_error',
        `Failed to fetch ${collectionName}: ${error instanceof Error ? error.message : String(error)}`,
        apiHeaders(request),
        new URL(request.url).pathname
      );
    }
  };
} 