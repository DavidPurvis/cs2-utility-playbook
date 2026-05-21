import { describe, expect, it } from "vitest";
import { exportAll, exportScenario, importScenario } from "../../lib/jsonExport";
import { DUST2_SCENARIOS } from "../../data/dust2-scenarios";

describe("jsonExport", () => {
  it("exports a single scenario with all referenced lineups", () => {
    const scenario = DUST2_SCENARIOS[0]!;
    const result = exportScenario(scenario.id);
    expect(result).not.toBeNull();
    expect(result!.scenario.id).toBe(scenario.id);
    // Each lineup referenced by a role must be present.
    const expectedIds = new Set<string>();
    for (const r of scenario.roles) for (const l of r.lineupIds) expectedIds.add(l);
    const actualIds = new Set(result!.lineups.map((l) => l.id));
    expect(actualIds).toEqual(expectedIds);
  });

  it("returns null for unknown scenario id", () => {
    expect(exportScenario("not_a_real_id")).toBeNull();
  });

  it("exports all scenarios", () => {
    const result = exportAll();
    expect(result.scenarios.length).toBe(DUST2_SCENARIOS.length);
    expect(result.schemaVersion).toBe(1);
  });

  it("round-trips: exported JSON re-imports to the same scenario", () => {
    const scenario = DUST2_SCENARIOS[0]!;
    const exported = exportScenario(scenario.id);
    const json = JSON.stringify(exported);
    const reimported = importScenario(json);
    expect(reimported).not.toBeNull();
    expect(reimported!.scenario.id).toBe(scenario.id);
    expect(reimported!.lineups.length).toBe(exported!.lineups.length);
  });

  it("importScenario returns null for malformed JSON", () => {
    expect(importScenario("not json")).toBeNull();
    expect(importScenario('{"schemaVersion": 99}')).toBeNull();
    expect(importScenario('{"schemaVersion": 1}')).toBeNull();
  });
});
