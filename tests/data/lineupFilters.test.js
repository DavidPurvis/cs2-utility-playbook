import { describe, expect, it } from "vitest";
import {
  deriveFilteredMapData,
  getCombinedHiddenLineupIds,
  sanitizeHiddenLineupOverridesByMap,
} from "../../data/lineupFilters.js";
import { minimalValidMap } from "../fixtures/mockMapModules.js";

describe("lineupFilters", () => {
  it("sanitizes malformed hidden-lineup override payloads", () => {
    const raw = {
      ancient: [" red_room ", "", "red_room", null],
      dust2: "not-an-array",
      " ": ["skip"],
      nuke: ["n1", "n1", " n2 "],
    };

    expect(sanitizeHiddenLineupOverridesByMap(raw)).toEqual({
      ancient: ["red_room"],
      nuke: ["n1", "n2"],
    });
  });

  it("combines configured and override ids safely per map", () => {
    const combined = getCombinedHiddenLineupIds("ancient", {
      ancient: ["l1", " l2 ", "l1"],
      dust2: ["d1"],
    });
    expect(combined).toEqual(["l1", "l2"]);
  });

  it("filters hidden lineups across must-learn, combos, belts, positions, and spawns", () => {
    const raw = minimalValidMap({
      COMBOS: [
        {
          id: "combo_keep",
          name: "Keep combo",
          side: "T",
          roundTypes: ["FULL"],
          lineups: [{ lineup: "l1" }, { lineup: "l2" }],
        },
        {
          id: "combo_drop",
          name: "Drop combo",
          side: "T",
          roundTypes: ["FULL"],
          lineups: [{ lineup: "l3" }],
        },
      ],
      UTILITY_BELTS: [
        {
          id: "belt_keep",
          name: "Keep belt",
          side: "T",
          roundTypes: ["FULL"],
          sequence: [{ lineup: "l1" }, { lineup: "l4" }],
        },
        {
          id: "belt_drop",
          name: "Drop belt",
          side: "T",
          roundTypes: ["FULL"],
          sequence: [{ lineup: "l3" }],
        },
      ],
      SETUP_POSITIONS: [
        {
          id: "pos_a",
          label: "A Main",
          side: "T",
          pos: { x: 40, y: 60 },
          lineups: ["l1", "l2"],
        },
      ],
      SPAWNS: {
        T: [{ id: "t1", label: "T Spawn", pos: { x: 5, y: 50 }, lineups: ["l1", "l3", "l5"] }],
        CT: [{ id: "ct1", label: "CT Spawn", pos: { x: 95, y: 50 }, lineups: ["l2"] }],
      },
    });

    const filtered = deriveFilteredMapData(raw, ["l1", "l3"]);

    expect(filtered.LINEUPS.l1).toBeUndefined();
    expect(filtered.LINEUPS.l3).toBeUndefined();
    expect(Object.keys(filtered.LINEUPS)).toEqual(["l2", "l4", "l5"]);
    expect(filtered.MUST_LEARN).toEqual(["l2", "l4", "l5"]);

    expect(filtered.COMBOS.map((c) => c.id)).toEqual(["combo_keep"]);
    expect(filtered.COMBOS[0].lineups.map((row) => row.lineup)).toEqual(["l2"]);

    expect(filtered.UTILITY_BELTS.map((b) => b.id)).toEqual(["belt_keep"]);
    expect(filtered.UTILITY_BELTS[0].sequence.map((row) => row.lineup)).toEqual(["l4"]);

    expect(filtered.SETUP_POSITIONS[0].lineups).toEqual(["l2"]);
    expect(filtered.SPAWNS.T[0].lineups).toEqual(["l5"]);
    expect(filtered.SPAWNS.CT[0].lineups).toEqual(["l2"]);

    // Raw input remains intact for backward compatibility.
    expect(raw.LINEUPS.l1).toBeDefined();
    expect(raw.COMBOS.map((c) => c.id)).toEqual(["combo_keep", "combo_drop"]);
    expect(raw.UTILITY_BELTS.map((b) => b.id)).toEqual(["belt_keep", "belt_drop"]);
    expect(raw.SETUP_POSITIONS[0].lineups).toEqual(["l1", "l2"]);
    expect(raw.SPAWNS.T[0].lineups).toEqual(["l1", "l3", "l5"]);
  });

  it("returns original map object when no hidden ids are supplied", () => {
    const raw = minimalValidMap();
    expect(deriveFilteredMapData(raw, [])).toBe(raw);
  });
});
