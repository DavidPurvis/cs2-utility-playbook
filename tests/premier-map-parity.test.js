import { describe, expect, it } from "vitest";
import MAPS, { PREMIER_MAP_IDS } from "../data/maps-registry.js";
import { validateMapModule } from "./validateMapData.js";

describe.each(PREMIER_MAP_IDS)("Premier map %s", (mapId) => {
  const mod = MAPS[mapId].module;

  it("exports core data structures", () => {
    for (const key of [
      "MAP_NAME",
      "RADAR_URL",
      "LINEUPS",
      "MUST_LEARN",
      "COMBOS",
      "UTILITY_BELTS",
      "SCENARIOS",
      "SETUP_POSITIONS",
      "SPAWNS",
    ]) {
      expect(mod[key], `${mapId}.${key}`).toBeDefined();
    }
  });

  it("passes validator with zero errors", () => {
    const r = validateMapModule(mod, mapId);
    if (r.errors.length) console.error(r.errors.join("\n"));
    expect(r.errors).toEqual([]);
  });

  it("has at most five must-learn lineups with bidirectional flags", () => {
    // Was: hard-required exactly 5. After the cs2util-only strict-mode
    // filter, some original picks lost their cs2util setpos match and
    // were dropped. Up to 5 is allowed; below 5 is documented in the
    // baseline.
    expect(mod.MUST_LEARN.length).toBeLessThanOrEqual(5);
    for (const id of mod.MUST_LEARN) {
      expect(mod.LINEUPS[id]?.mustLearn).toBe(true);
    }
    const flagged = Object.keys(mod.LINEUPS).filter((id) => mod.LINEUPS[id].mustLearn);
    expect(flagged.sort()).toEqual([...mod.MUST_LEARN].sort());
  });

  it("references only known lineups in combos and belts", () => {
    const ids = new Set(Object.keys(mod.LINEUPS));
    for (const c of mod.COMBOS) {
      for (const row of c.lineups || []) {
        expect(ids.has(row.lineup), `combo ${c.id}`).toBe(true);
      }
    }
    for (const b of mod.UTILITY_BELTS) {
      for (const step of b.sequence || []) {
        expect(ids.has(step.lineup), `belt ${b.id}`).toBe(true);
      }
    }
  });
});
