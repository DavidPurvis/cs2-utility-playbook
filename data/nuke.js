/*
  CS2 NUKE — DATA MODULE

  All lineup data, combos, utility belts, and scenarios for Nuke.
  Nuke is a VERTICAL map: A site (upper) and B site (lower/ramp).
  The radar shows the upper level top-down.

  Lineup data is cross-referenced from NadeKing, Refrag.gg, CS2Pulse,
  BLAST.tv, and Profilerr.

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

export const MAP_NAME = "Nuke";

export const RADAR_URL =
  "https://raw.githubusercontent.com/MurkyYT/cs2-map-icons/main/images/radars/de_nuke_radar_psd.png";

import { ytSearch } from "./youtube.js";

const yt = (q) => ytSearch("nuke", q);

// ═══════════════════════════════════════════════════════════════
//  LINEUPS DATABASE
// ═══════════════════════════════════════════════════════════════

export const LINEUPS = {
  // ─── T-SIDE OUTSIDE / YARD ────────────────────────────────
  outside_smoke: {
    id: "outside_smoke",
    name: "Outside Smoke (Heaven Block)",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "A",
    mustLearn: true,
    instant: true,
    purpose:
      "Blocks Heaven/Catwalk vision into Yard. THE most important T-side smoke on Nuke — without it, the CT AWP on Heaven shuts down every outside push.",
    stand: "On T Roof, stand in the corner where the railing meets the wall on the left side (facing outside).",
    aim: "Look up toward the sky and find the antenna tip on the roof structure. Place your crosshair just below the tip.",
    notes:
      "Closest spawn throws this. Must land before CTs set up the Heaven AWP. Blooms between Heaven window and Catwalk.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/de_nuke",
    },
    video: yt("outside smoke heaven block t roof"),
    screenshots: {
      stand: "https://assets.cs2util.com/nuke/smoke/outside/garage-smoke-from-t-spawn-lineup-mini.webp",
      aim: "https://assets.cs2util.com/nuke/smoke/outside/garage-smoke-from-t-spawn-lineup.webp",
      result: "https://assets.cs2util.com/nuke/smoke/outside/garage-smoke-from-t-spawn-cover.webp",
    },
    radarPos: { worldX: -1243.491, worldY: -1142.971 },
    radarTarget: { x: 58.008, y: 86.621 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  mini_smoke: {
    id: "mini_smoke",
    name: "Mini / Garage Smoke",
    util: "SMOKE",
    throw: "LMB",
    side: "T",
    area: "A",
    mustLearn: false,
    purpose:
      "Blocks the Mini/Garage angle on the outside area. Prevents CTs from spotting your yard push from the garage window.",
    stand: "On T Roof, near the right-side railing overlooking outside.",
    aim: "Face outside and aim at the edge of the Mini building roof. Left-click — no jump needed.",
    notes:
      "Simple left-click throw. Pairs with Outside smoke to fully isolate Yard from CT sightlines.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-nuke-utility-guide/",
    },
    video: yt("mini garage smoke t roof"),
    screenshots: {
      stand: "https://assets.cs2util.com/nuke/smoke/outside/garage-smoke-from-t-spawn3-lineup-mini.webp",
      aim: "https://assets.cs2util.com/nuke/smoke/outside/garage-smoke-from-t-spawn3-lineup.webp",
      result: "https://assets.cs2util.com/nuke/smoke/outside/garage-smoke-from-t-spawn3-cover.webp",
    },
    radarPos: { x: 56, y: 50 },
    radarTarget: { x: 51, y: 39 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  outside_heaven_molly: {
    id: "outside_heaven_molly",
    name: "Heaven Molotov (Flush Heaven)",
    util: "MOLLY",
    throw: "JT",
    side: "T",
    area: "A",
    mustLearn: false,
    purpose:
      "Burns the Heaven/Catwalk position. Forces the CT AWP to reposition away from the window.",
    stand: "On T Roof, same general area as the Outside smoke — left-side railing.",
    aim: "Aim higher than the smoke lineup, toward the top of the Heaven window frame. Jump throw.",
    notes:
      "Throw AFTER the Outside smoke. The smoke blocks their vision while the molly forces them off the position entirely. Devastating combo.",
    source: {
      name: "CS2Pulse",
      url: "https://cs2pulse.com/mollys/nuke/",
    },
    video: yt("heaven molotov outside t roof"),
    screenshots: {
      stand: "https://assets.cs2util.com/nuke/molotov/a-site/hut-molotov-from-heaven-lineup-mini.webp",
      aim: "https://assets.cs2util.com/nuke/molotov/a-site/hut-molotov-from-heaven-lineup.webp",
      result: "https://assets.cs2util.com/nuke/molotov/a-site/hut-molotov-from-heaven-cover.webp",
    },
    radarPos: { worldX: 1259.969, worldY: -316.032 },
    radarTarget: { x: 41, y: 29 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── T-SIDE A SITE ────────────────────────────────────────
  hut_smoke: {
    id: "hut_smoke",
    name: "Hut Smoke from Lobby",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "A",
    mustLearn: false,
    purpose:
      "Blocks vision from Hut onto A site. CTs playing Hut can no longer hold the Squeaky-side push.",
    stand: "Inside Lobby, stand against the back wall opposite the Squeaky door entrance.",
    aim: "Look up at the ceiling vent structure above. Aim at the left edge of the metal beam. Jump throw.",
    notes:
      "Hut is the small room on A site with the ladder to lower. Smoking it isolates the CT holding there. Push through Squeaky immediately after.",
    source: {
      name: "BLAST.tv",
      url: "https://blast.tv/article/cs2-nuke-smokes",
    },
    video: yt("hut smoke from lobby"),
    screenshots: {
      stand: "https://assets.cs2util.com/nuke/smoke/a-site/main-smoke-from-roof-lineup-mini.webp",
      aim: "https://assets.cs2util.com/nuke/smoke/a-site/main-smoke-from-roof-lineup.webp",
      result: "https://assets.cs2util.com/nuke/smoke/a-site/main-smoke-from-roof-cover.webp",
    },
    radarPos: { x: 47, y: 49 },
    radarTarget: { x: 44, y: 32 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  a_main_pop_flash: {
    id: "a_main_pop_flash",
    name: "Squeaky Pop Flash",
    util: "FLASH",
    throw: "RMB",
    side: "T",
    area: "A",
    mustLearn: true,
    purpose:
      "Blinds CTs holding A site as you push through Squeaky door. The flash pops instantly — CTs have no time to turn.",
    stand: "Inside Lobby, right next to the Squeaky door. Hug the wall beside the door frame.",
    aim: "Face the Squeaky door. Aim at the top of the door frame. Right-click underhand throw.",
    notes:
      "Right-click underhand throw. Open Squeaky, throw the flash, and push IMMEDIATELY. The door sound is your team's cue to get ready.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/de_nuke",
    },
    video: yt("squeaky pop flash a site push"),
    screenshots: {
      stand: "https://assets.cs2util.com/nuke/flash/hut/a-site-flash-from-hut-lineup-mini.webp",
      aim: "https://assets.cs2util.com/nuke/flash/hut/a-site-flash-from-hut-lineup.webp",
      result: "https://assets.cs2util.com/nuke/flash/hut/a-site-flash-from-hut-cover.webp",
    },
    radarPos: { worldX: 160.035, worldY: -1119.958 },
    radarTarget: { x: 39, y: 38 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── T-SIDE B / RAMP ─────────────────────────────────────
  ramp_smoke: {
    id: "ramp_smoke",
    name: "Ramp Smoke (Bottom Cover)",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "B",
    mustLearn: true,
    purpose:
      "Covers the bottom of Ramp, blocking CT vision from Ramp Room / B site hallway. Essential for taking Ramp control.",
    stand: "Top of Ramp on T side, stand in the left corner where the wall meets the railing.",
    aim: "Look down Ramp and aim at the lower-left edge of the doorframe at the bottom. Jump throw.",
    notes:
      "Blooms at the bottom of Ramp. CTs can't see you walk down. Push together as a group — don't trickle.",
    source: {
      name: "BLAST.tv",
      url: "https://blast.tv/article/cs2-nuke-smokes",
    },
    video: yt("ramp smoke bottom cover"),
    screenshots: {
      stand: "https://assets.cs2util.com/nuke/smoke/B%20site/ramp-smoke-lineup-mini.webp",
      aim: "https://assets.cs2util.com/nuke/smoke/B%20site/ramp-smoke-lineup.webp",
      result: "https://assets.cs2util.com/nuke/smoke/B%20site/ramp-smoke-cover.webp",
    },
    radarPos: { worldX: 251.969, worldY: -353.561 },
    radarTarget: { x: 43, y: 46 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ramp_sandbags_molly: {
    id: "ramp_sandbags_molly",
    name: "Ramp Sandbags Molotov",
    util: "MOLLY",
    throw: "LMB",
    side: "T",
    area: "B",
    mustLearn: false,
    purpose:
      "Burns the Sandbags position at the bottom of Ramp. Forces the close-angle CT to reposition or take damage.",
    stand: "Top of Ramp on T side, slightly right of center.",
    aim: "Look down Ramp and aim at the sandbag stack at the bottom. Left-click throw — let it arc down naturally.",
    notes:
      "Throw before pushing down Ramp. The molly clears the most common close-range holding spot.",
    source: {
      name: "CS2Pulse",
      url: "https://cs2pulse.com/mollys/nuke/",
    },
    video: yt("ramp sandbags molotov"),
    screenshots: {
      stand: "https://assets.cs2util.com/nuke/molotov/ramp/ramp-big-box-molotov-lineup-mini.webp",
      aim: "https://assets.cs2util.com/nuke/molotov/ramp/ramp-big-box-molotov-lineup.webp",
      result: "https://assets.cs2util.com/nuke/molotov/ramp/ramp-big-box-molotov-cover.webp",
    },
    radarPos: { worldX: 91.19, worldY: -292.031 },
    radarTarget: { x: 44, y: 45 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  lobby_pop_flash: {
    id: "lobby_pop_flash",
    name: "Lobby Pop Flash (Ramp Push)",
    util: "FLASH",
    throw: "RMB",
    side: "T",
    area: "B",
    mustLearn: false,
    purpose:
      "Blinds CTs holding the top of Ramp from the Lobby side. Pop flash that gives your team the advantage as they push down.",
    stand: "In Lobby, near the Ramp entrance. Hug the right wall.",
    aim: "Face Ramp and aim at the ceiling above the Ramp entrance. Right-click underhand throw.",
    notes:
      "Right-click underhand throw. The flash bounces off the ceiling and pops instantly. Push down Ramp together on the flash.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-nuke-utility-guide/",
    },
    video: yt("lobby pop flash ramp push"),
    screenshots: {
      stand: "https://assets.cs2util.com/nuke/flash/ramp/boost-ramp-flash-lineup-mini.webp",
      aim: "https://assets.cs2util.com/nuke/flash/ramp/boost-ramp-flash-lineup.webp",
      result: "https://assets.cs2util.com/nuke/flash/ramp/boost-ramp-flash-cover.webp",
    },
    radarPos: { worldX: 251.968, worldY: -463.969 },
    radarTarget: { x: 45, y: 45 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ramp_he: {
    id: "ramp_he",
    name: "Ramp Room HE",
    util: "HE",
    throw: "LMB",
    side: "T",
    area: "B",
    mustLearn: false,
    purpose:
      "Deals 50-80 damage to CTs playing Ramp positions. Softens defenders before your team commits down Ramp.",
    stand: "Top of Ramp on T side, center of the corridor.",
    aim: "Arc the HE down Ramp toward the bottom — aim slightly above the doorframe to bounce it off the back wall.",
    notes:
      "Even 40 damage wins a duel at close range. Throw this before pushing down.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-nuke-utility-guide/",
    },
    video: yt("ramp room he grenade"),
    screenshots: {
      stand: "https://assets.cs2util.com/nuke/grenade/a-site/squeaky-grenade-from-t-roof-lineup-mini.webp",
      aim: "https://assets.cs2util.com/nuke/grenade/a-site/squeaky-grenade-from-t-roof-lineup.webp",
      result: "https://assets.cs2util.com/nuke/grenade/a-site/squeaky-grenade-from-t-roof-cover.webp",
    },
    radarPos: { x: 48, y: 48 },
    radarTarget: { x: 44, y: 45 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── CT SIDE ──────────────────────────────────────────────
  ct_outside_smoke: {
    id: "ct_outside_smoke",
    name: "Outside Smoke from CT Spawn",
    util: "SMOKE",
    throw: "JT",
    side: "CT",
    area: "A",
    mustLearn: true,
    instant: true,
    purpose:
      "Delays the T-side yard push by blocking the main outside lane. Foundation CT outside control — buys time for your teammate to set up on Heaven.",
    stand: "CT Spawn, stand near the back-left corner against the wall.",
    aim: "Look up at the sky above the rooftops. Find the antenna structure and aim just left of it. Jump throw.",
    notes:
      "Throw this every single round. Lands near Red Container / Silo area and blocks T Roof sightlines into Yard.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/de_nuke",
    },
    video: yt("outside smoke from ct spawn"),
    screenshots: {
      stand: "https://assets.cs2util.com/nuke/smoke/outside/outside-smoke-from-ct-red-box-lineup-mini.webp",
      aim: "https://assets.cs2util.com/nuke/smoke/outside/outside-smoke-from-ct-red-box-lineup.webp",
      result: "https://assets.cs2util.com/nuke/smoke/outside/outside-smoke-from-ct-red-box-cover.webp",
    },
    radarPos: { worldX: 1811.547, worldY: -728.617 },
    radarTarget: { x: 55, y: 45 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_ramp_smoke: {
    id: "ct_ramp_smoke",
    name: "Ramp Smoke from CT",
    util: "SMOKE",
    throw: "LMB",
    side: "CT",
    area: "B",
    mustLearn: true,
    purpose:
      "Blocks the T-side push down Ramp. Buys time for rotations and lets you hold Ramp solo.",
    stand: "Bottom of Ramp on CT side, stand behind the left wall corner (B halls entrance).",
    aim: "Face Ramp and aim at the center of the corridor, slightly above head height. Left-click throw.",
    notes:
      "Simple left-click. Smoke blooms in the middle of Ramp, blocking T vision. Pair with the Ramp molly for ~25 seconds of denial.",
    source: {
      name: "BLAST.tv",
      url: "https://blast.tv/article/cs2-nuke-smokes",
    },
    video: yt("ramp smoke from ct side"),
    screenshots: {
      stand: "https://assets.cs2util.com/nuke/smoke/B%20site/decon-smoke-from-trophy-room-lineup-mini.webp",
      aim: "https://assets.cs2util.com/nuke/smoke/B%20site/decon-smoke-from-trophy-room-lineup.webp",
      result: "https://assets.cs2util.com/nuke/smoke/B%20site/decon-smoke-from-trophy-room-cover.webp",
    },
    radarPos: { worldX: 251.969, worldY: -463.969 },
    radarTarget: { x: 46, y: 48 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  trophy_molly: {
    id: "trophy_molly",
    name: "Trophy Room Molotov",
    util: "MOLLY",
    throw: "LMB",
    side: "CT",
    area: "A",
    mustLearn: false,
    purpose:
      "Burns Trophy Room, preventing Ts from holding a key post-plant position. Also clears Ts trying to push through Trophy toward A site.",
    stand: "On A site, near the default plant position on the CT side.",
    aim: "Face Trophy Room and aim at the floor just inside the doorway. Left-click throw.",
    notes:
      "Use on retake to clear the most common T post-plant position. Also good as an anti-push tool in the opening.",
    source: {
      name: "CS2Pulse",
      url: "https://cs2pulse.com/mollys/nuke/",
    },
    video: yt("trophy room molotov"),
    screenshots: {
      stand: "https://assets.cs2util.com/nuke/molotov/a-site/squeaky-molotov-from-heaven-lineup-mini.webp",
      aim: "https://assets.cs2util.com/nuke/molotov/a-site/squeaky-molotov-from-heaven-lineup.webp",
      result: "https://assets.cs2util.com/nuke/molotov/a-site/squeaky-molotov-from-heaven-cover.webp",
    },
    radarPos: { worldX: 1012.198, worldY: -457.969 },
    radarTarget: { x: 37, y: 42 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  heaven_retake_flash: {
    id: "heaven_retake_flash",
    name: "Heaven Retake Flash",
    util: "FLASH",
    throw: "LMB",
    side: "CT",
    area: "A",
    mustLearn: false,
    purpose:
      "Flash from Heaven/Catwalk over A site. Blinds Ts on the A site floor during retake without flashing your rotating teammates.",
    stand: "On Heaven/Catwalk, near the railing overlooking A site.",
    aim: "Aim high above A site, toward the far wall. Full-throw the flash over the site.",
    notes:
      "Call 'flashing A from Heaven' first. Your team pushes from multiple angles on the flash. The height advantage makes this incredibly strong.",
    source: {
      name: "Profilerr",
      url: "https://profilerr.net/cs2-nuke-utility-guide/",
    },
    video: yt("heaven retake flash a site"),
    screenshots: {
      stand: "https://assets.cs2util.com/nuke/flash/heaven/heaven-popflash-for-retake-lineup-mini.webp",
      aim: "https://assets.cs2util.com/nuke/flash/heaven/heaven-popflash-for-retake-lineup.webp",
      result: "https://assets.cs2util.com/nuke/flash/heaven/heaven-popflash-for-retake-cover.webp",
    },
    radarPos: { x: 41, y: 29 },
    radarTarget: { x: 39, y: 35 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_ramp_molly: {
    id: "ct_ramp_molly",
    name: "Ramp Molotov (Anti-Rush)",
    util: "MOLLY",
    throw: "LMB",
    side: "CT",
    area: "B",
    mustLearn: false,
    purpose:
      "Molly into the top of Ramp behind your smoke. Anyone pushing through the smoke takes fire damage. Buys ~25 seconds combined.",
    stand: "Bottom of Ramp on CT side, same position as the Ramp smoke.",
    aim: "Throw the molly through your Ramp smoke — arc it up so it lands on the T side of the smoke.",
    notes:
      "Smoke + Molly is the classic Ramp hold combo. Burns anyone trying to walk through your smoke. Buys enough time for rotations.",
    source: {
      name: "Profilerr",
      url: "https://profilerr.net/cs2-nuke-utility-guide/",
    },
    video: yt("ramp molotov anti rush ct"),
    screenshots: {
      stand: "https://assets.cs2util.com/nuke/molotov/outside/t-red-molotov-from-ct-box-lineup-mini.webp",
      aim: "https://assets.cs2util.com/nuke/molotov/outside/t-red-molotov-from-ct-box-lineup.webp",
      result: "https://assets.cs2util.com/nuke/molotov/outside/t-red-molotov-from-ct-box-cover.webp",
    },
    radarPos: { worldX: 1791.969, worldY: -959.564 },
    radarTarget: { x: 54.004, y: 78.32 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_b_retake_flash: {
    id: "ct_b_retake_flash",
    name: "B Retake Flash from Secret",
    util: "FLASH",
    throw: "LMB",
    side: "CT",
    area: "B",
    mustLearn: false,
    purpose:
      "Flash into B site from Secret passage. Catches Ts in post-plant positions facing Ramp — they don't expect the Secret angle.",
    stand: "In Secret passage, near the B site entrance.",
    aim: "Full throw flash into B site — aim at the ceiling above the site entrance.",
    notes:
      "Call 'flashing B from Secret' first. Push together — lone peeks lose retakes. The Secret angle is Nuke's strongest retake path for B.",
    source: {
      name: "Profilerr",
      url: "https://profilerr.net/cs2-nuke-utility-guide/",
    },
    video: yt("b retake flash from secret"),
    screenshots: {
      stand: "https://assets.cs2util.com/nuke/flash/outside/silo-yard-flash-from-a-default-lineup-mini.webp",
      aim: "https://assets.cs2util.com/nuke/flash/outside/silo-yard-flash-from-a-default-lineup.webp",
      result: "https://assets.cs2util.com/nuke/flash/outside/silo-yard-flash-from-a-default-cover.webp",
    },
    radarPos: { worldX: 850.054, worldY: -677.206 },
    radarTarget: { x: 40, y: 55 },
    austincs: { video: "", timestamp: "", note: "" },
  },
};

// ═══════════════════════════════════════════════════════════════
//  MUST-LEARN 5 — if you only learn 5, learn these
// ═══════════════════════════════════════════════════════════════

export const MUST_LEARN = [
  "outside_smoke",
  "ramp_smoke",
  "a_main_pop_flash",
  "ct_outside_smoke",
  "ct_ramp_smoke",
];

// ═══════════════════════════════════════════════════════════════
//  COMBOS — 2-3 player named bundles
// ═══════════════════════════════════════════════════════════════

export const COMBOS = [
  {
    id: "outside_execute",
    name: "Outside Execute",
    site: "Outside",
    side: "T",
    desc: "Full outside takeover: smoke Heaven, molly the AWP off, push yard. The bread-and-butter Nuke T opener.",
    roundTypes: ["FULL", "FORCE"],
    callout: '"Outside execute. Heaven smoke, molly Heaven, push yard."',
    lineups: [
      { lineup: "outside_smoke", who: "Closest spawn — throw from T Roof" },
      { lineup: "outside_heaven_molly", who: "Second player on T Roof" },
      { lineup: "mini_smoke", who: "Same player as Heaven molly, or a third" },
    ],
    tip: "Smoke first, then molly. The smoke blocks their vision while the molly forces them off Heaven. Push yard together — don't trickle through one by one.",
  },
  {
    id: "a_site_push",
    name: "A Site Push (Squeaky)",
    site: "A",
    side: "T",
    desc: "Smoke Hut + pop flash through Squeaky. Simple two-player A take through the door.",
    roundTypes: ["FULL", "FORCE", "PISTOL"],
    callout: '"A push. Smoking Hut, flashing Squeaky, go go go."',
    lineups: [
      { lineup: "hut_smoke", who: "Player in Lobby — throw first" },
      { lineup: "a_main_pop_flash", who: "Second player at Squeaky door" },
    ],
    tip: "The Hut smoke must bloom BEFORE the flash. Flasher opens Squeaky, throws the flash, and the whole team pours through. Entry trades on contact.",
  },
  {
    id: "ramp_rush",
    name: "Ramp Rush",
    site: "B",
    side: "T",
    desc: "Smoke bottom of Ramp + pop flash from Lobby. Fast B take through Ramp.",
    roundTypes: ["FULL", "FORCE"],
    callout: '"Ramp rush. Smoking bottom, flashing, go."',
    lineups: [
      { lineup: "ramp_smoke", who: "Lead player at top of Ramp" },
      { lineup: "lobby_pop_flash", who: "Second player in Lobby" },
      { lineup: "ramp_he", who: "Third player — throw HE down Ramp before push" },
    ],
    tip: "The HE softens anyone holding close. Wait for the smoke and flash, then flood Ramp as 3-4. Don't stop on the stairs — commit fully or don't go.",
  },
  {
    id: "outside_lockdown",
    name: "Outside Lockdown",
    site: "Outside",
    side: "CT",
    desc: "CT spawn smoke blocks yard + Trophy molly prevents Trophy push. Shuts down the T outside game.",
    roundTypes: ["FULL"],
    callout: '"Outside lockdown. Smoking yard, mollying Trophy. Hold Heaven."',
    lineups: [
      { lineup: "ct_outside_smoke", who: "CT spawn player — throw first" },
      { lineup: "trophy_molly", who: "A site anchor from default position" },
    ],
    tip: "The smoke buys time for the Heaven AWP to set up. The Trophy molly prevents Ts from sneaking through Trophy while your smoke is up. Re-smoke if you have a second smoke.",
  },
  {
    id: "ramp_hold",
    name: "Ramp Hold",
    site: "B",
    side: "CT",
    desc: "Smoke + molly Ramp. Buys ~25 seconds of full Ramp denial. Your lifeline as a solo B anchor.",
    roundTypes: ["FULL"],
    callout: '"Ramp hold. Smoking Ramp, mollying behind it. I can hold alone."',
    lineups: [
      { lineup: "ct_ramp_smoke", who: "Solo B player from CT-side Ramp" },
      { lineup: "ct_ramp_molly", who: "Same player — throw molly through your smoke" },
    ],
    tip: "Smoke first, then immediately molly through it. Anyone pushing through the smoke takes fire damage. This combo alone lets one player hold B for half the round.",
  },
  {
    id: "a_retake",
    name: "A Site Retake",
    site: "A",
    side: "CT",
    desc: "Flash from Heaven over A site. Use the vertical advantage that makes Nuke retakes uniquely powerful.",
    roundTypes: ["FULL", "FORCE"],
    callout: '"A retake. Flashing from Heaven. Push on the flash."',
    lineups: [
      { lineup: "heaven_retake_flash", who: "Heaven/Catwalk player" },
    ],
    tip: "Push TOGETHER from multiple angles: Heaven, CT spawn, and Hut ladder. Nuke retakes are CT-favored because of the verticality — use it. Don't peek one at a time.",
  },
];

// ═══════════════════════════════════════════════════════════════
//  UTILITY BELTS — one player carries the full execute
//  Teammates drop their smoke(s) pre-round so the carrier has everything.
// ═══════════════════════════════════════════════════════════════

export const UTILITY_BELTS = [
  {
    id: "outside_belt",
    name: "Outside Utility Belt",
    site: "Outside",
    side: "T",
    desc: "One player carries the full outside execute: 2 smokes + 1 molly + 1 flash (exactly 4 grenades). Shuts down Heaven and Mini, then leads the push.",
    roundTypes: ["FULL"],
    callout: '"[Name]\'s outside belt. We push yard on their flash."',
    preRound:
      "Belt carrier buys 2 smokes + 1 molly + 1 flash. That's exactly 4 grenades — the CS2 carry cap. No teammate drops required.",
    sequence: [
      { lineup: "outside_smoke", step: 1, note: "From T Roof. Jump throw. Blocks Heaven." },
      { lineup: "mini_smoke", step: 2, note: "Same area on T Roof. Left click. Blocks Mini." },
      { lineup: "outside_heaven_molly", step: 3, note: "Jump throw. Flushes the AWP off Heaven." },
      { lineup: "a_main_pop_flash", step: 4, note: "Move to Squeaky. Pop flash. Team pushes on this." },
    ],
    teamRole:
      "Everyone else stages in Lobby and Yard. Push A site on the Squeaky flash. Two players can also push from outside through Main while the carrier opens Squeaky.",
  },
  {
    id: "ramp_belt",
    name: "Ramp Utility Belt",
    site: "B",
    side: "T",
    desc: "One player carries the full Ramp execute: 1 smoke + 1 molly + 1 HE + 1 flash (exactly 4 grenades). Controls Ramp and leads the B push.",
    roundTypes: ["FULL"],
    callout: '"[Name]\'s ramp belt. We push B on their flash."',
    preRound:
      "Belt carrier buys 1 smoke + 1 molly + 1 HE + 1 flash. That's exactly 4 grenades — the CS2 carry cap. No teammate drops required.",
    sequence: [
      { lineup: "ramp_smoke", step: 1, note: "Top of Ramp. Jump throw. Covers bottom." },
      { lineup: "ramp_sandbags_molly", step: 2, note: "Left click. Burns sandbags position." },
      { lineup: "ramp_he", step: 3, note: "Left click. Softens anyone holding close." },
      { lineup: "lobby_pop_flash", step: 4, note: "Pop flash from Lobby. Team pushes on this." },
    ],
    teamRole:
      "Everyone else stages at top of Ramp. Push down together on the flash. Post-plant positions: Secret, Vents, and Ramp corners.",
  },
];

// ═══════════════════════════════════════════════════════════════
//  SCENARIOS — basic-knowledge reminders (no lineups)
// ═══════════════════════════════════════════════════════════════

export const SCENARIOS = [
  {
    id: "upper_vs_lower",
    title: "Upper vs Lower — where to commit",
    side: "T",
    bullets: [
      "Nuke is a vertical map. Committing upper (A) or lower (B) is the BIGGEST decision each round. Make it early.",
      "Default: send 2 outside, 2 lobby, 1 lurk. Read the CT setup in the first 30 seconds, THEN commit.",
      "If CTs are stacking upper (2-3 Heaven/A), go B through Ramp. If they're stacking lower, take outside control and push A.",
      "Don't split upper AND lower with 2-3 each — you'll lose both fights. Commit 4 to one level and leave 1 lurk.",
    ],
  },
  {
    id: "secret_rotate",
    title: "Rotating through Secret",
    side: "T",
    bullets: [
      "Secret connects Outside (upper) to B site (lower). It's the fastest T-side rotate between levels.",
      "Taking outside control first is REQUIRED before using Secret. Never walk into Secret blind.",
      "Secret is narrow — one CT with a shotgun or molly can shut it down. Clear it with a flash or have a teammate watch your back.",
      "Use Secret for late-round rotates when CTs have committed to holding Ramp. They won't expect a B push from Secret.",
    ],
  },
  {
    id: "outside_control",
    title: "Outside control tips",
    side: "T",
    bullets: [
      "Outside control is the key to T-side Nuke. It unlocks pushes to A via Main, rotates to B via Secret, and forces CT rotations.",
      "ALWAYS smoke Heaven before pushing out. The AWP from Heaven will end your round before it starts.",
      "Take yard in PAIRS. One player watches Mini, the other watches Main/Hut. Solo yard pushes get traded.",
      "Once you have yard, you control the round tempo. You can push A, go Secret to B, or fake and rotate. CTs have to guess.",
    ],
  },
  {
    id: "post_plant_a",
    title: "Post-plant on A site (upper)",
    side: "T",
    bullets: [
      "After planting A, spread to Trophy, Hut, and outside Main. CTs retake from Heaven and CT spawn — don't stack one spot.",
      "Heaven is the biggest retake threat. Keep a player watching the Heaven angles.",
      "If you have a molly, save it for the bomb. Molly the defuser — the vertical layout means CTs often have to expose themselves to defuse.",
      "Don't ego-peek Heaven. Let them come down to you.",
    ],
  },
  {
    id: "eco_round_t",
    title: "Eco round (T side)",
    side: "T",
    bullets: [
      "Don't buy util. Buy armor ($650 kevlar) and stick with the Glock or grab a P250.",
      "Rush Ramp as 5 — close-quarters fights favor pistols against rifles. Ramp is the tightest space on the map.",
      "Don't try to take outside on an eco. The open sightlines favor CT rifles.",
    ],
  },
  {
    id: "force_round_t",
    title: "Force buy (T side)",
    side: "T",
    bullets: [
      "MAC-10 + armor + 1 flash. Nuke's tight corridors are perfect for SMG force buys.",
      "Rush Ramp or Squeaky — both are close-range fights where MAC-10s shine.",
      "Don't buy rifles on a force. If you can't afford AK + armor + util, go MAC-10.",
    ],
  },
  {
    id: "pistol_round",
    title: "Pistol round basics",
    side: "T",
    bullets: [
      "Buy kevlar ($650). You have $150 left — not enough for utility. Skip nades entirely.",
      "Rush one site as 5. Nuke pistol rounds are won by numbers, not strategy.",
      "Ramp rush is the most reliable pistol strat. The close quarters negate the CT-side USP advantage at range.",
    ],
  },
  {
    id: "solo_anchor_ramp",
    title: "Solo anchoring Ramp (CT)",
    side: "CT",
    bullets: [
      "Smoke + molly Ramp. That combo buys ~25 seconds — almost half the round.",
      "After your util is spent, fall back to B site or Secret. Do NOT dry-peek Ramp without util.",
      "Call early. The moment you hear multiple footsteps in Ramp, say 'they're coming B' so your team can rotate.",
      "Playing retake from Secret is often better than dying on Ramp for info you could've gotten with sound.",
    ],
  },
  {
    id: "heaven_positioning",
    title: "Heaven / Catwalk positioning (CT)",
    side: "CT",
    bullets: [
      "Heaven is the most powerful CT position on Nuke. The vertical advantage means Ts MUST smoke or molly you off before pushing.",
      "Don't over-peek. Hold a passive angle and let them walk into your crosshair.",
      "If they smoke Heaven, REPOSITION. Don't sit in the smoke hoping for a lucky kill — move to Mini or Radio.",
      "Keep a flash for retake if they push through. A Heaven flash into A site is devastating.",
    ],
  },
  {
    id: "ct_eco",
    title: "Eco round (CT side)",
    side: "CT",
    bullets: [
      "Stack Ramp with all 5. The close quarters give pistols a fighting chance.",
      "MP9 + armor if you can afford it. Nuke's tight spaces are SMG paradise.",
      "Don't try to hold outside on an eco. The open sightlines will get you killed before you see anyone.",
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
    id: "t_roof",
    name: "T Roof",
    side: "T",
    area: "A",
    pos: { worldX: -1243.491, worldY: -1142.971 },
    lineups: ["outside_smoke", "mini_smoke", "outside_heaven_molly"],
    tip: "The single most important T-side spot on Nuke. All outside control utility comes from here.",
  },
  {
    id: "lobby_center",
    name: "Lobby",
    side: "T",
    area: "A",
    pos: { x: 47, y: 49 },
    lineups: ["hut_smoke"],
    tip: "Smoke Hut from Lobby to isolate the A site defender. Push through Squeaky after.",
  },
  {
    id: "squeaky_door",
    name: "Squeaky Door",
    side: "T",
    area: "A",
    pos: { worldX: 160.035, worldY: -1119.958 },
    lineups: ["a_main_pop_flash"],
    tip: "Pop flash through Squeaky and rush A site. The door sound tells CTs you're coming — speed is everything.",
  },
  {
    id: "t_ramp_top",
    name: "Top of Ramp",
    side: "T",
    area: "B",
    pos: { worldX: 251.969, worldY: -353.561 },
    lineups: ["ramp_smoke", "ramp_sandbags_molly", "ramp_he"],
    tip: "All Ramp control utility comes from here. Smoke + molly + HE, then push down as a group.",
  },
  {
    id: "lobby_ramp_entrance",
    name: "Lobby (Ramp Side)",
    side: "T",
    area: "B",
    pos: { worldX: 251.968, worldY: -463.969 },
    lineups: ["lobby_pop_flash"],
    tip: "Pop flash from Lobby to support the Ramp push. Throw as your team starts moving down.",
  },
  // ─── CT-SIDE ───────────────────────────────────────────────
  {
    id: "ct_spawn",
    name: "CT Spawn",
    side: "CT",
    area: "A",
    pos: { worldX: 1811.547, worldY: -728.617 },
    lineups: ["ct_outside_smoke"],
    tip: "Foundation CT smoke. Throw this every round to delay the T outside push.",
  },
  {
    id: "heaven_catwalk",
    name: "Heaven / Catwalk",
    side: "CT",
    area: "A",
    pos: { x: 41, y: 29 },
    lineups: ["heaven_retake_flash"],
    tip: "The most powerful CT position on Nuke. Flash over A site for devastating retakes.",
  },
  {
    id: "a_site_ct_defender",
    name: "A Site (Defender)",
    side: "CT",
    area: "A",
    pos: { worldX: 1012.198, worldY: -457.969 },
    lineups: ["trophy_molly"],
    tip: "Molly Trophy to prevent T pushes through that corridor. Also strong for retake clears.",
  },
  {
    id: "ramp_ct_side",
    name: "Ramp (CT Side)",
    side: "CT",
    area: "B",
    pos: { worldX: 251.969, worldY: -463.969 },
    lineups: ["ct_ramp_smoke", "ct_ramp_molly"],
    tip: "Smoke + molly buys ~25 seconds. Your lifeline as a solo Ramp anchor.",
  },
  {
    id: "secret_passage",
    name: "Secret Passage",
    side: "CT",
    area: "B",
    pos: { worldX: 850.054, worldY: -677.206 },
    lineups: ["ct_b_retake_flash"],
    tip: "Flash into B from Secret for retake. Ts expect the push from Ramp — Secret catches them off guard.",
  },
];

export const SPAWNS = {
  T: [
    { id: 1, name: "Spawn 1 (Roof Left)",   pos: { x: 53, y: 51 }, lineups: ["outside_smoke"] },
    { id: 2, name: "Spawn 2 (Roof Right)",  pos: { x: 57, y: 51 }, lineups: [] },
    { id: 3, name: "Spawn 3 (Roof Center)", pos: { x: 55, y: 51 }, lineups: [] },
    { id: 4, name: "Spawn 4 (Back)",        pos: { x: 35, y: 26 }, lineups: [] },
    { id: 5, name: "Spawn 5 (Lobby)",       pos: { x: 49, y: 52 }, lineups: [] },
  ],
  CT: [
    { id: 1, name: "Spawn 1 (Back Left)",   pos: { x: 34, y: 28 }, lineups: ["ct_outside_smoke"] },
    { id: 2, name: "Spawn 2 (Center)",      pos: { x: 36, y: 28 }, lineups: [] },
    { id: 3, name: "Spawn 3 (Right)",       pos: { x: 38, y: 28 }, lineups: [] },
    { id: 4, name: "Spawn 4 (Back)",        pos: { x: 54, y: 34 }, lineups: [] },
    { id: 5, name: "Spawn 5 (Heaven)",      pos: { x: 40, y: 28 }, lineups: [] },
  ],
};
