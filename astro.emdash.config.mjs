import { mergeConfig } from 'astro/config';
import emdash, { local } from 'emdash/astro';
import { sqlite } from 'emdash/db';
import { newsViteConfig } from './scripts/emdash/shared-config.mjs';
import base from './astro.config.mjs';

process.loadEnvFile(new URL('./.emdash-pilot/.env', import.meta.url));

export default mergeConfig(base, {
  cacheDir: './.astro/emdash-pilot',
  integrations: [
    emdash({
      database: sqlite({ url: 'file:./.emdash-pilot/news.db' }),
      storage: local({ directory: './.emdash-pilot/uploads', baseUrl: '/_emdash/api/media/file' }),
      siteUrl: 'http://localhost:4322',
      fonts: false,
      mcp: false,
    }),
    {
      name: 'dos-local-news-pilot',
      hooks: {
        'astro:config:setup': ({ command, updateConfig }) => {
          if (command !== 'dev' || process.env.NETLIFY) {
            throw new Error('The EmDash News pilot is local development only. Use the regular config for production.');
          }
          updateConfig({ security: { checkOrigin: true }, vite: { server: { strictPort: true } } });
        },
        'astro:route:setup': ({ route }) => {
          if (route.component.replaceAll('\\', '/').includes('/pages/news/')) route.prerender = false;
        },
      },
    },
  ],
  vite: newsViteConfig(),
});
