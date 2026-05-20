/**
 * Shared YouTube helpers for map data modules.
 * Prefer direct watch?v= URLs in lineups; use ytSearch() only as a temporary fallback.
 */

export function ytSearch(mapSlug, query) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `cs2 ${mapSlug} ${query} lineup`
  )}`;
}

/** True when a lineup video field still points at YouTube search results. */
export function isYoutubeSearchUrl(url) {
  return typeof url === "string" && url.includes("youtube.com/results");
}
