/**
 * CORS, versioning and rate-limit headers for the public API.
 *
 * Deliberately free of Astro imports so the OpenAPI generator and the unit
 * tests can use it without pulling in the content layer.
 */

import { problemResponse } from './api-errors';
import { DEPRECATION_POLICY_PATH, deprecationHeaders } from './api-deprecation';

/**
 * Current API version. Agents may pin to this via the `API-Version` request
 * header; it is echoed on every response. See /api-docs#versioning for the
 * deprecation policy (Deprecation + Sunset headers, 6 month minimum notice).
 */
export const API_VERSION = '1.0.0';

/** CORS headers for all API endpoints. */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, API-Version',
  'Access-Control-Expose-Headers':
    'RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, RateLimit-Policy, Retry-After, API-Version, Deprecation, Sunset, Link',
  'Content-Type': 'application/json'
};

export const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
export const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/** Resolve the client IP across common proxy headers. */
export function getClientIP(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}

/**
 * Rate-limit headers for a successful response, so agents can self-throttle
 * before they are cut off. Emits the RFC-style `RateLimit-*` names alongside
 * the legacy `X-RateLimit-*` names for older clients.
 */
export function rateLimitHeaders(request: Request): Record<string, string> {
  const clientIP = getClientIP(request);
  const now = Date.now();
  const data = rateLimitMap.get(clientIP);
  const expired = !data || now > data.resetTime;
  const resetTime = expired ? now + RATE_LIMIT_WINDOW : data!.resetTime;
  const used = expired ? 0 : data!.count;
  const remaining = Math.max(MAX_REQUESTS_PER_WINDOW - used, 0);
  const resetSeconds = Math.max(Math.ceil((resetTime - now) / 1000), 0);

  return {
    'RateLimit-Limit': String(MAX_REQUESTS_PER_WINDOW),
    'RateLimit-Remaining': String(remaining),
    'RateLimit-Reset': String(resetSeconds),
    'RateLimit-Policy': `${MAX_REQUESTS_PER_WINDOW};w=${RATE_LIMIT_WINDOW / 1000}`,
    'X-RateLimit-Limit': String(MAX_REQUESTS_PER_WINDOW),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(resetTime),
    'API-Version': API_VERSION,
  };
}

/**
 * Standard headers for any API response: CORS, rate limit, version, and the
 * Deprecation/Sunset signals when the requested path is being retired.
 *
 * Deprecation headers are applied here rather than per-route so an endpoint
 * starts advertising its retirement the moment it is added to DEPRECATIONS,
 * with no change to the route itself.
 */
export function apiHeaders(request: Request, extra: Record<string, string> = {}) {
  let deprecation: Record<string, string> = {};
  try {
    const { pathname, origin } = new URL(request.url);
    deprecation = deprecationHeaders(pathname, `${origin}${DEPRECATION_POLICY_PATH}`);
  } catch {
    // A malformed request URL must not break an otherwise valid response.
  }
  return { ...corsHeaders, ...rateLimitHeaders(request), ...deprecation, ...extra };
}

/**
 * Rate limiting for API endpoints, keyed by client IP.
 * @returns null if allowed, an RFC 9457 problem Response if rate limited.
 */
export function checkRateLimit(request: Request): Response | null {
  const clientIP = getClientIP(request);
  const now = Date.now();
  const rateLimitData = rateLimitMap.get(clientIP);

  // Clean up expired entries periodically
  if (Math.random() < 0.01) { // 1% chance to clean up
    for (const [ip, data] of rateLimitMap.entries()) {
      if (now > data.resetTime) {
        rateLimitMap.delete(ip);
      }
    }
  }

  if (!rateLimitData || now > rateLimitData.resetTime) {
    // First request or window expired
    rateLimitMap.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return null;
  }

  if (rateLimitData.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((rateLimitData.resetTime - now) / 1000);
    return problemResponse(
      'rate_limited',
      `Rate limit of ${MAX_REQUESTS_PER_WINDOW} requests per minute exceeded. Retry in ${retryAfter}s.`,
      {
        ...corsHeaders,
        'Retry-After': retryAfter.toString(),
        'RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
        'RateLimit-Remaining': '0',
        'RateLimit-Reset': retryAfter.toString(),
        'RateLimit-Policy': `${MAX_REQUESTS_PER_WINDOW};w=${RATE_LIMIT_WINDOW / 1000}`,
        'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': rateLimitData.resetTime.toString(),
        'API-Version': API_VERSION,
      }
    );
  }

  rateLimitData.count++;
  return null;
}

/** Test-only hook: clear accumulated rate-limit state. */
export function resetRateLimitState() {
  rateLimitMap.clear();
}
