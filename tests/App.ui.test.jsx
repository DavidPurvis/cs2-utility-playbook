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

  it("renders header, tabs, and map selector", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getAllByText(/MUST LEARN/i).length).toBeGreaterThan(0);
    });
    expect(screen.getByText(/CS2 Playbook/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Playbook/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Study/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Train/i).length).toBeGreaterThan(0);
  });

  it("switches to Train tab and shows warmup content", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForMapLoaded();
    const trainBtns = screen.getAllByText(/Train/i);
    await user.click(trainBtns[0]);
    expect(screen.getByText(/Warmup — before you queue/i)).toBeInTheDocument();
    expect(screen.getByText(/FFA Deathmatch/i)).toBeInTheDocument();
  });

  it("switches maps via map sheet and updates header label", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForMapLoaded();
    const mapBtn = screen.getAllByText(/Ancient/i)[0].closest("button");
    await user.click(mapBtn);
    await waitFor(() => {
      expect(screen.getByText(/SWITCH MAP/i)).toBeInTheDocument();
    });
    await user.click(screen.getByText("Mirage").closest("button"));
    await waitFor(() => {
      expect(screen.getAllByText("Mirage").length).toBeGreaterThan(0);
    });
    expect(localStorage.setItem).toHaveBeenCalledWith("cs2_current_map", "mirage");
  });

  it("shows Playbook, Study, and Train tabs", async () => {
    render(<App />);
    await waitForMapLoaded();
    expect(screen.getAllByText(/Playbook/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Study/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Train/i).length).toBeGreaterThan(0);
  });

  it("renders map block with side toggle", async () => {
    render(<App />);
    await waitForMapLoaded();
    expect(screen.getByRole("tab", { name: "T" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "CT" })).toBeInTheDocument();
    expect(screen.getAllByText(/Map ·/i).length).toBeGreaterThan(0);
  });

  it("filters lineups via search input in All Lineups panel", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForMapLoaded();
    const search = screen.getByPlaceholderText(/Search by name/i);
    await user.type(search, "zzznomatchzzz");
    await waitFor(() => {
      expect(screen.getByText(/0 lineups/i)).toBeInTheDocument();
    });
  });

  it("opens Team Roster modal from roster button", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForMapLoaded();
    await user.click(screen.getAllByTitle(/Team roster/i)[0]);
    expect(screen.getAllByText(/Team Roster/i).length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/Belt carrier/i)).toBeInTheDocument();
  });

  it("hides and restores lineups through roster admin panel", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForMapLoaded();

    expect(screen.getAllByText(/Red Room \/ Top Mid Smoke/i).length).toBeGreaterThan(0);

    await user.click(screen.getAllByTitle(/Team roster/i)[0]);
    const hiddenIdInput = screen.getByLabelText(/Hidden lineup ID/i);
    await user.type(hiddenIdInput, "red_room");
    await user.click(screen.getByRole("button", { name: /Hide lineup/i }));

    await waitFor(() => {
      expect(screen.queryAllByText(/Red Room \/ Top Mid Smoke/i).length).toBe(0);
    });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cs2_hidden_lineup_overrides",
      expect.stringContaining("red_room")
    );

    await user.click(screen.getByRole("button", { name: /Show red_room/i }));
    await waitFor(() => {
      expect(screen.getAllByText(/Red Room \/ Top Mid Smoke/i).length).toBeGreaterThan(0);
    });
  });

  it("opens Study view when Study tab is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForMapLoaded();
    const studyBtns = screen.getAllByText(/Study/i);
    await user.click(studyBtns[0]);
    expect(screen.getAllByText(/Study Sheet/i).length).toBeGreaterThan(0);
  });

  it("switches T/CT side via toggle", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForMapLoaded();
    await user.click(screen.getByRole("tab", { name: "CT" }));
    expect(screen.getByRole("tab", { name: "CT" })).toHaveAttribute("aria-selected", "true");
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
