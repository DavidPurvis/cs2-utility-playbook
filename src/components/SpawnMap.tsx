/**
 * Spawn Positions tab.
 *
 * Default state ("picker mode"): the radar zooms in on the current
 * side's spawn cluster so every spawn (15 T or 5 CT) is large enough
 * to read at a glance. Click a spawn to enter "selected mode".
 *
 * Selected mode: the radar zooms back out to the full map. The
 * chosen spawn stays highlighted, and every utility whose throw
 * origin is near that spawn is drawn — origin ring + landing dot +
 * arc — so the player sees what they can throw from there and
 * where it lands. A floating × button restores picker mode.
 *
 * Transitions are driven by MapRenderer's animated viewBox prop, so
 * the zoom in / out happens automatically when the bounds change.
 */
import { useMemo, useState } from "react";
import { worldToPercent } from "../utils/coordinates";
import { spawnClusterBounds, worldDistSq } from "../utils/bounds";
import { T } from "../theme";
import { MapRenderer, type ViewBox } from "./MapRenderer";
import { MapMarker } from "./shared/MapMarker";
import { MapPath } from "./shared/MapPath";
import { UtilityIcon, utilityColor } from "./shared/UtilityIcon";
import type { MapConfig, Side, Spawn, Utility } from "../types/map";

const FULL: ViewBox = { x: 0, y: 0, width: 100, height: 100 };
// Utilities within this many world units of the selected spawn's
// origin are considered "throwable from here". 1024 ≈ ~2 small
// player widths in CS2, generous enough to capture nearby lineups
// without dragging in throws from across the map.
const NEAR_RADIUS = 1024;
const NEAR_RADIUS_SQ = NEAR_RADIUS * NEAR_RADIUS;

export interface SpawnMapProps {
  config: MapConfig;
  spawns: Spawn[];
  utilities?: Utility[];
  /** Forwarded to MapRenderer so admin click-to-place works from this tab. */
  clickable?: boolean;
  onMapClick?: (percent: { x: number; y: number }) => void;
}

export function SpawnMap({
  config,
  spawns,
  utilities = [],
  clickable,
  onMapClick,
}: SpawnMapProps) {
  const [side, setSide] = useState<Side>("T");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => spawns.filter((s) => s.side === side), [spawns, side]);
  const selected = useMemo(
    () => (selectedId ? filtered.find((s) => s.id === selectedId) ?? null : null),
    [selectedId, filtered]
  );

  // Reset selection when the user flips sides — the chosen spawn no
  // longer belongs to the current cluster.
  const setSideSafe = (s: Side) => {
    if (s !== side) setSelectedId(null);
    setSide(s);
  };

  // Picker mode auto-fits the spawn cluster; selected mode shows the
  // whole radar so the user can see where utilities land.
  const cluster = useMemo(() => spawnClusterBounds(filtered, config, 4), [filtered, config]);
  const viewBox = selected ? FULL : cluster;
  const color = side === "T" ? T.tSide : T.ctSide;
  const bg = side === "T" ? T.tSideBg : T.ctSideBg;

  // Throwable utilities from the selected spawn: same side + nearby
  // origin. We never invent landings.
  const nearbyUtilities = useMemo(() => {
    if (!selected) return [] as Utility[];
    return utilities.filter((u) => {
      if (u.side !== selected.side) return false;
      return worldDistSq(u.throwFrom.world, selected.world) <= NEAR_RADIUS_SQ;
    });
  }, [utilities, selected]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, fontSize: 18, color: T.textPri }}>
          {selected ? (
            <>
              {selected.side}-side spawn{" "}
              <span style={{ color, fontFamily: T.fontMono }}>{selected.label}</span>
            </>
          ) : (
            <>
              Spawn Positions{" "}
              <span style={{ color: T.textDim, fontWeight: 400 }}>· pick yours</span>
            </>
          )}
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
                onClick={() => setSideSafe(s)}
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

      <MapRenderer
        config={config}
        viewBox={viewBox}
        clickable={clickable}
        onMapClick={onMapClick}
        overlay={
          selected ? (
            <CloseButton onClick={() => setSelectedId(null)} />
          ) : null
        }
      >
        {() => (
          <>
            {/* Picker mode: every spawn on the side is clickable and labelled. */}
            {!selected &&
              filtered.map((spawn) => {
                const pct = worldToPercent(spawn.world.x, spawn.world.y, config);
                if (!pct) return null;
                return (
                  <SpawnPickerMarker
                    key={spawn.id}
                    x={pct.x}
                    y={pct.y}
                    label={spawn.label}
                    color={color}
                    onClick={() => setSelectedId(spawn.id)}
                    title={`${spawn.side} ${spawn.label} — setpos ${spawn.world.x} ${spawn.world.y}${
                      spawn.world.z !== undefined ? ` ${spawn.world.z}` : ""
                    }`}
                  />
                );
              })}

            {/* Selected mode: highlight the chosen spawn + utilities. */}
            {selected &&
              (() => {
                const sp = worldToPercent(selected.world.x, selected.world.y, config);
                if (!sp) return null;
                return (
                  <>
                    {/* Arcs first so markers paint on top. */}
                    {nearbyUtilities.map((u, i) => {
                      const origin = worldToPercent(u.throwFrom.world.x, u.throwFrom.world.y, config);
                      const landing = resolveLandingPercent(u, config);
                      if (!origin || !landing) return null;
                      return (
                        <MapPath
                          key={`arc-${u.id}`}
                          from={origin}
                          to={landing}
                          color={utilityColor(u.type)}
                          strokeWidth={0.5}
                          bulge={5 + (i % 3) * 1.5}
                          opacity={0.85}
                          markerId={`arc-${u.id}`}
                        />
                      );
                    })}

                    {/* Selected spawn ring underneath origins for contrast. */}
                    <circle cx={sp.x} cy={sp.y} r={4} fill="none" stroke={color} strokeWidth={0.6} opacity={0.6} />
                    <MapMarker
                      x={sp.x}
                      y={sp.y}
                      shape="circle"
                      size={2.6}
                      color={color}
                      label={selected.label}
                      title={`${selected.side} ${selected.label}`}
                    />

                    {/* Origin markers for each throwable utility. */}
                    {nearbyUtilities.map((u) => {
                      const origin = worldToPercent(u.throwFrom.world.x, u.throwFrom.world.y, config);
                      if (!origin) return null;
                      return (
                        <MapMarker
                          key={`o-${u.id}`}
                          x={origin.x}
                          y={origin.y}
                          shape="ring"
                          size={1.6}
                          color={utilityColor(u.type)}
                          title={`${u.name} — throw from`}
                        />
                      );
                    })}

                    {/* Landings */}
                    {nearbyUtilities.map((u) => {
                      const landing = resolveLandingPercent(u, config);
                      if (!landing) return null;
                      return (
                        <MapMarker
                          key={`l-${u.id}`}
                          x={landing.x}
                          y={landing.y}
                          shape="circle"
                          size={2.2}
                          color={utilityColor(u.type)}
                          title={`${u.name} — lands here (${u.type})`}
                        />
                      );
                    })}
                  </>
                );
              })()}
          </>
        )}
      </MapRenderer>

      {selected ? (
        <SelectedSpawnSummary
          spawn={selected}
          utilities={nearbyUtilities}
          color={color}
          bg={bg}
          totalForSide={utilities.filter((u) => u.side === selected.side).length}
        />
      ) : (
        <PickerHelp side={side} color={color} bg={bg} count={filtered.length} />
      )}
    </div>
  );
}

function PickerHelp({ side, color, bg, count }: { side: Side; color: string; bg: string; count: number }) {
  return (
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
      <strong style={{ color }}>{count} {side}-side spawns.</strong>{" "}
      Click your spawn dot to see which utilities you can throw from
      that exact position and where they land.
    </div>
  );
}

function SelectedSpawnSummary({
  spawn,
  utilities,
  color,
  bg,
  totalForSide,
}: {
  spawn: Spawn;
  utilities: Utility[];
  color: string;
  bg: string;
  totalForSide: number;
}) {
  return (
    <div
      style={{
        padding: 12,
        background: bg,
        border: `1px solid ${color}33`,
        borderRadius: T.radiusSm,
        color: T.textSec,
        fontSize: 12,
        lineHeight: 1.5,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <strong style={{ color }}>{spawn.side}-side · {spawn.label}</strong>
        <code style={{ color: T.textDim, fontFamily: T.fontMono, fontSize: 11 }}>
          setpos {spawn.world.x} {spawn.world.y}
          {spawn.world.z !== undefined ? ` ${spawn.world.z}` : ""}
        </code>
        <span style={{ marginLeft: "auto", color: T.textDim, fontSize: 11 }}>
          {utilities.length} throwable / {totalForSide} on this side
        </span>
      </div>
      {utilities.length === 0 ? (
        <em style={{ color: T.textDim, fontSize: 12 }}>
          No lineups recorded from this spawn yet. Add one in admin mode (Utilities tab).
        </em>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
          {utilities.map((u) => (
            <li
              key={u.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 6px",
                background: T.bg,
                border: `1px solid ${T.borderLt}`,
                borderRadius: 3,
              }}
            >
              <UtilityIcon type={u.type} size={14} />
              <span style={{ flex: 1, color: T.textPri, fontSize: 12 }}>{u.name}</span>
              <span style={{ color: T.textDim, fontFamily: T.fontMono, fontSize: 10 }}>
                {u.area} · {u.difficulty}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Back to spawn picker"
      title="Back to spawn picker"
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "rgba(10,14,21,0.78)",
        color: T.accent,
        border: `1px solid ${T.accent}55`,
        cursor: "pointer",
        fontSize: 20,
        fontWeight: 700,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "auto",
        boxShadow: "0 4px 10px rgba(0,0,0,0.45)",
        fontFamily: T.fontMono,
      }}
    >
      ×
    </button>
  );
}

interface SpawnPickerMarkerProps {
  x: number;
  y: number;
  label: string;
  color: string;
  title: string;
  onClick: () => void;
}

function SpawnPickerMarker({ x, y, label, color, title, onClick }: SpawnPickerMarkerProps) {
  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {/* Larger hit target — invisible but catches clicks even on tight clusters. */}
      <circle r={3.6} fill="transparent" />
      <circle
        r={2.4}
        fill={color}
        stroke="#000"
        strokeWidth={0.3}
        opacity={0.92}
      />
      <text
        x={0}
        y={0.4}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={2.2}
        fontWeight={800}
        fill="#000"
        fontFamily={T.fontMono}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        {label}
      </text>
      <title>{title}</title>
    </g>
  );
}

function resolveLandingPercent(u: Utility, config: MapConfig): { x: number; y: number } | null {
  if (u.landingAt.world) {
    return worldToPercent(u.landingAt.world.x, u.landingAt.world.y, config);
  }
  if (u.landingAt.percent) return { x: u.landingAt.percent.x, y: u.landingAt.percent.y };
  return null;
}
