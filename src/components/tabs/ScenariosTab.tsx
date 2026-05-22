/**
 * Scenarios tab — the headline page since v6. Side-by-side: scenario
 * grid on the left, "where am I?" spawn picker on the right. When CT
 * side is selected on the picker, the CT position guide appears
 * below it.
 *
 * This is the same content that used to live directly in Home.tsx
 * before the four-tab restructure. Moved unchanged into a tab.
 */
import { ScenarioGrid } from "../ScenarioGrid";
import { SpawnPicker } from "../SpawnPicker";
import { T } from "../../theme";
import type { DustData } from "../../types";

export interface ScenariosTabProps {
  data: DustData;
  pickedSpawnId: string | null;
  onSelectScenario: (id: string) => void;
  onPickSpawn: (spawnId: string) => void;
  onClearSpawn: () => void;
  onSelectLineup: (lineupId: string) => void;
}

export function ScenariosTab({
  data,
  pickedSpawnId,
  onSelectScenario,
  onPickSpawn,
  onClearSpawn,
  onSelectLineup,
}: ScenariosTabProps) {
  return (
    <div className="app-grid">
      <main id="lineup-list" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <h2 style={{ margin: 0, fontSize: 20, color: T.textPri }}>Scenarios</h2>
          <span style={{ color: T.textDim, fontSize: 13 }}>
            {data.scenarios.length} curated · numbered for "let's do scenario 4" coordination
          </span>
        </div>
        <ScenarioGrid scenarios={data.scenarios} onOpen={onSelectScenario} />
      </main>
      <aside>
        <SpawnPicker
          config={data.config}
          spawns={data.spawns}
          pickedSpawnId={pickedSpawnId}
          onPick={onPickSpawn}
          onClear={onClearSpawn}
          ctPositions={data.ctPositions}
          lineups={data.lineups}
          onSelectLineup={onSelectLineup}
        />
      </aside>
    </div>
  );
}
