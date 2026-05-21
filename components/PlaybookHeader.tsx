import { T } from "../lib/theme";

export function PlaybookHeader() {
  return (
    <header
      style={{
        padding: "14px 24px",
        background: T.bgDeep,
        borderBottom: `1px solid ${T.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            background: T.accentBg,
            border: `1px solid ${T.accent}55`,
            color: T.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: T.fontMono,
            fontWeight: 900,
            fontSize: 14,
            letterSpacing: 0.5,
          }}
          aria-hidden
        >
          D2
        </div>
        <div>
          <div style={{ fontSize: 11, color: T.textDim, letterSpacing: 1.5, textTransform: "uppercase" }}>
            CS2 Utility
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, color: T.textPri, lineHeight: 1.1 }}>
            Dust 2 Playbook
          </div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: T.textDim, textAlign: "right", lineHeight: 1.4 }}>
        Scenario-based executes for
        <br />
        2–3 player squad coordination.
      </div>
    </header>
  );
}
