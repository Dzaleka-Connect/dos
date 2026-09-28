# Service access information

Service entries remain in `src/content/services`. Registration and update forms send submissions for editorial review; they do not publish fields or grant verification automatically.

## Mapping a reviewed submission

The optional form fields `access_eligibility`, `access_fees`, `access_documents`, `access_appointment`, `access_languages` and `access_accessibility` map to the corresponding keys under `access` in a listing's frontmatter. Split the languages field into an array of trimmed, non-empty language names. Keep only information supplied by the provider or supported by a source. Omit unknown fields instead of filling them with assumptions.

The service page renders supplied access information as a definition list. Language structured data uses only `access.languages`; there are no default service languages.

## Dated provider confirmations

`lastUpdated` means the listing was edited. It does not imply that the provider checked the listing. The legacy `verified` boolean is retained for compatibility with existing records but is no longer presented as a dated provider confirmation.

Add `providerConfirmation` only after the provider has confirmed the listing details:

- `by`: the public name of the confirming organisation.
- `date`: the actual confirmation date.
- `sourceUrl`: optional public evidence link. Never publish private correspondence or personal contact details as evidence.

No confirmation record is created merely because a form was submitted. Future dates are not displayed as confirmations. Confirmations older than 180 days carry an age notice; this does not schedule a review or imply the service has closed.

The directory statistics count dated provider confirmation records separately from listing edit dates. The legacy statistics property named `verified` now contains that confirmation count.

## Newcomer essentials

`src/data/essentials.ts` holds matching English, French, Swahili and Chichewa copy. Update each language when changing the guide, contact source or version date. The web pages and offline HTML files read from the same data.

These translations are initial drafts and have not had a native-speaker editorial review. Keep that review status distinct from the date on which a public contact was checked. The current contact comes from the linked UNHCR Malawi country page and is an office contact, not an emergency number.

## Page feedback

The shared feedback form sends both ratings and optional comments to the existing Formspree endpoint. It sends the page path without query parameters or fragments. A success message appears only after an accepted response. Automated tests use mocked responses and never submit feedback to Formspree.
