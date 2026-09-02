import { defineConfig, devices } from "@playwright/test";

// The suites run against the standard Next.js build, which is what a normal deployment
// serves. Build first: `npm run build && npm run test:e2e`.
//
// The GitHub Pages artifact is a different build (GITHUB_PAGES=true, output: "export",
// basePath /seo-manager-os). To exercise that one, build it, serve it with
// `npm run start:export -- --base-path /seo-manager-os`, and point TEST_BASE_URL at it.
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
    command: `npx next start --port ${new URL(baseURL).port || "3000"}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
