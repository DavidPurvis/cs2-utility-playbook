/**
 * CS2 world-coordinate ↔ radar-percentage conversion.
 *
 * Valve's radar overview files (in `lib/maps/overviews/<map>.txt`) declare
 * `pos_x`, `pos_y`, `scale` for each map. The PNG radar in
 * `cstrike/resource/overviews/<map>_radar_psd.png` is 1024×1024 by default,
 * with `pos_x, pos_y` mapping to the top-left corner (worldX increases right,
 * worldY increases UP) and `scale * 1024` worth of world units spanning each
 * axis. Y is inverted because screen Y points DOWN.
 *
 * Conversion is centralized here so every dot, zone vertex, and landmark
 * test goes through one function.
 */

export const VALVE_RADAR_SOURCE_RESOLUTION = 1024;

export interface RadarMeta {
  /** Map id used by Valve files, e.g. "de_dust2". */
  map: string;
  /** World X corresponding to the LEFT edge of the radar PNG. */
  pos_x: number;
  /** World Y corresponding to the TOP edge of the radar PNG. */
  pos_y: number;
  /** Scale factor; total world units along an axis = scale * sourceResolution. */
  scale: number;
  /** Optional override; almost always 1024. */
  sourceResolution?: number;
}

export interface WorldPoint {
  worldX: number;
  worldY: number;
}

export interface PercentPoint {
  x: number;
  y: number;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function totalUnits(meta: RadarMeta): number | null {
  const sourceRes = isFiniteNumber(meta.sourceResolution)
    ? meta.sourceResolution
    : VALVE_RADAR_SOURCE_RESOLUTION;
  const total = meta.scale * sourceRes;
  return isFiniteNumber(total) && total !== 0 ? total : null;
}

/**
 * World coordinates → radar percentage (0–100 on each axis).
 * Returns null if inputs are invalid.
 */
export function worldToMapPercent(
  worldX: number,
  worldY: number,
  meta: RadarMeta
): PercentPoint | null {
  if (!isFiniteNumber(worldX) || !isFiniteNumber(worldY)) return null;
  const total = totalUnits(meta);
  if (total === null) return null;
  return {
    x: ((worldX - meta.pos_x) / total) * 100,
    y: ((worldY - meta.pos_y) / -total) * 100,
  };
}

/**
 * Radar percentage → world coordinates. Inverse of worldToMapPercent.
 */
export function mapPercentToWorld(
  percentX: number,
  percentY: number,
  meta: RadarMeta
): WorldPoint | null {
  if (!isFiniteNumber(percentX) || !isFiniteNumber(percentY)) return null;
  const total = totalUnits(meta);
  if (total === null) return null;
  return {
    worldX: (percentX / 100) * total + meta.pos_x,
    worldY: (percentY / 100) * -total + meta.pos_y,
  };
}

/**
 * Convenience: convert a `WorldPoint` directly to a `PercentPoint`.
 */
export function worldPointToPercent(
  point: WorldPoint,
  meta: RadarMeta
): PercentPoint | null {
  return worldToMapPercent(point.worldX, point.worldY, meta);
}

/**
 * Convenience: convert a `PercentPoint` directly to a `WorldPoint`.
 */
export function percentPointToWorld(
  point: PercentPoint,
  meta: RadarMeta
): WorldPoint | null {
  return mapPercentToWorld(point.x, point.y, meta);
}
