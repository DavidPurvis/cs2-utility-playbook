import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { readJsonStorage, readStorage, writeJsonStorage, writeStorage } from "../../lib/storage.js";

describe("lib/storage", () => {
  beforeEach(() => {
    const store = {};
    vi.stubGlobal("localStorage", {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => {
        store[k] = v;
      },
      removeItem: (k) => {
        delete store[k];
      },
      clear: () => {
        Object.keys(store).forEach((k) => delete store[k]);
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reads and writes strings", () => {
    expect(readStorage("missing", "fb")).toBe("fb");
    writeStorage("k", "v");
    expect(readStorage("k")).toBe("v");
  });

  it("reads and writes JSON", () => {
    writeJsonStorage("arr", [1, 2]);
    expect(readJsonStorage("arr", [])).toEqual([1, 2]);
  });

  it("returns fallback when JSON is invalid", () => {
    writeStorage("bad", "not-json");
    expect(readJsonStorage("bad", { ok: true })).toEqual({ ok: true });
  });
});
