/**
 * Approximate map-area bounding boxes in radar percentage space.
 *
 * These regions are intentionally broad callout envelopes to catch
 * conversion drift (wrong scale, flipped Y, origin offsets) without
 * over-fitting to a single lineup dot.
 */
export const LINEUP_CALLOUT_REGIONS = {
  ancient: {
    Mid: { minX: 23, maxX: 54, minY: 23, maxY: 75 },
    A: { minX: 11, maxX: 43, minY: 21, maxY: 59 },
    B: { minX: 35, maxX: 75, minY: 28, maxY: 79 },
  },
  dust2: {
    Mid: { minX: 23, maxX: 69, minY: 13, maxY: 85 },
    A: { minX: 41, maxX: 79, minY: 11, maxY: 69 },
    B: { minX: 11, maxX: 35, minY: 25, maxY: 62 },
  },
  inferno: {
    Banana: { minX: 11, maxX: 33, minY: 35, maxY: 75 },
    B: { minX: 9, maxX: 32, minY: 23, maxY: 62 },
    A: { minX: 28, maxX: 65, minY: 9, maxY: 51 },
    Mid: { minX: 35, maxX: 57, minY: 41, maxY: 79 },
  },
  mirage: {
    A: { minX: 39, maxX: 79, minY: 11, maxY: 87 },
    Mid: { minX: 38, maxX: 62, minY: 25, maxY: 62 },
    B: { minX: 8, maxX: 45, minY: 21, maxY: 57 },
  },
  nuke: {
    A: { minX: 37, maxX: 85, minY: 21, maxY: 57 },
    B: { minX: 8, maxX: 62, minY: 45, maxY: 75 },
  },
  anubis: {
    Mid: { minX: 28, maxX: 69, minY: 13, maxY: 79 },
    A: { minX: 15, maxX: 39, minY: 11, maxY: 59 },
    B: { minX: 55, maxX: 83, minY: 13, maxY: 60 },
  },
  overpass: {
    B: { minX: 18, maxX: 82, minY: 33, maxY: 75 },
    A: { minX: 13, maxX: 67, minY: 11, maxY: 57 },
    Connector: { minX: 38, maxX: 62, minY: 28, maxY: 65 },
  },
  cache: {
    Mid: { minX: 25, maxX: 59, minY: 33, maxY: 61 },
    A: { minX: 9, maxX: 45, minY: 21, maxY: 52 },
    B: { minX: 46, maxX: 87, minY: 48, maxY: 79 },
  },
};
