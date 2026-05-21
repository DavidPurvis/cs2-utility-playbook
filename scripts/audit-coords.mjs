#!/usr/bin/env node
/**
 * Coordinate accuracy audit.
 *
 * For every lineup in every map, compute the rendered radar percent
 * and report:
 *   - Is the world coord (or fallback percent) inside the 0–100% bounds?
 *   - For matched lineups, does the percent agree with cs2util's
 *     reported throwFrom.percent within tolerance (verifies the
 *     conversion math is consistent)?
 *   - For unmatched lineups, flag for manual review.
 *
 * Output: a per-map summary + a table of anomalies sorted by severity.
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

const MAPS = ["ancient", "anubis", "cache", "dust2", "inferno", "mirage", "nuke", "overpass"];

const radarMetaJson = JSON.parse(
  await readFile(join(repoRoot, "tests/fixtures/demoinfocsRadarMetadata.json"), "utf8")
);
const RADAR_METADATA = radarMetaJson.maps ?? radarMetaJson;
// Cache has no demoinfocs metadata; use Valve overview values.
RADAR_METADATA.cache ??= { pos_x: -2000, pos_y: 3250, scale: 5.5 };

const staging = JSON.parse(
  await readFile(join(repoRoot, "data/imports/staging/lineups-import.json"), "utf8")
);

const { extractCs2utilSlugFromLineup, resolveMustLearnCs2utilSlug } = await import(
  join(repoRoot, "data/mustLearnCs2utilSlugs.js")
);

function worldToPct(world, meta) {
  const total = meta.scale * (meta.sourceResolution ?? 1024);
  return {
    x: ((world.worldX - meta.pos_x) / total) * 100,
    y: ((world.worldY - meta.pos_y) / -total) * 100,
  };
}

function resolvePos(p, meta) {
  if (!p) return null;
  if ("worldX" in p) return worldToPct({ worldX: p.worldX, worldY: p.worldY }, meta);
  if ("x" in p) return { x: p.x, y: p.y };
  return null;
}

function inBounds(p) {
  return p && p.x >= 0 && p.x <= 100 && p.y >= 0 && p.y <= 100;
}

const SEVERITY = {
  CRITICAL: 3,  // out of bounds — guaranteed render off-radar
  HIGH: 2,      // ≥5% disagreement with cs2util
  LOW: 1,       // unmatched + hand-tuned (can't validate)
  OK: 0,
};

const anomalies = [];

for (const mapId of MAPS) {
  const mod = await import(join(repoRoot, "data", `${mapId}.js`));
  const lineups = mod.LINEUPS || {};
  const setups = mod.SETUP_POSITIONS || [];
  const meta = RADAR_METADATA[mapId];
  const stagingArr = staging.byMap[mapId] || [];
  const stagingBySlug = new Map(stagingArr.map((e) => [e.slug, e]));

  if (!meta) {
    console.log(`${mapId}: no radar metadata — skipping`);
    continue;
  }

  let matched = 0, unmatched = 0, critical = 0, high = 0;

  for (const [id, lineup] of Object.entries(lineups)) {
    const slug = resolveMustLearnCs2utilSlug(mapId, id, lineup);
    const entry = slug ? stagingBySlug.get(slug) : null;
    const throwPct = resolvePos(lineup.radarPos, meta);
    const targetPct = resolvePos(lineup.radarTarget, meta);

    if (!inBounds(throwPct)) {
      anomalies.push({
        map: mapId, id, severity: SEVERITY.CRITICAL, kind: "throw-out-of-bounds",
        detail: `throw resolved to ${throwPct?.x?.toFixed(1)}, ${throwPct?.y?.toFixed(1)}`,
      });
      critical++;
    }
    if (lineup.radarTarget && !inBounds(targetPct)) {
      anomalies.push({
        map: mapId, id, severity: SEVERITY.CRITICAL, kind: "target-out-of-bounds",
        detail: `target resolved to ${targetPct?.x?.toFixed(1)}, ${targetPct?.y?.toFixed(1)}`,
      });
      critical++;
    }

    if (entry) {
      // If the auto-extracted slug points to a cs2util entry on the
      // opposite side, the screenshot URL is mislabeled and the cs2util
      // entry isn't this lineup — skip cross-side disagreement checks.
      const sideMismatch = lineup.side && entry.team && lineup.side !== entry.team;
      if (sideMismatch) {
        unmatched++;
      } else {
        matched++;
        const cs2utilPct = entry.throwFrom?.percent;
        if (cs2utilPct && throwPct && inBounds(throwPct) && inBounds(cs2utilPct)) {
          const dx = Math.abs(throwPct.x - cs2utilPct.x);
          const dy = Math.abs(throwPct.y - cs2utilPct.y);
          if (dx > 5 || dy > 5) {
            anomalies.push({
              map: mapId, id, severity: SEVERITY.HIGH, kind: "throw-disagrees-with-cs2util",
              detail: `app (${throwPct.x.toFixed(1)}, ${throwPct.y.toFixed(1)}) vs cs2util (${cs2utilPct.x.toFixed(1)}, ${cs2utilPct.y.toFixed(1)}), Δ=(${dx.toFixed(1)}, ${dy.toFixed(1)})`,
            });
            high++;
          }
        }
      }
    } else {
      unmatched++;
      // Hand-tuned values where we have no cs2util ground truth. Flag for review.
      anomalies.push({
        map: mapId, id, severity: SEVERITY.LOW, kind: "unmatched-handTuned",
        detail: `slug=${slug ?? "?"}, throw=(${throwPct?.x?.toFixed(1) ?? "?"}, ${throwPct?.y?.toFixed(1) ?? "?"})`,
      });
    }
  }

  // Also check SETUP_POSITIONS (the visible numbered dots).
  let setupOutOfBounds = 0;
  for (const setup of setups) {
    const pct = resolvePos(setup.pos, meta);
    if (!inBounds(pct)) {
      anomalies.push({
        map: mapId, id: `setup:${setup.id}`, severity: SEVERITY.CRITICAL,
        kind: "setup-out-of-bounds",
        detail: `resolved to ${pct?.x?.toFixed(1)}, ${pct?.y?.toFixed(1)}`,
      });
      setupOutOfBounds++;
    }
  }

  console.log(
    `${mapId.padEnd(9)}: ${matched} matched, ${unmatched} unmatched lineups · ${critical} critical · ${high} high · ${setupOutOfBounds} setup-out-of-bounds`
  );
}

console.log("\n=== Anomalies (most severe first) ===");
anomalies.sort((a, b) => b.severity - a.severity);

const critical = anomalies.filter((a) => a.severity === SEVERITY.CRITICAL);
const high = anomalies.filter((a) => a.severity === SEVERITY.HIGH);
const low = anomalies.filter((a) => a.severity === SEVERITY.LOW);

if (critical.length) {
  console.log(`\n--- ${critical.length} CRITICAL (dot will render off-radar) ---`);
  for (const a of critical) console.log(`  [${a.map}/${a.id}] ${a.kind}: ${a.detail}`);
} else {
  console.log("\nNo critical anomalies — every dot projects inside the radar.");
}

if (high.length) {
  console.log(`\n--- ${high.length} HIGH (≥5% disagreement vs cs2util) ---`);
  for (const a of high) console.log(`  [${a.map}/${a.id}] ${a.kind}: ${a.detail}`);
} else {
  console.log("No high-severity disagreements with cs2util percentages.");
}

console.log(`\n--- ${low.length} LOW (unmatched / hand-tuned — manual review only) ---`);
const lowByMap = {};
for (const a of low) (lowByMap[a.map] ??= []).push(a.id);
for (const [m, ids] of Object.entries(lowByMap)) {
  console.log(`  ${m}: ${ids.join(", ")}`);
}
