# EmDash integration release — 5 October 2026

This release completes the News, Events, Jobs and Services integration with the separate public website. It uses the official [site-building](https://github.com/emdash-cms/skills/tree/main/skills/building-emdash-site), [plugin](https://github.com/emdash-cms/skills/tree/main/skills/creating-plugins) and [CLI](https://github.com/emdash-cms/skills/tree/main/skills/emdash-cli) skills, checked against installed EmDash 1.1.0 source.

## Completed integration

| Area | Behavior |
| --- | --- |
| Entry SEO | All four collections export saved SEO title, description, image, canonical URL and noindex. Explicit editor text is not truncated or rebranded. The feed uses EmDash's list handler to hydrate the separate SEO records; raw repository rows alone do not include them. |
| Public rendering | Detail pages use the SEO fields in search and social metadata. Noindex entries are excluded from the sitemap. Missing events return 404; year-prefixed slugs and events without images render correctly. |
| Previews | All four collections retain the signed-preview state, show the preview banner and return private/no-store/noindex responses. Unpublished content stays out of the public feed. |
| Public media | Only images referenced by published data, published SEO or the configured site default are accessible through the public media route. Successful public media can be indexed; raw CMS media and draft-only uploads remain private. |
| Redirects | A public Netlify edge function consults EmDash's native redirect engine before static or dynamic pages. Exact and pattern rules, disabled rules, and 410/451 responses are supported. This also exposes EmDash's automatic slug-change redirects on the public domain. The CMS awaits EmDash's deferred work before responding on Netlify, so cache refreshes complete before the function can freeze. |
| Site SEO settings | The same edge function applies the configured site title, title separator, default social image, Google/Bing verification and custom robots.txt to the public site. Explicit entry SEO overrides remain intact. Public pages retain their normal response if the settings endpoint is temporarily unavailable. |
| Schema and backfill | Added Events organiser URL, capacity and host, and Jobs requirements. Backfill adds missing source values without replacing current editor values or publishing pending revisions. The migration is safe to rerun. |
| Event status | Automatic status uses the final day of a multi-day event in Malawi time. Explicit upcoming/past editor overrides are respected across lists and detail pages. Existing date-driven listings were migrated to automatic status. |
| Image alt text | Event cards and detail images use the editor's alt text, falling back to the title. |
| Form submissions | Service registrations, service corrections, event proposals and job submissions enter a private EmDash inbox. Registrations/proposals create unpublished drafts atomically. Corrections link to the existing listing and never overwrite it automatically. |
| Notifications and delivery | The CMS dashboard shows unread submissions and pending Formspree deliveries. Formspree remains the existing notification/review channel; failed delivery is retried by scheduled maintenance. See [inbox operations](emdash-submissions.md). |

## Live release

- CMS deployment: [`6ac309b88b3b0920634a347b`](https://app.netlify.com/projects/dos-news-staging/deploys/6ac309b88b3b0920634a347b).
- Public deployment: [`6ac30845fba243b92ff90509`](https://app.netlify.com/projects/stupendous-empanada-906013/deploys/6ac30845fba243b92ff90509).
- Live HTTP verification passed for public form → signed relay → private inbox/draft, duplicate retries, authenticated review, redirects, all four signed previews and published SEO, and indexable SEO-only uploaded media. No synthetic Formspree notifications were sent.
- A separate editor-style service slug rename produced the expected live public 301. Existing service pagination, its legacy query redirect, all four form actions, static-page default social image and the authenticated maintenance endpoint were verified.
- Temporary content, redirect rules, uploaded images, inbox records and access tokens were removed after verification.

## Verification

- 370 tests pass across 49 suites, including real database SEO hydration, draft privacy, source backfill with pending editor work, submission idempotency, signed requests, simulated Formspree delivery failures/retries, site-setting transforms and event status.
- Both production builds complete.
- Packaged public SEO checks verify rendered titles, descriptions, OG/Twitter tags, canonical URLs, noindex, sitemap exclusion and fallback metadata for all four collections.
- Packaged public handler checks verify 18 routes against the live CMS without CMS credentials.
- Packaged CMS checks verify signed receive, duplicate retry, private drafts, authenticated Block Kit inbox, review state, exact/pattern/disabled/terminal redirects, all four signed previews, saved SEO and SEO-only uploaded media. Temporary fixtures are removed.
- Full repository TypeScript checking still reports the 59 pre-existing diagnostics. New integration modules have no typecheck diagnostics. This release does not claim that unrelated repository code is type-clean.

## Explicit scope

Header/footer navigation, branding assets and social links remain code-managed. Categories and author names use the migrated fields; taxonomy administration and byline profiles are not reader-template features in this release. Inline visual editing and arbitrary plugin head/body contributions are not supported by the separate public renderer.

Only News, Events, Jobs and Services are CMS content collections. Other forms retain their existing delivery paths. Formspree retries can produce a second copy if the original response was lost after acceptance; the stable submission ID identifies the same CMS record. No form publishes content automatically.

The CMS requires a separate deployment from the public site's Git deployment. A public main-branch push alone does not update the CMS runtime.
