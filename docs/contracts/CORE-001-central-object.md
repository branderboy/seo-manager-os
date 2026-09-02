# CORE-001: Create and manage a core object end to end

- Status: Draft
- Owner: <FILL: name>
- Approved by: <FILL: name and date>
- Revision: 1
- Related contracts: AUTH-001, ORG-001
- Workflow spec: docs/workflows/core-workflow.md

The core object in this file is written as a campaign. Rename it throughout to whatever this
product actually manages: lead, event, service request, project, listing, client, or artist
profile. Keep the CORE-001 ID.

## 1. Product outcome

Business outcome

A member of an organization can carry the primary object of the product through its full
life cycle without leaving the product or asking someone for help, and the result is
visible to the right people and no one else.

## 2. Risk level

Critical. This is the workflow the product is bought for, and it carries customer data across the tenant boundary.

## 3. Agreed delivery

Agreed delivery

An authorized member can create a campaign, save it as a draft, edit it, publish or
activate it, view it in a list filtered to their organization, view its detail, archive or
delete it under the defined rules, and see accurate state after each action.

## 4. Actors and permissions

| Actor | Permission needed | Actions |
|---|---|---|
| Member | membership | Create, view, edit within the organization |
| Elevated role | <FILL: role name> | Publish, archive, delete, export, share |
| Other organization | none | No access of any kind |

## 5. Preconditions

AUTH-001 and ORG-001 verified. The core object, its states, and its role rules are defined in PRODUCT_BRIEF.md and ARCHITECTURE_DECISIONS.md rather than invented here.

## 6. Acceptance criteria

Acceptance criteria

| # | Criterion | How it is observed |
|---|---|---|
| 1 | An authorized member can create a campaign and it appears in their organization list | End to end test |
| 2 | Required fields are validated on the server, not only in the browser | Direct API call with an invalid payload |
| 3 | A campaign is visible only to members of its organization | Cross tenant negative test |
| 4 | Only the roles defined in <FILL: role rules> can publish, archive, or delete | Role based negative tests |
| 5 | Invalid state transitions are rejected, for example publishing an archived campaign | Integration test per illegal transition |
| 6 | Duplicate submission of the create action does not create two records | Retry test with the same idempotency context |
| 7 | Deleting or archiving behaves per <FILL: soft or hard delete rule> and is reversible where specified | Integration test |
| 8 | The list query stays responsive with <FILL: expected record volume> | Timed query against seeded data |

## 7. Failure and edge cases

Empty state and first record. A very large record. Concurrent edits by two users. Deleting an object referenced elsewhere. Exporting more rows than the page limit. Filtering with no matches. A retried create after a timeout. An illegal state transition such as publishing an archived record.

## 8. Scope

Scope

- UI: list, create form, edit form, detail view, status controls, empty state, error states.
- API routes, server actions, jobs: <FILL: route paths for list, create, read, update,
  status change, delete>
- Database tables, migrations, policies: <FILL: campaign table, status enum, tenant key,
  indexes for the list query>
- Third party providers and webhooks: <FILL: any provider triggered on publish>
- Environment variables and configuration: <FILL>
- Tests, monitoring, documentation, environments: local and staging.

Out of scope: bulk import, analytics reporting, and templates.

## 9. Constraints

Constraints

- Reuse the existing tenant scope helper from ORG-001. Do not write a second one.
- Do not add new dependencies or paid services without approval.
- Do not change the shape of existing shared components while adding these screens.
- Server side validation and authorization on every route.

## 10. Guardrails

Guardrails

- Work stays inside the files named in the approved plan. Shared components are not
  redesigned while adding these screens.
- No new dependency, paid service, or framework enters the repository under this contract.
- Authorization reuses the ORG-001 helper. Route level or component level visibility is
  never the only control.
- Server side validation runs on every route, including routes the UI never calls with bad data.
- Seeded performance evidence uses realistic record volume, not an empty table.
- Status is Ready for independent verification, never Complete.

## 11. Security and privacy

Records are customer confidential data. Every route enforces authentication, role, and tenant scope server side. Validation runs on the server for every field, including fields the interface never sends badly. Exports carry the same authorization as reads. Audit history records state changes where the product requires traceability.

## 12. Performance and cost

List and search meet <FILL: p95 target> at <FILL: expected records per tenant>. Pagination bounds are enforced server side. Required indexes are named in the plan. Exports above <FILL: row threshold> run as background jobs rather than blocking a request.

## 13. Test requirements

Test requirements

- Unit: state transition rules and validation schema.
- Integration: every route with authorized, unauthorized, wrong role, and cross tenant callers.
- End to end: full create, edit, publish, archive path.
- Negative and authorization: invalid payloads, illegal transitions, forged tenant IDs,
  duplicate submits.
- Manual or staging: any provider call triggered on publish.

## 14. Proof of delivery

Proof of delivery

- Test command output.
- Screen recording of the full life cycle.
- Query timing evidence against seeded data.
- Changed file summary.

## 15. Independent verification

Independent verification

- Verifier: <FILL: human name>
- Environment: staging with two organizations and at least two roles.
- Procedure: run the full life cycle as an authorized member, then repeat every action as
  a lower role and as a member of the other organization.
- Expected result: authorized path succeeds, every other path is rejected server side.

## 16. Ownership

Ownership

- Agent-owned: implementation, tests, migrations, report.
- Human-owned: business rules for status, deletion, and role permissions.
- Shared: staging validation.

## 17. Rollback and remediation

Schema changes are additive first, with backfill separated from the deploy that reads the new column. A defective release is reversed by redeploying the previous build; if data was written in a bad shape, the remediation is a scripted correction with a dry run against staging before it touches production.

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
