#!/usr/bin/env node
/**
 * TKT-007 — one-off migration: download cs2util.com screenshots once and
 * rewrite the JSON to point at local paths under public/screenshots/.
 *
 * Why: hot-linking to a third-party CDN means link rot during a match
 * call kills the playbook. The v6 plan requires co-located screenshots
 * (ADR-005). This script runs once during Phase 2; the resulting files
 * + JSON updates are committed.
 *
 * Behavior:
 *   1. Reads src/data/dust2.json.
 *   2. For each lineup.screenshots.{position,aim,throw,result} whose
 *      value is an https:// URL, fetches the bytes (skipping if already
 *      downloaded on disk — idempotent).
 *   3. Writes to public/screenshots/dust2/<lineup_id>/<slot>.webp.
 *   4. Updates the JSON in place to "/screenshots/dust2/<lineup_id>/<slot>.webp".
 *   5. Prints a one-line summary per lineup + a final tally.
 *
 * Exit 0 on full success. Exit 1 on any fetch failure (so CI / manual
 * runs surface the problem; partial state is fine because the script
 * is resumable — re-run picks up where it left off).
 *
 * Run: node scripts/download-screenshots.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = dirname(__dirname);
const jsonPath = join(repoRoot, "src/data/dust2.json");
const screenshotsRoot = join(repoRoot, "public/screenshots/dust2");

const SLOTS = ["position", "aim", "throw", "result"];

async function fetchToFile(url, filePath) {
  if (existsSync(filePath)) return "cached";
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, buf);
  return `fetched (${buf.length} bytes)`;
}

const data = JSON.parse(readFileSync(jsonPath, "utf8"));

let totalFetched = 0;
let totalCached = 0;
let totalSkipped = 0;
const errors = [];

for (const lineup of data.lineups) {
  if (!lineup.screenshots) continue;
  for (const slot of SLOTS) {
    const value = lineup.screenshots[slot];
    if (typeof value !== "string") continue;
    if (!value.startsWith("https://") && !value.startsWith("http://")) {
      totalSkipped++;
      continue;
    }
    const localRel = `/screenshots/dust2/${lineup.id}/${slot}.webp`;
    const localAbs = join(screenshotsRoot, lineup.id, `${slot}.webp`);
    try {
      const status = await fetchToFile(value, localAbs);
      if (status === "cached") totalCached++;
      else totalFetched++;
      // Update JSON to point at local
      lineup.screenshots[slot] = localRel;
      console.log(`  ${lineup.id}/${slot}: ${status}`);
    } catch (err) {
      errors.push({ lineup: lineup.id, slot, url: value, error: err.message });
      console.error(`  ${lineup.id}/${slot}: ✘ ${err.message}`);
    }
  }
}

// Write back the updated JSON. Pretty-printed, 2-space indent, trailing \n
// — matches `JSON.stringify(value, null, 2) + "\n"` convention used by
// the new-lineup CLI in Phase 6.
writeFileSync(jsonPath, JSON.stringify(data, null, 2) + "\n");

console.log(
  `\n  ✓ download-screenshots done:\n` +
  `    · fetched:  ${totalFetched}\n` +
  `    · cached:   ${totalCached} (already on disk)\n` +
  `    · skipped:  ${totalSkipped} (non-URL value)\n` +
  `    · errors:   ${errors.length}\n`
);

if (errors.length > 0) {
  console.error("ERRORS:");
  for (const e of errors) console.error(`  ${e.lineup}/${e.slot}: ${e.url} — ${e.error}`);
  process.exit(1);
}
