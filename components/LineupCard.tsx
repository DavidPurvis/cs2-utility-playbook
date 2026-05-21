import type { Lineup } from "../data/types";
import { T, UTIL_STYLE, THROW_STYLE } from "../lib/theme";

export interface LineupCardProps {
  lineup: Lineup;
  /** Compact display in scenario role cards. */
  compact?: boolean;
}

export function LineupCard({ lineup, compact }: LineupCardProps) {
  const util = UTIL_STYLE[lineup.type];
  const throwInfo = THROW_STYLE[lineup.throwType];

  return (
    <div
      style={{
        padding: compact ? 10 : 14,
        border: `1px solid ${T.borderLt}`,
        borderLeft: `3px solid ${util.color}`,
        borderRadius: T.radiusSm,
        background: T.bgPanel,
        display: "flex",
        flexDirection: "column",
        gap: compact ? 6 : 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span
          style={{
            color: util.color,
            fontSize: compact ? 16 : 20,
            lineHeight: 1,
          }}
          aria-hidden
        >
          {util.icon}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: compact ? 13 : 15,
              fontWeight: 700,
              color: T.textPri,
              lineHeight: 1.2,
            }}
          >
            {lineup.name}
          </div>
          <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>
            {lineup.throwFrom} → {lineup.landsAt}
          </div>
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: util.color,
            background: util.bg,
            padding: "3px 7px",
            borderRadius: 4,
            border: `1px solid ${util.color}33`,
            fontFamily: T.fontMono,
            letterSpacing: 0.5,
          }}
        >
          {throwInfo.short}
        </span>
      </div>

      {!compact && (
        <>
          <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.45 }}>
            <span style={{ color: T.gold, fontWeight: 600 }}>Why:</span> {lineup.purpose}
          </div>
          <div
            style={{
              fontSize: 12,
              color: T.textSec,
              lineHeight: 1.45,
              padding: 10,
              background: T.bgInstr,
              borderRadius: T.radiusSm,
              border: `1px solid ${T.border}`,
            }}
          >
            <span style={{ color: T.accent, fontWeight: 600 }}>How:</span> {lineup.description}
          </div>
          <div style={{ display: "flex", gap: 12, fontSize: 11, color: T.textDim, flexWrap: "wrap" }}>
            <span>
              <strong style={{ color: T.textSec }}>Difficulty:</strong>{" "}
              {"●".repeat(lineup.difficulty) + "○".repeat(3 - lineup.difficulty)}
            </span>
            <span>
              <strong style={{ color: T.textSec }}>Priority:</strong> {lineup.priority}
            </span>
            <span>
              <strong style={{ color: T.textSec }}>Side:</strong> {lineup.side}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
