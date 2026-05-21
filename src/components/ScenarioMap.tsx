/**
 * Renders a scenario on top of the radar: per-player colored markers
 * (origin + landing) connected by arcs, with action numbers so the user
 * can follow the sequence.
 *
 * If a referenced utility has no resolvable landing (no world AND no
 * percent), that action is skipped silently and counted in the missing
 * list returned via onMissingActions. We do NOT invent coordinates.
 */
import { useMemo } from "react";
import { worldToPercent } from "../utils/coordinates";
import { utilityColor } from "./shared/UtilityIcon";
import { MapRenderer } from "./MapRenderer";
import { MapMarker } from "./shared/MapMarker";
import { MapPath } from "./shared/MapPath";
import { T } from "../theme";
import type { MapConfig, Scenario, Utility } from "../types/map";

export interface ScenarioMapProps {
  config: MapConfig;
  scenario: Scenario;
  utilities: Utility[];
  /** When set, dim every non-highlighted action and brighten just this one. */
  highlightedActionKey?: string | null;
}

interface Resolved {
  key: string;          // `${playerIdx}-${actionIdx}`
  order: number;
  playerColor: string;
  utility: Utility;
  origin: { x: number; y: number };
  landing: { x: number; y: number };
}

function resolveLanding(u: Utility, config: MapConfig): { x: number; y: number } | null {
  if (u.landingAt.world) {
    return worldToPercent(u.landingAt.world.x, u.landingAt.world.y, config);
  }
  if (u.landingAt.percent) {
    return { x: u.landingAt.percent.x, y: u.landingAt.percent.y };
  }
  return null;
}

export function ScenarioMap({ config, scenario, utilities, highlightedActionKey }: ScenarioMapProps) {
  const utilIndex = useMemo(() => {
    const m = new Map<string, Utility>();
    for (const u of utilities) m.set(u.id, u);
    return m;
  }, [utilities]);

  const resolved: Resolved[] = useMemo(() => {
    const out: Resolved[] = [];
    scenario.players.forEach((player, pi) => {
      player.actions.forEach((action, ai) => {
        const u = utilIndex.get(action.utilityId);
        if (!u) return;
        const origin = worldToPercent(u.throwFrom.world.x, u.throwFrom.world.y, config);
        const landing = resolveLanding(u, config);
        if (!origin || !landing) return;
        out.push({
          key: `${pi}-${ai}`,
          order: action.order,
          playerColor: player.color,
          utility: u,
          origin,
          landing,
        });
      });
    });
    return out;
  }, [scenario, utilIndex, config]);

  return (
    <MapRenderer config={config}>
      {() => (
        <g>
          {/* Arcs first so markers paint on top */}
          {resolved.map((r, i) => {
            const dim = highlightedActionKey && highlightedActionKey !== r.key ? 0.18 : 0.9;
            return (
              <MapPath
                key={`p-${r.key}`}
                from={r.origin}
                to={r.landing}
                color={r.playerColor}
                strokeWidth={0.5}
                bulge={6 + (i % 3) * 1.5}
                opacity={dim}
                markerId={`arrow-${r.key}`}
              />
            );
          })}
          {/* Origins (rings) */}
          {resolved.map((r) => {
            const dim = highlightedActionKey && highlightedActionKey !== r.key ? 0.25 : 1;
            return (
              <g key={`o-${r.key}`} opacity={dim}>
                <MapMarker
                  x={r.origin.x}
                  y={r.origin.y}
                  shape="ring"
                  size={2.4}
                  color={r.playerColor}
                  title={`${r.utility.name} — origin`}
                />
                <text
                  x={r.origin.x}
                  y={r.origin.y + 0.6}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={1.8}
                  fontWeight={800}
                  fontFamily={T.fontMono}
                  fill={r.playerColor}
                  pointerEvents="none"
                >
                  {r.order}
                </text>
              </g>
            );
          })}
          {/* Landings (filled, utility-typed color outline) */}
          {resolved.map((r) => {
            const dim = highlightedActionKey && highlightedActionKey !== r.key ? 0.25 : 1;
            return (
              <g key={`l-${r.key}`} opacity={dim}>
                <MapMarker
                  x={r.landing.x}
                  y={r.landing.y}
                  shape="circle"
                  size={2.6}
                  color={utilityColor(r.utility.type)}
                  title={`${r.utility.name} — landing (${r.utility.type})`}
                />
                {/* Player-color outer ring around the landing so it's tied to that player. */}
                <circle
                  cx={r.landing.x}
                  cy={r.landing.y}
                  r={3.4}
                  fill="none"
                  stroke={r.playerColor}
                  strokeWidth={0.4}
                  opacity={0.8}
                  pointerEvents="none"
                />
              </g>
            );
          })}
        </g>
      )}
    </MapRenderer>
  );
}

/** Returns the action keys referenced by a scenario that have NO resolvable utility / landing. */
export function findMissingActions(scenario: Scenario, utilities: Utility[]): Array<{ playerIdx: number; actionIdx: number; reason: string }> {
  const index = new Map<string, Utility>();
  for (const u of utilities) index.set(u.id, u);
  const out: Array<{ playerIdx: number; actionIdx: number; reason: string }> = [];
  scenario.players.forEach((p, pi) => {
    p.actions.forEach((a, ai) => {
      const u = index.get(a.utilityId);
      if (!u) {
        out.push({ playerIdx: pi, actionIdx: ai, reason: `unknown utility id "${a.utilityId}"` });
        return;
      }
      if (!u.landingAt.world && !u.landingAt.percent) {
        out.push({ playerIdx: pi, actionIdx: ai, reason: `utility "${u.id}" has no landing` });
      }
    });
  });
  return out;
}
