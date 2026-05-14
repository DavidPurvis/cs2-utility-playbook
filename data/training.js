/*
  TRAINING — warmup and training exercise lists.

  Edit this file to match your team's preferred routine.
  Each exercise has:
    - id, name    — what it is
    - tool        — which app (CS2, Kovaak's, Refrag, Aimlabs)
    - duration    — how long to spend
    - launch      — a URL. steam://run/APPID opens Steam directly, https:// opens browser
    - note        — one sentence, what to focus on
*/

export const WARMUP = [
  {
    id: "dm_ffa_10min",
    name: "FFA Deathmatch",
    tool: "CS2",
    duration: "10 min",
    launch: "steam://run/730",
    note: "Community FFA server. AK/M4 only. Focus on crosshair placement, not score.",
  },
  {
    id: "kovaaks_click_timing",
    name: "1w6ts Reload",
    tool: "Kovaak's",
    duration: "5 min",
    launch: "steam://run/824270",
    note: "Classic click-timing. 6 targets, 1 wall. Smooth aim, no flicking.",
  },
  {
    id: "refrag_prefire",
    name: "Prefire Practice",
    tool: "Refrag",
    duration: "10 min",
    launch: "https://refrag.gg/practice/prefire",
    note: "Pick current map. Prefire every angle at a comfortable pace.",
  },
  {
    id: "aimlabs_gridshot",
    name: "Gridshot",
    tool: "Aimlabs",
    duration: "5 min",
    launch: "steam://run/714010",
    note: "Quick hand warmup. Don't chase high scores — focus on smooth mouse control.",
  },
  {
    id: "dm_pistol",
    name: "Pistol-Only DM",
    tool: "CS2",
    duration: "5 min",
    launch: "steam://run/730",
    note: "USP or Glock only. Practice counter-strafing and first-bullet accuracy.",
  },
  {
    id: "kovaaks_sixshot",
    name: "Sixshot",
    tool: "Kovaak's",
    duration: "3 min",
    launch: "steam://run/824270",
    note: "Speed + precision. Aim for consistent rhythm, not just fast clicks.",
  },
];

export const TRAINING = [
  {
    id: "kovaaks_popcorn",
    name: "Popcorn",
    tool: "Kovaak's",
    duration: "10 min",
    launch: "steam://run/824270",
    note: "Tracking. Small targets, smooth mouse. Build the muscle for spraying on moving targets.",
  },
  {
    id: "refrag_retake",
    name: "Retake Practice",
    tool: "Refrag",
    duration: "15 min",
    launch: "https://refrag.gg/practice/retake",
    note: "Pick a map you're weak on. Practice trading with bots.",
  },
  {
    id: "dm_hs_only",
    name: "HS-Only Deathmatch",
    tool: "CS2",
    duration: "15 min",
    launch: "steam://run/730",
    note: "Community HS-only server. AK only. Forces crosshair at head level.",
  },
  {
    id: "aimlabs_spidershot",
    name: "Spidershot",
    tool: "Aimlabs",
    duration: "5 min",
    launch: "steam://run/714010",
    note: "Flick training. Focus on landing the first shot, not speed.",
  },
  {
    id: "kovaaks_bounce_180",
    name: "Bounce 180 Tracking",
    tool: "Kovaak's",
    duration: "5 min",
    launch: "steam://run/824270",
    note: "Fast direction-change tracking. Builds the reflex for tracking players who jiggle-peek.",
  },
  {
    id: "refrag_spray",
    name: "Spray Control",
    tool: "Refrag",
    duration: "10 min",
    launch: "https://refrag.gg/practice/spray-control",
    note: "AK and M4. Practice pulling down to a wall until the grouping tightens.",
  },
  {
    id: "kovaaks_patTargetSwitch",
    name: "patTargetSwitch",
    tool: "Kovaak's",
    duration: "5 min",
    launch: "steam://run/824270",
    note: "Target switching. Two targets, smooth flicks between them. Simulates trading kills.",
  },
  {
    id: "cs2_workshop_aim",
    name: "Aim Botz Workshop",
    tool: "CS2",
    duration: "10 min",
    launch: "steam://run/730",
    note: "workshop map by Mr. uLLeticaL. 100 kills standing, 100 strafing.",
  },
  {
    id: "refrag_clutch",
    name: "Clutch Practice",
    tool: "Refrag",
    duration: "10 min",
    launch: "https://refrag.gg/practice/clutch",
    note: "1vX clutch scenarios. Practice time management and utility usage under pressure.",
  },
  {
    id: "dm_awp",
    name: "AWP Deathmatch",
    tool: "CS2",
    duration: "10 min",
    launch: "steam://run/730",
    note: "AWP-only community server. Practice flicks and holding angles.",
  },
];

export const TOOL_COLORS = {
  "CS2":      "#ff6644",
  "Kovaak's": "#44bbff",
  "Refrag":   "#00ffaa",
  "Aimlabs":  "#ff44aa",
};
