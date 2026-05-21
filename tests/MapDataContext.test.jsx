import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MapDataContext, useMapData } from "../context/MapDataContext.jsx";
import * as ancient from "../data/ancient.js";

function Consumer() {
  const data = useMapData();
  return <div data-testid="map-name">{data.MAP_NAME}</div>;
}

describe("MapDataContext", () => {
  it("throws when useMapData is used outside Provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow(/useMapData must be used within/);
    spy.mockRestore();
  });

  it("provides map module data to descendants", () => {
    render(
      <MapDataContext.Provider value={ancient}>
        <Consumer />
      </MapDataContext.Provider>
    );
    expect(screen.getByTestId("map-name")).toHaveTextContent(ancient.MAP_NAME);
  });

  it("allows null provider value while map data is loading (without calling useMapData)", () => {
    render(
      <MapDataContext.Provider value={null}>
        <div data-testid="loading">loading</div>
      </MapDataContext.Provider>
    );
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("throws when useMapData is called with null provider value", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <MapDataContext.Provider value={null}>
          <Consumer />
        </MapDataContext.Provider>
      )
    ).toThrow(/before map data loaded/);
    spy.mockRestore();
  });
});
