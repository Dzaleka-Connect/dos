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
// Lambda disables require(ESM); bundle the sanitizer's CommonJS bridge.
vite.ssr.noExternal.push('sanitize-html', 'htmlparser2', 'escape-string-regexp',
  'domhandler', 'domutils', 'dom-serializer', 'domelementtype', 'entities', 'launder', 'parse-srcset',
  'is-plain-object', 'deepmerge', 'postcss', 'picocolors', 'nanoid', 'source-map-js', 'dayjs');
vite.resolve.alias['virtual:emdash/scheduler'] = fileURLToPath(new URL('./src/lib/news/netlify-scheduler.mjs', import.meta.url));
vite.plugins = [{
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
      mcp: false,
      middleware: { outer: new URL('./src/lib/news/staging-middleware.ts', import.meta.url) },
    }),
    {
      name: 'dos-netlify-news-staging',
      hooks: {
        'astro:config:setup': ({ updateConfig, injectRoute }) => {
          updateConfig({ security: { checkOrigin: true } });
          injectRoute({ pattern: '/_dos/public/[collection].json', entrypoint: './src/lib/news/public-feed.ts', prerender: false });
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
