/**
 * Visual theme tokens. Dark, tactical, no neon.
 */
export const T = {
  // Surfaces
  bg: "#0a0e15",
  bgPanel: "#11161f",
  bgCard: "#11161f",
  bgDeep: "#060a10",
  bgHover: "#181f2a",
  bgInstr: "#0e131b",

  // Strokes
  border: "#1c2330",
  borderLt: "#242c3c",
  borderAlt: "#2d364a",

  // Type
  textPri: "#e6ebf2",
  textSec: "#a3afc1",
  textDim: "#6a7689",
  textMute: "#525c70",

  // Accents
  accent: "#3ed5b8",
  accentDk: "#2cb89c",
  accentBg: "#0e2620",
  gold: "#e8b860",

  danger: "#ef5969",

  // Player slots
  playerA: "#3B82F6", // blue
  playerB: "#F59E0B", // amber
  playerC: "#10B981", // green
  playerABg: "#0e1a2c",
  playerBBg: "#241a0b",
  playerCBg: "#0a1f17",

  // Type stacks
  fontMono: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace",
  fontUI: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

  // Radii
  radius: 8,
  radiusSm: 4,
  radiusLg: 12,
} as const;

export const UTIL_STYLE: Record<
  "smoke" | "flash" | "molotov" | "he",
  { label: string; icon: string; color: string; bg: string }
> = {
  smoke: { label: "Smoke", icon: "◍", color: "#8aa0bd", bg: "#10141c" },
  flash: { label: "Flash", icon: "◎", color: "#f0d24a", bg: "#1c180c" },
  molotov: { label: "Molotov", icon: "◉", color: "#ef7a55", bg: "#1c100a" },
  he: { label: "HE", icon: "◈", color: "#ef5969", bg: "#1c0c10" },
};

export const PLAYER_STYLE: Record<
  "A" | "B" | "C",
  { color: string; bg: string; label: string }
> = {
  A: { color: T.playerA, bg: T.playerABg, label: "Player A" },
  B: { color: T.playerB, bg: T.playerBBg, label: "Player B" },
  C: { color: T.playerC, bg: T.playerCBg, label: "Player C" },
};

export const THROW_STYLE: Record<
  "normal" | "jump" | "run" | "jump+run",
  { label: string; short: string }
> = {
  normal: { label: "Left Click", short: "LMB" },
  jump: { label: "Jump Throw", short: "JT" },
  run: { label: "Running Throw", short: "RUN" },
  "jump+run": { label: "Run + Jump Throw", short: "W+JT" },
};
