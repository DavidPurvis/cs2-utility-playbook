/**
 * Ground truth tests for the CS2 world-to-radar coordinate conversion.
 *
 * These test points are derived from in-game `getpos` coordinates at
 * well-known callout locations, converted via the canonical formula.
 * They serve as THE source of truth for whether the coordinate system
 * is working correctly.
 *
 * If a test fails, do NOT adjust the test — fix the conversion or metadata.
 */

import { describe, it, expect } from "vitest";
import { worldToMapPercent, mapPercentToWorld, MAP_META } from "../lib/mapCoordinates.js";

const TEST_POINTS = {
  de_inferno: [
    { worldX: -1591, worldY: 583, description: "T Spawn", expectedX: 9.88, expectedY: 65.49, tolerance: 2.0 },
    { worldX: 2089, worldY: 295, description: "A Site default plant", expectedX: 83.17, expectedY: 71.23, tolerance: 2.0 },
    { worldX: 146, worldY: 2876, description: "B Site default plant", expectedX: 44.50, expectedY: 19.82, tolerance: 2.0 },
    { worldX: 282, worldY: 1018, description: "Mid Banana", expectedX: 47.21, expectedY: 56.83, tolerance: 2.0 },
    { worldX: -587, worldY: 1839, description: "Second Mid / Alt Mid", expectedX: 29.90, expectedY: 40.48, tolerance: 2.0 },
  ],
  de_dust2: [
    { worldX: -648, worldY: -1157, description: "T Spawn", expectedX: 40.58, expectedY: 97.49, tolerance: 2.0 },
    { worldX: 1226, worldY: 2499, description: "A Site", expectedX: 82.17, expectedY: 16.42, tolerance: 2.0 },
    { worldX: -1355, worldY: 2523, description: "B Site", expectedX: 24.88, expectedY: 15.89, tolerance: 2.0 },
    { worldX: -320, worldY: 1157, description: "Mid Doors / Xbox", expectedX: 47.84, expectedY: 46.20, tolerance: 2.0 },
    { worldX: 720, worldY: 817, description: "A Long corner", expectedX: 70.94, expectedY: 53.75, tolerance: 2.0 },
  ],
  de_mirage: [
    { worldX: -1483, worldY: -2693, description: "T Spawn", expectedX: 34.12, expectedY: 86.04, tolerance: 2.0 },
    { worldX: -204, worldY: -1192, description: "A Site", expectedX: 59.07, expectedY: 56.71, tolerance: 2.0 },
    { worldX: -2196, worldY: 405, description: "B Site", expectedX: 20.19, expectedY: 25.55, tolerance: 2.0 },
    { worldX: -875, worldY: -1038, description: "Mid / Window", expectedX: 45.97, expectedY: 53.70, tolerance: 2.0 },
    { worldX: -250, worldY: -318, description: "A Ramp / Palace exit", expectedX: 58.17, expectedY: 39.65, tolerance: 2.0 },
  ],
  de_overpass: [
    { worldX: -3050, worldY: -1867, description: "T Spawn", expectedX: 33.43, expectedY: 68.56, tolerance: 2.0 },
    { worldX: -1482, worldY: 206, description: "A Site", expectedX: 62.87, expectedY: 29.58, tolerance: 2.0 },
    { worldX: -3120, worldY: -435, description: "B Site", expectedX: 32.12, expectedY: 41.63, tolerance: 2.0 },
  ],
  de_nuke: [
    { worldX: 400, worldY: -960, description: "T Spawn (Outside)", expectedX: 53.76, expectedY: 53.62, tolerance: 2.0 },
    { worldX: -660, worldY: 350, description: "A Site (Hut area)", expectedX: 38.97, expectedY: 35.38, tolerance: 2.0 },
    { worldX: -440, worldY: -1820, description: "Outside / Secret", expectedX: 42.04, expectedY: 65.63, tolerance: 2.0 },
  ],
  de_anubis: [
    { worldX: -250, worldY: -970, description: "T Spawn", expectedX: 47.63, expectedY: 80.36, tolerance: 2.0 },
    { worldX: -1460, worldY: 1200, description: "A Site", expectedX: 24.99, expectedY: 39.81, tolerance: 2.0 },
    { worldX: 1040, worldY: 1455, description: "B Site", expectedX: 71.77, expectedY: 35.05, tolerance: 2.0 },
  ],
  de_ancient: [
    { worldX: -1300, worldY: -1050, description: "T Spawn", expectedX: 32.27, expectedY: 62.74, tolerance: 2.0 },
    { worldX: -2050, worldY: 100, description: "A Site", expectedX: 17.63, expectedY: 40.27, tolerance: 2.0 },
    { worldX: 475, worldY: 585, description: "B Site", expectedX: 66.93, expectedY: 30.80, tolerance: 2.0 },
  ],
};

describe("Map coordinate conversion accuracy", () => {
  describe("worldToMapPercent", () => {
    for (const [mapKey, points] of Object.entries(TEST_POINTS)) {
      const mapId = mapKey.replace("de_", "");
      const meta = MAP_META[mapId];

      describe(mapKey, () => {
        it("has valid map metadata", () => {
          expect(meta).toBeDefined();
          expect(meta.pos_x).toBeTypeOf("number");
          expect(meta.pos_y).toBeTypeOf("number");
          expect(meta.scale).toBeGreaterThan(0);
        });

        for (const point of points) {
          it(`places "${point.description}" within ${point.tolerance}% of expected`, () => {
            const result = worldToMapPercent(point.worldX, point.worldY, meta);
            expect(Math.abs(result.x - point.expectedX)).toBeLessThan(point.tolerance);
            expect(Math.abs(result.y - point.expectedY)).toBeLessThan(point.tolerance);
          });
        }
      });
    }
  });

  describe("mapPercentToWorld (round-trip)", () => {
    for (const [mapKey, points] of Object.entries(TEST_POINTS)) {
      const mapId = mapKey.replace("de_", "");
      const meta = MAP_META[mapId];

      for (const point of points) {
        it(`${mapKey} "${point.description}" round-trips within 1 world unit`, () => {
          const pct = worldToMapPercent(point.worldX, point.worldY, meta);
          const back = mapPercentToWorld(pct.x, pct.y, meta);
          expect(Math.abs(back.x - point.worldX)).toBeLessThan(1);
          expect(Math.abs(back.y - point.worldY)).toBeLessThan(1);
        });
      }
    }
  });

  describe("MAP_META completeness", () => {
    const EXPECTED_MAPS = ["dust2", "mirage", "inferno", "overpass", "nuke", "anubis", "ancient", "cache"];

    for (const mapId of EXPECTED_MAPS) {
      it(`has metadata for ${mapId}`, () => {
        const meta = MAP_META[mapId];
        expect(meta).toBeDefined();
        expect(meta.pos_x).toBeTypeOf("number");
        expect(meta.pos_y).toBeTypeOf("number");
        expect(meta.scale).toBeGreaterThan(0);
      });
    }
  });

  describe("percentage output range", () => {
    for (const [mapId, meta] of Object.entries(MAP_META)) {
      it(`${mapId} corners map to 0-100 range`, () => {
        const topLeft = worldToMapPercent(meta.pos_x, meta.pos_y, meta);
        expect(topLeft.x).toBeCloseTo(0, 1);
        expect(topLeft.y).toBeCloseTo(0, 1);

        const totalUnits = meta.scale * 1024;
        const bottomRight = worldToMapPercent(
          meta.pos_x + totalUnits,
          meta.pos_y - totalUnits,
          meta,
        );
        expect(bottomRight.x).toBeCloseTo(100, 1);
        expect(bottomRight.y).toBeCloseTo(100, 1);
      });
    }
  });
});
