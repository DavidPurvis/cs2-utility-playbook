import type { RadarMeta } from "../lib/mapCoordinates";

/**
 * Dust 2 radar metadata from Valve's overview/de_dust2.txt.
 * These constants are sacred — they pair exactly with the canonical
 * 1024×1024 PSD radar image at the URL below.
 */
export const DUST2_META: RadarMeta = {
  map: "de_dust2",
  pos_x: -2476,
  pos_y: 3239,
  scale: 4.4,
  sourceResolution: 1024,
};

/**
 * Canonical Dust 2 radar PNG (MurkyYT/cs2-map-icons mirrors Valve's PSD radar).
 */
export const DUST2_RADAR_URL =
  "https://raw.githubusercontent.com/MurkyYT/cs2-map-icons/main/images/radars/de_dust2_radar_psd.png";

export const DUST2_DISPLAY_NAME = "Dust 2";
