-- Local Growth OS foundation
-- Multi-tenant schema for agency users + client portal users.
-- Run with Supabase CLI: supabase db reset (local) or supabase migration up.

create extension if not exists pgcrypto;

create type public.app_role as enum (
  'agency_admin',
  'lead_seo',
  'seo_strategist',
  'content_outreach',
  'client_viewer',
  'client_editor'
);
create type public.workflow_status as enum (
  'not_started','new','investigating','planned','in_progress','waiting_on_client','blocked','completed','accepted_risk','not_applicable'
);
create type public.priority_level as enum ('low','medium','high','critical');
create type public.business_model as enum ('storefront','service_area','hybrid');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  plan text not null default 'demo',
  billing_email text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  avatar_url text,
  timezone text not null default 'America/New_York',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  legal_name text not null,
  public_brand_name text not null,
  website text,
  industry text not null,
  business_model public.business_model not null default 'service_area',
  primary_phone text,
  business_address jsonb not null default '{}'::jsonb,
  timezone text not null default 'America/New_York',
  contract_status text not null default 'active',
  start_date date,
  residential_commercial text not null default 'residential',
  emergency_services boolean not null default false,
  minimum_job_size numeric(12,2),
  trust_details jsonb not null default '{}'::jsonb,
  seasonal_notes text,
  capacity_constraints text,
  client_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, public_brand_name)
);
create index clients_org_idx on public.clients(organization_id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role public.app_role not null,
  client_id uuid references public.clients(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (organization_id, user_id, role, client_id),
  check (
    (role in ('client_viewer','client_editor') and client_id is not null)
    or (role not in ('client_viewer','client_editor') and client_id is null)
  )
);
create index user_roles_user_idx on public.user_roles(user_id);
create index user_roles_org_idx on public.user_roles(organization_id);
create index user_roles_client_idx on public.user_roles(client_id);

create table public.client_contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  title text,
  is_primary boolean not null default false,
  client_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  status text not null default 'onboarding',
  baseline_date date,
  primary_city text,
  target_cities text[] not null default '{}',
  target_zip_codes text[] not null default '{}',
  excluded_areas text[] not null default '{}',
  priority_markets text[] not null default '{}',
  kpis text[] not null default '{}',
  initial_notes text,
  start_date date,
  client_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index campaigns_client_idx on public.campaigns(client_id);

create table public.campaign_users (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null default 'contributor',
  client_visible boolean not null default false,
  created_at timestamptz not null default now(),
  unique(campaign_id, user_id)
);

create table public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  business_name text not null,
  phone text,
  website text,
  address jsonb not null default '{}'::jsonb,
  hours jsonb not null default '{}'::jsonb,
  categories text[] not null default '{}',
  notes text,
  client_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  name text not null,
  address jsonb not null default '{}'::jsonb,
  latitude numeric(10,7),
  longitude numeric(10,7),
  is_primary boolean not null default false,
  client_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.service_areas (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  area_type text not null default 'city',
  name text not null,
  state text,
  zip_code text,
  priority public.priority_level not null default 'medium',
  excluded boolean not null default false,
  client_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  name text not null,
  priority public.priority_level not null default 'medium',
  high_margin boolean not null default false,
  average_ticket numeric(12,2),
  active boolean not null default true,
  client_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.competitors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  name text not null,
  website text,
  gbp_url text,
  primary_category text,
  review_count integer,
  rating numeric(3,2),
  service_areas text[] not null default '{}',
  observed_services text[] not null default '{}',
  notes jsonb not null default '{}'::jsonb,
  client_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.competitor_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  competitor_id uuid not null references public.competitors(id) on delete cascade,
  captured_at timestamptz not null default now(),
  metrics jsonb not null default '{}'::jsonb,
  screenshot_url text,
  client_visible boolean not null default true
);

create table public.audit_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  audit_type text not null,
  version integer not null default 1,
  template jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, name, version)
);

create table public.audits (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  template_id uuid references public.audit_templates(id) on delete set null,
  audit_type text not null,
  name text not null,
  status public.workflow_status not null default 'new',
  health_score numeric(5,2),
  owner_user_id uuid references public.users(id),
  started_at timestamptz,
  completed_at timestamptz,
  client_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_sections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  audit_id uuid not null references public.audits(id) on delete cascade,
  name text not null,
  weight numeric(7,4) not null default 1,
  sort_order integer not null default 0,
  score numeric(5,2),
  client_visible boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.audit_findings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  audit_id uuid not null references public.audits(id) on delete cascade,
  section_id uuid references public.audit_sections(id) on delete set null,
  title text not null,
  checklist_item text,
  severity public.priority_level not null default 'medium',
  impact integer not null default 3 check (impact between 1 and 5),
  effort integer not null default 3 check (effort between 1 and 5),
  confidence integer not null default 3 check (confidence between 1 and 5),
  owner_user_id uuid references public.users(id),
  due_date date,
  status public.workflow_status not null default 'new',
  evidence_url text,
  attachment_url text,
  notes text,
  recommendation text,
  client_explanation text,
  risk_acknowledged boolean not null default false,
  client_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index audit_findings_priority_idx on public.audit_findings(campaign_id, impact desc, confidence desc, effort asc);

create table public.recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  finding_id uuid references public.audit_findings(id) on delete set null,
  title text not null,
  recommendation text not null,
  impact integer not null default 3,
  effort integer not null default 3,
  confidence integer not null default 3,
  approval_status text not null default 'draft',
  client_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.strategy_roadmaps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  name text not null,
  horizon_days integer not null default 90,
  status text not null default 'draft',
  human_approved boolean not null default false,
  client_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roadmap_initiatives (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  roadmap_id uuid not null references public.strategy_roadmaps(id) on delete cascade,
  name text not null,
  initiative_type text not null,
  business_objective text,
  search_objective text,
  priority_score numeric(8,2),
  expected_impact integer not null default 3,
  effort integer not null default 3,
  confidence integer not null default 3,
  dependency text,
  owner_user_id uuid references public.users(id),
  start_date date,
  end_date date,
  status public.workflow_status not null default 'planned',
  kpi_connection text,
  client_explanation text,
  internal_notes text,
  completion_evidence text,
  source_finding_id uuid references public.audit_findings(id) on delete set null,
  human_approved boolean not null default false,
  client_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  roadmap_initiative_id uuid references public.roadmap_initiatives(id) on delete set null,
  audit_finding_id uuid references public.audit_findings(id) on delete set null,
  title text not null,
  workstream text not null,
  priority public.priority_level not null default 'medium',
  owner_user_id uuid references public.users(id),
  due_date date,
  status public.workflow_status not null default 'not_started',
  dependency text,
  recurrence text,
  estimated_minutes integer,
  actual_minutes integer,
  related_url text,
  qa_checklist jsonb not null default '[]'::jsonb,
  approval_status text not null default 'not_required',
  completion_evidence text,
  internal_notes text,
  client_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.task_comments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  author_user_id uuid references public.users(id),
  body text not null,
  internal_only boolean not null default true,
  client_visible boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.task_attachments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  client_visible boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.keyword_clusters (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  name text not null,
  service text,
  location text,
  intent text,
  funnel_stage text,
  business_value integer not null default 3,
  priority public.priority_level not null default 'medium',
  preferred_url text,
  client_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.keywords (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  cluster_id uuid references public.keyword_clusters(id) on delete set null,
  keyword text not null,
  intent text not null default 'transactional',
  monthly_volume integer,
  difficulty numeric(6,2),
  cpc numeric(10,2),
  business_value integer not null default 3,
  target_city text,
  priority public.priority_level not null default 'medium',
  serp_features text[] not null default '{}',
  serp_notes text,
  client_visible boolean not null default true,
  created_at timestamptz not null default now(),
  unique(campaign_id, keyword, target_city)
);

create table public.keyword_page_maps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  cluster_id uuid not null references public.keyword_clusters(id) on delete cascade,
  target_url text not null,
  is_preferred boolean not null default true,
  notes text,
  client_visible boolean not null default true,
  created_at timestamptz not null default now(),
  unique(campaign_id, cluster_id, is_preferred)
);

create table public.rank_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  keyword_id uuid references public.keywords(id) on delete cascade,
  snapshot_date date not null,
  search_engine text not null default 'google',
  device text not null default 'mobile',
  location_label text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  zip_code text,
  result_type text not null default 'local_pack',
  rank_position integer,
  ranking_url text,
  competitor_name text,
  notes text,
  client_visible boolean not null default true,
  created_at timestamptz not null default now()
);
create index rank_snapshots_campaign_date_idx on public.rank_snapshots(campaign_id, snapshot_date desc);

create table public.gbp_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  location_id uuid references public.locations(id) on delete set null,
  google_location_id text,
  profile_url text,
  primary_category text,
  secondary_categories text[] not null default '{}',
  services text[] not null default '{}',
  description text,
  attributes jsonb not null default '{}'::jsonb,
  owner_access_status text not null default 'requested',
  suspension_risk text not null default 'low',
  client_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gbp_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  gbp_profile_id uuid references public.gbp_profiles(id) on delete cascade,
  metric_date date not null,
  calls integer not null default 0,
  website_clicks integer not null default 0,
  direction_requests integer not null default 0,
  views integer not null default 0,
  search_impressions integer not null default 0,
  source_fresh_at timestamptz,
  client_visible boolean not null default true,
  unique(gbp_profile_id, metric_date)
);

create table public.gbp_audit_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  audit_id uuid references public.audits(id) on delete cascade,
  label text not null,
  category text not null,
  status public.workflow_status not null default 'new',
  severity public.priority_level not null default 'medium',
  notes text,
  recommendation text,
  policy_warning text,
  requires_risk_acknowledgement boolean not null default false,
  risk_acknowledged boolean not null default false,
  client_visible boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.citations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  directory_name text not null,
  listing_url text,
  login_status text,
  ownership text,
  listing_status text not null default 'unknown',
  observed_nap jsonb not null default '{}'::jsonb,
  nap_match_score numeric(5,2),
  duplicate_risk text not null default 'low',
  priority public.priority_level not null default 'medium',
  date_checked date,
  next_action text,
  owner_user_id uuid references public.users(id),
  evidence_url text,
  client_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.citation_audit_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  citation_id uuid references public.citations(id) on delete cascade,
  field_name text not null,
  master_value text,
  observed_value text,
  matches boolean not null default false,
  status public.workflow_status not null default 'new',
  client_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  item_type text not null,
  title text not null,
  keyword_cluster_id uuid references public.keyword_clusters(id) on delete set null,
  intent text,
  target_url text,
  location text,
  service text,
  outline text,
  primary_cta text,
  internal_links_in text[] not null default '{}',
  internal_links_out text[] not null default '{}',
  status text not null default 'idea',
  author_user_id uuid references public.users(id),
  editor_user_id uuid references public.users(id),
  publish_date date,
  last_updated_date date,
  performance_metrics jsonb not null default '{}'::jsonb,
  approval_status text not null default 'draft',
  client_assets_required text[] not null default '{}',
  client_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.content_briefs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  business_facts jsonb not null default '{}'::jsonb,
  target_audience text,
  objections text[] not null default '{}',
  differentiators text[] not null default '{}',
  project_proof text[] not null default '{}',
  trust_signals text[] not null default '{}',
  faqs jsonb not null default '[]'::jsonb,
  internal_link_targets text[] not null default '{}',
  external_sources text[] not null default '{}',
  conversion_cta text,
  qa_flags text[] not null default '{}',
  ai_draft boolean not null default false,
  human_approved boolean not null default false,
  client_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.content_pages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  content_item_id uuid references public.content_items(id) on delete set null,
  url text not null,
  title text,
  meta_description text,
  word_count integer,
  conversion_cta_present boolean,
  internal_link_count integer,
  schema_types text[] not null default '{}',
  performance jsonb not null default '{}'::jsonb,
  client_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(campaign_id, url)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  source text not null,
  external_review_id text,
  review_date date not null,
  reviewer text,
  rating numeric(2,1),
  review_text text,
  response_status text not null default 'pending',
  sentiment text,
  service_mentioned text,
  location_mentioned text,
  escalation_status text not null default 'none',
  client_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.review_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  customer_reference text,
  channel text not null default 'sms',
  template_key text,
  scheduled_at timestamptz,
  sent_at timestamptz,
  status text not null default 'draft',
  resulting_review_id uuid references public.reviews(id) on delete set null,
  client_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.technical_issues (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  url text,
  category text not null,
  issue text not null,
  severity public.priority_level not null default 'medium',
  impact integer not null default 3,
  effort integer not null default 3,
  evidence text,
  recommended_fix text,
  owner_user_id uuid references public.users(id),
  status public.workflow_status not null default 'new',
  date_found date not null default current_date,
  date_resolved date,
  validation_method text,
  client_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.schema_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  url text not null,
  schema_type text not null,
  json_ld jsonb,
  validation_status text not null default 'not_tested',
  implementation_notes text,
  warning text not null default 'Schema must match visible page content; rich-result eligibility is not guaranteed.',
  client_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.backlinks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  source_url text not null,
  target_url text,
  anchor_text text,
  authority_metric numeric(6,2),
  first_seen date,
  last_seen date,
  status text not null default 'live',
  client_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.outreach_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  opportunity_type text not null,
  domain text,
  contact_name text,
  contact_email text,
  rationale text,
  status text not null default 'prospect',
  owner_user_id uuid references public.users(id),
  client_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  occurred_at timestamptz not null,
  source text not null,
  lead_type text not null,
  landing_page text,
  service text,
  city text,
  qualified_status text not null default 'unknown',
  booked_status text not null default 'unknown',
  closed_status text not null default 'unknown',
  estimated_job_value numeric(12,2),
  actual_revenue numeric(12,2),
  notes text,
  attribution_confidence numeric(5,2),
  client_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.conversion_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  event_date date not null,
  source text not null,
  url text,
  event_name text not null,
  count integer not null default 0,
  value numeric(12,2),
  ga4_event_name text,
  client_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.monthly_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  reporting_period daterange not null,
  executive_summary text,
  snapshot_data jsonb not null default '{}'::jsonb,
  strategist_notes text,
  lead_seo_approval text not null default 'pending',
  publish_status text not null default 'draft',
  published_at timestamptz,
  data_freshness jsonb not null default '{}'::jsonb,
  client_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.report_sections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  report_id uuid not null references public.monthly_reports(id) on delete cascade,
  section_type text not null,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  internal_only boolean not null default false,
  client_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.client_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  request_type text not null,
  title text not null,
  why_it_matters text,
  exact_requested_item text not null,
  due_date date,
  status text not null default 'open',
  client_contact_id uuid references public.client_contacts(id) on delete set null,
  related_task_id uuid references public.tasks(id) on delete set null,
  related_content_item_id uuid references public.content_items(id) on delete set null,
  client_comment text,
  client_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.files (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid references public.users(id),
  purpose text,
  client_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  provider text not null,
  connection_state text not null default 'not_requested',
  external_account_id text,
  last_sync_at timestamptz,
  data_fresh_at timestamptz,
  sync_history jsonb not null default '[]'::jsonb,
  last_error text,
  config jsonb not null default '{}'::jsonb,
  client_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, client_id, provider)
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  actor_user_id uuid references public.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_state jsonb,
  after_state jsonb,
  metadata jsonb not null default '{}'::jsonb,
  client_visible boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  notification_type text not null,
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  client_visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- Helpers are SECURITY DEFINER so policy checks do not recurse through user_roles RLS.
create or replace function public.is_agency_member(p_organization_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.organization_id = p_organization_id
      and ur.user_id = auth.uid()
      and ur.role in ('agency_admin','lead_seo','seo_strategist','content_outreach')
  );
$$;

create or replace function public.is_agency_admin(p_organization_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.organization_id = p_organization_id
      and ur.user_id = auth.uid()
      and ur.role = 'agency_admin'
  );
$$;

create or replace function public.can_view_client(p_client_id uuid, p_client_visible boolean default true)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1
    from public.clients c
    where c.id = p_client_id and (
      public.is_agency_member(c.organization_id)
      or (
        p_client_visible
        and exists (
          select 1 from public.user_roles ur
          where ur.user_id = auth.uid()
            and ur.organization_id = c.organization_id
            and ur.client_id = c.id
            and ur.role in ('client_viewer','client_editor')
        )
      )
    )
  );
$$;

create or replace function public.can_manage_client(p_client_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.clients c
    where c.id = p_client_id and public.is_agency_member(c.organization_id)
  );
$$;

create or replace function public.is_client_editor(p_client_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.client_id = p_client_id
      and ur.role = 'client_editor'
  );
$$;

alter table public.organizations enable row level security;
alter table public.users enable row level security;
alter table public.user_roles enable row level security;
alter table public.audit_templates enable row level security;

create policy organizations_agency_select on public.organizations for select using (public.is_agency_member(id));
create policy organizations_admin_write on public.organizations for all using (public.is_agency_admin(id)) with check (public.is_agency_admin(id));
create policy users_self_select on public.users for select using (id = auth.uid());
create policy users_self_update on public.users for update using (id = auth.uid()) with check (id = auth.uid());
create policy user_roles_self_select on public.user_roles for select using (user_id = auth.uid() or public.is_agency_admin(organization_id));
create policy user_roles_admin_write on public.user_roles for all using (public.is_agency_admin(organization_id)) with check (public.is_agency_admin(organization_id));
create policy audit_templates_agency_select on public.audit_templates for select using (public.is_agency_member(organization_id));
create policy audit_templates_agency_write on public.audit_templates for all using (public.is_agency_member(organization_id)) with check (public.is_agency_member(organization_id));

-- All client-owned tables share the same tenant-safe select/write model.
do $$
declare
  t text;
  client_tables text[] := array[
    'clients','client_contacts','campaigns','campaign_users','business_profiles','locations','service_areas','services',
    'competitors','competitor_snapshots','audits','audit_sections','audit_findings','recommendations','strategy_roadmaps',
    'roadmap_initiatives','tasks','task_comments','task_attachments','keyword_clusters','keywords','keyword_page_maps',
    'rank_snapshots','gbp_profiles','gbp_metrics','gbp_audit_items','citations','citation_audit_items','content_items',
    'content_briefs','content_pages','reviews','review_requests','technical_issues','schema_items','backlinks',
    'outreach_opportunities','leads','conversion_events','monthly_reports','report_sections','client_requests','files'
  ];
begin
  foreach t in array client_tables loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy %I on public.%I for select using (public.can_view_client(client_id, client_visible))', t || '_tenant_select', t);
    execute format('create policy %I on public.%I for insert with check (public.can_manage_client(client_id))', t || '_agency_insert', t);
    execute format('create policy %I on public.%I for update using (public.can_manage_client(client_id)) with check (public.can_manage_client(client_id))', t || '_agency_update', t);
    execute format('create policy %I on public.%I for delete using (public.can_manage_client(client_id))', t || '_agency_delete', t);
  end loop;
end $$;

-- Integrations/activity/notifications may be organization-level or client-level.
alter table public.integrations enable row level security;
alter table public.activity_logs enable row level security;
alter table public.notifications enable row level security;
create policy integrations_select on public.integrations for select using (
  (client_id is not null and public.can_view_client(client_id, client_visible))
  or (client_id is null and public.is_agency_member(organization_id))
);
create policy integrations_write on public.integrations for all using (public.is_agency_member(organization_id)) with check (public.is_agency_member(organization_id));
create policy activity_logs_select on public.activity_logs for select using (
  public.is_agency_member(organization_id)
  or (client_id is not null and public.can_view_client(client_id, client_visible))
);
create policy activity_logs_insert on public.activity_logs for insert with check (public.is_agency_member(organization_id));
create policy notifications_select on public.notifications for select using (user_id = auth.uid());
create policy notifications_update on public.notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Client Editor can change only business/contact/request/file surfaces; not strategy, audits, or performance data.
create policy client_contacts_editor_update on public.client_contacts for update using (public.is_client_editor(client_id)) with check (public.is_client_editor(client_id));
create policy business_profiles_editor_update on public.business_profiles for update using (public.is_client_editor(client_id)) with check (public.is_client_editor(client_id));
create policy locations_editor_update on public.locations for update using (public.is_client_editor(client_id)) with check (public.is_client_editor(client_id));
create policy service_areas_editor_update on public.service_areas for update using (public.is_client_editor(client_id)) with check (public.is_client_editor(client_id));
create policy client_requests_editor_update on public.client_requests for update using (public.is_client_editor(client_id)) with check (public.is_client_editor(client_id));
create policy client_files_editor_insert on public.files for insert with check (public.is_client_editor(client_id));

-- Storage bucket for client assets. Path convention: <organization_id>/<client_id>/<uuid>-<filename>
insert into storage.buckets (id, name, public)
values ('client-assets','client-assets',false)
on conflict (id) do nothing;

create policy client_assets_read on storage.objects for select using (
  bucket_id = 'client-assets'
  and public.can_view_client(((storage.foldername(name))[2])::uuid, true)
);
create policy client_assets_upload on storage.objects for insert with check (
  bucket_id = 'client-assets'
  and (
    public.can_manage_client(((storage.foldername(name))[2])::uuid)
    or public.is_client_editor(((storage.foldername(name))[2])::uuid)
  )
);

-- Basic audit trail helper. Application writes before/after state explicitly for sensitive actions.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'organizations','users','clients','client_contacts','campaigns','business_profiles','competitors','audit_templates','audits',
    'audit_findings','recommendations','strategy_roadmaps','roadmap_initiatives','tasks','keyword_clusters','content_items',
    'content_briefs','content_pages','citations','technical_issues','schema_items','outreach_opportunities','monthly_reports',
    'client_requests','integrations'
  ] loop
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', t || '_updated_at', t);
  end loop;
end $$;

comment on table public.rank_snapshots is 'Stores organic/local-pack snapshots from mock data, CSV, or provider adapters such as Local Falcon/BrightLocal/Whitespark.';
comment on table public.monthly_reports is 'Published reports persist snapshot_data so numbers do not shift after client publication.';
comment on table public.roadmap_initiatives is 'AI-generated initiatives must remain human_approved=false until a strategist verifies them.';
comment on table public.leads is 'actual_revenue must remain null unless explicitly supplied by the source system.';
