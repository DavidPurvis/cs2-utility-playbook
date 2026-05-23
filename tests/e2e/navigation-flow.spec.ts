/**
 * E2E: Full navigation flow — the primary user journey.
 *
 * Tests the complete Home → Scenario → Role → Lineup → Back chain,
 * keyboard Esc shortcuts, and browser back-button integration. These
 * are the single most important paths in the app and had zero E2E
 * coverage before this file.
 */
import { test, expect } from "@playwright/test";

test.describe("Full navigation flow", () => {
  test("Home → Scenario → Role → Lineup → Back → Back → Home", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Home: Scenario grid visible.
    await expect(page.locator('[data-testid="scenario-grid"]')).toBeVisible();

    // Click Scenario 1 (A Default Take).
    const scenarioCard = page.getByRole("button", { name: /A Default Take/i });
    await expect(scenarioCard).toBeVisible();
    await scenarioCard.click();

    // ScenarioDetail: verify heading and role tabs appear.
    await expect(page.getByRole("heading", { name: /A Default Take/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Player A/i })).toBeVisible();

    // Click a role tab.
    await page.getByRole("tab", { name: /Player A/i }).click();

    // Action list appears with at least one step button.
    const stepButton = page.getByRole("button", { name: /Step 1/i });
    await expect(stepButton).toBeVisible();

    // Click the step to navigate to LineupDetail.
    await stepButton.click();

    // LineupDetail: 4-card walkthrough renders.
    await expect(page.locator(".walkthrough-grid")).toBeVisible();
    // Breadcrumb shows the lineup name.
    const breadcrumb = page.locator("nav[aria-label='breadcrumb']");
    await expect(breadcrumb).toBeVisible();

    // Back → ScenarioDetail.
    await page.getByRole("button", { name: /Back/i }).click();
    await expect(page.getByRole("tab", { name: /Player A/i })).toBeVisible();
    // Walkthrough grid should be gone.
    await expect(page.locator(".walkthrough-grid")).toHaveCount(0);

    // Back → Home.
    await page.getByRole("button", { name: /Back/i }).click();
    await expect(page.locator('[data-testid="scenario-grid"]')).toBeVisible();
  });

  test("Esc from lineup returns to scenario", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Navigate to a lineup.
    await page.getByRole("button", { name: /A Default Take/i }).click();
    await page.getByRole("tab", { name: /Player A/i }).click();
    await page.getByRole("button", { name: /Step 1/i }).click();
    await expect(page.locator(".walkthrough-grid")).toBeVisible();

    // Press Escape.
    await page.keyboard.press("Escape");

    // Should be back on scenario view.
    await expect(page.getByRole("tab", { name: /Player A/i })).toBeVisible();
    await expect(page.locator(".walkthrough-grid")).toHaveCount(0);
  });

  test("Esc from scenario returns to home", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /A Default Take/i }).click();
    await expect(page.getByRole("heading", { name: /A Default Take/i })).toBeVisible();

    // Press Escape.
    await page.keyboard.press("Escape");

    // Should be back on home.
    await expect(page.locator('[data-testid="scenario-grid"]')).toBeVisible();
  });

  test("Esc on home is a no-op (no crash)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator('[data-testid="scenario-grid"]')).toBeVisible();

    // Press Escape — nothing should change or crash.
    await page.keyboard.press("Escape");

    // Still on home.
    await expect(page.locator('[data-testid="scenario-grid"]')).toBeVisible();
  });

  test("browser back button navigates through the view stack", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Home → Scenario.
    await page.getByRole("button", { name: /A Default Take/i }).click();
    await expect(page.getByRole("heading", { name: /A Default Take/i })).toBeVisible();

    // Scenario → Lineup.
    await page.getByRole("tab", { name: /Player A/i }).click();
    await page.getByRole("button", { name: /Step 1/i }).click();
    await expect(page.locator(".walkthrough-grid")).toBeVisible();

    // Browser back → Scenario.
    await page.goBack();
    await expect(page.getByRole("tab", { name: /Player A/i })).toBeVisible();
    await expect(page.locator(".walkthrough-grid")).toHaveCount(0);

    // Browser back → Home.
    await page.goBack();
    await expect(page.locator('[data-testid="scenario-grid"]')).toBeVisible();
  });
});
