/**
 * TKT-003 TDD: tests for the assertDustData boot validator.
 *
 * These are written before the implementation per the v6 TDD mandate.
 * Each case exercises a distinct branch of the validator. The implementation
 * (loadDust2.ts) must throw with the documented error format for each
 * failure mode, and pass cleanly for the valid happy-path.
 */
import { describe, expect, it } from "vitest";
import { assertDustData } from "./loadDust2";

const validBase = {
  config: {
    id: "dust2",
    displayName: "Dust 2",
    valveMapId: "de_dust2",
    radarImage: "/maps/dust2/radar.png",
    pos_x: -2476,
    pos_y: 3239,
    scale: 4.4,
    sourceResolution: 1024,
  },
  spawns: [
    { id: "dust2-t-s1", side: "T", label: "S1", world: { x: -332, y: -754, z: 78.9 } },
  ],
  lineups: [
    {
      id: "xbox_smoke",
      name: "Xbox smoke",
      type: "smoke",
      side: "T",
      area: "Mid",
      throwFrom: { world: { x: -300, y: -1163 } },
      landingAt: { percent: { x: 46, y: 39 } },
      throwStyle: "jump",
      movement: "standing",
      difficulty: "medium",
    },
  ],
  scenarios: [
    {
      id: "test",
      number: 1,
      name: "Test scenario",
      description: "",
      side: "T",
      targetArea: "A",
      difficulty: "beginner",
      playerCount: 2,
      players: [
        { role: "a-man", label: "A", color: "#C67C4E", actions: [{ order: 1, lineupId: "xbox_smoke" }] },
        { role: "b-man", label: "B", color: "#5B7FA8", actions: [] },
      ],
    },
  ],
};

describe("assertDustData", () => {
  it("accepts a fully valid bundle without throwing", () => {
    expect(() => assertDustData(structuredClone(validBase))).not.toThrow();
  });

  it("throws when lineups array is missing", () => {
    const bad = structuredClone(validBase) as Record<string, unknown>;
    delete bad.lineups;
    expect(() => assertDustData(bad)).toThrow(/lineups must be array/);
  });

  it("throws when a lineup is missing both landingAt.world and landingAt.percent", () => {
    const bad = structuredClone(validBase) as { lineups: Array<{ landingAt: Record<string, unknown> }> };
    bad.lineups[0]!.landingAt = {};
    expect(() => assertDustData(bad)).toThrow(/xbox_smoke.*landingAt/);
  });

  it("throws when a scenario action references an unknown lineupId", () => {
    const bad = structuredClone(validBase);
    bad.scenarios[0]!.players[0]!.actions[0]!.lineupId = "ghost_smoke";
    expect(() => assertDustData(bad)).toThrow(/Scenario 1.*ghost_smoke/);
  });

  it("accepts a bundle with empty scenarios array", () => {
    const bundle = structuredClone(validBase);
    bundle.scenarios = [];
    expect(() => assertDustData(bundle)).not.toThrow();
  });
});
