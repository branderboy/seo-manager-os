# Pillar 8: Performance, scale, and economics

Contract: PERF-001. Numbers live in `ARCHITECTURE_DECISIONS.md`.

A feature that works at 10 records may fail at 10,000. A workflow that costs a cent may
become unprofitable at scale. A dashboard that loads locally may be unusable under real
concurrency.

For each core workflow, state p50 and p95 targets, maximum acceptable response time, records
per tenant, concurrent users, query and pagination strategy, required indexes, cache rules,
rate limits, file size limits, background job thresholds, timeouts, retry policy, maximum
payload size, and export strategy.

Practical rules when implementing:

- Every list query is bounded server side. A client supplied page size is a maximum request,
  not an instruction.
- Every tenant scoped query uses an index that leads with the tenant key.
- Cache keys and job payloads carry tenant scope. A cache is a tenant boundary surface.
- A provider call inside a request path gets a timeout shorter than the request budget.
- Work above the agreed threshold moves to a background job rather than a longer spinner.
- Measure against the largest tenant, not the average one.

## Economics

Track hosting, database, file storage and transfer, search, AI tokens and API calls,
external data, email and SMS, job execution, observability, support burden, and payment
fees. For AI or data heavy workflows, state cost per workflow, per active user, and per
tenant, a ceiling for free and trial users, usage limits, caching rules, a spend alert
threshold, and the fallback when a provider is unavailable or too expensive.

Raising a ceiling is not a fallback. It is a decision, and it is human owned.
