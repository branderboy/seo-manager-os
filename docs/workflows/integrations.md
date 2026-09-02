# Workflow: External integrations and automations

Contract: `INTEGRATION-001`, one instance per provider. Risk: High, or Critical when the

> **Status in this repository: this workflow does not exist yet.**
>
> Nothing is integrated. The 41 entries in `src/lib/integrations.ts` are catalogue rows
> with mock connection states: no OAuth, no token, no request. The one live external call
> in the repository is `scripts/prospect-scanner`, a local CLI outside the product.
>
> This document is the delivery standard's starter specification, kept as the target. It is
> not a description of the application as built. See `docs/production/INVENTORY.md` for what
> exists, and `docs/production/WORKFLOW-RISK-REGISTER.md` for the trigger that turns this
> into a release blocker.
provider touches money, identity, or customer data.

## Steps in scope

Authorization and OAuth, API request, webhook or event receipt, retry behavior, provider
failure behavior, rate limit behavior, and reconciliation behavior.

## Required behavior

- Credentials are configured only in secure server side environments.
- Webhook signatures, origin, timestamp, and replay behavior are validated where supported.
- Idempotency protects duplicate prone actions.
- Timeouts, retry policy, and backoff are defined rather than inherited by accident.
- Irreversible actions are never retried blindly.
- Failure behavior is clear and non destructive, and is visible to the user where relevant.
- Enough information is recorded to reconcile failures safely.
- Mocked test evidence and live sandbox or staging evidence are labeled separately.

## Provider register

| Provider | Purpose | Risk | Credentials location | Verified environment | Contract |
|---|---|---|---|---|---|
|  |  |  |  | none / mock / sandbox / staging / live |  |

## Error and edge cases

Provider returns an error, responds slowly, changes its API, rate limits the app, sends a
duplicate webhook, sends an event for an unknown record, or goes down mid workflow.

## Evidence required

Fault injection results for each failure mode, a labeled sandbox or staging run, and a log
sample showing troubleshooting context with no sensitive values.
