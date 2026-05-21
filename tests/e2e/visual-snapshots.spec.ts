/**
 * Visual regression snapshots for the three primary views.
 *
 * On the first run for each test, Playwright generates a baseline
 * PNG. Subsequent runs diff against the baseline; pixel drift above
 * `maxDiffPixelRatio` (set globally to 0.01 in playwright.config.ts)
 * fails the test.
 *
 * To accept new baselines after an INTENTIONAL UI change:
 *     npm run test:e2e -- --update-snapshots
 *
 * Baselines are committed under
 * `tests/e2e/__screenshots__/<test-name>-snapshots/`.
 */
import { test, expect } from "@playwright/test";

test.describe("Visual snapshots", () => {
  test("home view (T-side default)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Wait one beat for radar image to settle.
    await page.waitForTimeout(800);
    await expect(page).toHaveScreenshot("home-t-side.png", { fullPage: false });
  });

  test("home view (CT-side, with position guide)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("tab", { name: /CT-side/i }).click();
    await page.waitForTimeout(800);
    await expect(page).toHaveScreenshot("home-ct-side.png", { fullPage: true });
  });

  test("scenario detail (no role selected)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /A Default Take/i }).click();
    await page.waitForTimeout(800);
    await expect(page).toHaveScreenshot("scenario-detail.png", { fullPage: false });
  });
});
