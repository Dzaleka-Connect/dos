import { getCollection } from 'astro:content';

const baseUrl = 'https://services.dzaleka.com';

const EXCLUDED_STATIC_ROUTES = new Set([
  '/404',
  '/api-test',
  '/test-api',
  '/test-resources',
]);

const EXCLUDED_ROUTE_PREFIXES = [
  '/api/',
  '/applications/internal/',
  '/staff/',
];

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

const toAbsoluteUrl = (pathname) => new URL(pathname, baseUrl).toString();

const toDateString = (value) => {
  if (!value) {
    return new Date().toISOString().split('T')[0];
  }

  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime())
    ? new Date().toISOString().split('T')[0]
    : parsed.toISOString().split('T')[0];
};

const toStaticRoute = (filePath) => {
  if (!filePath.endsWith('.astro') || filePath.includes('/[')) {
    return null;
  }

  let route = filePath
    .replace('/src/pages', '')
    .replace(/\.astro$/, '')
    .replace(/\/index$/, '');

  if (!route) {
    route = '/';
  }

  if (EXCLUDED_STATIC_ROUTES.has(route)) {
    return null;
  }

  if (EXCLUDED_ROUTE_PREFIXES.some((prefix) => route.startsWith(prefix))) {
    return null;
  }

  return route;
};

const publicPageModules = import.meta.glob('/src/pages/**/*.astro', { eager: true });

export async function GET() {
  const urls = new Map();

  const addUrl = (pathname, lastmod) => {
    if (!pathname || EXCLUDED_STATIC_ROUTES.has(pathname)) {
      return;
    }

    if (EXCLUDED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
      return;
    }

    urls.set(pathname, {
      loc: toAbsoluteUrl(pathname),
      lastmod: toDateString(lastmod),
    });
  };

  for (const filePath of Object.keys(publicPageModules)) {
    const route = toStaticRoute(filePath);
    if (route) {
      addUrl(route);
    }
  }

  const collectionRoutes = [
    { name: 'community-voices', buildPath: (entry) => `/community-voices/${entry.id}`, lastmod: (entry) => entry.data.date },
    { name: 'courses', buildPath: (entry) => `/e-learning/courses/${entry.id}`, lastmod: (entry) => entry.data.lastUpdated || entry.data.datePublished },
    { name: 'dancers', buildPath: (entry) => `/dancers/${entry.id}` },
    { name: 'docs', buildPath: (entry) => `/docs/${entry.id}`, lastmod: (entry) => entry.data.lastUpdated },
    { name: 'events', buildPath: (entry) => `/events/${entry.id}`, lastmod: (entry) => entry.data.endDate || entry.data.date },
    { name: 'inspirational-stories', buildPath: (entry) => `/inspirational-stories/${entry.id}`, lastmod: (entry) => entry.data.date },
    { name: 'jobs', buildPath: (entry) => `/jobs/${entry.id}`, lastmod: (entry) => entry.data.posted || entry.data.deadline },
    { name: 'marketplace', buildPath: (entry) => `/marketplace/${entry.id}`, lastmod: (entry) => entry.data.datePosted },
    { name: 'news', buildPath: (entry) => `/news/${entry.id}`, lastmod: (entry) => entry.data.date },
    { name: 'photos', buildPath: (entry) => `/photos/${entry.id}`, lastmod: (entry) => entry.data.date },
    { name: 'poets', buildPath: (entry) => `/poets/${entry.id}` },
    { name: 'projects', buildPath: (entry) => `/projects/${entry.id}` },
    { name: 'resources', buildPath: (entry) => `/resources/${entry.id}`, lastmod: (entry) => entry.data.lastUpdated || entry.data.date },
    { name: 'rights', buildPath: (entry) => `/rights-navigator/${entry.id}`, lastmod: (entry) => entry.data.date },
    { name: 'services', buildPath: (entry) => `/services/${entry.id}`, lastmod: (entry) => entry.data.lastUpdated },
    { name: 'sites', buildPath: (entry) => `/site-register/${entry.id}` },
    { name: 'stores', buildPath: (entry) => `/marketplace/stores/${entry.id}`, lastmod: (entry) => entry.data.dateJoined },
    { name: 'stories', buildPath: (entry) => `/stories/${entry.id}`, lastmod: (entry) => entry.data.date },
    { name: 'artworks', buildPath: (entry) => `/public-art-catalogue/${entry.id}` },
    { name: 'artists', buildPath: (entry) => `/public-art-catalogue/artist/${entry.data.slug || entry.id}` },
  ];

  for (const collectionConfig of collectionRoutes) {
    const entries = await getCollection(collectionConfig.name);
    for (const entry of entries) {
      addUrl(collectionConfig.buildPath(entry), collectionConfig.lastmod?.(entry));
    }
  }

  const sitemapEntries = [...urls.values()]
    .sort((left, right) => left.loc.localeCompare(right.loc))
    .map(({ loc, lastmod }) => `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${xmlEscape(lastmod)}</lastmod>
  </url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
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
