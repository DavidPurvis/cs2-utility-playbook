#!/usr/bin/env node
/**
 * Suggest cs2util staging matches for lineups whose URL-derived slug
 * doesn't exist verbatim in `lineups-import.json`. Uses simple
 * tokenization + Jaccard similarity, ignoring small differences like
 * URL-encoded ampersands, trailing digits, and "from-X" reordering.
 *
 * Output: per-lineup top-3 candidates with similarity score. We don't
 * auto-apply — the user (or a maintainer) decides which suggestion to
 * pin via `data/mustLearnCs2utilSlugs.js`.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

const MAPS = ["ancient", "anubis", "cache", "dust2", "inferno", "mirage", "nuke", "overpass"];
const staging = JSON.parse(
  await readFile(join(repoRoot, "data/imports/staging/lineups-import.json"), "utf8")
);
const { resolveMustLearnCs2utilSlug } = await import(join(repoRoot, "data/mustLearnCs2utilSlugs.js"));

function tokens(slug) {
  return new Set(
    decodeURIComponent(slug ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9 ]+/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .filter((t) => t.length > 1)
  );
}

function jaccard(a, b) {
  const inter = new Set([...a].filter((x) => b.has(x)));
  const union = new Set([...a, ...b]);
  return union.size === 0 ? 0 : inter.size / union.size;
}

for (const map of MAPS) {
  const mod = await import(join(repoRoot, "data", `${map}.js`));
  const lineups = mod.LINEUPS || {};
  const stagingArr = staging.byMap[map] || [];
  const stagingSlugs = new Set(stagingArr.map((e) => e.slug));
  const suggestions = [];
  for (const [id, lineup] of Object.entries(lineups)) {
    const slug = resolveMustLearnCs2utilSlug(map, id, lineup);
    if (slug && stagingSlugs.has(slug)) continue;
    // Try to find candidates
    const targetTokens = tokens(slug ?? id);
    const scored = stagingArr
      .map((e) => ({ slug: e.slug, score: jaccard(targetTokens, tokens(e.slug)), entry: e }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .filter((c) => c.score > 0.25);
    if (scored.length === 0) continue;
    suggestions.push({ id, slug, candidates: scored });
  }
  if (suggestions.length === 0) {
    console.log(`${map}: no fuzzy candidates`);
    continue;
  }
  console.log(`\n=== ${map} ===`);
  for (const { id, slug, candidates } of suggestions) {
    console.log(`  ${id}  (raw slug: ${slug ?? "?"})`);
    for (const c of candidates) {
      const hasWorld = c.entry.throwFrom?.world ? "W" : "_";
      const hasLand = c.entry.landingAt?.percent ? "L" : "_";
      console.log(`    [${hasWorld}${hasLand}] ${c.score.toFixed(2)}  ${c.slug}`);
    }
  }
}
