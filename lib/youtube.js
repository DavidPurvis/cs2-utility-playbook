/** Build a YouTube URL that honors an optional timestamp without breaking existing query params. */
export function withYouTubeTimestamp(videoUrl, timestamp) {
  if (!videoUrl) return "";
  if (timestamp === undefined || timestamp === null || timestamp === "") return videoUrl;
  const ts = String(timestamp).trim();
  if (!ts) return videoUrl;
  try {
    const u = new URL(videoUrl);
    u.searchParams.set("t", ts);
    return u.toString();
  } catch {
    const sep = videoUrl.includes("?") ? "&" : "?";
    return `${videoUrl.replace(/[?&]t=[^&]*/g, "")}${sep}t=${encodeURIComponent(ts)}`;
  }
}
