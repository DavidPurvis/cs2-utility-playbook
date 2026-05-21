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
import { spawnClusterBounds } from "../utils/bounds";
import { worldToPercent } from "../utils/coordinates";
import { T } from "../theme";
import type { MapConfig, Side, Spawn } from "../types";

export interface SpawnPickerProps {
  config: MapConfig;
  spawns: Spawn[];
  pickedSpawnId: string | null;
  onPick: (spawnId: string) => void;
  onClear: () => void;
}

export function SpawnPicker({ config, spawns, pickedSpawnId, onPick, onClear }: SpawnPickerProps) {
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
            return (
              <g
                key={spawn.id}
                transform={`translate(${pct.x}, ${pct.y})`}
                style={{ cursor: "pointer" }}
                onClick={() => onPick(spawn.id)}
              >
                {/* Wide transparent hit target stays generous (~2.6 percent units)
                    so taps don't miss, even though the visible dot is much smaller. */}
                <circle r={2.6} fill="transparent" />
                <circle
                  r={picked ? 1.2 : 0.85}
                  fill={picked ? sideColor : T.bgPanel}
                  stroke={sideColor}
                  strokeWidth={picked ? 0.35 : 0.22}
                />
                {/* Label sits OUTSIDE the dot (above it) so dots can pack
                    tighter without numbers stacking. Picked-state inflates the
                    label for clarity. */}
                <text
                  x={0}
                  y={picked ? 0.3 : -1.4}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={picked ? 1.1 : 0.85}
                  fontWeight={800}
                  fill={picked ? "#FFFFFF" : sideColor}
                  fontFamily={T.fontMono}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {spawn.label.replace(/^S/, "")}
                </text>
                <title>{`${spawn.side} ${spawn.label} — setpos ${spawn.world.x} ${spawn.world.y}`}</title>
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
    </section>
  );
}
