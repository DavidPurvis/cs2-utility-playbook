import type { Scenario } from "./types";

/**
 * Dust 2 coordinated execute scenarios.
 *
 * Each scenario assigns specific lineups to specific players (A/B/C) and
 * gives executable instructions including timing cues. Scenarios assume a
 * 5-stack where 1–2 teammates outside the scenario freelance or hold
 * elsewhere.
 */
export const DUST2_SCENARIOS: readonly Scenario[] = [
  {
    id: "dust2_a_long_execute_2p",
    map: "dust2",
    name: "A Long Execute",
    site: "A",
    playerCount: 2,
    description:
      "Standard 2-man Long take. One player handles smokes (Xbox + A Cross), the other handles entry (Long flash + Car molly). Fast, repeatable, hard to stop without rotating CTs early.",
    difficulty: 1,
    tags: ["long", "standard", "essential"],
    roles: [
      {
        player: "A",
        role: "Long Support / Smoker",
        lineupIds: [
          "dust2_smoke_xbox_from_tspawn",
          "dust2_smoke_a_cross_from_longcorner",
        ],
        instructions:
          "1) Out of T Spawn, jump-throw Xbox smoke immediately. 2) Walk through mid doors to Long Corner. 3) After your entry calls in, throw A Cross smoke. 4) Trade your entry on site.",
      },
      {
        player: "B",
        role: "Entry / Flash",
        lineupIds: ["dust2_flash_a_long_entry", "dust2_molly_a_car"],
        instructions:
          "1) Rush Long with your entry. 2) Pop A Long flash from Long Corner as Player A's Xbox smoke pops. 3) Once cross-smoke is up, molly A Car. 4) Swing onto site through default — count on Player A to trade.",
      },
    ],
  },
  {
    id: "dust2_a_full_execute_3p",
    map: "dust2",
    name: "A Full Execute",
    site: "A",
    playerCount: 3,
    description:
      "Long + Short pinch onto A. Three players coordinate utility to lock down CT angles and force defenders off site. The most complete A take on the map.",
    difficulty: 2,
    tags: ["a-site", "split", "execute"],
    roles: [
      {
        player: "A",
        role: "Long Support / Smoker",
        lineupIds: [
          "dust2_smoke_xbox_from_tspawn",
          "dust2_smoke_a_cross_from_longcorner",
        ],
        instructions:
          "1) Xbox smoke out of T Spawn. 2) Push to Long Corner; throw A Cross smoke on call. 3) Trade Player B's entry through Long.",
      },
      {
        player: "B",
        role: "Long Entry",
        lineupIds: ["dust2_flash_a_long_entry", "dust2_molly_a_car"],
        instructions:
          "1) Rush Long. 2) Pop flash from Long Corner. 3) Molly A Car. 4) Enter site as cross-smoke pops.",
      },
      {
        player: "C",
        role: "Short Entry",
        lineupIds: [
          "dust2_smoke_a_stairs_from_catwalk",
          "dust2_flash_a_short_push",
          "dust2_molly_a_goose",
        ],
        instructions:
          "1) Push to Catwalk. 2) Smoke A Stairs as Player B enters Long. 3) Pop Short flash; swing onto site through Short. 4) Throw Goose molly onto site post-clear.",
      },
    ],
  },
  {
    id: "dust2_a_short_execute_2p",
    map: "dust2",
    name: "A Short / Cat Execute",
    site: "A",
    playerCount: 2,
    description:
      "When Long is locked down by an AWP, hit A through Short with 2 players. Smokes Stairs and Xbox; flashes over Short.",
    difficulty: 2,
    tags: ["a-site", "short", "anti-awp"],
    roles: [
      {
        player: "A",
        role: "Short Support / Smoker",
        lineupIds: [
          "dust2_smoke_xbox_from_tspawn",
          "dust2_smoke_a_stairs_from_catwalk",
        ],
        instructions:
          "1) Xbox smoke out of T Spawn. 2) Push to Catwalk. 3) Throw A Stairs smoke to deny the Stairs hold. 4) Trade Player B's swing.",
      },
      {
        player: "B",
        role: "Short Entry",
        lineupIds: ["dust2_flash_a_short_push", "dust2_molly_a_goose"],
        instructions:
          "1) Push Catwalk with Player A. 2) Pop Short flash as stairs smoke goes up. 3) Swing onto site through Short. 4) Throw Goose molly to flush the hidden angle.",
      },
    ],
  },
  {
    id: "dust2_b_tunnels_rush_2p",
    map: "dust2",
    name: "B Tunnels Rush",
    site: "B",
    playerCount: 2,
    description:
      "Fast 2-man B take when you read no CT rotates. Window smoke + Doors smoke + flash + car molly. Hits the site within 25 seconds.",
    difficulty: 1,
    tags: ["b-site", "fast", "rush"],
    roles: [
      {
        player: "A",
        role: "Tuns Support / Smoker",
        lineupIds: [
          "dust2_smoke_b_window_from_tunnels",
          "dust2_smoke_b_doors_from_upper_tunnels",
        ],
        instructions:
          "1) Take Upper Tunnels. 2) Throw B Window smoke immediately. 3) Jump-throw B Doors smoke. 4) Trade Player B's entry.",
      },
      {
        player: "B",
        role: "B Entry",
        lineupIds: ["dust2_flash_b_entry_from_tunnels", "dust2_molly_b_car"],
        instructions:
          "1) Move with Player A to Upper Tunnels. 2) Pop B Entry flash as Window smoke connects. 3) Swing site through Doors. 4) Molly B Car to flush the back hold.",
      },
    ],
  },
  {
    id: "dust2_b_full_execute_3p",
    map: "dust2",
    name: "B Full Execute",
    site: "B",
    playerCount: 3,
    description:
      "3-man B take with full utility coverage. Smokes seal the angles, mollies pre-flush plant and car, flash for the swing. Post-plant is built in.",
    difficulty: 2,
    tags: ["b-site", "execute", "standard"],
    roles: [
      {
        player: "A",
        role: "Smoker",
        lineupIds: [
          "dust2_smoke_b_window_from_tunnels",
          "dust2_smoke_b_doors_from_upper_tunnels",
        ],
        instructions:
          "1) Take Upper Tunnels. 2) B Window smoke. 3) B Doors smoke. 4) Trade entry; hold default after plant.",
      },
      {
        player: "B",
        role: "Entry / Flash",
        lineupIds: ["dust2_flash_b_entry_from_tunnels", "dust2_molly_b_default"],
        instructions:
          "1) Move with team to Upper Tunnels. 2) Pop B Entry flash as smokes connect. 3) Molly B Default to flush the plant. 4) Swing site.",
      },
      {
        player: "C",
        role: "Anti-Hold Molly",
        lineupIds: ["dust2_molly_b_car"],
        instructions:
          "1) Move with Player A. 2) Throw B Car molly to flush the back corner. 3) Swing site as 3rd in. 4) Hold back-site post-plant.",
      },
    ],
  },
  {
    id: "dust2_b_mid_split_3p",
    map: "dust2",
    name: "B Mid Split",
    site: "B",
    playerCount: 3,
    description:
      "Two players hit B from Tunnels; the third flanks through Mid → CT Mid → B doors after CT mid smoke pops. Maximum chaos for a B retake call.",
    difficulty: 3,
    tags: ["b-site", "split", "advanced"],
    roles: [
      {
        player: "A",
        role: "Tuns Smoker",
        lineupIds: [
          "dust2_smoke_b_window_from_tunnels",
          "dust2_flash_b_entry_from_tunnels",
        ],
        instructions:
          "1) Take Upper Tunnels. 2) Throw B Window smoke. 3) Pop B Entry flash as Player C calls 'mid through.' 4) Swing site.",
      },
      {
        player: "B",
        role: "Tuns Entry",
        lineupIds: [
          "dust2_smoke_b_doors_from_upper_tunnels",
          "dust2_molly_b_car",
        ],
        instructions:
          "1) Move with Player A. 2) Throw B Doors smoke. 3) Molly B Car. 4) Entry swing site with flash.",
      },
      {
        player: "C",
        role: "Mid Flank",
        lineupIds: [
          "dust2_smoke_xbox_from_tspawn",
          "dust2_smoke_ct_mid_from_tspawn",
        ],
        instructions:
          "1) Xbox smoke out of T Spawn. 2) Push mid; throw CT Mid smoke. 3) Take mid doors, push to CT Mid. 4) Call 'mid through' and swing B Doors as Player A entries.",
      },
    ],
  },
  {
    id: "dust2_mid_control_2p",
    map: "dust2",
    name: "Mid Control",
    site: "MID",
    playerCount: 2,
    description:
      "Map control opener for default rounds. Xbox + CT mid smokes + Short flash. Enables a late rotation to either site once you read the CT setup.",
    difficulty: 1,
    tags: ["mid", "default", "info"],
    roles: [
      {
        player: "A",
        role: "Mid Smoker",
        lineupIds: [
          "dust2_smoke_xbox_from_tspawn",
          "dust2_smoke_ct_mid_from_tspawn",
        ],
        instructions:
          "1) Xbox smoke out of T Spawn. 2) Push mid doors. 3) Throw CT Mid smoke. 4) Hold mid-doors angle while Player B takes Catwalk.",
      },
      {
        player: "B",
        role: "Cat Control",
        lineupIds: ["dust2_flash_a_short_push", "dust2_smoke_a_stairs_from_catwalk"],
        instructions:
          "1) Move with Player A through mid. 2) Take Catwalk under their CT Mid smoke. 3) Pop Short flash to clear cat info. 4) Hold cat or drop to short for a late-round split.",
      },
    ],
  },
];

/**
 * Quick lookup by scenario id.
 */
export const DUST2_SCENARIOS_BY_ID: Readonly<Record<string, Scenario>> =
  Object.fromEntries(DUST2_SCENARIOS.map((s) => [s.id, s]));

/**
 * Scenarios indexed by the site they execute (A / B / MID), for the
 * "Scenarios involving this area" panel.
 */
export const DUST2_SCENARIOS_BY_SITE: Readonly<Record<"A" | "B" | "MID", Scenario[]>> = {
  A: DUST2_SCENARIOS.filter((s) => s.site === "A"),
  B: DUST2_SCENARIOS.filter((s) => s.site === "B"),
  MID: DUST2_SCENARIOS.filter((s) => s.site === "MID"),
};
