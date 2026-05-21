/**
 * Quantifiable stability metrics for map data + registry health.
 * Used by regression tests and `npm run test:metrics`.
 */

import { PREMIER_MAP_IDS } from "../../data/mapMeta.js";
import { validateAllMaps } from "../validateMapData.js";

export function classifyWarning(message) {
  if (typeof message !== "string") return "other";
  if (message.includes("YouTube search URL")) return "youtube_search";
  if (message.includes("screenshots.stand/aim/result are all empty")) return "empty_screenshots";
  if (message.includes("unknown util")) return "unknown_util";
  if (message.includes("empty roundTypes")) return "empty_round_types";
  if (message.includes("no lineups")) return "position_no_lineups";
  if (message.includes("missing or empty bullets")) return "empty_scenario_bullets";
  if (message.includes("MUST_LEARN has")) return "must_learn_count";
  if (message.includes("SPAWNS")) return "spawns";
  return "other";
}

/**
 * @param {Record<string, { module: object, id?: string, wip?: boolean }>} mapsObject
 */
export function buildStabilityReport(mapsObject) {
  const { byMap, errors, warnings } = validateAllMaps(mapsObject);
  const mapIds = Object.keys(mapsObject);
  const premierIds = PREMIER_MAP_IDS.filter((id) => mapIds.includes(id));

  let totalLineups = 0;
  let totalCombos = 0;
  let totalBelts = 0;
  let totalScenarios = 0;
  let totalPositions = 0;
  let totalSpawnSlots = 0;
  const warningBreakdown = {};
  const perMap = {};

  for (const [id, result] of Object.entries(byMap)) {
    const s = result.stats || {};
    totalLineups += s.lineupCount || 0;
    totalCombos += s.comboCount || 0;
    totalBelts += s.beltCount || 0;
    totalScenarios += s.scenarioCount || 0;
    totalPositions += s.positionCount || 0;
    totalSpawnSlots += s.spawnSlots || 0;

    const mapWarnings = { total: result.warnings.length, byType: {} };
    for (const msg of result.warnings) {
      const kind = classifyWarning(msg);
      mapWarnings.byType[kind] = (mapWarnings.byType[kind] || 0) + 1;
      warningBreakdown[kind] = (warningBreakdown[kind] || 0) + 1;
    }

    perMap[id] = {
      errors: result.errors.length,
      warnings: result.warnings.length,
      stats: { ...s },
      warningBreakdown: mapWarnings.byType,
    };
  }

  let premierChecks = 0;
  let premierPassed = 0;
  for (const id of premierIds) {
    const r = byMap[id];
    const s = r?.stats || {};
    const checks = [
      r.errors.length === 0,
      (s.comboCount || 0) >= 5,
      (s.beltCount || 0) >= 2,
      (s.scenarioCount || 0) >= 8,
      (s.positionCount || 0) >= 8,
      (s.spawnSlots || 0) >= 10,
      (s.lineupCount || 0) >= 12,
    ];
    premierChecks += checks.length;
    premierPassed += checks.filter(Boolean).length;
  }

  const dataIntegrityScore = errors === 0 ? 100 : 0;
  const premierCompletenessScore =
    premierChecks === 0 ? 0 : Math.round((premierPassed / premierChecks) * 100);

  const youtubeSearchWarnings = warningBreakdown.youtube_search || 0;
  const mediaQualityScore =
    totalLineups === 0
      ? 0
      : Math.max(0, Math.round(100 - (youtubeSearchWarnings / totalLineups) * 100));

  const warningBudgetScore = Math.max(
    0,
    Math.round(100 - Math.min(100, (warnings / Math.max(totalLineups, 1)) * 50))
  );

  const overallScore = Math.round(
    dataIntegrityScore * 0.45 +
      premierCompletenessScore * 0.35 +
      mediaQualityScore * 0.1 +
      warningBudgetScore * 0.1
  );

  return {
    version: 2,
    timestamp: new Date().toISOString(),
    scores: {
      overall: overallScore,
      dataIntegrity: dataIntegrityScore,
      premierCompleteness: premierCompletenessScore,
      mediaQuality: mediaQualityScore,
      warningBudget: warningBudgetScore,
    },
    totals: {
      maps: mapIds.length,
      premierMaps: premierIds.length,
      validationErrors: errors,
      validationWarnings: warnings,
      lineups: totalLineups,
      combos: totalCombos,
      belts: totalBelts,
      scenarios: totalScenarios,
      positions: totalPositions,
      spawnSlots: totalSpawnSlots,
    },
    warningBreakdown,
    perMap,
  };
}
