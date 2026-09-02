# Workflow specifications

Pillar 2 of `WORLD_CLASS_APP_THESIS.md`. A workflow document describes what the product does
and what must be true. A contract in `docs/contracts/` describes one delivery of it, with
constraints, proof, and verification.

Every workflow entry carries: actor, trigger, preconditions, happy path, error path, edge
cases, data created or edited or deleted or exported, permission requirements, third party
dependencies, notifications and background work, acceptance criteria, and the evidence
required to prove it works.

| File | Covers | Contract | Status in this repository |
|---|---|---|---|
| core-workflow.md | The Engagement — one agency's work on one client, discovery to report | CORE-001 | **Written for this product.** Built as UI over mock data; none of the required behavior is enforced, because there is no server. |
| authentication.md | Sign up, verification, login, logout, reset, sessions, deletion | AUTH-001 | Does not exist. Starter specification kept as the target. |
| user-roles.md | Organization creation, invites, roles, suspension, audit | ORG-001, ADMIN-001 | Does not exist. Deliberately low priority — see `docs/SOURCE_OF_TRUTH.md`. |
| tenant-isolation.md | Data ownership and boundary enforcement | ORG-001 | Does not exist. The single most important decision still to be made. |
| billing.md | Trial, subscription, entitlement, webhook handling | BILLING-001 | Does not exist. Blocked on a pricing decision before it is blocked on code. |
| integrations.md | Providers, OAuth, webhooks, retries, reconciliation | INTEGRATION-001 | Does not exist. 41 catalogue entries that call nothing. |

Every file except `core-workflow.md` opens with a status banner saying plainly that the
workflow is unbuilt. That is deliberate: a specification that reads like a description is how
a team ends up believing a control exists.

Operations workflows (error tracking, monitoring, backup, restore, deployment, rollback,
incident response) live in `docs/runbooks/` and are contracted under OBS-001.
