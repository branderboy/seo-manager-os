# Workflow: The core object

Contract: `CORE-001`. Risk: Critical.

The central object this product manages is the **Engagement** — one agency's work on one
client, from discovery through to reporting. Everything else in the product hangs off it:
the diagnosis belongs to an engagement, the brief is generated from the diagnosis, the tasks
come from the brief, and the report proves the tasks moved something.

The Client is the record; the Engagement is the work. They are separated because an agency
can lose and re-win the same client, and the history of what was diagnosed and fixed has to
survive that.

## Current state

Engagements exist as a TypeScript shape over mock data
(`src/lib/engagements.ts`, `src/lib/model.ts`), held in React context and persisted to the
visitor's own `localStorage` under `smos.engagement`
(`src/components/engagement/store.tsx`). There is no server, so none of the "required
behavior" below is enforced anywhere. This document describes what CORE-001 must make true,
not what is true.

## Steps in scope

Create an engagement from a client; view it; switch the active engagement; edit the client
profile behind it; move it through the nine pipeline stages; archive it when the retainer
ends; search and filter the client list; export the brief, the tasks and the results; share
the brief and the results read-only with the end client; and record audit history of who
changed what.

## Actor and trigger

| Step | Actor | Trigger |
|---|---|---|
| Create engagement | Agency SEO lead | Completing the discovery interview for a client |
| View, switch active engagement | Any member of the owning agency | Selecting a client in the switcher or on `/clients` |
| Edit client profile | Agency SEO lead | Editing the client record |
| Advance a stage | Agency SEO lead, or an AI Workforce agent producing a draft the lead approves | Completing the previous stage's outputs |
| Approve or reject a brief | Agency SEO lead | The brief reaching `Ready for approval` |
| Share read-only | Agency SEO lead | Explicitly generating a share link |
| Export | Any member of the owning agency | Requesting CSV or PDF |
| Archive | Agency SEO lead | The retainer ending |

`docs/SOURCE_OF_TRUTH.md` records that multi-seat roles and approval chains are **not** a
priority. The role model here should therefore stay minimal — one agency-member role plus
the read-only share recipient — until there is a reason for more.

## Required behavior

- An authorized member can take an engagement from discovery to a shared report without
  leaving the product.
- Required fields are validated on the server, not only in the browser.
- An engagement, its diagnosis, its brief, its tasks and its reports are visible only to
  members of the owning agency, plus anyone holding a valid share link for the specific
  artifact that was shared.
- Only permitted roles can approve a brief, share, export, or archive.
- Invalid stage transitions are rejected. A stage cannot be completed before the stage whose
  outputs it consumes — the dependency graph is already modelled in `src/lib/dependencies.ts`
  and `src/lib/stages.ts`.
- Duplicate submission does not create two engagements for the same client.
- **Archival is a soft delete**, reversible by an agency member, because the history of what
  was diagnosed and fixed is the product's value and a hard delete throws it away. A hard
  delete exists only as an explicit account-closure action by the owner.
- List and search stay responsive at **50 clients per agency and 12 months of tasks,
  rankings and reports per client**, with pagination bounds. Today every list renders its
  whole array with no pagination at all, which is recorded as a finding in
  `docs/audits/production-readiness-audit.md`.
- A share link is revocable, and revoking it takes effect immediately.

## Error and edge cases

Empty state before any client exists; the first engagement; an engagement with a year of
history; two agency members editing the same brief at once; archiving a client that a live
share link points at; exporting more rows than the page limit; filtering with no matches;
a retried create after a timeout; a share link opened after revocation; a stage advanced
while an AI Workforce agent is still producing its draft; and a client whose data source
disconnects mid-engagement.

Note that the last two only exist once the AI Workforce and the integrations are real. Both
are Critical rows in `docs/production/WORKFLOW-RISK-REGISTER.md`.

## Data touched

The engagement record and its status; the client profile; the diagnosis and its root causes;
the brief and its versions, approvals and share links; tasks and their lifecycle state;
rankings, mentions and report snapshots; export artifacts; audit history.

## Notifications and background work

- On sharing a brief or report: generate the share artifact and notify the recipient.
- On stage completion: queue the next stage's agent run, if the AI Workforce is deployed for
  that stage.
- On a scheduled cadence: ingest rankings, GSC, GA4 and GBP data per client, and run the
  AI-mention fan-out. **This is the load-bearing background work of the whole product** and
  the dominant cost driver in `ARCHITECTURE_DECISIONS.md`.
- On task completion: capture the before-and-after metric window that closes the measurement
  loop.
- **Never**: publish anything to a client's site, GBP profile, or any external property.
  `docs/SOURCE_OF_TRUTH.md` records no-auto-publishing as a locked decision.

## Evidence required

End to end recording of an engagement from discovery to a shared report; role matrix results;
cross-agency access attempt results, by altered URL id and by altered request body; share
link revocation tested; query timing against a seeded 50-client, 12-month dataset; and proof
that archival is reversible and that a hard delete removes what it claims to.
