#!/usr/bin/env bash
# Builds the authorization test database: Supabase shim, the real migrations, the demo
# seed, then the two-tenant fixture.
#
# The point is that the migrations under supabase/migrations/ are actually executed. They
# describe the tenant boundary this product depends on, and SQL that has never run is a
# hypothesis rather than a control.
#
# Usage: bash scripts/db-test-setup.sh
# Env:   DATABASE_URL, or the standard PG* variables. TEST_DB_NAME defaults to lgos_test.

set -euo pipefail

DB_NAME="${TEST_DB_NAME:-lgos_test}"
ADMIN_URL="${DATABASE_URL:-postgres://postgres@127.0.0.1:5432/postgres}"
APP_ROLE_PASSWORD="${APP_ROLE_PASSWORD:-app_test}"
BASE_URL="${ADMIN_URL%/*}"
TEST_URL="$BASE_URL/$DB_NAME"

echo "Rebuilding $DB_NAME"
psql "$ADMIN_URL" -v ON_ERROR_STOP=1 -q -c "drop database if exists $DB_NAME;"
psql "$ADMIN_URL" -v ON_ERROR_STOP=1 -q -c "create database $DB_NAME;"

apply() {
  echo "  applying $1"
  psql "$TEST_URL" -v ON_ERROR_STOP=1 -q -f "$1"
}

apply supabase/test/00_supabase_shim.sql
for migration in supabase/migrations/*.sql; do apply "$migration"; done
apply supabase/seed.sql
apply supabase/test/01_two_tenant_fixture.sql

# The role the tests connect as. Not the owner and not a superuser, so RLS applies.
psql "$TEST_URL" -v ON_ERROR_STOP=1 -v app_role_password="$APP_ROLE_PASSWORD" -q <<'SQL'
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'app_test') then
    create role app_test login;
  end if;
end
$$;
alter role app_test with login password :'app_role_password';
grant authenticated to app_test;
grant usage on schema public, auth, storage to app_test;
SQL

echo "Ready. Connect as app_test to exercise the policies."
