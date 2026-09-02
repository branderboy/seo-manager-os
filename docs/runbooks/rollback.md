# Runbook: Rollback

Owner: **Open — no named human is recorded in this repository.**
Last tested in staging: **never. There is no staging environment.** Rollback that has never
been executed is a hypothesis, and this one is a hypothesis. `PRODUCTION_READINESS.md`
blocking item 3.

## Decide

Roll back when the site fails to load, when a route is blank or 404s, when assets 404 because
the basePath build is wrong, or when a change is visibly broken in front of users. Do not
debug in production while users are affected if a rollback is available.

The bar is low here: there is no data to lose and no state to strand, so rolling back a static
export costs almost nothing. Prefer it to a hotfix.

## Application rollback

Two options, in order of preference:

**1. Re-run the previous good deployment (fastest).**
- Open the Actions tab, find the last `Deploy to GitHub Pages` run that was green *and* whose
  commit was good, and re-run it. The build is deterministic from the commit.
- Duration: 2–4 minutes plus CDN propagation.

**2. Revert and push.**
- `git revert <bad commit>` on the default branch and push. The workflow redeploys.
- Prefer this when the bad commit will otherwise be redeployed by the next unrelated push.
- Duration: 2–4 minutes plus CDN propagation.

Previous known good build: the Actions history for `deploy.yml`, and the `github-pages`
deployment history in the repository's Environments tab.

Verification after rollback: run the smoke test in `deployment.md`.

**If Pages itself is the problem**, neither option helps. There is no second host configured;
that is an accepted limitation of the current single-environment setup.

## Database rollback

**Not applicable.** There is no database and there are no migrations. This section becomes
real on the first migration, and the standard's rules apply from that moment:

- Additive migrations first. Backfill separately from the deploy that reads the new column.
- Destructive migrations require human approval and a backup taken immediately before.
- If a rollback would strand data written after the deploy, correct forward instead and say so
  explicitly in the incident record.

| Migration | Reversible | Down path | Data written since deploy | Correction approach |
|---|---|---|---|---|
| None exist | — | — | — | — |

## Side effects that cannot roll back

**None today.** The application sends no email, takes no payment, acknowledges no webhook,
writes no file and creates no third-party record. The only writes it performs are to the
visitor's own `localStorage` under `smos.*`, which a rollback neither needs nor is able to
touch — and which a visitor can clear themselves.

One consequence worth naming: if a future change alters the shape of a `localStorage` value,
rolling the code back will leave returning visitors holding data the older code did not write.
Version those keys before that becomes possible.

## After

Record what was rolled back, why, what data was affected, and which contract failed to catch
it. That last line is the one that prevents a repeat.
