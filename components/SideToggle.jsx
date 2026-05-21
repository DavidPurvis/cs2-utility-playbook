import { T } from "../lib/theme.js";

export function SideToggle({ side, onSideChange, resetFilters }) {
  return (
    <div role="tablist" style={{
      display: "flex", background: T.bgHover, border: `1px solid ${T.borderLt}`,
      borderRadius: 999, padding: 2, gap: 2,
    }}>
      {["T", "CT"].map((s) => {
        const active = side === s;
        const c = s === "T" ? T.tSide : T.ctSide;
        return (
          <button key={s} type="button" role="tab" aria-selected={active}
            className="pa-btn-hov"
            onClick={() => { onSideChange(s); resetFilters?.(); }}
            style={{
              fontSize: 11.5, fontWeight: 700, padding: "5px 14px", borderRadius: 999,
              background: active ? c + "1f" : "transparent",
              color: active ? c : T.textDim,
              border: `1px solid ${active ? c + "55" : "transparent"}`,
              cursor: "pointer", letterSpacing: 0.8,
              fontFamily: T.fontMono,
              minWidth: 36,
            }}>
            {s}
          </button>
        );
      })}
    </div>
  );
}
