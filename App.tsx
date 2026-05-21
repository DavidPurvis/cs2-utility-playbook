import { useMemo, useState } from "react";
import { PlaybookHeader } from "./components/PlaybookHeader";
import { RadarMap } from "./components/RadarMap";
import { ScenarioView } from "./components/ScenarioView";
import { ZonePanel } from "./components/ZonePanel";
import { DUST2_LINEUPS } from "./data/dust2-lineups";
import { DUST2_SCENARIOS_BY_ID } from "./data/dust2-scenarios";
import { DUST2_ZONES_BY_ID } from "./data/dust2-zones";
import type { Lineup, PlayerSlot } from "./data/types";
import { T } from "./lib/theme";

function pointInPolygon(
  p: { x: number; y: number },
  polygon: { x: number; y: number }[]
): boolean {
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

export default function App() {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [activePlayer, setActivePlayer] = useState<PlayerSlot | null>(null);

  const selectedZone = selectedZoneId ? DUST2_ZONES_BY_ID[selectedZoneId] ?? null : null;
  const activeScenario = activeScenarioId ? DUST2_SCENARIOS_BY_ID[activeScenarioId] ?? null : null;

  // What lineups to draw on the radar:
  //  - If a scenario is active: all lineups referenced by that scenario.
  //  - Else if a zone is selected: lineups whose landing falls in the zone.
  //  - Else: none.
  const lineupsToRender = useMemo<readonly Lineup[]>(() => {
    if (activeScenario) {
      const ids = new Set<string>();
      for (const role of activeScenario.roles) for (const lid of role.lineupIds) ids.add(lid);
      return DUST2_LINEUPS.filter((l) => ids.has(l.id));
    }
    if (selectedZone) {
      return DUST2_LINEUPS.filter((l) => pointInPolygon(l.landsAtCoords, selectedZone.polygon));
    }
    return [];
  }, [activeScenario, selectedZone]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        color: T.textPri,
        fontFamily: T.fontUI,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PlaybookHeader />

      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 1480,
          margin: "0 auto",
          padding: 20,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
          gap: 24,
          alignItems: "start",
        }}
        className="d2-main"
      >
        <section style={{ minWidth: 0 }}>
          <RadarMap
            selectedZoneId={selectedZoneId}
            onZoneSelect={setSelectedZoneId}
            lineupsToRender={lineupsToRender}
            scenario={activeScenario}
            activePlayer={activePlayer}
          />
          <div
            style={{
              marginTop: 10,
              fontSize: 11,
              color: T.textDim,
              fontFamily: T.fontMono,
              letterSpacing: 0.3,
            }}
          >
            {selectedZoneId
              ? `Showing utility landing in ${DUST2_ZONES_BY_ID[selectedZoneId]?.name ?? selectedZoneId}.`
              : "Click a zone on the radar to begin."}
          </div>
        </section>

        <section style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          <ZonePanel zone={selectedZone} onOpenScenario={(id) => setActiveScenarioId(id)} />
        </section>
      </main>

      {activeScenario && (
        <ScenarioView
          scenario={activeScenario}
          activePlayer={activePlayer}
          onActivePlayerChange={setActivePlayer}
          onClose={() => {
            setActiveScenarioId(null);
            setActivePlayer(null);
          }}
        />
      )}

      <footer
        style={{
          padding: "18px 24px",
          borderTop: `1px solid ${T.border}`,
          color: T.textDim,
          fontSize: 11,
          fontFamily: T.fontMono,
          letterSpacing: 0.3,
          textAlign: "center",
        }}
      >
        Dust 2 Playbook · all coordinates verified against CS2 world space ·
        scenario-first utility planner
      </footer>
    </div>
  );
}
