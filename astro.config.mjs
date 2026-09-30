import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkToc from 'remark-toc';
import remarkSlug from 'remark-slug';
import remarkContentHeadings from './src/plugins/remark-content-headings.mjs';
import node from '@astrojs/node';
import react from '@astrojs/react';

import netlify from '@astrojs/netlify';
import { usesLiveNews } from './scripts/emdash/shared-config.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://services.dzaleka.com',
  output: 'static',
  adapter: process.env.NETLIFY
    ? netlify({
      middlewareMode: 'classic'
    })
    : node({
      mode: 'standalone'
    }),
  integrations: [
    mdx(),
    react(),
    {
      name: 'dos-published-news',
      hooks: {
        'astro:route:setup': ({ route }) => {
          if (usesLiveNews(route.component)) route.prerender = false;
        },
      },
    }
  ],
  markdown: {
    remarkPlugins: [remarkContentHeadings, remarkSlug, [remarkToc, { tight: true }]],
    shikiConfig: {
      theme: 'dracula',
      wrap: true
    },
    rehypePlugins: []
  },
  vite: {
    resolve: {
      alias: {
        '@dos/news': fileURLToPath(new URL('./src/lib/news/public-client.mjs', import.meta.url)),
        '@dos/news-body': fileURLToPath(new URL('./src/lib/news/PublicBody.astro', import.meta.url)),
        '@dos/news-live': fileURLToPath(new URL('./src/lib/news/no-live.ts', import.meta.url)),
      },
      dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime']
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'leaflet',
        'react-chartjs-2',
        'chart.js',
        'chart.js/auto'
      ]
    }
  }
});
