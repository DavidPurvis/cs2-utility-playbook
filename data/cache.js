// data_cache.js
// CS2 Cache Map Utility Playbook Data
// Research sources:
//   - bo3.gg Cache Smokes Guide (https://bo3.gg/articles/cs2-cache-smokes-guide-best-lineups-for-every-site)
//   - bo3.gg Cache Utility Guide (https://bo3.gg/articles/cs2-cache-utility-guide-flashes-molotovs-grenades)
//   - austincs "All MUST KNOW Nades for Cache in CS2 (2026)" (https://www.youtube.com/watch?v=0_klMH393qo)
//   - Steam Guide: Cache Guide by Pastor Napas (https://steamcommunity.com/sharedfiles/filedetails/?id=3718386401)
//   - profilerr.net Cache Smokes (https://profilerr.net/cache-smokes-in-cs2/)
//   - csnades.gg Cache Guide (https://csnades.gg/guides/cache)
//   - daddyskins.com Cache CS2 (https://daddyskins.com/blog/counterpedia/cache-cs2/)
//
// Radar coordinates use 0–100 (percent of radar image), same as other map modules.
//
// Throw types:
//   JT   = Jump Throw (hold LMB, bind jump+throw)
//   WJT  = Walk + Jump Throw (walk forward, then jump throw)
//   LMB  = Standing Left Click only
//   RMB  = Standing Right Click only
//   WALK2 = Walk two steps then throw (running throw)
//   RUN  = Running throw (throw while running, no jump)

export const MAP_NAME = "Cache";
export const RADAR_URL =
  "https://raw.githubusercontent.com/MurkyYT/cs2-map-icons/main/images/radars/de_cache_radar_psd.png";

export const LINEUPS = {




  // ─────────────────────────────────────────────
  // A SITE — T-side executes

  t_back_a_site_smoke: {
    id: "t_back_a_site_smoke",
    name: "Back A Site Smoke",
    util: "SMOKE",
    throw: "LMB",
    side: "T",
    area: "A",
    mustLearn: false,
    instant: false,
    purpose: "Smokes off the back of A site / truck / CT truck area. Prevents CTs from falling back deep and denies a common retake angle. Critical for safe planting.",
    stand: "Stand near the squeaky door next to the number '4' painted on the wall. Align your crosshair so it crosses the railing (use your nade lineup crosshair for precision).",
    aim: "Find the part of the squeaky door / wall that sticks out — aim to the left of that protruding section until your crosshair just crosses the railing. Left click throw.",
    notes: "Works best combined with the A Cross smoke. After both are up, the A site entry is much cleaner. Can be thrown just before going through squeaky or A main.",
    screenshots: {
      stand: "",
      aim: "",
      result: "",
    },
    radarPos: { worldX: 1087.4, worldY: 1579.921 },
    radarTarget: { x: 28, y: 30 },
    source: { name: "community", url: "" },
    video: "https://www.youtube.com/watch?v=0_klMH393qo&t=202",
    austincs: { video: "https://www.youtube.com/watch?v=0_klMH393qo", timestamp: "202", note: "" },
  },




  // ─────────────────────────────────────────────
  // A SITE — CT-side defense

  ct_a_main_smoke_truck: {
    id: "ct_a_main_smoke_truck",
    name: "CT A Main Smoke (from Truck)",
    util: "SMOKE",
    throw: "LMB",
    side: "CT",
    area: "A",
    mustLearn: false,
    instant: false,
    purpose: "Defensive smoke at A main entrance from CT truck, slowing down T rushes and giving CT defenders safe time to reposition or for a rotation to arrive.",
    stand: "Stand by the light on the CT truck (back of A site). Align with the two windows above.",
    aim: "Aim at the cross between the two windows above. Left click throw.",
    notes: "Slows down fast A main pushes and creates confusion. Allows site defenders to safely adjust. Can also be thrown from CT Spawn — get into the corner and aim at the corner of the roof for a similar A main block.",
    screenshots: {
      stand: "",
      aim: "",
      result: "",
    },
    radarPos: { worldX: -916.079, worldY: 1071.703 },
    radarTarget: { x: 44.043, y: 17.871 },
    source: { name: "community", url: "" },
    video: "https://steamcommunity.com/sharedfiles/filedetails/?id=3718386401",
    austincs: { video: "", timestamp: "", note: "" },
  },







};

export const MUST_LEARN = [
];

export const COMBOS = [
  {
    id: "retake_a",
    name: "A Retake",
    site: "A",
    side: "CT",
    desc: "Flash from truck + push together.",
    roundTypes: ["FULL", "FORCE"],
    callout: '"A retake. Flash from truck, push on 3."',
    lineups: [
      { lineup: "ct_a_main_smoke_truck", who: "Rotator with smoke if needed" },
    ],
    tip: "Push TOGETHER. Trade kills win retakes more than opening picks.",
  },
];

export const UTILITY_BELTS = [
  ];

export const SCENARIOS = [
  {
    id: "mid_contested",
    title: "Mid is contested — what now?",
    side: "T",
    bullets: [
      "Connector smoke every round from best spawn — it's your mid key.",
      "If CTs stack mid, default to A or B with full util instead of forcing mid.",
      "Garage control wins Cache — don't take mid fights without a smoke down.",
    ],
  },
  {
    id: "post_plant",
    title: "Bomb is planted — what now?",
    side: "T",
    bullets: [
      "Spread post-plant angles (checkers, sunroom, heaven on B; forklift, highway on A).",
      "Save one molly for the bomb if you have it.",
      "Don't peek together — one HE can wipe a stacked angle.",
    ],
  },
  {
    id: "watch_flank",
    title: "Everyone is pushing site — who watches flank?",
    side: "T",
    bullets: [
      "One player glances mid / garage as you commit A or B.",
      "Most amateur round losses are a single lurker through mid.",
      "Call when you're clear to commit so the lurk player knows timing.",
    ],
  },
  {
    id: "solo_anchor",
    title: "You're solo on site",
    side: "CT",
    bullets: [
      "Smoke + molly buys time — don't peek until util is down.",
      "Call damage and position early so rotates know which site.",
      "On Cache, mid info is as important as site damage.",
    ],
  },
  {
    id: "force_round",
    title: "Force round utility",
    side: "T",
    bullets: [
      "One good smoke + flash is enough — don't need a full belt.",
      "Mid connector smoke is highest value on a force.",
      "Hit the site CTs aren't stacked on.",
    ],
  },
  {
    id: "eco_round",
    title: "Eco round — still use util?",
    side: "T",
    bullets: [
      "One smoke can still win mid or open a site for a surprise rush.",
      "Save guns next round if the util doesn't get a trade.",
      "CT delay smoke is strong on their eco too — respect it.",
    ],
  },
  {
    id: "last_alive",
    title: "Last alive with bomb planted",
    side: "T",
    bullets: [
      "Hold an angle. They must come to you.",
      "Listen for defuse and footsteps between repositioning.",
      "Don't take fair duels — time is on your side.",
    ],
  },
  {
    id: "retake_coordination",
    title: "Retake coordination",
    side: "CT",
    bullets: [
      "Push together from two entrances (A main + highway, B main + checkers).",
      "Flash before peek on retakes — Ts have post-plant crosshairs set.",
      "If two CTs alive, one flashes one trades.",
    ],
  },
  {
    id: "pistol_round",
    title: "Pistol round plan",
    side: "T",
    bullets: [
      "Mid connector smoke is still worth it on pistol — denies early picks.",
      "Rush one site as five after smoke, or split A/B with two each.",
      "Armor > util on pistol — only buy smoke if everyone agrees on a hit.",
    ],
  },
  {
    id: "rotate_timing",
    title: "When to rotate on Cache",
    side: "CT",
    bullets: [
      "Mid info first: connector smoke + footsteps tell you A vs B.",
      "Don't rotate on one footstep — wait for a second confirm or util.",
      "Leaving a solo anchor with smoke is better than three CTs stacking wrong site.",
    ],
  },
];

export const SETUP_POSITIONS = [
  ];

export const SPAWNS = {
  T: [
    { id: 1, name: "Spawn 1 (Line 3)", pos: { x: 36, y: 70 }, lineups: [] },
    { id: 2, name: "Spawn 2 (Left)",   pos: { x: 34, y: 71 }, lineups: [] },
    { id: 3, name: "Spawn 3 (Right)",  pos: { x: 38, y: 71 }, lineups: [] },
    { id: 4, name: "Spawn 4 (Back)",   pos: { x: 36, y: 73 }, lineups: [] },
    { id: 5, name: "Spawn 5 (A side)", pos: { x: 33, y: 70 }, lineups: [] },
  ],
  CT: [
    { id: 1, name: "Spawn 1 (Mid)",    pos: { x: 44, y: 28 }, lineups: [] },
    { id: 2, name: "Spawn 2 (A)",      pos: { x: 38, y: 26 }, lineups: [] },
    { id: 3, name: "Spawn 3 (Center)", pos: { x: 43, y: 26 }, lineups: [] },
    { id: 4, name: "Spawn 4 (B)",      pos: { x: 48, y: 28 }, lineups: [] },
    { id: 5, name: "Spawn 5 (Back)",   pos: { x: 43, y: 22 }, lineups: [] },
  ],
};
