/**
 * Test stub for `astro/loaders`.
 *
 * The real glob loader reads the filesystem during a build. Tests only need the
 * collection definitions to load, so this records the arguments and returns an
 * inert object.
 */
export function glob(options: { pattern: string; base: string }) {
  return { type: 'glob-stub', ...options };
}
