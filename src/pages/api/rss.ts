import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async () => {
  try {
    const siteUrl = 'https://services.dzaleka.com';
    const localNews = await getCollection('news');

    // Fetch live Blogger RSS feed from dzaleka.com
    let externalItemsXml = '';
    try {
      const res = await fetch('https://www.dzaleka.com/feeds/posts/default?alt=rss', {
        headers: { 'User-Agent': 'DzalekaOnlineServices/1.0' },
      });
      if (res.ok) {
        const xml = await res.text();
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;
        while ((match = itemRegex.exec(xml)) !== null) {
          externalItemsXml += `\n    ${match[0]}`;
        }
      }
    } catch (e) {
      console.warn('Could not fetch remote dzaleka.com Blogger RSS feed:', e);
    }

    const localItemsXml = localNews
      .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
      .slice(0, 15)
      .map((entry) => {
        const link = `${siteUrl}/news/${entry.id}`;
        const pubDate = new Date(entry.data.date).toUTCString();

        return `
    <item>
      <title>${escapeXml(entry.data.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(entry.data.description)}</description>
      <category>${escapeXml(entry.data.category)}</category>
    </item>`;
      })
      .join('');

    const data = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xmlns:thr="http://purl.org/syndication/thread/1.0">
  <channel>
    <title>Dzaleka Online RSS Feed</title>
    <link>${siteUrl}/news</link>
    <description>Latest news, community updates, and records from Dzaleka Online Services.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${localItemsXml}${externalItemsXml}
  </channel>
</rss>`;

    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error) {
    console.error('Error generating combined RSS feed:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate combined RSS feed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
