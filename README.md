# CS2 Utility Playbook — Dust 2 CMS Edition

A scenario-first CS2 lineup reference, focused on **Dust 2**, with an
admin mode that lets the owner add and maintain every utility and
multi-player execute directly inside the running app. No backend, no
scraping, no AI-guessed coordinates — every position is a real
`setpos` you (or a verified source like cs2util) typed.

Live site: **https://davidpurvis.github.io/cs2-utility-playbook/**

## What's in it

- **Scenarios tab**: filterable grid of multi-player executes
  (2-, 3-, 4-, 5-man). Click into one for the full map, colored
  per-player arcs from origin to landing, a numbered timeline you can
  hover to highlight a step, and a player legend.
- **Spawn Positions tab**: every T- and CT-side spawn shown on the
  radar so you can see which spawn a lineup expects you to be on.
- **Admin mode** (password-gated): a floating right-side panel with
  four tabs that let you:
  1. **Utilities** — add / edit / delete utilities. Paste a
     `setpos X Y Z;setang P Y R` from cs2util or in-game console to
     fill the throw fields automatically. Click-to-place mode lets you
     drop a landing position directly on the radar.
  2. **Scenarios** — build a 2- to 5-man execute by picking utilities
     from the dropdown and assigning them to players with timing notes.
  3. **Calibration** — nudge the radar overview constants
     (`pos_x`, `pos_y`, `scale`) until every spawn dot sits inside the
     in-game spawn area. Live preview included.
  4. **Data** — export the bundle (or individual files), import a JSON
     someone shared, or reset overrides back to the shipped JSON.

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173/cs2-utility-playbook/
```

Build / verify / preview:

```bash
npm run validate     # typecheck + lint + tests + production build
npm run build
npm run preview      # http://localhost:4173/cs2-utility-playbook/
```

## Architecture

```
src/
├── App.tsx                   ← AdminProvider > BootGate > EditableDataProvider > tabs
├── main.tsx
├── theme.ts                  ← dark CS2-flavored design tokens
├── types/map.ts              ← MapConfig, Spawn, Utility, Scenario, …
├── data/maps/dust2/
│   ├── map-config.json       ← pos_x / pos_y / scale / sourceResolution
│   ├── spawns.json           ← 15 T + 5 CT verified setpos coords
│   ├── utilities.json        ← 10 cs2util-verified lineups (starter set)
│   └── scenarios.json        ← starts empty; you build these in admin
├── utils/
│   ├── coordinates.ts        ← worldToPercent / percentToWorld + tests
│   ├── parseSetposCommand.ts ← parses console setpos/setang strings
│   ├── schemas.ts            ← runtime validators per data file
│   └── storage.ts            ← layered loaded ⊕ override ⊕ session store
├── hooks/
│   ├── useMapData.ts         ← boot-time JSON load + validation
│   ├── useEditableData.tsx   ← single source of truth for edits
│   ├── useAdminMode.tsx      ← password gate, session-only admin flag
│   └── useViewport.ts        ← isMobile breakpoint helper
└── components/
    ├── MapRenderer.tsx       ← square SVG radar + click-to-place
    ├── SpawnMap.tsx          ← Spawn Positions tab
    ├── ScenarioList.tsx      ← filterable scenario grid
    ├── ScenarioDetail.tsx    ← full scenario w/ timeline + map
    ├── ScenarioMap.tsx       ← per-player arcs + markers composite
    ├── shared/               ← MapMarker, MapPath, UtilityIcon
    └── admin/                ← AdminGate, AdminPanel, four editors
```

### How coordinates work

CS2 stores positions in world units (`setpos X Y Z`). The radar PNG
covers a square region of the world starting at `(pos_x, pos_y)` with
`scale` world units per pixel × `sourceResolution`. Convert with:

```ts
percent.x = ((world.x - pos_x) / (scale * sourceResolution)) * 100
percent.y = 100 - ((world.y - pos_y) / (scale * sourceResolution)) * 100
```

`src/utils/coordinates.ts` exports `worldToPercent`,
`percentToWorld`, `worldToPixel`, `pixelToWorld`. The 34 landmark tests
in `coordinates.test.ts` lock those projections against every spawn
position — if calibration breaks, those fail first.

### Admin data flow

1. App loads the four JSON files from `src/data/maps/dust2/`.
2. Any localStorage overrides under `cs2-playbook/v1/dust2-*` get
   layered on top (admin edits survive page reloads).
3. The admin panel's editors call `useEditableData()` setters; each
   setter writes to localStorage so a refresh keeps the work.
4. Admin clicks **Export bundle** in the Data tab → downloads
   `dust2-bundle.json`. Drop the file(s) into `src/data/maps/dust2/`,
   commit, push — Pages redeploys with the new content baked in.

The admin password is a constant in `src/hooks/useAdminMode.tsx`. It
isn't real security — it's a misclick gate for a single-author site.

## Deploy

`.github/workflows/deploy.yml` runs on push to `main`:
`npm ci` → `npm run validate` → `vite build` → upload `dist/` → Pages.

One-time setup: **Settings → Pages → Source: GitHub Actions**.

## Useful offline scripts

- `scripts/extract-from-youtube.mjs` — pulls `setpos` lines out of
  YouTube transcripts (useful for AustinCS / cs2util videos).
- `scripts/scrape-csnades-combinations.mjs` — scrapes
  csnades.gg Solo Combinations pages.

Neither writes to the app data files. You feed their output into the
admin Utility editor manually.

## License

Personal project. No license granted; do not redistribute the bundle.
