/**
 * Home view shell. Hosts the TabBar + the active tab's content.
 *
 * Tabs:
 *   - defaults       → DefaultsTab
 *   - scenarios      → ScenariosTab (existing scenario grid + spawn picker + CT guide)
 *   - instant_smokes → InstantSmokesTab
 *   - map            → MapTab
 *
 * The active tab lives in the App-level reducer so it survives
 * navigation to scenario / lineup detail and back.
 */
import { ErrorBoundary } from "./ErrorBoundary";
import { TabBar } from "./TabBar";
import { ScenariosTab } from "./tabs/ScenariosTab";
import { DefaultsTab } from "./tabs/DefaultsTab";
import { InstantSmokesTab } from "./tabs/InstantSmokesTab";
import { MapTab } from "./tabs/MapTab";
import type { HomeTab } from "../reducer";
import type { DustData } from "../types";

export interface HomeProps {
  data: DustData;
  activeTab: HomeTab;
  pickedSpawnId: string | null;
  activeThrowFromKey: string | null;
  onSelectTab: (tab: HomeTab) => void;
  onSelectScenario: (id: string) => void;
  onPickSpawn: (spawnId: string) => void;
  onClearSpawn: () => void;
  onSelectLineup: (lineupId: string) => void;
  onSelectThrowFrom: (key: string | null) => void;
}

export function Home({
  data,
  activeTab,
  pickedSpawnId,
  activeThrowFromKey,
  onSelectTab,
  onSelectScenario,
  onPickSpawn,
  onClearSpawn,
  onSelectLineup,
  onSelectThrowFrom,
}: HomeProps) {
  return (
    <>
      <TabBar active={activeTab} onChange={onSelectTab} />
      <div style={{ padding: 20, maxWidth: 1280, margin: "0 auto" }}>
        {activeTab === "defaults" && (
          <ErrorBoundary label="Defaults">
            <DefaultsTab data={data} />
          </ErrorBoundary>
        )}
        {activeTab === "scenarios" && (
          <ErrorBoundary label="Scenarios">
            <ScenariosTab
              data={data}
              pickedSpawnId={pickedSpawnId}
              onSelectScenario={onSelectScenario}
              onPickSpawn={onPickSpawn}
              onClearSpawn={onClearSpawn}
              onSelectLineup={onSelectLineup}
            />
          </ErrorBoundary>
        )}
        {activeTab === "instant_smokes" && (
          <ErrorBoundary label="Instant utility">
            <InstantSmokesTab data={data} onSelectLineup={onSelectLineup} />
          </ErrorBoundary>
        )}
        {activeTab === "map" && (
          <ErrorBoundary label="Map">
            <MapTab
              data={data}
              activeThrowFromKey={activeThrowFromKey}
              onSelectThrowFrom={onSelectThrowFrom}
              onSelectLineup={onSelectLineup}
            />
          </ErrorBoundary>
        )}
      </div>
    </>
  );
}
