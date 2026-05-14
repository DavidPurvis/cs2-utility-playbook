import { describe, expect, it } from "vitest";
import MAPS, { MAP_IDS, MAP_LIST } from "../data/maps.js";

describe("map registry", () => {
  it("lists exactly seven Premier maps", () => {
    expect(MAP_IDS).toHaveLength(7);
    expect(MAP_LIST).toHaveLength(7);
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
});
