/**
 * Dust 2 Utility Playbook — root shell.
 *
 * Two tabs: Scenarios (primary, multi-player executes) and Spawns
 * (existing concept, refactored). Admin mode overlays both tabs.
 *
 * Phase 0: placeholder. Real content wired up in Phase 3+.
 */
export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 24,
        background: "#0a0e15",
        color: "#e6ebf2",
        textAlign: "center",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ fontSize: 12, letterSpacing: 2, color: "#6a7689", textTransform: "uppercase" }}>
        CS2 Utility Playbook · Dust 2
      </div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>Building…</div>
      <div style={{ fontSize: 14, color: "#a3afc1", maxWidth: 440 }}>
        Scenario-driven utility planner with built-in admin CMS.
      </div>
    </div>
  );
}
