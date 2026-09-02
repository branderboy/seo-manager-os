# INTEGRATION-001: One external provider with failure and retry behavior

- Status: Draft
- Owner: <FILL: name>
- Approved by: <FILL: name and date>
- Revision: 1
- Related contracts: ORG-001, OBS-001

Use one instance of this contract per provider. Copy it to `INTEGRATION-002` and onward
rather than widening this one.
- Workflow spec: docs/workflows/integrations.md

## 1. Product outcome

Business outcome

The product depends on <FILL: provider> without inheriting its bad days. When the provider
is slow, down, or duplicating events, the application behaves predictably and no customer
sees corrupted state.

## 2. Risk level

High by default. Critical when the provider touches money, identity, or customer data. Set it explicitly per provider rather than inheriting this line.

## 3. Agreed delivery

Agreed delivery

The application calls <FILL: provider> for <FILL: purpose>, handles success, timeout,
malformed response, rate limiting, and duplicate delivery, retries safely without producing
duplicate side effects, and records enough context to troubleshoot without exposing secrets.

## 4. Actors and permissions

| Actor | Permission needed | Actions |
|---|---|---|
| Member | membership and <FILL: role> | Trigger the workflow that calls the provider |
| Provider | valid signature or credential | Deliver responses, webhooks, or callbacks |
| Background job | service credential, least privilege | Retry and reconcile |

## 5. Preconditions

Provider account and sandbox credentials obtained by the human owner. Rate limits, timeouts, and retry policy decided and recorded before implementation.

## 6. Acceptance criteria

Acceptance criteria

| # | Criterion | How it is observed |
|---|---|---|
| 1 | A successful call produces the expected application state | Integration test plus sandbox run |
| 2 | A timeout leaves state unchanged and is retried per <FILL: retry policy> | Fault injection test |
| 3 | A malformed or unexpected response is rejected without corrupting state | Fault injection test |
| 4 | Rate limiting is handled with backoff rather than repeated immediate calls | Test against a rate limited response |
| 5 | A retry or duplicate event does not produce a duplicate side effect | Replay test |
| 6 | Credentials exist only in server side configuration | Client bundle grep and configuration review |
| 7 | Failures are logged with enough context to troubleshoot and no sensitive values | Log sample review |
| 8 | The live path works in sandbox or staging, not only against a mock | Labeled sandbox or staging evidence |

## 7. Failure and edge cases

Provider error response. Slow response and timeout. Malformed or unexpected payload. Rate limiting. Duplicate webhook or event. API version change. Event referencing an unknown record. Outage partway through a multi step workflow.

## 8. Scope

Scope

- UI: any state that reflects provider results or provider failure.
- API routes, server actions, jobs: client wrapper, retry policy, queue or job. <FILL: paths>
- Database tables, migrations, policies: request or event ledger if side effects exist.
- Storage, files, queues, scheduled tasks: <FILL>
- Third party providers: <FILL: provider and API version>
- Environment variables and configuration: credentials, base URL, timeout, retry limits.
- Tests, monitoring, documentation, environments: local, sandbox, staging.

Out of scope: additional providers and provider migration.

## 9. Constraints

Constraints

- Do not call live, paid, or customer facing provider endpoints without human approval.
- Do not swallow provider errors silently.
- Do not store provider secrets in source control or client code.
- Do not add a second provider or an abstraction layer for future providers under this contract.

## 10. Guardrails

Guardrails

- Integration: mocked evidence and sandbox or staging evidence are reported separately and
  labeled.
- Security: credentials reviewed and redacted in every artifact.
- Completion: a mock only run does not satisfy acceptance criterion 8, regardless of how
  many tests pass.
- Status is Ready for independent verification, never Complete.

## 11. Security and privacy

Credentials stay server side and use least privilege. Webhook origin, signature, timestamp, and replay behavior are validated where supported. Outbound payloads carry only the fields the provider needs. Logs record enough to reconcile a failure and nothing sensitive.

## 12. Performance and cost

External calls are a cost and latency driver. Record cost per call, expected calls per active user, and the monthly ceiling. Set timeouts shorter than the user facing request budget, move slow calls to jobs, cache where the data allows it, and define fallback behavior when the provider is unavailable or too expensive.

## 13. Test requirements

Test requirements

- Unit: retry policy, backoff math, response parsing.
- Integration: success, timeout, malformed response, rate limit, duplicate delivery.
- End to end: the user visible workflow that depends on the provider.
- Negative and authorization: unauthorized caller triggering the integration.
- Manual or staging: a real sandbox or staging call.

## 14. Proof of delivery

Proof of delivery

- Branch and commit.
- Test output for each failure mode.
- Sandbox or staging run evidence, labeled, with secrets redacted.
- Log sample showing troubleshooting context without sensitive values.

## 15. Independent verification

Independent verification

- Verifier: <FILL: human name>
- Environment: sandbox or staging with provider credentials.
- Procedure: trigger the workflow, force a failure, replay the same event, and confirm the
  application state after each.
- Expected result: state is correct after success, unchanged after failure, and identical
  after replay.

## 16. Ownership

Ownership

- Agent-owned: implementation, retry logic, tests, report.
- Human-owned: provider account, credentials, spend approval, terms of service decisions.
- Shared: sandbox and staging validation.

## 17. Rollback and remediation

Irreversible provider actions are never retried blindly. Every side effect carries an idempotency key so a replay after rollback is safe. If the integration produced wrong outcomes, reconcile against the provider as the source of truth and record what was corrected.

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
