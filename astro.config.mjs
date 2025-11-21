import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import remarkToc from 'remark-toc';
import remarkSlug from 'remark-slug';
import node from '@astrojs/node';
import react from '@astrojs/react';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://services.dzaleka.com',
  output: 'hybrid',
  adapter: process.env.NETLIFY
    ? netlify()
    : node({
      mode: 'standalone'
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
  }
});