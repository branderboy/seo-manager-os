# World-Class App Thesis
## Product, Engineering, Security, Reliability, and AI Development Standard

This file is the governing standard for this repository. Read it before taking any action.
Every human and every AI agent working here follows it.

Claude Code loads the same standard through `.claude/skills/engineering-delivery/`. Codex
and other agents read this file.

The operating principle:

> Build quickly with AI. Accept slowly with evidence. Operate deliberately with automation,
> metrics, and clear ownership.

---

# 1. Purpose

This application will be built and operated as a real product, not merely a working demo.

World-class means the application is:

- Valuable to a defined user with a real problem.
- Functionally correct across the workflows that matter.
- Secure against common and high impact threats.
- Private and responsible with user and business data.
- Fast enough for its expected usage.
- Reliable when dependencies, users, and networks behave imperfectly.
- Observable when something goes wrong.
- Accessible to people using keyboards, screen readers, zoom, mobile devices, and varied
  input methods.
- Maintainable by people other than the original builder or AI agent.
- Affordable to operate as usage grows.
- Testable, auditable, deployable, recoverable, and improvable.
- Owned by accountable humans, with AI used as leverage rather than unquestioned authority.

The operating equation is:

Product value, plus correct workflows, plus secure data boundaries, plus reliable
operations, plus accessible experience, plus measurable outcomes, plus sustainable unit
economics, plus evidence based release decisions, equals a production quality application.

---

# 2. The core principle: AI is an implementer, not the authority

Codex, Claude Code, Gemini, and other coding agents can accelerate planning,
implementation, testing, review, documentation, and debugging.

They are not trusted final authorities on whether a feature is complete, correct, secure,
tested, integrated, deployed, production ready, scalable, affordable, or valuable to users.

AI output is plausible output. It becomes trusted only through evidence and independent
verification.

The required workflow is:

1. Define the expected outcome.
2. Convert the outcome into an agreed delivery contract.
3. Define constraints and guardrails.
4. Implement in a small, testable vertical slice.
5. Gather proof of delivery.
6. Verify independently.
7. Release gradually with monitoring.
8. Learn from real user behavior.
9. Improve the product through new contracts.

No feature is done because code exists. No feature is done because a model says it is done.
No feature is done because it works on one developer machine. No feature is done because a
screenshot looks correct.

A feature is ready only when the relevant contract is satisfied and verified.

## Status vocabulary

| Status | Who can set it | Meaning |
|---|---|---|
| Draft | Anyone | Contract written, not approved |
| Approved | Human owner | Scope agreed, implementation may begin |
| Ready for independent verification | Implementing agent | Evidence exists and is attached |
| Blocked, Partially complete, Failed | Implementing agent | Honest incomplete states |
| Verified | Independent verifier | Criteria confirmed with evidence |
| Released | Human owner | Shipped, with monitoring window defined |

The implementing agent may not use the words Complete or production ready.

## How to start a session

```text
Read WORLD_CLASS_APP_THESIS.md before taking any action.
Follow it as the repository product, engineering, security, reliability, and delivery
standard. First inspect the codebase and tell me which existing files contain the current
product rules, authentication, data model, API layer, tests, and deployment configuration.
Do not edit files until you return an implementation plan.
```

---

# 3. The eight pillars

## Pillar 1: Product correctness

Before building, answer:

- Who is the exact primary user?
- What specific costly, frustrating, risky, or slow process do they have today?
- What do they currently use instead?
- What outcome will the app improve?
- What is the smallest useful version that solves that problem?
- Why would the user return?
- Why would the user pay, refer, or retain?
- What must be true for the app to be considered successful?

Every major capability must have a user problem, a target user, a user outcome, a
measurable success metric, a defined scope, a defined non goal, and a decision owner.

Do not build a feature merely because it is technically possible.

The product brief lives at `PRODUCT_BRIEF.md` and is maintained, not written once.

## Pillar 2: Functional correctness

An app is functional when users can complete the intended workflow reliably, including
expected failure paths.

Do not define features as pages, buttons, or database tables. Define features as completed
user outcomes.

Bad:

> Build a campaign dashboard.

Good:

> A campaign manager can create a campaign, invite authorized collaborators, add creators,
> track outreach, receive submitted deliverables, approve or reject them, and view only
> campaign data their organization is allowed to access.

Every critical workflow must include actor, trigger, preconditions, happy path, error path,
edge cases, data created or edited or deleted or exported, permission requirements, third
party dependencies, notifications and background work, acceptance criteria, and the
evidence required to prove it works.

Workflow specifications live in `docs/workflows/`. The inventory covers authentication,
organization and role management, the core business workflow, billing and entitlements,
integrations, and operations.

## Pillar 3: Architecture and data design

A world class app has a deliberate system shape before it has many features.

Architecture must make clear what runs in the browser versus the server, what data belongs
to which tenant, which systems are sources of truth, how external providers connect, which
actions are synchronous versus background, where caching is appropriate, how data is
indexed and retained and exported and deleted, what happens when dependencies fail, and how
the system will be monitored and recovered.

The architecture decision record lives at `ARCHITECTURE_DECISIONS.md`. Update it when the
system gains major data domains, providers, traffic patterns, security requirements, or
operational complexity.

## Pillar 4: Security and privacy

Security is not adding a login screen. Security means protecting identities, sessions,
permissions, tenant boundaries, data, integrations, files, infrastructure, and operational
access.

OWASP ASVS is the application security verification baseline. It is designed as a set of
requirements for testing web application technical controls.

### Required security principles

1. Authenticate users appropriately.
2. Authorize every protected action on the server.
3. Default to deny when permission is not explicitly granted.
4. Use least privilege for users, services, keys, and infrastructure.
5. Treat all client input as untrusted.
6. Validate input at the server boundary.
7. Return only data the requester is authorized to receive.
8. Protect secrets and keep them out of client side bundles.
9. Log security relevant events without logging private secrets.
10. Test attacker like paths, not only happy paths.
11. Secure external integrations, webhooks, jobs, file storage, and exports.
12. Build privacy and retention decisions into data design.

### Authentication standard

- New users can register only through approved flows.
- Email ownership is verified when email identity is used.
- Passwords are handled by trusted authentication systems and never logged.
- Password reset tokens are time limited and single use.
- Invalid, expired, tampered, and reused tokens fail safely.
- Session cookies and tokens are configured securely for the architecture.
- Sensitive actions may require recent authentication or additional confirmation.
- Sessions are invalidated or restricted after suspension, password changes, or other
  relevant security events.
- Error messages do not unnecessarily reveal whether an account exists.
- Admin and privileged accounts have stronger safeguards where appropriate.

### Authorization standard

Authorization must be enforced at the server, API, database, and storage boundaries where
relevant. For each protected endpoint or action, verify:

- Is the requester authenticated?
- Is the requester allowed to perform this action?
- Does the requester have the correct role?
- Does the requested record belong to the requester's organization?
- Is the requester allowed to read every field returned?
- Is the action limited by plan, entitlement, rate, or account status?
- Is authorization checked on the server, not only in the browser?

For multi tenant apps, cross tenant testing is mandatory. Test boundaries with separate
tenants, roles, and records rather than assuming the interface proves isolation.

### Data protection standard

Data categories:

```md
Public data:
Information intended for anyone.

Internal data:
Business information not intended for public exposure.

Customer confidential data:
Client records, campaign data, leads, reports, and business operations.

Personal data:
Names, emails, phone numbers, addresses, identifiers, user activity, uploaded documents.

Sensitive data:
Payment related information, government IDs, passwords, tokens, private keys, health data,
financial data, or other protected categories.
```

For each category define who can access it, how long it is retained, whether it can be
exported, whether it is encrypted or protected at rest by the selected provider, whether it
appears in logs or analytics or screenshots or support tools, how it is deleted or
anonymized, and how users can request access or deletion or correction if applicable.

### Integration security standard

- Keep provider secrets server side.
- Validate webhook signatures.
- Validate origin, timestamp, payload, and replay behavior when supported.
- Use idempotency for duplicate prone actions.
- Apply rate limits and quotas.
- Define timeouts and retry behavior.
- Avoid retrying irreversible actions blindly.
- Record enough information to reconcile failures safely.
- Clearly distinguish a mocked integration test from a live staging or sandbox verification.

### Security release blockers

Do not release when any of the following is unresolved:

- Missing server side authorization.
- Cross user or cross tenant data exposure.
- Exposed secrets, tokens, keys, or credentials.
- Unverified password reset, login, verification, or account status workflow.
- Unverified payment, webhook, private file, export, or admin workflow.
- Untracked destructive database change.
- No meaningful audit trail for high impact admin or financial actions.
- Security tests that cannot be executed.
- A critical or high security finding without explicit temporary risk acceptance by a human
  owner.

## Pillar 5: Quality, testing, and evidence

Testing is not a coverage percentage. Testing is evidence that important behavior remains
correct when users, attackers, networks, data, and dependencies behave in realistic ways.

### Test pyramid

```md
Unit tests:
Validate isolated business rules and pure logic.

Integration tests:
Validate server routes, database behavior, authorization, webhooks,
storage policies, queues, and provider boundaries.

End to end tests:
Validate the user workflow through the deployed application.

Manual staging verification:
Validate critical flows involving real environment configuration,
emails, OAuth, payments, storage, webhooks, and human usability.

Production monitoring:
Detect failures that only appear under real traffic and dependency behavior.
```

### Mandatory negative testing

Every critical workflow must test no logged in user, wrong role, wrong organization,
altered URL ID, altered request body, invalid input, missing input, malformed input,
expired token, reused token, duplicate request, retry after timeout, provider error,
network error, rate limit, file too large or wrong type, and stale session after
suspension or role change.

### Test quality standard

Tests are insufficient if they only render a component without asserting behavior, mock
every important system boundary, assert that a mocked function was called without checking
resulting state, test only the happy path, avoid testing server side authorization, can
pass while a real user workflow remains broken, or exist only to increase coverage.

### Evidence standard

For every important contract, capture commit SHA and branch, environment tested, commands
executed, test output, screenshots or video when useful, sanitized request and response
evidence for APIs, logs and traces for relevant server side behavior, staging build or
deployment evidence, known limitations, required human verification steps, and the
independent verifier decision.

## Pillar 6: Accessibility and user experience

A world class app is usable by more than one type of person, device, browser, network
condition, and input method.

WCAG 2.2 is the accessibility baseline. The practical target for most business applications
is WCAG 2.2 Level AA where reasonably applicable.

### Required UX principles

- The user understands what the page is for within seconds.
- The most important action is visually obvious.
- Users receive clear feedback after actions.
- Loading, empty, success, warning, and error states are designed.
- Forms identify required fields, show useful errors, and preserve entered values where
  appropriate.
- Destructive actions require confirmation and explain consequences.
- Complex tasks are broken into understandable steps.
- Users can recover from errors.
- Mobile experience is intentional, not accidental.
- The app remains usable on slow connections and smaller screens.
- Important text is not conveyed by color alone.
- Keyboard users can reach and operate all controls.
- Focus is visible and logical.
- Interactive controls have accessible names.
- Images and icons have appropriate alternatives where needed.
- Modals, menus, dialogs, and notifications work accessibly.
- Important workflows are tested with keyboard navigation and a screen reader aware review.

WCAG 2.2 adds requirements including accessible authentication and clearer focus behavior,
which means accessibility covers secure account workflows, not only visual design.

The review checklist is `docs/audits/accessibility-audit.md`.

## Pillar 7: Reliability, observability, and operations

A production app must be operable after it launches. When something breaks the team needs
to know what failed, who is affected, when it began, what changed, how serious it is, the
safe recovery action, whether the system can be rolled back, and who owns the response.

### Required operational capabilities

```md
Observability:
- Error tracking.
- Structured application logs.
- Performance monitoring.
- Request tracing where appropriate.
- Background job visibility.
- Integration failure visibility.
- Database and infrastructure metrics where available.

Health:
- Health check endpoint or equivalent.
- Dependency health awareness.
- Build and deployment health checks.
- Synthetic checks for core customer flows where appropriate.

Alerting:
- Alerts for high error rates.
- Alerts for failed critical jobs.
- Alerts for failed payment or webhook processing.
- Alerts for authentication outages.
- Alerts for storage or integration failures.
- Alerts for abnormal latency or resource use.

Recovery:
- Backup policy.
- Restore procedure.
- Restore test or documented evidence.
- Rollback procedure.
- Migration recovery plan.
- Incident response runbook.
- Named human owner for production response.
```

Production readiness is service specific. Evaluate this service's ownership, reliability
needs, observability, capacity, data, security, recovery, rollout, and rollback rather than
ticking a generic launch checklist. The review lives at `PRODUCTION_READINESS.md`, and the
operational procedures live in `docs/runbooks/`.

### Resilience standard

Assume these will happen: a provider returns an error, a provider responds slowly, a
webhook arrives twice, a job runs twice, a user submits a form twice, a database query
becomes slow, a deployment introduces a regression, an environment variable is missing, a
queue falls behind, an email fails to deliver, a user has an old browser session, a
customer uploads a malformed file, a third party API changes or rate limits the app, and
someone attempts unauthorized access.

For each, define detection mechanism, user visible behavior, retry behavior, idempotency
behavior, logging behavior, escalation owner, recovery procedure, and rollback or
containment action.

## Pillar 8: Performance, scale, and economics

A feature that works at 10 records may fail at 10,000. A workflow that costs one cent per
execution may become unprofitable at scale. A dashboard that loads locally may become
unusable under real concurrency.

### Performance standard

For each core workflow specify expected p50 and p95 response time, maximum acceptable
response time, expected records per tenant, expected concurrent users, query and pagination
strategy, required database indexes, cache rules, rate limits, file size limits, background
job thresholds, timeouts, retry policy, maximum payload size, export strategy, and a load
testing plan for high risk workflows.

### Scale standard

Do not over engineer early. Do not ignore obvious future bottlenecks.

> Design for the next credible stage of demand, not imaginary hyperscale.

```md
Initial assumptions:
- 25 organizations.
- 10 users per organization.
- 25,000 core records per organization.
- 10 concurrent users.
- 100 API requests per minute.

Next stage assumptions:
- 500 organizations.
- 50 users per organization.
- 250,000 core records per organization.
- 200 concurrent users.
- 5,000 API requests per minute.

Required decisions:
- Pagination limits.
- Organization scoped indexes.
- Async export generation.
- Queue backed enrichment jobs.
- Provider rate limit protection.
- Usage metering.
- Cost alerting.
```

### Economics standard

Track hosting, database storage and compute, file storage and transfer, search indexing,
AI token and API costs, external data APIs, email and SMS, background job execution,
observability, support burden, and payment processing.

For AI powered or data intensive workflows define cost per workflow, cost per active user,
cost per tenant, maximum allowed cost for free or trial users, usage limits, caching rules,
fallback behavior when a provider is unavailable or too expensive, and the alert threshold
for unexpected spend.

The performance and cost contract is `docs/contracts/PERF-001-performance-and-cost.md`.

---

# 4. Delivery contracts

Every material change must have an agreed delivery contract. The contract is the unit of AI
assisted development, testing, audit, and release approval.

If a contract is not supplied, the agent creates a draft in `docs/contracts/` and waits for
human approval before making non trivial code changes.

## Required contract elements

1. Product outcome.
2. Risk level.
3. Agreed delivery.
4. Actors and permissions.
5. Preconditions.
6. Acceptance criteria.
7. Failure and edge cases.
8. Scope.
9. Constraints.
10. Guardrails.
11. Security and privacy.
12. Performance and cost.
13. Test requirements.
14. Proof of delivery.
15. Independent verification.
16. Ownership.
17. Rollback and remediation.
18. Definition of done.

The blank form is `docs/contracts/_TEMPLATE.md`.

## Constraints

Unless explicitly approved by a human owner, the agent must not:

- Change unrelated product behavior, files, screens, APIs, database tables, or workflows.
- Introduce a new paid service, provider, dependency, framework, or infrastructure component.
- Change production infrastructure, DNS, billing, access controls, deployment settings, or
  live data.
- Expose, log, commit, transmit, or hardcode secrets, credentials, private keys, API keys,
  access tokens, passwords, or sensitive customer data.
- Weaken, remove, skip, mock away, or rewrite meaningful tests just to make checks pass.
- Replace real authorization with hidden UI, disabled buttons, client side state, or route
  level visuals only.
- Bypass authentication, authorization, rate limits, validation, database policies, CI
  checks, code review rules, or other repository safeguards.
- Claim that a third party integration works when only a mock has been tested.
- Claim a staging or production deployment works without evidence from that environment.
- Delete or alter data without explicit human authorization and a documented rollback.
- Make broad refactors under the label of a narrow bug fix or feature request.
- Invent product requirements, external API behavior, existing configuration, or repository facts.

If a constraint conflicts with the agreed delivery, stop and request clarification.

## Guardrails

Constraints say what must not happen. Guardrails create mechanisms that make violations
detectable or difficult. Every contract identifies the applicable guardrails, and the
delivery report states whether they held.

### Scope guardrails

- Work only on the files and modules identified in the approved plan.
- List every changed file in the delivery report.
- Explain any changed file outside the initial scope.
- Do not bundle unrelated refactors, dependency upgrades, styling changes, or architecture
  changes.

### Repository guardrails

- Read existing repository instructions before editing.
- Follow existing code patterns, linting, formatting, type checking, test, and CI conventions.
- Do not modify lockfiles or dependency versions unless approved and justified.
- Do not disable linting, type checks, tests, security scans, or CI jobs.

### Security guardrails

- Store secrets only in approved environment variable or secret management systems.
- Keep server only credentials out of client bundles.
- Validate all untrusted input at server and API boundaries.
- Enforce authorization on the server for protected data and actions.
- Use least privilege for user roles, API keys, database access, and third party credentials.
- Redact secrets and private data from test output, screenshots, videos, logs, and reports.
- Require human approval for production credentials, payment settings, destructive actions,
  identity provider configuration, and permission changes.

### Database guardrails

- Use tracked migrations for schema changes.
- Do not make undocumented manual database edits.
- Assess migration safety, backfill impact, locking risk, and rollback approach.
- Verify tenant filtering at the database and server layer where the architecture supports it.
- Do not run destructive migrations against production without human approval.

### Integration guardrails

- Verify signatures for incoming webhooks.
- Use idempotency protections for payment events, background jobs, outbound communications,
  and retryable side effects.
- Implement clear behavior for provider failure, timeout, malformed response, rate limiting,
  and duplicate event delivery.
- Separate mocked test evidence from staging or live provider evidence, and label both.
- Do not call real paid, destructive, or customer facing external services without explicit
  human approval.

### Completion guardrails

- Report `Ready for independent verification`, not `Complete`, until a verifier accepts the
  evidence.
- A task cannot pass while a required proof artifact is missing.
- A task cannot pass while a required test was not run, unless the contract explicitly marks
  it as human owned and pending.
- Any unknown, blocked, unverified, or assumed item must be visible in the final report.

## Proof of delivery

Proof must correspond to the acceptance criteria. Generic statements, code snippets, and
agent summaries are not sufficient.

### Minimum for every contract

- Branch name and commit SHA.
- Environment used: local, test, staging, or production like.
- Summary of changed files and why they changed.
- Exact commands run.
- Test results and relevant output.
- A Pass, Fail, or Not verified result for every acceptance criterion.
- Known limitations, assumptions, and blocked items.

### For user workflows

End to end test output, a screen recording of the full workflow, screenshots of critical
states, a staging deployment or build identifier, sanitized API request and response
evidence, database or audit log evidence, and server logs or traces with sensitive data
removed.

### For authentication and authorization

Proof must show actual behavior in the relevant environment. For email verification:

1. Register a fresh test user with a real test email.
2. Show that the verification email is received.
3. Show that the account is blocked from protected pages and endpoints before verification.
4. Show that the valid verification link activates the intended account.
5. Show that the verified user can access the intended protected workflow.
6. Show that an expired, invalid, tampered, reused, or consumed link fails safely.
7. Show that a different user or organization cannot access protected resources by altering
   an endpoint, URL parameter, ID, or API request.

For endpoint authorization, include the authorized request result, the unauthenticated
request result, the unauthorized role request result, the cross user or cross organization
request result, the invalid input request result, and the expected status codes with
sanitized payloads.

### For integrations

Show the configuration path without exposing secrets. Show automated test results. State
clearly whether tests used mocks, sandboxes, staging credentials, or live providers. Provide
staging evidence that the real path works where required. Demonstrate failure, retry, and
duplicate event behavior. Do not claim production verification unless production was
actually tested with human approval.

## Independent verification

Proof is submitted by the implementer. Verification is performed by an independent source: a
human product owner or engineer, a second engineer, a separate AI model or session or agent
that did not implement the change, a CI system, an end to end or API suite, a security or
dependency scanner, or a combination.

For critical workflows, automated evidence must be combined with human verification in a
staging or production like environment.

### Independence rule

The same coding agent may implement code, write tests, run tests, gather proof artifacts,
and produce a delivery report. The same coding agent may not be the sole source that accepts
its own delivery as correct, secure, or production ready.

### Verification checklist

1. Read the agreed delivery and acceptance criteria.
2. Review the proof artifacts.
3. Confirm tests are meaningful and actually exercise the stated behavior.
4. Independently execute critical workflows where possible.
5. Test failure paths and unauthorized access, not only the happy path.
6. Check whether claimed security controls exist server side.
7. Mark each criterion `Verified pass`, `Verified fail`, or `Insufficient evidence`.
8. Record any defects, risks, or remaining unknowns.
9. Make a release recommendation: `Approved`, `Approved with known limitations`, or
   `Not approved`.

The report format is `docs/reports/_VERIFICATION_TEMPLATE.md`.

---

# 5. Independent audit standard

An independent audit determines what is actually true about the application.

The audit must not accept AI claims, README claims, it works on my machine, test names
without test inspection, screenshots without server side evidence, mock only success as
proof of a live integration, or a passing test suite without checking what it meaningfully
tests.

## Audit outcomes

Every important app claim is classified as one of: confirmed implementation, confirmed
working behavior, confirmed secure behavior, verified in staging, verified in production
like conditions, claimed but unverified, insufficient evidence, confirmed failure, or known
limitation accepted by the human owner.

## Audit workflow

1. Read the product brief, architecture record, workflow inventory, and delivery contracts.
2. Map routes, APIs, database operations, authorization checks, jobs, webhooks, storage, and
   integrations.
3. Trace each critical workflow from trigger through completion.
4. Test happy paths.
5. Test failure paths.
6. Test unauthorized and cross tenant paths.
7. Review tests for meaningful behavioral coverage.
8. Review logging, monitoring, backup, rollback, and deployment evidence.
9. Report confirmed findings separately from suspected risks and missing evidence.
10. Make a release recommendation.

## Audit severity

```md
Critical:
Immediate risk of unauthorized access, tenant data exposure, data loss,
payment harm, exposed secrets, or inability to safely operate the app.

High:
Important workflow can fail, bypass security, damage business operations,
or cause major user harm under realistic conditions.

Medium:
Important defect or risk with a workaround or limited blast radius.

Low:
Usability, maintainability, minor correctness, polish, or lower impact risk.
```

Audit templates live in `docs/audits/`. Run audits in a session or with an agent that did
not implement the work.

---

# 6. CI and automated enforcement

Discipline fades. Automation remains. Critical rules must be enforced by CI, not remembered
manually.

## Every relevant pull request must run

- Linting.
- Formatting checks.
- Type checks.
- Build checks.
- Unit tests.
- Integration tests.
- Critical end to end tests.
- Dependency and security checks.
- Database migration validation where applicable.
- Accessibility checks where applicable.
- Contract specific regression tests.

## Multi tenant CI baseline

For multi organization or multi client applications, CI must seed at least:

```md
Organization Alpha:
- Alpha admin
- Alpha member
- Alpha owned records

Organization Beta:
- Beta admin
- Beta member
- Beta owned records

Platform admin:
- Privileged platform level account, only where applicable
```

CI must verify that unauthenticated requests are rejected, a member cannot perform admin
actions, a user cannot read or edit or delete or export another tenant's records, a user
cannot access another tenant's private files, a suspended user loses intended access, a role
change takes effect correctly, sensitive endpoints enforce authorization server side,
duplicate webhooks and jobs do not duplicate side effects, and provider errors are handled
safely.

A critical authorization or tenant isolation test failure blocks release.

Workflow files live in `.github/workflows/`. Fixture definitions live in `tests/fixtures/`.

---

# 7. Environments and release strategy

```md
Local:
Fast developer and agent iteration.

Test:
Automated test environment with controlled fixtures.

Staging:
Production like configuration, sanitized test data,
realistic providers and sandboxes, and release candidate verification.

Production:
Live users, live data, real monitoring, controlled rollout,
and human approved changes.
```

## Environment rules

- Do not test destructive actions in production unless explicitly approved.
- Do not use production secrets in local development.
- Do not assume local success equals staging success.
- Do not assume staging success equals production readiness.
- Keep environment configuration documented without exposing secrets.
- Use test or sandbox accounts for providers when available.
- Verify real environment dependent flows in staging: email, OAuth, webhooks, file storage,
  payment sandbox, queues, scheduled jobs, redirects, DNS, and deployment behavior.

## Release procedure

1. Confirm all relevant delivery contracts are verified.
2. Confirm no critical or high release blocker remains.
3. Confirm staging health and critical workflow evidence.
4. Confirm migrations and rollback plan.
5. Confirm monitoring, alerts, logs, and dashboards.
6. Deploy gradually when possible.
7. Watch predefined health indicators.
8. Pause or roll back when stop conditions are reached.
9. Verify the live release using a defined smoke test.
10. Document the release, outcome, and follow up work.

The procedures are in `docs/runbooks/deployment.md` and `docs/runbooks/rollback.md`.

---

# 8. Ownership and accountability

AI may accelerate work. Humans retain accountability.

## Human owned decisions

Product strategy and business rules. Scope approval. Architecture decisions. Security risk
acceptance. Production credentials. Production deployment approval. Payment configuration.
Data deletion. Legal, privacy, compliance, and retention decisions. Production incident
decisions. Final acceptance for critical workflows. Customer impacting decisions.

## Agent owned work

Codebase discovery. Architecture mapping drafts. Contract drafts. Scoped implementation.
First pass testing. Documentation. Test generation. Report generation. Change summaries.
Risk identification. Non sensitive proof collection. Audit assistance.

## Shared work

Staging validation. Debugging. Security remediation. Release preparation. Monitoring setup.
Performance investigation. Product analytics review. Incident analysis.

No AI agent can be the sole approver of its own work.

---

# 9. Definition of production ready

The app is production ready only when all relevant statements are true. The working
checklist is `PRODUCTION_READINESS.md`.

## Product
- The target user and problem are clear.
- V1 scope is explicit.
- Core success metrics are measurable.
- Known assumptions are documented.

## Functionality
- Core workflows have delivery contracts.
- Acceptance criteria are met.
- Happy paths and failure paths are tested.
- Required integrations work in the appropriate environment.

## Security
- Authentication is verified.
- Server side authorization is verified.
- Tenant isolation is tested.
- Secrets are protected.
- Sensitive data is handled appropriately.
- Security critical workflows have independent verification.
- No unresolved critical or high security finding remains.

## Quality
- Tests are meaningful.
- CI enforces critical regression checks.
- Critical end to end workflows pass.
- Failure paths and abuse paths are tested.
- Accessibility review has been completed for the product's scope.

## Performance and cost
- Core workflows meet defined performance expectations.
- Important queries are indexed and bounded.
- High volume work uses appropriate pagination, queues, caching, or batching.
- Cost drivers are measured and controlled.
- Usage limits and rate limits exist where necessary.

## Operations
- Error monitoring is active.
- Logs are useful and safe.
- Health checks are available.
- Alerts exist for meaningful failures.
- Backup and recovery expectations are documented.
- Deployment and rollback procedures exist.
- Named humans own production response.

## Release
- Staging verification is complete.
- Release blockers are resolved or explicitly accepted by a human owner.
- Post release smoke tests are defined.
- Post release monitoring window is defined.
- Known limitations are documented honestly.

If any critical requirement is not verified, use this status:

> Not ready for production release.

---

# 10. The final rule

Move quickly in implementation. Move carefully in acceptance. Automate the checks that
matter. Use humans for responsibility and judgment. Use evidence over confidence. Use
contracts over vague prompts. Use real user outcomes over feature volume.

A world class app is not the app with the most code. It is the app users can trust with
their time, work, money, data, and business.

---

# Standards referenced

Verified 1 September 2026. Each is named because it is used somewhere in this repository,
not for decoration.

**OWASP Application Security Verification Standard.** The application security verification
baseline in Pillar 4 and the shape of `docs/audits/security-audit.md`.
https://owasp.org/www-project-application-security-verification-standard/

**OWASP Authorization Regression Testing Cheat Sheet.** The source of the two tenant testing
approach in section 6 and `tests/fixtures/tenants.md`. It sets out provisioning Tenant Alpha
and Tenant Beta, seeding data into Alpha, running broad read queries as a Beta user, and
treating even one leaked record identifier as a critical failure. Broken Access Control was
the top ranked risk in the OWASP Top Ten 2021 and IDOR is one of its most exploited
subcategories, which is why these tests block a release here.
https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Regression_Testing_Cheat_Sheet.html

**OWASP Multi-Tenant Application Security Cheat Sheet.** Companion reading for the tenant
model in `ARCHITECTURE_DECISIONS.md`.
https://cheatsheetseries.owasp.org/

**WCAG 2.2.** The accessibility baseline in Pillar 6, targeting Level AA where reasonably
applicable. Published as a W3C Recommendation on 5 October 2023, with an update on
12 December 2024. It adds nine success criteria to WCAG 2.1, including 2.4.11 Focus Not
Obscured, 2.4.13 Focus Appearance, and 3.3.8 Accessible Authentication, which is why the
accessibility review in this repository covers sign in and recovery rather than visual
design alone. WCAG 2.2 does not deprecate 2.0 or 2.1, and content conforming to 2.2 also
conforms to both. https://www.w3.org/TR/WCAG22/

**Google SRE production readiness review.** The model for Pillar 7 and
`PRODUCTION_READINESS.md`. Chapter 32 of Site Reliability Engineering, The Evolving SRE
Engagement Model, describes the PRR as a process that identifies the reliability needs of a
service based on its specific details, which is why the review here is service specific
rather than a generic launch checklist.
https://sre.google/sre-book/evolving-sre-engagement-model/
