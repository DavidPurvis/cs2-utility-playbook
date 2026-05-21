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
import type { DustData, Lineup, Scenario, ScenarioPlayer } from "../types";

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
}

assertDustData(raw);
export const dustData: DustData = raw;
