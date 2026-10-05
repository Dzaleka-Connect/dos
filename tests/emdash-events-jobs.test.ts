import { afterEach, describe, expect, it, vi } from 'vitest';
import { readdir, readFile } from 'node:fs/promises';
import matter from 'gray-matter';
import { slug } from 'github-slugger';
import { Kysely } from 'kysely';
import { createDialect } from 'emdash/db/sqlite';
import { runMigrations } from 'emdash/db';
import { applySeed, type SeedFile } from 'emdash/seed';
import { ContentRepository, type Database } from 'emdash';
import { buildSeed, newCollectionsOnly } from '../scripts/emdash/seed.mjs';
import { importMarkdown } from '../scripts/emdash/markdown.mjs';
import { eventMetadata, isPublicRead, jobMetadata, publicMetadata } from '../src/lib/news/public-contract.mjs';
import { getEntries, getEntry, NewsUnavailable } from '../src/lib/news/public-client.mjs';
import { cmsCollections, isLive, liveCollections } from '../src/lib/news/live-collections.mjs';
import { usesLiveNews } from '../scripts/emdash/shared-config.mjs';

afterEach(() => vi.unstubAllGlobals());

// Letters and digits only, so formatting marks do not affect the comparison.
const normalise = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');
const spanText = (value: unknown): string => Array.isArray(value) ? value.map(spanText).join(' ')
  : value && typeof value === 'object' ? Object.entries(value).map(([key, item]) => key === 'text' && typeof item === 'string' ? item : spanText(item)).join(' ') : '';

describe('Events and jobs import', () => {
  for (const [collection, dateField] of [['events', 'date'], ['jobs', 'posted']] as const) {
    it(`keeps every ${collection} slug, date and body`, async () => {
      const seed = await buildSeed();
      const files = (await readdir(`src/content/${collection}`)).filter((file) => file.endsWith('.md')).sort();
      expect(seed.content[collection]).toHaveLength(files.length);
      for (const file of files) {
        const original = matter(await readFile(`src/content/${collection}/${file}`, 'utf8'));
        const entry = seed.content[collection].find((item) => item.slug === (original.data.slug || slug(file.replace(/\.md$/, ''))));
        expect(entry, file).toBeDefined();
        expect(entry!.data[dateField]).toBe(new Date(original.data[dateField === 'date' ? 'date' : 'posted']).toISOString());
        // Every plain sentence of the Markdown body survives the import.
        const imported = normalise(spanText(entry!.data.content));
        const lines = original.content.split('\n')
          .filter((text) => !/^\s*(\||<|!\[)/.test(text))
          .map((text) => text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/^\s*(\d+\.|[-*+])\s+/, ''))
          .filter((text) => normalise(text).length > 20);
        for (const line of lines) expect(imported, `${file}: ${line.slice(0, 40)}`).toContain(normalise(line));
      }
    });
  }

  it('imports only collections the CMS does not have, so deleted news is never restored', async () => {
    const pending = newCollectionsOnly(await buildSeed(), new Set(['news']));
    expect(pending.collections.map((collection) => collection.slug)).toEqual(['events', 'jobs', 'services']);
    expect(Object.keys(pending.content).sort()).toEqual(['events', 'jobs', 'services']);
    expect(newCollectionsOnly(await buildSeed(), new Set(['news', 'events', 'jobs', 'services'])).collections).toHaveLength(0);
  });

  it('keeps unpublished job drafts out of the published list', async () => {
    const seed = await buildSeed();
    for (const job of seed.content.jobs) expect(job.status).toBe(job.data.job_status === 'draft' ? 'draft' : 'published');
  });

  it('imports video iframes as embeds and image paragraphs as images', () => {
    const blocks = importMarkdown('Intro text.\n\n<iframe src="https://www.youtube.com/embed/abcdefghijk" title="x"></iframe>\n\n![Poster](https://example.org/poster.jpg)');
    expect(blocks.map((block) => block._type)).toEqual(['block', 'embed', 'image']);
    expect(blocks[1]).toMatchObject({ url: 'https://www.youtube.com/embed/abcdefghijk', provider: 'youtube' });
    expect(() => importMarkdown('<iframe src="https://tracker.example/page"></iframe>')).toThrow('Review before importing');
  });

  it('adds events and jobs to a CMS that already has news, without touching news edits', async () => {
    const db = new Kysely<Database>({ dialect: createDialect({ url: ':memory:' }) });
    try {
      await runMigrations(db);
      const full = await buildSeed();
      const newsOnly = { ...full, collections: [full.collections[0]], content: { news: [full.content.news[0]] } };
      await applySeed(db, newsOnly as SeedFile, { includeContent: true, onConflict: 'skip' });
      const content = new ContentRepository(db);
      const article = await content.findBySlug('news', full.content.news[0].slug);
      await content.updateDraftAware('news', article!.id, { data: { title: 'Editor change' } });
      await content.publish('news', article!.id);
      await applySeed(db, full as SeedFile, { includeContent: true, onConflict: 'skip' });
      expect((await content.findById('news', article!.id))!.data.title).toBe('Editor change');
      const events = await content.findMany('events', { where: { status: 'published' }, limit: 100 });
      const jobs = await content.findMany('jobs', { where: { status: 'published' }, limit: 100 });
      expect(events.items).toHaveLength(full.content.events.length);
      expect(jobs.items).toHaveLength(full.content.jobs.filter((job) => job.status === 'published').length);
      const services = await content.findMany('services', { where: { status: 'published' }, limit: 100 });
      expect(services.nextCursor).toBeTruthy();
      const rest = await content.findMany('services', { where: { status: 'published' }, limit: 100, cursor: services.nextCursor });
      expect([...services.items, ...rest.items]).toHaveLength(full.content.services.length);
      const listing = services.items[0];
      await content.updateDraftAware('services', listing.id, { data: { title: 'Private service edit' } });
      expect((await content.findById('services', listing.id))?.data.title).toBe(listing.data.title);
      await content.publish('services', listing.id);
      expect((await content.findById('services', listing.id))?.data.title).toBe('Private service edit');
      await content.unpublish('services', listing.id);
      expect((await content.findById('services', listing.id))?.status).toBe('draft');
    } finally {
      await db.destroy();
    }
  });
});

describe('Events and jobs public boundary', () => {
  it('opens only the read routes of CMS collections', () => {
    for (const path of ['events.json', 'events/some-event', 'jobs.json', 'jobs/driver']) {
      expect(isPublicRead(new Request(`https://cms.dzaleka.com/_dos/public/${path}`))).toBe(true);
      expect(isPublicRead(new Request(`https://cms.dzaleka.com/_dos/public/${path}`, { method: 'PUT' }))).toBe(false);
    }
    expect(isPublicRead(new Request('https://cms.dzaleka.com/_dos/public/users.json'))).toBe(false);
    expect(Object.keys(publicMetadata).sort()).toEqual([...cmsCollections].sort());
  });

  it('exports reader fields only', () => {
    const event = eventMetadata({ slug: 'open-mic', id: 'row-1', authorId: 'admin', data: {
      title: 'Open mic', description: 'Poetry night', date: '2026-10-01T15:00:00Z', location: 'Dzaleka', category: 'arts',
      organizer: 'Tumaini Letu', event_status: 'upcoming', internal_notes: 'Private', contact: { email: 'a@b.org', secret: 'x' },
      registration: { required: true, url: 'https://example.org/register', token: 'private' },
    } });
    expect(event).toMatchObject({ id: 'open-mic', collection: 'events', data: { status: 'upcoming', contact: { email: 'a@b.org' } } });
    expect(JSON.stringify(event)).not.toMatch(/Private|row-1|admin|secret|token/);
    const job = jobMetadata({ slug: 'driver', id: 'row-2', data: {
      title: 'Driver', organization: 'NGO', location: 'Dowa', type: 'full-time', category: 'services', posted: '2026-09-01T00:00:00Z',
      job_status: 'closed', description: 'Drive', skills: ['driving', 3], contact: { email: 'jobs@ngo.org', password: 'x' }, notes: 'Private',
    } });
    expect(job).toMatchObject({ id: 'driver', collection: 'jobs', data: { status: 'closed', skills: ['driving'], contact: { email: 'jobs@ngo.org' } } });
    expect(JSON.stringify(job)).not.toMatch(/Private|row-2|password/);
  });

  it('reads events and jobs with real dates and fetches the body for one entry', async () => {
    const fetchMock = vi.fn(async (url: string) => url.endsWith('.json')
      ? Response.json({ version: 1, entries: [{ id: 'driver', data: { title: 'Driver', posted: '2026-09-01T00:00:00Z', deadline: '2026-10-01T00:00:00Z' } }] })
      : new Response('<html><body><div data-dos-article><p>Apply by email.</p></div></body></html>'));
    vi.stubGlobal('fetch', fetchMock);
    const [job] = await getEntries('jobs');
    expect(job.data.posted).toBeInstanceOf(Date);
    expect(job.data.deadline).toBeInstanceOf(Date);
    const { entry } = await getEntry('jobs', 'driver');
    expect(entry.html).toContain('Apply by email.');
    expect(fetchMock.mock.calls.map(([url]) => url)).toContain('https://cms.dzaleka.com/_dos/public/jobs/driver');
    await expect(getEntries('users')).rejects.toBeInstanceOf(NewsUnavailable);
  });
});

describe('Switching collections to the CMS', () => {
  it('keeps events and jobs on Markdown until they are switched on', () => {
    expect(liveCollections).toContain('news');
    for (const name of ['events', 'jobs']) {
      const pages = ['/x/src/pages/events/index.astro', '/x/src/pages/jobs/[slug].astro'];
      if (!isLive(name)) expect(pages.some((page) => page.includes(`/${name}/`) && usesLiveNews(page))).toBe(false);
    }
    expect(usesLiveNews('/x/src/pages/news/index.astro')).toBe(true);
  });
});
