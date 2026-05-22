/**
 * Map tab marker click precision — owner directive (2026-05):
 *   Clicking a cluster marker selects THAT marker, not an adjacent one.
 *
 * Same bug class as the spawn picker overlap-stealing (R-12 in
 * DECISIONS_LEDGER, locked by tests/e2e/spawn-click-target.spec.ts).
 * Earlier MapTab implementation inflated active markers from r=1.3 to
 * r=1.9 — enough that the active dot's hit footprint covered the click
 * center of clusters as close as ~3.3 viewBox units away (the natural
 * spacing from MERGE_RADIUS_SQ = 150*150 world units).
 *
 * Fix: marker radius is constant between active and inactive states;
 * active state is signalled by fill+stroke color only. These tests lock
 * that behavior.
 */
import { test, expect } from "@playwright/test";

/**
 * Selector for a single Map tab cluster marker. The marker is the `<g>`
 * inside the Map radar that has a direct `<title>` child (markers are
 * the only elements in that SVG that carry a `<title>`).
 */
const MARKER_SELECTOR = 'svg[aria-label*="throw-from positions"] g:has(> title)';

async function gotoMapTab(page) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.getByRole("tab", { name: /Map/i }).click();
  // Wait for the radar SVG + the marker layer. The Radar component
  // animates its viewBox over ~400ms; we wait long enough for it to
  // settle before any pixel-precise click.
  await page.waitForSelector('svg[aria-label*="throw-from positions"]');
  await page.waitForTimeout(600);
}

interface MarkerCoord {
  index: number;
  vbX: number;
  vbY: number;
}

/**
 * Read each marker's `<g transform="translate(x, y)">` and return them
 * in DOM order with their viewBox coords. Used by the adjacency tests
 * to find the two closest markers — that's where overlap-stealing
 * manifests if it returns.
 */
async function listMarkerCoords(page): Promise<MarkerCoord[]> {
  return await page.evaluate(() => {
    const svg = document.querySelector('svg[aria-label*="throw-from positions"]');
    if (!svg) return [];
    const groups = Array.from(svg.querySelectorAll("g")).filter((g) =>
      g.querySelector(":scope > title")
    );
    const out: Array<{ index: number; vbX: number; vbY: number }> = [];
    groups.forEach((g, i) => {
      const t = g.getAttribute("transform") ?? "";
      const m = /translate\(([-\d.]+),\s*([-\d.]+)\)/.exec(t);
      if (!m) return;
      out.push({ index: i, vbX: parseFloat(m[1]!), vbY: parseFloat(m[2]!) });
    });
    return out;
  });
}

test.describe("Map tab marker click precision (owner directive 2026-05)", () => {
  test("clicking a marker selects it (side panel shows that cluster)", async ({ page }) => {
    await gotoMapTab(page);
    const markers = page.locator(MARKER_SELECTOR);
    await expect(markers.first()).toBeVisible();
    await markers.first().click();
    // Empty state ("Click a marker to see lineups") goes away; the
    // active panel header "{N} lineup(s) here" appears.
    await expect(
      page.locator("text=/lineup[s]? here/i").first()
    ).toBeVisible();
  });

  test("clicking a SECOND marker swaps selection (no overlap-stealing — owner's regression)", async ({ page }) => {
    await gotoMapTab(page);
    const coords = await listMarkerCoords(page);
    expect(coords.length, "need at least 2 markers for swap test").toBeGreaterThanOrEqual(2);

    // Find the closest pair — that's where overlap-stealing was
    // most likely to manifest before the fix.
    let pair: [number, number] = [0, 1];
    let minDistSq = Infinity;
    for (let i = 0; i < coords.length; i++) {
      for (let j = i + 1; j < coords.length; j++) {
        const dx = coords[i]!.vbX - coords[j]!.vbX;
        const dy = coords[i]!.vbY - coords[j]!.vbY;
        const d = dx * dx + dy * dy;
        if (d < minDistSq) {
          minDistSq = d;
          pair = [i, j];
        }
      }
    }

    const markers = page.locator(MARKER_SELECTOR);
    await markers.nth(pair[0]).click();
    await expect(page.locator("text=/lineup[s]? here/i").first()).toBeVisible();

    await markers.nth(pair[1]).click();
    // Panel header is still "lineup(s) here" — meaning the second click
    // selected the SECOND marker, not stuck on the first.
    await expect(page.locator("text=/lineup[s]? here/i").first()).toBeVisible();
    // Sanity check: the active marker is now the SECOND one. Re-clicking
    // the second deselects (toggle), confirming it was active.
    await markers.nth(pair[1]).click();
    await expect(page.locator("text=/Click a marker to see lineups/i")).toBeVisible();
  });

  test("clicking far OUTSIDE any marker does NOT select", async ({ page }) => {
    await gotoMapTab(page);
    // Click a corner of the SVG paint area where there's no marker.
    const svgBox = await page
      .locator('svg[aria-label*="throw-from positions"]')
      .boundingBox();
    expect(svgBox, "radar SVG must be rendered").not.toBeNull();
    // Top-left corner area — outside Dust 2 playable space on Valve
    // overview, no markers there.
    await page.mouse.click(svgBox!.x + 30, svgBox!.y + 30);
    await page.waitForTimeout(200);
    await expect(page.locator("text=/Click a marker to see lineups/i")).toBeVisible();
    await expect(page.locator("text=/lineup[s]? here/i")).toHaveCount(0);
  });

  test("clicking the active marker again deselects it (toggle behavior)", async ({ page }) => {
    await gotoMapTab(page);
    const markers = page.locator(MARKER_SELECTOR);
    const first = markers.first();
    // First click — select.
    await first.click();
    await expect(page.locator("text=/lineup[s]? here/i").first()).toBeVisible();
    // Second click on the SAME marker — should deselect.
    await first.click();
    await expect(page.locator("text=/Click a marker to see lineups/i")).toBeVisible();
  });

  test("REGRESSION: clicking adjacent markers in succession works both directions", async ({ page }) => {
    await gotoMapTab(page);
    const coords = await listMarkerCoords(page);
    expect(coords.length).toBeGreaterThanOrEqual(2);

    let pair: [number, number] = [0, 1];
    let minDistSq = Infinity;
    for (let i = 0; i < coords.length; i++) {
      for (let j = i + 1; j < coords.length; j++) {
        const dx = coords[i]!.vbX - coords[j]!.vbX;
        const dy = coords[i]!.vbY - coords[j]!.vbY;
        const d = dx * dx + dy * dy;
        if (d < minDistSq) {
          minDistSq = d;
          pair = [i, j];
        }
      }
    }

    const markers = page.locator(MARKER_SELECTOR);

    // Forward: A → B
    await markers.nth(pair[0]).click();
    await expect(page.locator("text=/lineup[s]? here/i").first()).toBeVisible();
    await markers.nth(pair[1]).click();
    await expect(page.locator("text=/lineup[s]? here/i").first()).toBeVisible();

    // Clear and reverse: B → A
    await page.locator("text=clear").click();
    await expect(page.locator("text=/Click a marker to see lineups/i")).toBeVisible();

    await markers.nth(pair[1]).click();
    await expect(page.locator("text=/lineup[s]? here/i").first()).toBeVisible();
    await markers.nth(pair[0]).click();
    await expect(page.locator("text=/lineup[s]? here/i").first()).toBeVisible();
  });
});
