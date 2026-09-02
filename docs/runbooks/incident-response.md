# Runbook: Incident response

Production owner: **Open — no named human is recorded in this repository.**
Escalation contact: **Open.** | Last reviewed: 2026-09-02

> **This runbook does not work yet, and the reason is worth stating first.** There is no
> error tracking, no logging, no health check and no alerting anywhere in this application
> (`docs/production/INVENTORY.md`). Nothing will tell anyone that an incident is happening.
> Every incident is currently detected by a person opening the site. Closing that gap is
> blocking item 2 in `PRODUCTION_READINESS.md` and is the cheapest item on that list.
>
> What an incident can look like today is also narrow, because the deployed application is a
> static, data-free demo: a failed or broken deploy, a basePath regression that 404s every
> asset, or GitHub Pages itself being down. There is no customer data to expose and no
> payment to harm — **yet**. The severity table below is written for what this becomes, not
> only for what it is.

## Severity

| Level | Meaning | Response |
|---|---|---|
| Critical | Unauthorized access, tenant data exposure, data loss, payment harm, exposed secrets, or the app is unusable | Immediate. Wake someone |
| High | An important workflow fails, security control bypassed, or major user harm under realistic conditions | Same day |
| Medium | Important defect with a workaround or limited blast radius | Next working day |
| Low | Usability, polish, minor correctness | Backlog |

## First fifteen minutes

1. Declare the incident and name one owner. One owner, not a group chat.
2. Answer: what failed, who is affected, when did it begin, what changed.
3. Check the most recent deploy. Recent change is the most likely cause.
4. Decide contain, roll back, or fix forward. Prefer contain and roll back.
5. If customer data may have been exposed, stop and treat it as a security incident:
   preserve logs before changing anything.

## Containment options

- Roll back the release. See `rollback.md`.
- Disable the affected route or feature flag.
- Pause the queue or the integration. See `integration-failure.md`.
- Revoke sessions or credentials if identity is involved.

## Communication

- Who tells customers, and at what severity: **Open.** There are no customers of the
  deployed demo, so nothing is defined. This must be answered before the first paid beta.
- Where status is posted: **Open.** No status page exists.
- Who decides on a breach notification, which is never the agent: **Open — must be the named
  production owner.** Record a name here before the application holds anyone's data.

## After

Within **5 working days**, write a short record: timeline, cause, what detected it, what
should have detected it, what the fix was, and which contract or test gets updated so the
same failure is caught next time. No blame on people. Blame on missing evidence.
