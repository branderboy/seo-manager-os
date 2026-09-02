# PERF-001: Performance, scale, and unit economics

- Status: Draft
- Owner: <FILL: name>
- Approved by: <FILL: name and date>
- Revision: 1
- Related contracts: CORE-001, INTEGRATION-001, OBS-001
- Architecture: ARCHITECTURE_DECISIONS.md

## 1. Product outcome

The product stays fast and profitable as tenants and records grow, and the team finds out
about a slow query or a runaway provider bill from a threshold rather than from a customer
or an invoice.

## 2. Risk level

High. It rarely breaks the product on launch day and reliably breaks it later, which is why
it needs a contract rather than good intentions.

## 3. Agreed delivery

Every core workflow has a stated performance target and a measured result at realistic
volume. The heaviest queries are indexed and bounded. High volume work runs in background
jobs. Rate limits and usage limits exist where necessary. Cost per workflow, per active
user, and per tenant is measured, and a spend alert fires before an unexpected bill lands.

## 4. Actors and permissions

| Actor | Permission needed | Actions |
|---|---|---|
| Any authenticated user | membership | Experiences the performance targets |
| Human owner | billing access | Sets spend thresholds and accepts cost trade offs |
| Background job | service credential, least privilege | Runs exports, enrichment, and batch work |

## 5. Preconditions

Scaling assumptions and the cost model in ARCHITECTURE_DECISIONS.md are filled in. A seeded
dataset at the next stage volume exists in staging. OBS-001 instrumentation is in place, or
this contract has no measurement to report.

## 6. Acceptance criteria

| # | Criterion | How it is observed |
|---|---|---|
| 1 | Each core workflow meets its stated p50 and p95 target at next stage volume | Timed runs against the seeded dataset |
| 2 | No unbounded list query exists. Every list endpoint enforces a maximum page size server side | Route review plus a request asking for more |
| 3 | Every tenant scoped query uses an index leading with the tenant key | Query plan evidence |
| 4 | Work above <FILL: threshold> runs as a background job rather than in the request | Job evidence for exports and batch work |
| 5 | Rate limits exist on expensive and abuse prone endpoints and return a clear response | Test that exceeds the limit |
| 6 | Cost per workflow, per active user, and per tenant is calculated and recorded | Cost worksheet in ARCHITECTURE_DECISIONS.md |
| 7 | A spend alert fires below the agreed ceiling | Deliberate threshold test or provider alert configuration evidence |
| 8 | Fallback behavior is defined when a provider is unavailable or above its cost ceiling | Fault injection test |

## 7. Failure and edge cases

The largest tenant rather than the average one. A tenant with one enormous record. An export
that exceeds the page limit. A cold cache. A slow provider inside a user facing request. A
queue falling behind. A retry storm after a provider outage. Free or trial users driving
paid API spend.

## 8. Scope

- UI: loading, pagination, and limit messaging.
- API routes, jobs: list and search endpoints, export generation, batch jobs.
- Database: indexes, query plans, pagination bounds.
- Providers: rate limit protection, timeouts, caching, spend alerts.
- Configuration: limits, thresholds, cache lifetimes.
- Tests, monitoring, environments: staging with seeded volume.

Out of scope: infrastructure autoscaling policy and full load testing of non critical paths.

## 9. Constraints

- Do not add caching that can serve one tenant's data to another. Cache keys include tenant scope.
- Do not raise a page limit to make a slow query look fast.
- Do not introduce a new paid service or infrastructure component to solve a missing index.
- Do not disable rate limits to make a test pass.

## 10. Guardrails

- Database: every new list query ships with its index and a stated page bound in the same change.
- Integration: provider calls inside a request path carry a timeout shorter than the request budget.
- Security: cache keys and job payloads are tenant scoped, and this is tested, not assumed.
- Completion: a performance claim without a timed run against seeded data is Not verified.

## 11. Security and privacy

Caching, background jobs, and exports are all tenant boundary surfaces. Every cache key, job
payload, and generated export file carries tenant scope. Rate limiting protects against
enumeration as well as cost. Performance logs record identifiers, not payloads.

## 12. Performance and cost

This contract is the performance and cost contract. Targets, volumes, and ceilings are
recorded here and mirrored into ARCHITECTURE_DECISIONS.md rather than kept in two places
with different numbers.

| Workflow | p50 target | p95 target | Volume tested | Result |
|---|---|---|---|---|
|  |  |  |  |  |

| Cost driver | Unit cost | Per active user | Per tenant | Monthly ceiling | Alert at |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## 13. Test requirements

- Unit: pagination bounds and limit parsing.
- Integration: rate limit behavior, cache key scoping, job dispatch above the threshold.
- End to end: the core workflow timed at next stage volume.
- Negative and authorization: request above the page limit, cross tenant cache probe,
  provider timeout inside a request path.
- Manual or staging: seeded volume run and a provider spend alert check.

## 14. Proof of delivery

- Branch and commit.
- Timed results per workflow against the seeded dataset, with the seed script referenced.
- Query plans for the heaviest queries.
- Rate limit response evidence.
- Cost worksheet with the sources of each figure.
- Alert configuration evidence.

## 15. Independent verification

- Verifier: <FILL: human name>
- Environment: staging seeded to next stage volume.
- Procedure: run the core workflow timed, request beyond the page limit, exceed a rate
  limit, and check that the cost figures match actual provider usage for the period.
- Expected result: targets met or explicitly accepted as a known limitation by the human
  owner, with the reason recorded.

## 16. Ownership

- Agent-owned: indexes, pagination, job dispatch, rate limits, instrumentation, measurement.
- Human-owned: spend ceilings, pricing implications, acceptance of a missed target, provider
  plan upgrades.
- Shared: seeding staging and running the measured passes.

## 17. Rollback and remediation

Index additions are additive and safe to keep on rollback. Limit and threshold changes are
configuration, so remediation is a configuration change rather than a deploy. If a cost
ceiling is breached, the first action is the defined fallback behavior, not a silent
increase of the ceiling.

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
