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

  // ── Config sanity ───────────────────────────────────────────────
  it("throws when config.scale is 0", () => {
    const bad = structuredClone(validBase);
    (bad.config as Record<string, unknown>).scale = 0;
    expect(() => assertDustData(bad)).toThrow(/scale must be > 0/);
  });

  it("throws when config.sourceResolution is NaN", () => {
    const bad = structuredClone(validBase);
    (bad.config as Record<string, unknown>).sourceResolution = NaN;
    expect(() => assertDustData(bad)).toThrow(/sourceResolution must be a finite number/);
  });

  // ── Duplicate IDs ───────────────────────────────────────────────
  it("throws on duplicate lineup id", () => {
    const bad = structuredClone(validBase);
    bad.lineups.push({ ...bad.lineups[0]! });
    expect(() => assertDustData(bad)).toThrow(/duplicate lineup id.*xbox_smoke/);
  });

  it("throws on duplicate spawn id", () => {
    const bad = structuredClone(validBase);
    bad.spawns.push({ ...bad.spawns[0]! });
    expect(() => assertDustData(bad)).toThrow(/duplicate spawn id.*dust2-t-s1/);
  });

  it("throws on duplicate scenario id", () => {
    const bad = structuredClone(validBase);
    const dupe = structuredClone(bad.scenarios[0]!);
    dupe.number = 99; // unique number so the number-uniqueness check passes
    bad.scenarios.push(dupe);
    expect(() => assertDustData(bad)).toThrow(/duplicate scenario id.*test/);
  });

  // ── snake_case format ───────────────────────────────────────────
  it("throws when a lineup id does not match snake_case format", () => {
    const bad = structuredClone(validBase);
    bad.lineups[0]!.id = "Xbox-Smoke"; // capital + hyphen — invalid
    expect(() => assertDustData(bad)).toThrow(/snake_case/);
  });

  // ── Scenario number uniqueness ─────────────────────────────────
  it("throws when two scenarios share the same number", () => {
    const bad = structuredClone(validBase);
    bad.scenarios.push({ ...bad.scenarios[0]!, id: "test2" });
    expect(() => assertDustData(bad)).toThrow(/duplicate scenario.number/);
  });

  // ── Empty required strings ──────────────────────────────────────
  it("throws when lineup name is empty", () => {
    const bad = structuredClone(validBase);
    bad.lineups[0]!.name = "";
    expect(() => assertDustData(bad)).toThrow(/non-empty name/);
  });

  it("throws when scenario name is empty", () => {
    const bad = structuredClone(validBase);
    bad.scenarios[0]!.name = "";
    expect(() => assertDustData(bad)).toThrow(/non-empty name/);
  });

  // ── Ref integrity: startingSpawnId ──────────────────────────────
  it("throws when startingSpawnId references unknown spawn", () => {
    const bad = structuredClone(validBase) as Record<string, unknown>;
    const scenario = (bad.scenarios as Array<Record<string, unknown>>)[0]!;
    const player = (scenario.players as Array<Record<string, unknown>>)[0]!;
    player.startingSpawnId = "ghost-spawn";
    expect(() => assertDustData(bad)).toThrow(/unknown spawn.*ghost-spawn/);
  });

  // ── Ref integrity: roleOrder ────────────────────────────────────
  it("throws when roleOrder contains a role not in players", () => {
    const bad = structuredClone(validBase) as Record<string, unknown>;
    const scenario = (bad.scenarios as Array<Record<string, unknown>>)[0]!;
    scenario.roleOrder = ["a-man", "lurker"];
    expect(() => assertDustData(bad)).toThrow(/roleOrder contains.*lurker.*not a player role/);
  });

  // ── Action order uniqueness ─────────────────────────────────────
  it("throws on duplicate action order within a player", () => {
    const bad = structuredClone(validBase);
    bad.lineups.push({
      ...bad.lineups[0]!,
      id: "second_lineup",
      name: "Second lineup",
    });
    bad.scenarios[0]!.players[0]!.actions.push(
      { order: 1, lineupId: "second_lineup" }
    );
    expect(() => assertDustData(bad)).toThrow(/duplicate action order 1/);
  });

  // ── SpawnRush ref integrity ─────────────────────────────────────
  it("throws when spawnRush.fromSpawnId references unknown spawn", () => {
    const bad = structuredClone(validBase) as Record<string, unknown>;
    bad.defaults = {
      plants: [],
      timings: [],
      spawnRushes: [
        {
          id: "rush-1",
          fromSpawnId: "nonexistent-spawn",
          contestPath: "A long",
          beatsSpawnIds: [],
        },
      ],
    };
    expect(() => assertDustData(bad)).toThrow(/spawnRush.*unknown fromSpawnId.*nonexistent-spawn/);
  });

  it("throws when spawnRush.beatsSpawnIds references unknown spawn", () => {
    const bad = structuredClone(validBase) as Record<string, unknown>;
    bad.defaults = {
      plants: [],
      timings: [],
      spawnRushes: [
        {
          id: "rush-1",
          fromSpawnId: "dust2-t-s1",
          contestPath: "A long",
          beatsSpawnIds: ["ghost-ct-spawn"],
        },
      ],
    };
    expect(() => assertDustData(bad)).toThrow(/beatsSpawnIds.*unknown spawn.*ghost-ct-spawn/);
  });

  it("accepts defaults.spawnRushes when all spawn refs resolve", () => {
    const bundle = structuredClone(validBase) as Record<string, unknown>;
    bundle.defaults = {
      plants: [],
      timings: [],
      spawnRushes: [
        {
          id: "rush-good",
          fromSpawnId: "dust2-t-s1",
          contestPath: "Mid",
          beatsSpawnIds: [], // empty is fine — no refs to check
        },
      ],
    };
    expect(() => assertDustData(bundle)).not.toThrow();
  });

  // ── Valid bundle with all new fields ─────────────────────────────
  it("accepts a fully valid bundle with roleOrder, startingSpawnId, and defaults", () => {
    const full = structuredClone(validBase) as Record<string, unknown>;
    const scenario = (full.scenarios as Array<Record<string, unknown>>)[0]!;
    scenario.roleOrder = ["a-man", "b-man"];
    const player = (scenario.players as Array<Record<string, unknown>>)[0]!;
    player.startingSpawnId = "dust2-t-s1";
    full.defaults = {
      plants: [],
      timings: [],
      spawnRushes: [
        {
          id: "rush-1",
          fromSpawnId: "dust2-t-s1",
          contestPath: "A long",
          beatsSpawnIds: [],
        },
      ],
    };
    expect(() => assertDustData(full)).not.toThrow();
  });
});
