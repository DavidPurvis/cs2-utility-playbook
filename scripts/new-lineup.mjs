#!/usr/bin/env node
/**
 * TKT-023 — `npm run new-lineup`.
 *
 * Append a single Lineup entry to src/data/dust2.json from a paste
 * of `setpos X Y Z;setang P Y R` plus a handful of required flags.
 *
 * The CLI duplicates the parse-setpos regex (rather than importing
 * from src/) so the script has no build dependency — runs straight
 * with Node. The parity gate is `scripts/new-lineup.test.mjs` which
 * mirrors the canonical inputs from src/utils/parseSetposCommand.test.ts.
 *
 * Usage:
 *   npm run new-lineup -- --help
 *   npm run new-lineup -- \
 *     --id long_pop_flash_v2 \
 *     --name "A Long Pop Flash" \
 *     --type flash --side T --area A \
 *     --style normal --movement standing --difficulty medium \
 *     --throw "setpos -299.969 -1163.764 136.822;setang -12.173 91.437 0"
 *
 * Behavior:
 *   - Validates every enum before any IO.
 *   - Rejects duplicate `--id` (case-sensitive).
 *   - Reads stdin if not a TTY (so you can pipe `pbpaste`).
 *   - Writes JSON with `JSON.stringify(data, null, 2) + "\n"`.
 *   - Does NOT git-add. Owner reviews `git diff` and commits.
 *   - Prints the appended object on success; exits 1 on validation
 *     failure with a path-pointed error message.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = dirname(__dirname);
const jsonPath = join(repoRoot, "src/data/dust2.json");

// ── setpos regex (DUPLICATED from src/utils/parseSetposCommand.ts;
//    parity guarded by scripts/new-lineup.test.mjs) ────────────────
const SETPOS_RE = /setpos\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)(?:\s+(-?\d+(?:\.\d+)?))?/i;
const SETANG_RE = /setang\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/i;

export function parseSetposForCli(input) {
  if (typeof input !== "string" || input.trim().length === 0) return null;
  const pos = SETPOS_RE.exec(input);
  const ang = SETANG_RE.exec(input);
  if (!pos && !ang) return null;
  const out = {};
  if (pos) {
    const x = Number(pos[1]);
    const y = Number(pos[2]);
    const z = pos[3] !== undefined ? Number(pos[3]) : undefined;
    if (Number.isFinite(x) && Number.isFinite(y)) {
      out.world = z !== undefined && Number.isFinite(z) ? { x, y, z } : { x, y };
    }
  }
  if (ang) {
    const pitch = Number(ang[1]);
    const yaw = Number(ang[2]);
    const roll = Number(ang[3]);
    if (Number.isFinite(pitch) && Number.isFinite(yaw) && Number.isFinite(roll)) {
      out.angle = { pitch, yaw, roll };
    }
  }
  return out.world || out.angle ? out : null;
}

// ── landing-args validator (audit C-4 fix, 2026-05) ──────────────
// Pure function — exported for unit testing. Returns either:
//   { ok: true,  landingAt: { world | percent } }
//   { ok: false, error: <human-readable string> }
//
// Replaces the pre-fix silent default `{percent:{x:50,y:50}}` which
// quietly produced a junk lineup at radar center if --landing was
// omitted or mistyped. AR-1 says "do not invent data" — that rule
// applies at the CLI layer too.
export function parseLandingArgs(landingFlag, landingPercentFlag) {
  if (landingFlag) {
    const parsed = parseSetposForCli(landingFlag);
    if (!parsed || !parsed.world) {
      return {
        ok: false,
        error: `Could not parse --landing: '${landingFlag}'. Expected: "setpos X Y Z[;setang P Y R]".`,
      };
    }
    return { ok: true, landingAt: { world: parsed.world } };
  }
  if (landingPercentFlag) {
    const m = /^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/.exec(landingPercentFlag);
    if (!m) {
      return {
        ok: false,
        error: `Could not parse --landing-percent: '${landingPercentFlag}'. Expected: "X,Y" (each 0..100).`,
      };
    }
    const x = parseFloat(m[1]);
    const y = parseFloat(m[2]);
    if (x < 0 || x > 100 || y < 0 || y > 100) {
      return {
        ok: false,
        error: `--landing-percent values must be in [0..100]; got x=${x}, y=${y}.`,
      };
    }
    return { ok: true, landingAt: { percent: { x, y } } };
  }
  return {
    ok: false,
    error:
      `Missing landing position. Provide one of:\n` +
      `  --landing "setpos X Y Z"          (authoritative world coords)\n` +
      `  --landing-percent X,Y             (legacy percent fallback, each 0..100)\n` +
      `\nSee --help for more.`,
  };
}

// ── enums ─────────────────────────────────────────────────────────
const TYPES       = ["smoke", "flash", "molotov", "he"];
const SIDES       = ["T", "CT"];
const STYLES      = ["normal", "jump", "run", "jump+run", "crouch"];
const MOVEMENTS   = ["standing", "walking", "running"];
const DIFFICULTIES = ["easy", "medium", "hard"];

const HELP = `
Usage: npm run new-lineup -- [flags]

Required:
  --id <slug>          lowercase snake_case; case-sensitive collision check
  --name <text>        human-readable name
  --type <${TYPES.join("|")}>
  --side <${SIDES.join("|")}>
  --area <text>        e.g. "Mid", "A long", "B site"
  --style <${STYLES.join("|")}>
  --movement <${MOVEMENTS.join("|")}>
  --difficulty <${DIFFICULTIES.join("|")}>
  --throw "setpos X Y Z;setang P Y R"   (or pipe via stdin)

Landing (REQUIRED — pick one):
  --landing "setpos X Y Z"               authoritative world coords for where utility lands
  --landing-percent X,Y                  fallback: percent (0..100) on radar (use for legacy lineups)

Optional:
  --description '<text>'                 single-line; multi-line → edit JSON afterward
  --source-name <text>
  --source-url <url>
  --help                                 prints this and exits

Examples:
  npm run new-lineup -- --id long_pop_flash --name "A Long Pop Flash" \\
    --type flash --side T --area A --style normal --movement standing --difficulty medium \\
    --throw "setpos 1585.34 1077.385;setang -3 90 0"

  pbpaste | npm run new-lineup -- --id ... --name ... [...other flags...]
`;

function die(msg, exit = 1) {
  console.error(msg);
  process.exit(exit);
}

function requireFlag(values, name) {
  if (!values[name]) die(`Missing required flag: --${name}.\n${HELP}`);
  return values[name];
}

function requireEnum(values, name, allowed) {
  const v = requireFlag(values, name);
  if (!allowed.includes(v)) {
    die(`Invalid value for --${name}: '${v}'. Expected one of: ${allowed.join(", ")}.`);
  }
  return v;
}

async function readStdinIfPiped() {
  if (process.stdin.isTTY) return "";
  let buf = "";
  for await (const chunk of process.stdin) buf += chunk;
  return buf.trim();
}

async function main() {
  const { values } = parseArgs({
    options: {
      help:         { type: "boolean", short: "h" },
      id:           { type: "string" },
      name:         { type: "string" },
      type:         { type: "string" },
      side:         { type: "string" },
      area:         { type: "string" },
      style:        { type: "string" },
      movement:     { type: "string" },
      difficulty:   { type: "string" },
      throw:        { type: "string" },
      landing:      { type: "string" },
      "landing-percent": { type: "string" },
      description:  { type: "string" },
      "source-name": { type: "string" },
      "source-url":  { type: "string" },
    },
    allowPositionals: false,
    strict: false,
  });

  if (values.help) {
    console.log(HELP);
    return;
  }

  // Required flags
  const id = requireFlag(values, "id");
  if (!/^[a-z][a-z0-9_]*$/.test(id)) {
    die(`Invalid --id '${id}'. Must match /^[a-z][a-z0-9_]*$/.`);
  }
  const name = requireFlag(values, "name");
  const type = requireEnum(values, "type", TYPES);
  const side = requireEnum(values, "side", SIDES);
  const area = requireFlag(values, "area");
  const style = requireEnum(values, "style", STYLES);
  const movement = requireEnum(values, "movement", MOVEMENTS);
  const difficulty = requireEnum(values, "difficulty", DIFFICULTIES);

  // --throw can come from flag or stdin
  let throwStr = values.throw;
  if (!throwStr) throwStr = await readStdinIfPiped();
  if (!throwStr) {
    die("Missing --throw 'setpos X Y Z;setang P Y R' (or pipe via stdin).");
  }
  const parsedThrow = parseSetposForCli(throwStr);
  if (!parsedThrow || !parsedThrow.world) {
    die(`Could not parse --throw: '${throwStr}'.\nExpected: 'setpos X Y Z[;setang P Y R]'.`);
  }

  // Landing is REQUIRED. See `parseLandingArgs` below for the logic +
  // the rationale (audit C-4 fix, 2026-05).
  const landingResult = parseLandingArgs(values.landing, values["landing-percent"]);
  if (!landingResult.ok) {
    die(landingResult.error);
  }
  const landingAt = landingResult.landingAt;

  // Build the Lineup object
  const lineup = {
    id,
    name,
    type,
    side,
    area,
    throwFrom: { world: parsedThrow.world },
    landingAt,
    ...(parsedThrow.angle ? { throwAngle: parsedThrow.angle } : {}),
    throwStyle: style,
    movement,
    difficulty,
    ...(values.description ? { description: values.description } : {}),
    ...(values["source-name"] && values["source-url"]
      ? { source: { name: values["source-name"], url: values["source-url"] } }
      : {}),
  };

  // Read + append + write
  const data = JSON.parse(readFileSync(jsonPath, "utf8"));
  if (data.lineups.some((l) => l.id === id)) {
    die(`Duplicate id '${id}'. ID collision check is case-sensitive.`);
  }
  data.lineups.push(lineup);
  writeFileSync(jsonPath, JSON.stringify(data, null, 2) + "\n");

  console.log(`\nAppended to ${jsonPath}:\n`);
  console.log(JSON.stringify(lineup, null, 2));
  console.log(`\nReview with: git diff src/data/dust2.json\n`);
}

// Only run main() when invoked as a script, not when imported by the test file.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => die(err.message));
}
