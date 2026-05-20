import { describe, expect, it } from "vitest";
import { loadMapModule } from "../../data/loadMapModule.js";

describe("loadMapModule", () => {
  it("loads ancient map exports", async () => {
    const mod = await loadMapModule("ancient");
    expect(mod.MAP_NAME).toBeTruthy();
    expect(Object.keys(mod.LINEUPS).length).toBeGreaterThan(0);
  });

  it("falls back to ancient for unknown ids", async () => {
    const mod = await loadMapModule("not_a_map");
    expect(mod.LINEUPS).toBeDefined();
  });
});
