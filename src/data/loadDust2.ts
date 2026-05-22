/**
 * Boot-time loader + validator for the single Dust 2 data file.
 *
 * Imports src/data/dust2.json at build time (Vite inlines it), then runs
 * a focused assertion function that validates:
 *
 *   1. Top-level shape: config (object), spawns/lineups/scenarios (arrays).
 *   2. Every lineup has at least one of landingAt.world or landingAt.percent
 *      (the boot discriminator — both renderers need at least one).
 *   3. Every scenario action's lineupId resolves to an actual lineup
 *      (ref integrity — prevents silent dangling refs that would render
 *      blank arcs).
 *
 * On any failure, throws an Error with a path-pointed message so the
 * ErrorBoundary surfaces it to the developer. There is no field-level
 * validation beyond the discriminator + ref check — the JSON is
 * single-author and the TypeScript types in src/types.ts already cover
 * the rest.
 */

import raw from "./dust2.json";
import type {
  CtPosition,
  DustData,
  DustDefaults,
  Lineup,
  Scenario,
  ScenarioPlayer,
  Spawn,
  SpawnRush,
} from "../types";

// Mirrors the CLI's id-format check (scripts/new-lineup.mjs). Hand-edits
// to dust2.json could otherwise sneak an invalid id past boot.
const LINEUP_ID_RE = /^[a-z][a-z0-9_]*$/;

export function assertDustData(d: unknown): asserts d is DustData {
  if (typeof d !== "object" || d === null) {
    throw new Error("dust2.json: expected object at root");
  }
  const o = d as Record<string, unknown>;

  if (typeof o.config !== "object" || o.config === null) {
    throw new Error("dust2.json: config missing or not an object");
  }
  if (!Array.isArray(o.spawns)) throw new Error("dust2.json: spawns must be array");
  if (!Array.isArray(o.lineups)) throw new Error("dust2.json: lineups must be array");
  if (!Array.isArray(o.scenarios)) throw new Error("dust2.json: scenarios must be array");
  // ctPositions is optional — older data files won't have it. Treat as empty.
  if (o.ctPositions !== undefined && !Array.isArray(o.ctPositions)) {
    throw new Error("dust2.json: ctPositions must be array if present");
  }

  // Build a lookup of known lineup ids, and assert each lineup has at
  // least one resolvable landing coordinate + a valid snake_case id +
  // that ids are unique.
  const lineupIds = new Set<string>();
  for (const l of o.lineups as Lineup[]) {
    if (typeof l.id !== "string") {
      throw new Error("dust2.json: every lineup must have a string id");
    }
    if (!LINEUP_ID_RE.test(l.id)) {
      throw new Error(
        `dust2.json: lineup id '${l.id}' must match /^[a-z][a-z0-9_]*$/ (snake_case)`
      );
    }
    if (lineupIds.has(l.id)) {
      throw new Error(`dust2.json: duplicate lineup id '${l.id}'`);
    }
    lineupIds.add(l.id);
    if (!l.landingAt || (!l.landingAt.world && !l.landingAt.percent)) {
      throw new Error(
        `dust2.json: lineup ${l.id} missing landingAt.world or landingAt.percent`
      );
    }
  }

  // Build a lookup of spawn ids + assert uniqueness. Needed for the
  // defaults.spawnRushes ref-integrity check below and the (not-yet-
  // enforced but reasonable) ScenarioPlayer.startingSpawnId check.
  const spawnIds = new Set<string>();
  for (const sp of o.spawns as Spawn[]) {
    if (typeof sp.id !== "string") {
      throw new Error("dust2.json: every spawn must have a string id");
    }
    if (spawnIds.has(sp.id)) {
      throw new Error(`dust2.json: duplicate spawn id '${sp.id}'`);
    }
    spawnIds.add(sp.id);
  }

  // Scenario numbers must be unique — the voice-call protocol relies
  // on "scenario 4" pointing at exactly one scenario.
  const scenarioNumbers = new Set<number>();
  for (const s of o.scenarios as Scenario[]) {
    if (typeof s.number !== "number") {
      throw new Error(`dust2.json: scenario '${s.id}' missing numeric .number`);
    }
    if (scenarioNumbers.has(s.number)) {
      throw new Error(
        `dust2.json: duplicate scenario.number ${s.number} (used by multiple scenarios)`
      );
    }
    scenarioNumbers.add(s.number);
  }

  // Scenario ref integrity: every action.lineupId must resolve.
  for (const s of o.scenarios as Scenario[]) {
    for (const p of s.players as ScenarioPlayer[]) {
      for (const a of p.actions) {
        if (!lineupIds.has(a.lineupId)) {
          throw new Error(
            `dust2.json: Scenario ${s.number} ('${s.name}'), player '${p.role}' references unknown lineup '${a.lineupId}'`
          );
        }
      }
    }
  }

  // CT position ref integrity: every recommendedLineupId must resolve.
  if (Array.isArray(o.ctPositions)) {
    for (const pos of o.ctPositions as CtPosition[]) {
      if (typeof pos.id !== "string" || typeof pos.label !== "string") {
        throw new Error("dust2.json: every ctPosition must have id + label strings");
      }
      for (const lineupId of pos.recommendedLineupIds ?? []) {
        if (!lineupIds.has(lineupId)) {
          throw new Error(
            `dust2.json: CT position '${pos.id}' references unknown lineup '${lineupId}'`
          );
        }
      }
    }
  }

  // defaults.spawnRushes ref integrity: every fromSpawnId, beatsSpawnIds,
  // and losesToSpawnIds entry must resolve to a real Spawn. (Closes
  // DECISIONS_LEDGER W-12.)
  if (o.defaults !== undefined) {
    const defaults = o.defaults as DustDefaults;
    if (Array.isArray(defaults.spawnRushes)) {
      for (const rush of defaults.spawnRushes as SpawnRush[]) {
        if (typeof rush.fromSpawnId !== "string" || !spawnIds.has(rush.fromSpawnId)) {
          throw new Error(
            `dust2.json: spawnRush '${rush.id}' references unknown fromSpawnId '${rush.fromSpawnId}'`
          );
        }
        for (const sid of rush.beatsSpawnIds ?? []) {
          if (!spawnIds.has(sid)) {
            throw new Error(
              `dust2.json: spawnRush '${rush.id}' beatsSpawnIds contains unknown spawn '${sid}'`
            );
          }
        }
        for (const sid of rush.losesToSpawnIds ?? []) {
          if (!spawnIds.has(sid)) {
            throw new Error(
              `dust2.json: spawnRush '${rush.id}' losesToSpawnIds contains unknown spawn '${sid}'`
            );
          }
        }
      }
    }
  }
}

// `assertDustData` runs before the cast; downstream consumers can
// iterate without null-checking optional arrays / objects.
const validated = (() => {
  assertDustData(raw);
  const d = raw as DustData;
  return {
    ...d,
    ctPositions: d.ctPositions ?? [],
    defaults: d.defaults ?? { plants: [], timings: [], spawnRushes: [] },
  };
})();

export const dustData: DustData = validated;
