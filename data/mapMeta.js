/** Map selector metadata (no lineup modules — safe for the app shell bundle). */

export const PREMIER_MAP_IDS = [
  "ancient",
  "dust2",
  "inferno",
  "mirage",
  "nuke",
  "anubis",
  "overpass",
];

export const BONUS_MAP_IDS = ["cache"];

export const WIP_MAP_IDS = [];

/** UI pool label: premier = active competitive rotation, bonus = extra content. */
export const MAP_POOL = {
  ancient: "premier",
  dust2: "premier",
  inferno: "premier",
  mirage: "premier",
  nuke: "premier",
  anubis: "premier",
  overpass: "premier",
  cache: "bonus",
};

const LABELS = {
  ancient: "Ancient",
  dust2: "Dust II",
  inferno: "Inferno",
  mirage: "Mirage",
  nuke: "Nuke",
  anubis: "Anubis",
  overpass: "Overpass",
  cache: "Cache",
};

export const MAP_IDS = [...PREMIER_MAP_IDS, ...BONUS_MAP_IDS, ...WIP_MAP_IDS];

export const MAP_LIST = [...PREMIER_MAP_IDS, ...BONUS_MAP_IDS].map((id) => ({
  id,
  label: LABELS[id],
}));

export function getMapLabel(id) {
  return LABELS[id] || "Unknown";
}

export function getMapPool(id) {
  return MAP_POOL[id] || "bonus";
}
