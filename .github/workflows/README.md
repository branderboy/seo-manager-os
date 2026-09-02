# CI contract

The workflows call npm scripts by name rather than naming a test framework. That keeps the
pipeline stable while the tooling underneath changes.

This repository runs a Next.js 14 static export with no server, no database, and no
authentication (`docs/production/INVENTORY.md`). The delivery standard's `ci.yml` also
carries integration, migration, and authorization jobs; those are deliberately absent here
rather than present and skipping, because a job that cannot run is not a passing job.
`docs/production/WORKFLOW-RISK-REGISTER.md` records the rule that puts them back.

## Scripts CI calls

| Script | What it must do | Used by |
|---|---|---|
| `lint` | ESLint via `next lint --max-warnings 0`, non zero exit on error | ci.yml |
| `typecheck` | `tsc --noEmit`, non zero exit on error | ci.yml |
| `build` | Production build, writes the static export to `out/` | ci.yml, e2e.yml, security.yml |
| `test:unit` | Vitest over `tests/unit`, no server needed | ci.yml |
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
| `format:check` | Absent. ESLint is the enforced style gate. Adopting Prettier now would reformat the whole codebase inside a verification change. | Someone adopts Prettier deliberately, in its own commit. |
| `test:integration` | Absent. There are no routes, jobs, or webhooks to integrate against. | The first API route or server action lands. |
| `test:authz` | Absent. There is no authentication and no tenancy to isolate. | AUTH-001 or ORG-001 is contracted. Then it is its own job, blocking, and never `continue-on-error`. |
| `db:migrate`, `db:verify`, `db:seed:test` | Absent. No migration has ever been executed here. | **Sooner than the others.** `supabase/migrations/` already holds the schema, the RLS policies and a seed; what is missing is a job that runs them. A `supabase db reset` in CI plus a two-organization isolation suite would turn 1,152 lines of unproven SQL into a tested boundary. |

## Why `test:authz` gets its own job when it exists

A tenant isolation failure buried inside a large integration run gets skimmed past. Its own
job, with its own red mark, is the difference between a blocked release and a release that
went out anyway.

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
