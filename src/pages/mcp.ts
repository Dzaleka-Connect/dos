import type { APIRoute } from 'astro';
import {
  GET as wellKnownGet,
  HEAD as wellKnownHead,
  OPTIONS as wellKnownOptions,
  POST as wellKnownPost,
} from './.well-known/mcp';

export const prerender = false;

/**
 * /mcp - alias for /.well-known/mcp.
 *
 * `/.well-known/mcp` is the discovery path, but many MCP clients and directories
 * expect the server at a bare `/mcp`. Both paths run the same handlers so the
 * two can never diverge; /.well-known/mcp remains the canonical URL published
 * in the server card, the API catalog, and llms.txt.
 */
export const GET: APIRoute = wellKnownGet;
export const HEAD: APIRoute = wellKnownHead;
export const POST: APIRoute = wellKnownPost;
export const OPTIONS: APIRoute = wellKnownOptions;
