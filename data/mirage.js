/*
  CS2 MIRAGE — DATA MODULE

  All lineup data, combos, utility belts, and scenarios for Mirage.
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

export const MAP_NAME = "Mirage";

export const RADAR_URL =
  "https://raw.githubusercontent.com/MurkyYT/cs2-map-icons/main/images/radars/de_mirage_radar_psd.png";

import { ytSearch } from "./youtube.js";

const yt = (q) => ytSearch("mirage", q);

// ═══════════════════════════════════════════════════════════════
//  LINEUPS DATABASE
// ═══════════════════════════════════════════════════════════════

export const LINEUPS = {
  // ─── T-SIDE A ─────────────────────────────────────────────
  window_smoke: {
    id: "window_smoke",
    name: "Window Smoke from T Spawn",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "A",
    mustLearn: true,
    instant: true,
    purpose:
      "Blocks the CT AWP from window/connector into mid. THE most important T-side smoke on Mirage — throw it every single round.",
    stand: "Stand on the right side of T spawn near the cart, against the small wall.",
    aim: "Look up at the antenna on the rooftop. Place crosshair on the tip of the antenna.",
    notes:
      "Whoever has the closest spawn throws this. Must land before CTs set up the window AWP. Pairs with top-mid short smoke for full mid control.",
    source: {
      name: "BLAST.tv",
      url: "https://blast.tv/article/cs2-mirage-smokes",
    },
    video: yt("window smoke t spawn"),
    screenshots: {
      stand: "https://assets.cs2util.com/mirage/smoke/window/fast-window-smoke-from-t-spawn-lineup-mini.webp",
      aim: "https://assets.cs2util.com/mirage/smoke/window/fast-window-smoke-from-t-spawn-lineup.webp",
      result: "https://assets.cs2util.com/mirage/smoke/window/fast-window-smoke-from-t-spawn-cover.webp",
    },
    radarPos: { x: 50, y: 80 },
    radarTarget: { x: 52, y: 38 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  jungle_smoke: {
    id: "jungle_smoke",
    name: "Jungle Smoke from T Spawn",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "A",
    instant: true,
    mustLearn: false,
    purpose:
      "Blocks CTs playing jungle/connector from seeing A ramp or palace pushes. Essential for any A execute.",
    stand: "Stand on top of the dumpster in T spawn, near the right-side wall.",
    aim: "Look up and to the left. Align crosshair with the corner of the building roofline above.",
    notes:
      "Jump throw from the dumpster. Lands deep in jungle and blocks the connector angle onto A site.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-mirage-smokes/",
    },
    video: yt("jungle smoke t spawn"),
    screenshots: {
      stand: "https://assets.cs2util.com/mirage/smoke/jungle/jungle-smoke-from-cart-lineup-mini.webp",
      aim: "https://assets.cs2util.com/mirage/smoke/jungle/jungle-smoke-from-cart-lineup.webp",
      result: "https://assets.cs2util.com/mirage/smoke/jungle/jungle-smoke-from-cart-cover.webp",
    },
    radarPos: { x: 48, y: 78 },
    radarTarget: { x: 55, y: 28 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_smoke: {
    id: "ct_smoke",
    name: "CT Smoke from T Spawn",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "A",
    instant: true,
    mustLearn: false,
    purpose:
      "Blocks the CT spawn rotation into A site. Prevents CTs from crossing or peeking from CT.",
    stand: "Stand next to the white van in T spawn, right side against the wall.",
    aim: "Look up at the satellite dish on the roof. Place crosshair on the bottom-left edge of the dish.",
    notes:
      "Jump throw. This + jungle smoke gives you a two-smoke A execute that blocks both major CT angles.",
    source: {
      name: "CS2Pulse",
      url: "https://cs2pulse.com/smokes/mirage/",
    },
    video: yt("ct smoke t spawn"),
    screenshots: {
      stand: "https://assets.cs2util.com/mirage/smoke/a-site/ct-smoke-from-t-spawn-lineup-mini.webp",
      aim: "https://assets.cs2util.com/mirage/smoke/a-site/ct-smoke-from-t-spawn-lineup.webp",
      result: "https://assets.cs2util.com/mirage/smoke/a-site/ct-smoke-from-t-spawn-cover.webp",
    },
    radarPos: { x: 52, y: 80 },
    radarTarget: { x: 58, y: 18 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  stairs_smoke: {
    id: "stairs_smoke",
    name: "Stairs Smoke from T Spawn",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "A",
    instant: true,
    mustLearn: false,
    purpose:
      "Blocks the stairs/shadow position on A site. Prevents CTs from holding the close angle near stairs.",
    stand: "Stand at the default position near the cart in T spawn, left side.",
    aim: "Look toward the gap between the buildings. Aim at the edge of the roof trim above.",
    notes:
      "Jump throw. Optional third smoke for a full A execute. Consider skipping if you need smokes for mid.",
    source: {
      name: "Profilerr",
      url: "https://profilerr.net/cs2-mirage-smokes/",
    },
    video: yt("stairs smoke t spawn"),
    screenshots: {
      stand: "https://assets.cs2util.com/mirage/smoke/a-site/stairs-smoke-from-t-spawn1-lineup-mini.webp",
      aim: "https://assets.cs2util.com/mirage/smoke/a-site/stairs-smoke-from-t-spawn1-lineup.webp",
      result: "https://assets.cs2util.com/mirage/smoke/a-site/stairs-smoke-from-t-spawn1-cover.webp",
    },
    radarPos: { x: 46, y: 79 },
    radarTarget: { x: 62, y: 22 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  a_ramp_flash: {
    id: "a_ramp_flash",
    name: "A Ramp Pop Flash",
    util: "FLASH",
    throw: "RMB",
    side: "T",
    area: "A",
    mustLearn: true,
    purpose:
      "Blinds CTs holding A ramp, triple box, and site from stairs. Pop flash for an A ramp push.",
    stand: "Inside the A ramp corridor, right side, just before the exit onto A site.",
    aim: "Face the exit and aim at the top of the wall. Underhand throw bounces off the wall and pops instantly.",
    notes:
      "Right-click underhand throw. Push out immediately after the flash leaves your hand. Don't wait — it pops almost instantly.",
    source: {
      name: "BLAST.tv",
      url: "https://blast.tv/article/cs2-mirage-smokes",
    },
    video: yt("a ramp pop flash"),
    screenshots: {
      stand: "https://assets.cs2util.com/mirage/flash/aSite/ramp-flash-from-t-spawn-lineup-mini.webp",
      aim: "https://assets.cs2util.com/mirage/flash/aSite/ramp-flash-from-t-spawn-lineup.webp",
      result: "https://assets.cs2util.com/mirage/flash/aSite/ramp-flash-from-t-spawn-cover.webp",
    },
    radarPos: { x: 55, y: 35 },
    radarTarget: { x: 62, y: 24 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  a_site_molly: {
    id: "a_site_molly",
    name: "A Site Default Plant Molotov",
    util: "MOLLY",
    throw: "LMB",
    side: "T",
    area: "A",
    mustLearn: false,
    purpose:
      "Burns the default plant position / triple box area on A site. Forces CTs off the most common defensive position.",
    stand: "Top of A ramp, right side near the wall.",
    aim: "Aim at the top edge of the triple box. Left-click throw.",
    notes:
      "Throw this before pushing site. CTs love to play behind triple — this forces them into the open.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-mirage-smokes/",
    },
    video: yt("a site default molly triple"),
    screenshots: {
      stand: "https://assets.cs2util.com/mirage/molotov/a-site/default-molotov-from-stairs-lineup-mini.webp",
      aim: "https://assets.cs2util.com/mirage/molotov/a-site/default-molotov-from-stairs-lineup.webp",
      result: "https://assets.cs2util.com/mirage/molotov/a-site/default-molotov-from-stairs-cover.webp",
    },
    radarPos: { x: 55, y: 34 },
    radarTarget: { x: 65, y: 22 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── T-SIDE MID ───────────────────────────────────────────
  short_smoke: {
    id: "short_smoke",
    name: "Top Mid / Short Smoke",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "Mid",
    mustLearn: false,
    purpose:
      "Blocks the short/catwalk angle from A site into mid. Enables safe mid-to-B or mid-to-short plays.",
    stand: "Stand near the top of mid, against the left wall near the boxes.",
    aim: "Look up toward the short connector gap. Place crosshair on the corner of the archway.",
    notes:
      "Jump throw. Pairs with window smoke for full mid control. Throw before pushing toward short or underpass.",
    source: {
      name: "CS2Pulse",
      url: "https://cs2pulse.com/smokes/mirage/",
    },
    video: yt("top mid short smoke"),
    screenshots: {
      stand: "https://assets.cs2util.com/mirage/smoke/topmid/topmid-smoke-from-t-spawn-lineup-mini.webp",
      aim: "https://assets.cs2util.com/mirage/smoke/topmid/topmid-smoke-from-t-spawn-lineup.webp",
      result: "https://assets.cs2util.com/mirage/smoke/topmid/topmid-smoke-from-t-spawn-cover.webp",
    },
    radarPos: { x: 45, y: 55 },
    radarTarget: { x: 55, y: 32 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── T-SIDE B ─────────────────────────────────────────────
  b_apartments_smoke: {
    id: "b_apartments_smoke",
    name: "B Apartments Smoke (Market Window)",
    util: "SMOKE",
    throw: "LMB",
    side: "T",
    area: "B",
    mustLearn: true,
    purpose:
      "Blocks the market/kitchen window angle into B apartments. Allows safe push through apartments without getting picked from window.",
    stand: "Inside B apartments, left side against the wall, near the bench before the drop into B site.",
    aim: "Look toward market window. Place crosshair on the top-left corner of the window frame. Left-click throw.",
    notes:
      "Left-click throw, no jump. Must land before your team drops down to site. CTs love to hold this angle with an AWP.",
    source: {
      name: "BLAST.tv",
      url: "https://blast.tv/article/cs2-mirage-smokes",
    },
    video: yt("b apartments smoke market window"),
    screenshots: {
      stand: "https://assets.cs2util.com/mirage/smoke/apartments/apartments-smoke-from-market-lineup-mini.webp",
      aim: "https://assets.cs2util.com/mirage/smoke/apartments/apartments-smoke-from-market-lineup.webp",
      result: "https://assets.cs2util.com/mirage/smoke/apartments/apartments-smoke-from-market-cover.webp",
    },
    radarPos: { x: 22, y: 48 },
    radarTarget: { x: 15, y: 32 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  b_short_smoke: {
    id: "b_short_smoke",
    name: "B Short Smoke from Apartments",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "B",
    mustLearn: false,
    purpose:
      "Blocks CTs rotating from short/catwalk into B site. Isolates B site from mid rotations.",
    stand: "Inside B apartments hallway, near the window overlooking B site.",
    aim: "Look toward B short / catwalk entrance. Aim at the top of the archway. Jump throw.",
    notes:
      "Jump throw. Pair with market window smoke for a two-smoke B execute.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-mirage-smokes/",
    },
    video: yt("b short smoke apartments"),
    screenshots: {
      stand: "https://assets.cs2util.com/mirage/smoke/b-short/b-short-smoke-from-house-lineup-mini.webp",
      aim: "https://assets.cs2util.com/mirage/smoke/b-short/b-short-smoke-from-house-lineup.webp",
      result: "https://assets.cs2util.com/mirage/smoke/b-short/b-short-smoke-from-house-cover.webp",
    },
    radarPos: { x: 24, y: 50 },
    radarTarget: { x: 30, y: 30 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  b_site_molly: {
    id: "b_site_molly",
    name: "B Site Bench Molotov",
    util: "MOLLY",
    throw: "LMB",
    side: "T",
    area: "B",
    mustLearn: false,
    purpose:
      "Burns the bench/default position on B site. Forces CTs off the most common B anchor spot.",
    stand: "B apartments, near the doorway before the drop to B site.",
    aim: "Aim toward the bench area on B site. Arc the molotov down onto the bench.",
    notes:
      "Left-click throw. Throw right before your team drops into site.",
    source: {
      name: "CS2Pulse",
      url: "https://cs2pulse.com/smokes/mirage/",
    },
    video: yt("b site bench molly apartments"),
    screenshots: {
      stand: "https://assets.cs2util.com/mirage/molotov/b-site/bench-molotov-from-b-apartments-lineup-mini.webp",
      aim: "https://assets.cs2util.com/mirage/molotov/b-site/bench-molotov-from-b-apartments-lineup.webp",
      result: "https://assets.cs2util.com/mirage/molotov/b-site/bench-molotov-from-b-apartments-cover.webp",
    },
    radarPos: { x: 22, y: 46 },
    radarTarget: { x: 20, y: 28 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  b_apps_flash: {
    id: "b_apps_flash",
    name: "B Apartments Pop Flash",
    util: "FLASH",
    throw: "RMB",
    side: "T",
    area: "B",
    mustLearn: false,
    purpose:
      "Blinds CTs holding B site as your team drops from apartments. Pop flash that's hard to dodge.",
    stand: "B apartments, right against the wall near the doorway to the drop.",
    aim: "Face B site and aim at the ceiling above the door frame. Right-click underhand throw.",
    notes:
      "Right-click underhand. Flash pops instantly as it clears the doorway. Drop onto site immediately after throwing.",
    source: {
      name: "Profilerr",
      url: "https://profilerr.net/cs2-mirage-smokes/",
    },
    video: yt("b apartments pop flash"),
    screenshots: {
      stand: "https://assets.cs2util.com/mirage/flash/b-site/b-apartments-flash-from-bench-lineup-mini.webp",
      aim: "https://assets.cs2util.com/mirage/flash/b-site/b-apartments-flash-from-bench-lineup.webp",
      result: "https://assets.cs2util.com/mirage/flash/b-site/b-apartments-flash-from-bench-cover.webp",
    },
    radarPos: { x: 24, y: 48 },
    radarTarget: { x: 20, y: 30 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── CT-SIDE A ────────────────────────────────────────────
  ct_a_ramp_smoke: {
    id: "ct_a_ramp_smoke",
    name: "A Ramp Smoke from CT/Stairs",
    util: "SMOKE",
    throw: "LMB",
    side: "CT",
    area: "A",
    mustLearn: true,
    purpose:
      "Blocks T pushes through A ramp. Foundation CT-side A defense — buys time for rotates.",
    stand: "On A site near stairs, behind the corner of the wall.",
    aim: "Aim toward the A ramp entrance. Left-click to land the smoke in the ramp corridor.",
    notes:
      "Left-click throw. Throw this every round as the A anchor. Pair with a molly behind the smoke to delay rushes by ~25 seconds.",
    source: {
      name: "Profilerr",
      url: "https://profilerr.net/cs2-mirage-smokes/",
    },
    video: yt("ct a ramp smoke stairs"),
    screenshots: {
      stand: "https://assets.cs2util.com/mirage/smoke/ramp/ramp-smoke-from-ct-lineup-mini.webp",
      aim: "https://assets.cs2util.com/mirage/smoke/ramp/ramp-smoke-from-ct-lineup.webp",
      result: "https://assets.cs2util.com/mirage/smoke/ramp/ramp-smoke-from-ct-cover.webp",
    },
    radarPos: { x: 60, y: 25 },
    radarTarget: { x: 55, y: 38 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_palace_smoke: {
    id: "ct_palace_smoke",
    name: "Palace Smoke from A Site",
    util: "SMOKE",
    throw: "LMB",
    side: "CT",
    area: "A",
    mustLearn: false,
    purpose:
      "Blocks T pushes from palace onto A site. Prevents Ts from getting free peeks onto site.",
    stand: "A site, near the default box or triple stack.",
    aim: "Aim directly at the palace entrance. Left-click throw.",
    notes:
      "Simple left-click smoke. Use on rounds where Ts have been hitting palace frequently.",
    source: {
      name: "BLAST.tv",
      url: "https://blast.tv/article/cs2-mirage-smokes",
    },
    video: yt("ct palace smoke a site"),
    screenshots: {
      stand: "https://assets.cs2util.com/mirage/smoke/palace/palace-smoke-from-b-short-lineup-mini.webp",
      aim: "https://assets.cs2util.com/mirage/smoke/palace/palace-smoke-from-b-short-lineup.webp",
      result: "https://assets.cs2util.com/mirage/smoke/palace/palace-smoke-from-b-short-cover.webp",
    },
    radarPos: { x: 64, y: 22 },
    radarTarget: { x: 70, y: 28 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── CT-SIDE B ────────────────────────────────────────────
  ct_b_apartments_smoke: {
    id: "ct_b_apartments_smoke",
    name: "B Apartments Smoke from B Site",
    util: "SMOKE",
    throw: "LMB",
    side: "CT",
    area: "B",
    mustLearn: true,
    purpose:
      "Blocks T pushes through B apartments. Foundation CT-side B defense — must throw every round as B anchor.",
    stand: "B site, behind the pillar near the bench.",
    aim: "Aim toward the B apartments doorway / drop. Left-click to land the smoke in the entrance.",
    notes:
      "Left-click throw. As a solo B anchor, this is your lifeline. Pair with a molly behind the smoke.",
    source: {
      name: "BLAST.tv",
      url: "https://blast.tv/article/cs2-mirage-smokes",
    },
    video: yt("ct b apartments smoke b site"),
    screenshots: {
      stand: "https://assets.cs2util.com/mirage/smoke/apartments/apartments-smoke-from-ct-spawn-lineup-mini.webp",
      aim: "https://assets.cs2util.com/mirage/smoke/apartments/apartments-smoke-from-ct-spawn-lineup.webp",
      result: "https://assets.cs2util.com/mirage/smoke/apartments/apartments-smoke-from-ct-spawn-cover.webp",
    },
    radarPos: { x: 18, y: 28 },
    radarTarget: { x: 22, y: 42 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_b_molly: {
    id: "ct_b_molly",
    name: "B Apartments Molotov (Anti-Rush)",
    util: "MOLLY",
    throw: "LMB",
    side: "CT",
    area: "B",
    mustLearn: false,
    purpose:
      "Burns behind the B apartments smoke. Delays rushes by an extra ~7 seconds. Forces Ts to wait or take fire damage.",
    stand: "B site, same position as the B apartments smoke.",
    aim: "Arc the molotov into the apartments entrance, behind your smoke.",
    notes:
      "Smoke + molly buys ~25 seconds total. Your lifeline as a solo B anchor.",
    source: {
      name: "Profilerr",
      url: "https://profilerr.net/cs2-mirage-smokes/",
    },
    video: yt("ct b apartments molly anti rush"),
    screenshots: {
      stand: "https://assets.cs2util.com/mirage/molotov/b-site/b-short-molotov-from-a-stairs-lineup-mini.webp",
      aim: "https://assets.cs2util.com/mirage/molotov/b-site/b-short-molotov-from-a-stairs-lineup.webp",
      result: "https://assets.cs2util.com/mirage/molotov/b-site/b-short-molotov-from-a-stairs-cover.webp",
    },
    radarPos: { x: 18, y: 28 },
    radarTarget: { x: 24, y: 45 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── CT-SIDE MID ──────────────────────────────────────────
  ct_window_molly: {
    id: "ct_window_molly",
    name: "Window Molotov (Anti-Boost)",
    util: "MOLLY",
    throw: "LMB",
    side: "CT",
    area: "Mid",
    mustLearn: false,
    purpose:
      "Burns the window position from below. Forces Ts out of window if they take mid control and boost up.",
    stand: "Connector, near the ladder room entrance.",
    aim: "Aim up at the window ledge. Left-click arc the molotov onto the window sill.",
    notes:
      "Useful for retakes when Ts have mid control. Forces them off the window angle.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-mirage-smokes/",
    },
    video: yt("window molly connector"),
    screenshots: {
      stand: "https://assets.cs2util.com/mirage/molotov/mid/mid-window-molotov-from-mid-boxes-lineup-mini.webp",
      aim: "https://assets.cs2util.com/mirage/molotov/mid/mid-window-molotov-from-mid-boxes-lineup.webp",
      result: "https://assets.cs2util.com/mirage/molotov/mid/mid-window-molotov-from-mid-boxes-cover.webp",
    },
    radarPos: { x: 50, y: 32 },
    radarTarget: { x: 52, y: 38 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── CT-SIDE RETAKE ───────────────────────────────────────
  jungle_retake_flash: {
    id: "jungle_retake_flash",
    name: "A Retake Flash from Jungle",
    util: "FLASH",
    throw: "LMB",
    side: "CT",
    area: "A",
    mustLearn: false,
    purpose:
      "Flashes A site from jungle/connector. Catches Ts in post-plant positions — they expect attacks from CT spawn, not jungle.",
    stand: "Inside jungle/connector, near the stairs leading onto A site.",
    aim: "Full throw flash high over the jungle wall onto A site.",
    notes:
      "Call 'flashing A' first. Throw flash, count 1, push together with your teammates.",
    source: {
      name: "Profilerr",
      url: "https://profilerr.net/cs2-mirage-smokes/",
    },
    video: yt("a retake flash jungle"),
    screenshots: {
      stand: "https://assets.cs2util.com/mirage/flash/jungle/retake-flash-from-jungle-lineup-mini.webp",
      aim: "https://assets.cs2util.com/mirage/flash/jungle/retake-flash-from-jungle-lineup.webp",
      result: "https://assets.cs2util.com/mirage/flash/jungle/retake-flash-from-jungle-cover.webp",
    },
    radarPos: { x: 55, y: 30 },
    radarTarget: { x: 62, y: 22 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  b_retake_flash: {
    id: "b_retake_flash",
    name: "B Retake Flash from Short",
    util: "FLASH",
    throw: "LMB",
    side: "CT",
    area: "B",
    mustLearn: false,
    purpose:
      "Flashes B site from short/catwalk. Blinds Ts in post-plant positions on B site.",
    stand: "Short/catwalk area, near the entrance to B site.",
    aim: "Full throw flash high over the wall into B site.",
    notes:
      "Call 'flashing B' first. Push together on count. Lone peeks lose retakes at our rank.",
    source: {
      name: "BLAST.tv",
      url: "https://blast.tv/article/cs2-mirage-smokes",
    },
    video: yt("b retake flash short catwalk"),
    screenshots: {
      stand: "https://assets.cs2util.com/mirage/flash/b-site/air-pop-flash-for-b-rush-from-back-alley-lineup-mini.webp",
      aim: "https://assets.cs2util.com/mirage/flash/b-site/air-pop-flash-for-b-rush-from-back-alley-lineup.webp",
      result: "https://assets.cs2util.com/mirage/flash/b-site/air-pop-flash-for-b-rush-from-back-alley-cover.webp",
    },
    radarPos: { x: 32, y: 28 },
    radarTarget: { x: 20, y: 28 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── T-SIDE EXTRAS ────────────────────────────────────────
  palace_flash: {
    id: "palace_flash",
    name: "Palace Pop Flash",
    util: "FLASH",
    throw: "RMB",
    side: "T",
    area: "A",
    mustLearn: false,
    purpose:
      "Blinds CTs holding A site from the palace entrance. Pop flash for a palace push.",
    stand: "Inside palace, near the exit to A site, right side of the corridor.",
    aim: "Face the exit. Aim at the top of the archway and right-click throw.",
    notes:
      "Right-click underhand. Flash pops as it exits palace. Push out immediately.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-mirage-smokes/",
    },
    video: yt("palace pop flash a site"),
    screenshots: {
      stand: "https://assets.cs2util.com/mirage/flash/aSite/up-balcony-flash-from-palace-lineup-mini.webp",
      aim: "https://assets.cs2util.com/mirage/flash/aSite/up-balcony-flash-from-palace-lineup.webp",
      result: "https://assets.cs2util.com/mirage/flash/aSite/up-balcony-flash-from-palace-cover.webp",
    },
    radarPos: { x: 72, y: 30 },
    radarTarget: { x: 65, y: 22 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  underpass_to_b_smoke: {
    id: "underpass_to_b_smoke",
    name: "B Site Smoke from Underpass",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "B",
    mustLearn: false,
    purpose:
      "Blocks short/catwalk angle from B site. Enables a mid-to-B split through underpass.",
    stand: "Inside underpass, near the ladder exit toward B short.",
    aim: "Look up toward B short. Aim at the top of the archway above. Jump throw.",
    notes:
      "Jump throw. Used for mid-to-B splits. Pair with B apartments smoke for a pincer execute.",
    source: {
      name: "CS2Pulse",
      url: "https://cs2pulse.com/smokes/mirage/",
    },
    video: yt("underpass b site smoke"),
    screenshots: {
      stand: "https://assets.cs2util.com/mirage/smoke/b-short/b-short-smoke-from-underpass-lineup-mini.webp",
      aim: "https://assets.cs2util.com/mirage/smoke/b-short/b-short-smoke-from-underpass-lineup.webp",
      result: "https://assets.cs2util.com/mirage/smoke/b-short/b-short-smoke-from-underpass-cover.webp",
    },
    radarPos: { x: 38, y: 45 },
    radarTarget: { x: 28, y: 30 },
    austincs: { video: "", timestamp: "", note: "" },
  },
};

// ═══════════════════════════════════════════════════════════════
//  MUST-LEARN 5 — if you only learn 5, learn these
// ═══════════════════════════════════════════════════════════════

export const MUST_LEARN = [
  "window_smoke",
  "b_apartments_smoke",
  "ct_a_ramp_smoke",
  "ct_b_apartments_smoke",
  "a_ramp_flash",
];

// ═══════════════════════════════════════════════════════════════
//  COMBOS — 2-3 player named bundles
// ═══════════════════════════════════════════════════════════════

export const COMBOS = [
  {
    id: "a_execute",
    name: "A Execute",
    site: "A",
    side: "T",
    desc: "Three smokes from T spawn (CT, jungle, stairs) + a ramp flash. Blocks all major CT angles onto A site.",
    roundTypes: ["FULL", "FORCE"],
    callout: '"A execute. CT smoke, jungle smoke, stairs smoke, flash ramp and go."',
    lineups: [
      { lineup: "ct_smoke",     who: "Player 1 — throw from T spawn" },
      { lineup: "jungle_smoke", who: "Player 2 — throw from T spawn" },
      { lineup: "stairs_smoke", who: "Player 3 — throw from T spawn" },
      { lineup: "a_ramp_flash", who: "Entry — pop flash from ramp" },
    ],
    tip: "All three smokes come from T spawn — practice the timing so they land together. Flasher waits at ramp until smokes bloom, then flashes and the team pushes.",
  },
  {
    id: "a_split",
    name: "A Split (Ramp + Palace)",
    site: "A",
    side: "T",
    desc: "Two-pronged attack. Palace player flashes while ramp team smokes and pushes.",
    roundTypes: ["FULL"],
    callout: '"A split. Smokes ramp, palace flash, push together."',
    lineups: [
      { lineup: "jungle_smoke",  who: "Player 1 — from T spawn" },
      { lineup: "ct_smoke",      who: "Player 2 — from T spawn" },
      { lineup: "palace_flash",  who: "Palace lurker — pop flash on callout" },
    ],
    tip: "Palace player waits for the callout. When ramp team says 'go', palace flashes and pushes simultaneously. Crossfire catches CTs off guard.",
  },
  {
    id: "b_rush",
    name: "B Rush",
    site: "B",
    side: "T",
    desc: "Market window smoke + flash + drop onto B site. Fast and overwhelming.",
    roundTypes: ["FULL", "FORCE", "PISTOL"],
    callout: '"B rush. Market smoke, flash and drop."',
    lineups: [
      { lineup: "b_apartments_smoke", who: "First player into apartments" },
      { lineup: "b_apps_flash",       who: "Second player — flash before drop" },
    ],
    tip: "Speed kills on B rushes. Smoke market window, flash, and everyone drops together. Don't trickle in one at a time.",
  },
  {
    id: "mid_control",
    name: "Mid Control",
    site: "Mid",
    side: "T",
    desc: "Window smoke + short smoke. Full mid isolation — enables splits to both sites.",
    roundTypes: ["FULL", "FORCE"],
    callout: '"Mid control. Window smoke, short smoke. Push mid."',
    lineups: [
      { lineup: "window_smoke", who: "Closest to T spawn cart" },
      { lineup: "short_smoke",  who: "Top-mid player, after window smoke blooms" },
    ],
    tip: "Window smoke first, then push mid and throw short smoke from top-mid. Don't peek connector without flashing first. Mid control opens up both A and B splits.",
  },
  {
    id: "ct_a_defense",
    name: "A Site Defense",
    site: "A",
    side: "CT",
    desc: "Ramp smoke + palace smoke. Locks down both A entries for ~20 seconds.",
    roundTypes: ["FULL"],
    callout: '"A setup. Ramp smoke, palace smoke. Hold angles."',
    lineups: [
      { lineup: "ct_a_ramp_smoke", who: "A anchor — stairs player" },
      { lineup: "ct_palace_smoke", who: "A anchor — triple player" },
    ],
    tip: "Don't both peek the same angle. One holds ramp, one holds palace. Call early if Ts are pushing — numbers win retakes.",
  },
  {
    id: "retake_a_ct",
    name: "A Retake",
    site: "A",
    side: "CT",
    desc: "Flash from jungle + push together from CT and connector. Classic A retake.",
    roundTypes: ["FULL", "FORCE"],
    callout: '"A retake. Flashing from jungle. Push on 3."',
    lineups: [
      { lineup: "jungle_retake_flash", who: "Rotator from connector / jungle" },
    ],
    tip: "Push TOGETHER. Lone peeks lose retakes 80% of the time at our rank. If you have an HE, throw it at the default plant before peeking.",
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
    desc: "One player carries the full A execute: 2 smokes + 1 molly + 1 flash (exactly 4 grenades, the CS2 max). Devastating when the carrier knows the lineups cold.",
    roundTypes: ["FULL"],
    callout: '"[Name]\'s A belt. We push ramp on their flash."',
    preRound:
      "Belt carrier buys 2 smokes + 1 molly + 1 flash. That's exactly 4 grenades — the CS2 carry cap. No teammate drops required.",
    sequence: [
      { lineup: "jungle_smoke",  step: 1, note: "From T spawn. Jump throw. Blocks connector." },
      { lineup: "ct_smoke",      step: 2, note: "From T spawn. Jump throw. Blocks CT rotation." },
      { lineup: "a_site_molly",  step: 3, note: "From top of ramp. Burns triple box." },
      { lineup: "a_ramp_flash",  step: 4, note: "Pop flash from ramp. Team pushes on this." },
    ],
    teamRole:
      "Everyone else stages on A ramp. Push on the flash. Entry frags trade on contact — don't ego-peek. Post-plant positions: one ramp, one palace, one CT.",
  },
  {
    id: "b_belt",
    name: "B Site Utility Belt",
    site: "B",
    side: "T",
    desc: "One player carries the full B execute: 2 smokes + 1 molly + 1 flash. Fast B take from apartments.",
    roundTypes: ["FULL"],
    callout: '"[Name]\'s B belt. Drop together on their flash."',
    preRound:
      "Belt carrier buys 2 smokes + 1 molly + 1 flash. Exactly 4 grenades — the CS2 carry cap. No teammate drops required.",
    sequence: [
      { lineup: "b_apartments_smoke", step: 1, note: "From apartments. Left-click. Blocks market window." },
      { lineup: "b_short_smoke",      step: 2, note: "From apartments. Jump throw. Blocks short rotation." },
      { lineup: "b_site_molly",       step: 3, note: "From apartments doorway. Burns bench position." },
      { lineup: "b_apps_flash",       step: 4, note: "Pop flash. Everyone drops onto site." },
    ],
    teamRole:
      "Everyone else stages in B apartments. Drop onto site on the flash. Post-plant positions: one apartments, one short, one market.",
  },
];

// ═══════════════════════════════════════════════════════════════
//  SCENARIOS — basic-knowledge reminders (no lineups)
// ═══════════════════════════════════════════════════════════════

export const SCENARIOS = [
  {
    id: "a_ramp_push",
    title: "Pushing A ramp — what should we do?",
    side: "T",
    bullets: [
      "Smoke jungle and CT from T spawn FIRST. Never dry-push ramp without smokes.",
      "Pop flash from the ramp corridor. Entry swings, everyone else trades.",
      "If you get a pick but the site is smoked off, wait. Don't push through your own smokes.",
    ],
  },
  {
    id: "b_apartments_take",
    title: "Taking B through apartments",
    side: "T",
    bullets: [
      "Check the van angle and balcony as you push through apartments. CTs love to hold these.",
      "Smoke market window before dropping. An AWP there will wipe your entire team.",
      "Drop together — not one at a time. Five players jumping down is harder to kill than five players trickling in.",
    ],
  },
  {
    id: "mid_default",
    title: "Default mid play — smoke window every round",
    side: "T",
    bullets: [
      "Window smoke is non-negotiable. Throw it every single round. Whoever has the closest spawn throws it.",
      "After window smoke, push mid as a duo. One watches connector, one watches short.",
      "Mid control lets you split to EITHER site. It's the strongest default on Mirage.",
    ],
  },
  {
    id: "post_plant_a",
    title: "Bomb planted A — post-plant positions",
    side: "T",
    bullets: [
      "Default plant for ramp: plant behind triple box, visible from ramp. Fall back to ramp after planting.",
      "Spread out: one ramp, one palace, one jungle/connector. Don't stack the same angle.",
      "CTs will retake from CT spawn and jungle. Hold angles and listen for footsteps.",
    ],
  },
  {
    id: "post_plant_b",
    title: "Bomb planted B — post-plant positions",
    side: "T",
    bullets: [
      "Default plant for apartments: plant visible from the B apartments window. One holds apps, one holds short.",
      "CTs retake B from short and market. Hold those angles.",
      "Don't all hide in the same corner. An HE grenade wipes stacked players.",
    ],
  },
  {
    id: "eco_round_t",
    title: "Eco round (T side)",
    side: "T",
    bullets: [
      "Don't buy util. Buy armor ($650 kevlar) and a pistol upgrade.",
      "Stack one site with all 5. Aim to trade for a rifle pickup.",
      "B apartments is the best eco rush on Mirage — close quarters favor pistols.",
    ],
  },
  {
    id: "force_round_t",
    title: "Force buy (T side)",
    side: "T",
    bullets: [
      "Cheap SMG (MAC-10) or upgraded pistol + armor + 1 flash.",
      "Rush B apartments or palace. Close-range fights favor SMGs.",
      "If you have AWP money, give it to your best aimer. Don't force 5 rifles.",
    ],
  },
  {
    id: "pistol_round",
    title: "Pistol round basics",
    side: "T",
    bullets: [
      "Buy kevlar ($650). You have $150 left — not enough for a grenade. Skip utility.",
      "Stack one site. Don't split the pistol round.",
      "Win pistol = full buy round 2. Lose pistol = eco round 2 to set up round 3 force.",
    ],
  },
  {
    id: "solo_anchor_b",
    title: "Solo anchoring B site (CT)",
    side: "CT",
    bullets: [
      "Smoke + molly the apartments entrance. Buys ~25 seconds for rotates.",
      "Hold an OFF angle behind the pillar or in market. Don't sit in the default spot they expect.",
      "Call early and often. Say 'two B apps' the moment you hear it. Numbers win retakes.",
    ],
  },
  {
    id: "ct_mid_control",
    title: "Holding mid as CT — window player responsibilities",
    side: "CT",
    bullets: [
      "If your window smoke gets thrown, reposition to connector or short. Don't stand in the smoke hoping for a pick.",
      "Call out mid pushes immediately. 'Two mid, one short' is infinitely more useful than 'they're somewhere mid'.",
      "If Ts take mid control, fall back and play retake. Don't ego-peek through their smokes.",
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
    id: "t_spawn_cart",
    name: "T Spawn (Cart)",
    side: "T",
    area: "A",
    pos: { x: 50, y: 80 },
    lineups: ["window_smoke", "ct_smoke"],
    tip: "Closest spawn throws window smoke every round. CT smoke also comes from here.",
  },
  {
    id: "t_spawn_dumpster",
    name: "T Spawn (Dumpster)",
    side: "T",
    area: "A",
    pos: { x: 48, y: 78 },
    lineups: ["jungle_smoke", "stairs_smoke"],
    tip: "Jungle and stairs smokes from T spawn. Part of the full A execute.",
  },
  {
    id: "top_mid",
    name: "Top Mid",
    side: "T",
    area: "Mid",
    pos: { x: 45, y: 55 },
    lineups: ["short_smoke"],
    tip: "Short smoke from top mid. Throw after window smoke blooms for full mid control.",
  },
  {
    id: "a_ramp_corridor",
    name: "A Ramp Corridor",
    side: "T",
    area: "A",
    pos: { x: 55, y: 35 },
    lineups: ["a_ramp_flash", "a_site_molly"],
    tip: "Pop flash and molly from the ramp corridor. Throw smokes first, then flash and push.",
  },
  {
    id: "palace_exit",
    name: "Palace Exit",
    side: "T",
    area: "A",
    pos: { x: 72, y: 30 },
    lineups: ["palace_flash"],
    tip: "Pop flash from palace. Used in A splits — flash on callout and push with ramp team.",
  },
  {
    id: "b_apartments",
    name: "B Apartments",
    side: "T",
    area: "B",
    pos: { x: 22, y: 48 },
    lineups: ["b_apartments_smoke", "b_short_smoke", "b_site_molly", "b_apps_flash"],
    tip: "The B execute hub. All B-site utility comes from apartments. Smoke market window first.",
  },
  {
    id: "underpass",
    name: "Underpass",
    side: "T",
    area: "B",
    pos: { x: 38, y: 45 },
    lineups: ["underpass_to_b_smoke"],
    tip: "Mid-to-B split smoke. Blocks short angle on B site from underpass.",
  },
  // ─── CT-SIDE ───────────────────────────────────────────────
  {
    id: "a_site_stairs",
    name: "A Site (Stairs)",
    side: "CT",
    area: "A",
    pos: { x: 60, y: 25 },
    lineups: ["ct_a_ramp_smoke", "ct_palace_smoke"],
    tip: "Foundation A defense. Smoke ramp every round as the A anchor.",
  },
  {
    id: "b_site_pillar",
    name: "B Site (Pillar)",
    side: "CT",
    area: "B",
    pos: { x: 18, y: 28 },
    lineups: ["ct_b_apartments_smoke", "ct_b_molly"],
    tip: "Smoke + molly apartments as the B anchor. Buys ~25 seconds for rotates.",
  },
  {
    id: "connector_ct",
    name: "Connector / Jungle",
    side: "CT",
    area: "Mid",
    pos: { x: 50, y: 32 },
    lineups: ["ct_window_molly"],
    tip: "Window molly from connector. Use to force Ts off window during retakes.",
  },
  {
    id: "jungle_ct",
    name: "Jungle (Retake)",
    side: "CT",
    area: "A",
    pos: { x: 55, y: 30 },
    lineups: ["jungle_retake_flash"],
    tip: "A retake flash from jungle. Call 'flashing A' and push together.",
  },
  {
    id: "b_short_ct",
    name: "B Short (Retake)",
    side: "CT",
    area: "B",
    pos: { x: 32, y: 28 },
    lineups: ["b_retake_flash"],
    tip: "B retake flash from short. Push together — lone peeks lose retakes.",
  },
];

export const SPAWNS = {
  T: [
    { id: 1, name: "Spawn 1 (Cart)",     pos: { x: 50, y: 82 }, lineups: ["window_smoke", "ct_smoke"] },
    { id: 2, name: "Spawn 2 (Dumpster)", pos: { x: 52, y: 84 }, lineups: ["jungle_smoke"] },
    { id: 3, name: "Spawn 3 (Left)",     pos: { x: 47, y: 83 }, lineups: ["stairs_smoke"] },
    { id: 4, name: "Spawn 4 (Back)",     pos: { x: 50, y: 86 }, lineups: [] },
    { id: 5, name: "Spawn 5 (Right)",    pos: { x: 53, y: 82 }, lineups: [] },
  ],
  CT: [
    { id: 1, name: "Spawn 1 (Center)",   pos: { x: 68, y: 15 }, lineups: [] },
    { id: 2, name: "Spawn 2 (A Side)",   pos: { x: 65, y: 13 }, lineups: [] },
    { id: 3, name: "Spawn 3 (B Side)",   pos: { x: 71, y: 17 }, lineups: [] },
    { id: 4, name: "Spawn 4 (Back)",     pos: { x: 68, y: 11 }, lineups: [] },
    { id: 5, name: "Spawn 5 (Market)",   pos: { x: 72, y: 14 }, lineups: [] },
  ],
};
