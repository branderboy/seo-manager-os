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

## Not done / open questions

- Everything backend (auth, DB, jobs, real integrations) — see `BUILD_SPEC.md` roadmap.
- Pre-existing `yelp` entry in `integrations.ts` left as-is (predates this work).
- No tests, no CI for the app itself.
- Pricing/packaging, who the buyer is inside an agency, and competitive positioning are
  undecided (see the agency-fit notes the team discussed).

## Branch / PR

- Work branch: `claude/hopeful-ptolemy-9typjl`. PR #7 (Tracker + spec docs).
