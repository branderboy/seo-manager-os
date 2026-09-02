# Application inventory

Phase 1 of the proof of concept to production path. Fill this in before adding features.
Cite file paths. Anything you cannot confirm is recorded as Unknown, not guessed.

- Inventoried by: Claude Code, working from the repository at the commit below. Every row
  was read out of the source, not inferred from documentation.
- Date: 2026-09-02
- Commit: `a7dbb93fe18beb51fe41c912a3df16a3daa4090d`, plus the verification changes on
  `claude/seo-manager-app-verify-ptc4e6`.

## Summary

SEO Manager OS is a **Next.js 14 App Router application compiled to a static export**
(`output: "export"` in `next.config.mjs`) and published to GitHub Pages. There is no
server, no database, no authentication, no authorization, no tenancy, no API route, no
server action, no job, and no webhook. Every number on every screen is mock data in
`src/lib/*.ts`. Client state lives in the visitor's own `localStorage`.

This is not a criticism of the build. It is the fact that decides which of the delivery
standard's controls apply today and which are simply not yet reachable.

## Users and roles

| Role | How it is assigned | What it can do that others cannot | Enforced where |
|---|---|---|---|
| None. The application has no concept of a user. | n/a | n/a | Nowhere. There is no identity, session, or permission check anywhere in `src/`. |
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

29 routes in total, all verified rendering on desktop and mobile by
`tests/e2e/critical-workflows.spec.ts`.

## APIs, server actions, jobs, webhooks

| Endpoint or job | Purpose | Auth check | Authorization check | Input validation | File |
|---|---|---|---|---|---|
| None | — | — | — | — | There is no `route.ts`, no `"use server"` action, no scheduled job and no webhook handler anywhere in `src/`. |
| `scan.mjs` (local CLI, outside the web app) | Scans JSearch for agency prospects and job leads | Bearer key from `RAPIDAPI_KEY` | n/a, single operator tool | Argument parsing only; no untrusted input | `scripts/prospect-scanner/scan.mjs` |

## Data

| Table or bucket | Contains | Tenant key | Access policy | Migration tracked |
|---|---|---|---|---|
| None | — | — | — | No. There is no database. `prisma/schema.prisma` is the delivery standard's starter schema, unused and unwired. |
| Browser `localStorage` | `smos.engagement` (active client), `smos.agents.deployed`, `smos.tour.seen`, `smos.tour.furthest` | n/a | Whatever the visitor's browser allows | n/a |
| Mock data modules | Every score, client, task, ranking, report and integration state | n/a | Compiled into the public bundle | n/a — `src/lib/*.ts`, 3,099 lines |

Data classifications present: none. No personal data, no customer data, no credentials and
no business data of any real party is stored or transmitted by the web application. The
client names in the app (Northwind Heating & Air, Flowdesk, Vantage Retail, Acme, Hill
Country) are fictional demo accounts. `scripts/prospect-scanner` handles a real API key,
held in a local `.env` that `.gitignore` excludes.

## External services

| Provider | Used for | Credentials stored where | Environment tested |
|---|---|---|---|
| JSearch on RapidAPI | Prospect and job scanning, CLI only | `scripts/prospect-scanner/.env`, git-ignored | live (operator's machine) |
| Google Fonts | Inter and JetBrains Mono, fetched at build by `next/font` | none | live (build time) |
| GitHub Pages | Hosting the static export | GitHub Actions OIDC, `.github/workflows/deploy.yml` | live |
| The 41 entries in `src/lib/integrations.ts` (GA4, GSC, GBP, DataForSEO, PageSpeed, Yelp, OpenAI, Claude, Slack, HubSpot, …) | Nothing. Catalogue entries with mock connection states. | none | none |

## Tests

| Suite or file | What it actually asserts | Would it fail if the behavior broke |
|---|---|---|
| `tests/unit/routes.spec.ts` | Every literal internal `href` in `src/` resolves to a real App Router page; every stage and dashboard slug has a page; stage numbers are unique and sequential | Yes — verified by introducing a dead nav link and watching it fail |
| `tests/unit/scoring.spec.ts` | The bounds, directions and traceability of `src/lib/scoring.ts`: rank mapping, trend caps, CTR monotonicity, no zero divisor, priority urgency | Yes |
| `tests/e2e/critical-workflows.spec.ts` | All 29 routes return 200 and render on desktop and mobile with no client-side error; the 404 page appears for an unknown route; every nav link resolves; the pipeline walks end to end; discovery accepts input; a client record opens from the list; no key screen scrolls horizontally at 360px | Yes |
| `tests/e2e/accessibility.spec.ts` | axe WCAG 2.0/2.1/2.2 A and AA with colour contrast handled by a separate ratchet; every form control has an accessible name; the skip link works; sidebar focus is visible; one `h1` and one `main` per page; titles unique | Yes |
| `tests/integration/tenant-isolation.spec.ts`, `tests/fixtures/seed.ts` | Nothing. The delivery standard's originals, kept for the future backend. Excluded from `tsconfig.json` and from every CI job. | No — and they are not counted as coverage. See `tests/integration/README.md`. |

Before this pass the repository had no tests and no CI for the application, as
`docs/SOURCE_OF_TRUTH.md` recorded.

## Environments and configuration

- Environments that exist: **local development** (`npm run dev`), **local production**
  (`npm run build && npm run start`, serving `out/` via `scripts/serve-export.mjs`), and
  **production** (GitHub Pages, built with `GITHUB_PAGES=true`). There is **no staging
  environment**.
- Required environment variables: none for the web application. `GITHUB_PAGES=true` selects
  the `/seo-manager-os` basePath at build time. `TEST_BASE_URL` points the Playwright
  suites somewhere other than `http://localhost:3000`.
  `PLAYWRIGHT_CHROMIUM_EXECUTABLE` lets a sandbox that cannot download browsers point at an
  existing Chromium. `RAPIDAPI_KEY` is used only by the CLI scanner.
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
| Colour contrast fails WCAG 1.4.3 in 82 places across the key screens | Serious. Small text on light surfaces and on the dark sidebar is below 4.5:1 | Measured with axe-core on 11 routes at two viewports. Full findings in `docs/audits/accessibility-audit.md`; ratcheted in `tests/e2e/accessibility.spec.ts` | Human owner — it is a palette decision, not a bug fix |
| `npm audit` reports 5 high-severity advisories, all requiring Next.js 14 → 16 | Blocks the `Dependency audit` job in `security.yml` | `npm audit`; every advisory concerns server-side Next.js features that a static export does not have. Assessed in `docs/audits/security-audit.md` | Human owner — a major framework upgrade |
| No staging environment | Every change goes from a pull request straight to production | `.github/workflows/deploy.yml` has one target | Human owner |
| No error tracking, no logs, no uptime monitoring | A broken deploy is discovered by a person looking at it | Nothing in the repository reports anything anywhere | Human owner |
| Every integration in `/integrations` presents as connectable but connects to nothing | A viewer can reasonably believe data is live | Read from `src/lib/integrations.ts`; the toggles set local state | Product |
| "Share" on briefs and reports produces a link that opens nothing | Same | `src/components/flow/brief-share.tsx`, `src/components/reports/report-share.tsx` | Product |
| `coreScores` in the UI still read mock numbers rather than `src/lib/scoring.ts` | The grounded scoring work is not yet visible where it matters | Already recorded in `docs/SOURCE_OF_TRUTH.md` | Product |
| Task state is React state, not persisted | A reload silently discards the day's work | `src/components/tasks/task-store.tsx` holds tasks in `useState` while other stores use `localStorage` | Product |
| Task lifecycle board needs a horizontal scroll on narrow screens | Usable, now keyboard reachable | Fixed in this pass: `role="region"` + `tabIndex` on `src/components/tasks/task-lifecycle-board.tsx` | Closed |
| The SaaS and Enterprise dashboards are still linked and built | `docs/SOURCE_OF_TRUTH.md` records a decision to park them in favour of Local | Both routes render and are in the sidebar | Product |
