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

export const ALL_ROUTES = [
  "/",
  ...PIPELINE_ROUTES,
  ...MANAGER_ROUTES,
  ...DASHBOARD_ROUTES,
  ...CLIENT_ROUTES,
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
] as const;
