# BILLING-001: Subscription webhook and entitlement state

- Status: Draft
- Owner: <FILL: name>
- Approved by: <FILL: name and date>
- Revision: 1
- Related contracts: AUTH-001, ORG-001
- Workflow spec: docs/workflows/billing.md

## 1. Product outcome

Business outcome

What a customer pays for is what they can use. Payment events from the provider change
access reliably, once, and in the right direction, including when the provider retries or
sends events out of order.

## 2. Risk level

Critical. Money and access are both decided here, and provider retries make silent corruption easy.

## 3. Agreed delivery

Agreed delivery

The application receives subscription events from <FILL: payment provider>, verifies each
event signature, updates the organization plan and entitlement state, and grants or
revokes access accordingly. Duplicate and out of order deliveries do not corrupt state.

## 4. Actors and permissions

| Actor | Permission needed | Actions |
|---|---|---|
| Owner or billing role | <FILL: role name> | Start, upgrade, downgrade, cancel a subscription |
| Member | membership | Use entitled features, view plan state |
| Payment provider | valid signature | Deliver subscription events to the webhook endpoint |
| Unentitled caller | none | No access to gated routes, regardless of the interface |

## 5. Preconditions

ORG-001 verified. Provider account created by the human owner, test mode keys available, signing secret stored server side, price and plan IDs recorded in configuration.

## 6. Acceptance criteria

Acceptance criteria

| # | Criterion | How it is observed |
|---|---|---|
| 1 | An event with an invalid or missing signature is rejected and logged without changing state | Negative integration test |
| 2 | The same event delivered twice changes state once | Replay test against the event ledger |
| 3 | Events arriving out of order do not downgrade a currently valid subscription | Ordered and reversed delivery test |
| 4 | Subscription created or renewed grants the correct entitlement to the correct organization | Provider test mode run |
| 5 | Cancellation, expiry, or payment failure revokes access per <FILL: grace period rule> | Provider test mode run |
| 6 | Entitlement is enforced server side on every gated route, not only in the UI | Direct API call without entitlement |
| 7 | Provider secrets exist only in server side configuration | Client bundle grep and config review |
| 8 | A provider outage or timeout leaves state unchanged and is retried safely | Fault injection test |

## 7. Failure and edge cases

Invalid or missing signature. Duplicate delivery. Out of order delivery. Unknown customer or unknown event type. Refund and chargeback. Plan change mid period. Trial expiry during an active session. Provider timeout or outage during checkout.

## 8. Scope

Scope

- UI: plan display, upgrade and downgrade entry points, past due or blocked state.
- API routes, server actions, jobs: webhook receiver at <FILL: path>, entitlement check helper.
- Database tables, migrations, policies: subscription and entitlement tables, processed
  event ledger for idempotency. <FILL: table names>
- Third party providers and webhooks: <FILL: provider and event types handled>
- Environment variables and configuration: provider secret key, webhook signing secret,
  price and plan IDs.
- Tests, monitoring, documentation, environments: local, staging with provider test mode.

Out of scope: invoicing UI, tax handling, and dunning email copy.

## 9. Constraints

Constraints

- Never trust the client to report plan or entitlement.
- Never mock the provider and then report the live path as verified.
- Do not log full payloads containing customer or card metadata.
- Webhook handler stays idempotent. Every state change goes through the event ledger.

## 10. Guardrails

Guardrails

- Provider secrets and signing secrets exist only in server side secret storage. A client
  bundle grep and a repository history secret scan run before the report is written.
- Every state change passes through the processed event ledger. No handler writes
  entitlement state directly.
- Mock evidence and provider test mode evidence are reported separately and labeled.
- No call is made against live mode, real customers, or real cards without explicit human
  approval.
- Webhook payload logging is redacted. Customer and card metadata never reaches the logs.
- Status is Ready for independent verification, never Complete. Live mode requires human
  acceptance.

## 11. Security and privacy

Payment related identifiers are sensitive data. The application stores provider references, never card data. Payload logging is redacted of customer and card metadata. Entitlement is resolved server side on every gated route, never from a client claim. Plan changes write audit entries.

## 12. Performance and cost

The webhook endpoint responds within the provider timeout and defers slow work to a job, because a slow handler causes retries and duplicates. Processing is idempotent through the event ledger. Payment processing fees and provider costs are recorded in the cost model in ARCHITECTURE_DECISIONS.md.

## 13. Test requirements

Test requirements

- Unit: entitlement resolution and grace period math.
- Integration: signature verification, ledger dedupe, ordering, every handled event type.
- End to end: gated feature access before and after each event.
- Negative and authorization: forged signature, replayed event, unknown event type,
  unknown customer.
- Manual or staging: provider test mode subscribe, renew, fail, cancel.

## 14. Proof of delivery

Proof of delivery

- Provider test mode event log with IDs, secrets redacted.
- Test command output for signature, dedupe, and ordering tests.
- Evidence that the gated route rejects an unentitled caller.
- Changed file summary.

## 15. Independent verification

Independent verification

- Verifier: <FILL: human name>
- Environment: staging with provider test mode.
- Procedure: subscribe, confirm access, replay the same webhook, cancel, confirm access is
  revoked after the grace rule, then call the gated API directly with a stale session.
- Expected result: access matches subscription state at every step and no duplicate state change.

## 16. Ownership

Ownership

- Agent-owned: handler implementation, ledger, tests, report.
- Human-owned: provider account, live keys, price IDs, refund and dunning policy, final
  acceptance before live mode.
- Shared: staging validation in provider test mode.

## 17. Rollback and remediation

The event ledger is the recovery mechanism: after a rollback, unprocessed events can be replayed safely because processing is idempotent. If entitlement state was corrupted, reconcile from the provider as the source of truth rather than patching rows by hand, and record the reconciliation.

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
