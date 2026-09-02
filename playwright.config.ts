import { defineConfig, devices } from "@playwright/test";

// next.config.mjs sets `output: "export"`, so the suites run against the built static
// export in out/, served by scripts/serve-export.mjs the way GitHub Pages serves it.
// Build first: `npm run build && npm run test:e2e`.
const baseURL = process.env.TEST_BASE_URL ?? "http://localhost:3000";

// Sandboxes and offline machines cannot run `npx playwright install`. Point
// PLAYWRIGHT_CHROMIUM_EXECUTABLE at an existing Chromium to use it instead. Unset in CI,
// where the browsers job downloads the matching build.
const launchOptions = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
  ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
  : {};

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : [["list"]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], launchOptions } },
    // Mobile is part of the accessibility and UX bar, not an optional extra.
    { name: "mobile", use: { ...devices["Pixel 7"], launchOptions } },
  ],
  webServer: {
    command: `node scripts/serve-export.mjs --port ${new URL(baseURL).port || "3000"}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
