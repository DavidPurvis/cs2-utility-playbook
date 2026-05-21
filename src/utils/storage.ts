/**
 * Layered admin data store.
 *
 * Data lives in three "layers" that compose at read time:
 *   1. loaded     — the JSON file as imported at build time (immutable
 *                   for the running session)
 *   2. override   — admin edits persisted to localStorage. Survives a
 *                   page refresh. Reset by "Reset to last loaded".
 *   3. session    — unsaved edits in the current admin session, held
 *                   only in React state. Once committed, they fold into
 *                   `override`. Discarded on page close.
 *
 * Reads return the merged view: session ⊕ override ⊕ loaded. Writes
 * target `session` (in-memory) and, when committed, promote to
 * `override` (localStorage).
 *
 * Each "file" (map-config / spawns / utilities / scenarios) is stored
 * under its own key so admin can reset or export them independently.
 */

const NS = "cs2-playbook";
const VER = "v1";

export type FileKey =
  | "dust2-map-config"
  | "dust2-spawns"
  | "dust2-utilities"
  | "dust2-scenarios";

function lsKey(file: FileKey) {
  return `${NS}/${VER}/${file}`;
}

export function readOverride<T>(file: FileKey): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(lsKey(file));
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeOverride<T>(file: FileKey, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(lsKey(file), JSON.stringify(value));
  } catch {
    // localStorage might be full or disabled — fall back silently.
  }
}

export function clearOverride(file: FileKey): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(lsKey(file));
  } catch {
    // ignore
  }
}

export function clearAllOverrides(): void {
  if (typeof window === "undefined") return;
  for (const f of [
    "dust2-map-config",
    "dust2-spawns",
    "dust2-utilities",
    "dust2-scenarios",
  ] as const) {
    clearOverride(f);
  }
}

/**
 * Merge two arrays of items by `id`. Items from `overrides` replace
 * matching ids in `base`; unmatched override items are appended.
 * Items in `base` that aren't in `overrides` are preserved.
 *
 * Returns a new array; does not mutate inputs.
 */
export function mergeById<T extends { id: string }>(base: T[], overrides: T[] | null | undefined): T[] {
  if (!overrides || overrides.length === 0) return base;
  const byId = new Map<string, T>();
  for (const item of base) byId.set(item.id, item);
  for (const item of overrides) byId.set(item.id, item);
  return Array.from(byId.values());
}

/**
 * Merge a single record (config) by spreading override fields onto base.
 */
export function mergeRecord<T extends object>(base: T, override: Partial<T> | null | undefined): T {
  return override ? { ...base, ...override } : base;
}
