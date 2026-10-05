import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import emdash, { s3 } from 'emdash/astro';
import { postgres } from 'emdash/db';
import base from './astro.config.mjs';
import { newsViteConfig, usesLiveNews } from './scripts/emdash/shared-config.mjs';
import { stagingOrigin } from './scripts/emdash/staging-env.mjs';

const origin = stagingOrigin();
const vite = newsViteConfig();
// Use the exact UI dependency shipped with EmDash, including its isolated peers.
const adminEntry = fileURLToPath(import.meta.resolve('@emdash-cms/admin'));
// Lambda disables require(ESM); bundle the sanitizer's CommonJS bridge.
vite.ssr.noExternal.push('sanitize-html', 'htmlparser2', 'escape-string-regexp',
  'domhandler', 'domutils', 'dom-serializer', 'domelementtype', 'entities', 'launder', 'parse-srcset',
  'is-plain-object', 'deepmerge', 'postcss', 'picocolors', 'nanoid', 'source-map-js', 'dayjs');
vite.resolve.alias['virtual:emdash/scheduler'] = fileURLToPath(new URL('./src/lib/news/netlify-scheduler.mjs', import.meta.url));
vite.resolve.alias['virtual:emdash/wait-until'] = fileURLToPath(new URL('./src/lib/news/netlify-deferred.mjs', import.meta.url));
vite.plugins = [{
  name: 'dos-emdash-native-ui',
  enforce: 'pre',
  resolveId(source) {
    if (source === '@dos/emdash-ui') return this.resolve('@cloudflare/kumo', adminEntry, { skipSelf: true });
  },
}, {
  name: 'dos-static-pages-without-cms',
  transform(_code, id) {
    // News consumers are SSR. Other static pages must not connect to or migrate the CMS during a build.
    if (this.environment.name === 'prerender' && id === '\0virtual:emdash/config') {
      return { code: 'export default null;', map: null };
    }
  },
}];

export default mergeConfig(base, {
  site: origin,
  cacheDir: './.astro/emdash-netlify',
  outDir: './dist-emdash-staging',
  adapter: netlify({ middlewareMode: 'classic' }),
  integrations: [
    emdash({
      database: {
        ...postgres({ migrationConnectionStringEnv: 'DIRECT_URL' }),
        entrypoint: fileURLToPath(new URL('./src/lib/news/staging-postgres.mjs', import.meta.url)),
      },
      migrations: { runtime: 'check', dev: 'check' },
      storage: s3(),
      siteUrl: origin,
      fonts: false,
      admin: { siteName: 'Dzaleka Online Services', logo: '/images/dzaleka-digital-heritage.png', favicon: '/images/dzaleka-digital-heritage.png' },
      mcp: false,
      plugins: [{ id: 'dos-insights', version: '1.0.0',
        entrypoint: fileURLToPath(new URL('./src/lib/insights/plugin.ts', import.meta.url)),
        adminEntry: fileURLToPath(new URL('./src/lib/insights/admin.tsx', import.meta.url)),
        adminPages: [{ path: '/links', label: 'Links', icon: 'link' }, { path: '/statistics', label: 'Statistics', icon: 'chart-bar' }],
        adminWidgets: [{ id: 'overview', title: 'Site statistics', size: 'full' }],
      }, { id: 'dos-submissions', version: '1.0.0',
        entrypoint: fileURLToPath(new URL('./src/lib/submissions/plugin.ts', import.meta.url)),
        adminPages: [{ path: '/inbox', label: 'Submissions', icon: 'inbox' }],
        adminWidgets: [{ id: 'submissions', title: 'New submissions', size: 'full' }],
      }],
      middleware: { outer: new URL('./src/lib/news/staging-middleware.ts', import.meta.url) },
    }),
    {
      name: 'dos-netlify-news-staging',
      hooks: {
        'astro:config:setup': ({ updateConfig, injectRoute, addMiddleware }) => {
          addMiddleware({ entrypoint: new URL('./src/lib/news/staging-session-middleware.ts', import.meta.url), order: 'post' });
          updateConfig({ security: { checkOrigin: true } });
          injectRoute({ pattern: '/_dos/public/[collection].json', entrypoint: './src/lib/news/public-feed.ts', prerender: false });
          injectRoute({ pattern: '/_dos/public/site.json', entrypoint: './src/lib/news/public-site.ts', prerender: false });
          injectRoute({ pattern: '/_dos/public/[collection]/[...slug]', entrypoint: './src/lib/news/PublicArticle.astro', prerender: false });
          injectRoute({ pattern: '/_dos/public/media/[...key]', entrypoint: './src/lib/news/public-media.ts', prerender: false });
          injectRoute({ pattern: '/_emdash/api/dos-maintenance', entrypoint: './src/lib/news/maintenance-route.ts', prerender: false });
        },
        'astro:route:setup': ({ route }) => {
          if (usesLiveNews(route.component)) route.prerender = false;
        },
      },
    },
  ],
  vite,
});
