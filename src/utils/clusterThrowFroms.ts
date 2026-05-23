/**
 * Clusters lineups by throwFrom proximity.
 *
 * Groups lineups whose throwFrom coordinates are within MERGE_RADIUS_SQ
 * (150^2 world units) into shared clusters, using the first lineup's
 * position as the representative. The key is the sorted list of lineup
 * IDs joined by "|", making it stable across input permutations.
 *
 * Extracted from MapTab so the component file only exports React
 * components (required by react-refresh HMR).
 */
import { worldDistSq } from "./bounds";
import type { Lineup, WorldPoint } from "../types";

/** ~150 world units — roughly one player-width radius. */
const MERGE_RADIUS_SQ = 150 * 150;

export interface ThrowFromCluster {
  key: string;             // stable id (sorted lineup ids joined)
  representative: WorldPoint;
  lineups: Lineup[];
}

export function clusterThrowFroms(lineups: Lineup[]): ThrowFromCluster[] {
  const clusters: ThrowFromCluster[] = [];
  for (const l of lineups) {
    const existing = clusters.find((c) =>
      worldDistSq(c.representative, l.throwFrom.world) <= MERGE_RADIUS_SQ
    );
    if (existing) {
      existing.lineups.push(l);
    } else {
      clusters.push({
        key: l.id,
        representative: l.throwFrom.world,
        lineups: [l],
      });
    }
  }
  // Recompute keys as sorted-lineup-id-list so they're stable across
  // permutations of the input.
  return clusters.map((c) => ({
    ...c,
    key: c.lineups
      .map((l) => l.id)
      .sort()
      .join("|"),
  }));
}
