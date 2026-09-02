# Production Readiness Review

Section 9 of `WORLD_CLASS_APP_THESIS.md`. This is a service specific review, not a generic
launch checklist. Every line needs evidence, not an opinion. Any unchecked line means the
status is Not ready for production release.

- Reviewed by: Claude Code, from the repository and from suites executed against the built
  static export. **Open:** the standard requires a named human reviewer. This review is
  evidence for that person, not a substitute for them.
- Date: 2026-09-02
- Commit or build: `claude/seo-manager-app-verify-ptc4e6`, merging the Local Growth OS
  foundation (`7b10301`). 62 routes, `npm run build` clean in both server and
  `GITHUB_PAGES=true` export modes.
- Service owner in production: **Open.** No named human is recorded anywhere in this
  repository. Line 32 fails on that alone.

## Scope of this review

Two questions are being answered separately, because they have different answers:

- **A. The public GitHub Pages demo.** A static, data-free showcase of the operating loop.
- **B. A first paid beta**, holding real agencies' real client data.

A line can pass for A and fail for B. Where it does, both are shown.

## Product

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 1 | Target user and problem are clear | Pass | `PRODUCT_BRIEF.md` — the SEO lead at a small local-services agency, and the "why is this client losing?" problem. |
| 2 | V1 scope is explicit | Pass | `PRODUCT_BRIEF.md` V1 scope and explicit non goals, both traced to the decisions in `docs/SOURCE_OF_TRUTH.md`. |
| 3 | Core success metrics are measurable | **Fail** | Metrics are defined in `PRODUCT_BRIEF.md`, but every baseline is unmeasured and every target is an open decision. There is no instrumentation of any kind. |
| 4 | Known assumptions are documented | Pass | `PRODUCT_BRIEF.md` assumptions table; all six are honestly marked Untested. |

## Functionality

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 5 | Core workflows have delivery contracts | **Fail** | `docs/contracts/` holds ten starter contracts, all unfilled. Every Critical row in `docs/production/WORKFLOW-RISK-REGISTER.md` shows contract status None. |
| 6 | Acceptance criteria are met | **Fail** | No contract exists, so there are no acceptance criteria to meet. `docs/reports/` holds one verification report for this pass only. |
| 7 | Happy paths and failure paths are tested | Pass for A, **Partial** for B | 30 unit, 22 authorization, 120 e2e and 56 accessibility checks cover all 62 routes on desktop and mobile, plus the 404 path. The abuse paths the standard requires are now covered *at the database*: wrong organization, altered id, altered body, no role, no identity, ownership transfer, privilege escalation and cross-tenant storage. The ones that need a server — expired tokens, reused tokens, stale sessions after suspension, malformed request bodies — remain untestable because there is no server. |
| 8 | Required integrations work in the appropriate environment | Pass for A, **Fail** for B | A needs none. For B, the 41 entries in `src/lib/integrations.ts` and the 12 providers in `src/lib/local-growth/connectors.ts` are all in mock mode and connect to nothing. The connector work is real progress — a typed adapter boundary with an explicit mock/live flag and a rule against manufacturing data for an unavailable source — but no adapter has ever run against a provider. The one live integration, `scripts/prospect-scanner`, is a CLI outside the product. |

## Security

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 9 | Authentication verified | n/a for A, **Fail** for B | There is no authentication. The RLS policies already read `auth.uid()`, so AUTH-001 has to populate that claim rather than design around it. `docs/production/INVENTORY.md`. |
| 10 | Server side authorization verified | n/a for A, **Partial** for B | There is no server. The authorization *rules* are verified where they will run — in Postgres, by the `authorization` job — but nothing sends a query through them yet. |
| 11 | Tenant isolation tested with two organizations | **Pass at the database; not yet reached by the application** | The migrations apply from empty, Organization Alpha and Organization Beta are seeded, and 22 tests in `tests/integration/tenant-isolation.spec.ts` cross-examine the boundary in the blocking `authorization` CI job. Disabling RLS on one table turns 8 of them red. The suite also refuses to run as a superuser or table owner, since both bypass RLS. What is still true: no application code queries that database, so nothing in the running product is protected by it yet. |
| 12 | Secrets protected, absent from client code and repository history | Pass | `bash .github/scripts/check-client-bundle.sh out` passes against the built export; no known secret pattern present. The one real credential, `RAPIDAPI_KEY`, lives in a git-ignored `.env` and is listed in `.github/scripts/server-only-vars.txt`. `security.yml` runs gitleaks over full history on every pull request. |
| 13 | Sensitive data handled per the data classification | Pass for A | No personal, customer or business data of any real party exists in the application. The five SEO Manager OS clients and the three Local Growth OS campaigns are fictional. For B this line has to be re-answered from scratch, and the campaign onboarding wizard is where to start: it collects a client's contract terms, economics and platform access states, which is the most sensitive collection in the product. |
| 14 | Security critical workflows independently verified | **Fail** | The tenant boundary is now verified by test, but by the same session that wrote the tests. Independent re-verification is outstanding, and it is the first thing a verifier should re-run. |
| 15 | No unresolved critical or high security finding | **Pass** | `npm audit` reports 0 vulnerabilities. The five high-severity Next.js and PostCSS advisories were closed by upgrading to Next.js 16 and ESLint 9, not by weakening the audit gate. |

## Quality

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 16 | Tests assert behavior, not implementation | Pass | `tests/unit/routes.spec.ts` asserts that links resolve, and was proved to fail by introducing a dead link. `tests/unit/scoring.spec.ts` asserts the bounds and directions `docs/SCORING.md` claims. The e2e suites drive the built export. |
| 17 | CI enforces critical regression checks | Pass | `.github/workflows/ci.yml` runs lint, typecheck, build, unit tests, the client bundle check, and the blocking `authorization` job that applies the migrations to a real Postgres and runs the tenant isolation suite; `e2e.yml` runs the workflow and accessibility suites; `security.yml` runs dependency audit, gitleaks and the bundle check. Rationale and deliberate omissions in `.github/workflows/README.md`. |
| 18 | Critical end to end workflows pass | Pass | 120 Playwright checks green across chromium and mobile: all 62 routes render with no client-side error, every navigation link resolves in both the SEO Manager OS shell and the Local Growth OS layer, the whole pipeline walks, discovery accepts input, a client record opens from the list, the client search filters, no key screen scrolls horizontally at 360px. This suite caught the async-`params` regression the Next.js 16 upgrade introduced, which had 404'd every dynamic route. |
| 19 | Failure and abuse paths tested | Partial | The 404 path and the full cross-tenant abuse set at the database are covered. What is not: anything needing a session or a request body, because there is no server. |
| 20 | Accessibility review complete for the product scope | **Partial** | Automated coverage is fully green: axe reports zero violations of every WCAG 2.0/2.1/2.2 A and AA rule across the 16 key screens at two viewports, contrast included, and the suite asserts zero rather than a baseline. Focus order, the skip link, the mobile dialog's focus trap, live regions, target size and reduced motion are each individually tested. **The human keyboard and screen reader passes have still not been performed**, and this line cannot pass without them. |

## Performance and cost

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 21 | Core workflows meet defined performance expectations | Partial | No expectation has been defined, so nothing can meet it. Measured: prerendered HTML, first-load JS 96 kB to 226 kB per route, heaviest on the Recharts screens; the Local Growth OS module screens sit at a consistent ~118 kB. |
| 22 | Important queries indexed and bounded | n/a for A, **Fail** for B | No database. Every list in the UI renders its whole array with no pagination, which will not survive a real portfolio. |
| 23 | High volume work uses pagination, queues, caching, or batching | n/a for A, **Fail** for B | None of the four exist. |
| 24 | Cost drivers measured and controlled | n/a for A, **Fail** for B | Nothing runs, so nothing costs. `ARCHITECTURE_DECISIONS.md` names the LLM fan-out as the dominant future driver and flags that an unmetered fan-out across a portfolio is the most plausible way this product loses money. |
| 25 | Usage and rate limits exist where necessary | n/a for A, **Fail** for B | Nothing to limit yet; mandatory in INTEGRATION-001. |

## Operations

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 26 | Error monitoring active | **Fail** | Nothing reports anywhere. A broken deploy is found by a person looking at the site. This fails for A as well as B. |
| 27 | Logs useful and free of sensitive values | n/a | There are no logs, because there is no server. |
| 28 | Health checks available and dependency aware | **Fail** | None. Even for a static site, nothing checks that the deployed page renders. |
| 29 | Alerts exist for meaningful failures | **Fail** | None. A failed Pages deployment notifies nobody. |
| 30 | Backup and recovery expectations documented and a restore performed once | Partial | `docs/runbooks/backup-restore.md` is installed. The repository is the only state and git is the backup, but no restore has been rehearsed. |
| 31 | Deployment and rollback procedures exist and rollback tested in staging | Partial | `deploy.yml` works and `docs/runbooks/rollback.md` is installed. There is **no staging environment**, so rollback has not been tested anywhere but production. |
| 32 | Named humans own production response | **Fail** | No name is recorded. `docs/runbooks/incident-response.md` has nobody in it. |

## Release

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 33 | Staging verification complete | **Fail** | There is no staging environment. Changes go from a pull request to production. |
| 34 | Release blockers resolved or explicitly accepted by the human owner | Partial | Accepted for A in the standing acceptance in `docs/production/WORKFLOW-RISK-REGISTER.md`. Not accepted for B, and cannot be until a named owner accepts them. |
| 35 | Post release smoke tests defined | Pass | `docs/runbooks/deployment.md`, and `npm run test:e2e` can be pointed at the deployed URL with `TEST_BASE_URL`. |
| 36 | Post release monitoring window defined | **Fail** | Not defined, and there is nothing to monitor with. |
| 37 | Known limitations documented honestly | Pass | `docs/production/INVENTORY.md` "Known defects" and this file. |

## Decision

- **Status: Not ready for production release** as a product holding customer data.
  The public demo at A may continue; it holds no real data and its limitations are recorded.

  The reason has changed, and it is worth stating precisely. It is no longer that the
  controls are missing or unproven — the tenant boundary is tested, the dependency
  advisories are cleared, and the accessibility floor is met. It is that **nothing in the
  running application goes through any of it**, there is no named owner to accept the risk,
  no staging environment to rehearse a release in, and nothing that would notice if the
  deployed site broke.

**Closed since the last review:** the five high-severity dependency advisories (Next.js 16),
all 184 colour contrast failures, the missing focus management on the mobile drawer, the
silent status changes, the unlabelled controls, the misleading login screen, the scanner's
unbounded network calls, and — the largest one — the tenant boundary, which is now executed
and cross-examined by a blocking CI job rather than sitting in the repository as unrun SQL.

- **Blocking items for a first paid beta**, in the order they have to be answered:
  1. **Name the accountable human** (line 32, and the owner fields in `PRODUCT_BRIEF.md`,
     `ARCHITECTURE_DECISIONS.md` and `docs/runbooks/incident-response.md`). Everything else
     needs someone to accept it. **This is now the single largest blocker**, because most of
     what remains is a decision rather than a task.
  2. **Decide which product this is.** SEO Manager OS and Local Growth OS ship in one shell
     with two client models, two task boards and two report flows, and nothing reconciles
     them. Every item below costs twice while that is true (line 37).
  3. **Error tracking, health check and alerting.** Worth doing now, before any backend,
     because the deployed demo still fails silently (lines 26, 28, 29, 36).
  4. **Stand up a staging environment** (lines 31, 33).
  5. **AUTH-001, then ORG-001's remaining scope: wiring.** The boundary is proven; the
     application does not use it. AUTH-001 populates `auth.uid()` from a real Supabase
     session, ORG-001 routes the application's queries through the policies, and the
     `authorization` job stays blocking throughout. Never issue the application a
     service-role key: it bypasses RLS and would undo all 194 policies at once
     (lines 9, 10, 11).
  6. **Contract the remaining Critical workflows** in
     `docs/production/WORKFLOW-RISK-REGISTER.md` (lines 5, 6).
  7. **Run the human keyboard and screen reader passes.** Automated coverage is at zero
     violations, which is the floor, not the finish (line 20).
  8. **Independent verification** of this work by a session that did not do it (line 14).
  9. **Set metric targets and instrument them** (lines 3, 21, 24).
  10. **Pagination and bounded queries** before the first real portfolio (lines 22, 23).

- **Accepted known limitations, with the human owner who accepted each:** none yet, beyond
  the standing acceptance for the public demo recorded in
  `docs/production/WORKFLOW-RISK-REGISTER.md`. Every item above needs an owner's name against
  it before it counts as accepted rather than outstanding.

- **Post release monitoring window and who is watching:** undefined, and there is currently
  nothing to watch with. This must be answered as part of blocking item 4.
