# Application inventory

Phase 1 of the proof of concept to production path. Fill this in before adding features.
Cite file paths. Anything you cannot confirm is recorded as Unknown, not guessed.

- Inventoried by: Claude Code, working from the repository at the commit below. Every row
  was read out of the source, not inferred from documentation.
- Date: 2026-09-02
- Commit: `claude/seo-manager-app-verify-ptc4e6`, which merges
  `claude/app-identification-repo-64akmz` at `7b10301` (the Local Growth OS foundation,
  PR #52) into the verification work started from `a7dbb93`.

## Summary

Two applications share one Next.js 16 App Router codebase and one shell.

**SEO Manager OS** is the original nine-stage investigation and diagnosis pipeline, plus its
manager surfaces. **Local Growth OS** (`/growth`, 33 routes) is a newer multi-tenant local
SEO campaign-management and client-reporting layer for U.S. home-service businesses.
62 routes in total.

**Nothing in `src/` talks to a server.** Every number on every screen comes from mock data
in `src/lib/*.ts` and `src/lib/local-growth/demo-data.ts` — 4,214 lines of it. Client state
lives in the visitor's own `localStorage`. There is no API route, no server action, no job
and no webhook.

Three things about the data layer matter to this inventory:

1. **A database schema exists and has now been executed.** 1,359 lines of SQL under
   `supabase/`, including multi-tenant Row Level Security policies and a storage policy
   model. The migrations run, the seed applies, and 22 tenant isolation tests exercise the
   policies against a live Postgres on every pull request
   (`tests/integration/tenant-isolation.spec.ts`, the `authorization` job in `ci.yml`).
   It is still **not wired to the application**: `grep -rl supabase src` returns nothing.
   The boundary is proven; nothing uses it yet.
2. **`next.config.mjs` is no longer export-only.** `GITHUB_PAGES=true` produces the static
   Pages demo; every other build is a standard Next.js server build. The framework no
   longer forbids a server; the application simply does not have one yet.
3. **`/growth/login` is a workspace selector, not a sign-in.** It says so on the screen and
   warns that nothing is enforced. The demo credentials that used to be printed there, and
   in the README, are gone.

None of that is a criticism. It is the set of facts that decides which of the delivery
standard's controls apply today and which are not yet reachable.

## Users and roles

| Role | How it is assigned | What it can do that others cannot | Enforced where |
|---|---|---|---|
| None, in the running application. | n/a | n/a | Nowhere. There is no identity, session, or permission check anywhere in `src/`. |
| `agency_admin`, `lead_seo`, `seo_strategist`, `content_outreach`, `client_viewer`, `client_editor` | Defined in `supabase/migrations/202608300001_local_growth_os.sql` as a `user_roles` table with RLS policies. Client roles are scoped to a `client_id`. | Client viewers and editors are held out of agency audits, rankings, strategy and internal notes. | **In Postgres, and now proven.** 194 policies across `public` and `storage`; every public table has RLS on. `tests/integration/tenant-isolation.spec.ts` runs 22 cross-tenant attempts against them on every pull request, and 8 of those tests go red if RLS is disabled on a single table. **No application code loads any of it** — selecting a role at `/growth/login` still changes React state and nothing else. |
| "Owner" strings on client records (`src/lib/crm.ts`, `src/lib/model.ts`) | Hard-coded in mock data | Nothing. Display only. | Not enforced. It is a label rendered in a table cell. |
| Team/seat entries in Settings (`src/components/settings/settings-view.tsx`) and the Tracker team tab (`src/components/tracker/team-view.tsx`) | Hard-coded in mock data | Nothing. Display only. | Not enforced. |

Anyone who can reach the published URL sees everything the application contains.

## Business workflows

| Workflow | Entry point | Status today | Risk class |
|---|---|---|---|
| Discovery interview | `/discovery` (`src/components/discovery/wizard.tsx`) | Working, in-browser only. Answers drive the engagement classification and are held in React state and `localStorage`; nothing is transmitted or stored server side. | High |
| Data collection | `/research` (`src/components/investigation/evidence-panel.tsx`) | Partial. Connect buttons and file pickers are UI affordances; no upload, parse, or fetch is performed. | Critical when real |
| Intent mapping | `/intent` | Working on mock data | Lower |
| Competitive insights | `/competitors` | Working on mock data | Lower |
| Diagnosis | `/diagnosis` (`src/components/diagnosis/diagnosis-view.tsx`, `src/lib/scoring.ts`) | Working. The scoring model is real and traceable; the inputs it is fed are mock. | Critical when real |
| Playbooks | `/tools` (`src/lib/playbooks.ts`) | Working on mock data | Lower |
| Project brief, approval, versioning, sharing | `/strategy` (`src/components/flow/*`) | Working in-browser. "Share" produces a link in the UI; nothing is published and no recipient can open anything. | Critical when real |
| Daily task engine | `/tasks` (`src/components/tasks/*`) | Working in-browser. Task state is React state, lost on reload. | High |
| Reports | `/reports` (`src/lib/reports.ts`, `src/components/reports/report-share.tsx`) | Working on mock data. Same caveat on sharing. | Critical when real |
| Client switching | Top bar and `/clients` (`src/components/engagement/store.tsx`) | Working. The active engagement persists in `localStorage` and re-renders the whole pipeline. | High |
| AI Workforce deploy/activate | `/agents` (`src/components/agents/deploy-store.ts`) | Partial. Deploy state persists in `localStorage`; no agent runs, and nothing calls a model. | Critical when real |
| Integrations connect/disconnect | `/integrations` (`src/lib/integrations.ts`, 41 catalogue entries) | Partial. Toggles change local UI state only. No OAuth, no token, no request. | Critical when real |
| Prospect and job scanner | `scripts/prospect-scanner/scan.mjs` (CLI, not the web app) | Working. The one live integration in the repository: calls the JSearch API on RapidAPI with `RAPIDAPI_KEY`. | High |
| **Local Growth OS** — role and workspace selection | `/growth/login` | A workspace selector, labelled as one. It states on screen that nothing is authenticated and that the real boundary lives in `supabase/migrations`. No credentials are published. | Critical when real |
| Campaign onboarding, 5 steps | `/growth/campaigns/new` (`onboarding-wizard.tsx`) | Working in-browser. Captures identity, services, markets, integration access states and KPIs, and produces a draft roadmap. Nothing is persisted beyond React state. | High |
| Campaign operating dashboard | `/growth/campaigns/[id]` | Working on demo data. CSV export is a client-side `data:` URI; Print/PDF is `window.print()`. | Lower |
| Audit → roadmap → task flow | `/growth/audits`, `/growth/roadmap`, `/growth/tasks` | Working on demo data. Findings rank by Impact × Confidence ÷ Effort, and GBP high-risk findings need an explicit risk acknowledgement before they can be marked ready. | Critical when real |
| Client report builder and client portal | `/growth/reports`, `/growth/reports/client/[id]` | Working on demo data. Publishing is gated on a lead-SEO approval flag held in React state. | Critical when real |
| Local SEO module screens | `/growth/{gbp,rankings,keywords,citations,content,reviews,competitors,technical,outreach,leads,requests,templates,integrations,settings}` | Working on demo data; several are summary-only views. | Lower |

## Pages

Every route is public, prerendered, and served as static HTML. There is nothing to protect
and nothing that could enforce protection.

| Page or route | Public or protected | Protection enforced server side | File |
|---|---|---|---|
| `/` | Public | No — static export, no server | `src/app/page.tsx` |
| `/command` | Public | No | `src/app/(os)/command/page.tsx` |
| `/clients` | Public | No | `src/app/(os)/clients/page.tsx` |
| `/clients/[id]` (acme, flowdesk, hillcountry, northwind, vantage) | Public | No | `src/app/(os)/clients/[id]/page.tsx` |
| `/workflow` | Public | No | `src/app/(os)/workflow/page.tsx` |
| `/tracker` | Public | No | `src/app/(os)/tracker/page.tsx` |
| `/agents` | Public | No | `src/app/(os)/agents/page.tsx` |
| `/risk` | Public | No | `src/app/(os)/risk/page.tsx` |
| `/wins` | Public | No | `src/app/(os)/wins/page.tsx` |
| `/deployments` | Public | No | `src/app/(os)/deployments/page.tsx` |
| `/integrations` | Public | No | `src/app/(os)/integrations/page.tsx` |
| `/settings` | Public | No | `src/app/(os)/settings/page.tsx` |
| `/discovery` | Public | No | `src/app/(os)/discovery/page.tsx` |
| `/research` | Public | No | `src/app/(os)/research/page.tsx` |
| `/intent` | Public | No | `src/app/(os)/intent/page.tsx` |
| `/competitors` | Public | No | `src/app/(os)/competitors/page.tsx` |
| `/diagnosis` | Public | No | `src/app/(os)/diagnosis/page.tsx` |
| `/tools` | Public | No | `src/app/(os)/tools/page.tsx` |
| `/strategy` | Public | No | `src/app/(os)/strategy/page.tsx` |
| `/tasks` | Public | No | `src/app/(os)/tasks/page.tsx` |
| `/reports` | Public | No | `src/app/(os)/reports/page.tsx` |
| `/dashboards/local`, `/dashboards/saas`, `/dashboards/enterprise` | Public | No | `src/app/(os)/dashboards/*/page.tsx` |

| `/growth` and its 32 sub-routes | Public | No | `src/app/(os)/growth/**/page.tsx` |

**62 routes in total** (29 SEO Manager OS, 33 Local Growth OS), every one public and
prerendered. All are verified rendering on desktop and mobile by
`tests/e2e/critical-workflows.spec.ts`.

## APIs, server actions, jobs, webhooks

| Endpoint or job | Purpose | Auth check | Authorization check | Input validation | File |
|---|---|---|---|---|---|
| None | — | — | — | — | There is no `route.ts`, no `"use server"` action, no scheduled job and no webhook handler anywhere in `src/`. |
| `scan.mjs` (local CLI, outside the web app) | Scans JSearch for agency prospects and job leads | Bearer key from `RAPIDAPI_KEY` | n/a, single operator tool | Argument parsing only; no untrusted input | `scripts/prospect-scanner/scan.mjs` |

## Data

| Table or bucket | Contains | Tenant key | Access policy | Migration tracked |
|---|---|---|---|---|
| **No live database.** Nothing in `src/` connects to one. | — | — | — | — |
| 50 tables defined in `supabase/migrations/202608300001_local_growth_os.sql` — organizations, users, user_roles, clients, campaigns, audits, findings, roadmaps, tasks, keywords, rank snapshots, GBP, citations, content, reviews, technical issues, backlinks, leads, reports, requests, files, integrations, activity logs | The Local Growth OS domain model | `organization_id`, with `client_id` scoping for client roles | Row Level Security. 194 policies; RLS is enabled on every public table, verified by test. | Yes — three ordered migrations plus `supabase/seed.sql`, **all executed and tested in CI** by `scripts/db-test-setup.sh` and the `authorization` job. |
| `client-assets` storage bucket, path `<organization_id>/<client_id>/<uuid>-<filename>` | Client files | `organization_id` / `client_id` | Storage read and upload policies, tested: a member of one organization can neither read nor upload into another's folder | Yes, in the same migration |
| `prisma/schema.prisma` | The delivery standard's starter schema | — | — | No. Unused and unwired; superseded by the Supabase schema above and kept only as the standard's original. |
| Browser `localStorage` | `smos.engagement` (active client), `smos.agents.deployed`, `smos.tour.seen`, `smos.tour.furthest` | n/a | Whatever the visitor's browser allows | n/a |
| Mock data modules | Every score, client, task, ranking, report and integration state | n/a | Compiled into the public bundle | n/a — `src/lib/*.ts`, 3,099 lines |

Data classifications present: none. No personal data, no customer data, no credentials and
no business data of any real party is stored or transmitted by the web application. The
client names in the app (Northwind Heating & Air, Flowdesk, Vantage Retail, Acme, Hill
Country) and the Local Growth OS campaigns (Capital Comfort HVAC, DMV Roofing & Exteriors,
Potomac Plumbing Co.) are fictional demo accounts. `scripts/prospect-scanner` handles a
real API key, held in a local `.env` that `.gitignore` excludes.

## External services

| Provider | Used for | Credentials stored where | Environment tested |
|---|---|---|---|
| JSearch on RapidAPI | Prospect and job scanning, CLI only | `scripts/prospect-scanner/.env`, git-ignored | live (operator's machine) |
| Google Fonts | Inter and JetBrains Mono, fetched at build by `next/font` | none | live (build time) |
| GitHub Pages | Hosting the static export | GitHub Actions OIDC, `.github/workflows/deploy.yml` | live |
| The 41 entries in `src/lib/integrations.ts` (GA4, GSC, GBP, DataForSEO, PageSpeed, Yelp, OpenAI, Claude, Slack, HubSpot, …) | Nothing. Catalogue entries with mock connection states. | none | none |
| The Local Growth OS connector catalogue in `src/lib/local-growth/connectors.ts` (GA4, GSC, GBP, Drive, Slack, BrightLocal, Local Falcon, Whitespark, Ahrefs, Semrush, CallRail, generic webhooks) | Nothing yet. A typed `Connector<T>` adapter boundary with `mode: "mock" \| "live"`, and mock providers behind it. Better than the older catalogue: it defines the shape a real adapter must satisfy. | none | none — every provider is in `mock` mode |
| Supabase (Postgres, Auth, Storage) | Intended to back Local Growth OS | Would be `NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY` plus a server-only service role key | none — `@supabase/supabase-js` is not even a dependency | none |

## Tests

| Suite or file | What it actually asserts | Would it fail if the behavior broke |
|---|---|---|
| `tests/unit/routes.spec.ts` | Every literal internal `href` in `src/` resolves to a real App Router page; every stage and dashboard slug has a page; stage numbers are unique and sequential | Yes — verified by introducing a dead nav link and watching it fail |
| `tests/unit/scoring.spec.ts` | The bounds, directions and traceability of `src/lib/scoring.ts`: rank mapping, trend caps, CTR monotonicity, no zero divisor, priority urgency | Yes |
| `tests/e2e/critical-workflows.spec.ts` | All 29 routes return 200 and render on desktop and mobile with no client-side error; the 404 page appears for an unknown route; every nav link resolves; the pipeline walks end to end; discovery accepts input; a client record opens from the list; no key screen scrolls horizontally at 360px | Yes |
| `tests/e2e/accessibility.spec.ts` | **Zero** axe violations of every WCAG 2.0/2.1/2.2 A and AA rule, contrast included; every form control has an accessible name; the skip link works; sidebar focus is visible; the mobile drawer traps focus, closes on Escape and restores it; one polite live region exists and announces agent deploys and search results; target sizes; reduced motion; one `h1` and one `main` per page; titles unique | Yes |
| `tests/integration/tenant-isolation.spec.ts` | The tenant boundary, against a live Postgres carrying the real migrations. 22 tests: an agency member sees only their own organization, by list and by explicit id; a client user sees only their one client; an unidentified request sees nothing; cross-tenant insert, update and privilege escalation are refused; storage objects follow the same scope. It also asserts that its own connection is neither a superuser nor a table owner, because both bypass RLS and would make every other assertion meaningless. | Yes — verified by disabling RLS on one table, which turns 8 of the 22 red. |
| `supabase/test/00_supabase_shim.sql`, `supabase/test/01_two_tenant_fixture.sql` | The harness that lets the Supabase migrations run on plain Postgres, plus Organization Alpha and Organization Beta. Test-only; never applied to a real database. | n/a |

Totals on this branch: 30 unit, 22 authorization, 120 e2e, 56 accessibility (52 run, 4
viewport-scoped skips). Before this pass the repository had no tests and no CI for the application, as
`docs/SOURCE_OF_TRUTH.md` recorded.

## Environments and configuration

- Environments that exist: **local development** (`npm run dev`), **local production
  server** (`npm run build && npm run start`, a standard Next.js server build), **local
  Pages artifact** (`GITHUB_PAGES=true npm run build` then `npm run start:export --
  --base-path /seo-manager-os`), and **production** (GitHub Pages). There is **no staging
  environment**.
- Required environment variables: none for the web application. `GITHUB_PAGES=true` selects
  the static export and the `/seo-manager-os` basePath at build time. `TEST_BASE_URL` points
  the Playwright suites somewhere other than `http://localhost:3000`.
  `PLAYWRIGHT_CHROMIUM_EXECUTABLE` lets a sandbox that cannot download browsers point at an
  existing Chromium. `RAPIDAPI_KEY` is used only by the CLI scanner.
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and a server-only
  `SUPABASE_SERVICE_ROLE_KEY` are documented in `README.md` as the variables live wiring
  will need. **None of them is read by any code today.**
- Where secrets live: nowhere in the web application. The scanner's key lives in a local,
  git-ignored `.env`. `.github/scripts/server-only-vars.txt` lists it and the names the
  build spec plans, so the client bundle check covers them the day they appear.
- Deployment method: `.github/workflows/deploy.yml` — build with `GITHUB_PAGES=true`,
  `touch out/.nojekyll`, upload and deploy the Pages artifact on every push to the
  repository default branch. See `docs/runbooks/deployment.md`.
- Rollback method: re-run the Pages deployment for the previous commit, or revert and push.
  There is no data to migrate back. See `docs/runbooks/rollback.md`.

## Known defects, limitations, and unverified claims

| Item | Impact | Evidence or lack of it | Owner |
|---|---|---|---|
| The Local Growth OS screens are a second, parallel product surface in the same shell | Medium, and the largest open item. Two navigation systems, two client models (Client/Engagement vs Campaign) and two sets of task and report screens. Nothing reconciles them. | `src/lib/model.ts` and `src/lib/engagements.ts` vs `src/lib/local-growth/types.ts` | **Product — needs a decision, it is not a code fix** |
| The tenant boundary is proven but unused | Medium. The policies are tested and correct; no application code goes through them. Every screen still renders mock data. Wiring is the work that makes the proof matter. | `grep -rl supabase src` returns nothing | Engineering |
| `@supabase/supabase-js`, React Hook Form, Zod and TanStack Table are used conceptually but not installed | Low today, by deliberate choice — the README explains the branch avoided faking lockfile entries. It is the first backlog item. | `package.json` | Engineering |
| No staging environment, no error tracking, no health check, no alerting | Medium. A broken deploy is still found by a person looking at the site. | Nothing in the repository reports anywhere | Human owner |
| The two product surfaces are unreconciled | See the row above; this is the open item, and it is a product decision | — | Human owner |
| No staging environment | Every change goes from a pull request straight to production | `.github/workflows/deploy.yml` has one target | Human owner |
| No error tracking, no logs, no uptime monitoring | A broken deploy is discovered by a person looking at it | Nothing in the repository reports anything anywhere | Human owner |
| Every integration in `/integrations` presents as connectable but connects to nothing | A viewer can reasonably believe data is live | Read from `src/lib/integrations.ts`; the toggles set local state | Product |
| "Share" on briefs and reports produces a link that opens nothing | Same | `src/components/flow/brief-share.tsx`, `src/components/reports/report-share.tsx` | Product |
| `coreScores` in the UI still read mock numbers rather than `src/lib/scoring.ts` | The grounded scoring work is not yet visible where it matters | Already recorded in `docs/SOURCE_OF_TRUTH.md` | Product |
| Task state is React state, not persisted | A reload silently discards the day's work | `src/components/tasks/task-store.tsx` holds tasks in `useState` while other stores use `localStorage` | Product |
| Task lifecycle board needs a horizontal scroll on narrow screens | Usable, now keyboard reachable | Fixed in this pass: `role="region"` + `tabIndex` on `src/components/tasks/task-lifecycle-board.tsx` | Closed |
| All 26 Local Growth OS routes shared one page title | Fixed. A screen reader user, or anyone reading browser history or a tab strip, could not tell them apart (WCAG 2.4.2) | Per-page `metadata.title`, and `generateMetadata` on the three dynamic routes | Closed |
| Colour contrast failed WCAG 1.4.3 in 184 places | **Fixed.** The design tokens, the accent scale and the stock Tailwind shades used as small text were darkened to clear 4.5:1 on every surface they are painted on; opacity suffixes over tinted fills were removed. axe now reports zero violations of any rule on all 16 key screens at both viewports, and the suite asserts zero rather than a baseline. | `src/app/globals.css`, `tailwind.config.ts`, `tests/e2e/accessibility.spec.ts` | Closed |
| Five high-severity dependency advisories | **Fixed.** Next.js 14 → 16, ESLint 8 → 9 with flat config, `eslint-config-next` 16. `npm audit` reports 0 vulnerabilities. | `package.json`, `eslint.config.mjs` | Closed |
| Dynamic routes 404'd after the Next 16 upgrade | Fixed. Next 16 makes `params` a Promise; four route files read `params.id` synchronously, so every client, campaign, content brief and client report returned 404. Caught by the e2e suite, not by a person. | `src/app/(os)/**/[id]/page.tsx` | Closed |
| Six unlabelled `<select>` elements in Local Growth OS | Fixed. axe rates `select-name` critical. | `roadmap-board.tsx`, `module-screens.tsx`, `audit-workflow.tsx`, `onboarding-wizard.tsx` | Closed |
| Three `localStorage` stores hydrated with a post-mount `setState` | Fixed. Replaced with `useSyncExternalStore` (`src/lib/persistent-store.ts`), which removes a cascading render on every mount and picks up writes from another tab. | `engagement/store.tsx`, `flow/handoff-store.tsx`, `layout/tour.tsx` | Closed |
| The mobile menu was not a dialog: no focus trap, no Escape, no focus restore | Fixed. `role="dialog"`, `aria-modal`, focus moved in and trapped, Escape closes, focus returns to the trigger. Tested. | `src/components/layout/mobile-nav.tsx` | Closed |
| The mobile menu button was squeezed to 23px wide by a flex sibling | Fixed with `shrink-0`; it is now the 36×36 it always asked for. | `src/components/layout/mobile-nav.tsx` | Closed |
| Status changes were silent to assistive technology | Fixed. One polite live region in the shell (`src/components/layout/announcer.tsx`), wired to agent deploy, integration connect and disconnect, brief version save, task completion and client search results. | WCAG 4.1.3 | Closed |
| The `/clients` search box was wired to nothing | Fixed. It filters the table and announces the match count. | `src/components/clients/client-table.tsx` | Closed |
| `/growth/login` published five demo emails and a password | Fixed. The block is gone from the screen and the README; the screen now states plainly that nothing is authenticated. | `module-screens.tsx`, `README.md` | Closed |
| The prospect scanner had no timeout, retry or rate limiting | Fixed. A 20s request timeout, three attempts with exponential backoff, `Retry-After` honoured, and a delay between pages. | `scripts/prospect-scanner/scan.mjs` | Closed |
| Six Local Growth OS `<select>` elements had no accessible name | Fixed in this pass. axe rates `select-name` critical | `aria-label` added in `roadmap-board.tsx`, `module-screens.tsx`, `audit-workflow.tsx`, `onboarding-wizard.tsx` | Closed |
| `campaign-dashboard.tsx` recreated its `kpis` fallback array every render, invalidating a `useMemo` | Fixed in this pass. It also failed `next lint --max-warnings 0`, so it would have blocked CI | `react-hooks/exhaustive-deps` | Closed |
| The SaaS and Enterprise dashboards are still linked and built | `docs/SOURCE_OF_TRUTH.md` records a decision to park them in favour of Local | Both routes render and are in the sidebar | Product |
