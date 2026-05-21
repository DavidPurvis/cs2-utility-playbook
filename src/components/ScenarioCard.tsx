/**
 * One scenario tile on the home grid.
 *
 * Visually: a card with the scenario number in a pill, name, side+area
 * tag, player count, and a brief description. Clicking it dispatches
 * SELECT_SCENARIO with this scenario's id.
 *
 * The number is the user-facing identifier ("lets do scenario 4") so
 * we render it prominently.
 */
import { T } from "../theme";
import type { Scenario } from "../types";

export interface ScenarioCardProps {
  scenario: Scenario;
  onOpen: (id: string) => void;
}

export function ScenarioCard({ scenario, onOpen }: ScenarioCardProps) {
  const sideColor = scenario.side === "T" ? T.tSide : T.ctSide;
  const sideBg = scenario.side === "T" ? T.tSideBg : T.ctSideBg;
  return (
    <button
      type="button"
      onClick={() => onOpen(scenario.id)}
      style={{
        textAlign: "left",
        background: T.bgPanel,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        padding: 14,
        cursor: "pointer",
        color: T.textPri,
        fontFamily: T.fontUI,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        boxShadow: T.shadow,
        transition: `transform ${T.transitionFast}, box-shadow ${T.transitionFast}, border-color ${T.transitionFast}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = T.shadowMd;
        e.currentTarget.style.borderColor = T.borderStr;
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = T.shadow;
        e.currentTarget.style.borderColor = T.border;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          aria-label={`Scenario ${scenario.number}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: 999,
            background: T.accentBg,
            color: T.accentDk,
            border: `1px solid ${T.accent}55`,
            fontFamily: T.fontMono,
            fontWeight: 800,
            fontSize: 15,
          }}
        >
          {scenario.number}
        </span>
        <span
          style={{
            background: sideBg,
            color: sideColor,
            border: `1px solid ${sideColor}55`,
            padding: "2px 8px",
            fontSize: 11,
            fontFamily: T.fontMono,
            fontWeight: 700,
            borderRadius: 4,
          }}
        >
          {scenario.side} · {scenario.targetArea}
        </span>
        <span
          style={{
            marginLeft: "auto",
            color: T.textDim,
            fontFamily: T.fontMono,
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {scenario.playerCount}-man
        </span>
      </div>
      <h3 style={{ margin: 0, fontSize: 15, color: T.textPri }}>{scenario.name}</h3>
      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: T.textSec,
          lineHeight: 1.45,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {scenario.description ? scenario.description : (
          <em style={{ color: T.textDim }}>No description yet.</em>
        )}
      </p>
      <span style={{ fontSize: 11, color: T.textDim, fontFamily: T.fontMono, textTransform: "uppercase", letterSpacing: 0.4 }}>
        {scenario.difficulty}
      </span>
    </button>
  );
}
