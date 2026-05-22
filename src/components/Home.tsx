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
import { TabBar } from "./TabBar";
import { tabButtonId, tabPanelId } from "./tabIds";
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
      <div
        // ARIA tabs pattern (audit H-5): the content area is a single
        // tabpanel whose id + aria-labelledby change to track the active
        // tab. We use one panel that swaps content rather than rendering
        // all four panels with `hidden` on inactive ones — the audience
        // benefits from the simpler DOM, and screen readers re-announce
        // the panel on activeTab change.
        role="tabpanel"
        id={tabPanelId(activeTab)}
        aria-labelledby={tabButtonId(activeTab)}
        style={{ padding: 20, maxWidth: 1280, margin: "0 auto" }}
      >
        {activeTab === "defaults" && <DefaultsTab data={data} />}
        {activeTab === "scenarios" && (
          <ScenariosTab
            data={data}
            pickedSpawnId={pickedSpawnId}
            onSelectScenario={onSelectScenario}
            onPickSpawn={onPickSpawn}
            onClearSpawn={onClearSpawn}
            onSelectLineup={onSelectLineup}
          />
        )}
        {activeTab === "instant_smokes" && (
          <InstantSmokesTab data={data} onSelectLineup={onSelectLineup} />
        )}
        {activeTab === "map" && (
          <MapTab
            data={data}
            activeThrowFromKey={activeThrowFromKey}
            onSelectThrowFrom={onSelectThrowFrom}
            onSelectLineup={onSelectLineup}
          />
        )}
      </div>
    </>
  );
}
