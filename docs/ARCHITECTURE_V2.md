# SEO Manager OS — v2 Architecture

> Canonical product direction for v2. The current prototype is the foundation; this doc
> defines what v2 adds and changes. Companion docs: `SOURCE_OF_TRUTH.md` (current state),
> `BUILD_SPEC.md` (how to make it real), `AGENTS.md`, `SCORING.md`.

## Vision

SEO Manager OS is not another SEO tool. It is the **operating system SEO Managers use to run
every client** from onboarding through execution, deployment, reporting, and continuous
optimization — replacing the disconnected workflow spread across Semrush, Screaming Frog,
Search Console, GA, Google Docs, Notion, ClickUp, Slack, Looker, Sheets, Lighthouse, and AI
chatbots. Work begins, moves, and finishes in one place.

---

## Foundation (keep — already strong)

### Workspace
- **Clients** — client database: business profile, goals, contacts, locations, competitors,
  CMS, hosting, Search Console, Analytics, current rankings, brand voice, priorities, team
  assignments, notes, documents. Every workflow begins here.
- **Workflow** — the heart of the OS. Stages never feel like isolated pages; each produces
  **structured outputs that automatically feed the next stage**. No copy/paste.
- **Tracker** — becomes the **project command center**: active / completed / waiting-on
  (client, developer, content, Google) tasks, AI jobs running, deadlines, blockers. Every
  recommendation becomes work.
- **Agent Store** — internally the **AI Workforce**. Not a chatbot — a team of specialists
  coordinated by the Orchestrator. Each agent owns a stage.

### Pipeline (do NOT reorder — make each stage generate deliverables)
```
Discovery Interview → Data Collection → Intent Mapping → Competitive Insights
  → Diagnosis → Playbooks → Project Brief → Daily Task Engine → Reports
```

---

## Stage deliverables (v2)

- **Discovery Interview** — AI interviews the client (business, revenue drivers, ICP, service
  priorities, geo targets, seasonality, existing marketing, current SEO, competitors, USP,
  brand voice, success metrics). → generates **Client Profile, Discovery Summary, Project Goals**.
- **Data Collection** — auto-connect Search Console, GA4, PageSpeed, Lighthouse, DataForSEO,
  GBP, crawler, sitemap, robots, schema. Everything needed before analysis.
- **Intent Mapping** — organize keywords by intent (informational / commercial / transactional
  / navigational / local), cluster automatically, map to existing pages, identify gaps.
- **Competitive Insights** — compare content, authority, backlinks, entities, internal links,
  technical SEO, local visibility, SERP ownership → competitive opportunities.
- **Diagnosis** — **priorities, not hundreds of issues.** Priority 1/2/3. Every issue carries
  Business Impact, SEO Impact, Difficulty, Estimated Hours, Revenue Potential, Assigned Owner,
  Dependencies, Status. Answers "what do we fix first?"
- **Playbooks** — execution plans (Technical Cleanup, Local SEO, Site Migration, Content
  Expansion, Internal Linking, Core Web Vitals, AI Search Optimization, Programmatic SEO).
  Every playbook **auto-creates tasks**.
- **Project Brief** — auto-assemble objectives, deliverables, requirements, assigned team,
  timeline, dependencies, KPIs, success metrics. The project's source of truth.
- **Daily Task Engine** — every recommendation becomes work with a lifecycle:
  `Fix → Assign → Complete → QA → Deploy → Verify → Close`. Priority, owner, due date,
  dependencies, status, time estimates, blockers.
- **Reports** — **manager reporting, not ranking reports**: completed work, blocked work,
  pending approvals, deployment history, AI work completed, traffic changes, revenue
  opportunities, hours spent, estimated ROI, executive summary.

---

## AI Workforce — suggested specialists

Orchestrator coordinates; each owns a stage: Discovery Specialist · Research Analyst ·
Technical Auditor · Intent Mapper · Competitive Analyst · Diagnosis Specialist · Strategy
Planner · Playbook Builder · Project Brief Generator · Content Strategist · Local SEO
Specialist · Schema Engineer · Internal Linking Specialist · QA Inspector · Reporting
Specialist.

---

## New surfaces (missing today)

### Command Center (new homepage)
Answers "what do I need to do today?": Active Clients, Tasks Today, AI Jobs Running, Blocked
Tasks, Deployments, Client Approvals, Indexing Queue, Traffic Changes, Revenue Opportunities,
Upcoming Deadlines, Morning Brief.

### Workflow Dependencies
Every task knows what comes next; show it visually:
`Keyword Research → Intent Mapping → Content Brief → Content Written → Review → Approval →
Published → Indexed → Ranking → Optimization → Refresh`.

### Risk Center (replaces Health Score)
Per-project **business risk score** across: Traffic, Revenue, Technical, Local, AI Search,
Content, Authority, Indexation risk.

### Wins Feed
Daily momentum: "Google indexed 12 pages", "Rank #2 for emergency plumber", "Schema
validated", "CWV improved", "Developer completed deployment", "Client approved content",
"New review received".

### Deployment Verification
After every deployment, auto-verify: re-crawl, indexation, schema, internal links, Core Web
Vitals, redirects, canonical, robots, screenshots, validation — then **auto-close the task**.

---

## Integrations expected

Search Console · Google Analytics · PageSpeed · Lighthouse · DataForSEO · OpenAI · Claude ·
CSV Import · PDF Export · White Label · Teams · Recurring Audits · API Access · Webhook Support.

---

## Reconciliation with the current build

| v2 element | Status today | Gap |
|---|---|---|
| Clients | ✅ exists (mock) | Add full profile fields, documents |
| Workflow (9 stages) | ✅ exists | Auto-handoff outputs → next stage (partial via handoff-store) |
| Tracker | ✅ exists (rankings + AI mentions) | Reframe as project command center (task statuses, waiting-on, blockers, AI jobs) |
| Agent Store / AI Workforce | ✅ exists (Orchestrator + 8) | Expand roster to the 15 specialists; agent-owns-stage |
| Diagnosis | ✅ exists (confidence/impact) | Add Priority 1/2/3 + hours, revenue, owner, deps, status (wire to `scoring.ts`) |
| Playbooks | ✅ exists | Each playbook auto-creates tasks |
| Project Brief | ✅ exists | Auto-assemble from diagnosis + brief fields |
| Daily Task Engine | ✅ exists | Full lifecycle (Fix→…→Close), blockers, deps |
| Reports | ✅ exists | Shift to manager reporting (work/ROI/approvals), not rankings |
| Scoring model | ✅ built (`src/lib/scoring.ts`) | Feeds Diagnosis priorities + Risk Center |
| **Command Center** | ❌ missing | New homepage |
| **Workflow Dependencies** | ❌ missing | Visual dependency flow |
| **Risk Center** | ❌ missing | Replace Clients "health score" |
| **Wins Feed** | ❌ missing | New |
| **Deployment Verification** | ❌ missing | Needs backend (crawl/verify) |
| Integrations (PageSpeed, Lighthouse, DataForSEO, OpenAI, white-label, teams, API, webhooks) | partial (mock catalog) | Expand + make real |

### Open decision — scope
Earlier we locked **"Local SEO only"** and removed the SaaS/Enterprise dashboards. v2's vision
(Site Migration, Programmatic SEO, Core Web Vitals, AI Search) is broader than pure local.
**Decision needed:** is v2 *local-first* (these are advanced local plays) or *general SEO*?
This affects Discovery, Playbooks, and the specialist roster.

### Suggested build order (UI-first on mock data, backend where noted)
1. **Command Center** homepage — highest daily value, answers "what do I do today".
2. **Diagnosis v2** — Priority 1/2/3 with impact/hours/revenue/owner/deps, wired to the
   existing `scoring.ts`. High leverage, code already exists.
3. **Daily Task lifecycle + Tracker-as-command-center** — task states, blockers, waiting-on.
4. **Risk Center** — replace the Clients health score.
5. **Wins Feed** + **Workflow Dependencies** visualization.
6. **Deployment Verification** + real integrations (needs the backend from `BUILD_SPEC.md`).
