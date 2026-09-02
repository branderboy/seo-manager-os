# Independent Codebase and Production Readiness Audit

## Audit scope
- Repository, branch, commit: `branderboy/seo-manager-os`, branch
  `claude/seo-manager-app-verify-ptc4e6`, merging the Local Growth OS foundation (`7b10301`,
  PR #52) into the verification work started from `a7dbb93`.
- Environment available: local only. The built application served by `next start`, a
  `GITHUB_PAGES=true` export served through `scripts/serve-export.mjs`, both exercised in
  Chromium at 1440×900 and 412×915, and a live Postgres 16 carrying the real migrations.
  **No deployed environment, no staging, and no CI run were available.** Nothing below is a
  claim about production.
- Contracts reviewed: none exist. All ten starter contracts in `docs/contracts/` are unfilled.
- Auditor: Claude Code. **This is not an independent audit under the standard's own rule.**
  The same session installed the delivery standard, wrote the tests and made the fixes,
  including the tests that close its own findings. It is evidence assembled for an independent
  verifier, and it should be read with that conflict in mind. Someone else must re-run it; the
  handoff steps, including how to check that the authorization suite still bites, are in
  `docs/reports/AUDIT-001-2026-09-02-delivery.md`.
- Date: 2026-09-02

## Executive decision
- **Status: Not ready** as a product holding customer data. **Conditionally ready** as the
  public, data-free GitHub Pages demo it currently is.
- **Critical findings:** none in the code that exists. The critical gap is what does not
  run: no authentication, no authorization, no live database, no server, no persistence
  beyond the visitor's own browser. That is a stated project position, not a defect, but it
  is the reason the product cannot hold a customer's data.
- **High findings: none open.** All three from the previous revision are closed: the
  dependency advisories (Next.js 16, `npm audit` now reports zero), the 184 colour contrast
  failures (fixed at the token level, suite asserts zero), and the untested tenant model
  (executed, and cross-examined by 22 tests in a blocking CI job).
- **Critical workflows not independently verified:** all of them. Every Critical row in
  `docs/production/WORKFLOW-RISK-REGISTER.md` shows contract status None.
- **Main release blockers:** the ten listed in `PRODUCTION_READINESS.md`. They are now
  mostly decisions rather than defects, headed by naming an accountable human, deciding
  which of the two product surfaces is the product, and making the application observable.

## Confirmed strengths

- **Strength:** the operating loop actually works end to end, across both product surfaces.
  **Evidence:** 120 Playwright checks green across desktop and mobile — all 62 routes render
  with no client-side error, every navigation link resolves in both shells, the nine-stage
  pipeline walks, discovery accepts input, a client record opens from the list.
  **Affected workflow:** every pipeline stage and every Local Growth OS module.

- **Strength:** the Local Growth OS design gets the two hardest things right on paper.
  Tenant isolation is Row Level Security in Postgres rather than a `WHERE organization_id`
  the application must remember, and the audit → roadmap → task chain keeps the finding id
  as a foreign key so evidence and work stay attached. Both are the choices a team usually
  makes only after being burned.
  **Evidence:** `supabase/migrations/202608300001_local_growth_os.sql`,
  `src/lib/local-growth/types.ts`.
  **Affected workflow:** tenant isolation, and the audit-to-work chain.

- **Strength:** the honesty rules are written down as code, not aspiration.
  **Evidence:** `src/lib/local-growth/ai-guardrails.ts` makes AI output draft-only and bars
  fabricating credentials, service areas, pricing, reviews, rankings and results;
  `connectors.ts` carries an explicit `mock` / `live` mode with the rule "never hide an
  unavailable source by manufacturing data"; revenue is left unavailable when the source
  does not supply it. This is the same principle as the grounded scoring model, applied to
  ingestion and to generation.
  **Affected workflow:** every generated artifact.

- **Strength:** the scoring model is real engineering, not a mock.
  **Evidence:** `src/lib/scoring.ts` returns a `Traceable` carrying the inputs and the
  intermediate terms for every score, matching the "no invented numbers" decision in
  `docs/SOURCE_OF_TRUTH.md`. 23 unit tests pin its bounds, directions, caps and the absence
  of a zero divisor.
  **Affected workflow:** diagnosis and prioritisation.

- **Strength:** no secret has ever been near the client bundle.
  **Evidence:** `check-client-bundle.sh out` passes; the one real credential belongs to a CLI
  outside the web application and is git-ignored; there is no `dangerouslySetInnerHTML`
  anywhere in `src/`.
  **Affected workflow:** all.

- **Strength:** the codebase is disciplined. TypeScript strict, `tsc --noEmit` clean, ESLint
  clean at `--max-warnings 0`, a coherent token-based design system, and mock data separated
  into `src/lib/*.ts` rather than scattered through components — which is why a backend can
  be slid underneath it.
  **Evidence:** `npm run verify` green.

- **Strength:** the project's own documentation is unusually honest.
  **Evidence:** `docs/SOURCE_OF_TRUTH.md` states "Backend: 0%", "As a shippable product:
  ~10–15% done" and "No tests, no CI for the app itself". An audit that has to start by
  puncturing optimistic docs starts a long way back. This one did not.

## Confirmed findings

The three High findings from the previous revision are resolved. What remains is one Medium
that is a product decision, one Medium that is build work, and two smaller ones.

### [Resolved] Five high-severity dependency advisories
Closed by upgrading Next.js 14.2.35 → 16.3.4 and ESLint 8 → 9. `npm audit` reports zero
vulnerabilities, down from fourteen. Detail, and what the upgrade cost, in
`docs/audits/security-audit.md`.

### [Resolved] Colour contrast failed WCAG AA in 184 places
Closed at the token level; the automated suite now asserts zero violations of every A and AA
rule rather than a baseline. Detail in `docs/audits/accessibility-audit.md` finding A1.

### [Resolved] A tenant model that had never been executed
Closed. The migrations run from empty, two organizations are seeded, and 22 tests attempt to
cross the boundary and fail to, in a blocking CI job. Disabling RLS on one table turns 8 of
them red. The previous revision called this the most important row in the register; it is now
the strongest thing in the repository.

### [Medium] Two product surfaces in one shell, unreconciled
- Affected workflow: all of them.
- Expected behavior: one product with one client model.
- Observed behavior: SEO Manager OS (Client + Engagement, nine stages, `/tasks`, `/reports`)
  and Local Growth OS (Campaign, modules, `/growth/tasks`, `/growth/reports`) ship side by
  side with two navigation systems, two client models and two sets of task and report
  screens. Nothing maps one to the other.
- Evidence: `src/lib/model.ts` and `src/lib/engagements.ts` against
  `src/lib/local-growth/types.ts`.
- Impact: **this is now the largest open item, and it is not a code fix.** Every remaining
  blocker — wiring the backend, instrumenting metrics, adding pagination, writing contracts —
  costs twice while both surfaces are live, and each week of parallel building raises the
  cost of choosing.
- Recommended remediation: decide which is the product, or how they compose, before either
  gets a backend.
- Required verification: a recorded decision, not a test.
- Owner: **Human. This one cannot be delegated.**

### [Medium] The application is unobservable
- Affected workflow: all, including the demo that is live today.
- Expected behavior: a failure is noticed by a system, not by a person.
- Observed behavior: no error tracking, no logging, no health check, no uptime monitoring and
  no alert on a failed Pages deployment. Unchanged from the previous revision.
- Impact: a broken deploy stays broken until someone looks. It is the cheapest blocker on the
  list and it applies now, not after a backend.
- Recommended remediation: client-side error reporting, plus an uptime check on the deployed
  URL that alerts a named person.
- Owner: Human.

### [Medium] The proven tenant boundary is not yet used
- Affected workflow: every workflow that will hold customer data.
- Expected behavior: the application's queries go through the policies.
- Observed behavior: `grep -rl supabase src` returns nothing; `@supabase/supabase-js` is not
  a dependency. Every screen still renders mock data.
- Impact: subtle and worth naming. A team reading "tenant isolation: verified" may conclude
  the product is protected. The database is protected. The product does not use the database.
- Recommended remediation: AUTH-001 populates `auth.uid()` from a real session; ORG-001
  routes queries through the policies. Never issue the application a service-role key — it
  bypasses RLS and would undo all 194 policies in one line.
- Owner: Engineering, under an approved contract.

### [Medium] Silent data loss in the daily task engine
- Affected workflow: `/tasks`.
- Observed behavior: `src/components/tasks/task-store.tsx` holds tasks in `React.useState`
  while the engagement, agent-deploy and tour stores all persist. A reload silently discards
  the day's work with no warning. Unchanged.
- Recommended remediation: persist on the same pattern as the other three — which is now a
  three-line change, since `src/lib/persistent-store.ts` exists — or say in the UI that it
  does not save.
- Owner: Shared.

### [Medium] The product presents capabilities it does not have
- Affected workflow: `/integrations`, `/strategy`, `/reports`, `/research`, `/agents`.
- Observed behavior: 41 integrations offer a Connect toggle that changes local UI state only;
  brief and report "Share" produce a link that opens nothing; file pickers accept a file and
  read nothing; deploying an agent runs nothing.
- Note: `/growth/login` is no longer on this list. It now states on screen that nothing is
  authenticated, and the demo credentials it published are gone.
- Recommended remediation: a persistent "demo data" indicator in the shell.
- Owner: Product.

### [Low] No staging environment
- Observed behavior: `deploy.yml` publishes to production on every push to the default
  branch. Rollback has never been rehearsed anywhere but production, so readiness lines 31
  and 33 cannot pass.
- Owner: Human.

## Suspected risks requiring evidence

- **Risk:** the mobile menu is a keyboard trap, or loses focus on close.
  **Why suspected:** `src/components/layout/mobile-nav.tsx` has no focus management.
  **Evidence needed:** a human keyboard pass. **Owner:** Engineering.

- **Risk:** lists will not survive a real portfolio.
  **Why suspected:** every list renders its whole array; there is no pagination anywhere.
  **Evidence needed:** render `/clients` and `/tasks` with a realistic 50-client,
  1,000-task fixture and measure. **Owner:** Engineering.

- **Risk:** the LLM fan-out is the product's largest uncontrolled cost.
  **Why suspected:** `docs/SOURCE_OF_TRUTH.md` specifies a multi-LLM fan-out plus a judge per
  tracked prompt per client; `ARCHITECTURE_DECISIONS.md` names it as the dominant cost driver
  with no limit designed.
  **Evidence needed:** a cost model per client per month before the first agent runs.
  **Owner:** Human.

- **Risk:** the Orchestrator, named in `docs/AGENTS.md` as the difference between "a
  coordinated senior team" and "eight disconnected tools", is entirely unbuilt and untested.
  **Evidence needed:** one real client run, end to end, graded by an SEO lead.
  **Owner:** Human.

- **Risk:** the SaaS and Enterprise dashboards are parked by decision but still built, linked
  and maintained.
  **Evidence needed:** a decision to remove them or to un-park them. **Owner:** Product.

- **Risk:** the policies are correct against plain Postgres but behave differently on
  Supabase.
  **Why suspected:** `supabase/test/00_supabase_shim.sql` recreates `auth.users`,
  `auth.uid()` and the storage schema so the migrations can run in CI. It proves the
  *policies* are right; it does not prove Supabase's own auth and storage services behave as
  the policies assume around them.
  **Evidence needed:** one `supabase db reset` against a real Supabase instance, then the
  same suite pointed at it. **Owner:** Engineering.

## Claims not independently verified

- **Claimed behavior:** the CI workflows pass.
  **Why it cannot be confirmed:** they are new in this change and have never executed on
  GitHub. Every job was run locally, but a local run is not a CI run.
  **Evidence required:** one green run on this branch. **Release impact:** none yet.

- **Claimed behavior:** no secret exists in repository history.
  **Why it cannot be confirmed:** the gitleaks job has still not run.
  **Evidence required:** the first `security.yml` execution. **Release impact:** low. Expect
  one hit: the `/growth/login` demo password, removed from the working tree but still in
  history. It authenticates nothing.

- **Claimed behavior:** the deployed site works.
  **Why it cannot be confirmed:** no deployed environment was reachable from this session. All
  results are from a local static server that mirrors the Pages behaviour; it is not Pages.
  **Evidence required:** `TEST_BASE_URL=<pages url> npm run test:e2e`. **Release impact:**
  medium — the `GITHUB_PAGES=true` basePath build was never exercised here.

- **Claimed behavior:** the application is accessible to screen reader users.
  **Why it cannot be confirmed:** no screen reader was run, and zero automated violations is
  the floor rather than the finish. **Evidence required:** a human pass. **Release impact:**
  high. Nobody should claim screen reader support on this evidence, however green it looks.

- **Claimed behavior:** the tenant boundary holds.
  **Why it cannot be fully confirmed:** it was proven by the same session that wrote both the
  fixture and the tests. The tests are adversarial and were shown to fail when RLS is
  removed, which is real evidence, but it is not independent.
  **Evidence required:** a verifier who did not write them re-running
  `npm run db:test:setup && npm run test:authz`, and reading the fixture for anything it
  quietly makes easy. **Release impact:** high, and it is the first thing to re-check.

## Contract status

- Contract ID: AUTH-001, ORG-001, CORE-001, ADMIN-001, FILES-001, BILLING-001,
  INTEGRATION-001, OBS-001, PERF-001, AUDIT-001.
- Status: **Unverified** — all ten remain the standard's unfilled starter forms.
- Missing proof: for nine of them, everything. **ORG-001 is the exception worth noting:** its
  acceptance criteria — two organizations, no cross-tenant read by list or by id, no
  cross-tenant write, storage scoped the same way, all blocking in CI — are already met and
  evidenced by `tests/integration/tenant-isolation.spec.ts`. The contract still has to be
  written and approved, but its remaining scope is wiring rather than proving.
- Required next action: draft AUTH-001 and ORG-001, and do not write backend code until they
  are approved. `docs/production/WORKFLOW-RISK-REGISTER.md` names the trigger for each.

## Prioritized remediation plan

1. Name the accountable human in `PRODUCT_BRIEF.md`, `ARCHITECTURE_DECISIONS.md`,
   `PRODUCTION_READINESS.md` and `docs/runbooks/incident-response.md`. Nothing else can be
   accepted until someone can accept it.
2. Decide whether SEO Manager OS or Local Growth OS is the product, or how they compose.
   Everything below costs twice while both surfaces are live.
3. Add error tracking, a health check and an alert on the deployed demo. Cheapest item on the
   list, and it applies to what is live today.
4. Run a human keyboard and screen reader pass. The automated floor is met; the majority of
   real problems are still unlooked-for.
5. Have someone who did not write it re-run the authorization suite and read the fixture.
6. Fix the silent task-state loss, or label the demo honestly.
7. Draft and approve AUTH-001, then ORG-001's remaining scope: wiring the application to the
   boundary that already works, with the `authorization` job kept blocking.
8. Stand up staging and rehearse a rollback there.
9. Set the metric targets in `PRODUCT_BRIEF.md` and instrument them.
10. Add pagination and bounded queries before the first real portfolio.

## Release decision

- **Decision: Approved with limitations** for the public GitHub Pages demo, which holds no
  real data and whose limitations are documented. **Not approved** for any release holding
  customer data.
- The reason has changed since the previous revision and it is worth being precise about.
  It is no longer that the controls are missing, unproven or failing: the dependency
  advisories are cleared, the accessibility floor is met with zero automated violations, and
  the tenant boundary is executed and adversarially tested in a blocking job. It is that
  **the application does not use any of it**, no human owns the release, there is no staging
  environment, and nothing would notice if the deployed site broke.
- **Required actions before release:** items 1 through 8 above, and every Critical row in
  `docs/production/WORKFLOW-RISK-REGISTER.md` carrying an approved, implemented and
  independently verified contract.
- **Required human approvals:** a named product owner must accept this audit, the security
  audit and the accessibility audit. There are no open High findings left to accept, which
  means the approvals are now about the plan rather than about carrying risk.
- **Post release monitoring requirements:** currently unmeetable — there is nothing to monitor
  with. Remediation item 3 is the prerequisite.
