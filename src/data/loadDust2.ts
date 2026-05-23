/**
 * Boot-time loader + validator for the single Dust 2 data file.
 *
 * Imports src/data/dust2.json at build time (Vite inlines it), then runs
 * a focused assertion function that validates:
 *
 *   1. Top-level shape: config (object), spawns/lineups/scenarios (arrays).
 *   2. Config numeric sanity (finite numbers, positive scale/resolution).
 *   3. Spawn IDs unique + non-empty labels.
 *   4. Lineup IDs unique + snake_case format + non-empty names + landing
 *      discriminator (world or percent).
 *   5. Scenario numbers unique (voice-call protocol).
 *   6. Scenario IDs unique + non-empty names + roleOrder consistency +
 *      startingSpawnId ref integrity + action lineupId ref integrity +
 *      action order uniqueness.
 *   7. CT position recommendedLineupIds ref integrity.
 *   8. SpawnRush ref integrity (fromSpawnId, beatsSpawnIds, losesToSpawnIds).
 *
 * On any failure, throws an Error with a path-pointed message so the
 * ErrorBoundary surfaces it to the developer.
 */

import raw from "./dust2.json";
import type {
  CtPosition,
  DustData,
  DustDefaults,
  Lineup,
  MapConfig,
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

  // ── 1. Top-level shape ────────────────────────────────────────────
  if (typeof o.config !== "object" || o.config === null) {
    throw new Error("dust2.json: config missing or not an object");
  }
  if (!Array.isArray(o.spawns)) throw new Error("dust2.json: spawns must be array");
  if (!Array.isArray(o.lineups)) throw new Error("dust2.json: lineups must be array");
  if (!Array.isArray(o.scenarios)) throw new Error("dust2.json: scenarios must be array");
  if (o.ctPositions !== undefined && !Array.isArray(o.ctPositions)) {
    throw new Error("dust2.json: ctPositions must be array if present");
  }

  // ── 2. Config sanity ──────────────────────────────────────────────
  const cfg = o.config as MapConfig;
  for (const key of ["pos_x", "pos_y", "scale", "sourceResolution"] as const) {
    const v = cfg[key];
    if (typeof v !== "number" || !Number.isFinite(v)) {
      throw new Error(`dust2.json: config.${key} must be a finite number (got ${v})`);
    }
  }
  if (cfg.scale <= 0) {
    throw new Error(`dust2.json: config.scale must be > 0 (got ${cfg.scale})`);
  }
  if (cfg.sourceResolution <= 0) {
    throw new Error(`dust2.json: config.sourceResolution must be > 0 (got ${cfg.sourceResolution})`);
  }

  // ── 3. Spawns: IDs + labels ───────────────────────────────────────
  const spawnIds = new Set<string>();
  for (const s of o.spawns as Spawn[]) {
    if (typeof s.id !== "string" || s.id.length === 0) {
      throw new Error("dust2.json: every spawn must have a non-empty string id");
    }
    if (spawnIds.has(s.id)) {
      throw new Error(`dust2.json: duplicate spawn id '${s.id}'`);
    }
    spawnIds.add(s.id);
    if (typeof s.label !== "string" || s.label.length === 0) {
      throw new Error(`dust2.json: spawn '${s.id}' must have a non-empty label`);
    }
  }

  // ── 4. Lineups: IDs + names + snake_case + landing discriminator ──
  const lineupIds = new Set<string>();
  for (const l of o.lineups as Lineup[]) {
    if (typeof l.id !== "string" || l.id.length === 0) {
      throw new Error("dust2.json: every lineup must have a non-empty string id");
    }
    if (lineupIds.has(l.id)) {
      throw new Error(`dust2.json: duplicate lineup id '${l.id}'`);
    }
    if (!LINEUP_ID_RE.test(l.id)) {
      throw new Error(
        `dust2.json: lineup id '${l.id}' must match /^[a-z][a-z0-9_]*$/ (snake_case)`
      );
    }
    lineupIds.add(l.id);
    if (typeof l.name !== "string" || l.name.length === 0) {
      throw new Error(`dust2.json: lineup '${l.id}' must have a non-empty name`);
    }
    if (!l.landingAt || (!l.landingAt.world && !l.landingAt.percent)) {
      throw new Error(
        `dust2.json: lineup '${l.id}' missing landingAt.world or landingAt.percent`
      );
    }
  }

  // ── 5. Scenario numbers uniqueness ────────────────────────────────
  // The voice-call protocol relies on "scenario 4" pointing at exactly
  // one scenario.
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

  // ── 6. Scenarios: IDs + names + ref integrity + action ordering ───
  const scenarioIds = new Set<string>();
  for (const s of o.scenarios as Scenario[]) {
    if (typeof s.id !== "string" || s.id.length === 0) {
      throw new Error("dust2.json: every scenario must have a non-empty string id");
    }
    if (scenarioIds.has(s.id)) {
      throw new Error(`dust2.json: duplicate scenario id '${s.id}'`);
    }
    scenarioIds.add(s.id);
    if (typeof s.name !== "string" || s.name.length === 0) {
      throw new Error(`dust2.json: scenario '${s.id}' must have a non-empty name`);
    }

    // roleOrder consistency: every entry must match a player role
    if (s.roleOrder) {
      const playerRoles = new Set(s.players.map((p) => p.role));
      for (const role of s.roleOrder) {
        if (!playerRoles.has(role)) {
          throw new Error(
            `dust2.json: scenario '${s.id}' roleOrder contains '${role}' which is not a player role`
          );
        }
      }
    }

    for (const p of s.players as ScenarioPlayer[]) {
      // startingSpawnId ref integrity
      if (p.startingSpawnId && !spawnIds.has(p.startingSpawnId)) {
        throw new Error(
          `dust2.json: scenario '${s.id}', player '${p.role}' references unknown spawn '${p.startingSpawnId}'`
        );
      }

      // Action lineupId ref integrity
      const actionOrders = new Set<number>();
      for (const a of p.actions) {
        if (!lineupIds.has(a.lineupId)) {
          throw new Error(
            `dust2.json: Scenario ${s.number} ('${s.name}'), player '${p.role}' references unknown lineup '${a.lineupId}'`
          );
        }
        // Action order uniqueness within a player
        if (actionOrders.has(a.order)) {
          throw new Error(
            `dust2.json: scenario '${s.id}', player '${p.role}' has duplicate action order ${a.order}`
          );
        }
        actionOrders.add(a.order);
      }
    }
  }

  // ── 7. CT position ref integrity ──────────────────────────────────
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

  // ── 8. SpawnRush ref integrity ────────────────────────────────────
  // Every fromSpawnId, beatsSpawnIds, and losesToSpawnIds entry must
  // resolve to a real Spawn.
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

// ---------------------------------------------------------------------------
// Runtime immutability — prevents accidental mutation of the shared
// data singleton. Any `dustData.lineups.push(...)` or
// `lineup.name = "foo"` will throw a TypeError at runtime.
// ---------------------------------------------------------------------------

function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.freeze(obj);
  for (const val of Object.values(obj)) {
    if (val && typeof val === "object" && !Object.isFrozen(val)) {
      deepFreeze(val);
    }
  }
  return obj;
}

// ---------------------------------------------------------------------------
// Lazy-init loader — catches validation errors instead of crashing the
// module evaluation. This is critical because a module-scope throw
// happens before React mounts, so ErrorBoundary can't catch it.
// ---------------------------------------------------------------------------

let cached: DustData | Error | undefined;

/**
 * Validate and return the Dust 2 data bundle, or an Error if validation
 * fails. Result is memoized — second call returns the same reference.
 */
export function loadDustData(): DustData | Error {
  if (cached !== undefined) return cached;
  try {
    assertDustData(raw);
    const d = raw as DustData;
    cached = deepFreeze({
      ...d,
      ctPositions: d.ctPositions ?? [],
      defaults: d.defaults ?? { plants: [], timings: [], spawnRushes: [] },
    });
  } catch (e) {
    cached = e instanceof Error ? e : new Error(String(e));
  }
  return cached;
}

/**
 * Convenience getter — throws if data is invalid. Call from inside
 * components (render time), NOT at module scope. main.tsx calls
 * loadDustData() first and shows a fallback on error, so by the time
 * any component calls getDustData(), success is guaranteed.
 */
export function getDustData(): DustData {
  const result = loadDustData();
  if (result instanceof Error) throw result;
  return result;
}
