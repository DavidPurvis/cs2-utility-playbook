/**
 * Loads the four Dust 2 JSON data files at boot and exposes a single
 * `MapDataBundle`. Future phases will layer localStorage overrides and
 * admin-session edits on top of this loader.
 */
import mapConfigRaw from "../data/maps/dust2/map-config.json";
import spawnsRaw from "../data/maps/dust2/spawns.json";
import utilitiesRaw from "../data/maps/dust2/utilities.json";
import scenariosRaw from "../data/maps/dust2/scenarios.json";
import type { MapConfig, MapDataBundle, Scenario, Spawn, Utility } from "../types/map";
import {
  validateMapConfig,
  validateScenarios,
  validateSpawns,
  validateUtilities,
} from "../utils/schemas";

export interface LoadedData {
  bundle: MapDataBundle;
  errors: { file: string; path: string; message: string }[];
}

/**
 * Synchronous loader. Files are bundled at build time so there's no
 * async fetch. Returns a bundle plus a list of schema errors (empty
 * in the normal case).
 */
export function loadMapData(): LoadedData {
  const errors: LoadedData["errors"] = [];

  const cfg = validateMapConfig(mapConfigRaw);
  if (!cfg.ok) {
    for (const e of cfg.errors) errors.push({ file: "map-config.json", path: e.path, message: e.message });
  }
  const sp = validateSpawns(spawnsRaw);
  if (!sp.ok) {
    for (const e of sp.errors) errors.push({ file: "spawns.json", path: e.path, message: e.message });
  }
  const ut = validateUtilities(utilitiesRaw);
  if (!ut.ok) {
    for (const e of ut.errors) errors.push({ file: "utilities.json", path: e.path, message: e.message });
  }
  const sc = validateScenarios(scenariosRaw);
  if (!sc.ok) {
    for (const e of sc.errors) errors.push({ file: "scenarios.json", path: e.path, message: e.message });
  }

  return {
    bundle: {
      config: mapConfigRaw as MapConfig,
      spawns: spawnsRaw as Spawn[],
      utilities: utilitiesRaw as Utility[],
      scenarios: scenariosRaw as Scenario[],
    },
    errors,
  };
}

let cached: LoadedData | null = null;
export function useMapData(): LoadedData {
  if (!cached) cached = loadMapData();
  return cached;
}
