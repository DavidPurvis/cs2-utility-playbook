import { useMemo } from "react";
import type { Lineup, Scenario, Zone } from "../data/types";
import { DUST2_LINEUPS } from "../data/dust2-lineups";
import { DUST2_SCENARIOS } from "../data/dust2-scenarios";
import { T } from "../lib/theme";
import { LineupCard } from "./LineupCard";
import { ScenarioCard } from "./ScenarioCard";

export interface ZonePanelProps {
  zone: Zone | null;
  onOpenScenario: (id: string) => void;
}

function pointInPolygon(p: { x: number; y: number }, polygon: { x: number; y: number }[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const pi = polygon[i]!;
    const pj = polygon[j]!;
    const intersect =
      pi.y > p.y !== pj.y > p.y &&
      p.x < ((pj.x - pi.x) * (p.y - pi.y)) / (pj.y - pi.y + 1e-9) + pi.x;
    if (intersect) inside = !inside;
  }
  return inside;
}

function lineupsLandingInZone(zone: Zone): Lineup[] {
  return DUST2_LINEUPS.filter((l) => pointInPolygon(l.landsAtCoords, zone.polygon));
}

function scenariosForZone(zone: Zone): Scenario[] {
  return DUST2_SCENARIOS.filter((s) => s.site === zone.site);
}

function groupByType(lineups: Lineup[]): Record<string, Lineup[]> {
  const out: Record<string, Lineup[]> = {};
  for (const l of lineups) {
    if (!out[l.type]) out[l.type] = [];
    out[l.type]!.push(l);
  }
  return out;
}

const TYPE_ORDER: Array<Lineup["type"]> = ["smoke", "flash", "molotov", "he"];
const TYPE_LABEL: Record<Lineup["type"], string> = {
  smoke: "Smokes",
  flash: "Flashes",
  molotov: "Molotovs",
  he: "HE Grenades",
};

export function ZonePanel({ zone, onOpenScenario }: ZonePanelProps) {
  const lineups = useMemo(() => (zone ? lineupsLandingInZone(zone) : []), [zone]);
  const scenarios = useMemo(() => (zone ? scenariosForZone(zone) : []), [zone]);
  const grouped = useMemo(() => groupByType(lineups), [lineups]);

  if (!zone) {
    return (
      <aside
        style={{
          background: T.bgPanel,
          border: `1px solid ${T.border}`,
          borderRadius: T.radius,
          padding: 18,
          color: T.textDim,
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        <div style={{ fontSize: 11, color: T.textMute, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
          Pick a zone
        </div>
        Click a target zone on the radar to see utility that lands there and scenarios that hit it.
      </aside>
    );
  }

  return (
    <aside
      style={{
        background: T.bgPanel,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <header>
        <div style={{ fontSize: 10, color: T.textMute, letterSpacing: 1.5, textTransform: "uppercase" }}>
          Target zone
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.textPri, marginTop: 2 }}>
          {zone.name}
        </div>
        <div style={{ fontSize: 11, color: T.textDim, marginTop: 4 }}>
          Site {zone.site} · {lineups.length} utility · {scenarios.length} scenario
          {scenarios.length === 1 ? "" : "s"}
        </div>
      </header>

      {scenarios.length > 0 && (
        <section>
          <h3
            style={{
              margin: 0,
              marginBottom: 8,
              fontSize: 12,
              color: T.gold,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Scenarios for site {zone.site}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {scenarios.map((s) => (
              <ScenarioCard key={s.id} scenario={s} onOpen={() => onOpenScenario(s.id)} />
            ))}
          </div>
        </section>
      )}

      {lineups.length > 0 && (
        <section>
          <h3
            style={{
              margin: 0,
              marginBottom: 8,
              fontSize: 12,
              color: T.accent,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Utility landing here
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {TYPE_ORDER.flatMap((type) =>
              (grouped[type] ?? []).length === 0
                ? []
                : [
                    <div key={type} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div
                        style={{
                          fontSize: 10,
                          color: T.textDim,
                          letterSpacing: 0.8,
                          textTransform: "uppercase",
                        }}
                      >
                        {TYPE_LABEL[type]}
                      </div>
                      {grouped[type]!.map((l) => (
                        <LineupCard key={l.id} lineup={l} />
                      ))}
                    </div>,
                  ]
            )}
          </div>
        </section>
      )}

      {lineups.length === 0 && scenarios.length === 0 && (
        <div style={{ fontSize: 13, color: T.textDim }}>
          No lineups or scenarios indexed to this zone yet.
        </div>
      )}
    </aside>
  );
}
