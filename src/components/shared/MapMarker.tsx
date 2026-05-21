import { T } from "../../theme";

export interface MapMarkerProps {
  /** Percent position on the radar (0-100). */
  x: number;
  y: number;
  label?: string;
  color?: string;
  size?: number;
  shape?: "circle" | "x" | "ring";
  title?: string;
  onClick?: () => void;
}

/**
 * Single dot/icon placed at a radar-percent coordinate. The parent
 * SVG uses `viewBox="0 0 100 100"` so x/y are also in percent space.
 */
export function MapMarker({
  x,
  y,
  label,
  color = T.accent,
  size = 2.4,
  shape = "circle",
  title,
  onClick,
}: MapMarkerProps) {
  return (
    <g
      transform={`translate(${x}, ${y})`}
      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
    >
      {shape === "circle" && (
        <circle
          r={size}
          fill={color}
          opacity={0.92}
          stroke="#000"
          strokeWidth={0.3}
        />
      )}
      {shape === "ring" && (
        <circle r={size} fill="none" stroke={color} strokeWidth={0.5} />
      )}
      {shape === "x" && (
        <>
          <line x1={-size} y1={-size} x2={size} y2={size} stroke={color} strokeWidth={0.5} />
          <line x1={-size} y1={size} x2={size} y2={-size} stroke={color} strokeWidth={0.5} />
          <circle r={size + 0.4} fill="none" stroke={color} strokeWidth={0.25} opacity={0.6} />
        </>
      )}
      {label && (
        <text
          x={0}
          y={0.5}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.95}
          fontWeight={800}
          fill="#000"
          fontFamily={T.fontMono}
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {label}
        </text>
      )}
      {title && <title>{title}</title>}
    </g>
  );
}
