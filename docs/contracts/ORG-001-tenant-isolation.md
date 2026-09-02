# ORG-001: Organization membership and tenant isolation

- Status: Draft
- Owner: <FILL: name>
- Approved by: <FILL: name and date>
- Revision: 1
- Related contracts: AUTH-001, ADMIN-001
- Workflow spec: docs/workflows/tenant-isolation.md

## 1. Product outcome

Business outcome

Every record in the system belongs to exactly one organization, and no user can reach data
outside the organizations they belong to, no matter what they type into a URL, form, or
API call.

## 2. Risk level

Critical. A failure here exposes one customer to another and is not recoverable by apology. Human verification with two real accounts is mandatory.

## 3. Agreed delivery

Agreed delivery

A signed in user can create an organization, becomes its owner, can add members with
defined roles, and can read and write only records scoped to organizations where they hold
membership. Every server side read and write enforces that scope.

## 4. Actors and permissions

| Actor | Permission needed | Actions |
|---|---|---|
| Signed in user | authenticated | Create an organization, becoming its owner |
| Owner | owner of that organization | Full access within the organization |
| Member | membership in that organization | Access per role within the organization |
| Any user | none across the boundary | No read, write, export, or share outside their organizations |

## 5. Preconditions

AUTH-001 verified. The tenant model in ARCHITECTURE_DECISIONS.md is filled in and approved, including whether row level policies are available on the chosen database.

## 6. Acceptance criteria

Acceptance criteria

| # | Criterion | How it is observed |
|---|---|---|
| 1 | A user sees only organizations where they hold membership | Integration test with two seeded orgs |
| 2 | A user cannot read another organization record by changing a record ID in the URL | Negative test per read route |
| 3 | A user cannot update, delete, export, or share another organization record | Negative test per write route |
| 4 | A user cannot create a record under an organization they do not belong to, even by editing the payload | Negative test with a forged tenant ID in the body |
| 5 | Role restrictions are enforced on direct API calls, not just hidden in the UI | Direct API call as a lower role |
| 6 | Background jobs, exports, and file storage paths preserve tenant scope | Job and export tests with two orgs |
| 7 | Database level policies are enabled where the platform supports them | Schema and policy evidence |
| 8 | Removing a member immediately ends their access to that organization data | Integration test |

## 7. Failure and edge cases

Forged tenant ID in the body, query string, header, or path. Stale session after removal from an organization. A user who belongs to two organizations switching context mid request. A record type that is intentionally global. A background job inheriting the wrong scope. An export or file path that omits the tenant segment.

## 8. Scope

Scope

- UI: organization creation, organization switcher, member list, role display.
- API routes, server actions, jobs: <FILL: every route that reads or writes tenant data>
- Database tables, migrations, policies: organizations, memberships, and the tenant key on
  every tenant owned table. <FILL: table names>
- Third party providers and webhooks: <FILL: any provider that stores or returns tenant data>
- Environment variables and configuration: none expected.
- Tests, monitoring, documentation, environments: local and staging.

Out of scope: admin impersonation and cross organization reporting.

## 9. Constraints

Constraints

- Tenant scope is resolved from the server session, never from a client supplied value.
- Do not remove or weaken existing authorization checks.
- Every new tenant owned table gets the tenant key and the same policy in the same migration.
- Do not use client only checks as the sole permission layer.

## 10. Guardrails

Guardrails

- Tenant scope resolution exists in exactly one server side helper. A second copy is a
  finding, not a refactor opportunity.
- Every new tenant owned table gets the tenant key and its access policy in the same
  migration that creates the table.
- Database level policies are enabled where the platform supports them, and the policy
  evidence is attached to the report.
- Cross tenant negative tests may not be deleted, skipped, or narrowed to make a run pass.
- No migration runs against production without human approval and a stated rollback.
- Status is Ready for independent verification, never Complete.

## 11. Security and privacy

This contract is the tenant boundary. Scope resolves from the server session only. Every read returns only fields the requester may receive. Errors on cross tenant attempts must not confirm that the record exists. Database level policies are enabled where supported, so an application bug alone cannot leak across tenants.

## 12. Performance and cost

Every tenant scoped query uses an index that leads with the tenant key. List endpoints are paginated with a hard maximum page size. Record the expected records per tenant from ARCHITECTURE_DECISIONS.md and confirm the plan for the largest tenant, not the average one.

## 13. Test requirements

Test requirements

- Unit: scope resolution helper.
- Integration: every tenant aware route with an in org user, an out of org user, and a
  wrong role user.
- End to end: create org, invite member, switch org, attempt cross org access.
- Negative and authorization: forged IDs in URL, body, query string, and headers.
- Manual or staging: file storage paths and export downloads.

## 14. Proof of delivery

Proof of delivery

- Test command output including the cross tenant negative tests.
- Schema and policy evidence.
- Changed file summary.

## 15. Independent verification

Independent verification

- Verifier: <FILL: human name>
- Environment: staging with two seeded organizations and one user in each.
- Procedure: sign in as user A, capture a record ID from org B, and attempt read, update,
  delete, export, and share against it through the API directly.
- Expected result: every attempt is rejected server side with no data leakage in the error.

## 16. Ownership

Ownership

- Agent-owned: implementation, tests, migrations, report.
- Human-owned: final security acceptance, production policy review.
- Shared: staging validation with seeded tenants.

## 17. Rollback and remediation

Policy and scope changes ship behind a migration with a documented down path. If a leak is discovered, treat it as a Critical incident: contain by disabling the affected route, determine which records were exposed to whom from the audit and access logs, and follow the notification decision with the human owner. Do not roll back audit logging.

## 18. Definition of done

- [ ] Approved scope implemented
- [ ] Every acceptance criterion recorded as Pass, Fail, or Not verified
- [ ] Required tests added or updated, including the negative cases above
- [ ] Required commands run and results reported
- [ ] Proof artifacts available and labeled by environment
- [ ] Security, authorization, privacy, and data handling reviewed
- [ ] Performance and cost expectations checked against the stated limits
- [ ] Rollback path documented and, where the risk level requires it, tested
- [ ] Known limitations and human owned follow ups documented
- [ ] Independent verification report produced by someone other than the implementer
- [ ] No unresolved critical or high severity issue
