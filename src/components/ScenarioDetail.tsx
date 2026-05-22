/**
 * Scenario detail view. The radar shows every player's throwFrom →
 * landing arcs, color-coded by player. A tab strip lets the user pick
 * a role ("I'm the A-man"); when a role is active, that player's arcs
 * stay bright while everyone else dims, and the chronological action
 * list on the right filters to that role.
 *
 * Clicking an action row dispatches SELECT_LINEUP, opening the 2×2
 * walkthrough for that lineup.
 *
 * Scenario seed shells ship with empty `actions: []` — the empty
 * state nudges the user to populate via `npm run new-scenario`.
 */
import { useMemo } from "react";
import { Radar } from "./Radar";
import { worldToPercent } from "../utils/coordinates";
import { T } from "../theme";
import type { Lineup, MapConfig, Scenario, ScenarioAction, Spawn } from "../types";

// UTIL_COLOR now lives in theme.ts as T.utilColor (single source of truth).
const UTIL_COLOR = T.utilColor;

export interface ScenarioDetailProps {
  scenario: Scenario;
  config: MapConfig;
  spawns: Spawn[];
  lineups: Lineup[];
  activeRoleId: string | null;
  onSelectRole: (roleId: string) => void;
  onSelectLineup: (lineupId: string) => void;
  onBack: () => void;
}

export function ScenarioDetail({
  scenario,
  config,
  spawns,
  lineups,
  activeRoleId,
  onSelectRole,
  onSelectLineup,
  onBack,
}: ScenarioDetailProps) {
  const lineupById = useMemo(() => {
    const m = new Map<string, Lineup>();
    for (const l of lineups) m.set(l.id, l);
    return m;
  }, [lineups]);

  const spawnById = useMemo(() => {
    const m = new Map<string, Spawn>();
    for (const s of spawns) m.set(s.id, s);
    return m;
  }, [spawns]);

  // Player ordering respects roleOrder if given, else array order.
  const orderedPlayers = useMemo(() => {
    if (!scenario.roleOrder?.length) return scenario.players;
    const idx = (role: string) => {
      const i = scenario.roleOrder!.indexOf(role);
      return i === -1 ? Number.MAX_SAFE_INTEGER : i;
    };
    return [...scenario.players].sort((a, b) => idx(a.role) - idx(b.role));
  }, [scenario.players, scenario.roleOrder]);

  const activePlayer = activeRoleId
    ? scenario.players.find((p) => p.role === activeRoleId) ?? null
    : null;
  const sortedActions = activePlayer
    ? [...activePlayer.actions].sort((a, b) => a.order - b.order)
    : [];

  return (
    <div style={{ padding: 20, maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          style={{
            background: T.bgPanel,
            border: `1px solid ${T.border}`,
            color: T.textSec,
            borderRadius: T.radiusSm,
            padding: "6px 12px",
            fontSize: 12,
            fontFamily: T.fontMono,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
        <span
          style={{
            background: T.accentBg,
            color: T.accentDk,
            border: `1px solid ${T.accent}55`,
            borderRadius: 999,
            padding: "2px 10px",
            fontSize: 12,
            fontFamily: T.fontMono,
            fontWeight: 800,
          }}
        >
          Scenario {scenario.number}
        </span>
        <h2 style={{ margin: 0, fontSize: 18, color: T.textPri }}>{scenario.name}</h2>
        <span style={{ color: T.textDim, fontFamily: T.fontMono, fontSize: 11 }}>
          {scenario.side} · {scenario.targetArea} · {scenario.difficulty} · {scenario.playerCount}-man
        </span>
      </div>

      {scenario.description && (
        <p style={{ marginTop: 0, marginBottom: 12, fontSize: 13, color: T.textSec, lineHeight: 1.5 }}>
          {scenario.description}
        </p>
      )}

      <div className="app-grid">
        <div>
          <Radar
            config={config}
            ariaLabel={`Scenario ${scenario.number} arcs on Dust 2`}
          >
            {() => (
              <g>
                {orderedPlayers.flatMap((p) => {
                  const dim = activeRoleId && p.role !== activeRoleId ? 0.18 : 0.9;
                  // Player's spawn dot (visual anchor)
                  const spawnNode = p.startingSpawnId
                    ? spawnById.get(p.startingSpawnId)
                    : null;
                  const spawnPct = spawnNode
                    ? worldToPercent(spawnNode.world.x, spawnNode.world.y, config)
                    : null;

                  const arcs = p.actions.map((a) => {
                    const l = lineupById.get(a.lineupId);
                    if (!l) return null;
                    const o = worldToPercent(l.throwFrom.world.x, l.throwFrom.world.y, config);
                    const land = l.landingAt.world
                      ? worldToPercent(l.landingAt.world.x, l.landingAt.world.y, config)
                      : l.landingAt.percent ?? null;
                    if (!o || !land) return null;
                    return (
                      <g key={`${p.role}-${a.order}`} opacity={dim}>
                        <line
                          x1={o.x}
                          y1={o.y}
                          x2={land.x}
                          y2={land.y}
                          stroke={p.color}
                          strokeWidth={0.5}
                          strokeDasharray="1.5 1"
                        />
                        <circle cx={o.x} cy={o.y} r={1.5} fill="none" stroke={p.color} strokeWidth={0.5} />
                        <circle cx={land.x} cy={land.y} r={2.1} fill={UTIL_COLOR[l.type]} stroke="#FFFFFF" strokeWidth={0.3} />
                      </g>
                    );
                  });

                  return [
                    spawnPct && (
                      <g key={`${p.role}-spawn`} opacity={dim}>
                        <circle cx={spawnPct.x} cy={spawnPct.y} r={3.4} fill="none" stroke={p.color} strokeWidth={0.6} />
                        <circle cx={spawnPct.x} cy={spawnPct.y} r={2.2} fill={p.color} />
                      </g>
                    ),
                    ...arcs,
                  ].filter(Boolean);
                })}
              </g>
            )}
          </Radar>
        </div>

        <aside style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div role="tablist" aria-label="Player roles" style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {orderedPlayers.map((p) => {
              const active = p.role === activeRoleId;
              return (
                <button
                  key={p.role}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => onSelectRole(p.role)}
                  style={{
                    background: active ? p.color : T.bgPanel,
                    color: active ? "#FFFFFF" : T.textPri,
                    border: `1px solid ${active ? p.color : T.border}`,
                    borderRadius: T.radiusSm,
                    padding: "6px 12px",
                    fontSize: 12,
                    fontFamily: T.fontUI,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: p.color,
                      marginRight: 6,
                      border: active ? "1px solid #FFFFFF" : "none",
                    }}
                  />
                  {p.label}
                </button>
              );
            })}
          </div>

          {!activePlayer ? (
            <div
              style={{
                padding: 16,
                background: T.bgPanel,
                border: `1px dashed ${T.border}`,
                borderRadius: T.radius,
                color: T.textDim,
                fontSize: 13,
                lineHeight: 1.5,
                textAlign: "center",
              }}
            >
              Pick a role above to see that player's chronological lineups.
            </div>
          ) : sortedActions.length === 0 ? (
            <div
              style={{
                padding: 16,
                background: T.bgPanel,
                border: `1px dashed ${T.border}`,
                borderRadius: T.radius,
                color: T.textDim,
                fontSize: 12,
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: T.textSec }}>{activePlayer.label}</strong> has no actions
              yet. Add lineups to this role with{" "}
              <code style={{ color: T.accentDk }}>npm run new-scenario</code> or edit{" "}
              <code style={{ color: T.accentDk }}>src/data/dust2.json</code> directly.
            </div>
          ) : (
            <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
              {sortedActions.map((a) => (
                <StepRow
                  key={a.order}
                  action={a}
                  lineup={lineupById.get(a.lineupId) ?? null}
                  color={activePlayer.color}
                  onSelect={() => onSelectLineup(a.lineupId)}
                />
              ))}
            </ol>
          )}
        </aside>
      </div>
    </div>
  );
}

function StepRow({
  action,
  lineup,
  color,
  onSelect,
}: {
  action: ScenarioAction;
  lineup: Lineup | null;
  color: string;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        style={{
          width: "100%",
          textAlign: "left",
          background: T.bgPanel,
          border: `1px solid ${T.border}`,
          borderRadius: T.radiusSm,
          padding: 10,
          cursor: "pointer",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          gap: 10,
          fontFamily: T.fontUI,
        }}
      >
        <span
          aria-label={`Step ${action.order}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 24,
            borderRadius: 999,
            background: color,
            color: "#FFFFFF",
            fontFamily: T.fontMono,
            fontWeight: 800,
            fontSize: 12,
          }}
        >
          {action.order}
        </span>
        <div style={{ minWidth: 0 }}>
          {lineup ? (
            <>
              <div style={{ color: T.textPri, fontWeight: 700, fontSize: 13 }}>{lineup.name}</div>
              <div style={{ color: T.textDim, fontSize: 11, fontFamily: T.fontMono }}>
                {lineup.type} · {lineup.throwStyle} · {lineup.area}
              </div>
              {(action.description || action.timing) && (
                <div style={{ color: T.textSec, fontSize: 11, marginTop: 2 }}>
                  {action.timing && (
                    <span style={{ fontFamily: T.fontMono, marginRight: 6 }}>{action.timing}</span>
                  )}
                  {action.description}
                </div>
              )}
            </>
          ) : (
            <span style={{ color: T.danger, fontSize: 12 }}>
              unknown lineup: {action.lineupId}
            </span>
          )}
        </div>
        <span aria-hidden style={{ color: T.textMute, fontSize: 14 }}>›</span>
      </button>
    </li>
  );
}
