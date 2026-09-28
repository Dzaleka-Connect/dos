# Sitewide UI review — 28 September 2026

## Coverage

- Inventoried all 203 Astro page templates: 190 rendered template samples, 12 redirects and one event template shadowed by the explicit past/upcoming routes.
- Checked 1,012 generated HTML pages for one page heading and main landmark, duplicate IDs, visible form labels and local image references. No issues remain in these checks. Static files copied from public, including the separate admin application, are excluded.
- Checked a representative route for each rendered template in a 390px embedded browser viewport. No horizontal page overflow was found. Repeated content records are covered by the generated-page audit; they were not all individually inspected visually.
- Visually inspected the changed Services, Projects, Resources, Time Capsule, Visit, film and radio layouts at desktop size. Reviewed cultural pages without replacing their artwork, portraits or galleries with generic text layouts.

## Changes in this pass

- Services: photograph beside the introduction, with search and registration directly below it; compact introductions for filtered results.
- Projects: a Tumaini Festival feature using an existing photograph, followed by the other project records.
- Resources: a document-led introduction, actual featured record, full-collection search and category filters, consistent document metadata and an About page specific to the collection.
- Time Capsule: three dated chapters, an uncropped archive photograph, a dated population record, nine preserved document excerpts in native expandable sections, and compact contribution links. Removed the generic banner, repeated panels, undated population tiles and promotional closing quote. Existing history and population Encyclopedia entries provide further context and sources.
- Yetu Radio: station identity and native audio controls, actual playback status and a direct stream fallback. Removed programme names generated from the visitor's local clock, placeholder social links and the always-live indicator.
- We Name Ourselves: retained the film's serif typography, imagery and dark presentation; tightened spacing and credits, removed poster rotation, and replaced the stalled remote poster with the existing local archive image.
- Visit: navigation now points to https://visit.dzaleka.com/. The local overview connects visitors to the dedicated site. Old pricing and travel-guide routes redirect to the official walking-tour and trip-planning pages. Updated related documentation and map/guidelines links. Local visitor guidelines remain available because the dedicated site links to them.
- Small fixes: wrapped the photo-year heading, named the staff search button and analytics file input, and removed a duplicate dashboard toast ID.

## Validation

- Production build passes; 314 tests pass in 29 suites.
- TypeScript checks pass for the changed search and service-directory helpers with Astro's generated declarations.
- Resource search checked with education (17 results), pagination to results 7–12, combined Report category (4 results), no results, and reset (195 records).
- Time Capsule chapter navigation and record expansion checked at desktop and 390px. All nine original document excerpts match the generated output.
- Visit walking-tour and things-to-do destinations opened successfully. Generated redirects point to the dedicated site.
- Temporary browser-review fixture removed before the final build. No external forms submitted, uploads made, commit pushed or deployment performed.

## Limits

The structural audit is not a complete accessibility certification. Lazy or remote image availability is not guaranteed across every record. The radio stream was not played. Existing build warnings remain for prerendered request headers, a missing optional gallery directory and overlapping job routes. No new historical research was performed for the Time Capsule; its excerpt text is preserved from the existing page.

## Template inventory

Generated page counts exclude redirects. Browser samples represent a template, not every record produced by that template.

| Template | Generated pages | Sample | Review method |
| --- | ---: | --- | --- |
| `[...slug].astro` | 3 | [Open](/reference/public-api-and-agents/) | Generated HTML + 390px browser sample |
| `404.astro` | 1 | [Open](/404) | Generated HTML + 390px browser sample |
| `about.astro` | 1 | [Open](/about/) | Generated HTML + 390px browser sample |
| `analytics.astro` | 1 | [Open](/analytics/) | Generated HTML + 390px browser sample |
| `api-docs.astro` | 1 | [Open](/api-docs/) | Generated HTML + 390px browser sample |
| `api-test.astro` | 1 | [Open](/api-test/) | Generated HTML + 390px browser sample |
| `applications/index.astro` | 1 | [Open](/applications/) | Generated HTML + 390px browser sample |
| `applications/internal/advocacy.astro` | 1 | [Open](/applications/internal/advocacy/) | Generated HTML + 390px browser sample |
| `applications/internal/emergency.astro` | 1 | [Open](/applications/internal/emergency/) | Generated HTML + 390px browser sample |
| `applications/internal/index.astro` | 0 | [Open](/applications/internal) | Redirect: source reviewed |
| `applications/internal/leadership.astro` | 1 | [Open](/applications/internal/leadership/) | Generated HTML + 390px browser sample |
| `applications/internal/legal.astro` | 1 | [Open](/applications/internal/legal/) | Generated HTML + 390px browser sample |
| `chrome-extension.astro` | 1 | [Open](/chrome-extension/) | Generated HTML + 390px browser sample |
| `communities.astro` | 1 | [Open](/communities/) | Generated HTML + 390px browser sample |
| `communities/[slug].astro` | 8 | [Open](/communities/artisans-and-crafts/) | Generated HTML + 390px browser sample |
| `community-voice.astro` | 1 | [Open](/community-voice/) | Generated HTML + 390px browser sample |
| `community-voices/[slug].astro` | 2 | [Open](/community-voices/divineirakoze/) | Generated HTML + 390px browser sample |
| `connecting-dzaleka.astro` | 1 | [Open](/connecting-dzaleka/) | Generated HTML + 390px browser sample |
| `contact.astro` | 1 | [Open](/contact/) | Generated HTML + 390px browser sample |
| `culture/index.astro` | 1 | [Open](/culture/) | Generated HTML + 390px browser sample |
| `dancers.astro` | 1 | [Open](/dancers/) | Generated HTML + 390px browser sample |
| `dancers/[slug].astro` | 6 | [Open](/dancers/christian-piniero/) | Generated HTML + 390px browser sample |
| `dancers/book-performance.astro` | 1 | [Open](/dancers/book-performance/) | Generated HTML + 390px browser sample |
| `dancers/submit.astro` | 1 | [Open](/dancers/submit/) | Generated HTML + 390px browser sample |
| `dashboard.astro` | 1 | [Open](/dashboard/) | Generated HTML + 390px browser sample |
| `data.astro` | 1 | [Open](/data/) | Generated HTML + 390px browser sample |
| `datasets/[slug].astro` | 19 | [Open](/datasets/community-voices/) | Generated HTML + 390px browser sample |
| `datasets/index.astro` | 1 | [Open](/datasets/) | Generated HTML + 390px browser sample |
| `docs/[slug].astro` | 28 | [Open](/docs/about/) | Generated HTML + 390px browser sample |
| `docs/agent-access.astro` | 0 | [Open](/docs/agent-access) | Redirect: source reviewed |
| `docs/api-documentation.astro` | 0 | [Open](/docs/api-documentation) | Redirect: source reviewed |
| `docs/index.astro` | 1 | [Open](/docs/) | Generated HTML + 390px browser sample |
| `dzaleka-time-capsule.astro` | 1 | [Open](/dzaleka-time-capsule/) | Generated HTML + 390px browser sample |
| `dzaleka-wellbeing.astro` | 1 | [Open](/dzaleka-wellbeing/) | Generated HTML + 390px browser sample |
| `dzaleka-wellbeing/structural-causes.astro` | 1 | [Open](/dzaleka-wellbeing/structural-causes/) | Generated HTML + 390px browser sample |
| `dzaleka-wellbeing/supporting-someone.astro` | 1 | [Open](/dzaleka-wellbeing/supporting-someone/) | Generated HTML + 390px browser sample |
| `dzaleka-wellbeing/the-research.astro` | 1 | [Open](/dzaleka-wellbeing/the-research/) | Generated HTML + 390px browser sample |
| `e-learning.astro` | 1 | [Open](/e-learning/) | Generated HTML + 390px browser sample |
| `e-learning/courses/[slug].astro` | 5 | [Open](/e-learning/courses/a-good-start-life-skills/) | Generated HTML + 390px browser sample |
| `e-learning/courses/index.astro` | 1 | [Open](/e-learning/courses/) | Generated HTML + 390px browser sample |
| `e-learning/courses/submit-success.astro` | 1 | [Open](/e-learning/courses/submit-success/) | Generated HTML + 390px browser sample |
| `e-learning/courses/submit.astro` | 1 | [Open](/e-learning/courses/submit/) | Generated HTML + 390px browser sample |
| `easy-read/about-dzaleka.astro` | 1 | [Open](/easy-read/about-dzaleka/) | Generated HTML + 390px browser sample |
| `easy-read/getting-help.astro` | 1 | [Open](/easy-read/getting-help/) | Generated HTML + 390px browser sample |
| `easy-read/index.astro` | 1 | [Open](/easy-read/) | Generated HTML + 390px browser sample |
| `easy-read/using-this-site.astro` | 1 | [Open](/easy-read/using-this-site/) | Generated HTML + 390px browser sample |
| `encyclopedia/[slug].astro` | 81 | [Open](/encyclopedia/adai-circle/) | Generated HTML + 390px browser sample |
| `encyclopedia/about.astro` | 1 | [Open](/encyclopedia/about/) | Generated HTML + 390px browser sample |
| `encyclopedia/developers.astro` | 1 | [Open](/encyclopedia/developers/) | Generated HTML + 390px browser sample |
| `encyclopedia/editorial-guidelines.astro` | 1 | [Open](/encyclopedia/editorial-guidelines/) | Generated HTML + 390px browser sample |
| `encyclopedia/index.astro` | 1 | [Open](/encyclopedia/) | Generated HTML + 390px browser sample |
| `encyclopedia/submit-correction.astro` | 1 | [Open](/encyclopedia/submit-correction/) | Generated HTML + 390px browser sample |
| `entrepreneurs.astro` | 1 | [Open](/entrepreneurs/) | Generated HTML + 390px browser sample |
| `events/[...slug].astro` | 0 | [Open](/events/refugees-media-narratives-zoom-session) | Server-rendered browser sample |
| `events/[type]/[page].astro` | 0 | — | Source reviewed; shadowed by the explicit past/upcoming routes |
| `events/index.astro` | 0 | [Open](/events) | Server-rendered browser sample |
| `events/organize.astro` | 0 | [Open](/events/organize) | Server-rendered browser sample |
| `events/organizer/[organizer].astro` | 0 | [Open](/events/organizer/inua-advocacy) | Server-rendered browser sample |
| `events/past/[page].astro` | 0 | [Open](/events/past/1) | Server-rendered browser sample |
| `events/past/index.astro` | 0 | [Open](/events/past) | Redirect: source reviewed |
| `events/upcoming/[page].astro` | 0 | [Open](/events/upcoming/1) | Server-rendered browser sample |
| `explore.astro` | 1 | [Open](/explore/) | Generated HTML + 390px browser sample |
| `explore/submit.astro` | 0 | [Open](/explore/submit) | Redirect: source reviewed |
| `get-help-now.astro` | 1 | [Open](/get-help-now/) | Generated HTML + 390px browser sample |
| `grants-and-programs.astro` | 0 | [Open](/grants-and-programs) | Server-rendered browser sample |
| `grants-and-programs/[slug].astro` | 0 | [Open](/grants-and-programs/papita-khasu-virtual-artist-residency) | Server-rendered browser sample |
| `grants-and-programs/submit.astro` | 1 | [Open](/grants-and-programs/submit/) | Generated HTML + 390px browser sample |
| `help-desk.astro` | 1 | [Open](/help-desk/) | Generated HTML + 390px browser sample |
| `index.astro` | 0 | [Open](/) | Server-rendered browser sample |
| `inspirational-stories/[slug].astro` | 17 | [Open](/inspirational-stories/ali-hussein/) | Generated HTML + 390px browser sample |
| `inspirational-stories/index.astro` | 1 | [Open](/inspirational-stories/) | Generated HTML + 390px browser sample |
| `jobs/[...page].astro` | 3 | [Open](/jobs/2/) | Generated HTML + 390px browser sample |
| `jobs/[slug].astro` | 18 | [Open](/jobs/assistant-communications-officer/) | Generated HTML + 390px browser sample |
| `jobs/about.astro` | 1 | [Open](/jobs/about/) | Generated HTML + 390px browser sample |
| `jobs/index.astro` | 0 | [Open](/jobs) | Server-rendered browser sample |
| `jobs/post.astro` | 1 | [Open](/jobs/post/) | Generated HTML + 390px browser sample |
| `jobs/submitted.astro` | 1 | [Open](/jobs/submitted/) | Generated HTML + 390px browser sample |
| `languages.astro` | 1 | [Open](/languages/) | Generated HTML + 390px browser sample |
| `map.astro` | 1 | [Open](/map/) | Generated HTML + 390px browser sample |
| `map/submit.astro` | 1 | [Open](/map/submit/) | Generated HTML + 390px browser sample |
| `marketplace/[slug].astro` | 13 | [Open](/marketplace/being-a-refugee-wasnt-a-choice/) | Generated HTML + 390px browser sample |
| `marketplace/index.astro` | 1 | [Open](/marketplace/) | Generated HTML + 390px browser sample |
| `marketplace/returns.astro` | 1 | [Open](/marketplace/returns/) | Generated HTML + 390px browser sample |
| `marketplace/shipping.astro` | 1 | [Open](/marketplace/shipping/) | Generated HTML + 390px browser sample |
| `marketplace/stores/[slug].astro` | 4 | [Open](/marketplace/stores/dowa-bakery/) | Generated HTML + 390px browser sample |
| `marketplace/stores/index.astro` | 1 | [Open](/marketplace/stores/) | Generated HTML + 390px browser sample |
| `marketplace/stores/register.astro` | 1 | [Open](/marketplace/stores/register/) | Generated HTML + 390px browser sample |
| `marketplace/stores/success.astro` | 1 | [Open](/marketplace/stores/success/) | Generated HTML + 390px browser sample |
| `marketplace/submit.astro` | 1 | [Open](/marketplace/submit/) | Generated HTML + 390px browser sample |
| `marketplace/success.astro` | 1 | [Open](/marketplace/success/) | Generated HTML + 390px browser sample |
| `new-to-dzaleka.astro` | 1 | [Open](/new-to-dzaleka/) | Generated HTML + 390px browser sample |
| `news/[...slug].astro` | 31 | [Open](/news/2025-digital-performance-report/) | Generated HTML + 390px browser sample |
| `news/category/[category].astro` | 5 | [Open](/news/category/announcement/) | Generated HTML + 390px browser sample |
| `news/index.astro` | 0 | [Open](/news) | Server-rendered browser sample |
| `open-data-platform.astro` | 1 | [Open](/open-data-platform/) | Generated HTML + 390px browser sample |
| `open-license.astro` | 1 | [Open](/open-license/) | Generated HTML + 390px browser sample |
| `photo-guidelines.astro` | 1 | [Open](/photo-guidelines/) | Generated HTML + 390px browser sample |
| `photos/[slug].astro` | 28 | [Open](/photos/a-man-collecting-cardboard/) | Generated HTML + 390px browser sample |
| `photos/[slug]/print.astro` | 28 | [Open](/photos/a-man-collecting-cardboard/print/) | Generated HTML + 390px browser sample |
| `photos/[year].astro` | 6 | [Open](/photos/2015/) | Generated HTML + 390px browser sample |
| `photos/contributor/[name].astro` | 11 | [Open](/photos/contributor/Diego-Menjíbar-Reynés/) | Generated HTML + 390px browser sample |
| `photos/contributors.astro` | 1 | [Open](/photos/contributors/) | Generated HTML + 390px browser sample |
| `photos/index.astro` | 1 | [Open](/photos/) | Generated HTML + 390px browser sample |
| `photos/license.astro` | 1 | [Open](/photos/license/) | Generated HTML + 390px browser sample |
| `photos/submit.astro` | 1 | [Open](/photos/submit/) | Generated HTML + 390px browser sample |
| `platform-features.astro` | 1 | [Open](/platform-features/) | Generated HTML + 390px browser sample |
| `poets.astro` | 1 | [Open](/poets/) | Generated HTML + 390px browser sample |
| `poets/[page].astro` | 3 | [Open](/poets/2/) | Generated HTML + 390px browser sample |
| `poets/[slug].astro` | 21 | [Open](/poets/aj-peace-justice/) | Generated HTML + 390px browser sample |
| `poets/submit.astro` | 1 | [Open](/poets/submit/) | Generated HTML + 390px browser sample |
| `privacy.astro` | 1 | [Open](/privacy/) | Generated HTML + 390px browser sample |
| `projects.astro` | 0 | [Open](/projects) | Server-rendered browser sample |
| `projects/[...slug].astro` | 5 | [Open](/projects/ai-tech-training/) | Generated HTML + 390px browser sample |
| `public-art-catalogue.astro` | 0 | [Open](/public-art-catalogue) | Server-rendered browser sample |
| `public-art-catalogue/[page].astro` | 0 | — | Redirect: source reviewed |
| `public-art-catalogue/[slug].astro` | 3 | [Open](/public-art-catalogue/child-early-marriage-awareness-mural/) | Generated HTML + 390px browser sample |
| `public-art-catalogue/[slug]/print.astro` | 3 | [Open](/public-art-catalogue/child-early-marriage-awareness-mural/print/) | Generated HTML + 390px browser sample |
| `public-art-catalogue/about.astro` | 1 | [Open](/public-art-catalogue/about/) | Generated HTML + 390px browser sample |
| `public-art-catalogue/artist/[slug].astro` | 24 | [Open](/public-art-catalogue/artist/aksanti-murhebwa/) | Generated HTML + 390px browser sample |
| `public-art-catalogue/license.astro` | 1 | [Open](/public-art-catalogue/license/) | Generated HTML + 390px browser sample |
| `public-art-catalogue/report-issue.astro` | 1 | [Open](/public-art-catalogue/report-issue/) | Generated HTML + 390px browser sample |
| `public-art-catalogue/submit-update.astro` | 1 | [Open](/public-art-catalogue/submit-update/) | Generated HTML + 390px browser sample |
| `public-art-catalogue/submit.astro` | 1 | [Open](/public-art-catalogue/submit/) | Generated HTML + 390px browser sample |
| `public-art-catalogue/visual-arts-community.astro` | 1 | [Open](/public-art-catalogue/visual-arts-community/) | Generated HTML + 390px browser sample |
| `resources/[...page].astro` | 0 | [Open](/resources) | Server-rendered browser sample |
| `resources/[slug].astro` | 195 | [Open](/resources/adai-circle-education/) | Generated HTML + 390px browser sample |
| `resources/about.astro` | 1 | [Open](/resources/about/) | Generated HTML + 390px browser sample |
| `resources/submit.astro` | 1 | [Open](/resources/submit/) | Generated HTML + 390px browser sample |
| `resources/submit/thank-you.astro` | 1 | [Open](/resources/submit/thank-you/) | Generated HTML + 390px browser sample |
| `rights-navigator/[...slug].astro` | 8 | [Open](/rights-navigator/constitutional-rights/) | Generated HTML + 390px browser sample |
| `rights-navigator/about.astro` | 1 | [Open](/rights-navigator/about/) | Generated HTML + 390px browser sample |
| `rights-navigator/incident-report.astro` | 1 | [Open](/rights-navigator/incident-report/) | Generated HTML + 390px browser sample |
| `rights-navigator/index.astro` | 0 | [Open](/rights-navigator) | Server-rendered browser sample |
| `rights-navigator/report.astro` | 1 | [Open](/rights-navigator/report/) | Generated HTML + 390px browser sample |
| `search.astro` | 1 | [Open](/search/) | Generated HTML + 390px browser sample |
| `search/results.astro` | 1 | [Open](/search/results/) | Generated HTML + 390px browser sample |
| `services/[...slug].astro` | 149 | [Open](/services/accb-private-school/) | Generated HTML + 390px browser sample |
| `services/[page].astro` | 24 | [Open](/services/10/) | Generated HTML + 390px browser sample |
| `services/category/[category]/[...page].astro` | 35 | [Open](/services/category/advocacy/) | Generated HTML + 390px browser sample |
| `services/index.astro` | 0 | [Open](/services) | Server-rendered browser sample |
| `services/register.astro` | 1 | [Open](/services/register/) | Generated HTML + 390px browser sample |
| `services/stats.astro` | 1 | [Open](/services/stats/) | Generated HTML + 390px browser sample |
| `services/update-request.astro` | 1 | [Open](/services/update-request/) | Generated HTML + 390px browser sample |
| `services/update-success.astro` | 1 | [Open](/services/update-success/) | Generated HTML + 390px browser sample |
| `site-register.astro` | 1 | [Open](/site-register/) | Generated HTML + 390px browser sample |
| `site-register/[page].astro` | 2 | [Open](/site-register/1/) | Generated HTML + 390px browser sample |
| `site-register/[slug].astro` | 12 | [Open](/site-register/dzaleka-arts-lab/) | Generated HTML + 390px browser sample |
| `site-register/[slug]/print.astro` | 12 | [Open](/site-register/dzaleka-arts-lab/print/) | Generated HTML + 390px browser sample |
| `site-register/about.astro` | 1 | [Open](/site-register/about/) | Generated HTML + 390px browser sample |
| `site-register/license.astro` | 1 | [Open](/site-register/license/) | Generated HTML + 390px browser sample |
| `site-register/report-issue.astro` | 1 | [Open](/site-register/report-issue/) | Generated HTML + 390px browser sample |
| `site-register/submit-update.astro` | 1 | [Open](/site-register/submit-update/) | Generated HTML + 390px browser sample |
| `site-register/submit.astro` | 1 | [Open](/site-register/submit/) | Generated HTML + 390px browser sample |
| `skills-exchange/about.astro` | 1 | [Open](/skills-exchange/about/) | Generated HTML + 390px browser sample |
| `skills-exchange/index.astro` | 1 | [Open](/skills-exchange/) | Generated HTML + 390px browser sample |
| `skills-exchange/list-profile.astro` | 1 | [Open](/skills-exchange/list-profile/) | Generated HTML + 390px browser sample |
| `skills-exchange/matches.astro` | 1 | [Open](/skills-exchange/matches/) | Generated HTML + 390px browser sample |
| `skills-exchange/matches/[category].astro` | 8 | [Open](/skills-exchange/matches/Arts & Crafts/) | Generated HTML + 390px browser sample |
| `skills-exchange/profile/[slug].astro` | 26 | [Open](/skills-exchange/profile/andy/) | Generated HTML + 390px browser sample |
| `skills-exchange/request.astro` | 1 | [Open](/skills-exchange/request/) | Generated HTML + 390px browser sample |
| `skills-exchange/skills-offered/[page].astro` | 3 | [Open](/skills-exchange/skills-offered/1/) | Generated HTML + 390px browser sample |
| `skills-exchange/skills-offered/index.astro` | 0 | [Open](/skills-exchange/skills-offered) | Redirect: source reviewed |
| `skills-exchange/skills-requested/[page].astro` | 1 | [Open](/skills-exchange/skills-requested/1/) | Generated HTML + 390px browser sample |
| `skills-exchange/skills-requested/index.astro` | 0 | [Open](/skills-exchange/skills-requested) | Redirect: source reviewed |
| `skills-exchange/update-profile.astro` | 1 | [Open](/skills-exchange/update-profile/) | Generated HTML + 390px browser sample |
| `staff/contributing.astro` | 1 | [Open](/staff/contributing/) | Generated HTML + 390px browser sample |
| `staff/faq.astro` | 1 | [Open](/staff/faq/) | Generated HTML + 390px browser sample |
| `staff/guidelines.astro` | 1 | [Open](/staff/guidelines/) | Generated HTML + 390px browser sample |
| `staff/index.astro` | 1 | [Open](/staff/) | Generated HTML + 390px browser sample |
| `staff/onboarding.astro` | 1 | [Open](/staff/onboarding/) | Generated HTML + 390px browser sample |
| `staff/training.astro` | 1 | [Open](/staff/training/) | Generated HTML + 390px browser sample |
| `staff/training/blogger.astro` | 1 | [Open](/staff/training/blogger/) | Generated HTML + 390px browser sample |
| `start-here.astro` | 1 | [Open](/start-here/) | Generated HTML + 390px browser sample |
| `stories/[slug].astro` | 2 | [Open](/stories/living-hope/) | Generated HTML + 390px browser sample |
| `stories/index.astro` | 1 | [Open](/stories/) | Generated HTML + 390px browser sample |
| `submit-voice.astro` | 1 | [Open](/submit-voice/) | Generated HTML + 390px browser sample |
| `success-stories.astro` | 1 | [Open](/success-stories/) | Generated HTML + 390px browser sample |
| `support-our-work.astro` | 1 | [Open](/support-our-work/) | Generated HTML + 390px browser sample |
| `support.astro` | 1 | [Open](/support/) | Generated HTML + 390px browser sample |
| `talents/[page].astro` | 7 | [Open](/talents/1/) | Generated HTML + 390px browser sample |
| `talents/index.astro` | 1 | [Open](/talents/) | Generated HTML + 390px browser sample |
| `talents/submit.astro` | 1 | [Open](/talents/submit/) | Generated HTML + 390px browser sample |
| `terms.astro` | 1 | [Open](/terms/) | Generated HTML + 390px browser sample |
| `test-api.astro` | 1 | [Open](/test-api/) | Generated HTML + 390px browser sample |
| `test-resources.astro` | 1 | [Open](/test-resources/) | Generated HTML + 390px browser sample |
| `thank-you.astro` | 1 | [Open](/thank-you/) | Generated HTML + 390px browser sample |
| `time-capsule.astro` | 0 | [Open](/time-capsule) | Redirect: source reviewed |
| `tools-and-templates.astro` | 1 | [Open](/tools-and-templates/) | Generated HTML + 390px browser sample |
| `tools-and-templates/[slug].astro` | 6 | [Open](/tools-and-templates/cash-flow-forecast-template/) | Generated HTML + 390px browser sample |
| `updates/[page].astro` | 3 | [Open](/updates/1/) | Generated HTML + 390px browser sample |
| `updates/index.astro` | 0 | [Open](/updates) | Redirect: source reviewed |
| `updates/view/[id].astro` | 12 | [Open](/updates/view/0/) | Generated HTML + 390px browser sample |
| `visit.astro` | 1 | [Open](/visit/) | Generated HTML + 390px browser sample |
| `visit/become-guide.astro` | 1 | [Open](/visit/become-guide/) | Generated HTML + 390px browser sample |
| `visit/feedback-thanks.astro` | 1 | [Open](/visit/feedback-thanks/) | Generated HTML + 390px browser sample |
| `visit/feedback.astro` | 1 | [Open](/visit/feedback/) | Generated HTML + 390px browser sample |
| `visit/guidelines.astro` | 1 | [Open](/visit/guidelines/) | Generated HTML + 390px browser sample |
| `visit/pricing.astro` | 0 | [Open](/visit/pricing) | Redirect: source reviewed |
| `visit/travel-guide.astro` | 0 | [Open](/visit/travel-guide) | Redirect: source reviewed |
| `voice-submitted.astro` | 1 | [Open](/voice-submitted/) | Generated HTML + 390px browser sample |
| `we-name-ourselves.astro` | 1 | [Open](/we-name-ourselves/) | Generated HTML + 390px browser sample |
| `weather.astro` | 1 | [Open](/weather/) | Generated HTML + 390px browser sample |
| `yetu-radio.astro` | 1 | [Open](/yetu-radio/) | Generated HTML + 390px browser sample |
