import { describe, expect, it } from "vitest";
import { DUST2_META } from "../../data/dust2-meta";
import { DUST2_LINEUPS, DUST2_LINEUPS_BY_ID } from "../../data/dust2-lineups";
import { DUST2_SCENARIOS } from "../../data/dust2-scenarios";
import { DUST2_ZONES, DUST2_ZONES_BY_ID } from "../../data/dust2-zones";
import { worldToMapPercent } from "../../lib/mapCoordinates";
import { DUST2_LANDMARKS } from "../fixtures/dust2Landmarks";
import type { WorldPoint } from "../../data/types";

const PCT_EPSILON = 1e-9;

/** Ray-casting point-in-polygon (works for convex and concave). */
function pointInPolygon(p: WorldPoint, polygon: WorldPoint[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const pi = polygon[i]!;
    const pj = polygon[j]!;
    const intersect =
      pi.y > p.y !== pj.y > p.y &&
      p.x < ((pj.x - pi.x) * (p.y - pi.y)) / (pj.y - pi.y + PCT_EPSILON) + pi.x;
    if (intersect) inside = !inside;
  }
  return inside;
}

describe("Dust 2 landmarks (coordinate system sanity)", () => {
  for (const lm of DUST2_LANDMARKS) {
    it(`${lm.name} projects within ${lm.tolerancePercent}% of expected`, () => {
      const pct = worldToMapPercent(lm.worldX, lm.worldY, DUST2_META);
      expect(pct).not.toBeNull();
      expect(Math.abs(pct!.x - lm.expectedPercentX)).toBeLessThan(lm.tolerancePercent);
      expect(Math.abs(pct!.y - lm.expectedPercentY)).toBeLessThan(lm.tolerancePercent);
    });
  }
});

describe("Dust 2 lineups (data integrity)", () => {
  it("has the expected count", () => {
    expect(DUST2_LINEUPS.length).toBe(17);
  });

  it("every lineup has finite world coordinates", () => {
    for (const l of DUST2_LINEUPS) {
      expect(Number.isFinite(l.throwFromCoords.x), `${l.id} throwFrom.x`).toBe(true);
      expect(Number.isFinite(l.throwFromCoords.y), `${l.id} throwFrom.y`).toBe(true);
      expect(Number.isFinite(l.landsAtCoords.x), `${l.id} landsAt.x`).toBe(true);
      expect(Number.isFinite(l.landsAtCoords.y), `${l.id} landsAt.y`).toBe(true);
    }
  });

  it("every lineup's throw and landing positions project inside the radar (0-100%)", () => {
    for (const l of DUST2_LINEUPS) {
      const throwPct = worldToMapPercent(
        l.throwFromCoords.x,
        l.throwFromCoords.y,
        DUST2_META
      );
      const landsPct = worldToMapPercent(
        l.landsAtCoords.x,
        l.landsAtCoords.y,
        DUST2_META
      );
      expect(throwPct, `${l.id} throw`).not.toBeNull();
      expect(landsPct, `${l.id} lands`).not.toBeNull();
      expect(throwPct!.x).toBeGreaterThanOrEqual(0);
      expect(throwPct!.x).toBeLessThanOrEqual(100);
      expect(throwPct!.y).toBeGreaterThanOrEqual(0);
      expect(throwPct!.y).toBeLessThanOrEqual(100);
      expect(landsPct!.x).toBeGreaterThanOrEqual(0);
      expect(landsPct!.x).toBeLessThanOrEqual(100);
      expect(landsPct!.y).toBeGreaterThanOrEqual(0);
      expect(landsPct!.y).toBeLessThanOrEqual(100);
    }
  });

  it("every lineup id is unique", () => {
    const ids = DUST2_LINEUPS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("DUST2_LINEUPS_BY_ID covers all lineups", () => {
    expect(Object.keys(DUST2_LINEUPS_BY_ID).length).toBe(DUST2_LINEUPS.length);
    for (const l of DUST2_LINEUPS) {
      expect(DUST2_LINEUPS_BY_ID[l.id]).toBe(l);
    }
  });

  it("every lineup's landsAt is inside at least one zone polygon", () => {
    const offenders: string[] = [];
    for (const l of DUST2_LINEUPS) {
      const inAny = DUST2_ZONES.some((z) => pointInPolygon(l.landsAtCoords, z.polygon));
      if (!inAny) offenders.push(`${l.id} (${l.landsAt} at ${l.landsAtCoords.x},${l.landsAtCoords.y})`);
    }
    expect(offenders, `Lineups whose landing is outside every zone:\n  ${offenders.join("\n  ")}`).toEqual([]);
  });
});

describe("Dust 2 zones (data integrity)", () => {
  it("every zone has at least 3 polygon vertices", () => {
    for (const z of DUST2_ZONES) {
      expect(z.polygon.length, `${z.id}`).toBeGreaterThanOrEqual(3);
    }
  });

  it("every zone id is unique", () => {
    const ids = DUST2_ZONES.map((z) => z.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("DUST2_ZONES_BY_ID covers all zones", () => {
    expect(Object.keys(DUST2_ZONES_BY_ID).length).toBe(DUST2_ZONES.length);
  });
});

describe("Dust 2 scenarios (data integrity)", () => {
  it("has the expected count", () => {
    expect(DUST2_SCENARIOS.length).toBe(7);
  });

  it("every scenario id is unique", () => {
    const ids = DUST2_SCENARIOS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("playerCount matches the number of distinct role players", () => {
    for (const s of DUST2_SCENARIOS) {
      const players = new Set(s.roles.map((r) => r.player));
      expect(players.size, `${s.id} player count`).toBe(s.playerCount);
    }
  });

  it("every referenced lineup id resolves to a real lineup", () => {
    const offenders: string[] = [];
    for (const s of DUST2_SCENARIOS) {
      for (const role of s.roles) {
        for (const lid of role.lineupIds) {
          if (!DUST2_LINEUPS_BY_ID[lid]) offenders.push(`${s.id}/${role.player}: ${lid}`);
        }
      }
    }
    expect(offenders, `Unresolved lineup ids:\n  ${offenders.join("\n  ")}`).toEqual([]);
  });

  it("every scenario has at least one lineup across all its roles", () => {
    for (const s of DUST2_SCENARIOS) {
      const totalLineups = s.roles.reduce((acc, r) => acc + r.lineupIds.length, 0);
      expect(totalLineups, `${s.id} total lineups`).toBeGreaterThan(0);
    }
  });
});
