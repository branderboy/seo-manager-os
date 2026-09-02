# Multi tenant test fixtures

The CI baseline from section 6 of `WORLD_CLASS_APP_THESIS.md`. Every authorization and
isolation test runs against these. One organization is not enough to prove isolation.

This follows the OWASP Authorization Regression Testing approach: provision two tenants,
seed data into Alpha, run broad read queries as a Beta user, and treat a single leaked
record identifier as a critical failure rather than a minor bug.
https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Regression_Testing_Cheat_Sheet.html

```md
Organization Alpha:
- Alpha admin
- Alpha member
- Alpha owned records

Organization Beta:
- Beta admin
- Beta member
- Beta owned records

Platform admin:
- Privileged platform level account, only where applicable
```

## Seed expectations

| Fixture | Purpose |
|---|---|
| alpha.admin | Performs administrative actions inside Alpha |
| alpha.member | Baseline authorized user |
| alpha.suspended | Suspended account with a live session, for stale access tests |
| beta.admin | Proves an admin of one organization cannot administer another |
| beta.member | Target for cross tenant attempts |
| alpha.record | A record whose ID is used in Beta's forged requests |
| beta.record | A record whose ID is used in Alpha's forged requests |
| beta.file | A stored object used for cross tenant storage path attempts |

## Required assertions in CI

- Unauthenticated requests are rejected.
- A member cannot perform admin actions.
- A user cannot read another tenant's records.
- A user cannot edit another tenant's records.
- A user cannot delete another tenant's records.
- A user cannot export another tenant's records.
- A user cannot access another tenant's private files.
- A suspended user loses intended access, including on an open session.
- A role change takes effect correctly.
- Sensitive endpoints enforce authorization server side.
- Duplicate webhooks and jobs do not duplicate side effects.
- Provider errors are handled safely.

## Implementation note

The seed script itself is application specific. Write it once, keep it in this folder, and
have every integration and end to end suite use it rather than creating ad hoc users, which
is how isolation tests quietly stop covering the boundary.

> Not in use. This application has no tenancy today. See `../integration/README.md`.
