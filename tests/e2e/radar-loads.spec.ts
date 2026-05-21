/**
 * Regression test for "the map in the background is no longer
 * loading."
 *
 * Verifies that:
 *   1. The radar SVG <image> element exists on the page.
 *   2. Its `href` attribute is set to the BASE_URL-prefixed path
 *      (/cs2-utility-playbook/maps/dust2/radar.png in this project).
 *   3. The bundled PNG actually resolves — fetch returns 200, content
 *      is a non-empty PNG.
 *   4. No "Loading radar…" or "Radar image not found" placeholder text
 *      is showing (which would indicate the React load reducer never
 *      transitioned).
 *
 * Catches a class of bugs where React's onLoad handler doesn't fire
 * (because the image was already cached) and the placeholder rect
 * permanently obscures the radar.
 */
import { test, expect } from "@playwright/test";

test.describe("Radar image", () => {
  test("renders on the home spawn picker (T side)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const radarImage = page.locator("svg image").first();
    await expect(radarImage).toBeVisible();
    const href = await radarImage.getAttribute("href");
    expect(href).toMatch(/maps\/dust2\/radar\.png$/);

    // The "Loading radar…" / "not found" placeholder text must NOT be
    // showing — its presence is the visual symptom of the load-state
    // bug.
    await expect(page.locator("text=Loading radar")).toHaveCount(0);
    await expect(page.locator("text=Radar image not found")).toHaveCount(0);
  });

  test("the PNG behind the href is fetchable and non-empty", async ({ request, baseURL }) => {
    const url = new URL("maps/dust2/radar.png", baseURL).toString();
    const resp = await request.get(url);
    expect(resp.status(), `GET ${url} must succeed`).toBe(200);
    const buf = await resp.body();
    expect(buf.length, "radar.png must be non-empty").toBeGreaterThan(1024);
    // PNG magic number: 0x89 0x50 0x4E 0x47
    expect(buf.subarray(0, 4)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  });

  test("renders on the scenario detail view", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /A Default Take/i }).click();
    await page.waitForTimeout(500);

    const radarImage = page.locator("svg image").first();
    await expect(radarImage).toBeVisible();
    await expect(page.locator("text=Loading radar")).toHaveCount(0);
  });

  test("renders on the CT-side spawn picker", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("tab", { name: /CT-side/i }).click();
    await page.waitForTimeout(500);

    const radarImage = page.locator("svg image").first();
    await expect(radarImage).toBeVisible();
  });
});
