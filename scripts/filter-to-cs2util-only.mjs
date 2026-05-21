#!/usr/bin/env node
/**
 * Strict accuracy: keep ONLY lineups that have a verified cs2util
 * setpos (`throwFrom.world`). Drop everything else.
 *
 * Also drops any COMBOS / UTILITY_BELTS / SETUP_POSITIONS that
 * reference dropped lineups — partial pruning would leave broken
 * empty entries. Better to delete the whole combo than to leave a
 * half-broken one.
 *
 * Updates MUST_LEARN to only include surviving lineups.
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

function fmt(n) { return Number.isInteger(n) ? String(n) : Number(n.toFixed(3)).toString(); }

/** Find object-literal boundaries inside an array body that starts at start. */
function findObjectBlocks(arrayBody) {
  const blocks = [];
  let depth = 0, blockStart = -1;
  let inString = false, strCh = "";
  for (let i = 0; i < arrayBody.length; i++) {
    const c = arrayBody[i];
    if (inString) {
      if (c === strCh && arrayBody[i - 1] !== "\\") inString = false;
      continue;
    }
    if (c === '"' || c === "'") { inString = true; strCh = c; continue; }
    if (c === "{") {
      if (depth === 0) blockStart = i;
      depth++;
    } else if (c === "}") {
      depth--;
      if (depth === 0) {
        // Consume trailing comma + whitespace
        let j = i + 1;
        while (j < arrayBody.length && /[\s,]/.test(arrayBody[j])) j++;
        blocks.push({ start: blockStart, end: j, text: arrayBody.slice(blockStart, j) });
      }
    }
  }
  return blocks;
}

/** Rewrite an array literal export by filtering object entries. */
function filterArrayExport(source, exportName, keepFn) {
  const headerRe = new RegExp(`(export const ${exportName} = \\[)([\\s\\S]*?)(\\];)`);
  const m = headerRe.exec(source);
  if (!m) return source;
  const arrayBody = m[2];
  const blocks = findObjectBlocks(arrayBody);
  if (blocks.length === 0) return source;
  // Find prefix (before first block — usually a comment) and suffix (after last block)
  const prefix = arrayBody.slice(0, blocks[0].start);
  const suffix = arrayBody.slice(blocks[blocks.length - 1].end);
  const kept = blocks.filter((b) => keepFn(b.text)).map((b) => b.text);
  // Preserve trailing comma between entries already present in b.text
  const newBody = prefix + kept.join("\n  ") + suffix;
  return source.replace(headerRe, `$1${newBody}$3`);
}

function rebuildStringArray(source, exportName, surviving) {
  const headerRe = new RegExp(`(export const ${exportName} = )\\[([\\s\\S]*?)\\];`);
  const m = headerRe.exec(source);
  if (!m) return source;
  const body = m[2];
  const lines = body.split("\n").map((l) => {
    const id = l.match(/"([a-z0-9_]+)"/)?.[1];
    if (!id) return { line: l, id: null };
    return { line: l, id };
  });
  const kept = lines.filter((l) => l.id == null || surviving.has(l.id));
  const newBody = kept.map((l) => l.line).join("\n");
  return source.replace(headerRe, `$1[${newBody}];`);
}

function replaceField(source, lineupId, field, newLiteral) {
  const blockHeader = new RegExp(`(\\n  ${lineupId}:\\s*{)`);
  const m = blockHeader.exec(source);
  if (!m) return source;
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
  if (!re.test(block)) return source;
  const replaced = block.replace(re, (_w, lead) => `${lead}    ${field}: ${newLiteral},`);
  return source.slice(0, start) + replaced + source.slice(end);
}

const summary = {};
let totalKept = 0, totalDropped = 0;

for (const mapId of MAPS) {
  const dataPath = join(repoRoot, "data", `${mapId}.js`);
  let source = await readFile(dataPath, "utf8");
  const mod = await import(dataPath + `?cb=${Date.now()}`);
  const lineups = mod.LINEUPS || {};
  const stagingBySlug = new Map((staging.byMap[mapId] || []).map((e) => [e.slug, e]));

  const surviving = new Set();
  const droppedIds = [];

  for (const [id, lineup] of Object.entries(lineups)) {
    const slug = resolveMustLearnCs2utilSlug(mapId, id, lineup);
    const entry = slug ? stagingBySlug.get(slug) : null;
    const sideOk = entry && (!lineup.side || !entry.team || lineup.side === entry.team);
    const hasSetpos = entry?.throwFrom?.world?.worldX != null;
    if (entry && sideOk && hasSetpos) {
      surviving.add(id);
      const w = entry.throwFrom.world;
      source = replaceField(source, id, "radarPos",
        `{ worldX: ${fmt(w.worldX)}, worldY: ${fmt(w.worldY)} }`);
      if (entry.landingAt?.percent) {
        const t = entry.landingAt.percent;
        source = replaceField(source, id, "radarTarget",
          `{ x: ${fmt(t.x)}, y: ${fmt(t.y)} }`);
      }
    } else {
      droppedIds.push(id);
    }
  }

  // Remove dropped LINEUPS blocks
  for (const id of droppedIds) {
    const blockRe = new RegExp(`(\\n  // [^\\n]*\\n)*\\n  ${id}:\\s*{[\\s\\S]*?\\n  },`, "m");
    source = source.replace(blockRe, "");
  }

  // Update MUST_LEARN list (string array)
  source = rebuildStringArray(source, "MUST_LEARN", surviving);

  // Drop COMBOS that reference any dropped lineup
  source = filterArrayExport(source, "COMBOS", (block) => {
    const refs = [...block.matchAll(/lineup:\s*"([a-z0-9_]+)"/g)].map((m) => m[1]);
    const stringRefs = [...block.matchAll(/^\s*"([a-z0-9_]+)"\s*,?$/gm)].map((m) => m[1]);
    const all = [...refs, ...stringRefs];
    return all.every((id) => surviving.has(id));
  });

  // Drop UTILITY_BELTS that reference any dropped lineup
  source = filterArrayExport(source, "UTILITY_BELTS", (block) => {
    const refs = [...block.matchAll(/lineup:\s*"([a-z0-9_]+)"/g)].map((m) => m[1]);
    return refs.every((id) => surviving.has(id));
  });

  // Drop SETUP_POSITIONS that reference any dropped lineup
  source = filterArrayExport(source, "SETUP_POSITIONS", (block) => {
    const refs = [...block.matchAll(/"([a-z0-9_]+)"/g)]
      .map((m) => m[1])
      // Filter out non-lineup string literals (side codes etc.)
      .filter((s) => s.length > 2 && !["T", "CT"].includes(s));
    const knownLineups = refs.filter((id) => surviving.has(id) || lineups[id]);
    // Keep setup if every referenced lineup id is in surviving set
    const allRefs = [...block.matchAll(/lineups:\s*\[([^\]]*)\]/g)]
      .flatMap((m) => [...m[1].matchAll(/"([a-z0-9_]+)"/g)].map((m2) => m2[1]));
    if (allRefs.length === 0) return true;
    return allRefs.every((id) => surviving.has(id));
  });

  // Prune SPAWNS lineup references
  source = source.replace(/lineups:\s*\[([^\]]*)\]/g, (whole, inner) => {
    const ids = [...inner.matchAll(/"([a-z0-9_]+)"/g)].map((m) => m[1]);
    const kept = ids.filter((id) => surviving.has(id));
    if (kept.length === ids.length) return whole;
    return `lineups: [${kept.map((i) => `"${i}"`).join(", ")}]`;
  });

  await writeFile(dataPath, source, "utf8");
  summary[mapId] = { kept: surviving.size, dropped: droppedIds.length };
  totalKept += surviving.size;
  totalDropped += droppedIds.length;
  console.log(`${mapId.padEnd(9)}: kept ${surviving.size} lineups, dropped ${droppedIds.length}`);
}

console.log(`\nTotal: ${totalKept} lineups kept (out of ${totalKept + totalDropped})`);
