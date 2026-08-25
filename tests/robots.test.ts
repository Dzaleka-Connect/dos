import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const robots = readFileSync(resolve(__dirname, '../public/robots.txt'), 'utf8');

type Group = { agents: string[]; allow: string[]; disallow: string[]; signal?: string };

/**
 * Parse robots.txt into RFC 9309 groups. Consecutive User-agent lines share one
 * rule set; a rule line closes the group's agent list.
 */
function parseGroups(text: string): Group[] {
  const groups: Group[] = [];
  let current: Group | null = null;
  let collectingAgents = false;

  for (const raw of text.split('\n')) {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const field = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();

    if (field === 'user-agent') {
      if (!current || !collectingAgents) {
        current = { agents: [], allow: [], disallow: [] };
        groups.push(current);
        collectingAgents = true;
      }
      current.agents.push(value);
    } else if (current) {
      collectingAgents = false;
      if (field === 'allow') current.allow.push(value);
      else if (field === 'disallow') current.disallow.push(value);
      else if (field === 'content-signal') current.signal = value;
    }
  }
  return groups;
}

const groups = parseGroups(robots);
const wildcard = groups.find((g) => g.agents.includes('*'))!;

function parseSignal(value: string): Record<string, string> {
  return Object.fromEntries(
    value.split(',').map((pair) => pair.trim().split('=').map((s) => s.trim()))
  );
}

describe('robots.txt structure', () => {
  it('defines a wildcard group', () => {
    expect(wildcard).toBeDefined();
    expect(wildcard.allow).toContain('/');
  });

  it('protects the private areas in the wildcard group', () => {
    expect(wildcard.disallow).toContain('/admin/');
    expect(wildcard.disallow).toContain('/private/');
  });

  it('lists the sitemaps as absolute URLs', () => {
    const sitemaps = robots.split('\n').filter((l) => l.startsWith('Sitemap:'));
    expect(sitemaps.length).toBeGreaterThan(0);
    for (const line of sitemaps) {
      expect(line).toMatch(/^Sitemap: https:\/\/services\.dzaleka\.com\/\S+$/);
    }
  });
});

describe('named agent groups', () => {
  const named = groups.filter((g) => !g.agents.includes('*'));

  it('names the agents an access audit checks for', () => {
    const all = named.flatMap((g) => g.agents).map((a) => a.toLowerCase());
    for (const agent of [
      'chatgpt-user',
      'oai-searchbot',
      'gptbot',
      'claudebot',
      'claude-user',
      'google-extended',
      'googlebot',
      'perplexitybot',
      'deepseekbot',
      'ora-agent',
    ]) {
      expect(all, agent).toContain(agent);
    }
  });

  it('grants named agents the same access as the wildcard group', () => {
    for (const group of named) {
      expect(group.allow, group.agents[0]).toEqual(wildcard.allow);
    }
  });

  /**
   * Under RFC 9309 a crawler obeys ONLY its most specific matching group and
   * does not inherit the wildcard group's rules. A named group that omits the
   * disallows would therefore hand those agents /admin/ and /private/.
   */
  it('repeats every wildcard disallow in each named group', () => {
    for (const group of named) {
      for (const path of wildcard.disallow) {
        expect(group.disallow, `${group.agents[0]} must disallow ${path}`).toContain(path);
      }
    }
  });

  it('repeats the content signal in each named group, since signals are per-group', () => {
    for (const group of named) {
      expect(group.signal, group.agents[0]).toBe(wildcard.signal);
    }
  });
});

describe('content signals', () => {
  it('declares all three signals with valid values', () => {
    const signals = parseSignal(wildcard.signal!);
    expect(Object.keys(signals).sort()).toEqual(['ai-input', 'ai-train', 'search']);
    for (const [name, value] of Object.entries(signals)) {
      expect(value, name).toMatch(/^(yes|no)$/);
    }
  });

  it('permits AI grounding, because that is what the API and MCP server exist for', () => {
    expect(parseSignal(wildcard.signal!)['ai-input']).toBe('yes');
  });

  it('permits search indexing', () => {
    expect(parseSignal(wildcard.signal!).search).toBe('yes');
  });

  it('withholds permission to train models on community content', () => {
    expect(parseSignal(wildcard.signal!)['ai-train']).toBe('no');
  });
});

describe('discovery pointers', () => {
  it('points agents at the discovery surfaces', () => {
    for (const path of [
      '/llms.txt',
      '/.well-known/mcp',
      '/.well-known/api-catalog',
      '/api/openapi.json',
      '/api/deprecation-policy',
    ]) {
      expect(robots, path).toContain(path);
    }
  });
});
