/**
 * CS2 tactical dark theme tokens. One source of truth for colors
 * and a couple of layout constants. Imported with `import { T } from "./theme"`.
 */
export const T = {
  // Surfaces
  bg:       "#0a0e15",
  bgPanel:  "#11161f",
  bgCard:   "#11161f",
  bgDeep:   "#060a10",
  bgHover:  "#181f2a",
  bgInstr:  "#0e131b",

  // Strokes
  border:    "#1c2330",
  borderLt:  "#242c3c",
  borderAlt: "#2d364a",

  // Type
  textPri:   "#e6ebf2",
  textSec:   "#a3afc1",
  textDim:   "#6a7689",
  textMute:  "#525c70",

  // Accents
  accent:    "#3ed5b8",
  accentDk:  "#2cb89c",
  accentBg:  "#0e2620",
  gold:      "#e8b860",
  danger:    "#ef5969",

  // Sides
  tSide:    "#f08e3c",
  tSideBg:  "#1a1208",
  ctSide:   "#5fa8e8",
  ctSideBg: "#0a1320",

  // Utility kind colors (used by future UtilityIcon)
  utilSmoke:   "#8aa0bd",
  utilFlash:   "#f0d24a",
  utilMolly:   "#ef7a55",
  utilHE:      "#ef5969",

  // Font stacks
  fontUI:   "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  fontMono: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace",

  // Radii
  radius:   8,
  radiusSm: 4,
  radiusLg: 12,
} as const;
