/*
  CS2 ANUBIS — DATA MODULE

  All lineup data, combos, utility belts, and scenarios for Anubis.
  Kept separate from the main JSX file so we can scale to more maps.

  Lineup data is cross-referenced from NadeKing, Refrag.gg, CS2Pulse,
  Sothatwemaybefree, and community guides.

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

export const MAP_NAME = "Anubis";

export const RADAR_URL =
  "https://raw.githubusercontent.com/MurkyYT/cs2-map-icons/main/images/radars/de_anubis_radar_psd.png";

// helper: YouTube search URL for any lineup (always works without curating individual videos)
const yt = (q) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(
    "cs2 anubis " + q + " lineup"
  )}`;

// ═══════════════════════════════════════════════════════════════
//  LINEUPS DATABASE
// ═══════════════════════════════════════════════════════════════

export const LINEUPS = {
  // ─── T-SIDE MID ──────────────────────────────────────────
  mid_connector_smoke: {
    id: "mid_connector_smoke",
    name: "Mid Connector Smoke from T Spawn",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "Mid",
    mustLearn: true,
    instant: true,
    purpose:
      "Blocks CT vision from Connector into Mid. THE most important T-side smoke on Anubis — denies early info and AWP angles from Connector/Bridge.",
    stand: "Stand at the corner of the wall near the right pillar in T Spawn, facing mid.",
    aim: "Look up at the edge of the rooftop ahead. Align crosshair with the dark stone seam on the upper wall.",
    notes:
      "Whoever has the closest spawn throws this. Must land before CTs set up the Connector AWP angle.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/anubis/smoke/t-side",
    },
    video: yt("mid connector smoke t spawn"),
    screenshots: {
      stand:  "https://assets.cs2util.com/anubis/smoke/topmid/top_mid-smoke-from-t-spawn-lineup-mini.webp",
      aim:    "https://assets.cs2util.com/anubis/smoke/topmid/top_mid-smoke-from-t-spawn-lineup.webp",
      result: "https://assets.cs2util.com/anubis/smoke/topmid/top_mid-smoke-from-t-spawn-cover.webp",
    },
    source: { name: "cs2util", url: "https://www.cs2util.com/anubis/smoke/top-mid-smoke-from-t-spawn" },
    radarPos: { x: 50, y: 72 },
    radarTarget: { x: 62, y: 45 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  mid_flash: {
    id: "mid_flash",
    name: "Mid Flash from T Spawn",
    util: "FLASH",
    throw: "LMB",
    side: "T",
    area: "Mid",
    mustLearn: false,
    purpose:
      "Pops over the mid archway and blinds any CT peeking mid or holding from Bridge. Enables an aggressive mid push.",
    stand: "T Spawn mid exit, slightly left of center against the wall.",
    aim: "Full throw over the archway above mid — aim at the top edge of the stone arch.",
    notes:
      "Throw immediately after the Connector smoke. Push mid together the instant it pops.",
    source: {
      name: "cs2pulse",
      url: "https://cs2pulse.com/flash-bangs/anubis/bridge-from-ruins/",
    },
    video: yt("mid flash t spawn"),
    screenshots: {
      stand:  "https://cs2pulse.com/wp-content/uploads/2024/07/image12-11.png",
      aim:    "https://cs2pulse.com/wp-content/uploads/2024/07/image6-11.png",
      result: "https://media.cs2nades.net/uploads/4b3111f1-1e62-4f19-9233-698f8fd604a0_Mid%20from%20T%20Spawn.jpg",
    },
    radarPos: { x: 48, y: 70 },
    radarTarget: { x: 50, y: 50 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── T-SIDE A EXECUTE ────────────────────────────────────
  a_main_ct_smoke: {
    id: "a_main_ct_smoke",
    name: "A Main CT Smoke",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "A",
    mustLearn: true,
    purpose:
      "Blocks CT rotation from CT spawn/back site into A. Essential for any A execute — isolates defenders already on site.",
    stand: "Stand in A Main corridor, against the left wall near the first pillar.",
    aim: "Look up at the gap between the stone blocks on the upper wall. Align crosshair on the dark horizontal line.",
    notes:
      "Jump throw. Must land before you push out of A Main. Pairs with Heaven smoke.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/anubis/smoke/t-side",
    },
    video: yt("a main ct smoke"),
    screenshots: {
      stand:  "https://assets.cs2util.com/anubis/smoke/main/main-smoke-from-ct-spawn-lineup-mini.webp",
      aim:    "https://assets.cs2util.com/anubis/smoke/main/main-smoke-from-ct-spawn-lineup.webp",
      result: "https://assets.cs2util.com/anubis/smoke/main/main-smoke-from-ct-spawn-cover.webp",
    },
    source: { name: "cs2util", url: "https://www.cs2util.com/anubis/smoke/main-smoke-from-ct-spawn" },
    radarPos: { x: 25, y: 52 },
    radarTarget: { x: 22, y: 22 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  a_heaven_smoke: {
    id: "a_heaven_smoke",
    name: "A Heaven Smoke from A Main",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "A",
    mustLearn: false,
    purpose:
      "Blocks the deadly Heaven/Balcony angle on A site. CTs love to AWP or rifle from Heaven — this shuts it down.",
    stand: "A Main corridor, same position as CT smoke but angle your view upward and left.",
    aim: "Aim at the ornate carving on the upper-left wall. Place crosshair on the bottom edge of the carved symbol.",
    notes:
      "Jump throw. Throw immediately after the CT smoke for a full A execute. Heaven is the strongest CT position on A.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-anubis-utility-guide/",
    },
    video: yt("a heaven smoke a main"),
    screenshots: {
      stand:  "https://cs2pulse.com/wp-content/uploads/2023/12/image7-24.png",
      aim:    "https://assets.cs2util.com/anubis/smoke/a-site/heaven-smoke-from-main-lineup.webp",
      result: "https://assets.cs2util.com/anubis/smoke/a-site/heaven-smoke-from-main-cover.webp",
    },
    source: { name: "cs2util", url: "https://www.cs2util.com/anubis/smoke/heaven-smoke-from-main" },
    radarPos: { x: 25, y: 52 },
    radarTarget: { x: 28, y: 25 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  a_main_pop_flash: {
    id: "a_main_pop_flash",
    name: "A Main Pop Flash",
    util: "FLASH",
    throw: "RMB",
    side: "T",
    area: "A",
    mustLearn: false,
    purpose: "Blinds CTs holding A site as your team pushes out of A Main. Quick pop flash that gives no time to turn.",
    stand: "Inside A Main corridor, right wall, two steps before the exit to site.",
    aim: "Face the exit and aim at the top of the doorframe. Flash bounces off the ceiling and pops instantly.",
    notes:
      "Right-click underhand throw. Push out the moment the flash leaves your hand — it pops almost instantly.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/anubis/flash/t-side",
    },
    video: yt("a main pop flash"),
    screenshots: {
      stand:  "https://cs2pulse.com/wp-content/uploads/2024/07/image9-11.png",
      aim:    "https://cs2pulse.com/wp-content/uploads/2024/07/image7-11.png",
      result: "https://assets.cs2util.com/anubis/flash/a-site/a-site-flash-from-boat-cover.webp",
    },
    source: { name: "cs2util", url: "https://www.cs2util.com/anubis/flash/a-site-flash-from-boat" },
    radarPos: { x: 24, y: 48 },
    radarTarget: { x: 28, y: 22 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── T-SIDE B EXECUTE ────────────────────────────────────
  b_main_smoke: {
    id: "b_main_smoke",
    name: "B Main Smoke (Pillar/Heaven)",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "B",
    mustLearn: false,
    purpose:
      "Covers the Pillar and Heaven angle on B site. Allows your team to push out of B Main and plant safely.",
    stand: "B Main hallway, right side against the wall at the corner before site opens up.",
    aim: "Look up toward the gap in the rooftop. Place crosshair on the edge of the angled stone beam above.",
    notes:
      "Jump throw. Blocks the two most common CT positions on B — Pillar and the elevated Heaven spot.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/anubis/smoke/t-side",
    },
    video: yt("b main smoke pillar heaven"),
    screenshots: {
      stand:  "https://assets.cs2util.com/anubis/molotov/b-site/street-smoke-from-b-long-lineup-mini.webp",
      aim:    "https://assets.cs2util.com/anubis/molotov/b-site/street-smoke-from-b-long-lineup.webp",
      result: "https://assets.cs2util.com/anubis/molotov/b-site/street-smoke-from-b-long-cover.webp",
    },
    source: { name: "cs2util", url: "https://www.cs2util.com/anubis/smoke/street-smoke-from-b-long" },
    radarPos: { x: 75, y: 52 },
    radarTarget: { x: 68, y: 25 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  b_site_molly: {
    id: "b_site_molly",
    name: "B Site Default Plant Molotov",
    util: "MOLLY",
    throw: "LMB",
    side: "T",
    area: "B",
    mustLearn: true,
    purpose:
      "Burns the default plant position on B site. Forces any CT hiding near the plant spot to reposition, making the plant safe.",
    stand: "B Main entrance, against the left wall just before site opens.",
    aim: "Arc the molotov toward the default plant box — aim above the doorframe and release at the peak.",
    notes:
      "Left-click full throw. Flush the plant spot before your planter commits. Essential for clean B takes.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-anubis-utility-guide/",
    },
    video: yt("b site default plant molly"),
    screenshots: {
      stand:  "https://assets.cs2util.com/anubis/molotov/b-site/back-site-molotov-from-palace-lineup-mini.webp",
      aim:    "https://assets.cs2util.com/anubis/molotov/b-site/back-site-molotov-from-palace-lineup.webp",
      result: "https://assets.cs2util.com/anubis/molotov/b-site/back-site-molotov-from-palace-cover.webp",
    },
    source: { name: "cs2util", url: "https://www.cs2util.com/anubis/molotov/back-site-molotov-from-palace" },
    radarPos: { x: 74, y: 50 },
    radarTarget: { x: 70, y: 22 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  b_main_pop_flash: {
    id: "b_main_pop_flash",
    name: "B Main Pop Flash",
    util: "FLASH",
    throw: "RMB",
    side: "T",
    area: "B",
    mustLearn: false,
    purpose: "Blinds CTs holding B site as your team exits B Main.",
    stand: "Inside B Main corridor, left wall, behind the entry player.",
    aim: "Face B Main exit and aim at the archway ceiling.",
    notes: "Right-click underhand throw. Push out immediately.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/anubis/flash/t-side",
    },
    video: yt("b main pop flash"),
    screenshots: {
      stand:  "https://assets.cs2util.com/anubis/flash/b-site/b-site-flash-from-b-long-lineup-mini.webp",
      aim:    "https://assets.cs2util.com/anubis/flash/b-site/b-site-flash-from-b-long-lineup.webp",
      result: "https://assets.cs2util.com/anubis/flash/b-site/b-site-flash-from-b-long-cover.webp",
    },
    source: { name: "cs2util", url: "https://www.cs2util.com/anubis/flash/b-site-flash-from-b-long" },
    radarPos: { x: 76, y: 50 },
    radarTarget: { x: 70, y: 25 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── T-SIDE HE ────────────────────────────────────────────
  b_heaven_he: {
    id: "b_heaven_he",
    name: "B Heaven HE from B Main",
    util: "HE",
    throw: "LMB",
    side: "T",
    area: "B",
    mustLearn: false,
    purpose:
      "Deals 50-80 damage to CTs playing Heaven on B site. Softens defenders before your team swings.",
    stand: "B Main corridor, middle of the hallway.",
    aim: "Arc the HE high toward the B Heaven balcony — aim above the exit doorframe.",
    notes: "Even 40 damage turns the duel in your favor. Throw before your flash.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-anubis-utility-guide/",
    },
    video: yt("b heaven he b main"),
    // NOTE: approximate images — no dedicated HE page exists; stand/aim from B Heaven flash, result from B Pillar. Swap if you find better.
    screenshots: {
      stand:  "https://cs2pulse.com/wp-content/uploads/2024/07/image4-11.png",
      aim:    "https://cs2pulse.com/wp-content/uploads/2024/07/image10-11.png",
      result: "https://media.cs2nades.net/uploads/97659f17-bdc0-4b9e-8934-88bc057933e2_B%20Pillar%20from%20Ruins.jpg",
    },
    source: { name: "cs2pulse", url: "https://cs2pulse.com/flash-bangs/anubis/b-site-from-heaven/" },
    radarPos: { x: 75, y: 53 },
    radarTarget: { x: 68, y: 28 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── CT SIDE ─────────────────────────────────────────────
  ct_mid_smoke: {
    id: "ct_mid_smoke",
    name: "Mid Smoke from CT",
    util: "SMOKE",
    throw: "JT",
    side: "CT",
    area: "Mid",
    mustLearn: true,
    purpose:
      "Blocks T-side mid aggression from CT spawn. Foundation of CT mid control on Anubis — denies T info and early picks.",
    stand: "CT spawn area, near the back wall facing mid.",
    aim: "Look up at the upper wall above the mid archway. Align crosshair on the center stone block.",
    notes:
      "Jump throw. Throw this every single round to deny T mid control. Pair with a Canal smoke for full lockdown.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/anubis/smoke/ct-side",
    },
    video: yt("ct mid smoke ct spawn"),
    screenshots: {
      stand:  "https://assets.cs2util.com/anubis/smoke/topmid/top-mid-smoke-from-ct-spawn-lineup-mini.webp",
      aim:    "https://assets.cs2util.com/anubis/smoke/topmid/top-mid-smoke-from-ct-spawn-lineup.webp",
      result: "https://assets.cs2util.com/anubis/smoke/topmid/top-mid-smoke-from-ct-spawn-cover.webp",
    },
    source: { name: "cs2util", url: "https://www.cs2util.com/anubis/smoke/top-mid-smoke-from-ct-spawn" },
    radarPos: { x: 50, y: 20 },
    radarTarget: { x: 50, y: 45 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_a_main_smoke: {
    id: "ct_a_main_smoke",
    name: "A Main Smoke from Site",
    util: "SMOKE",
    throw: "LMB",
    side: "CT",
    area: "A",
    mustLearn: false,
    purpose:
      "Smokes off A Main entrance from the site side. Buys time for rotations and denies T vision into site.",
    stand: "A site, behind the default box or pillar, facing A Main.",
    aim: "Aim directly at the A Main doorway opening. Left-click throw — lands right in the choke.",
    notes:
      "Simple left-click throw. Pair with molly behind the smoke for ~25 seconds of denial.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/anubis/smoke/ct-side",
    },
    video: yt("ct a main smoke from site"),
    screenshots: {
      stand:  "https://cs2pulse.com/wp-content/uploads/2023/12/image20-7.png",
      aim:    "https://cs2pulse.com/wp-content/uploads/2023/12/image8-20.png",
      result: "https://media.cs2nades.net/uploads/1bbeb2e7-d9f0-432a-a52b-1a87a19fa42b_A%20Main%20from%20CT%20Spawn.jpg",
    },
    source: { name: "cs2pulse", url: "https://cs2pulse.com/smokes/anubis/a-main/" },
    radarPos: { x: 28, y: 25 },
    radarTarget: { x: 25, y: 48 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_b_main_molly: {
    id: "ct_b_main_molly",
    name: "B Main Molotov (Anti-Rush)",
    util: "MOLLY",
    throw: "LMB",
    side: "CT",
    area: "B",
    mustLearn: false,
    purpose:
      "Molotov into B Main behind your smoke. As a solo B anchor, this is your lifeline — buys time for teammates to rotate.",
    stand: "B site, behind pillar or on the elevated platform.",
    aim: "Arc the molotov into B Main behind your smoke — aim through the smoke cloud.",
    notes:
      "Smoke + Molly buys ~25 seconds. Almost half the round. Essential for solo anchoring.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/anubis/molotov/ct-side",
    },
    video: yt("ct b main molly anti rush"),
    screenshots: {
      stand:  "https://assets.cs2util.com/anubis/molotov/doors/doors-molotov-from-b-long-lineup-mini.webp",
      aim:    "https://assets.cs2util.com/anubis/molotov/doors/doors-molotov-from-b-long-lineup.webp",
      result: "https://assets.cs2util.com/anubis/molotov/doors/doors-molotov-from-b-long-cover.webp",
    },
    source: { name: "cs2util", url: "https://www.cs2util.com/anubis/molotov/doors-molotov-from-b-long" },
    radarPos: { x: 68, y: 25 },
    radarTarget: { x: 74, y: 48 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_canal_smoke: {
    id: "ct_canal_smoke",
    name: "Canal Smoke",
    util: "SMOKE",
    throw: "JT",
    side: "CT",
    area: "Mid",
    mustLearn: false,
    purpose:
      "Blocks T push through Canal toward A or mid. Pairs with mid smoke for full middle-of-map lockdown.",
    stand: "CT spawn or near Bridge, facing Canal entrance.",
    aim: "Look up at the stone ledge above Canal. Place crosshair on the dark seam between blocks.",
    notes:
      "Jump throw. Throw alongside the mid smoke to fully deny T map control through the center.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-anubis-utility-guide/",
    },
    video: yt("ct canal smoke"),
    // NOTE: Canal/T-Stairs smoke — approximate images from adjacent lineup. Swap aim/result if you find a cleaner match.
    screenshots: {
      stand:  "https://cs2pulse.com/wp-content/uploads/2023/12/image17-7.png",
      aim:    "https://cs2pulse.com/wp-content/uploads/2025/06/Anubis-T-Stairs-Smoke-from-CT-Spawn.jpg",
      result: "https://media.cs2nades.net/uploads/109d5ad2-2176-4044-90fe-1ce3efc50b16_Canals%20from%20CT%20Spawn.jpg",
    },
    source: { name: "cs2pulse", url: "https://cs2pulse.com/smokes/anubis/t-stairs-from-ct-spawn/" },
    radarPos: { x: 45, y: 22 },
    radarTarget: { x: 35, y: 48 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_a_retake_flash: {
    id: "ct_a_retake_flash",
    name: "A Retake Flash from CT",
    util: "FLASH",
    throw: "LMB",
    side: "CT",
    area: "A",
    mustLearn: false,
    purpose:
      "Flash over A site walls from CT spawn. Catches Ts off guard in post-plant — they expect attacks from A Main, not from behind.",
    stand: "CT spawn, approaching A site from the back.",
    aim: "Full throw flash high over the A site walls — aim at the sky above the wall edge.",
    notes: "Call 'flashing A' first. Throw flash, count 1, push together.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/anubis/flash/ct-side",
    },
    video: yt("ct a retake flash"),
    screenshots: {
      stand:  "https://assets.cs2util.com/anubis/flash/a-site/a-site-flash-from-boat-lineup-mini.webp",
      aim:    "https://assets.cs2util.com/anubis/flash/a-site/a-site-flash-from-boat-lineup.webp",
      result: "https://assets.cs2util.com/anubis/flash/a-site/a-site-flash-from-boat-cover.webp",
    },
    source: { name: "cs2util", url: "https://www.cs2util.com/anubis/flash/a-site-flash-from-boat" },
    radarPos: { x: 32, y: 18 },
    radarTarget: { x: 28, y: 25 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_b_retake_flash: {
    id: "ct_b_retake_flash",
    name: "B Retake Flash from CT",
    util: "FLASH",
    throw: "LMB",
    side: "CT",
    area: "B",
    mustLearn: false,
    purpose:
      "Flash into B site from CT rotation path. Blinds Ts in post-plant positions.",
    stand: "Rotating from CT/Connector toward B site.",
    aim: "Full throw flash over the B site walls into the site interior.",
    notes: "Call 'flashing B' first. Push together on count.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/anubis/flash/ct-side",
    },
    video: yt("ct b retake flash"),
    screenshots: {
      stand:  "https://assets.cs2util.com/anubis/flash/b-long/b-long-flash-from-street-lineup-mini.webp",
      aim:    "https://assets.cs2util.com/anubis/flash/b-long/b-long-flash-from-street-lineup.webp",
      result: "https://assets.cs2util.com/anubis/flash/b-long/b-long-flash-from-street-cover.webp",
    },
    source: { name: "cs2util", url: "https://www.cs2util.com/anubis/flash/b-long-flash-from-street" },
    radarPos: { x: 62, y: 20 },
    radarTarget: { x: 70, y: 24 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  ct_a_main_molly: {
    id: "ct_a_main_molly",
    name: "A Main Molotov (Anti-Rush)",
    util: "MOLLY",
    throw: "LMB",
    side: "CT",
    area: "A",
    mustLearn: false,
    purpose:
      "Molotov into A Main behind your smoke. Punishes any T pushing through the smoke with fire damage.",
    stand: "A site, behind cover facing A Main.",
    aim: "Arc the molotov into A Main behind your smoke cloud.",
    notes:
      "Smoke + Molly combo. Anyone pushing through your smoke takes fire damage and is lit up.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/anubis/molotov/ct-side",
    },
    video: yt("ct a main molly anti rush"),
    screenshots: {
      stand:  "https://assets.cs2util.com/anubis/molotov/a-site/a-site-molotov-from-boat-lineup-mini.webp",
      aim:    "https://assets.cs2util.com/anubis/molotov/a-site/a-site-molotov-from-boat-lineup.webp",
      result: "https://assets.cs2util.com/anubis/molotov/a-site/a-site-molotov-from-boat-cover.webp",
    },
    source: { name: "cs2util", url: "https://www.cs2util.com/anubis/molotov/a-site-molotov-from-boat" },
    radarPos: { x: 28, y: 28 },
    radarTarget: { x: 25, y: 48 },
    austincs: { video: "", timestamp: "", note: "" },
  },
};

// ═══════════════════════════════════════════════════════════════
//  MUST-LEARN 5 — if you only learn 5, learn these
// ═══════════════════════════════════════════════════════════════

export const MUST_LEARN = [
  "mid_connector_smoke",
  "a_main_ct_smoke",
  "b_site_molly",
  "ct_mid_smoke",
  "a_main_pop_flash",
];

// ═══════════════════════════════════════════════════════════════
//  COMBOS — 2-3 player named bundles
// ═══════════════════════════════════════════════════════════════

export const COMBOS = [
  {
    id: "mid_control",
    name: "Mid Control",
    site: "Mid",
    side: "T",
    desc: "Connector smoke + mid flash. Isolates mid and enables a fast push to Bridge or Canal.",
    roundTypes: ["FULL", "FORCE"],
    callout: '"Mid control. Connector smoke, flash, push mid."',
    lineups: [
      { lineup: "mid_connector_smoke", who: "Closest to T spawn" },
      { lineup: "mid_flash", who: "Second player, throws after smoke blooms" },
    ],
    tip: "Push mid as a DUO after the flash pops. Don't peek Bridge without clearing angles.",
  },
  {
    id: "a_execute",
    name: "A Execute",
    site: "A",
    side: "T",
    desc: "CT smoke + Heaven smoke + pop flash. Full A site isolation for a clean plant.",
    roundTypes: ["FULL"],
    callout: '"A Execute. CT smoke, Heaven smoke, flash and go."',
    lineups: [
      { lineup: "a_main_ct_smoke", who: "Smoke carrier in A Main" },
      { lineup: "a_heaven_smoke", who: "Same player or second smoke carrier" },
      { lineup: "a_main_pop_flash", who: "Flasher, behind entry" },
    ],
    tip: "Both smokes first, then flash. Entry swings on the flash pop. Trade on contact — don't ego-peek.",
  },
  {
    id: "b_execute",
    name: "B Execute",
    site: "B",
    side: "T",
    desc: "Pillar/Heaven smoke + default molly + pop flash. Cleanest B take for amateur teams.",
    roundTypes: ["FULL", "FORCE"],
    callout: '"B Execute. Smoke pillar, molly default, flash and go."',
    lineups: [
      { lineup: "b_main_smoke", who: "Smoke carrier in B Main" },
      { lineup: "b_site_molly", who: "Molly carrier, throws after smoke" },
      { lineup: "b_main_pop_flash", who: "Flasher, behind the pack" },
    ],
    tip: "Molly flushes the plant spot, smoke blocks rotations. Push together on flash.",
  },
  {
    id: "ct_mid_lockdown",
    name: "CT Mid Lockdown",
    site: "Mid",
    side: "CT",
    desc: "Mid smoke + Canal smoke from CT. Fully denies T map control through the center of Anubis.",
    roundTypes: ["FULL"],
    callout: '"Mid lockdown. Smoke mid and canal. Hold Bridge."',
    lineups: [
      { lineup: "ct_mid_smoke", who: "Player closest to CT spawn back" },
      { lineup: "ct_canal_smoke", who: "Second player or same player with two smokes" },
    ],
    tip: "Don't peek past your smokes. Let the util do the work and hold Bridge/Connector passively.",
  },
  {
    id: "retake_a",
    name: "A Site Retake",
    site: "A",
    side: "CT",
    desc: "Flash from CT + push together. Catch Ts in post-plant positions.",
    roundTypes: ["FULL", "FORCE"],
    callout: '"A Retake. Flashing from CT. Push on count 3."',
    lineups: [
      { lineup: "ct_a_retake_flash", who: "Rotator from CT spawn" },
    ],
    tip: "Push TOGETHER. Lone peeks lose retakes 80% of the time at amateur ranks.",
  },
  {
    id: "retake_b",
    name: "B Site Retake",
    site: "B",
    side: "CT",
    desc: "Flash from Connector/CT + push together. Overwhelm Ts in post-plant.",
    roundTypes: ["FULL", "FORCE"],
    callout: '"B Retake. Flashing from CT. Push together."',
    lineups: [
      { lineup: "ct_b_retake_flash", who: "Rotator from CT/Connector" },
    ],
    tip: "Push TOGETHER. Listen for util pops before peeking — Ts will throw defensive utility.",
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
    desc: "One player carries the full A execute: 2 smokes + 1 molly + 1 flash (exactly 4 grenades). Isolates site and enables a clean plant.",
    roundTypes: ["FULL"],
    callout: '"[Name]\'s A belt. We push on their flash."',
    preRound:
      "Belt carrier buys 2 smokes + 1 flash + teammate drops a molly. That fills the 4 grenade carry cap.",
    sequence: [
      { lineup: "a_main_ct_smoke", step: 1, note: "From A Main. Jump throw. Blocks CT rotation." },
      { lineup: "a_heaven_smoke", step: 2, note: "Same position. Jump throw. Blocks Heaven AWP." },
      { lineup: "a_main_pop_flash", step: 3, note: "Right-click pop flash. Team pushes on this." },
    ],
    teamRole:
      "Everyone else stages behind the belt carrier in A Main. Push on the flash. One player watches Canal/Mid flank.",
  },
  {
    id: "b_belt",
    name: "B Site Utility Belt",
    site: "B",
    side: "T",
    desc: "One player carries the full B execute: 1 smoke + 1 molly + 1 HE + 1 flash (exactly 4 grenades). Clears and isolates B site.",
    roundTypes: ["FULL"],
    callout: '"[Name]\'s B belt. Push on their flash."',
    preRound:
      "Belt carrier buys 1 smoke + 1 molly + 1 HE + 1 flash. Exactly 4 grenades — the CS2 carry cap.",
    sequence: [
      { lineup: "b_main_smoke", step: 1, note: "From B Main. Jump throw. Blocks Pillar/Heaven." },
      { lineup: "b_site_molly", step: 2, note: "Left-click. Burns default plant spot." },
      { lineup: "b_heaven_he", step: 3, note: "HE toward Heaven. Softens any CT there." },
      { lineup: "b_main_pop_flash", step: 4, note: "Pop flash. Team pushes on this." },
    ],
    teamRole:
      "Everyone else stages in B Main behind the belt carrier. Push on the flash. Post-plant from Pillar/Heaven/B Main.",
  },
];

// ═══════════════════════════════════════════════════════════════
//  SCENARIOS — basic-knowledge reminders (no lineups)
// ═══════════════════════════════════════════════════════════════

export const SCENARIOS = [
  {
    id: "canal_vs_bridge",
    title: "Canal vs Bridge control",
    side: "T",
    bullets: [
      "Canal gives a path toward A and mid rotations. Bridge gives vision and rotation between sites. Decide which you need BEFORE the round.",
      "If CTs smoke Canal early, don't force through — rotate to Bridge or hit a site directly.",
      "Canal control is easier with 2 players. One smokes the far angle, one pushes through. Solo Canal pushes get traded easily.",
    ],
  },
  {
    id: "water_push_timing",
    title: "Water push timing",
    side: "T",
    bullets: [
      "The water route (Canal/underwater passage) is loud. CTs hear you splashing from a mile away.",
      "Only push water AFTER util has been thrown to cover sound. A smoke or flash buys the audio cover you need.",
      "Best water timing: mid-round after CTs have rotated away. Early water pushes get punished by any CT holding Canal.",
    ],
  },
  {
    id: "mid_contested",
    title: "Mid is contested hard (Anubis)",
    side: "T",
    bullets: [
      "Anubis mid is dangerous — multiple angles from Bridge, Connector, and Canal. Don't force it without util.",
      "If mid is stacked, hit A or B directly through Main. CTs committed to mid means fewer site defenders.",
      "Counter next round: fake mid with a smoke, then rush a site while CTs hold mid expecting your push.",
    ],
  },
  {
    id: "post_plant_anubis",
    title: "Bomb is planted — what now? (Anubis)",
    side: "T",
    bullets: [
      "Spread out. Anubis sites have multiple elevation angles — don't stack one level.",
      "On A: post-plant from Heaven (if you took it), site corners, and A Main. On B: Pillar, B Main, and Heaven.",
      "Save one molly for the bomb. CTs will attempt a defuse — deny it with fire.",
    ],
  },
  {
    id: "eco_round_t",
    title: "Eco round (T side)",
    side: "T",
    bullets: [
      "Don't buy util. Buy armor ($650 kevlar) and a pistol upgrade if affordable.",
      "Stack one site with all 5. Aim to trade for a rifle pickup.",
      "Don't split or default on ecos — get one pick and bail.",
    ],
  },
  {
    id: "force_round_t",
    title: "Force buy (T side)",
    side: "T",
    bullets: [
      "MAC-10 + armor + 1 flash. That's the force buy loadout.",
      "Rush a site close-range. MAC-10 rewards close engagements.",
      "Don't split the team. Pick one site and commit.",
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
    id: "solo_anchor_anubis",
    title: "Solo anchoring a site (CT, Anubis)",
    side: "CT",
    bullets: [
      "Smoke + molly your entry choke (A Main or B Main). Buys ~25 seconds for rotates.",
      "Anubis sites have elevation — play Heaven when possible. It's harder to trade you from below.",
      "Call early and loud. Say 'two A Main' the moment you hear multiple footsteps.",
    ],
  },
  {
    id: "ct_eco_anubis",
    title: "Eco round (CT side, Anubis)",
    side: "CT",
    bullets: [
      "Stack one site with all 5. Force Ts into the other site without resistance.",
      "On Anubis, B is easier to stack — fewer entry points and more close-range angles.",
      "Don't play default on CT eco. Just stack and trade.",
    ],
  },
  {
    id: "bridge_control_ct",
    title: "Holding Bridge (CT)",
    side: "CT",
    bullets: [
      "Bridge gives rotation and info between A and B. Losing Bridge means slow rotations through CT spawn.",
      "Hold Bridge with one player + a smoke ready. If Ts push through, smoke and fall back.",
      "Don't overcommit to Bridge fights. The info is more valuable than the kill.",
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
    id: "t_spawn_mid",
    name: "T Spawn (Mid)",
    side: "T",
    area: "Mid",
    pos: { x: 50, y: 72 },
    lineups: ["mid_connector_smoke", "mid_flash"],
    tip: "Closest spawn throws Connector smoke every round. THE most important T-side smoke on Anubis.",
  },
  {
    id: "a_main_corridor",
    name: "A Main Corridor",
    side: "T",
    area: "A",
    pos: { x: 25, y: 52 },
    lineups: ["a_main_ct_smoke", "a_heaven_smoke", "a_main_pop_flash"],
    tip: "Both A smokes and the pop flash come from here. The single most important T-side spot for A executes.",
  },
  {
    id: "b_main_corridor",
    name: "B Main Corridor",
    side: "T",
    area: "B",
    pos: { x: 75, y: 52 },
    lineups: ["b_main_smoke", "b_site_molly", "b_main_pop_flash", "b_heaven_he"],
    tip: "All B execute utility comes from B Main. Smoke, molly, HE, then flash and go.",
  },
  // ─── CT-SIDE ───────────────────────────────────────────────
  {
    id: "ct_spawn_back",
    name: "CT Spawn",
    side: "CT",
    area: "Mid",
    pos: { x: 50, y: 20 },
    lineups: ["ct_mid_smoke", "ct_canal_smoke"],
    tip: "Foundation CT mid/canal control. Throw both smokes every round for full center lockdown.",
  },
  {
    id: "a_site_ct",
    name: "A Site (Defender)",
    side: "CT",
    area: "A",
    pos: { x: 28, y: 25 },
    lineups: ["ct_a_main_smoke", "ct_a_main_molly"],
    tip: "Smoke + molly A Main for ~25 seconds of denial. Your lifeline as a solo anchor.",
  },
  {
    id: "b_site_ct",
    name: "B Site (Defender)",
    side: "CT",
    area: "B",
    pos: { x: 68, y: 25 },
    lineups: ["ct_b_main_molly"],
    tip: "Molly B Main behind your smoke. Buys massive time for rotates.",
  },
  {
    id: "ct_near_a",
    name: "CT Spawn (Near A)",
    side: "CT",
    area: "A",
    pos: { x: 32, y: 18 },
    lineups: ["ct_a_retake_flash"],
    tip: "Flash over A site walls from CT — catches Ts off guard in post-plant.",
  },
  {
    id: "ct_connector",
    name: "CT Connector / Near B",
    side: "CT",
    area: "B",
    pos: { x: 62, y: 20 },
    lineups: ["ct_b_retake_flash"],
    tip: "Flash into B site for retakes. Push TOGETHER — lone peeks lose retakes.",
  },
];
