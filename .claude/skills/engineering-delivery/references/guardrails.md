# Guardrails

Constraints say what must not happen. Guardrails are the mechanisms that make a violation
detectable or difficult. Every contract names the guardrails that apply to it, and the
delivery report states whether they held.

## Scope guardrails

- Work only on the files and modules identified in the approved plan.
- List every changed file in the delivery report.
- Explain any changed file that falls outside the approved plan.
- Do not bundle unrelated refactors, dependency upgrades, styling changes, or architecture
  changes into a scoped delivery.

## Repository guardrails

- Read existing repository instructions before editing.
- Follow existing code patterns, linting, formatting, type checking, test, and CI conventions.
- Do not modify lockfiles or dependency versions unless approved and justified.
- Do not disable linting, type checks, tests, security scans, or CI jobs.

## Security guardrails

- Store secrets only in approved environment variable or secret management systems.
- Keep server only credentials out of client bundles. Grep the build output before reporting.
- Validate all untrusted input at server and API boundaries.
- Enforce authorization on the server for protected data and actions.
- Use least privilege for user roles, API keys, database access, and third party credentials.
- Redact secrets and private data from test output, screenshots, recordings, logs, and reports.
- Require human approval for production credentials, payment settings, destructive actions,
  identity provider configuration, and permission changes.

## Database guardrails

- Use tracked migrations for schema changes.
- Do not make undocumented manual database edits.
- Assess migration safety, backfill impact, locking risk, and rollback approach before running.
- Verify tenant or organization filtering at the database and server layer where the
  architecture supports it.
- Do not run destructive migrations against production without human approval.

## Integration guardrails

- Verify signatures for incoming webhooks.
- Use idempotency protections for payment events, background jobs, outbound communications,
  and retryable side effects.
- Define behavior for provider failure, timeout, malformed response, rate limiting, and
  duplicate event delivery.
- Report mocked evidence and staging or live provider evidence separately, each labeled.
- Do not call real paid, destructive, or customer facing external services without explicit
  human approval.

## Completion guardrails

- Report `Ready for independent verification`, not `Complete`, until a verifier accepts the
  evidence.
- A contract cannot pass while a required proof artifact is missing.
- A contract cannot pass while a required test was not run, unless the contract explicitly
  marks that test as human owned and pending.
- Every unknown, blocked, unverified, or assumed item appears in the final report. Silence
  is treated as a failed guardrail, not as a pass.
