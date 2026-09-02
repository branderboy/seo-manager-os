# OBS-001: Error tracking, logs, health checks, and recovery

- Status: Draft
- Owner: <FILL: name>
- Approved by: <FILL: name and date>
- Revision: 1
- Related contracts: all contracts
- Runbooks: docs/runbooks/

## 1. Product outcome

Business outcome

When something breaks in production, someone finds out from the system rather than from a
customer, can see what happened, and can get back to a working state.

## 2. Risk level

Critical. Without this contract, every other contract is unverifiable in production.

## 3. Agreed delivery

Agreed delivery

The application reports unhandled errors to <FILL: error tracking service>, emits
structured logs with request and tenant context and no sensitive values, exposes a health
check that reflects real dependency status, and has documented backup, restore, deployment,
rollback, and incident response procedures that have been tested at least once.

## 4. Actors and permissions

| Actor | Permission needed | Actions |
|---|---|---|
| On call owner | production monitoring access | Investigate, escalate, roll back |
| Developer or agent | repository access | Add instrumentation and health checks |
| Anonymous caller | none | Health endpoint reveals status only, never configuration |

## 5. Preconditions

Error tracking and log destination accounts created by the human owner. A staging environment that can be deliberately broken. A named production owner.

## 6. Acceptance criteria

Acceptance criteria

| # | Criterion | How it is observed |
|---|---|---|
| 1 | An unhandled server error appears in the error tracking service with release and environment | Deliberate error in staging |
| 2 | An unhandled client error is captured with enough context to locate it | Deliberate error in staging |
| 3 | Logs carry request ID, user or tenant context, and no secrets or personal data | Log sample review |
| 4 | A background job failure is visible without reading raw logs | Forced job failure |
| 5 | The health check fails when a critical dependency is unavailable | Dependency stopped in staging |
| 6 | A restore from backup has been performed successfully at least once and documented | Restore run record |
| 7 | Rollback of the most recent deployment has been performed successfully in staging | Rollback run record |
| 8 | The incident response procedure names who does what and where to look first | Document review |

## 7. Failure and edge cases

Error tracking itself is down. Log volume spikes and floods the quota. Health check passes while a dependency is degraded. A job fails silently. An alert fires with no owner. A restore is attempted and the backup is unreadable.

## 8. Scope

Scope

- UI: user facing error state and support reference.
- API routes, server actions, jobs: health check endpoint, error boundary, log middleware.
- Database tables, migrations, policies: none expected.
- Storage, files, queues, scheduled tasks: job failure reporting.
- Third party providers: <FILL: error tracking and log destination>
- Environment variables and configuration: service keys, environment name, release version.
- Tests, monitoring, documentation, environments: staging and production configuration.

Out of scope: dashboards, alerting thresholds tuning, and uptime SLAs.

## 9. Constraints

Constraints

- Do not log passwords, tokens, keys, payment data, or personal data.
- Do not make the health check so shallow that it returns healthy while the database is down.
- Do not introduce a paid monitoring tier without approval.

## 10. Guardrails

Guardrails

- Security: log samples reviewed for sensitive values before being attached as proof.
- Completion: criteria 6 and 7 require an actual run, not a written procedure.
- Repository: no CI or check disabled while wiring up reporting.
- Status is Ready for independent verification, never Complete.

## 11. Security and privacy

Logs and error reports are a common leak path. Redaction runs before anything leaves the application. Personal data, tokens, and payloads are excluded or masked. Access to monitoring tools follows least privilege. The health endpoint discloses status, not internal configuration or versions of dependencies.

## 12. Performance and cost

Observability is a real line item. Record log volume, retention, and error event ceiling, and set an alert on spend. Sampling is defined for high volume traces so a traffic spike does not create an invoice spike.

## 13. Test requirements

Test requirements

- Unit: log redaction helper.
- Integration: health check with a dependency available and unavailable.
- End to end: deliberate error surfaces in the tracking service.
- Negative and authorization: health check does not disclose internal configuration to
  unauthenticated callers.
- Manual or staging: backup restore and deployment rollback.

## 14. Proof of delivery

Proof of delivery

- Branch and commit.
- Screenshot or reference of the captured error in the tracking service, redacted.
- Log sample with sensitive values absent.
- Health check responses in both states.
- Written record of the restore run and the rollback run, with dates.

## 15. Independent verification

Independent verification

- Verifier: <FILL: human name>
- Environment: staging.
- Procedure: trigger a server error, a client error, and a job failure, stop a dependency
  and call the health check, then read the incident procedure and follow it end to end.
- Expected result: every failure is visible without reading raw logs, and the procedure is
  followable by someone who did not build the system.

## 16. Ownership

Ownership

- Agent-owned: instrumentation, health check, redaction, documentation drafts.
- Human-owned: monitoring accounts, alert routing, on call expectations, backup retention
  policy, production restore approval.
- Shared: the restore and rollback runs.

## 17. Rollback and remediation

This contract is the rollback capability for every other contract. Its own remediation is manual: if instrumentation is wrong, correct it before shipping further features, because from that point on you are flying without instruments.

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
