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
 * Colour contrast is handled separately from the rest.
 *
 * The palette in src/app/globals.css is approved product design and is not something a
 * verification pass gets to rewrite. It currently fails WCAG 1.4.3 in the places recorded
 * in docs/audits/accessibility-audit.md, which is an open, owner-owned finding and a
 * launch blocker in PRODUCTION_READINESS.md.
 *
 * Until the owner decides on the palette, this suite does two things. Every other rule
 * must be clean, with no exceptions. And the contrast failures are ratcheted against the
 * counts measured on the commit that introduced this suite, so the number can go down but
 * never up. Lower a number here when a fix lands. Never raise one to get a green run.
 */
const CONTRAST_BASELINE: Record<string, number> = {
  "/": 6,
  "/command": 13,
  "/clients": 16,
  "/discovery": 10,
  "/diagnosis": 13,
  "/strategy": 11,
  "/tasks": 13,
  "/reports": 22,
  "/tracker": 13,
  "/settings": 4,
  "/dashboards/local": 7,
  "/growth": 17,
  "/growth/campaigns/capital-comfort": 17,
  "/growth/tasks": 7,
  "/growth/roadmap": 11,
  "/growth/reports/client/report-capital-aug-2026": 4,
};

for (const route of KEY_ROUTES) {
  test(`no violations other than colour contrast on ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    const violations = results.violations.filter((v) => v.id !== "color-contrast");
    expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
  });

  test(`colour contrast on ${route} has not regressed`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    const nodes = results.violations
      .filter((v) => v.id === "color-contrast")
      .reduce((total, v) => total + v.nodes.length, 0);

    expect(
      nodes,
      `${route}: ${nodes} contrast failures, baseline ${CONTRAST_BASELINE[route]}. ` +
        "See docs/audits/accessibility-audit.md. Fix the contrast, do not raise the baseline.",
    ).toBeLessThanOrEqual(CONTRAST_BASELINE[route]);
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

  const nav = page.getByRole("navigation").filter({ visible: true }).first();
  await expect(nav).toBeVisible();
  await expect(nav.getByRole("link").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /close menu/i })).toBeVisible();
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
