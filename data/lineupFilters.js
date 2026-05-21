/**
 * Lineup visibility filters.
 *
 * Manual config path:
 * - Add lineup IDs to GLOBAL_HIDDEN_LINEUP_IDS to hide them on every map.
 * - Add lineup IDs to MAP_HIDDEN_LINEUP_IDS[mapId] to hide them only on one map.
 *
 * IDs must match keys in each map module's LINEUPS export.
 */

export const GLOBAL_HIDDEN_LINEUP_IDS = [
  // "example_lineup_id",
];

export const MAP_HIDDEN_LINEUP_IDS = {
  ancient: [],
  dust2: [],
  inferno: [],
  mirage: [],
  nuke: [],
  anubis: [],
  overpass: [],
  cache: [],
};

function normalizeLineupId(value) {
  return typeof value === "string" ? value.trim() : "";
}

function uniqueLineupIds(values) {
  if (!Array.isArray(values)) return [];
  const out = [];
  const seen = new Set();
  for (const value of values) {
    const id = normalizeLineupId(value);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

function filterLineupIdList(ids, validLineupIds) {
  if (!Array.isArray(ids)) return [];
  return ids.filter((id) => validLineupIds.has(id));
}

export function sanitizeHiddenLineupOverridesByMap(rawValue) {
  if (!rawValue || typeof rawValue !== "object" || Array.isArray(rawValue)) return {};
  const out = {};
  for (const [mapIdRaw, idsRaw] of Object.entries(rawValue)) {
    const mapId = normalizeLineupId(mapIdRaw);
    if (!mapId) continue;
    const ids = uniqueLineupIds(idsRaw);
    if (ids.length > 0) out[mapId] = ids;
  }
  return out;
}

export function getConfiguredHiddenLineupIds(mapId) {
  const mapIds = Array.isArray(MAP_HIDDEN_LINEUP_IDS?.[mapId]) ? MAP_HIDDEN_LINEUP_IDS[mapId] : [];
  return uniqueLineupIds([...GLOBAL_HIDDEN_LINEUP_IDS, ...mapIds]);
}

export function getCombinedHiddenLineupIds(mapId, overridesByMap = {}) {
  const sanitizedOverrides = sanitizeHiddenLineupOverridesByMap(overridesByMap);
  const overrideIds = sanitizedOverrides[mapId] || [];
  return uniqueLineupIds([...getConfiguredHiddenLineupIds(mapId), ...overrideIds]);
}

/**
 * Derive safe map data with hidden lineups removed across all known references.
 * The raw map module is left untouched.
 */
export function deriveFilteredMapData(rawMapData, hiddenLineupIds = []) {
  if (!rawMapData || typeof rawMapData !== "object") return rawMapData;

  const hiddenSet = new Set(uniqueLineupIds(hiddenLineupIds));
  if (hiddenSet.size === 0) return rawMapData;

  if (!rawMapData.LINEUPS || typeof rawMapData.LINEUPS !== "object") return rawMapData;

  const LINEUPS = Object.fromEntries(
    Object.entries(rawMapData.LINEUPS).filter(([id]) => !hiddenSet.has(id))
  );
  const validLineupIds = new Set(Object.keys(LINEUPS));

  const MUST_LEARN = Array.isArray(rawMapData.MUST_LEARN)
    ? filterLineupIdList(rawMapData.MUST_LEARN, validLineupIds)
    : rawMapData.MUST_LEARN;

  const COMBOS = Array.isArray(rawMapData.COMBOS)
    ? rawMapData.COMBOS
      .map((combo) => {
        if (!combo || typeof combo !== "object") return combo;
        const lineups = Array.isArray(combo.lineups)
          ? combo.lineups.filter((row) => row && typeof row === "object" && validLineupIds.has(row.lineup))
          : [];
        return { ...combo, lineups };
      })
      .filter((combo) => !combo || typeof combo !== "object" || combo.lineups.length > 0)
    : rawMapData.COMBOS;

  const UTILITY_BELTS = Array.isArray(rawMapData.UTILITY_BELTS)
    ? rawMapData.UTILITY_BELTS
      .map((belt) => {
        if (!belt || typeof belt !== "object") return belt;
        const sequence = Array.isArray(belt.sequence)
          ? belt.sequence.filter((step) => step && typeof step === "object" && validLineupIds.has(step.lineup))
          : [];
        return { ...belt, sequence };
      })
      .filter((belt) => !belt || typeof belt !== "object" || belt.sequence.length > 0)
    : rawMapData.UTILITY_BELTS;

  const SETUP_POSITIONS = Array.isArray(rawMapData.SETUP_POSITIONS)
    ? rawMapData.SETUP_POSITIONS.map((pos) => {
      if (!pos || typeof pos !== "object") return pos;
      return { ...pos, lineups: filterLineupIdList(pos.lineups, validLineupIds) };
    })
    : rawMapData.SETUP_POSITIONS;

  const SPAWNS = rawMapData.SPAWNS && typeof rawMapData.SPAWNS === "object"
    ? Object.fromEntries(
      Object.entries(rawMapData.SPAWNS).map(([side, spawns]) => {
        if (!Array.isArray(spawns)) return [side, spawns];
        return [
          side,
          spawns.map((spawn) => {
            if (!spawn || typeof spawn !== "object") return spawn;
            return { ...spawn, lineups: filterLineupIdList(spawn.lineups, validLineupIds) };
          }),
        ];
      })
    )
    : rawMapData.SPAWNS;

  return {
    ...rawMapData,
    LINEUPS,
    MUST_LEARN,
    COMBOS,
    UTILITY_BELTS,
    SETUP_POSITIONS,
    SPAWNS,
  };
}
