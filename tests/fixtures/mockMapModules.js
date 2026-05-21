/** Minimal map modules for validator unit tests (not used in the app). */

function lineup(id, overrides = {}) {
  return {
    id,
    name: "Test Lineup",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "A Site",
    purpose: "Block",
    stand: "Stand here",
    aim: "Aim there",
    radarPos: { x: 50, y: 50 },
    ...overrides,
  };
}

export function minimalValidMap(overrides = {}) {
  const ids = ["l1", "l2", "l3", "l4", "l5"];
  const LINEUPS = Object.fromEntries(
    ids.map((id, i) => [
      id,
      lineup(id, {
        mustLearn: i < 5,
        name: `Lineup ${i + 1}`,
        radarPos: { x: 10 + i * 10, y: 20 + i * 5 },
      }),
    ])
  );
  return {
    MAP_NAME: "Test Map",
    RADAR_URL: "/radar.png",
    LINEUPS,
    MUST_LEARN: ids,
    COMBOS: [
      {
        id: "combo_a",
        name: "A Execute",
        side: "T",
        roundTypes: ["FULL"],
        lineups: [{ lineup: "l1", who: "P1" }],
      },
    ],
    UTILITY_BELTS: [
      {
        id: "belt_a",
        name: "A Belt",
        side: "T",
        roundTypes: ["FULL"],
        sequence: [{ lineup: "l1", carrier: "P1" }],
      },
    ],
    SCENARIOS: [
      {
        id: "sc_a",
        title: "Default",
        side: "T",
        bullets: ["Call default"],
      },
    ],
    SETUP_POSITIONS: [
      {
        id: "pos_a",
        label: "A Main",
        side: "T",
        pos: { x: 40, y: 60 },
        lineups: ["l1"],
      },
    ],
    SPAWNS: {
      T: [{ id: "t1", label: "T Spawn", pos: { x: 5, y: 50 }, lineups: ["l1"] }],
      CT: [{ id: "ct1", label: "CT Spawn", pos: { x: 95, y: 50 }, lineups: [] }],
    },
    ...overrides,
  };
}

export function mapMissingExports() {
  return { MAP_NAME: "Broken" };
}

export function mapWithBeltOverload() {
  const mod = minimalValidMap();
  const extra = lineup("l6", { util: "FLASH" });
  const extra2 = lineup("l7", { util: "HE" });
  const extra3 = lineup("l8", { util: "MOLLY" });
  const extra4 = lineup("l9", { util: "SMOKE", id: "l9" });
  const extra5 = lineup("l10", { util: "FLASH", id: "l10" });
  mod.LINEUPS.l6 = extra;
  mod.LINEUPS.l7 = extra2;
  mod.LINEUPS.l8 = extra3;
  mod.LINEUPS.l9 = extra4;
  mod.LINEUPS.l10 = extra5;
  mod.UTILITY_BELTS[0].sequence = [
    { lineup: "l1", carrier: "solo" },
    { lineup: "l6", carrier: "solo" },
    { lineup: "l7", carrier: "solo" },
    { lineup: "l8", carrier: "solo" },
    { lineup: "l9", carrier: "solo" },
    { lineup: "l10", carrier: "solo" },
  ];
  return mod;
}

export function mapWithBadRadarScale() {
  const mod = minimalValidMap();
  mod.LINEUPS.l1 = lineup("l1", { radarPos: { x: 0.5, y: 50 } });
  return mod;
}

export function mapWithMustLearnMismatch() {
  const mod = minimalValidMap();
  mod.LINEUPS.l1.mustLearn = false;
  return mod;
}

export function mapWithWorldCoordinatePoints() {
  const mod = minimalValidMap();
  mod.LINEUPS.l1 = lineup("l1", {
    mustLearn: true,
    radarPos: { worldX: -1200, worldY: 800 },
    radarTarget: { worldX: -600, worldY: 200 },
  });
  mod.SETUP_POSITIONS[0].pos = { worldX: -900, worldY: 500 };
  mod.SPAWNS.T[0].pos = { worldX: -1400, worldY: 1200 };
  mod.SPAWNS.CT[0].pos = { worldX: 1300, worldY: -900 };
  return mod;
}

export function mapWithMixedPointSchema() {
  const mod = minimalValidMap();
  mod.LINEUPS.l1.radarPos = { x: 50, y: 50, worldX: -800, worldY: 600 };
  return mod;
}
