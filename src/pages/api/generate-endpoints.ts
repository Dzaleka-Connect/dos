import fs from 'fs';
import path from 'path';

// Define all available collections
const collections = [
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

// Template for API endpoint
const endpointTemplate = (collection: string) => `import type { APIRoute } from 'astro';
import { createGetHandler, createOptionsHandler, createPostHandler } from '../../utils/api-utils';

// Define the handlers using the utility functions
export const GET: APIRoute = createGetHandler('${collection}');
export const OPTIONS: APIRoute = createOptionsHandler();
export const POST: APIRoute = createPostHandler('${collection}');
`;

// Generate endpoints for all collections
async function generateEndpoints() {
  const apiDir = path.join(process.cwd(), 'src', 'pages', 'api');
  
  // Ensure the API directory exists
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }
  
  // Generate endpoint files for each collection
  for (const collection of collections) {
    const filePath = path.join(apiDir, `${collection}.ts`);
    fs.writeFileSync(filePath, endpointTemplate(collection));
    console.log(`Generated API endpoint for ${collection}`);
  }
  
  console.log('All API endpoints generated successfully!');
}

// Run the generator
generateEndpoints().catch(console.error);

// This is a utility script, not an API endpoint
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: 'This is a utility script to generate API endpoints. Please run it using the Node.js runtime.'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}; 