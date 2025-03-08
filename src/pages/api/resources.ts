import type { APIRoute } from 'astro';
import { createGetHandler, createOptionsHandler, createPostHandler } from '../../utils/api-utils';

// Define the handlers using the utility functions
export const GET: APIRoute = createGetHandler('resources');
export const OPTIONS: APIRoute = createOptionsHandler();
export const POST: APIRoute = createPostHandler('resources');
