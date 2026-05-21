/**
 * Domain types for the Dust 2 playbook.
 *
 * Coordinate model:
 *   - World coords: CS2 game-world units. The output of `setpos x y z`.
 *     `x` is east-positive, `y` is north-positive, `z` is vertical.
 *     This is the ONLY format we accept for storage of authoritative
 *     player positions.
 *   - Percent: 0–100 on each radar axis. Useful for legacy data and as
 *     a stable, image-size-independent storage form.
 *   - Pixel: where the dot actually draws inside the rendered radar
 *     image. Derived; never stored.
 */

export interface WorldPoint {
  x: number;
  y: number;
  z?: number;
}

export interface PercentPoint {
  x: number;
  y: number;
}

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
  valveMapId: string;     // e.g. "de_dust2"
  radarImage: string;     // path served from /public, e.g. "/maps/dust2/radar.png"
  pos_x: number;          // world X at the LEFT edge of the radar PNG
  pos_y: number;          // world Y at the TOP edge of the radar PNG
  scale: number;          // world units per pixel × sourceResolution
  sourceResolution: number; // typically 1024
}

export type Side = "T" | "CT";

export interface Spawn {
  id: string;            // stable id like "dust2-t-s6"
  side: Side;
  label: string;         // human-readable, e.g. "S6"
  world: WorldPoint;     // setpos values from the game
}

export type UtilityType = "smoke" | "flash" | "molotov" | "he";
export type ThrowStyle = "normal" | "jump" | "run" | "jump+run" | "crouch";
export type Movement = "standing" | "walking" | "running";
export type Difficulty = "easy" | "medium" | "hard";

export interface Utility {
  id: string;                             // snake-case slug
  name: string;
  type: UtilityType;
  side: Side;
  area: string;                           // landing-area callout
  throwFrom: {
    world: WorldPoint;                    // exact setpos
    label?: string;                       // callout name of stand position
  };
  landingAt: {
    world?: WorldPoint;                   // exact setpos at smoke center, preferred
    percent?: PercentPoint;               // cs2util-style 2D-map dot, fallback
    label?: string;
  };
  throwAngle?: ThrowAngle;                // setang
  throwStyle: ThrowStyle;
  movement: Movement;
  difficulty: Difficulty;
  airTimeSeconds?: number;
  description?: string;
  screenshots?: {
    stand?: string;                       // /screenshots/dust2/foo.jpg
    aim?: string;
    result?: string;
  };
  source?: {
    name: string;
    url: string;
  };
}

export type ScenarioDifficulty = "beginner" | "intermediate" | "advanced";

export interface ScenarioAction {
  order: number;
  utilityId: string;     // refers to Utility.id
  description?: string;
  timing?: string;
}

export interface ScenarioPlayer {
  role: string;          // free text: "Entry", "Support", "Lurk"
  label: string;         // "Player A"
  color: string;         // hex color used for markers + arcs
  actions: ScenarioAction[];
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  map: "dust2";
  side: Side;
  targetArea: string;
  difficulty: ScenarioDifficulty;
  playerCount: 2 | 3 | 4 | 5;
  players: ScenarioPlayer[];
  notes?: string;
  screenshotId?: string;
}

/**
 * Bundle of all editable data for one map. Loaded at boot, merged with
 * localStorage overrides, written back out via the admin "Export" flow.
 */
export interface MapDataBundle {
  config: MapConfig;
  spawns: Spawn[];
  utilities: Utility[];
  scenarios: Scenario[];
}
