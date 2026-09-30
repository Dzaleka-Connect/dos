import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { liveCollections } from '../../src/lib/news/live-collections.mjs';

export function newsViteConfig() {
  return {
    // Keep EmDash's Zod 4 alongside DOS's Zod 3 when the CMS is bundled for SSR.
    ssr: { noExternal: ['zod'] },
    environments: { prerender: { resolve: { noExternal: ['zod'] } } },
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: 'dos-emdash-tailwind',
            async Once(root, { result }) {
              // EmDash ships compiled Tailwind 4 CSS; DOS still compiles Tailwind 3.
              if (root.source?.input.file?.replaceAll('\\', '/').includes('/node_modules/')) return;
              const compiled = await postcss([tailwindcss()]).process(root, result.opts);
              result.messages.push(...compiled.messages);
            },
          },
          autoprefixer(),
        ],
      },
    },
    resolve: {
      alias: {
        '@dos/news': fileURLToPath(new URL('../../src/lib/news/cms.ts', import.meta.url)),
        '@dos/news-body': fileURLToPath(new URL('../../src/lib/news/CmsBody.astro', import.meta.url)),
        '@dos/news-live': fileURLToPath(new URL('../../src/lib/news/live.ts', import.meta.url)),
      },
    },
  };
}

// Pages that read each CMS collection. They render on request once the collection is live.
const pagesByCollection = {
  news: ['news/', 'index.astro', 'encyclopedia/[slug].astro', 'staff/index.astro', 'dashboard.astro',
    'dzaleka-wellbeing.astro', 'api/rss.ts', 'api/search-index.json.ts', 'news-sitemap.xml.js', 'sitemap.xml.js'],
  events: ['events/', 'index.astro', 'staff/index.astro', 'dashboard.astro', 'api/search-index.json.ts', 'sitemap.xml.js',
    'datasets/', 'open-data-platform.astro'],
  jobs: ['jobs/', 'grants-and-programs.astro', 'staff/index.astro', 'dashboard.astro', 'api/search-index.json.ts',
    'sitemap.xml.js', 'datasets/', 'open-data-platform.astro'],
};

export function usesLiveNews(component) {
  const page = component.replaceAll('\\', '/').split('/pages/')[1];
  if (!page) return false;
  return liveCollections.some(name => (pagesByCollection[name] || []).some(entry => entry.endsWith('/') ? page.startsWith(entry) : page === entry));
}
