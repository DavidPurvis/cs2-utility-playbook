import { T } from "../lib/theme.js";

/** T / CT side selector used in Playbook and Map views. */
export function SideToggle({ side, onSideChange, resetFilters }) {
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
      {["T", "CT"].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => {
            onSideChange(s);
            resetFilters?.();
          }}
          style={{
            flex: 1,
            padding: "10px",
            background: side === s ? (s === "T" ? T.tSideBg : T.ctSideBg) : T.bgCard,
            border: `1px solid ${side === s ? (s === "T" ? T.tSide + "40" : T.ctSide + "40") : T.borderLt}`,
            borderRadius: 6,
            cursor: "pointer",
            color: side === s ? (s === "T" ? T.tSide : T.ctSide) : T.textDim,
            fontSize: 13,
            fontWeight: 900,
            letterSpacing: 2,
          }}
        >
          {s === "T" ? "T SIDE — ATTACK" : "CT SIDE — DEFEND"}
        </button>
      ))}
    </div>
  );
}
