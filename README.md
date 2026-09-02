# SEO Manager OS

An **SEO investigation, diagnosis, strategy, and execution operating system** for
ad agencies running **local → enterprise** SEO.

This is **not** an SEO dashboard. It operates like a Senior SEO Strategist,
Agency Director, Local Search Consultant, SaaS SEO Lead, or Enterprise SEO
Manager — answering the only question that matters before recommending any work:

> Why is this business not winning in search?

> **Status:** functional UI prototype. Everything runs on mock data — there is no
> backend, authentication, or live integrations yet. The delivery standard that governs
> the path from here to a real product is `WORLD_CLASS_APP_THESIS.md`; what exists today,
> file by file, is recorded in `docs/production/INVENTORY.md`.

## Core philosophy

Most SEO tools go **Data → Charts → Reports**. SEO Manager OS runs a continuous
operating loop instead:

```
Discovery → Data Collection → Intent Mapping → Competitive Insights → Diagnosis
   → Playbooks → Project Brief → Daily Tasks → Reports
```

## The 9 stages

Defined in `src/lib/stages.ts`. Each stage consumes the previous stage's outputs.

| # | Stage | Route | What it does |
|---|-------|-------|--------------|
| 1 | **Discovery Interview** | `/discovery` | Consultant-style intake that classifies the engagement and captures goals, services, locations, competitors. |
| 2 | **Data Collection** | `/research` | Connects or ingests GSC, GA4, GBP, crawl and rankings data. |
| 3 | **Intent Mapping** | `/intent` | Maps TOF/MOF/BOF intent against the client's goals and content. |
| 4 | **Competitive Insights** | `/competitors` | Share of voice, SERP features, gaps, AI answer coverage. |
| 5 | **Diagnosis** | `/diagnosis` | Root-cause analysis with confidence and impact — the most important screen. |
| 6 | **Playbooks** | `/tools` | Outcome playbooks per client type, plus the shared AEO planner. |
| 7 | **Project Brief** | `/strategy` | Executive-ready strategy doc, priority matrix, roadmap and forecast. |
| 8 | **Daily Task Engine** | `/tasks` | Today's owned worklist, lifecycle board and alerts. |
| 9 | **Reports** | `/reports` | Rankings, traffic, leads, AI visibility and revenue against goals. |

Manager surfaces across all clients: **Command Center** (`/command`, the app home),
**Clients** (`/clients`, `/clients/[id]`), **Workflow** (`/workflow`), **Performance
Tracker** (`/tracker`), **AI Workforce** (`/agents`), **Risk Center** (`/risk`), **Wins**
(`/wins`), **Deployment Verification** (`/deployments`), **Integrations**
(`/integrations`) and **Settings** (`/settings`).

## Dashboards

Three model-specific dashboards, each with an **AEO (AI visibility) module**:

- **Local SEO** (`/dashboards/local`) — geo grid, GBP health, review intelligence, competitor trust, local authority.
- **SaaS SEO** (`/dashboards/saas`) — BOFU coverage, comparison/alternative pages, programmatic opportunity, conversion funnel.
- **Enterprise SEO** (`/dashboards/enterprise`) — crawl budget, indexation, template performance, internal link graph, forecasting.

## Stack

- **Next.js 14** (App Router) · **TypeScript**
- **Tailwind CSS** + shadcn-style UI primitives
- **Recharts** · **lucide-react**
- Light, Stripe / Notion-inspired design — no authentication, mock data only.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

The app is a **static export** (`output: "export"` in `next.config.mjs`), so `next start`
does not apply. To run the production build locally:

```bash
npm run build    # writes the static export to out/
npm run start    # serves out/ on http://localhost:3000, the way GitHub Pages does
```

Checks:

```bash
npm run verify     # lint + typecheck + build + unit tests
npm run test:unit  # Vitest, tests/unit
npm run test:e2e   # Playwright critical workflows (build first)
npm run test:a11y  # axe + keyboard checks on the key screens (build first)
```

## Project structure

```
src/
  app/
    page.tsx                # Landing page
    icon.svg                # Favicon
    (os)/                   # App shell (sidebar + top bar + main landmark)
      command/ clients/ workflow/ tracker/ agents/ risk/ wins/
      deployments/ integrations/ settings/
      discovery/ research/ intent/ competitors/ diagnosis/
      tools/ strategy/ tasks/ reports/
      dashboards/{local,saas,enterprise}/
  components/
    ui/                     # Card, Button, Badge, Tabs, Progress, ScoreRing…
    layout/                 # Sidebar, StageBar, MobileNav, PageHeader
    charts/                 # Recharts wrappers
    clients/ dashboard/ diagnosis/ discovery/ engagement/ flow/
    agents/ integrations/ investigation/ modules/ playbooks/
    reports/ settings/ stages/ tasks/ tracker/ workflow/
  lib/
    stages.ts               # Stage + dashboard definitions
    data.ts                 # Stage mock data
    dashboards.ts           # Dashboard mock data
    scoring.ts              # Grounded scoring model (docs/SCORING.md)
    tracker.ts integrations.ts risk.ts work.ts …

tests/
  unit/                     # Vitest: route integrity, scoring model
  e2e/                      # Playwright: critical workflows, accessibility
scripts/serve-export.mjs    # Serves out/ the way GitHub Pages does
docs/                       # Project docs + the delivery standard's working documents
```

## Working in this repository

`WORLD_CLASS_APP_THESIS.md` is the governing standard, `CLAUDE.md` and `AGENTS.md` are the
instructions agents follow, and `docs/production/INVENTORY.md` is the honest account of
what exists. Start there before adding a feature.
