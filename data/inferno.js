/*
  CS2 INFERNO — DATA MODULE

  All lineup data, combos, utility belts, and scenarios for Inferno.
  Kept separate from the main JSX file so we can scale to more maps
  without bloating the component file.

  Lineup data is cross-referenced from BLAST.tv, Refrag.gg, NadeKing,
  and sothatwemaybefree.com.

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

export const MAP_NAME = "Inferno";

export const RADAR_URL =
  "https://raw.githubusercontent.com/MurkyYT/cs2-map-icons/main/images/radars/de_inferno_radar_psd.png";

import { ytSearch } from "./youtube.js";

const yt = (q) => ytSearch("inferno", q);

// ═══════════════════════════════════════════════════════════════
//  LINEUPS DATABASE
// ═══════════════════════════════════════════════════════════════

export const LINEUPS = {
  // ─── T-SIDE BANANA ────────────────────────────────────────
  banana_ct_smoke: {
    id: "banana_ct_smoke",
    name: "CT Smoke from Banana",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "Banana",
    mustLearn: true,
    purpose:
      "Blocks CTs from peeking down Banana from CT spawn / construction. THE most important T-side smoke on Inferno — throw it every B round.",
    stand: "Stand against the left wall in bottom Banana, behind the wooden cart near T Ramp.",
    aim: "Look up and aim at the top-left corner of the tall building ahead, just below the roofline.",
    notes:
      "Jump throw. Must land before CTs push for Banana control. Whoever has the closest spawn throws this.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/de_inferno/smoke/t",
    },
    video: yt("banana ct smoke from bottom banana"),
    screenshots: {
      stand: "https://assets.cs2util.com/inferno/smoke/bSite/ct-boost-smoke-from-banana-lineup-mini.webp",
      aim: "https://assets.cs2util.com/inferno/smoke/bSite/ct-boost-smoke-from-banana-lineup.webp",
      result: "https://assets.cs2util.com/inferno/smoke/bSite/ct-boost-smoke-from-banana-cover.webp",
    },
    radarPos: { worldX: 290.328, worldY: 1564.969 },
    radarTarget: { x: 59.375, y: 21.68 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  banana_coffins_smoke: {
    id: "banana_coffins_smoke",
    name: "Coffins Smoke from Banana",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "B",
    mustLearn: true,
    purpose:
      "Blocks the Coffins / Spools angle on B site, isolating the bomb plant area from the most common defensive position.",
    stand: "Stand at the top of Banana, left side against the wall just before the opening to B site.",
    aim: "Aim at the tip of the antenna on the roof ahead. Jump throw.",
    notes:
      "Pairs with CT smoke to isolate two of the three common B-site angles. Plant safe for Banana.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/de_inferno/smoke/t",
    },
    video: yt("coffins smoke from banana"),
    screenshots: {
      stand: "https://assets.cs2util.com/inferno/smoke/bSite/coffins-smoke-from-half-wall-lineup-mini.webp",
      aim: "https://assets.cs2util.com/inferno/smoke/bSite/coffins-smoke-from-half-wall-lineup.webp",
      result: "https://assets.cs2util.com/inferno/smoke/bSite/coffins-smoke-from-half-wall-cover.webp",
    },
    radarPos: { worldX: 423.739, worldY: 1761.97 },
    radarTarget: { x: 49.609, y: 11.426 },
    austincs: { video: "", timestamp: "", note: "" },
  },


  banana_close_molly: {
    id: "banana_close_molly",
    name: "Banana Close Angle Molotov",
    util: "MOLLY",
    throw: "LMB",
    side: "T",
    area: "Banana",
    mustLearn: false,
    purpose:
      "Burns out CTs playing the close angle on the right side of Banana (car / sandbags). Clears the aggressive hold before your team pushes up.",
    stand: "Bottom of Banana, behind the cart, left side.",
    aim: "Aim at the right wall roughly at head height. Arc the molotov around the corner.",
    notes:
      "Throw early in the round. If CT is aggressive, this forces them back to site. Saves a teammate from a free kill.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-inferno-utility-guide/",
    },
    video: yt("banana close angle molotov car"),
    screenshots: {
      stand: "https://assets.cs2util.com/inferno/molotov/bSite/1st-orange-molotov-from-car-lineup-mini.webp",
      aim: "https://assets.cs2util.com/inferno/molotov/bSite/1st-orange-molotov-from-car-lineup.webp",
      result: "https://assets.cs2util.com/inferno/molotov/bSite/1st-orange-molotov-from-car-cover.webp",
    },
    radarPos: { worldX: 479.023, worldY: 2016.969 },
    radarTarget: { x: 30, y: 45 },
    austincs: { video: "", timestamp: "", note: "" },
  },


  // ─── T-SIDE A SITE ───────────────────────────────────────
  a_pit_smoke: {
    id: "a_pit_smoke",
    name: "Pit Smoke from Apartments",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "A",
    mustLearn: true,
    purpose:
      "Blocks the AWPer in Pit from watching the A site plant zone. Essential for any A execute.",
    stand: "Inside Second Mid / Apartments, at the top of the stairs near the Boiler room doorway.",
    aim: "Look up and to the left. Aim at the corner where the building wall meets the roofline above. Jump throw.",
    notes:
      "Must land before your team pushes out of Apartments. Whoever has the closest spawn throws this.",
    source: {
      name: "BLAST.tv",
      url: "https://blast.tv/article/cs2-inferno-smokes",
    },
    video: yt("pit smoke from apartments boiler"),
    screenshots: {
      stand: "https://assets.cs2util.com/inferno/smoke/aSite/pit-smoke-from-alt-mid-lineup-mini.webp",
      aim: "https://assets.cs2util.com/inferno/smoke/aSite/pit-smoke-from-alt-mid-lineup.webp",
      result: "https://assets.cs2util.com/inferno/smoke/aSite/pit-smoke-from-alt-mid-cover.webp",
    },
    radarPos: { worldX: 187.969, worldY: -197.973 },
    radarTarget: { x: 93.164, y: 81.836 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  a_library_smoke: {
    id: "a_library_smoke",
    name: "Library Smoke from Apartments",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "A",
    mustLearn: false,
    purpose:
      "Blocks Library / Back Site, preventing CTs from holding the deep angle on A site.",
    stand: "Inside Apartments, at the top window near Boiler, slightly back from the ledge.",
    aim: "Look above the building across the gap. Aim at the chimney top. Jump throw.",
    notes:
      "Pairs with Pit smoke for a clean 2-smoke A execute. Thrown from the same general area.",
    source: {
      name: "BLAST.tv",
      url: "https://blast.tv/article/cs2-inferno-smokes",
    },
    video: yt("library smoke from apartments"),
    screenshots: {
      stand: "https://assets.cs2util.com/inferno/smoke/aLong/library-smoke-from-mid-lineup-mini.webp",
      aim: "https://assets.cs2util.com/inferno/smoke/aLong/library-smoke-from-mid-lineup.webp",
      result: "https://assets.cs2util.com/inferno/smoke/aLong/library-smoke-from-mid-cover.webp",
    },
    radarPos: { worldX: 616.24, worldY: -264.969 },
    radarTarget: { x: 92.09, y: 55.469 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  a_arch_smoke: {
    id: "a_arch_smoke",
    name: "Arch Smoke from Apartments",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "A",
    mustLearn: false,
    purpose:
      "Blocks Arch side / CT rotation path. Prevents CTs from pushing through Arch during your execute.",
    stand: "Inside Apartments near the balcony, right side of the doorway.",
    aim: "Look above the Arch building roofline. Find the corner of the far wall. Jump throw.",
    notes:
      "Optional third smoke. If you only have 2 smokes, prioritize Pit + Library.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/de_inferno/smoke/t",
    },
    video: yt("arch smoke from apartments balcony"),
    screenshots: {
      stand: "https://assets.cs2util.com/inferno/smoke/aLong/arch-smoke-from-mid2-lineup-mini.webp",
      aim: "https://assets.cs2util.com/inferno/smoke/aLong/arch-smoke-from-mid2-lineup.webp",
      result: "https://assets.cs2util.com/inferno/smoke/aLong/arch-smoke-from-mid2-cover.webp",
    },
    radarPos: { worldX: 992.018, worldY: 447.031 },
    radarTarget: { x: 69.727, y: 57.715 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  apps_flash: {
    id: "apps_flash",
    name: "Apartments Pop Flash",
    util: "FLASH",
    throw: "RMB",
    side: "T",
    area: "A",
    mustLearn: true,
    purpose:
      "Pop flash through Apartments exit onto A site. Blinds anyone holding the Apartments angle, short balcony, or Pit.",
    stand: "Inside Apartments, one step back from the exit doorway to balcony.",
    aim: "Face the exit and aim at the top of the door frame. Right-click underhand throw.",
    notes:
      "Right-click. Pops over the wall almost instantly. Your team pushes on the flash — don't wait.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/de_inferno/flashbang/t",
    },
    video: yt("apartments pop flash a site"),
    screenshots: {
      stand: "https://assets.cs2util.com/inferno/flash/mid/a-site-flash-from-mid-lineup-mini.webp",
      aim: "https://assets.cs2util.com/inferno/flash/mid/a-site-flash-from-mid-lineup.webp",
      result: "https://assets.cs2util.com/inferno/flash/mid/a-site-flash-from-mid-cover.webp",
    },
    radarPos: { worldX: 371.968, worldY: 682.536 },
    radarTarget: { x: 72, y: 62 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  a_site_molly: {
    id: "a_site_molly",
    name: "A Site Default Molotov",
    util: "MOLLY",
    throw: "LMB",
    side: "T",
    area: "A",
    mustLearn: false,
    purpose:
      "Burns out CTs hiding behind default plant box or the hay bales on A site.",
    stand: "Apartments balcony, near the exit.",
    aim: "Arc the molotov toward the default plant area, aiming at the top of the site boxes.",
    notes:
      "Left-click throw. Clears the most common A site anchor position. Throw after smokes land.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-inferno-utility-guide/",
    },
    video: yt("a site default molotov apartments"),
    screenshots: {
      stand: "https://assets.cs2util.com/inferno/molotov/aSite/a-site-bomb-molotov-from-a-long-lineup-mini.webp",
      aim: "https://assets.cs2util.com/inferno/molotov/aSite/a-site-bomb-molotov-from-a-long-lineup.webp",
      result: "https://assets.cs2util.com/inferno/molotov/aSite/a-site-bomb-molotov-from-a-long-cover.webp",
    },
    radarPos: { worldX: 1915.027, worldY: 1235.969 },
    radarTarget: { x: 80, y: 68 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── T-SIDE MID ───────────────────────────────────────────
  mid_smoke: {
    id: "mid_smoke",
    name: "Mid / Short Smoke",
    util: "SMOKE",
    throw: "JT",
    side: "T",
    area: "Mid",
    mustLearn: false,
    purpose:
      "Blocks the CT from watching Short / Mid from the Arch side. Enables safe Apartments or Banana rotations.",
    stand: "T Ramp, left side against the wall near the phone booth.",
    aim: "Look above the Mid buildings. Aim at the edge of the far roofline. Jump throw.",
    notes:
      "Useful for faking or enabling a safe cross from Mid to Banana. Not needed every round.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/de_inferno/smoke/t",
    },
    video: yt("mid short smoke t ramp"),
    screenshots: {
      stand: "https://assets.cs2util.com/inferno/smoke/mid/top-mid-smoke-lineup-mini.webp",
      aim: "https://assets.cs2util.com/inferno/smoke/mid/top-mid-smoke-lineup.webp",
      result: "https://assets.cs2util.com/inferno/smoke/mid/top-mid-smoke-cover.webp",
    },
    radarPos: { worldX: -851.005, worldY: 787.913 },
    radarTarget: { x: 40, y: 59 },
    austincs: { video: "", timestamp: "", note: "" },
  },

  // ─── CT-SIDE ──────────────────────────────────────────────
  ct_banana_smoke: {
    id: "ct_banana_smoke",
    name: "Banana Smoke from CT",
    util: "SMOKE",
    throw: "JT",
    side: "CT",
    area: "Banana",
    mustLearn: true,
    purpose:
      "Blocks T vision up Banana. Foundation CT B defense — throw this every round to deny early Banana control.",
    stand: "Stand on the B site platform near the fountain, slightly left of center.",
    aim: "Look above the Banana entrance. Aim at the top edge of the building wall where it meets the sky. Jump throw.",
    notes:
      "Jump throw. Lands in mid-Banana cutting off T sight lines. Pair with a molly behind the smoke for full denial.",
    source: {
      name: "BLAST.tv",
      url: "https://blast.tv/article/cs2-inferno-smokes",
    },
    video: yt("ct banana smoke from b site"),
    screenshots: {
      stand: "https://assets.cs2util.com/inferno/smoke/banana/half-wall-smoke-from-ct-lineup-mini.webp",
      aim: "https://assets.cs2util.com/inferno/smoke/banana/half-wall-smoke-from-ct-lineup.webp",
      result: "https://assets.cs2util.com/inferno/smoke/banana/half-wall-smoke-from-ct-cover.webp",
    },
    radarPos: { worldX: 2538.758, worldY: 2468.252 },
    radarTarget: { x: 45.898, y: 41.016 },
    austincs: { video: "", timestamp: "", note: "" },
  },



  ct_pit_molly: {
    id: "ct_pit_molly",
    name: "Pit Molotov (Retake)",
    util: "MOLLY",
    throw: "LMB",
    side: "CT",
    area: "A",
    mustLearn: false,
    purpose:
      "Burns Ts holding Pit post-plant. Forces them out of the strongest post-plant position on A site.",
    stand: "Library / Back Site area, approaching A site from CT side.",
    aim: "Arc the molotov downward into Pit. Aim at the base of the Pit wall.",
    notes:
      "Left-click throw. Use during A retakes to deny Pit before swinging site.",
    source: {
      name: "Refrag",
      url: "https://refrag.gg/blog/cs2-inferno-utility-guide/",
    },
    video: yt("ct pit molotov retake a site"),
    screenshots: {
      stand: "https://assets.cs2util.com/inferno/molotov/aSite/mini-pit-molotov-from-a-long-lineup-mini.webp",
      aim: "https://assets.cs2util.com/inferno/molotov/aSite/mini-pit-molotov-from-a-long-lineup.webp",
      result: "https://assets.cs2util.com/inferno/molotov/aSite/mini-pit-molotov-from-a-long-cover.webp",
    },
    radarPos: { worldX: 1915.027, worldY: 1235.969 },
    radarTarget: { x: 66, y: 11 },
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
      "Flash into B site from the CT / Construction side. Blinds Ts holding post-plant positions on B site.",
    stand: "CT spawn area, rotating toward B through Construction.",
    aim: "Full throw flash high over the Construction walls into B site. Left-click.",
    notes:
      "Call 'flashing B from CT' first. Push together — lone peeks lose retakes.",
    source: {
      name: "NadeKing",
      url: "https://www.nadeking.com/utility/de_inferno/flashbang/ct",
    },
    video: yt("ct b retake flash construction"),
    screenshots: {
      stand: "https://assets.cs2util.com/inferno/flash/bSite/b-entrance-flash-from-ct-lineup-mini.webp",
      aim: "https://assets.cs2util.com/inferno/flash/bSite/b-entrance-flash-from-ct-lineup.webp",
      result: "https://assets.cs2util.com/inferno/flash/bSite/b-entrance-flash-from-ct-cover.webp",
    },
    radarPos: { worldX: 1311.969, worldY: 2648.033 },
    radarTarget: { x: 45, y: 20 },
    austincs: { video: "", timestamp: "", note: "" },
  },
};

// ═══════════════════════════════════════════════════════════════
//  MUST-LEARN 5 — if you only learn 5, learn these
// ═══════════════════════════════════════════════════════════════

export const MUST_LEARN = [
  "banana_ct_smoke",
  "a_pit_smoke",
  "apps_flash",
  "ct_banana_smoke",
  "banana_coffins_smoke",
];

// ═══════════════════════════════════════════════════════════════
//  COMBOS — 2-3 player named bundles
// ═══════════════════════════════════════════════════════════════

export const COMBOS = [
  {
    id: "a_apps_exec",
    name: "A Site Execute (Apartments)",
    site: "A",
    side: "T",
    desc: "Pit smoke + Library smoke + Apartments pop flash. Classic 2-3 player A take through Apartments.",
    roundTypes: ["FULL", "FORCE"],
    callout: '"A execute through Apps. Pit smoke, Lib smoke, flash and go."',
    lineups: [
      { lineup: "a_pit_smoke",     who: "First — from Apartments stairs" },
      { lineup: "a_library_smoke", who: "Second — same area, adjust aim" },
      { lineup: "apps_flash",      who: "Flasher — pop flash out the door" },
    ],
    tip: "Smokes first, then flash. Entry player pushes on the flash. Plant default for Apartments post-plant positions.",
  },
    {
    id: "b_retake_ct",
    name: "B Site Retake",
    site: "B",
    side: "CT",
    desc: "Flash from CT / Construction + push together. Catches Ts in post-plant.",
    roundTypes: ["FULL", "FORCE"],
    callout: '"B retake. Flashing from CT. Push together on count."',
    lineups: [
      { lineup: "ct_b_retake_flash", who: "Rotator from CT spawn" },
    ],
    tip: "Push TOGETHER. Listen for util pops before peeking. If you have an HE, throw it at the bomb before swinging.",
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
    desc: "One player carries the full A execute from Apartments: 2 smokes + 1 molly + 1 flash (exactly 4 grenades, the CS2 max).",
    roundTypes: ["FULL"],
    callout: '"[Name]\'s A belt. We push on their flash."',
    preRound:
      "Belt carrier buys 2 smokes + 1 molly + 1 flash. That's exactly 4 grenades — the CS2 carry cap. No teammate drops required.",
    sequence: [
      { lineup: "a_pit_smoke",     step: 1, note: "From Apartments stairs. Jump throw." },
      { lineup: "a_library_smoke", step: 2, note: "Same area, adjust aim. Jump throw." },
      { lineup: "a_site_molly",    step: 3, note: "Arc toward default box from balcony." },
      { lineup: "apps_flash",      step: 4, note: "Flash. Team pushes on this." },
    ],
    teamRole:
      "Everyone else stages inside Apartments behind the belt carrier. Push on their flash. Watch Arch and Pit after plant.",
  },
];

// ═══════════════════════════════════════════════════════════════
//  SCENARIOS — basic-knowledge reminders (no lineups)
// ═══════════════════════════════════════════════════════════════

export const SCENARIOS = [
  {
    id: "banana_control_scenario",
    title: "Taking Banana control early",
    side: "T",
    bullets: [
      "Always molly the close angle first. The aggressive CT hiding at car/sandbags gets a free kill otherwise.",
      "Smoke CT, then push as a PAIR. One player peeks, the other trades.",
      "Once you own Banana, one player holds top Banana while the rest rotate for a later execute or split.",
    ],
  },
  {
    id: "apps_push",
    title: "Pushing through Apartments",
    side: "T",
    bullets: [
      "Clear Boiler room before committing out the balcony. One teammate checks while the other holds the doorway.",
      "Pop flash out the exit. Never dry-peek Apartments onto site — a CT with an AWP in Pit deletes you.",
      "After the flash, push together. Don't dribble out one at a time.",
    ],
  },
  {
    id: "post_plant_b",
    title: "Post-plant on B site",
    side: "T",
    bullets: [
      "Best positions: Banana (hold from top), Dark corner, or New Box.",
      "Spread out. Two in one spot is one HE waiting to happen.",
      "CTs retake from Construction and CT spawn. Watch those angles, not the site you just cleared.",
    ],
  },
  {
    id: "post_plant_a",
    title: "Post-plant on A site",
    side: "T",
    bullets: [
      "Best positions: Pit (hardest to clear), Apartments balcony, behind default box.",
      "If you planted default, play Pit — it's the strongest post-plant angle on Inferno.",
      "Save a molly for the bomb if possible. Deny the defuse from safety.",
    ],
  },
  {
    id: "solo_b_anchor",
    title: "Solo anchoring B site (CT)",
    side: "CT",
    bullets: [
      "Smoke Banana + molly behind the smoke. That's ~25 seconds of denial — almost half the round.",
      "Hold an OFF angle. Don't sit at the obvious first oranges / Coffins every round.",
      "Call early. Say 'Banana smoked and mollied' or 'they pushed through' the instant you know.",
    ],
  },
  {
    id: "a_defense",
    title: "Defending A site (CT)",
    side: "CT",
    bullets: [
      "Smoke the Apartments exit. Molly behind the smoke if they push through.",
      "One player Pit, one player Site / Library. Crossfire the Apartments door.",
      "If they smoke Pit and Library, fall back to Arch. Don't try to play in smokes.",
    ],
  },
  {
    id: "eco_round_t",
    title: "Eco round (T side)",
    side: "T",
    bullets: [
      "Don't buy util. Buy armor ($650 kevlar) and a pistol upgrade.",
      "Stack Banana with all 5. Aim to trade for rifle pickups in close quarters.",
      "Don't split or default on ecos — get one pick and bail.",
    ],
  },
  {
    id: "force_round_t",
    title: "Force buy (T side)",
    side: "T",
    bullets: [
      "Cheap SMG (MAC-10) + armor + 1 flash. No rifles on a force.",
      "Rush Banana or Apartments for close-range fights. MAC-10 rewards close engagements.",
      "If you have AWP money, give it to the best aimer. Don't force 5 rifles.",
    ],
  },
  {
    id: "pistol_round",
    title: "Pistol round basics",
    side: "T",
    bullets: [
      "Buy kevlar ($650). You have $150 left — not enough for a grenade. Skip utility. Or skip kevlar and buy a P250 ($300) + a flash ($200) if you trust your aim.",
      "Stack one site — Banana is strongest for pistol rounds because of the close angles.",
      "Win pistol = full buy round 2. Lose pistol = eco round 2 to set up round 3 force.",
    ],
  },
  {
    id: "ct_retake_basics",
    title: "Retake basics (CT)",
    side: "CT",
    bullets: [
      "Wait for all rotators to arrive. Retaking 2v4 is suicide — wait for 3v3 at minimum.",
      "Use your util: flash before peeking, molly the bomb if time allows.",
      "Push TOGETHER on a count. Lone peeks lose retakes at every rank.",
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
    id: "bottom_banana",
    name: "Bottom Banana",
    side: "T",
    area: "Banana",
    pos: { worldX: 290.328, worldY: 1564.969 },
    lineups: ["banana_ct_smoke", "banana_close_molly"],
    tip: "The starting point for all B site utility. Closest spawn throws the CT smoke every round.",
  },
  
  {
    id: "t_ramp",
    name: "T Ramp",
    side: "T",
    area: "Mid",
    pos: { worldX: -851.005, worldY: 787.913 },
    lineups: ["mid_smoke"],
    tip: "Mid/Short smoke for fakes or safe rotations. Not needed every round.",
  },
  
  {
    id: "apps_stairs",
    name: "Apartments Stairs",
    side: "T",
    area: "A",
    pos: { worldX: 187.969, worldY: -197.973 },
    lineups: ["a_pit_smoke", "a_library_smoke"],
    tip: "Both A site smokes come from the same area. Throw Pit smoke first, then Library.",
  },
  
  {
    id: "apps_balcony",
    name: "Apartments Balcony",
    side: "T",
    area: "A",
    pos: { worldX: 992.018, worldY: 447.031 },
    lineups: ["a_arch_smoke", "apps_flash", "a_site_molly"],
    tip: "Flash + molly from the Apartments exit. Arch smoke also thrown from here.",
  },
  
  {
    id: "library_back_site",
    name: "Library / Back Site",
    side: "CT",
    area: "A",
    pos: { worldX: 1915.027, worldY: 1235.969 },
    lineups: ["ct_pit_molly"],
    tip: "Molly Pit during retakes. Denies the strongest T post-plant position.",
  },
  
  {
    id: "ct_spawn_b_rotate",
    name: "CT Spawn (B Rotation)",
    side: "CT",
    area: "B",
    pos: { worldX: 1311.969, worldY: 2648.033 },
    lineups: ["ct_b_retake_flash"],
    tip: "Flash into B site from CT/Construction. Push together — lone peeks lose retakes.",
  },
];

export const SPAWNS = {
  T: [
    { id: 1, name: "Spawn 1 (Left)",    pos: { x: 8, y: 64 }, lineups: [] },
    { id: 2, name: "Spawn 2 (Right)",   pos: { x: 12, y: 66 }, lineups: [] },
    { id: 3, name: "Spawn 3 (Center)",  pos: { x: 10, y: 65 }, lineups: [] },
    { id: 4, name: "Spawn 4 (Back)",    pos: { x: 11, y: 67 }, lineups: [] },
    { id: 5, name: "Spawn 5 (Ramp)",    pos: { x: 14, y: 66 }, lineups: [] },
  ],
  CT: [
    { id: 1, name: "Spawn 1 (Center)",  pos: { x: 87, y: 31 }, lineups: [] },
    { id: 2, name: "Spawn 2 (Library)", pos: { x: 82, y: 28 }, lineups: [] },
    { id: 3, name: "Spawn 3 (B Side)",  pos: { x: 80, y: 30 }, lineups: [] },
    { id: 4, name: "Spawn 4 (A Side)",  pos: { x: 89, y: 33 }, lineups: [] },
    { id: 5, name: "Spawn 5 (Back)",    pos: { x: 87, y: 28 }, lineups: [] },
  ],
};
