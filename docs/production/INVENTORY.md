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

Two applications share one Next.js 14 App Router codebase and one shell.

**SEO Manager OS** is the original nine-stage investigation and diagnosis pipeline, plus its
manager surfaces. **Local Growth OS** (`/growth`, 33 routes) is a newer multi-tenant local
SEO campaign-management and client-reporting layer for U.S. home-service businesses.
62 routes in total.

**Nothing in `src/` talks to a server.** Every number on every screen comes from mock data
in `src/lib/*.ts` and `src/lib/local-growth/demo-data.ts` — 4,214 lines of it. Client state
lives in the visitor's own `localStorage`. There is no API route, no server action, no job
and no webhook.

Three things changed with the Local Growth OS merge and they matter to this inventory:

1. **A database schema now exists** — 1,359 lines of SQL under `supabase/`, including
   multi-tenant Row Level Security policies and a storage policy model. It is **not wired
   to anything**: `grep -rl supabase src` returns nothing.
2. **`next.config.mjs` is no longer export-only.** `GITHUB_PAGES=true` produces the static
   Pages demo; every other build is a standard Next.js server build. The framework no
   longer forbids a server; the application simply does not have one yet.
3. **A login screen exists** at `/growth/login`. It is a role picker with published demo
   credentials and no authentication behind it.

None of that is a criticism. It is the set of facts that decides which of the delivery
standard's controls apply today and which are not yet reachable.

## Users and roles

| Role | How it is assigned | What it can do that others cannot | Enforced where |
|---|---|---|---|
| None, in the running application. | n/a | n/a | Nowhere. There is no identity, session, or permission check anywhere in `src/`. |
| `agency_admin`, `lead_seo`, `seo_strategist`, `content_outreach`, `client_viewer`, `client_editor` | Defined in `supabase/migrations/202608300001_local_growth_os.sql` as a `user_roles` table with RLS policies. Client roles are scoped to a `client_id`. | On paper: client viewers and editors are held out of agency audits, rankings, strategy and internal notes. | **In SQL only.** No code loads these policies, no session resolves a role, and no test exercises them. Selecting a role at `/growth/login` changes React state and nothing else. |
| The demo accounts published in `README.md` and rendered on `/growth/login` (`agency-admin@localgrowth.demo` and four others, password `LocalGrowthDemo!`) | Hard-coded UI strings | Nothing. They are not Supabase Auth users and authenticate against nothing. | Not enforced. Documented in the README as UI demo credentials. |
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
| **Local Growth OS** — role and workspace selection | `/growth/login` | Partial, and misleading. A role picker with published demo credentials; nothing authenticates. | Critical when real |
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
| ~50 tables defined in `supabase/migrations/202608300001_local_growth_os.sql` — organizations, users, user_roles, clients, campaigns, audits, findings, roadmaps, tasks, keywords, rank snapshots, GBP, citations, content, reviews, technical issues, backlinks, leads, reports, requests, files, integrations, activity logs | The Local Growth OS domain model | `organization_id`, with `client_id` scoping for client roles | Row Level Security policies, written in SQL and **never executed against a database in this repository** | Yes — three ordered migrations, plus `supabase/seed.sql`. **No migration has been run or verified here.** |
| `client-assets` storage bucket, path `<organization_id>/<client_id>/<uuid>-<filename>` | Client files | `organization_id` / `client_id` | Storage read and upload policies, in SQL only | Yes, in the same migration |
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
| `tests/e2e/accessibility.spec.ts` | axe WCAG 2.0/2.1/2.2 A and AA with colour contrast handled by a separate ratchet; every form control has an accessible name; the skip link works; sidebar focus is visible; one `h1` and one `main` per page; titles unique | Yes |
| `tests/integration/tenant-isolation.spec.ts`, `tests/fixtures/seed.ts` | Nothing. The delivery standard's originals, kept for the future backend. Excluded from `tsconfig.json` and from every CI job. | No — and they are not counted as coverage. See `tests/integration/README.md`. |
| The Supabase RLS policies in `supabase/migrations/` | Nothing. **There is no test of any kind against the schema or its policies.** | No. A policy that has never been executed is a hypothesis. |

Totals on this branch: 30 unit, 120 e2e, 74 accessibility (2 viewport-scoped skips).
Before this pass the repository had no tests and no CI for the application, as
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
| Colour contrast fails WCAG 1.4.3 in 184 places across the key screens | Serious. Small text on light surfaces and on the dark sidebar is below 4.5:1 | Measured with axe-core on 16 routes at two viewports. Full findings in `docs/audits/accessibility-audit.md`; ratcheted in `tests/e2e/accessibility.spec.ts` | Human owner — it is a palette decision, not a bug fix |
| The Supabase schema and its RLS policies have never been executed, seeded, or tested | High, and growing. The tenant boundary is the product's most important control and it exists only as unexecuted SQL. The longer it sits unrun, the more the team will assume it works. | `supabase/migrations/` is 1,152 lines of SQL; no CI job runs it and no test exercises a policy | Human owner |
| `/growth/login` presents a sign-in that authenticates nothing, with credentials printed on the page | Medium. A public demo showing a login screen invites the belief that access is controlled. | `src/components/local-growth/module-screens.tsx`; the README labels them UI demo credentials | Product |
| The Local Growth OS screens are a second, parallel product surface in the same shell | Medium. Two navigation systems, two client models (Client/Engagement vs Campaign) and two sets of task and report screens. Nothing reconciles them. | `src/lib/model.ts` and `src/lib/engagements.ts` vs `src/lib/local-growth/types.ts` | Product |
| `@supabase/supabase-js`, React Hook Form, Zod and TanStack Table are used conceptually but not installed | Low today, by deliberate choice — the README explains the branch avoided faking lockfile entries. It is the first backlog item. | `package.json` | Engineering |
| `npm audit` reports 5 high-severity advisories, all requiring Next.js 14 → 16 | Blocks the `Dependency audit` job in `security.yml` | `npm audit`; every advisory concerns server-side Next.js features that a static export does not have. Assessed in `docs/audits/security-audit.md` | Human owner — a major framework upgrade |
| No staging environment | Every change goes from a pull request straight to production | `.github/workflows/deploy.yml` has one target | Human owner |
| No error tracking, no logs, no uptime monitoring | A broken deploy is discovered by a person looking at it | Nothing in the repository reports anything anywhere | Human owner |
| Every integration in `/integrations` presents as connectable but connects to nothing | A viewer can reasonably believe data is live | Read from `src/lib/integrations.ts`; the toggles set local state | Product |
| "Share" on briefs and reports produces a link that opens nothing | Same | `src/components/flow/brief-share.tsx`, `src/components/reports/report-share.tsx` | Product |
| `coreScores` in the UI still read mock numbers rather than `src/lib/scoring.ts` | The grounded scoring work is not yet visible where it matters | Already recorded in `docs/SOURCE_OF_TRUTH.md` | Product |
| Task state is React state, not persisted | A reload silently discards the day's work | `src/components/tasks/task-store.tsx` holds tasks in `useState` while other stores use `localStorage` | Product |
| Task lifecycle board needs a horizontal scroll on narrow screens | Usable, now keyboard reachable | Fixed in this pass: `role="region"` + `tabIndex` on `src/components/tasks/task-lifecycle-board.tsx` | Closed |
| All 26 Local Growth OS routes shared one page title | Fixed in this pass. A screen reader user, or anyone reading browser history or a tab strip, could not tell them apart (WCAG 2.4.2) | Per-page `metadata.title`, and `generateMetadata` on the three dynamic routes | Closed |
| Six Local Growth OS `<select>` elements had no accessible name | Fixed in this pass. axe rates `select-name` critical | `aria-label` added in `roadmap-board.tsx`, `module-screens.tsx`, `audit-workflow.tsx`, `onboarding-wizard.tsx` | Closed |
| `campaign-dashboard.tsx` recreated its `kpis` fallback array every render, invalidating a `useMemo` | Fixed in this pass. It also failed `next lint --max-warnings 0`, so it would have blocked CI | `react-hooks/exhaustive-deps` | Closed |
| The SaaS and Enterprise dashboards are still linked and built | `docs/SOURCE_OF_TRUTH.md` records a decision to park them in favour of Local | Both routes render and are in the sidebar | Product |
