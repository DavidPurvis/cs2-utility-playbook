/*
  CS2 ANCIENT — DATA MODULE

  All lineup data, combos, utility belts, and scenarios for Ancient.
  Kept separate from the main JSX file so we can scale to more maps
  (Anubis, Cache, etc.) without bloating the component file.

  Lineup data is cross-referenced from BLAST.tv, Refrag.gg, CS2Pulse,
  Profilerr, and cs.money.

  ── AUSTINCS DATA ─────────────────────────────────────────────────
  Each lineup has an `austincs` field for sourcing from AustinCS YouTube.
  To fill it in:
    1. Find the relevant AustinCS video on YouTube.
    2. Set `video` to the full YouTube URL (e.g. "https://www.youtube.com/watch?v=XXXX").
    3. Set `timestamp` to the in-video time (e.g. "2:34").
    4. Optionally add a `note` about differences from the existing lineup.
    5. Take screenshots and place them in a /public/screenshots/ folder,
       then reference them in the lineup's `screenshots` object.
*/

import { ytSearch } from "./youtube.js";

export const MAP_NAME = "Ancient";

export const RADAR_URL =
  "https://raw.githubusercontent.com/MurkyYT/cs2-map-icons/main/images/radars/de_ancient_radar_psd.png";

const yt = (q) => ytSearch("ancient", q);

// ═══════════════════════════════════════════════════════════════
//  LINEUPS DATABASE
// ═══════════════════════════════════════════════════════════════

export const LINEUPS = {
  // ─── T-SIDE MID ──────────────────────────────────────────
  red_room: {
    id: "red_room",
    name: "Red Room / Top Mid Smoke",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "Mid",
    mustLearn: true,
    instant: true,
    purpose:
      "Blocks the CT AWP from Red Room / Sniper's Nest into Mid. THE most important T-side smoke on Ancient — throw it every single round.",
    stand: "Stand in the center of the pillar under the bridge in T Spawn.",
    aim: "Look up at the wall to your left. Aim at the dark spot on the stone wall above.",
    notes:
      "Whoever has the closest spawn throws this. Must land before CTs set up Mid AWP.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-utility-secrets-5-must-know-nades-for-ancient/",
    },
    video: yt("red room top mid smoke t spawn"),
    screenshots: {
      stand:  "https://refrag.gg/cdn-cgi/imagedelivery/5wML_ikJr-qv52ESeLE6CQ/wordpress.refrag.gg/2025/02/Ancient-Red-Smoke-Lineup-Spot.jpg/public",
      aim:    "https://refrag.gg/cdn-cgi/imagedelivery/5wML_ikJr-qv52ESeLE6CQ/wordpress.refrag.gg/2025/02/Ancient-Red-Smoke-Lineup-edited.jpg/public",
      result: "https://refrag.gg/cdn-cgi/imagedelivery/5wML_ikJr-qv52ESeLE6CQ/wordpress.refrag.gg/2025/02/Ancient-Red-Smoke.jpg/public",
    },
    radarPos:    { x: 32, y: 63 },
    radarTarget: { x: 40, y: 25 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  mid_donut_smoke: {
    id: "mid_donut_smoke",
    name: "Mid Donut Smoke",
    util: "SMOKE",
    throw: "LMB",
    side: "T",
    area: "Mid",
    instant: true,
    purpose:
      "Blocks CTs using Donut to contest your Mid push. Pairs with Red Room smoke to fully isolate Mid.",
    stand:
      "Stand at the second vertical crack along the bottom of the wall near the Mid approach (slightly into Mid from T side).",
    aim: "Position your crosshair on the wooden beam visible ahead.",
    notes: "Simple left-click throw — no jump needed.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-utility-secrets-5-must-know-nades-for-ancient/",
    },
    video: yt("mid donut smoke"),
    screenshots: {
      stand:  "https://refrag.gg/cdn-cgi/imagedelivery/5wML_ikJr-qv52ESeLE6CQ/wordpress.refrag.gg/2025/02/Ancient-Donut-Smoke-Lineup-Spot.jpg/public",
      aim:    "https://refrag.gg/cdn-cgi/imagedelivery/5wML_ikJr-qv52ESeLE6CQ/wordpress.refrag.gg/2025/02/Ancient-Donut-Smoke-Lineup-edited.jpg/public",
      result: "https://refrag.gg/cdn-cgi/imagedelivery/5wML_ikJr-qv52ESeLE6CQ/wordpress.refrag.gg/2025/02/Ancient-Donut-Smoke.jpg/public",
    },
    radarPos:    { x: 36, y: 55 },
    radarTarget: { x: 28, y: 38 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── T-SIDE A EXECUTE ────────────────────────────────────
  a_ct_smoke: {
    id: "a_ct_smoke",
    name: "A Site CT Smoke",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "A",
    mustLearn: true,
    purpose:
      "Blocks the deep CT angle / CT spawn connection to A site. Essential for any A execute.",
    stand:
      "Corner outside A Main, left side against the wall before A Main opens up to site.",
    aim: "Look up at the corner above the doorway of A Main.",
    notes:
      "Jump throw. Thrown from the SAME CORNER as Temple smoke — one player can throw both.",
    source: { name: "BLAST.tv", url: "https://blast.tv/article/cs2-ancient-smokes" },
    video: yt("a ct smoke a main corner"),
    screenshots: {
      stand:  "https://cdn.sanity.io/images/6znhzi10/production/a89b3ebc2c42ac9e312f523312ef698c04e15444-1920x1080.jpg",
      aim:    "https://cdn.sanity.io/images/6znhzi10/production/d01ea73a05cab774aa6e93f9d6775bded9151665-1920x1080.jpg",
      result: "https://assets.cs2util.com/ancient/smoke/a-site/ct-lane-smoke-from-t-spawn-cover.webp",
    },
    radarPos:    { x: 15, y: 50 },
    radarTarget: { x: 23, y: 31 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  a_temple_smoke: {
    id: "a_temple_smoke",
    name: "A Site Temple Smoke",
    util: "SMOKE",
    throw: "LMB",
    side: "T",
    area: "A",
    purpose: "Blocks the deadly Temple angle where CTs hold with AWPs.",
    stand: "SAME corner outside A Main as the CT smoke.",
    aim: "After throwing the CT smoke, look at the wall marking. Left-click — NO jump.",
    notes:
      "Left-click only (no jump). Consider skipping if you want Temple for post-plant.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-utility-secrets-5-must-know-nades-for-ancient/",
    },
    video: yt("a temple smoke a main corner"),
    screenshots: {
      stand:  "https://refrag.gg/cdn-cgi/imagedelivery/5wML_ikJr-qv52ESeLE6CQ/wordpress.refrag.gg/2025/02/Ancient-A-Temple-Lineup-Spot.jpg/public",
      aim:    "https://refrag.gg/cdn-cgi/imagedelivery/5wML_ikJr-qv52ESeLE6CQ/wordpress.refrag.gg/2025/02/Ancient-A-Temple-Lineup-edited.jpg/public",
      result: "https://refrag.gg/cdn-cgi/imagedelivery/5wML_ikJr-qv52ESeLE6CQ/wordpress.refrag.gg/2025/02/Ancient-A-Temple-Smoke.jpg/public",
    },
    radarPos:    { x: 15, y: 50 },
    radarTarget: { x: 13, y: 33 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  a_donut_smoke: {
    id: "a_donut_smoke",
    name: "A Site Donut Smoke",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "A",
    purpose:
      "Blocks the Donut position on A site. Protects you while planting the bomb.",
    stand: "SAME corner outside A Main as CT and Temple smokes.",
    aim: "Bottom-left of the leaves visible above. Jump throw.",
    notes:
      "Third smoke from the same corner. The belt-carrier pattern: one player throws all three (CT + Temple + Donut) with a teammate drop.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-utility-secrets-5-must-know-nades-for-ancient/",
    },
    video: yt("a donut smoke a main corner"),
    screenshots: {
      aim:    "https://refrag.gg/cdn-cgi/imagedelivery/5wML_ikJr-qv52ESeLE6CQ/wordpress.refrag.gg/2025/02/Ancient-A-Donut-Lineup-edited.jpg/public",
      result: "https://refrag.gg/cdn-cgi/imagedelivery/5wML_ikJr-qv52ESeLE6CQ/wordpress.refrag.gg/2025/02/Ancient-A-Donut-Smoke.jpg/public",
    },
    radarPos:    { x: 15, y: 50 },
    radarTarget: { x: 28, y: 38 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_from_donut: {
    id: "ct_from_donut",
    name: "CT Smoke from Mid Donut",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "A",
    purpose:
      "Allows safe push from Donut to A. Only relevant after taking Mid control.",
    stand: "Left corner of the Donut Door.",
    aim: "Place crosshair between the gap of the two ledges in front.",
    notes: "Jump throw. Use when splitting A through Mid.",
    source: { name: "CS2Pulse", url: "https://cs2pulse.com/smokes/ancient/" },
    video: yt("ct smoke from mid donut"),
    screenshots: {
      stand:  "https://cs2pulse.com/wp-content/uploads/2023/12/image13-9.jpg",
      aim:    "https://cs2pulse.com/wp-content/uploads/2023/12/image2-26.jpg",
      result: "https://assets.cs2util.com/ancient/smoke/mid/elbow-smoke-from-ct-spawn-a-cover.webp",
    },
    radarPos:    { x: 30, y: 44 },
    radarTarget: { x: 23, y: 31 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── T-SIDE B EXECUTE ────────────────────────────────────
  b_cave_smoke: {
    id: "b_cave_smoke",
    name: "B Cave Smoke",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "B",
    mustLearn: true,
    purpose:
      "Blocks the Cave player's vision without interfering with the bomb plant.",
    stand: "Corner before the doors to Lane (outside B Main entrance).",
    aim: "Turn away from the corner and aim at the specific spot. Jump throw.",
    notes:
      "All three B-site smokes (Cave, Short, Long) come from THIS SAME CORNER.",
    source: { name: "BLAST.tv", url: "https://blast.tv/article/cs2-ancient-smokes" },
    video: yt("b cave smoke lane corner"),
    screenshots: {
      stand:  "https://cs2pulse.com/wp-content/uploads/2024/12/B-Cave-From-Water.jpg",
      aim:    "https://cdn.sanity.io/images/6znhzi10/production/a4cac6a7ab7fa14b9b3e2a7bfad62487cc308429-1920x1080.jpg",
      result: "https://cs2pulse.com/wp-content/uploads/2024/12/B-Cave-From-Water-After.jpg",
    },
    radarPos:    { x: 58, y: 50 },
    radarTarget: { x: 62, y: 33 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  b_short_smoke: {
    id: "b_short_smoke",
    name: "B Short Smoke",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "B",
    purpose:
      "Blocks B Short sight line. Isolates defenders holding from this angle.",
    stand: "SAME corner as Cave smoke (before Lane doors).",
    aim: "Adjust crosshair toward B Short area. Jump throw.",
    notes: "Same spot as Cave smoke.",
    source: { name: "BLAST.tv / cs2util", url: "https://www.cs2util.com/ancient/smoke/b-short-smoke-from-ruins" },
    video: yt("b short smoke lane corner"),
    screenshots: {
      stand:  "https://assets.cs2util.com/ugc/positions/48499a0f-9cfd-4081-a810-5d11f05a35ae/ancient/3df51792-0e30-411f-a52c-9afd41cb70b7.webp",
      aim:    "https://assets.cs2util.com/ancient/smoke/B%20site/b-short-smoke-from-ruins-lineup.webp",
      result: "https://assets.cs2util.com/ancient/smoke/B%20site/b-short-smoke-from-ruins-cover.webp",
    },
    radarPos:    { x: 58, y: 50 },
    radarTarget: { x: 64, y: 29 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  b_long_smoke: {
    id: "b_long_smoke",
    name: "B Long Smoke",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "B",
    purpose:
      "Deep smoke for B Long. Optional — consider keeping Long open for post-plant.",
    stand: "SAME corner as Cave and B Short smokes.",
    aim: "Aim toward B Long. Jump throw.",
    notes:
      "Skip on default rounds to keep Long as a post-plant position. Throw on rushes/ecos to guarantee a plant.",
    source: { name: "cs2util", url: "https://www.cs2util.com/ancient/smoke/b-long-smoke-from-t-spawn" },
    video: yt("b long smoke lane corner"),
    screenshots: {
      stand:  "https://assets.cs2util.com/ugc/positions/48499a0f-9cfd-4081-a810-5d11f05a35ae/ancient/730c77bc-5daa-4837-9f03-4b018acc9186.webp",
      aim:    "https://assets.cs2util.com/ancient/smoke/b-site/b-long-smoke-from-t-spawn-lineup.webp",
      result: "https://assets.cs2util.com/ancient/smoke/b-site/b-long-smoke-from-t-spawn-cover.webp",
    },
    radarPos:    { x: 58, y: 50 },
    radarTarget: { x: 71, y: 34 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  b_lurk_smoke: {
    id: "b_lurk_smoke",
    name: "B Lurk Smoke (from T Spawn)",
    util: "SMOKE",
    throw: "WJT",
    side: "T",
    area: "B",
    instant: true,
    purpose:
      "Cuts off CT info on B site. Throw every round so CTs don't know if 0 or 5 are behind it.",
    stand: "Find the thin vertical crack in the stone on the pillar at T Spawn.",
    aim: "Look at the middle of the specific brick (look for the dark mark).",
    notes:
      "W + Jump throw. Only useful if your team actually lurks B sometimes — otherwise it's wasted util.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-utility-secrets-5-must-know-nades-for-ancient/",
    },
    video: yt("b lurk smoke t spawn pillar"),
    screenshots: {
      stand:  "https://refrag.gg/cdn-cgi/imagedelivery/5wML_ikJr-qv52ESeLE6CQ/wordpress.refrag.gg/2025/02/Ancient-B-Lurk-Smoke-Lineup-Spot.jpg/public",
      aim:    "https://refrag.gg/cdn-cgi/imagedelivery/5wML_ikJr-qv52ESeLE6CQ/wordpress.refrag.gg/2025/02/Ancient-B-Lurk-Smoke-Lineup-edited.jpg/public",
      result: "https://refrag.gg/cdn-cgi/imagedelivery/5wML_ikJr-qv52ESeLE6CQ/wordpress.refrag.gg/2025/02/Ancient-B-Lurk-Smoke.jpg/public",
    },
    radarPos:    { x: 32, y: 63 },
    // Lands B Lane choke (CT vision cut) — near cave, slightly deeper into lane than cave smoke
    radarTarget: { x: 56, y: 48 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── T-SIDE FLASHES ──────────────────────────────────────
  a_main_pop_flash: {
    id: "a_main_pop_flash",
    name: "A Main Pop Flash",
    util: "FLASH",
    throw: "RMB",
    side: "T",
    area: "A",
    mustLearn: true,
    purpose: "Blinds CTs holding A site as your team pushes out of A Main.",
    stand:
      "Inside A Main corridor, right wall, a few steps before the exit to site.",
    aim: "Face the exit and aim at the top of the archway. Flash bounces off the ceiling.",
    notes:
      "Right-click underhand throw. As soon as the flash leaves your hand, push out. Don't wait — the flash pops almost instantly.",
    source: { name: "cs2util", url: "https://www.cs2util.com/ancient/flash/a-site-flash-from-a-main" },
    video: yt("a main pop flash"),
    screenshots: {
      aim:    "https://assets.cs2util.com/ancient/flash/a-site/a-site-flash-from-a-main-lineup.webp",
      result: "https://assets.cs2util.com/ancient/flash/a-site/a-site-flash-from-a-main-cover.webp",
    },
    radarPos:    { x: 13, y: 46 },
    radarTarget: { x: 18, y: 40 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  b_main_pop_flash: {
    id: "b_main_pop_flash",
    name: "B Main Pop Flash",
    util: "FLASH",
    throw: "RMB",
    side: "T",
    area: "B",
    purpose: "Blinds CTs holding B site as your team pushes out of B Main.",
    stand: "Inside B Main corridor, left wall, behind the entry player.",
    aim: "Face B Main exit and aim at the archway ceiling.",
    notes: "Right-click underhand throw. As soon as the flash leaves your hand, push out.",
    source: { name: "cs2util", url: "https://www.cs2util.com/ancient/flash/b-site-flash-from-ruins" },
    video: yt("b main pop flash"),
    screenshots: {
      aim:    "https://assets.cs2util.com/ancient/flash/b-site/b-site-flash-from-ruins-lineup.webp",
      result: "https://assets.cs2util.com/ancient/flash/b-site/b-site-flash-from-ruins-cover.webp",
    },
    radarPos:    { x: 60, y: 46 },
    radarTarget: { x: 67, y: 31 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── T-SIDE MOLLIES ──────────────────────────────────────
  ninja_molly: {
    id: "ninja_molly",
    name: "A Site Ninja Molotov",
    util: "MOLLY",
    throw: "RUN",
    side: "T",
    area: "A",
    purpose:
      "Burns out the Ninja position on A site. Forces close-corner CTs to reposition.",
    stand: "Approaching A Main entrance while moving.",
    aim: "Arc the molotov toward the Ninja corner of A site.",
    notes:
      "Throw while moving from A Main. Prior screenshots pointed at B-site assets — verify in-game before relying on images; use video until A-site ninja media is captured.",
    source: { name: "Refrag", url: "https://refrag.gg/blog/cs2-utility-secrets-5-must-know-nades-for-ancient/" },
    video: yt("a ninja molly ancient"),
    screenshots: {
      stand: "",
      aim: "",
      result: "",
    },
    radarPos:    { x: 15, y: 50 },
    radarTarget: { x: 16, y: 37 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  b_pillar_molly: {
    id: "b_pillar_molly",
    name: "B Site Pillar Molotov",
    util: "MOLLY",
    throw: "JT",
    side: "T",
    area: "B",
    purpose:
      "Burns out CTs hiding behind or near the Pillar on B site.",
    stand: "Corner of Connector (T Lower area).",
    aim: "Aim at the stone tile below T Lower — bottom of the black line on the wooden board.",
    notes:
      "Left-click jump throw. Clears the most common B defensive spot.",
    source: { name: "cs2util", url: "https://www.cs2util.com/ancient/molotov/b-cubby-molotov-from-ruins" },
    video: yt("b pillar molly t lower"),
    screenshots: {
      aim:    "https://assets.cs2util.com/ancient/molotov/b-site/b-cubby-molotov-from-ruins-lineup.webp",
      result: "https://assets.cs2util.com/ancient/molotov/b-site/b-cubby-molotov-from-ruins-cover.webp",
    },
    radarPos:    { x: 56, y: 48 },
    radarTarget: { x: 67, y: 31 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── T-SIDE HE ───────────────────────────────────────────
  a_site_he: {
    id: "a_site_he",
    name: "A Site Default Box HE",
    util: "HE",
    throw: "LMB",
    side: "T",
    area: "A",
    purpose:
      "Deals 50-80 damage to CTs playing behind default box. Softens defenders before swinging.",
    stand: "A Main entrance, middle of the corridor.",
    aim: "Arc the HE over your teammates toward the default plant box on A site.",
    notes: "Even 40 damage wins a duel.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-utility-secrets-5-must-know-nades-for-ancient/",
    },
    video: yt("a site default box he"),
    screenshots: {
      stand: "https://cs2pulse.com/wp-content/uploads/2024/07/image4-16.png",
      aim:   "https://cs2pulse.com/wp-content/uploads/2024/07/image11-16.png",
    },
    radarPos:    { x: 15, y: 50 },
    radarTarget: { x: 18, y: 40 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  b_ramp_he: {
    id: "b_ramp_he",
    name: "B Ramp HE from B Main",
    util: "HE",
    throw: "LMB",
    side: "T",
    area: "B",
    purpose: "Damages CTs playing ramp position on B site.",
    stand: "B Main corridor, middle of the pack.",
    aim: "Arc HE toward the ramp area of B site — high over the B Main exit.",
    notes: "Throw as your team pushes. Info-checks the ramp angle.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-utility-secrets-5-must-know-nades-for-ancient/",
    },
    video: yt("b ramp he b main"),
    screenshots: {
      stand: "https://cs2pulse.com/wp-content/uploads/2024/07/image5-16.png",
      aim:   "https://cs2pulse.com/wp-content/uploads/2024/07/image7-17.png",
    },
    radarPos:    { x: 60, y: 46 },
    radarTarget: { x: 69, y: 38 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── CT SIDE ─────────────────────────────────────────────
  ct_elbow_smoke: {
    id: "ct_elbow_smoke",
    name: "Elbow Smoke from CT Spawn",
    util: "SMOKE",
    throw: "WJT",
    side: "CT",
    area: "Mid",
    mustLearn: true,
    instant: true,
    purpose:
      "Blocks Ts pushing through Elbow into Mid. Foundation CT mid control.",
    stand: "Back left corner of the CT Spawn area.",
    aim: "Center of the two bricks on top of the building.",
    notes:
      "W + Jump throw. Pair with an incendiary on the Elbow choke for full Mid lockdown.",
    source: {
      name: "Profilerr",
      url: "https://profilerr.net/essential-cs2-smoke-spots-on-ancient-map-for-counter-terrorists-and-terrorists/",
    },
    video: yt("ct elbow smoke ct spawn"),
    screenshots: {
      stand: "https://cs2pulse.com/wp-content/uploads/2023/12/image5-25.png",
      aim:   "https://cs2pulse.com/wp-content/uploads/2023/12/image6-23.jpg",
    },
    radarPos:    { x: 42, y: 13 },
    radarTarget: { x: 36, y: 27 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_mid_incendiary: {
    id: "ct_mid_incendiary",
    name: "Mid Elbow Incendiary",
    util: "MOLLY",
    throw: "LMB",
    side: "CT",
    area: "Mid",
    purpose:
      "Burns the Elbow choke point. Pair with Elbow smoke to lock down Mid.",
    stand: "Window position, looking down at mid.",
    aim: "Arc onto the T-side mid entrance at the Elbow choke point.",
    notes:
      "Pre-throw it on default rounds. Don't try to time it perfectly against pushes.",
    source: { name: "cs2util", url: "https://www.cs2util.com/ancient/molotov/elbow-molotov-from-snipers-nest" },
    video: yt("ct elbow incendiary mid"),
    screenshots: {
      aim:    "https://assets.cs2util.com/ancient/molotov/mid/elbow-molotov-from-snipers-nest-lineup.webp",
      result: "https://assets.cs2util.com/ancient/molotov/mid/elbow-molotov-from-snipers-nest-cover.webp",
    },
    radarPos:    { x: 38, y: 31 },
    radarTarget: { x: 38, y: 36 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_a_main_molly: {
    id: "ct_a_main_molly",
    name: "A Main Molotov (Anti-Rush)",
    util: "MOLLY",
    throw: "LMB",
    side: "CT",
    area: "A",
    purpose:
      "Molly into A Main behind your smoke. Buys ~25 seconds for rotations.",
    stand: "A site, behind default box or pillar.",
    aim: "Molly behind your A Main smoke — arc it through.",
    notes:
      "Smoke + Molly combo. Anyone pushing through your smoke takes fire damage.",
    source: { name: "cs2util", url: "https://www.cs2util.com/ancient/molotov/ct-lane-molotov-from-a-long" },
    video: yt("ct a main molly anti rush"),
    screenshots: {
      aim:    "https://assets.cs2util.com/ancient/molotov/a-site/ct-lane-molotov-from-a-long-lineup.webp",
      result: "https://assets.cs2util.com/ancient/molotov/a-site/ct-lane-molotov-from-a-long-cover.webp",
    },
    radarPos:    { x: 18, y: 40 },
    radarTarget: { x: 15, y: 50 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_b_main_molly: {
    id: "ct_b_main_molly",
    name: "B Main Molotov (Anti-Rush)",
    util: "MOLLY",
    throw: "LMB",
    side: "CT",
    area: "B",
    purpose:
      "Molly into B Main behind your smoke. As a solo B anchor, your lifeline.",
    stand: "B site, behind the pillar or on ramp.",
    aim: "Molly into B Main behind your smoke.",
    notes:
      "Smoke + Molly buys ~25 seconds. Almost half the round.",
    source: { name: "cs2util", url: "https://www.cs2util.com/ancient/molotov/b-cubby-molotov-from-house" },
    video: yt("ct b main molly anti rush"),
    screenshots: {
      aim:    "https://assets.cs2util.com/ancient/molotov/b-site/b-cubby-molotov-from-house-lineup.webp",
      result: "https://assets.cs2util.com/ancient/molotov/b-site/b-cubby-molotov-from-house-cover.webp",
    },
    radarPos:    { x: 67, y: 31 },
    radarTarget: { x: 60, y: 46 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_a_retake_flash: {
    id: "ct_a_retake_flash",
    name: "A Retake Flash from CT",
    util: "FLASH",
    throw: "LMB",
    side: "CT",
    area: "A",
    purpose:
      "Flash over A site walls from CT. Catches Ts off guard in post-plant — they expect attacks from A Main, not CT.",
    stand: "CT spawn, approaching A site.",
    aim: "Full throw flash high over the A site walls.",
    notes:
      "Call 'flashing A' first. Throw flash, count 1, push together. Screenshots pending — do not use placeholder B-site flash images for positioning.",
    source: { name: "Refrag", url: "https://refrag.gg/blog/cs2-utility-secrets-5-must-know-nades-for-ancient/" },
    video: yt("ct a retake flash"),
    screenshots: {
      stand: "",
      aim: "",
      result: "",
    },
    radarPos:    { x: 30, y: 20 },
    radarTarget: { x: 18, y: 40 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_b_retake_flash: {
    id: "ct_b_retake_flash",
    name: "B Retake Flash from Cave",
    util: "FLASH",
    throw: "LMB",
    side: "CT",
    area: "B",
    purpose:
      "Flash over cave walls into B site. Blinds Ts in post-plant positions.",
    stand: "Rotating from mid/cave toward B site.",
    aim: "Full throw flash over the cave walls into B site.",
    notes:
      "Call 'flashing B' first. Push together on count. Screenshots pending — verify stand/aim in Practice mode with video until retake media is captured.",
    source: { name: "Refrag", url: "https://refrag.gg/blog/cs2-utility-secrets-5-must-know-nades-for-ancient/" },
    video: yt("ct b retake flash cave"),
    screenshots: {
      stand: "",
      aim: "",
      result: "",
    },
    radarPos:    { x: 62, y: 33 },
    radarTarget: { x: 67, y: 31 },
    austincs: { video: "", timestamp: "", note: "" },
  },
};

// ═══════════════════════════════════════════════════════════════
//  MUST-LEARN 5 — if you only learn 5, learn these
// ═══════════════════════════════════════════════════════════════

export const MUST_LEARN = [
  "red_room",
  "a_ct_smoke",
  "b_cave_smoke",
  "ct_elbow_smoke",
  "a_main_pop_flash",
];

// ═══════════════════════════════════════════════════════════════
//  COMBOS — 2-3 player named bundles
// ═══════════════════════════════════════════════════════════════

export const COMBOS = [
  {
    id: "mid_lockdown",
    name: "Mid Lockdown",
    site: "Mid",
    side: "T",
    desc: "Two smokes from T spawn that fully isolate mid. Bread and butter — throw most rounds.",
    roundTypes: ["FULL", "FORCE"],
    callout: '"Mid lockdown. Red Room and Donut. Push mid."',
    lineups: [
      { lineup: "red_room",        who: "Closest to T spawn pillar" },
      { lineup: "mid_donut_smoke", who: "Anyone with a smoke, push toward mid" },
    ],
    tip: "Push mid as a DUO after both smokes bloom. Don't peek elbow without a flash up.",
  },
  {
    id: "a_bash",
    name: "A Bash",
    site: "A",
    side: "T",
    desc: "Two smokes from the same A Main corner + a pop flash. Two players, one corner.",
    roundTypes: ["FULL", "FORCE"],
    callout: '"A Bash. CT smoke, Temple smoke, flash and go."',
    lineups: [
      { lineup: "a_ct_smoke",       who: "Closest to A Main corner" },
      { lineup: "a_temple_smoke",   who: "Same corner — pick up dropped smoke if needed" },
      { lineup: "a_main_pop_flash", who: "Anyone with flash, behind the corner" },
    ],
    tip: "Smokes first, then flasher throws. Push as soon as the flash leaves their hand. Entry trades on contact — don't ego-peek.",
  },
  {
    id: "b_bash",
    name: "B Bash",
    site: "B",
    side: "T",
    desc: "Smoke + molly + flash. Cleanest B execute for amateur teams.",
    roundTypes: ["FULL", "FORCE"],
    callout: '"B Bash. Pillar molly, Cave smoke, flash and go."',
    lineups: [
      { lineup: "b_pillar_molly",   who: "From T Lower / Connector" },
      { lineup: "b_cave_smoke",     who: "Closest to Lane corner" },
      { lineup: "b_main_pop_flash", who: "Anyone with flash, in B Main" },
    ],
    tip: "Molly first to flush pillar, then Cave smoke, then flash and push together.",
  },
  {
    id: "mid_stack_ct",
    name: "Mid Stack",
    site: "Mid",
    side: "CT",
    desc: "Elbow smoke + incendiary from CT spawn. Locks down mid for ~25 seconds.",
    roundTypes: ["FULL"],
    callout: '"Mid stack. Elbow smoke, molly the choke. Hold Window."',
    lineups: [
      { lineup: "ct_elbow_smoke",    who: "AWP or closest to CT spawn back" },
      { lineup: "ct_mid_incendiary", who: "Window / Elbow player, AFTER smoke is up" },
    ],
    tip: "Don't peek mid until your molly is burning. Let the util do the work.",
  },
  {
    id: "retake_a",
    name: "A Site Retake",
    site: "A",
    side: "CT",
    desc: "Flash from CT spawn + push together. Catch Ts in post-plant.",
    roundTypes: ["FULL", "FORCE"],
    callout: '"A Retake. Flashing from CT. Push on count 3."',
    lineups: [
      { lineup: "ct_a_retake_flash", who: "Rotator from CT spawn" },
    ],
    tip: "Push TOGETHER. Lone peeks lose retakes 80% of the time at our rank. If you have an HE, throw at the bomb default before peeking.",
  },
  {
    id: "retake_b",
    name: "B Site Retake",
    site: "B",
    side: "CT",
    desc: "Flash from Cave/Connector + push together. Catch Ts in post-plant.",
    roundTypes: ["FULL", "FORCE"],
    callout: '"B Retake. Flashing from cave. Push together."',
    lineups: [
      { lineup: "ct_b_retake_flash", who: "Rotator from mid/cave" },
    ],
    tip: "Push TOGETHER. Listen for util pops before peeking — Ts will throw smokes/flashes when you peek.",
  },
];

// ═══════════════════════════════════════════════════════════════
//  UTILITY BELTS — one player carries the full execute
//  Teammates drop their smoke(s) pre-round so the carrier has everything.
// ═══════════════════════════════════════════════════════════════

export const UTILITY_BELTS = [
  {
    id: "a_belt",
    name: "A Site Utility Belt",
    site: "A",
    side: "T",
    desc: "One player carries the full A execute: 2 smokes + 1 molly + 1 flash (exactly 4 grenades, the CS2 max). No teammate drops needed.",
    roundTypes: ["FULL"],
    callout: '"[Name]\'s A belt. We push on their flash."',
    preRound:
      "Belt carrier buys 2 smokes + 1 molly + 1 flash. That's exactly 4 grenades — the CS2 carry cap. No teammate drops required.",
    sequence: [
      { lineup: "a_ct_smoke",       step: 1, note: "From A Main corner. Jump throw." },
      { lineup: "a_temple_smoke",   step: 2, note: "SAME corner. Left click (no jump)." },
      { lineup: "ninja_molly",      step: 3, note: "Run-throw toward ninja while approaching site." },
      { lineup: "a_main_pop_flash", step: 4, note: "Flash. Team pushes on this." },
    ],
    teamRole:
      "Everyone else stages behind the belt carrier. Push on their flash. Watch back from CT side after plant.",
  },
  {
    id: "b_belt",
    name: "B Site Utility Belt",
    site: "B",
    side: "T",
    desc: "One player carries the B execute: 2 smokes + 1 molly + 1 flash (exactly 4 grenades, the CS2 carry cap). A second player throws the Long smoke from B Main so the carrier never has to hold five.",
    roundTypes: ["FULL"],
    callout: '"[Name]\'s B belt. One teammate drops a smoke. Long-smoker, throw on my flash."',
    preRound:
      "Carrier buys 1 molly + 1 flash + 1 smoke. A teammate drops a second smoke at T spawn — carrier picks it up. That's 4 grenades, the CS2 carry cap. A separate player (the Long-smoker) buys their own smoke and throws it from B Main on the flash pop.",
    sequence: [
      { lineup: "b_pillar_molly",   step: 1, carrier: "carrier",      note: "Carrier. From T Lower. Forces pillar player out." },
      { lineup: "b_cave_smoke",     step: 2, carrier: "carrier",      note: "Carrier. From Lane corner. Jump throw." },
      { lineup: "b_short_smoke",    step: 3, carrier: "carrier",      note: "Carrier. SAME corner. Jump throw." },
      { lineup: "b_main_pop_flash", step: 4, carrier: "carrier",      note: "Carrier. Flash. Team pushes on this." },
      { lineup: "b_long_smoke",     step: 5, carrier: "long_smoker",  note: "SECOND PLAYER (not the carrier). Throw from B Main on the flash pop. Keeps the carrier under the 4-grenade cap." },
    ],
    teamRole:
      "Everyone else stages in B Main. Designated Long-smoker throws on the carrier's flash. Post-plant on Cave / Stairs / Long.",
  },
];

// ═══════════════════════════════════════════════════════════════
//  SCENARIOS — basic-knowledge reminders (no lineups)
// ═══════════════════════════════════════════════════════════════

export const SCENARIOS = [
  {
    id: "watch_flank",
    title: "Everyone is pushing site — who watches flank?",
    side: "T",
    bullets: [
      "Designate ONE player to glance back as you commit. Most amateur deaths come from a single flanker.",
      "If you're entry, don't ego-peek deep angles before teammates land their util. Wait for smokes to bloom.",
      "Entry swings first, everyone else TRADES. Trades win rounds more than first kills.",
    ],
  },
  {
    id: "post_plant",
    title: "Bomb is planted — what now?",
    side: "T",
    bullets: [
      "Spread out. Two players in one corner is one HE waiting to happen.",
      "Hold the OBVIOUS post-plant angles. At our rank, CTs don't run creative flanks — they come through the main entry.",
      "Don't ALL save util. One player keeps a molly for the bomb. The rest use util on entry.",
    ],
  },
  {
    id: "mid_contested",
    title: "Mid is contested hard",
    side: "T",
    bullets: [
      "Don't force it. Abandon mid and hit a site directly.",
      "Throw a smoke at the choke and rotate quietly. CTs will keep holding mid expecting your push.",
      "Counter the stack next round — hit the other site fast.",
    ],
  },
  {
    id: "last_alive_bomb",
    title: "Last alive with bomb planted",
    side: "T",
    bullets: [
      "DO NOT peek. Hold an angle. They have to come to you.",
      "Listen for util pops and footsteps. Reposition silently between sounds.",
      "Don't shoot until you have a clear shot. Sound > vision when you're alone.",
    ],
  },
  {
    id: "eco_round_t",
    title: "Eco round (T side)",
    side: "T",
    bullets: [
      "Don't buy util. Buy armor ($650 kevlar) and a pistol upgrade.",
      "Stack one site with all 5. Aim to trade for a rifle pickup.",
      "Don't split or default on ecos — get one pick and bail.",
    ],
  },
  {
    id: "force_round_t",
    title: "Force buy (T side)",
    side: "T",
    bullets: [
      "Cheap SMG (MAC-10) or upgraded pistol + armor + 1 flash.",
      "Rush a site close-range. SMGs reward close engagements.",
      "If you have AWP money, give it to the best aimer. Don't force 5 rifles.",
    ],
  },
  {
    id: "pistol_round",
    title: "Pistol round basics",
    side: "T",
    bullets: [
      "Buy kevlar ($650). You have $150 left — not enough for a grenade. Skip utility. Or skip kevlar and buy a P250 ($300) + a flash ($200) if you trust your aim.",
      "Stack one site. Don't split the pistol round.",
      "Win pistol = full buy round 2. Lose pistol = eco round 2 to set up round 3 force.",
    ],
  },
  {
    id: "solo_anchor",
    title: "Solo anchoring a site (CT)",
    side: "CT",
    bullets: [
      "Smoke + molly your entry choke. Buys ~25 seconds for rotates.",
      "Hold an OFF angle. Don't sit on the default they expect.",
      "Call early and often. Numbers matter — say 'two B' the moment you hear it.",
    ],
  },
  {
    id: "ct_eco",
    title: "Eco round (CT side)",
    side: "CT",
    bullets: [
      "Stack one site with all 5 and full util. Force Ts into the other site or expensive util fight.",
      "SMG ecos (MP9) work on CT because of armor. Save your AWP.",
      "Don't try to play default on a CT eco. You can't trade — just stack and pray.",
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
//  SETUP POSITIONS — physical spots on the map grouped by where
//  the player stands. Used by the Interactive Map view.
// ═══════════════════════════════════════════════════════════════

export const SETUP_POSITIONS = [
  // ─── T-SIDE ────────────────────────────────────────────────
  {
    id: "t_spawn_pillar",
    name: "T Spawn Pillar",
    side: "T",
    area: "Mid",
    pos: { x: 32, y: 63 },
    lineups: ["red_room"],
    tip: "Closest spawn throws this every round. THE most important T-side smoke.",
  },
  {
    id: "t_spawn_b_lurk",
    name: "T Spawn (B Lurk)",
    side: "T",
    area: "B",
    pos: { x: 32, y: 63 },
    lineups: ["b_lurk_smoke"],
    tip: "Only useful if your team actually lurks B sometimes — otherwise wasted util.",
  },
  {
    id: "mid_approach",
    name: "Mid Approach",
    side: "T",
    area: "Mid",
    pos: { x: 36, y: 55 },
    lineups: ["mid_donut_smoke"],
    tip: "Pairs with Red Room smoke. Throw both for full Mid isolation.",
  },
  {
    id: "a_main_corner",
    name: "A Main Corner",
    side: "T",
    area: "A",
    pos: { x: 15, y: 50 },
    lineups: ["a_ct_smoke", "a_temple_smoke", "a_donut_smoke", "ninja_molly"],
    tip: "The single most important T-side spot. All A smokes and the molly come from this one corner.",
  },
  {
    id: "a_main_corridor",
    name: "A Main Corridor",
    side: "T",
    area: "A",
    pos: { x: 13, y: 46 },
    lineups: ["a_main_pop_flash", "a_site_he"],
    tip: "Flash and HE from inside A Main. Throw these as you push out.",
  },
  {
    id: "mid_donut_door",
    name: "Mid Donut Door",
    side: "T",
    area: "A",
    pos: { x: 30, y: 44 },
    lineups: ["ct_from_donut"],
    tip: "Only relevant after taking mid control. Enables A split through mid.",
  },
  {
    id: "lane_corner",
    name: "Lane Corner",
    side: "T",
    area: "B",
    pos: { x: 58, y: 50 },
    lineups: ["b_cave_smoke", "b_short_smoke", "b_long_smoke"],
    tip: "All three B-site smokes come from this same corner. The B equivalent of A Main Corner.",
  },
  {
    id: "b_main_corridor",
    name: "B Main Corridor",
    side: "T",
    area: "B",
    pos: { x: 60, y: 46 },
    lineups: ["b_main_pop_flash", "b_ramp_he"],
    tip: "Flash and HE from inside B Main. Throw as your team pushes.",
  },
  {
    id: "t_lower_connector",
    name: "T Lower / Connector",
    side: "T",
    area: "B",
    pos: { x: 56, y: 48 },
    lineups: ["b_pillar_molly"],
    tip: "Clears the most common B defensive position.",
  },
  // ─── CT-SIDE ───────────────────────────────────────────────
  {
    id: "ct_spawn_back",
    name: "CT Spawn Back",
    side: "CT",
    area: "Mid",
    pos: { x: 42, y: 13 },
    lineups: ["ct_elbow_smoke"],
    tip: "Foundation CT mid control. Throw this every round on CT side.",
  },
  {
    id: "ct_spawn_near_a",
    name: "CT Spawn (Near A)",
    side: "CT",
    area: "A",
    pos: { x: 30, y: 20 },
    lineups: ["ct_a_retake_flash"],
    tip: "Flash over A site walls from CT — catches Ts off guard in post-plant.",
  },
  {
    id: "window_position",
    name: "Window Position",
    side: "CT",
    area: "Mid",
    pos: { x: 38, y: 31 },
    lineups: ["ct_mid_incendiary"],
    tip: "Pair with Elbow smoke for full mid lockdown (~25 sec of denial).",
  },
  {
    id: "a_site_ct",
    name: "A Site (Defender)",
    side: "CT",
    area: "A",
    pos: { x: 18, y: 40 },
    lineups: ["ct_a_main_molly"],
    tip: "Smoke + molly buys ~25 seconds. Your lifeline as a solo anchor.",
  },
  {
    id: "b_site_ct",
    name: "B Site (Defender)",
    side: "CT",
    area: "B",
    pos: { x: 67, y: 31 },
    lineups: ["ct_b_main_molly"],
    tip: "Smoke + molly buys ~25 seconds. Almost half the round.",
  },
  {
    id: "cave_rotation",
    name: "Cave / Mid Rotation",
    side: "CT",
    area: "B",
    pos: { x: 62, y: 33 },
    lineups: ["ct_b_retake_flash"],
    tip: "Flash into B site from cave. Push together — lone peeks lose retakes.",
  },
];

// ═══════════════════════════════════════════════════════════════
//  SPAWNS — 5 per side. Used by the spawn selector on the
//  interactive map to highlight instant utility options.
// ═══════════════════════════════════════════════════════════════

export const SPAWNS = {
  T: [
    { id: 1, name: "Spawn 1 (Pillar)",  pos: { x: 32, y: 63 }, lineups: ["red_room"] },
    { id: 2, name: "Spawn 2 (Left)",    pos: { x: 29, y: 62 }, lineups: ["b_lurk_smoke"] },
    { id: 3, name: "Spawn 3 (Right)",   pos: { x: 35, y: 64 }, lineups: [] },
    { id: 4, name: "Spawn 4 (Back)",    pos: { x: 34, y: 65 }, lineups: [] },
    { id: 5, name: "Spawn 5 (Mid)",     pos: { x: 33, y: 62 }, lineups: ["mid_donut_smoke"] },
  ],
  CT: [
    { id: 1, name: "Spawn 1 (Back CT)", pos: { x: 42, y: 13 }, lineups: ["ct_elbow_smoke"] },
    { id: 2, name: "Spawn 2 (A Side)",  pos: { x: 38, y: 12 }, lineups: [] },
    { id: 3, name: "Spawn 3 (Mid)",     pos: { x: 44, y: 14 }, lineups: [] },
    { id: 4, name: "Spawn 4 (B Side)",  pos: { x: 46, y: 12 }, lineups: [] },
    { id: 5, name: "Spawn 5 (Close)",   pos: { x: 42, y: 16 }, lineups: [] },
  ],
};
