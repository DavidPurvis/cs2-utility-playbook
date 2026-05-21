/**
 * Spawn and bomb-site landmarks from demoinfocs-golang overview metadata.
 * Icon fractions (0–1) are converted to world coords via mapPercentToWorld.
 *
 * Source: markus-wa/demoinfocs-golang examples/_assets/metadata/de_*.txt
 * Cache is omitted (no official overview in that repo).
 */
export const DEMOINFOCS_ICON_FRACTIONS = {
  ancient: {
    TSpawn: [0.485, 0.87],
    CTSpawn: [0.51, 0.17],
    bombA: [0.31, 0.25],
    bombB: [0.8, 0.4],
  },
  dust2: {
    TSpawn: [0.39, 0.91],
    CTSpawn: [0.62, 0.21],
    bombA: [0.8, 0.16],
    bombB: [0.21, 0.12],
  },
  inferno: {
    TSpawn: [0.1, 0.67],
    CTSpawn: [0.9, 0.35],
    bombA: [0.81, 0.69],
    bombB: [0.49, 0.22],
  },
  mirage: {
    TSpawn: [0.87, 0.36],
    CTSpawn: [0.28, 0.7],
    bombA: [0.54, 0.76],
    bombB: [0.23, 0.28],
  },
  nuke: {
    TSpawn: [0.19, 0.54],
    CTSpawn: [0.82, 0.45],
    bombA: [0.58, 0.48],
    bombB: [0.58, 0.58],
  },
  anubis: {
    TSpawn: [0.58, 0.93],
    CTSpawn: [0.61, 0.22],
  },
  overpass: {
    TSpawn: [0.66, 0.93],
    CTSpawn: [0.49, 0.2],
    bombA: [0.55, 0.23],
    bombB: [0.7, 0.31],
  },
};

/** Tolerance in radar percent space for demoinfocs icon round-trip checks. */
export const DEMOINFOCS_LANDMARK_TOLERANCE = 1.0;
