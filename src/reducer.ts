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

export const initialUiState: UiState = Object.freeze({
  view: "home" as const,
  activeTab: "scenarios" as const, // default tab — headline feature
  activeScenarioId: null,
  activeRoleId: null,
  activeLineupId: null,
  pickedSpawnId: null,
  activeThrowFromKey: null,
});

/**
 * Dev-mode invariant assertions. Called after every dispatch to catch
 * impossible state combinations early. Uses console.error (not throw)
 * so it never breaks the user's session — only surfaces violations in
 * the dev console.
 */
function devAssertInvariants(s: UiState): void {
  if (!import.meta.env.DEV) return;
  if (s.view === "scenario" && s.activeScenarioId === null) {
    console.error("[reducer] invariant violation: view=scenario but activeScenarioId is null");
  }
  if (s.view === "lineup" && s.activeLineupId === null) {
    console.error("[reducer] invariant violation: view=lineup but activeLineupId is null");
  }
  if (s.view === "home" && s.activeScenarioId !== null) {
    console.error("[reducer] invariant violation: view=home but activeScenarioId still set");
  }
}

export function uiReducer(state: UiState, action: UiAction): UiState {
  let next: UiState;
  switch (action.type) {
    case "SELECT_TAB":
      // Switching tabs clears the Map-tab's active marker so the user
      // doesn't return to a stale highlight when they come back to Map
      // later. (Audit C-3.) The pickedSpawnId is intentionally kept —
      // it's a visual "I am here" reference orthogonal to tab state.
      next = { ...state, activeTab: action.tab, activeThrowFromKey: null };
      break;

    case "SELECT_SCENARIO":
      next = {
        ...state,
        view: "scenario",
        activeScenarioId: action.scenarioId,
        activeRoleId: null,
        activeLineupId: null,
        // Clear Map-tab selection on navigation — see SELECT_TAB.
        activeThrowFromKey: null,
      };
      break;

    case "SELECT_THROW_FROM":
      next = { ...state, activeThrowFromKey: action.key };
      break;

    case "SELECT_ROLE":
      // No view change — drilling into a role just filters within the
      // current ScenarioDetail.
      next = { ...state, activeRoleId: action.roleId };
      break;

    case "SELECT_LINEUP":
      next = {
        ...state,
        view: "lineup",
        activeLineupId: action.lineupId,
        activeThrowFromKey: null,
      };
      break;

    case "BACK":
      if (state.view === "lineup") {
        // If the user reached the lineup view via a scenario, back to
        // that scenario. If they reached it directly (e.g. via the CT
        // position guide on home), back to home — avoids landing on a
        // blank "scenario view with no active scenario" page.
        //
        // lineup → scenario: activeThrowFromKey preserved — it doesn't
        // affect anything until the user returns to home + Map tab.
        // lineup → home: activeThrowFromKey cleared — Map tab renders
        // at home, stale marker would be confusing.
        next = state.activeScenarioId
          ? { ...state, view: "scenario", activeLineupId: null }
          : {
              ...state,
              view: "home",
              activeLineupId: null,
              activeThrowFromKey: null,
            };
      } else if (state.view === "scenario") {
        next = {
          ...state,
          view: "home",
          activeScenarioId: null,
          activeRoleId: null,
          activeLineupId: null,
          // Returning to home clears the Map-tab marker selection.
          activeThrowFromKey: null,
        };
      } else {
        next = state;
      }
      break;

    case "GO_HOME":
      // Picked spawn intentionally preserved. Map-tab marker NOT
      // preserved — explicit GO_HOME means "fresh start," and a stale
      // marker selection from earlier is more confusing than useful.
      next = {
        ...state,
        view: "home",
        activeScenarioId: null,
        activeRoleId: null,
        activeLineupId: null,
        activeThrowFromKey: null,
      };
      break;

    case "PICK_SPAWN":
      next = { ...state, pickedSpawnId: action.spawnId };
      break;

    case "CLEAR_SPAWN":
      next = { ...state, pickedSpawnId: null };
      break;

    default: {
      // Compile-time exhaustiveness: TypeScript errors here if a new
      // UiAction variant isn't handled above.
      const _exhaustive: never = action;
      // Runtime defense: if reached via untyped JS or test casts,
      // return state unchanged rather than crashing.
      void _exhaustive;
      next = state;
    }
  }

  devAssertInvariants(next);
  return next;
}
