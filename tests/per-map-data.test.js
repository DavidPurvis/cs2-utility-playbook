import { describe, expect, it } from "vitest";
import MAPS, { MAP_IDS } from "../data/maps-registry.js";
import { getRadarMetadata } from "../data/radarMetadata.js";
import { isPercentPoint, isWorldPoint, resolveHybridPoint } from "../lib/mapCoordinates.js";
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

  it("keeps radar positions resolvable into percentage space", () => {
    const mod = MAPS[mapId].module;
    const mapMeta = getRadarMetadata(mapId);
    for (const L of Object.values(mod.LINEUPS)) {
      expect(
        isPercentPoint(L.radarPos) || isWorldPoint(L.radarPos),
        `${mapId} ${L.id} radarPos format`
      ).toBe(true);
      const resolved = resolveHybridPoint(L.radarPos, mapMeta);
      expect(resolved, `${mapId} ${L.id} radarPos resolves`).not.toBeNull();
      expect(resolved.x).toBeGreaterThanOrEqual(0);
      expect(resolved.x).toBeLessThanOrEqual(100);
      expect(resolved.y).toBeGreaterThanOrEqual(0);
      expect(resolved.y).toBeLessThanOrEqual(100);
      if (isPercentPoint(L.radarPos)) {
        if (L.radarPos.x > 0 && L.radarPos.x < 1) expect.fail(`${mapId} ${L.id} radarPos.x looks normalized`);
        if (L.radarPos.y > 0 && L.radarPos.y < 1) expect.fail(`${mapId} ${L.id} radarPos.y looks normalized`);
      }
    }
  });

  it("validates without structural errors", () => {
    const r = validateMapModule(MAPS[mapId].module, mapId);
    expect(r.errors).toEqual([]);
  });
});
