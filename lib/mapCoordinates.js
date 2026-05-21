const DEFAULT_SOURCE_RESOLUTION = 1024;

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function hasWorldPointShape(point) {
  return point && typeof point === "object" && !Array.isArray(point) && "worldX" in point && "worldY" in point;
}

function hasPercentPointShape(point) {
  return point && typeof point === "object" && !Array.isArray(point) && "x" in point && "y" in point;
}

function mapMetaOk(mapMeta) {
  return !!(
    mapMeta &&
    isFiniteNumber(mapMeta.pos_x) &&
    isFiniteNumber(mapMeta.pos_y) &&
    isFiniteNumber(mapMeta.scale)
  );
}

/**
 * Canonical CS2 world -> radar percentage conversion.
 * Returns null for invalid input.
 */
export function worldToMapPercent(worldX, worldY, mapMeta) {
  if (!isFiniteNumber(worldX) || !isFiniteNumber(worldY) || !mapMetaOk(mapMeta)) return null;
  const sourceResolution = isFiniteNumber(mapMeta.sourceResolution)
    ? mapMeta.sourceResolution
    : DEFAULT_SOURCE_RESOLUTION;
  const totalUnits = mapMeta.scale * sourceResolution;
  if (!isFiniteNumber(totalUnits) || totalUnits === 0) return null;
  return {
    x: ((worldX - mapMeta.pos_x) / totalUnits) * 100,
    y: ((worldY - mapMeta.pos_y) / -totalUnits) * 100,
  };
}

/**
 * Inverse conversion: radar percentage -> CS2 world coordinates.
 * Returns null for invalid input.
 */
export function mapPercentToWorld(percentX, percentY, mapMeta) {
  if (!isFiniteNumber(percentX) || !isFiniteNumber(percentY) || !mapMetaOk(mapMeta)) return null;
  const sourceResolution = isFiniteNumber(mapMeta.sourceResolution)
    ? mapMeta.sourceResolution
    : DEFAULT_SOURCE_RESOLUTION;
  const totalUnits = mapMeta.scale * sourceResolution;
  if (!isFiniteNumber(totalUnits) || totalUnits === 0) return null;
  return {
    worldX: (percentX / 100) * totalUnits + mapMeta.pos_x,
    worldY: (percentY / 100) * -totalUnits + mapMeta.pos_y,
  };
}

/**
 * Resolve a hybrid point into radar percentage space.
 * Supports:
 * - { x, y } percent coordinates (0-100)
 * - { worldX, worldY } CS2 world coordinates
 */
export function resolveHybridPoint(point, mapMeta) {
  if (!point || typeof point !== "object" || Array.isArray(point)) return null;

  if (hasWorldPointShape(point)) {
    return worldToMapPercent(point.worldX, point.worldY, mapMeta);
  }

  if (hasPercentPointShape(point)) {
    if (!isFiniteNumber(point.x) || !isFiniteNumber(point.y)) return null;
    return { x: point.x, y: point.y };
  }

  return null;
}

export function isPercentPoint(point) {
  return !!(hasPercentPointShape(point) && isFiniteNumber(point.x) && isFiniteNumber(point.y));
}

export function isWorldPoint(point) {
  return !!(hasWorldPointShape(point) && isFiniteNumber(point.worldX) && isFiniteNumber(point.worldY));
}
