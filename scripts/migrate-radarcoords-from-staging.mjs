#!/usr/bin/env node
/**
 * One-shot migration: replace hand-tuned `radarPos`/`radarTarget` `{x,y}`
 * values in data/<map>.js with ground-truth world coordinates from
 * `data/imports/staging/lineups-import.json` (cs2util setpos-verified).
 *
 * Strategy per lineup:
 *   - Match lineup → cs2util slug via screenshots URL (existing helper).
 *   - If staging has `throwFrom.world` → replace radarPos with
 *     `{ worldX, worldY }`.
 *   - If staging has `landingAt.percent` → replace radarTarget with
 *     `{ x, y }` (cs2util percentages are in Valve radar space, verified
 *     by xbox_smoke round-trip).
 *   - Unmatched lineups keep their existing values (no regression).
 *
 * Idempotent: running twice produces the same result.
 *
 * Usage: node scripts/migrate-radarcoords-from-staging.mjs [--dry-run]
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

const dryRun = process.argv.includes("--dry-run");

const MAPS = ["ancient", "anubis", "cache", "dust2", "inferno", "mirage", "nuke", "overpass"];

async function loadStaging() {
  const path = join(repoRoot, "data/imports/staging/lineups-import.json");
  const raw = await readFile(path, "utf8");
  return JSON.parse(raw);
}

async function loadModule(mapId) {
  const mod = await import(join(repoRoot, "data", `${mapId}.js`));
  return mod.LINEUPS;
}

async function loadSlugHelper() {
  return await import(join(repoRoot, "data/mustLearnCs2utilSlugs.js"));
}

function fmtNumber(n) {
  // Trim long decimals to 3 places to keep the file readable.
  return Number.isInteger(n) ? String(n) : Number(n.toFixed(3)).toString();
}

function buildReplacement(stagingEntry) {
  const world = stagingEntry?.throwFrom?.world;
  const throwPct = stagingEntry?.throwFrom?.percent;
  const landing = stagingEntry?.landingAt?.percent;
  const out = {};
  if (world && Number.isFinite(world.worldX) && Number.isFinite(world.worldY)) {
    // Preferred: world coords run through the Valve formula.
    out.radarPos = `{ worldX: ${fmtNumber(world.worldX)}, worldY: ${fmtNumber(world.worldY)} }`;
  } else if (throwPct && Number.isFinite(throwPct.x) && Number.isFinite(throwPct.y)) {
    // Fallback: cs2util's percent is in Valve radar space (verified by
    // round-trip on dust2 xbox_smoke). Better than the hand-tuned value.
    out.radarPos = `{ x: ${fmtNumber(throwPct.x)}, y: ${fmtNumber(throwPct.y)} }`;
  }
  if (landing && Number.isFinite(landing.x) && Number.isFinite(landing.y)) {
    out.radarTarget = `{ x: ${fmtNumber(landing.x)}, y: ${fmtNumber(landing.y)} }`;
  }
  return out;
}

/**
 * Replace a single `KEY: { ... }` line in a lineup block in source text.
 * We target the line immediately preceding/following the screenshots block
 * (the original file has these as one-liners), and only replace if found.
 */
function replaceLineupField(source, lineupId, fieldKey, newLiteral) {
  // Find the lineup block start: lines that begin with `  <id>: {`
  const blockHeader = new RegExp(`(\\n  ${lineupId}:\\s*{)`, "g");
  const match = blockHeader.exec(source);
  if (!match) return { source, changed: false, reason: "lineup-block-not-found" };
  const blockStart = match.index + match[0].length;
  // Find the end of the block by counting braces.
  let depth = 1;
  let i = blockStart;
  while (i < source.length && depth > 0) {
    const ch = source[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    i++;
  }
  const blockEnd = i;
  const block = source.slice(blockStart, blockEnd);

  // Field line patterns we accept (must be a one-liner):
  //   radarPos: { x: 43, y: 95 },
  //   radarPos: { worldX: -300, worldY: -1163 },
  const fieldLine = new RegExp(`(^|\\n)\\s{4}${fieldKey}:\\s*{[^}\\n]*}\\s*,?`, "g");
  let changedHere = false;
  const replacedInBlock = block.replace(fieldLine, (_whole, lead) => {
    changedHere = true;
    return `${lead}    ${fieldKey}: ${newLiteral},`;
  });
  if (!changedHere) return { source, changed: false, reason: `field-not-found:${fieldKey}` };

  const next = source.slice(0, blockStart) + replacedInBlock + source.slice(blockEnd);
  return { source: next, changed: true };
}

async function migrateMap(mapId, staging, slugHelper) {
  const path = join(repoRoot, "data", `${mapId}.js`);
  const original = await readFile(path, "utf8");
  let source = original;

  const lineups = await loadModule(mapId);
  const stagingMap = staging.byMap[mapId] || [];
  const stagingBySlug = new Map(stagingMap.map((e) => [e.slug, e]));

  const ids = Object.keys(lineups);
  const log = [];
  let posUpdates = 0;
  let targetUpdates = 0;
  let skipped = 0;

  for (const id of ids) {
    const lineup = lineups[id];
    const slug = slugHelper.resolveMustLearnCs2utilSlug(mapId, id, lineup);
    const entry = slug ? stagingBySlug.get(slug) : null;
    if (!entry) {
      skipped++;
      log.push(`  · ${id}: no staging match (slug=${slug ?? "?"})`);
      continue;
    }
    // Side consistency check: a T-side lineup that happens to share a
    // screenshot URL with a CT-side cs2util entry would otherwise pick
    // up the CT throw position. Skip those — the screenshot is wrong.
    if (lineup.side && entry.team && lineup.side !== entry.team) {
      skipped++;
      log.push(`  · ${id}: side mismatch (lineup=${lineup.side}, cs2util=${entry.team}, slug=${slug})`);
      continue;
    }
    const repl = buildReplacement(entry);
    if (repl.radarPos) {
      const r = replaceLineupField(source, id, "radarPos", repl.radarPos);
      if (r.changed) {
        source = r.source;
        posUpdates++;
      } else {
        log.push(`  ! ${id}: radarPos field not found (${r.reason})`);
      }
    }
    if (repl.radarTarget) {
      const r = replaceLineupField(source, id, "radarTarget", repl.radarTarget);
      if (r.changed) {
        source = r.source;
        targetUpdates++;
      } else {
        log.push(`  ! ${id}: radarTarget field not found (${r.reason})`);
      }
    }
  }

  const changed = source !== original;
  if (changed && !dryRun) await writeFile(path, source, "utf8");
  console.log(
    `${mapId}: ${posUpdates} radarPos updated, ${targetUpdates} radarTarget updated, ${skipped} unmatched ${dryRun ? "(dry-run)" : ""}`
  );
  for (const line of log) console.log(line);
}

/**
 * Sync each SETUP_POSITIONS entry's `pos` with the radarPos of its
 * first associated lineup. The setup position represents the place
 * where the player stands to throw the lineup, so they should be the
 * same coord. The lineup data was just updated to ground truth; the
 * setup-position dot must follow or it lands somewhere different than
 * the throw it represents.
 */
async function syncSetupPositions(mapId) {
  const path = join(repoRoot, "data", `${mapId}.js`);
  const original = await readFile(path, "utf8");
  let source = original;

  const mod = await import(join(repoRoot, "data", `${mapId}.js`));
  const lineups = mod.LINEUPS || {};
  const setups = mod.SETUP_POSITIONS || [];

  let synced = 0;
  for (const setup of setups) {
    // Pick the first lineup that matches the setup's side. This avoids
    // syncing a T-side setup to a CT-side lineup's throw position when
    // both are (incorrectly) bundled into the same setup.
    const matchingLineupId = setup.lineups?.find((id) => {
      const l = lineups[id];
      return l && (!setup.side || l.side === setup.side);
    });
    const lineup = matchingLineupId ? lineups[matchingLineupId] : null;
    if (!lineup?.radarPos) continue;
    const rp = lineup.radarPos;
    const literal =
      "worldX" in rp
        ? `{ worldX: ${fmtNumber(rp.worldX)}, worldY: ${fmtNumber(rp.worldY)} }`
        : `{ x: ${fmtNumber(rp.x)}, y: ${fmtNumber(rp.y)} }`;
    // Match the setup-position object by id, then replace its `pos: { ... }`.
    const objectPattern = new RegExp(
      `(id:\\s*"${setup.id}"[\\s\\S]{0,400}?)pos:\\s*\\{[^}\\n]*\\}`,
      "m"
    );
    const next = source.replace(objectPattern, (_, lead) => `${lead}pos: ${literal}`);
    if (next !== source) {
      source = next;
      synced++;
    }
  }

  if (source !== original && !dryRun) await writeFile(path, source, "utf8");
  console.log(`${mapId}: synced ${synced} SETUP_POSITIONS to lineup throw positions ${dryRun ? "(dry-run)" : ""}`);
}

/**
 * For lineups that share a SETUP_POSITION with a setpos-verified
 * lineup, copy that lineup's verified radarPos onto them. Players
 * stand in the same spot for every lineup in a setup, so the throw
 * coordinate must be the same.
 *
 * This propagates ground truth from must-learn lineups to nearby
 * "buddy" lineups (e.g., from `b_window_smoke` to `b_car_smoke`,
 * `b_site_molly`, `b_tunnel_flash` — all thrown from Upper Tunnels).
 */
async function propagateRadarPosWithinSetup(mapId) {
  const path = join(repoRoot, "data", `${mapId}.js`);
  const original = await readFile(path, "utf8");
  let source = original;

  const mod = await import(join(repoRoot, "data", `${mapId}.js`) + `?cb=${Date.now()}`);
  const lineups = mod.LINEUPS || {};
  const setups = mod.SETUP_POSITIONS || [];

  let propagated = 0;
  for (const setup of setups) {
    const ids = setup.lineups || [];
    if (ids.length < 2) continue;
    // Find the first lineup matching the setup's side with verified world coords.
    const verifiedSourceId = ids.find((id) => {
      const l = lineups[id];
      return (
        l?.radarPos &&
        "worldX" in l.radarPos &&
        (!setup.side || l.side === setup.side)
      );
    });
    if (!verifiedSourceId) continue;
    const verifiedPos = lineups[verifiedSourceId].radarPos;
    const literal = `{ worldX: ${fmtNumber(verifiedPos.worldX)}, worldY: ${fmtNumber(verifiedPos.worldY)} }`;

    for (const otherId of ids) {
      if (otherId === verifiedSourceId) continue;
      const other = lineups[otherId];
      if (!other) continue;
      // Skip if the other lineup already has world coords (its own setpos).
      if (other.radarPos && "worldX" in other.radarPos) continue;
      // Skip if buddies have a different side — they're throws from
      // different places, even though they share a setup entry.
      if (setup.side && other.side !== setup.side) continue;
      const r = replaceLineupField(source, otherId, "radarPos", literal);
      if (r.changed) {
        source = r.source;
        propagated++;
      }
    }
  }

  if (source !== original && !dryRun) await writeFile(path, source, "utf8");
  console.log(
    `${mapId}: propagated ${propagated} radarPos from buddy lineups within shared setup positions ${dryRun ? "(dry-run)" : ""}`
  );
}

async function main() {
  const staging = await loadStaging();
  const slugHelper = await loadSlugHelper();
  for (const map of MAPS) {
    await migrateMap(map, staging, slugHelper);
  }
  console.log("\nSyncing SETUP_POSITIONS with lineup radarPos...");
  for (const map of MAPS) {
    await syncSetupPositions(map);
  }
  console.log("\nPropagating verified radarPos across buddy lineups in same setup...");
  for (const map of MAPS) {
    await propagateRadarPosWithinSetup(map);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
