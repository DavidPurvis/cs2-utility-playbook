/**
 * E2E: Tab content verification.
 *
 * The home-tabs spec validates tab switching; this spec validates the
 * content INSIDE each tab renders correctly. Covers Defaults (three
 * sections with table rows), Instant utility (header + lineup cards),
 * and Map (marker count + side panel on click).
 */
import { test, expect } from "@playwright/test";

test.describe("Tab content", () => {
  test("Defaults tab renders all three sections with content", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const homeTabList = page.getByRole("tablist", { name: /Home sections/i });
    await homeTabList.getByRole("tab", { name: /Defaults/i }).click();

    // All three section headings present.
    await expect(page.getByRole("heading", { name: /Default plant spots/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Round timings/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Spawn rushes/i })).toBeVisible();

    // At least one table row of actual data is present (not just headers).
    const tableRows = page.locator("tr");
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(1);
  });

  test("Instant utility tab renders header and lineup cards", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("tab", { name: /Instant utility/i }).click();

    // Header text.
    await expect(page.locator("text=Instant utility from spawn")).toBeVisible();

    // At least one lineup card button should be visible.
    const lineupButtons = page.getByRole("button").filter({ hasText: /smoke|flash|molotov|he/i });
    const buttonCount = await lineupButtons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test("Map tab shows marker count and side panel on click", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("tab", { name: /Map/i }).click();

    // Marker count text: "N throw-from position(s)"
    await expect(page.locator("text=/\\d+ throw-from position/")).toBeVisible();

    // Click a marker.
    const svg = page.locator('svg[aria-label*="throw-from positions"]');
    await expect(svg).toBeVisible();

    // Wait for animation to settle.
    await page.waitForTimeout(600);

    // Find and click a marker group (any <g> with a <title> child).
    const markers = svg.locator("g:has(> title)");
    const markerCount = await markers.count();
    expect(markerCount).toBeGreaterThan(0);
    await markers.first().click();

    // Side panel should show lineup list.
    await expect(page.locator("text=/lineup[s]? here/i").first()).toBeVisible();
  });
});
