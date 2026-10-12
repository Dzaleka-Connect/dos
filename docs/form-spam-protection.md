# Public form spam protection

All website submissions use the site's server endpoints. The form registry is in `src/lib/submissions/targets.ts`; the five Astro submission endpoints and six Netlify email functions require verification before delivery. Read-only search and API queries do not require it.

The browser obtains a ten-minute HMAC-signed challenge bound to the destination and connecting IP. A worker calculates a SHA-256 proof of work without blocking the page. The CMS atomically claims the nonce and increments shared hourly counters: 12 submissions per browser identifier and 120 per network. The network allowance accommodates shared connections. The browser identifier is a one-day HttpOnly, Secure, SameSite=Strict cookie; network identifiers are HMAC hashes, never raw IPs. Expired counters and nonces are deleted during the next verified submission. This is automated-abuse friction, not proof that a visitor is human.

The server rejects cross-origin submissions, reused/expired/forged proofs, populated honeypots, oversized bodies (4 MB including attachments), and repeated mixed-case random strings across several text fields. Unusual names or non-English text alone are not grounds for rejection. Correction requests require a link to a published service on this directory and at least one correction field.

Verification outages fail closed and preserve the browser's form input. No submission content is stored in the guard table. Existing CMS draft/inbox and Formspree/Formcarry review destinations remain in use. Internal release tests use the existing signed CMS-only test path, which suppresses notifications; public payloads cannot enable test mode.

## Deploy and verify

1. Run `npm test` and build the public site and CMS.
2. With the private CMS environment, run `node --env-file=.env.staging scripts/emdash/migrate-form-guard.mjs --apply`. This adds only the private guard table and expiry index.
3. Deploy the CMS before the public site. Both already require the same `DOS_SUBMISSION_SECRET`.
4. Verify normal browser challenge completion, invalid requests, replay rejection and a signed test draft without sending reviewer notifications.

## Provider addresses already known to bots

Removing external action URLs from the browser prevents new casual discovery, but it cannot revoke an address previously published. Formspree explicitly does not authenticate submissions with its API keys. Its Restrict to Domain setting checks Referer, which a non-browser client can forge. Provider-side spam controls (and disabling or replacing compromised endpoints) require account access. Formcarry filters spam and can suppress its notification emails. Website code cannot change those account settings.

- https://help.formspree.io/articles/the-forms-api/api-keys
- https://help.formspree.io/articles/form-and-project-settings/restrict-to-domain
- https://help.formspree.io/articles/troubleshooting/how-to-prevent-spam
- https://docs.formcarry.com/features/spam-protection

Never claim that these measures guarantee zero spam. A bot that completes verification can still submit within the limits. Keep provider filtering enabled and mark missed spam in the review inbox.
