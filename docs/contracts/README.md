# Delivery contracts

One contract per workflow. One workflow per contract. Contracts are approved before
implementation and revised, not overwritten, when scope changes.

Naming: `AREA-###-short-workflow-name.md`

Every contract has the eighteen sections defined in section 4 of
`WORLD_CLASS_APP_THESIS.md`. The blank form is `_TEMPLATE.md`.

## Build order

Do not start the next critical contract until the current one is verified or explicitly
accepted by the human owner as a known limitation.

| ID | Workflow | Risk | Workflow spec | Status | Note for this repository |
|---|---|---|---|---|---|
| AUTH-001 | Sign up, verification, login, logout, reset, sessions | Critical | authentication.md | Draft, unfilled | First. Nothing else can be secured before there is a user. |
| ORG-001 | Organization creation, membership, roles, tenant isolation | Critical | tenant-isolation.md | Draft, unfilled | Second, and the decision that most determines whether this app survives customers. Decide the tenant model *inside* this contract, before any backend code. |
| CORE-001 | The Engagement end to end — one agency's work on one client | Critical | core-workflow.md | Draft, unfilled | The workflow spec is written for this product; the contract is not. |
| ADMIN-001 | Invite, role change, suspension, restore, removal, audit | Critical | user-roles.md | Draft, unfilled | Keep minimal. `docs/SOURCE_OF_TRUTH.md` records multi-seat roles as deliberately low priority. |
| FILES-001 | Secure upload, storage policy, authorized download, deletion | Critical | tenant-isolation.md | Draft, unfilled | Covers two real needs here: crawl and Lighthouse uploads, and the read-only client share links. |
| BILLING-001 | Subscription, entitlement, webhook handling | Critical | billing.md | Draft, unfilled | Blocked on a pricing and packaging decision, which `docs/SOURCE_OF_TRUTH.md` records as undecided. |
| INTEGRATION-001 | One external provider, failure and retry. Copy per provider | High | integrations.md | Draft, unfilled | Copy it per provider: Google (GSC/GA4/GBP), the rank/SERP data provider, and the LLM fan-out. The LLM one also has to answer the cost question. |
| OBS-001 | Error tracking, logs, health checks, backup, rollback | Critical | runbooks/ | Draft, unfilled | **Do this one now.** It is the only contract on this list that does not need a backend first, and the application is currently unobservable. |
| PERF-001 | Performance targets, scale bounds, unit economics | High | core-workflow.md | Draft, unfilled | No performance target has ever been set for this application, and every list renders unpaginated. |
| AUDIT-001 | Independent production readiness audit against all contracts | Critical | audits/ | Draft, unfilled | The audits in `docs/audits/` are filled in, but by the session that made the changes. Independent re-verification is outstanding. |

**Every contract above is an unfilled starter form.** None has been drafted for this product,
approved, implemented or verified. That is the accurate status, and
`docs/production/WORKFLOW-RISK-REGISTER.md` records what each one blocks.

Drop FILES-001 or BILLING-001 if the product genuinely has no file handling or no payments.
Do not drop AUTH-001, ORG-001, OBS-001, or AUDIT-001.

## Status vocabulary

Draft, Approved, Ready for independent verification, Verified, Released. The implementing
agent can reach Ready for independent verification. Only a verifier who did not implement
the work can set Verified. Only the human owner can set Released.

## Filling in a draft

Every draft contains `<FILL: ...>` markers for facts that depend on the specific
application: provider names, table names, route paths, role rules, thresholds, and targets.
A contract is not approvable while a marker remains. Search for `<FILL:` before requesting
approval, and pull the answers from `PRODUCT_BRIEF.md` and `ARCHITECTURE_DECISIONS.md`
rather than inventing them here.
