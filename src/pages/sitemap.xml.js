export async function GET() {
  const baseUrl = 'https://services.dzaleka.com';
  
  // XML escaping function
  const escapeXml = (unsafe) => {
    if (typeof unsafe !== 'string') return '';
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  };

  // Service-specific categories with their priorities
  const serviceCategories = {
    'e-learning': { priority: '0.95', changefreq: 'daily' },
    'skills-exchange': { priority: '0.9', changefreq: 'daily' },
    'community-voices': { priority: '0.9', changefreq: 'daily' },
    'talents': { priority: '0.85', changefreq: 'weekly' },
    'applications': { priority: '0.85', changefreq: 'daily' },
    'jobs': { priority: '0.95', changefreq: 'daily' },
    'resources': { priority: '0.8', changefreq: 'weekly' },
    'updates': { priority: '0.9', changefreq: 'daily' },
    'culture': { priority: '0.8', changefreq: 'weekly' },
    'photo-gallery': { priority: '0.8', changefreq: 'weekly' },
    'success-stories': { priority: '0.85', changefreq: 'weekly' }
  };
  
  // Get all content files with their module imports
  const contentFiles = import.meta.glob([
    '/src/content/**/*.{md,mdx}',
    '/src/pages/**/*.astro'
  ], { eager: true });

  const urls = await Promise.all(
    Object.entries(contentFiles).map(async ([path, module]) => {
      // Get frontmatter/metadata from the content
      const frontmatter = module.frontmatter || {};
      const metadata = module.metadata || {};
      
      // Convert file path to URL
      const url = path
        .replace('/src/content/', '')
        .replace('/src/pages/', '')
        .replace(/\.(md|mdx|astro)$/, '')
        .replace(/\/index$/, '')
        .replace(/^\//, '');

      // Get last modified date from frontmatter or file metadata
      const lastmod = frontmatter.updatedDate || frontmatter.date || new Date().toISOString().split('T')[0];

      // Enhanced priority calculation for service pages
      let priority = '0.7';
      let changefreq = 'weekly';

      // Check if the page is in a service category
      const serviceCategory = Object.keys(serviceCategories).find(category => 
        url.startsWith(category) || path.includes(`/${category}/`)
      );

      if (serviceCategory) {
        priority = serviceCategories[serviceCategory].priority;
        changefreq = serviceCategories[serviceCategory].changefreq;
      } else {
        // Default priority rules
        if (url.split('/').length <= 2) priority = '0.8';
        if (path.includes('/content/')) priority = '0.6';
        if (path.includes('/news/') || path.includes('/updates/')) {
          changefreq = 'daily';
          priority = '0.85';
        }
        if (path.includes('/about/')) changefreq = 'monthly';
      }

      // Prepare image data if available
      const imageXml = frontmatter.image ? `
      <image:image>
        <image:loc>${escapeXml(baseUrl + frontmatter.image)}</image:loc>
        <image:title>${escapeXml(frontmatter.title || url)}</image:title>
        ${frontmatter.description ? `<image:caption>${escapeXml(frontmatter.description)}</image:caption>` : ''}
      </image:image>` : '';

      // Add news-specific metadata
      const newsXml = (path.includes('/news/') || path.includes('/updates/')) && frontmatter.title ? `
      <news:news>
        <news:publication>
          <news:name>Dzaleka Heritage Services</news:name>
          <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${escapeXml(lastmod)}</news:publication_date>
        <news:title>${escapeXml(frontmatter.title)}</news:title>
      </news:news>` : '';

      return `
    <url>
      <loc>${escapeXml(baseUrl + '/' + url)}</loc>
      <lastmod>${escapeXml(lastmod)}</lastmod>
      <changefreq>${changefreq}</changefreq>
      <priority>${priority}</priority>${imageXml}${newsXml}
    </url>`;
    })
  );

  // Enhanced static pages with service-focused priorities
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: 'services', priority: '0.95', changefreq: 'daily' },
    { url: 'e-learning', priority: '0.95', changefreq: 'daily' },
    { url: 'skills-exchange', priority: '0.9', changefreq: 'daily' },
    { url: 'jobs', priority: '0.95', changefreq: 'daily' },
    { url: 'community-voice', priority: '0.9', changefreq: 'daily' },
    { url: 'talents', priority: '0.85', changefreq: 'weekly' },
    { url: 'resources', priority: '0.8', changefreq: 'weekly' },
    { url: 'news', priority: '0.9', changefreq: 'daily' },
    { url: 'updates', priority: '0.9', changefreq: 'daily' },
    { url: 'culture', priority: '0.8', changefreq: 'weekly' },
    { url: 'photo-gallery', priority: '0.8', changefreq: 'weekly' },
    { url: 'success-stories', priority: '0.85', changefreq: 'weekly' },
    { url: 'about', priority: '0.8', changefreq: 'monthly' },
    { url: 'contact', priority: '0.8', changefreq: 'monthly' }
  ].map(page => `
    <url>
      <loc>${escapeXml(baseUrl + '/' + page.url)}</loc>
      <lastmod>${escapeXml(new Date().toISOString().split('T')[0])}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>`
  );

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
    ${staticPages.join('')}
    ${urls.join('')}
</urlset>`,
    {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    }
  );
}
