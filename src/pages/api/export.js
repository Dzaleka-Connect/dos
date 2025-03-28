import { convertToCSV, addBOMToCSV, getCSVMimeType } from '../../utils/export-utils';

export async function post({ request }) {
  try {
    const body = await request.json();
    const { format = 'json', collections = [], options = {} } = body;
    
    // Get data for each collection
    const data = {};
    for (const collection of collections) {
      // Add your collection data fetching logic here
      // Example:
      data[collection] = await getCollectionData(collection);
    }

    // Add metadata if requested
    if (options.includeMetadata) {
      data.metadata = {
        exportDate: new Date().toISOString(),
        totalCollections: collections.length,
        // Add any other metadata
      };
    }

    // Add stats if requested
    if (options.includeStats) {
      data.stats = {
        totalItems: Object.values(data).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0),
        // Add any other stats
      };
    }

    // Return data in requested format
    if (format === 'csv') {
      const csvContent = convertToCSV(data, collections);
      const csvWithBOM = addBOMToCSV(csvContent);
      
      return new Response(csvWithBOM, {
        headers: {
          'Content-Type': getCSVMimeType(),
          'Content-Disposition': `attachment; filename="dzaleka-export-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // Default to JSON format
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Export error:', error);
    return new Response(JSON.stringify({ error: 'Export failed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// Helper function to get collection data
async function getCollectionData(collection) {
  try {
    // Map of available collections and their import paths
    const collectionPaths = {
      services: '../../content/services',
      resources: '../../content/resources',
      events: '../../content/events',
      photos: '../../content/photos',
      talents: '../../content/talents',
      jobs: '../../content/jobs',
      docs: '../../content/docs',
      'community-voices': '../../content/community-voices',
      profiles: '../../content/profiles',
      news: '../../content/news',
      pages: '../../content/pages'
    };

    // Check if collection exists in our map
    if (!collectionPaths[collection]) {
      console.warn(`Collection "${collection}" is not configured. Skipping.`);
      return [];
    }

    try {
      // Try to import the collection
      const { getCollection } = await import('astro:content');
      const data = await getCollection(collection);
      
      // Map the data to a simpler format
      return data.map(item => ({
        ...item.data,
        id: item.id,
        slug: item.slug
      }));
    } catch (importError) {
      console.warn(`Failed to import collection "${collection}":`, importError.message);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching ${collection} data:`, error);
    return [];
  }
} 