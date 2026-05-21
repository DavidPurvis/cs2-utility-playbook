import { UTIL_NOISE_TOKENS } from "./constants.js";

export function normalizeWhitespace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export function normalizeLabel(value) {
  return normalizeWhitespace(String(value || "").replace(/[-_]/g, " "));
}

export function stripUtilityWords(value) {
  const tokens = normalizeLabel(value)
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .filter((t) => !UTIL_NOISE_TOKENS.has(t));
  return tokens.join(" ");
}

export function toTokenSet(value) {
  if (!value) return new Set();
  return new Set(
    stripUtilityWords(value)
      .split(" ")
      .map((t) => t.trim())
      .filter(Boolean)
  );
}

export function slugify(value) {
  return normalizeLabel(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseFromTo({ name, slug, titleFrom, titleTo }) {
  if (titleFrom || titleTo) {
    return {
      from: normalizeLabel(titleFrom || ""),
      to: normalizeLabel(titleTo || ""),
    };
  }

  const candidateName = normalizeWhitespace(name || "");
  const candidateSlug = normalizeWhitespace(slug || "");

  let m = candidateName.match(/^(.*?)\s+from\s+(.+)$/i);
  if (m) return { to: normalizeLabel(m[1]), from: normalizeLabel(m[2]) };

  m = candidateSlug.match(/^(.*?)-from-(.+)$/i);
  if (m) return { to: normalizeLabel(m[1]), from: normalizeLabel(m[2]) };

  return { to: normalizeLabel(candidateName || candidateSlug), from: "" };
}
