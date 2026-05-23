/**
 * clusterThrowFroms — pure clustering logic for the Map tab.
 *
 * Groups lineups whose throwFrom coordinates are within MERGE_RADIUS_SQ
 * (150^2 world units) into shared clusters. Tests cover: empty input,
 * single lineup, merge-within-radius, separate-beyond-radius, key
 * stability across input order, and the conservation invariant (every
 * lineup appears in exactly one cluster).
 */
import { describe, expect, it } from "vitest";
import { clusterThrowFroms } from "../../../utils/clusterThrowFroms";
import type { Lineup } from "../../../types";

/** Minimal lineup factory — only fields used by clusterThrowFroms. */
function makeLineup(id: string, x: number, y: number): Lineup {
  return {
    id,
    name: `Lineup ${id}`,
    type: "smoke",
    side: "T",
    area: "A",
    throwFrom: { world: { x, y } },
    landingAt: { world: { x: 0, y: 0 } },
    throwStyle: "normal",
    movement: "standing",
    difficulty: "easy",
  };
}

describe("clusterThrowFroms", () => {
  it("returns empty array for empty input", () => {
    expect(clusterThrowFroms([])).toEqual([]);
  });

  it("single lineup → one cluster, key = lineup.id", () => {
    const lineups = [makeLineup("xbox_smoke", 100, 200)];
    const clusters = clusterThrowFroms(lineups);
    expect(clusters).toHaveLength(1);
    expect(clusters[0]!.key).toBe("xbox_smoke");
    expect(clusters[0]!.lineups).toHaveLength(1);
  });

  it("two lineups within MERGE_RADIUS_SQ merge into one cluster", () => {
    // Distance = 100 world units, well within 150-unit merge radius.
    const lineups = [
      makeLineup("a", 0, 0),
      makeLineup("b", 60, 80), // dist = sqrt(3600+6400) = 100 < 150
    ];
    const clusters = clusterThrowFroms(lineups);
    expect(clusters).toHaveLength(1);
    expect(clusters[0]!.lineups).toHaveLength(2);
    // Key is sorted IDs joined by |
    expect(clusters[0]!.key).toBe("a|b");
  });

  it("two lineups beyond MERGE_RADIUS_SQ stay separate", () => {
    // Distance = 200 world units, beyond 150-unit merge radius.
    const lineups = [
      makeLineup("a", 0, 0),
      makeLineup("b", 200, 0), // dist = 200 > 150
    ];
    const clusters = clusterThrowFroms(lineups);
    expect(clusters).toHaveLength(2);
    expect(clusters.map((c) => c.key).sort()).toEqual(["a", "b"]);
  });

  it("key stability: same lineups in different order produce same keys", () => {
    const lineups = [
      makeLineup("b", 50, 50),
      makeLineup("a", 60, 50), // within merge radius of b
    ];
    const reversedLineups = [lineups[1]!, lineups[0]!];
    const keys1 = clusterThrowFroms(lineups).map((c) => c.key).sort();
    const keys2 = clusterThrowFroms(reversedLineups).map((c) => c.key).sort();
    expect(keys1).toEqual(keys2);
  });

  it("conservation: every input lineup appears in exactly one output cluster", () => {
    const lineups = [
      makeLineup("a", 0, 0),
      makeLineup("b", 50, 50),    // within radius of a
      makeLineup("c", 500, 500),  // far away
      makeLineup("d", 510, 500),  // within radius of c
      makeLineup("e", 1000, 1000), // far from everything
    ];
    const clusters = clusterThrowFroms(lineups);
    const allIds = clusters.flatMap((c) => c.lineups.map((l) => l.id)).sort();
    expect(allIds).toEqual(["a", "b", "c", "d", "e"]);
    // No lineup in multiple clusters:
    expect(new Set(allIds).size).toBe(allIds.length);
  });
});
