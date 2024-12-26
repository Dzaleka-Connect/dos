import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import remarkToc from 'remark-toc';
import remarkSlug from 'remark-slug';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  integrations: [
    tailwind(),
    mdx()
  ],
  markdown: {
    remarkPlugins: [remarkSlug, [remarkToc, { tight: true }]],
    shikiConfig: {
      theme: 'github-light',
      wrap: true
    }
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
  }, 
  adapter: netlify()
});
