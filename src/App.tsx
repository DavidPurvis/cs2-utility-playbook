/**
 * Top-level app shell.
 *
 * Owns all UI state via `useReducer` (see ./reducer). Renders one of
 * three views based on `state.view`: Home (scenario grid + spawn
 * picker), ScenarioDetail (Phase 4), or LineupDetail (Phase 4).
 *
 * Hooks the browser back button to dispatch BACK via a `popstate`
 * listener so navigation feels native on mobile without bringing in a
 * router library (ADR-004). Each navigation push uses
 * `history.pushState` with a state marker so we can detect direction.
 */
import { useCallback, useEffect, useReducer } from "react";
import { dustData } from "./data/loadDust2";
import { Header } from "./components/Header";
import { Home } from "./components/Home";
import { uiReducer, initialUiState } from "./reducer";
import { T } from "./theme";

export default function App() {
  const [state, dispatch] = useReducer(uiReducer, initialUiState);

  const activeScenario =
    state.activeScenarioId != null
      ? dustData.scenarios.find((s) => s.id === state.activeScenarioId) ?? null
      : null;
  const activeLineup =
    state.activeLineupId != null
      ? dustData.lineups.find((l) => l.id === state.activeLineupId) ?? null
      : null;

  const onSelectScenario = useCallback((id: string) => {
    dispatch({ type: "SELECT_SCENARIO", scenarioId: id });
    if (typeof history !== "undefined") history.pushState({ view: "scenario", id }, "");
  }, []);

  const onPickSpawn = useCallback((id: string) => dispatch({ type: "PICK_SPAWN", spawnId: id }), []);
  const onClearSpawn = useCallback(() => dispatch({ type: "CLEAR_SPAWN" }), []);
  const onGoHome = useCallback(() => {
    dispatch({ type: "GO_HOME" });
    if (typeof history !== "undefined") history.pushState({ view: "home" }, "");
  }, []);

  // Browser back-button → dispatch BACK.
  useEffect(() => {
    const onPop = () => dispatch({ type: "BACK" });
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Esc key inside scenario/lineup → dispatch BACK.
  useEffect(() => {
    if (state.view === "home") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch({ type: "BACK" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.view]);

  const crumbs: Array<{ label: string; onClick?: () => void }> = [
    { label: "Dust 2 Playbook", onClick: state.view === "home" ? undefined : onGoHome },
  ];
  if (activeScenario) {
    crumbs.push({
      label: `Scenario ${activeScenario.number} · ${activeScenario.name}`,
      onClick: state.view === "scenario" ? undefined : () => dispatch({ type: "BACK" }),
    });
  }
  if (activeLineup) {
    crumbs.push({ label: activeLineup.name });
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.fontUI, color: T.textPri }}>
      <a href="#lineup-list" className="skip-link">Jump to content</a>
      <Header crumbs={crumbs} />

      {state.view === "home" && (
        <Home
          data={dustData}
          pickedSpawnId={state.pickedSpawnId}
          onSelectScenario={onSelectScenario}
          onPickSpawn={onPickSpawn}
          onClearSpawn={onClearSpawn}
        />
      )}

      {state.view === "scenario" && activeScenario && (
        <PhasePlaceholder label={`Scenario detail (Phase 4): ${activeScenario.name}`} />
      )}

      {state.view === "lineup" && activeLineup && (
        <PhasePlaceholder label={`Lineup detail (Phase 4): ${activeLineup.name}`} />
      )}

      <footer
        style={{
          padding: "18px 24px",
          borderTop: `1px solid ${T.border}`,
          color: T.textDim,
          fontSize: 11,
          fontFamily: T.fontMono,
          textAlign: "center",
        }}
      >
        Dust 2 Playbook · v6 · 10 lineups · 5 scenarios · {dustData.spawns.length} spawns
      </footer>
    </div>
  );
}

function PhasePlaceholder({ label }: { label: string }) {
  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: "0 auto" }}>
      <div
        style={{
          padding: 32,
          background: T.bgPanel,
          border: `1px dashed ${T.border}`,
          borderRadius: T.radius,
          color: T.textDim,
          textAlign: "center",
        }}
      >
        <strong style={{ color: T.textSec, fontSize: 14 }}>{label}</strong>
        <p style={{ marginTop: 6, fontSize: 12, lineHeight: 1.5 }}>
          This view ships in Phase 4 (ScenarioDetail + 2×2 walkthrough). The reducer + navigation
          shell are already wired; press Esc or browser back to return home.
        </p>
      </div>
    </div>
  );
}
