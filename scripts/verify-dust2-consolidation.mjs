#!/usr/bin/env node
/**
 * Phase 1 gate (TKT-002).
 *
 * Reads the four legacy JSON files under src/data/maps/dust2/ and the
 * new consolidated src/data/dust2.json, then asserts value equality on
 * every nested field (with the v6 renames applied):
 *
 *   utilities  →  lineups
 *   screenshots.stand  →  screenshots.position
 *
 * Also verifies every consolidated lineup has either landingAt.world or
 * landingAt.percent (boot validator depends on this).
 *
 * Exit 0 = consolidation is byte-for-byte safe (modulo intentional
 * renames). Exit 1 = drift, do NOT proceed to Phase 2.
 *
 * Run: node scripts/verify-dust2-consolidation.mjs
 */

import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = dirname(__dirname);

const legacyDir = join(repoRoot, "src/data/maps/dust2");
const newFile = join(repoRoot, "src/data/dust2.json");

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function fail(msg) {
  console.error(`\n  ✘ ${msg}\n`);
  process.exit(1);
}

// ── presence checks ──────────────────────────────────────────────
if (!existsSync(legacyDir)) fail(`legacy dir missing: ${legacyDir}`);
if (!existsSync(newFile)) fail(`new file missing: ${newFile}`);

const legacyConfig    = readJson(join(legacyDir, "map-config.json"));
const legacySpawns    = readJson(join(legacyDir, "spawns.json"));
const legacyUtilities = readJson(join(legacyDir, "utilities.json"));
const consolidated    = readJson(newFile);

// ── shape ────────────────────────────────────────────────────────
assert.equal(typeof consolidated, "object", "dust2.json: must be object");
for (const key of ["config", "spawns", "lineups", "scenarios"]) {
  assert.ok(key in consolidated, `dust2.json: missing top-level "${key}"`);
}
assert.ok(Array.isArray(consolidated.spawns),    "spawns must be array");
assert.ok(Array.isArray(consolidated.lineups),   "lineups must be array");
assert.ok(Array.isArray(consolidated.scenarios), "scenarios must be array");

// ── config: exact equality ───────────────────────────────────────
assert.deepStrictEqual(
  consolidated.config,
  legacyConfig,
  "config drift between map-config.json and dust2.json.config"
);

// ── spawns: exact equality, same order ───────────────────────────
assert.deepStrictEqual(
  consolidated.spawns,
  legacySpawns,
  "spawns drift between spawns.json and dust2.json.spawns"
);

// ── lineups: same order, only rename allowed is screenshots.stand → position ──
assert.equal(
  consolidated.lineups.length,
  legacyUtilities.length,
  `lineup count mismatch: legacy=${legacyUtilities.length} new=${consolidated.lineups.length}`
);

for (let i = 0; i < legacyUtilities.length; i++) {
  const legacy = legacyUtilities[i];
  const newer = consolidated.lineups[i];

  // Compare everything except screenshots
  const { screenshots: legScreens, ...legRest } = legacy;
  const { screenshots: newScreens, ...newRest } = newer;
  assert.deepStrictEqual(
    newRest,
    legRest,
    `lineup[${i}] ("${legacy.id}"): non-screenshot fields drift`
  );

  // Validate the rename: legacy.stand → new.position, others verbatim
  if (legScreens || newScreens) {
    const legNormalized = {
      position: legScreens?.stand,
      aim:      legScreens?.aim,
      throw:    legScreens?.throw,     // legacy doesn't have throw — stays undefined
      result:   legScreens?.result,
    };
    const newNormalized = {
      position: newScreens?.position,
      aim:      newScreens?.aim,
      throw:    newScreens?.throw,
      result:   newScreens?.result,
    };
    assert.deepStrictEqual(
      newNormalized,
      legNormalized,
      `lineup[${i}] ("${legacy.id}"): screenshots drift after rename`
    );
  }

  // Boot-validator precondition: every lineup has landingAt.world OR .percent
  assert.ok(
    newer.landingAt && (newer.landingAt.world || newer.landingAt.percent),
    `lineup[${i}] ("${newer.id}"): missing landingAt.world or landingAt.percent`
  );
}

// ── scenarios: 5 seeded shells with the expected numbers ─────────
const expectedNumbers = [1, 2, 3, 4, 5];
const actualNumbers = consolidated.scenarios.map((s) => s.number).sort((a, b) => a - b);
assert.deepStrictEqual(
  actualNumbers,
  expectedNumbers,
  `expected seeded scenario numbers [1,2,3,4,5], got ${JSON.stringify(actualNumbers)}`
);

// Every seed scenario must have at least 2 players with role + label + color
for (const s of consolidated.scenarios) {
  assert.equal(typeof s.id, "string", `scenario ${s.number}: id must be string`);
  assert.equal(typeof s.name, "string", `scenario ${s.number}: name must be string`);
  assert.ok(["T", "CT"].includes(s.side), `scenario ${s.number}: side must be T or CT`);
  assert.ok([2, 3, 4, 5].includes(s.playerCount), `scenario ${s.number}: playerCount must be 2..5`);
  assert.equal(
    s.players.length,
    s.playerCount,
    `scenario ${s.number}: players.length (${s.players.length}) must match playerCount (${s.playerCount})`
  );
  for (const p of s.players) {
    assert.equal(typeof p.role, "string", `scenario ${s.number}: player.role must be string`);
    assert.equal(typeof p.label, "string", `scenario ${s.number}: player.label must be string`);
    assert.ok(/^#[0-9A-Fa-f]{6}$/.test(p.color), `scenario ${s.number}: player.color must be #RRGGBB`);
    assert.ok(Array.isArray(p.actions), `scenario ${s.number}: player.actions must be array`);
  }
}

console.log(
  `\n  ✓ dust2.json consolidation verified:\n` +
  `    · config: identical to map-config.json\n` +
  `    · spawns: ${consolidated.spawns.length} entries identical to spawns.json\n` +
  `    · lineups: ${consolidated.lineups.length} entries, screenshots.stand → position rename applied\n` +
  `    · scenarios: ${consolidated.scenarios.length} seeded shells (numbers ${actualNumbers.join(", ")})\n`
);
