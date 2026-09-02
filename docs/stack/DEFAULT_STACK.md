# Default stack

This kit ships wired for the stack most AI assisted SaaS applications are actually built on
today. Nothing in `WORLD_CLASS_APP_THESIS.md` depends on it. If you swap a piece, change the
commands and keep the structure.

| Layer | Choice | Why this is the default |
|---|---|---|
| Framework | Next.js, App Router, TypeScript | Server components and route handlers put authorization on the server by default, which is the single control this standard cares most about |
| Database | PostgreSQL | Row level security exists if you need it, and every host offers it |
| ORM and migrations | Prisma | Tracked migrations, a typed client, and a schema file an auditor can read |
| Unit and integration tests | Vitest | Fast, TypeScript native, one config style for both layers |
| End to end and accessibility | Playwright with axe-core | Real browser, real cookies, traces on failure |
| Password hashing | bcryptjs in the seed | Only used to seed fixtures. Your app should use its auth provider |
| CI | GitHub Actions | The workflows in `.github/workflows/` |
| Hosting | Any Node host | Nothing here assumes a specific host |

## What ships in this kit

```
package.json.example         The exact scripts CI calls. Merge into your package.json
.env.example                 Variables the tests and CI expect
prisma/schema.prisma         Starter schema: Organization, User, Membership, Campaign, AuditLog
tests/fixtures/seed.ts       Seeds Organization Alpha and Organization Beta
tests/helpers/auth.ts        The one place your auth is wired into the tests
tests/integration/tenant-isolation.spec.ts   The cross tenant matrix that blocks release
tests/e2e/critical-workflows.spec.ts         Sign in, core object life cycle, cross tenant
tests/e2e/accessibility.spec.ts              axe on key routes
vitest.config.ts             Unit tests
vitest.integration.config.ts Integration tests, longer timeout, serial
playwright.config.ts         Starts the built app, traces and video on failure
```

## Install

```bash
npm i -D vitest @playwright/test @axe-core/playwright prisma tsx typescript \
        eslint prettier bcryptjs @types/bcryptjs @types/node wait-on
npm i @prisma/client
npx playwright install --with-deps
```

Then merge the scripts from `package.json.example` into your `package.json`, copy
`.env.example` to `.env`, and run:

```bash
npm run db:migrate
npm run db:seed:test
npm run test:authz
```

If `test:authz` passes on an app with no authorization code in it, the test is wrong, not
the app. Read the note at the top of `tests/integration/tenant-isolation.spec.ts`.

## The one integration point

`tests/helpers/auth.ts` is the only file that knows how your app signs a user in. It ships
with the common shape, a POST to a credentials route that sets a session cookie. Change that
one function to match your auth provider and every other test keeps working.

## Migrations and the down path

Prisma has no automatic down migration. That is a real gap in this stack, not an oversight
here. The CI migration job proves migrations apply cleanly from an empty database and that
the schema matches the migration history. The reverse path is your responsibility per
contract, and section 17 of every contract is where it gets written: either a hand authored
down SQL file, or a forward fix with the data correction spelled out. A contract that says
"roll back the deploy" for a schema change has not answered the question.

## Swapping a piece

| Swap | Change |
|---|---|
| Drizzle instead of Prisma | `db:*` scripts, `tests/fixtures/seed.ts` queries. Same gap on down migrations |
| Jest instead of Vitest | `test:*` scripts. Specs need almost no change |
| Cypress instead of Playwright | `test:e2e`, `test:a11y`, and the two e2e specs |
| Supabase or Neon | `DATABASE_URL` only. Keep the service container in CI for speed |
| Not Next.js | Keep the tests. They hit HTTP, not framework internals |
