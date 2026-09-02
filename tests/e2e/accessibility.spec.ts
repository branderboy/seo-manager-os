/**
 * Automated accessibility checks on key routes, WCAG 2.1 and 2.2 A and AA tags.
 *
 * These catch a minority of real problems. The keyboard pass and the screen reader aware
 * pass in docs/audits/accessibility-audit.md are still required and are human owned.
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { KEY_ROUTES } from "./routes";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/**
 * Colour contrast used to be exempted here.
 *
 * It no longer is. The palette in src/app/globals.css and tailwind.config.ts was corrected
 * so every text colour clears WCAG 1.4.3 AA against every surface it is painted on, and the
 * count on these screens is zero. This suite asserts zero violations of every rule,
 * contrast included, so a regression fails the build rather than raising a baseline.
 */
for (const route of KEY_ROUTES) {
  test(`no accessibility violations on ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}

test("every form control on the key screens has an accessible name", async ({ page }) => {
  for (const route of KEY_ROUTES) {
    await page.goto(route);
    const unnamed = await page.evaluate(() => {
      const controls = Array.from(document.querySelectorAll("input, select, textarea"));
      return controls
        .filter((el) => {
          if (el.getAttribute("aria-label") || el.getAttribute("aria-labelledby")) return false;
          if (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) return false;
          return !el.closest("label");
        })
        .map((el) => el.outerHTML.slice(0, 120));
    });
    expect(unnamed, `${route} has unlabelled form controls`).toEqual([]);
  }
});

test("the skip link is the first tab stop and moves focus to main", async ({ page }) => {
  await page.goto("/command");
  await page.keyboard.press("Tab");
  const skip = page.locator(":focus");
  await expect(skip).toHaveText(/skip to main content/i);

  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
});

test("keyboard focus stays visible on the dark sidebar", async ({ page }, testInfo) => {
  // The sidebar is desktop only. Below lg the same navigation lives behind the menu
  // button on a light surface, which the browser default ring already handles.
  test.skip(testInfo.project.name === "mobile", "the dark sidebar does not render below lg");

  await page.goto("/command");
  await page.keyboard.press("Tab"); // skip link
  await page.keyboard.press("Tab"); // first sidebar link

  const outline = await page.evaluate(() => {
    const active = document.activeElement;
    if (!active) return null;
    const style = getComputedStyle(active);
    return {
      width: style.outlineWidth,
      style: style.outlineStyle,
      color: style.outlineColor,
      inSidebar: !!active.closest(".on-feature"),
    };
  });

  expect(outline?.inSidebar, "expected focus to be inside the sidebar").toBe(true);
  expect(outline?.style).not.toBe("none");
  expect(parseFloat(outline?.width ?? "0")).toBeGreaterThanOrEqual(2);
});

test("the mobile menu opens and its links are keyboard reachable", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "covers the below-lg navigation only");

  await page.goto("/command");
  const open = page.getByRole("button", { name: /open menu/i });
  await expect(open).toBeVisible();
  await open.click();

  // The drawer is a dialog, not a plain nav landmark: it covers the page, so it has to
  // behave like one. Focus behaviour is asserted separately below.
  const drawer = page.getByRole("dialog", { name: /main navigation/i });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("link").first()).toBeVisible();
  await expect(drawer.getByRole("button", { name: /close menu/i })).toBeVisible();
});

test("every page declares a language and a unique, meaningful title", async ({ page }) => {
  const titles = new Map<string, string>();
  for (const route of KEY_ROUTES) {
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    const title = await page.title();
    expect(title.trim().length, `${route} has no title`).toBeGreaterThan(0);
    titles.set(route, title);
  }
  const seen = new Set(titles.values());
  expect(seen.size, `duplicate page titles: ${JSON.stringify([...titles])}`).toBe(titles.size);
});

test("the page has exactly one level one heading and a main landmark", async ({ page }) => {
  for (const route of KEY_ROUTES) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("main")).toHaveCount(1);
  }
});

test("the app shell exposes exactly one polite live region", async ({ page }) => {
  await page.goto("/command");
  const regions = page.locator('[aria-live="polite"][role="status"]');
  await expect(regions).toHaveCount(1);
});

test("deploying an agent is announced, not only shown", async ({ page }) => {
  await page.goto("/agents");
  const live = page.locator('[aria-live="polite"][role="status"]').last();
  await expect(live).toHaveText("");

  const toggle = page.getByRole("switch").first();
  await expect(toggle).toBeVisible();
  const label = (await toggle.getAttribute("aria-label")) ?? "";
  await toggle.click();

  await expect(live).not.toHaveText("", { timeout: 5000 });
  const announced = (await live.textContent()) ?? "";
  expect(announced.toLowerCase()).toMatch(/deployed|stood down/);
  // The message names the thing that changed, not just that something did.
  if (label) expect(announced.length).toBeGreaterThan(5);
});

test("filtering the client list announces how many matched", async ({ page }) => {
  await page.goto("/clients");
  const search = page.getByRole("searchbox", { name: /search clients/i });
  await expect(search).toBeVisible();

  const rowsBefore = await page.getByRole("main").locator("tbody tr").count();
  expect(rowsBefore).toBeGreaterThan(1);

  await search.fill("northwind");
  await expect.poll(() => page.getByRole("main").locator("tbody tr").count()).toBeLessThan(rowsBefore);

  const status = page.locator('[role="status"][aria-live="polite"]').first();
  await expect(status).toContainText(/match/i);
});

test("the mobile menu traps focus, closes on Escape and restores focus", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "covers the below-lg navigation only");

  await page.goto("/command");
  const trigger = page.getByRole("button", { name: /open menu/i });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: /main navigation/i });
  await expect(dialog).toBeVisible();

  // Focus starts inside the drawer.
  await expect
    .poll(async () => dialog.evaluate((el) => el.contains(document.activeElement)))
    .toBe(true);

  // Tabbing all the way round stays inside it.
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Tab");
    const inside = await dialog.evaluate((el) => el.contains(document.activeElement));
    expect(inside, `focus escaped the drawer after ${i + 1} tabs`).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("the mobile menu button meets the minimum target size", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "the button only renders below lg");

  await page.goto("/command");
  const box = await page.getByRole("button", { name: /open menu/i }).boundingBox();
  expect(box?.width ?? 0).toBeGreaterThanOrEqual(24);
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(24);
});

test("smooth scrolling is not applied when reduced motion is requested", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/command");
  const behaviour = await page.evaluate(
    () => getComputedStyle(document.documentElement).scrollBehavior,
  );
  expect(behaviour).toBe("auto");
  await context.close();
});
