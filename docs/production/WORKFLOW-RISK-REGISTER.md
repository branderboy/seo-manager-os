# Workflow risk register

Phase 2 of the proof of concept to production path. Every workflow from the inventory gets
a risk class. Critical workflows require a delivery contract, proof artifacts, and
independent verification before any production release.

- Classified by: Claude Code, from `INVENTORY.md` at commit `a7dbb93` plus the verification
  changes on `claude/seo-manager-app-verify-ptc4e6`.
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
| Tenant and client isolation | One agency must never see another agency's clients, briefs, or rankings. Trigger: the first time two customers share a deployment. | ORG-001 | None | No |
| Data collection from client accounts (`/research`) | Ingests a client's GSC, GA4, GBP and CRM data under their OAuth grant. Customer data and third-party credentials. Trigger: the first real connection in `src/lib/integrations.ts`. | INTEGRATION-001 | None | No |
| Client-facing brief and report sharing (`/strategy`, `/reports`) | A confirmed product decision (`docs/SOURCE_OF_TRUTH.md`) is read-only sharing with the end client. A share link is an access-control surface. Trigger: the first link that resolves for someone outside the agency. | FILES-001 | None | No |
| AI Workforce execution (`/agents`) | Sends client data to third-party model providers and produces the diagnosis and strategy the agency sells. Cost, data egress, and correctness at once. Trigger: the first agent run that calls a model. | INTEGRATION-001 | None | No |
| Diagnosis and scoring correctness (`/diagnosis`) | The product's core claim is a grounded, traceable score. A wrong number sends an agency's spend at the wrong problem. The model in `src/lib/scoring.ts` is unit tested; the path from real evidence into it does not exist yet. | CORE-001 | None | No |
| Data export (CSV/PDF) | A confirmed priority over team management. Exports carry client data out of the product. Trigger: the first export. | FILES-001 | None | No |

## High priority

| Workflow | Why | Contract ID | Contract status | Verified |
|---|---|---|---|---|
| Discovery interview (`/discovery`) | Everything downstream is derived from it. Today the answers are lost when browser storage is cleared. | — | None | No |
| Daily task engine (`/tasks`) | The agency's actual worklist. Task state is React state and is discarded on reload, which is a silent data loss the user is not warned about. | — | None | No |
| Client switching (`/clients`, top bar) | Picks which client every other screen is about. Selecting the wrong one silently mislabels an entire engagement. | — | None | No |
| Prospect and job scanner CLI | The only live external call in the repository. Holds a real API key and has a per-request cost. | — | None | No |
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

## Release rule

No production release while a Critical row shows an unverified contract, unless the human
owner has explicitly accepted it in writing as a known limitation with a stated reason.

**Standing acceptance, recorded 2026-09-02:** the current GitHub Pages deployment is a
public demo containing no real customer data. Every Critical row above is unverified, and
that is acceptable *for that deployment only*. It is not acceptable for a paid beta. The
first commit that adds authentication, a database, or a live client-data connection makes
its Critical row a hard blocker, and must land with:

- its contract approved before implementation,
- the corresponding negative tests from `tests/README.md`,
- `test:authz` restored as its own blocking CI job (see `.github/workflows/README.md`),
- and independent verification by a session that did not write the code.
