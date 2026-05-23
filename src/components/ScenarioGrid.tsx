/**
 * Home-view grid of scenarios. Sorts by user-facing `number` so
 * "scenario 4" is always in the same slot for muscle memory.
 */
import { useMemo } from "react";
import { ScenarioCard } from "./ScenarioCard";
import { T } from "../theme";
import type { Scenario } from "../types";

export interface ScenarioGridProps {
  scenarios: Scenario[];
  onOpen: (id: string) => void;
}

export function ScenarioGrid({ scenarios, onOpen }: ScenarioGridProps) {
  const sorted = useMemo(
    () => [...scenarios].sort((a, b) => a.number - b.number),
    [scenarios]
  );

  if (sorted.length === 0) {
    return (
      <div
        style={{
          padding: 24,
          background: T.bgPanel,
          border: `1px dashed ${T.border}`,
          borderRadius: T.radius,
          color: T.textDim,
          fontSize: 13,
          lineHeight: 1.5,
          textAlign: "center",
        }}
      >
        No scenarios available yet. Scenarios are numbered team executes —
        coordinated utility sequences for 2-5 players.
      </div>
    );
  }

  return (
    <ul
      data-testid="scenario-grid"
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 12,
      }}
    >
      {sorted.map((s) => (
        <li key={s.id}>
          <ScenarioCard scenario={s} onOpen={onOpen} />
        </li>
      ))}
    </ul>
  );
}
