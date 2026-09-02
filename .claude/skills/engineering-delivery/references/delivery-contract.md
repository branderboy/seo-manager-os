# Delivery contract specification

Every meaningful change gets a contract. If one was not supplied, draft it, save it to
`docs/contracts/`, and request approval before making non trivial implementation changes.

Contract IDs use `AREA-###`, for example `AUTH-001`, `ORG-001`, `FILES-002`. One contract
covers one workflow. If you write "and also" in the agreed delivery, split it in two.

Eighteen sections, defined in section 4 of `WORLD_CLASS_APP_THESIS.md`. The blank form is
`assets/CONTRACT_TEMPLATE.md`, which is the same file as `docs/contracts/_TEMPLATE.md`.

Order: product outcome, risk level, agreed delivery, actors and permissions, preconditions,
acceptance criteria, failure and edge cases, scope, constraints, guardrails, security and
privacy, performance and cost, test requirements, proof of delivery, independent
verification, ownership, rollback and remediation, definition of done.

The sections below cover the ones that need explanation. Actors and permissions,
preconditions, failure and edge cases, security and privacy, performance and cost, and
rollback and remediation are self explanatory in the template, but none of them are
optional: an empty section is an unanswered question, not a formality.

## Product outcome

Why the work exists and what outcome it creates for a user or the business.

Example: A verified account owner can securely sign in and access only the records
belonging to their organization.

## Agreed delivery

The exact user visible or system visible behavior, written as a measurable outcome rather
than a coding task.

Weak: Add authentication.

Strong: A new user can sign up with email and password, receive a verification email,
verify ownership through a single use time limited link, sign in after verification, reset
a password securely, and access only records authorized for that user and organization.

State for each delivery:

- User or system actor.
- Triggering action.
- Preconditions.
- Expected happy path behavior.
- Expected error and failure behavior.
- Data created, changed, or deleted.
- Protected endpoints, pages, files, records, jobs, or integrations affected.

## Scope

- Pages, screens, or UI components.
- API routes, server actions, services, background jobs, webhooks.
- Database tables, migrations, and policies.
- Storage, files, queues, and scheduled tasks.
- Third party providers.
- Environment variables or configuration.
- Tests, monitoring, documentation, and deployment environments.

Anything not listed is out of scope. Touching it requires a contract revision.

## Acceptance criteria

Observable, specific, pass or fail. Each one becomes a row in the delivery report and again
in the verification report.

Example set:

- An unverified account cannot access protected pages or protected API endpoints.
- A valid verification link verifies only the intended account.
- An expired, modified, reused, or invalid link fails safely.
- A non admin cannot reach admin only endpoints by calling the API directly.
- A user in Organization A cannot read, edit, export, or delete Organization B records.
- The workflow works in the required environment, not only on a developer machine.

## Constraints

What must not happen. Default set, unless a human owner explicitly approves otherwise:

- Do not change unrelated product behavior, files, screens, APIs, tables, or workflows.
- Do not introduce a new paid service, provider, dependency, framework, or infrastructure
  component.
- Do not change production infrastructure, DNS, billing, access controls, deployment
  settings, or live data.
- Do not expose, log, commit, transmit, or hardcode secrets, credentials, keys, tokens,
  passwords, or sensitive customer data.
- Do not weaken, remove, skip, mock away, or rewrite meaningful tests to make checks pass.
- Do not replace real authorization with hidden UI, disabled buttons, client state, or
  route level visuals.
- Do not bypass authentication, authorization, rate limits, validation, database policies,
  CI checks, or review rules.
- Do not claim a third party integration works when only a mock was tested.
- Do not claim a staging or production deployment works without evidence from that environment.
- Do not delete or alter data without explicit authorization and a documented rollback.
- Do not make broad refactors under the label of a narrow fix.
- Do not invent product requirements, external API behavior, configuration, or repository facts.

If a constraint conflicts with the agreed delivery, stop and request clarification.

## Guardrails

The mechanisms that make a violation detectable or difficult. Name the scope, repository,
security, database, integration, and completion guardrails that apply. The full catalog is
in `guardrails.md`.

## Test requirements

- Unit tests for isolated business rules.
- Integration tests for APIs, databases, permissions, webhooks, and service boundaries.
- End to end tests for critical user workflows.
- Regression tests for confirmed bugs.
- Negative tests for invalid input, unauthorized access, expired tokens, duplicate
  requests, and provider failures.
- Manual staging verification for real email, payment, file storage, OAuth, webhook, or
  deployment configuration workflows.

## Proof of delivery

Evidence that the agreed behavior was implemented and exercised. Minimum for every contract:

- Branch name and commit SHA.
- Environment used: local, test, staging, or production like.
- Changed file summary and why each changed.
- Exact commands run.
- Test results and relevant output.
- A Pass, Fail, or Not verified result for every acceptance criterion.
- Known limitations, assumptions, and blocked items.

### For user workflows

End to end test output, screen recording of the full workflow, screenshots of critical
states, staging build identifier, sanitized API request and response evidence, database or
audit log evidence, server logs or traces with sensitive data removed.

### For authentication and authorization

Show actual behavior in the relevant environment. For email verification, that means:

1. Register a fresh test user with a real test email.
2. Show the verification email arriving.
3. Show the account blocked from protected pages and protected endpoints before verification.
4. Show the valid link activating the intended account.
5. Show the verified user reaching the intended protected workflow.
6. Show an expired, invalid, tampered, reused, or consumed link failing safely.
7. Show that another user or organization cannot reach protected resources by altering an
   endpoint, URL parameter, ID, or API payload.

For endpoint authorization, include the result of an authorized request, an unauthenticated
request, a wrong role request, a cross user or cross organization request, and an invalid
input request, with expected status codes and sanitized payloads.

### For integrations

Show the configuration path without exposing secrets. Show automated test results. State
plainly whether tests used mocks, sandboxes, staging credentials, or live providers.
Provide staging evidence that the real path works where required. Demonstrate failure,
retry, and duplicate event behavior. Never claim production verification unless production
was actually tested with human approval.

## Independent verification

Proof is submitted by the implementer. Verification comes from someone else: a human owner,
a second engineer, a separate AI session or agent that did not implement the change, a CI
system, an end to end suite, a security or dependency scanner, or a combination.

The verifier reads the acceptance criteria, reviews the artifacts, confirms the tests are
meaningful, independently executes critical workflows where possible, tests failure and
unauthorized paths, checks that claimed security controls exist server side, marks each
criterion `Verified pass`, `Verified fail`, or `Insufficient evidence`, records defects and
unknowns, and issues a release recommendation of `Approved`, `Approved with known
limitations`, or `Not approved`.

For critical workflows, combine automated evidence with human verification in a staging or
production like environment. Use `assets/VERIFICATION_REPORT_TEMPLATE.md`.

## Ownership

- `Agent-owned`: repository inspection, implementation in approved scope, local and test
  environment checks, test creation and execution, non sensitive documentation, proof
  collection, delivery reports, identifying risks and unverified items.
- `Human-owned`: product decisions and unspecified business rules, approval of contracts
  and material scope changes, production secrets and access permissions, payment provider
  configuration and financial decisions, production migrations and destructive changes,
  identity provider setup, final acceptance of critical workflows, release approval for
  security sensitive functionality, legal and privacy and retention decisions, manual
  staging or production like verification where required.
- `Shared`: staging deployment, integration verification, security remediation, production
  readiness review, monitoring and incident response setup, release notes and rollback planning.

## Definition of done

- Approved delivery scope implemented.
- Every acceptance criterion recorded as Pass, Fail, or explicitly Not verified.
- Required tests added or updated.
- Required commands run and results reported honestly.
- Required proof artifacts available and labeled by environment.
- Security, authorization, and data handling reviewed.
- Known limitations and human owned follow ups documented.
- An independent verification report exists, produced by someone other than the implementer.
- No critical or high severity issue unresolved.
