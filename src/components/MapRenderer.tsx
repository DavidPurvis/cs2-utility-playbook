import {
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { T } from "../theme";
import type { MapConfig } from "../types/map";

export interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

const FULL_VIEWBOX: ViewBox = { x: 0, y: 0, width: 100, height: 100 };

export interface MapRendererProps {
  config: MapConfig;
  children?: (size: { width: number; height: number }) => ReactNode;
  /**
   * Called when the user clicks anywhere on the radar — only fired when
   * `clickable` is true. The coordinate is in percent space (0..100)
   * matching the underlying SVG so it can be fed straight into
   * `percentToWorld` or stored as `landingAt.percent`.
   */
  onMapClick?: (percent: { x: number; y: number }) => void;
  /** Click overlay enabled (admin "click-to-place" mode). */
  clickable?: boolean;
  /**
   * Sub-region of the percent-space coordinate system to render.
   * Defaults to the full radar (0,0,100,100). Changes animate over
   * ~400ms via requestAnimationFrame.
   */
  viewBox?: ViewBox;
  /** Optional overlay rendered above the SVG content (e.g. close button). */
  overlay?: ReactNode;
}

type ImgState = { loaded: boolean; errored: boolean };
function imgReducer(_state: ImgState, action: "reset" | "loaded" | "errored"): ImgState {
  if (action === "reset") return { loaded: false, errored: false };
  if (action === "loaded") return { loaded: true, errored: false };
  return { loaded: false, errored: true };
}

// Smooth cubic ease-in-out — feels natural for camera-style moves.
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const ANIM_MS = 400;

/**
 * Square SVG radar with the map image and a slot for positioned
 * children (spawns, utility markers, scenario arcs). The internal
 * coordinate system is the same 0..100 percent space used by
 * `worldToPercent` regardless of any zoom; the viewBox prop controls
 * which sub-region of that space is visible.
 *
 * Children render function receives the current rendered size in
 * pixels so it can call `worldToPixel(...)`.
 */
export function MapRenderer({
  config,
  children,
  onMapClick,
  clickable = false,
  viewBox: targetViewBox = FULL_VIEWBOX,
  overlay,
}: MapRendererProps) {
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

  // Animate the viewBox toward the target prop. We render the
  // intermediate value as a `viewBox` string each frame.
  const [vb, setVb] = useState<ViewBox>(targetViewBox);
  const animRef = useRef<{ from: ViewBox; to: ViewBox; start: number; raf: number } | null>(null);

  useEffect(() => {
    const current = animRef.current
      ? animRef.current.to // mid-animation — capture latest target as the new "from"
      : vb;
    const from: ViewBox = animRef.current ? sampleViewBox(animRef.current) : current;
    const to = targetViewBox;
    if (
      from.x === to.x &&
      from.y === to.y &&
      from.width === to.width &&
      from.height === to.height
    ) {
      return;
    }
    if (animRef.current) cancelAnimationFrame(animRef.current.raf);

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ANIM_MS);
      const e = easeInOutCubic(t);
      setVb({
        x: lerp(from.x, to.x, e),
        y: lerp(from.y, to.y, e),
        width: lerp(from.width, to.width, e),
        height: lerp(from.height, to.height, e),
      });
      if (t < 1) {
        if (animRef.current) animRef.current.raf = requestAnimationFrame(tick);
      } else {
        animRef.current = null;
      }
    };
    const raf = requestAnimationFrame(tick);
    animRef.current = { from, to, start, raf };
    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current.raf);
        animRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetViewBox.x, targetViewBox.y, targetViewBox.width, targetViewBox.height]);

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
    if (rect.width === 0 || rect.height === 0) return;
    // Map the rect-relative click into the active viewBox's percent space.
    const fx = (e.clientX - rect.left) / rect.width;
    const fy = (e.clientY - rect.top) / rect.height;
    const x = vb.x + fx * vb.width;
    const y = vb.y + fy * vb.height;
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
        viewBox={`${vb.x} ${vb.y} ${vb.width} ${vb.height}`}
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
      {overlay && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        >
          {overlay}
        </div>
      )}
    </div>
  );
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Re-sample the current animation point so we can pick up mid-flight.
function sampleViewBox(anim: { from: ViewBox; to: ViewBox; start: number }): ViewBox {
  const t = Math.min(1, Math.max(0, (performance.now() - anim.start) / ANIM_MS));
  const e = easeInOutCubic(t);
  return {
    x: lerp(anim.from.x, anim.to.x, e),
    y: lerp(anim.from.y, anim.to.y, e),
    width: lerp(anim.from.width, anim.to.width, e),
    height: lerp(anim.from.height, anim.to.height, e),
  };
}
