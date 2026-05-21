#!/usr/bin/env node
/**
 * Cross-reference every app lineup against the cs2util staging data
 * and emit a per-lineup report with the top candidates (by side + name
 * + landing-area keyword match). Goal: identify the EXACT cs2util
 * lineup each app lineup corresponds to so we can pull its setpos.
 *
 * Output is JSON to stdout. Each app lineup gets:
 *   - current radarPos / radarTarget
 *   - currently resolved slug (via screenshots URL or manual override)
 *   - top 5 candidate cs2util entries ranked by a composite score
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
const radarMeta = JSON.parse(
  await readFile(join(repoRoot, "tests/fixtures/demoinfocsRadarMetadata.json"), "utf8")
).maps;
radarMeta.cache ??= { pos_x: -2000, pos_y: 3250, scale: 5.5 };
const { resolveMustLearnCs2utilSlug } = await import(join(repoRoot, "data/mustLearnCs2utilSlugs.js"));

function tok(s) {
  return new Set(
    String(s ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9 ]+/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 1)
  );
}

function jaccard(a, b) {
  const inter = new Set([...a].filter((x) => b.has(x)));
  const union = new Set([...a, ...b]);
  return union.size === 0 ? 0 : inter.size / union.size;
}

function worldToPct(p, meta) {
  if (!p || !("worldX" in p)) return null;
  const total = meta.scale * (meta.sourceResolution ?? 1024);
  return {
    x: ((p.worldX - meta.pos_x) / total) * 100,
    y: ((p.worldY - meta.pos_y) / -total) * 100,
  };
}

function resolveAppPct(p, meta) {
  if (!p) return null;
  if ("worldX" in p) return worldToPct(p, meta);
  return { x: p.x, y: p.y };
}

const out = {};
for (const mapId of MAPS) {
  const mod = await import(join(repoRoot, "data", `${mapId}.js`));
  const lineups = mod.LINEUPS || {};
  const meta = radarMeta[mapId];
  const stagingArr = staging.byMap[mapId] || [];

  out[mapId] = {};
  for (const [id, lineup] of Object.entries(lineups)) {
    const existingSlug = resolveMustLearnCs2utilSlug(mapId, id, lineup);
    const existingEntry = stagingArr.find((e) => e.slug === existingSlug);
    const appPct = resolveAppPct(lineup.radarPos, meta);

    // Build a "query bag" from the lineup name + description + stand + aim.
    const queryTokens = new Set([
      ...tok(lineup.name),
      ...tok(lineup.purpose),
      ...tok(lineup.stand),
      ...tok(lineup.aim),
      ...tok(lineup.area),
    ]);

    const candidates = stagingArr
      .map((e) => {
        // Side match is strong signal
        const sideOk = !lineup.side || !e.team || lineup.side === e.team;
        if (!sideOk) return null;
        const slugTokens = tok(e.slug);
        const titleTokens = tok(e.title);
        const fromTokens = tok(e.from);
        const toTokens = tok(e.to);
        const allTokens = new Set([...slugTokens, ...titleTokens, ...fromTokens, ...toTokens]);
        const nameScore = jaccard(queryTokens, allTokens);
        // Distance score: closer in pct space = better
        const ePct = e.throwFrom?.percent;
        let distScore = 0;
        if (appPct && ePct) {
          const d = Math.hypot(appPct.x - ePct.x, appPct.y - ePct.y);
          distScore = Math.max(0, 1 - d / 30); // within 30% gets some credit
        }
        // Composite
        const score = nameScore * 2 + distScore;
        return { slug: e.slug, title: e.title, team: e.team, from: e.from, to: e.to,
                 throwWorld: e.throwFrom?.world, throwPct: ePct, landing: e.landingAt?.percent,
                 posCommand: e.posCommand, nameScore, distScore, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    out[mapId][id] = {
      name: lineup.name,
      side: lineup.side,
      area: lineup.area,
      mustLearn: !!lineup.mustLearn,
      currentPos: lineup.radarPos,
      currentTarget: lineup.radarTarget,
      currentPct: appPct ? { x: +appPct.x.toFixed(2), y: +appPct.y.toFixed(2) } : null,
      existingSlug,
      existingMatched: !!existingEntry,
      candidates,
    };
  }
}

console.log(JSON.stringify(out, null, 2));
