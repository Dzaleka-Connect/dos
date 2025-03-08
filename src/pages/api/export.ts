import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { corsHeaders } from '../../utils/api-utils';

// Define the collections exactly as they appear in src/content/config.ts
const VALID_COLLECTIONS = [
  'profiles',
  'services', 
  'resources', 
  'events', 
  'photos', 
  'pages', 
  'news', 
  'talents', 
  'community-voices', 
  'docs', 
  'jobs'
] as const;

// Define the collection type
type CollectionName = typeof VALID_COLLECTIONS[number];

// Process collection data
function processCollectionData(collection: any[], collectionName: string) {
  return collection.map(item => {
    // Extract the data we want to return
    let itemData: Record<string, any> = {};
    
    // Add id and collection info
    itemData.id = item.id;
    itemData.collection = collectionName;
    
    // Add slug if it exists
    if (item.slug !== undefined) {
      itemData.slug = item.slug;
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

// Function to safely get a collection
async function safeGetCollection(collectionName: string) {
  try {
    if (!VALID_COLLECTIONS.includes(collectionName as CollectionName)) {
      console.warn(`Invalid collection name: ${collectionName}`);
      return [];
    }
    
    const collection = await getCollection(collectionName as CollectionName);
    console.log(`Found ${collection.length} items in ${collectionName}`);
    return collection;
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    return [];
  }
}

// Convert data to CSV format
function convertToCSV(data: Record<string, any[]>): string {
  // Get all unique keys from all items in all collections
  const allKeys = new Set<string>();
  
  // Add a collection field to identify which collection each item belongs to
  Object.entries(data).forEach(([collectionName, items]) => {
    items.forEach(item => {
      // Add collection name to each item
      item.collection = collectionName;
      
      // Collect all keys
      Object.keys(item).forEach(key => allKeys.add(key));
    });
  });
  
  // Convert Set to Array and ensure 'collection' is the first column
  const keys = Array.from(allKeys);
  if (keys.includes('collection')) {
    keys.splice(keys.indexOf('collection'), 1);
    keys.unshift('collection');
  }
  
  // Create CSV header
  let csv = keys.join(',') + '\n';
  
  // Add all items from all collections
  Object.values(data).flat().forEach(item => {
    const row = keys.map(key => {
      const value = item[key];
      
      // Handle different value types
      if (value === undefined || value === null) {
        return '';
      } else if (typeof value === 'object') {
        // Convert objects to JSON strings
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      } else {
        // Escape quotes and wrap in quotes if needed
        const stringValue = String(value);
        return stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')
          ? `"${stringValue.replace(/"/g, '""')}"`
          : stringValue;
      }
    }).join(',');
    
    csv += row + '\n';
  });
  
  return csv;
}

// Handle GET requests
export const GET: APIRoute = async () => {
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
};

// Handle OPTIONS requests for CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
};

// Handle POST requests
export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('POST request received to /api/export');
    
    // Parse the request body
    let requestBody: { 
      format?: string; 
      collections?: string[]; 
      options?: { 
        includeMetadata?: boolean; 
        includeStats?: boolean;
      } 
    } = { format: 'json', collections: [], options: {} };
    
    try {
      requestBody = await request.json();
    } catch (error) {
      console.warn('Failed to parse request body, using defaults');
    }
    
    // Set defaults if not provided
    const format = requestBody.format || 'json';
    const collections = requestBody.collections || VALID_COLLECTIONS;
    const options = requestBody.options || {};
    
    // Validate format
    if (format !== 'json' && format !== 'csv') {
      return new Response(
        JSON.stringify({
          status: 'error',
          message: 'Invalid format. Supported formats: json, csv'
        }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Process each requested collection
    const data: Record<string, any[]> = {};
    
    for (const collectionName of collections) {
      if (!VALID_COLLECTIONS.includes(collectionName as CollectionName)) {
        console.warn(`Skipping invalid collection: ${collectionName}`);
        continue;
      }
      
      console.log(`Processing collection: ${collectionName}`);
      const collection = await safeGetCollection(collectionName);
      
      if (collection.length > 0) {
        // Process the collection data
        data[collectionName] = processCollectionData(collection, collectionName);
      } else {
        // Initialize with empty array if collection is empty
        data[collectionName] = [];
      }
    }
    
    // Prepare the response
    const response: Record<string, any> = {
      status: 'success',
      data
    };
    
    // Add metadata if requested
    if (options.includeMetadata) {
      response.metadata = {
        exportDate: new Date().toISOString(),
        collections: Object.keys(data)
      };
    }
    
    // Add stats if requested
    if (options.includeStats) {
      const stats: Record<string, any> = {
        totalCollections: Object.keys(data).length,
        totalItems: Object.values(data).reduce((sum, items) => sum + items.length, 0)
      };
      
      // Add per-collection stats
      Object.entries(data).forEach(([collectionName, items]) => {
        stats[collectionName] = items.length;
      });
      
      response.stats = stats;
    }
    
    // Return the response in the requested format
    if (format === 'csv') {
      return new Response(convertToCSV(data), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="export.csv"'
        }
      });
    } else {
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: corsHeaders
      });
    }
  } catch (error) {
    console.error('Error in POST handler:', error);
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Failed to process request',
        error: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}; 