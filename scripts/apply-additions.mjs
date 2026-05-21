#!/usr/bin/env node
/**
 * Apply lineup additions from `data/lineup-additions.json` into the
 * corresponding `data/<map>.js` file.
 *
 * Validates each entry against the schema (required fields, coord
 * shape). Refuses to add a lineup with missing throwPos OR landingPos
 * — no inventing coordinates.
 *
 * Idempotent: if a lineup id already exists in the target data file,
 * it is updated in place. New entries are appended at the end of the
 * LINEUPS object (just before the closing `};`).
 *
 * Run:
 *   node scripts/apply-additions.mjs
 *   node scripts/apply-additions.mjs --dry-run
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const ADDITIONS_PATH = join(repoRoot, "data/lineup-additions.json");
const dryRun = process.argv.includes("--dry-run");

const additions = JSON.parse(await readFile(ADDITIONS_PATH, "utf8"));
const { RADAR_METADATA } = await import(join(repoRoot, "data/radarMetadata.js"));

function fmt(n) { return Number.isInteger(n) ? String(n) : Number(n.toFixed(3)).toString(); }

/** Validate one lineup row. Returns array of errors (empty = valid). */
function validate(row) {
  const errs = [];
  const need = ["id", "map", "name", "util", "side", "area", "throwPos", "landingPos", "throw", "source"];
  for (const k of need) if (row[k] === undefined || row[k] === null || row[k] === "") errs.push(`missing ${k}`);
  if (row.id && !/^[a-z][a-z0-9_]*$/.test(row.id)) errs.push(`id "${row.id}" must be snake_case`);
  if (row.util && !["SMOKE", "FLASH", "MOLLY", "HE"].includes(row.util)) errs.push(`util "${row.util}" invalid`);
  if (row.side && !["T", "CT"].includes(row.side)) errs.push(`side "${row.side}" invalid`);
  if (row.throw && !["LMB", "JT", "WJT", "RMB", "RUN", "WALK2"].includes(row.throw)) errs.push(`throw "${row.throw}" invalid`);
  if (row.map && !RADAR_METADATA[row.map]) errs.push(`map "${row.map}" has no radar metadata`);
  for (const k of ["throwPos", "landingPos"]) {
    const p = row[k];
    if (Array.isArray(p)) {
      if (p.length < 2 || p.some((n) => !Number.isFinite(n))) errs.push(`${k} array must be [x, y[, z]]`);
    } else if (p && typeof p === "object") {
      if (p.source !== "percent") errs.push(`${k} object form must be {source:"percent", x, y}`);
      if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) errs.push(`${k} x/y must be numbers`);
    } else if (p !== undefined) {
      errs.push(`${k} must be array or {source,x,y} object`);
    }
  }
  if (!row.source?.name || !row.source?.url) errs.push("source.name and source.url required");
  return errs;
}

function posToCoordLiteral(pos) {
  if (Array.isArray(pos)) {
    return `{ worldX: ${fmt(pos[0])}, worldY: ${fmt(pos[1])} }`;
  }
  if (pos?.source === "percent") {
    return `{ x: ${fmt(pos.x)}, y: ${fmt(pos.y)} }`;
  }
  return null;
}

/** Render a JS object literal for the lineup that matches data/<map>.js style. */
function renderLineupLiteral(row) {
  const out = [];
  out.push(`  ${row.id}: {`);
  out.push(`    id: "${row.id}",`);
  out.push(`    name: ${JSON.stringify(row.name)},`);
  out.push(`    util: "${row.util}",`);
  out.push(`    throw: "${row.throw}",`);
  out.push(`    side: "${row.side}",`);
  out.push(`    area: ${JSON.stringify(row.area)},`);
  if (row.mustLearn) out.push(`    mustLearn: true,`);
  if (row.instant) out.push(`    instant: true,`);
  if (row.purpose) out.push(`    purpose: ${JSON.stringify(row.purpose)},`);
  if (row.stand) out.push(`    stand: ${JSON.stringify(row.stand)},`);
  if (row.aim) out.push(`    aim: ${JSON.stringify(row.aim)},`);
  if (row.notes) out.push(`    notes: ${JSON.stringify(row.notes)},`);
  out.push(`    source: { name: ${JSON.stringify(row.source.name)}, url: ${JSON.stringify(row.source.url)} },`);
  if (row.video) out.push(`    video: ${JSON.stringify(row.video)},`);
  if (row.screenshots) {
    out.push(`    screenshots: {`);
    if (row.screenshots.stand) out.push(`      stand: ${JSON.stringify(row.screenshots.stand)},`);
    if (row.screenshots.aim) out.push(`      aim: ${JSON.stringify(row.screenshots.aim)},`);
    if (row.screenshots.result) out.push(`      result: ${JSON.stringify(row.screenshots.result)},`);
    out.push(`    },`);
  }
  out.push(`    radarPos: ${posToCoordLiteral(row.throwPos)},`);
  out.push(`    radarTarget: ${posToCoordLiteral(row.landingPos)},`);
  out.push(`    austincs: { video: "", timestamp: "", note: "" },`);
  out.push(`  },`);
  return out.join("\n");
}

/** Insert / replace a lineup block inside the LINEUPS export. */
function applyToSource(source, row) {
  const literal = renderLineupLiteral(row);
  const existing = new RegExp(`(\\n  ${row.id}:\\s*{[\\s\\S]*?\\n  },)`, "m");
  if (existing.test(source)) {
    return source.replace(existing, `\n${literal}`);
  }
  // Append before the closing `};` of LINEUPS
  const lineupsEnd = /(export const LINEUPS = \{[\s\S]*?\n)\};/m;
  return source.replace(lineupsEnd, `$1${literal}\n};`);
}

const byMap = {};
let invalid = 0;
for (const row of additions.lineups || []) {
  const errs = validate(row);
  if (errs.length) {
    invalid++;
    console.error(`✗ ${row.id ?? "(no id)"} on ${row.map ?? "?"}: ${errs.join("; ")}`);
    continue;
  }
  (byMap[row.map] ??= []).push(row);
}

if (invalid > 0) {
  console.error(`\n${invalid} invalid lineup(s) — refusing to apply any of them.`);
  console.error("Fix the errors above and re-run.");
  process.exit(1);
}

let totalApplied = 0;
for (const [mapId, rows] of Object.entries(byMap)) {
  const path = join(repoRoot, "data", `${mapId}.js`);
  let source = await readFile(path, "utf8");
  for (const row of rows) {
    source = applyToSource(source, row);
    totalApplied++;
  }
  if (!dryRun) await writeFile(path, source, "utf8");
  console.log(`${mapId}: ${rows.length} lineup(s) ${dryRun ? "(dry-run)" : "applied"}`);
}

if (totalApplied === 0) {
  console.log("No additions to apply. Edit data/lineup-additions.json then re-run.");
} else {
  console.log(`\nTotal: ${totalApplied} lineup(s) ${dryRun ? "(dry-run, no files written)" : "applied"}`);
}
