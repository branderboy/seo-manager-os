# Workflow: Billing and entitlements

Contract: `BILLING-001`. Risk: Critical.

> **Status in this repository: this workflow does not exist yet.**
>
> There is no billing, no payment provider and no entitlement model. Pricing and packaging
> are recorded as undecided in `docs/SOURCE_OF_TRUTH.md`, so this one is blocked on a
> product decision before it is blocked on code.
>
> This document is the delivery standard's starter specification, kept as the target. It is
> not a description of the application as built. See `docs/production/INVENTORY.md` for what
> exists, and `docs/production/WORKFLOW-RISK-REGISTER.md` for the trigger that turns this
> into a release blocker.

## Steps in scope

Trial, subscription, upgrade and downgrade, payment success and failure, webhook handling,
cancellation, and access change after billing status changes.

## Required behavior

- What a customer pays for is what they can use, enforced server side on every gated route.
- Webhook signatures are verified. Unsigned or invalid events change nothing and are logged.
- The same event delivered twice changes state once, through a processed event ledger.
- Events arriving out of order do not downgrade a currently valid subscription.
- Cancellation, expiry, or payment failure revokes access per <FILL: grace period rule>.
- Provider secrets exist only in server side configuration.
- A provider outage or timeout leaves state unchanged and retries safely.
- The client never reports its own plan or entitlement.

## Error and edge cases

Duplicate webhook, out of order webhook, unknown customer, unknown event type, refund,
chargeback, plan change mid period, trial expiry during an active session, currency or tax
edge cases if applicable.

## Data touched

Subscription and entitlement records, processed event ledger, organization plan state, audit
entries for plan changes.

## Evidence required

Provider test mode run covering subscribe, renew, fail, and cancel. Replay evidence from the
event ledger. A gated route rejecting an unentitled caller. Never live mode without human
approval.
