/**
 * UI state reducer for the 3-view navigation:
 *   Home → ScenarioDetail (with optional role) → LineupDetail.
 *
 * Picked spawn is parallel state (a visual reference, not part of the
 * view stack) so navigation actions don't touch it. The browser's
 * back-button is wired in App.tsx to dispatch BACK.
 */

export type View = "home" | "scenario" | "lineup";

export interface UiState {
  view: View;
  activeScenarioId: string | null;
  activeRoleId: string | null;
  activeLineupId: string | null;
  pickedSpawnId: string | null;
}

export type UiAction =
  | { type: "SELECT_SCENARIO"; scenarioId: string }
  | { type: "SELECT_ROLE"; roleId: string }
  | { type: "SELECT_LINEUP"; lineupId: string }
  | { type: "BACK" }
  | { type: "GO_HOME" }
  | { type: "PICK_SPAWN"; spawnId: string }
  | { type: "CLEAR_SPAWN" };

export const initialUiState: UiState = {
  view: "home",
  activeScenarioId: null,
  activeRoleId: null,
  activeLineupId: null,
  pickedSpawnId: null,
};

export function uiReducer(state: UiState, action: UiAction): UiState {
  switch (action.type) {
    case "SELECT_SCENARIO":
      return {
        ...state,
        view: "scenario",
        activeScenarioId: action.scenarioId,
        activeRoleId: null,
        activeLineupId: null,
      };

    case "SELECT_ROLE":
      // No view change — drilling into a role just filters within the
      // current ScenarioDetail.
      return { ...state, activeRoleId: action.roleId };

    case "SELECT_LINEUP":
      return {
        ...state,
        view: "lineup",
        activeLineupId: action.lineupId,
      };

    case "BACK":
      if (state.view === "lineup") {
        return { ...state, view: "scenario", activeLineupId: null };
      }
      if (state.view === "scenario") {
        return {
          ...state,
          view: "home",
          activeScenarioId: null,
          activeRoleId: null,
          activeLineupId: null,
        };
      }
      return state;

    case "GO_HOME":
      // Picked spawn intentionally preserved.
      return {
        ...state,
        view: "home",
        activeScenarioId: null,
        activeRoleId: null,
        activeLineupId: null,
      };

    case "PICK_SPAWN":
      return { ...state, pickedSpawnId: action.spawnId };

    case "CLEAR_SPAWN":
      return { ...state, pickedSpawnId: null };

    default:
      return state;
  }
}
