/**
 * UI state reducer for the 3-view navigation:
 *   Home → ScenarioDetail (with optional role) → LineupDetail.
 *
 * Picked spawn is parallel state (a visual reference, not part of the
 * view stack) so navigation actions don't touch it. The browser's
 * back-button is wired in App.tsx to dispatch BACK.
 */

export type View = "home" | "scenario" | "lineup";

/**
 * Home page is divided into four tabs. The active tab is remembered
 * across navigation so that BACK from a scenario detail returns the
 * user to the tab they were on, not always to the first tab.
 *
 * Tab purposes (per owner directive — audience is one autistic
 * 25-year-old who needs structure):
 *   - defaults: default plant spots / round timings / spawn-rush info
 *   - scenarios: the headline numbered team executes
 *   - instant_smokes: lineups throwable from spawn at round start
 *   - map: origin-first radar — every throw position marked
 */
export type HomeTab = "defaults" | "scenarios" | "instant_smokes" | "map";

export interface UiState {
  view: View;
  activeTab: HomeTab;
  activeScenarioId: string | null;
  activeRoleId: string | null;
  activeLineupId: string | null;
  pickedSpawnId: string | null;
  /** Used by the Map tab when the user clicks a throwFrom position. */
  activeThrowFromKey: string | null;
}

export type UiAction =
  | { type: "SELECT_TAB"; tab: HomeTab }
  | { type: "SELECT_SCENARIO"; scenarioId: string }
  | { type: "SELECT_ROLE"; roleId: string }
  | { type: "SELECT_LINEUP"; lineupId: string }
  | { type: "BACK" }
  | { type: "GO_HOME" }
  | { type: "PICK_SPAWN"; spawnId: string }
  | { type: "CLEAR_SPAWN" }
  | { type: "SELECT_THROW_FROM"; key: string | null };

export const initialUiState: UiState = {
  view: "home",
  activeTab: "scenarios", // default tab — headline feature
  activeScenarioId: null,
  activeRoleId: null,
  activeLineupId: null,
  pickedSpawnId: null,
  activeThrowFromKey: null,
};

export function uiReducer(state: UiState, action: UiAction): UiState {
  switch (action.type) {
    case "SELECT_TAB":
      return { ...state, activeTab: action.tab };

    case "SELECT_SCENARIO":
      return {
        ...state,
        view: "scenario",
        activeScenarioId: action.scenarioId,
        activeRoleId: null,
        activeLineupId: null,
      };

    case "SELECT_THROW_FROM":
      return { ...state, activeThrowFromKey: action.key };

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
        // If the user reached the lineup view via a scenario, back to
        // that scenario. If they reached it directly (e.g. via the CT
        // position guide on home), back to home — avoids landing on a
        // blank "scenario view with no active scenario" page.
        return state.activeScenarioId
          ? { ...state, view: "scenario", activeLineupId: null }
          : { ...state, view: "home", activeLineupId: null };
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
