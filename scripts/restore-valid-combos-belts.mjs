#!/usr/bin/env node
/**
 * Restore COMBOS and UTILITY_BELTS from the pre-strict-mode commit
 * `c759c30`, but only the entries whose referenced lineup ids all
 * survive in the current cs2util-only data.
 *
 * No invention: a combo/belt that references any dropped lineup is
 * left dropped. (The user explicitly said "if you don't have data,
 * don't invent".)
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const PRE_FILTER_REF = "c759c30";
const MAPS = ["ancient", "anubis", "cache", "dust2", "inferno", "mirage", "nuke", "overpass"];

function readFromRef(ref, path) {
  try {
    return execSync(`git show ${ref}:${path}`, { cwd: repoRoot, encoding: "utf8" });
  } catch {
    return null;
  }
}

/** Extract `export const NAME = [ ... ];` literal block from source text. */
function extractExportArray(source, exportName) {
  const re = new RegExp(`(export const ${exportName} = \\[)([\\s\\S]*?)(\\];)`);
  const m = re.exec(source);
  return m ? { full: m[0], header: m[1], body: m[2], footer: m[3] } : null;
}

/** Split a JS object-array body into top-level `{...}` blocks. */
function splitTopLevelObjects(body) {
  const blocks = [];
  let depth = 0, start = -1;
  let inStr = false, strCh = "";
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (inStr) {
      if (c === strCh && body[i - 1] !== "\\") inStr = false;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { inStr = true; strCh = c; continue; }
    if (c === "{") { if (depth === 0) start = i; depth++; }
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        let j = i + 1;
        while (j < body.length && /[\s,]/.test(body[j])) j++;
        blocks.push({ text: body.slice(start, j), idStart: start, end: j });
      }
    }
  }
  return blocks;
}

/** Get the set of lineup ids referenced inside a combo/belt object literal. */
function lineupIdsInBlock(block) {
  const fromObj = [...block.matchAll(/lineup:\s*"([a-z0-9_]+)"/g)].map((m) => m[1]);
  // Also catch `lineups: ["id1", "id2"]` array-of-strings form (used in COMBOS).
  const inArrays = [];
  for (const m of block.matchAll(/lineups:\s*\[([^\]]*)\]/g)) {
    for (const sm of m[1].matchAll(/"([a-z0-9_]+)"/g)) inArrays.push(sm[1]);
  }
  return new Set([...fromObj, ...inArrays]);
}

function rebuildArrayExport(source, exportName, blocks, indent = "  ") {
  const extracted = extractExportArray(source, exportName);
  if (!extracted) {
    console.warn(`  ! ${exportName} not found in current source — skipping restore`);
    return source;
  }
  const newBody = blocks.length
    ? "\n" + blocks.map((b) => indent + b.text.trim()).join("\n" + indent) + "\n"
    : "";
  return source.replace(extracted.full, `${extracted.header}${newBody}${extracted.footer}`);
}

let totalRestored = { combos: 0, belts: 0 };
let totalDropped = { combos: 0, belts: 0 };

for (const mapId of MAPS) {
  console.log(`\n=== ${mapId} ===`);
  const dataPath = `data/${mapId}.js`;
  const baseline = readFromRef(PRE_FILTER_REF, dataPath);
  if (!baseline) {
    console.warn(`  ! no baseline at ${PRE_FILTER_REF} for ${dataPath} — skipping`);
    continue;
  }
  let current = await readFile(join(repoRoot, dataPath), "utf8");
  const mod = await import(join(repoRoot, dataPath) + `?cb=${Date.now()}`);
  const survivingIds = new Set(Object.keys(mod.LINEUPS || {}));

  // COMBOS
  {
    const oldExport = extractExportArray(baseline, "COMBOS");
    if (oldExport) {
      const blocks = splitTopLevelObjects(oldExport.body);
      const keep = [], drop = [];
      for (const b of blocks) {
        const refs = lineupIdsInBlock(b.text);
        const allSurvive = [...refs].every((id) => survivingIds.has(id));
        if (allSurvive) keep.push(b); else drop.push({ block: b, refs });
      }
      current = rebuildArrayExport(current, "COMBOS", keep);
      totalRestored.combos += keep.length;
      totalDropped.combos += drop.length;
      console.log(`  COMBOS: restored ${keep.length}, dropped ${drop.length}`);
      for (const d of drop) {
        const id = d.block.text.match(/id:\s*"([^"]+)"/)?.[1] ?? "?";
        const missing = [...d.refs].filter((r) => !survivingIds.has(r));
        console.log(`    · drop ${id} (missing: ${missing.join(", ")})`);
      }
    }
  }

  // UTILITY_BELTS
  {
    const oldExport = extractExportArray(baseline, "UTILITY_BELTS");
    if (oldExport) {
      const blocks = splitTopLevelObjects(oldExport.body);
      const keep = [], drop = [];
      for (const b of blocks) {
        const refs = lineupIdsInBlock(b.text);
        const allSurvive = [...refs].every((id) => survivingIds.has(id));
        if (allSurvive) keep.push(b); else drop.push({ block: b, refs });
      }
      current = rebuildArrayExport(current, "UTILITY_BELTS", keep);
      totalRestored.belts += keep.length;
      totalDropped.belts += drop.length;
      console.log(`  UTILITY_BELTS: restored ${keep.length}, dropped ${drop.length}`);
      for (const d of drop) {
        const id = d.block.text.match(/id:\s*"([^"]+)"/)?.[1] ?? "?";
        const missing = [...d.refs].filter((r) => !survivingIds.has(r));
        console.log(`    · drop ${id} (missing: ${missing.join(", ")})`);
      }
    }
  }

  await writeFile(join(repoRoot, dataPath), current, "utf8");
}

console.log(`\nTotal restored: combos=${totalRestored.combos}, belts=${totalRestored.belts}`);
console.log(`Total dropped (referenced removed lineups): combos=${totalDropped.combos}, belts=${totalDropped.belts}`);
