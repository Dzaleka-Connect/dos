import { describe, expect, it } from 'vitest';
import { readdir, readFile } from 'node:fs/promises';
import { lexer, type Tokens } from 'marked';
import matter from 'gray-matter';
import { slug } from 'github-slugger';
import { Kysely } from 'kysely';
import { createDialect } from 'emdash/db/sqlite';
import { runMigrations } from 'emdash/db';
import { applySeed, type SeedFile } from 'emdash/seed';
import { ContentRepository, RevisionRepository, UserRepository, portableTextToProsemirror, type Database, type PortableTextTableBlock, type PortableTextTextBlock } from 'emdash';
import { buildSeed } from '../scripts/emdash/seed.mjs';
import { importMarkdown } from '../scripts/emdash/markdown.mjs';

describe('News pilot import', () => {
  it('keeps site content unchanged when PostgreSQL omits SQLite-only full-text search', async () => {
    const local = await buildSeed();
    const staging = await buildSeed({ fullTextSearch: false });
    expect(local.collections[0].supports).toContain('search');
    expect(staging.collections[0].supports).not.toContain('search');
    const readableContent = (seed: Awaited<ReturnType<typeof buildSeed>>) => seed.content.news.map((entry) => ({
      ...entry, data: { ...entry.data, content: portableTextToProsemirror(entry.data.content) },
    }));
    const withoutGeneratedKeys = (value: unknown) => JSON.stringify(value, (key, item) => key === 'emdashKey' ? undefined : item);
    expect(withoutGeneratedKeys(readableContent(staging))).toBe(withoutGeneratedKeys(readableContent(local)));
  });
  it('preserves every existing slug, date, cover image and table', async () => {
    const seed = await buildSeed();
    const files = (await readdir('src/content/news')).filter((file) => file.endsWith('.md')).sort();
    expect(seed.content.news).toHaveLength(files.length);
    for (const file of files) {
      const original = matter(await readFile(`src/content/news/${file}`, 'utf8'));
      const entry = seed.content.news.find((item) => item.slug === (original.data.slug || slug(file.replace(/\.md$/, ''))));
      expect(entry, file).toBeDefined();
      if (!entry) throw new Error(`Missing ${file}`);
      expect(entry.data.date).toBe(new Date(original.data.date).toISOString());
      expect(entry.data.image?.src).toBe(original.data.image);
      const tables = lexer(original.content).filter((token): token is Tokens.Table => token.type === 'table');
      const importedTables = entry.data.content.filter((block) => block._type === 'table') as PortableTextTableBlock[];
      expect(importedTables).toHaveLength(tables.length);
      tables.forEach((table, index) => {
        expect(importedTables[index].rows).toHaveLength(table.rows.length + 1);
        expect(importedTables[index].rows[0].cells.every((cell) => cell.isHeader)).toBe(true);
      });
    }
  });

  it('retains nested links, emphasis, numbered lists and line breaks', () => {
    const blocks = importMarkdown('## Heading\n\n**[Read _more_](https://example.com)**  \nNext line\n\n3. Third\n4. Fourth') as PortableTextTextBlock[];
    expect(blocks[0].style).toBe('h2');
    expect(blocks[1].markDefs).toContainEqual(expect.objectContaining({ href: 'https://example.com' }));
    expect(blocks[1].children.some((span) => span.marks?.includes('strong'))).toBe(true);
    expect(blocks[1].children.some((span) => span.marks?.includes('em'))).toBe(true);
    expect(blocks[1].children.map((span) => span.text).join('')).toContain('\nNext line');
    expect(blocks[2].listItem).toBe('number');
  });

  it('stops on unsupported input instead of silently dropping content', () => {
    expect(() => importMarkdown('<iframe src="https://example.com"></iframe>')).toThrow('Review before importing');
  });

  it('keeps drafts private, publishes image changes, restores revisions and preserves CMS edits on reimport', async () => {
    const db = new Kysely<Database>({ dialect: createDialect({ url: ':memory:' }) });
    try {
      await runMigrations(db);
      const seed = await buildSeed();
      seed.content.news = [seed.content.news[0]];
      await applySeed(db, seed as SeedFile, { includeContent: true, onConflict: 'skip' });
      const content = new ContentRepository(db);
      const revisions = new RevisionRepository(db);
      const editor = await new UserRepository(db).create({ email: 'pilot-test@example.invalid', role: 'editor' });
      const article = await content.create({ type: 'news', slug: 'pilot-workflow-test', data: seed.content.news[0].data });
      expect((await content.findMany('news', { where: { status: 'published' } })).items.map((item) => item.id)).not.toContain(article.id);
      await content.publish('news', article.id);
      const published = await content.findById('news', article.id);
      const initial = await revisions.findById(published!.liveRevisionId!);
      const replacement = { provider: 'external', id: '', src: '/images/dzaleka-hero.jpeg', alt: 'Pilot cover' };
      await content.updateDraftAware('news', article.id, { data: { title: 'Unpublished edit', image: replacement } });
      const staged = await content.findById('news', article.id);
      expect(staged!.data.title).toBe(article.data.title);
      expect(staged!.draftRevisionId).not.toBe(staged!.liveRevisionId);
      await content.publish('news', article.id);
      const updated = await content.findById('news', article.id);
      expect(updated!.data.title).toBe('Unpublished edit');
      expect(updated!.data.image).toEqual(replacement);
      await content.restoreDraftRevision('news', article.id, initial!.data, editor.id);
      await content.publish('news', article.id);
      expect((await content.findById('news', article.id))!.data.title).toBe(article.data.title);
      await content.unpublish('news', article.id);
      expect((await content.findMany('news', { where: { status: 'published' } })).items.map((item) => item.id)).not.toContain(article.id);
      const seeded = await content.findBySlug('news', seed.content.news[0].slug);
      await content.updateDraftAware('news', seeded!.id, { data: { title: 'Editor-owned change' } });
      await content.publish('news', seeded!.id);
      await applySeed(db, seed as SeedFile, { includeContent: true, onConflict: 'skip' });
      expect((await content.findById('news', seeded!.id))!.data.title).toBe('Editor-owned change');
    } finally {
      await db.destroy();
    }
  });
});
