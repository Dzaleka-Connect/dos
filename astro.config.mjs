import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkToc from 'remark-toc';
import remarkSlug from 'remark-slug';
import node from '@astrojs/node';
import react from '@astrojs/react';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://services.dzaleka.com',
  output: 'static',
  adapter: process.env.NETLIFY
    ? netlify({
      edgeMiddleware: true
    })
    : node({
      mode: 'standalone'
    }),
  integrations: [
    mdx(),
    react()
  ],
  markdown: {
    remarkPlugins: [remarkSlug, [remarkToc, { tight: true }]],
    shikiConfig: {
      theme: 'dracula',
      wrap: true
    },
    rehypePlugins: []
  },
  vite: {
    resolve: {
      dedupe: ['react', 'react-dom', 'react/jsx-runtime']
    },
    optimizeDeps: {
      include: [
        'react-chartjs-2',
        'chart.js',
        'chart.js/auto'
      ]
    }
  }
});
