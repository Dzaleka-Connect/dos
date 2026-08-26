import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { z } from 'zod';
import { collections } from '../src/content.config';

/**
 * The CMS writes frontmatter; Astro validates it with Zod at build time.
 *
 * A field that drifts between the two does not fail in the editor. It fails the
 * next build, after someone has already published, and the entry silently fails
 * to appear. These tests are the guard for that, and they run against every
 * collection in the config rather than a named one, so adding a collection to
 * config.yml automatically brings it under the same checks.
 */

const root = resolve(__dirname, '..');
const config = parse(readFileSync(resolve(root, 'public/admin/config.yml'), 'utf8'));
const adminHtml = readFileSync(resolve(root, 'public/admin/index.html'), 'utf8');

/** `body` is the Markdown content below the frontmatter, not a schema field. */
const NON_FRONTMATTER_FIELDS = new Set(['body']);

const cmsCollections: any[] = config.collections;
const cmsCollectionNames: string[] = cmsCollections.map((c) => c.name);

/** Unwrap ZodOptional / ZodDefault to reach the underlying type. */
function unwrap(schema: any): any {
  let current = schema;
  while (current?._def?.innerType || typeof current?.unwrap === 'function') {
    if (current._def?.innerType) current = current._def.innerType;
    else if (typeof current.unwrap === 'function') current = current.unwrap();
    else break;
  }
  return current;
}

/** Enum values for a field, or null when it is not an enum. */
function enumValues(schema: any): string[] | null {
  const inner = unwrap(schema);
  const values = inner?.options ?? inner?._def?.values;
  return Array.isArray(values) ? [...values] : null;
}

function zodShapeFor(name: string): Record<string, any> {
  const collection = (collections as any)[name];
  return (collection.schema as z.ZodObject<any>).shape;
}

function fieldMap(collection: any): Map<string, any> {
  return new Map(collection.fields.map((f: any) => [f.name, f]));
}

/** Sveltia treats a field as required unless `required: false` is set. */
function cmsRequired(field: any): boolean {
  return field.required !== false;
}

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

describe('media paths resolve to the URLs entries already use', () => {
  it('writes uploads where the site serves images from', () => {
    expect(config.media_folder).toBe('public/images');
    expect(config.public_folder).toBe('/images');
  });

  it('keeps the repo path and the public URL in step', () => {
    expect(`public${config.public_folder}`).toBe(config.media_folder);
  });
});

describe('scope', () => {
  /**
   * The encyclopedia requires cited sources and a review date on every entry,
   * and its `charts` field references ids in campStatistics.ts that a free-text
   * CMS field could not validate. That record belongs in pull requests.
   */
  it('does not manage the encyclopedia', () => {
    expect(cmsCollectionNames).not.toContain('encyclopedia');
  });

  it('manages only collections that exist in the content config', () => {
    for (const name of cmsCollectionNames) {
      expect(collections, `no content collection named "${name}"`).toHaveProperty(name);
    }
  });
});

describe.each(cmsCollectionNames)('collection: %s', (name) => {
  const collection = cmsCollections.find((c) => c.name === name)!;
  const fields = fieldMap(collection);
  const shape = zodShapeFor(name);
  const schemaKeys = Object.keys(shape);

  it('points at a folder that exists', () => {
    expect(collection.folder).toBe(`src/content/${name}`);
    expect(existsSync(resolve(root, collection.folder))).toBe(true);
  });

  it('writes the same on-disk format as the existing entries', () => {
    expect(collection.format).toBe('yaml-frontmatter');
    expect(collection.extension).toBe('md');
  });

  it('lets editors create entries', () => {
    expect(collection.create).toBe(true);
  });

  it('offers an editor field for every schema key', () => {
    const missing = schemaKeys.filter((k) => !fields.has(k));
    expect(missing, `schema keys with no CMS field: ${missing.join(', ')}`).toEqual([]);
  });

  it('defines no field the schema will reject', () => {
    const extra = collection.fields
      .map((f: any) => f.name)
      .filter((n: string) => !NON_FRONTMATTER_FIELDS.has(n) && !schemaKeys.includes(n));
    expect(extra, `CMS fields absent from the schema: ${extra.join(', ')}`).toEqual([]);
  });

  /**
   * A field required by Zod but optional in the CMS is the dangerous direction:
   * the editor saves happily and the build then fails. Note that a Zod field
   * with `.default()` reports as optional, which is correct here since the
   * editor may leave it blank.
   */
  it('marks each field required exactly as the schema does', () => {
    const mismatches = schemaKeys
      .filter((key) => cmsRequired(fields.get(key)!) !== !shape[key].isOptional())
      .map((key) => `${key} (CMS=${cmsRequired(fields.get(key)!)}, Zod=${!shape[key].isOptional()})`);
    expect(mismatches, `required mismatch: ${mismatches.join(', ')}`).toEqual([]);
  });

  it('matches every schema enum exactly', () => {
    for (const key of schemaKeys) {
      const values = enumValues(shape[key]);
      if (!values) continue;
      const field = fields.get(key)!;
      // A free-text schema field may use a string widget; an enum must not.
      expect(field.widget, `${key} is an enum and needs a select`).toBe('select');
      const offered = field.options.map((o: any) => o.value);
      expect([...offered].sort(), `${key} options`).toEqual([...values].sort());
    }
  });

  it('gives every select option a human-readable label', () => {
    for (const field of collection.fields) {
      if (field.widget !== 'select') continue;
      for (const option of field.options) {
        expect(option.label, `${field.name}.${option.value}`).toBeTruthy();
      }
    }
  });

  /**
   * Existing entries store plain dates. Without picker_utc the stored value can
   * shift a day depending on the editor's timezone.
   */
  /**
   * Fixed to UTC so the stored value does not shift a day with the editor's
   * timezone. Deliberately does not require `type: date`: forcing date-only is
   * what discarded the time component on events.
   */
  it('fixes every date field to UTC', () => {
    for (const key of schemaKeys) {
      const inner = unwrap(shape[key]);
      const isDate = inner?._def?.typeName === 'ZodDate' || inner instanceof z.ZodDate;
      if (!isDate) continue;
      const field = fields.get(key)!;
      expect(field.widget, `${key}`).toBe('datetime');
      expect(field.picker_utc, `${key}`).toBe(true);
    }
  });

  it('models nested objects with the same keys as the schema', () => {
    for (const key of schemaKeys) {
      const inner = unwrap(shape[key]);
      if (!(inner instanceof z.ZodObject)) continue;
      const field = fields.get(key)!;
      expect(field.widget, `${key} is an object`).toBe('object');
      const cmsNested = field.fields.map((f: any) => f.name).sort();
      const zodNested = Object.keys(inner.shape).sort();
      expect(cmsNested, `${key} nested fields`).toEqual(zodNested);
    }
  });

  /**
   * A config-side invariant, so it holds even where the Zod type is not a plain
   * ZodDate. Photos and community voices wrap their date in a union and a
   * transform, which the Zod-driven check above cannot see through.
   */
  it('sets picker_utc on every date-only field in the config', () => {
    const offenders = collection.fields
      .filter((f: any) => f.widget === 'datetime' && f.type === 'date' && f.picker_utc !== true)
      .map((f: any) => f.name);
    expect(offenders, `date fields missing picker_utc: ${offenders.join(', ')}`).toEqual([]);
  });

  /**
   * Astro's frontmatter parser reads an unquoted `2026-01-31` as a Date. A
   * schema expecting a string would reject it and fail the build after an
   * editor published, so any date-bearing field must accept both forms.
   */
  it('accepts both a quoted string and a bare YAML date for every date field', () => {
    for (const field of collection.fields) {
      if (field.widget !== 'datetime') continue;
      const schema = shape[field.name];
      if (!schema) continue;
      expect(schema.safeParse('2026-01-31').success, `${field.name} rejects a quoted date string`).toBe(true);
      expect(schema.safeParse(new Date('2026-01-31')).success, `${field.name} rejects a bare YAML date`).toBe(true);
    }
  });

  /**
   * Sveltia writes an empty string for an optional field the editor has
   * cleared. `new Date('')` is an Invalid Date, so a coerced optional date
   * rejected it and broke the build after publishing. This happened in
   * production on registration.deadline.
   */
  it('treats an empty string as absent for every optional date field', () => {
    // Walks nested objects: the break in production was on
    // registration.deadline, which a top-level-only scan would have missed.
    const failures: string[] = [];

    const walk = (zodShape: Record<string, any>, cmsFields: any[], path: string) => {
      const byName = new Map(cmsFields.map((f: any) => [f.name, f]));
      for (const [key, schema] of Object.entries(zodShape)) {
        const field = byName.get(key);
        const here = path ? `${path}.${key}` : key;
        const inner = unwrap(schema);

        if (inner instanceof z.ZodObject && field?.fields) {
          walk(inner.shape, field.fields, here);
          continue;
        }
        if (!schema.isOptional() || field?.widget !== 'datetime') continue;
        if (!schema.safeParse('').success) failures.push(here);
      }
    };

    walk(shape, collection.fields, '');
    expect(
      failures,
      `these optional date fields reject the empty string a cleared field produces: ${failures.join(', ')}`
    ).toEqual([]);
  });

  /**
   * Configuring a field as `type: date` discards any time component on save.
   * Entries that carry a time must therefore not use date-only.
   */
  it('does not use date-only for fields whose entries carry a time', () => {
    const dir = resolve(root, collection.folder);
    const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
    for (const field of collection.fields) {
      if (field.widget !== 'datetime' || field.type !== 'date') continue;
      const withTime = files.filter((file) => {
        const text = readFileSync(resolve(dir, file), 'utf8');
        return new RegExp(`^${field.name}: .*T\\d{2}:\\d{2}`, 'm').test(text);
      });
      expect(
        withTime,
        `${field.name} is date-only but these entries carry a time: ${withTime.join(', ')}`
      ).toEqual([]);
    }
  });

  it('models arrays as lists', () => {
    for (const key of schemaKeys) {
      const inner = unwrap(shape[key]);
      if (!(inner instanceof z.ZodArray)) continue;
      expect(fields.get(key)!.widget, `${key} is an array`).toBe('list');
    }
  });
});
