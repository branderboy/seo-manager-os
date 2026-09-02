# Runbook: Backup and restore

Owner: **Open — no named human is recorded in this repository.**
Last successful restore test: **never performed.** `PRODUCTION_READINESS.md` line 30.

A backup nobody has restored is not a backup. Restore once before launch and record the date
here.

## What there is to back up

The application stores **no data**. There is no database, no file storage and no server-side
state (`docs/production/INVENTORY.md`). The only state that exists anywhere is:

- the **git repository**, which is the source of truth and is its own backup, and
- each visitor's own **browser `localStorage`** under `smos.*`, which belongs to that visitor,
  is not readable by anyone else, and is deliberately disposable.

This is why the tables below are mostly "not applicable". They will not be for long — the
first backend commit makes every row real, and the row that will matter most is the one that
does not exist yet: customers' client data.

## Backup policy

| What | Where | Frequency | Retention | Encrypted | Verified |
|---|---|---|---|---|---|
| Database | Not applicable — none is running. The schema for one exists in `supabase/migrations/`; this row becomes mandatory the day it is applied to anything holding real data. | — | — | — | — |
| File storage | Not applicable — none is running. The `client-assets` bucket and its policies are defined in the same migration. | — | — | — | — |
| Configuration and secrets | The web app has none. `RAPIDAPI_KEY` lives in the operator's local, git-ignored `scripts/prospect-scanner/.env` and is **not backed up anywhere**. | — | — | No | No |
| Source code and history | GitHub, plus every developer clone | On every push | Indefinite | In transit and at rest by GitHub | Implicitly, by every clone |
| Deployed artifact | Rebuilt deterministically from any commit | On demand | — | — | Yes — `npm run build` reproduces it |

## Objectives

- Recovery point objective, meaning acceptable data loss: **zero, trivially**, because no data
  is stored. This number is meaningless today and must be set for real before the first
  customer record exists.
- Recovery time objective, meaning acceptable downtime: **minutes** — the time to re-run a
  deployment. See `rollback.md`.

## Restore procedure

Today, restoring the service means redeploying it:

1. Identify the last good commit from the `deploy.yml` run history.
2. Re-run that deployment, or check the commit out and push it.
3. Verify with the smoke test in `deployment.md`.

The standard's procedure — restore to a separate environment, check row counts and one known
record per tenant, confirm authentication works, confirm the tenant boundary holds in the
restored copy — is the procedure to adopt the day there is a database. It is left here
deliberately as the target, not deleted:

1. Identify the target point in time and confirm the backup exists for it.
2. Restore into a separate environment first, never over live data.
3. Verify: row counts on core tables, one known record per tenant, authentication works, and
   file references resolve.
4. Confirm the tenant boundary still holds in the restored copy.
5. Decide with the human owner whether to promote the restore or export specific records.

## Restore test record

| Date | Backup used | Environment | Duration | Result | Notes |
|---|---|---|---|---|---|
| — | — | — | — | Never performed | There is nothing to restore. This row becomes mandatory with the first database. |

## Known gaps

- **The scanner's API key is not backed up.** If the operator's machine is lost, the key is
  regenerated from RapidAPI. Low impact, but nobody should assume it is recoverable.
- **GitHub Pages configuration** — the Pages settings and the custom domain, if one is ever
  added — is not captured in the repository. Re-configuring it is manual.
- **Visitor `localStorage`** is not backed up and must never be assumed recoverable. If a
  workflow ever depends on it surviving, that workflow needs a server.
