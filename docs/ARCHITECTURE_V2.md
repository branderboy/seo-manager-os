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

### Scope — resolved: SEO Operations Platform (not "local")

SEO Manager OS is **not a Local SEO tool** — it is an **SEO Operations Platform** that supports
any SEO workflow an agency runs: Local, National, Ecommerce, Enterprise, AI Search, Technical,
Programmatic, Site Migrations, Content SEO.

**The engine stays the same** — Discovery → Research → Diagnosis → Strategy → Execution →
Reporting. Only the **playbooks, specialists, and recommendations** change by client type:

| Client type | Playbooks |
|---|---|
| Local business | GBP, citations, location pages, reviews |
| Ecommerce | collections, products, faceted navigation |
| SaaS | topical authority, product-led content |
| Enterprise | governance, multiple stakeholders, workflows |
| Migration | redirects, validation, deployment |
| AI Search | entities, structured data, answer optimization |

Don't think "local vs general." Think **one operating system with specialized playbooks.**
(The earlier "local-only" scoping is superseded. The removed model-specific dashboards were the
old paradigm; v2 converges on one adaptive client view + playbooks, not three dashboards.)

### Build order (3 phases)

**Phase 1 — make it feel like software people use every day**
1. **Command Center** (the homepage)
2. **Diagnosis v2** (business impact, owner, hours, dependencies — wired to `scoring.ts`)
3. **Daily Task Engine + Tracker**
4. **Workflow Dependencies**

**Phase 2 — manager intelligence**
5. Risk Center · 6. Wins Feed · 7. Expanded AI Workforce · 8. Morning Briefing

**Phase 3 — operations**
9. Deployment Verification · 10. Search Console · 11. Analytics · 12. Lighthouse ·
13. DataForSEO · 14. Other integrations

### Command Center — the rule
It is **not SEO-focused.** It answers one question: **"What does the SEO Manager need to do
today?"** Everything on it serves that — clients needing attention, AI jobs running, priority
tasks, blockers, pending approvals, deployments, new opportunities, wins since yesterday.
