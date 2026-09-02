# Proof of concept to production

The path from a working demo to a production system is five phases. Do not skip Phase 1.
Most rebuilds happen because features were stacked on an application nobody had inventoried.

## Phase 1: Inventory the current proof of concept

Before adding features, audit what exists. Record it in `docs/production/INVENTORY.md`.

Inventory:

- User types and roles.
- Primary business workflows.
- Public pages and protected pages.
- APIs, server actions, background jobs, and webhooks.
- Database tables, storage buckets, and data classifications.
- External services and integrations.
- Existing tests and what they actually cover.
- Deployment environments and configuration requirements.
- Current defects, known limitations, and unverified claims.

Do not assume a visible feature is complete because it works on one local machine.

## Phase 2: Classify workflows by risk

Record the classification in `docs/production/WORKFLOW-RISK-REGISTER.md`.

**Critical**: sign up, login, logout, email verification, password reset, role changes,
invitations, suspension, deletion, tenant isolation, payments, subscriptions, refunds,
webhooks, private file handling, data export and deletion, admin actions, and anything
involving customer data, money, access control, or irreversible effects.

**High priority**: external API integrations, background jobs, scheduled automations,
email and notification delivery, search, reporting, analytics, dashboards, imports,
scraping pipelines, and AI workflows.

**Lower priority**: cosmetic UI, static content, non critical dashboard refinements, minor
usability work.

Critical workflows require a delivery contract, proof artifacts, and independent
verification before any production release.

## Phase 3: Convert workflows into contracts

Break the application into small vertical slices. Each slice covers UI, server and API
logic, database behavior, authorization, error handling, tests, and proof for one complete
user outcome.

Avoid: build the whole app.

Use: `AUTH-001`, `ORG-001`, `CORE-001`, `ADMIN-001`, `FILES-001`, `INTEGRATION-001`,
`OBS-001`, `AUDIT-001`. The starter set lives in `docs/contracts/`.

Do not start the next critical contract until the current one has proof and verification,
or has been explicitly accepted by the human owner as a known limitation.

## Phase 4: Build, prove, verify

1. Human approves the agreed delivery and scope.
2. Agent inspects current code and produces an implementation plan.
3. Human approves the plan for non trivial or risky work.
4. Agent implements the smallest safe change.
5. Agent creates and runs meaningful tests.
6. Agent gathers proof artifacts.
7. Agent produces a delivery report and marks it Ready for independent verification.
8. An independent verifier checks the work against the contract.
9. Failures become remediation contracts, not edits to the original claim.
10. Only verified contracts are release ready.

## Phase 5: Release readiness

The application is not production ready until all of the following hold. The checklist
form is `PRODUCTION_READINESS.md`.

- Critical workflows have verified delivery contracts.
- Authentication and authorization work in a staging or production like environment.
- Tenant isolation has been tested with different users and different organizations.
- Sensitive endpoints have been tested directly, not only through the UI.
- Secrets are managed safely and are absent from client code and repository history.
- Database migrations are tracked and have a rollback or recovery plan.
- Third party integrations have staging or sandbox verification where applicable.
- Error monitoring and actionable logs exist.
- Backups and restore expectations are documented.
- Deployment, rollback, and incident response procedures are documented.
- Known limitations are visible and accepted by the human owner.
- No unresolved critical or high severity finding exists.

If any item is missing, the correct status is:

> Not ready for production release.

---

## Practical build sequence

1. Write `PRODUCT_BRIEF.md` before major implementation.
2. Write `ARCHITECTURE_DECISIONS.md` before adding complex data, user roles, billing, files,
   or major third party integrations.
3. Create one delivery contract for every critical workflow.
4. Build in small vertical slices, not one giant prompt.
5. Require tests and proof artifacts with every contract.
6. Run a separate independent audit session after each critical delivery.
7. Add the most important negative path tests to CI immediately.
8. Set up staging with at least two tenants and multiple roles if the app is multi tenant.
9. Add error tracking, structured logs, backup planning, and rollback before public launch.
10. Run the production readiness review in `PRODUCTION_READINESS.md` before taking real
    customer data, payments, or public traffic.

## Minimum launch bar

For a first paid beta, do not compromise on these:

- Real authentication and verified access control.
- Server side authorization.
- Two tenant cross access tests for any client or workspace product.
- Password reset and account recovery testing.
- Proper secret handling.
- Backup and a basic recovery plan.
- Error tracking and actionable logs.
- A staging environment.
- End to end coverage for the main customer outcome.
- Mobile and keyboard usability review.
- Privacy policy, terms, and data handling decisions appropriate to the app.
- Manual human verification of the core workflow before release.
- A rollback plan for the release.
