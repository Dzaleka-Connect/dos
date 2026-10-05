import { expect, it, vi } from 'vitest';
import { Kysely } from 'kysely';
import { createDialect } from 'emdash/db/sqlite';
import { runMigrations } from 'emdash/db';
import { applySeed, type SeedFile } from 'emdash/seed';
import { ContentRepository, handleContentCreate, handleContentPublish, type Database } from 'emdash';
import { getDb } from 'emdash/runtime';
import { publishedItems } from '../src/lib/news/published';
import { publicMetadata } from '../src/lib/news/public-contract.mjs';
import { buildSeed } from '../scripts/emdash/seed.mjs';

vi.mock('emdash/runtime', () => ({ getDb: vi.fn() }));
it('hydrates real saved SEO into the public feed while excluding drafts and pending changes', async () => {
  const db = new Kysely<Database>({ dialect: createDialect({ url: ':memory:' }) });
  vi.mocked(getDb).mockResolvedValue(db);
  try {
    await runMigrations(db);
    const seed = await buildSeed({ fullTextSearch: false });
    await applySeed(db, { ...seed, content: {} } as SeedFile);
    for (const collection of ['news', 'events', 'jobs', 'services'] as const) {
      const created = await handleContentCreate(db, collection, { slug: 'feed-test', status: 'draft', data: seed.content[collection][0].data,
        seo: { title: 'Saved SEO title', description: 'Saved description', canonical: '/canonical', image: 'seo/cover.png', noIndex: true } });
      if (!created.success) throw new Error(created.error.message);
      expect(await publishedItems(collection)).toHaveLength(0);
      const result = await handleContentPublish(db, collection, created.data.item.id);
      expect(result.success).toBe(true);
      await new ContentRepository(db).updateDraftAware(collection, created.data.item.id, { data: { title: 'PRIVATE PENDING TITLE' } });
      const rows = await publishedItems(collection);
      expect(rows).toHaveLength(1);
      const entry = publicMetadata[collection](rows[0]);
      expect(entry.seo).toEqual({ title: 'Saved SEO title', description: 'Saved description', canonical: '/canonical', image: 'https://cms.dzaleka.com/_dos/public/media/seo/cover.png', noIndex: true });
      expect(entry.data.title).not.toBe('PRIVATE PENDING TITLE');
    }
  } finally { await db.destroy(); }
}, 30000);
