# Pillar 3: Architecture and data design

Read before adding complex data, roles, billing, files, or a major third party integration.
Work from `ARCHITECTURE_DECISIONS.md` and update it in the same change.

The record must make clear what runs in the browser versus the server, what data belongs to
which tenant, which systems are sources of truth, how providers connect, which actions are
synchronous versus background, where caching is appropriate, how data is indexed and
retained and exported and deleted, what happens when dependencies fail, and how the system
is monitored and recovered.

Two sections matter more than the rest and are the ones agents skip:

**Tenant model.** How the current organization resolves on the server, how every query is
scoped, how switching works, which records are global, whether row level policies exist, and
how jobs, files, exports, analytics, and integrations preserve the boundary. Get this wrong
and every later feature inherits the bug.

**Scaling assumptions.** Users at launch and in twelve months, records per tenant,
concurrent users, API volume, largest export, most expensive query, most expensive external
call, maximum file storage, and peak demand. Design for the next credible stage, not
imaginary hyperscale, and not for the demo dataset either.

When a plan would change any of these, say so in the plan rather than changing the record
silently. Architecture drift that nobody wrote down is how a system becomes unmaintainable
by anyone except the agent that built it.
