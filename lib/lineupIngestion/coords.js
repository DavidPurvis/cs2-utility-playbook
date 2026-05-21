import { getRadarMetadata } from "../../data/radarMetadata.js";
import { worldToMapPercent } from "../mapCoordinates.js";

export function parseSetposXY(posCmd) {
  if (!posCmd) return null;
  const m = String(posCmd).match(/setpos\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/i);
  if (!m) return null;
  return { worldX: Number(m[1]), worldY: Number(m[2]) };
}

export function roundPercent(point) {
  if (!point || typeof point.x !== "number" || typeof point.y !== "number") return null;
  return {
    x: Number(point.x.toFixed(3)),
    y: Number(point.y.toFixed(3)),
  };
}

export function percentFromPixelPoint(point, resolution) {
  if (!point || typeof point.x !== "number" || typeof point.y !== "number" || !resolution) return null;
  return roundPercent({
    x: (point.x / resolution) * 100,
    y: (point.y / resolution) * 100,
  });
}

export function inferResolution(records) {
  let max = 0;
  for (const r of records) {
    const values = [r?.throwFrom?.x, r?.throwFrom?.y, r?.throwTo?.x, r?.throwTo?.y].filter((v) => typeof v === "number");
    for (const v of values) max = Math.max(max, v);
  }
  if (max <= 1024) return 1024;
  if (max <= 2048) return 2048;
  return max || 1024;
}

export function resolveThrowFromWorld(mapId, worldPoint) {
  if (!worldPoint) return null;
  const mapMeta = getRadarMetadata(mapId);
  if (!mapMeta) return null;
  return roundPercent(worldToMapPercent(worldPoint.worldX, worldPoint.worldY, mapMeta));
}
