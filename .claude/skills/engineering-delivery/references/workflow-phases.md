# The six phase workflow

## Phase 1: Inspect before editing

Before changing code, inspect the relevant repository areas and identify:

- Current architecture and relevant module boundaries.
- Existing implementation of the workflow in question.
- Related routes, components, services, schemas, migrations, tests, and configuration.
- Existing conventions for validation, error handling, authentication, authorization,
  logging, and testing.
- Potential risks and dependencies.
- What is known versus what is assumed.

State file paths. A claim about current behavior without a file path is a guess.

## Phase 2: Plan before implementation

For any non trivial task, return this plan and wait for approval:

1. Current behavior and relevant file paths.
2. Desired behavior from the delivery contract.
3. The smallest safe set of proposed changes.
4. Database, API, UI, integration, and configuration impact.
5. Security and authorization impact.
6. Test strategy for happy paths, negative paths, and regressions.
7. Required proof artifacts.
8. Risks, assumptions, blockers, and human owned tasks.
9. Rollback approach if the change is risky.

Do not begin implementation if a material requirement is unclear. Ask one focused
question instead of assuming.

## Phase 3: Implement narrowly

- Follow established repository patterns unless there is an approved reason to change them.
- Keep changes small and attributable to the active contract.
- Validate data at trust boundaries.
- Enforce permissions on the server.
- Use least privilege for roles, APIs, database policies, and external service credentials.
- Handle expected errors explicitly.
- Ensure repeated requests, retries, and webhook redeliveries do not create duplicate side effects.
- Avoid broad rewrites, dependency upgrades, schema changes, or visual redesigns unless approved.

## Phase 4: Test behavior

For every important workflow, test:

- Valid use by an authorized user.
- Invalid input.
- Missing or malformed data.
- Unauthorized user.
- Wrong role.
- Cross organization or cross account access attempt.
- Expired, reused, or tampered token where applicable.
- Duplicate submission or retried request.
- Third party integration failure.
- Existing behavior likely to regress.

No placeholder tests. A test must assert an outcome that would fail if the intended
behavior broke.

## Phase 5: Produce proof

Fill the Delivery Report template in `assets/DELIVERY_REPORT_TEMPLATE.md` with real
command output. Save it to `docs/reports/`. Paste actual output rather than describing it.

Status values: Ready for verification, Blocked, Partially complete, Failed. Complete is
not available until the contract definition of done is met and verification has happened.

## Phase 6: Independent verification

A separate verifier confirms behavior against the contract. The verifier must not accept:

- The code looks correct.
- The test suite passed, without reviewing what the tests actually validate.
- The agent said it implemented the feature.
- A screenshot alone for a workflow requiring server side authorization or integration behavior.
- Local only proof for a production dependent service such as email, OAuth, payments,
  storage, webhooks, or deployment configuration.

For critical workflows, verify with fresh test accounts and realistic staging configuration.
