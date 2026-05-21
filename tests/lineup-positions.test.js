import { describe, expect, it } from "vitest";
import MAPS from "../data/maps-registry.js";
import { getRadarMetadata } from "../data/radarMetadata.js";
import { resolveHybridPoint } from "../lib/mapCoordinates.js";
import { LINEUP_CALLOUT_REGIONS } from "./fixtures/lineupCalloutRegions.js";

const REGION_SLACK = 2;

function inRange(value, min, max) {
  return value >= min && value <= max;
}

function inRegion(point, region, slack = 0) {
  return (
    inRange(point.x, region.minX - slack, region.maxX + slack) &&
    inRange(point.y, region.minY - slack, region.maxY + slack)
  );
}

describe("Lineup position rendering", () => {
  for (const [mapId, entry] of Object.entries(MAPS)) {
    const mod = entry.module;
    const mapMeta = getRadarMetadata(mapId);
    const areaRegions = LINEUP_CALLOUT_REGIONS[mapId];

    describe(mapId, () => {
      it("should place lineup dot within the correct callout region", () => {
        expect(areaRegions, `${mapId} callout regions`).toBeDefined();
        for (const lineup of Object.values(mod.LINEUPS)) {
          const region = areaRegions[lineup.area];
          expect(region, `${mapId} ${lineup.id} area region`).toBeDefined();

          const throwPoint = resolveHybridPoint(lineup.radarPos, mapMeta);
          expect(throwPoint, `${mapId} ${lineup.id} throw point`).not.toBeNull();
          expect(inRange(throwPoint.x, 0, 100), `${mapId} ${lineup.id} throw x bounds`).toBe(true);
          expect(inRange(throwPoint.y, 0, 100), `${mapId} ${lineup.id} throw y bounds`).toBe(true);
          expect(
            inRegion(throwPoint, region, REGION_SLACK),
            `${mapId} ${lineup.id} throw point should be in ${lineup.area}`
          ).toBe(true);
        }
      });

      it("should place utility landing dot within the correct callout region", () => {
        expect(areaRegions, `${mapId} callout regions`).toBeDefined();
        for (const lineup of Object.values(mod.LINEUPS)) {
          if (!lineup.radarTarget) continue;
          const region = areaRegions[lineup.area];
          expect(region, `${mapId} ${lineup.id} area region`).toBeDefined();

          const targetPoint = resolveHybridPoint(lineup.radarTarget, mapMeta);
          expect(targetPoint, `${mapId} ${lineup.id} target point`).not.toBeNull();
          expect(inRange(targetPoint.x, 0, 100), `${mapId} ${lineup.id} target x bounds`).toBe(true);
          expect(inRange(targetPoint.y, 0, 100), `${mapId} ${lineup.id} target y bounds`).toBe(true);
          expect(
            inRegion(targetPoint, region, REGION_SLACK),
            `${mapId} ${lineup.id} target point should be in ${lineup.area}`
          ).toBe(true);
        }
      });
    });
  }
});
