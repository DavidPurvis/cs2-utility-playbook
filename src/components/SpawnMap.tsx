import { useMemo, useState } from "react";
import { worldToPercent } from "../utils/coordinates";
import { T } from "../theme";
import { MapRenderer } from "./MapRenderer";
import { MapMarker } from "./shared/MapMarker";
import type { MapConfig, Side, Spawn } from "../types/map";

export interface SpawnMapProps {
  config: MapConfig;
  spawns: Spawn[];
}

export function SpawnMap({ config, spawns }: SpawnMapProps) {
  const [side, setSide] = useState<Side>("T");
  const filtered = useMemo(() => spawns.filter((s) => s.side === side), [spawns, side]);
  const color = side === "T" ? T.tSide : T.ctSide;
  const bg = side === "T" ? T.tSideBg : T.ctSideBg;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, fontSize: 18, color: T.textPri }}>
          Spawn Positions <span style={{ color: T.textDim, fontWeight: 400 }}>· {filtered.length}</span>
        </h2>
        <div role="tablist" aria-label="Side" style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
          {(["T", "CT"] as const).map((s) => {
            const active = side === s;
            return (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSide(s)}
                style={{
                  background: active ? (s === "T" ? T.tSideBg : T.ctSideBg) : T.bgPanel,
                  color: active ? (s === "T" ? T.tSide : T.ctSide) : T.textSec,
                  border: `1px solid ${active ? (s === "T" ? T.tSide : T.ctSide) + "55" : T.borderLt}`,
                  padding: "6px 14px",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  borderRadius: T.radiusSm,
                  cursor: "pointer",
                  fontFamily: T.fontUI,
                }}
              >
                {s}-side
              </button>
            );
          })}
        </div>
      </div>

      <MapRenderer config={config}>
        {() =>
          filtered.map((spawn) => {
            const pct = worldToPercent(spawn.world.x, spawn.world.y, config);
            if (!pct) return null;
            return (
              <MapMarker
                key={spawn.id}
                x={pct.x}
                y={pct.y}
                label={spawn.label}
                color={color}
                size={2.6}
                title={`${spawn.side} ${spawn.label} — setpos ${spawn.world.x} ${spawn.world.y} ${spawn.world.z ?? "?"}`}
              />
            );
          })
        }
      </MapRenderer>

      <div
        style={{
          padding: 10,
          background: bg,
          border: `1px solid ${color}33`,
          borderRadius: T.radiusSm,
          color: T.textSec,
          fontSize: 12,
          lineHeight: 1.5,
        }}
      >
        {side === "T" ? (
          <>
            <strong style={{ color }}>15 T-side spawns.</strong> Closest player to the lineup spawn
            should throw — useful for instant smokes that need the right starting position.
          </>
        ) : (
          <>
            <strong style={{ color }}>5 CT-side spawns.</strong> Position-dependent retake utility
            uses these as the throw origin.
          </>
        )}
      </div>
    </div>
  );
}
