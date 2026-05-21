import { T, PLAYER_STYLE } from "../lib/theme";
import type { PlayerSlot } from "../data/types";

export interface PlayerSlotPickerProps {
  available: readonly PlayerSlot[];
  active: PlayerSlot | null;
  onChange: (player: PlayerSlot | null) => void;
}

export function PlayerSlotPicker({ available, active, onChange }: PlayerSlotPickerProps) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
      <span style={{ fontSize: 11, color: T.textDim, letterSpacing: 0.6, textTransform: "uppercase" }}>
        I'm
      </span>
      {available.map((p) => {
        const style = PLAYER_STYLE[p];
        const isActive = active === p;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onChange(isActive ? null : p)}
            style={{
              padding: "5px 11px",
              fontSize: 12,
              fontWeight: 700,
              border: `1.5px solid ${isActive ? style.color : T.borderLt}`,
              background: isActive ? style.bg : T.bgPanel,
              color: isActive ? style.color : T.textSec,
              borderRadius: T.radiusSm,
              cursor: "pointer",
              fontFamily: T.fontUI,
            }}
          >
            {p}
          </button>
        );
      })}
      {active && (
        <button
          type="button"
          onClick={() => onChange(null)}
          style={{
            padding: "4px 8px",
            fontSize: 10,
            border: `1px solid ${T.border}`,
            background: "transparent",
            color: T.textDim,
            borderRadius: T.radiusSm,
            cursor: "pointer",
          }}
        >
          clear
        </button>
      )}
    </div>
  );
}
