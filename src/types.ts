/**
 * Domain types for the Dust 2 playbook (v6).
 *
 * Coordinate model:
 *   - World coords: CS2 game-world units. The output of `setpos x y z`.
 *     The only format we accept for storage of authoritative positions.
 *   - Percent: 0..100 on each radar axis. Stable across image sizes.
 *   - Pixel: derived from world via map-config; never stored.
 *
 * Three first-class entities:
 *   - Spawn: a fixed in-game spawn position (15 T + 5 CT for Dust 2).
 *   - Lineup: a single utility throw. Renders as a 2x2 walkthrough
 *     (Position → Aim → Throw → Result).
 *   - Scenario: a numbered, named team execute referencing N players,
 *     each with a chronological action list pointing at Lineup ids.
 */

export type Side = "T" | "CT";
export type UtilityType = "smoke" | "flash" | "molotov" | "he";
export type ThrowStyle = "normal" | "jump" | "run" | "jump+run" | "crouch";
export type Movement = "standing" | "walking" | "running";
export type Difficulty = "easy" | "medium" | "hard";
export type ScenarioDifficulty = "beginner" | "intermediate" | "advanced";

export interface WorldPoint {
  x: number;
  y: number;
  z?: number;
}

export interface PercentPoint {
  x: number;
  y: number;
}

/** Pixel coords inside a rendered radar image — derived, never stored. */
export interface PixelPoint {
  x: number;
  y: number;
}

export interface ThrowAngle {
  pitch: number;
  yaw: number;
  roll: number;
}

export interface MapConfig {
  id: string;
  displayName: string;
  valveMapId: string;       // e.g. "de_dust2"
  radarImage: string;       // path served from /public, e.g. "/maps/dust2/radar.png"
  pos_x: number;            // world X at the LEFT edge of the radar PNG
  pos_y: number;            // world Y at the TOP edge of the radar PNG
  scale: number;            // world units per pixel × sourceResolution
  sourceResolution: number; // typically 1024
}

export interface Spawn {
  id: string;            // stable id like "dust2-t-s6"
  side: Side;
  label: string;         // short, e.g. "S6"
  world: WorldPoint;     // setpos values from the game
}

/**
 * One utility throw. Renders as a 2x2 walkthrough; the 4 screenshot
 * slots are renamed from v5: `stand` → `position`, and `throw` is new.
 */
export interface Lineup {
  id: string;                              // snake_case slug
  name: string;
  type: UtilityType;
  side: Side;
  area: string;                            // landing area callout
  throwFrom: {
    world: WorldPoint;                     // exact setpos
    label?: string;                        // callout name of stand position
  };
  landingAt: {
    world?: WorldPoint;                    // exact setpos at smoke center, preferred
    percent?: PercentPoint;                // cs2util-style 2D-map dot, fallback
    label?: string;
  };
  throwAngle?: ThrowAngle;                 // setang
  throwStyle: ThrowStyle;
  movement: Movement;
  difficulty: Difficulty;
  airTimeSeconds?: number;
  description?: string;
  /**
   * Four screenshot slots for the 2x2 walkthrough cards:
   *   - position: where to stand (radar crop or in-game frame)
   *   - aim:      crosshair alignment frame
   *   - throw:    apex/release frame (when applicable)
   *   - result:   where the utility lands
   * Any missing slot renders a fallback (live radar crop / icon / text).
   */
  screenshots?: {
    position?: string;
    aim?: string;
    throw?: string;
    result?: string;
  };
  source?: {
    name: string;
    url: string;
  };
}

/** One step in a scenario player's chronological action list. */
export interface ScenarioAction {
  order: number;          // 1, 2, 3 ... ordering within this player's sequence
  lineupId: string;       // references Lineup.id — boot validates ref integrity
  description?: string;   // optional cue, e.g. "after support smoke peeks"
  timing?: string;        // optional human-readable timing, e.g. "t+3s"
}

/** One player in a scenario. */
export interface ScenarioPlayer {
  role: string;              // freeform: "a-man", "b-man", "lurker", "entry", "support"
  label: string;             // display name: "Player A — Entry"
  color: string;             // hex color used for arc + dot rendering
  startingSpawnId?: string;  // optional Spawn.id — drawn larger on the radar
  actions: ScenarioAction[];
}

/** A numbered, named team execute. */
export interface Scenario {
  id: string;                       // stable slug, e.g. "a_default_3_man"
  number: number;                   // user-facing number, e.g. 4 ("lets do scenario 4")
  name: string;                     // display name
  description: string;
  side: Side;
  targetArea: string;
  difficulty: ScenarioDifficulty;
  playerCount: 2 | 3 | 4 | 5;
  players: ScenarioPlayer[];
  roleOrder?: string[];             // optional: display ordering of role tabs
  notes?: string;
}

/**
 * One CT-side position the user might play (A anchor, B anchor, mid
 * control, etc.) with a loose recommendation of what utility helps in
 * that role. Intentionally NOT hyper-specific — "these would be helpful
 * to know if you're playing here" rather than "do exactly these steps."
 *
 * `recommendedLineupIds` references existing Lineup ids; the validator
 * rejects dangling refs at boot.
 * `utilityFocus` is free-text guidance ("smoke long, molly default").
 */
export interface CtPosition {
  id: string;
  label: string;            // display name e.g. "A Anchor"
  description: string;      // 1-2 sentence role summary
  spawnHint?: string;       // optional: where to spawn / walk to
  recommendedLineupIds: string[]; // Lineup id references — may be empty
  utilityFocus: string;     // freeform: what to carry / when to throw
}

/** Bundle of all editable data for Dust 2. Loaded once at boot. */
export interface DustData {
  config: MapConfig;
  spawns: Spawn[];
  lineups: Lineup[];
  scenarios: Scenario[];
  ctPositions: CtPosition[];
}
