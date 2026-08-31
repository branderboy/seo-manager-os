-- Compatibility shim for the first Local Growth OS migration.
-- The foundation migration applies one generic client-owned RLS loop to all
-- tables, including `clients`. Child tables have client_id; clients itself
-- uses id. This short-lived event trigger adds a generated client_id alias
-- as soon as public.clients is created so the foundation migration can finish.
-- The following 202608300002 migration removes the alias and installs the
-- correct explicit policies, leaving the final schema clean.

create or replace function public.local_growth_clients_rls_preflight()
returns event_trigger
language plpgsql
as $$
begin
  if to_regclass('public.clients') is not null
     and not exists (
       select 1
       from information_schema.columns
       where table_schema = 'public'
         and table_name = 'clients'
         and column_name = 'client_id'
     ) then
    execute 'alter table public.clients add column client_id uuid generated always as (id) stored';
  end if;
end;
$$;

create event trigger local_growth_clients_rls_preflight_trigger
on ddl_command_end
execute function public.local_growth_clients_rls_preflight();
