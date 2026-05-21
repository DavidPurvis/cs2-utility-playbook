# CS2 Utility Playbook

A quick-reference React app for coordinating utility with your CS2 team. Covers the full **Premier map pool**: Ancient, Dust II, Inferno, Mirage, Nuke, Anubis, and Overpass. Built for amateur teams (silver to DMG) who work 9-to-5 jobs and need lineups they can memorize fast.

**Project context** (vision, requirements, engineering decisions): see [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md). Update that file when adding new asks or major technical choices.

## Prerequisites

- **Node.js** 18+ (any recent LTS works)
- **npm** (comes with Node)

## Quick Start

```bash
npm install
npm run dev
```

The app opens at [http://localhost:5173](http://localhost:5173).

## Tests and benchmarks

Automated checks live under `tests/` in a layered pyramid:

| Layer | What it covers | Example files |
|-------|----------------|---------------|
| **Unit** | Validator rules, theme tokens, YouTube helpers, mock map fixtures | `validateMapData.unit.test.js`, `lib/theme.test.js` |
| **Data / integration** | Full map modules, registry, per-map parity, training data | `per-map-data.test.js`, `premier-map-parity.test.js` |
| **Regression** | Frozen lineup counts per map, stability score floors | `regression-baseline.test.js`, `fixtures/stability-baseline.json` |
| **UI (jsdom)** | App navigation, map switch, Training view, modals, deep links | `App.ui.test.jsx`, `components/*.test.jsx` |

**Stability metrics** (quantifiable health score):

```bash
npm run test:metrics   # JSON report: overall score, integrity, premier completeness, warnings
```

Scores are asserted in `stability-metrics.test.js` against `tests/fixtures/stability-baseline.json`. Bump baseline counts when you intentionally add content; failing exact-count tests usually mean accidental deletions.

```bash
npm test                 # full suite (unit + data + regression + UI)
npm run test:unit        # *.test.js only (node)
npm run test:ui          # *.test.jsx only (jsdom)
npm run test:regression  # baseline + stability + premier parity + App regression
npm run test:watch       # re-run on file changes
npm run test:coverage    # V8 coverage (lib, components, data, tests)
npm run bench            # Vitest benchmarks for full-map validation throughput
```

Benchmarks print iterations per second locally; use them to spot regressions if validation logic grows heavier.

To build for production:

```bash
npm run build
npm run preview   # serves the build locally (use http://localhost:4173/cs2-utility-playbook/ — matches GitHub Pages base path)
```

CI runs `npm run lint`, `npm test`, `npm run test:metrics`, and `npm run build` on pushes and pull requests (see `.github/workflows/ci.yml`).

## Production

**Release gate** (run before shipping or tagging):

```bash
npm run validate   # lint + full test suite + production build + dist checks
```

**Deploy** — Merge a PR into `main` (or push to `main`/`master`) to run [.github/workflows/deploy.yml](./.github/workflows/deploy.yml) and publish `dist/` to **GitHub Pages**:

**https://davidpurvis.github.io/cs2-utility-playbook/**

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**. If deploy fails at `configure-pages` with HTTP 404, Pages is not enabled yet.

| Production feature | Detail |
|--------------------|--------|
| Version | `1.0.0` in `package.json` |
| Code splitting | One async chunk per map (`loadMapModule`) |
| SPA routing | `404.html` copy of `index.html` for deep links |
| PWA shell | `public/manifest.json` + `icon.svg` |
| SEO / sharing | Meta description + Open Graph tags in `index.html` |
| Errors | `ErrorBoundary` hides stack traces in production builds |
| Storage | `lib/storage.js` safe `localStorage` wrappers |

Manual preview of the production build:

```bash
npm run build && npm run preview
```

Open the URL Vite prints (paths are under `/cs2-utility-playbook/`).

## How to Use

### Navigation

The app has two top-level sections:

- **Maps** — everything map-related: playbook, interactive map, study sheets
- **Training** — warmup and training exercises with launch links to external tools

Switch between them using the persistent nav bar at the top.

### Map Selector

Large buttons below the nav switch between the seven **Premier** maps. Your selection persists across reloads. Each map has lineups, combos, utility belts, scenarios, and setup positions. **Instant spawn utility** (spawn selector on the Map tab) is available on Ancient, Dust II, Inferno, Mirage, Nuke, Anubis, and Overpass.

**Cache** is available in the map selector as bonus content (lineups, combos, belts, scenarios, and map positions). Screenshot URLs are still being filled in.

### Data quality backlog

- Premier lineups still use YouTube **search** links as a fallback until curated `watch?v=` URLs are added per map.
- Run `npm test` for structural validation; in-game accuracy should be reviewed manually (Refrag / cs2util cross-check).

### Playbook Tab

The default view inside Maps. Organized by what you need in-game:

- **Must-Learn 5** — The 5 lineups every player should know for this map.
- **Combos** — Named 2-3 player setups. Tap to expand for callout, throw order, and tips.
- **Utility Belts** — One player carries the full site execute.
- **Scenarios** — Decision-making reminders (no lineups, just game sense).
- **All Lineups Reference** — Every lineup in the database, filterable by area.

Use the **T / CT** toggle and **round-type filter** (Pistol, Eco, Force, Full) to narrow what you see.

### Interactive Map Tab

Two modes:

**Setup Positions** — Click a position marker on the radar to see every lineup from that spot. Lines draw from standing position to utility landing points.
- Numbers on markers = how many lineups from that spot
- Gold rings = positions with must-learn lineups

**Instant Utility (Spawns)** — Select a spawn position to see utility you can throw the instant the round starts. This is the fastest way to learn which spawn gets which smoke off.
- Yellow dots with numbers = spawns with instant lineups
- Click a spawn, then click a landing-point dot to open Practice mode

### Coordinate System (Map Overlay)

The map overlay supports a **hybrid point format**:

- **Percent points (existing data):** `{ x, y }` where each value is `0–100`
- **World points (new support):** `{ worldX, worldY }` in CS2 world coordinates

World coordinates are converted with Valve overview metadata from `data/radarMetadata.js` using:

```js
percentX = ((worldX - pos_x) / (scale * 1024)) * 100;
percentY = ((worldY - pos_y) / -(scale * 1024)) * 100;
```

Render path is a square SVG (`viewBox="0 0 100 100"`) with map image + dots in the same coordinate space to avoid layer drift.

### Practice Mode

Hit **PRACTICE** on any lineup for a 3-step walkthrough:

1. **Stand here** — where to position yourself
2. **Aim here** — crosshair placement
3. **Throw** — which throw type

Each step shows a screenshot. If no screenshot exists, a "Watch video instead" link is shown.

### Study Sheets

Click the **Study** tab to open a focused view of just the Must-Learn 5. Pick a player name to personalize it. The URL updates with `?p=` — share it so teammates can bookmark their sheet.

### Team Roster

Click the **gear icon** in the header to open the roster modal. Enter your team's player names. Names persist in localStorage. The first name becomes the default belt carrier in Utility Belt cards.

### Training Section

Switch to **Training** in the top nav. Two lists:

- **Warmup** — 5-10 min exercises to do before queueing (FFA DM, prefire practice, aim trainers)
- **Training** — longer dedicated sessions (spray control, retakes, clutch practice)

Each exercise has a **LAUNCH** button. `steam://` URLs open the app directly in Steam. HTTPS URLs open in your browser.

## How to Customize

### Adding Player Names

Click the gear icon in the header, type names. They save automatically.

### Adding New Lineups

Edit `data/<mapname>.js`. Each lineup follows this structure:

```javascript
my_new_lineup: {
  id: "my_new_lineup",
  name: "Human-Readable Name",
  util: "SMOKE",           // SMOKE | FLASH | MOLLY | HE
  throw: "JT",             // JT | WJT | LMB | RMB | WALK2 | RUN
  side: "T",               // T | CT
  area: "A",               // A | Mid | B (map-specific)
  instant: true,           // true if throwable from spawn (optional)
  mustLearn: false,
  purpose: "What this does and why.",
  stand: "Where to stand.",
  aim: "Where to aim.",
  notes: "Extra info.",
  source: { name: "Source Name", url: "https://..." },
  video: "https://youtube.com/...",
  screenshots: {
    stand:  "https://...",
    aim:    "https://...",
    result: "https://...",
  },
  // Either percent space...
  radarPos:    { x: 50, y: 50 },           // where you stand
  radarTarget: { x: 40, y: 30 },           // where utility lands
  // ...or world space (auto-converted with map metadata)
  // radarPos:    { worldX: -1591, worldY: 583 },
  // radarTarget: { worldX: 146, worldY: 2876 },
  austincs: { video: "", timestamp: "", note: "" },
},
```

Then add its ID to a setup position in `SETUP_POSITIONS` and/or a spawn in `SPAWNS`.

### Adding Screenshots

Each lineup has a `screenshots` object with `stand`, `aim`, and `result` keys. Set these to image URLs (external links or paths to files in `/public/screenshots/`). If all three are empty, the UI shows a "No screenshot yet — watch video" fallback with a link.

### Adding Spawn Data

Each map file exports a `SPAWNS` object with `T` and `CT` arrays:

```javascript
export const SPAWNS = {
  T: [
    { id: 1, name: "Spawn 1 (Pillar)", pos: { x: 43, y: 68 }, lineups: ["red_room"] },
    // ... 5 total
  ],
  CT: [
    { id: 1, name: "Spawn 1 (Back CT)", pos: { x: 30, y: 30 }, lineups: ["ct_elbow_smoke"] },
    // ... 5 total
  ],
};
```

Each spawn references lineup IDs that have `instant: true`. The interactive map's "Instant Utility (Spawns)" mode uses this data.

### Adding AustinCS Sources

Each lineup has an `austincs` field. To fill one in:

1. Find the AustinCS YouTube video covering this lineup.
2. Set `video` to the full YouTube URL.
3. Set `timestamp` to the in-video time (e.g. `"2:34"`).
4. Optionally add a `note`.

When `video` is non-empty, an "AustinCS" badge appears on the lineup card.

### Editing Training Exercises

Open `data/training.js`. Add, remove, or reorder exercises in the `WARMUP` and `TRAINING` arrays:

```javascript
{
  id: "unique_id",
  name: "Exercise Name",
  tool: "CS2",          // CS2 | Kovaak's | Refrag | Aimlabs
  duration: "10 min",
  launch: "steam://run/730",  // or any HTTPS URL
  note: "One sentence focus.",
},
```

### Adding a New Map

1. Create `data/<mapname>.js` exporting: `MAP_NAME`, `RADAR_URL`, `LINEUPS`, `MUST_LEARN`, `COMBOS`, `UTILITY_BELTS`, `SCENARIOS`, `SETUP_POSITIONS`, `SPAWNS`.
2. Add the import and entry to `data/maps.js`.

## Project Structure

```
cs2_utility/
  App.jsx                     — All React UI components
  data/
    mapMeta.js                — Selector metadata (no lineup payloads)
    radarMetadata.js          — Valve radar metadata (pos_x, pos_y, scale, 1024 source resolution)
    loadMapModule.js          — Lazy map loaders (production bundles)
    maps-registry.js          — Eager registry for tests/validation
    maps.js                   — App-facing map API re-exports
    training.js               — Warmup + training exercise data
    ancient.js                — Ancient lineup database + spawns
    dust2.js                  — Dust II lineup database + spawns
    inferno.js                — Inferno lineup database + spawns
    mirage.js                 — Mirage lineup database + spawns
    nuke.js                   — Nuke lineup database + spawns
    anubis.js                 — Anubis lineup database + spawns
    overpass.js               — Overpass lineup database + spawns
    cache.js                  — Cache lineup database + spawns
  main.jsx                    — React entry point
  lib/mapCoordinates.js       — World↔percent conversion + hybrid point resolver
  index.html                  — HTML shell
  vite.config.js              — Vite config
  package.json                — Dependencies
```

## Throw Type Reference

| Code    | Name            | Input           |
|---------|-----------------|-----------------|
| `JT`    | Jump Throw      | Hold LMB → V   |
| `WJT`   | W + Jump Throw  | Hold W+LMB → V |
| `LMB`   | Left Click      | LMB             |
| `RMB`   | Right Click     | RMB (underhand) |
| `WALK2` | 2-Step Walk+JT  | WW → Jump+LMB  |
| `RUN`   | Run + LMB       | W + LMB         |

**Jump Throw Bind** (paste in console):

```
alias "+jt" "+jump;+attack"; alias "-jt" "-jump;-attack"; bind "v" "+jt"
```

Hold left-click, then press V to execute a jump throw.
