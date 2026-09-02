# integration tests

See ../README.md for what belongs here and what a test has to prove.

## Status in this repository

`tenant-isolation.spec.ts` is live and blocking. It replaced the delivery standard's Prisma
original, which assumed a stack this repository does not run.

Run it with:

```bash
npm run db:test:setup   # shim + real migrations + seed + two-tenant fixture
npm run test:authz
```

It needs a Postgres. `DATABASE_URL` points the setup script at an admin connection;
`TEST_DATABASE_URL` points the suite at the test database as the unprivileged `app_test`
role. CI provides both (`.github/workflows/ci.yml`, the `authorization` job).

### The two things that make it real

**It runs the shipped SQL.** `scripts/db-test-setup.sh` applies the actual files from
`supabase/migrations/`, not a copy. If the migration is wrong, the test is wrong in the same
way, and you find out.

**It refuses to run privileged.** Postgres exempts superusers and table owners from row level
security entirely. A policy suite connected as the owner passes every assertion without
evaluating a single policy — it is the most common way this kind of test lies. The first
describe block asserts the connection is neither, and fails the run if it is.

### Proving the suite still bites

A test that cannot fail is decoration. Check it periodically:

```sql
alter table public.clients disable row level security;
```

Re-run `npm run test:authz`: 8 of the 22 tests must fail. Re-enable and they must all pass
again. If they stay green with RLS off, something has gone wrong with the connection role and
the whole file is worthless until it is fixed.

### What is still missing

No application code queries this database. The boundary is proven; nothing uses it. That is
ORG-001's remaining scope, and the rule that must survive it: **never give the application a
service-role key**, because it bypasses RLS and would undo all 194 policies at once.
