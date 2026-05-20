import { createContext, useContext } from "react";

export const MapDataContext = createContext(undefined);

export function useMapData() {
  const ctx = useContext(MapDataContext);
  if (ctx === undefined) {
    throw new Error("useMapData must be used within MapDataContext.Provider");
  }
  return ctx;
}
