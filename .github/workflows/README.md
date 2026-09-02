# CI contract

The workflows call npm scripts by name rather than naming a test framework. That keeps the
pipeline stable while the tooling underneath changes.

This repository runs a Next.js 16 application with no server of its own and no
authentication (`docs/production/INVENTORY.md`). It does have a database schema, and the
`authorization` job is real: it applies the migrations in `supabase/migrations/` to a live
Postgres and tries to cross the tenant boundary. The standard's integration and migration
jobs are still absent, because there is no application code to integrate and no migration
history to diff against. `docs/production/WORKFLOW-RISK-REGISTER.md` records what puts them
back.

## Scripts CI calls

| Script | What it must do | Used by |
|---|---|---|
| `lint` | ESLint via `next lint --max-warnings 0`, non zero exit on error | ci.yml |
| `typecheck` | `tsc --noEmit`, non zero exit on error | ci.yml |
| `build` | Production build, writes the static export to `out/` | ci.yml, e2e.yml, security.yml |
| `test:unit` | Vitest over `tests/unit`, no server needed | ci.yml |
| `db:test:setup` | Apply the Supabase shim, the real migrations, the seed and the two-tenant fixture to a live Postgres | ci.yml |
| `test:authz` | The tenant isolation suite. Its own job, so a failure is unmistakable | ci.yml |
| `test:e2e` | Playwright critical workflows, desktop and mobile, starts the export server itself | e2e.yml |
| `test:a11y` | axe on the key screens, plus the keyboard and landmark checks | e2e.yml |
| `start` | Serve `out/` the way GitHub Pages does, via `scripts/serve-export.mjs` | playwright.config.ts |

`next.config.mjs` builds in Next.js server mode by default and only produces a static export
when `GITHUB_PAGES=true`. `npm run start` (`next start`) is therefore the right command for
the default build, and `npm run start:export` serves the Pages artifact — `next start`
refuses to run against an export. The export server takes `--base-path /seo-manager-os` so it
reproduces how Pages serves the site.

## Not present, and why

| Standard job | Status here | Restored when |
|---|---|---|
| `format:check` | Absent. ESLint is the enforced style gate. Adopting Prettier would reformat the whole codebase inside a verification change. | Someone adopts Prettier deliberately, in its own commit. |
| `test:integration` | The script exists and runs the same config, but there is nothing beyond the authorization suite in `tests/integration/` yet. | The first API route or server action lands. |
| `db:verify` | Absent. There is one migration set and no history to diff a schema file against, so Prisma's drift check has no analogue here. | A second round of migrations, or a generated schema file to diff. |

## Why `test:authz` gets its own job

A tenant isolation failure buried inside a large integration run gets skimmed past. Its own
job, with its own red mark, is the difference between a blocked release and a release that
went out anyway. **Never add `continue-on-error` to that step.**

Two things about that job are load-bearing and should survive any refactor of it. It applies
the **real** migrations from `supabase/migrations/`, not a copy — the point is that the
shipped SQL is what gets tested. And the suite connects as a role that is neither a superuser
nor a table owner, because Postgres exempts both from row level security: run as the owner,
every assertion passes without evaluating a single policy. `tests/fixtures/tenants.md`
explains the fixture; `supabase/test/00_supabase_shim.sql` explains what stands in for
Supabase.

## If a script does not exist yet

Delete the step, or point it at a script that fails loudly. Do not leave a step that exits
zero without doing anything. A green check that proves nothing is worse than no check,
because the release gate then reads it as evidence.

## Client bundle check

`.github/scripts/check-client-bundle.sh out` fails the build if a server only value reaches
the browser. In a static export every byte in `out/` reaches the browser, so this is the
only data boundary the application currently has. List this project's variables in
`.github/scripts/server-only-vars.txt`, and make sure those variables are available to the
workflow so their values can actually be compared. The script fails rather than passes when
it cannot find a build directory.

## Deployment

`deploy.yml` typechecks, lints and builds with `GITHUB_PAGES=true` on pull requests, and
additionally publishes `out/` to GitHub Pages on pushes to the repository default branch. It
overlaps `ci.yml` on lint and typecheck; that duplication is deliberate for now, because
`deploy.yml` is the job that gates what actually reaches production. See
`docs/runbooks/deployment.md`.
