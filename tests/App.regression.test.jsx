import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App.jsx";
import { waitForMapLoaded } from "./helpers/waitForMap.js";
import MAPS, { MAP_LIST, PREMIER_MAP_IDS } from "../data/maps-registry.js";

describe("App regression guards", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
    window.history.replaceState({}, "", "/");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows Must Learn for every Premier map after switching", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForMapLoaded();

    for (const id of PREMIER_MAP_IDS) {
      const label = MAPS[id].label;
      // Open map sheet
      const mapBtn = screen.getAllByText(/Ancient|Dust II|Inferno|Mirage|Nuke|Anubis|Overpass/i)[0].closest("button");
      await user.click(mapBtn);
      await waitFor(() => {
        expect(screen.getByText(/SWITCH MAP/i)).toBeInTheDocument();
      });
      await user.click(screen.getAllByText(label).find(el => el.closest("[style*='grid']"))?.closest("button") || screen.getAllByText(label)[0].closest("button"));
      await waitFor(() => {
        expect(screen.getAllByText(/MUST LEARN/i).length).toBeGreaterThan(0);
      });
      expect(screen.getAllByText(/Combos/i).length).toBeGreaterThan(0);
    }
  }, 20000);

  it("renders all Premier maps in map sheet", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForMapLoaded();
    // Open map sheet
    const mapBtn = screen.getAllByText(/Ancient/i)[0].closest("button");
    await user.click(mapBtn);
    await waitFor(() => {
      expect(screen.getByText(/SWITCH MAP/i)).toBeInTheDocument();
    });
    for (const m of MAP_LIST) {
      expect(screen.getAllByText(m.label).length).toBeGreaterThan(0);
    }
  });

  it("applies round-type filter without crashing", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForMapLoaded();
    await user.click(screen.getAllByText("PIST")[0]);
    await user.click(screen.getAllByText("FULL")[0]);
    expect(screen.getAllByText("FULL").length).toBeGreaterThan(0);
  });
});
