/**
 * Spawn picker (home view variant).
 *
 * Purely a *visual reference*. Pick a side (T/CT) → the radar zooms to
 * that side's spawn cluster and shows labelled dots. Clicking one
 * highlights it (dispatches PICK_SPAWN) but does NOT filter any
 * lineups or scenarios elsewhere — its job is to answer "I am here on
 * the radar" while you read scenario cards.
 *
 * The picked spawn persists across navigation per the reducer rules
 * (visual reference is orthogonal to the view stack).
 */
import { useMemo, useState } from "react";
import { Radar } from "./Radar";
import { CtPositionGuide } from "./CtPositionGuide";
import { spawnClusterBounds } from "../utils/bounds";
import { worldToPercent } from "../utils/coordinates";
import { T } from "../theme";
import type { CtPosition, Lineup, MapConfig, Side, Spawn } from "../types";

export interface SpawnPickerProps {
  config: MapConfig;
  spawns: Spawn[];
  pickedSpawnId: string | null;
  onPick: (spawnId: string) => void;
  onClear: () => void;
  /** Optional — when supplied alongside `lineups` and side="CT", a
   *  position-guide panel appears below the picker. */
  ctPositions?: CtPosition[];
  lineups?: Lineup[];
  onSelectLineup?: (lineupId: string) => void;
}

export function SpawnPicker({
  config,
  spawns,
  pickedSpawnId,
  onPick,
  onClear,
  ctPositions,
  lineups,
  onSelectLineup,
}: SpawnPickerProps) {
  const [side, setSide] = useState<Side>("T");
  const filtered = useMemo(() => spawns.filter((s) => s.side === side), [spawns, side]);
  // Slightly looser padding (was 4) gives small-dot rendering more breathing
  // room — the T-spawn cluster is tight enough that closer padding made labels
  // overlap.
  const cluster = useMemo(() => spawnClusterBounds(filtered, config, 7), [filtered, config]);
  const sideColor = side === "T" ? T.tSide : T.ctSide;
  const sideBg = side === "T" ? T.tSideBg : T.ctSideBg;

  return (
    <section
      aria-label="Spawn picker"
      style={{
        background: T.bgPanel,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <strong style={{ color: T.textPri, fontSize: 13 }}>Where am I?</strong>
        <span style={{ color: T.textDim, fontSize: 11 }}>
          Pick your spawn for visual reference.
        </span>
        <div role="tablist" aria-label="Side" style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {(["T", "CT"] as const).map((s) => {
            const active = s === side;
            return (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setSide(s);
                  // Picking a new side resets the picked spawn if it
                  // belonged to the old one — the dot would no longer
                  // be in cluster view.
                  if (pickedSpawnId) {
                    const sp = spawns.find((sp) => sp.id === pickedSpawnId);
                    if (sp && sp.side !== s) onClear();
                  }
                }}
                style={{
                  background: active ? (s === "T" ? T.tSideBg : T.ctSideBg) : "transparent",
                  color: active ? (s === "T" ? T.tSide : T.ctSide) : T.textSec,
                  border: `1px solid ${active ? (s === "T" ? T.tSide : T.ctSide) + "55" : T.border}`,
                  borderRadius: T.radiusSm,
                  padding: "4px 10px",
                  fontSize: 11,
                  fontFamily: T.fontMono,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {s}-side
              </button>
            );
          })}
        </div>
      </div>

      <Radar
        config={config}
        viewBox={cluster}
        ariaLabel={`${side}-side spawn cluster on Dust 2`}
      >
        {() =>
          filtered.map((spawn) => {
            const pct = worldToPercent(spawn.world.x, spawn.world.y, config);
            if (!pct) return null;
            const picked = spawn.id === pickedSpawnId;
            // Owner directive (2026-05): strip the side prefix on the radar
            // icon. The side tab above the picker already tells the user
            // which side they're looking at, so showing "t-15" or "ct-3"
            // duplicates that info AND forces a dot too small to land on.
            // We render the bare number ("15", "3") INSIDE the dot so the
            // visible icon and the click target are the same shape.
            const numberOnly = spawn.label.replace(/^(t|ct)-/i, "");
            // Dot sizing rule: r MUST be the SAME for picked and unpicked.
            // T-14 and T-15 sit only ~1.5 viewBox units apart at cluster
            // zoom. If the picked dot inflates, it covers the adjacent
            // unpicked spawn's click center and the user can't switch
            // their selection. (Exactly the bug the owner reported.)
            // r=0.95 keeps both dots distinct AND lets the click center
            // of each spawn stay outside its neighbor's radius.
            // Picked-state cue is fill + text color only — no inflation.
            const r = 0.95;
            const fontSize = 0.85;
            return (
              <g
                key={spawn.id}
                transform={`translate(${pct.x}, ${pct.y})`}
                style={{ cursor: "pointer" }}
                onClick={() => onPick(spawn.id)}
              >
                {/* The dot is the ONLY click target. An earlier revision
                    added a wide r=2.6 transparent hit circle here, but
                    adjacent spawns' hit zones overlapped and SVG z-order
                    routed clicks to whichever spawn rendered last
                    (e.g. clicking CT-3 selected CT-4; clicking T-14
                    selected T-15). The fix is: visible icon == click
                    target, no oversized invisible halo.
                    Black halo for legibility on the radar background. */}
                <circle
                  r={r + 0.22}
                  fill="none"
                  stroke="#000"
                  strokeWidth={0.25}
                  opacity={0.6}
                  pointerEvents="none"
                />
                <circle
                  r={r}
                  fill={picked ? sideColor : T.bgPanel}
                  stroke={sideColor}
                  strokeWidth={picked ? 0.5 : 0.4}
                />
                {/* Number lives INSIDE the dot so the click target and the
                    visible label are one shape. The text has pointer-events
                    disabled (attribute + CSS) so the `g`'s onClick is the
                    only handler that fires; without it, hitting the digit
                    glyph wouldn't bubble up in some renderers. */}
                <text
                  x={0}
                  y={0.3}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={fontSize}
                  fontWeight={800}
                  fill={picked ? "#FFFFFF" : sideColor}
                  stroke="#000"
                  strokeWidth={0.22}
                  paintOrder="stroke fill"
                  fontFamily={T.fontMono}
                  pointerEvents="none"
                  style={{ pointerEvents: "none", userSelect: "none", cursor: "default" }}
                >
                  {numberOnly}
                </text>
                <title>{`${spawn.label} — setpos ${spawn.world.x} ${spawn.world.y}`}</title>
              </g>
            );
          })
        }
      </Radar>

      <div
        role="status"
        style={{
          padding: "8px 10px",
          background: pickedSpawnId ? sideBg : T.bgSubtle,
          border: `1px solid ${pickedSpawnId ? sideColor + "55" : T.border}`,
          borderRadius: T.radiusSm,
          fontSize: 12,
          color: pickedSpawnId ? sideColor : T.textDim,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {pickedSpawnId ? (
          <>
            <strong>Spawn: {spawns.find((s) => s.id === pickedSpawnId)?.label}</strong>
            <button
              type="button"
              onClick={onClear}
              style={{
                marginLeft: "auto",
                background: "transparent",
                border: `1px solid ${sideColor}55`,
                color: sideColor,
                cursor: "pointer",
                fontSize: 11,
                fontFamily: T.fontMono,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: T.radiusSm,
              }}
            >
              clear
            </button>
          </>
        ) : (
          <>Click a spawn dot to mark "I am here" for visual reference.</>
        )}
      </div>

      {side === "CT" && ctPositions && ctPositions.length > 0 && lineups && onSelectLineup && (
        <CtPositionGuide
          positions={ctPositions}
          lineups={lineups}
          onSelectLineup={onSelectLineup}
        />
      )}
    </section>
  );
}
