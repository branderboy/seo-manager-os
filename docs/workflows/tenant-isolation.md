# Workflow: Tenant isolation

Contract: `ORG-001`. Risk: Critical. This is the workflow that decides whether the product

> **Status in this repository: enforced in the database, not yet used by the application.**
>
> The boundary exists and is proven. `supabase/migrations/` puts `organization_id` on every
> tenant table and enforces it with 194 Row Level Security policies, with `client_id` scoping
> for client-facing roles and matching policies on the `client-assets` bucket. Those
> migrations are applied to a live Postgres on every pull request and cross-examined by 22
> tests in `tests/integration/tenant-isolation.spec.ts`, in a blocking CI job. Disabling RLS
> on one table turns 8 of them red.
>
> What does **not** exist: any application code that queries that database. Every screen still
> renders mock data, and the client switcher remains a view filter with no security property
> — `ARCHITECTURE_DECISIONS.md` says so explicitly so nobody inherits it as a boundary.
>
> So read the sections below as the target for wiring, not as a description of what the
> running product enforces. `docs/production/WORKFLOW-RISK-REGISTER.md` holds the rule.
can be sold to more than one customer.

## The rule

Every record belongs to exactly one organization. Tenant scope is resolved from the server
session, never from a client supplied value. Every server side read and write enforces it.

## Required behavior

- A user views only organizations where they hold membership.
- A user cannot read another organization record by changing a record ID in a URL.
- A user cannot update, delete, export, or share another organization record.
- A user cannot create a record under an organization they do not belong to, even by editing
  the request payload.
- Role restrictions are enforced on direct API calls, not only hidden in the interface.
- Background jobs, exports, webhooks, analytics, and file storage paths preserve tenant scope.
- Database level policies are used where the platform supports them.
- Removing a member ends their access to that organization immediately.

## Boundary inventory

Every one of these must be checked, because isolation usually fails at the boundary nobody
listed.

| Boundary | Scoped? | Where enforced | Test |
|---|---|---|---|
| Page and route data loads |  |  |  |
| API read routes |  |  |  |
| API write routes |  |  |  |
| Search and filters |  |  |  |
| Exports and reports |  |  |  |
| File storage paths |  |  |  |
| Background jobs |  |  |  |
| Webhook handlers |  |  |  |
| Analytics events |  |  |  |
| Admin tooling |  |  |  |

## Error and edge cases

Forged tenant ID in body, query string, header, or path. Stale session after removal from an
organization. A user belonging to two organizations switching context. A shared record type
that is intentionally global.

## Evidence required

Cross tenant negative tests in CI using the Alpha and Beta fixtures in `tests/fixtures/`,
plus a manual staging attempt with two real accounts.
