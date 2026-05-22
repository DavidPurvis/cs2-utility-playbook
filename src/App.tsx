/**
 * Top-level app shell.
 *
 * Owns all UI state via `useReducer` (see ./reducer). Renders one of
 * three views based on `state.view`: Home, ScenarioDetail, or
 * LineupDetail. Browser back-button + Esc both dispatch BACK.
 *
 * Global Toast container lives here (singleton, id-keyed) so any
 * descendent's CopyButton can dispatch through it.
 */
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { dustData } from "./data/loadDust2";
import { Header } from "./components/Header";
import { Home } from "./components/Home";
import { ScenarioDetail } from "./components/ScenarioDetail";
import { LineupDetail } from "./components/LineupDetail";
import { Toast, type ToastState } from "./components/Toast";
import { uiReducer, initialUiState } from "./reducer";
import type { CopyResult } from "./components/CopyButton";
import { T } from "./theme";

export default function App() {
  const [state, dispatch] = useReducer(uiReducer, initialUiState);
  const [toast, setToast] = useState<ToastState>(null);
  const toastIdRef = useRef(0);

  const showToast = useCallback((kind: "ok" | "error", msg: string) => {
    toastIdRef.current += 1;
    setToast({ kind, msg, id: toastIdRef.current });
  }, []);

  const handleCopy = useCallback(
    (result: CopyResult, text: string) => {
      if (result === "ok" || result === "fallback") {
        showToast("ok", "Copied setpos to clipboard");
      } else {
        showToast("error", `Copy blocked by browser — copy manually: ${text}`);
      }
    },
    [showToast]
  );

  const activeScenario =
    state.activeScenarioId != null
      ? dustData.scenarios.find((s) => s.id === state.activeScenarioId) ?? null
      : null;
  const activeLineup =
    state.activeLineupId != null
      ? dustData.lineups.find((l) => l.id === state.activeLineupId) ?? null
      : null;

  const onSelectTab = useCallback(
    (tab: import("./reducer").HomeTab) => dispatch({ type: "SELECT_TAB", tab }),
    []
  );
  const onSelectScenario = useCallback((id: string) => {
    dispatch({ type: "SELECT_SCENARIO", scenarioId: id });
    if (typeof history !== "undefined") history.pushState({ view: "scenario", id }, "");
  }, []);
  const onSelectRole = useCallback((roleId: string) => {
    dispatch({ type: "SELECT_ROLE", roleId });
  }, []);
  const onSelectLineup = useCallback((id: string) => {
    dispatch({ type: "SELECT_LINEUP", lineupId: id });
    if (typeof history !== "undefined") history.pushState({ view: "lineup", id }, "");
  }, []);
  const onPickSpawn = useCallback((id: string) => dispatch({ type: "PICK_SPAWN", spawnId: id }), []);
  const onClearSpawn = useCallback(() => dispatch({ type: "CLEAR_SPAWN" }), []);
  const onSelectThrowFrom = useCallback(
    (key: string | null) => dispatch({ type: "SELECT_THROW_FROM", key }),
    []
  );
  const onGoHome = useCallback(() => {
    dispatch({ type: "GO_HOME" });
    if (typeof history !== "undefined") history.pushState({ view: "home" }, "");
  }, []);
  const onBack = useCallback(() => dispatch({ type: "BACK" }), []);

  // Browser back-button.
  useEffect(() => {
    const onPop = () => dispatch({ type: "BACK" });
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Auto-dismiss the toast after 1.5s (ok) / 4s (error). The setState
  // call lives inside the setTimeout callback, not the effect body, so
  // it doesn't trigger react-hooks/set-state-in-effect.
  useEffect(() => {
    if (!toast) return;
    const ms = toast.kind === "error" ? 4000 : 1500;
    const timer = setTimeout(() => setToast(null), ms);
    return () => clearTimeout(timer);
  }, [toast]);

  // Esc → BACK inside scenario / lineup views.
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
      onClick: state.view === "scenario" ? undefined : onBack,
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
          activeTab={state.activeTab}
          pickedSpawnId={state.pickedSpawnId}
          activeThrowFromKey={state.activeThrowFromKey}
          onSelectTab={onSelectTab}
          onSelectLineup={onSelectLineup}
          onSelectScenario={onSelectScenario}
          onPickSpawn={onPickSpawn}
          onClearSpawn={onClearSpawn}
          onSelectThrowFrom={onSelectThrowFrom}
        />
      )}

      {state.view === "scenario" && activeScenario && (
        <ScenarioDetail
          scenario={activeScenario}
          config={dustData.config}
          spawns={dustData.spawns}
          lineups={dustData.lineups}
          activeRoleId={state.activeRoleId}
          onSelectRole={onSelectRole}
          onSelectLineup={onSelectLineup}
          onBack={onBack}
        />
      )}

      {state.view === "lineup" && activeLineup && (
        <LineupDetail
          lineup={activeLineup}
          config={dustData.config}
          onBack={onBack}
          onCopy={handleCopy}
        />
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
        Dust 2 Playbook · v6 · {dustData.lineups.length} lineups · {dustData.scenarios.length} scenarios ·{" "}
        {dustData.spawns.length} spawns
      </footer>

      <Toast state={toast} />
    </div>
  );
}
