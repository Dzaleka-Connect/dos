import { describe, it, expect } from 'vitest';
import remarkContentHeadings from '../src/plugins/remark-content-headings.mjs';

describe('content headings', () => {
  it('keeps the page template as the only top-level heading without changing section anchors or text', () => {
    const title = { type: 'heading', depth: 1, data: { id: 'profile' }, children: [{ type: 'text', value: 'Profile' }] };
    const section = { type: 'heading', depth: 2, children: [{ type: 'text', value: 'Contact' }] };
    const tree = { type: 'root', children: [title, section] };
    remarkContentHeadings()(tree, { path: '/project/src/content/profiles/person.md' });
    expect(title).toEqual({ type: 'heading', depth: 2, data: { id: 'profile' }, children: [{ type: 'text', value: 'Profile' }] });
    expect(section.depth).toBe(2);
  });
  it('preserves standalone Markdown documents outside the content collections', () => {
    const tree = { type: 'root', children: [{ type: 'heading', depth: 1 }] };
    remarkContentHeadings()(tree, { path: '/project/README.md' });
    expect(tree.children[0].depth).toBe(1);
  });
  it('removes a repeated record title while retaining the first content section', () => {
    const section = { type: 'heading', depth: 2, children: [{ type: 'text', value: 'History' }] };
    const tree = { type: 'root', children: [{ type: 'heading', depth: 1, children: [{ type: 'text', value: 'Camp ' }, { type: 'emphasis', children: [{ type: 'text', value: 'Market' }] }] }, section] };
    remarkContentHeadings()(tree, { path: '/project/src/content/sites/market.md', data: { astro: { frontmatter: { title: 'Camp Market' } } } });
    expect(tree.children).toEqual([section]);
  });
  it('keeps a distinct opening heading in a record', () => {
    const tree = { type: 'root', children: [{ type: 'heading', depth: 1, children: [{ type: 'text', value: 'Background' }] }] };
    remarkContentHeadings()(tree, { path: '/project/src/content/artworks/mural.md', data: { astro: { frontmatter: { title: 'Mural' } } } });
    expect(tree.children).toHaveLength(1);
    expect(tree.children[0].depth).toBe(2);
  });
});
