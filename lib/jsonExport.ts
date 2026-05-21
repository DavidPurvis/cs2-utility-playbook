import type { Lineup, Scenario } from "../data/types";
import { DUST2_LINEUPS_BY_ID } from "../data/dust2-lineups";
import { DUST2_SCENARIOS, DUST2_SCENARIOS_BY_ID } from "../data/dust2-scenarios";

export interface ScenarioExport {
  schemaVersion: 1;
  generatedAt: string;
  scenario: Scenario;
  lineups: Lineup[];
}

export interface ScenarioBundleExport {
  schemaVersion: 1;
  generatedAt: string;
  scenarios: Array<{ scenario: Scenario; lineups: Lineup[] }>;
}

function resolveLineups(scenario: Scenario): Lineup[] {
  const ids = new Set<string>();
  for (const role of scenario.roles) for (const lid of role.lineupIds) ids.add(lid);
  const out: Lineup[] = [];
  for (const id of ids) {
    const l = DUST2_LINEUPS_BY_ID[id];
    if (l) out.push(l);
  }
  return out;
}

export function exportScenario(scenarioId: string): ScenarioExport | null {
  const scenario = DUST2_SCENARIOS_BY_ID[scenarioId];
  if (!scenario) return null;
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    scenario,
    lineups: resolveLineups(scenario),
  };
}

export function exportAll(): ScenarioBundleExport {
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    scenarios: DUST2_SCENARIOS.map((s) => ({
      scenario: s,
      lineups: resolveLineups(s),
    })),
  };
}

export function importScenario(json: string): ScenarioExport | null {
  try {
    const parsed = JSON.parse(json) as Partial<ScenarioExport>;
    if (parsed.schemaVersion !== 1) return null;
    if (!parsed.scenario || !Array.isArray(parsed.lineups)) return null;
    // Minimal shape check; full validation is out of scope.
    if (!parsed.scenario.id || !parsed.scenario.roles) return null;
    return parsed as ScenarioExport;
  } catch {
    return null;
  }
}

/**
 * Convenience wrapper around the browser clipboard API.
 * Returns true on success, false if clipboard is unavailable or denied.
 */
export async function copyJsonToClipboard(json: string): Promise<boolean> {
  try {
    if (typeof navigator === "undefined" || !navigator.clipboard) return false;
    await navigator.clipboard.writeText(json);
    return true;
  } catch {
    return false;
  }
}
