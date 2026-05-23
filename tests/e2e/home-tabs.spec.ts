/**
 * Home four-tab navigation contract.
 *
 * Owner directive: the home page has four tabs — Defaults / Scenarios
 * / Instant utility / Map — and the tab order is FIXED for the
 * structure-craving audience (one autistic 25-year-old). Clicking
 * each tab MUST swap the content; the active tab MUST be visibly
 * distinct.
 */
import { test, expect } from "@playwright/test";

test.describe("Home four-tab navigation", () => {
  test("all four tab buttons are present in order", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Scope to the home tablist — the spawn picker also uses role=tab
    // for its T/CT side toggle.
    const homeTabList = page.getByRole("tablist", { name: /Home sections/i });
    const tabs = homeTabList.getByRole("tab");
    await expect(tabs).toHaveCount(4);
    await expect(tabs.nth(0)).toContainText(/Defaults/i);
    await expect(tabs.nth(1)).toContainText(/Scenarios/i);
    await expect(tabs.nth(2)).toContainText(/Instant utility/i);
    await expect(tabs.nth(3)).toContainText(/Map/i);
  });

  test("Scenarios is the default tab", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const scenarios = page.getByRole("tab", { name: /Scenarios/i });
    await expect(scenarios).toHaveAttribute("aria-selected", "true");
    // Scenario grid is visible
    await expect(page.locator('[data-testid="scenario-grid"]')).toBeVisible();
  });

  test("clicking Defaults tab swaps to plant spots + timings + spawn rushes content", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const homeTabList = page.getByRole("tablist", { name: /Home sections/i });
    await homeTabList.getByRole("tab", { name: /Defaults/i }).click();
    // Use heading role to disambiguate from the tab's hint text "plant
    // spots · timings · spawn rushes" which also contains these words.
    await expect(page.getByRole("heading", { name: /Default plant spots/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Round timings/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Spawn rushes/i })).toBeVisible();
    await expect(page.locator('[data-testid="scenario-grid"]')).toHaveCount(0);
  });

  test("clicking Instant utility tab swaps to instant-from-spawn lineup list", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("tab", { name: /Instant utility/i }).click();
    await expect(page.locator("text=Instant utility from spawn")).toBeVisible();
    await expect(page.locator("text=Xbox Smoke from T Spawn")).toBeVisible();
  });

  test("clicking Map tab swaps to origin-first radar view", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("tab", { name: /Map/i }).click();
    await expect(page.locator("text=Map — throw-from positions")).toBeVisible();
    await expect(
      page.locator("text=origin first, not destination first")
    ).toBeVisible();
  });

  test("active tab has visible accent (aria-selected=true)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("tab", { name: /Defaults/i }).click();
    const defaults = page.getByRole("tab", { name: /Defaults/i });
    const scenarios = page.getByRole("tab", { name: /Scenarios/i });
    await expect(defaults).toHaveAttribute("aria-selected", "true");
    await expect(scenarios).toHaveAttribute("aria-selected", "false");
  });
});
