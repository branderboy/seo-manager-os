# [CONTRACT-ID]: [Short workflow name]

- Status: Draft / Approved / Ready for independent verification / Verified / Released
- Owner: [name]
- Approved by: [name and date]
- Revision: 1
- Related contracts: [IDs or none]
- Workflow spec: [docs/workflows/... or none]

## 1. Product outcome

What user or business problem this solves. Tie it to a capability in `PRODUCT_BRIEF.md`.

## 2. Risk level

Low / Medium / High / Critical, and one line on why. Critical and High require human
verification before release.

## 3. Agreed delivery

The exact behavior to be delivered, written as a measurable outcome rather than a coding
task.

## 4. Actors and permissions

| Actor | Permission needed | Actions |
|---|---|---|
|  |  |  |

## 5. Preconditions

What must exist before the workflow starts, including verified upstream contracts,
provider accounts, and configuration.

## 6. Acceptance criteria

Observable and pass or fail. Each row becomes a row in the delivery report and again in the
verification report.

| # | Criterion | How it is observed |
|---|---|---|
| 1 |  |  |
| 2 |  |  |
| 3 |  |  |

## 7. Failure and edge cases

Invalid input, unauthorized user, wrong role, wrong tenant, provider failure, duplicate
submission, expired or reused token, plus the cases specific to this workflow.

## 8. Scope

- UI:
- API routes, server actions, jobs, webhooks:
- Database tables, migrations, policies:
- Storage, files, queues, scheduled tasks:
- Third party providers:
- Environment variables and configuration:
- Tests, monitoring, documentation, environments:

Out of scope:

## 9. Constraints

What must not change or occur. Start from the default constraints in
`WORLD_CLASS_APP_THESIS.md` and add anything specific to this workflow.

## 10. Guardrails

The mechanisms that make a constraint violation detectable or difficult.

- Scope:
- Repository:
- Security:
- Database:
- Integration:
- Completion:

## 11. Security and privacy

Authentication, authorization, data classification, logging, audit, storage, retention, and
secrets requirements for this workflow.

## 12. Performance and cost

Expected load, response expectations, query and index requirements, pagination bounds, rate
limits, background job thresholds, and cost limits.

## 13. Test requirements

- Unit:
- Integration:
- End to end:
- Negative and authorization:
- Manual or staging:

## 14. Proof of delivery

- Branch and commit:
- Environment used:
- Required artifacts:

## 15. Independent verification

- Verifier, who must not be the implementing agent or session:
- Environment:
- Procedure:
- Expected result:

## 16. Ownership

- Agent-owned:
- Human-owned:
- Shared:

## 17. Rollback and remediation

How to safely reverse or repair the change, including data written before the problem was
found.

## 18. Definition of done

- [ ] Approved scope implemented
- [ ] Every acceptance criterion recorded as Pass, Fail, or Not verified
- [ ] Required tests added or updated, including the negative cases above
- [ ] Required commands run and results reported
- [ ] Proof artifacts available and labeled by environment
- [ ] Security, authorization, privacy, and data handling reviewed
- [ ] Performance and cost expectations checked against the stated limits
- [ ] Rollback path documented and, where the risk level requires it, tested
- [ ] Known limitations and human owned follow ups documented
- [ ] Independent verification report produced by someone other than the implementer
- [ ] No unresolved critical or high severity issue
