#!/usr/bin/env node
/**
 * Migrate must-learn lineup radarPos/radarTarget to { worldX, worldY }.
 *
 * Throw coords: cs2util setpos (Valve world) when available in lineups-import.json.
 * Target coords: existing hand percent converted via mapPercentToWorld.
 * Cache (no cs2util): both points converted from hand percent.
 *
 * Usage: node scripts/migrate-must-learn-coords.mjs [--dry-run]
 */

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import MAPS from "../data/maps-registry.js";
import { getRadarMetadata } from "../data/radarMetadata.js";
import { mapPercentToWorld } from "../lib/mapCoordinates.js";
import { resolveMustLearnCs2utilSlug } from "../data/mustLearnCs2utilSlugs.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const dryRun = process.argv.includes("--dry-run");

const importPath = path.join(projectRoot, "data", "imports", "staging", "lineups-import.json");
const importData = JSON.parse(readFileSync(importPath, "utf8"));

function roundWorld(n) {
  return Number(Number(n).toFixed(3));
}

function formatWorldPoint(point) {
  if (!point || typeof point.worldX !== "number" || typeof point.worldY !== "number") return null;
  return `{ worldX: ${roundWorld(point.worldX)}, worldY: ${roundWorld(point.worldY)} }`;
}

function percentToWorld(mapId, percentPoint) {
  if (!percentPoint || typeof percentPoint.x !== "number" || typeof percentPoint.y !== "number") {
    return null;
  }
  const meta = getRadarMetadata(mapId);
  if (!meta) return null;
  return mapPercentToWorld(percentPoint.x, percentPoint.y, meta);
}

function replaceCoordInBlock(block, field, newValue) {
  const re = new RegExp(`(\\s+${field}:\\s*)\\{[^}]+\\}`, "m");
  if (!re.test(block)) return block;
  return block.replace(re, `$1${newValue}`);
}

function migrateLineupBlock(fileContent, lineupId, radarPosStr, radarTargetStr) {
  const blockRe = new RegExp(`(\\n  ${lineupId}: \\{[\\s\\S]*?\\n  \\},)`, "m");
  const match = fileContent.match(blockRe);
  if (!match) {
    console.warn(`  [skip] block not found: ${lineupId}`);
    return fileContent;
  }

  let block = match[1];
  block = replaceCoordInBlock(block, "radarPos", radarPosStr);
  if (radarTargetStr) {
    block = replaceCoordInBlock(block, "radarTarget", radarTargetStr);
  }
  return fileContent.replace(match[1], block);
}

const summary = { updated: 0, throwFromSetpos: 0, throwFromPercent: 0, skipped: 0 };

for (const [mapId, entry] of Object.entries(MAPS)) {
  const mod = entry.module;
  const mapFile = path.join(projectRoot, "data", `${mapId}.js`);
  let content = readFileSync(mapFile, "utf8");
  const importBySlug = Object.fromEntries((importData.byMap[mapId] || []).map((r) => [r.slug, r]));

  for (const lineupId of mod.MUST_LEARN) {
    const lineup = mod.LINEUPS[lineupId];
    if (!lineup) continue;

    const slug = resolveMustLearnCs2utilSlug(mapId, lineupId, lineup);
    const imported = slug ? importBySlug[slug] : null;
    let throwWorld = imported?.throwFrom?.world || null;

    if (throwWorld) {
      summary.throwFromSetpos += 1;
    } else if (lineup.radarPos) {
      throwWorld = percentToWorld(mapId, lineup.radarPos);
      summary.throwFromPercent += 1;
      console.warn(`  [${mapId}/${lineupId}] no cs2util setpos${slug ? ` (${slug})` : ""}; converted hand radarPos`);
    } else {
      summary.skipped += 1;
      console.warn(`  [${mapId}/${lineupId}] skipped — no throw coords`);
      continue;
    }

    const targetWorld = lineup.radarTarget ? percentToWorld(mapId, lineup.radarTarget) : null;
    const radarPosStr = formatWorldPoint(throwWorld);
    const radarTargetStr = targetWorld ? formatWorldPoint(targetWorld) : null;
    if (!radarPosStr) {
      summary.skipped += 1;
      continue;
    }

    content = migrateLineupBlock(content, lineupId, radarPosStr, radarTargetStr);
    summary.updated += 1;
  }

  if (!dryRun) {
    writeFileSync(mapFile, content, "utf8");
  }
  console.log(`[${mapId}] migrated ${mod.MUST_LEARN.length} must-learn lineups`);
}

console.log("\nMigration summary:", summary);
if (dryRun) console.log("(dry run — no files written)");
