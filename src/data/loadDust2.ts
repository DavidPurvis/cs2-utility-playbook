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
import type { CtPosition, DustData, Lineup, Scenario, ScenarioPlayer } from "../types";

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
  // least one resolvable landing coordinate.
  const lineupIds = new Set<string>();
  for (const l of o.lineups as Lineup[]) {
    if (typeof l.id !== "string") {
      throw new Error("dust2.json: every lineup must have a string id");
    }
    lineupIds.add(l.id);
    if (!l.landingAt || (!l.landingAt.world && !l.landingAt.percent)) {
      throw new Error(
        `dust2.json: lineup ${l.id} missing landingAt.world or landingAt.percent`
      );
    }
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
    cached = {
      ...d,
      ctPositions: d.ctPositions ?? [],
      defaults: d.defaults ?? { plants: [], timings: [], spawnRushes: [] },
    };
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
