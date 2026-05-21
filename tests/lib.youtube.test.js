import { describe, expect, it } from "vitest";
import { withYouTubeTimestamp } from "../lib/youtube.js";

describe("withYouTubeTimestamp", () => {
  it("returns empty string for empty video URL", () => {
    expect(withYouTubeTimestamp("", "1:30")).toBe("");
  });

  it("returns URL unchanged when timestamp is empty", () => {
    const url = "https://www.youtube.com/watch?v=abc123";
    expect(withYouTubeTimestamp(url, "")).toBe(url);
  });

  it("appends t= query param for watch URLs", () => {
    const out = withYouTubeTimestamp("https://www.youtube.com/watch?v=abc123", "90");
    expect(out).toContain("t=90");
    expect(out).toContain("v=abc123");
  });

  it("replaces existing t= param when timestamp is set", () => {
    const out = withYouTubeTimestamp("https://www.youtube.com/watch?v=abc123&t=10", "90");
    expect(out).toContain("t=90");
    expect(out).not.toContain("t=10");
  });

  it("falls back to string concat for invalid URLs", () => {
    const out = withYouTubeTimestamp("not-a-url", "45");
    expect(out).toContain("t=45");
  });
});
