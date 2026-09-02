# Runbook: Deployment

Owner: **Open — no named human is recorded in this repository.** Record one here before the
next release; `PRODUCTION_READINESS.md` line 32 fails until this is filled in.
Last tested: 2026-09-02 (the pipeline is exercised on every push to the default branch; see
the caveats below for what has *not* been tested).

## What deployment means here

`next.config.mjs` sets `output: "export"`. A deploy publishes ~29 prerendered HTML pages and
their assets to GitHub Pages. There is no server, no migration, no restart and no warm-up.
Most of the risk a deployment runbook normally manages does not exist here — and saying so
plainly is more useful than a checklist of steps that do not apply.

## Before deploying

1. All relevant delivery contracts are Verified. **Today: none exist.** Treat every deploy as
   unverified against a contract until `docs/contracts/` is filled in.
2. No critical or high release blocker remains, or the human owner has accepted it in writing.
   **Today: the standing acceptance in `docs/production/WORKFLOW-RISK-REGISTER.md` covers the
   public demo only.**
3. Staging is healthy. **Today: there is no staging environment.** This is blocking item 3 in
   `PRODUCTION_READINESS.md`.
4. Migrations reviewed. **Not applicable** — no database.
5. Monitoring and alerts are live and someone is watching. **Today: none exist.** A failed
   deploy notifies nobody. Blocking item 2.
6. CI is green on the commit: `ci.yml` (lint, typecheck, build, unit, client bundle) and
   `e2e.yml` (critical workflows, accessibility).

## Deploy

- Command or pipeline: `.github/workflows/deploy.yml`, triggered by a push to the repository
  default branch (`claude/app-identification-repo-64akmz`) or by `workflow_dispatch`.
- Environment: production — GitHub Pages, `github-pages` environment.
- Strategy: all at once. Static files behind a CDN; there is no meaningful canary for a page
  set this size, and no server state to drain.
- Steps the workflow runs: `npm ci` → `npm run build` with `GITHUB_PAGES=true` (which selects
  the `/seo-manager-os` basePath and assetPrefix) → `touch out/.nojekyll` →
  `actions/upload-pages-artifact` → `actions/deploy-pages`.
- Migration step: none.
- Expected duration: 2–4 minutes, plus up to a few minutes for the Pages CDN to serve the new
  version.

## Watch

There is nothing automated to watch with. Until blocking item 2 is closed, "watching" means a
person opening the site. Recorded honestly rather than left as an empty table:

| Indicator | Where | Normal | Stop condition |
|---|---|---|---|
| Workflow result | The Actions run for `deploy.yml` | Both jobs green | Either job red — the previous version stays live, so this is a failed publish, not an outage |
| Site loads | The Pages URL | The Command Center renders | A blank page or a 404 at the site root |
| Asset paths | Browser devtools, network tab | No 404s | Any 404 on a `/seo-manager-os/_next/...` asset, which means the basePath build is wrong |
| Error rate, p95 latency, failed jobs, webhook processing, auth success rate | **Not instrumented** | — | — |

Monitoring window after release: **30 minutes of human attention**, because that is all that
is available. Named watcher: **open**.

## Smoke test

The standard's default smoke test assumes sign-in, a core object and an integration path,
none of which exist. The equivalent for this application is the e2e suite pointed at the real
deployment:

```bash
TEST_BASE_URL=<the deployed Pages URL> npm run test:e2e
```

That checks all 29 routes render with no client-side error on desktop and mobile, every
navigation link resolves, and the pipeline walks. If Playwright is not to hand, do it by
hand in five minutes:

1. Open the site root. The Command Center renders with data.
2. Click through the sidebar: Clients, SEO Pipeline, Performance, AI Workforce, Insights,
   Playbooks, Reports, Integrations, Settings. No blank screens.
3. Open a client record from the `/clients` table.
4. Walk `/discovery` → `/research` → `/diagnosis` → `/strategy` → `/tasks` → `/reports`.
5. Open devtools and confirm the console is clean and no asset 404s.
6. Repeat step 1 at a phone width.

**Caveat that matters:** the `GITHUB_PAGES=true` basePath build has never been exercised by
the test suites, only by the deploy itself. Step 5 is the step that catches a basePath
regression.

## Record

Log the release, its outcome, anything abnormal, and follow up work in the release notes.
