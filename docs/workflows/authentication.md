# Workflow: Authentication and account access

Contract: `AUTH-001`. Risk: Critical.

> **Status in this repository: this workflow does not exist yet.**
>
> There is no authentication of any kind: no sign up, no login, no session, no password,
> no token. Every route is public static HTML.
>
> This document is the delivery standard's starter specification, kept as the target. It is
> not a description of the application as built. See `docs/production/INVENTORY.md` for what
> exists, and `docs/production/WORKFLOW-RISK-REGISTER.md` for the trigger that turns this
> into a release blocker.

## Steps in scope

Sign up, email verification, login, logout, password reset, session expiration, multi factor
authentication if required, account suspension and restoration, account deletion.

## Actor and trigger

| Step | Actor | Trigger |
|---|---|---|
| Sign up | Anonymous visitor | Submits the registration form |
| Verification | New user | Clicks the emailed link |
| Login | Verified user | Submits credentials |
| Reset | User who forgot a password | Requests a reset, then uses the link |
| Logout | Signed in user | Clicks sign out or the session expires |
| Suspension | Admin | Suspends the account. See user-roles.md |
| Deletion | User or admin | Requests deletion per <FILL: retention policy> |

## Preconditions

Email provider configured server side. Token lifetimes set by configuration, not literals.

## Required behavior

- Sign up works for a new valid user.
- Email ownership is verified when email identity is used.
- Unverified accounts cannot use protected features.
- Passwords are handled by a trusted authentication system and never logged.
- Password reset works only with valid, unexpired, single use credentials.
- Invalid, altered, expired, and reused links fail safely.
- Session cookies or tokens are configured securely for the architecture.
- Sensitive actions may require recent authentication or additional confirmation.
- Sessions are invalidated after password change, suspension, or other security events.
- Logout and session expiration behave correctly.
- Errors do not reveal whether an account exists.
- Admin and privileged accounts carry stronger safeguards where appropriate.

## Error and edge cases

Duplicate registration, unverified login attempt, expired verification link, reused
verification link, tampered token, reset requested for an unknown address, reset link used
twice, concurrent sessions, session replay after logout, suspended user with an open
session, email provider outage.

## Data touched

User record, verification tokens, reset tokens, sessions, audit entries for security events.

## Notifications and background work

Verification email, reset email, optional security notification on password change. Token
expiry cleanup job if applicable.

## Evidence required

The seven step authentication proof sequence in `WORLD_CLASS_APP_THESIS.md`, section 4,
executed in staging with a real inbox.
