/**
 * cs2util.com slug for each must-learn lineup.
 * Auto-resolved from screenshot URLs where possible; manual overrides below.
 */
export const MUST_LEARN_CS2UTIL_SLUGS = {
  ancient: {
    red_room: "snipers-nest-smoke-from-t-spawn-d",
    a_ct_smoke: "ct-lane-smoke-from-t-spawn",
    b_cave_smoke: "1dea1570-a450-4ae0-9a9e-ee5c6fd22641",
    ct_elbow_smoke: "elbow-smoke-from-ct-spawn-a",
    a_main_pop_flash: "a-site-flash-from-a-main",
    // Hand-matched fuzzy slug variants.
    ct_a_main_molly: "ct-lane-molotov-from-long",
    // Description says "Corner of Connector (T Lower area)", which
    // matches cs2util's `b-site-molotov-from-t-lower`. The lineup's
    // screenshot URL incorrectly points to `b-cubby-molotov-from-ruins`
    // (which is a Ruins throw — completely different spot).
    b_pillar_molly: "b-site-molotov-from-t-lower",
  },
  dust2: {
    xbox_smoke: "xbox-smoke-from-nomal-t-spawn",
    long_cross_smoke: "a-site-cross-smoke-from-long-corner",
    a_ct_smoke: "ct-spawn-smoke-from-a-site-pit",
    b_window_smoke: "window-smoke-from-upper-tunnels2",
    ct_long_doors_smoke: "ct-long-cut-off-smoke",
    // URL-encoded "%26" → "&" → plain "fence-close" in staging.
    ct_b_tuns_molly: "fence-close-molotov-from-tunnel",
  },
  inferno: {
    banana_ct_smoke: "ct-boost-smoke-from-banana",
    a_pit_smoke: "pit-smoke-from-alt-mid",
    apps_flash: "a-site-flash-from-mid",
    ct_banana_smoke: "half-wall-smoke-from-ct",
    banana_coffins_smoke: "coffins-smoke-from-half-wall",
  },
  mirage: {
    window_smoke: "fast-window-smoke-from-t-spawn",
    b_apartments_smoke: "apartments-smoke-from-market",
    ct_a_ramp_smoke: "ramp-smoke-from-ct",
    ct_b_apartments_smoke: "apartments-smoke-from-ct-spawn",
    a_ramp_flash: "ramp-flash-from-t-spawn",
  },
  nuke: {
    outside_smoke: "heaven-smoke-from-t-spawn",
    ramp_smoke: "ramp-somke",
    a_main_pop_flash: "a-site-flash-from-hut",
    ct_outside_smoke: "outside-smoke-from-ct-red-box",
    ct_ramp_smoke: "decon-smoke-from-trophy-room",
    hut_smoke: "main-smoke-from-roof-1",
  },
  anubis: {
    mid_connector_smoke: "e-box-smoke-2-from-t-spawn",
    a_main_ct_smoke: "main-smoke-from-ct-spawn",
    b_site_molly: "back-site-molotov-from-palace",
    ct_mid_smoke: "top-mid-smoke-from-ct-spawn",
    a_main_pop_flash: "a-site-flash-from-boat",
    ct_a_main_smoke: "main-smoke-from-ct-spawn",
  },
  overpass: {
    bathrooms_b_heaven_smoke: "heaven-smoke-from-water",
    a_long_smoke: "bins-smoke-from-a-long",
    monster_smoke: "bridge-smoke-from-water",
    ct_monster_smoke: "monster-smoke-from-b-site",
    ct_connector_smoke: "ct-smoke-from-alley",
  },
  // Cache has limited cs2util coverage; only a few are sourceable.
  cache: {
    t_back_a_site_smoke: "back-a-site-smoke-from-A-long",
    ct_a_main_smoke_truck: "a-main-smoke-from-truck",
  },
};

export function extractCs2utilSlugFromLineup(lineup) {
  const urls = [lineup?.screenshots?.stand, lineup?.screenshots?.aim, lineup?.screenshots?.result].filter(
    Boolean
  );
  for (const url of urls) {
    if (!url.includes("cs2util.com")) continue;
    const filename = url.split("/").pop()?.replace(/\.(webp|webm|mp4)$/i, "") || "";
    const slug = filename
      .replace(/-lineup-mini$/i, "")
      .replace(/-lineup$/i, "")
      .replace(/-cover$/i, "")
      .toLowerCase();
    if (slug) return slug;
  }
  return null;
}

export function resolveMustLearnCs2utilSlug(mapId, lineupId, lineup) {
  const manual = MUST_LEARN_CS2UTIL_SLUGS[mapId]?.[lineupId];
  if (manual) return manual;
  return extractCs2utilSlugFromLineup(lineup);
}
