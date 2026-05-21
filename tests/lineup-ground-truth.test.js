import { describe, expect, it } from "vitest";
import MAPS from "../data/maps-registry.js";
import { getRadarMetadata, RADAR_METADATA } from "../data/radarMetadata.js";
import { mapPercentToWorld, resolveHybridPoint, worldToMapPercent } from "../lib/mapCoordinates.js";
import {
  DEMOINFOCS_ICON_FRACTIONS,
  DEMOINFOCS_LANDMARK_TOLERANCE,
} from "./fixtures/demoinfocsLandmarks.js";
import demoinfocsSnapshot from "./fixtures/demoinfocsRadarMetadata.json";
import { VERIFIED_MUST_LEARN_COORDS } from "./fixtures/verifiedLineupCoords.js";

function dist2d(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

describe("Lineup ground truth (demoinfocs + cs2util setpos)", () => {
  describe("demoinfocs spawn/bomb landmarks round-trip", () => {
    for (const [mapId, icons] of Object.entries(DEMOINFOCS_ICON_FRACTIONS)) {
      const meta = getRadarMetadata(mapId);
      expect(meta, `${mapId} metadata`).toBeDefined();

      for (const [name, [fx, fy]] of Object.entries(icons)) {
        it(`${mapId} ${name} icon matches Valve conversion`, () => {
          const expectedPercent = { x: fx * 100, y: fy * 100 };
          const world = mapPercentToWorld(expectedPercent.x, expectedPercent.y, meta);
          expect(world).not.toBeNull();
          const back = worldToMapPercent(world.worldX, world.worldY, meta);
          expect(dist2d(back, expectedPercent)).toBeLessThan(DEMOINFOCS_LANDMARK_TOLERANCE);
        });
      }
    }
  });

  describe("must-learn throw coords match cs2util setpos import", () => {
    for (const [mapId, lineups] of Object.entries(VERIFIED_MUST_LEARN_COORDS)) {
      const mod = MAPS[mapId]?.module;
      const meta = getRadarMetadata(mapId);

      for (const [lineupId, expected] of Object.entries(lineups)) {
        it(`${mapId} ${lineupId} throw world matches cs2util (${expected.cs2utilSlug})`, () => {
          const lineup = mod?.LINEUPS?.[lineupId];
          expect(lineup, "lineup exists").toBeDefined();
          expect(lineup.radarPos?.worldX, "migrated to worldX").toBeDefined();

          const dx = Math.abs(lineup.radarPos.worldX - expected.throwWorld.worldX);
          const dy = Math.abs(lineup.radarPos.worldY - expected.throwWorld.worldY);
          expect(dx, "worldX delta").toBeLessThanOrEqual(expected.tolerance);
          expect(dy, "worldY delta").toBeLessThanOrEqual(expected.tolerance);

          const resolved = resolveHybridPoint(lineup.radarPos, meta);
          expect(resolved.x).toBeGreaterThanOrEqual(0);
          expect(resolved.x).toBeLessThanOrEqual(100);
          expect(resolved.y).toBeGreaterThanOrEqual(0);
          expect(resolved.y).toBeLessThanOrEqual(100);
        });
      }
    }
  });

  describe("committed radar metadata matches demoinfocs snapshot", () => {
    for (const [mapId, expected] of Object.entries(demoinfocsSnapshot.maps)) {
      it(`${mapId} pos_x/pos_y/scale`, () => {
        const actual = RADAR_METADATA[mapId];
        expect(actual.pos_x).toBe(expected.pos_x);
        expect(actual.pos_y).toBe(expected.pos_y);
        expect(actual.scale).toBe(expected.scale);
      });
    }
  });
});
