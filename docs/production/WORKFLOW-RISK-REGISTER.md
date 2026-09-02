# Workflow risk register

Phase 2 of the proof of concept to production path. Every workflow from the inventory gets
a risk class. Critical workflows require a delivery contract, proof artifacts, and
independent verification before any production release.

- Classified by: Claude Code, from `INVENTORY.md` on
  `claude/seo-manager-app-verify-ptc4e6`, which merges the Local Growth OS foundation
  (`7b10301`) into the verification work.
- Date: 2026-09-02

## How to read this register today

Nothing in this application currently touches customer data, money, access control, or an
irreversible effect, because nothing leaves the browser. The Critical rows below are
therefore **classified against what each workflow becomes the moment it is wired to real
data**, which is the whole point of the current roadmap. Each one names the trigger that
turns it from a demo into a release blocker.

Treating them as Lower priority because they are mock today is exactly the mistake that
produces a rebuild. That is why they are listed as Critical with an explicit trigger rather
than deferred.

## Critical

Anything involving customer data, money, access control, or irreversible effects.

| Workflow | Why critical | Contract ID | Contract status | Verified |
|---|---|---|---|---|
| Identity and sessions | The product is sold to agencies managing other businesses' data. Nothing else on this list can be secured before there is a user. Trigger: the first non-public deployment. | AUTH-001 | None | No |
| Tenant and client isolation | One agency must never see another agency's clients, briefs, or rankings. **The design now exists** — `organization_id` on every tenant table, Supabase RLS policies, `client_id` scoping for client roles, matching storage policies — and has **never been executed or tested**. A policy nobody has run is a hypothesis that reads like a control, which is more dangerous than an obvious gap. Trigger: the first migration run against any database holding real data. | ORG-001 | None. The contract is unwritten even though the schema is written. | **No, and this is the register's most important row.** |
| Data collection from client accounts (`/research`) | Ingests a client's GSC, GA4, GBP and CRM data under their OAuth grant. Customer data and third-party credentials. Trigger: the first real connection in `src/lib/integrations.ts`. | INTEGRATION-001 | None | No |
| Client-facing brief and report sharing (`/strategy`, `/reports`) | A confirmed product decision (`docs/SOURCE_OF_TRUTH.md`) is read-only sharing with the end client. A share link is an access-control surface. Trigger: the first link that resolves for someone outside the agency. | FILES-001 | None | No |
| AI Workforce execution (`/agents`) | Sends client data to third-party model providers and produces the diagnosis and strategy the agency sells. Cost, data egress, and correctness at once. Trigger: the first agent run that calls a model. | INTEGRATION-001 | None | No |
| Diagnosis and scoring correctness (`/diagnosis`) | The product's core claim is a grounded, traceable score. A wrong number sends an agency's spend at the wrong problem. The model in `src/lib/scoring.ts` is unit tested; the path from real evidence into it does not exist yet. | CORE-001 | None | No |
| Data export (CSV/PDF) | A confirmed priority over team management. Exports carry client data out of the product. Partially built in Local Growth OS as a client-side CSV `data:` URI and `window.print()`, which is safe only while the data is fake. Trigger: the first export of real client data. | FILES-001 | None | No |
| Client report portal (`/growth/reports/client/[id]`) | An artifact written for the agency's customer, published on a lead-SEO approval gate that is currently React state. Publishing the wrong client's report is the kind of error an agency does not recover from. Trigger: the first real client given a link. | FILES-001 | None | No |
| Client file uploads and the `client-assets` bucket | Client-supplied files under `<organization_id>/<client_id>/`, with storage policies written and unexecuted. Trigger: the first upload. | FILES-001 | None | No |
| Campaign onboarding (`/growth/campaigns/new`) | Captures a client's identity, contacts, addresses, contract terms, economics and access credentials for GA4, GSC, GBP, CMS, CRM and hosting. It is the largest collection of a customer's sensitive business data anywhere in the product. Trigger: the first submission that leaves the browser. | CORE-001 | None | No |

## High priority

| Workflow | Why | Contract ID | Contract status | Verified |
|---|---|---|---|---|
| Discovery interview (`/discovery`) | Everything downstream is derived from it. Today the answers are lost when browser storage is cleared. | — | None | No |
| Daily task engine (`/tasks`) | The agency's actual worklist. Task state is React state and is discarded on reload, which is a silent data loss the user is not warned about. | — | None | No |
| Client switching (`/clients`, top bar) | Picks which client every other screen is about. Selecting the wrong one silently mislabels an entire engagement. | — | None | No |
| Prospect and job scanner CLI | The only live external call in the repository. Holds a real API key and has a per-request cost. | — | None | No |
| Audit → roadmap → task chain (`/growth/audits` → `/growth/roadmap` → `/growth/tasks`) | The chain from evidence to work, with the finding id kept as the relational source. It is the strongest idea in the Local Growth OS design and the one a broken migration would silently sever. | CORE-001 | None | No |
| GBP high-risk guardrails | The UI blocks a high-risk GBP recommendation from being marked ready until a strategist acknowledges the risk, and warns against keyword-stuffed names, fake locations, fake reviews and duplicate profiles. Getting this wrong gets a client's listing suspended. | CORE-001 | None | No — the guardrail is a React state check with no server behind it |
| Navigation integrity across 29 routes | A dead link in the shell breaks the operating loop the product is built around. | — | Covered by tests | Yes — `tests/unit/routes.spec.ts`, `tests/e2e/critical-workflows.spec.ts` |
| Keyboard and screen reader access | Agency staff use this all day. Contrast, focus, landmarks and labels are a usability floor, not a nicety. | AUDIT-001 | Partially proven | Partly — automated checks pass except colour contrast, which is ratcheted and open in `docs/audits/accessibility-audit.md`. The human keyboard and screen reader passes are outstanding. |

## Lower priority

| Workflow | Note |
|---|---|
| Intent mapping (`/intent`) | Presentation over mock data. Becomes High when fed real query data. |
| Competitive insights (`/competitors`) | As above. |
| Playbooks (`/tools`) | Static content selection by client type. |
| Risk Center (`/risk`), Wins (`/wins`), Command Center (`/command`) | Portfolio-wide manager views, derived from the same mock data. |
| Deployment Verification (`/deployments`) | UI only; needs a real crawler before it means anything. |
| Product tour (`src/components/layout/tour.tsx`) | Cosmetic, persisted in `localStorage`. |
| SaaS and Enterprise dashboards | Parked by product decision, still built and linked. Decide whether to remove or keep before launch. |
| Local Growth OS summary-only modules (`/growth/{gbp,rankings,keywords,citations,content,reviews,competitors,technical,outreach,leads,templates}`) | Read-only views over demo data. They become High the moment they read a real client's data. |
| `/growth/login` | A role picker with published demo credentials and nothing behind it. Lower risk as a demo, but see the register note below: it is the one screen that actively misrepresents a control. |

## Release rule

No production release while a Critical row shows an unverified contract, unless the human
owner has explicitly accepted it in writing as a known limitation with a stated reason.

**Standing acceptance, recorded 2026-09-02:** the current GitHub Pages deployment is a
public demo containing no real customer data. Every Critical row above is unverified, and
that is acceptable *for that deployment only*. It is not acceptable for a paid beta.

**One caveat on that acceptance.** `/growth/login` renders a sign-in with credentials
printed on the page. It is honest in the README and dishonest on the screen. A public demo
that shows a login invites the belief that access is controlled, and this register is the
wrong place to be quiet about it: label it in the UI as a demo workspace selector, or accept
in writing that visitors may misread it.

The first commit that adds authentication, a database, or a live client-data connection
makes its Critical row a hard blocker, and must land with:

- its contract approved before implementation,
- the corresponding negative tests from `tests/README.md`,
- `test:authz` restored as its own blocking CI job (see `.github/workflows/README.md`),
- and independent verification by a session that did not write the code.

**And specifically for ORG-001, now that the schema exists:** the contract's job is no
longer to design the tenant model. It is to *run* the migrations against a real database,
seed two organizations, and prove by test that organization A cannot reach organization B —
by altered URL id, by altered request body, and through the `client-assets` bucket — with
those tests blocking in CI. Until that exists, treat the tenant boundary as absent no matter
how complete the SQL looks.
