# EmDash News pilot

The pilot uses EmDash 1.0.1 to edit a local copy of News. It retains the current News layouts, URLs, categories, images and article content. All other collections remain file based. Production and `npm run dev` read published News from `cms.dzaleka.com`. The separate local pilot below still uses its own SQLite database. Other content collections continue using Markdown.

## Start

Requires Node 22.16 or newer (Node 24 recommended).

```sh
npm ci
npm run news:pilot
```

- News: <http://localhost:4322/news>
- Editor: <http://localhost:4322/_emdash/admin/>

The first run imports the 30 existing articles. Later runs preserve CMS edits and do not reimport deleted articles. The launcher runs in the foreground: stop it with Ctrl+C. It uses a separate port and does not stop the usual site on port 4321.

Complete the editor setup with a site title such as “Dzaleka News pilot”, then create your own administrator account and passkey. Use `localhost` consistently because passkeys are tied to the hostname. The “Sample content” option refers to the imported DOS articles; it uses conflict skipping, so existing edits are preserved. No administrator account is created by the pilot scripts.

## Try the editorial workflow

1. Create a News article with a title, summary, publication date, category and article body. Save it as a draft.
2. Open Preview. Check the draft banner, formatting and cover image. Without its signed preview link, the article should return 404.
3. Publish it. Check News, its category, the homepage, site search and `/api/rss`.
4. Select a replacement cover image. Save the draft and confirm the published article still shows its previous image. Publish to expose the replacement.
5. Restore an earlier revision, preview it, then publish the restored version.
6. Unpublish the test article. Its public URL should return 404 and it should disappear from search and News.

The publication date is editorial metadata; choosing a future date alone does not schedule a story. Use EmDash’s scheduling control. Draft previews use EmDash’s signed tokens and are marked `noindex` with `private, no-store` caching. Lists always request published entries.

Imported images retain their original URLs; they are not copied into the media library. Newly uploaded images use the pilot’s local storage. Cover image alternative text is used by the article and News cards. Tags remain a JSON array of strings; business contact details remain a JSON object with optional `email`, `phone` and `website` keys.

## Verification

```sh
npm test
# With the pilot running:
npm run news:pilot:verify
```

The automated tests cover import fidelity, nested formatting, table headers, draft revisions, image changes, publishing, unpublishing and repeat imports. The HTTP check visits every imported article and creates one temporary local article and image to test preview privacy and the reader-facing publication flow. It removes only its own test records in a `finally` block. It does not authenticate or change administrator accounts. Passkey setup and the authenticated editor controls still need an editor’s hands-on acceptance check.

The Markdown importer stops on unsupported constructs instead of silently flattening or discarding them. It currently supports the constructs present in the existing News collection; review and extend it before importing articles containing raw HTML, task lists or inline images.

## Data and backups

Everything local is in `.emdash-pilot/`, which is excluded from Git:

- `news.db` and any `news.db-wal` / `news.db-shm` files: content, revisions and accounts.
- `uploads/`: local media.
- `.env`: the encryption key. Keep this with the database backup.
- `seed.json`: generated import, not the current edited content.
- `import-complete`: prevents subsequent starts from reseeding.

For a complete backup, stop the pilot and copy the entire `.emdash-pilot/` directory to private storage. Restore the directory as a unit with the pilot stopped. Do not delete the import marker or replace the database to refresh content: that can undo editorial work. CMS edits do not write back to the source Markdown or get included in a Git commit.

## Before production

This configuration deliberately refuses production builds and Netlify execution. It is an evaluation, not a deployment switch. A production migration needs durable database and media storage, secrets and backups, authentication and recovery checks, live rendering for every News consumer, sitemap review, and a final content cutover. Local SQLite and local uploads must not be deployed to Netlify’s ephemeral function filesystem.

The Netlify staging preparation updates Astro to 7.3.5, resolving the previously reported critical advisory against Astro 7.0.6. Other dependency advisories remain to be reviewed.

The separate [Netlify staging setup](./emdash-netlify-staging.md) adds remote PostgreSQL, private S3-compatible storage and scheduled maintenance. It does not change this local pilot configuration or switch the live site to the CMS.

The pilot preserves DOS’s Tailwind 3 stylesheet while skipping recompilation of EmDash’s already-built Tailwind 4 admin styles. The ordinary production configuration never registers the EmDash integration, routes, loader or CSS pipeline.

References: [EmDash existing-project setup](https://docs.emdashcms.com/existing-project/), [preview](https://docs.emdashcms.com/guides/preview/), [database deployment](https://docs.emdashcms.com/deployment/database/).
