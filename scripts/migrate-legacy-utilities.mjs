#!/usr/bin/env node
/**
 * One-shot: read the 10 cs2util-verified Dust 2 lineups from
 * data/dust2.js::LINEUPS and emit src/data/maps/dust2/utilities.json
 * in the new schema.
 *
 * Run once during Phase 2 then delete data/dust2.js.
 *
 *   node scripts/migrate-legacy-utilities.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const OUT = join(repoRoot, "src/data/maps/dust2/utilities.json");

const mod = await import(join(repoRoot, "data/dust2.js"));
const LINEUPS = mod.LINEUPS ?? {};

const THROW_MAP = {
  LMB: "normal",
  JT: "jump",
  WJT: "jump+run",
  RMB: "normal",
  RUN: "run",
  WALK2: "jump",
};

const UTIL_MAP = {
  SMOKE: "smoke",
  FLASH: "flash",
  MOLLY: "molotov",
  HE: "he",
};

function toIdSnake(legacyId) {
  return legacyId.replace(/-/g, "_");
}

function pickLanding(radarTarget) {
  if (!radarTarget) return undefined;
  if ("worldX" in radarTarget) {
    return { world: { x: radarTarget.worldX, y: radarTarget.worldY } };
  }
  if ("x" in radarTarget) {
    return { percent: { x: radarTarget.x, y: radarTarget.y } };
  }
  return undefined;
}

function migrate(legacy) {
  const id = toIdSnake(legacy.id);
  const type = UTIL_MAP[legacy.util] ?? "smoke";
  const throwStyle = THROW_MAP[legacy.throw] ?? "normal";

  if (!legacy.radarPos || !("worldX" in legacy.radarPos)) {
    // Strict mode: refuse to migrate anything without verified setpos.
    return null;
  }

  const landing = pickLanding(legacy.radarTarget);
  if (!landing) return null;

  return {
    id,
    name: legacy.name,
    type,
    side: legacy.side,
    area: legacy.area,
    throwFrom: {
      world: { x: legacy.radarPos.worldX, y: legacy.radarPos.worldY },
    },
    landingAt: landing,
    throwStyle,
    movement: throwStyle === "run" || throwStyle === "jump+run" ? "running" : "standing",
    difficulty: "medium",
    description: [legacy.purpose, legacy.stand, legacy.aim, legacy.notes]
      .filter(Boolean)
      .join("\n\n") || undefined,
    screenshots: legacy.screenshots
      ? {
          stand: legacy.screenshots.stand || undefined,
          aim: legacy.screenshots.aim || undefined,
          result: legacy.screenshots.result || undefined,
        }
      : undefined,
    source: legacy.source ? { name: legacy.source.name, url: legacy.source.url } : undefined,
  };
}

const out = [];
const skipped = [];
for (const legacy of Object.values(LINEUPS)) {
  const m = migrate(legacy);
  if (m) out.push(m);
  else skipped.push(legacy.id);
}

await writeFile(OUT, JSON.stringify(out, null, 2) + "\n", "utf8");

console.log(`Wrote ${out.length} utilities to ${OUT}`);
if (skipped.length) {
  console.log(`Skipped ${skipped.length} legacy entries without verified setpos:`);
  for (const id of skipped) console.log(`  · ${id}`);
}
