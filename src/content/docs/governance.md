---
title: How decisions are made
description: Who decides what on Dzaleka Online Services, how to challenge a decision, and how the site is kept running if the maintainer is unavailable
section: policies
lastUpdated: 2026-08-26
---
Dzaleka Online Services is maintained by a small number of people, and at the time of writing by one. This page records who decides what, so that a reader can tell where a decision came from and how to challenge it.

It covers decisions about the site. For guidance on submitting content, see [Contribute](/docs/contribute). For handling personal information, see [Privacy guidelines](/docs/privacy-guidelines).

## Governance and day-to-day work are different things

Governance is deciding what the site is for, authorising change, and reviewing whether it is working. Day-to-day work is writing pages, fixing bugs, reviewing submissions and answering questions.

The same person often does both here. Writing them down separately matters anyway, because it makes clear which decisions need a record and which do not.

## Decision types and who decides

| Decision | Who decides | Recorded as |
| --- | --- | --- |
| Publishing a news item, event, job, photo or community voice | Any approved editor | A commit to the repository |
| Correcting a factual error on any page | Any approved editor | A commit, and a reply to the person who reported it |
| Adding or changing an encyclopedia entry | Maintainer, on cited evidence | A commit including the sources |
| Removing content on request | Maintainer | A commit, and a written reason to the requester |
| Adding a collection to the content editor | Maintainer | A change to the editor configuration and its tests |
| Changing the public API in a way that breaks existing callers | Maintainer | A deprecation notice, then removal after the notice period |
| Granting or removing editor access | Maintainer | A change to repository access |
| Changing what the site is for | Maintainer, after consulting the community | An update to [Platform principles](/docs/platform-principles) |

"Approved editor" means someone who has been given access to the content editor. "Maintainer" means the person or people who hold administrative access to the repository and hosting.

## Thresholds that trigger a slower route

Most changes here are cheap to make and cheap to reverse, so they do not need approval. Four do not fit that description, and each has a rule attached.

**Anything that breaks an existing API caller.** The published policy at [/api/deprecation-policy](https://services.dzaleka.com/api/deprecation-policy) promises at least six months of notice, signalled with `Deprecation` and `Sunset` headers. That promise binds us. An endpoint cannot be removed without that notice having run.

**Anything that publishes personal information.** This does not get published first and reviewed later. See [Privacy guidelines](/docs/privacy-guidelines).

**Anything that changes emergency contact details.** Get Help Now is the page people reach for in a crisis. Changes there are checked against the organisation named before publishing, not after.

**Anything that changes what the site is for.** Adding a whole new area of work is a question for the community the site serves. It is not a maintainer decision.

## How to challenge a decision

1. Report the specific problem through the [correction form](/encyclopedia/submit-correction) for encyclopedia entries, or [Contact](/contact) for anything else.
2. Say what is wrong and, where you can, what the correct information is and where it comes from.
3. Expect a reply that either makes the change or explains why not.

If you disagree with the outcome, say so in the same thread. There is no separate appeal body. Being honest about that is better than inventing one.

## Continuity

The site currently depends on one person holding administrative access to the repository, the hosting, the email service and the package registry. If that person is unavailable, nobody else can deploy a fix, correct a page or restore the site.

This is the largest known risk to the service, and it is not solved by a process document. It is solved by a second person holding access. Until that is in place, this page states the risk plainly rather than implying a resilience the project does not have.

The content itself is less exposed. Every page is a Markdown file in a public Git repository under [CC BY-SA 4.0](/open-license), so the record survives independently of any one person's accounts.

## What this page is not

This is not government project governance. Dzaleka Online Services is a community project. It has no public funding, no supplier contracts and no portfolio above it. Frameworks built for those conditions would describe a structure that does not exist here.

The project may later take on funding or partners who require a formal governance structure. This page is the starting point for one, not a substitute for it.
