/**
 * SVG radar with the Dust 2 image + a slot for positioned children
 * (spawn dots, arcs, picker overlay). The internal coordinate system
 * is percent space (0..100); the optional `viewBox` prop lets callers
 * zoom into a sub-region (e.g. the spawn picker zooms to the cluster).
 *
 * Differences from the v5 MapRenderer:
 *   - Click-to-place handler removed (v6 has no admin UI).
 *   - Container has explicit `aspect-ratio: 1/1` + `maxWidth: 800` so
 *     the SVG sizes correctly on first paint (no FOUC during image
 *     load).
 *   - Error / loading text overlay kept but restyled for cream.
 *   - `overlay` prop accepts a positioned <button> (or anything else)
 *     rendered above the SVG — used for the picker × close button so
 *     it's a real DOM button (keyboard-reachable, focus-ring works).
 */
import {
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { T } from "../theme";
import type { MapConfig } from "../types";

export interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

const FULL_VIEWBOX: ViewBox = { x: 0, y: 0, width: 100, height: 100 };
const ANIM_MS = 400;

export interface RadarProps {
  config: MapConfig;
  /** Sub-region of percent space to render; defaults to full radar. Animates over ~400ms. */
  viewBox?: ViewBox;
  /** Render-prop receiving the current rendered pixel size (for callers needing world↔pixel math). */
  children?: (size: { width: number; height: number }) => ReactNode;
  /** Positioned overlay (e.g. picker × button). Receives pointer events. */
  overlay?: ReactNode;
  /** Optional ARIA description override (default "Dust 2 radar"). */
  ariaLabel?: string;
}

type ImgState = { loaded: boolean; errored: boolean };
function imgReducer(_state: ImgState, action: "loaded" | "errored"): ImgState {
  if (action === "loaded") return { loaded: true, errored: false };
  return { loaded: false, errored: true };
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
function sampleViewBox(a: { from: ViewBox; to: ViewBox; start: number }): ViewBox {
  const t = Math.min(1, Math.max(0, (performance.now() - a.start) / ANIM_MS));
  const e = easeInOutCubic(t);
  return {
    x: lerp(a.from.x, a.to.x, e),
    y: lerp(a.from.y, a.to.y, e),
    width: lerp(a.from.width, a.to.width, e),
    height: lerp(a.from.height, a.to.height, e),
  };
}

export function Radar({
  config,
  viewBox: targetViewBox = FULL_VIEWBOX,
  children,
  overlay,
  ariaLabel,
}: RadarProps) {
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

  // Animate the viewBox toward the target prop via requestAnimationFrame.
  const [vb, setVb] = useState<ViewBox>(targetViewBox);
  const animRef = useRef<{ from: ViewBox; to: ViewBox; start: number; raf: number } | null>(null);

  useEffect(() => {
    const from: ViewBox = animRef.current ? sampleViewBox(animRef.current) : vb;
    const to = targetViewBox;
    if (
      from.x === to.x &&
      from.y === to.y &&
      from.width === to.width &&
      from.height === to.height
    ) return;
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

  // Image-load tracking via reducer + image href as key (resets state
  // when href changes without calling setState in an effect).
  const [img, dispatchImg] = useReducer(imgReducer, { loaded: false, errored: false });
  const { loaded, errored } = img;

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const radarHref = config.radarImage.startsWith("http")
    ? config.radarImage
    : `${base}${config.radarImage}`;

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        maxWidth: 800,
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
        aria-label={ariaLabel ?? `${config.displayName} radar`}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      >
        <image
          key={radarHref}
          href={radarHref}
          x={0}
          y={0}
          width={100}
          height={100}
          preserveAspectRatio="xMidYMid meet"
          opacity={0.92}
          onLoad={() => dispatchImg("loaded")}
          onError={() => dispatchImg("errored")}
        />
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
        {/* Children render even with zero size — they generally work in percent space
            and don't depend on rendered pixels. Callers that need pixel math can branch on size.width. */}
        {children && children(size)}
      </svg>
      {overlay && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {overlay}
        </div>
      )}
    </div>
  );
}
