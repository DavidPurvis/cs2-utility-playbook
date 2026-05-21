import type { Zone } from "./types";

/**
 * Dust 2 callout zones used by the playbook UI.
 *
 * Polygons are simple convex shapes in CS2 world coordinates. They are
 * derived from approximate radar percentages by inverting
 * `worldToMapPercent`: worldX = (pct/100) * 4505.6 - 2476,
 * worldY = -(pct/100) * 4505.6 + 3239.
 *
 * Zones are intentionally generous — they exist to filter lineups by
 * landing area, not to be a pixel-perfect callout map. Two zones can
 * overlap; lineups are tagged by `landsAt` callout name as ground truth.
 */
export const DUST2_ZONES: readonly Zone[] = [
  // ── Target zones (where utility lands) ───────────────────────────────────
  {
    id: "a_site",
    name: "A Site",
    site: "A",
    polygon: [
      { x: 750, y: 2900 },
      { x: 1800, y: 2900 },
      { x: 1800, y: 1900 },
      { x: 750, y: 1900 },
    ],
  },
  {
    id: "a_long",
    name: "A Long",
    site: "A",
    polygon: [
      { x: 350, y: 1900 },
      { x: 1300, y: 1900 },
      { x: 1300, y: 350 },
      { x: 350, y: 350 },
    ],
  },
  {
    id: "a_short_cat",
    name: "A Short / Cat",
    site: "A",
    polygon: [
      { x: -300, y: 1900 },
      { x: 750, y: 1900 },
      { x: 750, y: 750 },
      { x: -300, y: 750 },
    ],
  },
  {
    id: "b_site",
    name: "B Site",
    site: "B",
    polygon: [
      { x: -1900, y: 2900 },
      { x: -800, y: 2900 },
      { x: -800, y: 1900 },
      { x: -1900, y: 1900 },
    ],
  },
  {
    id: "b_tunnels",
    name: "B Tunnels",
    site: "B",
    polygon: [
      { x: -2100, y: 1900 },
      { x: -1000, y: 1900 },
      { x: -1000, y: 250 },
      { x: -2100, y: 250 },
    ],
  },
  {
    id: "b_doors",
    name: "B Doors",
    site: "B",
    polygon: [
      { x: -1300, y: 2500 },
      { x: -800, y: 2500 },
      { x: -800, y: 1900 },
      { x: -1300, y: 1900 },
    ],
  },
  // ── Mid control ─────────────────────────────────────────────────────────
  {
    id: "mid",
    name: "Mid",
    site: "MID",
    polygon: [
      { x: -700, y: 1200 },
      { x: 400, y: 1200 },
      { x: 400, y: -200 },
      { x: -700, y: -200 },
    ],
  },
  {
    id: "xbox",
    name: "Xbox",
    site: "MID",
    polygon: [
      { x: -550, y: 900 },
      { x: -150, y: 900 },
      { x: -150, y: 400 },
      { x: -550, y: 400 },
    ],
  },
  {
    id: "ct_mid",
    name: "CT Mid",
    site: "MID",
    polygon: [
      { x: -700, y: 2300 },
      { x: 200, y: 2300 },
      { x: 200, y: 1200 },
      { x: -700, y: 1200 },
    ],
  },
  // ── Spawn zones ─────────────────────────────────────────────────────────
  {
    id: "ct_spawn",
    name: "CT Spawn",
    site: "MID",
    polygon: [
      { x: -100, y: 2900 },
      { x: 1100, y: 2900 },
      { x: 1100, y: 2100 },
      { x: -100, y: 2100 },
    ],
  },
  {
    id: "t_spawn",
    name: "T Spawn",
    site: "MID",
    polygon: [
      { x: -1100, y: -200 },
      { x: 100, y: -200 },
      { x: 100, y: -1250 },
      { x: -1100, y: -1250 },
    ],
  },
];

/**
 * Quick lookup by zone id.
 */
export const DUST2_ZONES_BY_ID: Readonly<Record<string, Zone>> =
  Object.fromEntries(DUST2_ZONES.map((z) => [z.id, z]));
