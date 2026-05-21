#!/usr/bin/env node
/**
 * Diagnostic script — visits every view of the live dev server and
 * reports whether the radar PNG actually loaded (naturalWidth > 0)
 * AND which network requests failed. Used to chase down "the map in
 * the background is no longer loading" reports.
 */
import { chromium } from "playwright";

const URL = process.argv[2] ?? "http://localhost:5173/cs2-utility-playbook/";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await ctx.newPage();

const failed = [];
page.on("requestfailed", (req) => failed.push(`FAILED ${req.failure()?.errorText} ${req.url()}`));
page.on("response", (resp) => {
  if (resp.status() >= 400) failed.push(`HTTP ${resp.status()} ${resp.url()}`);
});

async function imagesStatus(label) {
  // For every <image> (SVG) and <img> on the page, return src + whether it loaded.
  const imgs = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll("image, img").forEach((el) => {
      const isSvgImage = el.tagName.toLowerCase() === "image";
      // Try every plausible way to read the href / src.
      let src = el.getAttribute("href") ?? el.getAttribute("xlink:href") ?? null;
      if (!src && isSvgImage) {
        const animated = el.href;
        if (animated && typeof animated.baseVal === "string") src = animated.baseVal;
      }
      if (!src && !isSvgImage) src = el.getAttribute("src") ?? el.src ?? null;
      const naturalWidth = "naturalWidth" in el ? el.naturalWidth : null;
      const bbox = el.getBoundingClientRect();
      const outerLen = el.outerHTML.length;
      out.push({
        tag: el.tagName,
        src,
        naturalWidth,
        bboxWidth: bbox.width,
        bboxHeight: bbox.height,
        outerHTML: el.outerHTML.slice(0, 200),
        outerLen,
      });
    });
    return out;
  });
  console.log(`\n[${label}]`);
  for (const i of imgs) {
    const ok = (i.naturalWidth ?? 0) > 0 || (i.tag === "IMAGE" && i.bboxWidth > 0);
    console.log(`  ${ok ? "✓" : "✘"} ${i.tag.toLowerCase()} src=${i.src} natW=${i.naturalWidth} box=${i.bboxWidth}x${i.bboxHeight}`);
    console.log(`    outerHTML: ${i.outerHTML.replace(/\s+/g, " ").trim()}`);
  }
}

await page.goto(URL);
await page.waitForLoadState("networkidle");
await imagesStatus("HOME (T-side spawn picker)");

await page.getByRole("tab", { name: /CT-side/i }).click();
await page.waitForTimeout(500);
await imagesStatus("HOME (CT-side, with position guide)");

await page.getByRole("button", { name: /A Default Take/i }).click();
await page.waitForTimeout(600);
await imagesStatus("SCENARIO DETAIL");

if (failed.length === 0) {
  console.log("\n✓ Zero network failures.");
} else {
  console.log("\n✘ Network failures:");
  for (const f of failed) console.log("  " + f);
}
await browser.close();
