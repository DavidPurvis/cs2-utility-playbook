#!/usr/bin/env node
/**
 * Apply exact cs2util setpos coordinates to every app lineup that has
 * a confirmed cs2util match. The match is established by:
 *   1. Manual override in `data/mustLearnCs2utilSlugs.js`
 *   2. Screenshot URL → slug, BUT ONLY when team matches (lineup.side
 *      === entry.team) AND slug exists in staging
 *
 * For every confirmed match we rewrite `radarPos` to the exact world
 * coords from cs2util's `posCommand` (setpos). This is the in-game
 * player position — the closest possible thing to ground truth.
 *
 * Where cs2util has `landingAt.percent`, we also rewrite `radarTarget`
 * to that percentage (cs2util's 2D-map dot).
 *
 * Lineups with no confirmed cs2util match keep their existing radarPos
 * / radarTarget. Each such lineup is logged so we know what needs
 * manual verification later.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const MAPS = ["ancient", "anubis", "cache", "dust2", "inferno", "mirage", "nuke", "overpass"];

const staging = JSON.parse(
  await readFile(join(repoRoot, "data/imports/staging/lineups-import.json"), "utf8")
);
const { resolveMustLearnCs2utilSlug } = await import(
  join(repoRoot, "data/mustLearnCs2utilSlugs.js")
);

function fmt(n) {
  return Number.isInteger(n) ? String(n) : Number(n.toFixed(3)).toString();
}

function replaceField(source, lineupId, field, newLiteral) {
  const blockHeader = new RegExp(`(\\n  ${lineupId}:\\s*{)`);
  const m = blockHeader.exec(source);
  if (!m) return null;
  const start = m.index + m[0].length;
  let depth = 1, i = start;
  while (i < source.length && depth > 0) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}") depth--;
    i++;
  }
  const end = i;
  const block = source.slice(start, end);
  const re = new RegExp(`(^|\\n)\\s{4}${field}:\\s*\\{[^}\\n]*\\}\\s*,?`);
  if (!re.test(block)) return null;
  const replaced = block.replace(re, (_w, lead) => `${lead}    ${field}: ${newLiteral},`);
  return source.slice(0, start) + replaced + source.slice(end);
}

let totalUpdated = 0;
let totalUnverified = 0;
const unverifiedByMap = {};

for (const mapId of MAPS) {
  const path = join(repoRoot, "data", `${mapId}.js`);
  let source = await readFile(path, "utf8");
  const mod = await import(path + `?cb=${Date.now()}`);
  const lineups = mod.LINEUPS || {};
  const stagingBySlug = new Map((staging.byMap[mapId] || []).map((e) => [e.slug, e]));

  let updated = 0;
  const unverified = [];

  for (const [id, lineup] of Object.entries(lineups)) {
    const slug = resolveMustLearnCs2utilSlug(mapId, id, lineup);
    const entry = slug ? stagingBySlug.get(slug) : null;
    if (!entry) {
      unverified.push(id);
      continue;
    }
    if (lineup.side && entry.team && lineup.side !== entry.team) {
      unverified.push(`${id} (side-mismatch ${lineup.side}/${entry.team})`);
      continue;
    }
    // Prefer exact world (setpos) coords; fall back to cs2util's 2D-map
    // percent if no world is recorded for that slug.
    let posLiteral = null;
    if (entry.throwFrom?.world) {
      const w = entry.throwFrom.world;
      posLiteral = `{ worldX: ${fmt(w.worldX)}, worldY: ${fmt(w.worldY)} }`;
    } else if (entry.throwFrom?.percent) {
      const p = entry.throwFrom.percent;
      posLiteral = `{ x: ${fmt(p.x)}, y: ${fmt(p.y)} }`;
    } else {
      unverified.push(`${id} (no coords in cs2util)`);
      continue;
    }
    const newSrc = replaceField(source, id, "radarPos", posLiteral);
    if (newSrc) {
      source = newSrc;
      updated++;
    }
    if (entry.landingAt?.percent) {
      const t = entry.landingAt.percent;
      const targetLiteral = `{ x: ${fmt(t.x)}, y: ${fmt(t.y)} }`;
      const tgtSrc = replaceField(source, id, "radarTarget", targetLiteral);
      if (tgtSrc) source = tgtSrc;
    }
  }

  await writeFile(path, source, "utf8");
  console.log(`${mapId.padEnd(9)}: applied exact setpos to ${updated} lineups, ${unverified.length} unverified`);
  totalUpdated += updated;
  totalUnverified += unverified.length;
  unverifiedByMap[mapId] = unverified;
}

console.log(`\nTotal: ${totalUpdated} updated, ${totalUnverified} unverified (no confirmed cs2util match)`);
console.log("\nUnverified lineups (need manual setpos verification):");
for (const [m, ids] of Object.entries(unverifiedByMap)) {
  if (ids.length === 0) continue;
  console.log(`  ${m}: ${ids.join(", ")}`);
}
