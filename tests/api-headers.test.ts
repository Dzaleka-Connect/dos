import { describe, it, expect, beforeEach } from 'vitest';
import {
  API_VERSION,
  MAX_REQUESTS_PER_WINDOW,
  apiHeaders,
  checkRateLimit,
  corsHeaders,
  getClientIP,
  rateLimitHeaders,
  resetRateLimitState,
} from '../src/utils/api-headers';

function requestFrom(ip: string, url = 'https://services.dzaleka.com/api/services') {
  return new Request(url, { headers: { 'x-forwarded-for': ip } });
}

beforeEach(() => {
  resetRateLimitState();
});

describe('client IP resolution', () => {
  it('prefers the first x-forwarded-for hop', () => {
    const request = new Request('https://services.dzaleka.com/api/services', {
      headers: { 'x-forwarded-for': '203.0.113.7, 70.41.3.18' },
    });
    expect(getClientIP(request)).toBe('203.0.113.7');
  });

  it('falls back through x-real-ip and cf-connecting-ip', () => {
    const realIp = new Request('https://x.test/api', { headers: { 'x-real-ip': '198.51.100.4' } });
    expect(getClientIP(realIp)).toBe('198.51.100.4');
    const cf = new Request('https://x.test/api', { headers: { 'cf-connecting-ip': '198.51.100.9' } });
    expect(getClientIP(cf)).toBe('198.51.100.9');
  });

  it('returns "unknown" when no proxy header is present', () => {
    expect(getClientIP(new Request('https://x.test/api'))).toBe('unknown');
  });
});

describe('rate-limit headers', () => {
  it('advertises the full budget before any request is counted', () => {
    const headers = rateLimitHeaders(requestFrom('203.0.113.10'));
    expect(headers['RateLimit-Limit']).toBe(String(MAX_REQUESTS_PER_WINDOW));
    expect(headers['RateLimit-Remaining']).toBe(String(MAX_REQUESTS_PER_WINDOW));
    expect(headers['RateLimit-Policy']).toBe(`${MAX_REQUESTS_PER_WINDOW};w=60`);
    expect(headers['API-Version']).toBe(API_VERSION);
  });

  it('reports RateLimit-Reset as seconds remaining, not a timestamp', () => {
    const headers = rateLimitHeaders(requestFrom('203.0.113.11'));
    const reset = Number(headers['RateLimit-Reset']);
    expect(reset).toBeGreaterThan(0);
    expect(reset).toBeLessThanOrEqual(60);
  });

  it('keeps the legacy X-RateLimit-Reset as an epoch timestamp', () => {
    const headers = rateLimitHeaders(requestFrom('203.0.113.12'));
    expect(Number(headers['X-RateLimit-Reset'])).toBeGreaterThan(Date.now() - 1000);
  });

  it('decrements remaining as the budget is consumed', () => {
    const ip = '203.0.113.13';
    checkRateLimit(requestFrom(ip));
    checkRateLimit(requestFrom(ip));
    const headers = rateLimitHeaders(requestFrom(ip));
    expect(Number(headers['RateLimit-Remaining'])).toBe(MAX_REQUESTS_PER_WINDOW - 2);
  });

  it('tracks each client IP separately', () => {
    checkRateLimit(requestFrom('203.0.113.14'));
    const other = rateLimitHeaders(requestFrom('203.0.113.15'));
    expect(other['RateLimit-Remaining']).toBe(String(MAX_REQUESTS_PER_WINDOW));
  });
});

describe('checkRateLimit', () => {
  it('allows requests inside the window', () => {
    expect(checkRateLimit(requestFrom('203.0.113.20'))).toBeNull();
  });

  it('returns a 429 problem document once the budget is exhausted', async () => {
    const ip = '203.0.113.21';
    for (let i = 0; i < MAX_REQUESTS_PER_WINDOW; i += 1) {
      expect(checkRateLimit(requestFrom(ip))).toBeNull();
    }
    const blocked = checkRateLimit(requestFrom(ip));
    expect(blocked).not.toBeNull();
    expect(blocked!.status).toBe(429);
    expect(blocked!.headers.get('Content-Type')).toContain('application/problem+json');
    // Retry-After is what lets an agent back off correctly.
    const retryAfter = Number(blocked!.headers.get('Retry-After'));
    expect(retryAfter).toBeGreaterThan(0);
    expect(blocked!.headers.get('RateLimit-Remaining')).toBe('0');
    const body = await blocked!.json();
    expect(body.code).toBe('rate_limited');
    expect(body.resolution).toContain('Retry-After');
  });
});

describe('apiHeaders', () => {
  it('merges CORS, rate limit and version headers', () => {
    const headers = apiHeaders(requestFrom('203.0.113.30'));
    expect(headers['Access-Control-Allow-Origin']).toBe('*');
    expect(headers['RateLimit-Limit']).toBe(String(MAX_REQUESTS_PER_WINDOW));
    expect(headers['API-Version']).toBe(API_VERSION);
  });

  it('exposes the rate-limit headers to browser clients', () => {
    const exposed = corsHeaders['Access-Control-Expose-Headers'];
    for (const name of ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset', 'Retry-After', 'API-Version']) {
      expect(exposed).toContain(name);
    }
  });

  it('lets callers add headers such as Allow', () => {
    const headers = apiHeaders(requestFrom('203.0.113.31'), { Allow: 'GET, POST, OPTIONS' });
    expect(headers.Allow).toBe('GET, POST, OPTIONS');
  });
});
