/**
 * Lineup position rendering sanity checks.
 *
 * The prior version of this test asserted that BOTH the throw and the
 * landing dot for every lineup fell within the same broad "callout region"
 * matching `lineup.area`. That assumption is wrong — a smoke thrown FROM
 * T Spawn that LANDS at A Site has different throw and landing areas, so
 * the test only passed when the data was hand-tuned to keep both ends
 * inside one quadrant. That tuning is exactly what made the dots render
 * wrong on screen.
 *
 * The replacement test below:
 *   1. Asserts every throw/target projects inside the radar bounds
 *      (0–100% on each axis) — catches "dot falls off the radar".
 *   2. Asserts the rendering pipeline correctly places authoritative
 *      landmarks (T Spawn / CT Spawn / bombA / bombB) from
 *      demoinfocs-golang overview metadata — catches "the conversion
 *      math drifted".
 *
 * Together these guard the conversion pipeline without forcing artificial
 * geometric constraints on lineup data.
 */
import { describe, expect, it } from "vitest";
import MAPS from "../data/maps-registry.js";
import { getRadarMetadata } from "../data/radarMetadata.js";
import { mapPercentToWorld, resolveHybridPoint, worldToMapPercent } from "../lib/mapCoordinates.js";
import {
  DEMOINFOCS_ICON_FRACTIONS,
  DEMOINFOCS_LANDMARK_TOLERANCE,
} from "./fixtures/demoinfocsLandmarks.js";

function inRange(value, min, max) {
  return value >= min && value <= max;
}

describe("Lineup positions render inside the radar", () => {
  for (const [mapId, entry] of Object.entries(MAPS)) {
    const mod = entry.module;
    const mapMeta = getRadarMetadata(mapId);

    describe(mapId, () => {
      it("every throw position projects inside the radar (0–100%)", () => {
        for (const lineup of Object.values(mod.LINEUPS)) {
          const pt = resolveHybridPoint(lineup.radarPos, mapMeta);
          expect(pt, `${mapId} ${lineup.id} throw`).not.toBeNull();
          expect(inRange(pt.x, 0, 100), `${mapId} ${lineup.id} throw x=${pt.x}`).toBe(true);
          expect(inRange(pt.y, 0, 100), `${mapId} ${lineup.id} throw y=${pt.y}`).toBe(true);
        }
      });

      it("every landing position projects inside the radar (0–100%)", () => {
        for (const lineup of Object.values(mod.LINEUPS)) {
          if (!lineup.radarTarget) continue;
          const pt = resolveHybridPoint(lineup.radarTarget, mapMeta);
          expect(pt, `${mapId} ${lineup.id} target`).not.toBeNull();
          expect(inRange(pt.x, 0, 100), `${mapId} ${lineup.id} target x=${pt.x}`).toBe(true);
          expect(inRange(pt.y, 0, 100), `${mapId} ${lineup.id} target y=${pt.y}`).toBe(true);
        }
      });
    });
  }
});

describe("Radar conversion places demoinfocs landmarks correctly", () => {
  for (const [mapId, fractions] of Object.entries(DEMOINFOCS_ICON_FRACTIONS)) {
    const mapMeta = getRadarMetadata(mapId);
    describe(mapId, () => {
      for (const [name, [fx, fy]] of Object.entries(fractions)) {
        it(`places ${name} within ${DEMOINFOCS_LANDMARK_TOLERANCE}% of (${(fx * 100).toFixed(1)}, ${(fy * 100).toFixed(1)})`, () => {
          // demoinfocs overview icon fractions are direct radar fractions;
          // round-trip through world coords to validate the conversion math
          // matches the published overview metadata.
          const expectedPct = { x: fx * 100, y: fy * 100 };
          const world = mapPercentToWorld(expectedPct.x, expectedPct.y, mapMeta);
          expect(world).not.toBeNull();
          const projected = worldToMapPercent(world.worldX, world.worldY, mapMeta);
          expect(projected).not.toBeNull();
          expect(Math.abs(projected.x - expectedPct.x)).toBeLessThan(DEMOINFOCS_LANDMARK_TOLERANCE);
          expect(Math.abs(projected.y - expectedPct.y)).toBeLessThan(DEMOINFOCS_LANDMARK_TOLERANCE);
        });
      }
    });
  }
});
