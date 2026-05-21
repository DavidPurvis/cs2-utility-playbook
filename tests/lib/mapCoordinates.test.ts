import { describe, expect, it } from "vitest";
import {
  mapPercentToWorld,
  worldToMapPercent,
  type RadarMeta,
} from "../../lib/mapCoordinates";

const DUST2_META: RadarMeta = {
  map: "de_dust2",
  pos_x: -2476,
  pos_y: 3239,
  scale: 4.4,
  sourceResolution: 1024,
};

describe("mapCoordinates", () => {
  it("projects the radar upper-left corner to (0, 0)", () => {
    const result = worldToMapPercent(-2476, 3239, DUST2_META);
    expect(result).not.toBeNull();
    expect(result!.x).toBeCloseTo(0, 5);
    expect(result!.y).toBeCloseTo(0, 5);
  });

  it("projects the radar center to (50, 50)", () => {
    // dust2 totalUnits = 4.4 * 1024 = 4505.6
    // centerWorldX = pos_x + total/2 = -2476 + 2252.8 = -223.2
    // centerWorldY = pos_y - total/2 = 3239 - 2252.8 = 986.2
    const result = worldToMapPercent(-223.2, 986.2, DUST2_META);
    expect(result).not.toBeNull();
    expect(result!.x).toBeCloseTo(50, 5);
    expect(result!.y).toBeCloseTo(50, 5);
  });

  it("projects the radar lower-right corner to (100, 100)", () => {
    const result = worldToMapPercent(2029.6, -1266.6, DUST2_META);
    expect(result).not.toBeNull();
    expect(result!.x).toBeCloseTo(100, 5);
    expect(result!.y).toBeCloseTo(100, 5);
  });

  it("places dust2 T Spawn at the community-verified percent (~40.4, ~88.7)", () => {
    // Source: community Steam guide #3337501004 + csutil.com setpos values
    const result = worldToMapPercent(-657, -756, DUST2_META);
    expect(result).not.toBeNull();
    expect(Math.abs(result!.x - 40.37)).toBeLessThan(0.1);
    expect(Math.abs(result!.y - 88.67)).toBeLessThan(0.1);
  });

  it("places dust2 A Site default at (~82.2, ~16.4)", () => {
    const result = worldToMapPercent(1226, 2499, DUST2_META);
    expect(result).not.toBeNull();
    expect(Math.abs(result!.x - 82.16)).toBeLessThan(0.1);
    expect(Math.abs(result!.y - 16.42)).toBeLessThan(0.1);
  });

  it("places dust2 B Site default at (~24.9, ~15.9)", () => {
    const result = worldToMapPercent(-1355, 2523, DUST2_META);
    expect(result).not.toBeNull();
    expect(Math.abs(result!.x - 24.88)).toBeLessThan(0.1);
    expect(Math.abs(result!.y - 15.89)).toBeLessThan(0.1);
  });

  it("round-trips world → percent → world", () => {
    const original = { worldX: -657, worldY: -756 };
    const pct = worldToMapPercent(original.worldX, original.worldY, DUST2_META);
    expect(pct).not.toBeNull();
    const back = mapPercentToWorld(pct!.x, pct!.y, DUST2_META);
    expect(back).not.toBeNull();
    expect(back!.worldX).toBeCloseTo(original.worldX, 5);
    expect(back!.worldY).toBeCloseTo(original.worldY, 5);
  });

  it("returns null for non-finite inputs", () => {
    expect(worldToMapPercent(NaN, 0, DUST2_META)).toBeNull();
    expect(worldToMapPercent(0, Infinity, DUST2_META)).toBeNull();
    expect(mapPercentToWorld(NaN, 50, DUST2_META)).toBeNull();
  });

  it("returns null for invalid metadata", () => {
    const bad: RadarMeta = { ...DUST2_META, scale: 0 };
    expect(worldToMapPercent(0, 0, bad)).toBeNull();
  });
});
