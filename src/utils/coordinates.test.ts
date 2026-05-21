/**
 * Coordinate math gate.
 *
 * If these tests fail, no other code runs. Every dot in the app
 * traces through worldToPixel / pixelToWorld.
 *
 * Landmarks come from the user-provided Dust 2 spawn positions
 * (verified in-game via setpos). Each spawn must project inside the
 * known bounding box for its side on the Valve dust2 radar PNG.
 */
import { describe, expect, it } from "vitest";
import {
  percentToWorld,
  pixelToWorld,
  pointToPixel,
  worldToPercent,
  worldToPixel,
} from "./coordinates";
import type { MapConfig } from "../types";

const DUST2: MapConfig = {
  id: "dust2",
  displayName: "Dust 2",
  valveMapId: "de_dust2",
  radarImage: "/maps/dust2/radar.png",
  pos_x: -2476,
  pos_y: 3239,
  scale: 4.4,
  sourceResolution: 1024,
};

// Verified in-game spawn positions from the user's spec.
// Each entry is the `setpos x y` portion of the console command.
const T_SPAWNS: Array<[string, number, number]> = [
  ["S1", -332.0, -754.0],
  ["S2", -367.0, -808.0],
  ["S3", -428.0, -843.0],
  ["S4", -493.0, -808.0],
  ["S5", -533.0, -754.0],
  ["S6", -657.271362, -755.879639],
  ["S7", -696.844604, -806.623718],
  ["S8", -760.662964, -836.174011],
  ["S9", -822.365173, -795.642090],
  ["S10", -857.506531, -738.361328],
  ["S11", -980.0, -754.0],
  ["S12", -1015.0, -808.0],
  ["S13", -1076.0, -843.0],
  ["S14", -1141.0, -808.0],
  ["S15", -1181.0, -754.0],
];

const CT_SPAWNS: Array<[string, number, number]> = [
  ["S1", 160.122742, 2369.676270],
  ["S2", 182.249908, 2439.011719],
  ["S3", 258.159393, 2480.553711],
  ["S4", 334.368744, 2433.733643],
  ["S5", 351.392120, 2352.942383],
];

// Bounding boxes (percent space) the spawns must project inside.
// Hand-derived from the Valve dust2 radar PNG visual inspection.
const T_SPAWN_BOX = { minX: 25, maxX: 50, minY: 85, maxY: 92 };
const CT_SPAWN_BOX = { minX: 55, maxX: 65, minY: 15, maxY: 22 };

describe("worldToPercent / percentToWorld — Dust 2 reference math", () => {
  it("projects the radar upper-left corner to (0, 0)", () => {
    const p = worldToPercent(DUST2.pos_x, DUST2.pos_y, DUST2);
    expect(p).not.toBeNull();
    expect(p!.x).toBeCloseTo(0, 5);
    expect(p!.y).toBeCloseTo(0, 5);
  });

  it("projects the radar center to (50, 50)", () => {
    // totalUnits = scale * 1024 = 4505.6
    // centerWorldX = pos_x + total/2 = -2476 + 2252.8 = -223.2
    // centerWorldY = pos_y - total/2 = 3239 - 2252.8 = 986.2
    const p = worldToPercent(-223.2, 986.2, DUST2);
    expect(p).not.toBeNull();
    expect(p!.x).toBeCloseTo(50, 5);
    expect(p!.y).toBeCloseTo(50, 5);
  });

  it("projects the radar lower-right corner to (100, 100)", () => {
    const p = worldToPercent(2029.6, -1266.6, DUST2);
    expect(p).not.toBeNull();
    expect(p!.x).toBeCloseTo(100, 5);
    expect(p!.y).toBeCloseTo(100, 5);
  });

  it("round-trips world → percent → world for an arbitrary point", () => {
    const orig = { x: -657.271362, y: -755.879639 };
    const pct = worldToPercent(orig.x, orig.y, DUST2);
    expect(pct).not.toBeNull();
    const back = percentToWorld(pct!.x, pct!.y, DUST2);
    expect(back).not.toBeNull();
    expect(back!.x).toBeCloseTo(orig.x, 5);
    expect(back!.y).toBeCloseTo(orig.y, 5);
  });
});

describe("worldToPixel — image-size scaling", () => {
  it("scales percent by image dimensions", () => {
    const pct = worldToPercent(-657.271362, -755.879639, DUST2);
    const px = worldToPixel(-657.271362, -755.879639, DUST2, 800, 800);
    expect(pct).not.toBeNull();
    expect(px).not.toBeNull();
    expect(px!.x).toBeCloseTo((pct!.x / 100) * 800, 5);
    expect(px!.y).toBeCloseTo((pct!.y / 100) * 800, 5);
  });

  it("handles non-square radar containers", () => {
    const px = worldToPixel(-223.2, 986.2, DUST2, 1024, 512);
    expect(px).not.toBeNull();
    expect(px!.x).toBeCloseTo(512, 5);
    expect(px!.y).toBeCloseTo(256, 5);
  });

  it("round-trips world → pixel → world within 0.01 units", () => {
    const orig = { x: -657.271362, y: -755.879639 };
    const px = worldToPixel(orig.x, orig.y, DUST2, 1024, 1024);
    expect(px).not.toBeNull();
    const back = pixelToWorld(px!.x, px!.y, DUST2, 1024, 1024);
    expect(back).not.toBeNull();
    expect(back!.x).toBeCloseTo(orig.x, 2);
    expect(back!.y).toBeCloseTo(orig.y, 2);
  });
});

describe("Dust 2 spawn landmark gate — T side", () => {
  for (const [label, worldX, worldY] of T_SPAWNS) {
    it(`T ${label} (${worldX}, ${worldY}) projects inside the T spawn box`, () => {
      const p = worldToPercent(worldX, worldY, DUST2);
      expect(p, `${label}: worldToPercent returned null`).not.toBeNull();
      expect(p!.x, `${label} x=${p!.x.toFixed(2)} outside [${T_SPAWN_BOX.minX}, ${T_SPAWN_BOX.maxX}]`).toBeGreaterThanOrEqual(T_SPAWN_BOX.minX);
      expect(p!.x).toBeLessThanOrEqual(T_SPAWN_BOX.maxX);
      expect(p!.y, `${label} y=${p!.y.toFixed(2)} outside [${T_SPAWN_BOX.minY}, ${T_SPAWN_BOX.maxY}]`).toBeGreaterThanOrEqual(T_SPAWN_BOX.minY);
      expect(p!.y).toBeLessThanOrEqual(T_SPAWN_BOX.maxY);
    });
  }
});

describe("Dust 2 spawn landmark gate — CT side", () => {
  for (const [label, worldX, worldY] of CT_SPAWNS) {
    it(`CT ${label} (${worldX}, ${worldY}) projects inside the CT spawn box`, () => {
      const p = worldToPercent(worldX, worldY, DUST2);
      expect(p, `${label}: worldToPercent returned null`).not.toBeNull();
      expect(p!.x, `${label} x=${p!.x.toFixed(2)} outside [${CT_SPAWN_BOX.minX}, ${CT_SPAWN_BOX.maxX}]`).toBeGreaterThanOrEqual(CT_SPAWN_BOX.minX);
      expect(p!.x).toBeLessThanOrEqual(CT_SPAWN_BOX.maxX);
      expect(p!.y, `${label} y=${p!.y.toFixed(2)} outside [${CT_SPAWN_BOX.minY}, ${CT_SPAWN_BOX.maxY}]`).toBeGreaterThanOrEqual(CT_SPAWN_BOX.minY);
      expect(p!.y).toBeLessThanOrEqual(CT_SPAWN_BOX.maxY);
    });
  }
});

describe("pointToPixel — world-or-percent resolver", () => {
  it("prefers world coords when present", () => {
    const expected = worldToPixel(-657.27, -755.88, DUST2, 800, 800);
    const got = pointToPixel({ world: { x: -657.27, y: -755.88 } }, DUST2, 800, 800);
    expect(got).toEqual(expected);
  });

  it("falls back to percent when world is absent", () => {
    const got = pointToPixel({ percent: { x: 50, y: 25 } }, DUST2, 800, 800);
    expect(got).not.toBeNull();
    expect(got!.x).toBeCloseTo(400, 5);
    expect(got!.y).toBeCloseTo(200, 5);
  });

  it("returns null when neither is present", () => {
    expect(pointToPixel({}, DUST2, 800, 800)).toBeNull();
    expect(pointToPixel(null, DUST2, 800, 800)).toBeNull();
    expect(pointToPixel(undefined, DUST2, 800, 800)).toBeNull();
  });
});

describe("Edge cases — invalid inputs return null", () => {
  it("non-finite world coords", () => {
    expect(worldToPercent(NaN, 0, DUST2)).toBeNull();
    expect(worldToPercent(0, Infinity, DUST2)).toBeNull();
  });

  it("non-finite percent coords", () => {
    expect(percentToWorld(NaN, 50, DUST2)).toBeNull();
  });

  it("non-finite or zero image dimensions", () => {
    expect(worldToPixel(0, 0, DUST2, 0, 100)).not.toBeNull(); // 0×N is mathematically valid here (px=0)
    expect(pixelToWorld(10, 10, DUST2, 0, 100)).toBeNull();
    expect(pixelToWorld(10, 10, DUST2, 100, NaN)).toBeNull();
  });

  it("scale of zero", () => {
    const bad: MapConfig = { ...DUST2, scale: 0 };
    expect(worldToPercent(0, 0, bad)).toBeNull();
  });
});
