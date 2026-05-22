/**
 * Spawn click contract — owner directives (in order they were issued):
 *
 *   1. "Make the spawn icon click ability and remove the click ability
 *       from number (nothing happens when you click on the number)."
 *      ↳ Earlier revision: dot was the click target, number floated ABOVE
 *        the dot, and the number's pointer-events were disabled.
 *
 *   2. (Current, 2026-05) "Make the clickable area for the spawn location
 *       match the spawn icon. Currently I can't select t-15 then select
 *       t-14 because the t-15 clickable area is above t-14 clickable.
 *       I want the number instead of the spawn icon without 'ct-' or
 *       't-' prefix."
 *      ↳ The number now lives INSIDE the dot. The visible icon IS the
 *        click target — no offset between what you see and what registers
 *        a click. The prefix is dropped because the side tab above the
 *        picker already disambiguates T vs CT.
 *
 * Invariants tested here:
 *   A. Clicking dot center selects (T and CT).
 *   B. Clicking outside the dot does NOT select (no overlap-stealing
 *      from neighbors).
 *   C. The rendered text on the icon is the bare number (e.g. "15", "3"),
 *      NOT "t-15" / "ct-3".
 *   D. Specific regression: select T-15 then select T-14 must work — the
 *      exact case the owner reported when they couldn't switch picks.
 */
import { test, expect } from "@playwright/test";

async function radarMetrics(page) {
  const metrics = await page.evaluate(() => {
    const svg = document.querySelector("section[aria-label='Spawn picker'] svg") as SVGSVGElement | null;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    const scale = Math.min(rect.width / vb.width, rect.height / vb.height);
    const paintWidth = vb.width * scale;
    const paintHeight = vb.height * scale;
    const paintX = rect.x + (rect.width - paintWidth) / 2;
    const paintY = rect.y + (rect.height - paintHeight) / 2;
    return { vbX: vb.x, vbY: vb.y, vbWidth: vb.width, vbHeight: vb.height, paintX, paintY, scale };
  });
  return metrics;
}

async function spawnDotCenterPx(page, spawnLabel: string) {
  const gPct = await page.evaluate((label) => {
    const groups = Array.from(document.querySelectorAll("section[aria-label='Spawn picker'] svg g"));
    for (const g of groups) {
      const title = g.querySelector("title");
      if (title?.textContent?.includes(label)) {
        const t = g.getAttribute("transform") ?? "";
        const m = /translate\(([-\d.]+),\s*([-\d.]+)\)/.exec(t);
        if (m) return { x: parseFloat(m[1]!), y: parseFloat(m[2]!) };
      }
    }
    return null;
  }, spawnLabel);
  expect(gPct, `${spawnLabel}'s <g translate> must be readable`).not.toBeNull();
  const m = await radarMetrics(page);
  expect(m, "spawn-picker SVG must exist").not.toBeNull();
  const px = m!.paintX + (gPct!.x - m!.vbX) * m!.scale;
  const py = m!.paintY + (gPct!.y - m!.vbY) * m!.scale;
  return { dotCenterX: px, dotCenterY: py, unitsPerPx: 1 / m!.scale, pxPerUnit: m!.scale };
}

test.describe("Spawn click target — number lives inside dot (owner directive 2026-05)", () => {
  test("clicking the DOT center selects the T-side spawn", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const { dotCenterX, dotCenterY } = await spawnDotCenterPx(page, "T-6");
    await page.mouse.click(dotCenterX, dotCenterY);
    await expect(page.locator("text=Spawn: T-6")).toBeVisible();
  });

  test("clicking the DOT center selects the CT-side spawn", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("tab", { name: /CT-side/i }).click();
    await page.waitForTimeout(600);
    const { dotCenterX, dotCenterY } = await spawnDotCenterPx(page, "CT-3");
    await page.mouse.click(dotCenterX, dotCenterY);
    await expect(page.locator("text=Spawn: CT-3")).toBeVisible();
  });

  test("clicking well OUTSIDE the dot (3 vbu below) does NOT select", async ({ page }) => {
    // The dot radius is ~1.55 viewBox units. 3.0 units below center is
    // safely outside any spawn icon AND not on a neighbor.
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const { dotCenterX, dotCenterY, pxPerUnit } = await spawnDotCenterPx(page, "T-6");
    const farBelowY = dotCenterY + 3.0 * pxPerUnit;
    await page.mouse.click(dotCenterX, farBelowY);
    await page.waitForTimeout(300);
    await expect(page.locator("text=Spawn: T-6")).toHaveCount(0);
  });

  test("rendered icon text is bare number ('6'), NOT 't-6'", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // The SVG text inside the T-6 group should be "6", not "t-6".
    const labelText = await page.evaluate(() => {
      const groups = Array.from(document.querySelectorAll("section[aria-label='Spawn picker'] svg g"));
      for (const g of groups) {
        const title = g.querySelector("title");
        if (title?.textContent?.includes("T-6")) {
          const txt = g.querySelector("text");
          return txt?.textContent ?? null;
        }
      }
      return null;
    });
    expect(labelText).toBe("6");
  });

  test("rendered CT icon text is bare number ('3'), NOT 'ct-3'", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("tab", { name: /CT-side/i }).click();
    await page.waitForTimeout(600);
    const labelText = await page.evaluate(() => {
      const groups = Array.from(document.querySelectorAll("section[aria-label='Spawn picker'] svg g"));
      for (const g of groups) {
        const title = g.querySelector("title");
        if (title?.textContent?.includes("CT-3")) {
          const txt = g.querySelector("text");
          return txt?.textContent ?? null;
        }
      }
      return null;
    });
    expect(labelText).toBe("3");
  });

  test("REGRESSION: select T-15 then select T-14 — no overlap-stealing (owner's exact complaint)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // First, click T-15.
    const t15 = await spawnDotCenterPx(page, "T-15");
    await page.mouse.click(t15.dotCenterX, t15.dotCenterY);
    await expect(page.locator("text=Spawn: T-15")).toBeVisible();

    // Then, click T-14. This is the move that was broken — T-15's old
    // (oversized OR offset-label) hit zone was stealing T-14's clicks.
    const t14 = await spawnDotCenterPx(page, "T-14");
    await page.mouse.click(t14.dotCenterX, t14.dotCenterY);
    await expect(page.locator("text=Spawn: T-14")).toBeVisible();
    await expect(page.locator("text=Spawn: T-15")).toHaveCount(0);
  });

  test("REGRESSION: select T-14 then T-15 (opposite order — both must work)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const t14 = await spawnDotCenterPx(page, "T-14");
    await page.mouse.click(t14.dotCenterX, t14.dotCenterY);
    await expect(page.locator("text=Spawn: T-14")).toBeVisible();

    const t15 = await spawnDotCenterPx(page, "T-15");
    await page.mouse.click(t15.dotCenterX, t15.dotCenterY);
    await expect(page.locator("text=Spawn: T-15")).toBeVisible();
    await expect(page.locator("text=Spawn: T-14")).toHaveCount(0);
  });

  test("REGRESSION: CT-3 then CT-4 switch works (the original overlap-stealing case)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("tab", { name: /CT-side/i }).click();
    await page.waitForTimeout(600);

    const ct3 = await spawnDotCenterPx(page, "CT-3");
    await page.mouse.click(ct3.dotCenterX, ct3.dotCenterY);
    await expect(page.locator("text=Spawn: CT-3")).toBeVisible();

    const ct4 = await spawnDotCenterPx(page, "CT-4");
    await page.mouse.click(ct4.dotCenterX, ct4.dotCenterY);
    await expect(page.locator("text=Spawn: CT-4")).toBeVisible();
    await expect(page.locator("text=Spawn: CT-3")).toHaveCount(0);
  });
});
