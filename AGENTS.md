# Agent instructions for this repository

Applies to Codex and any other coding agent working in this repository. Claude Code reads
`CLAUDE.md`, which says the same things.

> Not to be confused with `docs/AGENTS.md`, which is **product** documentation about the
> AI Workforce inside the application.

Read `WORLD_CLASS_APP_THESIS.md` before taking any action. It is the product, engineering,
security, reliability, and delivery standard here, and it overrides generic best practices
and default agent behavior. `docs/SOURCE_OF_TRUTH.md` holds the project decisions already
made; do not reopen them without being asked.

Non negotiable:

- Inspect before editing. Return a plan and wait for approval on non trivial work.
- Work only inside an approved delivery contract from `docs/contracts/`.
- Respect the constraints and guardrails the contract names, and report whether the
  guardrails held.
- Never weaken, skip, or mock away a meaningful test to get a passing run. The colour
  contrast baseline in `tests/e2e/accessibility.spec.ts` may go down, never up.
- Never claim an external service, deployment, or integration works unless it was exercised
  in the right environment. Label every artifact with the environment it came from.
- The palette in `src/app/globals.css` and the design system in `design/` are approved
  product design. Do not restyle them as a side effect of another task.
- Finish with a delivery report using `docs/reports/_TEMPLATE.md`. Status is `Ready for
  independent verification`, `Blocked`, `Partially complete`, or `Failed`. Never `Complete`
  and never `production ready`.

Verification and audit runs happen in a different session or agent than the implementation.

Reusable kickoff, inventory, planning, implementation, verification, and audit prompts are in
`.claude/skills/engineering-delivery/references/agent-prompts.md`.
