import { describe, expect, it } from "vitest";
import { ROUND_TYPES, T, THROW, UTIL } from "../../lib/theme.js";

describe("lib/theme", () => {
  it("defines core UI palette keys", () => {
    for (const key of ["bg", "accent", "textPri", "tSide", "ctSide", "danger"]) {
      expect(T[key]).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("covers every throw type used in map data", () => {
    const throws = ["JT", "WJT", "LMB", "RMB", "WALK2", "RUN"];
    for (const t of throws) {
      expect(THROW[t]?.label).toBeTruthy();
      expect(THROW[t]?.color).toMatch(/^#/);
    }
  });

  it("covers utility and round type badges", () => {
    for (const u of ["SMOKE", "FLASH", "MOLLY", "HE"]) {
      expect(UTIL[u]?.label).toBeTruthy();
    }
    for (const r of ["PISTOL", "ECO", "FORCE", "FULL"]) {
      expect(ROUND_TYPES[r]?.short).toBeTruthy();
    }
  });
});
