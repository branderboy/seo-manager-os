# Reusable agent prompts

Paste these into Claude Code, Codex, or any other agent working in this repository. The
audit and verification prompts must run in a different session or agent than the one that
implemented the work.

## Kickoff prompt

```text
Read WORLD_CLASS_APP_THESIS.md before taking any action.
Follow it as the repository product, engineering, security, reliability, and delivery
standard.
First inspect the codebase and tell me which existing files contain the current product
rules, authentication, data model, API layer, tests, and deployment configuration.
Do not edit files until you return an implementation plan.
```

## Proof of concept inventory prompt

Use this once, at the start, on an existing proof of concept.

```text
Read WORLD_CLASS_APP_THESIS.md. Do not edit any code.

Inventory this application as it exists today and write the result to
docs/production/INVENTORY.md, then classify every workflow in
docs/production/WORKFLOW-RISK-REGISTER.md as Critical, High, or Lower.

Inventory:
- User types and roles.
- Primary business workflows.
- Public pages and protected pages.
- APIs, server actions, background jobs, and webhooks.
- Database tables, storage buckets, and data classifications.
- External services and integrations.
- Existing tests and what they actually cover, not what they are named.
- Deployment environments and configuration requirements.
- Current defects, known limitations, and unverified claims.

Cite file paths for everything. Label anything you could not confirm as Unknown rather
than guessing. Finish with the contracts you recommend writing first and why.
```

## Planning mode prompt

```text
Read WORLD_CLASS_APP_THESIS.md before taking action.

Do not edit code yet.

First inspect the repository and produce a plan for the delivery contract below.

Your plan must include:
1. Current behavior with exact file paths and relevant functions, components, routes, or services.
2. Gaps between current behavior and the agreed delivery.
3. A minimal safe implementation plan.
4. Affected UI, APIs, server actions, database tables, migrations, storage, background
   jobs, webhooks, integrations, and environment configuration.
5. Authentication, authorization, tenant isolation, privacy, and security implications.
6. Test plan covering valid behavior, invalid input, unauthorized access, cross user and
   cross tenant access, failure paths, retries, and regression risk.
7. Required proof of delivery artifacts.
8. Guardrails required for this change.
9. Assumptions, unknowns, blockers, and human owned tasks.
10. Rollback or remediation plan.

Do not invent repository facts. Label unknown information clearly.
Wait for approval before implementing.

[PASTE DELIVERY CONTRACT]
```

## Implementation mode prompt

```text
Read WORLD_CLASS_APP_THESIS.md and follow it strictly.

Implement only the approved delivery contract and approved plan.

Requirements:
- Make the smallest safe change necessary.
- Respect all constraints and guardrails.
- Do not modify unrelated code, dependencies, infrastructure, production settings, live
  data, or credentials.
- Enforce protected actions and data access on the server.
- Do not weaken or skip meaningful tests.
- Add meaningful tests for acceptance criteria, including negative and authorization cases.
- Run available tests, linting, type checks, build checks, and relevant security checks.
- Produce required proof artifacts and label each one by environment, including whether it
  came from a mock, a sandbox, staging credentials, or a live provider.
- Mark every acceptance criterion as Pass, Fail, or Not verified.
- Do not say complete or production ready. Use Ready for independent verification, and only
  when the evidence is present.
- Identify every human owned verification or configuration step.

Return the full Delivery Report defined in docs/reports/_TEMPLATE.md.

[PASTE APPROVED DELIVERY CONTRACT]
```

## Independent verification prompt

Run in a different session or agent than the implementer.

```text
Read WORLD_CLASS_APP_THESIS.md.

You are verifying work you did not implement. Do not fix anything.

Read the delivery contract at [PATH] and the delivery report at [PATH].

For each acceptance criterion, state Verified pass, Verified fail, or Insufficient
evidence, and give the verification steps you personally performed and the evidence you
reviewed. Reject any criterion whose only support is the implementer statement that it
works, a screenshot of a screen that requires server side enforcement, or a test that
would still pass if the behavior were removed.

Independently execute the critical workflows where the environment allows, including
failure paths and unauthorized access, not only the happy path.

Return the Independent Verification Report from docs/reports/_VERIFICATION_TEMPLATE.md,
ending with Approved, Approved with limitations, or Not approved, and the exact list of
items still requiring human verification.
```

## Independent audit prompt

Run in a different model, session, or agent than the one that implemented the work.

```text
Read WORLD_CLASS_APP_THESIS.md.

Act as an independent codebase and workflow auditor. Do not implement changes unless
explicitly requested.

Do not trust prior agent claims, test names, documentation, screenshots, or self reported
completion as proof.

Audit the repository and available environment against the delivery contracts in
docs/contracts/.

You must inspect:
- Product workflows and acceptance criteria.
- Repository architecture and affected code paths.
- Authentication, authorization, roles, and tenant isolation.
- API endpoints and direct request behavior.
- Database queries, schema, migrations, and access policies.
- Client and server trust boundaries.
- Input validation, output exposure, logging, secrets, storage, webhooks, jobs, payments,
  and integrations where relevant.
- Test quality and evidence quality.
- CI, deployment, observability, error handling, and rollback readiness.

For each finding:
- Assign Critical, High, Medium, or Low severity.
- Cite exact evidence: files, functions, endpoints, test output, observed behavior, or the
  missing artifact.
- Explain the business and security impact.
- Recommend a concrete remediation.
- Define the verification needed after remediation.
- Assign Human, Agent, or Shared ownership.

Separate confirmed findings from suspected risks and unverified claims.
Return the report format in docs/reports/_AUDIT_TEMPLATE.md and end with a production
readiness decision: Approved, Conditionally ready, or Not ready.
```
