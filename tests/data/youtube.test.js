import { describe, expect, it } from "vitest";
import { isYoutubeSearchUrl, ytSearch } from "../../data/youtube.js";

describe("data/youtube", () => {
  it("builds encoded search URLs with map slug and query", () => {
    const url = ytSearch("mirage", "a site smoke");
    expect(url).toContain("youtube.com/results");
    expect(url).toContain(encodeURIComponent("cs2 mirage a site smoke lineup"));
  });

  it("detects YouTube search URLs", () => {
    expect(isYoutubeSearchUrl("https://www.youtube.com/results?search_query=foo")).toBe(true);
    expect(isYoutubeSearchUrl("https://www.youtube.com/watch?v=abc")).toBe(false);
    expect(isYoutubeSearchUrl("")).toBe(false);
    expect(isYoutubeSearchUrl(null)).toBe(false);
  });
});
