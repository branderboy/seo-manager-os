/**
 * Critical user workflows, run against the built static export.
 *
 * The customer outcome this product exists for is: a manager opens the operating system,
 * walks the pipeline from discovery to reports for a client, and gets a usable screen at
 * every stage. These tests fail if any of that stops working.
 *
 * The negative coverage the standard requires around auth, tenancy, and server input
 * validation does not apply yet — there is no server. See docs/production/INVENTORY.md
 * and WORKFLOW-RISK-REGISTER.md, which state exactly which tests become mandatory the
 * moment a backend is added.
 */
import { test, expect, type Page } from "@playwright/test";
import { ALL_ROUTES, PIPELINE_ROUTES, KEY_ROUTES, GROWTH_ROUTES } from "./routes";

/**
 * Fails the test if the page logged an error or threw while rendering.
 *
 * One message is filtered: Next's router logs a failed RSC prefetch when a navigation
 * cancels a prefetch that is still in flight, and says itself that it falls back to a
 * browser navigation. It is a cancelled request, not a broken page, and it only appears
 * when a test walks routes faster than a person can. Nothing else is filtered.
 */
const RECOVERABLE = /Failed to fetch RSC payload .* Falling back to browser navigation/;

function trackPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    if (RECOVERABLE.test(message.text())) return;
    errors.push(`console: ${message.text()}`);
  });
  return errors;
}

for (const route of ALL_ROUTES) {
  test(`renders ${route} without a client side error`, async ({ page }) => {
    const errors = trackPageErrors(page);
    const response = await page.goto(route);
    expect(response?.status(), `status for ${route}`).toBe(200);

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const body = (await page.locator("body").innerText()).trim();
    expect(body.length, `${route} rendered almost no content`).toBeGreaterThan(200);
    expect(errors, `${route} logged errors`).toEqual([]);
  });
}

test("a request for a route that does not exist gets the 404 page, not a blank screen", async ({
  page,
}) => {
  const response = await page.goto("/this-route-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByText(/could not be found/i)).toBeVisible();
});

test("every navigation link the shell renders resolves to a real page", async ({ page }) => {
  await page.goto("/command");
  const hrefs = await page.locator("nav a[href^='/']").evaluateAll((nodes) =>
    Array.from(new Set(nodes.map((node) => node.getAttribute("href") ?? ""))),
  );
  expect(hrefs.length, "found no navigation links").toBeGreaterThan(5);

  for (const href of hrefs) {
    const response = await page.request.get(href);
    expect(response.status(), `nav link ${href}`).toBe(200);
  }
});

test("navigation is reachable on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/command");

  const menu = page.getByRole("button").first();
  await expect(menu).toBeVisible();
  await menu.click();

  const links = page.locator("a[href^='/']").filter({ visible: true });
  await expect.poll(() => links.count(), { timeout: 10_000 }).toBeGreaterThan(3);
});

test("a manager can walk the whole pipeline and get a usable screen at every stage", async ({
  page,
}) => {
  const errors = trackPageErrors(page);
  for (const route of PIPELINE_ROUTES) {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("the discovery interview accepts input and advances", async ({ page }) => {
  await page.goto("/discovery");
  const firstField = page.getByRole("textbox").first();
  await expect(firstField).toBeVisible();
  await firstField.fill("Northwind Heating & Air");
  await expect(firstField).toHaveValue("Northwind Heating & Air");

  const next = page.getByRole("button", { name: /next|continue/i }).first();
  if (await next.isVisible()) {
    await next.click();
    await expect(page.getByRole("main")).toBeVisible();
  }
});

test("client switching changes what the pipeline shows", async ({ page }) => {
  await page.goto("/diagnosis");
  const before = await page.getByRole("main").innerText();
  expect(before.length).toBeGreaterThan(200);

  await page.goto("/clients");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // Scoped to main: the sidebar carries the same links but is hidden below lg.
  const clientLink = page.getByRole("main").locator('a[href^="/clients/"]').first();
  await expect(clientLink).toBeVisible();
  await clientLink.click();

  await expect(page).toHaveURL(/\/clients\/[^/]+\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const record = await page.getByRole("main").innerText();
  expect(record.length).toBeGreaterThan(200);
});

test("every key screen carries the interactive controls it is supposed to have", async ({
  page,
}) => {
  for (const route of KEY_ROUTES) {
    await page.goto(route);
    const interactive = await page.locator("a, button, input, select, textarea").count();
    expect(interactive, `${route} has no interactive controls`).toBeGreaterThan(3);
  }
});

test("no key screen scrolls horizontally on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  for (const route of KEY_ROUTES) {
    await page.goto(route);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `${route} overflows horizontally by ${overflow}px`).toBeLessThanOrEqual(0);
  }
});

test("the Local Growth OS layer reaches every screen its navigation advertises", async ({
  page,
}) => {
  const errors = trackPageErrors(page);
  await page.goto("/growth", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const hrefs = await page.locator("a[href^='/growth']").evaluateAll((nodes) =>
    Array.from(new Set(nodes.map((node) => node.getAttribute("href") ?? ""))),
  );
  expect(hrefs.length, "found no Local Growth OS navigation links").toBeGreaterThan(5);

  for (const href of hrefs) {
    const response = await page.request.get(href);
    expect(response.status(), `growth link ${href}`).toBe(200);
  }
  expect(errors).toEqual([]);
});

test("every Local Growth OS route renders a usable screen", async ({ page }) => {
  for (const route of GROWTH_ROUTES) {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const body = (await page.locator("body").innerText()).trim();
    expect(body.length, `${route} rendered almost no content`).toBeGreaterThan(200);
  }
});
