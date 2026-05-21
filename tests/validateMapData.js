/**
 * Pure validation for map data modules (no React).
 * Used by unit tests and benchmarks for consistent metrics.
 */

import { PREMIER_MAP_IDS as PREMIER_LIST, WIP_MAP_IDS as WIP_LIST } from "../data/mapMeta.js";

const UTIL_WEIGHT = { SMOKE: 1, FLASH: 1, MOLLY: 1, HE: 1 };
const VALID_THROW_TYPES = new Set(["JT", "WJT", "LMB", "RMB", "WALK2", "RUN"]);
export const GRENADE_CARRY_CAP = 4;

const PREMIER_MAP_IDS = new Set(PREMIER_LIST);
const WIP_MAP_IDS = new Set(WIP_LIST);

function isWipMap(mapId, options = {}) {
  if (options.wip === true) return true;
  if (options.wip === false) return false;
  return WIP_MAP_IDS.has(mapId);
}

function isPremierMap(mapId) {
  return PREMIER_MAP_IDS.has(mapId);
}

function isYoutubeSearchUrl(url) {
  return typeof url === "string" && url.includes("youtube.com/results");
}

function screenshotsEmpty(screenshots) {
  if (!screenshots || typeof screenshots !== "object") return true;
  const { stand = "", aim = "", result = "" } = screenshots;
  return !stand && !aim && !result;
}

export function inPctRange(n) {
  // Must be a real number in 0–100. Reject the 0.0–1.0 radar coordinate scale:
  // a value <= 1 that came from the wrong scale would silently render in the top-left corner.
  // Allow exact 0 (valid edge) by checking the type plus the explicit 1 < n <= 100 boundary,
  // but keep the 0 edge legal by special-casing it.
  if (typeof n !== "number" || !Number.isFinite(n)) return false;
  if (n < 0 || n > 100) return false;
  // Reject the 0.0–1.0 normalized scale: anything strictly between 0 and 1 (exclusive of 1) is suspicious.
  if (n > 0 && n < 1) return false;
  return true;
}

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function isNonEmptyString(v) {
  return typeof v === "string" && v.length > 0;
}

function sourceShapeOk(s, path) {
  const errs = [];
  if (s === undefined || s === null) return errs;
  if (typeof s !== "object" || Array.isArray(s)) {
    errs.push(`${path}: source must be an object { name, url }`);
    return errs;
  }
  if (!isNonEmptyString(s.name)) errs.push(`${path}: source.name must be a non-empty string`);
  if (typeof s.url !== "string") errs.push(`${path}: source.url must be a string (may be empty)`);
  return errs;
}

function austincsShapeOk(a, path) {
  const errs = [];
  if (a === undefined || a === null) return errs;
  if (typeof a !== "object" || Array.isArray(a)) {
    errs.push(`${path}: austincs must be an object { video, timestamp, note }`);
    return errs;
  }
  for (const k of ["video", "timestamp", "note"]) {
    if (a[k] !== undefined && typeof a[k] !== "string") {
      errs.push(`${path}: austincs.${k} must be a string`);
    }
  }
  return errs;
}

function pointOk(p, label, path) {
  const errs = [];
  if (!p || typeof p !== "object") {
    errs.push(`${path}: missing ${label}`);
    return errs;
  }
  const hasPct = hasOwn(p, "x") || hasOwn(p, "y");
  const hasWorld = hasOwn(p, "worldX") || hasOwn(p, "worldY");

  if (hasPct && hasWorld) {
    errs.push(`${path}: ${label} cannot mix x/y with worldX/worldY`);
    return errs;
  }

  if (hasWorld) {
    if (typeof p.worldX !== "number" || !Number.isFinite(p.worldX)) {
      errs.push(`${path}: ${label}.worldX must be a finite number, got ${p.worldX}`);
    }
    if (typeof p.worldY !== "number" || !Number.isFinite(p.worldY)) {
      errs.push(`${path}: ${label}.worldY must be a finite number, got ${p.worldY}`);
    }
    return errs;
  }

  if (hasPct) {
    if (!inPctRange(p.x)) errs.push(`${path}: ${label}.x must be 0–100, got ${p.x}`);
    if (!inPctRange(p.y)) errs.push(`${path}: ${label}.y must be 0–100, got ${p.y}`);
    return errs;
  }

  errs.push(`${path}: ${label} must use x/y percent or worldX/worldY coordinates`);
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
/**
 * @param {object} mod
 * @param {string} mapId
 * @param {{ wip?: boolean }} [options] — when true, relaxes Premier-only rules (MUST_LEARN count, SPAWNS, RADAR_URL)
 */
export function validateMapModule(mod, mapId = "unknown", options = {}) {
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

  const wip = isWipMap(mapId, options);
  const premier = isPremierMap(mapId);

  if (premier && !wip && (!mod.RADAR_URL || mod.RADAR_URL === "")) {
    errors.push(`[${mapId}] RADAR_URL is required for Premier maps`);
  }

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
    if (L.throw && !VALID_THROW_TYPES.has(L.throw)) {
      errors.push(`${path}: unknown throw type "${L.throw}" (expected one of ${[...VALID_THROW_TYPES].join(", ")})`);
    }
    errors.push(...pointOk(L.radarPos, "radarPos", path));
    if (L.radarTarget !== undefined) errors.push(...pointOk(L.radarTarget, "radarTarget", path));
    errors.push(...sourceShapeOk(L.source, path));
    errors.push(...austincsShapeOk(L.austincs, path));
    if (L.video && isYoutubeSearchUrl(L.video)) {
      warnings.push(`${path}: video is a YouTube search URL — prefer a curated watch?v= link`);
    }
    if (screenshotsEmpty(L.screenshots)) {
      warnings.push(`${path}: screenshots.stand/aim/result are all empty`);
    } else if (L.screenshots && typeof L.screenshots === "object") {
      for (const field of ["stand", "aim", "result"]) {
        if (field in L.screenshots && L.screenshots[field] === "") {
          warnings.push(`${path}: screenshots.${field} is empty`);
        }
      }
    }
  }

  const radarCoords = [];
  for (const L of Object.values(LINEUPS)) {
    if (L?.radarPos && hasOwn(L.radarPos, "x") && Number.isFinite(L.radarPos.x)) radarCoords.push(L.radarPos.x);
    if (L?.radarPos && hasOwn(L.radarPos, "y") && Number.isFinite(L.radarPos.y)) radarCoords.push(L.radarPos.y);
  }
  if (radarCoords.length > 4) {
    const maxC = Math.max(...radarCoords);
    const minC = Math.min(...radarCoords);
    if (maxC <= 1 && minC >= 0) {
      warnings.push(
        `[${mapId}] radar coordinates appear to use 0–1 scale (max ${maxC}) — use 0–100 percentages`
      );
    }
  }

  if (!Array.isArray(MUST_LEARN)) errors.push(`[${mapId}].MUST_LEARN must be an array`);
  else {
    if (!wip && MUST_LEARN.length !== 5) {
      errors.push(`[${mapId}].MUST_LEARN must have exactly 5 entries (has ${MUST_LEARN.length})`);
    } else if (wip && MUST_LEARN.length !== 5) {
      warnings.push(`[${mapId}].MUST_LEARN has ${MUST_LEARN.length} entries (expected 5 when map leaves WIP)`);
    }
    const mustLearnSet = new Set(MUST_LEARN);
    for (const mid of MUST_LEARN) {
      if (!lineupIds.has(mid)) {
        errors.push(`[${mapId}].MUST_LEARN references unknown lineup "${mid}"`);
        continue;
      }
      if (!LINEUPS[mid]?.mustLearn) {
        errors.push(`[${mapId}].MUST_LEARN "${mid}" must have mustLearn: true on LINEUPS entry`);
      }
    }
    for (const id of lineupIds) {
      if (LINEUPS[id]?.mustLearn && !mustLearnSet.has(id)) {
        errors.push(`[${mapId}].LINEUPS.${id} has mustLearn: true but is not listed in MUST_LEARN`);
      }
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
      if (!Array.isArray(c.roundTypes) || !c.roundTypes.length) {
        errors.push(`[${mapId}].COMBOS.${cid}: missing or empty roundTypes`);
      }
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
      const perCarrier = new Map(); // carrier label -> total grenades
      const smokesByCarrier = new Map(); // carrier -> smoke count (CS2 caps smokes at 1 per player)
      for (const step of b.sequence) {
        if (!step.lineup || !lineupIds.has(step.lineup)) {
          errors.push(`[${mapId}].UTILITY_BELTS.${bid}: unknown lineup "${step?.lineup}"`);
          continue;
        }
        const carrier = typeof step.carrier === "string" && step.carrier ? step.carrier : "carrier";
        const u = LINEUPS[step.lineup]?.util;
        perCarrier.set(carrier, (perCarrier.get(carrier) || 0) + (UTIL_WEIGHT[u] || 1));
        if (u === "SMOKE") {
          smokesByCarrier.set(carrier, (smokesByCarrier.get(carrier) || 0) + 1);
        }
      }
      for (const [carrier, count] of perCarrier) {
        if (count > GRENADE_CARRY_CAP) {
          errors.push(
            `[${mapId}].UTILITY_BELTS.${bid}: carrier "${carrier}" throws ${count} grenades — exceeds CS2 carry cap of ${GRENADE_CARRY_CAP}. ` +
              `Split steps across players using step.carrier or reduce the sequence.`
          );
        }
      }
      for (const [carrier, smokes] of smokesByCarrier) {
        if (smokes > 2) {
          // CS2: max 1 smoke from shop, but 1 dropped pickup is realistic. >2 smokes on one carrier is impossible.
          errors.push(
            `[${mapId}].UTILITY_BELTS.${bid}: carrier "${carrier}" throws ${smokes} smokes — only 1 smoke is purchasable, ` +
              `and at most 1 can realistically be dropped. Split smokes across players.`
          );
        }
      }
      if (!Array.isArray(b.roundTypes) || !b.roundTypes.length) {
        errors.push(`[${mapId}].UTILITY_BELTS.${bid}: missing or empty roundTypes`);
      }
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

  if (premier && !wip && mod.SPAWNS === undefined) {
    errors.push(`[${mapId}] Missing export: SPAWNS (required for Premier maps)`);
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
    const r = validateMapModule(mod, id, { wip: entry?.wip === true || WIP_MAP_IDS.has(id) });
    byMap[id] = r;
    errors += r.errors.length;
    warnings += r.warnings.length;
  }
  return { byMap, errors, warnings };
}
