/**
 * Tracks viewport width and exposes a single isMobile flag so layout
 * code can avoid sprinkling CSS media queries through inline styles.
 * The breakpoint mirrors a typical phone/tablet boundary (720px).
 */
import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 720;

export interface Viewport {
  width: number;
  isMobile: boolean;
}

function read(): Viewport {
  if (typeof window === "undefined") return { width: 1024, isMobile: false };
  const w = window.innerWidth;
  return { width: w, isMobile: w < MOBILE_BREAKPOINT };
}

export function useViewport(): Viewport {
  const [vp, setVp] = useState<Viewport>(() => read());
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setVp(read());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return vp;
}
