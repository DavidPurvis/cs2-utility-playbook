/**
 * Phase 3 TDD: Home view component journey (TKT-009).
 *
 * Locks the three observable behaviors of the Home view:
 *   1. ScenarioGrid renders one card per seeded scenario.
 *   2. Clicking a scenario card calls the onSelectScenario callback
 *      with that scenario's id.
 *   3. SpawnPicker shows the T-side cluster by default (15 dots).
 */
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Home } from "../Home";
import { getDustData } from "../../data/loadDust2";
const dustData = getDustData();

describe("Home view", () => {
  const noop = () => {};

  it("renders one card per scenario in the bundle", () => {
    render(
      <Home
        data={dustData}
        pickedSpawnId={null}
        onSelectScenario={noop}
        onPickSpawn={noop}
        onSelectLineup={noop}
        activeTab="scenarios"
        activeThrowFromKey={null}
        onSelectTab={noop}
        onSelectThrowFrom={noop}
        onClearSpawn={noop}
      />
    );
    const grid = screen.getByTestId("scenario-grid");
    // Each ScenarioCard renders the scenario name as an <h3>
    const names = dustData.scenarios.map((s) => s.name);
    for (const name of names) {
      expect(grid.textContent).toContain(name);
    }
    // Numbered chips visible
    for (const scenario of dustData.scenarios) {
      expect(grid.textContent).toContain(String(scenario.number));
    }
  });

  it("clicking a scenario card calls onSelectScenario with the right id", () => {
    const onSelect = vi.fn();
    render(
      <Home
        data={dustData}
        pickedSpawnId={null}
        onSelectScenario={onSelect}
        onPickSpawn={noop}
        onSelectLineup={noop}
        activeTab="scenarios"
        activeThrowFromKey={null}
        onSelectTab={noop}
        onSelectThrowFrom={noop}
        onClearSpawn={noop}
      />
    );
    const firstScenario = [...dustData.scenarios].sort((a, b) => a.number - b.number)[0]!;
    // The card is a <button> whose accessible name contains the name text.
    const card = screen.getByRole("button", { name: new RegExp(firstScenario.name, "i") });
    fireEvent.click(card);
    expect(onSelect).toHaveBeenCalledWith(firstScenario.id);
  });

  it("SpawnPicker renders the T-side spawn cluster by default", () => {
    render(
      <Home
        data={dustData}
        pickedSpawnId={null}
        onSelectScenario={noop}
        onPickSpawn={noop}
        onSelectLineup={noop}
        activeTab="scenarios"
        activeThrowFromKey={null}
        onSelectTab={noop}
        onSelectThrowFrom={noop}
        onClearSpawn={noop}
      />
    );
    // T-side toggle is selected by default; T-side has 15 spawns
    const tSpawns = dustData.spawns.filter((s) => s.side === "T");
    expect(tSpawns).toHaveLength(15);
    // Owner directive 2026-05: the icon shows just the NUMBER (no "t-"
    // prefix) because the side toggle above already disambiguates.
    // Numbers 1..15 must each appear at least once on the T-side radar.
    for (const s of tSpawns) {
      const numberOnly = s.label.replace(/^(t|ct)-/i, "");
      expect(screen.getAllByText(numberOnly).length).toBeGreaterThan(0);
    }
  });
});
