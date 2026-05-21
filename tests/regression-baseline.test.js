import { describe, expect, it } from "vitest";
import MAPS, { PREMIER_MAP_IDS } from "../data/maps-registry.js";
import baseline from "./fixtures/stability-baseline.json";
import { validateAllMaps, validateMapModule } from "./validateMapData.js";

describe("regression baseline", () => {
  const { byMap, errors, warnings } = validateAllMaps(MAPS);

  it("has no validation errors across the full registry", () => {
    expect(errors).toBe(0);
  });

  it("keeps warning count within budget (soft regression guard)", () => {
    expect(warnings).toBeLessThanOrEqual(baseline.totals.maxWarnings);
  });

  it("matches exact lineup counts per Premier map (detect accidental deletions)", () => {
    for (const id of PREMIER_MAP_IDS) {
      const expected = baseline.premier[id];
      const actual = byMap[id].stats;
      expect(actual.lineupCount, `${id} lineup count`).toBe(expected.lineups);
      expect(actual.comboCount, `${id} combo count`).toBe(expected.combos);
      expect(actual.beltCount, `${id} belt count`).toBe(expected.belts);
      expect(actual.scenarioCount, `${id} scenario count`).toBe(expected.scenarios);
      expect(actual.positionCount, `${id} position count`).toBe(expected.positions);
      expect(actual.spawnSlots, `${id} spawn slots`).toBe(expected.spawnSlots);
    }
  });

  it("matches exact stats for bonus maps", () => {
    for (const [id, expected] of Object.entries(baseline.bonus)) {
      const actual = byMap[id].stats;
      expect(actual.lineupCount).toBe(expected.lineups);
      expect(actual.comboCount).toBe(expected.combos);
    }
  });

  it("enforces Premier parity rules on every active map", () => {
    const p = baseline.parity;
    for (const id of PREMIER_MAP_IDS) {
      const mod = MAPS[id].module;
      const r = validateMapModule(mod, id);
      expect(r.errors).toEqual([]);
      // Was: expected exactly mustLearnCount entries. Loosened to
      // upper-bound after the cs2util-only strict-mode filter dropped
      // any must-learn picks lacking verified setpos data.
      expect(mod.MUST_LEARN.length).toBeLessThanOrEqual(5);
      expect(r.stats.comboCount).toBeGreaterThanOrEqual(p.premierMinCombos);
      expect(r.stats.beltCount).toBeGreaterThanOrEqual(p.premierMinBelts);
      expect(r.stats.scenarioCount).toBeGreaterThanOrEqual(p.premierMinScenarios);
      expect(r.stats.positionCount).toBeGreaterThanOrEqual(p.premierMinPositions);
      expect(r.stats.spawnSlots).toBeGreaterThanOrEqual(p.premierMinSpawnSlots);
      expect(r.stats.lineupCount).toBeGreaterThanOrEqual(p.premierMinLineups);
      expect(mod.RADAR_URL?.length).toBeGreaterThan(0);
      expect(mod.SPAWNS?.T?.length).toBeGreaterThan(0);
      expect(mod.SPAWNS?.CT?.length).toBeGreaterThan(0);
    }
  });
});
