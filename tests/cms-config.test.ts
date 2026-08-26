import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { z } from 'zod';
import { collections } from '../src/content.config';

/**
 * The CMS writes frontmatter; Astro validates it with Zod at build time.
 *
 * A field that drifts between the two does not fail in the editor. It fails the
 * next build, after someone has already published, and the article silently
 * fails to appear. These tests are the guard for that.
 */

const root = resolve(__dirname, '..');
const config = parse(readFileSync(resolve(root, 'public/admin/config.yml'), 'utf8'));
const adminHtml = readFileSync(resolve(root, 'public/admin/index.html'), 'utf8');

const newsCollection = config.collections.find((c: any) => c.name === 'news');
const cmsFields: any[] = newsCollection.fields;
const cmsByName = new Map(cmsFields.map((f) => [f.name, f]));

/** The live Zod schema Astro will validate against. */
const newsSchema = (collections as any).news.schema as z.ZodObject<any>;
const zodShape = newsSchema.shape;

/** Zod marks optional fields via isOptional(); everything else is required. */
function zodRequired(key: string): boolean {
  return !zodShape[key].isOptional();
}

/** `body` is the Markdown content below the frontmatter, not a schema field. */
const NON_FRONTMATTER_FIELDS = new Set(['body']);

describe('admin page', () => {
  it('is excluded from search indexes', () => {
    expect(adminHtml).toMatch(/<meta name="robots" content="noindex/);
  });

  /** Sveltia is pre-1.0 and ships several releases a week. */
  it('pins an exact CMS version rather than tracking latest', () => {
    const src = adminHtml.match(/<script src="([^"]+)"/)?.[1];
    expect(src, 'no script tag found').toBeTruthy();
    expect(src).toMatch(/@sveltia\/cms@\d+\.\d+\.\d+\//);
    expect(src, 'must not float to @latest').not.toMatch(/@sveltia\/cms\/dist/);
  });

  it('loads the CMS bundle over https', () => {
    expect(adminHtml).toMatch(/src="https:\/\//);
  });
});

describe('backend', () => {
  it('commits to this repository and branch', () => {
    expect(config.backend.name).toBe('github');
    expect(config.backend.repo).toBe('Dzaleka-Connect/dos');
    expect(config.backend.branch).toBe('main');
  });

  it('does not use the deprecated Git Gateway backend', () => {
    expect(config.backend.name).not.toBe('git-gateway');
  });
});

describe('media paths resolve to the URLs articles already use', () => {
  it('writes uploads where the site serves images from', () => {
    expect(config.media_folder).toBe('public/images');
    expect(config.public_folder).toBe('/images');
  });

  it('agrees with the image paths in existing articles', () => {
    // Existing entries reference `/images/...`; uploads must match.
    expect(config.public_folder).toBe('/images');
    expect(`public${config.public_folder}`).toBe(config.media_folder);
  });
});

describe('the news collection points at the real content', () => {
  it('targets the directory the news collection loads from', () => {
    expect(newsCollection.folder).toBe('src/content/news');
  });

  it('writes the same on-disk format as the existing articles', () => {
    expect(newsCollection.format).toBe('yaml-frontmatter');
    expect(newsCollection.extension).toBe('md');
  });

  it('lets editors create entries', () => {
    expect(newsCollection.create).toBe(true);
  });
});

describe('CMS fields match the Zod schema', () => {
  const schemaKeys = Object.keys(zodShape);

  it('offers an editor field for every schema key', () => {
    const missing = schemaKeys.filter((k) => !cmsByName.has(k));
    expect(missing, `schema keys with no CMS field: ${missing.join(', ')}`).toEqual([]);
  });

  it('defines no field the schema will reject', () => {
    const extra = cmsFields
      .map((f) => f.name)
      .filter((n) => !NON_FRONTMATTER_FIELDS.has(n) && !schemaKeys.includes(n));
    expect(extra, `CMS fields absent from the schema: ${extra.join(', ')}`).toEqual([]);
  });

  /**
   * A field required by Zod but optional in the CMS is the dangerous direction:
   * the editor saves happily and the build then fails.
   */
  it.each(Object.keys(zodShape))('marks %s required exactly as the schema does', (key) => {
    const field = cmsByName.get(key)!;
    // Sveltia treats `required` as true when omitted.
    const cmsRequired = field.required !== false;
    expect(cmsRequired, `${key}: CMS required=${cmsRequired}, Zod required=${zodRequired(key)}`).toBe(
      zodRequired(key)
    );
  });

  it('carries the Markdown body field, which is content rather than frontmatter', () => {
    const body = cmsByName.get('body');
    expect(body).toBeDefined();
    expect(body!.widget).toBe('markdown');
    expect(zodShape).not.toHaveProperty('body');
  });
});

describe('the category select matches the schema enum exactly', () => {
  const enumValues: string[] = (zodShape.category as any).options ?? [...(zodShape.category as any)._def.values];
  const optionValues: string[] = cmsByName.get('category')!.options.map((o: any) => o.value);

  it('offers every value the schema allows', () => {
    expect([...optionValues].sort()).toEqual([...enumValues].sort());
  });

  /** An unlisted value would be saved by the editor and rejected at build. */
  it('offers no value the schema would reject', () => {
    for (const value of optionValues) {
      expect(enumValues, `"${value}" is not in the schema enum`).toContain(value);
    }
  });

  it('gives every option a human-readable label', () => {
    for (const option of cmsByName.get('category')!.options) {
      expect(option.label, option.value).toBeTruthy();
    }
  });
});

describe('date handling', () => {
  /**
   * Existing articles store `date: 2026-04-20`. Without picker_utc the stored
   * date can shift a day depending on the editor's timezone.
   */
  it('stores publication date as a UTC-fixed date, with no time component', () => {
    const date = cmsByName.get('date')!;
    expect(date.widget).toBe('datetime');
    expect(date.type).toBe('date');
    expect(date.picker_utc).toBe(true);
  });

  it('applies the same treatment to the optional updated date', () => {
    const updated = cmsByName.get('updated')!;
    expect(updated.type).toBe('date');
    expect(updated.picker_utc).toBe(true);
    expect(updated.required).toBe(false);
  });
});

describe('nested and list fields', () => {
  it('models contactInfo as an object with the schema keys', () => {
    const contact = cmsByName.get('contactInfo')!;
    expect(contact.widget).toBe('object');
    const nested = contact.fields.map((f: any) => f.name).sort();
    const zodNested = Object.keys((zodShape.contactInfo as any).unwrap().shape).sort();
    expect(nested).toEqual(zodNested);
  });

  it('models tags as a list', () => {
    expect(cmsByName.get('tags')!.widget).toBe('list');
  });
});

describe('scope', () => {
  /**
   * The encyclopedia requires cited sources and a review date on every entry.
   * That record belongs in reviewable pull requests, not a web form.
   */
  it('manages only the news collection', () => {
    expect(config.collections.map((c: any) => c.name)).toEqual(['news']);
  });
});
