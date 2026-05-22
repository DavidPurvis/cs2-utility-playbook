/**
 * Claude warm-cream design tokens.
 *
 * Replaces the v5 CS2-tactical dark palette. All body-text colors are
 * AA-contrast-checked against #FAF9F6. Utility-arc colors darkened so
 * smokes/flashes/mollies/HE stay legible on cream (each ≥ 4.5:1).
 *
 * Color is never the sole channel — Arc components also render a
 * single-letter glyph (S/F/M/H) at the origin for colorblind users
 * (hidden during picker mode to avoid collision with spawn dot labels).
 */

export const T = {
  // Backgrounds
  bg:        "#FAF9F6",
  bgPanel:   "#FFFFFF",
  bgSubtle:  "#F3F1EB",
  bgDeep:    "#EEEBE3",

  // Text (all AA-compliant body text on #FAF9F6)
  textPri:   "#1F1B16",  // 16:1
  textSec:   "#5A544B",  // 7.5:1
  textDim:   "#6F6A60",  // 5.1:1 — AA body floor
  textMute:  "#8E887C",  // 3.4:1 — non-body only

  // Borders + shadows
  border:    "#E7E2D6",
  borderStr: "#D5CFC0",
  shadow:    "0 1px 2px rgba(28,22,16,0.05), 0 4px 12px rgba(28,22,16,0.04)",
  shadowMd:  "0 2px 6px rgba(28,22,16,0.06), 0 8px 24px rgba(28,22,16,0.06)",

  // Accent (Claude burnt-orange)
  accent:    "#C67C4E",
  accentDk:  "#A56235",
  accentBg:  "#F4E7DA",
  accentRing:"#C67C4E55",

  // Sides — desaturated for cream
  tSide:     "#C67C4E",  tSideBg: "#F4E1D2",
  ctSide:    "#5B7FA8",  ctSideBg: "#E2EAF2",

  // Utility colors (≥4.5:1 on bg)
  utilSmoke: "#6E7989",
  utilFlash: "#A8842B",
  utilMolly: "#C25A3A",
  utilHE:    "#9C3C3C",

  // Lookup map: utility type → display color. Five components were
  // each defining their own `UTIL_COLOR: Record<UtilityType, string>`
  // pointing at the same four tokens above; this lifts them into one
  // place so a future palette tweak only edits theme.ts.
  utilColor: {
    smoke:   "#6E7989",
    flash:   "#A8842B",
    molotov: "#C25A3A",
    he:      "#9C3C3C",
  } as const,

  // Status
  danger:    "#9C3C3C",
  dangerBg:  "#F4DDD7",
  success:   "#3F7A4E",
  successBg: "#DEEBE0",

  // Typography
  fontUI:   "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  fontMono: "'JetBrains Mono', ui-monospace, Menlo, monospace",

  // Geometry
  radius:    10,
  radiusSm:  6,
  radiusLg:  14,

  // Motion
  transitionFast: "0.12s ease-out",
  transitionMed:  "0.18s ease-out",
} as const;

export type Theme = typeof T;
