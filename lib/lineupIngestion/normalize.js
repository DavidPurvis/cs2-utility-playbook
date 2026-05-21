import { CS2UTIL_BASE, CSNADES_BASE, TEAM_MAP, UTIL_MAP } from "./constants.js";
import { parseSetposXY, percentFromPixelPoint, resolveThrowFromWorld, roundPercent } from "./coords.js";
import { parseFromTo, normalizeWhitespace, slugify } from "./text.js";

export function mapUtil(value) {
  if (!value) return null;
  return UTIL_MAP.get(String(value).toLowerCase()) || null;
}

export function mapTeam(value) {
  if (!value) return null;
  return TEAM_MAP.get(String(value).toLowerCase()) || null;
}

export function isCs2UtilLineupObject(obj) {
  return !!(
    obj &&
    typeof obj === "object" &&
    obj.positionId &&
    obj.mapId &&
    obj.type &&
    obj.team &&
    obj.mapPos &&
    typeof obj.mapPos.x === "number" &&
    typeof obj.mapPos.y === "number"
  );
}

export function isCsnadesLineupObject(obj) {
  return !!(
    obj &&
    typeof obj === "object" &&
    obj.slug &&
    obj.team &&
    obj.type &&
    obj.throwFrom &&
    obj.throwTo &&
    typeof obj.throwFrom.x === "number" &&
    typeof obj.throwFrom.y === "number" &&
    typeof obj.throwTo.x === "number" &&
    typeof obj.throwTo.y === "number"
  );
}

function buildCoordPair({ percent, world, raw }) {
  const out = {};
  if (percent) out.percent = percent;
  if (world) out.world = world;
  if (raw) out.raw = raw;
  return Object.keys(out).length ? out : null;
}

export function normalizeCs2UtilRecord(obj, { mapId = obj.mapId, pageUrl = null } = {}) {
  const utilType = mapUtil(obj.type);
  const team = mapTeam(obj.team);
  if (!utilType || !team) return null;

  const displayName = normalizeWhitespace(obj?.translations?.en?.name || obj.positionId || "");
  const instructions = normalizeWhitespace(obj?.translations?.en?.instruction || "").replace(/\\n/g, "\n");
  const fromTo = parseFromTo({ name: displayName, slug: obj.positionId });
  const throwFromWorld = parseSetposXY(obj.pos);
  const resolvedMapId = obj.mapId || mapId;
  // cs2util mapPos is on their radar image; setpos + Valve metadata matches our MurkyYT radar.
  const throwFromPercent =
    resolveThrowFromWorld(resolvedMapId, throwFromWorld) ||
    roundPercent({
      x: Number(obj.mapPos.x),
      y: Number(obj.mapPos.y),
    });

  return {
    source: "cs2util",
    mapId: obj.mapId || mapId,
    grenadeType: utilType,
    team,
    id: obj.id,
    slug: obj.positionId,
    title: displayName,
    from: fromTo.from,
    to: fromTo.to,
    instructions,
    throwFrom: buildCoordPair({
      percent: throwFromPercent,
      world: throwFromWorld,
    }),
    landingAt: null,
    posCommand: obj.pos || null,
    throwMeta: {
      movement: obj.movement || null,
      mouseButton: obj.mouseButton || null,
      needJump: Boolean(obj.needJump),
      throwTime: typeof obj.throwTime === "number" ? obj.throwTime : null,
      difficulty: obj.difficulty || null,
    },
    media: {
      page: pageUrl || `${CS2UTIL_BASE}/${mapId}/${obj.type}/${obj.positionId}`,
      cover: obj.coverImg || null,
      lineup: obj.lineupUrl || null,
      lineupMini: obj.lineupMiniUrl || null,
      videoWebm: obj.videoUrl1kWebm || null,
      videoMp4: obj.videoUrl1kMp4 || null,
    },
    attribution: {
      cs2util: {
        externalId: obj.id,
        slug: obj.positionId,
        url: pageUrl || `${CS2UTIL_BASE}/${mapId}/${obj.type}/${obj.positionId}`,
      },
    },
    parseStatus: "ok",
  };
}

export function normalizeCsnadesRecord(obj, { mapId, resolution = inferResolutionForRecord(obj) }) {
  const utilType = mapUtil(obj.type);
  const team = mapTeam(obj.team);
  if (!utilType || !team) return null;

  const fromTo = parseFromTo({
    name: obj.slug,
    slug: obj.slug,
    titleFrom: obj.titleFrom,
    titleTo: obj.titleTo,
  });

  const throwFromPercent = percentFromPixelPoint(obj.throwFrom, resolution);
  const landingPercent = percentFromPixelPoint(obj.throwTo, resolution);

  return {
    source: "csnades",
    mapId,
    grenadeType: utilType,
    team,
    id: obj.id,
    slug: obj.slug,
    title: fromTo.to ? `${fromTo.to} from ${fromTo.from}`.trim() : obj.slug,
    name: obj.slug,
    from: fromTo.from,
    to: fromTo.to,
    instructions: null,
    throwFrom: buildCoordPair({
      percent: throwFromPercent,
      raw: { x: obj.throwFrom.x, y: obj.throwFrom.y },
    }),
    landingAt: buildCoordPair({
      percent: landingPercent,
      raw: { x: obj.throwTo.x, y: obj.throwTo.y },
    }),
    posCommand: null,
    throwMeta: {
      movement: obj.movement || null,
      technique: obj.technique || null,
      precision: obj.precision || null,
      beginner: Boolean(obj.beginner),
    },
    media: {
      page: `${CSNADES_BASE}/${mapId}/${obj.slug}`,
      cover: obj.assets?.thumbnail || null,
      lineup: obj.assets?.lineup || null,
      video: obj.assets?.videoHq?.webm || obj.assets?.videoHq?.mp4 || null,
    },
    attribution: {
      csnades: {
        externalId: obj.id,
        slug: obj.slug,
        url: `${CSNADES_BASE}/${mapId}/${obj.slug}`,
      },
    },
    resolution,
    parseStatus: "ok",
  };
}

function inferResolutionForRecord(obj) {
  const values = [obj?.throwFrom?.x, obj?.throwFrom?.y, obj?.throwTo?.x, obj?.throwTo?.y].filter((v) => typeof v === "number");
  const max = values.length ? Math.max(...values) : 0;
  if (max <= 1024) return 1024;
  if (max <= 2048) return 2048;
  return max || 1024;
}

export function toImportRecord(record, { backupFilledFromCsnades = false, csnadesBackup = null, importStatus = "primary" } = {}) {
  const importId = `${record.mapId}:${record.grenadeType}:${slugify(record.slug || record.title)}`;

  return {
    id: importId,
    mapId: record.mapId,
    grenadeType: record.grenadeType,
    team: record.team,
    slug: record.slug,
    title: record.title,
    from: record.from,
    to: record.to,
    instructions: record.instructions || csnadesBackup?.instructions || null,
    throwFrom: record.throwFrom || csnadesBackup?.throwFrom || null,
    landingAt: record.landingAt || csnadesBackup?.landingAt || null,
    posCommand: record.posCommand || csnadesBackup?.posCommand || null,
    throwMeta: record.throwMeta || csnadesBackup?.throwMeta || null,
    media: {
      ...(csnadesBackup?.media || {}),
      ...(record.media || {}),
    },
    source: {
      primary: record.source === "csnades" && importStatus === "backup_only" ? "csnades" : "cs2util",
      backupFilledFromCsnades,
      importStatus,
    },
    attribution: {
      ...(csnadesBackup?.attribution || {}),
      ...(record.attribution || {}),
    },
  };
}

export function mergeCsnadesEnrichment(primary, backup, { matchScore = null } = {}) {
  if (!backup) return primary;

  const landingAt = primary.landingAt || backup.landingAt || null;
  const throwFrom = primary.throwFrom || backup.throwFrom || null;

  return {
    ...primary,
    landingAt,
    throwFrom,
    instructions: primary.instructions || backup.instructions || null,
    media: {
      ...backup.media,
      ...primary.media,
    },
    attribution: {
      ...backup.attribution,
      ...primary.attribution,
    },
    source: {
      primary: "cs2util",
      backupFilledFromCsnades: true,
      importStatus: "enriched",
      matchScore,
    },
  };
}
