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
      activeTab: "scenarios",
      activeScenarioId: null,
      activeRoleId: null,
      activeLineupId: null,
      pickedSpawnId: null,
      activeThrowFromKey: null,
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
      activeTab: "scenarios",
      activeScenarioId: "x",
      activeRoleId: "a-man",
      activeLineupId: "xbox_smoke",
      pickedSpawnId: "dust2-t-s6",
      activeThrowFromKey: null,
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

  // ── SELECT_TAB ─────────────────────────────────────────────────────
  // Previously uncovered (audit M-5). Tab switching must change only
  // `activeTab` + clear the Map-tab marker; never change `view` or
  // touch the scenario/role/lineup stack.

  it("SELECT_TAB updates activeTab and leaves view + scenario state untouched", () => {
    const s: UiState = { ...initialUiState };
    const next = uiReducer(s, { type: "SELECT_TAB", tab: "map" });
    expect(next.activeTab).toBe("map");
    expect(next.view).toBe("home");
    expect(next.activeScenarioId).toBeNull();
    expect(next.activeRoleId).toBeNull();
    expect(next.activeLineupId).toBeNull();
  });

  it("SELECT_TAB clears activeThrowFromKey (Map-tab marker doesn't persist across tabs)", () => {
    const s: UiState = { ...initialUiState, activeThrowFromKey: "xbox_smoke|long_flash" };
    const next = uiReducer(s, { type: "SELECT_TAB", tab: "scenarios" });
    expect(next.activeThrowFromKey).toBeNull();
    expect(next.activeTab).toBe("scenarios");
  });

  it("SELECT_TAB preserves pickedSpawnId (visual reference is orthogonal to tab state)", () => {
    const s: UiState = { ...initialUiState, pickedSpawnId: "dust2-t-s6" };
    const next = uiReducer(s, { type: "SELECT_TAB", tab: "defaults" });
    expect(next.pickedSpawnId).toBe("dust2-t-s6");
  });

  // ── SELECT_THROW_FROM ──────────────────────────────────────────────
  // Previously uncovered (audit M-6). Sets/clears the Map-tab marker.

  it("SELECT_THROW_FROM sets activeThrowFromKey without changing view or tab", () => {
    const s: UiState = { ...initialUiState, activeTab: "map" };
    const next = uiReducer(s, { type: "SELECT_THROW_FROM", key: "xbox_smoke|long_flash" });
    expect(next.activeThrowFromKey).toBe("xbox_smoke|long_flash");
    expect(next.view).toBe("home");
    expect(next.activeTab).toBe("map");
  });

  it("SELECT_THROW_FROM with key=null clears the active marker", () => {
    const s: UiState = { ...initialUiState, activeThrowFromKey: "xbox_smoke" };
    const next = uiReducer(s, { type: "SELECT_THROW_FROM", key: null });
    expect(next.activeThrowFromKey).toBeNull();
  });

  // ── activeThrowFromKey lifecycle on navigation (audit C-3 fix) ─────
  // The Map-tab marker MUST clear when the user navigates away — else
  // returning to the Map tab shows a stale highlight.

  it("SELECT_SCENARIO clears activeThrowFromKey", () => {
    const s: UiState = { ...initialUiState, activeThrowFromKey: "xbox_smoke" };
    const next = uiReducer(s, { type: "SELECT_SCENARIO", scenarioId: "a_default" });
    expect(next.activeThrowFromKey).toBeNull();
  });

  it("GO_HOME clears activeThrowFromKey (fresh-start semantics)", () => {
    const s: UiState = {
      ...initialUiState,
      view: "scenario",
      activeScenarioId: "a_default",
      activeThrowFromKey: "xbox_smoke",
    };
    const next = uiReducer(s, { type: "GO_HOME" });
    expect(next.activeThrowFromKey).toBeNull();
    expect(next.view).toBe("home");
  });

  it("BACK from scenario → home clears activeThrowFromKey", () => {
    const s: UiState = {
      ...initialUiState,
      view: "scenario",
      activeScenarioId: "a_default",
      activeThrowFromKey: "xbox_smoke",
    };
    const next = uiReducer(s, { type: "BACK" });
    expect(next.view).toBe("home");
    expect(next.activeThrowFromKey).toBeNull();
  });

  it("BACK from lineup (no scenario context) → home clears activeThrowFromKey", () => {
    // CT-position-guide path: user opens a lineup with no scenario.
    const s: UiState = {
      ...initialUiState,
      view: "lineup",
      activeLineupId: "xbox_smoke",
      activeThrowFromKey: "xbox_smoke",
    };
    const next = uiReducer(s, { type: "BACK" });
    expect(next.view).toBe("home");
    expect(next.activeThrowFromKey).toBeNull();
  });

  it("BACK from lineup → scenario does NOT clear activeThrowFromKey (still in nav stack)", () => {
    // Sanity: when the user came through a scenario, they stay in the
    // scenario detail. The Map tab marker is only cleared when the
    // user returns to HOME (where Map tab actually renders).
    const s: UiState = {
      ...initialUiState,
      view: "lineup",
      activeScenarioId: "a_default",
      activeRoleId: "a-man",
      activeLineupId: "xbox_smoke",
      activeThrowFromKey: "xbox_smoke",
    };
    const next = uiReducer(s, { type: "BACK" });
    expect(next.view).toBe("scenario");
    // Marker is preserved — it doesn't affect anything until the user
    // returns to home + Map tab, and clearing it on intermediate
    // navigation would be surprising.
    expect(next.activeThrowFromKey).toBe("xbox_smoke");
  });
});
