import { describe, it, expect } from 'vitest';
import { GET } from '../src/pages/llms.txt';

async function body() {
  const response = await (GET as any)({ request: new Request('https://services.dzaleka.com/llms.txt') });
  return { response, text: await response.text() };
}

describe('/llms.txt', () => {
  it('serves plain text with a cache header', async () => {
    const { response } = await body();
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/plain');
    expect(response.headers.get('Cache-Control')).toContain('max-age');
  });

  it('follows the llmstxt.org shape: H1 then a blockquote summary', async () => {
    const { text } = await body();
    const lines = text.split('\n');
    expect(lines[0]).toMatch(/^# /);
    expect(text).toMatch(/\n> /);
  });

  it('tells an agent when to use the site and when not to', async () => {
    const { text } = await body();
    expect(text).toContain('## When to use this');
    // The negative guidance is what stops an agent citing this site for the wrong question.
    expect(text).toMatch(/Do not use this site as a source for/);
  });

  it('names concrete use cases rather than generic marketing copy', async () => {
    const { text } = await body();
    const section = text.slice(text.indexOf('## When to use this'), text.indexOf('## How to call it'));
    for (const useCase of ['/api/services', '/api/encyclopedia', '/api/jobs', 'get-help-now']) {
      expect(section, useCase).toContain(useCase);
    }
  });

  it('documents the operational contract agents need', async () => {
    const { text } = await body();
    for (const fact of ['RateLimit-Limit', 'Retry-After', 'API-Version', 'problem+json', '60 requests per minute']) {
      expect(text, fact).toContain(fact);
    }
  });

  it('links the developer resources', async () => {
    const { text } = await body();
    for (const path of [
      '/api/openapi.json',
      '/api-docs',
      '/.well-known/api-catalog',
      '/.well-known/mcp',
      '/docs/agent-access-guide',
    ]) {
      expect(text, path).toContain(path);
    }
  });

  it('uses absolute URLs so the file works when copied out of context', async () => {
    const { text } = await body();
    const markdownLinks = [...text.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]);
    expect(markdownLinks.length).toBeGreaterThan(5);
    for (const link of markdownLinks) {
      expect(link, link).toMatch(/^https:\/\/services\.dzaleka\.com/);
    }
  });

  it('states the licence and attribution', async () => {
    const { text } = await body();
    expect(text).toContain('CC BY-SA');
  });

  it('states the same AI-usage stance that robots.txt publishes', async () => {
    const { text } = await body();
    // These two files must not contradict each other.
    expect(text).toContain('search=yes, ai-input=yes, ai-train=no');
  });

  it('points at the deprecation policy and names the RFCs', async () => {
    const { text } = await body();
    expect(text).toContain('/api/deprecation-policy');
    expect(text).toContain('RFC 9745');
    expect(text).toContain('RFC 8594');
  });

  it('points at the installable CLI', async () => {
    const { text } = await body();
    expect(text).toContain('pip install dzdk');
  });
});
