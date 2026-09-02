# Product Brief

Pillar 1 of `WORLD_CLASS_APP_THESIS.md`. Write this before major implementation and keep it
current. A feature without a line in here is a feature nobody has justified.

- Product owner: the repository owner (`branderboy`). **Open:** the accountable human's
  name is not recorded anywhere in this repository. Record it here before this brief is
  used to approve a contract, because the standard's release gate names a person, not an
  account.
- Last updated: 2026-09-02

Sources: `docs/SOURCE_OF_TRUTH.md` (the confirmed project decisions, dated 2026-06-18),
`docs/ARCHITECTURE_V2.md`, `docs/BUILD_SPEC.md`, and the code itself. Where this file and
`docs/SOURCE_OF_TRUTH.md` disagree about a product decision, that file wins and this one is
wrong and should be corrected.

## Target user

The **SEO lead at a small local-services marketing agency** — the person who has to answer
"why is this client not winning in search?" for eight to twenty local-services clients
(HVAC, plumbing, roofing, dental, legal) at once, and then show the client that the work
they paid for moved something.

Not the client. Not an enterprise in-house SEO team. Not a solo consultant with one site.
`docs/SOURCE_OF_TRUTH.md` records the scope decision plainly: **local SEO only for now**;
the SaaS and Enterprise dashboards are parked.

**Open:** who inside the agency actually signs the invoice — the owner, or the SEO lead —
is undecided, and it decides pricing and packaging. Recorded as undecided in
`docs/SOURCE_OF_TRUTH.md` and still undecided.

## Painful current workflow

Today that person works out of a stack of disconnected tools: a rank tracker, Google
Search Console, GA4, a GBP dashboard, a crawler, a spreadsheet of citations, and a
document template for the monthly report. Each one answers a narrow question. None of them
answers the only question that matters before recommending work, which is *why* the client
is losing.

So the diagnosis happens in the SEO lead's head, is re-derived from scratch for every
client, and is not written down anywhere the next person can check. Reporting is a monthly
scramble to reassemble numbers from five tools into a deck that argues the retainer was
worth it. When a client asks "did that fix work?", the honest answer is usually a
judgement call rather than a before-and-after.

The alternatives they use instead of this product are Semrush or Ahrefs plus a rank
tracker plus AgencyAnalytics or Looker Studio, plus a manually maintained diagnosis they
carry in their head.

## Core value proposition

**A written, evidence-backed diagnosis per client, and proof that the work moved the
metric.**

Most SEO tools go Data → Charts → Reports. This one runs a continuous operating loop —
discovery, data collection, intent, competitors, diagnosis, playbooks, brief, tasks,
reports — so that every recommendation traces back to a root cause, every task traces back
to a recommendation, and every report traces back to a task. That chain is the product.

## Primary job to be done

When a local-services client's leads have gone flat and the agency has to decide what to do
next month, the SEO lead wants to produce a defensible root-cause diagnosis and a
prioritised plan from that client's own data, so they can commit the retainer to the work
most likely to move leads and prove afterwards that it did.

## V1 scope

The smallest set of workflows that creates the core value. Local clients only.

| Workflow | User outcome | Why it is in V1 |
|---|---|---|
| Discovery interview (`/discovery`) | The engagement is classified and the client's goals, services, locations, competitors and data sources are captured once | Everything downstream is derived from it. Without it every other stage is guessing. |
| Data collection (`/research`) | The client's own GSC, GA4, GBP and rankings data is connected or uploaded | "Real, client-specific intelligence" is the confirmed priority. A diagnosis from canned data is worthless. |
| Diagnosis (`/diagnosis`) | Ranked root causes with confidence and impact, each traceable to the evidence behind it | The core value. The single most important screen in the product. |
| Grounded scoring (`src/lib/scoring.ts`) | Every score derives from valid results, opportunity and difficulty, and can be opened up and audited | A confirmed decision: no invented numbers, no black-box "48". |
| Project brief (`/strategy`) | An executive-ready plan the agency can put in front of the client | It is what the agency sells. |
| Daily task engine (`/tasks`) | Today's owned worklist, derived from the plan | It converts a plan into work that actually happens. |
| Reports (`/reports`) | Rankings, traffic and leads against goals, tied back to the work that was done | Closing the measurement loop is what makes the retainer defensible. |
| Client-facing sharing | The agency shares the brief, the stages and the results read-only with the end client | A confirmed decision, and the moment the product is visible to the agency's customer. |
| Data export (CSV/PDF) | Briefs, tasks and results leave the product in a form a client will accept | A confirmed priority, explicitly ahead of team management. |

## Explicit non goals

Recorded as decisions in `docs/SOURCE_OF_TRUTH.md`, not as omissions:

- **Auto-publishing anything.** The product advises and plans. It does not post to GBP, push
  live content, or change a client's site. Every agent output is a draft.
- **Multi-seat auth, roles and approval chains.** Not a priority. Data export matters more.
- **SaaS and Enterprise SEO as V1 markets.** Both dashboards exist and are parked.
- **Winning at AI visibility as the headline.** The Tracker keeps AI-mention monitoring, but
  the product is about showing up and routing traffic. Do not over-invest here.
- **Being a rank tracker or a crawler.** It consumes those; it does not compete with them.
- **Enterprise-scale features** — crawl budget, template performance at hundreds of
  thousands of URLs, internal link graphs.

## Success metrics

None of these are instrumented today. The application has no analytics, no error tracking
and no server, so every baseline below is genuinely unmeasured rather than zero.

| Metric | Definition | Baseline | Target | Measured where |
|---|---|---|---|---|
| Diagnosis completion | Share of connected clients with a diagnosis generated from their own data in the last 30 days | Not measured — no instrumentation exists | **Open decision** | Not yet instrumented. Needs the backend in `docs/BUILD_SPEC.md`. |
| Time to first diagnosis | Median hours from creating a client to a diagnosis the SEO lead accepts | Not measured | **Open decision** | As above |
| Plan-to-work conversion | Share of brief recommendations that become tasks and reach Closed | Not measured | **Open decision** | As above |
| Proven wins | Share of completed tasks with a before-and-after metric movement recorded | Not measured | **Open decision** | Requires the measurement loop, which is unbuilt |
| Weekly active agencies | Distinct agencies with a session in a week | Not measured | **Open decision** | As above |
| Cost per diagnosis | Model and data-provider spend divided by diagnoses produced | Not measured | **Open decision** | Requires the AI Workforce to actually run |
| Retention | Agencies still active 90 days after first diagnosis | Not measured | **Open decision** | As above |

**Open:** every target in this table is a business decision, not something that can be read
out of the repository. Set them before the first paid beta, or the readiness review has
nothing to measure against.

## Capability register

Every major capability needs all seven columns filled before it gets a contract.

| Capability | User problem | Target user | User outcome | Success metric | Non goal | Decision owner |
|---|---|---|---|---|---|---|
| Discovery interview | The same intake questions get re-asked and re-lost per client | Agency SEO lead | One structured client profile that drives every later stage | Time to first diagnosis | Not a CRM | Product owner |
| Client data connection | Client data lives in five tools the agency logs into separately | Agency SEO lead | The client's own GSC, GA4, GBP and rankings in one place | Diagnosis completion | Not a replacement for those tools | Product owner |
| Diagnosis engine | The root cause lives in one person's head | Agency SEO lead | Ranked, written root causes with confidence and impact | Diagnosis completion | Not an automatic fixer | Product owner |
| Grounded scoring | Scores in other tools are unexplainable to a client | Agency SEO lead | Every score opens up into the inputs that produced it | Proven wins | Not a proprietary "authority score" | Product owner |
| Project brief and sharing | The monthly deck is rebuilt by hand | Agency SEO lead, then the end client | An executive brief the client can be given read-only | Plan-to-work conversion | Not a client login system | Product owner |
| Daily task engine | Plans do not survive contact with the week | Agency SEO lead and delivery staff | Today's owned worklist with a lifecycle | Plan-to-work conversion | Not a general project manager | Product owner |
| Measurement loop | Nobody can prove the retainer worked | Agency SEO lead, then the end client | Work tied to metric movement, before and after | Proven wins | Not attribution modelling | Product owner |
| AI Workforce | Specialist analysis does not scale across twenty clients | Agency SEO lead | Sequenced specialist agents producing drafts a human approves | Cost per diagnosis | Never publishes anything | Product owner |
| Data export | Clients want the artifact, not a login | Agency SEO lead | CSV and PDF of briefs, tasks and results | Plan-to-work conversion | Not a white-label portal in V1 | Product owner |

## Assumptions to validate

| Assumption | How it gets tested | Status |
|---|---|---|
| An agency SEO lead will trust a generated diagnosis enough to put it in front of a client | Show five leads a diagnosis produced from their own client's data and ask what they would change before sending it | Untested |
| The diagnosis, not the dashboard, is what they will pay for | Price the diagnosis and the reporting separately in early conversations and see which one they argue about | Untested |
| Agencies will connect real client Google accounts to a young product | Attempt the OAuth flow with three agencies and count how many complete it | Untested |
| The measurement loop is achievable with the data available | Take one completed fix on one real client and try to produce the before-and-after end to end | Untested |
| Local-services agencies are a large enough beachhead | Sales conversations | Untested — and `docs/SOURCE_OF_TRUTH.md` records competitive positioning as undecided |
| The Orchestrator can pass context between specialists well enough to read as one senior team | Build it for one client end to end and have an SEO lead grade the output | Untested — recorded as the central engineering risk in `docs/AGENTS.md` |
