import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// List of valid collections
const VALID_COLLECTIONS = [
  'services',
  'resources',
  'events',
  'photos',
  'jobs',
  'profiles',
  'talents',
  'community-voices',
  'docs',
  'news',
  'pages'
] as const;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

export const all: APIRoute = async ({ request }) => {
  const method = request.method.toLowerCase();

  // Handle OPTIONS requests
  if (method === 'options') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Handle GET requests
  if (method === 'get') {
    return new Response(
      JSON.stringify({
        api: 'Dzaleka Heritage Archive API',
        version: '1.0.0',
        collections: VALID_COLLECTIONS,
        endpoints: {
          export: {
            get: 'Returns API information',
            post: 'Export data from collections'
          },
          ...VALID_COLLECTIONS.reduce((acc, collection) => {
            acc[collection] = {
              get: `Returns all items from the ${collection} collection`,
              post: `Returns items from the ${collection} collection with options`
            };
            return acc;
          }, {} as Record<string, any>)
        }
      }),
      {
        status: 200,
        headers: corsHeaders
      }
    );
  }

  // Handle POST requests
  if (method === 'post') {
    try {
      const body = await request.json();
      const { format = 'json', collections = [], options = {} } = body;
      
      // Get data for each collection
      const data: Record<string, any> = {};
      
      for (const collection of collections) {
        if (!VALID_COLLECTIONS.includes(collection)) {
          console.warn(`Skipping invalid collection: ${collection}`);
          continue;
        }
        
        try {
          const items = await getCollection(collection);
          data[collection] = items.map(item => ({
            id: item.id,
            ...item.data
          }));
        } catch (error) {
          console.error(`Error fetching collection ${collection}:`, error);
          data[collection] = [];
        }
      }

      // Add metadata if requested
      if (options.includeMetadata) {
        data.metadata = {
          exportDate: new Date().toISOString(),
          totalCollections: collections.length,
          collections: collections
        };
      }

      // Add stats if requested
      if (options.includeStats) {
        data.stats = {
          totalItems: Object.values(data).reduce((sum, arr) => 
            Array.isArray(arr) ? sum + arr.length : sum, 0
          ),
          itemsPerCollection: Object.entries(data).reduce((acc, [key, value]) => {
            if (Array.isArray(value)) {
              acc[key] = value.length;
            }
            return acc;
          }, {} as Record<string, number>)
        };
      }

      return new Response(
        JSON.stringify({
          status: 'success',
          data
        }),
        {
          status: 200,
          headers: corsHeaders
        }
      );
    } catch (error) {
      console.error('Export error:', error);
      return new Response(
        JSON.stringify({
          status: 'error',
          message: 'Failed to export data',
          error: error instanceof Error ? error.message : String(error)
        }),
        {
          status: 500,
          headers: corsHeaders
        }
      );
    }
  }

  // Handle unsupported methods
  return new Response(
    JSON.stringify({
      status: 'error',
      message: `Method ${method} not allowed`
    }),
    {
      status: 405,
      headers: corsHeaders
    }
  );
}; 