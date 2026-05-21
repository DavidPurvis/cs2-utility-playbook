/**
 * Validates that actual lineup/position data places dots within the correct
 * map regions. Uses bounding boxes for well-known callout areas derived from
 * the canonical worldToMapPercent conversion.
 *
 * Key distinction: `radarPos` is where the player STANDS (can be anywhere),
 * while `radarTarget` is where the utility LANDS (should match the area tag).
 * We only validate radarTarget against area bounds.
 */

import { describe, it, expect } from "vitest";
import MAPS from "../data/maps-registry.js";
import { MAP_META } from "../lib/mapCoordinates.js";

/**
 * Approximate bounding boxes for where utility LANDS in each area.
 * Format: [minX, minY, maxX, maxY].
 * Generous bounds — catching gross errors, not demanding pixel precision.
 *
 * These are calibrated to the radar images currently in use. If a radar image
 * is swapped (e.g., to SimpleRadar), bounds may need recalibration.
 */
const LANDING_BOUNDS = {
  inferno: {
    Banana:  [15, 15, 55, 80],
    B:       [15, 10, 55, 65],
    A:       [30, 5,  85, 75],
    Mid:     [30, 35, 60, 80],
  },
  dust2: {
    Mid:     [25, 30, 60, 95],
    A:       [40, 5,  95, 70],
    B:       [5,  10, 45, 70],
  },
  mirage: {
    Mid:     [25, 25, 65, 70],
    A:       [40, 5,  85, 78],
    B:       [0,  10, 45, 60],
  },
  overpass: {
    A:       [40, 10, 85, 50],
    B:       [15, 20, 55, 70],
    Mid:     [30, 30, 65, 75],
    Connector: [25, 30, 60, 60],
  },
  nuke: {
    Outside: [50, 30, 90, 75],
    A:       [30, 15, 75, 55],
    B:       [25, 35, 65, 80],
    Ramp:    [40, 35, 65, 65],
  },
  anubis: {
    A:       [5,  10, 50, 65],
    B:       [50, 10, 90, 65],
    Mid:     [30, 30, 70, 80],
  },
  ancient: {
    A:       [5,  15, 50, 60],
    B:       [45, 15, 85, 60],
    Mid:     [25, 20, 65, 85],
  },
  cache: {
    A:       [3,  15, 50, 60],
    B:       [40, 40, 95, 85],
    Mid:     [30, 30, 65, 75],
  },
};

function isInBounds(x, y, bounds) {
  if (!bounds) return true;
  const [minX, minY, maxX, maxY] = bounds;
  return x >= minX && x <= maxX && y >= minY && y <= maxY;
}

describe("Lineup position region validation", () => {
  for (const [mapId, entry] of Object.entries(MAPS)) {
    const mod = entry.module;
    if (!mod?.LINEUPS) continue;
    const areas = LANDING_BOUNDS[mapId];
    if (!areas) continue;

    describe(mapId, () => {
      describe("radarTarget lands within expected area", () => {
        for (const [id, lineup] of Object.entries(mod.LINEUPS)) {
          if (!lineup.radarTarget) continue;
          const bounds = areas[lineup.area];
          if (!bounds) continue;

          it(`${id} radarTarget is within ${lineup.area} region`, () => {
            const { x, y } = lineup.radarTarget;
            const inBounds = isInBounds(x, y, bounds);
            if (!inBounds) {
              expect.fail(
                `${id} radarTarget (${x}, ${y}) is outside ${lineup.area} bounds ` +
                `[${bounds.join(", ")}]`
              );
            }
          });
        }
      });

      describe("all coordinates in 0-100 range", () => {
        for (const [id, lineup] of Object.entries(mod.LINEUPS)) {
          if (lineup.radarPos) {
            it(`${id} radarPos in range`, () => {
              expect(lineup.radarPos.x).toBeGreaterThanOrEqual(0);
              expect(lineup.radarPos.x).toBeLessThanOrEqual(100);
              expect(lineup.radarPos.y).toBeGreaterThanOrEqual(0);
              expect(lineup.radarPos.y).toBeLessThanOrEqual(100);
            });
          }
          if (lineup.radarTarget) {
            it(`${id} radarTarget in range`, () => {
              expect(lineup.radarTarget.x).toBeGreaterThanOrEqual(0);
              expect(lineup.radarTarget.x).toBeLessThanOrEqual(100);
              expect(lineup.radarTarget.y).toBeGreaterThanOrEqual(0);
              expect(lineup.radarTarget.y).toBeLessThanOrEqual(100);
            });
          }
        }
      });

      describe("SETUP_POSITIONS in range", () => {
        if (!mod.SETUP_POSITIONS) return;
        for (const pos of mod.SETUP_POSITIONS) {
          it(`${pos.id} pos is within map (0-100)`, () => {
            expect(pos.pos.x).toBeGreaterThanOrEqual(0);
            expect(pos.pos.x).toBeLessThanOrEqual(100);
            expect(pos.pos.y).toBeGreaterThanOrEqual(0);
            expect(pos.pos.y).toBeLessThanOrEqual(100);
          });
        }
      });

      describe("SPAWNS in range", () => {
        if (!mod.SPAWNS) return;
        for (const side of ["T", "CT"]) {
          const arr = mod.SPAWNS[side];
          if (!arr) continue;
          for (const sp of arr) {
            it(`${side} Spawn ${sp.id} (${sp.name}) is within map`, () => {
              expect(sp.pos.x).toBeGreaterThanOrEqual(0);
              expect(sp.pos.x).toBeLessThanOrEqual(100);
              expect(sp.pos.y).toBeGreaterThanOrEqual(0);
              expect(sp.pos.y).toBeLessThanOrEqual(100);
            });
          }
        }
      });
    });
  }
});

describe("Throw-to-landing consistency", () => {
  for (const [mapId, entry] of Object.entries(MAPS)) {
    const mod = entry.module;
    if (!mod?.LINEUPS) continue;

    describe(mapId, () => {
      for (const [id, lineup] of Object.entries(mod.LINEUPS)) {
        if (!lineup.radarPos || !lineup.radarTarget) continue;

        it(`${id} throw and landing are not identical`, () => {
          const same = lineup.radarPos.x === lineup.radarTarget.x &&
                       lineup.radarPos.y === lineup.radarTarget.y;
          expect(same).toBe(false);
        });
      }
    });
  }
});

describe("MAP_META coverage", () => {
  for (const mapId of Object.keys(MAPS)) {
    it(`${mapId} has map metadata`, () => {
      expect(MAP_META[mapId]).toBeDefined();
    });
  }
});
