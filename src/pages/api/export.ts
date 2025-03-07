import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Define the collections we know exist in the project
const VALID_COLLECTIONS = [
  'services', 'resources', 'photos', 'events', 
  'talents', 'jobs', 'docs', 'community-voices', 
  'profiles', 'news', 'pages', 'skills'
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
    // Use any type to bypass TypeScript's strict checking
    // This is necessary because we're accepting user input for collection names
    return await getCollection(collectionName as any);
  } catch (error) {
    console.warn(`Warning: Could not fetch collection "${collectionName}": ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

// Helper function to convert data to CSV
function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  // Get all unique keys from all objects
  const allKeys = new Set<string>();
  data.forEach(item => {
    Object.keys(item).forEach(key => allKeys.add(key));
  });
  
  const headers = Array.from(allKeys);
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  data.forEach(item => {
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
}

// Helper function to filter data by date range
function filterByDateRange(data: any[], dateRange: { start: string | null; end: string | null }) {
  if (!dateRange.start && !dateRange.end) return data;
  
  const startDate = dateRange.start ? new Date(dateRange.start) : null;
  const endDate = dateRange.end ? new Date(dateRange.end) : null;
  
  return data.filter(item => {
    // Try to find a date field (created, updated, publishDate, etc.)
    const dateField = item.publishDate || item.created || item.updated || item.date;
    if (!dateField) return true; // If no date field, include the item
    
    try {
      const itemDate = new Date(dateField);
      
      // Check if date is within range
      if (startDate && itemDate < startDate) return false;
      if (endDate && itemDate > endDate) return false;
      
      return true;
    } catch (e) {
      // If date parsing fails, include the item
      return true;
    }
  });
}

// Helper function to prepare collection data
async function prepareCollectionData(collectionName: string) {
  try {
    const collection = await safeGetCollection(collectionName);
    
    // Extract relevant properties from collection items
    return collection.map((item: any) => {
      try {
        // Extract data based on collection type
        const baseData: Record<string, any> = {
          id: item.id,
          collection: collectionName,
        };
        
        // Safely add slug if it exists
        if ('slug' in item) {
          baseData.slug = item.slug;
        }
        
        // Add data from frontmatter or content
        if ('data' in item) {
          // Use a try-catch to handle any potential issues with data
          try {
            return { ...baseData, ...item.data };
          } catch (e) {
            console.warn(`Warning: Error processing data for item ${item.id} in collection ${collectionName}`);
            return baseData;
          }
        }
        
        return baseData;
      } catch (e) {
        console.warn(`Warning: Error processing item in collection ${collectionName}: ${e}`);
        return { id: item.id || 'unknown', collection: collectionName };
      }
    });
  } catch (error) {
    console.error(`Error preparing data for collection ${collectionName}:`, error);
    return [];
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const requestData = await request.json();
    
    // Extract request parameters
    const { 
      format = 'json', 
      collections = ['all'], 
      dateRange = { start: null, end: null },
      options = { includeMetadata: true, includeStats: false }
    } = requestData;
    
    // Validate format
    if (format !== 'json' && format !== 'csv') {
      return new Response(
        JSON.stringify({ error: 'Invalid format. Supported formats: json, csv' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Determine which collections to export
    let collectionsToExport: string[] = [];
    
    if (collections.includes('all')) {
      collectionsToExport = [...VALID_COLLECTIONS];
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
          JSON.stringify({ error: 'No valid collections specified' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      collectionsToExport = validCollections;
    }
    
    // Fetch and prepare data from all collections
    const allData: any[] = [];
    
    for (const collectionName of collectionsToExport) {
      try {
        const collectionData = await prepareCollectionData(collectionName);
        if (collectionData && Array.isArray(collectionData)) {
          allData.push(...collectionData);
        }
      } catch (error) {
        console.error(`Error processing collection ${collectionName}:`, error);
        // Continue with other collections instead of failing the entire export
      }
    }
    
    // Filter data by date range
    const filteredData = filterByDateRange(allData, dateRange);
    
    // Check if we have any data
    if (filteredData.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No data found for the selected collections and filters',
          collections: collectionsToExport
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Add metadata if requested
    if (options.includeMetadata) {
      // Add metadata here if needed
    }
    
    // Add stats if requested
    let responseData: any = filteredData;
    if (options.includeStats) {
      const stats = {
        totalItems: filteredData.length,
        collectionCounts: {} as Record<string, number>
      };
      
      // Count items per collection
      filteredData.forEach(item => {
        const collection = item.collection;
        if (collection) {
          stats.collectionCounts[collection] = (stats.collectionCounts[collection] || 0) + 1;
        }
      });
      
      // Wrap data with stats
      responseData = {
        data: filteredData,
        stats
      };
    }
    
    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const collectionPart = collections.includes('all') ? 'all' : collections.join('-');
    const filename = `export_${collectionPart}_${timestamp}.${format}`;
    
    // Return data in requested format
    if (format === 'csv') {
      // For CSV, we need to flatten the data if it includes stats
      const dataToConvert = options.includeStats ? responseData.data : responseData;
      
      try {
        const csvData = convertToCSV(dataToConvert);
        
        return new Response(csvData, {
          status: 200,
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${filename}"`
          }
        });
      } catch (error) {
        console.error('Error converting data to CSV:', error);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to convert data to CSV format', 
            message: error instanceof Error ? error.message : 'Unknown error'
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // JSON format
      try {
        return new Response(JSON.stringify(responseData, null, 2), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="${filename}"`
          }
        });
      } catch (error) {
        console.error('Error converting data to JSON:', error);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to convert data to JSON format', 
            message: error instanceof Error ? error.message : 'Unknown error'
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  } catch (error) {
    console.error('Export error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate export', 
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 