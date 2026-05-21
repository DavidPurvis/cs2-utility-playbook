/**
 * Community-verified Dust 2 landmark positions for coordinate-system tests.
 *
 * Each entry: world coordinates → expected radar percentage (0-100).
 * Tolerance is in percentage points.
 *
 * Source: community Steam guide #3337501004 + cs2util.com setpos data.
 */
export interface Dust2Landmark {
  name: string;
  worldX: number;
  worldY: number;
  expectedPercentX: number;
  expectedPercentY: number;
  tolerancePercent: number;
}

export const DUST2_LANDMARKS: readonly Dust2Landmark[] = [
  {
    name: "T Spawn",
    worldX: -657,
    worldY: -756,
    expectedPercentX: 40.37,
    expectedPercentY: 88.67,
    tolerancePercent: 2.0,
  },
  {
    name: "A Site default plant",
    worldX: 1226,
    worldY: 2499,
    expectedPercentX: 82.16,
    expectedPercentY: 16.42,
    tolerancePercent: 2.0,
  },
  {
    name: "B Site default plant",
    worldX: -1355,
    worldY: 2523,
    expectedPercentX: 24.88,
    expectedPercentY: 15.89,
    tolerancePercent: 2.0,
  },
  {
    name: "Radar center",
    worldX: -223.2,
    worldY: 986.2,
    expectedPercentX: 50,
    expectedPercentY: 50,
    tolerancePercent: 0.5,
  },
  {
    name: "Radar upper-left bound",
    worldX: -2476,
    worldY: 3239,
    expectedPercentX: 0,
    expectedPercentY: 0,
    tolerancePercent: 0.5,
  },
  {
    name: "Radar lower-right bound",
    worldX: 2029.6,
    worldY: -1266.6,
    expectedPercentX: 100,
    expectedPercentY: 100,
    tolerancePercent: 0.5,
  },
];
