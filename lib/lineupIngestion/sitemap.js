import { CS2UTIL_BASE, CS2UTIL_TYPES, CSNADES_BASE } from "./constants.js";

const LOCALE_PREFIXES = new Set(["zh", "ru", "pt"]);

function parseLocTags(xml) {
  const urls = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = re.exec(String(xml || "")))) {
    urls.push(match[1].trim());
  }
  return urls;
}

function parsePathSegments(url, base) {
  const prefix = `${base}/`;
  if (!url.startsWith(prefix)) return null;
  const path = url.slice(prefix.length).replace(/\/+$/, "");
  if (!path) return null;
  const segments = path.split("/").filter(Boolean);
  if (segments.length && LOCALE_PREFIXES.has(segments[0])) {
    return null;
  }
  return segments;
}

export function parseCs2UtilSitemap(xml, { mapIds, types = CS2UTIL_TYPES } = {}) {
  const mapIdSet = new Set(mapIds || []);
  const typeSet = new Set(types);
  const listPages = new Set();
  const detailPages = [];

  for (const url of parseLocTags(xml)) {
    const segments = parsePathSegments(url, CS2UTIL_BASE);
    if (!segments?.length) continue;

    const [mapId, typeOrSlug, slug] = segments;
    if (!mapIdSet.has(mapId)) continue;

    if (segments.length === 1) {
      continue;
    }

    if (segments.length === 2 && typeSet.has(segments[1])) {
      listPages.add(`${CS2UTIL_BASE}/${mapId}/${segments[1]}`);
      continue;
    }

    if (segments.length === 3 && typeSet.has(typeOrSlug) && slug) {
      detailPages.push({
        mapId,
        type: typeOrSlug,
        slug,
        url: `${CS2UTIL_BASE}/${mapId}/${typeOrSlug}/${slug}`,
      });
    }
  }

  return {
    listPages: [...listPages],
    detailPages,
  };
}

export function parseCsnadesSitemap(xml, { mapIds } = {}) {
  const mapIdSet = new Set(mapIds || []);
  const mapPages = new Set();
  const detailPages = [];

  for (const url of parseLocTags(xml)) {
    const segments = parsePathSegments(url, CSNADES_BASE);
    if (!segments?.length) continue;

    const [mapId, typePlural, slug] = segments;
    if (!mapIdSet.has(mapId)) continue;

    if (segments.length === 1) {
      mapPages.add(`${CSNADES_BASE}/${mapId}`);
      continue;
    }

    if (segments.length === 3 && slug) {
      detailPages.push({
        mapId,
        typePlural,
        slug,
        url: `${CSNADES_BASE}/${mapId}/${typePlural}/${slug}`,
      });
    }
  }

  return {
    mapPages: [...mapPages],
    detailPages,
  };
}
