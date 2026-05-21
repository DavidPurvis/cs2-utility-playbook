/**
 * Home view — scenario grid on the left (~60%), spawn-picker on the
 * right (~40%). Stacks vertically below 768px (CSS media query in
 * index.html on .app-grid).
 */
import { ScenarioGrid } from "./ScenarioGrid";
import { SpawnPicker } from "./SpawnPicker";
import { T } from "../theme";
import type { DustData } from "../types";

export interface HomeProps {
  data: DustData;
  pickedSpawnId: string | null;
  onSelectScenario: (id: string) => void;
  onPickSpawn: (spawnId: string) => void;
  onClearSpawn: () => void;
}

export function Home({
  data,
  pickedSpawnId,
  onSelectScenario,
  onPickSpawn,
  onClearSpawn,
}: HomeProps) {
  return (
    <div style={{ padding: 20, maxWidth: 1280, margin: "0 auto" }}>
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
          />
        </aside>
      </div>
    </div>
  );
}
