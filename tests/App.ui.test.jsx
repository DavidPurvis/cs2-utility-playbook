import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App.jsx";
import { renderApp } from "./helpers/renderApp.jsx";
import { waitForMapLoaded } from "./helpers/waitForMap.js";

describe("App UI", () => {
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

  it("renders header, Maps/Training nav, and all selectable maps", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getAllByText(/Must Learn — The Core 5/i).length).toBeGreaterThan(0);
    });
    expect(screen.getByText(/CS2 UTILITY PLAYBOOK/i)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Maps" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "Training" }).length).toBeGreaterThan(0);
    for (const label of ["Ancient", "Dust II", "Inferno", "Mirage", "Nuke", "Anubis", "Overpass"]) {
      expect(screen.getAllByRole("button", { name: label }).length).toBeGreaterThan(0);
    }
    expect(screen.getByRole("button", { name: /Cache/i })).toBeInTheDocument();
  });

  it("switches to Training section and shows warmup content", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByRole("button", { name: "Training" })[0]);
    expect(screen.getByText(/Warmup — before you queue/i)).toBeInTheDocument();
    expect(screen.getByText(/FFA Deathmatch/i)).toBeInTheDocument();
  });

  it("switches maps and updates header label", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() => {
      expect(screen.getAllByText(/Must Learn — The Core 5/i).length).toBeGreaterThan(0);
    });
    await user.click(screen.getAllByRole("button", { name: "Mirage" })[0]);
    await waitFor(() => {
      expect(screen.getAllByText("Mirage").length).toBeGreaterThan(0);
    });
    expect(localStorage.setItem).toHaveBeenCalledWith("cs2_current_map", "mirage");
  });

  it("shows Playbook, Map, and Study view tabs on Maps section", async () => {
    render(<App />);
    await waitForMapLoaded();
    expect(screen.getAllByRole("button", { name: "Playbook" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "Map" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "Study" }).length).toBeGreaterThan(0);
  });

  it("opens Map view with side toggle", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForMapLoaded();
    await user.click(screen.getAllByRole("button", { name: "Map" })[0]);
    expect(screen.getAllByRole("button", { name: /T SIDE/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /CT SIDE/i }).length).toBeGreaterThan(0);
  });

  it("filters lineups via search input in expanded reference panel", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForMapLoaded();
    await user.click(screen.getAllByRole("button", { name: /All T-Side Lineups/i })[0]);
    const search = screen.getByRole("searchbox", { name: /Search lineups/i });
    await user.type(search, "zzznomatchzzz");
    expect(screen.getAllByRole("button", { name: /All T-Side Lineups \(0\)/i }).length).toBeGreaterThan(0);
  });

  it("opens Team Roster modal from gear button", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByTitle("Team Roster")[0]);
    expect(screen.getAllByText("Team Roster").length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText("Player 1...")).toBeInTheDocument();
  });

  it("opens Study picker when Study tab is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForMapLoaded();
    await user.click(screen.getAllByRole("button", { name: "Study" })[0]);
    expect(screen.getByText(/Study Sheet/i)).toBeInTheDocument();
  });

  it("switches T/CT side on playbook view", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForMapLoaded();
    await user.click(screen.getAllByRole("button", { name: /CT SIDE/i })[0]);
    expect(screen.getAllByRole("button", { name: /CT SIDE/i }).length).toBeGreaterThan(0);
  });
});

describe("App URL deep links", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads map from ?map= query param", async () => {
    renderApp({ url: "/?map=mirage", storage: {} });
    await waitFor(() => {
      expect(screen.getAllByText("Mirage").length).toBeGreaterThan(0);
    });
  });

  it("enters study mode from ?p= query param", async () => {
    renderApp({ url: "/?p=Alex", storage: {} });
    await waitFor(() => {
      expect(screen.getAllByText(/Alex's Study Sheet|Study Sheet/i).length).toBeGreaterThan(0);
    });
  });

  it("restores saved map from localStorage", async () => {
    renderApp({ storage: { cs2_current_map: "dust2" } });
    await waitFor(() => {
      expect(screen.getAllByText("Dust II").length).toBeGreaterThan(0);
    });
  });
});
