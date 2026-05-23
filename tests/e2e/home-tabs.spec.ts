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

  // ── WAI-ARIA Tabs pattern (audit H-5, fix PR-2) ────────────────────

  test("tab buttons link to a single tabpanel via aria-controls / id", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const homeTabList = page.getByRole("tablist", { name: /Home sections/i });
    const scenariosTab = homeTabList.getByRole("tab", { name: /Scenarios/i });
    const controlsId = await scenariosTab.getAttribute("aria-controls");
    expect(controlsId).toBe("home-tabpanel-scenarios");
    // The panel exists in the DOM and is labelled by the tab.
    const panel = page.locator(`#${controlsId}`);
    await expect(panel).toHaveAttribute("role", "tabpanel");
    await expect(panel).toHaveAttribute("aria-labelledby", "home-tab-scenarios");
  });

  test("only the active tab is tab-key reachable (tabIndex management)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const homeTabList = page.getByRole("tablist", { name: /Home sections/i });
    // Default tab is Scenarios → tabIndex=0; others tabIndex=-1
    await expect(homeTabList.getByRole("tab", { name: /Scenarios/i })).toHaveAttribute(
      "tabindex",
      "0"
    );
    await expect(homeTabList.getByRole("tab", { name: /Defaults/i })).toHaveAttribute(
      "tabindex",
      "-1"
    );
    await expect(homeTabList.getByRole("tab", { name: /Map/i })).toHaveAttribute(
      "tabindex",
      "-1"
    );
  });

  test("ArrowRight cycles tabs and moves focus to the new active tab", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const homeTabList = page.getByRole("tablist", { name: /Home sections/i });
    const scenarios = homeTabList.getByRole("tab", { name: /Scenarios/i });
    // Focus the active tab (Scenarios is default), then ArrowRight.
    await scenarios.focus();
    await page.keyboard.press("ArrowRight");
    // Now Instant utility is active and focused.
    await expect(
      homeTabList.getByRole("tab", { name: /Instant utility/i })
    ).toHaveAttribute("aria-selected", "true");
    await expect(
      homeTabList.getByRole("tab", { name: /Instant utility/i })
    ).toBeFocused();
  });

  test("ArrowLeft cycles backward + wraps from first to last", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const homeTabList = page.getByRole("tablist", { name: /Home sections/i });
    // Switch to Defaults (first tab) by click
    await homeTabList.getByRole("tab", { name: /Defaults/i }).click();
    await homeTabList.getByRole("tab", { name: /Defaults/i }).focus();
    // ArrowLeft from first tab wraps to last (Map)
    await page.keyboard.press("ArrowLeft");
    await expect(
      homeTabList.getByRole("tab", { name: /Map/i })
    ).toHaveAttribute("aria-selected", "true");
  });

  test("Home key jumps to first tab; End jumps to last", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const homeTabList = page.getByRole("tablist", { name: /Home sections/i });
    const scenarios = homeTabList.getByRole("tab", { name: /Scenarios/i });
    await scenarios.focus();
    await page.keyboard.press("End");
    await expect(homeTabList.getByRole("tab", { name: /Map/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await page.keyboard.press("Home");
    await expect(
      homeTabList.getByRole("tab", { name: /Defaults/i })
    ).toHaveAttribute("aria-selected", "true");
  });

  // ── Browser back restores tab (audit H-1, fix PR-2) ────────────────

  test("browser back from one tab returns to the previous tab", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const homeTabList = page.getByRole("tablist", { name: /Home sections/i });
    // Start: Scenarios (default). Click Map.
    await homeTabList.getByRole("tab", { name: /Map/i }).click();
    await expect(
      homeTabList.getByRole("tab", { name: /Map/i })
    ).toHaveAttribute("aria-selected", "true");
    // Browser back: should restore Scenarios.
    await page.goBack();
    await expect(
      homeTabList.getByRole("tab", { name: /Scenarios/i })
    ).toHaveAttribute("aria-selected", "true");
  });
});
