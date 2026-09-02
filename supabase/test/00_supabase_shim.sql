-- Supabase compatibility shim, for running the real migrations against a plain Postgres.
--
-- The migrations under supabase/migrations/ are written for Supabase and reference objects
-- the platform provides: auth.users, auth.uid(), and the storage schema. Nothing else about
-- them is Supabase-specific — the tenant boundary is ordinary Postgres Row Level Security.
--
-- This file recreates the minimum of that surface so the policies can be executed and
-- tested in CI without a Supabase instance. It is a TEST HARNESS. It is never applied to a
-- real database, it is not a migration, and it makes no claim to be a faithful copy of
-- Supabase. What it buys is the thing that matters: the policies stop being unexecuted SQL.
--
-- auth.uid() reads the same GUC Supabase populates from the JWT, so a test switches user by
-- `set local request.jwt.claim.sub = '<uuid>'`.

create schema if not exists auth;
create schema if not exists storage;

create table if not exists auth.users (
  id uuid primary key,
  email text unique
);

create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

create or replace function auth.role()
returns text
language sql
stable
as $$
  select coalesce(nullif(current_setting('request.jwt.claim.role', true), ''), 'authenticated');
$$;

create table if not exists storage.buckets (
  id text primary key,
  name text not null,
  public boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists storage.objects (
  id uuid primary key default gen_random_uuid(),
  bucket_id text not null references storage.buckets(id) on delete cascade,
  name text not null,
  owner uuid,
  created_at timestamptz not null default now()
);

-- Supabase splits an object path on "/" and returns the folder segments.
create or replace function storage.foldername(name text)
returns text[]
language plpgsql
immutable
as $$
declare
  parts text[];
begin
  parts := string_to_array(name, '/');
  return parts[1:array_length(parts, 1) - 1];
end;
$$;

alter table storage.objects enable row level security;

-- The role the application connects as. Not a superuser, so RLS actually applies:
-- Postgres exempts superusers and table owners from row level security, which is the
-- classic way a policy test passes while proving nothing.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
end
$$;

grant usage on schema public, auth, storage to authenticated;
