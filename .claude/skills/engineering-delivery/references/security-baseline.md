# Pillar 4: Security and privacy

Applies to all protected workflows. The verification baseline is OWASP ASVS. The audit
checklist is `docs/audits/security-audit.md`.

Twelve principles: authenticate appropriately, authorize every protected action on the
server, default to deny, least privilege, treat client input as untrusted, validate at the
server boundary, return only authorized fields, protect secrets and keep them out of client
bundles, log security events without logging secrets, test attacker like paths, secure
integrations and webhooks and jobs and storage and exports, and build privacy and retention
into data design.

## Authentication

- Verify email ownership when email identity is used for account access.
- Use secure password handling through established authentication libraries or providers.
- Use time limited, single use verification and password reset tokens.
- Do not reveal whether an email address exists unless product requirements allow it.
- Do not expose secrets, reset tokens, or session credentials in logs, analytics, client
  bundles, or URLs beyond unavoidable controlled flows.
- Revoke or invalidate sessions after password changes, suspension, or other security events.

## Authorization

- Enforce authorization on the server for every protected action and data query.
- Validate the authenticated user, role, organization, ownership, and resource scope.
- Never rely solely on hidden buttons, disabled UI, route guards, or client state.
- Test direct API and identifier manipulation attempts.
- Verify that a user cannot reach another organization records by changing a URL, form
  field, API payload, query parameter, or resource ID.
- Record audit logs for sensitive administrative actions.

## Data handling

- Validate and sanitize external input.
- Return only fields the requester is authorized to receive.
- Minimize collection and retention of sensitive data.
- Use secure storage and access policies for uploaded files.
- Redact secrets and personal data from logs, screenshots, proof artifacts, and issue reports.
- Use migrations rather than untracked manual production database changes.

## Integrations

- Keep provider secrets server side.
- Verify webhook signatures.
- Handle webhook retries and duplicate delivery safely.
- Use idempotency protections for payments, jobs, and outbound messages.
- Define behavior for provider timeouts, outages, invalid responses, and rate limits.
- Do not claim an integration works until it has been tested with the right environment
  and credentials.

## Required behavior for common workflows

### Authentication and account access

- Sign up works for a new valid user.
- Email verification is required where specified.
- Unverified accounts cannot use protected features.
- Password reset works only with valid, unexpired, single use credentials.
- Invalid, altered, expired, and reused links fail safely.
- Logout and session expiration behave correctly.
- Suspension or deletion removes access as specified.
- Errors do not expose sensitive account information.

### Multi tenant data isolation

- A user can view only permitted organization data.
- A user cannot create records under another organization.
- A user cannot read, edit, delete, export, or share another organization data.
- Role restrictions are enforced on direct API calls.
- Background jobs, exports, webhooks, analytics, and storage paths preserve tenant isolation.
- Database level policies are used where the architecture supports them.

### Integrations and automations

- Credentials are configured only in secure server side environments.
- Failure behavior is clear and non destructive.
- Retries do not duplicate outcomes.
- Events are logged with enough context to troubleshoot safely.
- A test or staging run confirms the live integration path, not only a mock.

## Data classification

Classify before designing storage, not after a breach.

```md
Public data:          intended for anyone.
Internal data:        business information not intended for public exposure.
Customer confidential: client records, campaign data, leads, reports, operations.
Personal data:        names, emails, phone numbers, addresses, identifiers, activity, uploads.
Sensitive data:       payment information, government IDs, passwords, tokens, private keys,
                      health data, financial data, other protected categories.
```

For each category define who can access it, retention, whether it can be exported, whether
it is encrypted at rest by the provider, whether it appears in logs or analytics or support
tooling, how it is deleted or anonymized, and how a user requests access, deletion, or
correction where that applies.

## Security release blockers

Missing server side authorization. Cross user or cross tenant exposure. Exposed secrets.
Unverified password reset, login, verification, or account status workflow. Unverified
payment, webhook, private file, export, or admin workflow. Untracked destructive database
change. No audit trail for high impact admin or financial actions. Security tests that
cannot be executed. A critical or high finding without explicit, time bound risk acceptance
by a human owner.
