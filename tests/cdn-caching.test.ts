import { describe, expect, it } from 'vitest';
import { withCdnCaching } from '../src/utils/cdnCaching';

const page = (init: ResponseInit = {}) => new Response('<p>ok</p>', { status: 200, headers: { 'Content-Type': 'text/html' }, ...init });
const get = (path: string, method = 'GET') => new Request(`https://services.dzaleka.com${path}`, { method });

describe('CDN caching for pages rendered on request', () => {
  it('lets the CDN reuse public pages for a minute while browsers revalidate', () => {
    const response = withCdnCaching(get('/events'), '/events', page());
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=0, must-revalidate');
    expect(response.headers.get('Netlify-CDN-Cache-Control')).toContain('s-maxage=60');
    expect(response.headers.get('Netlify-Vary')).toBe('query');
  });

  it('never shares previews, errors, writes, agent Markdown or visitor-specific answers', () => {
    const cases = [
      withCdnCaching(get('/news/draft'), '/news/draft', page({ headers: { 'Cache-Control': 'private, no-store' } })),
      withCdnCaching(get('/events'), '/events', page({ status: 503 })),
      withCdnCaching(get('/api/submit-voice', 'POST'), '/api/submit-voice', page()),
      withCdnCaching(get('/events'), '/events', page(), true),
      withCdnCaching(get('/api/geolocation'), '/api/geolocation', page()),
      withCdnCaching(get('/api/analytics/pageviews'), '/api/analytics/pageviews', page()),
    ];
    for (const response of cases) expect(response.headers.get('Netlify-CDN-Cache-Control')).toBe('no-store');
    expect(cases[0].headers.get('Cache-Control')).toBe('private, no-store');
  });
});
