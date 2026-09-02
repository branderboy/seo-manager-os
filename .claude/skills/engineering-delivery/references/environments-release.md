# Environments and release

Four environments: local for fast iteration, test for automated runs with controlled
fixtures, staging with production like configuration and sanitized data and real provider
sandboxes, production with live users and human approved changes.

## Rules

- Do not test destructive actions in production unless explicitly approved.
- Do not use production secrets in local development.
- Local success does not imply staging success. Staging success does not imply production
  readiness.
- Verify environment dependent flows in staging: email, OAuth, webhooks, file storage,
  payment sandbox, queues, scheduled jobs, redirects, DNS, and deployment behavior.
- Keep environment configuration documented without exposing secrets.

## Release procedure

1. All relevant contracts Verified.
2. No critical or high blocker outstanding, or written acceptance by the human owner.
3. Staging healthy with current evidence for this commit.
4. Migrations reviewed and the rollback path confirmed.
5. Monitoring, alerts, logs, and dashboards live.
6. Deploy gradually where possible.
7. Watch the predefined indicators.
8. Pause or roll back at a stop condition.
9. Run the smoke test against production.
10. Record the release, outcome, and follow up work.

Procedures: `docs/runbooks/deployment.md` and `docs/runbooks/rollback.md`. The release
decision is human owned in every case.
