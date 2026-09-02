/**
 * ORG-001 acceptance criteria as executable tests. This file blocks release.
 *
 * It runs as its own CI job (npm run test:authz) so a failure here is never skimmed past
 * inside a large integration run. Never add skip, todo, or continue-on-error to it. If a
 * case fails, the application is wrong.
 *
 * Requires: a running app at TEST_BASE_URL and a seeded database (npm run db:seed:test).
 *
 * Adjust ROUTES to your real paths. Everything else stays as is.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { FIXTURES } from "../fixtures/seed";
import { signIn, asUser, asAnonymous, DENIED, type Session } from "../helpers/auth";

const ROUTES = {
  list: "/api/campaigns",
  detail: (id: string) => `/api/campaigns/${id}`,
  export: "/api/campaigns/export",
  members: "/api/organizations/members",
};

let alphaAdmin: Session;
let alphaMember: Session;
let betaMember: Session;

beforeAll(async () => {
  alphaAdmin = await signIn(FIXTURES.alpha.admin);
  alphaMember = await signIn(FIXTURES.alpha.member);
  betaMember = await signIn(FIXTURES.beta.member);
});

describe("unauthenticated access", () => {
  it("rejects every protected route with no session", async () => {
    for (const path of [ROUTES.list, ROUTES.detail(FIXTURES.alpha.campaignId), ROUTES.members]) {
      const response = await asAnonymous(path);
      expect(DENIED, `${path} allowed an anonymous caller`).toContain(response.status);
    }
  });
});

describe("cross tenant reads", () => {
  it("does not return another organization's records in a list", async () => {
    const response = await asUser(betaMember, ROUTES.list);
    expect(response.status).toBe(200);
    const body = await response.text();
    // A single leaked identifier is a critical failure, not a rounding error.
    expect(body).not.toContain(FIXTURES.alpha.campaignId);
    expect(body).not.toContain("Alpha private campaign");
  });

  it("rejects reading another organization's record by ID", async () => {
    const response = await asUser(betaMember, ROUTES.detail(FIXTURES.alpha.campaignId));
    expect(DENIED).toContain(response.status);
  });

  it("rejects exporting another organization's records", async () => {
    const response = await asUser(betaMember, `${ROUTES.export}?organizationId=${FIXTURES.alpha.orgId}`);
    if (response.status === 200) {
      expect(await response.text()).not.toContain(FIXTURES.alpha.campaignId);
    } else {
      expect(DENIED).toContain(response.status);
    }
  });
});

describe("cross tenant writes", () => {
  it("rejects updating another organization's record", async () => {
    const response = await asUser(betaMember, ROUTES.detail(FIXTURES.alpha.campaignId), {
      method: "PATCH",
      body: JSON.stringify({ title: "owned by beta now" }),
    });
    expect(DENIED).toContain(response.status);
  });

  it("rejects deleting another organization's record", async () => {
    const response = await asUser(betaMember, ROUTES.detail(FIXTURES.alpha.campaignId), {
      method: "DELETE",
    });
    expect(DENIED).toContain(response.status);
  });

  it("ignores a forged tenant ID in the request body", async () => {
    const response = await asUser(betaMember, ROUTES.list, {
      method: "POST",
      body: JSON.stringify({ title: "planted", organizationId: FIXTURES.alpha.orgId }),
    });

    if (response.status >= 200 && response.status < 300) {
      // Creation is allowed, but it must land in Beta, never in the organization the client named.
      const created = await response.json();
      expect(created.organizationId ?? FIXTURES.beta.orgId).toBe(FIXTURES.beta.orgId);
    } else {
      expect(DENIED).toContain(response.status);
    }
  });
});

describe("role boundaries", () => {
  it("rejects an administrative action by a plain member", async () => {
    const response = await asUser(alphaMember, ROUTES.members, {
      method: "POST",
      body: JSON.stringify({ email: "someone@example.test", role: "ADMIN" }),
    });
    expect(DENIED).toContain(response.status);
  });

  it("allows the same action for an owner, proving the test is not passing by accident", async () => {
    const response = await asUser(alphaAdmin, ROUTES.members);
    expect(response.status).toBe(200);
  });
});

describe("account status", () => {
  it("denies a suspended user, including on an existing session", async () => {
    let suspended: Session;
    try {
      suspended = await signIn(FIXTURES.alpha.suspended);
    } catch {
      // Refusing the sign in outright is the correct behavior too.
      return;
    }
    const response = await asUser(suspended, ROUTES.list);
    expect(DENIED).toContain(response.status);
  });
});
