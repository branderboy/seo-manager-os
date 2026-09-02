# Workflow: Tenant isolation

Contract: `ORG-001`. Risk: Critical. This is the workflow that decides whether the product

> **Status in this repository: this workflow does not exist yet.**
>
> There is no tenancy. The client switcher is a view filter over mock data and has no
> security property whatsoever, which `ARCHITECTURE_DECISIONS.md` states explicitly so a
> future backend does not inherit it as if it were a boundary.
>
> This document is the delivery standard's starter specification, kept as the target. It is
> not a description of the application as built. See `docs/production/INVENTORY.md` for what
> exists, and `docs/production/WORKFLOW-RISK-REGISTER.md` for the trigger that turns this
> into a release blocker.
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
