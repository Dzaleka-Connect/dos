import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { apiHeaders } from '../../utils/api-utils';
import { problemResponse } from '../../utils/api-errors';

// Server-rendered: this endpoint is request-dependent.
export const prerender = false;

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
  'pages',
  'courses',
  'artists',
  'artworks',
  'marketplace',
  'stores',
  'rights',
  'poets',
  'dancers',
  'encyclopedia',
] as const;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const buildApiDescription = () => ({
  api: 'Dzaleka Online Services API',
  version: '1.0.0',
  collections: VALID_COLLECTIONS,
  endpoints: {
    export: {
      get: 'Returns API information',
      post: 'Export data from collections',
    },
    ...VALID_COLLECTIONS.reduce((accumulator, collection) => {
      accumulator[collection] = {
        get: `Returns all items from the ${collection} collection`,
        post: `Returns items from the ${collection} collection with options`,
      };
      return accumulator;
    }, {}),
  },
});

export const OPTIONS: APIRoute = async ({ request }) =>
  new Response(null, {
    status: 204,
    headers: apiHeaders(request, { Allow: 'GET, POST, OPTIONS' }),
  });

export const GET: APIRoute = async ({ request }) =>
  new Response(JSON.stringify(buildApiDescription()), {
    status: 200,
    headers: apiHeaders(request),
  });

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { collections = [], options = {} } = body;

    const data = {};

    for (const collection of collections) {
      if (!VALID_COLLECTIONS.includes(collection)) {
        console.warn(`Skipping invalid collection: ${collection}`);
        continue;
      }

      try {
        const items = await getCollection(collection);
        data[collection] = items.map((item) => ({
          id: item.id,
          ...item.data,
        }));
      } catch (error) {
        console.error(`Error fetching collection ${collection}:`, error);
        data[collection] = [];
      }
    }

    if (options.includeMetadata) {
      data.metadata = {
        exportDate: new Date().toISOString(),
        totalCollections: collections.length,
        collections,
      };
    }

    if (options.includeStats) {
      data.stats = {
        totalItems: Object.values(data).reduce(
          (sum, value) => (Array.isArray(value) ? sum + value.length : sum),
          0
        ),
        itemsPerCollection: Object.entries(data).reduce((accumulator, [key, value]) => {
          if (Array.isArray(value)) {
            accumulator[key] = value.length;
          }
          return accumulator;
        }, {}),
      };
    }

    return new Response(
      JSON.stringify({
        status: 'success',
        data,
      }),
      {
        status: 200,
        headers: apiHeaders(request),
      }
    );
  } catch (error) {
    console.error('Export error:', error);
    return problemResponse(
      'internal_error',
      `Failed to export data: ${error instanceof Error ? error.message : String(error)}`,
      apiHeaders(request),
      new URL(request.url).pathname
    );
  }
};
