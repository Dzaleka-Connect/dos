# UI cleanup review — 5 September 2026

## Changes in this pass

- Service detail template: simplified header and contact sidebar, full email and phone links, separate links for multiple phone numbers, listed opening hours, inactive-service notice and contextual correction links. Removed build-time “Open now” labels and unrelated provider-logo placeholders. Applies to 148 service details.
- Encyclopedia: illustrated landing page with featured entries, thumbnail listings and compact search/filter controls; wider article column; mobile contents navigation; accessible citation dialog; one uncropped header image for people and cover media. Article bodies, source lists, factual data and charts were retained.
- Images: restored Tailwind's native square/video ratios, which the legacy aspect plugin had overridden. Fixed three missing Encyclopedia image references using existing contextual photographs and updated captions/credits. Own-site images use deployment-relative paths. Photograph thumbnails fill their frames; actual covers/posters/logos retain their proportions.
- Photo Archive: one component for archive, year and photographer listings, consistent 4:3 image frames and equal-height rows. Detail pages now put an uncropped gallery and narrative beside photo metadata, credit, usage information and sharing tools. Removed fake image-size download options and fixed remote-image URL encoding; every gallery image has an original-file link.
- Site Register and Public Art Catalogue details: shared galleries with thumbnails, previous/next controls, native full-image dialogs, image failure messages and keyboard navigation. The 43 photo/site/art records retain all supplied gallery images, deduplicated within each gallery. Site records show omitted preservation notes, complete before/after galleries and map links focused on their coordinates. Artwork dates preserve approximate dates and month/year precision. Related records no longer match on empty fields. Removed repeated action panels and broken inline lightbox/share handlers.
- Record tools and adjacent pages: consistent sharing/copy fallback, expandable QR codes, contextual update/report links and four forms that prefill only record-identification fields without replacing a draft. All 43 print views use one layout with return/print controls, credits and usage links; photo albums print the cover with a link to the full gallery. Artist profiles use larger uncropped portraits, working direct contact links where listed, and an accurately labelled catalogue-team contact button.
- Communities: directory-first landing page, compact interest filter, fewer repeated actions, expandable participation guidance and FAQ. Group detail pages use the same restrained reading and contact layout.
- Map: restored the immersive, full-width map requested by the user, with satellite imagery, floating search and category controls, place pins, a collapsible directory/directions panel, pan/zoom, map layers and fullscreen. Real road-route previews are validated and cancelled when the selection changes; failed routes do not produce invented lines, times or steps. Walking/transit directions open in the provider. Kept sharing, a printable directory and links to the maintained suggestion/help pages. The suggestion form now clearly distinguishes a local draft from an email sent for review.
- Explore: visible page introduction, clearer map/list/related-record views, accessible filters, optional advanced tools and native dialogs.
- Forms: rebuilt Service Provider Registration into organization, public contact and service sections, with optional social profiles, a validated native logo chooser, all seven availability days, complete multi-day submission, visible failure/success states and no forced redirect. Added shared field, focus, upload and button styling to 35 contribution forms, including the embedded support, entrepreneur and visitor booking forms. Reworked the introductions/layouts for events, jobs, resources, photo submissions, poet/dancer profiles and map suggestions. Removed nested HTML layouts in service registration, profile forms and photo guidelines.
- Weather: used the Bureau of Meteorology navigation/information grouping as a reference (https://www.bom.gov.au/). Added a district forecast panel, prominent advisories, a forecast-period table, a separate monthly climate panel and rainfall chart. Seasonal values never appear as current forecasts; independent feeds have visible failure states. Weather endpoints now render on request instead of being frozen during the build.
- Homepage events: added larger event imagery, a calendar date badge, location details and a clear details action, with a featured layout when only one event is listed.
- Header: replaced the text branding with the existing image used by the site's favicon, as requested.

## Verification

- Production build succeeds and generates 1,028 HTML documents.
- 283 tests pass across 23 suites, including Encyclopedia browsing/pagination, image references, map filtering, road-route validation, multi-day service registration, weather presentation, gallery navigation, record URL/date handling and correction-form prefilling.
- Generated HTML structural checks found one main landmark and one page heading on shared-layout pages, with no visible form fields missing labels. Hidden spam-trap fields were excluded.
- All 71 supplied Encyclopedia listing images resolve to local files. Ten entries have no supplied image, including seven people entries; no portraits were invented or borrowed from another person.
- Checked the compiled CSS contains both `.aspect-square` and `.aspect-video` rules. Checked the Health Centre and Mapping Project thumbnails render with `object-cover`.
- Checked all 148 generated service detail pages for valid individual telephone links.
- Checked representative people pages render one header image with containment rather than cropping.
- Shared form styling is present on all 35 source form pages. Generated markup for 34 static forms passes field labels, described-by targets, duplicate IDs and single-document checks; the event submission form and homepage render on request and were checked through source/build output.
- Audited all 43 generated photo/site/art detail pages and their 43 print views: one main landmark and page heading, no duplicate IDs or repeated opening title, complete gallery sets (72 image references across records), valid local assets, contextual correction links and focused map links. All 24 generated artist profiles retain their portrait and heading. Remote image availability remains unverified.
- TypeScript checks pass for the map component and new routing, weather, registration, record media, gallery and form helpers.
- `git diff --check` passes.

## Limits

The user supplied screenshots demonstrating the missing-image and letterboxing issues. Further automated browser access was rejected by automatic approval review because of the account usage limit. The latest changes were checked through source, generated HTML/CSS and tests; a final interactive desktop/mobile browser pass remains unverified. No submissions were sent and no deployment was performed.

## Follow-up — 21 September 2026

This pass updates 28 page templates beyond the previous cleanup:

- Culture, the Public Art Catalogue and visual artist directory now use compact introductions, connected arts navigation and consistent image cards. The artist directory reads all 24 profiles from the content collection and supports name/practice search, including names with accents. Repeated contribution panels and dated promotional statistics were removed; organization links and source reading remain.
- Poet, dance and talent directories share card and pagination components. All 21 poets are available across four pages. The missing Astro content loader for talents was restored, making all 39 existing profiles available across seven pages.
- All 21 poet and six dancer detail pages have uncropped media, full-width metadata values, photograph/biography credits and readable biographies. Mobile order puts the photograph and biography before reference details. Named group members retain their information and contacts; decorative anonymous member cards were removed. Missing schema fields now retain published photo credits, writing history, group links and member contacts. Removed unsupported employment claims from profile structured data and duplicate opening titles from rendered biographies.
- Marketplace and business directories have smaller headers, consistent actions and filters, announced selection/counts and explicit empty results. Business filters wrap rather than requiring a horizontal scroll.
- Site Register and Public Art Catalogue submission/update/report forms use the shared form introduction. Success/error messages persist and receive focus. Photo choosers are visible and keyboard-accessible. Grant submissions have one submit control. Talent submissions use grouped fields, an uncropped preview, upload feedback and a photo-link alternative when upload configuration is unavailable; pending uploads cannot overwrite a subsequently entered link.
- Event organizer pages use the shared event cards and clearly separate upcoming/past events. Event cards and details now format dates in Malawi's timezone instead of adding an offset to the server timezone. Organizer classification uses the Malawi calendar day and includes an event's end date when supplied.
- Contact, privacy, terms, photo guidelines and the Chrome extension page have consistent introductions and spacing. Policy text is unchanged; the extension page no longer nests a second document head inside the layout.

### Follow-up verification

- Production build passes. 294 tests pass across 27 suites. New checks cover artist search/clearing, photograph upload validation/failures/cancellation, preserved creative-profile metadata and Malawi event times.
- TypeScript checks pass for the new directory-search, upload and date helpers. `git diff --check` passes.
- Audited 61 generated pages for one main landmark/page heading, duplicate IDs, form labels and local media references: no issues; 105 local image references resolve. Checked poet/talent pagination for complete, non-duplicated coverage and correct next-page links, and all 27 creative profiles for duplicate opening titles.
- Browser access was available for this follow-up. Inspected the culture/art/artist directories, talent pages and pagination, poet/dancer profiles, marketplace/business directories, organizer pages and submission forms. Verified artist accent-insensitive search and reset, marketplace empty results and pressed state, visible upload controls, uncropped portraits, and representative desktop/mobile layouts at 390px without horizontal overflow. Restarted the development preview to refresh cached Markdown output.
- No external forms were submitted or photographs uploaded. Upload network behavior was tested with mocks. Third-party image URLs retain a failure fallback; availability of every remote image is not guaranteed. The build still reports existing prerender request-header warnings and an unavailable optional news feed in this environment.

## 21 September 2026 — Public art, opportunities and follow-up review

- Reworked the Public Art Catalogue around a large featured mural, uncropped artwork photographs and open captions. Artist previews are compact links to the full directory. Artwork details now give the gallery the full page width before the biography and record information; image navigation and the enlarged viewer are preserved.
- Added the Papita Khasu Virtual Artist Residency to Grants and programs, the art catalogue, site search and the sitemap. The supplied cover image, official residency page, Artist Guide and application link are included. Published criteria include the January–February 2027 period, MWK 1.5 million award, 18 October 2026 closing date in Malawi time, individual visual artist eligibility and refugee/asylum seeker eligibility.
- The official residency page was read on 21 September 2026. Additional payment, documentation and copyright details are explicitly attributed to organiser clarifications supplied to DOS. The public guide title and opening pages were inspected. Automatic approval review blocked opening the Google Form after it redirected to Google sign-in; no account was accessed and no application was submitted. The form link matches the official residency page.
- Simplified the grants finder and all opportunity detail pages. Removed nested panels and count tiles, retained status/audience filters and pagination, added accessible selection/result states, and separated external support, watchlists and closed calls. Server-rendered call status now respects opening dates and Malawi closing times; April/May calls are no longer labelled open.
- Reviewed the related culture layouts. Culture now uses an existing local Tumaini Festival photograph, replacing a failing remote image. Creative directory cards use open captions, and portrait directories use square image areas without cropping. The visual artist index keeps biographies on the profile pages instead of repeating them in every result.
- Rebuilt all 24 visual artist profiles using the shared creative profile layout. Preserved authored biographies, removed matching repeated titles, restored schema fields for published contacts and biography dates, and retained social handles as text when no actual URL was supplied. Locally formatted Malawi phone numbers now work in WhatsApp/tel links. Historical ages and locations are labelled as recorded information.
- Reduced repeated feature panels, decorative icons, duplicate installation prompts and unsupported trust/count badges on the Chrome extension page. Simplified the shop directory’s explanatory panels and tightened shared collection headers and mobile culture navigation.

Validation:

- `npm run build` passes. `npm test`: 303 tests across 28 suites pass, including opening/closing boundaries, payment totals, biography heading handling and artist schema preservation.
- Generated-page audit: 92 affected pages checked; one h1 and main landmark, no duplicate IDs, and 131 local image references resolve. The residency appears once in the search index and is present in the sitemap.
- Browser checks at desktop and 390px phone width: art catalogue/detail, grants/residency, culture, visual artists, poetry, dance, talents, shops, contact and representative submission forms. No horizontal overflow on checked mobile routes; form controls checked for labels. Status/audience filtering, empty results, pagination, accent-insensitive artist search, residency search, gallery next/enlarge/close and restored artist contacts were verified.
- Restarted the local development server after content schema/Markdown changes so the preview matches the generated build.

## 28 September 2026: government references and remaining directories

Reviewed GOV.UK, NSW Government, Queensland Government and City of Sydney. Read their service and topic structures, then inspected the NSW education page and City of Sydney places page in the browser. The useful patterns were clear service groups, concise summaries, reliable search and readable detail pages.

| Reference | Pattern applied |
| --- | --- |
| [GOV.UK](https://www.gov.uk/) and [its layout guidance](https://design-system.service.gov.uk/styles/layout/) | Keep the main task visible and limit the width of long articles. Course and project details now use a readable text column. |
| [NSW education and training](https://www.nsw.gov.au/education-and-training) and [card guidance](https://designsystem.nsw.gov.au/components/card/index.html) | Use short summaries and one destination per result. Learning pages retain course photographs with open captions. |
| [NSW search guidance](https://designsystem.nsw.gov.au/docs/content/methods/search.html) and [filtered search template](https://designsystem.nsw.gov.au/templates/search/filters.html) | Keep search terms, filters and sorting when moving between result pages. Show result counts and a clear empty state. |
| [Queensland services](https://www.qld.gov.au/services) | Group services by recognizable topics and provide direct routes into each group. |
| [City of Sydney places](https://www.cityofsydney.nsw.gov.au/places) | Give images a clear purpose and keep topic navigation distinct from record details. |

### Changes

- Preserved the user's recent flat styling, four-pixel corners and existing palette.
- Services now uses one directory template for the index, numbered pages and category pages. Search runs across the full collection before filtering, sorting and pagination. It works through a normal GET form without client JavaScript. Legacy page and category URLs remain available. Results have one detail link, the supplied logo and a concise service summary. Contact actions remain on the detail page.
- E-learning now leads with the course catalogue and separates local learning organizations from external resources. Removed the broken decorative banner, repeated promotional panels and anonymous author avatars. Shared course cards retain the supplied photographs. Subject and level filters derive from the published courses, including personal development.
- Course details retain the lesson content, video and external course links. Added compact metadata and an expandable contents list on phones. Corrected section links to use Astro's heading slugs. Tables and code can scroll within the article.
- Projects now separates the submission directory from individual project records. Removed aggregate statistics and repeated impact previews. Details retain the authored programs, outcomes, dates and source links. Sharing uses the site's correct domain. Rewrote promotional introductions without adding factual claims.
- Corrected the JRS logo extension to match the supplied local asset. Kept the ReFAN submission and removed the disputed access instructions.

### Verification

- Production build passes. All 314 tests pass across 29 suites. Added regression checks for full-directory search, accent-insensitive matching, combined filters, preserved pagination parameters, invalid page/category handling and course filter reset.
- TypeScript checks pass for the changed search and directory helpers. `git diff --check` passes.
- Checked 71 generated pages for a single main landmark and page heading, duplicate IDs, form labels and local images. All 128 local image references resolve. All 51 course contents links have targets. The browser-rendered first service page and legacy pagination together include all 149 services exactly once.
- Browser checks cover service search, category selection, sorting, pagination and reset; course filters, empty results and reset; course section navigation; and project listings/details. Reviewed six page types at desktop size and in a 390px embedded viewport. None of the checked narrow layouts overflow horizontally. Course contents starts collapsed at that width.
- The temporary responsive review page was removed. No external forms were submitted and no deployment was performed. Existing build warnings about prerendered request headers remain. This pass covers Services, E-learning and Projects; it does not claim a fresh review of every other site section.

## 28 September 2026 — Sitewide follow-up and Visit Dzaleka

Reviewed all 203 Astro page templates: 190 rendered samples, 12 redirects and one overlapping event route. The complete route inventory and verification limits are in [ui-page-review.md](./ui-page-review.md).

Added purposeful photography to Services and Projects; rebuilt the document hub and collection About page; simplified Yetu Radio around actual playback; restored the film poster from the local archive; and corrected small heading, form-label and duplicate-ID issues. The Time Capsule now uses dated chapters, archive imagery and nine preserved expandable source excerpts, with compact contribution links. Existing cultural galleries, portrait presentation, service details, shared forms and the interactive map retain their distinct layouts.

Visit navigation now points to the dedicated [Visit Dzaleka website](https://visit.dzaleka.com/). The local visit page provides a short handoff; legacy pricing and travel-guide routes redirect to the official tour and trip-planning pages. Visitor guidelines remain here because the dedicated site links to them. Related documentation was updated.

Validation: production build succeeds; all 314 tests in 29 suites pass; changed helper TypeScript checks pass. The final generated-page audit checked 1,012 HTML pages with no heading, landmark, duplicate-ID, visible-field-label or local-image issues. Template samples were checked at 390px, with desktop visual checks of the redesigned sections. Resource filtering/pagination/reset and Time Capsule navigation/expansion were verified. The review fixture was removed before the final build. No external forms were submitted or deployment performed.
