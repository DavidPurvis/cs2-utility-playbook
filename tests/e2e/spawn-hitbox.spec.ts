/**
 * Regression test for the "you have to press off the spawn to actually
 * select it" bug.
 *
 * Real root cause (discovered while writing this test, not the initial
 * pointerEvents hypothesis): the r=2.6 transparent hit-area was so wide
 * that adjacent spawns' hit zones overlapped. SVG's z-order then routed
 * clicks to whichever spawn rendered last in the iteration, so clicking
 * CT-3 selected CT-4 — and the user perceived the "real" CT-3 as being
 * elsewhere.
 *
 * Fix: the visible dot is the only click target. Dot enlarged 0.85 →
 * 1.05 (picked 1.2 → 1.4) to compensate for the lost wide hit zone.
 *
 * This test asserts that clicking the CENTER of each spawn selects
 * THAT spawn (no overlap-stealing). Critical: tests both T-side (15
 * spawns packed into 3 diamond clusters) and CT-side (5 spawns in a
 * tighter cluster) — both densities are exercised.
 *
 * The label area is intentionally NOT clickable: it's an annotation,
 * the dot is the affordance.
 */
import { test, expect } from "@playwright/test";

async function clickSpawnCenter(page, spawnLabel: string) {
  const spawnG = page
    .locator("g")
    .filter({ has: page.locator(`title:has-text("${spawnLabel}")`) })
    .first();
  const box = await spawnG.boundingBox();
  expect(box, `${spawnLabel} spawn group must be rendered`).not.toBeNull();
  await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
}

test.describe("Spawn picker click selects the right spawn (no overlap-stealing)", () => {
  test("T-6 (middle of front T-cluster)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await clickSpawnCenter(page, "T-6");
    await expect(page.locator("text=Spawn: T-6")).toBeVisible();
  });

  test("T-3 (back of left T-cluster — adjacent to T-4)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await clickSpawnCenter(page, "T-3");
    await expect(page.locator("text=Spawn: T-3")).toBeVisible();
  });

  test("T-15 (rightmost T-cluster)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await clickSpawnCenter(page, "T-15");
    await expect(page.locator("text=Spawn: T-15")).toBeVisible();
  });

  test("CT-3 (center of CT cluster — adjacent on three sides)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("tab", { name: /CT-side/i }).click();
    await page.waitForTimeout(600); // viewBox animation
    await clickSpawnCenter(page, "CT-3");
    await expect(page.locator("text=Spawn: CT-3")).toBeVisible();
  });

  test("CT-4 (also adjacent — proves the bug was overlap-stealing, not just one spawn)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("tab", { name: /CT-side/i }).click();
    await page.waitForTimeout(600);
    await clickSpawnCenter(page, "CT-4");
    await expect(page.locator("text=Spawn: CT-4")).toBeVisible();
  });
});
