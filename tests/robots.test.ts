import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const robots = readFileSync(resolve(__dirname, '../public/robots.txt'), 'utf8');

function contentSignal(): Record<string, string> {
  const line = robots.split('\n').find((l) => l.trim().startsWith('Content-Signal:'));
  if (!line) throw new Error('robots.txt has no Content-Signal line');
  return Object.fromEntries(
    line
      .slice(line.indexOf(':') + 1)
      .split(',')
      .map((pair) => pair.trim().split('=').map((s) => s.trim()))
  );
}

describe('robots.txt', () => {
  it('keeps the site crawlable while protecting private areas', () => {
    expect(robots).toMatch(/^User-agent: \*/m);
    expect(robots).toMatch(/^Allow: \/$/m);
    expect(robots).toMatch(/^Disallow: \/admin\//m);
    expect(robots).toMatch(/^Disallow: \/private\//m);
  });

  it('declares all three content signals with valid values', () => {
    const signals = contentSignal();
    expect(Object.keys(signals).sort()).toEqual(['ai-input', 'ai-train', 'search']);
    for (const [name, value] of Object.entries(signals)) {
      expect(value, name).toMatch(/^(yes|no)$/);
    }
  });

  it('permits AI grounding, because that is what the API and MCP server exist for', () => {
    // ai-input governs RAG/grounding. Setting it to `no` while publishing an MCP
    // server and /llms.txt would tell a compliant agent not to use either.
    expect(contentSignal()['ai-input']).toBe('yes');
  });

  it('permits search indexing', () => {
    expect(contentSignal().search).toBe('yes');
  });

  it('withholds permission to train models on community content', () => {
    expect(contentSignal()['ai-train']).toBe('no');
  });

  it('points agents at the discovery surfaces', () => {
    for (const path of ['/llms.txt', '/.well-known/mcp', '/.well-known/api-catalog', '/api/openapi.json']) {
      expect(robots, path).toContain(path);
    }
  });

  it('lists the sitemaps as absolute URLs', () => {
    const sitemaps = robots.split('\n').filter((l) => l.startsWith('Sitemap:'));
    expect(sitemaps.length).toBeGreaterThan(0);
    for (const line of sitemaps) {
      expect(line).toMatch(/^Sitemap: https:\/\/services\.dzaleka\.com\/\S+$/);
    }
  });
});
