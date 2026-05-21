import { describe, expect, it } from "vitest";
import { MAP_IDS } from "../data/mapMeta.js";
import { RADAR_METADATA } from "../data/radarMetadata.js";
import { mapPercentToWorld, worldToMapPercent } from "../lib/mapCoordinates.js";

const EXPECTED_RADAR_METADATA = {
  dust2: { pos_x: -2476, pos_y: 3239, scale: 4.4, sourceResolution: 1024 },
  mirage: { pos_x: -3230, pos_y: 1713, scale: 5.0, sourceResolution: 1024 },
  inferno: { pos_x: -2087, pos_y: 3870, scale: 4.9, sourceResolution: 1024 },
  overpass: { pos_x: -4831, pos_y: 1781, scale: 5.2, sourceResolution: 1024 },
  nuke: { pos_x: -3453, pos_y: 2887, scale: 7.0, sourceResolution: 1024 },
  anubis: { pos_x: -2796, pos_y: 3328, scale: 5.22, sourceResolution: 1024 },
  ancient: { pos_x: -2953, pos_y: 2164, scale: 5.0, sourceResolution: 1024 },
  cache: { pos_x: -2000, pos_y: 3250, scale: 5.5, sourceResolution: 1024 },
};

// Ground-truth control points for all supported maps (computed from Valve metadata bounds).
const CONTROL_POINTS = {
  dust2: [
    { worldX: -2476, worldY: 3239, expectedX: 0, expectedY: 0, description: "Radar upper-left bound" },
    { worldX: -223.2, worldY: 986.2, expectedX: 50, expectedY: 50, description: "Radar center bound" },
    { worldX: 2029.6, worldY: -1266.6, expectedX: 100, expectedY: 100, description: "Radar lower-right bound" },
  ],
  mirage: [
    { worldX: -3230, worldY: 1713, expectedX: 0, expectedY: 0, description: "Radar upper-left bound" },
    { worldX: -670, worldY: -847, expectedX: 50, expectedY: 50, description: "Radar center bound" },
    { worldX: 1890, worldY: -3407, expectedX: 100, expectedY: 100, description: "Radar lower-right bound" },
  ],
  inferno: [
    { worldX: -2087, worldY: 3870, expectedX: 0, expectedY: 0, description: "Radar upper-left bound" },
    { worldX: 421.8, worldY: 1361.2, expectedX: 50, expectedY: 50, description: "Radar center bound" },
    { worldX: 2930.6, worldY: -1147.6, expectedX: 100, expectedY: 100, description: "Radar lower-right bound" },
  ],
  overpass: [
    { worldX: -4831, worldY: 1781, expectedX: 0, expectedY: 0, description: "Radar upper-left bound" },
    { worldX: -2168.6, worldY: -881.4, expectedX: 50, expectedY: 50, description: "Radar center bound" },
    { worldX: 493.8, worldY: -3543.8, expectedX: 100, expectedY: 100, description: "Radar lower-right bound" },
  ],
  nuke: [
    { worldX: -3453, worldY: 2887, expectedX: 0, expectedY: 0, description: "Radar upper-left bound" },
    { worldX: 131, worldY: -697, expectedX: 50, expectedY: 50, description: "Radar center bound" },
    { worldX: 3715, worldY: -4281, expectedX: 100, expectedY: 100, description: "Radar lower-right bound" },
  ],
  anubis: [
    { worldX: -2796, worldY: 3328, expectedX: 0, expectedY: 0, description: "Radar upper-left bound" },
    { worldX: -123.36, worldY: 655.36, expectedX: 50, expectedY: 50, description: "Radar center bound" },
    { worldX: 2549.28, worldY: -2017.28, expectedX: 100, expectedY: 100, description: "Radar lower-right bound" },
  ],
  ancient: [
    { worldX: -2953, worldY: 2164, expectedX: 0, expectedY: 0, description: "Radar upper-left bound" },
    { worldX: -393, worldY: -396, expectedX: 50, expectedY: 50, description: "Radar center bound" },
    { worldX: 2167, worldY: -2956, expectedX: 100, expectedY: 100, description: "Radar lower-right bound" },
  ],
  cache: [
    { worldX: -2000, worldY: 3250, expectedX: 0, expectedY: 0, description: "Radar upper-left bound" },
    { worldX: 816, worldY: 434, expectedX: 50, expectedY: 50, description: "Radar center bound" },
    { worldX: 3632, worldY: -2382, expectedX: 100, expectedY: 100, description: "Radar lower-right bound" },
  ],
};

// Landmark points from known callouts (visually verifiable on common Valve-style radar usage).
const LANDMARK_POINTS = {
  inferno: [
    { worldX: -1591, worldY: 583, description: "T Spawn", expectedX: 9.89, expectedY: 65.51, tolerance: 2.0 },
    { worldX: 2089, worldY: 295, description: "A Site default", expectedX: 83.23, expectedY: 71.25, tolerance: 2.0 },
    { worldX: 146, worldY: 2876, description: "B Site default", expectedX: 44.5, expectedY: 19.81, tolerance: 2.0 },
    { worldX: 282, worldY: 1018, description: "Mid Banana", expectedX: 47.21, expectedY: 56.84, tolerance: 2.0 },
  ],
  dust2: [
    { worldX: -648, worldY: -1157, description: "T Spawn", expectedX: 40.57, expectedY: 97.57, tolerance: 2.0 },
    { worldX: 1226, worldY: 2499, description: "A Site", expectedX: 82.16, expectedY: 16.42, tolerance: 2.0 },
    { worldX: -1355, worldY: 2523, description: "B Site", expectedX: 24.88, expectedY: 15.89, tolerance: 2.0 },
  ],
  mirage: [
    { worldX: -1483, worldY: -2693, description: "T Spawn", expectedX: 34.12, expectedY: 86.05, tolerance: 2.0 },
    { worldX: -204, worldY: -1192, description: "A Site", expectedX: 59.1, expectedY: 56.74, tolerance: 2.0 },
    { worldX: -2196, worldY: 405, description: "B Site", expectedX: 20.2, expectedY: 25.55, tolerance: 2.0 },
  ],
};

describe("Map coordinate conversion accuracy", () => {
  it("keeps Valve radar metadata constants intact", () => {
    for (const mapId of MAP_IDS) {
      const actual = RADAR_METADATA[mapId];
      const expected = EXPECTED_RADAR_METADATA[mapId];
      expect(actual, `${mapId} metadata`).toBeDefined();
      expect(expected, `${mapId} expected metadata`).toBeDefined();
      expect(actual.pos_x).toBe(expected.pos_x);
      expect(actual.pos_y).toBe(expected.pos_y);
      expect(actual.scale).toBe(expected.scale);
      expect(actual.sourceResolution).toBe(expected.sourceResolution);
    }
  });

  for (const [mapId, points] of Object.entries(CONTROL_POINTS)) {
    describe(`${mapId} control points`, () => {
      const meta = RADAR_METADATA[mapId];

      for (const point of points) {
        it(`projects ${point.description} correctly`, () => {
          const result = worldToMapPercent(point.worldX, point.worldY, meta);
          expect(result).not.toBeNull();
          expect(Math.abs(result.x - point.expectedX)).toBeLessThan(0.01);
          expect(Math.abs(result.y - point.expectedY)).toBeLessThan(0.01);
        });

        it(`round-trips ${point.description} back to world`, () => {
          const world = mapPercentToWorld(point.expectedX, point.expectedY, meta);
          expect(world).not.toBeNull();
          expect(Math.abs(world.worldX - point.worldX)).toBeLessThan(0.01);
          expect(Math.abs(world.worldY - point.worldY)).toBeLessThan(0.01);
        });
      }
    });
  }

  for (const [mapId, points] of Object.entries(LANDMARK_POINTS)) {
    describe(`${mapId} landmark points`, () => {
      const meta = RADAR_METADATA[mapId];
      for (const point of points) {
        it(`places ${point.description} within ${point.tolerance}%`, () => {
          const result = worldToMapPercent(point.worldX, point.worldY, meta);
          expect(result).not.toBeNull();
          expect(Math.abs(result.x - point.expectedX)).toBeLessThan(point.tolerance);
          expect(Math.abs(result.y - point.expectedY)).toBeLessThan(point.tolerance);
        });
      }
    });
  }
});
