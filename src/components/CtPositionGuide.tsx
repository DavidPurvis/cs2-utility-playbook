/**
 * CT-side position guide.
 *
 * Shows below the SpawnPicker when CT side is selected. Each card is a
 * loose recommendation — "if you're playing A anchor, these are the
 * lineups + utility focus you should know." Not hyper-specific (per
 * owner ask); meant to help you pick a role and remember what to
 * carry.
 *
 * Clicking a recommended-lineup chip dispatches SELECT_LINEUP via the
 * onSelectLineup prop. The smart-BACK rule in the reducer returns to
 * home (not into a broken empty-scenario view) when you press Esc /
 * back-button from a lineup reached this way.
 */
import { useMemo } from "react";
import { T } from "../theme";
import type { CtPosition, Lineup, UtilityType } from "../types";

export interface CtPositionGuideProps {
  positions: CtPosition[];
  lineups: Lineup[];
  onSelectLineup: (lineupId: string) => void;
}

export function CtPositionGuide({ positions, lineups, onSelectLineup }: CtPositionGuideProps) {
  const lineupById = useMemo(() => {
    const m = new Map<string, Lineup>();
    for (const l of lineups) m.set(l.id, l);
    return m;
  }, [lineups]);

  if (positions.length === 0) return null;

  return (
    <section
      aria-label="CT position guide"
      style={{
        background: T.bgPanel,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <strong style={{ color: T.textPri, fontSize: 13 }}>CT positions</strong>
        <span style={{ color: T.textDim, fontSize: 11 }}>
          loose guide — "if you're playing here, learn these"
        </span>
      </div>

      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {positions.map((pos) => (
          <li
            key={pos.id}
            style={{
              padding: 10,
              background: T.bg,
              border: `1px solid ${T.borderStr}`,
              borderRadius: T.radiusSm,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
              <strong style={{ color: T.textPri, fontSize: 13 }}>{pos.label}</strong>
              {pos.spawnHint && (
                <span style={{ color: T.textDim, fontSize: 11, fontFamily: T.fontMono }}>
                  {pos.spawnHint}
                </span>
              )}
            </div>

            <p style={{ margin: 0, color: T.textSec, fontSize: 12, lineHeight: 1.45 }}>
              {pos.description}
            </p>

            <p style={{ margin: 0, color: T.textSec, fontSize: 12, lineHeight: 1.45 }}>
              <strong style={{ color: T.textPri }}>Focus:</strong> {pos.utilityFocus}
            </p>

            {pos.recommendedLineupIds.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 2 }}>
                {pos.recommendedLineupIds.map((id) => {
                  const lineup = lineupById.get(id);
                  if (!lineup) return null;
                  return (
                    <LineupChip
                      key={id}
                      lineup={lineup}
                      onClick={() => onSelectLineup(id)}
                    />
                  );
                })}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

const UTIL_COLOR: Record<UtilityType, string> = {
  smoke: T.utilSmoke,
  flash: T.utilFlash,
  molotov: T.utilMolly,
  he: T.utilHE,
};

function LineupChip({ lineup, onClick }: { lineup: Lineup; onClick: () => void }) {
  const color = UTIL_COLOR[lineup.type];
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: T.bgPanel,
        border: `1px solid ${color}55`,
        borderRadius: 999,
        padding: "3px 9px 3px 7px",
        fontSize: 11,
        fontFamily: T.fontUI,
        color: T.textPri,
        cursor: "pointer",
        transition: `background ${T.transitionFast}, border-color ${T.transitionFast}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = T.bgSubtle;
        e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = T.bgPanel;
        e.currentTarget.style.borderColor = `${color}55`;
      }}
    >
      <span
        aria-hidden
        title={lineup.type}
        style={{
          display: "inline-block",
          width: 9,
          height: 9,
          borderRadius: 999,
          background: color,
          border: "1px solid rgba(0,0,0,0.3)",
        }}
      />
      {lineup.name}
    </button>
  );
}
