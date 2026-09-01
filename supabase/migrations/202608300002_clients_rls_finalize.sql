-- Replace the temporary generated client_id alias with explicit policies for
-- the clients table itself. Child tables continue to use the generic policies
-- from the foundation migration.

drop policy if exists clients_tenant_select on public.clients;
drop policy if exists clients_agency_insert on public.clients;
drop policy if exists clients_agency_update on public.clients;
drop policy if exists clients_agency_delete on public.clients;

alter table public.clients drop column if exists client_id;

create policy clients_tenant_select
on public.clients
for select
using (
  public.is_agency_member(organization_id)
  or public.can_view_client(id, client_visible)
);

create policy clients_agency_insert
on public.clients
for insert
with check (public.is_agency_member(organization_id));

create policy clients_agency_update
on public.clients
for update
using (public.can_manage_client(id))
with check (public.can_manage_client(id));

create policy clients_agency_delete
on public.clients
for delete
using (public.can_manage_client(id));

drop event trigger if exists local_growth_clients_rls_preflight_trigger;
drop function if exists public.local_growth_clients_rls_preflight();
