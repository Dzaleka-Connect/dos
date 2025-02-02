export async function get() {
  const baseUrl = 'https://services.dzaleka.com';
  
  // Get all pages from your content collections
  const pages = await import.meta.glob([
    '../content/**/*.md',
    '../content/**/*.mdx',
    './pages/**/*.astro'
  ]);

  const urls = Object.keys(pages).map(path => {
    // Convert file path to URL
    const url = path
      .replace('../content/', '')
      .replace('./pages/', '')
      .replace(/\.(md|mdx|astro)$/, '')
      .replace(/\/index$/, '');

    return `
    <url>
      <loc>${baseUrl}/${url}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>`;
  });

  // Add static pages
  const staticPages = [
    '',
    'about',
    'services',
    'resources',
    'news',
    'contact'
  ].map(page => `
    <url>
      <loc>${baseUrl}/${page}</loc>
      <changefreq>weekly</changefreq>
      <priority>${page === '' ? '1.0' : '0.8'}</priority>
    </url>`
  );

  return {
    body: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages.join('')}
    ${urls.join('')}
</urlset>`,
    headers: {
      'Content-Type': 'application/xml'
    }
  };
}
