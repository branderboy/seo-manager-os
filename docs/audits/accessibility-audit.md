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

What was actually done: axe-core against WCAG 2.0/2.1/2.2 A and AA on the 11 key screens at
two viewports; programmatic keyboard traversal and focus-style inspection; a 200 percent
zoom pass (640×512 CSS px); a 360 px and 412 px width pass; a programmatic minimum target
size measurement; and a scripted pass clicking every visible button on 24 routes while
watching for page errors. What was **not** done: a screen reader pass, and a human keyboard
pass by someone who uses one.

## Keyboard and focus

| # | Check | Result | Notes |
|---|---|---|---|
| 1 | Every interactive control is reachable by keyboard | **Fixed in this pass** | Was failing: the client rows on `/clients` were `<tr onClick>` with no link, no `tabIndex` and no key handler, so a keyboard user could not open a client record from the list. The client name is now a real `<Link>`; the row click remains a mouse convenience. `src/components/clients/client-row.tsx`. Covered by `tests/e2e/critical-workflows.spec.ts`. |
| 2 | Focus order is logical, and the focus indicator meets size and contrast (2.4.13) | **Fixed in this pass**, with a caveat | Was failing: links relied on the browser default `outline: auto 1px rgb(16,16,16)`, effectively invisible on the dark sidebar (`#15181e`). A 2px accent outline is now defined in the base layer of `src/app/globals.css`, switching to white inside `.on-feature`. Component-level rings on Button and Switch still win. Focus order follows DOM order and was traversed for 12 stops on `/tasks`. Caveat: 2.4.13 also asks about the *contrast* of the indicator, which was not measured against every surface. |
| 3 | Focus is visible and not obscured by sticky headers, footers, or overlays (2.4.11) | Pass | The shell has one sticky top bar of fixed height above a scrolling `<main>`; focus was not observed to move behind it. Verified programmatically on the sidebar and main content. |
| 4 | No keyboard trap in modals, menus, or embedded content | Insufficient evidence | The mobile menu opens and exposes its links and a labelled Close button (`tests/e2e/accessibility.spec.ts`). Whether focus is *trapped inside it while open* and *returned to the trigger on close* was not tested, and there is no focus-trap implementation in `src/components/layout/mobile-nav.tsx`. Likely a real defect; needs a human pass. |
| 5 | Skip to content or equivalent exists on long pages | **Fixed in this pass** | Was missing entirely: the first 12 tab stops on every screen were sidebar links. A skip link is now the first tab stop and moves focus to `#main-content`. `src/app/(os)/layout.tsx`, `.skip-link` in `src/app/globals.css`, asserted in `tests/e2e/accessibility.spec.ts`. |

## Structure and naming

| # | Check | Result | Notes |
|---|---|---|---|
| 6 | Headings describe structure and are not chosen for size | Pass | Exactly one `<h1>` and one `<main>` on every one of the 16 key screens, asserted on every run. Section headings are `<h2>`/`<h3>` through `src/components/ui/section.tsx` and `card.tsx`. |
| 7 | Every control has an accessible name that says what it does | Pass | axe reports no `button-name` or `link-name` violations. Nine controls that had no accessible name were labelled in this pass: the three search fields, the client invite email, the brief version note, the brief feedback textarea, the forecast levers, the evidence file inputs and the settings sliders. |
| 8 | Images and icons have appropriate alternatives, decorative ones are hidden | **Fixed in this pass** | Was failing `svg-img-alt`: Recharts gives every pie sector `role="img"` with no name. The donut chart now carries one `role="img"` with a generated data summary and hides its internals; `rootTabIndex={-1}` keeps nothing focusable inside the hidden subtree. `src/components/charts/charts.tsx`. There are no `<img>` elements in the application. |
| 9 | Form fields have persistent labels, not placeholder only | **Partial** | Every control now has an accessible name, but several search fields carry it as `aria-label` with a placeholder as the only *visible* label. That satisfies 4.1.2 and fails the spirit of 3.3.2 for a sighted user with cognitive load once text is entered. Recorded as finding A4. |
| 10 | Errors are announced and describe how to fix the problem | Not applicable | No form in the application validates or produces an error. Nothing is submitted anywhere. This becomes a real row the moment there is a server. |
| 10b | Previously entered information is auto populated or selectable, not retyped (3.3.7) | Not applicable | There is no multi-step submission and no authentication. |
| 10c | Help mechanisms appear in a consistent place across pages (3.2.6) | Pass | The product tour and the "Start here" affordance are in a consistent position in the shell across every route. |

## Perception

| # | Check | Result | Notes |
|---|---|---|---|
| 11 | Text contrast meets AA | **Fail** | 184 distinct WCAG 1.4.3 failures across the 16 key screens. This is finding A1 below and is the reason this audit does not pass. |
| 12 | Meaning is never carried by color alone | Insufficient evidence | Status badges pair colour with a text label (Active, Paused, Onboarding), and the risk column pairs a coloured bar with a numeric badge, both of which are fine. The geo grid (`src/components/dashboard/geo-grid.tsx`) and the chart series were not individually assessed for colour-only encoding. Needs a human pass. |
| 13 | Usable at 200 percent zoom without loss of content | Pass | Measured at 640×512 CSS px, equivalent to 200% at 1280×1024, on all 11 key screens: zero horizontal overflow on every one. |
| 14 | Usable at a narrow mobile width without horizontal scrolling | Pass | Zero horizontal overflow at 360 px and 412 px on every key screen; asserted on every run in `tests/e2e/critical-workflows.spec.ts`. The one horizontally scrolling region, the task lifecycle board, is deliberate and is now a labelled, keyboard-reachable region. |
| 15 | Motion can be reduced or is not essential | **Partial** | Well handled: `src/app/globals.css` gates the stagger animation behind `prefers-reduced-motion: no-preference` and collapses `.reveal`, `.ring-draw`, `.stagger`, `.skeleton` and `.pin-pulse` under `prefers-reduced-motion: reduce`. Missed: `html { scroll-behavior: smooth }` is not gated, so in-page jumps still animate for a user who asked them not to. Finding A3. |
| 15b | Dragging actions have a single pointer alternative (2.5.7) | Pass | There is no drag-and-drop anywhere in the application. The task board moves items by button, not by dragging. |
| 15c | Targets meet the minimum size or spacing (2.5.8) | **Fail** | Measured at 412 px width. Genuine misses: the mobile menu button at 23×36 px (1 px under on width), the task complete toggle at 20×20 px, and the inline "Deploy <agent>" chips at 36×20 px. Inline text links inside sentences are exempt under the inline exception and are excluded from that list. Finding A2. |

## Workflow level

| # | Check | Result | Notes |
|---|---|---|---|
| 16 | Sign in, verification, and password reset are completable by keyboard and screen reader | Not applicable | None of the three exist. |
| 17 | Authentication needs no memory or transcription test with no alternative, and paste into password fields is allowed (3.3.8) | Not applicable | No authentication. |
| 18 | Destructive actions are announced with their consequence before confirmation | Insufficient evidence | There is no server-side destructive action. Client-side ones do exist and are silent — resetting the tour, disconnecting an integration, rejecting a brief. None confirms and none announces. Low impact while nothing is real; becomes a row that matters with a backend. |
| 19 | Status changes and background completions are announced, not only shown | **Fail** | Nothing in the application uses a live region. Deploying an agent, connecting an integration, saving a brief version and completing a task all change the screen with no announcement. A screen reader user gets no confirmation that anything happened. Finding A5. |
| 20 | Data tables and lists are navigable and have programmatic headers | Pass, with one fix | Tables use real `<table>`/`<thead>`/`<th>` via `src/components/ui/data-table.tsx`. Two `<dl>` elements had non-`<dt>`/`<dd>` children and were fixed in this pass (`src/components/stages/discovery-deliverables.tsx`, `src/app/(os)/clients/[id]/page.tsx`). |

## Findings

| # | Severity | Screen or workflow | WCAG reference | Observed | Remediation | Owner |
|---|---|---|---|---|---|---|
| A1 | High | All 16 key screens | 1.4.3 Contrast (Minimum), AA | 184 distinct elements below 4.5:1. Concentrated in four token decisions rather than 82 separate mistakes: `--muted #6a7283` on `--surface-3 #f1f2f5` and on `--border #e6e8ee` (4.31:1 and 3.94:1); `--faint #9aa1b1` used as label text on the light canvas (2.31:1–2.43:1); `accent-600 #099250` as small text on light surfaces (3.58:1–3.77:1); white on `accent-500 #16b364` and on `amber-600`/`emerald-600` avatar and badge chips (2.73:1–3.76:1); and `text-white/45` on the `#15181e` sidebar (4.48:1). Worst offenders by page: `/reports` 22, `/growth` and `/growth/campaigns/capital-comfort` 17 each, `/clients` 16, `/command`, `/diagnosis`, `/tasks` and `/tracker` 13 each. The Local Growth OS screens use a different palette again — `slate-500`/`slate-600` on white and on `slate-50` — so they are a second set of decisions, not the same tokens failing on more pages. | Darken `--muted` and `--faint`, stop using `--faint` for text that carries meaning, use `--accent-ink #087443` rather than `accent-600` for small text, and darken the chip backgrounds behind white text. Most of these are one- or two-step token changes rather than a redesign, and several are within 0.2 of passing. **Not done in this pass:** the palette in `src/app/globals.css` is approved product design and changing 82 colour decisions is a design change, not a verification fix. Ratcheted meanwhile in `tests/e2e/accessibility.spec.ts` so the count can fall and never rise. | Human product owner |
| A2 | Medium | Mobile shell, `/tasks`, every stage header | 2.5.8 Target Size (Minimum), AA | At 412 px: menu button 23×36, task complete toggle 20×20, inline agent deploy chips 36×20. | Bring each to at least 24×24 CSS px, or give them 24 px of spacing. Small padding changes; deliberately left to the owner alongside A1 so the design is touched once. | Human product owner |
| A3 | Low | Global | 2.3.3 Animation from Interactions, AAA (and the spirit of 2.2.2) | `html { scroll-behavior: smooth }` in `src/app/globals.css` is not gated by `prefers-reduced-motion`, although every other animation in the file is. | Move it inside `@media (prefers-reduced-motion: no-preference)`. One-line change, held with A1/A2 rather than touching the stylesheet piecemeal. | Engineering |
| A4 | Low | `/clients`, `/integrations`, top bar | 3.3.2 Labels or Instructions, A | The three search fields have an `aria-label` but only a placeholder as a visible label, which disappears once the user types. | Add a persistent visible label or a floating label. | Product |
| A5 | Medium | `/agents`, `/integrations`, `/strategy`, `/tasks` | 4.1.3 Status Messages, AA | No live region anywhere. Deploying an agent, toggling an integration, saving a brief version and completing a task are silent to a screen reader. | Add `role="status"` announcements for each state change. | Engineering |
| A6 | Medium | Mobile menu | 2.1.2 No Keyboard Trap, A / 2.4.3 Focus Order, A | Focus is not trapped inside the open menu and is not returned to the trigger on close. Not proven to trap, but not managed either. | Implement focus management in `src/components/layout/mobile-nav.tsx` and add a test. | Engineering |

Fixed in this pass, listed so they are not re-audited as open: keyboard access to client
records; the missing skip link; the invisible focus indicator on the dark sidebar; nine
unlabelled form controls in SEO Manager OS and six unlabelled `<select>` elements in Local
Growth OS (axe rates `select-name` critical); the unnamed chart sectors; the malformed
definition lists; the horizontally scrolling task board that no keyboard could reach; and
**all 26 Local Growth OS routes sharing the single page title "Local Growth OS"** (WCAG
2.4.2), now given per-page titles including `generateMetadata` on the three dynamic routes.

After those fixes the automated suite reports **zero** violations of any rule other than
colour contrast, across 16 screens at two viewports.

## Decision

- **Scope reviewed:** the 11 key screens listed above at two viewports, plus render and
  overflow checks across all 29 routes. **Scope deliberately excluded:** authentication and
  account workflows, because they do not exist; the SaaS and Enterprise dashboards beyond
  render checks, because `docs/SOURCE_OF_TRUTH.md` records them as parked.
- **Blocking issues:** A1 (contrast) is a launch blocker for any user-facing release and is
  line 20 in `PRODUCTION_READINESS.md`. A5 and A6 block a claim of screen reader support.
- **The audit is not complete.** No screen reader was run and no human keyboard pass was
  performed. Automated checks are the minority of the work, and this audit has only done the
  minority. Do not read the green rows as a screen reader user's experience.
- **Accepted limitations, with the human owner who accepted each:** none accepted. A1 and A2
  are awaiting a palette and target-size decision from the product owner; until that decision
  is recorded here with a name against it, they are outstanding rather than accepted.
