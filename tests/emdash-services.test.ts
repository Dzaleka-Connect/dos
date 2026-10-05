import { afterEach, describe, expect, it, vi } from 'vitest';
import { readdir, readFile } from 'node:fs/promises';
import matter from 'gray-matter';
import { slug } from 'github-slugger';
import { buildSeed, newCollectionsOnly } from '../scripts/emdash/seed.mjs';
import { importMarkdown } from '../scripts/emdash/markdown.mjs';
import { serviceEntry } from '../scripts/emdash/services.mjs';
import { serviceMetadata, entryMedia, referencedMediaKeys } from '../src/lib/news/public-contract.mjs';
import { getEntries, NewsUnavailable } from '../src/lib/news/public-client.mjs';

afterEach(() => vi.unstubAllGlobals());
const compact = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(compact);
  if (!value || typeof value !== 'object') return value;
  const entries = Object.entries(value).filter(([, item]) => item !== undefined && item !== '').map(([key, item]) => [key, compact(item)]);
  return entries.length ? Object.fromEntries(entries) : undefined;
};
const spans = (value: unknown): string => Array.isArray(value) ? value.map(spans).join(' ')
  : value && typeof value === 'object' ? Object.entries(value).map(([key, item]) => key === 'text' && typeof item === 'string' ? item : spans(item)).join(' ') : '';
const normalise = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');

describe('Services CMS migration', () => {
  it('preserves every listing, slug, field and body from the source directory', async () => {
    const seed = await buildSeed();
    const files = (await readdir('src/content/services')).filter(file => file.endsWith('.md'));
    expect(seed.content.services).toHaveLength(files.length);
    expect(files.length).toBeGreaterThan(100);
    for (const file of files) {
      const source = matter(await readFile(`src/content/services/${file}`, 'utf8'));
      const entry = seed.content.services.find(item => item.slug === (source.data.slug || slug(file.replace(/\.md$/, ''))));
      expect(entry, file).toBeDefined();
      expect(entry!.status).toBe('published');
      const exported: Record<string, unknown> = serviceMetadata(entry!).data;
      for (const [key, value] of Object.entries(source.data)) {
        if (key === 'slug') continue;
        if (key === 'socialMedia' && value && typeof value === 'object' && 'Tiktok' in value) { value.tiktok = value.Tiktok; delete value.Tiktok; }
        const expected = ['lastUpdated', 'date'].includes(key) ? new Date(String(value)).toISOString() : compact(value);
        expect(compact(exported[key === 'verifed' ? 'verified' : key]), `${file}: ${key}`).toEqual(expected);
      }
      const imported = normalise(spans(entry!.data.content));
      for (const line of source.content.split('\n').filter(line => !/^\s*(\||<|!\[)/.test(line))) {
        const text = normalise(line.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/^\s*(\d+\.|[-*+])\s+/, ''));
        if (text.length > 20) expect(imported, `${file}: ${line}`).toContain(text);
      }
    }
    const pending = newCollectionsOnly(seed, new Set(['news', 'events', 'jobs']));
    expect(Object.keys(pending.content)).toEqual(['services']);
    expect(pending.collections.map((collection: { slug: string }) => collection.slug)).toEqual(['services']);
  });

  it('retains mixed image paragraphs and emphasis captions', () => {
    const body = importMarkdown('Before ![Logo](https://example.org/logo.png) after.\n\n<em>Caption text</em>');
    expect(body.map(block => block._type)).toEqual(['block', 'image', 'block', 'block']);
    expect(normalise(spans(body))).toContain('beforeaftercaptiontext');
    expect(JSON.stringify(body)).toContain('https://example.org/logo.png');
    expect(JSON.stringify(body)).toContain('em');
  });

  it('round-trips optional access, hours and provider confirmation without leaking private fields', () => {
    const data = { title: 'Test', description: 'Test service', category: 'Education',
      access: { eligibility: 'Everyone', fees: 'Free', documents: 'None', appointment: 'Walk in', languages: ['English', 'French'], accessibility: 'Step-free' },
      providerConfirmation: { by: 'Service coordinator', date: '2026-10-01', sourceUrl: 'https://example.org' },
      businessHours: [{ day: 'Monday', open: '08:00', close: '16:00', closed: false }],
    };
    const entry = serviceEntry({ name: 'test.md', slug: 'test', markdown: 'Details', data });
    const result = serviceMetadata({ ...entry, authorId: 'PRIVATE', data: { ...entry.data, internal_notes: 'SECRET' } });
    expect(result.data.access).toEqual(data.access);
    expect(result.data.businessHours).toEqual(data.businessHours);
    expect(result.data.providerConfirmation).toEqual({ ...data.providerConfirmation, date: '2026-10-01T00:00:00.000Z' });
    expect(JSON.stringify(result)).not.toMatch(/SECRET|PRIVATE|internal_notes|authorId/);
    expect(result.data.lastUpdated).toBeUndefined();
  });

  it('includes uploaded logos in public media references', () => {
    const data = { logo: { provider: 'local', id: 'logo-row', meta: { storageKey: 'logos/example.png' } }, content: [], private_attachment: { id: 'private.pdf' } };
    expect([...referencedMediaKeys(entryMedia('services', data))]).toContain('logos/example.png');
    expect([...referencedMediaKeys(entryMedia('services', data))]).not.toContain('private.pdf');
    expect(serviceMetadata({ slug: 'example', data }).data.logo).toBe('https://cms.dzaleka.com/_dos/public/media/logos/example.png');
  });

  it('loads listings without dates and revives optional dates safely', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ version: 1, entries: [
      { id: 'no-date', data: { title: 'No date' } },
      { id: 'confirmed', data: { title: 'Confirmed', lastUpdated: '2026-10-01T00:00:00Z', providerConfirmation: { by: 'Provider', date: '2026-10-01T00:00:00Z' } } },
    ] })));
    const entries = await getEntries('services');
    expect(entries[0].data.lastUpdated).toBeUndefined();
    expect(entries[1].data.lastUpdated).toBeInstanceOf(Date);
    expect(entries[1].data.providerConfirmation.date).toBeInstanceOf(Date);
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ version: 1, entries: [{ id: 'bad', data: { title: 'Bad date', lastUpdated: 'nope' } }] })));
    await expect(getEntries('services')).rejects.toBeInstanceOf(NewsUnavailable);
  });
});
