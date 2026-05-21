#!/usr/bin/env node
/**
 * TKT-024 — `npm run new-scenario`.
 *
 * Append a Scenario shell to src/data/dust2.json. Validates that every
 * referenced lineupId exists; rejects duplicate scenario numbers.
 *
 * Usage:
 *   npm run new-scenario -- --help
 *   npm run new-scenario -- \
 *     --number 6 --name "Mid-to-B Smoke Stack" --side T --area "B site" \
 *     --difficulty intermediate \
 *     --players "a-man:xbox_smoke,b_window_smoke; b-man:b_tunnel_flash"
 *
 * The --players format: `role:lineupId1,lineupId2,...; role2:lineupId3,...`
 * Roles are freeform strings. Actions are appended in the order listed
 * (order: 1, 2, 3...). Each scenario player gets a default color
 * cycled from a small palette so the radar arc layer can distinguish
 * them visually.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = dirname(__dirname);
const jsonPath = join(repoRoot, "src/data/dust2.json");

const SIDES = ["T", "CT"];
const DIFFS = ["beginner", "intermediate", "advanced"];

// Same palette used by the seeded scenarios; cycles through if more
// than 5 players (rare).
const PLAYER_COLORS = ["#C67C4E", "#5B7FA8", "#A8842B", "#9C3C3C", "#6E7989"];

const HELP = `
Usage: npm run new-scenario -- [flags]

Required:
  --number <int>           user-facing display number (e.g. "scenario 4")
  --name <text>            display name
  --side <${SIDES.join("|")}>
  --area <text>            e.g. "A site", "B site", "Mid"
  --players "<spec>"       e.g. "a-man:xbox_smoke,long_flash; b-man:b_window_smoke"

Optional:
  --description '<text>'
  --difficulty <${DIFFS.join("|")}>   defaults to "intermediate"
  --notes '<text>'
  --help

Players spec grammar:
  players  := player (";" player)*
  player   := role ":" actions?
  actions  := lineupId ("," lineupId)*

Examples:
  npm run new-scenario -- --number 6 --name "Mid-to-B Stack" --side T --area "B site" \\
    --difficulty intermediate \\
    --players "a-man:xbox_smoke,b_window_smoke; b-man:b_tunnel_flash"

  npm run new-scenario -- --number 7 --name "Empty shell" --side CT --area A \\
    --players "anchor:; rotator:"        # roles with no actions yet
`;

function die(msg, exit = 1) {
  console.error(msg);
  process.exit(exit);
}

export function parsePlayersForCli(spec, knownLineupIds) {
  if (typeof spec !== "string" || spec.trim() === "") return { players: [] };
  const players = [];
  const playerSpecs = spec.split(";").map((p) => p.trim()).filter(Boolean);
  for (let i = 0; i < playerSpecs.length; i++) {
    const ps = playerSpecs[i];
    const colonIdx = ps.indexOf(":");
    if (colonIdx === -1) {
      throw new Error(`Player spec '${ps}' must contain a ':' between role and actions.`);
    }
    const role = ps.slice(0, colonIdx).trim();
    const actionsRaw = ps.slice(colonIdx + 1).trim();
    if (!role) throw new Error(`Player spec '${ps}' has empty role.`);

    const lineupIds = actionsRaw === ""
      ? []
      : actionsRaw.split(",").map((s) => s.trim()).filter(Boolean);
    for (const lineupId of lineupIds) {
      if (!knownLineupIds.has(lineupId)) {
        throw new Error(`Player '${role}': unknown lineup id '${lineupId}'.`);
      }
    }
    players.push({
      role,
      label: role,                  // owner can rename in JSON
      color: PLAYER_COLORS[i % PLAYER_COLORS.length],
      actions: lineupIds.map((lineupId, idx) => ({ order: idx + 1, lineupId })),
    });
  }
  return { players };
}

async function main() {
  const { values } = parseArgs({
    options: {
      help:        { type: "boolean", short: "h" },
      number:      { type: "string" },
      name:        { type: "string" },
      side:        { type: "string" },
      area:        { type: "string" },
      players:     { type: "string" },
      description: { type: "string" },
      difficulty:  { type: "string" },
      notes:       { type: "string" },
    },
    allowPositionals: false,
    strict: false,
  });

  if (values.help) {
    console.log(HELP);
    return;
  }

  // Required
  const numberStr = values.number;
  if (!numberStr) die(`Missing required flag: --number.\n${HELP}`);
  const number = Number(numberStr);
  if (!Number.isInteger(number) || number < 1) {
    die(`Invalid --number '${numberStr}'. Must be a positive integer.`);
  }
  const name = values.name || die(`Missing required flag: --name.`);
  const side = values.side;
  if (!SIDES.includes(side)) die(`Invalid value for --side: '${side}'. Expected one of: ${SIDES.join(", ")}.`);
  const area = values.area || die(`Missing required flag: --area.`);
  const playersSpec = values.players;
  if (playersSpec === undefined) die(`Missing required flag: --players.\n${HELP}`);

  const difficulty = values.difficulty ?? "intermediate";
  if (!DIFFS.includes(difficulty)) {
    die(`Invalid value for --difficulty: '${difficulty}'. Expected one of: ${DIFFS.join(", ")}.`);
  }

  // Read JSON + check uniqueness
  const data = JSON.parse(readFileSync(jsonPath, "utf8"));
  if (data.scenarios.some((s) => s.number === number)) {
    die(`Duplicate scenario number ${number}. Numbers must be unique.`);
  }
  const knownLineupIds = new Set(data.lineups.map((l) => l.id));

  // Parse players (may throw on bad ref)
  let parsed;
  try {
    parsed = parsePlayersForCli(playersSpec, knownLineupIds);
  } catch (err) {
    die(err.message);
  }
  const playerCount = parsed.players.length;
  if (![2, 3, 4, 5].includes(playerCount)) {
    die(`Player count must be 2..5, got ${playerCount}.`);
  }

  // Build scenario
  const scenario = {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || `scenario_${number}`,
    number,
    name,
    description: values.description ?? "",
    side,
    targetArea: area,
    difficulty,
    playerCount,
    players: parsed.players,
    ...(values.notes ? { notes: values.notes } : {}),
  };

  // Check id uniqueness too (in case --name produces a colliding slug)
  if (data.scenarios.some((s) => s.id === scenario.id)) {
    die(`Duplicate scenario id '${scenario.id}' (derived from --name). Use a different name.`);
  }

  data.scenarios.push(scenario);
  writeFileSync(jsonPath, JSON.stringify(data, null, 2) + "\n");

  console.log(`\nAppended Scenario ${number} to ${jsonPath}:\n`);
  console.log(JSON.stringify(scenario, null, 2));
  console.log(`\nReview with: git diff src/data/dust2.json\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => die(err.message));
}
