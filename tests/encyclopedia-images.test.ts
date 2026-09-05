import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import matter from 'gray-matter';

describe('encyclopedia image references', () => {
  it('ships every local header and gallery image referenced by an entry', () => {
    const root = resolve('src/content/encyclopedia');
    const missing: string[] = [];
    for (const file of readdirSync(root).filter((name) => /\.mdx?$/.test(name))) {
      const { data } = matter(readFileSync(resolve(root, file), 'utf8'));
      const images = [data.image, ...(data.gallery || []).map((image: { src: string }) => image.src)].filter(Boolean);
      for (const image of images) {
        const url = new URL(image, 'https://services.dzaleka.com');
        if (url.origin === 'https://services.dzaleka.com' && !existsSync(resolve('public', `.${decodeURIComponent(url.pathname)}`))) missing.push(`${file}: ${image}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
