# SEO Manager OS — Source of Truth

> Canonical project state. Update this when decisions change. If this doc and the code
> disagree, the code wins — fix this doc. Companion docs: `docs/BUILD_SPEC.md` (how to make
> it real) and `docs/RESUME_PROMPT.md` (paste to brief an AI assistant).

_Last updated: 2026-06-18_

---

## What this is

An **SEO investigation → diagnosis → strategy → execution → measurement operating system**
for ad agencies running local / SaaS / enterprise SEO. It behaves like a senior SEO
strategist, not a dashboard — the organizing question is *"why is this business not winning
in search?"*

## Current status (be honest)

- **Front-end: ~100% built and functional.** Real interactive client state with
  `localStorage` persistence across ~18 components (engagement switching, task board, brief
  versioning/approval/share, discovery wizard, tour, integration toggles).
- **Backend: 0%.** No server, database, auth, or live integrations. Every number is mock data
  in `src/lib/*.ts`. Clearing browser storage resets everything.
- **Data is designed-in, not missing.** Discovery (`/discovery`) captures the client's data
  sources/assets (GBP, GA4, Search Console, CRM) and Data Collection (`/research`) syncs them.
  The gap is *wiring to live sources*, not a missing data model.
- As a **demo/prototype: ~95% done.** As a **shippable product: ~10–15% done** (the UI is the
  smaller half of the work; the data engine is unbuilt).

## Stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind · Recharts · lucide-react.
No backend. Scripts: `npm run dev | build | lint | typecheck`.

## The product: 9 pipeline stages + dashboards + tracker

| # | Stage | Route | Produces |
|---|---|---|---|
| 1 | Discovery Interview | `/discovery` | Goals, services, locations, competitors, model classification |
| 2 | Data Collection | `/research` | GSC, GA4, GBP, crawl, rankings |
| 3 | Intent Mapping | `/intent` | TOF/MOF/BOF intent, goal alignment |
| 4 | Competitive Insights | `/competitors` | Share of voice, SERP features, gaps, AI answer coverage |
| 5 | Diagnosis | `/diagnosis` | Root causes w/ confidence + impact |
| 6 | Playbooks | `/tools` | Outcome playbooks (traffic, CTR, leads, local, GEO, AEO) |
| 7 | Project Brief | `/strategy` | Exec-ready strategy + roadmap |
| 8 | Daily Task Engine | `/tasks` | Today's owned worklist + alerts |
| 9 | Reports | `/reports` | Rankings, traffic, leads, AI visibility, revenue vs goals |

Plus: model dashboards (`/dashboards/{local,saas,enterprise}`), `/clients`, `/workflow`,
`/integrations`, `/settings`, and the **Tracker** (`/tracker`) added this session.

## Key files

- `src/lib/data.ts` — stage mock data (scores, diagnosis, strategy, playbooks, tasks).
- `src/lib/dashboards.ts` — dashboard mock data.
- `src/lib/tracker.ts` — Tracker mock data (rankings + AI mentions).
- `src/lib/stages.ts` — stage/dashboard definitions.
- `src/lib/integrations.ts` — integration catalog (mock connection states).
- `src/app/(os)/` — the app shell + every stage/dashboard page.
- `scripts/prospect-scanner/` — the one **real** integration: a Node CLI hitting a live API
  (JSearch/RapidAPI) with a swappable data-source function. The model for going real.

## Decisions locked this session

1. **Tracker added** (`/tracker`) — two tabs: Search Rankings (keyword positions, movement,
   SERP features, position distribution) and AI Mentions (per-assistant mention rate, share
   of voice, tracked-prompt results). Wired into sidebar + mobile nav. Mock data for now.
2. **Integrations catalog** gained Rank Tracker + AI Answer Tracker entries.
3. **Scrape-first** for gated/expensive data (SERPs, Google AI Overviews, competitor Google
   reviews, deep Yelp review text). Owned client data stays on free official APIs.
4. **Yelp = free Yelp Fusion API** for ratings/counts/business data (client + competitors) +
   **scrape** Yelp profiles only for full review text/velocity/sentiment (Fusion caps at 3
   truncated excerpts).
5. **LLM-mention tracking = build a multi-LLM fan-out** (OpenAI/Anthropic/Gemini/Perplexity
   APIs + scrape Google AI Overviews) + a **Claude LLM-judge** to extract cited/mentioned/
   absent + sentiment + competitor share. Buy alternative noted (Profound/Peec/Otterly/Scrunch).
6. **AI generation = Claude.** Opus 4.8 for diagnosis/strategy/task generation; Haiku 4.5 for
   the high-volume mention judge. Structured outputs to the existing TS shapes. Prompts in
   `docs/BUILD_SPEC.md` §6.

## v2 direction

The canonical v2 architecture lives in **`docs/ARCHITECTURE_V2.md`** — read it for the full
vision. Headlines: keep the Clients → Workflow (9 stages) → Tracker → Agent Store foundation;
make every stage generate deliverables that auto-feed the next; Tracker becomes the project
command center; Agent Store is internally the **AI Workforce** (Orchestrator + ~15 specialists,
each owning a stage). New surfaces to build: **Command Center** (homepage), **Workflow
Dependencies** (visual), **Risk Center** (replaces Health Score), **Wins Feed**, **Deployment
Verification**. **Scope resolved: SEO Operations Platform** — one engine, playbooks vary by
client type (Local/Ecom/SaaS/Enterprise/Migration/AI Search). The earlier "local-only" scoping
is superseded.

## Product direction (updated 2026-06-18, from review)

These supersede earlier framing where they conflict.

1. **Scope: Local SEO only for now.** Park the SaaS and Enterprise dashboards; focus the
   product on local-services agencies. Don't go deep on enterprise-scale features yet.
2. **Real, client-specific intelligence.** The diagnosis and strategy must be generated from
   the client's actual data — not the canned Northwind example. This is the priority to
   improve (Claude generation grounded in collected evidence; see `BUILD_SPEC.md` §6).
3. **Grounded scores — no invented numbers.** Scores must derive from real signals:
   **valid results, opportunity, and difficulty.** Define and document the formula; every
   score must be traceable to its inputs. No black-box "48".
4. **Client-facing sharing.** Let the agency share the **project brief, the project stages,
   and the results** with the end client (read-only/branded share, not a full login system).
5. **Data export over team management.** Multi-seat auth/roles/approvals are *not* a priority.
   What's needed is straightforward **data export** (CSV/PDF) of briefs, tasks, and results.
6. **Multi-agent section (new).** Add a place where the agency can **activate and deploy
   agents** for its repetitive work (e.g. recurring audits, review-response drafting, report
   generation). A library of agents the agency turns on per client.
7. **No auto-publishing.** The tool **advises and plans**; it does not publish GBP posts,
   push live content, etc. Drop "execution actually does things" — that's useless work here.
8. **Close the measurement loop (valuable).** Tie work → metric movement → before/after proof.
   Show whether a fix actually moved rankings/traffic. This is worth building.
9. **AI-visibility tracking is not the headline.** It's early and it's just another traffic
   source. Keep the Tracker, but the product is about **showing up and routing more traffic**,
   not "winning AI." Don't over-invest in the AI-mention side.

## Built this session (beyond the prototype)

- **Tracker** (`/tracker`) — rankings + AI-mention monitoring (mock data).
- **Agent Store** (`/agents`) — Orchestrator + 8 specialist agents, deployable here or inline
  from each pipeline stage's header (shared deploy state in `deploy-store.ts`). See
  `docs/AGENTS.md`. Files: `src/lib/agents.ts`, `src/components/agents/*`.
- **Scoring model** — `src/lib/scoring.ts` implements grounded Results / Opportunity /
  Difficulty / Priority with traceable inputs (the Opportunity Scoring Agent uses it). See
  `docs/SCORING.md`. Note: the UI's `coreScores` still read mock numbers — wiring them to
  `scoring.ts` is a follow-up.
- **BUILD_SPEC scoped to Local SEO** (SaaS/Enterprise removed).

### Engineering focus (agreed)

The **Orchestrator is the magic and the risk** — sequencing the 8 agents and passing each
one's output cleanly into the next is where engagement quality lives or dies. That is where the
real engineering goes; the specialists are comparatively simple (prompt + stage inputs). Build
the Orchestrator well or the product is just a dashboard with a chatbot. See `docs/AGENTS.md`.

## Not done / open questions

- Everything backend (auth, DB, jobs, real integrations) — see `BUILD_SPEC.md` roadmap.
- Pre-existing `yelp` entry in `integrations.ts` left as-is (predates this work).
- No tests, no CI for the app itself.
- Pricing/packaging, who the buyer is inside an agency, and competitive positioning are
  undecided (see the agency-fit notes the team discussed).

## Branch / PR

- Work branch: `claude/hopeful-ptolemy-9typjl`. PR #7 (Tracker + spec docs).
