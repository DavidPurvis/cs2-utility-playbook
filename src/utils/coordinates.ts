/**
 * CS2 world ↔ radar coordinate conversion.
 *
 * The formula lives here in ONE place. Every dot in the app traces
 * back to these four functions. Tests live in coordinates.test.ts
 * and must pass before any rendering code is written.
 *
 * The math comes from Valve's overview .txt files for each map:
 *
 *   percent_x = ((worldX - pos_x) / (scale × sourceResolution)) × 100
 *   percent_y = ((worldY - pos_y) / -(scale × sourceResolution)) × 100   // Y inverted
 *
 * Pixel coords are the percent values scaled by the rendered radar
 * image's size. They depend on the display size; world and percent
 * do not.
 */
import type { MapConfig, PercentPoint, PixelPoint, WorldPoint } from "../types/map";

const DEFAULT_SOURCE_RESOLUTION = 1024;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function totalUnits(cfg: MapConfig): number | null {
  const res = isFiniteNumber(cfg.sourceResolution) ? cfg.sourceResolution : DEFAULT_SOURCE_RESOLUTION;
  const total = cfg.scale * res;
  return isFiniteNumber(total) && total !== 0 ? total : null;
}

function configOk(cfg: MapConfig | null | undefined): cfg is MapConfig {
  return (
    !!cfg &&
    isFiniteNumber(cfg.pos_x) &&
    isFiniteNumber(cfg.pos_y) &&
    isFiniteNumber(cfg.scale)
  );
}

/**
 * World → radar percentage (0–100).
 */
export function worldToPercent(
  worldX: number,
  worldY: number,
  cfg: MapConfig
): PercentPoint | null {
  if (!isFiniteNumber(worldX) || !isFiniteNumber(worldY) || !configOk(cfg)) return null;
  const total = totalUnits(cfg);
  if (total === null) return null;
  return {
    x: ((worldX - cfg.pos_x) / total) * 100,
    y: ((worldY - cfg.pos_y) / -total) * 100,
  };
}

/**
 * Radar percentage → world coordinates.
 */
export function percentToWorld(
  percentX: number,
  percentY: number,
  cfg: MapConfig
): WorldPoint | null {
  if (!isFiniteNumber(percentX) || !isFiniteNumber(percentY) || !configOk(cfg)) return null;
  const total = totalUnits(cfg);
  if (total === null) return null;
  return {
    x: (percentX / 100) * total + cfg.pos_x,
    y: (percentY / 100) * -total + cfg.pos_y,
  };
}

/**
 * World → pixel coordinates on a rendered radar image of given size.
 */
export function worldToPixel(
  worldX: number,
  worldY: number,
  cfg: MapConfig,
  imageWidth: number,
  imageHeight: number
): PixelPoint | null {
  if (!isFiniteNumber(imageWidth) || !isFiniteNumber(imageHeight)) return null;
  const pct = worldToPercent(worldX, worldY, cfg);
  if (!pct) return null;
  return {
    x: (pct.x / 100) * imageWidth,
    y: (pct.y / 100) * imageHeight,
  };
}

/**
 * Pixel coordinates on a rendered radar image → world coords.
 * Used by the admin "click-to-place landing" workflow.
 */
export function pixelToWorld(
  pixelX: number,
  pixelY: number,
  cfg: MapConfig,
  imageWidth: number,
  imageHeight: number
): WorldPoint | null {
  if (!isFiniteNumber(pixelX) || !isFiniteNumber(pixelY)) return null;
  if (!isFiniteNumber(imageWidth) || imageWidth <= 0) return null;
  if (!isFiniteNumber(imageHeight) || imageHeight <= 0) return null;
  return percentToWorld((pixelX / imageWidth) * 100, (pixelY / imageHeight) * 100, cfg);
}

/**
 * Convenience: resolve a world or percent point to pixel coords.
 * Prefer world; fall back to percent. Returns null if neither is set.
 */
export function pointToPixel(
  point: { world?: WorldPoint; percent?: PercentPoint } | null | undefined,
  cfg: MapConfig,
  imageWidth: number,
  imageHeight: number
): PixelPoint | null {
  if (!point) return null;
  if (point.world) {
    return worldToPixel(point.world.x, point.world.y, cfg, imageWidth, imageHeight);
  }
  if (point.percent) {
    return {
      x: (point.percent.x / 100) * imageWidth,
      y: (point.percent.y / 100) * imageHeight,
    };
  }
  return null;
}
