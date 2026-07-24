/**
 * Build the URL slug for a photo contributor.
 *
 * Photos may carry an explicit `contributor` slug; when they do not, the slug is
 * derived from the photographer's name. The derived form must strip punctuation,
 * otherwise names like "Don Doll, S.J." produce URLs such as
 * `/photos/contributor/don-doll,-s.j.` that do not match any generated route.
 *
 * Both the link sites and getStaticPaths must use this helper so the two cannot
 * drift apart.
 */
export function photographerSlug(contributor: string | undefined, name: string): string {
  if (contributor) return contributor;
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
