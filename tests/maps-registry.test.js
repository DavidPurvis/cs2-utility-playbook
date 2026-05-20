import { describe, expect, it } from "vitest";
import MAPS, { BONUS_MAP_IDS, MAP_IDS, MAP_LIST, PREMIER_MAP_IDS, WIP_MAP_IDS } from "../data/maps-registry.js";

describe("map registry", () => {
  it("includes the full Premier map pool in the selector", () => {
    expect(MAP_LIST).toHaveLength(PREMIER_MAP_IDS.length + BONUS_MAP_IDS.length);
    for (const id of PREMIER_MAP_IDS) {
      expect(MAP_IDS).toContain(id);
      expect(MAP_LIST.map((m) => m.id)).toContain(id);
    }
  });

  it("includes bonus maps in the selector when not WIP", () => {
    for (const id of WIP_MAP_IDS) {
      expect(MAP_LIST.map((m) => m.id)).not.toContain(id);
    }
    expect(MAP_LIST.map((m) => m.id)).toContain("cache");
  });

  it("keeps registry keys aligned with entry ids and modules", () => {
    for (const id of MAP_IDS) {
      const entry = MAPS[id];
      expect(entry).toBeDefined();
      expect(entry.id).toBe(id);
      expect(entry.module).toBeDefined();
      expect(entry.module.LINEUPS).toBeDefined();
      expect(entry.label?.length).toBeGreaterThan(0);
    }
  });

  it("does not expose WIP-only maps in the selector", () => {
    const selectable = MAP_LIST.map((m) => m.id);
    for (const wipId of WIP_MAP_IDS) {
      expect(selectable).not.toContain(wipId);
    }
  });

  it("orders MAP_LIST as Premier then bonus maps", () => {
    const ids = MAP_LIST.map((m) => m.id);
    expect(ids.slice(0, PREMIER_MAP_IDS.length)).toEqual(PREMIER_MAP_IDS);
    expect(ids.slice(PREMIER_MAP_IDS.length)).toEqual(BONUS_MAP_IDS);
  });
});
