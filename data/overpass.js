/*
  CS2 OVERPASS — DATA MODULE

  All lineup data, combos, utility belts, and scenarios for Overpass.
  Kept separate from the main JSX file so we can scale to more maps
  without bloating the component file.

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

export const MAP_NAME = "Overpass";

export const RADAR_URL =
  "https://raw.githubusercontent.com/MurkyYT/cs2-map-icons/main/images/radars/de_overpass_radar_psd.png";

import { ytSearch } from "./youtube.js";

const yt = (q) => ytSearch("overpass", q);

// ═══════════════════════════════════════════════════════════════
//  LINEUPS DATABASE
// ═══════════════════════════════════════════════════════════════

export const LINEUPS = {
  // ─── T-SIDE B ─────────────────────────────────────────────
  bathrooms_b_heaven_smoke: {
    id: "bathrooms_b_heaven_smoke",
    name: "B Heaven Smoke (from Bathrooms)",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "B",
    mustLearn: true,
    purpose:
      "Blocks the CT AWP on Heaven/Bridge overlooking B site. THE most critical T-side B smoke — without it the Heaven player shuts down your entire push.",
    stand: "Inside Bathrooms, back-left corner against the wall near the doorway to B Short.",
    aim: "Look up through the gap above the doorframe. Align crosshair with the left edge of the overhead pipe.",
    notes:
      "Jump throw. Whoever has the closest spawn to Bathrooms throws this. Must land before CTs set up on Heaven.",
    source: {
      name: "BLAST.tv",
      url: "https://blast.tv/article/cs2-overpass-smokes",
    },
    video: yt("bathrooms b heaven smoke"),
    screenshots: {
        stand: "https://assets.cs2util.com/overpass/smoke/heaven-smoke-from-water-lineup-mini.webp",
        aim: "https://assets.cs2util.com/overpass/smoke/heaven-smoke-from-water-lineup.webp",
        result: "https://assets.cs2util.com/overpass/smoke/heaven-smoke-from-water-cover.webp",
      },
    radarPos: { worldX: -1731.969, worldY: -704.031 },
    radarTarget: { x: 54.785, y: 22.852 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  monster_smoke: {
    id: "monster_smoke",
    name: "Monster Exit Smoke",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "B",
    mustLearn: true,
    purpose:
      "Smokes the Monster tunnel exit to allow safe passage onto B site. Blocks the CT angle from Barrels/Pillar.",
    stand: "Inside Monster tunnel, top of the stairs before the exit.",
    aim: "Aim at the top-right corner of the Monster exit archway, just below the brick ledge.",
    notes:
      "Jump throw. Throw this before pushing out — CTs love holding the Monster exit with an M4.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-overpass-utility-guide/",
    },
    video: yt("monster exit smoke"),
    screenshots: {
        stand: "https://assets.cs2util.com/overpass/smoke/b-site/bridge-smoke-from-water-lineup-mini.webp",
        aim: "https://assets.cs2util.com/overpass/smoke/b-site/bridge-smoke-from-water-lineup.webp",
        result: "https://assets.cs2util.com/overpass/smoke/b-site/bridge-smoke-from-water-cover.webp",
      },
    radarPos: { worldX: -1559.971, worldY: -1087.844 },
    radarTarget: { x: 67.676, y: 36.328 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  a_long_smoke: {
    id: "a_long_smoke",
    name: "A Long Smoke",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "A",
    mustLearn: true,
    purpose:
      "Blocks the deep CT angle on Long A, preventing CTs from holding the long sightline with rifles or AWPs.",
    stand: "T side of Long A, behind the dumpster against the left wall.",
    aim: "Look up at the roofline above the far end of Long. Place crosshair on the antenna tip.",
    notes:
      "Jump throw. Pair with the Bank smoke for a full Long A isolation. Push together after both bloom.",
    source: {
      name: "CS2Pulse",
      url: "https://cs2pulse.com/smokes/overpass/",
    },
    video: yt("a long smoke"),
    screenshots: {
        stand: "https://assets.cs2util.com/overpass/smoke/bins/bins-smoke-from-a-long-lineup-mini.webp",
        aim: "https://assets.cs2util.com/overpass/smoke/bins/bins-smoke-from-a-long-lineup.webp",
        result: "https://assets.cs2util.com/overpass/smoke/bins/bins-smoke-from-a-long-cover.webp",
      },
    radarPos: { worldX: -3733.859, worldY: -157.04 },
    radarTarget: { x: 48, y: 24 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  connector_smoke_t: {
    id: "connector_smoke_t",
    name: "Connector Smoke (T side)",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "Connector",
    purpose:
      "Blocks CTs rotating through Connector. Isolates A or B site so CTs can't push through the middle of the map.",
    stand: "Outside Connector entrance on T side, right side of the doorway against the wall.",
    aim: "Look up at the overhead beam inside Connector. Align crosshair with the crack in the ceiling tile.",
    notes:
      "Jump throw. Useful for both A and B executes — prevents CT flanks through the middle.",
    source: {
      name: "Profilerr",
      url: "https://profilerr.net/cs2-overpass-smoke-spots/",
    },
    video: yt("connector smoke t side"),
    screenshots: {
        stand: "https://assets.cs2util.com/overpass/smoke/mid/outside-conn-smoke-from-t-spawn-lineup-mini.webp",
        aim: "https://assets.cs2util.com/overpass/smoke/mid/outside-conn-smoke-from-t-spawn-lineup.webp",
        result: "https://assets.cs2util.com/overpass/smoke/mid/outside-conn-smoke-from-t-spawn-cover.webp",
      },
    radarPos: { worldX: -432.031, worldY: -2681.968 },
    radarTarget: { x: 32.031, y: 50.293 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  b_site_pop_flash: {
    id: "b_site_pop_flash",
    name: "B Site Pop Flash (from Water)",
    util: "FLASH",
    throw: "RMB",
    side: "T",
    area: "B",
    purpose: "Blinds CTs holding B site as your team pushes from Water/Short. Pops instantly off the wall.",
    stand: "Water area, at the bottom of the stairs leading up to B Short.",
    aim: "Face B Short exit. Aim at the top of the archway above the short stairs.",
    notes:
      "Right-click underhand throw. The flash bounces off the wall and pops instantly — CTs on site can't react. Push the moment it leaves your hand.",
    source: {
      name: "BLAST.tv",
      url: "https://blast.tv/article/cs2-overpass-smokes",
    },
    video: yt("b site pop flash water"),
    screenshots: {
        stand: "https://assets.cs2util.com/overpass/flash/b-site/pillar-flash-from-water-lineup-mini.webp",
        aim: "https://assets.cs2util.com/overpass/flash/b-site/pillar-flash-from-water-lineup.webp",
        result: "https://assets.cs2util.com/overpass/flash/b-site/pillar-flash-from-water-cover.webp",
      },
    radarPos: { worldX: -1558.755, worldY: -729.449 },
    radarTarget: { x: 68.555, y: 25.879 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  a_long_molly: {
    id: "a_long_molly",
    name: "A Long Default Molotov",
    util: "MOLLY",
    throw: "LMB",
    side: "T",
    area: "A",
    purpose:
      "Burns the default CT position on Long A behind the truck. Forces the defender to fall back or take damage.",
    stand: "Long A, behind the dumpster on the left side.",
    aim: "Arc the molotov high toward the truck position at the end of Long A.",
    notes:
      "Left-click throw. Lands behind the truck where CTs love to sit. Follow up immediately — they'll be repositioning.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-overpass-utility-guide/",
    },
    video: yt("a long molly default"),
    screenshots: {
        stand: "https://assets.cs2util.com/overpass/molotov/a-site/a-truck-molotov-from-a-long-lineup-mini.webp",
        aim: "https://assets.cs2util.com/overpass/molotov/a-site/a-truck-molotov-from-a-long-lineup.webp",
        result: "https://assets.cs2util.com/overpass/molotov/a-site/a-truck-molotov-from-a-long-cover.webp",
      },
    radarPos: { worldX: -3305.844, worldY: 186.588 },
    radarTarget: { x: 48, y: 24 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  bank_smoke: {
    id: "bank_smoke",
    name: "Bank Smoke (from Long)",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "A",
    purpose:
      "Blocks the Bank position overlooking Long A. Prevents CTs from crossfiring with the Long player.",
    stand: "Long A approach, left side against the wall near the dumpster.",
    aim: "Look up toward Bank. Align crosshair with the bottom edge of the billboard on the building face.",
    notes:
      "Jump throw. Pair with A Long smoke to fully isolate the push onto A site.",
    source: {
      name: "CS2Pulse",
      url: "https://cs2pulse.com/smokes/overpass/",
    },
    video: yt("bank smoke from long a"),
    screenshots: {
        stand: "https://assets.cs2util.com/overpass/smoke/bank/bank-smoke-from-long-lineup-mini.webp",
        aim: "https://assets.cs2util.com/overpass/smoke/bank/bank-smoke-from-long-lineup.webp",
        result: "https://assets.cs2util.com/overpass/smoke/bank/bank-smoke-from-long-cover.webp",
      },
    radarPos: { worldX: -3365.774, worldY: -364.468 },
    radarTarget: { x: 46, y: 32 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  a_site_flash: {
    id: "a_site_flash",
    name: "A Site Entry Flash",
    util: "FLASH",
    throw: "LMB",
    side: "T",
    area: "A",
    purpose:
      "Full-throw flash over A site. Blinds CTs holding Truck, Default, and Bank as your team pushes Long.",
    stand: "Long A, mid-corridor before the site opens up.",
    aim: "Aim high above the roofline. Full throw so it pops over the buildings above site.",
    notes: "Left-click throw. Call 'flashing A' before throwing. Team pushes on the pop.",
    source: {
      name: "BLAST.tv",
      url: "https://blast.tv/article/cs2-overpass-smokes",
    },
    video: yt("a site entry flash long"),
    screenshots: {
        stand: "https://assets.cs2util.com/overpass/flash/a-site/tree-flash-from-playground-lineup-mini.webp",
        aim: "https://assets.cs2util.com/overpass/flash/a-site/tree-flash-from-playground-lineup.webp",
        result: "https://assets.cs2util.com/overpass/flash/a-site/tree-flash-from-playground-cover.webp",
      },
    radarPos: { worldX: -2588.313, worldY: -2591.969 },
    radarTarget: { x: 60, y: 28 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  b_pillar_molly: {
    id: "b_pillar_molly",
    name: "B Pillar Molotov",
    util: "MOLLY",
    throw: "LMB",
    side: "T",
    area: "B",
    purpose:
      "Burns out CTs hiding behind the Pillar on B site. Forces them to reposition or take damage.",
    stand: "Monster tunnel exit, pressed against the right wall.",
    aim: "Arc the molotov toward the Pillar position on B site — aim at the base of the pillar.",
    notes:
      "Left-click throw. Throw after your Monster smoke blooms to clear close angles safely.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-overpass-utility-guide/",
    },
    video: yt("b pillar molly monster"),
    screenshots: {
        stand: "https://assets.cs2util.com/overpass/molotov/b-site/barrels-molotov-from-tracks-lineup-mini.webp",
        aim: "https://assets.cs2util.com/overpass/molotov/b-site/barrels-molotov-from-tracks-lineup.webp",
        result: "https://assets.cs2util.com/overpass/molotov/b-site/barrels-molotov-from-tracks-cover.webp",
      },
    radarPos: { worldX: -499.97, worldY: -1551.968 },
    radarTarget: { x: 35, y: 42 },
    austincs: { video: "", timestamp: "", note: "" },
  },



  // ─── CT-SIDE ──────────────────────────────────────────────
  ct_monster_smoke: {
    id: "ct_monster_smoke",
    name: "Monster Smoke (from B Site)",
    util: "SMOKE",
    throw: "LMB",
    side: "CT",
    area: "B",
    mustLearn: true,
    purpose:
      "Blocks the Monster exit from B site. Foundation CT B defense — throw this every round to deny free Monster pushes.",
    stand: "B site, behind the Pillar position looking toward Monster.",
    aim: "Aim at the top of the Monster archway. Left-click throw — lands right in the exit.",
    notes:
      "Left-click, no jump. Re-smoke as needed. Pair with an incendiary behind the smoke to punish pushes.",
    source: {
      name: "BLAST.tv",
      url: "https://blast.tv/article/cs2-overpass-smokes",
    },
    video: yt("ct monster smoke b site"),
    screenshots: {
        stand: "https://assets.cs2util.com/overpass/smoke/b-site/monster-smoke-from-b-site-lineup-mini.webp",
        aim: "https://assets.cs2util.com/overpass/smoke/b-site/monster-smoke-from-b-site-lineup.webp",
        result: "https://assets.cs2util.com/overpass/smoke/b-site/monster-smoke-from-b-site-cover.webp",
      },
    radarPos: { worldX: -1464.279, worldY: -14.452 },
    radarTarget: { x: 40, y: 52 },
    austincs: { video: "", timestamp: "", note: "" },
  },


  ct_long_a_molly: {
    id: "ct_long_a_molly",
    name: "Long A Molotov (Anti-Push)",
    util: "MOLLY",
    throw: "LMB",
    side: "CT",
    area: "A",
    purpose:
      "Burns the Long A approach to delay T pushes. Buys ~7 seconds for your team to rotate or set up crossfires.",
    stand: "A site, behind Truck or the default box position.",
    aim: "Arc the molotov down Long A — aim at the ground past the dumpster.",
    notes:
      "Smoke + molly combo. Throw molly behind your Long smoke for ~25 seconds of total denial.",
    source: {
      name: "Profilerr",
      url: "https://profilerr.net/cs2-overpass-smoke-spots/",
    },
    video: yt("ct long a molly anti push"),
    screenshots: {
        stand: "https://assets.cs2util.com/overpass/molotov/water/short-tunnel-molotov-from-a-short-lineup-mini.webp",
        aim: "https://assets.cs2util.com/overpass/molotov/water/short-tunnel-molotov-from-a-short-lineup.webp",
        result: "https://assets.cs2util.com/overpass/molotov/water/short-tunnel-molotov-from-a-short-cover.webp",
      },
    radarPos: { worldX: -2361.8, worldY: 131.803 },
    radarTarget: { x: 48, y: 28 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_b_short_flash: {
    id: "ct_b_short_flash",
    name: "B Short Retake Flash",
    util: "FLASH",
    throw: "LMB",
    side: "CT",
    area: "B",
    purpose:
      "Flash over the wall into B site from Short. Catches Ts in post-plant off guard — they expect attacks from Heaven, not Short.",
    stand: "Rotating from CT/Connector toward B Short.",
    aim: "Full throw flash high over the B Short wall into site.",
    notes: "Call 'flashing B' first. Throw flash, count 1, push together. Two-person retake minimum.",
    source: {
      name: "BLAST.tv",
      url: "https://blast.tv/article/cs2-overpass-smokes",
    },
    video: yt("ct b short retake flash"),
    screenshots: {
        stand: "https://assets.cs2util.com/overpass/flash/mid/lower-tunnels-flash-from-b-short-lineup-mini.webp",
        aim: "https://assets.cs2util.com/overpass/flash/mid/lower-tunnels-flash-from-b-short-lineup.webp",
        result: "https://assets.cs2util.com/overpass/flash/mid/lower-tunnels-flash-from-b-short-cover.webp",
      },
    radarPos: { worldX: -1039.171, worldY: -514.462 },
    radarTarget: { x: 38, y: 38 },
    austincs: { video: "", timestamp: "", note: "" },
  },


  ct_monster_molly: {
    id: "ct_monster_molly",
    name: "Monster Incendiary (Anti-Push)",
    util: "MOLLY",
    throw: "LMB",
    side: "CT",
    area: "B",
    purpose:
      "Burns the Monster exit behind your smoke. Punishes Ts who push through the smoke — they take fire before they can see.",
    stand: "B site, behind Pillar or the default position.",
    aim: "Arc the incendiary into the Monster exit, behind your Monster smoke.",
    notes:
      "Smoke + molly combo. Buys ~25 seconds of total Monster denial.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-overpass-utility-guide/",
    },
    video: yt("ct monster molly incendiary"),
    screenshots: {
        stand: "https://assets.cs2util.com/overpass/molotov/water/short-tunnel-molotov-from-b1-lineup-mini.webp",
        aim: "https://assets.cs2util.com/overpass/molotov/water/short-tunnel-molotov-from-b1-lineup.webp",
        result: "https://assets.cs2util.com/overpass/molotov/water/short-tunnel-molotov-from-b1-cover.webp",
      },
    radarPos: { worldX: -2014.715, worldY: 154.033 },
    radarTarget: { x: 40, y: 55 },
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
      "Flash over A site from CT spawn side. Catches Ts in post-plant — they expect pushes from Long, not CT.",
    stand: "CT spawn, approaching A site from behind.",
    aim: "Full throw flash high over the A site buildings.",
    notes: "Call 'flashing A' first. Push together on the pop — lone peeks lose retakes.",
    source: {
      name: "Profilerr",
      url: "https://profilerr.net/cs2-overpass-smoke-spots/",
    },
    video: yt("ct a retake flash"),
    screenshots: {
        stand: "https://assets.cs2util.com/overpass/flash/a-site/a-site-retake-flash-from-bins-lineup-mini.webp",
        aim: "https://assets.cs2util.com/overpass/flash/a-site/a-site-retake-flash-from-bins-lineup.webp",
        result: "https://assets.cs2util.com/overpass/flash/a-site/a-site-retake-flash-from-bins-cover.webp",
      },
    radarPos: { worldX: -2022.818, worldY: 1135.444 },
    radarTarget: { x: 60, y: 28 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_water_smoke: {
    id: "ct_water_smoke",
    name: "Water/Sewers Smoke (from B Site)",
    util: "SMOKE",
    throw: "LMB",
    side: "CT",
    area: "B",
    purpose:
      "Blocks T pushes from Water/Sewers up through B Short. Denies the secondary B approach route.",
    stand: "B site, near the Fountain looking toward Short/Water.",
    aim: "Aim at the top of the B Short entrance from Water. Left-click throw.",
    notes:
      "Useful when you hear footsteps in Water. Pair with Monster smoke for full B lockdown.",
    source: {
      name: "CS2Pulse",
      url: "https://cs2pulse.com/smokes/overpass/",
    },
    video: yt("ct water sewers smoke b site"),
    screenshots: {
        stand: "https://assets.cs2util.com/overpass/smoke/water/fast-short-tunnel-smoke-from-ct-spawn-lineup-mini.webp",
        aim: "https://assets.cs2util.com/overpass/smoke/water/fast-short-tunnel-smoke-from-ct-spawn-lineup.webp",
        result: "https://assets.cs2util.com/overpass/smoke/water/fast-short-tunnel-smoke-from-ct-spawn-cover.webp",
      },
    radarPos: { worldX: -2116.461, worldY: 993.141 },
    radarTarget: { x: 68.164, y: 50.098 },
    austincs: { video: "", timestamp: "", note: "" },
  },
};

// ═══════════════════════════════════════════════════════════════
//  MUST-LEARN 5 — if you only learn 5, learn these
// ═══════════════════════════════════════════════════════════════

export const MUST_LEARN = [
  "bathrooms_b_heaven_smoke",
  "a_long_smoke",
  "monster_smoke",
  "ct_monster_smoke",
];

// ═══════════════════════════════════════════════════════════════
//  COMBOS — 2-3 player named bundles
// ═══════════════════════════════════════════════════════════════

export const COMBOS = [
  {
    id: "b_monster_push",
    name: "Monster B Execute",
    site: "B",
    side: "T",
    desc: "Heaven smoke + Monster smoke + pop flash. Opens B site from Monster side. Bread and butter B hit.",
    roundTypes: ["FULL", "FORCE"],
    callout: '"Monster B. Heaven smoke, Monster smoke, flash and go."',
    lineups: [
      { lineup: "bathrooms_b_heaven_smoke", who: "Closest to Bathrooms" },
      { lineup: "monster_smoke",            who: "First player in Monster tunnel" },
      { lineup: "b_site_pop_flash",         who: "Anyone with a flash, from Water" },
    ],
    tip: "Wait for BOTH smokes to bloom before the flash. Entry trades on contact — don't peek Heaven until it's smoked.",
  },
  
  {
    id: "a_long_take",
    name: "A Long Take",
    site: "A",
    side: "T",
    desc: "Long smoke + Bank smoke + entry flash. Full Long A isolation for a clean site take.",
    roundTypes: ["FULL", "FORCE"],
    callout: '"A Long. Smoke long, smoke bank, flash and push."',
    lineups: [
      { lineup: "a_long_smoke",  who: "First player at the dumpster" },
      { lineup: "bank_smoke",    who: "Same player or second with a smoke" },
      { lineup: "a_site_flash",  who: "Anyone with a flash, mid-corridor" },
    ],
    tip: "Push as a pack after the flash pops. Don't peek individually — trade kills win A takes.",
  },
  
  {
    id: "b_water_split",
    name: "B Water Split",
    site: "B",
    side: "T",
    desc: "Connector smoke + pop flash from Water. Hit B through Water/Short while denying CT rotations.",
    roundTypes: ["FULL"],
    callout: '"Water split B. Connector smoked, flashing short, push B."',
    lineups: [
      { lineup: "connector_smoke_t", who: "Anyone near Connector entrance" },
      { lineup: "b_site_pop_flash",  who: "Point player in Water" },
    ],
    tip: "The Connector smoke prevents CT rotations. Hit B fast before they re-smoke or rotate through Park.",
  },
  
  {
    id: "ct_b_lockdown",
    name: "B Site Lockdown",
    site: "B",
    side: "CT",
    desc: "Monster smoke + Monster molly + Water smoke. Shuts down both B approaches for ~25 seconds.",
    roundTypes: ["FULL"],
    callout: '"B lockdown. Monster smoked and mollied, Water smoked. Hold angles."',
    lineups: [
      { lineup: "ct_monster_smoke", who: "B anchor, from Pillar" },
      { lineup: "ct_monster_molly", who: "Same player, right after smoke" },
      { lineup: "ct_water_smoke",   who: "Second B player or rotator" },
    ],
    tip: "Don't peek until your molly burns out. Let the util do the work — hold passive angles.",
  },
  
  {
    id: "retake_b",
    name: "B Site Retake",
    site: "B",
    side: "CT",
    desc: "Flash from B Short + push together. Catch Ts in post-plant positions.",
    roundTypes: ["FULL", "FORCE"],
    callout: '"B retake. Flashing from Short. Push on the pop — together."',
    lineups: [
      { lineup: "ct_b_short_flash", who: "Rotator from CT/Connector" },
    ],
    tip: "Push TOGETHER. Lone peeks lose retakes 80% of the time at our rank. If you have an HE, throw at the bomb before peeking.",
  },
  
  {
    id: "retake_a",
    name: "A Site Retake",
    site: "A",
    side: "CT",
    desc: "Flash from CT spawn + push together. Catch Ts off guard from behind.",
    roundTypes: ["FULL", "FORCE"],
    callout: '"A retake. Flashing from CT. Push together on 3."',
    lineups: [
      { lineup: "ct_a_retake_flash", who: "Rotator from CT spawn" },
    ],
    tip: "Ts expect you from Long, not CT. Use that surprise angle. Push together — never solo.",
  },
];

// ═══════════════════════════════════════════════════════════════
//  UTILITY BELTS — one player carries the full execute
//  Teammates drop their smoke(s) pre-round so the carrier has everything.
// ═══════════════════════════════════════════════════════════════

export const UTILITY_BELTS = [
  {
    id: "b_belt",
    name: "B Site Utility Belt",
    site: "B",
    side: "T",
    desc: "One player carries the full B execute: Heaven smoke + Monster smoke + Pillar molly + pop flash (exactly 4 grenades).",
    roundTypes: ["FULL"],
    callout: '"[Name]\'s B belt. We push on their flash."',
    preRound:
      "Belt carrier buys 2 smokes + 1 molly + 1 flash. That's exactly 4 grenades — the CS2 carry cap. No teammate drops required.",
    sequence: [
      { lineup: "bathrooms_b_heaven_smoke", step: 1, note: "From Bathrooms corner. Jump throw. Blocks Heaven AWP." },
      { lineup: "monster_smoke",            step: 2, note: "Top of Monster stairs. Jump throw. Blocks site angles." },
      { lineup: "b_pillar_molly",           step: 3, note: "From Monster exit. Flushes the Pillar player." },
      { lineup: "b_site_pop_flash",         step: 4, note: "Flash from Water. Team pushes on the pop." },
    ],
    teamRole:
      "Everyone else stages in Monster tunnel and Water. Push on the flash pop. Post-plant behind Pillar, Barrels, or in Water watching Short.",
  },
  
  {
    id: "a_belt",
    name: "A Site Utility Belt",
    site: "A",
    side: "T",
    desc: "One player carries the full A Long execute: Long smoke + Bank smoke + Long molly + entry flash (exactly 4 grenades).",
    roundTypes: ["FULL"],
    callout: '"[Name]\'s A belt. We push on their flash."',
    preRound:
      "Belt carrier buys 2 smokes + 1 molly + 1 flash. That's exactly 4 grenades — the CS2 carry cap. No teammate drops required.",
    sequence: [
      { lineup: "a_long_smoke",  step: 1, note: "From behind dumpster. Jump throw. Blocks deep CT." },
      { lineup: "bank_smoke",    step: 2, note: "Same position. Jump throw. Blocks Bank crossfire." },
      { lineup: "a_long_molly",  step: 3, note: "Arc toward truck. Flushes default position." },
      { lineup: "a_site_flash",  step: 4, note: "Full throw flash over site. Team pushes on pop." },
    ],
    teamRole:
      "Everyone else pushes Long behind the belt carrier. Entry first, everyone trades. Post-plant at Truck, Default, or back Long.",
  },
];

// ═══════════════════════════════════════════════════════════════
//  SCENARIOS — basic-knowledge reminders (no lineups)
// ═══════════════════════════════════════════════════════════════

export const SCENARIOS = [
  {
    id: "monster_vs_connector",
    title: "Monster vs Connector — which to control first?",
    side: "T",
    bullets: [
      "Monster gives direct B site access but is narrow and easy to molly/smoke. It's a commitment — once you're in Monster, you're hitting B.",
      "Connector gives mid-map control and lets you split to either site, but CTs often stack it with utility.",
      "Default: send 1-2 to take Connector control (info), keep 3 near Bathrooms/Water. If Connector is free, split B through Short. If it's stacked, hit through Monster.",
      "Don't commit 5 to Monster early — one molly kills the entire push. Use smokes to clear the exit first.",
    ],
  },
  {
    id: "water_timing_push",
    title: "Water/Sewer timing push",
    side: "T",
    bullets: [
      "Water has a timing window: if you push fast at round start, you can beat the CT rotation to B Short. This only works once or twice before CTs adapt.",
      "Listen for footsteps in the pipe — if you hear nothing, CTs might be late and you have a free push.",
      "Smoke Connector before pushing Water to prevent a CT crossfire. Water pushes without Connector control are suicide.",
      "After a successful Water push, plant for Short/Water so you can hold the post-plant from below.",
    ],
  },
  {
    id: "heaven_control",
    title: "Heaven/Bridge is the key to B",
    side: "T",
    bullets: [
      "Heaven overlooking B site is the strongest CT position on the map. If you don't smoke it, the CT there gets 2-3 free kills.",
      "ALWAYS smoke Heaven before pushing B. The Bathrooms Heaven smoke is the single most important T-side lineup on Overpass.",
      "After taking B site, watch Heaven — CTs love to re-peek it during retakes. Keep one player watching the angle.",
    ],
  },
  {
    id: "post_plant_b",
    title: "Bomb planted B — post-plant positions",
    side: "T",
    bullets: [
      "Spread out: one Water, one Monster, one behind Pillar/Barrels. Don't stack a single angle.",
      "Plant for Water/Short if you came from that side — you can hold from below with a molly for the defuse.",
      "CTs will retake from Heaven and Short. Keep one person watching each angle.",
      "If you have a molly left, save it for the defuse. Molly the bomb when you hear the defuse sound.",
    ],
  },
  {
    id: "ct_solo_b_anchor",
    title: "Solo anchoring B site (CT)",
    side: "CT",
    bullets: [
      "Smoke Monster + molly behind it. This buys ~25 seconds for your team to rotate.",
      "Hold from Heaven if possible — it's the strongest angle on B site. You can see both Monster and Short.",
      "Call early and loud. Say 'two Monster' the moment you hear footsteps. Your team needs time to rotate.",
      "Don't try to be a hero. Delay, don't engage. One smoke + one molly + info wins more rounds than a 1v3 attempt.",
    ],
  },
  {
    id: "a_long_defense",
    title: "Holding Long A (CT)",
    side: "CT",
    bullets: [
      "Smoke + molly Long A early. Pair them for ~25 seconds of denial — almost half the round.",
      "Hold from Truck or an off-angle. Don't sit at the obvious peek spot every round.",
      "If they push through your smoke, fall back and call for help. Don't re-peek a 1v3 through a fading smoke.",
      "Bank player and Long player should communicate — crossfires on Long A are devastating if coordinated.",
    ],
  },
  {
    id: "eco_round_t",
    title: "Eco round (T side)",
    side: "T",
    bullets: [
      "Don't buy utility. Buy armor ($650 kevlar) and a pistol upgrade.",
      "Stack one site with all 5 — either rush B through Monster or rush A Long. Aim for a rifle pickup.",
      "Don't split or default on ecos — get one pick and bail. Trade kills, grab a gun, save it if you can.",
    ],
  },
  {
    id: "force_round_t",
    title: "Force buy (T side)",
    side: "T",
    bullets: [
      "MAC-10 + armor + 1 flash. Rush close quarters — Monster or Bathrooms into B Short.",
      "SMGs reward close engagements. Don't take long-range fights on Long A with a MAC-10.",
      "If one player can afford an AWP, give it to the best aimer and have them hold a long angle while the team rushes.",
    ],
  },
  {
    id: "pistol_round",
    title: "Pistol round basics",
    side: "T",
    bullets: [
      "Buy kevlar ($650). You have $150 left — not enough for a grenade. Skip utility.",
      "Stack B through Monster or rush A Long. Don't split the pistol round.",
      "Win pistol = full buy round 2. Lose pistol = eco round 2 to set up round 3 force.",
    ],
  },
  {
    id: "ct_retake_priority",
    title: "Retake priority — which site first?",
    side: "CT",
    bullets: [
      "B retakes are harder because of Heaven and multiple post-plant spots. If you lost B, push together from Short + Heaven — never solo.",
      "A retakes from CT spawn catch Ts off guard — they usually watch Long. Flash from CT and push together.",
      "Always bring at least 2 players for a retake. Solo retakes succeed less than 20% of the time at our rank.",
      "If time is short, push with everything. If time is long, wait for a pick or use utility to clear angles one by one.",
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
    id: "bathrooms_corner",
    name: "Bathrooms Corner",
    side: "T",
    area: "B",
    pos: { worldX: -1731.969, worldY: -704.031 },
    lineups: ["bathrooms_b_heaven_smoke"],
    tip: "THE most important T-side smoke on Overpass. Throw the Heaven smoke every round before pushing B.",
  },
  
  {
    id: "monster_stairs",
    name: "Monster Tunnel (Top Stairs)",
    side: "T",
    area: "B",
    pos: { worldX: -1559.971, worldY: -1087.844 },
    lineups: ["monster_smoke"],
    tip: "Smoke the exit before pushing out. CTs love holding Monster with an M4.",
  },
  
  {
    id: "monster_exit",
    name: "Monster Exit",
    side: "T",
    area: "B",
    pos: { worldX: -499.97, worldY: -1551.968 },
    lineups: ["b_pillar_molly"],
    tip: "Molly Pillar after your Monster smoke blooms. Clears the closest defensive angle.",
  },
  
  {
    id: "long_a_corridor",
    name: "Long A Mid-Corridor",
    side: "T",
    area: "A",
    pos: { worldX: -2588.313, worldY: -2591.969 },
    lineups: ["a_site_flash"],
    tip: "Entry flash from here. Team pushes on the pop. Call it before throwing.",
  },
  
  {
    id: "connector_entrance_t",
    name: "Connector Entrance (T side)",
    side: "T",
    area: "Connector",
    pos: { worldX: -432.031, worldY: -2681.968 },
    lineups: ["connector_smoke_t"],
    tip: "Blocks CT rotations through the middle of the map. Useful for both A and B executes.",
  },
  
  {
    id: "b_site_pillar",
    name: "B Site Pillar",
    side: "CT",
    area: "B",
    pos: { worldX: -1464.279, worldY: -14.452 },
    lineups: ["ct_monster_smoke", "ct_monster_molly"],
    tip: "Foundation CT B defense. Smoke + molly Monster every round for ~25 seconds of denial.",
  },
  
  {
    id: "b_site_fountain",
    name: "B Site Fountain",
    side: "CT",
    area: "B",
    pos: { worldX: -2116.461, worldY: 993.141 },
    lineups: ["ct_water_smoke"],
    tip: "Blocks the Water/Short approach. Pair with Monster smoke for full B lockdown.",
  },
  
  {
    id: "b_short_rotation",
    name: "B Short (Rotation)",
    side: "CT",
    area: "B",
    pos: { worldX: -1039.171, worldY: -514.462 },
    lineups: ["ct_b_short_flash"],
    tip: "Flash into B site from Short. Push TOGETHER — never solo retake.",
  },
  
  {
    id: "ct_spawn_a_retake",
    name: "CT Spawn (A Retake)",
    side: "CT",
    area: "A",
    pos: { worldX: -2022.818, worldY: 1135.444 },
    lineups: ["ct_a_retake_flash"],
    tip: "Flash over A from behind. Ts expect Long pushes, not CT — use the surprise angle.",
  },
];

// ═══════════════════════════════════════════════════════════════
//  SPAWNS — 5 per side. Spawn dots on the radar; lineups = instant round-start throws.
// ═══════════════════════════════════════════════════════════════

export const SPAWNS = {
  T: [
    { id: 1, name: "Spawn 1 (Bathrooms)",   pos: { x: 30, y: 68 }, lineups: [] },
    { id: 2, name: "Spawn 2 (Monster)",     pos: { x: 36, y: 70 }, lineups: [] },
    { id: 3, name: "Spawn 3 (A Long)",      pos: { x: 31, y: 67 }, lineups: [] },
    { id: 4, name: "Spawn 4 (Connector)",   pos: { x: 34, y: 68 }, lineups: [] },
    { id: 5, name: "Spawn 5 (Back)",        pos: { x: 33, y: 71 }, lineups: [] },
  ],
  CT: [
    { id: 1, name: "Spawn 1 (Back)",        pos: { x: 55, y: 18 }, lineups: [] },
    { id: 2, name: "Spawn 2 (A site)",      pos: { x: 58, y: 20 }, lineups: [] },
    { id: 3, name: "Spawn 3 (Connector)",   pos: { x: 52, y: 20 }, lineups: [] },
    { id: 4, name: "Spawn 4 (B site)",      pos: { x: 48, y: 20 }, lineups: [] },
    { id: 5, name: "Spawn 5 (Short)",       pos: { x: 50, y: 19 }, lineups: [] },
  ],
};
