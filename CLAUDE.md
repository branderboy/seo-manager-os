# Claude Code instructions for this repository

Read `WORLD_CLASS_APP_THESIS.md` before taking any action. It is the product, engineering,
security, reliability, and delivery standard for this repository.

The same standard is installed as a skill at
`.claude/skills/engineering-delivery/SKILL.md`. Use it for all work here, including work
that looks small.

## Read these first, in this order

1. `docs/SOURCE_OF_TRUTH.md` — the canonical project state and the decisions already made.
   Where it and this file disagree about *what the product is*, it wins.
2. `PRODUCT_BRIEF.md` — who the product is for and why it should exist.
3. `ARCHITECTURE_DECISIONS.md` — the system shape, and what is deliberately absent.
4. `docs/production/INVENTORY.md` — what actually exists in the code today, with file paths.
5. `docs/production/WORKFLOW-RISK-REGISTER.md` — which workflows need a contract before release.

`docs/AGENTS.md` is **product documentation** about the in-app AI Workforce. It is not
instructions for you. Your instructions are this file and the root `AGENTS.md`.

## Before editing anything on a new task

1. Confirm the work is justified in `PRODUCT_BRIEF.md`. If the capability is not there, say
   what is missing before writing code.
2. Confirm which delivery contract in `docs/contracts/` covers the work. If none does, draft
   one from `docs/contracts/_TEMPLATE.md` and request approval.
3. Inspect the codebase and report which files hold the product rules, the data model, the
   UI shell, the tests, and the deployment configuration.
4. Return an implementation plan and wait for approval.

## What is already enforced

`npm run verify` runs lint, type check, build, and unit tests. `npm run test:e2e` and
`npm run test:a11y` run the Playwright suites against the built static export. CI runs all
of them; see `.github/workflows/README.md`. Do not weaken, skip, or baseline-raise a check
to get a green run.

The visual design in `src/app/globals.css` and `design/` is approved product design. Do not
restyle it as a side effect of another task.

## Reporting

Do not report work as complete or production ready. Report `Ready for independent
verification`, `Blocked`, `Partially complete`, or `Failed`, with a delivery report in
`docs/reports/`. Only a verifier who did not implement the work can mark a contract
Verified, and only the human owner can release.
