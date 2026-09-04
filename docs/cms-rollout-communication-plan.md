# Communication plan: opening the content editor to community editors

Working document. Not published to the site.

Planned with [OASIS](https://www.communications.gov.uk/publication/guide-to-campaign-planning-oasis/) and evaluated with the [GCS Evaluation Cycle](https://www.communications.gov.uk/publications/gcs-evaluation-cycle/).

**Status: blocked.** Nothing below can start until a GitHub OAuth app is registered and linked in Netlify. Until then only the maintainer can sign in to the editor.

---

## Objective

**Policy aim.** Community members publish their own news, events, jobs, photos and stories directly. They no longer submit them and wait for one person to transcribe them.

**Communications objective.** Within six months of launch, at least 6 people other than the maintainer publish through the editor. At least half of all items published in that period come from someone other than the maintainer.

The baseline is measurable from the repository, so progress can be checked at any time without a survey.

| Collection | Published in the last 12 months | Total |
| --- | --- | --- |
| News | 12 | 30 |
| Events | 7 | 26 |
| Jobs | 5 | 18 |
| Photos | 4 | 28 |
| Community voices | 1 | 2 |
| **All five** | **29** | **104** |

Every one of those 29 items was published by the same person. That is the number this plan exists to change.

---

## Audience and insight

Four audiences, in priority order.

**Potential editors.** Community members who already contribute or would if it were easier. They need a GitHub account and repository access, which is a real barrier and a real risk. This is the audience the plan lives or dies on.

**Existing contributors.** People who submit through the site's forms today. There are 34 such forms, all posting to a third-party service and arriving as email for someone to process by hand. They experience the site as a suggestion box with a slow reply.

**Readers.** People who use the site for services, jobs and events. They need to know that faster publishing does not mean unchecked publishing.

**Partner organisations.** Groups listed in the directory who may want to maintain their own entries. Not in scope for this rollout, but they will ask once they notice.

**Insight.** The bottleneck is not willingness, it is the queue. Community voices received one new story in twelve months while the site carried 34 routes for submitting things. People are not declining to contribute. Their contributions are arriving somewhere that needs a person to act on them.

---

## Strategy and idea

**The idea: "You write it, it publishes."**

The message is about removing a wait, not about a new tool. Nobody wants a content management system. They want the thing they wrote to appear.

Three strategic choices:

- **Recruit a small first group, do not announce broadly.** Six named people onboarded properly will produce more than a public call for volunteers. It also keeps repository access to people you can vouch for.
- **Lead with the collections that have the clearest owners.** Events and jobs have obvious authors, an organiser or an employer. Start there rather than with news.
- **Use dzaleka.com, not just this site.** It is the community's main publication and already feeds the encyclopedia's coverage sidebar. Announcing only on a site people have not visited yet reaches nobody new.

---

## Implementation

Channels already in place, so cost is time rather than money.

| Channel | Use |
| --- | --- |
| Direct approach | Recruiting the first six editors |
| dzaleka.com | The public announcement, once editors are live |
| Site news article | The permanent explainer and the link people are sent |
| RSS feeds | Automatic distribution to existing subscribers |
| Facebook, Instagram, X | Short prompts pointing at the news article |
| Resend email | Replies to people who have submitted through a form |
| `/docs/contribute` | Updated so the existing route reflects the new one |

**Sequence.**

1. Register the GitHub OAuth app and link it in Netlify, then confirm sign-in works end to end.
2. Make one test edit yourself in each of the five collections and check the resulting commits are clean.
3. Approach six people directly and offer to sit with each of them for their first entry.
4. Publish the news article explaining what changed and who can take part.
5. Share it through dzaleka.com and the social accounts.
6. Reply to recent form submitters, telling them they can now publish this themselves.
7. Review at three months against the measures below, and again at six.

---

## Scoring and evaluation

Evaluation follows the six stages of the GCS Evaluation Cycle. Every measure below comes from the repository or from Google Analytics, which the site already loads, so none of it needs new tooling.

Note: `/api/analytics/pageviews` is a stub that returns zero. Use Google Analytics for reach, not that endpoint.

| Stage | What we measure | Source |
| --- | --- | --- |
| **Inputs** | The 12-month baseline above: 29 items, one author | `git log` |
| **Outputs** | Views of the announcement article, feed pickup, social reach | Google Analytics, dzaleka.com |
| **Outtakes** | People who ask about becoming an editor, or accept when approached | Direct record |
| **Outcomes** | Editors onboarded, items published, distinct commit authors | `git shortlog -sne` |
| **Impact** | Items published per month against baseline, and time from submission to publication | `git log`, form replies |
| **Learning** | What blocked the people who did not complete onboarding | Notes from each session |

**Baseline to record before launch.** Number of distinct authors, which is one, and items published per month across the five collections, which is 2.4.

**Review points.** Three months and six months. At three months the question is whether onboarding works. At six months it is whether publishing has actually shifted.

---

## Assumptions

Each of these is a guess, not a finding. They are listed so they can be tested rather than relied on.

- people want to publish directly, and the queue rather than motivation is what limits contributions
- a GitHub account is an acceptable requirement for six trusted people, even though it would not be for a general call
- the maintainer has time to sit with each new editor for a first entry
- editors will accept a review conversation about quality without treating it as gatekeeping
- dzaleka.com will carry the announcement
- the five collections are the right starting scope, and nobody urgently needs to edit services or the encyclopedia

---

## Risks and resistance points

| Risk | Effect | Response |
| --- | --- | --- |
| **Editors get write access to the whole repository, not just content** | An editor could change code by accident, or an account compromise reaches the codebase | Keep the first group small and known. Consider a machine account or scoped access before widening |
| Nobody signs up | Plan fails quietly and the queue continues | Approach people directly rather than issuing an open call. Six named people beats a public post |
| GitHub account requirement excludes people | The audience most likely to contribute is filtered out at the first step | Offer to sit with people while they create one. Record how many stop here, because it decides whether this model can widen |
| Quality drops, or something harmful is published | Trust in the site is damaged, and it carries emergency contact information | The governance page names who decides. Agree what gets checked before publishing, not after |
| Maintainer becomes a bottleneck again, in review instead of transcription | No net gain | Review the first few entries per editor, then stop |
| Connectivity or device access limits editing | Editors sign up but cannot use the tool | Ask during onboarding. It may mean the mobile experience matters more than assumed |
| Form submissions continue in parallel | Two routes, both half-used, and the queue persists | Reply to submitters pointing at the editor. Consider retiring duplicate forms once editors are active |

---

## Note on the brief

The original brief asked for a plan suitable to inform a Programme Delivery Board. There is not one. This site has a single maintainer and no board. The plan is written to inform the maintainer, and any partner who asks how the site is run.

The OASIS and Evaluation Cycle structures are used as intended. The governance wrapper around them is not, because it would describe an organisation that does not exist here.
