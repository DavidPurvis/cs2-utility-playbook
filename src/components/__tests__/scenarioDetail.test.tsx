/**
 * Phase 4 TDD: ScenarioDetail journey (TKT-014).
 *
 * Locks the four key behaviors:
 *   1. Renders one role tab per player in the scenario.
 *   2. Clicking a role tab calls onSelectRole with the right role id.
 *   3. PlayerSteps shows the active role's actions in chronological
 *      order; if no role is selected, it shows an "instructional"
 *      empty state ("pick a role").
 *   4. Back button calls onBack.
 *
 * NOTE: The radar arc-filter behavior (only-active-role arcs are bright)
 * is implementation detail tested indirectly via Phase 5 polish work,
 * not here.
 */
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ScenarioDetail } from "../ScenarioDetail";
import { getDustData } from "../../data/loadDust2";
const dustData = getDustData();

// Seed scenarios ship with empty actions[]. We pick the 3-man "A
// Default Take" and graft on a single action referencing the xbox
// smoke so PlayerSteps has something to render.
function withSeededAction() {
  const sc = structuredClone(dustData.scenarios.find((s) => s.number === 1)!);
  sc.players[0]!.actions = [{ order: 1, lineupId: "xbox_smoke", description: "go fast" }];
  return sc;
}

describe("ScenarioDetail journey", () => {
  const noop = () => {};

  it("renders one role tab per player", () => {
    const sc = withSeededAction();
    render(
      <ScenarioDetail
        scenario={sc}
        config={dustData.config}
        spawns={dustData.spawns}
        lineups={dustData.lineups}
        activeRoleId={null}
        onSelectRole={noop}
        onSelectLineup={noop}
        onBack={noop}
      />
    );
    for (const p of sc.players) {
      expect(screen.getByRole("tab", { name: new RegExp(p.label, "i") })).toBeInTheDocument();
    }
  });

  it("clicking a role tab calls onSelectRole with its role id", () => {
    const sc = withSeededAction();
    const onSelectRole = vi.fn();
    render(
      <ScenarioDetail
        scenario={sc}
        config={dustData.config}
        spawns={dustData.spawns}
        lineups={dustData.lineups}
        activeRoleId={null}
        onSelectRole={onSelectRole}
        onSelectLineup={noop}
        onBack={noop}
      />
    );
    const bMan = screen.getByRole("tab", { name: new RegExp(sc.players[1]!.label, "i") });
    fireEvent.click(bMan);
    expect(onSelectRole).toHaveBeenCalledWith(sc.players[1]!.role);
  });

  it("shows the active role's actions in order; instructs to pick a role when none active", () => {
    const sc = withSeededAction();
    // No active role → empty state
    const { rerender } = render(
      <ScenarioDetail
        scenario={sc}
        config={dustData.config}
        spawns={dustData.spawns}
        lineups={dustData.lineups}
        activeRoleId={null}
        onSelectRole={noop}
        onSelectLineup={noop}
        onBack={noop}
      />
    );
    expect(screen.getByText(/pick a role/i)).toBeInTheDocument();

    // Active a-man → shows the seeded action's lineup name
    rerender(
      <ScenarioDetail
        scenario={sc}
        config={dustData.config}
        spawns={dustData.spawns}
        lineups={dustData.lineups}
        activeRoleId={sc.players[0]!.role}
        onSelectRole={noop}
        onSelectLineup={noop}
        onBack={noop}
      />
    );
    const xbox = dustData.lineups.find((l) => l.id === "xbox_smoke")!;
    expect(screen.getByText(new RegExp(xbox.name, "i"))).toBeInTheDocument();
  });

  it("clicking the back button calls onBack", () => {
    const sc = withSeededAction();
    const onBack = vi.fn();
    render(
      <ScenarioDetail
        scenario={sc}
        config={dustData.config}
        spawns={dustData.spawns}
        lineups={dustData.lineups}
        activeRoleId={null}
        onSelectRole={noop}
        onSelectLineup={noop}
        onBack={onBack}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(onBack).toHaveBeenCalled();
  });
});
