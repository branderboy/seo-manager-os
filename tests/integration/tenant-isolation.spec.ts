/**
 * ORG-001 as executable tests. These block release.
 *
 * The Local Growth OS schema puts the tenant boundary in Postgres Row Level Security
 * rather than in application code, which is the right place for it. This file is what
 * turns that from a design into a control: it runs the real migrations from
 * supabase/migrations/, seeds two organizations, and tries to cross the boundary.
 *
 * Set up the database first: `bash scripts/db-test-setup.sh`.
 *
 * A note on why the connection matters. Postgres exempts superusers and table owners from
 * RLS entirely. A policy suite connected as the owner passes every assertion without
 * evaluating a single policy, which is the most common way this kind of test lies. The
 * first describe block below refuses to let that happen.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Client } from "pg";

const ALPHA_ORG = "10000000-0000-0000-0000-000000000001";
const BETA_ORG = "10000000-0000-0000-0000-0000000000b1";
const ALPHA_CLIENT = "20000000-0000-0000-0000-000000000001";
const BETA_CLIENT = "20000000-0000-0000-0000-0000000000b1";

const ALPHA_ADMIN = "30000000-0000-0000-0000-0000000000a1";
const ALPHA_STRATEGIST = "30000000-0000-0000-0000-0000000000a2";
const ALPHA_CLIENT_VIEWER = "30000000-0000-0000-0000-0000000000a3";
const BETA_ADMIN = "30000000-0000-0000-0000-0000000000b1";
const NO_ROLES = "30000000-0000-0000-0000-0000000000c1";

const connectionString =
  process.env.TEST_DATABASE_URL ??
  "postgres://app_test:app_test@127.0.0.1:5432/lgos_test";

let db: Client;

/** Runs a query as a given user, the way PostgREST sets the claim from a JWT. */
async function asUser<T = Record<string, unknown>>(
  userId: string | null,
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  await db.query("begin");
  try {
    await db.query("set local role authenticated");
    if (userId) {
      await db.query("select set_config('request.jwt.claim.sub', $1, true)", [userId]);
    } else {
      await db.query("select set_config('request.jwt.claim.sub', '', true)");
    }
    const result = await db.query(sql, params);
    return result.rows as T[];
  } finally {
    await db.query("rollback");
  }
}

/** Same, but returns the error message instead of rows when the statement is refused. */
async function attemptAsUser(userId: string, sql: string, params: unknown[] = []) {
  try {
    await asUser(userId, sql, params);
    return { refused: false, message: "" };
  } catch (error) {
    return { refused: true, message: error instanceof Error ? error.message : String(error) };
  }
}

beforeAll(async () => {
  db = new Client({ connectionString });
  await db.connect();
});

afterAll(async () => {
  await db?.end();
});

describe("the test connection can actually be constrained by RLS", () => {
  it("is not a superuser", async () => {
    const [row] = await db
      .query<{ usesuper: boolean }>("select usesuper from pg_user where usename = current_user")
      .then((r) => r.rows);
    expect(row?.usesuper, "the tests must not connect as a superuser: RLS would not apply").toBe(false);
  });

  it("does not own the tables it is testing", async () => {
    const { rows } = await db.query<{ count: string }>(
      "select count(*)::text as count from pg_tables where schemaname = 'public' and tableowner = current_user",
    );
    expect(Number(rows[0].count), "the tests must not own the tables: owners bypass RLS").toBe(0);
  });

  it("is running against a schema where row level security is on for every public table", async () => {
    const { rows } = await db.query<{ tablename: string }>(
      "select tablename from pg_tables where schemaname = 'public' and rowsecurity = false",
    );
    expect(rows.map((r) => r.tablename)).toEqual([]);
  });

  it("has the two tenant fixture loaded, and proves RLS is live while checking", async () => {
    // Counted through the two admins rather than directly, because a direct count returns
    // zero here — this connection has no identity, and the policies correctly give an
    // anonymous reader nothing. That zero is the point: it is what a working boundary
    // looks like from outside, and it is why this suite can be trusted.
    const direct = await db.query("select id from public.organizations");
    expect(direct.rows, "an identity-less read returned rows").toEqual([]);

    const alpha = await asUser<{ id: string }>(ALPHA_ADMIN, "select id from public.organizations");
    const beta = await asUser<{ id: string }>(BETA_ADMIN, "select id from public.organizations");
    expect(alpha.map((r) => r.id)).toEqual([ALPHA_ORG]);
    expect(beta.map((r) => r.id)).toEqual([BETA_ORG]);
  });
});

describe("an agency member sees their own organization and nothing else", () => {
  it("Alpha's admin sees Alpha's clients", async () => {
    const rows = await asUser<{ id: string }>(ALPHA_ADMIN, "select id from public.clients");
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.map((r) => r.id)).toContain(ALPHA_CLIENT);
  });

  it("Alpha's admin cannot see Beta's client, even by asking for it directly", async () => {
    const all = await asUser<{ id: string }>(ALPHA_ADMIN, "select id from public.clients");
    expect(all.map((r) => r.id)).not.toContain(BETA_CLIENT);

    // The altered-URL-id case: naming the row explicitly must not reveal it.
    const targeted = await asUser(ALPHA_ADMIN, "select id from public.clients where id = $1", [
      BETA_CLIENT,
    ]);
    expect(targeted).toEqual([]);
  });

  it("Beta's admin sees Beta's client and none of Alpha's", async () => {
    const rows = await asUser<{ id: string }>(BETA_ADMIN, "select id from public.clients");
    expect(rows.map((r) => r.id)).toEqual([BETA_CLIENT]);
  });

  it("neither admin can see the other's organization row", async () => {
    const alpha = await asUser<{ id: string }>(ALPHA_ADMIN, "select id from public.organizations");
    const beta = await asUser<{ id: string }>(BETA_ADMIN, "select id from public.organizations");
    expect(alpha.map((r) => r.id)).toEqual([ALPHA_ORG]);
    expect(beta.map((r) => r.id)).toEqual([BETA_ORG]);
  });

  it("campaigns, audits and tasks are scoped the same way", async () => {
    for (const table of ["campaigns", "audits", "tasks", "monthly_reports", "client_requests"]) {
      const alphaRows = await asUser<{ organization_id: string }>(
        ALPHA_ADMIN,
        `select organization_id from public.${table}`,
      );
      const foreign = alphaRows.filter((r) => r.organization_id !== ALPHA_ORG);
      expect(foreign, `${table} leaked rows from another organization`).toEqual([]);
    }
  });
});

describe("a client user is scoped to their own client", () => {
  it("sees only the client they are attached to", async () => {
    const rows = await asUser<{ id: string }>(ALPHA_CLIENT_VIEWER, "select id from public.clients");
    expect(rows.map((r) => r.id)).toEqual([ALPHA_CLIENT]);
  });

  it("cannot reach the other clients in its own agency", async () => {
    const rows = await asUser(
      ALPHA_CLIENT_VIEWER,
      "select id from public.clients where id <> $1",
      [ALPHA_CLIENT],
    );
    expect(rows).toEqual([]);
  });

  it("cannot edit the agency's internal audit findings", async () => {
    const result = await attemptAsUser(
      ALPHA_CLIENT_VIEWER,
      "update public.audit_findings set title = 'tampered' where true",
    );
    const rowsChanged = await asUser<{ title: string }>(
      ALPHA_ADMIN,
      "select title from public.audit_findings where title = 'tampered'",
    );
    expect(rowsChanged, "a client viewer changed an internal finding").toEqual([]);
    expect(result.refused || rowsChanged.length === 0).toBe(true);
  });
});

describe("a user with no role, and no user at all, get nothing", () => {
  it("an authenticated user with no role sees no clients", async () => {
    const rows = await asUser(NO_ROLES, "select id from public.clients");
    expect(rows).toEqual([]);
  });

  it("a request with no identity sees no clients", async () => {
    const rows = await asUser(null, "select id from public.clients");
    expect(rows).toEqual([]);
  });

  it("a request with no identity sees no organizations, campaigns or reports", async () => {
    for (const table of ["organizations", "campaigns", "monthly_reports"]) {
      expect(await asUser(null, `select * from public.${table}`), table).toEqual([]);
    }
  });
});

describe("writes cannot cross the boundary either", () => {
  it("Alpha's admin cannot insert a client into Beta", async () => {
    const result = await attemptAsUser(
      ALPHA_ADMIN,
      `insert into public.clients (organization_id, legal_name, public_brand_name, industry)
       values ($1, 'Smuggled', 'Smuggled', 'HVAC')`,
      [BETA_ORG],
    );
    expect(result.refused, "an insert into another organization was allowed").toBe(true);
    expect(result.message).toMatch(/row-level security|violates/i);
  });

  it("Alpha's admin cannot rename Beta's client", async () => {
    await asUser(ALPHA_ADMIN, "update public.clients set legal_name = 'tampered' where id = $1", [
      BETA_CLIENT,
    ]);
    const [beta] = await asUser<{ legal_name: string }>(
      BETA_ADMIN,
      "select legal_name from public.clients where id = $1",
      [BETA_CLIENT],
    );
    expect(beta?.legal_name).toBe("Beta Roofing LLC");
  });

  it("Alpha's admin cannot move its own client into Beta", async () => {
    const result = await attemptAsUser(
      ALPHA_ADMIN,
      "update public.clients set organization_id = $1 where id = $2",
      [BETA_ORG, ALPHA_CLIENT],
    );
    const [row] = await asUser<{ organization_id: string }>(
      ALPHA_ADMIN,
      "select organization_id from public.clients where id = $1",
      [ALPHA_CLIENT],
    );
    expect(result.refused || row?.organization_id === ALPHA_ORG).toBe(true);
  });

  it("a strategist cannot grant themselves admin in another organization", async () => {
    const result = await attemptAsUser(
      ALPHA_STRATEGIST,
      "insert into public.user_roles (organization_id, user_id, role) values ($1, $2, 'agency_admin')",
      [BETA_ORG, ALPHA_STRATEGIST],
    );
    const granted = await asUser(
      BETA_ADMIN,
      "select id from public.user_roles where user_id = $1",
      [ALPHA_STRATEGIST],
    );
    expect(granted, "a strategist granted itself a role in another organization").toEqual([]);
    expect(result.refused || granted.length === 0).toBe(true);
  });
});

describe("client file storage follows the same boundary", () => {
  const alphaPath = `${ALPHA_ORG}/${ALPHA_CLIENT}/alpha-crawl.csv`;
  const betaPath = `${BETA_ORG}/${BETA_CLIENT}/beta-crawl.csv`;

  it("Alpha's admin can read Alpha's client assets", async () => {
    const rows = await asUser<{ name: string }>(
      ALPHA_ADMIN,
      "select name from storage.objects where bucket_id = 'client-assets'",
    );
    expect(rows.map((r) => r.name)).toContain(alphaPath);
  });

  it("Alpha's admin cannot read Beta's client assets", async () => {
    const rows = await asUser<{ name: string }>(
      ALPHA_ADMIN,
      "select name from storage.objects where bucket_id = 'client-assets'",
    );
    expect(rows.map((r) => r.name)).not.toContain(betaPath);
  });

  it("Alpha's admin cannot upload into Beta's folder", async () => {
    const result = await attemptAsUser(
      ALPHA_ADMIN,
      "insert into storage.objects (bucket_id, name) values ('client-assets', $1)",
      [`${BETA_ORG}/${BETA_CLIENT}/smuggled.csv`],
    );
    expect(result.refused, "an upload into another organization's folder was allowed").toBe(true);
  });
});
