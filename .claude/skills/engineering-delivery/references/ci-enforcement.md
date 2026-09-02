# CI and automated enforcement

Discipline fades. Automation remains. Anything that matters and is not enforced by CI will
eventually be skipped on a tired Tuesday.

Workflow files: `.github/workflows/`. Fixtures: `tests/fixtures/tenants.md`.

## Every relevant pull request runs

Linting, formatting, type checks, build, unit tests, integration tests, critical end to end
tests, dependency and security checks, migration validation, accessibility checks where
applicable, and the regression tests named by the contracts already verified.

## The multi tenant baseline

CI seeds Organization Alpha and Organization Beta, each with an admin, a member, and owned
records, plus a platform admin where applicable. One organization cannot prove isolation.

CI must assert that unauthenticated requests are rejected, a member cannot perform admin
actions, a user cannot read or edit or delete or export another tenant's records, a user
cannot reach another tenant's private files, a suspended user loses access, a role change
takes effect, sensitive endpoints enforce authorization server side, duplicate webhooks and
jobs do not duplicate side effects, and provider errors are handled safely.

A failing authorization or tenant isolation check blocks release. It is never the test that
gets adjusted.

## When adding a verified contract

Add its critical negative tests to CI in the same change. A contract verified once and never
re checked is a contract that will silently regress.
