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
    radarPos: { worldX: -392, worldY: -2224 },
    radarTarget: { x: 40, y: 25 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // mid_donut_smoke: throw stays in Mid approach; target shifted per
  // user feedback — Δy reduced to ~1/3 and Δx flipped to ~1/2 magnitude
  // so the smoke lands inside Donut rather than drifting toward A.

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
    // User correction: smoke landed slightly too long (overshot) and
    // too far left. Was target (33.1, 18.3). Pull in & right slightly.
    radarPos: { worldX: -735.964, worldY: -2135.969 },
    radarTarget: { x: 33.105, y: 18.262 },
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
    radarPos: { worldX: -328, worldY: -2288 },
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
    radarPos: { worldX: 1255.968, worldY: -1479.844 },
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
    radarPos: { worldX: -735.969, worldY: -2135.969 },
    radarTarget: { x: 85.742, y: 61.621 },
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
    radarPos: { worldX: -2167.645, worldY: -442.842 },
    radarTarget: { x: 18, y: 40 },
    austincs: { video: "", timestamp: "", note: "" },
  },


  // ─── T-SIDE MOLLIES ──────────────────────────────────────

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
    // Exact cs2util setpos for `b-site-molotov-from-t-lower` —
    // matches the lineup's "Corner of Connector (T Lower area)"
    // description. Replaces the earlier wrong slug match
    // (`b-cubby-molotov-from-ruins`) which was thrown from Ruins.
    radarPos: { worldX: 619.863, worldY: -859.972 },
    radarTarget: { x: 67, y: 31 },
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
    radarPos: { worldX: -192, worldY: 1696 },
    radarTarget: { x: 37.012, y: 57.129 },
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
    radarPos: { worldX: -192, worldY: 1696 },
    radarTarget: { x: 38, y: 36 },
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
  ];

// ═══════════════════════════════════════════════════════════════
//  UTILITY BELTS — one player carries the full execute
//  Teammates drop their smoke(s) pre-round so the carrier has everything.
// ═══════════════════════════════════════════════════════════════

export const UTILITY_BELTS = [
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
    pos: { worldX: -392, worldY: -2224 },
    lineups: ["red_room"],
    tip: "Closest spawn throws this every round. THE most important T-side smoke.",
  },
  
  {
    id: "lane_corner",
    name: "Lane Corner",
    side: "T",
    area: "B",
    pos: { worldX: -328, worldY: -2288 },
    lineups: ["b_cave_smoke", "b_short_smoke", "b_long_smoke"],
    tip: "All three B-site smokes come from this same corner. The B equivalent of A Main Corner.",
  },
  
  {
    id: "t_lower_connector",
    name: "T Lower / Connector",
    side: "T",
    area: "B",
    pos: { worldX: 1255.967, worldY: -1479.969 },
    lineups: ["b_pillar_molly"],
    tip: "Clears the most common B defensive position.",
  },
  
  {
    id: "ct_spawn_back",
    name: "CT Spawn Back",
    side: "CT",
    area: "Mid",
    pos: { worldX: -192, worldY: 1696 },
    lineups: ["ct_elbow_smoke"],
    tip: "Foundation CT mid control. Throw this every round on CT side.",
  },
  
  {
    id: "window_position",
    name: "Window Position",
    side: "CT",
    area: "Mid",
    pos: { worldX: -192, worldY: 1696 },
    lineups: ["ct_mid_incendiary"],
    tip: "Pair with Elbow smoke for full mid lockdown (~25 sec of denial).",
  },
  ];

// ═══════════════════════════════════════════════════════════════
//  SPAWNS — 5 per side. Used by the spawn selector on the
//  interactive map to highlight instant utility options.
// ═══════════════════════════════════════════════════════════════

export const SPAWNS = {
  T: [
    { id: 1, name: "Spawn 1 (Pillar)",  pos: { x: 32, y: 63 }, lineups: ["red_room"] },
    { id: 2, name: "Spawn 2 (Left)",    pos: { x: 29, y: 62 }, lineups: [] },
    { id: 3, name: "Spawn 3 (Right)",   pos: { x: 35, y: 64 }, lineups: [] },
    { id: 4, name: "Spawn 4 (Back)",    pos: { x: 34, y: 65 }, lineups: [] },
    { id: 5, name: "Spawn 5 (Mid)",     pos: { x: 33, y: 62 }, lineups: [] },
  ],
  CT: [
    { id: 1, name: "Spawn 1 (Back CT)", pos: { x: 42, y: 13 }, lineups: ["ct_elbow_smoke"] },
    { id: 2, name: "Spawn 2 (A Side)",  pos: { x: 38, y: 12 }, lineups: [] },
    { id: 3, name: "Spawn 3 (Mid)",     pos: { x: 44, y: 14 }, lineups: [] },
    { id: 4, name: "Spawn 4 (B Side)",  pos: { x: 46, y: 12 }, lineups: [] },
    { id: 5, name: "Spawn 5 (Close)",   pos: { x: 42, y: 16 }, lineups: [] },
  ],
};
