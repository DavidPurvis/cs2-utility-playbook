import { describe, expect, it } from "vitest";
import MAPS from "../data/maps-registry.js";
import baseline from "./fixtures/stability-baseline.json";
import { buildStabilityReport, classifyWarning } from "./helpers/stabilityMetrics.js";

describe("stability metrics", () => {
  const report = buildStabilityReport(MAPS);

  it("classifies known warning patterns", () => {
    expect(classifyWarning("[ancient].LINEUPS.x: video is a YouTube search URL")).toBe(
      "youtube_search"
    );
    expect(classifyWarning("[cache].LINEUPS.x: screenshots.stand/aim/result are all empty")).toBe(
      "empty_screenshots"
    );
  });

  it("reports zero validation errors (data integrity gate)", () => {
    expect(report.totals.validationErrors).toBe(0);
    expect(report.scores.dataIntegrity).toBe(baseline.stabilityFloors.dataIntegrityMin);
  });

  it("meets stability score floors from baseline", () => {
    expect(report.scores.overall).toBeGreaterThanOrEqual(baseline.stabilityFloors.overallScoreMin);
    expect(report.scores.premierCompleteness).toBeGreaterThanOrEqual(
      baseline.stabilityFloors.premierCompletenessMin
    );
    expect(report.scores.mediaQuality).toBeGreaterThanOrEqual(
      baseline.stabilityFloors.mediaQualityMin
    );
  });

  it("tracks aggregate content totals for regression", () => {
    expect(report.totals.maps).toBe(baseline.totals.mapsInRegistry);
    expect(report.totals.premierMaps).toBe(baseline.totals.premierMaps);
    expect(report.totals.lineups).toBeGreaterThanOrEqual(baseline.totals.minLineupsAllMaps);
    expect(report.totals.validationWarnings).toBeLessThanOrEqual(baseline.totals.maxWarnings);
  });

  it("exposes per-map stats aligned with frozen baseline", () => {
    for (const [id, expected] of Object.entries(baseline.premier)) {
      const actual = report.perMap[id]?.stats;
      expect(actual, `missing stats for ${id}`).toBeDefined();
      expect(actual.lineupCount).toBeGreaterThanOrEqual(expected.lineups);
      expect(actual.comboCount).toBeGreaterThanOrEqual(expected.combos);
      expect(actual.beltCount).toBeGreaterThanOrEqual(expected.belts);
      expect(actual.scenarioCount).toBeGreaterThanOrEqual(expected.scenarios);
      expect(actual.positionCount).toBeGreaterThanOrEqual(expected.positions);
      expect(actual.spawnSlots).toBeGreaterThanOrEqual(expected.spawnSlots);
    }
    for (const [id, expected] of Object.entries(baseline.bonus)) {
      const actual = report.perMap[id]?.stats;
      expect(actual.lineupCount).toBeGreaterThanOrEqual(expected.lineups);
    }
  });

  it("prints a one-line stability summary for CI logs", () => {
    const summary = [
      `stability overall=${report.scores.overall}`,
      `integrity=${report.scores.dataIntegrity}`,
      `premier=${report.scores.premierCompleteness}`,
      `lineups=${report.totals.lineups}`,
      `warnings=${report.totals.validationWarnings}`,
    ].join(" ");
    console.info(summary);
    expect(summary.length).toBeGreaterThan(10);
  });
});
