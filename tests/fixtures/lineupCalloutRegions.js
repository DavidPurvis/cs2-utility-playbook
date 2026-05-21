/**
 * Approximate map-area bounding boxes in radar percentage space.
 *
 * These regions are intentionally broad callout envelopes to catch
 * conversion drift (wrong scale, flipped Y, origin offsets) without
 * over-fitting to a single lineup dot.
 */
export const LINEUP_CALLOUT_REGIONS = {
  ancient: {
    Mid: { minX: 23, maxX: 54, minY: 23, maxY: 79 },
    A: { minX: 11, maxX: 41, minY: 21, maxY: 59 },
    B: { minX: 35, maxX: 75, minY: 30, maxY: 79 },
  },
  dust2: {
    Mid: { minX: 23, maxX: 69, minY: 13, maxY: 85 },
    A: { minX: 41, maxX: 79, minY: 11, maxY: 69 },
    B: { minX: 11, maxX: 35, minY: 25, maxY: 65 },
  },
  inferno: {
    Banana: { minX: 18, maxX: 55, minY: 35, maxY: 75 },
    B: { minX: 18, maxX: 65, minY: 23, maxY: 68 },
    A: { minX: 35, maxX: 65, minY: 9, maxY: 47 },
    Mid: { minX: 35, maxX: 54, minY: 42, maxY: 80 },
  },
  mirage: {
    A: { minX: 39, maxX: 78, minY: 11, maxY: 87 },
    Mid: { minX: 40, maxX: 57, minY: 25, maxY: 61 },
    B: { minX: 8, maxX: 46, minY: 21, maxY: 54 },
  },
  nuke: {
    A: { minX: 37, maxX: 85, minY: 21, maxY: 57 },
    B: { minX: 8, maxX: 62, minY: 45, maxY: 75 },
  },
  anubis: {
    Mid: { minX: 28, maxX: 66, minY: 13, maxY: 77 },
    A: { minX: 17, maxX: 42, minY: 11, maxY: 59 },
    B: { minX: 53, maxX: 83, minY: 13, maxY: 60 },
  },
  overpass: {
    B: { minX: 18, maxX: 82, minY: 33, maxY: 80 },
    A: { minX: 13, maxX: 65, minY: 11, maxY: 57 },
    Connector: { minX: 38, maxX: 62, minY: 28, maxY: 65 },
  },
  cache: {
    Mid: { minX: 25, maxX: 59, minY: 33, maxY: 61 },
    A: { minX: 10, maxX: 45, minY: 23, maxY: 52 },
    B: { minX: 46, maxX: 87, minY: 48, maxY: 79 },
  },
};
