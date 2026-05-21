import { describe, expect, it } from "vitest";
import MAPS from "../data/maps-registry.js";
import { validateAllMaps } from "./validateMapData.js";

describe("map data integrity", () => {
  it("reports zero validation errors for every map in the registry", () => {
    const { byMap, errors, warnings } = validateAllMaps(MAPS);
    const errorLines = Object.entries(byMap).flatMap(([id, r]) =>
      r.errors.map((msg) => `[${id}] ${msg}`)
    );
    if (errorLines.length > 0) {
      console.error(errorLines.join("\n"));
    }
    expect(errorLines).toEqual([]);
    expect(errors).toBe(0);
    if (warnings > 0) {
      // Visible in CI logs as a soft signal (belt length, optional fields, etc.)
      const warnLines = Object.entries(byMap).flatMap(([id, r]) =>
        r.warnings.map((msg) => `[${id}] ${msg}`)
      );
      console.info(`Map data warnings (${warnings}):`, warnLines.join("\n"));
    }
  });

  it("exposes aggregate lineup counts for regression metrics", () => {
    const { byMap } = validateAllMaps(MAPS);
    let lineups = 0;
    for (const r of Object.values(byMap)) {
      lineups += r.stats.lineupCount || 0;
    }
    expect(lineups).toBeGreaterThanOrEqual(148);
  });
});
