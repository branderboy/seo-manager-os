# Architecture Decision Record

Pillar 3 of `WORLD_CLASS_APP_THESIS.md`. This records the shape of the system as it is
today and the decisions that are already made, separated from the decisions that are not.

Two things this file is careful about. It does not describe a backend that does not exist.
And it does not treat "not built yet" as "not decided" where a decision has in fact been
taken in `docs/SOURCE_OF_TRUTH.md` or `docs/BUILD_SPEC.md`.

- Decision owner: the repository owner (`branderboy`). **Open:** the accountable human's
  name is not recorded in this repository. See `PRODUCT_BRIEF.md`.
- Last updated: 2026-09-02

## Application purpose

An SEO investigation, diagnosis, strategy and execution operating system for agencies
running local search. It produces a written, evidence-backed root-cause diagnosis per
client, a plan derived from it, the daily work derived from the plan, and the reporting
that proves the work moved something. See `PRODUCT_BRIEF.md`.

## Current shape, in one paragraph

One Next.js 14 App Router codebase holding **two products**: SEO Manager OS, the original
nine-stage investigation pipeline, and Local Growth OS (`/growth`), a multi-tenant local
campaign-management and client-reporting layer. 62 prerendered routes. No server process, no
live database, no authentication, no API route and no server action. All data is mock data
in `src/lib/*.ts` and `src/lib/local-growth/demo-data.ts`; per-visitor state lives in that
visitor's `localStorage`. The entire application is client-side, which means every byte of
it is public. `docs/production/INVENTORY.md` is the file-by-file account.

**The one qualification, and it matters:** `next.config.mjs` no longer forces
`output: "export"` everywhere. `GITHUB_PAGES=true` builds the static Pages demo; every other
build is a standard Next.js server build. And 1,359 lines of Supabase SQL — schema, RLS
policies, storage policies and a seed — now sit in `supabase/`. The framework and the schema
are both ready for a backend. **Neither is connected to anything**: `grep -rl supabase src`
returns nothing, and `@supabase/supabase-js` is not a dependency.

## Major components

| Component | Choice | Why | Alternative rejected |
|---|---|---|---|
| Frontend | Next.js 14 App Router, React 18, TypeScript strict, Tailwind CSS, shadcn-style primitives in `src/components/ui`, Recharts, lucide-react | Server components keep the data-dense screens cheap to render, and the App Router gives the stage routes a natural shape. Tailwind plus local primitives keeps the design system in the repository rather than in a vendor's. | A component library with its own opinions (MUI, Chakra) — the design in `design/` and `src/app/globals.css` is deliberate and would have been fought at every step. |
| Backend or API | **None in code.** `next.config.mjs` builds in server mode by default and only exports for GitHub Pages, so Server Actions and Route Handlers are now *available* — nothing uses them. | The product is at the stage of proving the operating loop reads correctly to an SEO lead. A backend built before that is a backend built for the wrong loop. Removing the global `output: "export"` constraint is the right preparation without being the commitment. | Building the API first. |
| Database | **Supabase Postgres, decided and schemad, not connected.** ~50 tables plus RLS and storage policies in `supabase/migrations/`. `prisma/schema.prisma` is the delivery standard's starter schema, superseded and unwired. | Supabase gives Postgres, Auth, Storage and row-level policies in one place, and RLS puts the tenant boundary in the database rather than in application code — which is the right place for the control this product most depends on. | Prisma plus a hand-rolled auth layer, which would have left tenant scoping in application code. |
| Authentication provider | **Supabase Auth, intended. Nothing implemented.** `/growth/login` is a role picker with published demo credentials and no authentication behind it. | Same reason as the database: one provider, and sessions that RLS can read. | — |
| File storage | **None.** The upload affordances in `src/components/investigation/evidence-panel.tsx` do not upload. | — | — |
| Email provider | **None.** The invite form in `src/components/discovery/client-invite.tsx` sends nothing. | — | — |
| Payment provider | **None.** Pricing and packaging are recorded as undecided in `docs/SOURCE_OF_TRUTH.md`. | — | — |
| Queue or job system | **None.** | The AI Workforce needs one; it does not exist. `docs/BUILD_SPEC.md` holds the plan. | — |
| Analytics | **None.** | — | — |
| Error monitoring | **None.** A broken deploy is currently discovered by a person looking at it. | — | — |
| Hosting and deployment | GitHub Pages, via `.github/workflows/deploy.yml`, built with `GITHUB_PAGES=true` for the `/seo-manager-os` basePath | Free, versioned with the repository, and appropriate for a public static demo. | Vercel — unnecessary while there is no server, and it would hide the fact that there is no server. |
| External APIs | JSearch on RapidAPI, from `scripts/prospect-scanner/scan.mjs` only. Google Fonts at build time. The 41 entries in `src/lib/integrations.ts` are a catalogue and call nothing. | The scanner is the working model for what a real integration looks like here: a swappable data-source function and a key that never reaches the browser. | — |

## Core entities

These exist as **TypeScript shapes over mock data**, not as tables. The shapes are the
useful part: they are what a schema would be derived from.

| Entity | Relationships | Notes |
|---|---|---|
| Client | Has one Engagement, many Tasks, many Rankings, one Risk profile | `src/lib/model.ts`, `src/lib/crm.ts`. Five demo records, all fictional. |
| Engagement | Belongs to a Client; drives every pipeline stage | `src/lib/engagements.ts`, `src/components/engagement/store.tsx`. The active engagement is the app's single most important piece of state; it persists in `localStorage` under `smos.engagement`. |
| Stage | Nine, ordered, each consuming the previous stage's outputs | `src/lib/stages.ts`. Slugs are routes; `tests/unit/routes.spec.ts` enforces that. |
| Diagnosis / root cause | Belongs to an Engagement; carries confidence and impact | `src/lib/data.ts`, `src/lib/recommendations.ts` |
| Score (Results, Opportunity, Difficulty, Priority) | Derived from inputs, carries its own breakdown | `src/lib/scoring.ts` — the one piece of real, tested business logic in the repository. `docs/SCORING.md`. |
| Task | Belongs to an Engagement, moves through the lifecycle Fix → Assign → Complete → QA → Deploy → Verify → Close | `src/lib/work.ts`, `src/components/tasks/*` |
| Agent (AI Workforce) | Orchestrator plus specialists, each owning a stage | `src/lib/agents.ts`, `src/lib/workforce.ts`, `docs/AGENTS.md`. Deploy state persists under `smos.agents.deployed`. |
| Integration | Catalogue entry with a mock connection state | `src/lib/integrations.ts`, 41 entries |
| Organization, User, Membership, Role, Audit log | **Exist in SQL, not in code.** `organizations`, `users`, `user_roles`, `activity_logs` in `supabase/migrations/202608300001_local_growth_os.sql`. | Six roles: `agency_admin`, `lead_seo`, `seo_strategist`, `content_outreach`, `client_viewer`, `client_editor`, the last two scoped to a `client_id`. AUTH-001 and ORG-001 now have a schema to contract against rather than a blank page. |
| Campaign (Local Growth OS) | Belongs to a Client and an Organization; has audits, roadmap initiatives, tasks, keywords, rank snapshots, citations, content, reviews, leads and monthly reports | `src/lib/local-growth/types.ts`, demo data in `demo-data.ts`. **This is a second client model alongside Client/Engagement above.** Nothing reconciles the two, and something eventually must. |
| Audit finding → Roadmap initiative → Task | A finding can create an initiative or a task while keeping the finding id as the relational source | The strongest idea in the Local Growth OS work: the chain from evidence to work is a foreign key, not a convention. Ranking is Impact × Confidence ÷ Effort. |

## Data ownership

| Entity | Owning org or user | Who creates | Who reads | Who edits | Who deletes | Who exports | Sensitive |
|---|---|---|---|---|---|---|---|
| Every entity above, in the running application | **Nobody.** There is no owner concept in code. | The build, as mock data | Anyone who can open the public URL | Anyone, in their own browser only | Anyone, by clearing their own browser storage | Client-side CSV only, from the campaign dashboard | No — all demo data, no real party's information |
| Every Local Growth OS entity, in the schema | The `organization_id` on the row | An agency member with a write role | Agency members of that organization; `client_viewer`/`client_editor` only for their own `client_id` | Agency members; client editors only on client-facing business, contact, request and file surfaces | Agency roles | Not yet designed | Will be, once real client data lands |

The first row is the clearest statement of where the product actually is. The second is what
the SQL says will be true. Nothing has closed the distance between them, and the register in
`docs/production/WORKFLOW-RISK-REGISTER.md` says ORG-001 must.

## Tenant model

**This section changed materially with the Local Growth OS merge, and it is the most
important change in it.** A tenant model has now been *designed*. It has not been *run*.

- **The design:** a shared Postgres database, every tenant-owned table carrying an
  `organization_id`, and Supabase Row Level Security policies enforcing scope **in the
  database** rather than in application code. Client-facing roles (`client_viewer`,
  `client_editor`) are additionally scoped to a single `client_id`. Storage follows the
  same shape: `client-assets/<organization_id>/<client_id>/<uuid>-<filename>`, with read and
  upload policies on the same scope. `supabase/migrations/202608300001_local_growth_os.sql`,
  with a preflight/finalize pair around the `clients` table's own policies.
- **This is the right shape.** RLS in the database is exactly what the earlier version of
  this section said to reach for and named the failure mode of not having: "a shared
  database with an `organizationId` column and no row-level policy".
- **How the current organization is resolved on the server:** it is not. There is no server
  and no session. The design assumes Supabase Auth; nothing implements it.
- **How every server side query is scoped to the tenant:** there are no server-side queries.
- **How tenant switching works today:** the client switcher
  (`src/components/engagement/store.tsx`) and the Local Growth OS campaign selectors change
  which mock record the UI renders. They are view filters, not security boundaries, and must
  never be mistaken for one.
- **Which records are global versus tenant owned:** in the schema, everything under an
  organization is tenant owned. In the running application, everything is global and public.
- **Whether row level security or an equivalent policy control exists:** **written, never
  executed.** No migration has been run in this repository, no seed applied, and no test
  exercises a single policy.

**The decision this section now records:** the tenant model is *decided in SQL and unproven
in fact*. That is a better position than undecided and a worse one than it looks, because a
policy nobody has run is a hypothesis that reads like a control. ORG-001 must therefore not
be a design exercise any more — it must be the contract that **executes** these migrations,
seeds two organizations, and proves with tests that organization A cannot read organization
B by altered id, by altered request body, or through storage. Until those tests exist and
run in CI, treat the tenant boundary as absent.

## Trust boundaries

| Boundary | What crosses it | Validation and authorization applied |
|---|---|---|
| Client to server | Nothing. There is no server, although the build no longer prevents one. | n/a |
| Server to database | Nothing yet. When it exists, the intended boundary is Supabase RLS: the database refuses cross-tenant reads rather than trusting the query. | Policies written in `supabase/migrations/`, **never executed or tested.** |
| Server to external provider | Nothing from the web app. From the CLI scanner: a search query and a RapidAPI bearer key. | Key read from a git-ignored `.env`; never bundled. |
| Webhook provider to server | Nothing. | n/a |
| Admin actions | None exist. | n/a |
| Background jobs | None exist. | n/a |
| File upload and download | Nothing. The file inputs in `evidence-panel.tsx` are affordances; no file is read, parsed, or sent. | n/a |
| **Build to browser** | The entire application and all of its data | This is the *only* boundary the product currently has, and it is one-way and total. `.github/scripts/check-client-bundle.sh out` runs in CI against `out/` and fails if a value from `.github/scripts/server-only-vars.txt` or a known secret pattern appears there. |

## Scaling assumptions

The web application is static files behind a CDN, so the interesting scaling numbers are all
about the backend that does not exist yet. These are the planning assumptions from
`PRODUCT_BRIEF.md` and `docs/BUILD_SPEC.md`, recorded as assumptions:

- Expected users at launch: a first paid beta of roughly 5–20 agencies, 1–5 seats each.
- Expected users in 12 months: **open decision** — depends on packaging, which is undecided.
- Expected records per tenant: 10–50 clients per agency; per client, hundreds of tracked
  keywords, thousands of GSC query rows per month, tens of tasks per month.
- Expected concurrent users: low tens. This is a weekday working tool, not a consumer app.
- Expected API volume: dominated by scheduled ingestion (GSC, GA4, GBP, rank data) rather
  than user requests. Ingestion is the load, not the UI.
- Largest exports: a full client brief plus 12 months of rankings and tasks as PDF/CSV.
- Most expensive queries: rank history and GSC query aggregation across a whole portfolio.
- Most expensive external calls: the LLM fan-out for AI-mention tracking and the Claude
  diagnosis and strategy generation. `docs/SOURCE_OF_TRUTH.md` fixes the model choices:
  Opus for diagnosis and strategy, Haiku for the high-volume mention judge.
- Maximum expected file storage: crawl exports and Lighthouse JSON, tens of MB per client.
- Peak events and seasonal demand: month-start reporting. Every agency wants last month's
  report in the same three days.

**The load-bearing assumption:** cost and load scale with *clients ingested*, not with users
logged in. Anything priced or provisioned per seat will be wrong.

## Performance strategy

Today, and honestly:

- The whole application is prerendered static HTML on a CDN. Route JS payloads run from
  ~96 kB to ~226 kB first load, the heaviest being the Recharts-bearing screens
  (`/tracker`, `/dashboards/local`, `/command`).
- Required indexes: none — no database.
- Pagination and query limits: none. Every list renders its whole mock array. This is the
  first thing that breaks with real portfolios and needs pagination before it meets one.
- Search strategy: the search inputs in the top bar and on `/clients` are **not wired to
  anything**. They are labelled and focusable but do not filter.
- Caching strategy: CDN caching of immutable static assets, nothing else.
- Background job strategy: none.
- Rate limits, timeout, retry and idempotency: nothing to apply them to. All four become
  mandatory in INTEGRATION-001, because the LLM fan-out and the data-provider calls are
  where cost, failure and duplication will actually live.

## Cost model

| Driver | Unit | Estimated cost at launch | Estimated cost at next stage | Alert threshold |
|---|---|---|---|---|
| Hosting | GitHub Pages | $0 | $0 while static; a server changes this | n/a |
| Database | — | $0 (none) | **Open decision** | — |
| File storage | — | $0 (none) | **Open decision** | — |
| AI and API calls | Per diagnosis, per mention-tracking run | $0 (none run) | The dominant cost. Driven by clients × tracked prompts × frequency, not by seats. | **Must be set before the first agent run.** An unmetered LLM fan-out across a portfolio is the most plausible way this product loses money. |
| Third party data | Rank and SERP data per keyword per check | $0 | Second largest driver. `docs/SOURCE_OF_TRUTH.md` records a scrape-first decision for gated data and free official APIs for owned client data, specifically to hold this down. | **Open decision** |
| Search, email, SMS, jobs, observability | — | $0 (none) | **Open decision** | — |

Per user and per tenant cost: currently $0, because nothing runs. The number that will
matter is **cost per diagnosis** and **cost per client per month**, not cost per user.
`PRODUCT_BRIEF.md` lists cost per diagnosis as a success metric for exactly this reason.

## Reliability strategy

- **Dependency failure behavior:** the only runtime dependency is the CDN. If GitHub Pages
  is down the site is down; there is nothing to degrade gracefully. Google Fonts is a build
  time dependency, so a fonts outage fails the build rather than the site.
- **Backup frequency:** the git repository is the only state, and it is the backup. There is
  no user data to lose. See `docs/runbooks/backup-restore.md`.
- **Restore objective:** re-run the deploy workflow, minutes.
- **Recovery objective:** no data loss is possible, because no data is stored.
- **Deployment strategy:** push to the repository default branch → build with
  `GITHUB_PAGES=true` → publish `out/` to Pages. One environment, no staging.
- **Rollback strategy:** re-run the Pages deployment for the previous commit, or revert and
  push. See `docs/runbooks/rollback.md`.
- **Monitoring and alerting:** **none.** This is a real gap even for a static site, and it is
  listed in `PRODUCTION_READINESS.md`.

## Decisions taken in this verification pass

These are architecture-adjacent decisions made while installing the delivery standard, and
they are recorded here rather than left implicit.

| Decision | Reason |
|---|---|
| `npm run start` is `next start`; `npm run start:export` serves `out/` via `scripts/serve-export.mjs` | Both builds now exist and each needs its own command. `next start` cannot run against an export build, which is what the export server is for — and it takes a `--base-path` so it reproduces how Pages serves the `/seo-manager-os` prefix. |
| The Playwright suites run against the **server** build, not the Pages export | It is the build a normal deployment serves, and it needs no basePath juggling. The Pages artifact is verified separately by pointing `TEST_BASE_URL` at the deployed URL, which is the only way to catch a basePath regression anyway. |
| The delivery standard's integration, migration and authorization CI jobs are **absent**, not present and skipping | A job that cannot run is not a passing job. `.github/workflows/README.md` records what each one is waiting for. |
| `tests/integration/tenant-isolation.spec.ts` and `tests/fixtures/seed.ts` are kept but excluded from `tsconfig.json` and every CI job | They are the standard's originals, held for the backend. They are not coverage and are labelled as such in `tests/integration/README.md`. |
| Prettier and `format:check` are **not** adopted | Adopting a formatter mid-verification would reformat the whole codebase inside a change whose job was to prove the application works. ESLint is the enforced style gate. Adopt Prettier deliberately, in its own commit. |
| Colour contrast is ratcheted rather than fixed | The palette in `src/app/globals.css` is approved product design. Rewriting 82 colour decisions is a design change and belongs to the owner, not to a verification pass. The baseline can go down and never up. |
| Next.js stays on 14.2.35 | The five remaining high-severity advisories all require Next.js 16, a major upgrade. Every one concerns a server-side feature that a static export does not have. Assessed in `docs/audits/security-audit.md`; the upgrade is the owner's call. |

## Decision log

| Date | Decision | Reason | Owner | Superseded by |
|---|---|---|---|---|
| 2026-06-18 | Scope is local SEO only for now; SaaS and Enterprise dashboards parked | Focus the product on local-services agencies | Product | — |
| 2026-06-18 | Scores must be grounded and traceable — no invented numbers | A black-box score cannot be explained to a client | Product | — |
| 2026-06-18 | No auto-publishing; every agent output is a draft | The tool advises and plans; publishing is not the value and carries the risk | Product | — |
| 2026-06-18 | Data export over multi-seat team management | Clients want the artifact, not a login | Product | — |
| 2026-06-18 | Client-facing read-only sharing of brief, stages and results, not a login system | Smallest thing that gets the work in front of the end client | Product | — |
| 2026-06-18 | Scrape-first for gated data; free official APIs for owned client data | Holds third-party data cost down | Product | — |
| 2026-06-18 | AI generation is Claude; Opus for diagnosis and strategy, Haiku for the mention judge | Quality where it is read, cost control where it is high volume | Product | — |
| 2026-06-18 | The Orchestrator is the central engineering risk and where the effort goes | Handoff quality between specialists is what makes the output read as one senior team | Engineering | — |
| 2026-08-30 | Local Growth OS added as a second product surface at `/growth` — multi-tenant local campaign management and client reporting for U.S. home-service businesses | The local-services scope decision, built out as an operating layer rather than more investigation screens | Product | — |
| 2026-08-30 | Supabase Postgres with Row Level Security chosen as the data layer; schema, policies, storage model and seed written | Puts the tenant boundary in the database rather than in application code | Engineering | — |
| 2026-08-30 | `output: "export"` narrowed to `GITHUB_PAGES=true` only; every other build is a Next.js server build | Unblocks Server Actions, Route Handlers, OAuth callbacks and Supabase sessions without giving up the credential-free Pages demo | Engineering | — |
| 2026-08-30 | AI output is draft-only, must retain source data, must label assumptions, and must never fabricate credentials, service areas, pricing, reviews, rankings or results | Extends the earlier no-auto-publishing decision into a checkable rule (`src/lib/local-growth/ai-guardrails.ts`) | Product | — |
| 2026-08-30 | Data providers sit behind a typed `Connector<T>` adapter with an explicit `mock` / `live` mode; an unavailable source is shown as unavailable rather than filled in | "Never hide an unavailable source by manufacturing data" — grounded scoring, applied to ingestion | Engineering | — |
| 2026-09-02 | Install the delivery standard and adapt its CI to this stack | The application had no tests and no CI | Engineering | — |
| 2026-09-02 | ORG-001 must **execute and test** the existing RLS policies, not design them | The design landed on 2026-08-30. What is missing is proof, and an unrun policy reads like a control. | Engineering | — |
