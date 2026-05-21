export function decodeHydrationPayload(html) {
  return String(html || "")
    .replace(/\\"/g, "\"")
    .replace(/\\u0026/g, "&");
}

export function extractJsonObjectAt(text, startIndex) {
  if (text[startIndex] !== "{") return null;
  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = startIndex; i < text.length; i += 1) {
    const ch = text[i];

    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === "\\") {
        escape = true;
      } else if (ch === "\"") {
        inString = false;
      }
      continue;
    }

    if (ch === "\"") {
      inString = true;
      continue;
    }
    if (ch === "{") {
      depth += 1;
      continue;
    }
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) return text.slice(startIndex, i + 1);
    }
  }
  return null;
}

export function extractObjectsFromText(text, startNeedle, predicate) {
  const out = [];
  let idx = 0;
  while (idx < text.length) {
    const start = text.indexOf(startNeedle, idx);
    if (start === -1) break;
    const raw = extractJsonObjectAt(text, start);
    if (!raw) {
      idx = start + startNeedle.length;
      continue;
    }
    try {
      const obj = JSON.parse(raw);
      if (!predicate || predicate(obj)) out.push(obj);
    } catch {
      // skip malformed object candidates
    }
    idx = start + raw.length;
  }
  return out;
}

export function extractLineupObjectBySlug(html, slug) {
  const decoded = decodeHydrationPayload(html);
  const needle = `"positionId":"${slug}"`;
  const idx = decoded.indexOf(needle);
  if (idx === -1) return null;
  const start = decoded.lastIndexOf("{", idx);
  if (start === -1) return null;
  const raw = extractJsonObjectAt(decoded, start);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
