# AUDIT-001: Production readiness audit

- Status: Draft
- Owner: <FILL: name>
- Approved by: <FILL: name and date>
- Revision: 1
- Related contracts: all contracts in this folder

This is an audit contract, not an implementation contract. Nothing is built under it. It
is run by an agent or reviewer with no implementation context, and it produces an audit
report in `docs/reports/`.
- Report template: docs/audits/production-readiness-audit.md

## 1. Product outcome

Business outcome

Before the product is exposed to real users and real money, someone other than the builder
has checked that the claims in the delivery reports are true.

## 2. Risk level

Critical. This is the last gate before real users, real money, and real data.

## 3. Agreed delivery

Agreed delivery

An independent audit of the repository and the staging environment against every approved
contract, producing confirmed findings, suspected risks, unverifiable claims, and a
prioritized remediation plan.

## 4. Actors and permissions

| Actor | Permission needed | Actions |
|---|---|---|
| Auditor | read access to the repository and staging | Inspect, probe, report. No code changes |
| Human owner | production authority | Accept findings, accept limitations, decide release |
| Implementing agent | none in this contract | May not audit its own work |

## 5. Preconditions

All critical contracts have delivery reports. Staging is running a build that matches the commit under audit. Two seeded organizations and multiple roles exist.

## 6. Acceptance criteria

Acceptance criteria

| # | Criterion | How it is observed |
|---|---|---|
| 1 | Every approved contract has a delivery report with recorded results | Cross check of docs/contracts against docs/reports |
| 2 | Every acceptance criterion marked Pass has evidence the auditor could inspect | Spot check of at least half of all criteria |
| 3 | Cross tenant access attempts fail on staging using real requests | Auditor executed requests |
| 4 | No secret appears in the repository history, client bundle, or logs | Secret scan output |
| 5 | Critical flows are not proven by mocks alone | Test file review per critical flow |
| 6 | A rollback path exists for every risky migration or infrastructure change | Migration review |
| 7 | Every release gate item is resolved or explicitly listed as blocking | Auditor checklist |

## 7. Failure and edge cases

A contract with no report. A report claiming Pass with no attached evidence. A test whose name promises more than it asserts. Staging drifted from production configuration. An environment the auditor cannot reach, which becomes an unverifiable claim rather than a pass.

## 8. Scope

Scope

- Architecture and dependency risk.
- Authentication, authorization, and tenant isolation.
- API routes and direct access controls.
- Database schema, policies, and migrations.
- Input validation and sensitive data handling.
- File uploads, exports, jobs, emails, webhooks, payments, and third party integrations.
- Test quality, specifically whether tests would fail if the behavior broke.
- Environment and configuration assumptions.
- Error handling, logs, monitoring, and rollback readiness.

Out of scope: writing fixes, unless separately requested.

## 9. Constraints

Constraints

- Do not implement changes during the audit.
- Do not treat agent generated documentation or test names as proof.
- Do not run destructive commands against production.

## 10. Guardrails

Guardrails

- The auditor is a different agent, session, or person than the implementer. An audit run
  by the implementing session is not an audit.
- Prior agent claims, README statements, checklist labels, test names, and screenshots are
  not accepted as proof.
- No code changes, no dependency changes, and no destructive commands during the audit.
- Production is inspected through configuration review only, never modified.
- Every finding carries evidence the reader can independently reach.

## 11. Security and privacy

The auditor works with sanitized data and least privilege access. Findings quote evidence with secrets and personal data redacted. The audit report itself is treated as internal data because it is a map of the application weaknesses.

## 12. Performance and cost

Performance and cost are audit subjects, not audit exclusions. Check indexes and pagination bounds on the heaviest queries, and confirm the cost model in ARCHITECTURE_DECISIONS.md against actual provider usage in staging.

## 13. Test requirements

Test requirements

The auditor runs the existing suite, reads what the tests actually assert, and executes
manual probes against staging for authorization, tenant isolation, and integration paths.

## 14. Proof of delivery

Proof of delivery

Completed audit report using `docs/reports/_AUDIT_TEMPLATE.md`, including severity,
evidence, remediation, and the verification test required after each fix.

## 15. Independent verification

Independent verification

- Verifier: the human owner reviews the audit report and decides on release.
- Environment: staging, with production configuration reviewed but not modified.
- Expected result: a release recommendation with an explicit blocking list.

## 16. Ownership

Ownership

- Agent-owned: the audit pass and the written report.
- Human-owned: release decision, production access, remediation prioritization.
- Shared: retest after remediation.

## 17. Rollback and remediation

Not applicable to the audit itself, which changes nothing. Each finding produces a remediation contract with its own rollback plan, and remediation is reverified rather than assumed fixed.

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
