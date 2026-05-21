/**
 * Single source of truth for the editable session bundle.
 *
 * - On mount: loads JSON files, validates, then layers any persisted
 *   localStorage overrides on top.
 * - Exposes setters that update both React state AND localStorage.
 * - Returns helpers to add / update / delete utilities and scenarios.
 * - Returns the merged bundle for read-only consumers (Spawn tab,
 *   ScenariosList, etc.).
 *
 * The provider lives inside the AdminProvider so admin actions can
 * call into it.
 */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useMapData } from "./useMapData";
import {
  mergeById,
  mergeRecord,
  readOverride,
  writeOverride,
  clearOverride,
  clearAllOverrides,
  type FileKey,
} from "../utils/storage";
import type {
  MapConfig,
  Scenario,
  Spawn,
  Utility,
} from "../types/map";

interface EditableData {
  config: MapConfig;
  spawns: Spawn[];
  utilities: Utility[];
  scenarios: Scenario[];

  // Utilities
  upsertUtility: (u: Utility) => void;
  deleteUtility: (id: string) => void;

  // Scenarios
  upsertScenario: (s: Scenario) => void;
  deleteScenario: (id: string) => void;

  // Config / spawns
  updateConfig: (patch: Partial<MapConfig>) => void;
  upsertSpawn: (s: Spawn) => void;
  deleteSpawn: (id: string) => void;

  // Bulk
  importBundle: (b: { config?: MapConfig; spawns?: Spawn[]; utilities?: Utility[]; scenarios?: Scenario[] }) => void;
  resetAll: () => void;
  resetFile: (file: FileKey) => void;
}

const Ctx = createContext<EditableData | null>(null);

function load<T>(file: FileKey, fallback: T): T {
  const o = readOverride<T>(file);
  return o ?? fallback;
}

export function EditableDataProvider({ children }: { children: ReactNode }) {
  const { bundle } = useMapData();

  // Session state is initialized from localStorage (override) which is
  // initialized from the shipped JSON (loaded). Updates persist into
  // localStorage so a refresh keeps the work.
  const [config, setConfig] = useState<MapConfig>(() =>
    mergeRecord(bundle.config, load<Partial<MapConfig>>("dust2-map-config", {}))
  );
  const [spawns, setSpawns] = useState<Spawn[]>(() =>
    mergeById(bundle.spawns, load<Spawn[] | null>("dust2-spawns", null))
  );
  const [utilities, setUtilities] = useState<Utility[]>(() =>
    mergeById(bundle.utilities, load<Utility[] | null>("dust2-utilities", null))
  );
  const [scenarios, setScenarios] = useState<Scenario[]>(() =>
    mergeById(bundle.scenarios, load<Scenario[] | null>("dust2-scenarios", null))
  );

  const persistUtilities = useCallback((next: Utility[]) => {
    setUtilities(next);
    writeOverride("dust2-utilities", next);
  }, []);

  const persistScenarios = useCallback((next: Scenario[]) => {
    setScenarios(next);
    writeOverride("dust2-scenarios", next);
  }, []);

  const persistSpawns = useCallback((next: Spawn[]) => {
    setSpawns(next);
    writeOverride("dust2-spawns", next);
  }, []);

  const persistConfig = useCallback((next: MapConfig) => {
    setConfig(next);
    writeOverride("dust2-map-config", next);
  }, []);

  const upsertUtility = useCallback(
    (u: Utility) => {
      persistUtilities(mergeById(utilities, [u]));
    },
    [utilities, persistUtilities]
  );

  const deleteUtility = useCallback(
    (id: string) => {
      persistUtilities(utilities.filter((u) => u.id !== id));
    },
    [utilities, persistUtilities]
  );

  const upsertScenario = useCallback(
    (s: Scenario) => {
      persistScenarios(mergeById(scenarios, [s]));
    },
    [scenarios, persistScenarios]
  );

  const deleteScenario = useCallback(
    (id: string) => {
      persistScenarios(scenarios.filter((s) => s.id !== id));
    },
    [scenarios, persistScenarios]
  );

  const updateConfig = useCallback(
    (patch: Partial<MapConfig>) => {
      persistConfig({ ...config, ...patch });
    },
    [config, persistConfig]
  );

  const upsertSpawn = useCallback(
    (s: Spawn) => {
      persistSpawns(mergeById(spawns, [s]));
    },
    [spawns, persistSpawns]
  );

  const deleteSpawn = useCallback(
    (id: string) => {
      persistSpawns(spawns.filter((s) => s.id !== id));
    },
    [spawns, persistSpawns]
  );

  const importBundle = useCallback(
    (b: { config?: MapConfig; spawns?: Spawn[]; utilities?: Utility[]; scenarios?: Scenario[] }) => {
      if (b.config) persistConfig(b.config);
      if (b.spawns) persistSpawns(b.spawns);
      if (b.utilities) persistUtilities(b.utilities);
      if (b.scenarios) persistScenarios(b.scenarios);
    },
    [persistConfig, persistSpawns, persistUtilities, persistScenarios]
  );

  const resetAll = useCallback(() => {
    clearAllOverrides();
    setConfig(bundle.config);
    setSpawns(bundle.spawns);
    setUtilities(bundle.utilities);
    setScenarios(bundle.scenarios);
  }, [bundle]);

  const resetFile = useCallback(
    (file: FileKey) => {
      clearOverride(file);
      if (file === "dust2-map-config") setConfig(bundle.config);
      if (file === "dust2-spawns") setSpawns(bundle.spawns);
      if (file === "dust2-utilities") setUtilities(bundle.utilities);
      if (file === "dust2-scenarios") setScenarios(bundle.scenarios);
    },
    [bundle]
  );

  const value = useMemo<EditableData>(
    () => ({
      config,
      spawns,
      utilities,
      scenarios,
      upsertUtility,
      deleteUtility,
      upsertScenario,
      deleteScenario,
      updateConfig,
      upsertSpawn,
      deleteSpawn,
      importBundle,
      resetAll,
      resetFile,
    }),
    [
      config, spawns, utilities, scenarios,
      upsertUtility, deleteUtility,
      upsertScenario, deleteScenario,
      updateConfig, upsertSpawn, deleteSpawn,
      importBundle, resetAll, resetFile,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEditableData(): EditableData {
  const c = useContext(Ctx);
  if (!c) throw new Error("useEditableData must be inside <EditableDataProvider>");
  return c;
}
