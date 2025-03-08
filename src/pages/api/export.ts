import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

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
];

// Define a type for collection items
interface CollectionItem {
  id: string;
  slug?: string;
  data?: Record<string, any>;
  [key: string]: any;
}

// Helper function to safely get a collection
async function safeGetCollection(collectionName: string) {
  try {
    console.log(`Attempting to fetch collection: ${collectionName}`);
    
    // Use any type to bypass TypeScript's strict checking
    // This is necessary because we're accepting user input for collection names
    const collection = await getCollection(collectionName as any);
    
    console.log(`Successfully fetched collection: ${collectionName} (${collection.length} items)`);
    return collection;
  } catch (error) {
    console.warn(`Warning: Could not fetch collection "${collectionName}": ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

// Helper function to convert data to CSV
function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) return '';
  
  try {
    // Get all unique keys from all objects
    const allKeys = new Set<string>();
    data.forEach(item => {
      if (item && typeof item === 'object') {
        Object.keys(item).forEach(key => allKeys.add(key));
      }
    });
    
    const headers = Array.from(allKeys);
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Add data rows
    data.forEach(item => {
      if (!item || typeof item !== 'object') {
        // Skip invalid items
        return;
      }
      
      const values = headers.map(header => {
        const value = item[header];
        
        // Handle different data types
        if (value === null || value === undefined) {
          return '';
        } else if (typeof value === 'string') {
          // Escape quotes and wrap in quotes
          return `"${value.replace(/"/g, '""')}"`;
        } else if (typeof value === 'object') {
          try {
            // Convert objects to JSON strings
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          } catch (e) {
            return '""'; // Return empty string if JSON conversion fails
          }
        } else {
          return String(value);
        }
      });
      
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  } catch (error) {
    console.error('Error converting to CSV:', error);
    return 'Error converting data to CSV format';
  }
}

// Helper function to filter data by date range
function filterByDateRange(data: any[], dateRange: { start: string | null; end: string | null }) {
  if (!data || !Array.isArray(data)) return [];
  if (!dateRange || (!dateRange.start && !dateRange.end)) return data;
  
  try {
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;
    
    return data.filter(item => {
      if (!item) return false;
      
      // Try to find a date field based on the collection type
      let dateField = null;
      
      // Check for common date fields in the item itself
      if (item.date) dateField = item.date;
      else if (item.publishDate) dateField = item.publishDate;
      else if (item.lastUpdated) dateField = item.lastUpdated;
      else if (item.posted) dateField = item.posted;
      else if (item.deadline) dateField = item.deadline;
      
      // Check for date fields in the data property
      else if (item.data) {
        if (item.data.date) dateField = item.data.date;
        else if (item.data.publishDate) dateField = item.data.publishDate;
        else if (item.data.lastUpdated) dateField = item.data.lastUpdated;
        else if (item.data.posted) dateField = item.data.posted;
        else if (item.data.deadline) dateField = item.data.deadline;
      }
      
      // If no date field found, include the item
      if (!dateField) return true;
      
      try {
        // Convert to Date object if it's not already
        const itemDate = dateField instanceof Date ? dateField : new Date(dateField);
        
        // Check if date is within range
        if (startDate && itemDate < startDate) return false;
        if (endDate && itemDate > endDate) return false;
        
        return true;
      } catch (e) {
        console.warn(`Error parsing date: ${dateField}`, e);
        // If date parsing fails, include the item
        return true;
      }
    });
  } catch (error) {
    console.error('Error filtering by date range:', error);
    return data; // Return original data on error
  }
}

// Helper function to prepare collection data
async function prepareCollectionData(collectionName: string) {
  try {
    console.log(`Preparing data for collection: ${collectionName}`);
    const collection = await safeGetCollection(collectionName);
    
    if (!collection || !Array.isArray(collection) || collection.length === 0) {
      console.warn(`Collection "${collectionName}" is empty or not found`);
      return [];
    }
    
    console.log(`Processing ${collection.length} items from collection: ${collectionName}`);
    
    // Extract relevant properties from collection items
    return collection.map((item: any) => {
      try {
        if (!item) return null;
        
        // Extract data based on collection type
        const baseData: Record<string, any> = {
          id: item.id || `unknown-${Math.random().toString(36).substring(2, 9)}`,
          collection: collectionName,
        };
        
        // Safely add slug if it exists
        if (item && 'slug' in item) {
          baseData.slug = item.slug;
        }
        
        // Special handling for different collection types
        if (collectionName === 'talents') {
          // Talents collection has a different structure (data collection)
          if (item.data && Array.isArray(item.data.talents)) {
            // For content collections
            return {
              ...baseData,
              name: item.data.name,
              category: item.data.category,
              profilePic: item.data.profilePic,
              talents: item.data.talents.map((talent: any) => ({
                name: talent.name,
                category: talent.category,
                profilePic: talent.profilePic,
                bio: talent.bio,
                user: talent.user,
                instagram: talent.instagram,
                twitter: talent.twitter,
                linkedin: talent.linkedin
              }))
            };
          } else if (item.talents) {
            // For data collections
            return {
              ...baseData,
              name: item.name,
              category: item.category,
              profilePic: item.profilePic,
              talents: item.talents
            };
          }
        }
        
        // For regular content collections
        if (item.data) {
          try {
            // Clone the data to avoid modifying the original
            const safeData = { ...item.data };
            
            // Handle date fields - convert to ISO strings for consistency
            if (safeData.date instanceof Date) safeData.date = safeData.date.toISOString();
            if (safeData.lastUpdated instanceof Date) safeData.lastUpdated = safeData.lastUpdated.toISOString();
            if (safeData.posted instanceof Date) safeData.posted = safeData.posted.toISOString();
            if (safeData.deadline instanceof Date) safeData.deadline = safeData.deadline.toISOString();
            
            // Remove any circular references or functions
            const cleanedData = JSON.parse(JSON.stringify(safeData));
            return { ...baseData, ...cleanedData };
          } catch (e) {
            console.warn(`Warning: Error processing data for item ${item.id} in collection ${collectionName}: ${e}`);
            return baseData;
          }
        }
        
        return baseData;
      } catch (e) {
        console.warn(`Warning: Error processing item in collection ${collectionName}: ${e}`);
        return { id: item?.id || 'unknown', collection: collectionName };
      }
    }).filter(Boolean); // Remove null/undefined items
  } catch (error) {
    console.error(`Error preparing data for collection ${collectionName}:`, error);
    return [];
  }
}

// Simple export function for debugging
export const GET: APIRoute = async ({ request }) => {
  // Log the incoming request for debugging
  console.log('GET request received:', {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries([...request.headers.entries()])
  });

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, content-type, Accept, X-Requested-With'
  };

  return new Response(
    JSON.stringify({
      status: 'ok',
      message: 'Export API is running',
      validCollections: VALID_COLLECTIONS,
      supportedFormats: ['json', 'csv'],
      endpoints: {
        get: 'Use GET to check API status',
        post: 'Use POST to export data'
      }
    }),
    { headers }
  );
};

// Handle OPTIONS requests for CORS
export const OPTIONS: APIRoute = async ({ request }) => {
  // Log the incoming request for debugging
  console.log('OPTIONS request received:', {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries([...request.headers.entries()])
  });

  // Return CORS headers
  return new Response(null, {
    status: 204, // No content
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, content-type, Accept, X-Requested-With',
      'Access-Control-Max-Age': '86400' // 24 hours
    }
  });
};

export const POST: APIRoute = async ({ request }) => {
  // Log the incoming request for debugging
  console.log('POST request received:', {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries([...request.headers.entries()])
  });

  // Add CORS headers for all responses
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, content-type, Accept, X-Requested-With'
  };

  try {
    // Try to read the request body directly
    let body;
    
    try {
      // Try to get the request body directly
      const requestText = await request.text();
      console.log('Raw request body:', requestText);
      
      if (!requestText || requestText.trim() === '') {
        // If the request body is empty, try a fallback approach
        console.log('Empty request body, using fallback approach');
        
        // Create a minimal default request
        body = {
          format: 'json',
          collections: ['services'],
          dateRange: { start: null, end: null },
          options: { includeMetadata: true, includeStats: true }
        };
        
        console.log('Using default request:', body);
      } else {
        // Parse the request body
        try {
          body = JSON.parse(requestText);
          console.log('Parsed request body:', body);
        } catch (parseError) {
          console.error('Error parsing JSON request body:', parseError);
          return new Response(
            JSON.stringify({
              error: 'Invalid JSON',
              message: 'Failed to parse request body as JSON',
              details: parseError instanceof Error ? parseError.message : 'Unknown error',
              receivedBody: requestText.length > 100 ? requestText.substring(0, 100) + '...' : requestText
            }),
            { status: 400, headers }
          );
        }
      }
    } catch (readError) {
      console.error('Error reading request body:', readError);
      
      // Create a minimal default request as fallback
      body = {
        format: 'json',
        collections: ['services'],
        dateRange: { start: null, end: null },
        options: { includeMetadata: true, includeStats: true }
      };
      
      console.log('Using default request due to error:', body);
    }

    // Validate request data
    if (!body || typeof body !== 'object') {
      console.error(`Invalid request data type: ${typeof body}`);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request data', 
          message: 'Request data must be a valid JSON object',
          received: typeof body
        }),
        { status: 400, headers }
      );
    }
    
    // Extract request parameters with defaults
    const format = body.format || 'json';
    const collections = body.collections || ['all'];
    const dateRange = body.dateRange || { start: null, end: null };
    const options = body.options || { includeMetadata: true, includeStats: false };
    
    console.log('Extracted parameters:', { format, collections, dateRange, options });
    
    // Validate format
    if (format !== 'json' && format !== 'csv') {
      console.error(`Invalid format: ${format}`);
      return new Response(
        JSON.stringify({
          error: 'Invalid format',
          message: 'Format must be either "json" or "csv"',
          received: format
        }),
        { status: 400, headers }
      );
    }
    
    // Validate collections
    if (!Array.isArray(collections)) {
      console.error(`Collections is not an array: ${typeof collections}`);
      return new Response(
        JSON.stringify({
          error: 'Invalid collections parameter',
          message: 'Collections must be an array',
          received: typeof collections
        }),
        { status: 400, headers }
      );
    }
    
    // Determine which collections to export
    let collectionsToFetch: string[] = [];
    
    if (collections.includes('all')) {
      collectionsToFetch = [...VALID_COLLECTIONS];
    } else {
      // Validate collections
      const validCollections: string[] = [];
      for (const col of collections) {
        if (VALID_COLLECTIONS.includes(col)) {
          validCollections.push(col);
        } else {
          console.warn(`Ignoring invalid collection: ${col}`);
        }
      }
      
      if (validCollections.length === 0) {
        return new Response(
          JSON.stringify({ 
            error: 'No valid collections specified',
            message: 'Please specify at least one valid collection',
            validCollections: VALID_COLLECTIONS,
            receivedCollections: collections
          }),
          { status: 400, headers }
        );
      }
      
      collectionsToFetch = validCollections;
    }
    
    console.log(`Fetching collections: ${collectionsToFetch.join(', ')}`);
    
    // Fetch and prepare data from all collections
    const collectionData: Record<string, any[]> = {};
    const collectionResults: Record<string, number> = {};
    let allData: any[] = [];
    
    for (const collectionName of collectionsToFetch) {
      try {
        console.log(`Processing collection: ${collectionName}`);
        const data = await prepareCollectionData(collectionName);
        
        if (data && Array.isArray(data) && data.length > 0) {
          // Filter by date range if specified
          const filteredData = filterByDateRange(data, dateRange);
          
          // Store the filtered data
          collectionData[collectionName] = filteredData;
          collectionResults[collectionName] = filteredData.length;
          
          // Add to the combined data array
          allData = allData.concat(filteredData);
          
          console.log(`Added ${filteredData.length} items from ${collectionName} (after date filtering)`);
        } else {
          console.warn(`No data returned for collection: ${collectionName}`);
          collectionData[collectionName] = [];
          collectionResults[collectionName] = 0;
        }
      } catch (error) {
        console.error(`Error processing collection ${collectionName}:`, error);
        collectionData[collectionName] = [];
        collectionResults[collectionName] = 0;
        // Continue with other collections instead of failing the entire export
      }
    }
    
    console.log(`Total items across all collections: ${allData.length}`);
    
    // Check if we have any data
    if (allData.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No data found for the selected collections and filters',
          collections: collectionsToFetch,
          collectionResults
        }),
        { status: 404, headers }
      );
    }
    
    // Return the data in the requested format
    if (format === 'csv') {
      const csvData = convertToCSV(allData);
      return new Response(csvData, { 
        headers: { 
          ...headers,
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="export-${new Date().toISOString().split('T')[0]}.csv"`
        } 
      });
    } else {
      // Default to JSON
      const responseData: any = {};
      
      // Include metadata if requested
      if (options.includeMetadata) {
        responseData.metadata = {
          exportDate: new Date().toISOString(),
          collections: collectionsToFetch,
          format,
          dateRange
        };
      }
      
      // Include stats if requested
      if (options.includeStats) {
        responseData.stats = {
          totalItems: allData.length,
          collections: collectionsToFetch,
          itemsPerCollection: collectionResults
        };
      }
      
      // Add the actual data
      responseData.data = collectionData;
      
      return new Response(JSON.stringify(responseData), { 
        headers: { ...headers } 
      });
    }
  } catch (error) {
    console.error('Export error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate export', 
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers }
    );
  }
} 