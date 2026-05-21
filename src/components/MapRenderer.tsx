import {
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { T } from "../theme";
import type { MapConfig } from "../types/map";

export interface MapRendererProps {
  config: MapConfig;
  children?: (size: { width: number; height: number }) => ReactNode;
  /** Called when the user clicks anywhere on the radar — only fired when admin is active and listening. */
  onMapClick?: (pixel: { x: number; y: number }) => void;
  /** Click overlay enabled (admin "click-to-place" mode). */
  clickable?: boolean;
}

type ImgState = { loaded: boolean; errored: boolean };
function imgReducer(_state: ImgState, action: "reset" | "loaded" | "errored"): ImgState {
  if (action === "reset") return { loaded: false, errored: false };
  if (action === "loaded") return { loaded: true, errored: false };
  return { loaded: false, errored: true };
}

/**
 * Square SVG radar with the map image and a slot for positioned
 * children (spawns, utility markers, scenario arcs). The viewBox is
 * fixed at the source resolution so children using world-coord
 * conversion always get consistent percentages.
 *
 * Children render function receives the current rendered size in
 * pixels so it can call worldToPixel(...).
 */
export function MapRenderer({ config, children, onMapClick, clickable = false }: MapRendererProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const update = () => {
      const r = el.getBoundingClientRect();
      setSize({ width: r.width, height: r.height });
    };
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Image-load tracking using reducer + the image href as a key, so a
  // src change resets state without us calling setState in an effect.
  const [img, dispatchImg] = useReducer(imgReducer, { loaded: false, errored: false });
  const { loaded, errored } = img;

  // The radarImage path in map-config.json is the public root (e.g.
  // "/maps/dust2/radar.png"). When deployed under a subpath (GitHub
  // Pages serves us under "/cs2-utility-playbook/"), Vite exposes that
  // base via import.meta.env.BASE_URL. Stitch them together so the
  // <image> href resolves both in dev and in the production deploy.
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const radarHref = config.radarImage.startsWith("http")
    ? config.radarImage
    : `${base}${config.radarImage}`;

  const handleSvgClick = (e: ReactMouseEvent<SVGSVGElement>) => {
    if (!clickable || !onMapClick) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onMapClick({ x, y });
  };

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        background: T.bgDeep,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`${config.displayName} radar`}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          cursor: clickable ? "crosshair" : "default",
        }}
        onClick={handleSvgClick}
      >
        <image
          key={radarHref}
          href={radarHref}
          x={0}
          y={0}
          width={100}
          height={100}
          preserveAspectRatio="xMidYMid meet"
          opacity={0.85}
          onLoad={() => dispatchImg("loaded")}
          onError={() => dispatchImg("errored")}
        />
        {/* Diagonal stripe placeholder if image missing */}
        {(!loaded || errored) && (
          <g pointerEvents="none">
            <rect x={0} y={0} width={100} height={100} fill={T.bgPanel} />
            <text
              x={50}
              y={50}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={3}
              fill={T.textDim}
              fontFamily={T.fontMono}
            >
              {errored
                ? `Radar image not found at ${config.radarImage}`
                : "Loading radar…"}
            </text>
          </g>
        )}
        {size.width > 0 && children && children(size)}
      </svg>
    </div>
  );
}
