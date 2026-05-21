/**
 * Draws a quadratic arc from one percent point to another on the radar.
 * Renders inside the MapRenderer SVG (viewBox 0..100) — coordinates are
 * already in that same coordinate space.
 *
 * The arc bulges perpendicular to the segment so two arrows between the
 * same throwFrom and landingAt don't overlap; callers can tune `bulge`
 * for layering.
 */
import { T } from "../../theme";

export interface MapPathProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color?: string;
  /** Stroke width in viewBox units (0..100). */
  strokeWidth?: number;
  /** How far the curve bulges off the straight line (viewBox units). */
  bulge?: number;
  /** Optional dash pattern, e.g. "1 1". */
  dash?: string;
  opacity?: number;
  /** Stable id used for arrowhead marker isolation between paths. */
  markerId?: string;
}

export function MapPath({
  from,
  to,
  color = T.accent,
  strokeWidth = 0.4,
  bulge = 8,
  dash,
  opacity = 0.85,
  markerId = "arrow",
}: MapPathProps) {
  // Midpoint, then offset perpendicular to the segment by `bulge`.
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  // Perpendicular unit vector (rotated 90°).
  const px = -dy / len;
  const py = dx / len;
  const cx = mx + px * bulge;
  const cy = my + py * bulge;

  return (
    <g pointerEvents="none">
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX={9}
          refY={5}
          markerWidth={4}
          markerHeight={4}
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={color} opacity={opacity} />
        </marker>
      </defs>
      <path
        d={`M${from.x},${from.y} Q${cx},${cy} ${to.x},${to.y}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={dash}
        opacity={opacity}
        markerEnd={`url(#${markerId})`}
      />
    </g>
  );
}
