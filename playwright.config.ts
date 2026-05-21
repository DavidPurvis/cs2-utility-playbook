/**
 * Playwright config for E2E + visual regression tests.
 *
 * Tests live under `tests/e2e/`. They run against a Vite dev server
 * that Playwright spins up automatically via `webServer`.
 *
 * Visual snapshots are stored next to each test under
 * `__screenshots__/`. To accept new baselines after intentional UI
 * changes:
 *     npm run test:e2e -- --update-snapshots
 *
 * The snapshot threshold (maxDiffPixelRatio: 0.01) tolerates ~1% pixel
 * drift to survive font-rendering differences across machines while
 * still catching layout-breaking regressions.
 */
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },
  use: {
    baseURL: "http://localhost:5173/cs2-utility-playbook/",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1400, height: 900 } },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173/cs2-utility-playbook/",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
