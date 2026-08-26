/**
 * Test stub for the `astro:content` virtual module.
 *
 * `src/content.config.ts` imports `defineCollection` and `z` from a module that
 * only exists inside an Astro build. Stubbing it lets tests import the real
 * collection definitions and introspect the actual Zod schemas, rather than
 * regex-scraping the config file and hoping the pattern holds.
 */
import { z } from 'zod';

export { z };

export function defineCollection<T>(config: T): T {
  return config;
}
