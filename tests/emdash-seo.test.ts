import { describe, expect, it } from 'vitest';
import { contentSeo, publicUrl } from '../src/lib/news/content-seo';
import { entryMedia, publicMetadata, referencedMediaKeys } from '../src/lib/news/public-contract.mjs';

describe('CMS SEO public boundary', () => {
  for (const [collection, metadata] of Object.entries(publicMetadata)) {
    it(`preserves every SEO field and authorizes the SEO image for ${collection}`, () => {
      const seo = { title: 'Editor title', description: 'Editor description', image: 'social/cover.webp',
        canonical: '/preferred-url', noIndex: true, internal_notes: 'private' };
      const item = { slug: 'example', data: { title: 'Content title' }, seo };
      const exported = metadata(item);
      expect(exported.seo).toEqual({ title: seo.title, description: seo.description,
        image: 'https://cms.dzaleka.com/_dos/public/media/social/cover.webp', canonical: '/preferred-url', noIndex: true });
      expect(contentSeo(exported.seo)).toEqual({ ...exported.seo, canonical: 'https://services.dzaleka.com/preferred-url' });
      expect(referencedMediaKeys(entryMedia(collection, item.data, seo)).has('social/cover.webp')).toBe(true);
      expect(referencedMediaKeys(entryMedia(collection, item.data)).has('social/cover.webp')).toBe(false);
    });
  }

  it('handles uploaded, external and root-relative images without exposing private fields', () => {
    for (const image of ['/_emdash/api/media/file/cover.png', 'https://cms.dzaleka.com/_emdash/api/media/file/cover.png', 'cover.png']) {
      expect(publicMetadata.news({ data: {}, seo: { image } }).seo?.image).toBe('https://cms.dzaleka.com/_dos/public/media/cover.png');
    }
    expect(publicMetadata.news({ data: {}, seo: { image: '/images/public.png' } }).seo?.image).toBe('https://services.dzaleka.com/images/public.png');
    expect(publicMetadata.news({ data: {}, seo: { image: 'https://example.org/cover.png' } }).seo?.image).toBe('https://example.org/cover.png');
    expect(publicMetadata.news({ data: {}, seo: { image: 'backups/private.zip' } }).seo?.image).toBeUndefined();
    expect(publicMetadata.news({ data: {}, seo: { image: '/_emdash/api/media/file/backups/private.zip' } }).seo?.image).toBeUndefined();
    expect([...referencedMediaKeys(entryMedia('news', {}, { image: 'https://cms.dzaleka.com/_dos/public/media/%broken' }))]).toEqual([]);
  });

  it('uses only safe URLs and preserves explicit editorial text', () => {
    expect(contentSeo({ title: ' A precise title ', description: 'x'.repeat(250), canonical: 'news/preferred', image: '//example.org/a.png' }))
      .toEqual({ title: 'A precise title', description: 'x'.repeat(250), canonical: 'https://services.dzaleka.com/news/preferred', image: 'https://example.org/a.png', noIndex: false });
    for (const value of [undefined, null, '', 'javascript:alert(1)', 'data:text/html,no']) expect(publicUrl(value)).toBeUndefined();
    expect(contentSeo(undefined).noIndex).toBe(false);
    expect(contentSeo({ noIndex: true }).noIndex).toBe(true);
  });
});
