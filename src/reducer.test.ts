/**
 * TDD tests for the UI reducer (v6).
 *
 * The reducer is the state machine driving the 3-view navigation
 * (Home → ScenarioDetail → LineupDetail). These tests lock the
 * documented transitions and any "back" behavior. They're written
 * before the implementation per the v6 TDD mandate.
 */
import { describe, expect, it } from "vitest";
import { uiReducer, initialUiState, type UiAction, type UiState } from "./reducer";

describe("uiReducer", () => {
  it("starts in home view with no selections", () => {
    expect(initialUiState).toEqual({
      view: "home",
      activeScenarioId: null,
      activeRoleId: null,
      activeLineupId: null,
      pickedSpawnId: null,
    });
  });

  it("SELECT_SCENARIO transitions home → scenario", () => {
    const s: UiState = { ...initialUiState };
    const next = uiReducer(s, { type: "SELECT_SCENARIO", scenarioId: "a_default_3_man" });
    expect(next.view).toBe("scenario");
    expect(next.activeScenarioId).toBe("a_default_3_man");
  });

  it("SELECT_ROLE inside scenario sets activeRoleId without changing view", () => {
    const s: UiState = { ...initialUiState, view: "scenario", activeScenarioId: "x" };
    const next = uiReducer(s, { type: "SELECT_ROLE", roleId: "a-man" });
    expect(next.view).toBe("scenario");
    expect(next.activeRoleId).toBe("a-man");
  });

  it("SELECT_LINEUP transitions scenario → lineup, keeps active scenario+role", () => {
    const s: UiState = {
      ...initialUiState,
      view: "scenario",
      activeScenarioId: "x",
      activeRoleId: "a-man",
    };
    const next = uiReducer(s, { type: "SELECT_LINEUP", lineupId: "xbox_smoke" });
    expect(next.view).toBe("lineup");
    expect(next.activeLineupId).toBe("xbox_smoke");
    expect(next.activeScenarioId).toBe("x");
    expect(next.activeRoleId).toBe("a-man");
  });

  it("BACK from lineup with no active scenario returns home (CT-position-guide path)", () => {
    const s: UiState = {
      ...initialUiState,
      view: "lineup",
      activeLineupId: "xbox_smoke",
      // No activeScenarioId — user clicked a lineup chip from the CT
      // position guide on home, never went through a scenario.
    };
    const next = uiReducer(s, { type: "BACK" });
    expect(next.view).toBe("home");
    expect(next.activeLineupId).toBeNull();
  });

  it("BACK from lineup returns to scenario, clearing lineup id", () => {
    const s: UiState = {
      ...initialUiState,
      view: "lineup",
      activeScenarioId: "x",
      activeRoleId: "a-man",
      activeLineupId: "xbox_smoke",
    };
    const next = uiReducer(s, { type: "BACK" });
    expect(next.view).toBe("scenario");
    expect(next.activeLineupId).toBeNull();
    expect(next.activeScenarioId).toBe("x");
    expect(next.activeRoleId).toBe("a-man");
  });

  it("BACK from scenario returns home, clearing scenario + role", () => {
    const s: UiState = {
      ...initialUiState,
      view: "scenario",
      activeScenarioId: "x",
      activeRoleId: "a-man",
    };
    const next = uiReducer(s, { type: "BACK" });
    expect(next.view).toBe("home");
    expect(next.activeScenarioId).toBeNull();
    expect(next.activeRoleId).toBeNull();
  });

  it("GO_HOME clears everything regardless of source view", () => {
    const s: UiState = {
      view: "lineup",
      activeScenarioId: "x",
      activeRoleId: "a-man",
      activeLineupId: "xbox_smoke",
      pickedSpawnId: "dust2-t-s6",
    };
    const next = uiReducer(s, { type: "GO_HOME" });
    expect(next.view).toBe("home");
    expect(next.activeScenarioId).toBeNull();
    expect(next.activeRoleId).toBeNull();
    expect(next.activeLineupId).toBeNull();
    // Picked spawn intentionally preserved across navigation — it's a
    // visual reference, not part of the view stack.
    expect(next.pickedSpawnId).toBe("dust2-t-s6");
  });

  it("PICK_SPAWN sets pickedSpawnId without changing view", () => {
    const s: UiState = { ...initialUiState };
    const next = uiReducer(s, { type: "PICK_SPAWN", spawnId: "dust2-t-s6" });
    expect(next.view).toBe("home");
    expect(next.pickedSpawnId).toBe("dust2-t-s6");
  });

  it("CLEAR_SPAWN nulls pickedSpawnId", () => {
    const s: UiState = { ...initialUiState, pickedSpawnId: "dust2-t-s6" };
    const next = uiReducer(s, { type: "CLEAR_SPAWN" });
    expect(next.pickedSpawnId).toBeNull();
  });

  // Defensive: unknown actions must not be reachable in strict TS but
  // we still want the reducer to be total — fall through to current state.
  it("returns the current state for unhandled actions", () => {
    const s: UiState = { ...initialUiState };
    const next = uiReducer(s, { type: "__UNKNOWN__" } as unknown as UiAction);
    expect(next).toBe(s);
  });
});
