/*
  CS2 DUST II — DATA MODULE

  All lineup data, combos, utility belts, and scenarios for Dust II.
  Kept separate from the main JSX file so we can scale to more maps.

  Lineup data is cross-referenced from NadeKing, BLAST.tv, Refrag.gg,
  and tournament demos.

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

export const MAP_NAME = "Dust II";

export const RADAR_URL =
  "https://raw.githubusercontent.com/MurkyYT/cs2-map-icons/main/images/radars/de_dust2_radar_psd.png";

import { ytSearch } from "./youtube.js";

const yt = (q) => ytSearch("dust2", q);

// ═══════════════════════════════════════════════════════════════
//  LINEUPS DATABASE
// ═══════════════════════════════════════════════════════════════

export const LINEUPS = {
  // ─── T-SIDE MID ──────────────────────────────────────────
  xbox_smoke: {
    id: "xbox_smoke",
    name: "Xbox Smoke from T Spawn",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "Mid",
    mustLearn: true,
    instant: true,
    purpose:
      "Blocks the CT AWP from mid doors. THE most important T-side smoke on Dust II — throw it every single round to allow safe mid-to-B or catwalk crossing.",
    stand: "Stand in T Spawn near the right-side wall, aligned with the corner of the dark doorframe overhead.",
    aim: "Look up at the antenna/wire above T Spawn. Place crosshair just below where the wire meets the wall on the left building.",
    notes:
      "Whoever has the closest spawn throws this. Must land before CTs set up mid AWP. If it fails, your team dies crossing mid doors.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/dust-2/xbox-smoke-from-t-spawn",
    },
    video: yt("xbox smoke t spawn"),
    screenshots: {
        stand: "https://assets.cs2util.com/dust2/smoke/xbox/xbox-smoke-from-nomal-t-spawn-lineup-mini.webp",
        aim: "https://assets.cs2util.com/dust2/smoke/xbox/xbox-smoke-from-nomal-t-spawn-lineup.webp",
        result: "https://assets.cs2util.com/dust2/smoke/xbox/xbox-smoke-from-nomal-t-spawn-cover.webp",
      },
    radarPos: { worldX: -299.969, worldY: -1163.764 },
    radarTarget: { x: 46.387, y: 38.867 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── T-SIDE A LONG ────────────────────────────────────────

  a_ct_smoke: {
    id: "a_ct_smoke",
    name: "A Site CT Spawn Smoke from Long",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "A",
    mustLearn: true,
    purpose:
      "Blocks CT spawn/ramp connection to A site. Essential for any A take — prevents CTs rotating through spawn from catching you on site.",
    stand: "Stand at A Long near the corner of the blue container/dumpster, lined up with the right edge of pit wall.",
    aim: "Look up at the building ahead. Place crosshair on the corner of the wooden overhang above the CT spawn archway.",
    notes:
      "Jump throw. Without this smoke, CTs can freely peek from spawn during your plant. Throw after taking long control.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/dust-2/ct-smoke-from-long-a",
    },
    video: yt("ct spawn smoke from long a"),
    screenshots: {
        stand: "https://assets.cs2util.com/dust2/smoke/CT-Spawn/ct-spawn-smoke-from-a-site-pit-lineup-mini.webp",
        aim: "https://assets.cs2util.com/dust2/smoke/CT-Spawn/ct-spawn-smoke-from-a-site-pit-lineup.webp",
        result: "https://assets.cs2util.com/dust2/smoke/CT-Spawn/ct-spawn-smoke-from-a-site-pit-cover.webp",
      },
    radarPos: { worldX: 969.842, worldY: 734.246 },
    radarTarget: { x: 70, y: 14 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  a_long_flash: {
    id: "a_long_flash",
    name: "A Long Pop Flash",
    util: "FLASH",
    throw: "RMB",
    side: "T",
    area: "A",
    purpose: "Blinds CTs holding pit or A site as your team pushes out of long doors.",
    stand: "Inside long doors, right side, a few steps before the exit to long A.",
    aim: "Face the exit and aim at the top edge of the doorway. Right-click underhand toss so it pops instantly over the door.",
    notes:
      "Right-click underhand throw. Push out the instant the flash leaves your hand — it pops almost immediately above the doors.",
    source: {
      name: "BLAST.tv",
      url: "https://blast.tv/article/cs2-dust2-flashes",
    },
    video: yt("a long pop flash doors"),
    screenshots: {
        stand: "https://assets.cs2util.com/dust2/flash/a-site/a-site-pop-flash-from-long-cafe-lineup-mini.webp",
        aim: "https://assets.cs2util.com/dust2/flash/a-site/a-site-pop-flash-from-long-cafe-lineup.webp",
        result: "https://assets.cs2util.com/dust2/flash/a-site/a-site-pop-flash-from-long-cafe-cover.webp",
      },
    radarPos: { worldX: 1585.34, worldY: 1077.385 },
    radarTarget: { x: 85, y: 48 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_molly_from_long: {
    id: "ct_molly_from_long",
    name: "CT Spawn Molotov from A Long",
    util: "MOLLY",
    throw: "LMB",
    side: "T",
    area: "A",
    purpose:
      "Burns out CTs hiding behind the CT spawn boxes during an A take. Forces them to rotate or peek into your crosshairs.",
    stand: "A Long near the pit area, pressed against the right-side wall.",
    aim: "Aim high above the A site toward CT spawn, arc the molotov over the wall so it lands behind the boxes at CT.",
    notes:
      "Left-click full throw. High arc needed to clear the walls. Pairs with CT spawn smoke for a complete CT deny.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-dust2-lineups/",
    },
    video: yt("ct spawn molly from long a"),
    screenshots: {
        stand: "https://assets.cs2util.com/dust2/molotov/a-site/default-molotov-from-long-lineup-mini.webp",
        aim: "https://assets.cs2util.com/dust2/molotov/a-site/default-molotov-from-long-lineup.webp",
        result: "https://assets.cs2util.com/dust2/molotov/a-site/default-molotov-from-long-cover.webp",
      },
    radarPos: { worldX: 1593.969, worldY: 1148.323 },
    radarTarget: { x: 70, y: 14 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── T-SIDE A SHORT (CATWALK) ─────────────────────────────
  a_short_flash: {
    id: "a_short_flash",
    name: "A Short Pop Flash (Catwalk)",
    util: "FLASH",
    throw: "RMB",
    side: "T",
    area: "A",
    purpose: "Blinds CTs holding A site or short from the catwalk push. Pops over the staircase wall.",
    stand: "Top of catwalk stairs, pressed against the right wall before the corner.",
    aim: "Face the A site direction. Right-click underhand throw the flash off the wall above the corner — it pops over the top instantly.",
    notes:
      "Right-click underhand throw. The flash bounces off the wall above and pops instantly into A site. Push immediately.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/dust-2/short-flash",
    },
    video: yt("a short pop flash catwalk"),
    screenshots: {
        stand: "https://assets.cs2util.com/dust2/flash/a-short/short-a-stairs-pop-flash-from-catwalk-lineup-mini.webp",
        aim: "https://assets.cs2util.com/dust2/flash/a-short/short-a-stairs-pop-flash-from-catwalk-lineup.webp",
        result: "https://assets.cs2util.com/dust2/flash/a-short/short-a-stairs-pop-flash-from-catwalk-cover.webp",
      },
    radarPos: { worldX: -183.899, worldY: 691.25 },
    radarTarget: { x: 72, y: 22 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── T-SIDE B ─────────────────────────────────────────────
  b_window_smoke: {
    id: "b_window_smoke",
    name: "B Window Smoke from Tunnels",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "B",
    mustLearn: true,
    purpose:
      "Blocks the CT AWP watching from B window (doors). Critical for any B site take — without this smoke, the window player picks off your whole team.",
    stand: "Inside upper B tunnels, stand against the left wall near the exit toward B site.",
    aim: "Look up and to the left. Aim at the dark spot on the ceiling beam where it meets the stone arch.",
    notes:
      "Jump throw. Must land before your team exits tunnels. Combine with B doors/car smoke for a full B execute.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/dust-2/b-window-smoke",
    },
    video: yt("b window smoke tunnels"),
    screenshots: {
        stand: "https://assets.cs2util.com/dust2/smoke/b-site/window-smoke-from-upper-tunnels2-lineup-mini.webp",
        aim: "https://assets.cs2util.com/dust2/smoke/b-site/window-smoke-from-upper-tunnels2-lineup.webp",
        result: "https://assets.cs2util.com/dust2/smoke/b-site/window-smoke-from-upper-tunnels2-cover.webp",
      },
    radarPos: { worldX: -1729.437, worldY: 1064.032 },
    radarTarget: { x: 15, y: 25 },
    austincs: { video: "", timestamp: "", note: "" },
  },



  b_tunnel_flash: {
    id: "b_tunnel_flash",
    name: "B Tunnels Exit Flash",
    util: "FLASH",
    throw: "RMB",
    side: "T",
    area: "B",
    purpose: "Blinds CTs holding B site as your team exits upper tunnels.",
    stand: "Inside upper B tunnels, behind the entry player near the exit.",
    aim: "Face the B tunnels exit. Right-click underhand throw off the upper wall — flash pops into site instantly.",
    notes:
      "Right-click underhand throw. Push out immediately after releasing. The first player out should already be moving as the flash is thrown.",
    source: {
      name: "BLAST.tv",
      url: "https://blast.tv/article/cs2-dust2-flashes",
    },
    video: yt("b tunnels pop flash"),
    screenshots: {
        stand: "https://assets.cs2util.com/dust2/flash/b-site/b-rush-entry-bounce-flash-lineup-mini.webp",
        aim: "https://assets.cs2util.com/dust2/flash/b-site/b-rush-entry-bounce-flash-lineup.webp",
        result: "https://assets.cs2util.com/dust2/flash/b-site/b-rush-entry-bounce-flash-cover.webp",
      },
    radarPos: { worldX: -1783.032, worldY: 1036.286 },
    radarTarget: { x: 25, y: 16 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── T-SIDE MID EXTRAS ────────────────────────────────────

  // ─── CT SIDE ──────────────────────────────────────────────
  ct_long_doors_smoke: {
    id: "ct_long_doors_smoke",
    name: "Long Doors Smoke from CT",
    util: "SMOKE",
    throw: "JT",
    side: "CT",
    area: "A",
    mustLearn: true,
    purpose:
      "Blocks T-side long doors push. Foundation CT-side A hold — gives you time to set up on long or rotate if they push.",
    stand: "At the A site corner near the barrel, facing toward long A.",
    aim: "Look up toward the sky above long. Place crosshair on the corner of the building edge overhead.",
    notes:
      "Jump throw. Throw this early round. If Ts push through the smoke, you hear footsteps and can call for backup.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/dust-2/long-doors-smoke-ct",
    },
    video: yt("long doors smoke ct side"),
    screenshots: {
        stand: "https://assets.cs2util.com/dust2/smoke/long/ct-long-cut-off-smoke-lineup-mini.webp",
        aim: "https://assets.cs2util.com/dust2/smoke/long/ct-long-cut-off-smoke-lineup.webp",
        result: "https://assets.cs2util.com/dust2/smoke/long/ct-long-cut-off-smoke-cover.webp",
      },
    radarPos: { worldX: 1004.97, worldY: 2304.832 },
    radarTarget: { x: 80, y: 55 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_b_tuns_smoke: {
    id: "ct_b_tuns_smoke",
    name: "B Tunnels Smoke from B Site",
    util: "SMOKE",
    throw: "LMB",
    side: "CT",
    area: "B",
    purpose:
      "Blocks the B tunnel exit. Foundation CT-side B hold — solo anchor's lifeline to delay pushes.",
    stand: "On B site behind the big box, facing the upper tunnel entrance.",
    aim: "Aim directly at the upper tunnel exit — left-click throw the smoke to land in the archway.",
    notes:
      "Left-click throw. Simple lineup — just throw it at the tunnel exit. Follow up with molly for ~25 sec of delay.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/dust-2/b-tunnels-smoke-ct",
    },
    video: yt("b tunnels smoke ct b site"),
    screenshots: {
        stand: "https://assets.cs2util.com/dust2/smoke/b-site/b-tunnels-smoke-from-b-plat-lineup-mini.webp",
        aim: "https://assets.cs2util.com/dust2/smoke/b-site/b-tunnels-smoke-from-b-plat-lineup.webp",
        result: "https://assets.cs2util.com/dust2/smoke/b-site/b-tunnels-smoke-from-b-plat-cover.webp",
      },
    radarPos: { worldX: -1765.525, worldY: 2752.159 },
    radarTarget: { x: 14.746, y: 50.586 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_mid_smoke: {
    id: "ct_mid_smoke",
    name: "Mid Doors Smoke from CT Spawn",
    util: "SMOKE",
    throw: "JT",
    side: "CT",
    area: "Mid",
    instant: true,
    purpose:
      "Blocks mid doors from CT spawn. Prevents Ts from getting mid control or AWPing through doors early round.",
    stand: "CT spawn, right side near the wall facing mid doors.",
    aim: "Look up at the building above mid. Aim at the rooftop edge/antenna above mid doors.",
    notes:
      "Jump throw. An alternative to playing the mid AWP — smoke it off and play passive. Good for eco/force rounds.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/dust-2/mid-doors-smoke-ct",
    },
    video: yt("mid doors smoke ct spawn"),
    screenshots: {
        stand: "https://assets.cs2util.com/dust2/smoke/mid/suicide-smoke-from-ct-mid-lineup-mini.webp",
        aim: "https://assets.cs2util.com/dust2/smoke/mid/suicide-smoke-from-ct-mid-lineup.webp",
        result: "https://assets.cs2util.com/dust2/smoke/mid/suicide-smoke-from-ct-mid-cover.webp",
      },
    radarPos: { worldX: -337.031, worldY: 2423.969 },
    radarTarget: { x: 43.262, y: 68.945 },
    austincs: { video: "", timestamp: "", note: "" },
  },



};

// ═══════════════════════════════════════════════════════════════
//  MUST-LEARN 5 — if you only learn 5, learn these
// ═══════════════════════════════════════════════════════════════

export const MUST_LEARN = [
  "xbox_smoke",
  "a_ct_smoke",
  "b_window_smoke",
  "ct_long_doors_smoke",
];

// ═══════════════════════════════════════════════════════════════
//  COMBOS — 2-3 player named bundles
// ═══════════════════════════════════════════════════════════════

export const COMBOS = [];

// ═══════════════════════════════════════════════════════════════
//  UTILITY BELTS — one player carries the full execute
//  Teammates drop their smoke(s) pre-round so the carrier has everything.
// ═══════════════════════════════════════════════════════════════

export const UTILITY_BELTS = [];

// ═══════════════════════════════════════════════════════════════
//  SCENARIOS — basic-knowledge reminders (no lineups)
// ═══════════════════════════════════════════════════════════════

export const SCENARIOS = [
  {
    id: "watch_flank",
    title: "Everyone is pushing site — who watches flank?",
    side: "T",
    bullets: [
      "Designate ONE player to watch mid/catwalk when hitting A Long, or mid doors when hitting B.",
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
      "On A site: hold from pit, long corner, and short. On B: hold from tunnels, window, and back plat.",
      "Don't ALL save util. One player keeps a molly for the bomb. The rest use util on entry.",
    ],
  },
  {
    id: "mid_control",
    title: "Mid is contested — should we force it?",
    side: "T",
    bullets: [
      "Xbox smoke is non-negotiable. If it fails, don't dry-peek mid doors. Go A Long or B tunnels.",
      "If you take mid control, you unlock mid-to-B splits AND catwalk-to-A pushes. It's high reward.",
      "Counter an aggressive mid CT next round by stacking 3 toward mid with flashes.",
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
      "Stack one site with all 5 — B tunnels is great for close-range pistol fights.",
      "Don't split or default on ecos — get one pick and bail with the rifle.",
    ],
  },
  {
    id: "force_round_t",
    title: "Force buy (T side)",
    side: "T",
    bullets: [
      "Cheap SMG (MAC-10) or upgraded pistol + armor + 1 flash.",
      "Rush a site close-range. B tunnels favors SMGs. A Long is death against rifles.",
      "If you have AWP money, give it to the best aimer. Don't force 5 rifles.",
    ],
  },
  {
    id: "pistol_round",
    title: "Pistol round basics",
    side: "T",
    bullets: [
      "Buy kevlar ($650). You have $150 left — not enough for a grenade. Skip utility. Or skip kevlar and buy a P250 ($300) + a flash ($200) if you trust your aim.",
      "Stack one site. Don't split the pistol round. B tunnels is close range — good for pistols.",
      "Win pistol = full buy round 2. Lose pistol = eco round 2 to set up round 3 force.",
    ],
  },
  {
    id: "solo_anchor",
    title: "Solo anchoring a site (CT)",
    side: "CT",
    bullets: [
      "Smoke + molly your entry choke. Buys ~25 seconds for rotates.",
      "Hold an OFF angle. Don't sit on the default spot they expect.",
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
  {
    id: "dust2_awp",
    title: "Playing the AWP on Dust II",
    side: "CT",
    bullets: [
      "Mid doors is THE classic AWP angle but Ts will xbox-smoke it. Don't hold it blind — reposition.",
      "Long A with an AWP is strong if your team smokes long doors for you. Hold from pit or site.",
      "If they smoke you off, rotate early. A blind AWP is a $4750 paperweight.",
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
    id: "t_spawn_xbox",
    name: "T Spawn (Xbox Smoke)",
    side: "T",
    area: "Mid",
    pos: { worldX: -299.969, worldY: -1163.764 },
    lineups: ["xbox_smoke"],
    tip: "Closest spawn throws this every round. THE most important T-side smoke on Dust II.",
  },
  
  {
    id: "a_long_position",
    name: "A Long (After Control)",
    side: "T",
    area: "A",
    pos: { worldX: 969.842, worldY: 734.246 },
    lineups: ["a_ct_smoke", "ct_molly_from_long"],
    tip: "After taking long control — CT smoke and molly for the full A execute.",
  },
  
  {
    id: "inside_long_doors",
    name: "Inside Long Doors",
    side: "T",
    area: "A",
    pos: { worldX: 1585.34, worldY: 1077.385 },
    lineups: ["a_long_flash"],
    tip: "Pop flash from inside doors. Push immediately after throwing.",
  },
  
  {
    id: "catwalk_top",
    name: "Catwalk / A Short",
    side: "T",
    area: "A",
    pos: { worldX: -183.899, worldY: 691.25 },
    lineups: ["a_short_flash"],
    tip: "Pop flash over the staircase wall into A site. Devastating paired with a long push.",
  },
  
  {
    id: "ct_a_site",
    name: "A Site (Defender)",
    side: "CT",
    area: "A",
    pos: { worldX: 1004.97, worldY: 2304.832 },
    lineups: ["ct_long_doors_smoke"],
    tip: "Foundation CT A hold. Smoke long doors early every round.",
  },
  
  {
    id: "ct_spawn_mid",
    name: "CT Spawn (Mid)",
    side: "CT",
    area: "Mid",
    pos: { worldX: -337.031, worldY: 2423.969 },
    lineups: ["ct_mid_smoke"],
    tip: "Smoke mid doors from CT spawn. Good alternative to playing the AWP.",
  },
  ];

export const SPAWNS = {
  T: [
    { id: 1, name: "Spawn 1 (Right Wall)", pos: { x: 43, y: 96 }, lineups: ["xbox_smoke"] },
    { id: 2, name: "Spawn 2 (Left)",       pos: { x: 39, y: 97 }, lineups: [] },
    { id: 3, name: "Spawn 3 (Center)",     pos: { x: 66, y: 11 }, lineups: [] },
    { id: 4, name: "Spawn 4 (Back)",       pos: { x: 41, y: 99 }, lineups: [] },
    { id: 5, name: "Spawn 5 (Right)",      pos: { x: 44, y: 97 }, lineups: [] },
  ],
  CT: [
    { id: 1, name: "Spawn 1 (Mid Side)",   pos: { x: 64, y: 13 }, lineups: ["ct_mid_smoke"] },
    { id: 2, name: "Spawn 2 (A Side)",     pos: { x: 70, y: 12 }, lineups: [] },
    { id: 3, name: "Spawn 3 (Center)",     pos: { x: 60, y: 20 }, lineups: [] },
    { id: 4, name: "Spawn 4 (B Side)",     pos: { x: 60, y: 13 }, lineups: [] },
    { id: 5, name: "Spawn 5 (Back)",       pos: { x: 66, y: 9 }, lineups: [] },
  ],
};
