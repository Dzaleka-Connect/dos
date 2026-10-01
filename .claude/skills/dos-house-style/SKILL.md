---
name: dos-house-style
description: The DOS house style for words, forms, links and page structure. Use when writing or editing any page, component, form, CMS entry, error message or metadata on services.dzaleka.com, and when reviewing content for style.
---

# DOS house style

DOS serves people in and around Dzaleka, many reading in a second or third language, many on a phone with a slow connection. Write so they can find what they need, understand it the first time and act on it.

## Voice

- Plain, calm and direct. Address the reader as "you". Refer to DOS as "we" only on pages DOS speaks for.
- British English spelling: organisation, programme (a scheme), program (software), centre, licence (noun), license (verb).
- Short sentences, about 25 words at most. One idea per sentence. Common words over formal ones: "help" not "facilitate", "use" not "utilise", "about" not "regarding".
- Active voice: "Submit the form by Friday", not "The form must be submitted".
- No exclamation marks, in body text, buttons, success messages or headings.
- Say what is there. Use "is" and "has", not "serves as", "boasts" or "features". No "vibrant", "nestled", "rich heritage", "testament to", "pivotal", "plays a crucial role".
- No trailing clauses that claim significance without evidence ("…, highlighting the community's resilience").
- No "not just X, but Y", no lists of three for rhythm, no closing paragraph that sums up why something matters.
- Attribute claims to a named source. Never "experts say" or "it is widely believed".
- No emoji in headings or as bullet markers.

## Inclusive language

- People first, and describe people the way they describe themselves.
- "older people", not "the elderly". "People with disability" or "disabled people", not "the disabled" or "handicapped". "Uses a wheelchair", not "wheelchair-bound". "Has" or "lives with" a condition, not "suffers from".
- "Refugees", "asylum seekers" and "people seeking asylum" are distinct legal statuses. Use the right one. Never "illegal immigrants".
- Name nationalities and languages correctly: Kinyarwanda, Kirundi, Swahili, Chichewa, French. "DRC" after "Democratic Republic of the Congo" has been written once.
- Leave community-written stories in their authors' voice. Fix only spelling slips, broken links and harmful terms, and tell the owner what changed.

## Numbers, dates and times

- Numerals for all numbers, including 1 to 9: "3 clinics", "1 form". Write a number in words only when it starts a sentence, and rewrite the sentence instead where you can.
- Commas in thousands: 1,200 and 52,000. Percentages with no space: 45%.
- Dates: "17 May 2023". Weekday with no comma: "Monday 17 May 2023". No ordinals ("17th"), no "May 17, 2023", no 05/17/2023. Ranges: "17 to 19 May 2023".
- Format dates in code with `en-GB`, never `en-US`.
- Times: "2pm", "2:30pm", "midday", "midnight". No ":00", no capitals, no space. Ranges: "9am to 5pm". Use `formatClockTime` and `formatOpeningHours` in `src/utils/clockTime.ts` to turn 24-hour values into this style.
- Opening hours: "Monday to Friday, 8am to 5pm".
- Money: currency code, a space, then the amount: "MWK 15,000", "USD 20".
- Phone numbers: start with the country code, "+265 991 234 567", and make them `tel:` links.

## Punctuation

- Double quotation marks, single only for a quote inside a quote.
- Avoid dashes in sentences. Use a full stop, a comma or brackets instead. Use an en dash only between numbers in tables.
- No "e.g.", "i.e." or "etc.". Write "for example" or "that is", or give the full list.
- No "and/or". Write "or", or "X, Y or both".
- No full stop at the end of a heading, a button or a label.
- Avoid ampersands in running text. Use them only in proper names that contain them.
- Avoid slashes between words.

## Headings and page structure

- Sentence case everywhere: titles, headings, buttons, labels, menu items, table headers. Capitalise only the first word and proper names: "Find a health service", not "Find A Health Service".
- Headings say what the section contains. Start with the words people scan for. Not "Overview", "Introduction", "More information" or "Learn more".
- Headings are statements. Question headings are fine only on FAQ pages and Easy Read pages, where each heading is a question someone asks.
- One h1 per page. Do not skip heading levels (h2 then h4). A body from the CMS must not repeat the page title as its own h1.
- Use "Contents" for an on-page list of sections, not "Table of contents" or "On this page" headings that do nothing.
- No "Executive summary" heading. Put the summary first and give it a real heading.
- Page titles: 70 characters or fewer, unique across the site, most specific words first.
- Meta descriptions: every page has one, 160 characters or fewer, written as a plain sentence about what the page lets you do. `Layout.astro` trims long ones at a sentence or word boundary, but write them to fit.

## Links

- Link text says where the link goes or what it does: "Read the 2024 annual report", not "click here", "read more", "here" or "view".
- Links open in the same tab. Open a new tab only when leaving would lose work the reader has typed. When you do, say so in the link: "Map of services (opens in new tab)".
- Links to files give the type and size: "Download the application form [PDF, 240 KB]". Check the size from the real file, not a guess. Use "View the original [PDF]" when the size is unknown.
- Do not link the same destination twice in one paragraph.

## Forms

- Ask only what you need. If you cannot say why a question is asked, remove it.
- Every field has a visible `<label>`. Put hint text under the label and above the field, not inside it. No placeholder text.
- Do not mark required fields. Mark the few optional ones by adding "(optional)" to the label. No asterisks.
- Names: "Given name" and "Family name", or one "Full name" field. Never "First name", "Last name", "Surname" or "Christian name".
- Short lists of choices (up to about 7) are radios in a `<fieldset>` whose `<legend>` asks the question. Use a select menu only for long lists such as countries.
- Option labels are in sentence case and read as answers to the legend.
- Errors are announced in an error summary at the top of the form and next to the field. Say what to do: "Enter your phone number, starting with +265", not "Invalid input". `src/utils/formErrors.ts` and `reviewedForm.ts` already do this. Use them.
- Do not change the page when someone picks an option. Use a submit button or a link.
- Phone hints: "Start with the country code, +265".
- Buttons say what happens: "Send report", "Save and continue". Not "Submit" when a better verb exists.
- Success messages say what happens next and when.

## Tables, images and media

- Tables have header cells (`<th>`) and a `<caption>` saying what the table shows. Markdown tables get a screen-reader caption from the heading before them (`src/plugins/rehype-table-captions.mjs`), so put a heading above every table. CMS bodies do not go through that plugin.
- Do not use tables for layout.
- Every image has `alt`. Describe what the image shows that matters to the page. Use `alt=""` for decoration. Never use a file name, "image", "photo" or "logo" alone as alt text. For a logo, write "[Organisation] logo".
- Videos have a title and, where one exists, captions.

## Where content lives

- News, Events and Jobs are edited in the CMS at cms.dzaleka.com, not in `src/content/`. Style fixes to them must be made there, by an editor or through the CMS repository with the owner's say-so.
- Other collections are Markdown under `src/content/`. Pages and components are under `src/pages/` and `src/components/`.

## Checking your work

Before committing content or a page, check:

1. British spelling, no exclamation marks, no "e.g." or "etc."
2. Dates "17 May 2023", times "2pm"
3. Sentence-case headings, no skipped levels, one h1
4. Link text that makes sense on its own, file links with type and size, no unannounced new tabs
5. Form fields with labels and hints, no placeholders, no asterisks, "(optional)" where needed, radios for short lists
6. Title 70 characters or fewer, meta description 160 or fewer, both unique
7. Plain claims with named sources, no promotional words

When a rule here conflicts with a page's established design, keep the page's layout and fix the words.
