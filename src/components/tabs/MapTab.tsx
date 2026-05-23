/**
 * Map tab — origin-first navigation.
 *
 * Renders the radar with a marker at every UNIQUE throwFrom position
 * across the lineup library. Clicking a marker lists the lineups you
 * can throw FROM that exact spot. This is the inversion of the
 * cs2util.com / csnades.gg model (which is destination-first: "I want
 * to smoke X, where do I throw from"). Origin-first is the owner's
 * preferred mental model: "I am at position P, what can I do?"
 *
 * Marker grouping: lineups with throwFrom within MERGE_RADIUS world
 * units of each other share a single marker. The marker key is the
 * sorted list of lineup ids; clicking it shows that group.
 */
import { useMemo } from "react";
import { Radar } from "../Radar";
import { worldToPercent } from "../../utils/coordinates";
import { clusterThrowFroms } from "../../utils/clusterThrowFroms";
import { T } from "../../theme";
import type { DustData, Lineup, UtilityType } from "../../types";

// UTIL_COLOR now lives in theme.ts as T.utilColor (single source of truth).
const UTIL_COLOR = T.utilColor;

export function MapTab({
  data,
  activeThrowFromKey,
  onSelectThrowFrom,
  onSelectLineup,
}: {
  data: DustData;
  activeThrowFromKey: string | null;
  onSelectThrowFrom: (key: string | null) => void;
  onSelectLineup: (id: string) => void;
}) {
  const clusters = useMemo(() => clusterThrowFroms(data.lineups), [data.lineups]);
  const active = useMemo(
    () => clusters.find((c) => c.key === activeThrowFromKey) ?? null,
    [clusters, activeThrowFromKey]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <header>
        <h2 style={{ margin: 0, fontSize: 20, color: T.textPri }}>Map — throw-from positions</h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: T.textDim, lineHeight: 1.5 }}>
          Every unique spot you can throw utility FROM. Click a marker to see what
          can be thrown from there. This is the opposite of cs2util / csnades — origin
          first, not destination first.
        </p>
      </header>

      <div className="app-grid">
        <div>
          <Radar config={data.config} ariaLabel="All throw-from positions on Dust 2">
            {() =>
              clusters.map((c) => {
                const p = worldToPercent(c.representative.x, c.representative.y, data.config);
                if (!p) return null;
                const isActive = c.key === activeThrowFromKey;
                const types = uniqueTypes(c.lineups);
                // Owner directive 2026-05: marker radius MUST be constant
                // between active and inactive states. The previous
                // implementation inflated the active dot from r=1.3 → r=1.9
                // (~46%), which is enough that the active dot covers the
                // click center of an adjacent cluster (clusters are
                // ~3.3 viewBox units apart at minimum). Same overlap-stealing
                // bug class as the spawn picker (DECISIONS_LEDGER R-12).
                // Active state is signalled by FILL + STROKE color only —
                // size is constant so the hit footprint never grows.
                return (
                  <g
                    key={c.key}
                    transform={`translate(${p.x}, ${p.y})`}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      onSelectThrowFrom(c.key === activeThrowFromKey ? null : c.key)
                    }
                  >
                    {/* Outer halo — constant radius. */}
                    <circle
                      r={1.6}
                      fill="none"
                      stroke="#000"
                      strokeWidth={0.25}
                      opacity={0.6}
                      pointerEvents="none"
                    />
                    {/* Main dot — constant radius. Color shift is the only
                        active-state signal. */}
                    <circle
                      r={1.3}
                      fill={isActive ? T.accent : T.bgPanel}
                      stroke={isActive ? T.accentDk : UTIL_COLOR[types[0] ?? "smoke"]}
                      strokeWidth={isActive ? 0.5 : 0.4}
                    />
                    {/* Count badge for clusters with multiple lineups */}
                    {c.lineups.length > 1 && (
                      <text
                        x={0}
                        y={0.3}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={1.3}
                        fontWeight={800}
                        fill={isActive ? "#FFFFFF" : T.textPri}
                        stroke="#000"
                        strokeWidth={0.15}
                        paintOrder="stroke fill"
                        fontFamily={T.fontMono}
                        pointerEvents="none"
                      >
                        {c.lineups.length}
                      </text>
                    )}
                    <title>
                      {c.lineups.length === 1
                        ? (c.lineups[0]?.name ?? "Lineup")
                        : `${c.lineups.length} lineups from this spot`}
                    </title>
                  </g>
                );
              })
            }
          </Radar>
        </div>

        <aside>
          {!active ? (
            <div
              style={{
                padding: 16,
                background: T.bgPanel,
                border: `1px dashed ${T.border}`,
                borderRadius: T.radius,
                color: T.textDim,
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: T.textPri }}>{clusters.length}</strong>{" "}
              throw-from position{clusters.length === 1 ? "" : "s"} on the map.
              Click a marker to see lineups available there.
            </div>
          ) : (
            <div
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
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <strong style={{ color: T.textPri, fontSize: 15 }}>
                  {active.lineups.length} lineup{active.lineups.length === 1 ? "" : "s"} here
                </strong>
                <button
                  type="button"
                  onClick={() => onSelectThrowFrom(null)}
                  style={{
                    marginLeft: "auto",
                    background: "transparent",
                    border: `1px solid ${T.border}`,
                    color: T.textSec,
                    borderRadius: T.radiusSm,
                    padding: "2px 8px",
                    fontSize: 11,
                    fontFamily: T.fontMono,
                    cursor: "pointer",
                  }}
                >
                  clear
                </button>
              </div>
              <code
                style={{
                  fontFamily: T.fontMono,
                  fontSize: 11,
                  color: T.textSec,
                  background: T.bgSubtle,
                  padding: "6px 8px",
                  borderRadius: T.radiusSm,
                  // Audit H-2 fix (2026-05): on 375px mobile the aside
                  // collapses to ~343px. Typical setpos with signed
                  // 4-digit coords is wider than that. overflowWrap
                  // splits mid-word at the row boundary so the panel
                  // never scrolls horizontally.
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                  display: "block",
                }}
              >
                throwFrom: setpos {active.representative.x} {active.representative.y}
                {active.representative.z !== undefined ? ` ${active.representative.z}` : ""}
              </code>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                {active.lineups.map((l) => (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => onSelectLineup(l.id)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        background: T.bg,
                        border: `1px solid ${T.borderStr}`,
                        borderRadius: T.radiusSm,
                        padding: 10,
                        cursor: "pointer",
                        display: "grid",
                        gridTemplateColumns: "auto 1fr auto",
                        alignItems: "center",
                        gap: 8,
                        fontFamily: T.fontUI,
                      }}
                    >
                      <span
                        aria-label={l.type}
                        style={{
                          display: "inline-block",
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          background: UTIL_COLOR[l.type],
                          border: "1px solid rgba(0,0,0,0.3)",
                        }}
                      />
                      <div>
                        <div style={{ color: T.textPri, fontWeight: 700, fontSize: 13 }}>{l.name}</div>
                        <div style={{ color: T.textDim, fontSize: 11, fontFamily: T.fontMono }}>
                          {l.type} · {l.area} · {l.throwStyle}
                        </div>
                      </div>
                      <span aria-hidden style={{ color: T.textMute, fontSize: 14 }}>›</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function uniqueTypes(lineups: Lineup[]): UtilityType[] {
  const set = new Set<UtilityType>();
  for (const l of lineups) set.add(l.type);
  return [...set];
}
