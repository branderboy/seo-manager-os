# Security Audit

Baseline: OWASP ASVS. Cross tenant and role boundary testing follows the OWASP authorization
regression testing approach. Run in a session or with an agent that did not implement the
code.

- Auditor: Claude Code. **Note on independence:** this same session installed the delivery
  standard, made every fix, and wrote the tests that prove them. Under the standard's own rule
  the implementer does not get to certify the work, so this audit is **evidence for a
  verifier, not a verification**. A different session or person must re-run it. The
  authorization suite is the first thing to re-run, and the way to check it is to break the
  boundary on purpose and confirm the tests notice — the steps are in
  `docs/reports/AUDIT-001-2026-09-02-delivery.md`.
- Date: 2026-09-02
- Commit and environment: `claude/seo-manager-app-verify-ptc4e6`. Audited against the built
  application, the repository source, **and a live Postgres 16 carrying the real migrations
  from `supabase/migrations/`**. The claims about the RLS policies below are results, not
  readings: they come from 22 executed cross-tenant attempts.
- Contracts in scope: none. No contract in `docs/contracts/` has been filled in.

## Verdicts

Each row gets one of: Confirmed secure, Confirmed finding, Insufficient evidence, or Not
applicable. Insufficient evidence is not a pass.

## The finding that governs every row below

The running application has **no server, no live database, no authentication, no
authorization, no session, no API route, no server action, no job and no webhook**. Nothing
in `src/` connects to anything (`docs/production/INVENTORY.md`).

Most rows below are therefore **Not applicable** — not "secure". The distinction matters:
these controls are absent, not passing, and every one of them becomes a Confirmed finding on
the day a backend lands without it.

**The data layer is a different story, and it is now good news.** 1,359 lines of Supabase
SQL define a tenant-scoped schema, 194 Row Level Security policies, a six-role model and
storage policies. Since the last revision of this audit they have been **executed and
tested**:

- The three migrations apply cleanly from an empty database, followed by the demo seed.
- Two organizations are seeded and 22 tests attempt to cross the boundary between them:
  by listing, by naming a foreign id directly, by insert, by update, by ownership transfer,
  by self-granted role, and through the `client-assets` storage bucket. All are refused.
- A user with no role, and a request with no identity, read nothing.
- The suite asserts that its own connection is neither a superuser nor a table owner,
  because Postgres exempts both from RLS and a suite run as the owner would pass without
  evaluating a single policy.
- Disabling RLS on one table turns 8 of the 22 red, so the tests are not decoration.
- It runs as a blocking job on every pull request (`authorization` in `ci.yml`).

The remaining gap is **wiring, not design or proof**: no application code queries that
database (`grep -rl supabase src` returns nothing) and `@supabase/supabase-js` is not a
dependency. So the Authorization rows below read "verified in the database, not yet reached
by the application" rather than "not applicable".

## Authentication

| # | Control | Verdict | Evidence |
|---|---|---|---|
| 1 | Registration only through approved flows | Not applicable | No registration exists. No identity of any kind in `src/`. |
| 2 | Email ownership verified where email is the identity | Not applicable | The invite field in `src/components/discovery/client-invite.tsx` sends nothing. |
| 3 | Passwords handled by a trusted system, never logged | Not applicable | No password field exists anywhere. |
| 4 | Reset and verification tokens time limited and single use | Not applicable | No tokens exist. |
| 5 | Invalid, expired, tampered, and reused tokens fail safely | Not applicable | As above. |
| 6 | Session cookies or tokens configured securely | Not applicable | No cookie is set. State is `localStorage` under `smos.*`. |
| 7 | Sessions invalidated after password change or suspension | Not applicable | No sessions. |
| 8 | Errors do not reveal whether an account exists | Not applicable | No accounts. |
| 9 | Privileged accounts carry stronger safeguards | Not applicable | No privilege model. |

## Authorization

| # | Control | Verdict | Evidence |
|---|---|---|---|
| 10 | Every protected action authorized on the server | Not applicable **in the application**; verified where it will run | There is still no server, and every route is public static content over mock data. The authorization rules themselves are verified in Postgres, which is where they belong — the database refuses a cross-tenant query rather than trusting the caller to have filtered. |
| 11 | Default deny where permission is not explicitly granted | **Confirmed secure at the database** | RLS is enabled on all 50 public tables (asserted by test) and Postgres RLS is default-deny once enabled. Verified: a request with no identity reads nothing from `clients`, `organizations`, `campaigns` or `monthly_reports`. |
| 12 | Role checked, not only authentication | **Confirmed secure at the database** | Verified: a `client_viewer` scoped to one client sees that client and no other, including no other client inside its own agency, and cannot alter internal audit findings. An authenticated user with no role at all reads nothing. The UI's own role picker at `/growth/login` remains display-only and says so. |
| 13 | Record ownership and organization checked | **Confirmed secure at the database** | Verified against two seeded organizations: Alpha's admin cannot list or directly name Beta's client, cannot insert into Beta, cannot rename Beta's client, and cannot move its own client into Beta. Beta's admin sees exactly one client and one organization. The preflight/finalize pair around the `clients` table's own policies applies cleanly and produces the right result. |
| 14 | Only authorized fields returned | Not applicable | Everything in the bundle is returned to everyone. |
| 15 | Plan, entitlement, rate, and account status enforced | Not applicable | None exist. |
| 16–18 (client switching as an access control) | **Confirmed finding, informational** | `src/components/engagement/store.tsx` switches which client the UI renders. It is a view filter with no security property whatsoever. It is recorded as such in `ARCHITECTURE_DECISIONS.md` specifically so that a future backend does not inherit it as if it were a boundary. |

## Input and output

| # | Control | Verdict | Evidence |
|---|---|---|---|
| 19 | All external input validated at the server boundary | Not applicable | There is no server boundary. The only inputs are local form fields whose values never leave the browser. |
| 20 | Output encoding appropriate to the context | Confirmed secure | All rendering is through React JSX, which escapes by default. There is no `dangerouslySetInnerHTML` anywhere in `src/` (verified by search). |
| 21 | File type, size, and name validated server side | Not applicable for content; **path scope confirmed** | The file inputs in `src/components/investigation/evidence-panel.tsx` accept a selection and display the name. No file is read, parsed, uploaded or stored. The storage policies that will govern uploads are tested: an object under `<organization_id>/<client_id>/…` is readable only by that organization, and a member of one organization cannot insert into another's folder. File type and size validation remains unwritten, and belongs to FILES-001. |
| 22 | Error responses leak no internals or personal data | Confirmed secure | The only error surface is the static 404 page, which says "This page could not be found." |

## Secrets and configuration

| # | Control | Verdict | Evidence |
|---|---|---|---|
| 23 | No secret in the client bundle | Confirmed secure | `bash .github/scripts/check-client-bundle.sh out` run against the built export: no known secret pattern present, and no value of any name in `.github/scripts/server-only-vars.txt`. The job runs on every pull request in `ci.yml` and `security.yml`. |
| 24 | No secret in repository history | Insufficient evidence | `security.yml` runs `gitleaks detect` over full history on every pull request, but that job has still not executed — it is new in this change. Re-check this row after the first CI run. Note that the one credential-shaped string this repository ever published, the `/growth/login` demo password, was removed from the working tree but **remains in git history**, where a history scan will find it. It authenticates nothing, so the finding is cosmetic, but expect it. |
| 25 | Secrets stored in an approved secret system | Confirmed secure, for what exists | The only real credential is `RAPIDAPI_KEY` for `scripts/prospect-scanner`, read from a local `.env` that `scripts/prospect-scanner/.gitignore` excludes. There is no secret system because there is nothing else to store. |
| 26 | Least privilege for keys, database access, and service accounts | Insufficient evidence | The deploy workflow uses GitHub OIDC with `contents: read`, `pages: write`, `id-token: write`, which is appropriate. The RapidAPI key's scope on the operator's account cannot be verified from the repository. |

## Data protection

| # | Control | Verdict | Evidence |
|---|---|---|---|
| 27 | Data classification exists and matches what is actually stored | Confirmed secure | `docs/production/INVENTORY.md` classifies the data as: none. All five client records (Northwind, Flowdesk, Vantage, Acme, Hill Country) are fictional demo accounts, verified by reading `src/lib/crm.ts` and `src/lib/model.ts`. |
| 28 | Retention and deletion behavior matches the stated policy | Not applicable | Nothing is retained server side. A visitor deletes everything by clearing their own browser storage. |
| 29 | Personal data absent from logs, analytics, and support tooling | Not applicable | There are no logs, no analytics and no support tooling. |
| 30 | Backups protected to the same standard as live data | Not applicable | No data, so no backups. The git repository is the only state. |

## Integrations

| # | Control | Verdict | Evidence |
|---|---|---|---|
| 31 | Webhook signatures verified | Not applicable | No webhook receiver exists. |
| 32 | Replay and duplicate delivery handled idempotently | Not applicable | As above. |
| 33 | Provider credentials server side only | Confirmed secure | No provider credential exists in the web application. The 41 entries in `src/lib/integrations.ts` and the 12 providers in `src/lib/local-growth/connectors.ts` are catalogue rows and mock adapters with no client, key or request. `RAPIDAPI_KEY` is read by a Node CLI and is never bundled. The README correctly documents that service-role and OAuth client secrets must never carry the `NEXT_PUBLIC_` prefix. |
| 34 | Timeout, retry, and rate limit behavior defined | **Confirmed secure** | Fixed. `scripts/prospect-scanner/scan.mjs` now bounds every call: a 20-second request timeout via `AbortSignal.timeout`, three attempts with exponential backoff, `Retry-After` honoured on 429, retries limited to what is worth retrying (timeouts, network errors, 429, 5xx), and a delay between pages so a multi-page scan does not trip the provider's limit. |

## Findings

### [Resolved] Five unresolved high-severity dependency advisories

Closed. Next.js 14.2.35 → 16.3.4, ESLint 8 → 9 with a flat config, `eslint-config-next` 16.
`npm audit` now reports **0 vulnerabilities**, down from 14 (1 critical, 10 high, 3 moderate)
when this work started. The gate was not weakened to get there.

The upgrade was not free, and what it cost is worth recording because it is evidence for how
much a deferred major costs later: `next lint` was removed so ESLint runs directly; six
`react-hooks/set-state-in-effect` errors surfaced and were fixed properly rather than
suppressed (three `localStorage` stores moved to `useSyncExternalStore`, three derived-state
effects became render-time comparisons); and `params` became a Promise, which 404'd every
dynamic route until four page files were made async. That last one was caught by the e2e
suite, not by a person — it is the clearest argument in this repository for why the tests
were worth writing first.

### [Resolved] A public demo rendered a sign-in that authenticated nothing

Closed. `/growth/login` now says on screen that it is a demo workspace selector, that nothing
is authenticated, and that the real boundary lives in `supabase/migrations`. The five demo
email addresses and the password that were printed on the page and in `README.md` are gone.
They remain in git history, where a secret scan will flag them; they authenticate nothing, so
that is cosmetic, but do not be surprised by it.

### [Resolved] A tenant model that existed only as SQL

Closed, and it is the most substantial change in this revision. The previous version of this
audit called an unexecuted policy "more dangerous than an obvious gap, because it reads like
a control to everyone who sees the file". It has now been run.

`scripts/db-test-setup.sh` applies the Supabase shim, the three real migrations, the demo
seed and a two-organization fixture to a live Postgres.
`tests/integration/tenant-isolation.spec.ts` then attempts to cross the boundary 22 ways and
fails to. It runs as a blocking CI job. Removing RLS from a single table turns 8 of those
tests red, which is the evidence that they test something.

Two caveats, stated plainly. The shim in `supabase/test/00_supabase_shim.sql` recreates the
small part of Supabase the migrations reference — `auth.users`, `auth.uid()`, the storage
schema — so this proves the *policies* are correct, not that Supabase's own auth and storage
services behave as expected around them. And the application still does not query this
database at all, so nothing in the running product is protected by it yet.

### [Open, informational] The proven boundary is not yet used

The policies are correct and tested. No application code goes through them: `grep -rl
supabase src` returns nothing and `@supabase/supabase-js` is not a dependency. The risk this
creates is a subtle one — a team that has read "tenant isolation: verified" may assume the
product is protected. It is not. The database is. Wiring the application to it is AUTH-001
and ORG-001, and the single rule that must survive that work is: **never give the application
a service-role key**, because it bypasses RLS and would silently undo all 194 policies.

## Release decision

- Any Confirmed finding at Critical or High is a release blocker.
- **Decision: Conditionally ready** — for the public GitHub Pages demo, which holds no real
  data. **Not ready** for any deployment holding customer data.
- There are now **no open Critical or High security findings**. The three that existed —
  the dependency advisories, the misleading sign-in, and the unexecuted tenant model — are
  resolved above. What still blocks a customer-data release is not a defect: it is that
  authentication does not exist and the proven boundary is not yet wired to the application.
- Human owner accepting any temporary risk, with reason and expiry date: **nothing left to
  accept.** No finding is being carried. The remaining work is build work, tracked in
  `PRODUCTION_READINESS.md`, and this audit needs re-running by someone who did not write
  the code before any of it counts as independently verified.
