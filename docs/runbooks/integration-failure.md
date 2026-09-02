# Runbook: Integration failure

Owner: **Open — no named human is recorded in this repository.**
Providers covered: **one.** JSearch on RapidAPI, called by `scripts/prospect-scanner/scan.mjs`.

> The web application integrates with nothing. The 41 entries in `src/lib/integrations.ts`
> and the 12 providers in `src/lib/local-growth/connectors.ts` are catalogue rows and mock
> adapters: no OAuth, no token, no request (`docs/production/INVENTORY.md`). The one live
> external call in this repository is a local CLI, so an "integration failure" today means a
> command that errors on the operator's own machine, not a production incident.
>
> `connectors.ts` is worth reading before writing the first real adapter. It already defines
> the boundary — `connect`, `sync`, `freshness`, an optional `importCsv`, and an explicit
> `mode: "mock" | "live"` — and the rule that an unavailable source is surfaced as
> unavailable rather than filled in. That rule is what makes this runbook enforceable.
>
> Everything below the scanner row is kept because it is the procedure to adopt under
> INTEGRATION-001, when the Google, data-provider and LLM connections become real. That is
> also when the event ledger, the idempotency keys and the retry policy referenced below have
> to exist — they do not today.

## Detect

| Provider | Failure signal | Where it surfaces | Alert configured |
|---|---|---|---|
| JSearch on RapidAPI | Non-2xx response, missing `RAPIDAPI_KEY`, quota exhausted, or a hung request — the script sets no timeout and no retry (see `docs/audits/security-audit.md`, control 34) | The operator's terminal | No |
| Google Fonts | Build failure — `next/font` fetches at build time | The `deploy.yml` and `ci.yml` build step | No, beyond the workflow going red |
| GitHub Pages | Site unreachable or serving a stale version | Nowhere. A person notices. | **No** |
| The 41 catalogue integrations | None. They make no requests. | — | Not applicable |

## Triage

1. Is the provider down, slow, rate limiting, or returning changed data? Check their status
   page before assuming a code defect.
2. Is the failure user visible, or queued and retrying?
3. Are side effects at risk of duplication, or of being lost?

## Contain

- Pause the queue or disable the trigger rather than letting retries pile up.
- Preserve failed payloads for reconciliation. Do not discard them to clear an alert.
- Communicate degraded behavior to users if the workflow is customer facing.

## Recover

1. Confirm the provider is healthy again.
2. Replay from the event ledger. Idempotency keys make this safe. If there is no ledger for
   this integration, that is a finding for INTEGRATION-001, not an improvisation now.
3. Reconcile against the provider as the source of truth and record what was corrected.
4. Verify no duplicate side effects were created: duplicate charges, duplicate emails,
   duplicate records.

## Escalate

Payments, identity, and anything touching customer data go to the human owner immediately.
An agent does not decide to refund, re send, or re issue.
