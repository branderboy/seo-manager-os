# Pillar 7: Reliability, observability, and operations

Contract: OBS-001. Procedures: `docs/runbooks/`.

When something breaks, the team needs to answer: what failed, who is affected, when it
began, what changed, how serious it is, the safe recovery action, whether it can be rolled
back, and who owns the response. Every capability below exists to answer one of those.

Required: error tracking, structured logs with request and tenant context and no sensitive
values, performance monitoring, background job visibility, integration failure visibility, a
dependency aware health check, alerts for error rate and failed jobs and payment or webhook
failures and auth outages and abnormal latency, a backup policy with a restore that has
actually been run once, a tested rollback, a migration recovery plan, an incident runbook,
and a named human who owns production response.

## Resilience

Assume these will happen and define detection, user visible behavior, retry, idempotency,
logging, escalation owner, recovery, and containment for each: provider error, provider slow
response, duplicate webhook, duplicate job run, double form submit, slow query, regression in
a deploy, missing environment variable, queue backlog, failed email, stale browser session,
malformed upload, provider API change or rate limit, and unauthorized access attempt.

## The rule agents get wrong

Writing a runbook is not testing a runbook. A restore that has never been performed and a
rollback that has never been executed are both hypotheses. OBS-001 requires the runs, with
dates.
