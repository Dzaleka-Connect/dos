import { describe, expect, it } from 'vitest';
import { parseHTML } from 'linkedom';
import { essentials, guideLanguages, sectionsFor, unhcrContact } from '../src/data/essentials';
import { escapeHtml, renderEssentialsDownload } from '../src/utils/essentialsDownload';

describe('offline essentials', () => {
  it.each(guideLanguages)('keeps %s readable offline with the same complete guide and contacts', lang => {
    const html = renderEssentialsDownload(lang);
    const { document } = parseHTML(html);
    expect(document.documentElement.lang).toBe(lang);
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    expect(document.querySelector('h1')?.textContent).toBe(essentials[lang].title);
    for (const section of sectionsFor(lang)) expect(document.body.textContent).toContain(section.body);
    expect(document.body.textContent).toContain(unhcrContact.phone);
    expect(document.querySelector('a[href="mailto:mlwli@unhcr.org"]')).not.toBeNull();
    expect(document.querySelectorAll('script, img, iframe, link[rel="stylesheet"], audio, video')).toHaveLength(0);
    expect(html).not.toMatch(/@import|url\(/);
    expect(Buffer.byteLength(html)).toBeLessThan(15000);
    for (const anchor of document.querySelectorAll('a')) expect(anchor.getAttribute('href')).toMatch(/^(https:\/\/|mailto:|tel:)/);
  });
  it('escapes content in the standalone HTML document', () => {
    expect(escapeHtml('<img src="x" onerror=\'alert(1)\'> &')).toBe('&lt;img src=&quot;x&quot; onerror=&#39;alert(1)&#39;&gt; &amp;');
  });
});
