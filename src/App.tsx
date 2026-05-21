/**
 * Phase 2 placeholder. Replaced by the full v6 UI in Phase 3 (theme +
 * Radar + Home) and Phase 4 (scenario detail + walkthrough). The
 * deletion sweep in Phase 2 removed every legacy consumer (admin,
 * scenarios v1, hooks, storage, schemas, mapRenderer). This stub keeps
 * the build green by importing only the v6 data loader.
 */
import { dustData } from "./data/loadDust2";

export default function App() {
  return (
    <div style={{ padding: 24, fontFamily: "Inter, sans-serif", color: "#1F1B16" }}>
      <h1 style={{ margin: 0, fontSize: 22 }}>Dust 2 Playbook</h1>
      <p style={{ marginTop: 8, color: "#5A544B", fontSize: 14 }}>
        v6 rebuild in progress · {dustData.lineups.length} lineups · {dustData.spawns.length}{" "}
        spawns · {dustData.scenarios.length} scenarios.
      </p>
    </div>
  );
}
