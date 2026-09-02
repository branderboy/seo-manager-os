# AUTH-001: Account creation, email verification, and session behavior

- Status: Draft
- Owner: <FILL: name>
- Approved by: <FILL: name and date>
- Revision: 1
- Related contracts: ORG-001, ADMIN-001
- Workflow spec: docs/workflows/authentication.md

## 1. Product outcome

Business outcome

A person can create an account, prove they control the email address they signed up with,
and sign in to reach only what their account is entitled to reach. Unverified and
abandoned accounts cannot touch protected functionality.

## 2. Risk level

Critical. Identity is the boundary every other control depends on. Human verification is mandatory before release.

## 3. Agreed delivery

Agreed delivery

A user can register with email and password, verify ownership through a one time email
link, sign in after verification, stay signed in for the defined session lifetime, sign
out, and reset a forgotten password with a time limited single use token.

## 4. Actors and permissions

| Actor | Permission needed | Actions |
|---|---|---|
| Anonymous visitor | none | Register, request a reset, use a reset link |
| Unverified user | authenticated, unverified | Resend verification only. No protected access |
| Verified user | authenticated, verified | Sign in, sign out, change password |
| Suspended user | none | No access, including on an already open session |

## 5. Preconditions

Email provider configured with server side credentials. Token lifetimes set in configuration, not hardcoded. A staging inbox available for proof.

## 6. Acceptance criteria

Acceptance criteria

| # | Criterion | How it is observed |
|---|---|---|
| 1 | A new valid user can register and receives a verification email | Staging run with a real inbox |
| 2 | An unverified user cannot reach protected pages or protected API routes | Direct request to a protected route with an unverified session |
| 3 | A valid verification link activates only the intended account | Integration test with two accounts |
| 4 | An expired, invalid, altered, or already used verification or reset token is rejected | Negative integration tests, one per case |
| 5 | Password reset issues a time limited single use token and invalidates it on use | Integration test plus staging run |
| 6 | Sessions are invalidated after password change and after suspension | Integration test |
| 7 | Sign out ends the session and a replayed session cookie is rejected | End to end test |
| 8 | Error messages do not disclose whether an email address exists | Manual review of every auth error path |
| 9 | No secrets, tokens, or password values appear in logs or the client bundle | Grep of build output and log capture |

## 7. Failure and edge cases

Duplicate registration for an existing address. Login attempt before verification. Expired, reused, altered, or foreign verification link. Reset requested for an unknown address. Reset link used twice. Session replay after logout. Password change with other sessions open. Suspended user with a live session. Email provider outage or delayed delivery.

## 8. Scope

Scope

- UI: sign up, sign in, forgot password, reset password, verify email landing, verification
  pending state, sign out control.
- API routes, server actions, jobs: <FILL: route paths>
- Database tables, migrations, policies: <FILL: user table, verification token store, session store>
- Third party providers and webhooks: <FILL: auth provider and email provider>
- Environment variables and configuration: <FILL: provider keys, app URL, token lifetimes>
- Tests, monitoring, documentation, environments: local and staging.

Out of scope: social login, multi factor authentication, organization invites, which
belong to their own contracts.

## 9. Constraints

Constraints

- Use the established auth library or provider. Do not hand roll password hashing.
- Do not use client side route guards as the only protection.
- Do not log passwords, tokens, or reset links.
- Do not change unrelated files or workflows.
- Token lifetimes are configuration, not hard coded literals.

## 10. Guardrails

Guardrails

- Every changed file is listed in the delivery report, and any file outside the approved
  plan is explained.
- Auth provider keys live only in server side environment configuration. A client bundle
  grep runs before the report is written.
- Verification and reset token values never appear in logs, analytics, or error messages.
  Log capture is inspected as part of proof.
- Tests that assert rejection of expired, reused, or tampered tokens may not be modified
  to pass. If one fails, the code is wrong.
- Email delivery evidence must come from a real inbox in staging, not a mock transport.
- Status is Ready for independent verification, never Complete.

## 11. Security and privacy

Authentication and session handling follow the authentication standard in the thesis. Data touched is personal data: email address, name, and authentication metadata. Tokens and passwords never enter logs, analytics, URLs beyond the controlled verification flow, or the client bundle. Error copy never confirms whether an address exists. Security events (password change, suspension, reset use) write audit entries without the token value.

## 12. Performance and cost

Sign in and verification endpoints respond within <FILL: p95 target>. Reset and verification email sends are rate limited per address and per IP to prevent enumeration and provider spend. Email volume is a cost driver: record expected sends per active user per month.

## 13. Test requirements

Test requirements

- Unit: token generation, expiry math, password policy.
- Integration: every route above with authenticated, unauthenticated, and unverified callers.
- End to end: register, verify, sign in, sign out, reset.
- Negative and authorization: expired token, reused token, tampered token, wrong account
  token, unverified access attempt.
- Manual or staging: real email delivery, link click from a real mail client, deliverability.

## 14. Proof of delivery

Proof of delivery

- Test command output.
- Staging run with a real inbox, screenshots with addresses redacted.
- Log sample showing no token or password leakage.
- Changed file summary.

## 15. Independent verification

Independent verification

- Verifier: <FILL: human name>
- Environment: staging with a fresh test account
- Procedure: register a new account, attempt protected access before verification, verify,
  sign in, request a reset, use the link twice, and confirm the second use fails.
- Expected result: every acceptance criterion passes.

## 16. Ownership

Ownership

- Agent-owned: implementation, tests, local runs, this contract's report.
- Human-owned: email provider credentials, domain and sending reputation, final security
  acceptance.
- Shared: staging validation.

## 17. Rollback and remediation

The change is reversible by redeploying the previous build. Token schema changes ship as additive migrations so a rollback does not strand issued tokens. If a defect is found after release, invalidate outstanding verification and reset tokens, force reauthentication, and treat any suspected token leakage as a security incident under docs/runbooks/incident-response.md.

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
