-- Two-tenant fixture for the authorization tests.
--
-- The delivery standard requires two organizations, because a boundary you only ever test
-- from inside one tenant is not tested at all: every query trivially returns "your own"
-- data when there is no one else's data to leak. See tests/fixtures/tenants.md.
--
-- Organization Alpha is the demo organization from supabase/seed.sql (Local Growth Lab).
-- Organization Beta exists only here. Test data, never seeded into a real environment.

-- Alpha: the seeded organization and its Capital Comfort client.
-- 10000000-…-0001  Local Growth Lab
-- 20000000-…-0001  Capital Comfort HVAC

-- Beta: a competing agency that must never see Alpha's anything.
insert into public.organizations (id, name, slug, plan, billing_email)
values ('10000000-0000-0000-0000-0000000000b1', 'Beta Search Partners', 'beta-search', 'demo', 'ops@beta.test')
on conflict (id) do nothing;

insert into public.clients (id, organization_id, legal_name, public_brand_name, industry)
values (
  '20000000-0000-0000-0000-0000000000b1',
  '10000000-0000-0000-0000-0000000000b1',
  'Beta Roofing LLC', 'Beta Roofing', 'Roofing'
)
on conflict (id) do nothing;

-- Users. auth.users first, because public.users references it.
insert into auth.users (id, email) values
  ('30000000-0000-0000-0000-0000000000a1', 'alpha-admin@test'),
  ('30000000-0000-0000-0000-0000000000a2', 'alpha-strategist@test'),
  ('30000000-0000-0000-0000-0000000000a3', 'alpha-client-viewer@test'),
  ('30000000-0000-0000-0000-0000000000b1', 'beta-admin@test'),
  ('30000000-0000-0000-0000-0000000000c1', 'no-roles@test')
on conflict (id) do nothing;

insert into public.users (id, full_name, email) values
  ('30000000-0000-0000-0000-0000000000a1', 'Alpha Admin', 'alpha-admin@test'),
  ('30000000-0000-0000-0000-0000000000a2', 'Alpha Strategist', 'alpha-strategist@test'),
  ('30000000-0000-0000-0000-0000000000a3', 'Alpha Client Viewer', 'alpha-client-viewer@test'),
  ('30000000-0000-0000-0000-0000000000b1', 'Beta Admin', 'beta-admin@test'),
  ('30000000-0000-0000-0000-0000000000c1', 'No Roles', 'no-roles@test')
on conflict (id) do nothing;

insert into public.user_roles (organization_id, user_id, role, client_id) values
  ('10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-0000000000a1', 'agency_admin', null),
  ('10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-0000000000a2', 'seo_strategist', null),
  ('10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-0000000000a3', 'client_viewer', '20000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-0000000000b1', '30000000-0000-0000-0000-0000000000b1', 'agency_admin', null)
on conflict do nothing;

-- Storage objects on both tenants' paths: <organization_id>/<client_id>/<file>.
insert into storage.objects (bucket_id, name) values
  ('client-assets', '10000000-0000-0000-0000-000000000001/20000000-0000-0000-0000-000000000001/alpha-crawl.csv'),
  ('client-assets', '10000000-0000-0000-0000-0000000000b1/20000000-0000-0000-0000-0000000000b1/beta-crawl.csv')
on conflict do nothing;

-- The application role. RLS does not apply to superusers or table owners, so the tests
-- must connect as this role or they would pass while proving nothing.
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select, insert, update, delete on all tables in schema storage to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant execute on all functions in schema public to authenticated;
grant execute on all functions in schema auth to authenticated;
grant execute on all functions in schema storage to authenticated;
