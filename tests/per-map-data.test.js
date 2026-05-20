import { describe, expect, it } from "vitest";
import MAPS, { MAP_IDS } from "../data/maps-registry.js";
import { validateMapModule } from "./validateMapData.js";

describe.each(MAP_IDS)("map module %s", (mapId) => {
  it("has unique lineup ids matching object keys", () => {
    const mod = MAPS[mapId].module;
    for (const [key, L] of Object.entries(mod.LINEUPS)) {
      expect(L.id).toBe(key);
    }
  });

  it("uses valid throw types on every lineup", () => {
    const mod = MAPS[mapId].module;
    const valid = new Set(["JT", "WJT", "LMB", "RMB", "WALK2", "RUN"]);
    for (const L of Object.values(mod.LINEUPS)) {
      expect(valid.has(L.throw), `${mapId} ${L.id} throw`).toBe(true);
    }
  });

  it("keeps radar positions in percentage space", () => {
    const mod = MAPS[mapId].module;
    for (const L of Object.values(mod.LINEUPS)) {
      const { x, y } = L.radarPos;
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(100);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(100);
      if (x > 0 && x < 1) expect.fail(`${mapId} ${L.id} radarPos.x looks normalized`);
      if (y > 0 && y < 1) expect.fail(`${mapId} ${L.id} radarPos.y looks normalized`);
    }
  });

  it("validates without structural errors", () => {
    const r = validateMapModule(MAPS[mapId].module, mapId);
    expect(r.errors).toEqual([]);
  });
});
