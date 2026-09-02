# Workflow: Organization and role management


> **Status in this repository: this workflow does not exist yet.**
>
> There are no organizations, users, memberships, roles or audit log. The "Owner" strings
> on client records and the seats listed in Settings are display-only mock data.
> `docs/SOURCE_OF_TRUTH.md` records that multi-seat roles and approval chains are
> deliberately **not** a priority; data export matters more. Keep this minimal when it is
> built.
>
> This document is the delivery standard's starter specification, kept as the target. It is
> not a description of the application as built. See `docs/production/INVENTORY.md` for what
> exists, and `docs/production/WORKFLOW-RISK-REGISTER.md` for the trigger that turns this
> into a release blocker.
Contracts: `ORG-001` for creation and membership, `ADMIN-001` for administration. Risk: Critical.

## Steps in scope

Organization creation, team invitation, invite acceptance, role assignment, role change,
user removal, user suspension and restoration, audit logging of all of the above.

## Actor and trigger

| Step | Actor | Trigger |
|---|---|---|
| Create organization | Signed in user | Completes the creation form, becomes owner |
| Invite | Owner or admin | Sends an invitation by email |
| Accept | Invited person | Uses the invitation link |
| Change role | Owner or admin | Changes a member role |
| Suspend or restore | Owner or admin | Acts on a member |
| Remove | Owner or admin | Removes a member |

## Roles

<FILL: define each role, what it can do that others cannot, and where that is enforced.
Mirror the table in ARCHITECTURE_DECISIONS.md rather than inventing a second model.>

## Required behavior

- Only permitted roles can invite, change roles, suspend, restore, or remove.
- An invitation is single use, expires, and joins only the intended organization.
- An invited user cannot escalate their own role by editing the accept payload.
- A suspended user loses access immediately, including on an already open session.
- The last remaining owner cannot be suspended or removed.
- Every administrative action writes an audit record with actor, target, action, timestamp.
- Audit records cannot be edited or deleted through the application.
- An admin of one organization cannot administer another.

## Error and edge cases

Invitation to an existing member, invitation to an address already in another organization,
expired invitation, reused invitation, role change during an active session, self
suspension, removing yourself as the only owner, concurrent role changes.

## Data touched

Organizations, memberships, invitations, roles, audit log.

## Evidence required

Role matrix executed against every administrative route, cross organization attempt results,
audit rows matching the actions performed.
