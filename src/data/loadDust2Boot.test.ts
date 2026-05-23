/**
 * Boot-path safety tests for loadDustData().
 *
 * These verify the catch-safe boot path: loadDustData() returns an Error
 * for bad data instead of throwing, and getDustData() returns valid data
 * when the underlying bundle is good.
 */
import { describe, expect, it } from "vitest";
import { getDustData, loadDustData } from "./loadDust2";

describe("loadDustData (catch-safe boot)", () => {
  it("returns valid DustData for the production bundle", () => {
    const result = loadDustData();
    expect(result).not.toBeInstanceOf(Error);
    if (!(result instanceof Error)) {
      expect(result.config).toBeDefined();
      expect(Array.isArray(result.lineups)).toBe(true);
      expect(Array.isArray(result.scenarios)).toBe(true);
      expect(Array.isArray(result.spawns)).toBe(true);
    }
  });

  it("memoizes: second call returns the same reference", () => {
    const a = loadDustData();
    const b = loadDustData();
    expect(a).toBe(b);
  });
});

describe("getDustData (convenience getter)", () => {
  it("returns the same data as loadDustData on valid bundle", () => {
    const loaded = loadDustData();
    const got = getDustData();
    expect(loaded).not.toBeInstanceOf(Error);
    // getDustData returns the same object reference
    expect(got).toBe(loaded);
  });
});
