# ADMIN-001: Invite, role change, suspension, and audit logging

- Status: Draft
- Owner: <FILL: name>
- Approved by: <FILL: name and date>
- Revision: 1
- Related contracts: AUTH-001, ORG-001
- Workflow spec: docs/workflows/user-roles.md

## 1. Product outcome

Business outcome

An organization can run itself. An owner or admin can bring people in, change what they can
do, cut off access immediately when someone leaves, and later prove who changed what.

## 2. Risk level

Critical. Privilege escalation and stale access are the two failures this contract exists to prevent.

## 3. Agreed delivery

Agreed delivery

An admin can invite a user by email, the invited user accepts and joins the correct
organization with the assigned role, an admin can change a member role, suspend a member,
restore a suspended member, and remove a member. Every one of those actions writes an audit
record. Access changes take effect immediately, including for sessions already open.

## 4. Actors and permissions

| Actor | Permission needed | Actions |
|---|---|---|
| Owner | owner | Invite, change roles, suspend, restore, remove, view audit |
| Admin | admin | Per <FILL: role rules>, never exceeding owner |
| Member | membership | No administrative actions |
| Invited person | valid invitation | Accept into the intended organization at the assigned role only |

## 5. Preconditions

AUTH-001 and ORG-001 verified. The role matrix in ARCHITECTURE_DECISIONS.md is approved. Email provider configured for invitations.

## 6. Acceptance criteria

Acceptance criteria

| # | Criterion | How it is observed |
|---|---|---|
| 1 | Only roles permitted by <FILL: role rules> can invite, change roles, suspend, or remove | Role based negative test per action |
| 2 | An invitation link works once, expires, and joins only the intended organization | Integration tests for reuse and expiry |
| 3 | An invited user cannot escalate their own role by editing the accept payload | Negative test with a forged role value |
| 4 | A suspended user loses access immediately, including on an already open session | End to end test with a live session |
| 5 | An admin cannot suspend or remove the last remaining owner | Integration test |
| 6 | Every administrative action writes an audit record with actor, target, action, and timestamp | Database evidence per action |
| 7 | Audit records cannot be edited or deleted through the application | Negative test |
| 8 | An admin of Organization A cannot administer Organization B | Cross tenant negative test |

## 7. Failure and edge cases

Invitation to an existing member. Expired or reused invitation. Role change during an active session. Self suspension. Removing the last owner. Concurrent role changes on the same member. An invited user editing the accept payload to claim a higher role.

## 8. Scope

Scope

- UI: member list, invite dialog, role selector, suspend and restore controls, audit log view.
- API routes, server actions, jobs: <FILL: invite, accept, role change, suspend, restore, remove>
- Database tables, migrations, policies: memberships, invitations, audit log. <FILL: names>
- Storage, files, queues, scheduled tasks: invitation expiry job if applicable.
- Third party providers: <FILL: email provider for invitations>
- Environment variables and configuration: invitation token lifetime.
- Tests, monitoring, documentation, environments: local and staging.

Out of scope: custom role definitions and permission editing.

## 9. Constraints

Constraints

- Role and permission checks are server side. Hiding the button is not a control.
- Do not introduce a new permissions library without approval.
- Do not log invitation tokens or personal data beyond what the audit record requires.
- Do not change the AUTH-001 session model while implementing this.

## 10. Guardrails

Guardrails

- Scope: every changed file listed in the report, with anything outside the plan explained.
- Security: privilege escalation paths tested explicitly, not assumed absent.
- Database: the audit table is append only at the policy level where the platform supports it.
- Completion: an unverified suspension path blocks the contract regardless of test count.
- Status is Ready for independent verification, never Complete.

## 11. Security and privacy

Administrative actions are the highest privilege surface in the product. Every action is authorized server side against the actor role and the target organization. Audit records capture actor, target, action, and timestamp, are append only where the platform supports it, and contain no invitation tokens or credentials. Suspension invalidates existing sessions.

## 12. Performance and cost

Member list and audit views are paginated. Invitation sends are rate limited per organization to control email spend and abuse. Audit retention is set per <FILL: retention policy> with a stated storage expectation.

## 13. Test requirements

Test requirements

- Unit: role comparison and last owner rule.
- Integration: every route with each role, including a forged role in the payload.
- End to end: invite, accept, change role, suspend, restore, remove.
- Negative and authorization: reused invitation, expired invitation, cross organization
  administration, self escalation, last owner removal.
- Manual or staging: invitation email delivery.

## 14. Proof of delivery

Proof of delivery

- Branch and commit.
- Test output for every negative case.
- Audit table rows for each administrative action, personal data redacted.
- Evidence that an open session loses access on suspension.

## 15. Independent verification

Independent verification

- Verifier: <FILL: human name>
- Environment: staging with two organizations and at least three roles.
- Procedure: perform each administrative action as each role, attempt every action across
  the organization boundary, and confirm the audit trail matches what was done.
- Expected result: permitted actions succeed, everything else is rejected server side, and
  the audit log is complete.

## 16. Ownership

Ownership

- Agent-owned: implementation, tests, migrations, report.
- Human-owned: the role and permission rules themselves, retention policy for audit records.
- Shared: staging validation.

## 17. Rollback and remediation

Role and membership changes are recoverable from the audit log, which is why the audit is written before the change is confirmed to the user. A defective release is reversed by redeploy. If incorrect privileges were granted, revoke first, then reconstruct the correct state from the audit trail.

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
