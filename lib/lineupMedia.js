/**
 * Normalize lineup media fields so UI never crashes on legacy/malformed data.
 */

export function normalizeSource(source) {
  if (source == null) return null;
  if (typeof source === "string") {
    return source.length ? { name: source, url: "" } : null;
  }
  if (Array.isArray(source)) {
    const first = source.find((s) => s && typeof s === "object" && s.name);
    return first ? { name: String(first.name), url: typeof first.url === "string" ? first.url : "" } : null;
  }
  if (typeof source === "object" && source.name) {
    return { name: String(source.name), url: typeof source.url === "string" ? source.url : "" };
  }
  return null;
}

/** Extra attribution links (e.g. screenshot pack source). */
export function normalizeExtraSources(lineup) {
  const out = [];
  const primary = normalizeSource(lineup?.source);
  if (primary?.name) out.push(primary);
  const extra = normalizeSource(lineup?.screenshotSource);
  if (extra?.name && extra.name !== primary?.name) out.push(extra);
  if (Array.isArray(lineup?.sources)) {
    for (const s of lineup.sources) {
      const n = normalizeSource(s);
      if (n?.name && !out.some((x) => x.name === n.name && x.url === n.url)) out.push(n);
    }
  }
  return out;
}

export function normalizeAustincs(austincs) {
  if (austincs == null || typeof austincs !== "object" || Array.isArray(austincs)) {
    return { video: "", timestamp: "", note: "" };
  }
  return {
    video: typeof austincs.video === "string" ? austincs.video : "",
    timestamp: typeof austincs.timestamp === "string" ? austincs.timestamp : "",
    note: typeof austincs.note === "string" ? austincs.note : "",
  };
}
