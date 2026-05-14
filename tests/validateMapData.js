/**
 * Pure validation for map data modules (no React).
 * Used by unit tests and benchmarks for consistent metrics.
 */

const UTIL_WEIGHT = { SMOKE: 1, FLASH: 1, MOLLY: 1, HE: 1 };

function inPctRange(n) {
  return typeof n === "number" && n >= 0 && n <= 100;
}

function pointOk(p, label, path) {
  const errs = [];
  if (!p || typeof p !== "object") {
    errs.push(`${path}: missing ${label}`);
    return errs;
  }
  if (!inPctRange(p.x)) errs.push(`${path}: ${label}.x must be 0–100, got ${p.x}`);
  if (!inPctRange(p.y)) errs.push(`${path}: ${label}.y must be 0–100, got ${p.y}`);
  return errs;
}

/** String / enum fields validated for presence (radarPos validated separately as coordinates). */
const REQUIRED_LINEUP_KEYS = [
  "id",
  "name",
  "util",
  "throw",
  "side",
  "area",
  "purpose",
  "stand",
  "aim",
];

/**
 * @param {object} mod - namespace import from data/*.js
 * @param {string} mapId - e.g. "ancient"
 * @returns {{ errors: string[], warnings: string[], stats: { lineupCount: number, comboCount: number, beltCount: number, scenarioCount: number, positionCount: number, spawnSlots: number } }}
 */
export function validateMapModule(mod, mapId = "unknown") {
  const errors = [];
  const warnings = [];
  const stats = {
    lineupCount: 0,
    comboCount: 0,
    beltCount: 0,
    scenarioCount: 0,
    positionCount: 0,
    spawnSlots: 0,
  };

  for (const key of ["MAP_NAME", "RADAR_URL", "LINEUPS", "MUST_LEARN", "COMBOS", "UTILITY_BELTS", "SCENARIOS", "SETUP_POSITIONS"]) {
    if (mod[key] === undefined) errors.push(`[${mapId}] Missing export: ${key}`);
  }
  if (errors.length) return { errors, warnings, stats };

  const { LINEUPS, MUST_LEARN, COMBOS, UTILITY_BELTS, SCENARIOS, SETUP_POSITIONS } = mod;
  const lineupIds = new Set(Object.keys(LINEUPS));

  stats.lineupCount = lineupIds.size;

  for (const id of lineupIds) {
    const L = LINEUPS[id];
    const path = `[${mapId}].LINEUPS.${id}`;
    if (!L || typeof L !== "object") {
      errors.push(`${path}: invalid entry`);
      continue;
    }
    if (L.id !== id) errors.push(`${path}: id field "${L.id}" does not match key`);
    for (const k of REQUIRED_LINEUP_KEYS) {
      if (L[k] === undefined || L[k] === "") errors.push(`${path}: missing or empty "${k}"`);
    }
    if (L.util && !UTIL_WEIGHT[L.util]) warnings.push(`${path}: unknown util "${L.util}"`);
    errors.push(...pointOk(L.radarPos, "radarPos", path));
    if (L.radarTarget !== undefined) errors.push(...pointOk(L.radarTarget, "radarTarget", path));
  }

  if (!Array.isArray(MUST_LEARN)) errors.push(`[${mapId}].MUST_LEARN must be an array`);
  else {
    if (MUST_LEARN.length !== 5) warnings.push(`[${mapId}].MUST_LEARN has ${MUST_LEARN.length} entries (expected 5 for this project)`);
    for (const mid of MUST_LEARN) {
      if (!lineupIds.has(mid)) errors.push(`[${mapId}].MUST_LEARN references unknown lineup "${mid}"`);
    }
  }

  if (!Array.isArray(COMBOS)) errors.push(`[${mapId}].COMBOS must be an array`);
  else {
    stats.comboCount = COMBOS.length;
    for (const c of COMBOS) {
      const cid = c?.id || "?";
      if (!c.lineups || !Array.isArray(c.lineups)) errors.push(`[${mapId}].COMBOS.${cid}: missing lineups array`);
      else {
        for (const row of c.lineups) {
          if (!row.lineup || !lineupIds.has(row.lineup)) {
            errors.push(`[${mapId}].COMBOS.${cid}: unknown lineup "${row?.lineup}"`);
          }
        }
      }
      if (!c.roundTypes?.length) warnings.push(`[${mapId}].COMBOS.${cid}: empty roundTypes`);
    }
  }

  if (!Array.isArray(UTILITY_BELTS)) errors.push(`[${mapId}].UTILITY_BELTS must be an array`);
  else {
    stats.beltCount = UTILITY_BELTS.length;
    for (const b of UTILITY_BELTS) {
      const bid = b?.id || "?";
      if (!b.sequence || !Array.isArray(b.sequence)) {
        errors.push(`[${mapId}].UTILITY_BELTS.${bid}: missing sequence`);
        continue;
      }
      let nades = 0;
      for (const step of b.sequence) {
        if (!step.lineup || !lineupIds.has(step.lineup)) {
          errors.push(`[${mapId}].UTILITY_BELTS.${bid}: unknown lineup "${step?.lineup}"`);
          continue;
        }
        const u = LINEUPS[step.lineup]?.util;
        nades += UTIL_WEIGHT[u] || 1;
      }
      if (nades > 4) warnings.push(`[${mapId}].UTILITY_BELTS.${bid}: sequence uses ${nades} grenade throws (CS2 carry is 4; drops may apply — verify intent)`);
    }
  }

  if (!Array.isArray(SCENARIOS)) errors.push(`[${mapId}].SCENARIOS must be an array`);
  else {
    stats.scenarioCount = SCENARIOS.length;
    for (const s of SCENARIOS) {
      const sid = s?.id || "?";
      const sp = `[${mapId}].SCENARIOS.${sid}`;
      if (!s?.title) errors.push(`${sp}: missing title`);
      if (!s?.side) errors.push(`${sp}: missing side`);
      if (!Array.isArray(s?.bullets) || !s.bullets.length) warnings.push(`${sp}: missing or empty bullets`);
    }
  }
  if (!Array.isArray(SETUP_POSITIONS)) errors.push(`[${mapId}].SETUP_POSITIONS must be an array`);
  else {
    stats.positionCount = SETUP_POSITIONS.length;
    for (const pos of SETUP_POSITIONS) {
      const pid = pos?.id || "?";
      const ppath = `[${mapId}].SETUP_POSITIONS.${pid}`;
      if (!pos.lineups?.length) warnings.push(`${ppath}: no lineups`);
      errors.push(...pointOk(pos.pos, "pos", ppath));
      for (const lid of pos.lineups || []) {
        if (!lineupIds.has(lid)) errors.push(`${ppath}: unknown lineup "${lid}"`);
      }
    }
  }

  const SPAWNS = mod.SPAWNS;
  if (SPAWNS !== undefined) {
    for (const side of ["T", "CT"]) {
      const arr = SPAWNS[side];
      if (!Array.isArray(arr)) {
        warnings.push(`[${mapId}].SPAWNS.${side}: missing or not an array`);
        continue;
      }
      stats.spawnSlots += arr.length;
      for (const sp of arr) {
        const sid = sp?.id ?? "?";
        errors.push(...pointOk(sp.pos, "pos", `[${mapId}].SPAWNS.${side}[${sid}]`));
        for (const lid of sp.lineups || []) {
          if (!lineupIds.has(lid)) errors.push(`[${mapId}].SPAWNS.${side}[${sid}]: unknown lineup "${lid}"`);
        }
      }
    }
  }

  return { errors, warnings, stats };
}

/** Run validator on every map in the registry object (same shape as default export from maps.js). */
export function validateAllMaps(mapsObject) {
  const byMap = {};
  let errors = 0;
  let warnings = 0;
  for (const [id, entry] of Object.entries(mapsObject)) {
    const mod = entry?.module;
    if (!mod) {
      byMap[id] = { errors: [`[${id}] missing module`], warnings: [], stats: {} };
      errors += 1;
      continue;
    }
    const r = validateMapModule(mod, id);
    byMap[id] = r;
    errors += r.errors.length;
    warnings += r.warnings.length;
  }
  return { byMap, errors, warnings };
}
