# The two tenant baseline

Every authorization test runs against two organizations, because a boundary tested from
inside one tenant is not tested at all: with no one else's data present, every query
trivially returns "your own" rows and the test passes whether or not the policy works.

| Fixture | Id | Notes |
|---|---|---|
| Organization Alpha — Local Growth Lab | `10000000-…-000000000001` | The demo organization from `supabase/seed.sql`. Three clients. |
| Organization Beta — Beta Search Partners | `10000000-…-0000000000b1` | Exists only in the test fixture. One client. |
| Alpha admin | `30000000-…-0000000000a1` | `agency_admin` in Alpha |
| Alpha strategist | `30000000-…-0000000000a2` | `seo_strategist` in Alpha |
| Alpha client viewer | `30000000-…-0000000000a3` | `client_viewer` in Alpha, scoped to Capital Comfort only |
| Beta admin | `30000000-…-0000000000b1` | `agency_admin` in Beta |
| No-roles user | `30000000-…-0000000000c1` | Authenticated and entitled to nothing |

Defined in `supabase/test/01_two_tenant_fixture.sql`. Applied by
`scripts/db-test-setup.sh`, which also applies the real migrations from
`supabase/migrations/` and the Supabase shim in `supabase/test/00_supabase_shim.sql`.

## The rule that makes these tests real

Postgres exempts superusers and table owners from row level security. A policy test that
connects as the owner passes without exercising a single policy. `scripts/db-test-setup.sh`
therefore creates a separate `authenticated` login role with plain table grants, and
`tests/integration/tenant-isolation.spec.ts` asserts up front that its own connection is
neither a superuser nor the owner. If that assertion is ever removed, the rest of the file
stops meaning anything.
