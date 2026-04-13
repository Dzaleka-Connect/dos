import { getCollection } from 'astro:content';

const baseUrl = 'https://services.dzaleka.com';
const publicationName = 'Dzaleka Online Services';
const publicationLanguage = 'en';

const xmlEscape = (value) =>
  String(value).replace(/[<>&'"]/g, (character) => {
    switch (character) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return character;
    }
  });

export async function GET() {
  const allNews = await getCollection('news');
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 2);

  const recentNews = allNews
    .filter((entry) => new Date(entry.data.date) >= cutoff)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .slice(0, 1000);

  const entries = recentNews
    .map((entry) => {
      const loc = `${baseUrl}/news/${entry.id}`;
      return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>${xmlEscape(publicationName)}</news:name>
        <news:language>${xmlEscape(publicationLanguage)}</news:language>
      </news:publication>
      <news:publication_date>${xmlEscape(entry.data.date.toISOString())}</news:publication_date>
      <news:title>${xmlEscape(entry.data.title)}</news:title>
    </news:news>
  </url>`;
    })
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries}
</urlset>`,
    {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    }
  );
}
