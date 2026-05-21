import { describe, expect, it } from "vitest";
import { squareBoundsFromPercents, worldDistSq } from "./bounds";

describe("squareBoundsFromPercents", () => {
  it("returns the full canvas when no points are supplied", () => {
    expect(squareBoundsFromPercents([], 0)).toEqual({ x: 0, y: 0, width: 100, height: 100 });
  });

  it("centers a square box on the cluster with padding", () => {
    const b = squareBoundsFromPercents(
      [
        { x: 40, y: 80 },
        { x: 50, y: 90 },
      ],
      2
    );
    // span 10 → half 5 + padding 2 = 7 → side 14
    expect(b.width).toBeCloseTo(14);
    expect(b.height).toBeCloseTo(14);
    // center was (45, 85), so x = 45 - 7 = 38, y = 85 - 7 = 78
    expect(b.x).toBeCloseTo(38);
    expect(b.y).toBeCloseTo(78);
  });

  it("clamps the box to fit within 0..100", () => {
    const b = squareBoundsFromPercents(
      [
        { x: 95, y: 95 },
        { x: 99, y: 99 },
      ],
      4
    );
    // cluster span 4 → half 2 + pad 4 = 6 → side 12. Center (97,97) →
    // raw box (91..103) which gets shifted to (88..100).
    expect(b.width).toBeCloseTo(12);
    expect(b.x + b.width).toBeLessThanOrEqual(100 + 1e-6);
    expect(b.y + b.height).toBeLessThanOrEqual(100 + 1e-6);
  });
});

describe("worldDistSq", () => {
  it("returns 0 for identical points", () => {
    expect(worldDistSq({ x: 1, y: 2 }, { x: 1, y: 2 })).toBe(0);
  });
  it("is x^2+y^2", () => {
    expect(worldDistSq({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(25);
  });
});
