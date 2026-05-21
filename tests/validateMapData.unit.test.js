import { describe, expect, it } from "vitest";
import {
  GRENADE_CARRY_CAP,
  inPctRange,
  validateMapModule,
} from "./validateMapData.js";
import {
  mapMissingExports,
  mapWithBadRadarScale,
  mapWithBeltOverload,
  mapWithMixedPointSchema,
  mapWithMustLearnMismatch,
  mapWithWorldCoordinatePoints,
  minimalValidMap,
} from "./fixtures/mockMapModules.js";

describe("inPctRange", () => {
  it("accepts 0 and 100 as valid percentage coordinates", () => {
    expect(inPctRange(0)).toBe(true);
    expect(inPctRange(100)).toBe(true);
    expect(inPctRange(50)).toBe(true);
  });

  it("rejects normalized 0–1 radar scale mistakes", () => {
    expect(inPctRange(0.5)).toBe(false);
    expect(inPctRange(0.01)).toBe(false);
  });

  it("rejects out-of-range and non-finite values", () => {
    expect(inPctRange(-1)).toBe(false);
    expect(inPctRange(101)).toBe(false);
    expect(inPctRange(NaN)).toBe(false);
    expect(inPctRange("50")).toBe(false);
    expect(inPctRange(undefined)).toBe(false);
  });
});

describe("validateMapModule", () => {
  it("passes a minimal well-formed map module", () => {
    const r = validateMapModule(minimalValidMap(), "testmap", { wip: true });
    expect(r.errors).toEqual([]);
  });

  it("accepts world-coordinate point schema for lineup, setup, and spawns", () => {
    const r = validateMapModule(mapWithWorldCoordinatePoints(), "testmap", { wip: true });
    expect(r.errors).toEqual([]);
  });

  it("reports missing required exports", () => {
    const r = validateMapModule(mapMissingExports(), "broken");
    expect(r.errors.some((e) => e.includes("Missing export"))).toBe(true);
  });

  it("warns when MUST_LEARN has fewer than 5 entries (cs2util-only mode)", () => {
    const mod = minimalValidMap({ MUST_LEARN: ["l1", "l2"] });
    const r = validateMapModule(mod, "mirage");
    // Was an error; now a warning so the strict-accuracy mode can drop
    // unverified picks without breaking validation.
    expect(r.warnings.some((w) => w.includes("MUST_LEARN has only"))).toBe(true);
  });

  it("rejects more than five MUST_LEARN entries", () => {
    const mod = minimalValidMap({ MUST_LEARN: ["l1", "l2", "l3", "l4", "l5", "l6"] });
    const r = validateMapModule(mod, "mirage");
    expect(r.errors.some((e) => e.includes("at most 5"))).toBe(true);
  });

  it("syncs mustLearn flag with MUST_LEARN array", () => {
    const r = validateMapModule(mapWithMustLearnMismatch(), "testmap", { wip: true });
    expect(r.errors.some((e) => e.includes("must have mustLearn: true"))).toBe(true);
  });

  it("rejects radar coordinates in 0–1 scale", () => {
    const r = validateMapModule(mapWithBadRadarScale(), "testmap", { wip: true });
    expect(r.errors.some((e) => e.includes("radarPos.x"))).toBe(true);
  });

  it("rejects mixed point schema that combines percent and world keys", () => {
    const r = validateMapModule(mapWithMixedPointSchema(), "testmap", { wip: true });
    expect(r.errors.some((e) => e.includes("cannot mix x/y with worldX/worldY"))).toBe(true);
  });

  it("enforces CS2 grenade carry cap per belt carrier", () => {
    const r = validateMapModule(mapWithBeltOverload(), "testmap", { wip: true });
    expect(r.errors.some((e) => e.includes("exceeds CS2 carry cap"))).toBe(true);
    expect(GRENADE_CARRY_CAP).toBe(4);
  });

  it("requires RADAR_URL and SPAWNS for Premier maps", () => {
    const mod = minimalValidMap({ RADAR_URL: "", SPAWNS: undefined });
    const r = validateMapModule(mod, "ancient");
    expect(r.errors.some((e) => e.includes("RADAR_URL"))).toBe(true);
    expect(r.errors.some((e) => e.includes("SPAWNS"))).toBe(true);
  });

  it("warns on YouTube search URLs and empty screenshots", () => {
    const mod = minimalValidMap();
    mod.LINEUPS.l1.video = "https://www.youtube.com/results?search_query=test";
    mod.LINEUPS.l1.screenshots = { stand: "", aim: "", result: "" };
    const r = validateMapModule(mod, "testmap", { wip: true });
    expect(r.warnings.some((w) => w.includes("YouTube search URL"))).toBe(true);
    expect(r.warnings.some((w) => w.includes("screenshots"))).toBe(true);
  });

  it("counts smokes per carrier and errors when impossible", () => {
    const mod = minimalValidMap();
    mod.LINEUPS.l2 = mod.LINEUPS.l1;
    mod.LINEUPS.l2.id = "l2";
    mod.LINEUPS.l2.util = "SMOKE";
    mod.LINEUPS.l3 = { ...mod.LINEUPS.l1, id: "l3", util: "SMOKE" };
    mod.UTILITY_BELTS[0].sequence = [
      { lineup: "l1", carrier: "P1" },
      { lineup: "l2", carrier: "P1" },
      { lineup: "l3", carrier: "P1" },
    ];
    const r = validateMapModule(mod, "testmap", { wip: true });
    expect(r.errors.some((e) => e.includes("throws 3 smokes"))).toBe(true);
  });
});
