# Testing standard

## Tests must prove behavior

A passing test is useful only if it would fail when the underlying user visible or
security relevant behavior is wrong.

Avoid tests that only:

- Check that a component renders without validating outcomes.
- Mock every external boundary with no integration coverage anywhere.
- Assert that implementation functions were called without checking resulting state.
- Duplicate existing tests without expanding behavioral coverage.
- Assert values produced by the same implementation under test.
- Exist to increase coverage numbers.

## Minimum evidence by risk

| Change type | Minimum evidence |
|---|---|
| Copy, isolated styling, static UI | Build, lint, and type checks plus visual review |
| Business logic | Unit tests plus affected regression tests |
| API, database, or server action | Integration tests, validation tests, permission tests |
| Authentication or authorization | Integration and end to end tests, negative tests, human verification |
| Payments, emails, OAuth, webhooks, files | Integration tests, staging evidence, error and retry tests, human verification |
| Destructive or irreversible action | Confirmation flow, authorization tests, audit evidence, rollback plan |
| Production infrastructure | Human approval, staged rollout plan, verification, rollback plan |

## The failure mode to watch for

The most common way an AI assisted repository goes wrong is not a missing test. It is a
suite that passes while the behavior is broken, because the test was adjusted until it
went green. If a test starts failing during implementation, the default assumption is
that the code is wrong, not the test. Changing a test assertion requires a stated reason
in the delivery report and, for security relevant tests, human approval.
