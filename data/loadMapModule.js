/**
 * Lazy-load map data modules (code-split per map in production builds).
 */

const loaders = {
  ancient: () => import("./ancient.js"),
  dust2: () => import("./dust2.js"),
  inferno: () => import("./inferno.js"),
  mirage: () => import("./mirage.js"),
  nuke: () => import("./nuke.js"),
  anubis: () => import("./anubis.js"),
  overpass: () => import("./overpass.js"),
  cache: () => import("./cache.js"),
};

/** @param {string} mapId */
export async function loadMapModule(mapId) {
  const load = loaders[mapId];
  if (!load) {
    if (import.meta.env?.DEV) {
      console.warn(`[loadMapModule] unknown map "${mapId}", falling back to ancient`);
    }
    return loaders.ancient();
  }
  return load();
}
