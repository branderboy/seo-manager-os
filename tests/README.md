# Tests

Structure required by section 6 of `WORLD_CLASS_APP_THESIS.md`.

```
tests/
├── unit/          Isolated business rules and pure logic
├── integration/   Routes, database, authorization, webhooks, storage, queues
│   └── tenant-isolation.spec.ts   ORG-001 as executable tests. Blocks release
├── e2e/           User workflows through the built application
│   ├── critical-workflows.spec.ts  Sign in, core object life cycle, cross tenant by URL
│   └── accessibility.spec.ts       axe on key routes, WCAG 2.2 tags
├── helpers/
│   └── auth.ts    The one place your auth is wired into the tests
└── fixtures/
    ├── tenants.md The two tenant baseline and why it exists
    └── seed.ts    Seeds Organization Alpha and Organization Beta
```

The shipped specs assume the default stack in `docs/stack/DEFAULT_STACK.md`. Adjust the
route paths at the top of each file to match your application. Everything else works as is.

A test earns its place by failing when the behavior it names is broken. Before adding a
test, ask what change to the code would make it fail. If the honest answer is nothing, the
test is decoration.

## Required negative coverage

Every critical workflow needs tests for: no logged in user, wrong role, wrong organization,
altered URL ID, altered request body, invalid input, missing input, malformed input, expired
token, reused token, duplicate request, retry after timeout, provider error, network error,
rate limit, file too large or wrong type, and stale session after suspension or role change.

## What blocks a release

A failing authorization or tenant isolation test is a release blocker. It is never a test to
be adjusted so the pipeline goes green.
