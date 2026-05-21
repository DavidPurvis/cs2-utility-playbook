#!/usr/bin/env node
/**
 * Some lineups in `data/<map>.js` were given world coords from a
 * cs2util entry whose `team` doesn't match the lineup's `side`. This
 * happened because the lineup's screenshot URL (which the slug helper
 * parses) points to a different cs2util lineup. The migrated world
 * coords therefore place the dot at the wrong throw position.
 *
 * This script reverts those lineups' `radarPos` to their hand-tuned
 * pre-migration `{x, y}` value pulled from git history. We use the
 * pre-PR#10 commit (`c2bcc50`) as the baseline.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const BASELINE_REF = "c2bcc50";  // last commit before the coord migration started

const MAPS = ["ancient", "anubis", "cache", "dust2", "inferno", "mirage", "nuke", "overpass"];

const staging = JSON.parse(
  await readFile(join(repoRoot, "data/imports/staging/lineups-import.json"), "utf8")
);
const { resolveMustLearnCs2utilSlug } = await import(join(repoRoot, "data/mustLearnCs2utilSlugs.js"));

function fmtNumber(n) {
  return Number.isInteger(n) ? String(n) : Number(n.toFixed(3)).toString();
}

function readFromBaseline(path) {
  try {
    return execSync(`git show ${BASELINE_REF}:${path}`, { cwd: repoRoot, encoding: "utf8" });
  } catch {
    return null;
  }
}

/** Extract `radarPos: {...}` value from a lineup block in source text. */
function extractRadarPos(source, lineupId) {
  const blockHeader = new RegExp(`\\n  ${lineupId}:\\s*{`);
  const m = blockHeader.exec(source);
  if (!m) return null;
  const start = m.index + m[0].length;
  let depth = 1, i = start;
  while (i < source.length && depth > 0) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}") depth--;
    i++;
  }
  const block = source.slice(start, i);
  const fm = /^\s{4}radarPos:\s*(\{[^}\n]*\})/m.exec(block);
  return fm ? fm[1] : null;
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

let totalReverted = 0;
for (const mapId of MAPS) {
  const dataPath = join(repoRoot, "data", `${mapId}.js`);
  const current = await readFile(dataPath, "utf8");
  const baseline = readFromBaseline(`data/${mapId}.js`);
  if (!baseline) {
    console.log(`${mapId}: baseline not available; skipping`);
    continue;
  }
  const mod = await import(dataPath + `?cb=${Date.now()}`);
  const lineups = mod.LINEUPS || {};
  const stagingBySlug = new Map((staging.byMap[mapId] || []).map((e) => [e.slug, e]));

  let next = current;
  let revertedHere = 0;
  for (const [id, lineup] of Object.entries(lineups)) {
    // Only consider currently-world-coord lineups (the only ones we might
    // have migrated to a wrong value).
    if (!lineup?.radarPos || !("worldX" in lineup.radarPos)) continue;
    const slug = resolveMustLearnCs2utilSlug(mapId, id, lineup);
    const entry = slug ? stagingBySlug.get(slug) : null;
    if (!entry) continue;
    // If the cs2util team doesn't match the lineup's side, the slug match
    // is wrong — but the previous migration applied it anyway.
    if (!lineup.side || !entry.team || lineup.side === entry.team) continue;

    const baselineLiteral = extractRadarPos(baseline, id);
    if (!baselineLiteral) {
      console.log(`  ! ${mapId}/${id}: no baseline radarPos to revert to`);
      continue;
    }
    const out = replaceField(next, id, "radarPos", baselineLiteral);
    if (out) {
      next = out;
      revertedHere++;
      console.log(`  ↩ ${mapId}/${id}: cs2util team=${entry.team} != side=${lineup.side}; reverted to ${baselineLiteral}`);
    }
  }
  if (next !== current) {
    await writeFile(dataPath, next, "utf8");
  }
  console.log(`${mapId}: ${revertedHere} side-mismatched lineups reverted to baseline`);
  totalReverted += revertedHere;
}

console.log(`\nTotal reverted: ${totalReverted}`);
