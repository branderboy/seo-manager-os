# Independent Codebase and Production Readiness Audit

## Audit scope
- Repository, branch, commit: `branderboy/seo-manager-os`, branch
  `claude/seo-manager-app-verify-ptc4e6`, merging the Local Growth OS foundation (`7b10301`,
  PR #52) into the verification work started from `a7dbb93`.
- Environment available: local only. The built static export in `out/`, served by
  `scripts/serve-export.mjs`, exercised in Chromium at 1440×900 and 412×915. **No deployed
  environment, no staging, and no CI run were available.** Nothing below is a claim about
  production.
- Contracts reviewed: none exist. All ten starter contracts in `docs/contracts/` are unfilled.
- Auditor: Claude Code. **This is not an independent audit under the standard's own rule.**
  The same session installed the delivery standard, wrote the tests and made the fixes. It is
  evidence assembled for an independent verifier. Someone else must re-run it.
- Date: 2026-09-02

## Executive decision
- **Status: Not ready** as a product holding customer data. **Conditionally ready** as the
  public, data-free GitHub Pages demo it currently is.
- **Critical findings:** none in the code that exists. The critical gap is what does not
  run: no authentication, no authorization, no live database, no server, no persistence
  beyond the visitor's own browser. That is a stated project position, not a defect, but it
  is the reason the product cannot hold a customer's data.
- **High findings:** three. Five unresolved high-severity dependency advisories requiring the
  Next.js 14 → 16 upgrade (`docs/audits/security-audit.md`); 184 WCAG 1.4.3 colour contrast
  failures across the key screens (`docs/audits/accessibility-audit.md`); and a multi-tenant
  schema with Row Level Security policies that has never been executed, seeded or tested.
- **Critical workflows not independently verified:** all of them. Every Critical row in
  `docs/production/WORKFLOW-RISK-REGISTER.md` shows contract status None.
- **Main release blockers:** the nine listed in `PRODUCTION_READINESS.md`, headed by naming
  an accountable human, deciding the tenant model, and standing up a staging environment.

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

### [High] Five unresolved high-severity dependency advisories
- Affected workflow: the whole application.
- Expected behavior: `npm audit --audit-level=high` passes in `security.yml`.
- Observed behavior: five high-severity advisories remain, all requiring Next.js 16.
- Evidence: `npm audit --json`. Full detail in `docs/audits/security-audit.md`.
- Impact: nil for the deployed artifact — every advisory concerns a Next.js server feature a
  static export does not have — but the CI job fails, correctly.
- Recommended remediation: upgrade, or record a dated owner acceptance with an expiry.
- Required verification: full e2e, accessibility and a visual design pass after any upgrade.
- Owner: Human.

### [High] A tenant model that has never been executed
- Affected workflow: tenant isolation — the control the whole product depends on.
- Expected behavior: a policy that has been run, seeded and tested against two organizations.
- Observed behavior: 1,152 lines of correct-looking RLS SQL that no migration run, no seed,
  no test and no CI job has ever touched. No code loads it; `@supabase/supabase-js` is not
  even a dependency.
- Evidence: `supabase/migrations/`; `grep -rl supabase src` returns nothing.
- Impact: the danger is not that the SQL is wrong. It is that a team reads it and stops
  treating tenant isolation as open. An unrun policy reads like a control.
- Recommended remediation: ORG-001 runs the migrations, seeds two organizations, and proves
  isolation by altered id, altered request body and storage path, blocking in CI.
- Required verification: those tests, green, in a CI run.
- Owner: Human.

### [High] Colour contrast fails WCAG AA in 184 places
- Affected workflow: every screen.
- Expected behavior: 4.5:1 for normal text at AA.
- Observed behavior: 184 distinct failing elements across the 16 key screens. The two product
  surfaces fail differently: SEO Manager OS traces to about five design-token decisions,
  while the Local Growth OS screens use `slate-500`/`slate-600` on white and `slate-50`. Two
  sets of decisions, not one palette failing on more pages.
- Evidence: axe-core, both viewports. Detail and remediation in
  `docs/audits/accessibility-audit.md` finding A1.
- Impact: users with low vision cannot reliably read labels, secondary text and several
  badges. This is the product's daily working surface.
- Recommended remediation: adjust the tokens named in A1. Most are within one step of passing.
- Required verification: re-run `npm run test:a11y` and lower the baseline in
  `tests/e2e/accessibility.spec.ts`.
- Owner: Human — it is a design decision.

### [Medium] The application is unobservable
- Affected workflow: all, including the demo that is live today.
- Expected behavior: a failure is noticed by a system, not by a person.
- Observed behavior: no error tracking, no logging, no health check, no uptime monitoring and
  no alert on a failed Pages deployment.
- Evidence: nothing in the repository reports anywhere.
- Impact: a broken deploy stays broken until someone looks. This is the cheapest blocker on
  the list to close and it applies now, not after a backend.
- Recommended remediation: client-side error reporting, and an uptime check on the deployed
  URL that alerts a named person.
- Owner: Human.

### [Medium] Silent data loss in the daily task engine
- Affected workflow: `/tasks`.
- Expected behavior: a user's task state survives a page reload, as the engagement, agent
  deploy and tour state all do.
- Observed behavior: `src/components/tasks/task-store.tsx` holds tasks in `React.useState`
  while the other three stores persist to `localStorage`. A reload silently discards the
  day's work with no warning.
- Evidence: read from the source; the other stores use keys `smos.engagement`,
  `smos.agents.deployed`, `smos.tour.*`.
- Impact: the user loses work and is not told. The inconsistency with the neighbouring stores
  makes it look like an oversight rather than a decision.
- Recommended remediation: persist task state on the same pattern, or say in the UI that it
  is a demo that does not save.
- Owner: Shared.

### [Medium] Two product surfaces in one shell, unreconciled
- Affected workflow: all of them.
- Expected behavior: one product with one client model.
- Observed behavior: SEO Manager OS (Client + Engagement, nine stages, `/tasks`, `/reports`)
  and Local Growth OS (Campaign, modules, `/growth/tasks`, `/growth/reports`) ship side by
  side with two navigation systems, two client models and two sets of task and report
  screens. Nothing maps one to the other.
- Evidence: `src/lib/model.ts` and `src/lib/engagements.ts` against
  `src/lib/local-growth/types.ts`.
- Impact: acceptable while both are demos and being compared. Untenable with a customer in
  front of them, and every week of parallel building raises the cost of choosing.
- Recommended remediation: decide which is the product, or how they compose, before either
  gets a backend. This is a product decision, not a refactor.
- Owner: Human.

### [Medium] The product presents capabilities it does not have
- Affected workflow: `/integrations`, `/strategy`, `/reports`, `/research`, `/agents`.
- Expected behavior: a control that looks like it connects, shares or deploys does so, or
  says it does not.
- Observed behavior: 41 integrations offer a Connect toggle that changes local UI state only;
  brief and report "Share" produce a link that opens nothing; file pickers accept a file and
  read nothing; deploying an agent runs nothing; `/growth/login` renders a sign-in that
  authenticates nothing, with the demo password printed beside it.
- Evidence: `src/lib/integrations.ts`, `src/components/flow/brief-share.tsx`,
  `src/components/reports/report-share.tsx`, `src/components/investigation/evidence-panel.tsx`,
  `src/components/agents/deploy-store.ts`.
- Impact: acceptable and even desirable in a prototype whose job is to test whether the loop
  reads correctly. Not acceptable in front of a paying customer, and the demo is public.
- Recommended remediation: a persistent "demo data" indicator in the shell.
- Owner: Product.

### [Low] No staging environment
- Observed behavior: `deploy.yml` publishes to production on every push to the default branch.
- Impact: rollback has never been rehearsed anywhere but production, and readiness lines 31
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

- **Risk:** the RLS policies do not do what reading them suggests.
  **Why suspected:** no policy has ever been executed. The `clients` preflight/finalize pair
  exists because the first attempt applied a generic child-table policy loop to the `clients`
  table itself, which is evidence that this schema is subtle enough to get wrong.
  **Evidence needed:** `supabase db reset` against a real instance, then a two-organization
  isolation test suite. **Owner:** Engineering.

## Claims not independently verified

- **Claimed behavior:** the CI workflows pass.
  **Why it cannot be confirmed:** they are new in this change and have never executed on
  GitHub. Every job was run locally, but a local run is not a CI run.
  **Evidence required:** one green run on this branch. **Release impact:** none yet.

- **Claimed behavior:** no secret exists in repository history.
  **Why it cannot be confirmed:** the gitleaks job has not yet run.
  **Evidence required:** the first `security.yml` execution. **Release impact:** would be high
  if it found something.

- **Claimed behavior:** the deployed site works.
  **Why it cannot be confirmed:** no deployed environment was reachable from this session. All
  results are from a local static server that mirrors the Pages behaviour; it is not Pages.
  **Evidence required:** `TEST_BASE_URL=<pages url> npm run test:e2e`. **Release impact:**
  medium — the `GITHUB_PAGES=true` basePath build was never exercised here.

- **Claimed behavior:** the application is accessible to screen reader users.
  **Why it cannot be confirmed:** no screen reader was run. **Evidence required:** a human
  pass. **Release impact:** high. Nobody should claim screen reader support on this evidence.

## Contract status

- Contract ID: AUTH-001, ORG-001, CORE-001, ADMIN-001, FILES-001, BILLING-001,
  INTEGRATION-001, OBS-001, PERF-001, AUDIT-001.
- Status: **Unverified** — all ten. Each is the standard's unfilled starter form.
- Missing proof: everything. None has been drafted, approved or implemented.
- Required next action: draft AUTH-001 and ORG-001 first, and do not write backend code until
  they are approved. `docs/production/WORKFLOW-RISK-REGISTER.md` names the trigger for each.

## Prioritized remediation plan

1. Name the accountable human in `PRODUCT_BRIEF.md`, `ARCHITECTURE_DECISIONS.md`,
   `PRODUCTION_READINESS.md` and `docs/runbooks/incident-response.md`. Nothing else can be
   accepted until someone can accept it.
1b. Decide whether SEO Manager OS or Local Growth OS is the product, or how they compose.
   Several items below cost twice as much while both surfaces are live.
2. Add error tracking, a health check and an alert on the deployed demo. Cheapest item on the
   list, and it applies to what is live today.
3. Decide the palette question (A1) and the target sizes (A2), then lower the contrast
   baseline in `tests/e2e/accessibility.spec.ts`.
4. Decide the Next.js 16 upgrade, or accept the advisories in writing with an expiry date.
5. Run a human keyboard and screen reader pass; fix A5 and A6.
6. Fix the silent task-state loss, or label the demo honestly.
7. Draft and approve AUTH-001 and ORG-001 before any backend code. The tenant model is
   already designed in `supabase/migrations/`; ORG-001's job is to execute it, seed two
   organizations and prove isolation, restoring `test:authz` as a blocking CI job.
8. Stand up staging and rehearse a rollback there.
9. Set the metric targets in `PRODUCT_BRIEF.md` and instrument them.
10. Add pagination and bounded queries before the first real portfolio.

## Release decision

- **Decision: Approved with limitations** for the public GitHub Pages demo, which holds no
  real data and whose limitations are documented. **Not approved** for any release holding
  customer data.
- **Required actions before release:** items 1 through 8 above, and every Critical row in
  `docs/production/WORKFLOW-RISK-REGISTER.md` carrying an approved, implemented and
  independently verified contract.
- **Required human approvals:** a named product owner must accept this audit, the security
  audit and the accessibility audit, and must personally accept or resolve each High finding.
- **Post release monitoring requirements:** currently unmeetable — there is nothing to monitor
  with. Remediation item 2 is the prerequisite.
