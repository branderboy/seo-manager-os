# Production Readiness Review

Section 9 of `WORLD_CLASS_APP_THESIS.md`. This is a service specific review, not a generic
launch checklist. Every line needs evidence, not an opinion. Any unchecked line means the
status is Not ready for production release.

- Reviewed by: Claude Code, from the repository and from suites executed against the built
  static export. **Open:** the standard requires a named human reviewer. This review is
  evidence for that person, not a substitute for them.
- Date: 2026-09-02
- Commit or build: `a7dbb93` plus the verification changes on
  `claude/seo-manager-app-verify-ptc4e6`. Static export, 29 routes, `npm run build` clean.
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
| 7 | Happy paths and failure paths are tested | Pass for A, **Fail** for B | 94 unit tests and Playwright checks across 29 routes on desktop and mobile cover the happy paths that exist, plus the 404 path. The failure and abuse paths the standard requires (`tests/README.md`) are all about auth, tenancy and server input, none of which exist. |
| 8 | Required integrations work in the appropriate environment | Pass for A, **Fail** for B | A needs none. For B, all 41 entries in `src/lib/integrations.ts` are catalogue entries that connect to nothing. The one live integration, `scripts/prospect-scanner`, is a CLI outside the product. |

## Security

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 9 | Authentication verified | n/a for A, **Fail** for B | There is no authentication. `docs/production/INVENTORY.md`. |
| 10 | Server side authorization verified | n/a for A, **Fail** for B | There is no server. |
| 11 | Tenant isolation tested with two organizations | n/a for A, **Fail** for B | There is no tenancy. The client switcher is a view filter, not a boundary — `ARCHITECTURE_DECISIONS.md` says so explicitly so that nobody later mistakes it for one. |
| 12 | Secrets protected, absent from client code and repository history | Pass | `bash .github/scripts/check-client-bundle.sh out` passes against the built export; no known secret pattern present. The one real credential, `RAPIDAPI_KEY`, lives in a git-ignored `.env` and is listed in `.github/scripts/server-only-vars.txt`. `security.yml` runs gitleaks over full history on every pull request. |
| 13 | Sensitive data handled per the data classification | Pass for A | No personal, customer or business data of any real party exists in the application. All five client records are fictional. For B this line has to be re-answered from scratch. |
| 14 | Security critical workflows independently verified | **Fail** | None exist to verify. |
| 15 | No unresolved critical or high security finding | **Fail** | `npm audit` reports 5 high-severity advisories, all requiring the Next.js 14 → 16 major upgrade. Exposure is assessed as nil for a static export in `docs/audits/security-audit.md`, but the finding is open and the `Dependency audit` job in `security.yml` fails on it by design. |

## Quality

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 16 | Tests assert behavior, not implementation | Pass | `tests/unit/routes.spec.ts` asserts that links resolve, and was proved to fail by introducing a dead link. `tests/unit/scoring.spec.ts` asserts the bounds and directions `docs/SCORING.md` claims. The e2e suites drive the built export. |
| 17 | CI enforces critical regression checks | Pass | `.github/workflows/ci.yml` runs lint, typecheck, build, unit tests and the client bundle check; `e2e.yml` runs the workflow and accessibility suites; `security.yml` runs dependency audit, gitleaks and the bundle check. Rationale and deliberate omissions in `.github/workflows/README.md`. |
| 18 | Critical end to end workflows pass | Pass | 64 Playwright checks green across chromium and mobile: every route renders with no client-side error, every navigation link resolves, the whole pipeline walks, discovery accepts input, a client record opens from the list, no key screen scrolls horizontally at 360px. |
| 19 | Failure and abuse paths tested | Partial | The 404 path is covered. Everything else the standard lists is auth, tenancy and server input validation, which do not exist. |
| 20 | Accessibility review complete for the product scope | **Fail** | Automated coverage is green except colour contrast: 82 WCAG 1.4.3 failures across the 11 key screens, ratcheted in `tests/e2e/accessibility.spec.ts` and detailed in `docs/audits/accessibility-audit.md`. The human keyboard and screen reader passes have not been performed. |

## Performance and cost

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 21 | Core workflows meet defined performance expectations | Partial | No expectation has been defined, so nothing can meet it. Measured: static prerendered HTML on a CDN, first-load JS 96 kB to 226 kB per route, heaviest on the Recharts screens. |
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

- **Blocking items for a first paid beta**, in the order they have to be answered:
  1. **Name the accountable human** (lines 32, and the owner fields in `PRODUCT_BRIEF.md`,
     `ARCHITECTURE_DECISIONS.md` and `docs/runbooks/incident-response.md`). Everything else
     needs someone to accept it.
  2. **Decide the tenant model, then AUTH-001 and ORG-001** — contracts approved before
     implementation, with the two-organization isolation tests and `test:authz` blocking in
     CI (lines 9, 10, 11, 14).
  3. **Stand up a staging environment** (lines 31, 33).
  4. **Error tracking, health check and alerting** — this one is worth doing now, before any
     backend, because the demo currently fails silently (lines 26, 28, 29, 36).
  5. **Contract the Critical workflows** in `docs/production/WORKFLOW-RISK-REGISTER.md`
     (lines 5, 6).
  6. **Decide on colour contrast** and run the human keyboard and screen reader passes
     (line 20).
  7. **Decide on Next.js 16** (line 15).
  8. **Set metric targets and instrument them** (lines 3, 21, 24).
  9. **Pagination and bounded queries** before the first real portfolio (lines 22, 23).

- **Accepted known limitations, with the human owner who accepted each:** none yet, beyond
  the standing acceptance for the public demo recorded in
  `docs/production/WORKFLOW-RISK-REGISTER.md`. Every item above needs an owner's name against
  it before it counts as accepted rather than outstanding.

- **Post release monitoring window and who is watching:** undefined, and there is currently
  nothing to watch with. This must be answered as part of blocking item 4.
