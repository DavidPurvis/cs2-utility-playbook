import { createContext, useContext } from "react";

export const MapDataContext = createContext(undefined);

export function useMapData() {
  const ctx = useContext(MapDataContext);
  if (ctx === undefined) {
    throw new Error("useMapData must be used within MapDataContext.Provider");
  }
  if (ctx === null) {
    throw new Error("useMapData called before map data loaded — guard with mapLoading or mapData");
  }
  return ctx;
}
