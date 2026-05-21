/**
 * Bounding-box helpers used by the spawn picker to auto-zoom on a
 * subset of percent-space points. All math stays in percent space
 * (0..100) so it composes cleanly with MapRenderer's viewBox prop.
 */
import { worldToPercent } from "./coordinates";
import type { MapConfig, Spawn, WorldPoint } from "../types";

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Square bounds that fully contain every supplied percent point, plus padding. */
export function squareBoundsFromPercents(
  points: Array<{ x: number; y: number }>,
  paddingPct: number
): Bounds {
  if (points.length === 0) {
    return { x: 0, y: 0, width: 100, height: 100 };
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  // Square the box around its center so the SVG aspect ratio stays
  // honest; pick whichever axis is wider.
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const half = Math.max(maxX - minX, maxY - minY) / 2 + paddingPct;
  const side = half * 2;
  let x = cx - half;
  let y = cy - half;
  // Clamp to the [0..100] canvas — shift the rect rather than letting
  // it run off-canvas, so the radar image always fills it.
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x + side > 100) x = 100 - side;
  if (y + side > 100) y = 100 - side;
  return { x, y, width: side, height: side };
}

/** Bounding box for a spawn list, projected through the active map config. */
export function spawnClusterBounds(
  spawns: Spawn[],
  config: MapConfig,
  paddingPct = 4
): Bounds {
  const pts: Array<{ x: number; y: number }> = [];
  for (const s of spawns) {
    const p = worldToPercent(s.world.x, s.world.y, config);
    if (p) pts.push(p);
  }
  return squareBoundsFromPercents(pts, paddingPct);
}

/**
 * Squared distance between two world points (ignoring Z). Used to ask
 * "is this utility's throwFrom near that spawn" without an expensive
 * sqrt — callers compare against `radius * radius`.
 */
export function worldDistSq(a: WorldPoint, b: WorldPoint): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}
