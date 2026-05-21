#!/usr/bin/env node
/**
 * Scrape csnades.gg "Solo Combinations" — 1-player utility belts
 * where one player throws multiple nades from a single standing
 * position.
 *
 * For each combination we:
 *   1. Fetch /<map>/combinations index page → list of combo slugs
 *   2. Fetch each combo page → name + component nade slugs (csnades-style)
 *   3. Match each component slug to a cs2util slug in our staging data
 *      (fuzzy token overlap). cs2util has the verified setpos.
 *   4. Print a JSON report with a UTILITY_BELTS-ready structure
 *
 * Run:
 *   node scripts/scrape-csnades-combinations.mjs > /tmp/csnades-belts.json
 *   # Review the JSON, then hand-merge into the appropriate data/<map>.js
 *
 * Refuses to invent: if a component nade has no confident cs2util
 * match (score < threshold) it's flagged for manual review, not
 * silently mapped to a similar-sounding one.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const MAPS = ["ancient", "anubis", "cache", "dust2", "inferno", "mirage", "nuke", "overpass"];
const MATCH_THRESHOLD = 0.55;

const staging = JSON.parse(
  await readFile(join(repoRoot, "data/imports/staging/lineups-import.json"), "utf8")
);

function tokens(slug) {
  return new Set(
    String(slug ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 1)
      // Drop stopword-ish tokens that don't help discriminate
      .filter((t) => !["smoke", "smokes", "flash", "flashes", "molotov", "mol", "from", "the", "in", "to"].includes(t))
  );
}

function jaccard(a, b) {
  const inter = new Set([...a].filter((x) => b.has(x)));
  const union = new Set([...a, ...b]);
  return union.size ? inter.size / union.size : 0;
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.text();
}

function extractComboSlugs(html, mapId) {
  const re = new RegExp(`/${mapId}/combinations/([a-z0-9-]+)`, "g");
  return [...new Set([...html.matchAll(re)].map((m) => m[1]))];
}

function extractComponentLineupSlugs(html, mapId) {
  // csnades uses /<map>/(smokes|molotovs|flashbangs|he-grenades)/<slug>
  const re = new RegExp(`/${mapId}/(smokes|molotovs|flashbangs|he-grenades)/([a-z0-9-]+)`, "g");
  const out = [];
  const seen = new Set();
  for (const m of html.matchAll(re)) {
    const key = `${m[1]}/${m[2]}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const utilKind = { smokes: "SMOKE", molotovs: "MOLLY", flashbangs: "FLASH", "he-grenades": "HE" }[m[1]];
    out.push({ csnadesSlug: m[2], util: utilKind });
  }
  return out;
}

function extractComboName(html) {
  const t = html.match(/<title>([^<]+)<\/title>/);
  if (!t) return null;
  // "<Map> <Combo Name> Solo Combination - CSNADES.gg ..."
  const m = t[1].match(/(?:Dust\s*2|Mirage|Inferno|Nuke|Ancient|Anubis|Overpass|Cache)\s+([\s\S]+?)\s+Solo Combination/i);
  return m ? m[1].trim() : t[1];
}

function findCs2utilMatch(stagingArr, csnadesSlug, util) {
  const ct = tokens(csnadesSlug);
  let best = null;
  for (const e of stagingArr) {
    if (!e.throwFrom?.world) continue;
    if (util && e.grenadeType !== util) continue;
    const score = jaccard(ct, tokens(e.slug));
    if (!best || score > best.score) best = { entry: e, score };
  }
  return best;
}

const report = { byMap: {} };

for (const mapId of MAPS) {
  console.error(`Fetching csnades.gg combinations for ${mapId}...`);
  const stagingArr = staging.byMap[mapId] || [];
  let indexHtml;
  try {
    indexHtml = await fetchText(`https://csnades.gg/${mapId}/combinations`);
  } catch (e) {
    console.error(`  ! index failed: ${e.message}`);
    report.byMap[mapId] = { error: e.message, combos: [] };
    continue;
  }
  const comboSlugs = extractComboSlugs(indexHtml, mapId);
  console.error(`  found ${comboSlugs.length} combo(s)`);

  const combos = [];
  for (const comboSlug of comboSlugs) {
    try {
      const page = await fetchText(`https://csnades.gg/${mapId}/combinations/${comboSlug}`);
      const name = extractComboName(page);
      const components = extractComponentLineupSlugs(page, mapId);
      const matched = [];
      const unmatched = [];
      for (const c of components) {
        const m = findCs2utilMatch(stagingArr, c.csnadesSlug, c.util);
        if (m && m.score >= MATCH_THRESHOLD) {
          matched.push({
            csnadesSlug: c.csnadesSlug,
            util: c.util,
            cs2utilSlug: m.entry.slug,
            score: +m.score.toFixed(2),
            throwWorld: m.entry.throwFrom?.world,
            team: m.entry.team,
          });
        } else {
          unmatched.push({
            csnadesSlug: c.csnadesSlug,
            util: c.util,
            bestCandidate: m ? { slug: m.entry.slug, score: +m.score.toFixed(2) } : null,
          });
        }
      }
      combos.push({
        comboSlug, name, csnadesUrl: `https://csnades.gg/${mapId}/combinations/${comboSlug}`,
        matched, unmatched, fullyMatched: unmatched.length === 0 && matched.length >= 2,
      });
    } catch (e) {
      console.error(`  ! ${comboSlug} failed: ${e.message}`);
    }
    // Politeness: 250ms between requests
    await new Promise((r) => setTimeout(r, 250));
  }
  report.byMap[mapId] = { count: combos.length, combos };
}

console.log(JSON.stringify(report, null, 2));
