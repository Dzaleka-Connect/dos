import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

/**
 * Components that render inside the site header, above every page's h1.
 *
 * A heading tag here lands in the raw HTML of every page before the h1 is
 * reached, so the document outline opens at h3 and reads as flat to crawlers
 * and assistive tech, even though the markup is invisible at most viewports.
 * Style these like headings; do not mark them up as headings.
 */
const HEADER_COMPONENTS = ['src/components/WhatsNewWidget.astro'];

describe('site header components', () => {
  it.each(HEADER_COMPONENTS)('%s renders no heading tags', (file) => {
    const source = read(file);
    const headings = source.match(/<h[1-6][\s>]/gi) ?? [];
    expect(headings).toEqual([]);
  });

  it('the What’s New panel is still named for assistive tech', () => {
    const source = read('src/components/WhatsNewWidget.astro');
    // Dropping the heading must not drop the accessible name.
    expect(source).toContain('role="region"');
    expect(source).toMatch(/aria-labelledby="whats-new-panel-title"/);
    expect(source).toMatch(/id="whats-new-panel-title"/);
  });
});

describe('pages whose content is a client-only island', () => {
  it('the map page carries an h1 in server-rendered HTML', () => {
    const source = read('src/pages/map.astro');
    expect(source).toMatch(/<h1[^>]*>/);
  });
});

describe('list pages give their cards a section to sit under', () => {
  // These pages render h3 cards. Without an h2 the outline jumps h1 -> h3.
  it.each([
    ['src/pages/site-register.astro', 'Registered sites'],
    ['src/pages/news/index.astro', 'Featured story'],
  ])('%s has a section heading before its cards', (file, label) => {
    const source = read(file);
    expect(source).toContain(label);
    expect(source).toMatch(new RegExp(`<h2[^>]*sr-only[^>]*>${label}</h2>`));
  });
});
