import type { APIRoute } from 'astro';

// The staging outer middleware authorizes and handles this route before EmDash setup/auth.
export const POST: APIRoute = () => new Response('Not found', { status: 404 });
