export const T = {
  // Surfaces
  bg:        "#0a0e15",
  bgPanel:   "#11161f",
  bgCard:    "#11161f",
  bgDeep:    "#060a10",
  bgHover:   "#181f2a",
  bgPlay:    "#181f2a",
  bgInstr:   "#0e131b",
  bgNotes:   "#0e1318",
  bgActiveFilter: "#101a26",
  bgCallout: "#0a1813",
  bgTip:     "#10131c",

  // Strokes
  border:      "#1c2330",
  borderLt:    "#242c3c",
  borderAlt:   "#2d364a",
  borderNotes: "#1a2220",
  borderOpen:  "#ffffff10",
  borderOpenLt:"#ffffff14",

  // Type
  textPri:        "#e6ebf2",
  textSec:        "#a3afc1",
  textDim:        "#6a7689",
  textMute:       "#525c70",
  textFaint:      "#3a4356",
  textHighlight:  "#f3f6fa",
  textCallout:    "#7ce0c4",
  textTip:        "#8a92ff",
  textInstr:      "#c9d3e0",
  textNotes:      "#9ab59e",
  textGold:       "#e8b860",

  // Accents
  accent:    "#3ed5b8",
  accentDk:  "#2cb89c",
  accentBg:  "#0e2620",
  gold:      "#e8b860",
  austin:    "#f47a4a",

  // Faction signals (semantic only)
  tSide:    "#f08e3c",
  tSideBg:  "#1a1208",
  ctSide:   "#5fa8e8",
  ctSideBg: "#0a1320",

  danger: "#ef5969",
  jumpBind: "#9ec46a",

  // Type stacks
  fontMono: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace",
  fontUI:   "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

  // Radii
  radius:    8,
  radiusSm:  4,
  radiusLg:  12,
};

export const THROW = {
  JT:    { label: "Jump Throw",     short: "JUMP",      color: "#f0a93c", icon: "⤴" },
  WJT:   { label: "W + Jump Throw", short: "W+JUMP",    color: "#ef7a55", icon: "▶" },
  LMB:   { label: "Left Click",     short: "LMB",       color: "#5fa8e8", icon: "●" },
  RMB:   { label: "Right Click",    short: "RMB",       color: "#3ed5b8", icon: "◑" },
  WALK2: { label: "2-Step Walk+JT", short: "WW+JUMP",   color: "#d268b8", icon: "⤴" },
  RUN:   { label: "Run + LMB",      short: "W+LMB",     color: "#e8b860", icon: "→" },
};

export const UTIL = {
  SMOKE: { label: "Smoke",   icon: "◍", color: "#8aa0bd" },
  FLASH: { label: "Flash",   icon: "◎", color: "#f0d24a" },
  MOLLY: { label: "Molotov", icon: "◉", color: "#ef7a55" },
  HE:    { label: "HE",      icon: "◈", color: "#ef5969" },
};

export const ROUND_TYPES = {
  PISTOL: { label: "Pistol", short: "PIST",  color: "#c779e8" },
  ECO:    { label: "Eco",    short: "ECO",   color: "#ef5969" },
  FORCE:  { label: "Force",  short: "FORCE", color: "#f0a93c" },
  FULL:   { label: "Full",   short: "FULL",  color: "#3ed5b8" },
};
