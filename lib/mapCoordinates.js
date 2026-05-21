/**
 * CS2 radar coordinate system — world coordinates to map percentages.
 *
 * Valve's radar overview files define three values per map:
 *   pos_x / pos_y  — world coords of the radar image's upper-left corner
 *   scale          — world units per pixel at 1024x1024 resolution
 *
 * The canonical formula (used by CS Demo Manager, Valthrun, boltobserve):
 *   percent_x = ((worldX - pos_x) / (scale * 1024)) * 100
 *   percent_y = ((worldY - pos_y) / -(scale * 1024)) * 100
 *
 * Y is negated because game Y points "up" but image Y goes "down".
 */

const RESOLUTION = 1024;

export const MAP_META = {
  dust2:    { pos_x: -2476, pos_y:  3239, scale: 4.4  },
  mirage:   { pos_x: -3230, pos_y:  1713, scale: 5.0  },
  inferno:  { pos_x: -2087, pos_y:  3870, scale: 4.9  },
  overpass: { pos_x: -4831, pos_y:  1781, scale: 5.2  },
  nuke:     { pos_x: -3453, pos_y:  2887, scale: 7.0  },
  anubis:   { pos_x: -2796, pos_y:  3328, scale: 5.22 },
  ancient:  { pos_x: -2953, pos_y:  2164, scale: 5.0  },
  cache:    { pos_x: -2000, pos_y:  3250, scale: 5.5  },
};

export function worldToMapPercent(worldX, worldY, mapMeta) {
  const totalUnits = mapMeta.scale * RESOLUTION;
  return {
    x: ((worldX - mapMeta.pos_x) / totalUnits) * 100,
    y: ((worldY - mapMeta.pos_y) / -totalUnits) * 100,
  };
}

export function mapPercentToWorld(percentX, percentY, mapMeta) {
  const totalUnits = mapMeta.scale * RESOLUTION;
  return {
    x: (percentX / 100) * totalUnits + mapMeta.pos_x,
    y: (percentY / 100) * -totalUnits + mapMeta.pos_y,
  };
}
