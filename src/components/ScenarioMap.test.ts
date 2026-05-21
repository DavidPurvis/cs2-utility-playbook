/**
 * Locks the "do not invent coordinates" contract for scenarios:
 * findMissingActions must report every action whose utility is missing
 * or whose landing has no resolvable position.
 */
import { describe, expect, it } from "vitest";
import { findMissingActions } from "./ScenarioMap";
import type { Scenario, Utility } from "../types/map";

const baseUtility: Utility = {
  id: "smoke_xbox",
  name: "Xbox smoke",
  type: "smoke",
  side: "T",
  area: "Mid",
  throwFrom: { world: { x: 0, y: 0, z: 0 } },
  landingAt: { world: { x: 100, y: 100, z: 0 } },
  throwStyle: "normal",
  movement: "standing",
  difficulty: "medium",
};

function makeScenario(actionIds: string[]): Scenario {
  return {
    id: "test",
    name: "Test",
    description: "",
    map: "dust2",
    side: "T",
    targetArea: "A",
    difficulty: "intermediate",
    playerCount: 2,
    players: [
      {
        role: "entry",
        label: "Player A",
        color: "#fff",
        actions: actionIds.map((utilityId, i) => ({ order: i + 1, utilityId })),
      },
      {
        role: "support",
        label: "Player B",
        color: "#000",
        actions: [],
      },
    ],
  };
}

describe("findMissingActions", () => {
  it("returns empty when every action's utility resolves to a landing", () => {
    const s = makeScenario(["smoke_xbox"]);
    expect(findMissingActions(s, [baseUtility])).toEqual([]);
  });

  it("flags actions whose utilityId isn't in the bundle", () => {
    const s = makeScenario(["smoke_ghost"]);
    const missing = findMissingActions(s, [baseUtility]);
    expect(missing).toHaveLength(1);
    expect(missing[0]!.reason).toMatch(/unknown utility/);
  });

  it("flags utilities that have no resolvable landing (no world, no percent)", () => {
    const noLanding: Utility = {
      ...baseUtility,
      id: "smoke_blank",
      landingAt: {}, // neither world nor percent
    };
    const s = makeScenario(["smoke_blank"]);
    const missing = findMissingActions(s, [noLanding]);
    expect(missing).toHaveLength(1);
    expect(missing[0]!.reason).toMatch(/no landing/);
  });

  it("accepts percent-only landings (legacy fallback)", () => {
    const percentOnly: Utility = {
      ...baseUtility,
      id: "smoke_legacy",
      landingAt: { percent: { x: 50, y: 50 } },
    };
    const s = makeScenario(["smoke_legacy"]);
    expect(findMissingActions(s, [percentOnly])).toEqual([]);
  });
});
