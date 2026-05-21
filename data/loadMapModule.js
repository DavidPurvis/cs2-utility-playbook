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
  if (!load) throw new Error(`[loadMapModule] Unknown map id: "${mapId}"`);
  return load();
}
