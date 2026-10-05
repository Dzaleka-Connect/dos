# EmDash submissions inbox

Open **Submissions → Inbox** in EmDash, or use the **New submissions** dashboard widget. Editors and administrators can review submissions. Contributors and anonymous visitors cannot read the inbox.

| Public form | Saved in EmDash |
| --- | --- |
| `/services/register` | Private submission and Services draft |
| `/services/update-request` | Private correction request, with a link to the existing listing when its URL is supplied |
| `/events/organize` | Private submission and Events draft |
| `/jobs/post` | Private submission and Jobs draft |

Open a draft, review its content and slug, then publish through the normal editor. Corrections never overwrite a published listing automatically. **Mark reviewed** moves a submission into Reviewed submissions; **Reopen submission** returns it to the inbox. Reviewing a submission does not publish its draft.

Other forms retain their existing delivery routes. The map form and forms for collections outside this CMS migration are not part of this inbox.

## Delivery and recovery

The public server validates the form and signs its request to the CMS. The CMS saves the inbox record and draft in one database transaction before forwarding a copy to the existing Formspree endpoint. A failed Formspree delivery remains pending and is retried by the 15-minute maintenance job. The dashboard shows the pending delivery count. Do not publish a draft merely to clear that count.

Identical form payloads submitted on the same UTC day reuse their existing record. Concurrent deliveries use a lease. If Formspree accepts a request but its response is lost, a retry can produce a duplicate Formspree copy; the stable `submission_id` identifies the same CMS record.

No public route can publish submissions. Upload controls continue using the existing Cloudinary upload flow and send URLs. The shared `DOS_SUBMISSION_SECRET` belongs only in the two sites' server function environments. Do not expose it as a `PUBLIC_` variable.

## Deployment and verification

The CMS and public site require separate builds and deployments. Build the CMS first: its prepared deployment assets are copied to `deployment/emdash/.netlify/v1`. The subsequent public build replaces the root `.netlify/v1` assets.

Apply the idempotent schema/backfill migration with the private CMS environment:

```sh
node --env-file=.env.staging scripts/emdash/migrate-integration.mjs --apply
```

Run unit tests, both builds and the packaged SEO checks. The runtime check below creates temporary drafts, published verification entries, redirect rules, media and a short-lived editor token; it removes them afterward:

```sh
node --no-experimental-require-module --env-file=.env.staging scripts/emdash/verify-integration.mjs
node --no-experimental-require-module --env-file=.env.staging scripts/emdash/verify-integration.mjs --live --public-origin=https://services.dzaleka.com
```

Release verification signs test submissions with the server credential. These exercise the actual public relay, private inbox and draft creation but never forward synthetic notifications to Formspree. Ordinary browser submissions cannot select this mode. Unit tests simulate Formspree success, failure and retry without messaging reviewers.
