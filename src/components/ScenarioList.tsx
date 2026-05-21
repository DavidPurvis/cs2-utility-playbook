/**
 * Filterable grid of scenarios. The Scenarios tab renders this when no
 * scenario is selected. Click a card to drill in.
 */
import { useMemo, useState } from "react";
import { T } from "../theme";
import { useEditableData } from "../hooks/useEditableData";
import type { Scenario, ScenarioDifficulty, Side } from "../types/map";

export interface ScenarioListProps {
  onOpen: (id: string) => void;
}

type AllOr<T> = T | "all";

const DIFFS: Array<ScenarioDifficulty> = ["beginner", "intermediate", "advanced"];
const SIDES: Array<Side> = ["T", "CT"];
const PLAYER_COUNTS: Array<2 | 3 | 4 | 5> = [2, 3, 4, 5];

export function ScenarioList({ onOpen }: ScenarioListProps) {
  const { scenarios } = useEditableData();
  const [side, setSide] = useState<AllOr<Side>>("all");
  const [diff, setDiff] = useState<AllOr<ScenarioDifficulty>>("all");
  const [pc, setPc] = useState<AllOr<2 | 3 | 4 | 5>>("all");

  const filtered = useMemo(
    () =>
      scenarios.filter(
        (s) =>
          (side === "all" || s.side === side) &&
          (diff === "all" || s.difficulty === diff) &&
          (pc === "all" || s.playerCount === pc)
      ),
    [scenarios, side, diff, pc]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, fontSize: 18, color: T.textPri }}>
          Scenarios <span style={{ color: T.textDim, fontWeight: 400 }}>· {filtered.length}</span>
        </h2>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <FilterPills label="side" value={side} options={[...SIDES, "all"]} onChange={setSide} />
          <FilterPills label="difficulty" value={diff} options={[...DIFFS, "all"]} onChange={setDiff} />
          <FilterPills label="players" value={pc} options={[...PLAYER_COUNTS, "all"]} onChange={setPc} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState totalCount={scenarios.length} />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 10,
          }}
        >
          {filtered.map((s) => (
            <ScenarioCard key={s.id} scenario={s} onOpen={() => onOpen(s.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

interface FilterPillsProps<T extends string | number> {
  label: string;
  value: AllOr<T>;
  options: Array<AllOr<T>>;
  onChange: (v: AllOr<T>) => void;
}

function FilterPills<T extends string | number>({ label, value, options, onChange }: FilterPillsProps<T>) {
  return (
    <div role="group" aria-label={label} style={{ display: "flex", gap: 4, alignItems: "center" }}>
      <span style={{ fontSize: 10, color: T.textDim, letterSpacing: 0.5, textTransform: "uppercase", marginRight: 4 }}>
        {label}
      </span>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={String(opt)}
            type="button"
            onClick={() => onChange(opt)}
            style={{
              background: active ? T.accentBg : T.bgPanel,
              color: active ? T.accent : T.textSec,
              border: `1px solid ${active ? T.accent + "55" : T.borderLt}`,
              borderRadius: T.radiusSm,
              padding: "3px 8px",
              fontSize: 11,
              fontFamily: T.fontMono,
              fontWeight: 700,
              cursor: "pointer",
              textTransform: opt === "all" ? "uppercase" : "none",
            }}
          >
            {String(opt)}
          </button>
        );
      })}
    </div>
  );
}

function ScenarioCard({ scenario, onOpen }: { scenario: Scenario; onOpen: () => void }) {
  const sideColor = scenario.side === "T" ? T.tSide : T.ctSide;
  return (
    <button
      type="button"
      onClick={onOpen}
      style={{
        textAlign: "left",
        background: T.bgPanel,
        border: `1px solid ${T.borderLt}`,
        borderRadius: T.radius,
        padding: 12,
        cursor: "pointer",
        color: T.textPri,
        fontFamily: T.fontUI,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            background: scenario.side === "T" ? T.tSideBg : T.ctSideBg,
            color: sideColor,
            border: `1px solid ${sideColor}55`,
            padding: "2px 6px",
            fontSize: 10,
            fontFamily: T.fontMono,
            fontWeight: 800,
            borderRadius: 3,
          }}
        >
          {scenario.side}
        </span>
        <span
          style={{
            color: T.textDim,
            fontFamily: T.fontMono,
            fontSize: 11,
          }}
        >
          {scenario.targetArea}
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 10,
            color: T.accent,
            fontFamily: T.fontMono,
            fontWeight: 700,
            background: T.accentBg,
            border: `1px solid ${T.accent}33`,
            borderRadius: 3,
            padding: "2px 6px",
          }}
        >
          {scenario.playerCount}-man
        </span>
      </div>
      <h3 style={{ margin: 0, fontSize: 14, color: T.textPri }}>{scenario.name}</h3>
      <p
        style={{
          margin: 0,
          fontSize: 12,
          color: T.textSec,
          lineHeight: 1.4,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {scenario.description || (
          <em style={{ color: T.textDim }}>No description yet — add one in admin mode.</em>
        )}
      </p>
      <span style={{ fontSize: 10, color: T.textDim, fontFamily: T.fontMono, textTransform: "uppercase" }}>
        {scenario.difficulty}
      </span>
    </button>
  );
}

function EmptyState({ totalCount }: { totalCount: number }) {
  return (
    <div
      style={{
        padding: 24,
        background: T.bgPanel,
        border: `1px dashed ${T.borderLt}`,
        borderRadius: T.radius,
        color: T.textDim,
        fontSize: 13,
        lineHeight: 1.6,
      }}
    >
      <h3 style={{ margin: 0, marginBottom: 6, fontSize: 14, color: T.textPri }}>
        {totalCount === 0 ? "No scenarios yet" : "No scenarios match the filters"}
      </h3>
      {totalCount === 0 ? (
        <>
          Enter <code style={{ color: T.accent }}>?admin=1</code> mode (or click the{" "}
          <code style={{ color: T.accent }}>admin</code> link in the footer) and open the{" "}
          <strong style={{ color: T.textSec }}>Scenarios</strong> tab in the admin panel to add one.
          Scenarios reference utilities by id, so add your utilities first.
        </>
      ) : (
        <>Try widening the side / difficulty / player-count filters above.</>
      )}
    </div>
  );
}
