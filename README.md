# Dust 2 Playbook

Scenario-based utility execute planner for CS2 squads. Built for 2–3 person coordination in a 5-stack — pick where you want utility to land, see the scenarios that hit it.

Live: <https://davidpurvis.github.io/cs2-utility-playbook/>

## What it does

Most utility tools (cs2util, csnades, refrag) are encyclopedias — pick a map, pick a nade, browse one-off lineups. This is a **playbook**. Pick a **target zone**, get the **coordinated executes** for it, with Player A / B / C role assignments and step-by-step instructions.

## Core concepts

- **Zone**: a target callout on the radar (A Site, B Tunnels, Mid, etc).
- **Lineup**: one utility throw — throw-from callout, landing callout, throw type, world coords, description, purpose.
- **Scenario**: a coordinated execute. Composes lineups into player roles with instructions and timing cues. Examples: *A Long Execute (2P)*, *B Full Execute (3P)*, *B Mid Split (3P)*.

## Data architecture

All coordinates live in CS2 **world space** (`worldX`, `worldY`) and convert to radar percentages via `lib/mapCoordinates.ts::worldToMapPercent`. Dust 2 metadata (`pos_x: -2476, pos_y: 3239, scale: 4.4`) pairs with the canonical Valve PSD radar image. No hand-tuned percentages.

```
data/
  types.ts             types: Lineup, Scenario, Zone, WorldPoint
  dust2-meta.ts        Valve radar metadata
  dust2-zones.ts       11 callout polygons
  dust2-lineups.ts     17 verified lineups
  dust2-scenarios.ts   7 coordinated executes
lib/
  mapCoordinates.ts    world ↔ radar percent
  jsonExport.ts        scenario export / import
  theme.ts             dark tactical palette
components/
  RadarMap.tsx         SVG radar + zone polygons + lineup arcs
  ZonePanel.tsx        right sidebar — utility + scenarios for selected zone
  ScenarioView.tsx     scenario modal with per-player roles
  LineupCard.tsx       single lineup display
  ScenarioCard.tsx     scenario summary chip
  PlayerSlotPicker.tsx "I'm Player A/B/C"
  PlaybookHeader.tsx   top bar
App.tsx                assembles the above
```

## Lineup quality

The 17 lineups are real, verified CS2 throws. The 5 must-learn smokes use community-verified setpos values; the rest are standard pro-level reference positions cross-checked against the Valve radar.

When a lineup's rendered dot is off, the fix is its **world coordinate**, not a percentage offset.

## Development

```
nvm use
npm install
npm run dev        # vite dev server on :5173
npm test           # vitest run — 34 tests
npm run typecheck  # tsc --noEmit
npm run build      # vite build (typechecks first)
```

## Verification gates

- `npm run typecheck` — strict TypeScript clean.
- `npm test` — landmarks within ±2% of community-verified percentages; every lineup projects inside the radar; every scenario references real lineups; JSON export round-trips.
- Visual: open `localhost:5173`, click each zone, confirm utility lands where labeled.

## Deploy

GitHub Actions workflow at `.github/workflows/deploy.yml` builds and deploys to Pages on push to `main`.

## Refactor history

See `.claude/plans/velvet-moseying-cook.md` for the full refactor plan. The pre-refactor multi-map codebase is preserved at git tag `archive/pre-refactor-2026-05-21`.
