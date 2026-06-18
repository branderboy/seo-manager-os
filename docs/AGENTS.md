# Agent Store

The agency's working agents. One **Orchestrator** runs the engagement and delegates; eight
specialists do the work and report back. Deploy them from the **Agent Store** (`/agents`) or
inline from each pipeline stage's header. Deploy state is shared (localStorage) across both.

Data: `src/lib/agents.ts` · UI: `src/components/agents/` · State: `deploy-store.ts`.

## The Orchestrator — the core (and the risk)

The Orchestrator is the magic *and* the risk of this system. It sequences the eight
specialists and passes each one's output cleanly into the next — research into the audit, the
diagnosis into scoring, scored opportunities into execution. Those handoffs are where
engagement quality lives or dies: if the Orchestrator passes context cleanly, the output reads
like a coordinated senior team; if it doesn't, you get eight disconnected tools.

**This is where the real engineering should go.** The specialists are comparatively
straightforward (a prompt + the stage's inputs). The hard, high-value work is the Orchestrator:
state passed between agents, ordering and dependencies, retries/validation between steps, and
keeping the whole run coherent. Build the Orchestrator well and the product is differentiated;
treat it as glue and the product is a dashboard with a chatbot.

## Workflow

```
Client Interview → Research → Audit → Diagnosis → Strategy
  → Prioritized Opportunities → Execution → Reporting
```

## The 8 specialists

| # | Agent | Owns (stage) | Output | Deploys from |
|---|---|---|---|---|
| 1 | **Intake** | Client Interview | Engagement profile + SEO-type classification (Local/SaaS/Enterprise/AEO-GEO) | `/discovery` |
| 2 | **Research** | Research | Keywords, competitor set, intent map, content gaps | `/research`, `/intent`, `/competitors` |
| 3 | **Technical SEO** | Audit | Technical audit + prioritized fixes (crawl, index, speed, schema, links) | `/diagnosis` |
| 4 | **Content Strategy** | Strategy | Page plan + content briefs (service/location/blog/landing/comparison) | `/strategy`, `/tools` |
| 5 | **Local SEO** | Strategy | Local action plan (GBP, reviews, categories, service areas, citations) | `/tools`, `/dashboards/local` |
| 6 | **AEO/GEO** | Strategy | AI-answer optimization plan + tracked-prompt set | `/tools`, `/tracker` |
| 7 | **Opportunity Scoring** | Prioritized Opportunities | Priority-ranked list with traceable scores (uses `src/lib/scoring.ts`) | `/diagnosis` |
| 8 | **Execution** | Execution | Drafts: briefs, copy, schema, internal-link plan, tasks, reports | `/tasks` |

> **No auto-publishing.** Every agent output is a draft, plan, or recommendation — agents
> never push live content (no GBP posting, etc.).

## Stage ↔ agent map

Defined in `stageAgents` (`src/lib/agents.ts`); drives the deploy chips in each stage header
via `StageAgents` in `PageHeader`.

| Stage (route) | Agents |
|---|---|
| `/discovery` | Intake |
| `/research` · `/intent` · `/competitors` | Research |
| `/diagnosis` | Technical SEO, Opportunity Scoring |
| `/tools` (Playbooks) | Content Strategy, Local SEO, AEO/GEO |
| `/strategy` | Content Strategy |
| `/tasks` | Execution |
| `/reports` | Execution |

## Ratings shown in the store

- **Impact (effectiveness)** — real ROI for the agency.
- **Shine** — demo "wow" / shiny-object pull (Opportunity Scoring and AEO/GEO rate highest).
- **Cadence** — how often it runs (on demand / daily / weekly / monthly).

## Build note

The Agent Store is a deploy/activate surface over seed data today. Wiring an agent to *do* its
work means a worker that runs the agent's Claude prompt (see `BUILD_SPEC.md` §6) on the stage's
collected inputs and writes its output back — the Orchestrator sequences them per the workflow.
