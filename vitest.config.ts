import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      // `astro:content` and `astro/loaders` only exist inside an Astro build.
      // Stubbing them lets tests import src/content.config.ts and assert against
      // the real Zod schemas.
      'astro:content': fileURLToPath(new URL('./tests/stubs/astro-content.ts', import.meta.url)),
      'astro/loaders': fileURLToPath(new URL('./tests/stubs/astro-loaders.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
