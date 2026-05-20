/**
 * Eager map registry for tests, validation, and stability metrics.
 * The app uses loadMapModule() instead to keep initial bundles smaller.
 */

import * as ancient from "./ancient.js";
import * as dust2 from "./dust2.js";
import * as inferno from "./inferno.js";
import * as mirage from "./mirage.js";
import * as nuke from "./nuke.js";
import * as anubis from "./anubis.js";
import * as overpass from "./overpass.js";
import * as cache from "./cache.js";

import { BONUS_MAP_IDS, PREMIER_MAP_IDS, WIP_MAP_IDS } from "./mapMeta.js";

export { BONUS_MAP_IDS, PREMIER_MAP_IDS, WIP_MAP_IDS };

const MAPS = {
  ancient: { id: "ancient", label: "Ancient", module: ancient },
  dust2: { id: "dust2", label: "Dust II", module: dust2 },
  inferno: { id: "inferno", label: "Inferno", module: inferno },
  mirage: { id: "mirage", label: "Mirage", module: mirage },
  nuke: { id: "nuke", label: "Nuke", module: nuke },
  anubis: { id: "anubis", label: "Anubis", module: anubis },
  overpass: { id: "overpass", label: "Overpass", module: overpass },
  cache: { id: "cache", label: "Cache", module: cache },
};

export const MAP_LIST = [...PREMIER_MAP_IDS, ...BONUS_MAP_IDS].map((id) => MAPS[id]);
export const MAP_IDS = Object.keys(MAPS);

export default MAPS;
