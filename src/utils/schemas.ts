/**
 * Runtime schema validators for the four data files. Used:
 *   - At boot, when loading JSON, to reject malformed entries
 *   - In the admin Import flow, to reject user-pasted JSON that
 *     doesn't match the schema
 *   - In tests, as a structural integrity check
 *
 * Each validator returns a `ValidationResult`: a list of `errors` with
 * a `path` pointing at the offending field and a human-readable
 * `message`. An empty error list means the value is valid.
 *
 * These validators are deliberately permissive about optional fields:
 * they only flag missing/wrong required fields and ill-typed required
 * fields. They do NOT enforce business rules like "scenario player
 * count matches the number of player roles" — that's the responsibility
 * of the admin editors before saving.
 */
import type {
  MapConfig,
  Scenario,
  ScenarioPlayer,
  Spawn,
  Utility,
  WorldPoint,
} from "../types/map";

export interface ValidationIssue {
  path: string;
  message: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: ValidationIssue[];
}

const SIDES = new Set(["T", "CT"]);
const UTIL_TYPES = new Set(["smoke", "flash", "molotov", "he"]);
const THROW_STYLES = new Set(["normal", "jump", "run", "jump+run", "crouch"]);
const MOVEMENTS = new Set(["standing", "walking", "running"]);
const DIFFICULTIES = new Set(["easy", "medium", "hard"]);
const SCENARIO_DIFFICULTIES = new Set(["beginner", "intermediate", "advanced"]);
const PLAYER_COUNTS = new Set([2, 3, 4, 5]);

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isFiniteNum(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function ok(): ValidationResult {
  return { ok: true, errors: [] };
}

function err(errors: ValidationIssue[]): ValidationResult {
  return { ok: errors.length === 0, errors };
}

function checkWorldPoint(value: unknown, path: string): ValidationIssue[] {
  const errors: ValidationIssue[] = [];
  if (!isObject(value)) {
    errors.push({ path, message: "expected object" });
    return errors;
  }
  if (!isFiniteNum(value.x)) errors.push({ path: `${path}.x`, message: "expected finite number" });
  if (!isFiniteNum(value.y)) errors.push({ path: `${path}.y`, message: "expected finite number" });
  if (value.z !== undefined && !isFiniteNum(value.z))
    errors.push({ path: `${path}.z`, message: "expected finite number when present" });
  return errors;
}

// ── MapConfig ─────────────────────────────────────────────────
export function validateMapConfig(value: unknown): ValidationResult {
  const errors: ValidationIssue[] = [];
  if (!isObject(value)) return err([{ path: "$", message: "expected object" }]);
  for (const key of ["id", "displayName", "valveMapId", "radarImage"] as const) {
    if (!isString(value[key])) errors.push({ path: `$.${key}`, message: "expected non-empty string" });
  }
  for (const key of ["pos_x", "pos_y", "scale", "sourceResolution"] as const) {
    if (!isFiniteNum(value[key])) errors.push({ path: `$.${key}`, message: "expected finite number" });
  }
  return err(errors);
}

export function isMapConfig(value: unknown): value is MapConfig {
  return validateMapConfig(value).ok;
}

// ── Spawn ─────────────────────────────────────────────────────
export function validateSpawn(value: unknown, idx = 0): ValidationResult {
  const path = `$[${idx}]`;
  if (!isObject(value)) return err([{ path, message: "expected object" }]);
  const errors: ValidationIssue[] = [];
  if (!isString(value.id)) errors.push({ path: `${path}.id`, message: "expected non-empty string" });
  if (!SIDES.has(value.side as string))
    errors.push({ path: `${path}.side`, message: "expected 'T' or 'CT'" });
  if (!isString(value.label)) errors.push({ path: `${path}.label`, message: "expected non-empty string" });
  errors.push(...checkWorldPoint(value.world, `${path}.world`));
  return err(errors);
}

export function validateSpawns(values: unknown): ValidationResult {
  if (!Array.isArray(values)) return err([{ path: "$", message: "expected array" }]);
  const errors: ValidationIssue[] = [];
  values.forEach((v, i) => errors.push(...validateSpawn(v, i).errors));
  return err(errors);
}

export function isSpawn(value: unknown): value is Spawn {
  return validateSpawn(value).ok;
}

// ── Utility ───────────────────────────────────────────────────
export function validateUtility(value: unknown, idx = 0): ValidationResult {
  const path = `$[${idx}]`;
  if (!isObject(value)) return err([{ path, message: "expected object" }]);
  const errors: ValidationIssue[] = [];
  if (!isString(value.id)) errors.push({ path: `${path}.id`, message: "expected non-empty string" });
  if (!isString(value.name)) errors.push({ path: `${path}.name`, message: "expected non-empty string" });
  if (!UTIL_TYPES.has(value.type as string))
    errors.push({ path: `${path}.type`, message: "expected smoke | flash | molotov | he" });
  if (!SIDES.has(value.side as string))
    errors.push({ path: `${path}.side`, message: "expected 'T' or 'CT'" });
  if (!isString(value.area)) errors.push({ path: `${path}.area`, message: "expected non-empty string" });

  // throwFrom must have a world point
  if (!isObject(value.throwFrom)) {
    errors.push({ path: `${path}.throwFrom`, message: "expected object" });
  } else {
    errors.push(...checkWorldPoint((value.throwFrom as Record<string, unknown>).world, `${path}.throwFrom.world`));
  }

  // landingAt requires AT LEAST one of world or percent
  if (!isObject(value.landingAt)) {
    errors.push({ path: `${path}.landingAt`, message: "expected object" });
  } else {
    const la = value.landingAt as Record<string, unknown>;
    if (la.world === undefined && la.percent === undefined) {
      errors.push({ path: `${path}.landingAt`, message: "expected at least one of `world` or `percent`" });
    }
    if (la.world !== undefined) errors.push(...checkWorldPoint(la.world, `${path}.landingAt.world`));
    if (la.percent !== undefined) {
      if (!isObject(la.percent)) {
        errors.push({ path: `${path}.landingAt.percent`, message: "expected object" });
      } else {
        if (!isFiniteNum((la.percent as Record<string, unknown>).x))
          errors.push({ path: `${path}.landingAt.percent.x`, message: "expected finite number" });
        if (!isFiniteNum((la.percent as Record<string, unknown>).y))
          errors.push({ path: `${path}.landingAt.percent.y`, message: "expected finite number" });
      }
    }
  }

  if (!THROW_STYLES.has(value.throwStyle as string))
    errors.push({ path: `${path}.throwStyle`, message: "expected normal | jump | run | jump+run | crouch" });
  if (!MOVEMENTS.has(value.movement as string))
    errors.push({ path: `${path}.movement`, message: "expected standing | walking | running" });
  if (!DIFFICULTIES.has(value.difficulty as string))
    errors.push({ path: `${path}.difficulty`, message: "expected easy | medium | hard" });

  return err(errors);
}

export function validateUtilities(values: unknown): ValidationResult {
  if (!Array.isArray(values)) return err([{ path: "$", message: "expected array" }]);
  const errors: ValidationIssue[] = [];
  values.forEach((v, i) => errors.push(...validateUtility(v, i).errors));
  return err(errors);
}

export function isUtility(value: unknown): value is Utility {
  return validateUtility(value).ok;
}

// ── Scenario ──────────────────────────────────────────────────
function validateScenarioPlayer(value: unknown, path: string): ValidationIssue[] {
  if (!isObject(value)) return [{ path, message: "expected object" }];
  const errors: ValidationIssue[] = [];
  if (!isString(value.role)) errors.push({ path: `${path}.role`, message: "expected non-empty string" });
  if (!isString(value.label)) errors.push({ path: `${path}.label`, message: "expected non-empty string" });
  if (!isString(value.color)) errors.push({ path: `${path}.color`, message: "expected non-empty string" });
  if (!Array.isArray(value.actions)) {
    errors.push({ path: `${path}.actions`, message: "expected array" });
  } else {
    value.actions.forEach((a, ai) => {
      const ap = `${path}.actions[${ai}]`;
      if (!isObject(a)) {
        errors.push({ path: ap, message: "expected object" });
        return;
      }
      if (!isFiniteNum((a as { order?: unknown }).order))
        errors.push({ path: `${ap}.order`, message: "expected finite number" });
      if (!isString((a as { utilityId?: unknown }).utilityId))
        errors.push({ path: `${ap}.utilityId`, message: "expected non-empty string" });
    });
  }
  return errors;
}

export function validateScenario(value: unknown, idx = 0): ValidationResult {
  const path = `$[${idx}]`;
  if (!isObject(value)) return err([{ path, message: "expected object" }]);
  const errors: ValidationIssue[] = [];
  for (const k of ["id", "name", "description", "targetArea"] as const) {
    if (!isString(value[k])) errors.push({ path: `${path}.${k}`, message: "expected non-empty string" });
  }
  if (value.map !== "dust2") errors.push({ path: `${path}.map`, message: "expected 'dust2'" });
  if (!SIDES.has(value.side as string))
    errors.push({ path: `${path}.side`, message: "expected 'T' or 'CT'" });
  if (!SCENARIO_DIFFICULTIES.has(value.difficulty as string))
    errors.push({ path: `${path}.difficulty`, message: "expected beginner | intermediate | advanced" });
  if (!PLAYER_COUNTS.has(value.playerCount as number))
    errors.push({ path: `${path}.playerCount`, message: "expected 2 | 3 | 4 | 5" });
  if (!Array.isArray(value.players)) {
    errors.push({ path: `${path}.players`, message: "expected array" });
  } else {
    (value.players as unknown[]).forEach((p, i) => {
      errors.push(...validateScenarioPlayer(p, `${path}.players[${i}]`));
    });
  }
  return err(errors);
}

export function validateScenarios(values: unknown): ValidationResult {
  if (!Array.isArray(values)) return err([{ path: "$", message: "expected array" }]);
  const errors: ValidationIssue[] = [];
  values.forEach((v, i) => errors.push(...validateScenario(v, i).errors));
  return err(errors);
}

export function isScenario(value: unknown): value is Scenario {
  return validateScenario(value).ok;
}

// ── Utility predicate exports for tests / loaders ────────────
export type { WorldPoint, ScenarioPlayer };
export { isObject, isFiniteNum, isString };

// Convenience: validate a full bundle. Used by the Import JSON flow.
export function validateBundle(value: unknown): ValidationResult {
  if (!isObject(value)) return err([{ path: "$", message: "expected object" }]);
  const errors: ValidationIssue[] = [];
  if (value.config !== undefined)
    errors.push(...validateMapConfig(value.config).errors.map((e) => ({ ...e, path: `config${e.path.slice(1)}` })));
  if (value.spawns !== undefined)
    errors.push(...validateSpawns(value.spawns).errors.map((e) => ({ ...e, path: `spawns${e.path.slice(1)}` })));
  if (value.utilities !== undefined)
    errors.push(...validateUtilities(value.utilities).errors.map((e) => ({ ...e, path: `utilities${e.path.slice(1)}` })));
  if (value.scenarios !== undefined)
    errors.push(...validateScenarios(value.scenarios).errors.map((e) => ({ ...e, path: `scenarios${e.path.slice(1)}` })));
  return err(errors);
}

// no-op marker so this file always has at least one runtime export
export const __SCHEMA_VERSION__ = 1;
// keep `ok()` referenced so tree-shaking doesn't drop it (used by future expansions)
export const __OK_SENTINEL__ = () => ok();
