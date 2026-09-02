# SEO Manager OS + Local Growth OS

SEO Manager OS is an **SEO investigation, diagnosis, strategy, and execution operating system** for agencies. This branch adds **Local Growth OS**, an opinionated multi-tenant local SEO campaign-management layer and client reporting portal for U.S. home-service businesses.

Local Growth OS is designed for an agency strategist managing 7–10 HVAC, plumbing, roofing, electrical, remodeling, landscaping, cleaning, hauling, restoration, painting, flooring, pest-control, or general-contractor campaigns without falling back to a generic project-management tool.

## What is implemented on this branch

### Local Growth OS application shell

Open `/growth` from the primary desktop or mobile navigation.

Implemented routes:

- `/growth` — agency campaign command center
- `/growth/login` — role-aware no-credential demo workspace selector
- `/growth/campaigns` — campaign portfolio
- `/growth/campaigns/new` — 5-step home-service campaign onboarding
- `/growth/campaigns/[id]` — campaign operating dashboard
- `/growth/tasks` — SEO production board/list/calendar + workload
- `/growth/audits` — prioritized findings dashboard
- `/growth/audits/gbp` — policy-aware GBP audit detail
- `/growth/roadmap` — roadmap board/timeline/list + human approval gate
- `/growth/gbp` — GBP operations summary
- `/growth/rankings` — local-pack geo-grid + organic comparison
- `/growth/keywords` — keyword clustering/page mapping + cannibalization flags
- `/growth/citations` — NAP master comparison + listing queue
- `/growth/content` — content calendar/pipeline
- `/growth/content/[id]` — content brief detail + asset/QA requirements
- `/growth/reviews` — reputation/review velocity view
- `/growth/competitors` — competitor gap view
- `/growth/technical` — technical SEO issue/validation view
- `/growth/outreach` — local authority/outreach view
- `/growth/leads` — lead → qualified → booked → closed view
- `/growth/reports` — frozen-snapshot monthly report builder
- `/growth/reports/client/[id]` — plain-English client report portal view
- `/growth/requests` — agency/client request portal
- `/growth/templates` — reusable local SEO operating templates
- `/growth/integrations` — adapter states, freshness and mock/live status
- `/growth/settings` — roles, tenant controls and organization settings

### Supabase database foundation

`supabase/migrations/202608300001_local_growth_os.sql` creates the Local Growth OS data model. Two companion migrations make the `clients` policy setup reset-safe and finalize its explicit RLS policies.

Core entities include:

- organizations, users, user_roles
- clients, client_contacts, campaigns, campaign_users
- business_profiles, locations, service_areas, services
- competitors, competitor_snapshots
- audit_templates, audits, audit_sections, audit_findings, recommendations
- strategy_roadmaps, roadmap_initiatives
- tasks, task_comments, task_attachments
- keywords, keyword_clusters, keyword_page_maps, rank_snapshots
- gbp_profiles, gbp_metrics, gbp_audit_items
- citations, citation_audit_items
- content_items, content_briefs, content_pages
- reviews, review_requests
- technical_issues, schema_items
- backlinks, outreach_opportunities
- leads, conversion_events
- monthly_reports, report_sections
- client_requests, files
- integrations, activity_logs, notifications

### Multi-tenant Row Level Security

The schema uses Supabase RLS helpers and policies so tenant scope is enforced in Postgres, not just hidden in the UI.

**These policies are executed and tested, not just written.** `scripts/db-test-setup.sh`
applies the real migrations, the demo seed and a two-organization fixture to a live Postgres;
`tests/integration/tenant-isolation.spec.ts` then attempts to cross the boundary 22 ways —
by listing, by naming a foreign id directly, by insert, by update, by ownership transfer, by
self-granted role, and through the storage bucket — and every attempt is refused. It runs as
a blocking job on every pull request. Disabling RLS on a single table turns 8 of those tests
red, which is how you know they test something.

Two things that are *not* true, and matter: no application code queries this database yet
(`grep -rl supabase src` returns nothing), and the tests run against plain Postgres behind a
small compatibility shim (`supabase/test/`), so they prove the policies are correct rather
than that Supabase's own auth and storage services behave as the policies assume.

Agency roles:

- `agency_admin`
- `lead_seo`
- `seo_strategist`
- `content_outreach`

Client roles:

- `client_viewer`
- `client_editor`

Client viewers/editors are scoped to a specific `client_id`. Client editors can update client-facing business/contact/request/file surfaces, but cannot silently edit agency audits, rankings, strategy or internal notes.

The `client-assets` Supabase Storage bucket follows the path convention:

```text
<organization_id>/<client_id>/<uuid>-<filename>
```

Storage read/upload policies use the same client scope.

## Demo campaigns

`supabase/seed.sql` and `src/lib/local-growth/demo-data.ts` include three realistic home-service campaigns:

1. **Capital Comfort HVAC** — Washington, DC
2. **DMV Roofing & Exteriors** — Maryland
3. **Potomac Plumbing Co.** — Northern Virginia

The demo data intentionally includes:

- different service priorities and economics
- multiple cities and ZIP targets
- GBP metrics and source freshness
- keyword clusters and geo-grid rank snapshots
- competitors and competitive notes
- citation inconsistencies
- audit findings
- roadmap initiatives
- blocked tasks and waiting-on-client tasks for every campaign
- content dependencies and QA flags
- reviews and review velocity
- lead/conversion records
- frozen monthly report snapshots
- client requests
- blocked/unavailable integrations

Revenue is left unavailable when source data does not explicitly supply it.

## Demo workspace selector

`/growth/login` is a **workspace selector, not a sign-in**. It has no authentication behind
it: choosing a role changes what the demo renders and nothing else. The screen says so, and
the credential list that used to sit here was removed — publishing an email/password pair
next to a real project trains the wrong habit and implied an access control that does not
exist.

The multi-tenant policies in `supabase/migrations/` are the real boundary. They are written
and **not yet wired up or tested**, so treat everything in the demo as public. For a live
deployment, create real Supabase Auth users, assign `user_roles` records, and see ORG-001 in
`docs/production/WORKFLOW-RISK-REGISTER.md` for what has to be proven before that ships.

## Stack

Existing application:

- Next.js 16 App Router + TypeScript
- Tailwind CSS + shadcn-style local UI primitives
- Recharts
- lucide-react

Local Growth OS foundation adds:

- Supabase Postgres schema
- Supabase Auth/RLS-ready user-role model
- Supabase Storage policy model
- typed connector architecture
- typed Local Growth OS domain model
- mock provider/data layer
- draft-only AI guardrails

### Dependency note

The lockfile does **not** include `@supabase/supabase-js`, React Hook Form, Zod, or TanStack Table. That is deliberate: this branch does not fake dependencies or hand-edit `package-lock.json` with unverified metadata. The screens use the existing dependency set so the static demo architecture stays compatible.

Adding the official Supabase client + React Hook Form + Zod + TanStack Table is the first production-wiring backlog item below. The SQL/RLS schema, UI flows, connector boundaries, types, and data contracts are already structured for that migration — and since the schema and its policies are now executed and tested on every pull request (`npm run test:authz`), that wiring has a proven boundary to connect to rather than an assumed one.

## Next.js runtime behavior

The old repo forced `output: "export"` in every environment. This branch changes that behavior:

- `GITHUB_PAGES=true` → static export for the credential-free GitHub Pages demo
- normal local/Vercel build → standard Next.js server mode

This allows the production version to use Server Actions, Route Handlers, secure OAuth callbacks and Supabase session handling while preserving the existing static demo deployment.

## Run the UI locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000/growth
```

Useful checks:

```bash
npm run typecheck
npm run lint
npm run build
```

## Supabase local setup

Install/configure the Supabase CLI, then provide a local Supabase project.

Expected public environment variables for live wiring:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Server-only variables for privileged jobs/connectors should never use the `NEXT_PUBLIC_` prefix, for example:

```bash
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
CALLRAIL_API_TOKEN=
```

Do not expose service-role or OAuth client secrets to client components.

Run migrations + demo database seed:

```bash
supabase start
supabase db reset
```

Migration order:

```text
202608300000_clients_rls_preflight.sql
202608300001_local_growth_os.sql
202608300002_clients_rls_finalize.sql
```

The preflight/finalize pair exists because the initial foundation migration used one generic RLS loop for child tables and the `clients` table itself. The preflight creates a temporary generated compatibility alias; the finalize migration removes it and installs the correct explicit `clients` policies. The **final schema has no redundant client_id column on clients**.

## Local Growth OS source structure

```text
src/
  app/(os)/growth/
    page.tsx
    login/
    campaigns/
    tasks/
    audits/
    roadmap/
    gbp/
    rankings/
    keywords/
    citations/
    content/
    reviews/
    competitors/
    technical/
    outreach/
    leads/
    reports/
    requests/
    templates/
    integrations/
    settings/
  components/local-growth/
    growth-nav.tsx
    overview.tsx
    campaign-list.tsx
    onboarding-wizard.tsx
    campaign-dashboard.tsx
    audit-workflow.tsx
    roadmap-board.tsx
    tasks-view.tsx
    module-screens.tsx
  lib/local-growth/
    types.ts
    demo-data.ts
    connectors.ts
    ai-guardrails.ts
supabase/
  migrations/
  seed.sql
```

## Campaign onboarding

The new 5-step onboarding captures:

1. client legal/public identity, website, trade, business model, contact, phone/address/time zone/start/contract
2. services, priority/high-margin services, average ticket, minimum job size, customer mix, emergency service, trust facts, seasonality and capacity
3. primary city, target cities/ZIPs/service areas/exclusions/priority markets/competitors
4. GA4, GSC, GBP, Tag Manager, CMS, call tracking, CRM, rank tracker, citation provider, host and registrar access states
5. baseline date, KPIs, keyword clusters, landing pages and notes

It produces a **draft** first-90-days roadmap. Generated strategy remains internal until a human approves it.

## Audit → roadmap → task flow

Audit findings store:

- severity
- impact
- effort
- confidence
- owner
- due date
- workflow status
- evidence
- recommendation
- client explanation
- client visibility
- risk acknowledgement

Recommendation order uses:

```text
Impact × Confidence ÷ Effort
```

A finding can create a roadmap initiative or task while preserving the finding ID as the relational source.

GBP-specific guardrails prevent a high-risk recommendation from being marked ready until the strategist acknowledges the risk. The UI explicitly warns against keyword-stuffed business names, fake locations/virtual offices, fake reviews/review gating and duplicate profiles.

## Connector architecture

`src/lib/local-growth/connectors.ts` defines the adapter boundary. Mock providers and future live providers share the same shape:

```ts
interface Connector<T> {
  provider: string;
  mode: "mock" | "live";
  connect(): Promise<ConnectionState>;
  sync(context: CampaignContext): Promise<SyncResult<T>>;
  freshness(): Promise<DataFreshness>;
  importCsv?(rows: Record<string, unknown>[], context: CampaignContext): Promise<SyncResult<T>>;
}
```

Cataloged providers:

- Google Analytics 4
- Google Search Console
- Google Business Profile
- Google Drive
- Slack
- BrightLocal
- Local Falcon
- Whitespark
- Ahrefs
- Semrush
- CallRail
- Zapier / generic signed webhooks

### Replacing a mock connector

For each provider:

1. keep the provider-specific OAuth/token code inside an adapter
2. map external data into the Local Growth OS canonical row type
3. persist provider account ID, connection state, sync history, errors and timestamps in `integrations`
4. write normalized metrics/snapshots into campaign-owned tables
5. store `last_sync_at` and `data_fresh_at`
6. surface unavailable/stale states in dashboards and reports
7. retain CSV import as a fallback where practical

Never hide an unavailable source by manufacturing data.

## AI assistance rules

`src/lib/local-growth/ai-guardrails.ts` defines draft-only behavior for:

- audit executive summaries
- roadmap drafts
- keyword clustering suggestions
- title/meta variants
- content briefs
- FAQ ideas
- schema JSON-LD drafts
- monthly report narratives
- review responses
- competitor gap summaries
- Slack updates
- client asset-request messages

Every draft must retain source data, remain editable, label assumptions, warn on insufficient data, and require human approval before external publication.

AI must never fabricate:

- credentials or certifications
- service areas
- pricing
- project details
- reviews
- rankings
- citations
- results
- revenue
- Google policy claims

## Prioritized production backlog

1. **Install and lock official data/form dependencies**: `@supabase/supabase-js`, React Hook Form, Zod, TanStack Table; convert manual demo validation/table state to those libraries.
2. **Wire Supabase Auth sessions** into the Next.js server build, add auth middleware/session refresh, workspace resolution and role-aware route guards.
3. **Connect screen mutations to Supabase**: onboarding inserts, audit finding updates, roadmap/task creation, client request responses/uploads and report publishing.
4. **Add database-level audit-log triggers or transactional service functions** for sensitive mutations.
5. **Implement Google OAuth** for GA4, GSC, GBP and Drive through server-only callback routes.
6. **Implement first live rank/citation adapter** (BrightLocal or Local Falcon) plus CSV importer mapping/validation.
7. **Implement CallRail adapter** and preserve the no-inferred-revenue rule.
8. **Replace remaining summary-only modules** (competitors, technical, outreach, reviews) with full CRUD/table/detail workflows backed by Supabase.
9. **Add automated request reminders/digests** through email + Slack Edge Functions/cron.
10. **Add full test coverage**: RLS isolation tests, role permissions, onboarding, audit→roadmap→task, client request upload/response, snapshot report publishing and connector failure states.
11. **Add PDF rendering service** for downloadable reports beyond browser print styling.
12. **Add billing-ready organization/plan controls** once product packaging is defined.

## Original SEO Manager OS workflow

The existing investigation loop remains intact. Local Growth OS is an additional operating
layer focused specifically on recurring local SEO campaign management and client reporting;
it does not remove the existing investigation system.

The nine stages are defined in `src/lib/stages.ts`. Each consumes the previous stage's
outputs:

```text
Discovery → Data Collection → Intent Mapping → Competitive Insights → Diagnosis
   → Playbooks → Project Brief → Daily Tasks → Reports → next cycle
```

| # | Stage | Route | What it does |
|---|-------|-------|--------------|
| 1 | Discovery Interview | `/discovery` | Consultant-style intake that classifies the engagement and captures goals, services, locations and competitors. |
| 2 | Data Collection | `/research` | Connects or ingests GSC, GA4, GBP, crawl and rankings data. |
| 3 | Intent Mapping | `/intent` | Maps TOF/MOF/BOF intent against the client's goals and content. |
| 4 | Competitive Insights | `/competitors` | Share of voice, SERP features, gaps, AI answer coverage. |
| 5 | Diagnosis | `/diagnosis` | Root-cause analysis with confidence and impact. |
| 6 | Playbooks | `/tools` | Outcome playbooks per client type, plus the shared AEO planner. |
| 7 | Project Brief | `/strategy` | Executive-ready strategy doc, priority matrix, roadmap and forecast. |
| 8 | Daily Task Engine | `/tasks` | Today's owned worklist, lifecycle board and alerts. |
| 9 | Reports | `/reports` | Rankings, traffic, leads and revenue against goals. |

Manager surfaces across all clients: Command Center (`/command`), Clients (`/clients`,
`/clients/[id]`), Workflow (`/workflow`), Performance Tracker (`/tracker`), AI Workforce
(`/agents`), Risk Center (`/risk`), Wins (`/wins`), Deployment Verification
(`/deployments`), Integrations (`/integrations`) and Settings (`/settings`).

There are no `/investigation`, `/execution` or `/measurement` routes; earlier documentation
named stages that the application does not have.

## Checks

```bash
npm run verify     # lint + typecheck + build + unit tests
npm run test:unit  # Vitest, tests/unit
npm run test:e2e   # Playwright critical workflows (run npm run build first)
npm run test:a11y  # axe + keyboard checks on the key screens (build first)

# Tenant isolation. Needs a Postgres; applies the real migrations and tries to cross
# the boundary between two organizations. Blocking in CI.
npm run db:test:setup
npm run test:authz
```

`npm run test:a11y` asserts **zero** axe violations of every WCAG 2.0/2.1/2.2 A and AA rule
across the key screens at desktop and mobile widths, not a baseline.

`npm run start` serves the standard Next.js build. For the GitHub Pages artifact, build with
`GITHUB_PAGES=true` and serve `out/` with `npm run start:export -- --base-path
/seo-manager-os`, which mirrors how Pages serves it. `next start` does not work against an
export build, which is what that script exists for.

## Working in this repository

`WORLD_CLASS_APP_THESIS.md` is the governing engineering and delivery standard. `CLAUDE.md`
and `AGENTS.md` are the instructions coding agents follow. `docs/production/INVENTORY.md` is
the honest, file-by-file account of what exists, and `PRODUCTION_READINESS.md` is the review
that decides whether this can go in front of real users. Start there before adding a
feature.
