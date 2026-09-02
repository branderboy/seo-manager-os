---
name: engineering-delivery
description: The repository standard for building a world class application with AI agents, covering product correctness, architecture, security, testing, accessibility, reliability, performance, economics, delivery contracts, independent verification, and release. Use this skill for ANY work in this repo, including features, bug fixes, refactors, migrations, integrations, deployments, reviews, audits, and release decisions. Trigger it whenever the user asks to build, add, fix, ship, wire up, connect, deploy, harden, audit, verify, launch, or scale anything, and whenever the user mentions a delivery contract, a contract ID such as AUTH-001 or ORG-001, acceptance criteria, guardrails, proof of delivery, independent verification, production readiness, tenant isolation, accessibility, performance targets, unit economics, or a release gate. Trigger it even when the request sounds small, because small changes are where authorization, tenant isolation, and regressions break. If the work touches authentication, permissions, multi tenant data, payments, webhooks, email, file storage, background jobs, or production configuration, this skill is mandatory.
---

# World-Class App Standard

This repository is built with AI coding agents. They are implementation tools, not trusted
final authorities on whether a feature is complete, correct, secure, tested, integrated,
deployed, production ready, scalable, affordable, or valuable to users.

The operating principle:

> Build quickly with AI. Accept slowly with evidence. Operate deliberately with automation,
> metrics, and clear ownership.

`WORLD_CLASS_APP_THESIS.md` at the repo root is the authoritative standard. This skill is
its operating summary. Read the thesis on your first substantive turn.

## The core operating rule

Do not accept any of these statements, including from yourself, unless proof artifacts exist
and someone other than the implementer has verified them:

Authentication is implemented. The endpoint is secure. The tests pass. The app is ready for
production. The deployment works. The bug is fixed.

Writing code is not proof. A passing unit test is not proof that a user workflow works. A
screenshot is not proof that an endpoint enforces server side authorization.

## Step 0: Orient before you touch anything

1. Read `WORLD_CLASS_APP_THESIS.md`.
2. Inspect the codebase and report which files hold the product rules, authentication,
   authorization, data model, API layer, background jobs, tests, and deployment configuration.
3. Do not edit files until you have returned an implementation plan and it is approved.

Then check what the request actually needs:

| Situation | Start here |
|---|---|
| The feature has no justification in `PRODUCT_BRIEF.md` | `references/product-correctness.md` |
| The app is an unaudited proof of concept | `references/poc-to-production.md`, Phase 1 |
| The work adds data, roles, billing, files, or a provider | `references/architecture.md` |
| A contract exists and is approved | `references/workflow-phases.md`, Phase 2 |
| No contract covers the work | Draft from `assets/CONTRACT_TEMPLATE.md`, request approval |

## Status vocabulary

You may report `Ready for independent verification`, `Blocked`, `Partially complete`, or
`Failed`. You may not report `Complete` or `production ready`. A contract reaches `Verified`
only through an independent verification report, and `Released` only by the human owner.

## The eight pillars

| Pillar | What it governs | Reference | Artifact |
|---|---|---|---|
| 1. Product correctness | Whether the feature should exist | `references/product-correctness.md` | `PRODUCT_BRIEF.md` |
| 2. Functional correctness | Whether the workflow completes, including failures | `references/workflow-phases.md` | `docs/workflows/` |
| 3. Architecture and data | System shape, tenancy, scale assumptions | `references/architecture.md` | `ARCHITECTURE_DECISIONS.md` |
| 4. Security and privacy | Identity, authorization, data, integrations | `references/security-baseline.md` | `docs/audits/security-audit.md` |
| 5. Quality and evidence | Tests that would fail if behavior broke | `references/testing-standard.md` | `docs/reports/` |
| 6. Accessibility and UX | Usable by more than one kind of person | `references/accessibility-ux.md` | `docs/audits/accessibility-audit.md` |
| 7. Reliability and operations | Finding out and recovering | `references/reliability-operations.md` | `docs/runbooks/` |
| 8. Performance and economics | Fast at volume, profitable at scale | `references/performance-economics.md` | `PERF-001` |

A change can satisfy the contract and still fail a pillar. Name the pillar you are putting
at risk rather than staying silent about it.

## Core principles

1. Build in small, testable vertical slices.
2. Do not infer business rules that are not documented. Unknown is a valid answer.
3. Prefer the smallest safe change that satisfies the approved contract.
4. Protect existing working behavior unless a contract explicitly changes it.
5. Server side authorization is mandatory for every protected action and query.
6. Client side UI visibility is never a security control.
7. Tests must validate real behavior, including failure and permission paths.
8. Never weaken, delete, skip, mock away, or rewrite a meaningful test to get a green run.
9. Never claim an external service, deployment, email, webhook, migration, or security
   control works unless it was exercised in the right environment.
10. Report uncertainty, blockers, assumptions, and incomplete work in plain language.

## Never do these

- Treat your own implementation as proof of correctness.
- Invent APIs, database fields, config values, users, credentials, provider behavior, or
  product requirements.
- Expose secrets, tokens, private user data, or production configuration.
- Make unrelated refactors while completing a scoped task.
- Modify production systems, billing, DNS, access permissions, live data, or deployment
  configuration without explicit human approval.
- Circumvent authorization checks, tests, linting, CI rules, or review requirements.
- Replace a production integration with a mock and then call the production path verified.

## The six phase workflow

| Phase | What happens | Gate to pass |
|---|---|---|
| 1. Inspect | Read the relevant code before proposing anything | You can name current behavior with file paths |
| 2. Plan | Produce the plan in `references/workflow-phases.md` | Human approval |
| 3. Implement | Smallest safe change, scoped to one contract | No unrelated files touched |
| 4. Test | Happy path plus the mandatory negative cases | Tests would fail if behavior broke |
| 5. Prove | Fill `assets/DELIVERY_REPORT_TEMPLATE.md` with real output | No claim without evidence |
| 6. Verify | Hand off to a verifier who did not implement the work | Verification report exists |

## Delivery contracts

Eighteen sections: product outcome, risk level, agreed delivery, actors and permissions,
preconditions, acceptance criteria, failure and edge cases, scope, constraints, guardrails,
security and privacy, performance and cost, test requirements, proof of delivery,
independent verification, ownership, rollback and remediation, definition of done.

Acceptance criteria are observable and pass or fail. Write behavior, not tasks.

Weak: Add authentication.

Strong: A new user can sign up with email and password, receive a verification email, verify
ownership through a single use time limited link, sign in after verification, reset a
password securely, and access only records authorized for that user and organization.

Details: `references/delivery-contract.md`. Blank form: `assets/CONTRACT_TEMPLATE.md`.
Existing contracts: `docs/contracts/`.

## Constraints and guardrails are different things

Constraints say what must not happen. Guardrails are the mechanisms that make a violation
detectable or difficult. Every contract names both, and the delivery report states whether
the guardrails held.

Constraint: do not expose secrets. Guardrail: grep the client bundle for the key name and
attach the result.

Catalog: `references/guardrails.md`.

## Independence rule

You may implement code, write tests, run tests, gather proof, and produce a delivery report.
You may not be the sole source that accepts your own delivery as correct, secure, or
production ready.

The verifier can be a human owner, a second engineer, a separate AI session or agent that
did not implement the change, CI, an end to end suite, a security scanner, or a combination.
Critical and High risk workflows require human verification in a staging or production like
environment. The verifier uses `assets/VERIFICATION_REPORT_TEMPLATE.md` and marks each
criterion `Verified pass`, `Verified fail`, or `Insufficient evidence`.

What agents are and are not trusted for: `references/trusted-uses.md`.

## Testing

A passing test is useful only if it would fail when the real behavior is wrong.

Mandatory negative cases for every critical workflow: no logged in user, wrong role, wrong
organization, altered URL ID, altered request body, invalid input, missing input, malformed
input, expired token, reused token, duplicate request, retry after timeout, provider error,
network error, rate limit, oversized or wrong type file, stale session after suspension or
role change.

| Change type | Minimum evidence |
|---|---|
| Copy, isolated styling, static UI | Build, lint, type checks, visual review |
| Business logic | Unit tests plus affected regression tests |
| API, database, server action | Integration, validation, and permission tests |
| Authentication or authorization | Integration and end to end tests, negative tests, human verification |
| Payments, email, OAuth, webhooks, files | Integration tests, staging evidence, error and retry tests, human verification |
| Destructive or irreversible action | Confirmation flow, authorization tests, audit evidence, rollback plan |
| Production infrastructure | Human approval, staged rollout, verification, rollback plan |

Expanded: `references/testing-standard.md`. CI enforcement: `references/ci-enforcement.md`.

## Environments and release

Local, test, staging, production. Local success does not imply staging success. Staging
success does not imply production readiness. Verify environment dependent flows in staging:
email, OAuth, webhooks, file storage, payment sandbox, queues, scheduled jobs, redirects,
DNS, deployment behavior.

Release procedure and runbooks: `references/environments-release.md`, `docs/runbooks/`. The
release decision is human owned in every case.

## Auditing

Work in a session that did not implement the code. Follow `references/audit-standard.md`.
Produce `assets/AUDIT_REPORT_TEMPLATE.md` for readiness, or the checklists in
`docs/audits/` for security and accessibility. Do not trust prior agent claims, test names,
documentation, screenshots, or self reported completion as proof.

## Release gate

Do not recommend release while any of these is unresolved:

- Broken authentication, password reset, session handling, or email verification.
- Missing server side authorization.
- Cross user or cross organization data exposure.
- Exposed secrets or insecure production configuration.
- Unverified payment, webhook, file storage, email, OAuth, or destructive data workflows.
- Critical flows tested only through mocks.
- No rollback plan for risky database or infrastructure changes.
- Tests that pass without demonstrating the required behavior.
- Known critical or high severity defects.
- Required human verification not completed.

If any remains, state exactly this line, then list what would clear it:

> Status: Not ready for production release.

## Reference index

- `references/product-correctness.md`: whether the feature deserves to exist.
- `references/architecture.md`: system shape, tenancy, scale assumptions.
- `references/delivery-contract.md`: the eighteen sections and proof standards.
- `references/guardrails.md`: scope, repository, security, database, integration, completion.
- `references/workflow-phases.md`: the six phases, plan format, verifier rules.
- `references/security-baseline.md`: authentication, authorization, data classes, integrations.
- `references/testing-standard.md`: what proves behavior.
- `references/accessibility-ux.md`: WCAG 2.2 AA in practice.
- `references/reliability-operations.md`: observability, resilience, recovery.
- `references/performance-economics.md`: targets, bounds, unit costs.
- `references/ci-enforcement.md`: what CI must block.
- `references/environments-release.md`: environments and the release procedure.
- `references/poc-to-production.md`: inventory, risk classification, build sequence, launch bar.
- `references/audit-standard.md`: the independent audit workflow.
- `references/trusted-uses.md`: what agents are and are not trusted to decide.
- `references/agent-prompts.md`: kickoff, inventory, planning, implementation, verification,
  and audit prompts.
