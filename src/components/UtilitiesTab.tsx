/**
 * Top-level Utilities tab.
 *
 * Browse every utility in the bundle as either a map (each lineup is
 * a colored throw→landing arc) or a list (compact rows). The same
 * side/type filter set drives both — flip between views without
 * losing the filter selection.
 */
import { useMemo, useState } from "react";
import { useEditableData } from "../hooks/useEditableData";
import { worldToPercent } from "../utils/coordinates";
import { T } from "../theme";
import { MapRenderer } from "./MapRenderer";
import { MapMarker } from "./shared/MapMarker";
import { MapPath } from "./shared/MapPath";
import { UtilityIcon, utilityColor } from "./shared/UtilityIcon";
import type { MapConfig, Side, Utility, UtilityType } from "../types/map";

type ViewMode = "map" | "list";
type SideFilter = "all" | Side;
type TypeFilter = "all" | UtilityType;

const SIDE_FILTERS: SideFilter[] = ["all", "T", "CT"];
const TYPE_FILTERS: TypeFilter[] = ["all", "smoke", "flash", "molotov", "he"];

export function UtilitiesTab() {
  const { config, utilities } = useEditableData();
  const [mode, setMode] = useState<ViewMode>("map");
  const [sideFilter, setSideFilter] = useState<SideFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      utilities.filter(
        (u) =>
          (sideFilter === "all" || u.side === sideFilter) &&
          (typeFilter === "all" || u.type === typeFilter)
      ),
    [utilities, sideFilter, typeFilter]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, fontSize: 18, color: T.textPri }}>
          Utilities <span style={{ color: T.textDim, fontWeight: 400 }}>· {filtered.length}</span>
        </h2>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
          <Segmented
            label="view"
            value={mode}
            options={["map", "list"] as const}
            onChange={setMode}
            colorWhen={(v) => (v === mode ? T.accent : T.textSec)}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Pills label="side" value={sideFilter} options={SIDE_FILTERS} onChange={setSideFilter} />
        <Pills label="type" value={typeFilter} options={TYPE_FILTERS} onChange={setTypeFilter} />
      </div>

      {mode === "map" ? (
        <UtilityMapView
          config={config}
          utilities={filtered}
          highlightedId={highlightedId}
          onHover={setHighlightedId}
        />
      ) : (
        <UtilityListView
          utilities={filtered}
          highlightedId={highlightedId}
          onHover={setHighlightedId}
        />
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Map view
// ──────────────────────────────────────────────────────────────────

function UtilityMapView({
  config,
  utilities,
  highlightedId,
  onHover,
}: {
  config: MapConfig;
  utilities: Utility[];
  highlightedId: string | null;
  onHover: (id: string | null) => void;
}) {
  if (utilities.length === 0) {
    return <EmptyState />;
  }
  return (
    <MapRenderer config={config}>
      {() => (
        <g>
          {/* Arcs */}
          {utilities.map((u, i) => {
            const origin = worldToPercent(u.throwFrom.world.x, u.throwFrom.world.y, config);
            const landing = resolveLandingPercent(u, config);
            if (!origin || !landing) return null;
            const dim = highlightedId && highlightedId !== u.id ? 0.18 : 0.8;
            return (
              <MapPath
                key={`p-${u.id}`}
                from={origin}
                to={landing}
                color={utilityColor(u.type)}
                strokeWidth={0.45}
                bulge={5 + (i % 4) * 1.5}
                opacity={dim}
                markerId={`u-${u.id}`}
              />
            );
          })}
          {/* Origins as small rings */}
          {utilities.map((u) => {
            const origin = worldToPercent(u.throwFrom.world.x, u.throwFrom.world.y, config);
            if (!origin) return null;
            const dim = highlightedId && highlightedId !== u.id ? 0.25 : 1;
            return (
              <g
                key={`o-${u.id}`}
                opacity={dim}
                onMouseEnter={() => onHover(u.id)}
                onMouseLeave={() => onHover(null)}
                style={{ cursor: "pointer" }}
              >
                <MapMarker
                  x={origin.x}
                  y={origin.y}
                  shape="ring"
                  size={1.5}
                  color={utilityColor(u.type)}
                  title={`${u.name} — throw from`}
                />
              </g>
            );
          })}
          {/* Landings */}
          {utilities.map((u) => {
            const landing = resolveLandingPercent(u, config);
            if (!landing) return null;
            const dim = highlightedId && highlightedId !== u.id ? 0.25 : 1;
            return (
              <g
                key={`l-${u.id}`}
                opacity={dim}
                onMouseEnter={() => onHover(u.id)}
                onMouseLeave={() => onHover(null)}
                style={{ cursor: "pointer" }}
              >
                <MapMarker
                  x={landing.x}
                  y={landing.y}
                  shape="circle"
                  size={2.2}
                  color={utilityColor(u.type)}
                  title={`${u.name} — lands here (${u.type})`}
                />
              </g>
            );
          })}
        </g>
      )}
    </MapRenderer>
  );
}

// ──────────────────────────────────────────────────────────────────
// List view
// ──────────────────────────────────────────────────────────────────

function UtilityListView({
  utilities,
  highlightedId,
  onHover,
}: {
  utilities: Utility[];
  highlightedId: string | null;
  onHover: (id: string | null) => void;
}) {
  if (utilities.length === 0) {
    return <EmptyState />;
  }
  const sorted = [...utilities].sort(
    (a, b) =>
      a.side.localeCompare(b.side) || a.type.localeCompare(b.type) || a.name.localeCompare(b.name)
  );

  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
      {sorted.map((u) => {
        const highlighted = highlightedId === u.id;
        const sideColor = u.side === "T" ? T.tSide : T.ctSide;
        return (
          <li
            key={u.id}
            onMouseEnter={() => onHover(u.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(u.id)}
            onBlur={() => onHover(null)}
            tabIndex={0}
            style={{
              padding: "8px 12px",
              background: highlighted ? T.bgHover : T.bgPanel,
              border: `1px solid ${highlighted ? utilityColor(u.type) + "88" : T.borderLt}`,
              borderRadius: T.radius,
              display: "grid",
              gridTemplateColumns: "20px minmax(0, 1fr) auto",
              alignItems: "center",
              columnGap: 10,
              rowGap: 4,
              cursor: "default",
            }}
          >
            <UtilityIcon type={u.type} size={16} />
            <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <strong style={{ color: T.textPri, fontSize: 13 }}>{u.name}</strong>
                <span
                  style={{
                    background: u.side === "T" ? T.tSideBg : T.ctSideBg,
                    color: sideColor,
                    border: `1px solid ${sideColor}55`,
                    fontSize: 10,
                    fontFamily: T.fontMono,
                    fontWeight: 800,
                    padding: "1px 5px",
                    borderRadius: 3,
                  }}
                >
                  {u.side}
                </span>
                <span style={{ color: T.textDim, fontFamily: T.fontMono, fontSize: 11 }}>{u.area}</span>
              </div>
              {u.description && (
                <div style={{ color: T.textSec, fontSize: 11, lineHeight: 1.4 }}>{u.description}</div>
              )}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", color: T.textDim, fontFamily: T.fontMono, fontSize: 10 }}>
                <span>throw: {u.throwStyle}</span>
                <span>·</span>
                <span>movement: {u.movement}</span>
                <span>·</span>
                <span>difficulty: {u.difficulty}</span>
                {u.airTimeSeconds !== undefined && (
                  <>
                    <span>·</span>
                    <span>air: {u.airTimeSeconds}s</span>
                  </>
                )}
                {u.source && (
                  <>
                    <span>·</span>
                    <a
                      href={u.source.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      style={{ color: T.accent, textDecoration: "none" }}
                    >
                      {u.source.name} ↗
                    </a>
                  </>
                )}
              </div>
            </div>
            <span style={{ color: T.textDim, fontSize: 10, fontFamily: T.fontMono, alignSelf: "start", whiteSpace: "nowrap" }}>
              {u.type}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

// ──────────────────────────────────────────────────────────────────
// Bits
// ──────────────────────────────────────────────────────────────────

function EmptyState() {
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
      No utilities match the active filters. Widen them, or open admin
      mode to add one.
    </div>
  );
}

interface SegmentedProps<V extends string> {
  label: string;
  value: V;
  options: readonly V[];
  onChange: (v: V) => void;
  colorWhen?: (v: V) => string;
}

function Segmented<V extends string>({ label, value, options, onChange, colorWhen }: SegmentedProps<V>) {
  return (
    <div role="tablist" aria-label={label} style={{ display: "inline-flex", border: `1px solid ${T.borderLt}`, borderRadius: T.radiusSm, overflow: "hidden" }}>
      {options.map((opt, i) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt)}
            style={{
              background: active ? T.accentBg : T.bgPanel,
              color: colorWhen ? colorWhen(opt) : active ? T.accent : T.textSec,
              border: "none",
              borderLeft: i === 0 ? "none" : `1px solid ${T.borderLt}`,
              padding: "6px 14px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.5,
              cursor: "pointer",
              fontFamily: T.fontUI,
              textTransform: "uppercase",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

interface PillsProps<T extends string> {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}

function Pills<T extends string>({ label, value, options, onChange }: PillsProps<T>) {
  return (
    <div role="group" aria-label={label} style={{ display: "flex", gap: 4, alignItems: "center" }}>
      <span style={{ fontSize: 10, color: T.textDim, letterSpacing: 0.5, textTransform: "uppercase", marginRight: 4 }}>
        {label}
      </span>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
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
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function resolveLandingPercent(u: Utility, config: MapConfig): { x: number; y: number } | null {
  if (u.landingAt.world) {
    return worldToPercent(u.landingAt.world.x, u.landingAt.world.y, config);
  }
  if (u.landingAt.percent) return { x: u.landingAt.percent.x, y: u.landingAt.percent.y };
  return null;
}
