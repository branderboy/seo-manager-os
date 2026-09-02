# Accessibility Audit

Baseline: WCAG 2.2, W3C Recommendation of 5 October 2023, targeting Level AA where
reasonably applicable. https://www.w3.org/TR/WCAG22/

The rows below marked with a criterion number map to the nine criteria WCAG 2.2 added over
2.1. Those are the ones a product built before 2023 most often fails.

- Auditor: Claude Code. **Note on independence:** this session also made the accessibility
  fixes recorded below, so this is **evidence for a verifier, not a verification**.
- Date: 2026-09-02
- Commit and environment: `claude/seo-manager-app-verify-ptc4e6`, merging the Local Growth
  OS foundation (`7b10301`). Run against the standard Next.js build in Chromium.
- Screens and workflows reviewed: the 16 key screens in `tests/e2e/routes.ts` — `/`,
  `/command`, `/clients`, `/discovery`, `/diagnosis`, `/strategy`, `/tasks`, `/reports`,
  `/tracker`, `/settings`, `/dashboards/local`, `/growth`,
  `/growth/campaigns/capital-comfort`, `/growth/tasks`, `/growth/roadmap`,
  `/growth/reports/client/report-capital-aug-2026` — at 1440×900 and 412×915, plus all 62
  routes for render and overflow.
- Assistive technology used: **none.** No screen reader was run. That is the single largest
  gap in this audit and is why the decision below is not a pass.

## Method

Automated checks catch a minority of real problems. This review requires a keyboard only
pass and a screen reader aware pass over the critical workflows, plus a check at 200 percent
zoom and at a narrow mobile width.

What was actually done: axe-core against WCAG 2.0/2.1/2.2 A and AA on the 16 key screens at
two viewports; programmatic keyboard traversal and focus-style inspection; a 200 percent
zoom pass (640×512 CSS px); a 360 px and 412 px width pass; a programmatic minimum target
size measurement; a reduced-motion pass; and a scripted pass clicking every visible button
on 24 routes while watching for page errors. What was **not** done: a screen reader pass,
and a human keyboard pass by someone who uses one. That omission is why the decision at the
bottom is not a pass, however green the automated numbers are.

## Keyboard and focus

| # | Check | Result | Notes |
|---|---|---|---|
| 1 | Every interactive control is reachable by keyboard | **Fixed in this pass** | Was failing: the client rows on `/clients` were `<tr onClick>` with no link, no `tabIndex` and no key handler, so a keyboard user could not open a client record from the list. The client name is now a real `<Link>`; the row click remains a mouse convenience. `src/components/clients/client-row.tsx`. Covered by `tests/e2e/critical-workflows.spec.ts`. |
| 2 | Focus order is logical, and the focus indicator meets size and contrast (2.4.13) | **Fixed in this pass**, with a caveat | Was failing: links relied on the browser default `outline: auto 1px rgb(16,16,16)`, effectively invisible on the dark sidebar (`#15181e`). A 2px accent outline is now defined in the base layer of `src/app/globals.css`, switching to white inside `.on-feature`. Component-level rings on Button and Switch still win. Focus order follows DOM order and was traversed for 12 stops on `/tasks`. Caveat: 2.4.13 also asks about the *contrast* of the indicator, which was not measured against every surface. |
| 3 | Focus is visible and not obscured by sticky headers, footers, or overlays (2.4.11) | Pass | The shell has one sticky top bar of fixed height above a scrolling `<main>`; focus was not observed to move behind it. Verified programmatically on the sidebar and main content. |
| 4 | No keyboard trap in modals, menus, or embedded content | **Pass** | The suspicion was correct and is fixed. The mobile drawer is now `role="dialog"` with `aria-modal`, focus moves into it on open, Tab and Shift+Tab cycle within it, Escape closes it, and focus returns to the trigger. Tested by 40 consecutive Tab presses asserting focus never leaves the drawer, then Escape, then a focus assertion on the button. |
| 5 | Skip to content or equivalent exists on long pages | **Fixed in this pass** | Was missing entirely: the first 12 tab stops on every screen were sidebar links. A skip link is now the first tab stop and moves focus to `#main-content`. `src/app/(os)/layout.tsx`, `.skip-link` in `src/app/globals.css`, asserted in `tests/e2e/accessibility.spec.ts`. |

## Structure and naming

| # | Check | Result | Notes |
|---|---|---|---|
| 6 | Headings describe structure and are not chosen for size | Pass | Exactly one `<h1>` and one `<main>` on every one of the 16 key screens, asserted on every run. Section headings are `<h2>`/`<h3>` through `src/components/ui/section.tsx` and `card.tsx`. |
| 7 | Every control has an accessible name that says what it does | Pass | axe reports no `button-name` or `link-name` violations. Nine controls that had no accessible name were labelled in this pass: the three search fields, the client invite email, the brief version note, the brief feedback textarea, the forecast levers, the evidence file inputs and the settings sliders. |
| 8 | Images and icons have appropriate alternatives, decorative ones are hidden | **Fixed in this pass** | Was failing `svg-img-alt`: Recharts gives every pie sector `role="img"` with no name. The donut chart now carries one `role="img"` with a generated data summary and hides its internals; `rootTabIndex={-1}` keeps nothing focusable inside the hidden subtree. `src/components/charts/charts.tsx`. There are no `<img>` elements in the application. |
| 9 | Form fields have persistent labels, not placeholder only | **Pass** | Every control has an accessible name and axe reports no violations. The search fields keep the conventional icon-plus-placeholder pattern with an `aria-label`; see the correction under A4, where the original finding is downgraded and the real defect behind it — a search box wired to nothing — is recorded as fixed. |
| 10 | Errors are announced and describe how to fix the problem | Not applicable | No form in the application validates or produces an error. Nothing is submitted anywhere. This becomes a real row the moment there is a server. |
| 10b | Previously entered information is auto populated or selectable, not retyped (3.3.7) | Not applicable | There is no multi-step submission and no authentication. |
| 10c | Help mechanisms appear in a consistent place across pages (3.2.6) | Pass | The product tour and the "Start here" affordance are in a consistent position in the shell across every route. |

## Perception

| # | Check | Result | Notes |
|---|---|---|---|
| 11 | Text contrast meets AA | **Pass** | Zero failures. The 184 that were here have been fixed at the token level: see finding A1, now resolved. `tests/e2e/accessibility.spec.ts` asserts zero violations rather than a baseline, so a regression fails the build. |
| 12 | Meaning is never carried by color alone | Insufficient evidence | Status badges pair colour with a text label (Active, Paused, Onboarding), and the risk column pairs a coloured bar with a numeric badge, both of which are fine. The geo grid (`src/components/dashboard/geo-grid.tsx`) and the chart series were not individually assessed for colour-only encoding. Needs a human pass. |
| 13 | Usable at 200 percent zoom without loss of content | Pass | Measured at 640×512 CSS px, equivalent to 200% at 1280×1024, on all 11 key screens: zero horizontal overflow on every one. |
| 14 | Usable at a narrow mobile width without horizontal scrolling | Pass | Zero horizontal overflow at 360 px and 412 px on every key screen; asserted on every run in `tests/e2e/critical-workflows.spec.ts`. The one horizontally scrolling region, the task lifecycle board, is deliberate and is now a labelled, keyboard-reachable region. |
| 15 | Motion can be reduced or is not essential | **Pass** | `src/app/globals.css` gates the stagger animation behind `prefers-reduced-motion: no-preference` and collapses `.reveal`, `.ring-draw`, `.stagger`, `.skeleton` and `.pin-pulse` under `reduce`. Smooth scrolling is now opted into under `no-preference` too, replacing a second override that did the same job — see the correction under A3. Asserted by a test that loads the app in a reduced-motion context and reads back `scroll-behavior`. |
| 15b | Dragging actions have a single pointer alternative (2.5.7) | Pass | There is no drag-and-drop anywhere in the application. The task board moves items by button, not by dragging. |
| 15c | Targets meet the minimum size or spacing (2.5.8) | **Pass** | axe reports no `target-size` violations at either viewport; 2.5.8's spacing exception covers the small standalone links. One genuine defect was found and fixed: the mobile menu button asked for 36×36 but a flex sibling squeezed it to 23 px wide, so it now carries `shrink-0` and a test asserts its measured box. See the correction under A2. |

## Workflow level

| # | Check | Result | Notes |
|---|---|---|---|
| 16 | Sign in, verification, and password reset are completable by keyboard and screen reader | Not applicable | None of the three exist. |
| 17 | Authentication needs no memory or transcription test with no alternative, and paste into password fields is allowed (3.3.8) | Not applicable | No authentication. |
| 18 | Destructive actions are announced with their consequence before confirmation | Insufficient evidence | There is no server-side destructive action. Client-side ones do exist and are silent — resetting the tour, disconnecting an integration, rejecting a brief. None confirms and none announces. Low impact while nothing is real; becomes a row that matters with a backend. |
| 19 | Status changes and background completions are announced, not only shown | **Pass, pending a human check** | One polite live region now sits in the app shell (`src/components/layout/announcer.tsx`), wired to agent deploy and stand-down, integration connect and disconnect, brief version saves, task completion and client search results. Tested: exactly one live region exists, it starts empty, and toggling an agent puts a message naming that agent into it. Whether the phrasing is *useful* to a screen reader user is a judgement no automated test makes. |
| 20 | Data tables and lists are navigable and have programmatic headers | Pass, with one fix | Tables use real `<table>`/`<thead>`/`<th>` via `src/components/ui/data-table.tsx`. Two `<dl>` elements had non-`<dt>`/`<dd>` children and were fixed in this pass (`src/components/stages/discovery-deliverables.tsx`, `src/app/(os)/clients/[id]/page.tsx`). |

## Findings

All six findings from the previous revision are closed. Two of them are closed because they
were wrong, and those are marked as corrections rather than fixes — an audit that quietly
deletes its own mistakes is not worth more than one that never made them.

| # | Severity | Screen or workflow | WCAG reference | Status |
|---|---|---|---|---|
| A1 | High | All 16 key screens | 1.4.3 Contrast (Minimum), AA | **Fixed.** |
| A2 | Medium | Mobile shell | 2.5.8 Target Size (Minimum), AA | **Corrected, and one real defect fixed.** |
| A3 | Low | Global | 2.3.3 / 2.2.2 motion | **Corrected. The original finding was wrong.** |
| A4 | Low | Search fields | 3.3.2 Labels or Instructions, A | **Corrected, and the real defect behind it fixed.** |
| A5 | Medium | Agents, integrations, strategy, tasks | 4.1.3 Status Messages, AA | **Fixed.** |
| A6 | Medium | Mobile menu | 2.1.2 / 2.4.3 | **Fixed.** |

### A1 — colour contrast. Fixed.

184 failing elements are now zero, across 16 screens at two viewports, and the suite asserts
zero rather than a baseline. The fix was at the token level, so the design's structure, hue
choices and hierarchy are intact; what changed is how dark the quiet greys and the small
accent text are:

- `--muted` `#6a7283` → `#5e6677`, `--faint` `#9aa1b1` → `#616978`.
- `accent-600` `#099250` → `#077a41`, which also lets the 25 chips that paint white on the
  brand green move from `accent-500` (2.74:1) to `accent-600` (5.43:1) without changing the
  brand colour itself.
- Stock Tailwind `slate-500`, `emerald-600` and `amber-600` darkened; `text-slate-400`, which
  was 2.4:1 to 2.6:1 on every ground in this app, replaced with `slate-500` in all 24 places
  it was used as text.
- The semantic tokens gained text-safe variants (`--ok-ink`, `--warn-ink`, `--danger-ink`)
  so a status colour used as a fill and the same status used as text are no longer forced to
  be the same value.
- Opacity suffixes over tinted fills (`text-accent-700/70`, `text-[#9a6512]/75`) removed:
  translucency over a tint lands wherever the blend lands, which is how several of these
  fell under 4.5:1 in the first place. The same reasoning removed `opacity-60` from the
  roadmap horizon cards, which is now a muted background instead.
- The geo-grid rank ramp keeps green-to-red but the fills carrying white text are darker.

**One honest consequence:** `--muted` and `--faint` sit closer together than they did. A
light grey on a light ground cannot be both very light and readable, and AA is the
constraint that wins.

### A2 — target size. Corrected, with one real defect fixed.

The original finding listed the inline "View all" links and client names as failures. That
was measured with a cruder rule than WCAG 2.5.8 actually applies: the criterion has a
spacing exception, and axe — which is what CI runs — reports no `target-size` violations at
either viewport. The finding over-reported.

One genuine defect was in there: the mobile menu button rendered 23 px wide although it asks
for 36×36, because a flex sibling was squeezing it. Fixed with `shrink-0`, and a test now
asserts its measured box rather than its class.

### A3 — reduced motion. Corrected. The original finding was wrong.

The finding said `html { scroll-behavior: smooth }` was not gated. It was: a
`prefers-reduced-motion: reduce` block later in the same file set it back to `auto`, and
later-and-equal-specificity wins. Reduced-motion users were never getting smooth scrolling.

The file now opts *into* smooth scrolling under `no-preference` and the redundant override is
gone, so there is one mechanism instead of two that have to agree — a real improvement, but
a tidy-up, not a fix. A test asserts the computed value in a reduced-motion context.

### A4 — placeholder-only labels. Corrected, and the real defect behind it fixed.

Downgraded. An icon, a placeholder and an `aria-label` is the conventional search pattern,
it satisfies 4.1.2, and 3.3.2 is met by the icon and placeholder as instructions. axe agrees.
Calling it a violation was over-strict.

The genuine defect sitting underneath it was worse and is now fixed: **the `/clients` search
box was wired to nothing at all.** It filters the table now, and announces the match count
through the live region, so the result of typing is available to a screen reader user rather
than only visible.

### A5 — status messages. Fixed.

One polite live region in the app shell, wired to agent deploy and stand-down, integration
connect and disconnect, brief version saves, task completion, and client search results.
Tested for existence, uniqueness, and that toggling an agent announces that agent by name.

What a test cannot check is whether the wording helps. A human pass should read these aloud.

### A6 — mobile menu focus. Fixed.

The drawer is now a proper dialog: `role="dialog"`, `aria-modal="true"`, an accessible name,
`aria-expanded` on the trigger, focus moved inside on open, Tab and Shift+Tab cycling within
it, Escape to close, and focus restored to the trigger. Asserted by 40 consecutive Tab
presses that must never leave the drawer, then Escape, then a focus check on the button.

### Fixed in the previous revision, listed so they are not re-audited

Keyboard access to client records; the missing skip link; the invisible focus indicator on
the dark sidebar; nine unlabelled form controls in SEO Manager OS and six unlabelled
`<select>` elements in Local Growth OS; unnamed chart sectors; two malformed definition
lists; a horizontally scrolling task board no keyboard could reach; and 26 Local Growth OS
routes sharing a single page title.

## Decision

- **Scope reviewed:** the 11 key screens listed above at two viewports, plus render and
  overflow checks across all 29 routes. **Scope deliberately excluded:** authentication and
  account workflows, because they do not exist; the SaaS and Enterprise dashboards beyond
  render checks, because `docs/SOURCE_OF_TRUTH.md` records them as parked.
- **Blocking issues: none from this audit.** Every finding is closed, and the automated
  suite is at zero violations of every WCAG 2.0/2.1/2.2 A and AA rule on the 16 key screens
  at both viewports.
- **The audit is still not complete, and that has not changed.** No screen reader was run
  and no human keyboard pass was performed by someone who uses one. Automated checks catch a
  minority of real problems; this audit has done the minority thoroughly and the majority not
  at all. **Do not read zero violations as a screen reader user's experience.** Specifically
  untested by any of this: whether the live region wording is useful, whether the reading
  order of the dense dashboard screens makes sense aloud, whether the geo grid and the charts
  convey anything without colour, and whether the nine-stage pipeline is navigable by anyone
  who cannot see the whole shell at once.
- **Accepted limitations, with the human owner who accepted each:** none, and none needed.
  Nothing is being carried. `PRODUCTION_READINESS.md` line 20 stays Partial until the human
  passes are done — that is a missing activity, not an accepted defect.
