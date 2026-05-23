/**
 * Instant smokes tab — lineups thrown FROM spawn at round start.
 *
 * Heuristic: a lineup qualifies as "instant from spawn" if its
 * throwFrom is within INSTANT_RADIUS world-units of any spawn point
 * on the matching side. The threshold is generous (~1500u ≈ the
 * walking range you cover in the first 5 seconds of the round) so
 * lineups like the xbox smoke (thrown from T spawn just outside the
 * spawn box) qualify.
 *
 * Grouped by side. Each card has the lineup name + type + a one-line
 * description and opens the 2x2 walkthrough on click.
 */
import { useMemo } from "react";
import { worldDistSq } from "../../utils/bounds";
import { T } from "../../theme";
import type { DustData, Lineup, Side, UtilityType } from "../../types";

// 1500 world units ≈ the distance from T spawn to xbox-smoke throw position.
const INSTANT_RADIUS_SQ = 1500 * 1500;

const UTIL_COLOR: Record<UtilityType, string> = {
  smoke: T.utilSmoke,
  flash: T.utilFlash,
  molotov: T.utilMolly,
  he: T.utilHE,
};

function isInstantFromSpawn(
  lineup: Lineup,
  spawns: DustData["spawns"]
): boolean {
  const sideSpawns = spawns.filter((s) => s.side === lineup.side);
  return sideSpawns.some(
    (s) => worldDistSq(lineup.throwFrom.world, s.world) <= INSTANT_RADIUS_SQ
  );
}

export function InstantSmokesTab({
  data,
  onSelectLineup,
}: {
  data: DustData;
  onSelectLineup: (id: string) => void;
}) {
  const instantBySide = useMemo(() => {
    const bySide: Record<Side, Lineup[]> = { T: [], CT: [] };
    for (const l of data.lineups) {
      if (isInstantFromSpawn(l, data.spawns)) bySide[l.side].push(l);
    }
    return bySide;
  }, [data.lineups, data.spawns]);

  const total = instantBySide.T.length + instantBySide.CT.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <header>
        <h2 style={{ margin: 0, fontSize: 20, color: T.textPri }}>
          Instant utility from spawn{" "}
          <span style={{ color: T.textDim, fontSize: 13, fontWeight: 400 }}>· {total}</span>
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: T.textDim, lineHeight: 1.5 }}>
          Lineups you can throw at round start — throwFrom within ~1500 game units of a
          spawn on the matching side. Whoever has the closest spawn calls and throws.
        </p>
      </header>

      <div className="app-grid">
        <SideColumn side="T" lineups={instantBySide.T} onSelectLineup={onSelectLineup} />
        <SideColumn side="CT" lineups={instantBySide.CT} onSelectLineup={onSelectLineup} />
      </div>
    </div>
  );
}

function SideColumn({
  side,
  lineups,
  onSelectLineup,
}: {
  side: Side;
  lineups: Lineup[];
  onSelectLineup: (id: string) => void;
}) {
  const color = side === "T" ? T.tSide : T.ctSide;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span
          style={{
            background: side === "T" ? T.tSideBg : T.ctSideBg,
            color,
            border: `1px solid ${color}55`,
            padding: "2px 8px",
            fontSize: 11,
            fontFamily: T.fontMono,
            fontWeight: 800,
            borderRadius: 4,
          }}
        >
          {side}-side
        </span>
        <span style={{ color: T.textDim, fontSize: 12 }}>{lineups.length} lineup(s)</span>
      </div>
      {lineups.length === 0 ? (
        <div
          style={{
            padding: 16,
            background: T.bgPanel,
            border: `1px dashed ${T.border}`,
            borderRadius: T.radius,
            color: T.textDim,
            fontSize: 13,
          }}
        >
          No instant-from-spawn lineups recorded for {side} yet.
        </div>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {lineups.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => onSelectLineup(l.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: T.bgPanel,
                  border: `1px solid ${T.border}`,
                  borderRadius: T.radius,
                  padding: 12,
                  cursor: "pointer",
                  fontFamily: T.fontUI,
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  aria-label={l.type}
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
                    borderRadius: 999,
                    background: UTIL_COLOR[l.type],
                    border: "1px solid rgba(0,0,0,0.3)",
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <strong style={{ color: T.textPri, fontSize: 14 }}>{l.name}</strong>
                  <span style={{ color: T.textDim, fontSize: 11, fontFamily: T.fontMono }}>
                    {l.type} · {l.area} · {l.throwStyle}
                  </span>
                </div>
                <span aria-hidden style={{ color: T.textMute, fontSize: 16 }}>›</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
