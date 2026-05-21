import { useMemo } from "react";
import { DUST2_META, DUST2_RADAR_URL } from "../data/dust2-meta";
import { DUST2_ZONES } from "../data/dust2-zones";
import { worldToMapPercent } from "../lib/mapCoordinates";
import { T, UTIL_STYLE, PLAYER_STYLE } from "../lib/theme";
import type { Lineup, Scenario, WorldPoint, Zone } from "../data/types";

export interface ScenarioPlayerLineup {
  player: "A" | "B" | "C";
  lineup: Lineup;
}

export interface RadarMapProps {
  selectedZoneId: string | null;
  onZoneSelect: (zoneId: string | null) => void;
  /** Lineups whose throw/landing arcs should be visible (e.g. lineups for the selected zone). */
  lineupsToRender: readonly Lineup[];
  /** When a scenario is active, color lineups by player. */
  scenario: Scenario | null;
  /** Player slot the user picked ("I'm Player A"); their lineups get emphasized. */
  activePlayer: "A" | "B" | "C" | null;
}

function pctOrZero(p: WorldPoint): { x: number; y: number } {
  const pct = worldToMapPercent(p.x, p.y, DUST2_META);
  return pct ?? { x: 0, y: 0 };
}

function polygonPoints(zone: Zone): string {
  return zone.polygon
    .map((v) => {
      const p = pctOrZero(v);
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    })
    .join(" ");
}

function lineupPlayerMap(scenario: Scenario | null): Map<string, "A" | "B" | "C"> {
  const m = new Map<string, "A" | "B" | "C">();
  if (!scenario) return m;
  for (const role of scenario.roles) {
    for (const lid of role.lineupIds) m.set(lid, role.player);
  }
  return m;
}

export function RadarMap({
  selectedZoneId,
  onZoneSelect,
  lineupsToRender,
  scenario,
  activePlayer,
}: RadarMapProps) {
  const playerByLineupId = useMemo(() => lineupPlayerMap(scenario), [scenario]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        background: T.bgDeep,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        overflow: "hidden",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Dust 2 radar"
        style={{ width: "100%", display: "block", aspectRatio: "1 / 1" }}
      >
        {/* Radar image */}
        <image
          href={DUST2_RADAR_URL}
          x={0}
          y={0}
          width={100}
          height={100}
          preserveAspectRatio="xMidYMid meet"
          opacity={selectedZoneId || scenario ? 0.55 : 0.85}
        />

        {/* Zone polygons */}
        {DUST2_ZONES.map((z) => {
          const isSelected = z.id === selectedZoneId;
          return (
            <polygon
              key={`zone-${z.id}`}
              points={polygonPoints(z)}
              fill={isSelected ? `${T.accent}33` : `${T.accent}10`}
              stroke={isSelected ? T.accent : `${T.accent}40`}
              strokeWidth={isSelected ? 0.45 : 0.25}
              style={{ cursor: "pointer", pointerEvents: "all" }}
              onClick={(e) => {
                e.stopPropagation();
                onZoneSelect(isSelected ? null : z.id);
              }}
            >
              <title>{z.name}</title>
            </polygon>
          );
        })}

        {/* Zone labels (only for unselected, hint-style; selected gets emphasized below) */}
        {DUST2_ZONES.map((z) => {
          const center = z.polygon.reduce(
            (acc, v) => {
              const p = pctOrZero(v);
              return { x: acc.x + p.x, y: acc.y + p.y };
            },
            { x: 0, y: 0 }
          );
          center.x /= z.polygon.length;
          center.y /= z.polygon.length;
          const isSelected = z.id === selectedZoneId;
          return (
            <text
              key={`label-${z.id}`}
              x={center.x}
              y={center.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={isSelected ? 2.5 : 1.8}
              fontWeight={isSelected ? 700 : 500}
              fill={isSelected ? T.accent : T.textSec}
              fontFamily={T.fontUI}
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {z.name}
            </text>
          );
        })}

        {/* Lineup arcs and dots */}
        {lineupsToRender.map((l) => {
          const player = playerByLineupId.get(l.id) ?? null;
          const playerStyle = player ? PLAYER_STYLE[player] : null;
          const utilColor = UTIL_STYLE[l.type].color;
          const color = playerStyle ? playerStyle.color : utilColor;
          const opacity =
            activePlayer && player && activePlayer !== player ? 0.35 : 1;

          const throwP = pctOrZero(l.throwFromCoords);
          const landP = pctOrZero(l.landsAtCoords);

          return (
            <g key={`lineup-${l.id}`} opacity={opacity}>
              <line
                x1={throwP.x}
                y1={throwP.y}
                x2={landP.x}
                y2={landP.y}
                stroke={color}
                strokeWidth={0.35}
                strokeDasharray="1.2,0.6"
                opacity={0.7}
              />
              {/* Throw position (circle) */}
              <circle
                cx={throwP.x}
                cy={throwP.y}
                r={1.4}
                fill={color}
                stroke="#000"
                strokeWidth={0.25}
                opacity={0.9}
              />
              {/* Landing position (X marker via crossed lines) */}
              <g transform={`translate(${landP.x},${landP.y})`}>
                <line x1={-1.2} y1={-1.2} x2={1.2} y2={1.2} stroke={color} strokeWidth={0.45} />
                <line x1={-1.2} y1={1.2} x2={1.2} y2={-1.2} stroke={color} strokeWidth={0.45} />
                <circle r={1.8} fill="none" stroke={color} strokeWidth={0.25} opacity={0.6} />
              </g>
              {player && (
                <text
                  x={landP.x}
                  y={landP.y - 2.4}
                  textAnchor="middle"
                  fontSize={1.6}
                  fontWeight={800}
                  fill={color}
                  fontFamily={T.fontMono}
                  style={{ pointerEvents: "none" }}
                >
                  {player}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
