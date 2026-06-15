# SEO Manager OS

An **SEO investigation, diagnosis, strategy, and execution operating system** for
ad agencies running **local → enterprise** SEO.

This is **not** an SEO dashboard. It operates like a Senior SEO Strategist,
Agency Director, Local Search Consultant, SaaS SEO Lead, or Enterprise SEO
Manager — answering the only question that matters before recommending any work:

> Why is this business not winning in search?

> **Status:** functional UI prototype. Everything runs on mock data — there is no
> backend, authentication, or live integrations yet.

## Core philosophy

Most SEO tools go **Data → Charts → Reports**. SEO Manager OS runs a continuous
operating loop instead:

```
Interview → Research → Investigation → Diagnosis
   → Strategy → Execution → Tools → Measurement
```

## The 8 stages

| # | Stage | What it does |
|---|-------|--------------|
| 1 | **Discovery Interview** (`/discovery`) | Consultant-style intake wizard that classifies the engagement (Local / SaaS / Enterprise). |
| 2 | **Research Engine** (`/research`) | Auto-generates the research plan for the detected model. |
| 3 | **Investigation** (`/investigation`) | Runs the audits that surface evidence behind the symptoms. |
| 4 | **Diagnosis Engine** (`/diagnosis`) | Root-cause analysis with confidence + impact — the most important screen. |
| 5 | **Strategy Brief** (`/strategy`) | Executive-ready strategy doc with a priority matrix and expected outcomes. |
| 6 | **Execution Planner** (`/execution`) | 30 / 90 / 180-day plans with priority, impact, effort, confidence, owner, status. |
| 7 | **Execution Tools** (`/tools`) | Purpose-built planners per SEO model, plus a shared AEO planner. |
| 8 | **Measurement** (`/measurement`) | Visibility, Authority, Trust, AI Visibility, Lead, Revenue, Opportunity & Competitive scores. |

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

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

## Project structure

```
src/
  app/
    page.tsx              # Landing page
    (os)/                 # App shell (sidebar + stage bar)
      discovery/ research/ investigation/ diagnosis/
      strategy/ execution/ tools/ measurement/
      dashboards/{local,saas,enterprise}/
  components/
    ui/                   # Card, Button, Badge, Tabs, Progress, ScoreRing…
    layout/               # Sidebar, StageBar, PageHeader
    charts/               # Recharts wrappers
    dashboard/ discovery/ modules/
  lib/
    data.ts               # Stage mock data
    dashboards.ts         # Dashboard mock data
    stages.ts             # Stage + dashboard definitions
```
