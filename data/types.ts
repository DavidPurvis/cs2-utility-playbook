/**
 * Core data model for the Dust 2 Playbook.
 *
 * All coordinates are CS2 world coordinates. Convert to radar percentages
 * via `lib/mapCoordinates.ts::worldToMapPercent`.
 */

export type MapId = "dust2";

export type UtilType = "smoke" | "flash" | "molotov" | "he";
export type Side = "T" | "CT";
export type ThrowType = "normal" | "jump" | "run" | "jump+run";
export type Priority = "essential" | "important" | "situational";
export type Difficulty = 1 | 2 | 3;
export type SiteCode = "A" | "B" | "MID";
export type PlayerSlot = "A" | "B" | "C";

export interface WorldPoint {
  /** CS2 world X (east-positive). */
  x: number;
  /** CS2 world Y (north-positive; pixel Y is inverted from this). */
  y: number;
}

export interface Lineup {
  /** Stable id, slug-ish: e.g. "dust2_smoke_xbox_from_tspawn". */
  id: string;
  map: MapId;
  type: UtilType;
  side: Side;
  /** Human-readable name shown in cards. */
  name: string;
  /** Callout name of the throw position, e.g. "T Spawn". */
  throwFrom: string;
  /** World coords where the player stands. */
  throwFromCoords: WorldPoint;
  /** Callout name of the landing spot, e.g. "Xbox". */
  landsAt: string;
  /** World coords where the utility lands. */
  landsAtCoords: WorldPoint;
  throwType: ThrowType;
  difficulty: Difficulty;
  /** Step-by-step instructions for the lineup. */
  description: string;
  /** Tactical purpose: why you throw this. */
  purpose: string;
  priority: Priority;
  videoUrl?: string;
  imageUrl?: string;
}

export interface ScenarioRole {
  player: PlayerSlot;
  /** Short role label: "Entry / Flash", "Support / Smoke", etc. */
  role: string;
  /** Lineups this player throws, in execution order. */
  lineupIds: string[];
  /** Free-form per-player instructions and timing cues. */
  instructions: string;
}

export interface Scenario {
  id: string;
  map: MapId;
  /** Callout name for comms, e.g. "A Long Execute". */
  name: string;
  site: SiteCode;
  /** Number of coordinated players this execute requires. */
  playerCount: 2 | 3;
  /** What this execute does, when to use it. */
  description: string;
  difficulty: Difficulty;
  /** Lookup tags: ["long", "standard"], ["split", "advanced"], etc. */
  tags: string[];
  roles: ScenarioRole[];
}

export interface Zone {
  id: string;
  /** Callout name shown in the UI, e.g. "A Site". */
  name: string;
  /** Site that this zone belongs to (used to filter scenarios). */
  site: SiteCode;
  /** Convex polygon in world coords; rendered via worldToMapPercent. */
  polygon: WorldPoint[];
}
