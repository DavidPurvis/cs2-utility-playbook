/**
 * Valve radar overview metadata.
 *
 * These values are keyed by this app's internal map ids (dust2, inferno, etc.)
 * and are used for world-coordinate projection into radar percentage space.
 */

export const VALVE_RADAR_SOURCE_RESOLUTION = 1024;

export const RADAR_METADATA = {
  dust2: {
    map: "de_dust2",
    pos_x: -2476,
    pos_y: 3239,
    scale: 4.4,
    sourceResolution: VALVE_RADAR_SOURCE_RESOLUTION,
  },
  mirage: {
    map: "de_mirage",
    pos_x: -3230,
    pos_y: 1713,
    scale: 5.0,
    sourceResolution: VALVE_RADAR_SOURCE_RESOLUTION,
  },
  inferno: {
    map: "de_inferno",
    pos_x: -2087,
    pos_y: 3870,
    scale: 4.9,
    sourceResolution: VALVE_RADAR_SOURCE_RESOLUTION,
  },
  overpass: {
    map: "de_overpass",
    pos_x: -4831,
    pos_y: 1781,
    scale: 5.2,
    sourceResolution: VALVE_RADAR_SOURCE_RESOLUTION,
  },
  nuke: {
    map: "de_nuke",
    pos_x: -3453,
    pos_y: 2887,
    scale: 7.0,
    sourceResolution: VALVE_RADAR_SOURCE_RESOLUTION,
  },
  anubis: {
    map: "de_anubis",
    pos_x: -2796,
    pos_y: 3328,
    scale: 5.22,
    sourceResolution: VALVE_RADAR_SOURCE_RESOLUTION,
  },
  ancient: {
    map: "de_ancient",
    pos_x: -2953,
    pos_y: 2164,
    scale: 5.0,
    sourceResolution: VALVE_RADAR_SOURCE_RESOLUTION,
  },
  cache: {
    map: "de_cache",
    pos_x: -2000,
    pos_y: 3250,
    scale: 5.5,
    sourceResolution: VALVE_RADAR_SOURCE_RESOLUTION,
  },
};

export function getRadarMetadata(mapId) {
  return RADAR_METADATA[mapId] || null;
}
