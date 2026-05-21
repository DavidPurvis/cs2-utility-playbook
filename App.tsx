/**
 * Dust 2 Playbook — placeholder shell.
 *
 * This file is intentionally minimal during the refactor. The full
 * scenario-based UI is wired up in Phase 3 of the refactor plan.
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
      }}
    >
      <div style={{ fontSize: 12, letterSpacing: 2, color: "#6a7689", textTransform: "uppercase" }}>
        Dust 2 Playbook
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#e6ebf2" }}>Building…</div>
      <div style={{ fontSize: 14, color: "#a3afc1", maxWidth: 440 }}>
        Scenario-based utility executes for coordinated CS2 squads.
      </div>
    </div>
  );
}
