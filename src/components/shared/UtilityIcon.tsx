import { T } from "../../theme";
import type { UtilityType } from "../../types/map";

const STYLE: Record<UtilityType, { glyph: string; color: string; label: string }> = {
  smoke:   { glyph: "◍", color: T.utilSmoke, label: "Smoke"   },
  flash:   { glyph: "◎", color: T.utilFlash, label: "Flash"   },
  molotov: { glyph: "◉", color: T.utilMolly, label: "Molotov" },
  he:      { glyph: "◈", color: T.utilHE,    label: "HE"      },
};

export function UtilityIcon({ type, size = 14 }: { type: UtilityType; size?: number }) {
  const s = STYLE[type];
  return (
    <span
      aria-label={s.label}
      title={s.label}
      style={{ color: s.color, fontSize: size, lineHeight: 1, display: "inline-block" }}
    >
      {s.glyph}
    </span>
  );
}

export function utilityColor(type: UtilityType): string {
  return STYLE[type].color;
}
