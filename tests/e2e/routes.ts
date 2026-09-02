/**
 * The routes the application serves, and the ones the e2e suites walk.
 *
 * This application has no authentication and no tenancy (see ARCHITECTURE_DECISIONS.md),
 * so there is a single public surface. When a backend lands, split this into public and
 * authenticated lists and give the authenticated one a sign-in helper.
 */
export const PIPELINE_ROUTES = [
  "/discovery",
  "/research",
  "/intent",
  "/competitors",
  "/diagnosis",
  "/tools",
  "/strategy",
  "/tasks",
  "/reports",
] as const;

export const MANAGER_ROUTES = [
  "/command",
  "/clients",
  "/workflow",
  "/tracker",
  "/agents",
  "/risk",
  "/wins",
  "/deployments",
  "/integrations",
  "/settings",
] as const;

export const DASHBOARD_ROUTES = [
  "/dashboards/local",
  "/dashboards/saas",
  "/dashboards/enterprise",
] as const;

export const CLIENT_ROUTES = ["/clients/northwind"] as const;

/**
 * Local Growth OS — the multi-tenant local campaign layer. Its Supabase schema and RLS
 * policies exist as SQL; nothing in src/ connects to them yet, so these screens run on the
 * demo data in src/lib/local-growth/demo-data.ts exactly like the rest of the application.
 */
export const GROWTH_ROUTES = [
  "/growth",
  "/growth/login",
  "/growth/campaigns",
  "/growth/campaigns/new",
  "/growth/campaigns/capital-comfort",
  "/growth/tasks",
  "/growth/audits",
  "/growth/audits/gbp",
  "/growth/roadmap",
  "/growth/gbp",
  "/growth/rankings",
  "/growth/keywords",
  "/growth/citations",
  "/growth/content",
  "/growth/content/content-capital-ac",
  "/growth/reviews",
  "/growth/competitors",
  "/growth/technical",
  "/growth/outreach",
  "/growth/leads",
  "/growth/reports",
  "/growth/reports/client/report-capital-aug-2026",
  "/growth/requests",
  "/growth/templates",
  "/growth/integrations",
  "/growth/settings",
] as const;

export const ALL_ROUTES = [
  "/",
  ...PIPELINE_ROUTES,
  ...MANAGER_ROUTES,
  ...DASHBOARD_ROUTES,
  ...CLIENT_ROUTES,
  ...GROWTH_ROUTES,
] as const;

/** The screens a manager cannot do their job without. Audited on every run. */
export const KEY_ROUTES = [
  "/",
  "/command",
  "/clients",
  "/discovery",
  "/diagnosis",
  "/strategy",
  "/tasks",
  "/reports",
  "/tracker",
  "/settings",
  "/dashboards/local",
  "/growth",
  "/growth/campaigns/capital-comfort",
  "/growth/tasks",
  "/growth/roadmap",
  "/growth/reports/client/report-capital-aug-2026",
] as const;
