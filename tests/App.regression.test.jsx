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
    await waitFor(() => {
      expect(screen.getAllByText(/Must Learn — The Core 5/i).length).toBeGreaterThan(0);
    });
    for (const id of PREMIER_MAP_IDS) {
      const label = MAPS[id].label;
      await user.click(screen.getAllByRole("button", { name: label })[0]);
      expect(screen.getAllByText(/Must Learn — The Core 5/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Combos — 2-3 player setups/i).length).toBeGreaterThan(0);
    }
  }, 20000);

  it("renders a map button for every MAP_LIST entry", async () => {
    render(<App />);
    await waitForMapLoaded();
    for (const m of MAP_LIST) {
      if (m.id === "cache") {
        expect(screen.getByRole("button", { name: /Cache/i })).toBeInTheDocument();
      } else {
        expect(screen.getAllByRole("button", { name: m.label }).length).toBeGreaterThan(0);
      }
    }
  });

  it("applies round-type filter without crashing", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForMapLoaded();
    await user.click(screen.getAllByRole("button", { name: "PISTOL" })[0]);
    await user.click(screen.getAllByRole("button", { name: "FULL" })[0]);
    expect(screen.getAllByRole("button", { name: "FULL" }).length).toBeGreaterThan(0);
  });
});
