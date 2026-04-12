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
    const newsEntries = await getCollection('news');
    const siteUrl = 'https://services.dzaleka.com';
    const items = newsEntries
      .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
      .slice(0, 20)
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
<rss version="2.0">
  <channel>
    <title>Dzaleka Online Services News</title>
    <link>${siteUrl}/news</link>
    <description>Latest community updates, announcements, and stories from Dzaleka Online Services.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300'
      }
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate RSS feed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
