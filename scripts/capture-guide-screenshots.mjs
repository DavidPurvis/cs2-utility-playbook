#!/usr/bin/env node
/**
 * One-off: capture the screenshots referenced by docs/USER_GUIDE.md.
 * Run with the dev server up on http://localhost:5174 (or pass --url).
 *
 *   node scripts/capture-guide-screenshots.mjs
 */
import { chromium } from "playwright";

const URL =
  process.argv.find((a) => a.startsWith("--url="))?.slice(6) ??
  "http://localhost:5174/cs2-utility-playbook/";
const OUT = "docs/images/guide";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await ctx.newPage();

async function shoot(name) {
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`  ✓ ${OUT}/${name}.png`);
}

console.log("Capturing guide screenshots:");

// Home — scenario grid + spawn picker (default T-side)
await page.goto(URL);
await page.waitForSelector('[data-testid="scenario-grid"]');
await page.waitForLoadState("networkidle");
await shoot("home");

// CT-side spawn cluster
await page.getByRole("tab", { name: /CT-side/i }).click();
await page.waitForTimeout(500); // viewBox animation
await shoot("spawn-picker-ct");

// Back to T-side, then pick a spawn to show the highlight state. We
// target the spawn dot by its <title> ancestor (which carries the
// "T S6 — setpos ..." accessible name), then click on the parent <g>.
await page.getByRole("tab", { name: /^T-side/i }).click();
await page.waitForTimeout(500);
const s6 = page.locator("g").filter({ has: page.locator('title:has-text("T S6")') }).first();
await s6.click({ force: true });
await page.waitForTimeout(300);
await shoot("spawn-picker-picked");

// Scenario 1 detail
await page.getByRole("button", { name: /A Default Take/i }).click();
await page.waitForTimeout(600);
await shoot("scenario-detail-no-role");

// Click role tab "Player A — Entry"
await page.getByRole("tab", { name: /Player A/i }).click();
await page.waitForTimeout(400);
await shoot("scenario-detail-a-man");

// Click first action → lineup walkthrough
await page
  .locator("button", { has: page.locator("text=A Long Pop Flash") })
  .first()
  .click();
await page.waitForTimeout(500);
await shoot("lineup-walkthrough");

await browser.close();
console.log("Done.");
