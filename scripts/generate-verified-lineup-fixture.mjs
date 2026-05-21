#!/usr/bin/env node
/**
 * Regenerate tests/fixtures/verifiedLineupCoords.js from staging import + slug map.
 * Usage: node scripts/generate-verified-lineup-fixture.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import MAPS from "../data/maps-registry.js";
import { MUST_LEARN_CS2UTIL_SLUGS } from "../data/mustLearnCs2utilSlugs.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const importPath = path.join(projectRoot, "data", "imports", "staging", "lineups-import.json");
const importData = JSON.parse(readFileSync(importPath, "utf8"));

const out = {};

for (const [mapId, entry] of Object.entries(MAPS)) {
  const slugs = MUST_LEARN_CS2UTIL_SLUGS[mapId] || {};
  const importBySlug = Object.fromEntries((importData.byMap[mapId] || []).map((r) => [r.slug, r]));
  const mapOut = {};

  for (const lineupId of entry.module.MUST_LEARN) {
    const slug = slugs[lineupId];
    if (!slug) continue;
    const rec = importBySlug[slug];
    if (!rec?.throwFrom?.world) continue;
    mapOut[lineupId] = {
      cs2utilSlug: slug,
      throwWorld: {
        worldX: Number(rec.throwFrom.world.worldX.toFixed(3)),
        worldY: Number(rec.throwFrom.world.worldY.toFixed(3)),
      },
      tolerance: 5,
    };
  }

  if (Object.keys(mapOut).length) out[mapId] = mapOut;
}

const fileBody = `/**
 * Must-learn lineup throw coords verified against cs2util setpos import.
 * Generated from data/imports/staging/lineups-import.json + mustLearnCs2utilSlugs.js
 *
 * Re-generate: node scripts/generate-verified-lineup-fixture.mjs
 */
export const VERIFIED_MUST_LEARN_COORDS = ${JSON.stringify(out, null, 2)};
`;

writeFileSync(path.join(projectRoot, "tests", "fixtures", "verifiedLineupCoords.js"), fileBody, "utf8");
console.log("Wrote verifiedLineupCoords.js with", Object.values(out).reduce((n, m) => n + Object.keys(m).length, 0), "entries");
