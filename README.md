# Dust 2 Playbook

A personal CS2 reference for **multi-player coordinated executes on Dust 2**, built around the idea that "let's do scenario 4" should immediately put you and your teammates on the same page.

Live site: **https://davidpurvis.github.io/cs2-utility-playbook/**

> Repo is still named `cs2-utility-playbook` because the GitHub Pages URL depends on it — the app inside is "Dust 2 Playbook."

## What it is

Three first-class concepts:

- **Scenario** — a numbered, named team execute. 2–5 players, each with a role (A-man, B-man, lurker…) and a chronological list of lineups to throw. Numbered so a teammate on a call can just say "scenario 4."
- **Lineup** — a single utility throw. Opens as a **2×2 walkthrough**: Position → Aim → Throw → Result. The four cards are visible at once so visual learners can study the whole sequence.
- **Spawn** — a fixed in-game spawn position. Used as a *visual reference* on the radar ("I'm here"); never a filter.

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173/cs2-utility-playbook/
npm run validate     # typecheck + lint + tests + scripts + build
```

## How to add content

### Add a lineup

```bash
npm run new-lineup -- --help

npm run new-lineup -- \
  --id long_pop_flash_v2 --name "A Long Pop Flash v2" \
  --type flash --side T --area "A long" \
  --style normal --movement standing --difficulty medium \
  --throw "setpos 1585.34 1077.385;setang -3 90 0" \
  --landing "setpos 1100 1700 64" \
  --description 'Pop flash off the doors — push out the instant the flash leaves your hand.' \
  --source-name "BLAST.tv" --source-url "https://blast.tv/..."
```

Or open `src/data/dust2.json` directly. The CLI is recommended for single entries pasted from the in-game console.

After running, **add screenshots manually** to `public/screenshots/dust2/<lineup_id>/{position,aim,throw,result}.webp`. The 2×2 walkthrough renders fallbacks (radar crop, throw-style glyph, text) when a screenshot is missing — so the lineup is usable from the moment you append it, even before screenshots exist.

### Add a scenario

```bash
npm run new-scenario -- --help

npm run new-scenario -- \
  --number 6 --name "B Default Smoke Stack" --side T --area "B site" \
  --difficulty intermediate \
  --players "a-man:xbox_smoke,b_window_smoke; b-man:b_tunnel_flash"
```

Players are role-tagged ("a-man", "lurker", etc.) and reference lineups by id; the CLI rejects unknown ids before writing so you can't ship a dangling reference.

### Deploy

`git diff` → `git add` → `git commit` → `git push`. GitHub Actions runs `npm run validate` and publishes `dist/` to Pages.

## Architecture

```
src/
├── main.tsx                  <ErrorBoundary><App/></ErrorBoundary>
├── App.tsx                   useReducer + popstate + Esc handling + global Toast
├── reducer.ts                state machine: home → scenario → lineup
├── theme.ts                  Claude warm-cream tokens (AA contrast)
├── types.ts                  Lineup, Scenario, ScenarioPlayer, ScenarioAction, DustData
├── data/
│   ├── dust2.json            { config, spawns, lineups, scenarios }  ← edit me
│   └── loadDust2.ts          assertDustData: ref integrity at boot
├── utils/
│   ├── coordinates.ts        world ↔ percent (16 landmark tests)
│   ├── parseSetposCommand.ts setpos/setang regex parser
│   ├── bounds.ts             squareBoundsFromPercents + spawnClusterBounds + worldDistSq
│   └── steamDeepLink.ts      steam://rungameid/730 URL formatter
└── components/
    ├── Header.tsx            breadcrumbs
    ├── Home.tsx              ScenarioGrid + SpawnPicker
    ├── ScenarioGrid.tsx      scenario cards sorted by number
    ├── ScenarioCard.tsx      one tile
    ├── SpawnPicker.tsx       visual reference (no filter)
    ├── ScenarioDetail.tsx    radar + RoleTabs + ordered action list
    ├── LineupDetail.tsx      2x2 walkthrough (Position / Aim / Throw / Result)
    ├── Radar.tsx             SVG radar with animated viewBox prop
    ├── CopyButton.tsx        clipboard with execCommand fallback
    ├── Toast.tsx             global aria-live polite
    └── __tests__/            3 TDD journey tests (Home, ScenarioDetail, Walkthrough)
```

## How coordinates work

Every position is stored as `setpos` world coordinates. The radar PNG covers a square region with `pos_x`/`pos_y`/`scale`/`sourceResolution` (Valve's overview format). Conversion:

```ts
percent.x = ((world.x - pos_x) / (scale * sourceResolution)) * 100
percent.y = 100 - ((world.y - pos_y) / (scale * sourceResolution)) * 100
```

`src/utils/coordinates.ts` exports `worldToPercent`, `percentToWorld`, `worldToPixel`, `pixelToWorld`. The 16 landmark tests in `coordinates.test.ts` lock those projections against every Dust 2 spawn — they're the regression gate for every commit.

## Tests

```bash
npm test               # all vitest tests (~57 cases)
npm run test:scripts   # CLI tests (node:test)
npm run validate       # typecheck + lint + test + test:scripts + build
```

| File | Type | Cases |
|---|---|---|
| `src/utils/coordinates.test.ts` | vitest | 16 (covers 20 landmark spawns) |
| `src/utils/parseSetposCommand.test.ts` | vitest | 6 |
| `src/utils/bounds.test.ts` | vitest | 5 |
| `src/utils/steamDeepLink.test.ts` | vitest | 4 |
| `src/data/loadDust2.test.ts` | vitest | 5 |
| `src/reducer.test.ts` | vitest | 10 |
| `src/components/__tests__/home.test.tsx` | RTL component | 3 |
| `src/components/__tests__/scenarioDetail.test.tsx` | RTL component | 4 |
| `src/components/__tests__/walkthrough.test.tsx` | RTL component | 5 |
| `scripts/new-lineup.test.mjs` | node:test | 6 |
| `scripts/new-scenario.test.mjs` | node:test | 5 |

## Decisions

See `docs/DECISIONS.md` for ADRs (React vs alternatives, JSON vs Markdown, GitHub Pages vs Proxmox, no router lib, co-located screenshots).

## License

Personal project. No license granted; do not redistribute.
