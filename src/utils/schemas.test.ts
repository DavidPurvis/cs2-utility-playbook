/**
 * Schema gate. Validates the shipped JSON data files against the
 * runtime schemas so a malformed entry never makes it to a release.
 */
import { describe, expect, it } from "vitest";
import mapConfig from "../data/maps/dust2/map-config.json";
import spawns from "../data/maps/dust2/spawns.json";
import utilities from "../data/maps/dust2/utilities.json";
import scenarios from "../data/maps/dust2/scenarios.json";
import {
  validateMapConfig,
  validateScenarios,
  validateSpawns,
  validateUtilities,
} from "./schemas";

describe("shipped Dust 2 JSON conforms to schemas", () => {
  it("map-config.json", () => {
    const r = validateMapConfig(mapConfig);
    expect(r.errors).toEqual([]);
  });

  it("spawns.json — 15 T + 5 CT", () => {
    const r = validateSpawns(spawns);
    expect(r.errors).toEqual([]);
    const t = (spawns as Array<{ side: string }>).filter((s) => s.side === "T").length;
    const ct = (spawns as Array<{ side: string }>).filter((s) => s.side === "CT").length;
    expect(t).toBe(15);
    expect(ct).toBe(5);
  });

  it("utilities.json", () => {
    const r = validateUtilities(utilities);
    expect(r.errors).toEqual([]);
  });

  it("scenarios.json", () => {
    const r = validateScenarios(scenarios);
    expect(r.errors).toEqual([]);
  });
});

describe("schema rejects malformed input", () => {
  it("rejects a utility without throwFrom.world", () => {
    const r = validateUtilities([
      {
        id: "x",
        name: "X",
        type: "smoke",
        side: "T",
        area: "A",
        throwFrom: {},
        landingAt: { percent: { x: 50, y: 50 } },
        throwStyle: "normal",
        movement: "standing",
        difficulty: "easy",
      },
    ]);
    expect(r.errors.length).toBeGreaterThan(0);
    expect(r.errors[0]!.path).toMatch(/throwFrom\.world/);
  });

  it("rejects a utility with neither world nor percent landing", () => {
    const r = validateUtilities([
      {
        id: "x",
        name: "X",
        type: "smoke",
        side: "T",
        area: "A",
        throwFrom: { world: { x: 0, y: 0 } },
        landingAt: {},
        throwStyle: "normal",
        movement: "standing",
        difficulty: "easy",
      },
    ]);
    expect(r.errors.some((e) => /landingAt$/.test(e.path))).toBe(true);
  });

  it("rejects a scenario with invalid playerCount", () => {
    const r = validateScenarios([
      {
        id: "x",
        name: "X",
        description: "y",
        map: "dust2",
        side: "T",
        targetArea: "A",
        difficulty: "beginner",
        playerCount: 1,
        players: [],
      },
    ]);
    expect(r.errors.some((e) => /playerCount/.test(e.path))).toBe(true);
  });
});
