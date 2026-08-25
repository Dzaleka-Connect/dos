import type { APIRoute } from 'astro';
import { createGetHandler, createOptionsHandler, createPostHandler } from '../../utils/api-utils';

// Server-rendered so the shared rate-limit, CORS, versioning and
// problem+json error handling actually runs per request. Prerendering
// this route would emit a static blob with none of those headers.
export const prerender = false;

// Define the handlers using the utility functions
export const GET: APIRoute = createGetHandler('marketplace');
export const OPTIONS: APIRoute = createOptionsHandler();
export const POST: APIRoute = createPostHandler('marketplace');
