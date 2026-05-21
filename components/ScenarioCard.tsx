import type { Scenario } from "../data/types";
import { T } from "../lib/theme";

export interface ScenarioCardProps {
  scenario: Scenario;
  onOpen: () => void;
}

export function ScenarioCard({ scenario, onOpen }: ScenarioCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      style={{
        textAlign: "left",
        padding: 14,
        border: `1px solid ${T.borderLt}`,
        borderLeft: `3px solid ${T.gold}`,
        borderRadius: T.radiusSm,
        background: T.bgPanel,
        color: T.textPri,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        fontFamily: T.fontUI,
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.textPri }}>{scenario.name}</div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: T.gold,
            background: "#1c170a",
            padding: "3px 7px",
            borderRadius: 4,
            border: `1px solid ${T.gold}33`,
            fontFamily: T.fontMono,
            letterSpacing: 0.5,
          }}
        >
          {scenario.playerCount}P · {scenario.site}
        </div>
      </div>
      <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.4 }}>{scenario.description}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {scenario.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: 10,
              color: T.textDim,
              background: T.bgHover,
              padding: "2px 6px",
              borderRadius: 3,
              border: `1px solid ${T.border}`,
              fontFamily: T.fontMono,
              letterSpacing: 0.3,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
