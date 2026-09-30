# Netlify and Supabase News staging

This deploys the News pilot to a **separate Netlify site**. The live DOS site keeps its root `netlify.toml`, normal build and existing submission functions. Published News is read from the CMS on request; other collections still use Markdown. Staging uses Supabase PostgreSQL, a private Supabase Storage bucket through its S3 API, and Netlify Blobs sessions. EmDash continues to manage editor accounts and passkeys; Supabase Auth is not used. No live services, accounts or secrets should be copied into it.

## Public site and CMS addresses

The public website remains `https://services.dzaleka.com/`. The existing `dos-news-staging` Netlify project is the dedicated CMS host at `https://cms.dzaleka.com`, with the editor at `/_emdash/admin/`. Its original Netlify address remains a deployment hostname; use the custom hostname for editor login.

The standard Astro configuration connects News consumers to a published-only interface on the CMS host. Publishing, editing a published article, or unpublishing takes effect on the next request; a site rebuild is unnecessary. Draft saves remain private until Publish is selected. This applies to News, categories, homepage, related coverage, dashboards, search, RSS, sitemaps and the public News/search/export APIs.

The public site has no CMS database, S3, admin or staging-password credentials. It fetches `https://cms.dzaleka.com/_dos/public/news.json` for reader metadata and `/_dos/public/news/{slug}` for the existing EmDash-rendered article body. CMS admin and preview routes still require authentication. These read-only routes query the repository's live rows directly, so even an authenticated preview token cannot select a draft. Only allowlisted reader fields are exported.

Uploaded cover and inline media use `/_dos/public/media/{key}`. Each read checks that a currently published News article references that storage key. Draft-only uploads, backups and transfer archives are refused. The bucket remains private. Unpublishing the last referencing article removes access on the next request. Previously downloaded public copies cannot be recalled.

News responses use `no-store`; request-local memoization avoids duplicate CMS metadata calls within one render without caching unpublished articles across requests. Public API search bypasses its result cache when News is included. A CMS outage returns an error rather than silently restoring outdated Markdown articles. Article bodies retain EmDash's renderer, media handling and component styles; canonical URLs remain on `services.dzaleka.com`.

The owner connected `cms.dzaleka.com` to the existing Netlify CMS project on 30 September 2026. Its CNAME points to `dos-news-staging.netlify.app`; Netlify reports an issued certificate for the custom hostname. The configuration now permits this exact CMS hostname while still rejecting the public website and a mismatched Netlify project ID.

The administrator originally registered a passkey on the Netlify hostname, then used an explicitly approved, single-use native recovery link to sign in on the custom hostname. The CMS origin has now switched to `https://cms.dzaleka.com`. The owner must add a passkey for this hostname from the existing signed-in session; the old credential was preserved but is bound to the old hostname.

## Create the services

1. Create a separate Supabase project for staging. In **Connect**, copy the Transaction pooler URL (port `6543`) for `DATABASE_URL` and Session pooler URL (port `5432`) for local `DIRECT_URL`. Replace the password (URL-encode reserved characters) and add `?sslmode=verify-full` to both. Copy the exact pooler hostname from the dashboard. Use the project's database-owner connection for this isolated pilot: EmDash creates and alters its own tables. Each function instance is limited to one client connection. Both pooler endpoints support IPv4.
2. Keep the Data API enabled. Before initializing EmDash, create a private `emdash_staging` schema owned by the database connection role and revoke schema access from `PUBLIC`, `anon`, `authenticated` and `service_role`. Do not add this schema to the Data API's exposed schemas. The runtime adapter sets its PostgreSQL search path to this schema, so CMS tables do not go into `public`. EmDash uses PostgreSQL directly, not the Supabase REST Data API. Create a **private** Storage bucket named `dos-news-staging`. Enable the S3 protocol and generate S3 access keys in Storage settings. Copy its endpoint (`https://<project-ref>.storage.supabase.co/storage/v1/s3`) and actual project region. These S3 keys have project-wide bucket access and bypass RLS, so keep this a separate staging project and store the keys only on the server. Leave `S3_PUBLIC_URL` unset; published article images use the reference-checked public media route and other images stay behind the CMS access gate. Back up stored files separately from PostgreSQL: Supabase Storage does not support S3 bucket versioning.
3. Create a new Netlify site connected to this repository. Leave **Base directory** at the repository root and set **Package directory** to `deployment/emdash`. Netlify then uses `deployment/emdash/netlify.toml`: build command `npm test && npm run news:staging:build`, publish directory `dist-emdash-staging`, function directory `netlify/emdash-functions`. Check the configuration path in the first build log. The existing submission/email functions are intentionally excluded from this staging configuration.
4. Initially use its default `https://<site>.netlify.app` address, or configure the dedicated `https://cms.dzaleka.com` hostname before administrator setup. Record the chosen origin and the CMS site ID. The public website stays on `services.dzaleka.com`. For the existing deployment, follow the passkey transition above before changing origins.

References: [Netlify configuration discovery](https://docs.netlify.com/build/configure-builds/monorepos/), [Supabase database connections](https://supabase.com/docs/guides/database/connecting-to-postgres), [Data API controls](https://supabase.com/docs/guides/api/securing-your-api), [Supabase S3 credentials](https://supabase.com/docs/guides/storage/s3/authentication), [S3 compatibility](https://supabase.com/docs/guides/storage/s3/compatibility) and [EmDash database permissions](https://docs.emdashcms.com/deployment/database/).

## Database connection modes

Netlify Functions use the Supabase **transaction pooler on port 6543** in `DATABASE_URL`, with `EMDASH_MIGRATIONS_MODE=check`. The CMS checks that its migrations are current instead of running them during web requests. The private `emdash_staging` search path is sent in PostgreSQL startup options; it was verified against alternating public/private connections and 20 simultaneous clients.

Keep a **session pooler URL on port 5432** in local `DIRECT_URL` for `npm run news:staging:initialize`. This command explicitly uses the migration dialect and preserves the private schema and verified TLS. Set `sslmode=verify-full` on both URLs. Do not upload `DIRECT_URL` to Functions, and do not override runtime migrations to `auto` while using the transaction endpoint. Run migrations locally before deploying a new EmDash version.

Session pooling for web traffic previously exhausted the project's 15-client session limit when serverless functions retained connections. The transaction pooler lets serverless clients share database connections rather than holding a session slot while idle. See [Supabase connection modes](https://supabase.com/docs/guides/database/connecting-to-postgres).

## Configure credentials

```sh
npm run news:staging:prepare
```

This creates an ignored, owner-readable `.env.staging`, generates the encryption key, staging password and cron secret, and preserves existing values on repeat runs. Fill in the Supabase credentials and Netlify site identifiers there. The S3 access key and secret are the generated S3 credentials, not a Supabase publishable, anon or service-role API key. Do not paste secrets into chat or commit the file.

Download the CA certificate linked under Supabase **Database Settings → SSL configuration**. Base64-encode the complete PEM file and save it as `DATABASE_CA_CERT_BASE64`. The adapter validates the CA and keeps certificate and hostname verification enabled; never use `rejectUnauthorized: false`. It removes `sslmode` from the URL passed to `pg` after validation because URL SSL options otherwise overwrite the explicitly configured CA. Use the staging adapter for runtime migrations; the generic EmDash PostgreSQL CLI migration adapter does not apply this project's CA or private-schema configuration.

In the new Netlify site's environment variables, configure:

| Variables | Scope |
| --- | --- |
| `DOS_EMDASH_STAGING=1`, `EMDASH_STAGING_ORIGIN`, `EMDASH_STAGING_SITE_ID`, `EMDASH_MIGRATIONS_MODE=check` | Builds and Functions |
| `DATABASE_URL`, `DATABASE_CA_CERT_BASE64`, `EMDASH_ENCRYPTION_KEY` | Functions |
| `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION` (Supabase project region) | Functions |
| `DOS_STAGING_PASSWORD`, `EMDASH_CRON_SECRET` | Functions |

Use the production deploy context **of the separate staging site**. If your plan does not offer scope controls, use all scopes on that separate site. The database and storage adapters read secrets at runtime instead of embedding credentials in the build. Variables in `netlify.toml` alone are not sufficient for Functions; set the listed variables in the site UI too.

For this staging site, the owner approved all scopes because the current Netlify plan does not support individual scopes. This makes credentials available to builds and post-processing as well as Functions. The Supabase API secret is not uploaded: the CMS only needs the database and S3 credentials. Scan generated site and function files for credential values before deployment.

Check your completed local settings without displaying them:

```sh
node --env-file=.env.staging --input-type=module -e "import { validateStagingRuntime } from './scripts/emdash/staging-env.mjs'; validateStagingRuntime(); console.log('Staging configuration is valid.');"
```

Initialize the remote CMS before the first hosted request:

```sh
npm run news:staging:initialize
```

This checks the private schema and its access restrictions, runs EmDash migrations, then imports the source News with `onConflict: 'skip'`. Repeating it preserves existing entries. Run it locally against the staging environment: first-time migrations exceeded the site's 30-second Netlify function limit when attempted during an admin request. Do not use the generic EmDash CLI adapter for this step; it lacks the CA and schema configuration above.

Deploy the staging site's main/published deploy. The build rejects a mismatched site ID or origin. Later builds do not overwrite CMS edits. Local pilot edits, uploads, administrator accounts and localhost passkeys are not migrated.

## Check the hosted editor

1. Visit `/_emdash/admin/` on the staging origin. The first prompt uses username `staging` and the generated `DOS_STAGING_PASSWORD`. This gate protects setup before any administrator exists. Complete EmDash setup and create your own passkey for this hostname. Keep the staging password separate from the passkey/recovery credentials.
2. Use a private browser window to confirm the setup/editor and News URLs return a password prompt without staging access. Without an editor session, unpublished articles must still return 404 after passing the staging gate. A signed preview may display the draft but must carry `Cache-Control: private, no-store` and `X-Robots-Tag: noindex`.
3. Create a disposable News draft, upload a small JPG or PNG, preview, publish, replace its image, restore a revision and unpublish it. Confirm changes appear on News, its category, the homepage, search, RSS, relevant Encyclopedia coverage and the News sitemap without rebuilding. For the News sitemap, use a publication date within the last two days.
4. Start with images below 4 MB. The editor's upload path and Netlify request limits need a hosted check before accepting larger images. If enabling direct signed uploads later, configure bucket CORS for only this staging origin; the current private-bucket setup does not require public bucket access.
5. Schedule another disposable article a few minutes ahead. Check Netlify → Functions → `emdash-maintenance` for its next run and logs, then confirm the article becomes public. A successful HTTP response alone is insufficient: EmDash logs some task failures internally, so verify the resulting publication and scheduler health in the editor.
6. Redeploy and verify that the article, uploaded image and editor login still work. Remove only the disposable test content when finished.

After setup, run the read-only HTTP checks with your completed credentials file:

```sh
node --env-file=.env.staging scripts/emdash/verify-staging.mjs
```

This checks the 30 imported article URLs, live News consumers, authentication boundaries, missing articles and cache/indexing headers. It does not create an editor account or substitute for the publishing/upload checks above.

The scheduler sends a secret-authenticated POST to `/_emdash/api/dos-maintenance` every minute. It rejects redirects and stops waiting after 25 seconds. EmDash's in-process timer is disabled in the staging bundle so frozen function instances cannot become the scheduler. Maintenance failures surface in Netlify function logs; large backups and marketplace sandbox plugins are outside this pilot.

**Schedules only run automatically on published deploys.** Deploy previews and branch deploys do not trigger schedules. Use a published deploy on this separate staging site for the end-to-end test, as described in [Netlify Scheduled Functions](https://docs.netlify.com/build/functions/scheduled-functions/). Do not share a staging database across changing preview hostnames: passkeys and the cron target use the fixed staging origin.

## Add Events and Jobs

Events and Jobs are defined in the CMS alongside News. The websites keep reading them from Markdown until they are switched on in `src/lib/news/live-collections.mjs`. Follow these steps in order.

1. **Deploy this code.** Both sites build from `main`. The public site keeps Events and Jobs on Markdown. The CMS gains the published-only routes `/_dos/public/events.json`, `/_dos/public/jobs.json` and one route per entry.
2. **Stop editing Events and Jobs in the old editor** (`/admin`) from this point until the switch. Edits made there after the import will not reach the CMS.
3. **Import.** On your machine, with the completed `.env.staging`, run:

   ```sh
   npm run news:staging:initialize
   ```

   The script imports only collections the CMS does not have yet. News is left exactly as it is, including any articles you have deleted. The output lists how many events and jobs were imported. Running it again imports nothing.
4. **Check the CMS.** Sign in at `https://cms.dzaleka.com/_emdash/admin/`. Events and Jobs appear in the sidebar. Open a few entries and compare them with the live site. Then open `https://cms.dzaleka.com/_dos/public/events.json` and `https://cms.dzaleka.com/_dos/public/jobs.json`: each should list the published entries.
5. **Switch.** In one commit:
   - change `liveCollections` in `src/lib/news/live-collections.mjs` to `['news', 'events', 'jobs']`
   - remove the `events` and `jobs` collections from `public/admin/config.yml`, so there is only one place to edit them.

   Deploy. Event and job pages, the homepage, search, sitemaps, datasets and the APIs now read the CMS on each request. Publishing, editing or unpublishing takes effect on the next page load, without a rebuild.
6. **Check the site.** Visit `/events`, an event page, `/jobs`, `/jobs/2` and a job page. Publish a disposable test event, check it appears, then unpublish it.

The Markdown files in `src/content/events` and `src/content/jobs` are no longer read after the switch. Keep them as an archive or delete them later.

To undo the switch, set `liveCollections` back to `['news']` and restore the old editor entries. Pages return to the Markdown files, without any changes made in the CMS.

In the CMS, the listing status fields are named "Listed as" (events: upcoming or past) and "Listing status" (jobs: open, closed or draft), so they do not clash with EmDash's own draft and published status. A job with the listing status "draft" is imported as a CMS draft.

## Boundaries and verification

The CMS, News pages, homepage, search index, RSS, both sitemaps, staff dashboard and Encyclopedia coverage run through Node Functions, with runtime middleware, no-store caching and the staging access gate. Other existing public pages can remain static; the Netlify staging configuration marks all responses `noindex`. This is protection for the editorial pilot, not a promise that every existing public asset is private. The public News/search/export APIs read the same published feed; other collections and their editorial tools remain file based.

EmDash 1.0.1's built-in full-text search is SQLite-only, so the PostgreSQL seed omits the `search` collection capability. DOS's existing public search index continues to include published CMS News.

Set `AWS_LAMBDA_JS_RUNTIME=nodejs24.x` through Netlify's environment settings/API as well as `NODE_VERSION=24`; the runtime override cannot be set in `netlify.toml`. The staging build bundles `sanitize-html` and its dependencies to avoid its CommonJS-to-ESM `require()` on Lambda, where that Node feature is disabled.

The scheduler alias and static-build exclusion depend on EmDash 1.0.1's virtual modules. Recheck the built middleware contains `createScheduler: null` when upgrading EmDash. The prerender build uses a null CMS config: its pages do not read News and must never connect to or migrate the remote database. Standard DOS builds do not load the staging middleware, adapter or scheduler.

Local tests cover staging isolation, fail-closed authentication, preview access, TLS configuration and cron requests. A successful local Netlify bundle is not a substitute for hosted Supabase PostgreSQL/Storage, Netlify Blobs and passkey acceptance tests. Those require the services and credentials above.

To build and check the Netlify handler locally without remote credentials:

```sh
DOS_EMDASH_STAGING=1 EMDASH_STAGING_ORIGIN=https://dos-news-staging-test.netlify.app npm run news:staging:build
npm run news:staging:verify-build
```

The second command copies the packaged function to an isolated temporary directory and invokes its handler and checks access protection on every route moved to server rendering. It also checks that the timer scheduler is disabled. It does not contact the database or deploy anything. Before redeploying with configured staging services, also check an authenticated article and the sitemap with Lambda's module restriction:

```sh
node --no-experimental-require-module --env-file=.env.staging scripts/emdash/verify-netlify-build.mjs --staging
```

To exercise the hosted publishing path using disposable content:

```sh
node --env-file=.env.staging scripts/emdash/verify-http.mjs --staging
```

This creates a temporary draft through EmDash's repositories, checks signed previews and public exclusion, publishes and replaces an image in S3, unpublishes, and waits up to three minutes for Netlify's scheduled function to publish it again. It removes its article and image in `finally`. These checks do not verify the editor UI, browser upload request or passkey/session flow.

The initial staging deployment uses the local CLI because these pilot changes have not been committed. GitHub automatic deployments are not connected yet. Build for the real staging origin, then deploy only the staging project:

```sh
DOS_EMDASH_STAGING=1 EMDASH_STAGING_ORIGIN=https://cms.dzaleka.com npm run news:staging:build
CONTEXT=production npx --package netlify-cli netlify deploy --cwd deployment/emdash --site 4858bc22-f014-4cb0-a2c1-1e4f316addc6 --prod --no-build --skip-functions-cache --dir "$(pwd)/dist-emdash-staging" --functions "$(pwd)/netlify/emdash-functions"
```

The staging builder copies Astro's generated Frameworks API artifacts beside `deployment/emdash/netlify.toml` for CLI discovery. Confirm the upload includes **two functions**, the Astro server and `emdash-maintenance`. Do not deploy the static output alone.

Astro was updated to 7.3.5 to resolve the previously reported critical Astro advisory before deployment. Other dependency advisories still require separate review.

### Verified locally on 30 September 2026

- Before the Supabase configuration change, 362 tests passed across 39 suites. After switching providers, all 12 relevant tests passed, including checks for the Supabase pooler, S3 endpoint and region.
- The normal DOS production build passed, with existing content-reference and prerender-header warnings.
- The Netlify CMS build passed without database or object-storage credentials and without CMS initialization errors during prerendering.
- The compiled Netlify handler passed access checks on 14 dynamic routes and the maintenance endpoint; its in-process scheduler is disabled.
- Repeating staging preparation preserved the generated secrets and owner-only file permissions.
- The repository-wide TypeScript check still reports existing errors; none were reported in the News/staging files.
- Supabase S3 authentication succeeded. The private `dos-news-staging` bucket was created and verified with a generated image: upload and download matched, anonymous access was blocked, and the test image was deleted afterwards. This checks storage directly, not the hosted editor upload flow.
- PostgreSQL connects with verified TLS using the official Supabase CA certificate. The private `emdash_staging` schema is selected through PostgreSQL startup options, and the `anon`, `authenticated` and `service_role` API roles have no schema access. The Data API remains enabled.
- All 366 tests passed across 39 suites after the certificate and schema changes. The staging build and compiled-handler access checks passed; generated site and function files contained none of the configured credential values.
- The separate Netlify site is `dos-news-staging` (`4858bc22-f014-4cb0-a2c1-1e4f316addc6`), at `https://dos-news-staging.netlify.app`. Its staging variables use the owner-approved all-scopes setting, and Functions are pinned to Node.js 24. All 37 hosted reader routes, access protection and missing-article checks passed after redeployment; all 30 source articles persisted. The packaged function also passed authenticated rendering from an isolated directory with Lambda module restrictions. Browser editor uploads, sessions and passkeys remain pending.

- Hosted workflow checks passed using a disposable article: drafts stayed private; signed previews worked; invalid, expired and unrelated tokens were rejected; publication appeared in News, the homepage, search, RSS and the News sitemap; an S3 image was replaced and delivered byte-for-byte; unpublishing removed the article; Netlify's automatic scheduled function published it again. The test cleans up its article and object. This used repository operations and HTTP checks, not the browser editor UI.
- The Data API returned `406/PGRST106` for the private CMS schema. Administrator setup is now complete on the Netlify hostname (one administrator and one passkey). Its admin entry redirects to login. Browser editor acceptance checks and a login transition to the custom CMS domain remain pending.
- Previous Netlify-host verification deploy: `6abc771f41648828a71d82ed`. No production cutover or GitHub auto-deploy connection was made.

### CMS hostname transition status

`cms.dzaleka.com` has working HTTPS and is the configured CMS origin in Netlify and `.env.staging`. The custom-domain build passed, as did 10 staging boundary tests and packaged-handler protection checks for 14 dynamic routes.

The owner approved the one-time native administrator sign-in link and confirmed signing in on the custom host. The token was consumed before the origin change. Its local plaintext link was then removed. The existing administrator account and credential were preserved.

Deployment `6abc818df9bfbd73fe3e1a43` uses the custom hostname for the CMS and scheduler, with transaction pooling and check-only runtime migrations. The hosted passkey options return `rpId: cms.dzaleka.com`. The owner still needs to add a passkey on the new hostname and verify a fresh login before signing out of the current session.

After the connection fix, all 367 tests passed across 39 suites. The isolated function package passed its 14 protected-route checks and authenticated article/sitemap rendering. All 37 hosted reader routes passed on the custom hostname. The disposable hosted workflow passed draft isolation, signed previews, publishing, image replacement and delivery, unpublishing, and automatic scheduled publication. Its article and image were removed. Twenty simultaneous database clients passed private-schema/account-read checks. The generated-site/function scan found none of the configured credential values in 5,270 files.


### Public connection verification

```sh
npm test
node --env-file=.env.staging scripts/emdash/build-staging.mjs
node --env-file=.env.staging --no-experimental-require-module scripts/emdash/verify-netlify-build.mjs --staging
NETLIFY=true npm run build
node --env-file=.env.staging scripts/emdash/verify-public.mjs --origin=https://services.dzaleka.com
```

The workflow check creates one uniquely named temporary article and upload, verifies draft privacy, publish, unpublished edits, media delivery, public-page freshness and unpublish, then deletes its own fixtures in `finally`. Run it against a public-site deploy preview before promoting that release. Keep the CMS deployment's function bundle in `deployment/emdash/.netlify/v1`; the subsequent public build replaces the root `.netlify/v1` with the public bundle.

The CMS feed must be deployed before the public reader. Deploy the public site from the repository root with its original `netlify/functions` directory. Never use the CMS deployment directory for the public site. The standard `npm run build` now retains this connection on future repository deployments once these source changes are committed and pushed.

### Public release — 30 September 2026

- CMS published-only delivery: `6abc859c1622637bda9181ed`.
- Public preview: `6abc86b7ecfed5e8b99dd3b6`; publish/draft edit/cover and inline image/search/RSS/sitemap/unpublish workflow passed and fixtures were removed. All 30 original articles and seven representative public pages returned 200.
- Public production: `6abc87bd6c20431486281114` at `https://services.dzaleka.com`, retaining all six existing submission/email functions plus Astro SSR.
- 374 tests across 40 suites passed. The isolated public function rendered eight reader routes without CMS credentials, and 2,870 public artifact files contained none of the configured CMS credential values.
- The old generated `dist` tree stalled cleanup during build. It was preserved at ignored `.emdash-pilot/pre-cms-public-build`; rebuilding into a fresh `dist` completed successfully.
- This release was deployed directly. Push the committed source changes before subsequent GitHub builds, otherwise a build of the old main branch will replace the connection.
