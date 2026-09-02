# Security Audit

Baseline: OWASP ASVS. Cross tenant and role boundary testing follows the OWASP authorization
regression testing approach. Run in a session or with an agent that did not implement the
code.

- Auditor: Claude Code. **Note on independence:** this same session installed the delivery
  standard and made the verification changes on this branch. Under the standard's own rule
  the implementer does not get to certify the work, so this audit is **evidence for a
  verifier, not a verification**. A different session or person must re-run it.
- Date: 2026-09-02
- Commit and environment: `a7dbb93` plus the verification changes on
  `claude/seo-manager-app-verify-ptc4e6`. Audited against the built static export in `out/`
  and the repository source. No deployed environment was exercised.
- Contracts in scope: none. No contract in `docs/contracts/` has been filled in.

## Verdicts

Each row gets one of: Confirmed secure, Confirmed finding, Insufficient evidence, or Not
applicable. Insufficient evidence is not a pass.

## The finding that governs every row below

This application has **no server, no database, no authentication, no authorization, no
session, no API route, no server action, no job and no webhook**. It is a static export
served from a CDN (`docs/production/INVENTORY.md`, `ARCHITECTURE_DECISIONS.md`).

Most rows below are therefore **Not applicable** — not "secure". The distinction matters:
these controls are absent, not passing, and every one of them becomes a Confirmed finding on
the day a backend lands without it. `docs/production/WORKFLOW-RISK-REGISTER.md` records the
rule that turns them into release blockers.

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
| 10 | Every protected action authorized on the server | Not applicable | No server, and nothing is protected. Every route is public static HTML. |
| 11 | Default deny where permission is not explicitly granted | Not applicable | No permission model. |
| 12 | Role checked, not only authentication | Not applicable | The "Owner" strings on client records and the seats listed in Settings are display-only mock data. |
| 13 | Record ownership and organization checked | Not applicable | No ownership concept. |
| 14 | Only authorized fields returned | Not applicable | Everything in the bundle is returned to everyone. |
| 15 | Plan, entitlement, rate, and account status enforced | Not applicable | None exist. |
| 16–18 (client switching as an access control) | **Confirmed finding, informational** | `src/components/engagement/store.tsx` switches which client the UI renders. It is a view filter with no security property whatsoever. It is recorded as such in `ARCHITECTURE_DECISIONS.md` specifically so that a future backend does not inherit it as if it were a boundary. |

## Input and output

| # | Control | Verdict | Evidence |
|---|---|---|---|
| 19 | All external input validated at the server boundary | Not applicable | There is no server boundary. The only inputs are local form fields whose values never leave the browser. |
| 20 | Output encoding appropriate to the context | Confirmed secure | All rendering is through React JSX, which escapes by default. There is no `dangerouslySetInnerHTML` anywhere in `src/` (verified by search). |
| 21 | File type, size, and name validated server side | Not applicable | The file inputs in `src/components/investigation/evidence-panel.tsx` accept a selection and display the name. No file is read, parsed, uploaded or stored. |
| 22 | Error responses leak no internals or personal data | Confirmed secure | The only error surface is the static 404 page, which says "This page could not be found." |

## Secrets and configuration

| # | Control | Verdict | Evidence |
|---|---|---|---|
| 23 | No secret in the client bundle | Confirmed secure | `bash .github/scripts/check-client-bundle.sh out` run against the built export: no known secret pattern present, and no value of any name in `.github/scripts/server-only-vars.txt`. The job runs on every pull request in `ci.yml` and `security.yml`. |
| 24 | No secret in repository history | Insufficient evidence | `security.yml` runs `gitleaks detect` over full history on every pull request, but that job has not yet executed on this branch — it is new in this change. Re-check this row after the first CI run. |
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
| 33 | Provider credentials server side only | Confirmed secure | No provider credential exists in the web application. The 41 entries in `src/lib/integrations.ts` are catalogue rows with mock connection states and no client, key or request. `RAPIDAPI_KEY` is read by a Node CLI and is never bundled. |
| 34 | Timeout, retry, and rate limit behavior defined | **Confirmed finding, low** | `scripts/prospect-scanner/scan.mjs` calls JSearch with no explicit timeout, no retry policy and no rate limiting. It is a single-operator CLI, so the impact is a hung command or a wasted quota rather than a production incident, but the behaviour is undefined. |

## Findings

### [High] Five unresolved high-severity dependency advisories

- **Workflow:** the whole application, via the Next.js 14 toolchain.
- **Expected:** `npm audit --audit-level=high` passes, per the `Dependency audit` job in
  `.github/workflows/security.yml`.
- **Observed:** five high-severity advisories remain after `npm audit fix`: `next`,
  `postcss` (transitively via `next`), `eslint-config-next`, `@next/eslint-plugin-next` and
  `glob`. Every one is fixable only by upgrading to Next.js 16, a major version change. The
  audit surface was reduced from 14 vulnerabilities (1 critical, 10 high, 3 moderate) to 5
  high in this pass by pinning Vitest to v4 and applying the non-breaking fixes.
- **Evidence:** `npm audit --json` at the branch head. The advisories are
  GHSA-68g3-v927-f742, GHSA-4633-3j49-mh5q, GHSA-4c39-4ccg-62r3, GHSA-p9j2-gv94-2wf4 and
  GHSA-955p-x3mx-jcvp for Next.js, plus the four PostCSS `sourceMappingURL` advisories.
- **Impact:** **Assessed as nil for the deployed artifact.** Every Next.js advisory concerns
  a server-side feature — response cache confusion, Server Action payloads on the Edge
  runtime, SSRF via rewrite destinations, and internal Server Function endpoint disclosure.
  This application ships `output: "export"`: there is no Next.js server, no rewrite engine,
  no Server Action and no Server Function in production. The PostCSS advisories concern a
  build-time CSS toolchain processing this repository's own stylesheets, not attacker input.
  The real impact is on CI: the `Dependency audit` job fails, which it should, because the
  advisories are genuine.
- **Remediation:** upgrade to Next.js 16 and `eslint-config-next` 16, or record an owner's
  written, dated acceptance with an expiry. Do not weaken the audit job to hide it.
- **Verification required:** after any upgrade, the full e2e and accessibility suites plus a
  visual check of the design system, because a Next.js major is not a drop-in.
- **Owner:** the human product owner. This is a framework-upgrade decision, not a bug fix,
  and it is listed as blocking item 7 in `PRODUCTION_READINESS.md`.

### [Informational] The application has no security controls because it has nothing to secure

Recording this deliberately rather than leaving a page of green ticks. Sections 1–18 above
are Not applicable, and a reader skimming verdicts could mistake that for a clean bill. It is
not one. It is the statement that the entire authentication, authorization and tenancy
surface is unbuilt, and that `docs/production/WORKFLOW-RISK-REGISTER.md` makes each of those
controls a hard release blocker on the commit that first needs it.

### [Low] Undefined timeout, retry and rate-limit behaviour in the prospect scanner

See control 34. Remediation: an `AbortSignal.timeout`, a bounded retry with backoff on 429
and 5xx, and a delay between pages in `scripts/prospect-scanner/scan.mjs`. Owner: engineering.

## Release decision

- Any Confirmed finding at Critical or High is a release blocker.
- **Decision: Conditionally ready** — for the public GitHub Pages demo only, which holds no
  real data. **Not ready** for any deployment holding customer data, on the strength of the
  absent authentication, authorization and tenancy surface rather than on any exploitable
  defect in what exists.
- Human owner accepting any temporary risk, with reason and expiry date: **not yet
  accepted.** The High dependency finding needs a named owner either to schedule the
  Next.js 16 upgrade or to accept it in writing with an expiry date. Until one of those
  happens it is outstanding, not accepted.
