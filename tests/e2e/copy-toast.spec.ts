/**
 * E2E: Copy button + toast notification.
 *
 * Validates the clipboard copy flow that appears on every lineup
 * walkthrough: clicking "Copy setpos" triggers a toast with success
 * text, and the toast auto-dismisses after its timeout.
 */
import { test, expect } from "@playwright/test";

/** Navigate from home to the first lineup's walkthrough view. */
async function goToLineup(page) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: /A Default Take/i }).click();
  await page.getByRole("tab", { name: /Player A/i }).click();
  await page.getByRole("button", { name: /Step 1/i }).click();
  await expect(page.locator(".walkthrough-grid")).toBeVisible();
}

test.describe("Copy button + toast", () => {
  test("clicking Copy setpos shows success toast", async ({ page, context }) => {
    // Grant clipboard permissions so the copy actually succeeds.
    await context.grantPermissions(["clipboard-write", "clipboard-read"]);
    await goToLineup(page);

    const copyBtn = page.getByRole("button", { name: /copy setpos/i }).first();
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();

    // Toast appears with success message.
    await expect(page.locator("text=Copied setpos to clipboard")).toBeVisible();
  });

  test("toast auto-dismisses after delay", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-write", "clipboard-read"]);
    await goToLineup(page);

    await page.getByRole("button", { name: /copy setpos/i }).first().click();
    await expect(page.locator("text=Copied setpos to clipboard")).toBeVisible();

    // Success toast auto-dismisses after 1.5s — wait 2s for margin.
    await page.waitForTimeout(2000);
    await expect(page.locator("text=Copied setpos to clipboard")).toHaveCount(0);
  });

  test("Copy button text contains 'Copy setpos' (accessibility)", async ({ page }) => {
    await goToLineup(page);
    const copyBtns = page.getByRole("button", { name: /copy setpos/i });
    // At least one Copy setpos button should be present in the walkthrough.
    await expect(copyBtns.first()).toBeVisible();
  });
});
