import { describe, expect, it } from "vitest";
import { normalizeAustincs, normalizeExtraSources, normalizeSource } from "../../lib/lineupMedia.js";

describe("lineupMedia", () => {
  it("normalizes string sources", () => {
    expect(normalizeSource("NadeKing")).toEqual({ name: "NadeKing", url: "" });
  });

  it("normalizes object sources", () => {
    expect(normalizeSource({ name: "Refrag", url: "https://x" })).toEqual({
      name: "Refrag",
      url: "https://x",
    });
  });

  it("guards boolean austincs", () => {
    expect(normalizeAustincs(false)).toEqual({ video: "", timestamp: "", note: "" });
  });

  it("collects screenshotSource as extra link", () => {
    const links = normalizeExtraSources({
      source: { name: "NadeKing", url: "https://a" },
      screenshotSource: { name: "cs2util", url: "https://b" },
    });
    expect(links).toHaveLength(2);
  });
});
