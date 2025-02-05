import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import remarkToc from 'remark-toc';
import remarkSlug from 'remark-slug';
import node from '@astrojs/node';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://services.dzaleka.com',
  output: process.env.NETLIFY ? 'static' : 'hybrid',
  ...(process.env.NETLIFY ? {} : {
    adapter: node({
      mode: 'standalone'
    })
  }),
  integrations: [
    tailwind(),
    mdx(),
    react()
  ],
  markdown: {
    remarkPlugins: [remarkSlug, [remarkToc, { tight: true }]],
    shikiConfig: {
      theme: 'github-light',
      wrap: true
    },
    rehypePlugins: []
  },
  vite: {
    optimizeDeps: {
      exclude: ['googleapis', 'googleapis-common']
    },
    build: {
      commonjsOptions: {
        include: [/googleapis/, /node_modules/]
      }
    }
  }
});