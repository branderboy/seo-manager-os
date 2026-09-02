# integration tests

See ../README.md for what belongs here and what a test has to prove.

## Status in this repository

`tenant-isolation.spec.ts` and `../fixtures/seed.ts` are the delivery standard's originals,
kept unchanged. This application has no server, no database, and no tenancy
(`docs/production/INVENTORY.md`), so they cannot run. They are excluded from `tsconfig.json`
and from every CI job, and they count for nothing.

They are not coverage. `docs/production/WORKFLOW-RISK-REGISTER.md` records the release rule:
the moment authentication or a database is added, ORG-001 and AUTH-001 must be contracted,
these specs wired to the real routes, and `test:authz` made a blocking CI job.

**That moment is closer than it was.** `supabase/migrations/` now holds a full multi-tenant
schema with Row Level Security policies, a six-role model, storage policies and a seed — and
not one line of it has been executed, seeded or tested. The specs here are the right shape
for proving it: two organizations, and every cross-tenant read attempt failing. Wiring them
to a real Supabase instance is the single highest-value test work available in this
repository.
