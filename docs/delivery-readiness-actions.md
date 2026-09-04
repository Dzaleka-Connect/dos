# Delivery readiness: action list

Working document. Not published to the site.

Actions arising from a readiness review of the site against seven criteria: governance, planning, risk management, stakeholder engagement, commercial, delivery capability, and monitoring and evaluation.

This file records what to do. The detailed findings behind it are deliberately not held in this repository, which is public.

## Essential

Do these before the first community editor is onboarded.

| # | Action | Why it matters |
| --- | --- | --- |
| 1 | Confirm every form route is covered by the privacy policy. Start with the routes that collect personal or sensitive information, and either name the processor handling them or change the route. | The privacy policy makes specific promises about how contributor data is handled. Those promises should match what the forms actually do. |
| 2 | Add a test gate to the deploy pipeline. The Netlify build runs `npm run build`. The suite in `tests/` should run and pass first. | 249 tests exist and currently gate nothing. A failing test should stop a deploy, not follow it. |
| 3 | Require a passing status check before changes reach the production branch. | Editor access is about to widen. A check that runs on every change matters more once more than one person can make them. |
| 4 | Review the outstanding dependency advisories and either clear them or record a decision on each. | 41 production dependencies, with advisories open long enough that leaving them is now a decision rather than a backlog. |
| 5 | Give a second person access to the repository, hosting, email and domain. | One person currently holds all of it. This is the single change that most improves resilience, and no document substitutes for it. |

## Important

| # | Action | Why it matters |
| --- | --- | --- |
| 6 | Write a risk register: one page, a named owner per risk, reviewed quarterly. | The risks are known and scattered across commit messages and conversations. None of them is written down in one place. |
| 7 | Record the third-party services the site depends on: what each is for, what data it sees, and what happens if it stops. | Nine services are relied on at runtime or in the build. None is recorded, so nobody can assess the effect of one going away. |
| 8 | Define three or four measures with targets. | The editor rollout has a baseline in `docs/cms-rollout-communication-plan.md`. Nothing else on the site has one. |

## Nice to have

| # | Action | Why it matters |
| --- | --- | --- |
| 9 | Add dates and milestones to `documentation-roadmap.md`. | It sets out tracks and priorities but carries no dates, so progress cannot be judged. |
| 10 | Fix or remove `/api/analytics/pageviews`. | It returns a hardcoded zero. An endpoint that always reports nothing is worse than no endpoint, because it invites reliance. |

## How this was assessed

Against the Management Case and Commercial Case criteria used in public sector business case review. Those criteria are governance, planning, risk, stakeholder engagement, procurement, delivery capability, and monitoring and evaluation.

Those criteria are a useful readiness lens. The wider framework around them assumes public funding, supplier contracts and an approval body, none of which apply here. The rating that came out of the review reflects a volunteer project measured against a standard built for something else. The value is the list above, not the grade.

Two of the seven criteria rated moderate rather than weak, and both rest on documents written the same day as this list. They describe intended behaviour that has not happened yet, so they should be re-assessed once editors are actually publishing.

## Review

Re-check this list when the first three community editors have published, or in six months, whichever comes first.
