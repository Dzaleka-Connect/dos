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
    const entries = (await getCollection('encyclopedia')).sort((a, b) =>
      new Date(b.data.lastReviewed).getTime() - new Date(a.data.lastReviewed).getTime()
    );

    const siteUrl = 'https://services.dzaleka.com';
    const items = entries
      .slice(0, 30)
      .map((entry) => {
        const link = `${siteUrl}/encyclopedia/${entry.id}`;
        const pubDate = new Date(entry.data.lastReviewed).toUTCString();

        return `
    <item>
      <title>${escapeXml(entry.data.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(entry.data.summary)}</description>
      <category>${escapeXml(entry.data.category)}</category>
    </item>`;
      })
      .join('');

    const data = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dzaleka Encyclopedia RSS Feed</title>
    <link>${siteUrl}/encyclopedia</link>
    <description>Community-maintained reference work documenting Dzaleka Refugee Camp's history, people, organizations, health, education, and public record.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/api/encyclopedia/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=900',
      },
    });
  } catch (error) {
    console.error('Error generating Encyclopedia RSS feed:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate Encyclopedia RSS feed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
