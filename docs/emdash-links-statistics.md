# Links and Statistics in EmDash

The native `dos-insights` plugin adds **Links** and **Statistics** to the EmDash sidebar, a dashboard widget, and a statistics panel on saved News, Events, Jobs and Services entries. Editors and administrators may manage links and read reports. Only administrators may change collection and retention settings. The existing public `/analytics` page is unchanged.

## Links

Create a title, stable lowercase slug and public HTTP(S) destination. Public URLs are `https://services.dzaleka.com/go/<slug>`. Editing a destination takes effect on the next request; redirects use HTTP 302 and bypass browser/CDN caching. Slugs cannot be renamed, protecting shared URLs and printed QR codes. Disable obsolete links; disabled and expired links return 410, unknown links return 404. CMS outages return a retryable 503.

Optional source, medium and campaign fields add UTM parameters to the destination. Create separate links for WhatsApp, newsletters and printed posters to distinguish campaign channels. Tags are searchable. Links can be filtered, paginated, copied and exported to CSV. QR codes are generated in the browser as downloadable PNGs and encode the short URL, so destination changes do not require new QR codes.

Destination checks run on request and in the existing fifteen-minute maintenance task. Maintenance checks three enabled links per run, revisiting each no more than once per day. Two consecutive 404/410 results mark a link broken; timeouts, denied requests and other uncertain results are not labelled broken. Checks validate every redirect destination, reject private/reserved addresses and pin DNS resolution to the checked public address. Health updates cannot overwrite results for a destination edited during the check.

## Statistics

A small public-site script sends page views, outbound/contact/download actions, job application clicks, event registration clicks and first interaction with the four CMS submission forms. It excludes the CMS, draft previews, API routes and the existing public analytics page. Short-link clicks are recorded by the redirect endpoint, including visitors who do not run JavaScript. Form completions are recorded only in the same database transaction that saves a new submission; retries do not create another completion. Submitted form values are never copied into statistics.

The admin UI uses the same Kumo components shipped with EmDash: buttons, inputs, selects, segmented tabs, tables, banners and layered cards. It inherits the CMS typography and light/dark theme tokens. The build resolves the CMS’s own Kumo installation through `@dos/emdash-ui`, preserving its peer-dependency boundary rather than adding another UI-library version.

The overview uses KPI cards, equal-length previous-period comparisons, an interactive labelled traffic chart, and paired ranked reports with proportional bars. Tabs separate Overview, Content, Acquisition, Audience and Actions. Presets cover today, yesterday, 7, 30 and 90 days, with custom dates and previous/next-period controls. A single day shows hourly traffic; longer periods show daily traffic. Content can be filtered to Services, Events, Jobs or News.

Reports include date ranges, exact page and campaign filters, breakdowns by page/action/referrer/campaign source/medium/name/device/browser/short link, daily page views, estimated visitor-days and a five-minute site-wide activity count. Overview rankings count page views only; the detailed report counts all event types. Both are labelled accordingly. Page paths with and without trailing slashes are normalized together, including existing stored events. All breakdown pages are available, and CSV exports iterate through every matching page. Saved-entry panels show the entry's current public path; activity on older paths remains available through the main report's path filter. Short links have a direct link to their filtered report. CSV cells are escaped and protected against spreadsheet formulas.

Dates use Malawi time (UTC+02). A visitor hash changes daily. **Visitor-days are approximate**, not unique people across a multi-day range; shared networks and similar browsers can be combined. Page/click counts are observations, not proof that assistance or an external application was completed. Known bots, headless browsers, link previews, prefetches, Do Not Track, Global Privacy Control and explicit browser exclusions are filtered. Unknown bots and forged public telemetry remain possible; this is not a billing or fraud-detection system. No historical analytics are fabricated or imported from browser-local counts.

Raw IP addresses, full referrer URLs, form values and persistent visitor IDs are not stored in these tables. An HMAC of the date, IP address and user agent estimates daily visitors. Only referring hostname, broad browser/device, page path, action and constrained campaign labels are retained. The browser-exclusion preference cookie contains only `1`, not an identifier. Existing Google Analytics and the old browser-local analytics are unchanged by this plugin.

Administrators can pause collection and choose 30, 90 (default), 180 or 365 days of event retention. Maintenance deletes older events and expired rate counters. Link definitions are retained. Lowering retention is irreversible after maintenance. The settings panel links to a same-origin confirmation form for excluding or including the current browser's public-site visits.

## Integration and operations

The public site and CMS are separate deployments. Public collection is bounded and origin-checked, then signed with the existing server-only `DOS_SUBMISSION_SECRET`. The CMS accepts only a signed, domain-separated envelope. Neither this secret nor database credentials are sent to browsers. Each visitor is limited to 120 recorded events per minute, and event IDs deduplicate retries. Public traffic never gains access to reporting routes. EmDash enforces route RBAC, API-token scope and session CSRF protection.

Private tables: `_dos_links`, `_dos_events`, `_dos_insights_settings`, `_dos_event_limits`. Apply the idempotent migration before deploying CMS code:

```sh
node --env-file=.env.staging scripts/emdash/migrate-insights.mjs --apply
npm test
node --env-file=.env.staging scripts/emdash/build-staging.mjs
node --env-file=.env.staging --no-experimental-require-module scripts/emdash/verify-insights.mjs --browser
NETLIFY=true npm run build
```

Run `node scripts/emdash/prepare-cms-release.mjs` to assemble the CMS assets, framework function and bundled maintenance function in an isolated temporary directory outside the Git checkout. Deploy from that directory with `--dir dist --functions functions --no-build`, validate the compiled CMS with the verifier before production deployment. Preview environments do not inherit production-only credentials; do not copy production credentials into a preview. Verify the production release immediately after deployment. Netlify CLI otherwise discovers the repository root and can accidentally package the public SSR function even when launched from `deployment/emdash`. Deploy the public site separately from the repository root. The CMS build preserves its function bundle under `deployment/emdash/.netlify/v1` before the public build replaces the root bundle. Both runtime environments already carry the submission-signing secret. No Umami account, external analytics database or additional recurring service is required.

```sh
node --env-file=.env.staging --no-experimental-require-module scripts/emdash/verify-insights.mjs --live --browser --public-origin=https://services.dzaleka.com
```

The verifier creates temporary links, events and a short-lived administrator API token, tests access rejection, signed ingestion, deduplication, link changes/disablement, campaign reports, native React hydration, QR PNG generation and CSV downloads, then removes its fixtures. With a public origin it also checks the deployed redirect and collection endpoints. Browser verification requires Playwright; its location can be supplied through `DOS_PLAYWRIGHT_MODULE`.

The browser exclusion cookie, DNT and GPC apply to this plugin only. They do not reconfigure other analytics integrations. Disabling collection leaves short links functional. Disabling the entire plugin makes its public routes unavailable, so pause collection through Statistics settings when links must continue working.

Session counts, bounce rate, visit duration, geolocation and Google Search Console reports are not collected by this plugin. They are not represented as available dashboard metrics. Previous-period comparisons may be empty or partial when they precede collection or retained history.
