# Supabase egress controls

The October 11, 2026 investigation found 6.826 GB in the previous billing cycle
and 0.333 GB at the start of the new cycle. The free plan includes 5 GB of
uncached egress. The CMS uses the same project shown in the Dzaleka CRM usage
dashboard. On October 7, shared pooler traffic accounted for 78.4% of that day's
egress and storage for 21.6%.

## Implemented controls

- Only successful anonymous published feeds, article fragments, site settings
  and referenced media may enter Netlify's durable CDN cache, for 300 seconds.
  Query strings remain part of the cache key, particularly `site.json?path=...`
  where the response includes a path-specific redirect.
- Browsers must revalidate. Errors, editor responses, previews, writes and
  responses setting cookies remain `no-store`. The public website's middleware
  leaves these CMS policies intact.
- Public-site feed requests no longer send `cache: 'no-store'`.
- A warm CMS process checks a database-side fingerprint before downloading a
  published collection again. The fingerprint covers complete published rows,
  separate SEO rows, and the collection's SEO enablement. Changes and removals
  invalidate the snapshot. Failed validation does not serve stale snapshots.
  Concurrent reads share one load, and the allowlist bounds memory to four
  collections. Cold processes still load from the database normally.
- The one-connection database pool keeps an idle connection for 30 seconds
  instead of reconnecting after one second.

CMS changes reach public feeds within five minutes. Public pages also have an
existing 60-second CDN cache with a 300-second stale-while-revalidate window:
an already cached public page can lag further (up to eleven minutes across both
layers). Editor and preview routes remain immediate. No publishing workflow,
analytics collection, submission review, or stored content is removed.

## Verification and ongoing measurement

Run `node --env-file=.env.staging scripts/emdash/verify-egress-cache.mjs` for a
read-only database measurement. It prints counts and network byte totals only.
The October 11 test measured unchanged reads at 195 bytes per collection,
versus 112,901–384,842 bytes on the first load: 99.83–99.95% less for these reads.
This is not a claim about the entire organization's monthly usage.

After deploying, request a public feed twice and check `Cache-Status` for a
Netlify Edge or Durable hit. Check a private CMS route and a missing public
entry for `no-store`. A site-settings request for a different `path` must receive
its own redirect result.

Use the [Supabase usage dashboard](https://supabase.com/dashboard/org/oergtpgtwdfotmvfodyo/usage)
to compare daily Shared Pooler Egress and Storage Egress. The dashboard can lag
an hour. A 5 GB monthly budget averages roughly 160 MB/day; future traffic and
cold starts still affect the total. Already accrued usage cannot be removed.
Do not reset analytics or delete content to address transfer volume.
