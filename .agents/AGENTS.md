# Design System (services.dzaleka.com)

Consolidated 2026-07-06 during the slop-cleanup/redesign sessions.

## Styling Rules and Guidelines

- **Palette**: Slate/gray neutrals + `primary` (custom sky scale, brand #0284c7), blue, green (success), amber (warning), red (urgent).
  - Off-palette families (purple/pink/indigo/cyan/rose/teal) are purged from public-page chrome.
  - Exceptions: Instagram-branded social links keep pink; chart category palettes in analytics tools (`analytics.astro`, `services/stats.astro`, `dashboard.astro`) keep functional multi-color coding.
- **Headers**: `breadcrumb` → `uppercase kicker` (text-sm font-semibold tracking-widest text-slate-500) → `h1 text-4xl/5xl font-bold tracking-tight` → `lede text-lg/xl text-slate-600`.
  - Left-aligned editorial for content pages.
  - Dark slate-950 or photo heroes for landing/directory pages.
- **Cards**: `rounded-xl` (max `rounded-2xl`) border border-gray-200/slate-200 bg-white, `hover:border/shadow-sm`.
  - No animated gradient blobs, pulsing orbs, or frosted-glass (these were removed as slop).
- **Buttons**:
  - Primary: `rounded-lg bg-slate-900 text-white hover:bg-slate-800`
  - Secondary: bordered white
- **Wellbeing cluster** (`dzaleka-wellbeing` + subpages + `get-help-now`):
  - Uses a GOV.UK/NHS calm service-design family: white single-column, red-bordered urgent callout, "On this page" contents, divider rows.
  - Do NOT apply the wellbeing calm style outside this cluster.

## How to Apply

- When touching any page, keep its unique layout/purpose but conform tokens (palette, radii, header anatomy, buttons) to the above.
- See [[no-ai-coauthor-commits]] for commit rules.
