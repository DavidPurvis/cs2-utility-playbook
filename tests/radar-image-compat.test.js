import { describe, expect, it } from "vitest";
import { MAP_IDS } from "../data/mapMeta.js";
import MAPS from "../data/maps-registry.js";
import { RADAR_METADATA, VALVE_RADAR_SOURCE_RESOLUTION } from "../data/radarMetadata.js";

describe("radar metadata compatibility", () => {
  it("provides metadata for every supported map id", () => {
    for (const mapId of MAP_IDS) {
      const meta = RADAR_METADATA[mapId];
      expect(meta, `${mapId} metadata`).toBeDefined();
      expect(typeof meta.pos_x).toBe("number");
      expect(typeof meta.pos_y).toBe("number");
      expect(typeof meta.scale).toBe("number");
      expect(meta.scale, `${mapId} scale`).toBeGreaterThan(0);
      expect(meta.sourceResolution, `${mapId} sourceResolution`).toBe(VALVE_RADAR_SOURCE_RESOLUTION);
    }
  });

  it("keeps radar URL + metadata present together for every map module", () => {
    for (const mapId of MAP_IDS) {
      const mod = MAPS[mapId]?.module;
      expect(mod, `${mapId} module`).toBeDefined();
      expect(typeof mod.RADAR_URL).toBe("string");
      expect(mod.RADAR_URL.length, `${mapId} RADAR_URL`).toBeGreaterThan(0);
      expect(RADAR_METADATA[mapId], `${mapId} has metadata entry`).toBeDefined();
    }
  });
});
