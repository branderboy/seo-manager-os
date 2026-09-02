# Independent codebase audit standard

The audit determines what is actually implemented, tested, secured, and deployable. Run it
in a session or with an agent that did not implement the work.

The audit does not rely on prior agent claims, README statements, issue comments,
checklist labels, screenshots alone, or the existence of tests without reviewing what
those tests prove.

Separate at all times:

- Confirmed implementation.
- Confirmed working behavior.
- Confirmed secure behavior.
- Claimed but unverified behavior.
- Missing behavior.
- Risk requiring further evidence.

## Step 1: Read the product and the contracts

Identify intended users and roles, critical business workflows, sensitive data and
irreversible actions, deployment model, required external services, expected scale and
reliability needs, and existing acceptance criteria.

If the application has no written specification, build a workflow inventory and list the
missing requirements before calling the audit complete.

## Step 2: Map the codebase

Document framework and architecture, entry points, routes, pages, APIs, server actions,
services, jobs, webhooks, database schema, migrations, access policies, ORM usage,
authentication and session implementation, authorization and role enforcement, client and
server boundaries, storage, file handling, caching, queues, cron jobs, external APIs and
provider configuration, environment variables and secret management, test setup, CI,
deployment configuration, logging, and monitoring.

## Step 3: Audit workflows, not only files

For every critical workflow, trace the full path: UI or external trigger, client request,
server endpoint, authentication check, authorization check, input validation, database
query or mutation, external side effect, error handling, logs and audit records, test
coverage, and staging or runtime evidence.

## Step 4: Test adversarially

Where the environment permits, test unauthenticated access, wrong role access, cross user
access, cross organization access, ID and payload manipulation, invalid and expired and
reused and tampered tokens, duplicate requests and webhook redelivery, invalid file
uploads, provider timeouts and malformed payloads, stale sessions after role or password
change or suspension, and error responses for sensitive data leakage.

## Step 5: Review test quality

Do not count tests. Assess whether they prove behavior. Flag tests that only assert mocks,
skip server side authorization, exercise a function while avoiding the real endpoint, test
only happy paths, assert implementation details instead of outcomes, could pass while the
production workflow is broken, or were added after the fact without validating the contract.

## Step 6: Produce a prioritized report

Use `assets/AUDIT_REPORT_TEMPLATE.md`. Every finding carries severity, affected workflow,
evidence with file paths or reproduction steps, expected behavior, observed behavior,
impact, remediation, the verification required after remediation, and whether a human
owner is required.

End with a production readiness decision: Approved, Conditionally ready, or Not ready.
