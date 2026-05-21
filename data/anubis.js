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

import { ytSearch } from "./youtube.js";

const yt = (q) => ytSearch("anubis", q);

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
    screenshotSource: { name: "cs2util", url: "https://www.cs2util.com/anubis/smoke/top-mid-smoke-from-t-spawn" },
    radarPos: { worldX: 80.03, worldY: -1759.972 },
    radarTarget: { x: 49, y: 51 },
    austincs: { video: "", timestamp: "", note: "" },
  },


  // ─── T-SIDE A EXECUTE ────────────────────────────────────

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
    screenshotSource: { name: "cs2util", url: "https://www.cs2util.com/anubis/smoke/heaven-smoke-from-main" },
    radarPos: { worldX: 1557.969, worldY: 800.06 },
    radarTarget: { x: 30, y: 36 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  a_main_pop_flash: {
    id: "a_main_pop_flash",
    name: "A Main Pop Flash",
    util: "FLASH",
    throw: "RMB",
    side: "T",
    area: "A",
    mustLearn: true,
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
    screenshotSource: { name: "cs2util", url: "https://www.cs2util.com/anubis/flash/a-site-flash-from-boat" },
    radarPos: { worldX: 1149.969, worldY: 610.028 },
    radarTarget: { x: 25, y: 40 },
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
    screenshotSource: { name: "cs2util", url: "https://www.cs2util.com/anubis/smoke/street-smoke-from-b-long" },
    radarPos: { worldX: -1245.904, worldY: -336.876 },
    radarTarget: { x: 67, y: 35 },
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
    screenshotSource: { name: "cs2util", url: "https://www.cs2util.com/anubis/flash/b-site-flash-from-b-long" },
    radarPos: { worldX: -1267.968, worldY: -170.638 },
    radarTarget: { x: 72, y: 35 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── T-SIDE HE ────────────────────────────────────────────

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
    screenshotSource: { name: "cs2util", url: "https://www.cs2util.com/anubis/smoke/top-mid-smoke-from-ct-spawn" },
    radarPos: { worldX: -368.953, worldY: 2360.851 },
    radarTarget: { x: 48.535, y: 53.125 },
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
    screenshotSource: { name: "cs2pulse", url: "https://cs2pulse.com/smokes/anubis/a-main/" },
    radarPos: { worldX: -890.441, worldY: 2157.356 },
    radarTarget: { x: 21.191, y: 54.785 },
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
    screenshotSource: { name: "cs2util", url: "https://www.cs2util.com/anubis/flash/b-long-flash-from-street" },
    radarPos: { worldX: -1131.136, worldY: 1236.03 },
    radarTarget: { x: 51.953, y: 32.129 },
    austincs: { video: "", timestamp: "", note: "" },
  },

};

// ═══════════════════════════════════════════════════════════════
//  MUST-LEARN 5 — if you only learn 5, learn these
// ═══════════════════════════════════════════════════════════════

export const MUST_LEARN = [
  "mid_connector_smoke",
  "ct_mid_smoke",
  "a_main_pop_flash",
];

// ═══════════════════════════════════════════════════════════════
//  COMBOS — 2-3 player named bundles
// ═══════════════════════════════════════════════════════════════

export const COMBOS = [
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

export const UTILITY_BELTS = [];

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
    id: "ct_connector",
    name: "CT Connector / Near B",
    side: "CT",
    area: "B",
    pos: { worldX: -1131.136, worldY: 1236.03 },
    lineups: ["ct_b_retake_flash"],
    tip: "Flash into B site for retakes. Push TOGETHER — lone peeks lose retakes.",
  },
];

// ═══════════════════════════════════════════════════════════════
//  SPAWNS — 5 per side. Used by spawn selector for instant utility.
// ═══════════════════════════════════════════════════════════════

export const SPAWNS = {
  T: [
    { id: 1, name: "Spawn 1 (Mid pillar)",  pos: { x: 48, y: 76 }, lineups: ["mid_connector_smoke"] },
    { id: 2, name: "Spawn 2 (Left)",        pos: { x: 45, y: 78 }, lineups: [] },
    { id: 3, name: "Spawn 3 (Right)",       pos: { x: 51, y: 79 }, lineups: [] },
    { id: 4, name: "Spawn 4 (Back)",        pos: { x: 49, y: 81 }, lineups: [] },
    { id: 5, name: "Spawn 5 (A side)",      pos: { x: 44, y: 78 }, lineups: [] },
  ],
  CT: [
    { id: 1, name: "Spawn 1 (Back mid)",    pos: { x: 49, y: 26 }, lineups: ["ct_mid_smoke"] },
    { id: 2, name: "Spawn 2 (A side)",      pos: { x: 38, y: 28 }, lineups: [] },
    { id: 3, name: "Spawn 3 (Center)",      pos: { x: 49, y: 28 }, lineups: [] },
    { id: 4, name: "Spawn 4 (B side)",      pos: { x: 58, y: 28 }, lineups: [] },
    { id: 5, name: "Spawn 5 (Connector)",   pos: { x: 53, y: 30 }, lineups: [] },
  ],
};
