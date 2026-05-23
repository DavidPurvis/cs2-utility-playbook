# Codebase Audit: cs2-utility-playbook

**Audit date:** 2026-05-22
**Auditor:** Claude Opus 4.6 (automated, full-codebase read)
**Commit:** `b6891f7` (main, clean working tree)
**Cross-reference:** `docs/CS2_UTILITY_ECOSYSTEM_RESEARCH.md` (15,044-word ecosystem study)

---

## TL;DR

1. **What it is.** A single-page web app ("Dust 2 Playbook") that teaches CS2 utility lineups organized by multi-player team executes (scenarios). Dust 2 only. No backend.
2. **Who it's for.** One autistic 25-year-old who needs structure. This audience constraint is the project's design language — every UX decision traces back to it.
3. **Tech stack.** React 18 + TypeScript 5 + Vite 5, deployed to GitHub Pages. Two production dependencies (react, react-dom). No router, no CSS framework, no state library.
4. **Data model.** Five first-class entities (Spawn, Lineup, Scenario, CtPosition, DustDefaults) in a single JSON file (`src/data/dust2.json`, 904 lines). Validated at boot with referential integrity checks.
5. **Content inventory.** 10 lineups (7 T-side, 3 CT-side), 5 scenarios (all empty — zero actions populated), 20 spawns, 5 CT positions, 4 plant spots, 7 timing notes, 4 spawn rushes.
6. **The load-bearing gap.** All 5 scenarios have `actions: []`. The headline interaction ("let's do scenario 4") leads to an empty view. 7 of 10 lineups are orphans referenced by nothing.
7. **Unique niche.** Origin-first browsing (no other platform does this) + multi-player execute modeling (no other platform models coordinated team utility). This positions the project as a reference layer complementing Refrag's training layer.
8. **Test coverage.** 77 vitest (unit + component), 11 node:test (script CLIs), 35 Playwright E2E (visual snapshots + interaction regression).
9. **Code quality.** TypeScript strict mode. Zero TODO/FIXME/HACK markers. Single authoritative coordinate conversion module. CI runs typecheck + lint + test + build on every PR.
10. **Prior audit found 5 CRITICAL bugs.** Empty scenarios (C-1), orphan lineups (C-2), Map tab state leak (C-3), CLI data invention (C-4), mobile touch target WCAG violation (C-5). All documented in `docs/AUDIT_2026_05_22.md`.
11. **Accessibility.** ARIA labels, skip link, colorblind glyph overlays, AA contrast ratios — but spawn picker lacks keyboard navigation and mobile touch targets are below WCAG minimums.
12. **Anti-requirements.** No AI-generated coordinates, no scraping, no backend/DB/auth, no admin UI, no invented data, no backseat optimization. These are explicit and load-bearing.

---

## 1. Project Identity & Purpose

### What

**Dust 2 Playbook** — a personal CS2 (Counter-Strike 2) utility reference tool for the map `de_dust2`. It teaches smoke, flash, molotov, and HE grenade lineups organized by multi-player team executes called "scenarios."

The core interaction: a player says "let's do scenario 4" — the app shows which players throw what utility, from where, in what order. Each individual throw opens a 2x2 walkthrough card (Position / Aim / Throw / Result) with screenshots, coordinates, and copy-to-clipboard console commands.

- **Live site:** https://davidpurvis.github.io/cs2-utility-playbook/
- **Repository:** `cs2-utility-playbook` (private GitHub, deploys via GitHub Actions)
- **Version:** 2.0.0 (internal iteration ~v6.3)

### Who

The stated audience is **one autistic 25-year-old who needs structure when playing CS2**. This is not a general-purpose community tool. The audience constraint functions as the project's design language:

| Constraint | Manifestation |
|---|---|
| Needs structure | Four tabs in FIXED order (not alphabetical, not user-configurable) |
| Voice protocol | Scenarios have stable NUMBERS ("do scenario 4") not just names |
| Visual reference | Spawn picker shows position on radar without filtering anything |
| Predictable layout | 2x2 walkthrough grid never collapses to 1x4 on mobile |
| Trust in data | Boot validator throws hard errors on dangling references |
| No hidden modes | Spawn picker is purely visual — no silent filtering |
| No cleverness | CT position guide gives LOOSE recommendations, not prescriptive scripts |
| No animation anxiety | Minimal motion, `aria-live="polite"`, consistent sizing |

### Why (Ecosystem Positioning)

The ecosystem research (`docs/CS2_UTILITY_ECOSYSTEM_RESEARCH.md`) documents 12+ dedicated platforms, 8+ YouTube channels, 4 coaching platforms, workshop maps, and analytics tools. Every existing platform uses **destination-first** browsing: "I want to smoke CT spawn" → here are 6 ways to do it.

This project inverts the model with **origin-first** browsing: "I'm standing at this position — what can I throw from here?" No other platform does this.

Additionally, no other platform models **multi-player coordinated executes**. cs2util.com shows individual lineups. Refrag teaches individual throws via in-game overlay. yprac Hub has 1,400+ lineups but no concept of "3 players throw these 5 smokes in this order." This project's scenario system fills that gap.

The project functions as a **reference layer** (browser-based, team coordination, scenario lookup) that naturally complements Refrag's **training layer** (in-game practice via NADR mode, aim drills, refrag.gg coaching philosophy).

### Version History

The project has iterated through ~6 major versions, each narrowing scope and generalizing rules:

| Version | Key Change |
|---|---|
| v1 | 8 maps, ambitious scope |
| v2 | Narrowed to 1 map + admin UI |
| v3–v5 | Successive simplification passes |
| v6 | Scenarios restored as headline feature, admin UI removed |
| v6.1 | Four-tab home structure |
| v6.2 | Same-radius rule generalized (spawn picker) |
| v6.3 | Same-radius rule applied to Map tab markers |

The pattern: each iteration narrows scope and generalizes architectural rules. The project has never expanded to more maps or features — it converges.

---

## 2. Architecture & Tech Stack

### Stack Summary

| Layer | Choice | Version |
|---|---|---|
| Framework | React | 18.3.1 |
| Language | TypeScript (strict) | 5.6.3 |
| Bundler | Vite | 5.4.10 |
| Unit/Component tests | Vitest + React Testing Library | 2.1.9 |
| E2E tests | Playwright | 1.60.0 |
| Linting | ESLint + TypeScript plugin | 10.4.0 |
| Hosting | GitHub Pages | — |
| CI | GitHub Actions | — |

**Production dependencies:** 2 (react, react-dom). That's it.

**No:** router library, CSS framework, state management library, backend, database, API calls, analytics, auth.

### Architecture Diagram

```
index.html
  └─ src/main.tsx (entry, mounts <App>)
       └─ src/App.tsx (state owner via useReducer)
            ├─ Header (breadcrumb navigation)
            ├─ Toast (singleton notification)
            ├─ Home (4-tab shell)
            │    ├─ DefaultsTab (plants, timings, spawn rushes)
            │    ├─ ScenariosTab (scenario grid + spawn picker + CT guide)
            │    ├─ InstantSmokesTab (spawn-proximity lineups)
            │    └─ MapTab (origin-first clustered markers)
            ├─ ScenarioDetail (radar arcs + role-filtered action list)
            └─ LineupDetail (2x2 walkthrough cards)

Data flow:
  dust2.json → loadDust2.ts (validate + enrich) → dustData (immutable)
       ↓
  App.tsx useReducer(uiReducer, initialUiState) → state
       ↓
  Components render based on state + dustData
       ↓
  User interactions → dispatch actions → state update → re-render
```

### State Management

State is managed by a single `useReducer` in `App.tsx`. The reducer lives in `src/reducer.ts` (128 lines).

**State shape (`UiState`):**

| Field | Type | Purpose |
|---|---|---|
| `view` | `"home" \| "scenario" \| "lineup"` | Current view in the 3-view stack |
| `activeTab` | `"defaults" \| "scenarios" \| "instant_smokes" \| "map"` | Active home tab (remembered across navigation) |
| `activeScenarioId` | `string \| null` | Selected scenario |
| `activeRoleId` | `string \| null` | Selected role within scenario (filters action list) |
| `activeLineupId` | `string \| null` | Selected lineup (opens walkthrough) |
| `pickedSpawnId` | `string \| null` | Visual reference spawn (parallel state, persists across nav) |
| `activeThrowFromKey` | `string \| null` | Map tab marker selection |

**Actions (9):** `SELECT_TAB`, `SELECT_SCENARIO`, `SELECT_ROLE`, `SELECT_LINEUP`, `SELECT_THROW_FROM`, `BACK`, `GO_HOME`, `PICK_SPAWN`, `CLEAR_SPAWN`.

**BACK logic:** Lineup → Scenario (if came from scenario) OR Home (if came from CT guide/instant tab). Scenario → Home. Home → no-op.

**Key design:** `pickedSpawnId` is parallel state — it's a visual reference that persists across all navigation, never cleared by view changes. `activeThrowFromKey` is NOT cleared on navigation (documented as CRITICAL bug C-3 in prior audit).

### Coordinate System

All coordinate math lives in one authoritative module: `src/utils/coordinates.ts` (132 lines).

Three coordinate spaces:

| Space | Type | Use |
|---|---|---|
| **World** | `WorldPoint { x, y, z? }` | CS2 game-world units from `setpos` command. The ONLY format stored in `dust2.json`. |
| **Percent** | `PercentPoint { x, y }` | 0–100 on each radar axis. Stable across image sizes. Used for SVG rendering. |
| **Pixel** | `PixelPoint { x, y }` | Pixel coords on the rendered radar image. Derived at render time, never stored. |

**Conversion formula** (from Valve `overview.txt` specification):
```
percent_x = ((worldX - pos_x) / (scale * sourceResolution)) * 100
percent_y = ((worldY - pos_y) / -(scale * sourceResolution)) * 100  // Y inverted
```

**Conversions exported:** `worldToPercent`, `percentToWorld`, `worldToPixel`, `pixelToWorld`, `pointToPixel` (convenience: prefers world, falls back to percent). All inputs validated for finite numbers; null configs handled gracefully.

**Test coverage:** 16 landmark coordinate tests + round-trip assertions in `src/utils/coordinates.test.ts` (196 lines).

### Build & Deploy

**Build pipeline:** `tsc --noEmit` (type check) → `vite build` (bundle) → `cp dist/index.html dist/404.html` (SPA fallback) → `node scripts/verify-dist.mjs` (post-build verification).

**Base URL:** `/cs2-utility-playbook/` (GitHub Pages subfolder deployment).

**CI (`ci.yml`):** On push/PR to main — typecheck, lint, vitest, node:test scripts, build. Matrix: Node 20.x + 22.x. No E2E in CI (Playwright runs locally; baselines committed).

**Deploy (`deploy.yml`):** On push to main — full `npm run validate` gate → upload-pages-artifact → deploy-pages. Single concurrency group, cancel in-progress.

**Post-build verification (`scripts/verify-dist.mjs`):** Checks dist/ for required files (index.html, 404.html, manifest.json, robots.txt, icon.svg), verifies built asset references, confirms radar PNG and sentinel screenshot bundled.

### Complete File Tree

```
cs2-utility-playbook/               (root)
├── index.html                       77 lines   HTML entry, PWA meta, inline grid CSS
├── package.json                     52 lines   2 deps, 15 scripts, Node >=20
├── vite.config.js                   44 lines   base URL, path aliases, test config
├── tsconfig.json                    36 lines   strict mode, bundler resolution
├── eslint.config.js                 42 lines   TS + React plugins
├── playwright.config.ts             47 lines   E2E config, 1% pixel tolerance
├── .nvmrc                            1 line    Node 20
├── README.md                       134 lines   Quick start, concepts, architecture
├── .gitignore                       11 lines
│
├── src/
│   ├── main.tsx                     16 lines   React root mount
│   ├── App.tsx                     179 lines   State owner, 3-view router, toast
│   ├── types.ts                    215 lines   All domain types
│   ├── reducer.ts                  128 lines   UI state machine
│   ├── reducer.test.ts             134 lines   State transition tests
│   ├── theme.ts                     69 lines   Design tokens (warm cream palette)
│   ├── vite-env.d.ts                 2 lines   Vite type declarations
│   ├── test-setup.ts                18 lines   Vitest + RTL config
│   │
│   ├── data/
│   │   ├── dust2.json              904 lines   ALL content data (single source)
│   │   ├── loadDust2.ts             99 lines   Boot validator + enrichment
│   │   └── loadDust2.test.ts        86 lines   Validator tests
│   │
│   ├── utils/
│   │   ├── coordinates.ts          132 lines   World ↔ percent ↔ pixel math
│   │   ├── coordinates.test.ts     196 lines   16 landmark tests + round-trips
│   │   ├── bounds.ts                75 lines   Bounding-box helpers
│   │   ├── bounds.test.ts           48 lines   Bounds tests
│   │   ├── parseSetposCommand.ts    61 lines   Parse/format setpos+setang
│   │   ├── parseSetposCommand.test.ts 50 lines Command parser tests
│   │   ├── steamDeepLink.ts         42 lines   steam:// URL builder
│   │   └── steamDeepLink.test.ts    28 lines   Deep-link tests
│   │
│   └── components/
│       ├── Header.tsx               74 lines   Breadcrumb navigation
│       ├── Home.tsx                  76 lines   Tab shell
│       ├── TabBar.tsx              100 lines   4-tab navigation
│       ├── Toast.tsx                50 lines   Singleton notification
│       ├── CopyButton.tsx           90 lines   Clipboard copy + fallback
│       ├── ErrorBoundary.tsx        83 lines   React error boundary
│       ├── ScenarioDetail.tsx      350 lines   Radar arcs + role actions
│       ├── LineupDetail.tsx        414 lines   2x2 walkthrough cards
│       ├── Radar.tsx               215 lines   SVG radar rendering primitive
│       ├── ScenarioGrid.tsx         60 lines   Scenario card grid
│       ├── ScenarioCard.tsx        120 lines   Scenario tile
│       ├── SpawnPicker.tsx         244 lines   Visual spawn reference
│       ├── CtPositionGuide.tsx     159 lines   CT position recommendations
│       │
│       ├── tabs/
│       │   ├── ScenariosTab.tsx     57 lines   Scenarios grid + picker
│       │   ├── InstantSmokesTab.tsx 167 lines  Instant-from-spawn lineups
│       │   ├── DefaultsTab.tsx     325 lines   Plants, timings, rushes
│       │   └── MapTab.tsx          291 lines   Origin-first markers
│       │
│       └── __tests__/
│           ├── home.test.tsx        94 lines   Home integration tests
│           ├── scenarioDetail.test.tsx 124 lines Scenario detail tests
│           └── walkthrough.test.tsx  59 lines  LineupDetail tests
│
├── scripts/
│   ├── new-lineup.mjs              228 lines   CLI: add lineup to JSON
│   ├── new-lineup.test.mjs          56 lines   Parser tests
│   ├── new-scenario.mjs            194 lines   CLI: add scenario to JSON
│   ├── new-scenario.test.mjs        47 lines   Player parser tests
│   ├── download-screenshots.mjs     98 lines   One-off screenshot fetcher
│   ├── diagnose-radar.mjs           76 lines   Radar loading diagnostic
│   ├── capture-guide-screenshots.mjs 81 lines  User guide screenshot capture
│   └── verify-dist.mjs              43 lines   Post-build verification
│
├── tests/
│   └── e2e/
│       ├── visual-snapshots.spec.ts  80+ lines Visual regression baselines
│       ├── spawn-click-target.spec.ts 182 lines Spawn dot click precision
│       ├── spawn-hitbox.spec.ts      50+ lines Spawn overlap regression
│       ├── home-tabs.spec.ts         77 lines  Tab navigation tests
│       ├── radar-loads.spec.ts       68 lines  Radar image loading tests
│       ├── map-marker-click.spec.ts  178 lines Map marker click precision
│       └── __screenshots__/         Committed visual baselines (PNG)
│
├── public/
│   ├── icon.svg                     PWA icon
│   ├── manifest.json                PWA manifest
│   ├── robots.txt                   Allow all
│   ├── maps/dust2/radar.png         Valve Dust 2 radar image
│   └── screenshots/dust2/          Lineup walkthrough screenshots
│       ├── xbox_smoke/              position, aim, throw, result (.webp)
│       ├── a_ct_smoke/              ...
│       ├── a_long_flash/            ...
│       ├── ct_molly_from_long/      ...
│       ├── a_short_flash/           ...
│       ├── b_window_smoke/          ...
│       ├── b_tunnel_flash/          ...
│       ├── ct_long_doors_smoke/     ...
│       ├── ct_b_tuns_smoke/         ...
│       └── ct_mid_smoke/            ...
│
├── .github/workflows/
│   ├── ci.yml                       27 lines   PR gate (typecheck, lint, test, build)
│   └── deploy.yml                   38 lines   GitHub Pages deploy
│
└── docs/                           14 documents (see §7 below)
```

**Total source lines (excluding tests):** ~3,900
**Total lines (including tests):** ~4,700
**Total lines (including scripts, configs, tests):** ~6,800

---

## 3. Data Model

### Entity Relationship

All types defined in `src/types.ts` (216 lines). All data stored in `src/data/dust2.json` (904 lines).

```
DustData (root bundle, loaded once at boot)
 ├── config: MapConfig           (1 map: de_dust2)
 ├── spawns: Spawn[]             (20 total: 15 T + 5 CT)
 ├── lineups: Lineup[]           (10 total: 7 T + 3 CT)
 ├── scenarios: Scenario[]       (5 total, ALL EMPTY)
 │    └── players: ScenarioPlayer[]
 │         └── actions: ScenarioAction[]    ← references Lineup.id
 ├── ctPositions: CtPosition[]   (5 total)
 │    └── recommendedLineupIds[]            ← references Lineup.id
 └── defaults: DustDefaults
      ├── plants: PlantSpot[]    (4 total)
      ├── timings: TimingNote[]  (7 total)
      └── spawnRushes: SpawnRush[]  (4 total)
           ├── fromSpawnId                  ← references Spawn.id
           ├── beatsSpawnIds[]              ← references Spawn.id
           └── losesToSpawnIds[]            ← references Spawn.id
```

### Entity Details

#### Spawn

Fixed in-game spawn positions. 15 T-side + 5 CT-side for Dust 2.

| Field | Type | Notes |
|---|---|---|
| `id` | string | Stable slug, e.g. `"dust2-t-s6"` |
| `side` | `"T" \| "CT"` | |
| `label` | string | Short, e.g. `"S6"` (UI renders bare number only) |
| `world` | WorldPoint | setpos values from the game |

#### Lineup

A single utility throw. The app's atomic learning unit. Renders as a 2x2 walkthrough (Position / Aim / Throw / Result).

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | snake_case slug, e.g. `"xbox_smoke"` |
| `name` | string | yes | Display name |
| `type` | `"smoke" \| "flash" \| "molotov" \| "he"` | yes | |
| `side` | `"T" \| "CT"` | yes | |
| `area` | string | yes | Landing area callout (e.g. `"Mid"`, `"A"`, `"B"`) |
| `throwFrom.world` | WorldPoint | yes | Exact setpos for throw position |
| `throwFrom.label` | string | no | Callout name of stand position |
| `landingAt.world` | WorldPoint | * | Landing setpos (preferred) |
| `landingAt.percent` | PercentPoint | * | Radar 2D fallback |
| `landingAt.label` | string | no | Landing callout |
| `throwAngle` | ThrowAngle | no | setang for crosshair aim |
| `throwStyle` | `"normal" \| "jump" \| "run" \| "jump+run" \| "crouch"` | yes | |
| `movement` | `"standing" \| "walking" \| "running"` | yes | |
| `difficulty` | `"easy" \| "medium" \| "hard"` | yes | |
| `airTimeSeconds` | number | no | Flight time |
| `description` | string | no | Human-readable cue |
| `screenshots` | object | no | 4 slots: position, aim, throw, result |
| `source` | { name, url } | no | Attribution |

*Boot validator requires at least one of `landingAt.world` or `landingAt.percent`.

#### Scenario

A numbered, named team execute. 2–5 players each with a chronological action list referencing Lineup ids.

| Field | Type | Notes |
|---|---|---|
| `id` | string | Stable slug |
| `number` | number | User-facing (voice protocol: "do scenario 4") |
| `name` | string | Display name |
| `description` | string | |
| `side` | `"T" \| "CT"` | |
| `targetArea` | string | |
| `difficulty` | `"beginner" \| "intermediate" \| "advanced"` | |
| `playerCount` | 2–5 | |
| `players` | ScenarioPlayer[] | Role, label, color, optional spawn, actions[] |
| `roleOrder` | string[] | Optional: display ordering of role tabs |
| `notes` | string | Optional |

**ScenarioPlayer** has: `role` (freeform), `label` (display), `color` (hex), `startingSpawnId?`, `actions: ScenarioAction[]`.

**ScenarioAction** has: `order` (1, 2, 3...), `lineupId` (references Lineup.id, validated at boot), `description?`, `timing?`.

#### CtPosition

CT-side position guide. Loose recommendations, not prescriptive scripts.

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `label` | string | e.g. "A Anchor" |
| `description` | string | 1–2 sentence role summary |
| `spawnHint` | string | Optional: where to spawn/walk |
| `recommendedLineupIds` | string[] | Lineup refs, validated at boot |
| `utilityFocus` | string | Freeform: what to carry / when to throw |

#### DustDefaults

Bundle of structural reference data (plants, timings, spawn rushes). Populated incrementally.

- **PlantSpot:** default bomb plant location per site. Fields: id, site, name, description, percent (radar coords).
- **TimingNote:** round-timing milestone. Fields: id, label, body, side?, phase (buy/early/mid/late).
- **SpawnRush:** spawn-rush matchup ("from T-1, I beat CT-1 to long corner"). Fields: id, fromSpawnId, contestPath, beatsSpawnIds[], losesToSpawnIds?, description?.

### Current Content Inventory

| Entity | Count | Status |
|---|---|---|
| Lineups | 10 | 7 T-side, 3 CT-side. All have 3/4 screenshots (throw slot missing for all). |
| Scenarios | 5 | ALL EMPTY — `actions: []` for every player in every scenario. |
| Spawns | 20 | 15 T-side + 5 CT-side. Complete for Dust 2. |
| CT Positions | 5 | A Anchor (1 lineup), B Anchor (1), Mid Control (1), Aggressive AWP (1), Rotator/Late (0). |
| Plant Spots | 4 | Default A, Safe A, Default B, Safe B. |
| Timing Notes | 7 | Across buy/early/mid/late phases. |
| Spawn Rushes | 4 | T-side rush matchups with CT-side spawns. |

**Lineup breakdown by type:**

| Type | Count | Side | IDs |
|---|---|---|---|
| Smoke | 6 | 3T + 3CT | xbox_smoke, a_ct_smoke, b_window_smoke, ct_long_doors_smoke, ct_b_tuns_smoke, ct_mid_smoke |
| Flash | 3 | 3T | a_long_flash, a_short_flash, b_tunnel_flash |
| Molotov | 1 | 1T | ct_molly_from_long |
| HE | 0 | — | — |
| Decoy | 0 | — | — |

**Orphan lineups** (not referenced by any scenario or CT position): xbox_smoke, a_long_flash, a_short_flash, b_tunnel_flash, b_window_smoke, ct_molly_from_long. That's 7 of 10 lineups (70%) with no context for when or why to use them.

### Boot Validator

`src/data/loadDust2.ts` (99 lines) runs at boot to validate and enrich `dust2.json`.

**What it checks:**
- Root shape: config object, arrays for spawns/lineups/scenarios
- Discriminator: each lineup must have `landingAt.world` OR `landingAt.percent`
- Ref integrity: every `ScenarioAction.lineupId` must exist in `lineups[]`
- Ref integrity: every `CtPosition.recommendedLineupIds[]` entry must exist

**What it does NOT check (documented gaps):**
- `scenario.playerCount !== scenario.players.length`
- `ScenarioPlayer.startingSpawnId` references invalid spawns
- Duplicate `scenario.number`, `lineup.id`, or `spawn.id`
- Side mismatch (T scenario with CT lineup)
- `ScenarioAction.order` bounds / duplicates
- `defaults.spawnRushes[].fromSpawnId` / `.beatsSpawnIds[]` validity
- `landingAt.percent` within [0..100]

These are latent traps that only fire under manual JSON editing — but manual JSON editing is the only content authoring method.

---

## 4. Feature Inventory

### Implemented Features

#### Home View (4 tabs)

| Tab | Component | Lines | Purpose |
|---|---|---|---|
| **Defaults** | `DefaultsTab.tsx` | 325 | Plant spots (radar markers), round timings (grouped by phase), spawn rushes (table) |
| **Scenarios** | `ScenariosTab.tsx` | 57 | Scenario grid (sorted by number) + spawn picker + CT position guide |
| **Instant Smokes** | `InstantSmokesTab.tsx` | 167 | Lineups throwable from spawn at round start. Heuristic: `throwFrom` within 1500 world units of any spawn on matching side. |
| **Map** | `MapTab.tsx` | 291 | Origin-first radar. Every unique `throwFrom` position is a marker. Lineups within ~150 wu of each other cluster into a single marker. Click marker → show lineups panel → click lineup → walkthrough. |

Tab order is FIXED (per owner directive). Active tab remembered across navigation.

#### Scenario Detail View

`ScenarioDetail.tsx` (350 lines).

- **Left:** SVG radar with player arcs (colored lines from throw origin to landing)
- **Right:** Role tabs (one per player, colored) → filtered action list sorted by order
- Arcs dimmed when not the active role
- Landing circles colored by utility type
- Spawn dots mark player starting positions

#### Lineup Walkthrough (2x2)

`LineupDetail.tsx` (414 lines).

Four cards in a 2x2 grid that STAYS 2x2 even on mobile:

| Card | Content | Fallback |
|---|---|---|
| **Position** | Screenshot + setpos command (copyable) | Radar crop centered on throwFrom |
| **Aim** | Screenshot of crosshair alignment | "No aim screenshot recorded yet" |
| **Throw** | Screenshot + throw style/movement | Text overlay: throwStyle + movement + setang |
| **Result** | Screenshot + landing coords | Radar crop centered on landing |

Features: CopyButton for setpos/setang commands, Steam deep-link button (`steam://rungameid/730...`), source attribution link.

#### Spawn Picker

`SpawnPicker.tsx` (244 lines).

- Tab between T-side (15 spawns) and CT-side (5 spawns)
- Radar zooms to spawn cluster with auto-padding
- Click dot → highlight (PICK_SPAWN action)
- Purely visual reference — does NOT filter scenarios or lineups
- Persists across all navigation
- Below picker (CT-side only): CT Position Guide with recommended lineup chips

**Same-radius rule (R-12):** Spawn dots have constant radius (0.95 viewBox units) regardless of selection state. Active state signaled by color shift only. This fixes a historical bug where inflated dots covered adjacent spawn click targets.

#### Origin-First Map

`MapTab.tsx` (291 lines).

- Every unique `throwFrom` position becomes a marker on the radar
- Lineups within ~150 world units cluster into a single marker (stable key: sorted lineup IDs)
- Click marker → highlight + show lineups panel
- Click again → deselect (toggle)
- Marker radius constant (r=1.3, same-radius rule R-14)

This is the project's unique browsing paradigm. No other platform in the ecosystem does origin-first.

#### Supporting Features

| Feature | Component | Lines | Notes |
|---|---|---|---|
| Breadcrumb nav | `Header.tsx` | 74 | Clickable segments except current view |
| Toast notifications | `Toast.tsx` | 50 | Singleton, auto-dismiss (1.5s success / 4s error) |
| Clipboard copy | `CopyButton.tsx` | 90 | navigator.clipboard + execCommand fallback |
| Error boundary | `ErrorBoundary.tsx` | 83 | Class component, dev/prod modes |
| Steam deep-links | `steamDeepLink.ts` | 42 | `steam://rungameid/730` protocol URLs |
| setpos parsing | `parseSetposCommand.ts` | 61 | Bidirectional parse/format, lenient |
| PWA manifest | `manifest.json` | 18 | Standalone display, warm cream theme |
| Skip link | `index.html` | — | "Jump to content" for keyboard users |

#### Content Authoring CLIs

| Script | Lines | Purpose |
|---|---|---|
| `new-lineup.mjs` | 228 | Append lineup to `dust2.json`. Flags: --id, --name, --type, --side, --area, --style, --movement, --difficulty, --throw (setpos), --landing, --source-name, --source-url. Validates ID uniqueness, enum values, setpos format. |
| `new-scenario.mjs` | 194 | Append scenario shell to `dust2.json`. Flags: --number, --name, --side, --area, --players (role:lineup1,lineup2 format), --difficulty. Validates lineup ID references. Player colors auto-assigned from palette. |

Both scripts write `JSON.stringify(data, null, 2) + "\n"` format and print a `git diff` hint.

### Not Implemented

| Feature | Status | Reference |
|---|---|---|
| FR-13: Flat list view of lineups | Not implemented | Q-12 in DECISIONS_LEDGER |
| T-side role guide | No T-side parallel to CT position guide | FULL_PICTURE §18.6 |
| Screenshot capture automation | Manual only | Q-2 in DECISIONS_LEDGER |
| Multi-map support | Dust 2 only (by design) | ADR-002 trigger clause |
| Auth / backend / database | None (by design) | AR-5 |
| Admin UI | Removed in v6 | AR-6 |
| Dark mode | Not implemented | SOLUTION_DESIGN "does not exist" list |
| URL sharing / deep-linking | Not implemented | ADR-004 trigger clause |
| Analytics | None | |
| Community features | No sharing, no user submissions | |
| Video / GIF content | Screenshots only | |
| Difficulty progression / learning paths | No guided learning sequence | |
| Practice integration | No Refrag / workshop map deep-links | |
| Decoy lineups | No decoy content | |

---

## 5. UX Flow

### Navigation State Machine

```
                    ┌──────────────────────────────────┐
                    │           HOME                    │
                    │  ┌─────┬─────┬─────┬─────┐       │
                    │  │ Def │ Sce │ Ins │ Map │       │
                    │  └─────┴──┬──┴──┬──┴──┬──┘       │
                    └───────────┼─────┼─────┼──────────┘
                                │     │     │
              SELECT_SCENARIO   │     │     │  SELECT_LINEUP
              (from grid)       │     │     │  (from instant/map/CT guide)
                                ▼     │     ▼
                    ┌───────────────┐  │  ┌──────────────┐
                    │   SCENARIO    │  │  │    LINEUP     │
                    │               │  │  │  (2x2 grid)   │
                    │ radar + roles │  │  │               │
                    │   ↓ action    │  │  │ BACK → HOME   │
                    │   SELECT_     │  │  └──────────────┘
                    │   LINEUP      │  │         ▲
                    └───────┬──────┘  │         │
                            │         │         │
                            ▼         │         │
                    ┌──────────────┐  │         │
                    │    LINEUP     │  │         │
                    │  (2x2 grid)   │  │         │
                    │               │  │         │
                    │ BACK →        │──┘         │
                    │  SCENARIO     │            │
                    └──────────────┘            │
                                                │
              Picked Spawn ─────────────────────┘
              (parallel state, persists everywhere)
```

**BACK behavior:**
- From LINEUP with `activeScenarioId` → returns to SCENARIO (preserves scenario context)
- From LINEUP without `activeScenarioId` → returns to HOME (came from CT guide, instant tab, or map)
- From SCENARIO → returns to HOME (clears scenario/role/lineup state)
- From HOME → no-op

**Browser integration:**
- `history.pushState` on SCENARIO and LINEUP selection
- `popstate` event → dispatches BACK
- Esc key → dispatches BACK (except in HOME)

### Tab-by-Tab Walkthrough

#### Defaults Tab
Three sections stacked vertically:
1. **Plant Spots:** Radar with labeled markers (A/B sites) + right-side cards per site with plant name and description
2. **Round Timings:** Grouped by phase (buy → early → mid → late). Each timing shows label, body, optional side tag
3. **Spawn Rushes:** Table with columns: from spawn, contest path, beats (spawn chips), loses to (spawn chips), notes

#### Scenarios Tab
Two columns:
- **Left:** Scenario grid (`repeat(auto-fill, minmax(260px, 1fr))`). Cards show: number badge, side/area tag, player count, name, description (3-line clamp), difficulty badge. Sorted by `scenario.number`.
- **Right:** Spawn picker (T/CT tabs) + CT Position Guide (when CT selected)

#### Instant Smokes Tab
Two columns (T-side | CT-side). Each lineup card shows: name, utility type dot, area callout, throw style. Click → opens walkthrough.

Qualification heuristic: lineup's `throwFrom` is within 1500 world units of any spawn on matching side.

#### Map Tab
Full-width radar with clustered markers. Click marker → highlight (accent color) + panel showing N lineups at that position. Click lineup in panel → walkthrough.

### Accessibility

| Feature | Status |
|---|---|
| ARIA labels on interactive elements | Implemented |
| `role="img"` on radar SVGs | Implemented |
| `role="tablist"` / `role="tab"` on tab bars | Implemented |
| `aria-live="polite"` on toast | Implemented |
| `aria-selected` on tabs | Implemented |
| Skip link ("Jump to content") | Implemented |
| Colorblind glyph overlays (S/F/M/H on arcs) | Implemented |
| AA contrast ratios (all body text vs cream bg) | Implemented |
| Keyboard navigation for spawn picker | NOT implemented (C-5, B-1) |
| WCAG touch target minimums on mobile | NOT met (7×7px vs 44×44px minimum) |
| `prefers-reduced-motion` respect | NOT implemented |
| Screen reader testing | NOT documented |

---

## 6. Code Quality

### TypeScript Configuration

`tsconfig.json` enables every strictness check:

| Setting | Value |
|---|---|
| `strict` | true |
| `noUnusedLocals` | true |
| `noUnusedParameters` | true |
| `noFallthroughCasesInSwitch` | true |
| `noUncheckedIndexedAccess` | true |

Target: ES2022. Module resolution: bundler. JSX: react-jsx (automatic runtime).

### Linting

ESLint 10.4 with TypeScript-ESLint recommended rules + React Hooks plugin + React Refresh plugin. Warns on unused vars (ignores leading underscore). Scope: `src/` only (scripts excluded).

### Test Coverage

| Category | Framework | Files | Cases | What's Tested |
|---|---|---|---|---|
| Unit | Vitest | 6 files in `src/utils/` + `src/data/` | 54 | Coordinate conversion (34 tests), setpos parsing, bounds math, Steam deep-links, data loading/validation |
| Reducer | Vitest | `src/reducer.test.ts` | 11 | All 9 actions, BACK logic (3 paths), state preservation |
| Component | Vitest + RTL | 3 files in `src/components/__tests__/` | 12 | Home rendering, ScenarioDetail interactions, LineupDetail walkthrough |
| Script | node:test | 2 files in `scripts/` | 11 | CLI argument parsing, enum validation, setpos format parity |
| E2E | Playwright | 6 files in `tests/e2e/` | 35 | Visual snapshots (7 baselines), spawn click precision (13), home tabs (6), radar loading (4), map markers (5) |
| **Total** | | **17 files** | **123** | |

Visual snapshot baselines committed as PNGs under `tests/e2e/__screenshots__/`. Tolerance: 1% pixel drift (`maxDiffPixelRatio: 0.01`).

**Coverage gaps:**
- Defaults tab: no visual snapshots
- Instant Smokes tab: no visual snapshots
- Keyboard navigation: no tests
- Mobile viewports: limited (only map tab has mobile snapshots)
- Accessibility audit: no automated WCAG testing

### Code Hygiene

- **Zero TODO/FIXME/HACK markers** in source code
- **Four unused exports** in `coordinates.ts` (`percentToWorld`, `worldToPixel`, `pixelToWorld`, `pointToPixel`) — used in tests and retained for future admin tooling
- **Single coordinate module** — all renderers trace back to `coordinates.ts`
- **Same-radius architectural rule** — enforced in spawn picker and map markers, locked by E2E regression tests
- **Boot validator** — dangling refs crash the app immediately rather than rendering blank views

### CI/CD Pipeline

**ci.yml (PR gate):**
1. Checkout → setup Node (20.x + 22.x matrix) → `npm ci`
2. `npm run typecheck` → `npm run lint` → `npm test` → `npm run test:scripts` → `npm run build`
3. No E2E in CI (Playwright runs locally)

**deploy.yml (publish):**
1. Full `npm run validate` (typecheck + lint + test + scripts + build)
2. Upload dist/ artifact → deploy to GitHub Pages
3. Concurrency: single deploy at a time, cancel in-progress

### Prior Audit Findings Summary

`docs/AUDIT_2026_05_22.md` documents a systematic bug sweep with severity ratings:

| Severity | Count | Examples |
|---|---|---|
| CRITICAL | 5 | Empty scenarios (C-1), orphan lineups (C-2), Map tab state leak (C-3), CLI data invention (C-4), mobile touch target (C-5) |
| HIGH | 9 | Spawn picker keyboard (H-1), boot validator gaps (H-2), ErrorBoundary theme (H-3), etc. |
| MEDIUM | 14 | Visual snapshot gaps, script code duplication, etc. |
| LOW | 13 | Polish items |

---

## 7. Dependencies

### Runtime Dependencies (2)

| Package | Version | Purpose |
|---|---|---|
| `react` | ^18.3.1 | UI framework |
| `react-dom` | ^18.3.1 | DOM rendering |

That's it. No other runtime dependencies. The app ships ~2 packages to the browser.

### Dev Dependencies (19)

| Package | Version | Purpose |
|---|---|---|
| `vite` | ^5.4.10 | Bundler + dev server |
| `@vitejs/plugin-react` | ^4.3.4 | React JSX transform |
| `typescript` | ^5.6.3 | Type system |
| `typescript-eslint` | ^8.15.0 | TS lint rules |
| `eslint` | ^10.4.0 | Linter |
| `eslint-plugin-react-hooks` | ^7.1.1 | Hooks lint rules |
| `eslint-plugin-react-refresh` | ^0.5.2 | Fast refresh lint |
| `@eslint/js` | ^10.0.1 | ESLint base config |
| `globals` | ^17.6.0 | Global variable definitions |
| `vitest` | ^2.1.9 | Test runner |
| `@vitest/coverage-v8` | ^2.1.9 | Coverage provider |
| `jsdom` | ^25.0.1 | DOM simulation for tests |
| `@testing-library/react` | ^16.0.1 | Component testing |
| `@testing-library/user-event` | ^14.6.1 | User interaction simulation |
| `@testing-library/jest-dom` | ^6.6.3 | DOM matchers |
| `@playwright/test` | ^1.60.0 | E2E testing |
| `@types/node` | ^22.9.0 | Node.js type definitions |
| `@types/react` | ^18.3.12 | React type definitions |
| `@types/react-dom` | ^18.3.1 | ReactDOM type definitions |

### External Services

| Service | Purpose | Risk |
|---|---|---|
| GitHub Pages | Hosting | Free tier, public site |
| Google Fonts | Inter + JetBrains Mono | External dependency, privacy implications |
| GitHub Actions | CI/CD | Runs on ubuntu-latest |

### What's NOT Present

No backend. No database. No API calls at runtime. No analytics. No auth. No CDN (beyond GitHub Pages). No third-party UI components. No CSS-in-JS library. No icon library.

---

## 8. What's Missing (vs. Ecosystem Research)

Cross-referencing the current codebase against `docs/CS2_UTILITY_ECOSYSTEM_RESEARCH.md` (which documents 12+ platforms, 8+ YouTube channels, 4 coaching platforms, workshop maps, and analytics tools):

### Content Scale

| Dimension | This Project | Ecosystem Leader | Gap |
|---|---|---|---|
| Total lineups | 10 | yprac Hub: 1,400+ | 140x |
| Maps covered | 1 (Dust 2) | cs2util.com: all 9 Active Duty | 8 maps missing |
| Utility types | 3 (smoke, flash, molotov) | All platforms: 5 types | No HE, no decoy |
| Populated executes | 0 | No competitor has this feature | n/a (unique) |
| Video content | 0 | NadeKing: 3,000+ videos | Fundamental gap |
| Screenshot completeness | 30/40 slots filled (75%) | cs2util: 3D interactive viewer | Different medium |

### Feature Gaps vs. Competitor Capabilities

| Feature | Available Elsewhere | Status Here |
|---|---|---|
| **Destination-first browsing** | cs2util, CSNADES, yprac, Smoke Baron | NOT implemented (by design — this project is origin-first) |
| **3D interactive viewer** | cs2util.com | NOT implemented (uses screenshots + radar) |
| **In-game overlay** | Refrag NADR mode | NOT implemented (browser-only) |
| **Video walkthroughs** | NadeKing, SCOPE.gg, YouTube channels | NOT implemented (screenshots only) |
| **Difficulty progression** | Refrag learning paths, yprac hub | NOT implemented |
| **Practice mode integration** | Refrag, yprac workshop maps | NOT implemented |
| **Community submissions** | cs2util, CSDB.gg | NOT implemented (single author, by design) |
| **Analytics / performance tracking** | SCOPE.gg, Leetify, Tracker.gg | NOT implemented |
| **Mobile app** | CS2 Smokes (iOS/Android) | NOT implemented (responsive web only) |
| **One-way lineups** | Several platforms document these | NOT explicitly tagged |
| **Post-plant utility** | No platform has this as first-class | NOT implemented (gap in entire ecosystem) |
| **Round-type utility presets** | No platform has this | NOT implemented |

### What This Project Has That Nobody Else Does

These are genuine differentiators identified in the ecosystem research:

1. **Origin-first browsing.** "I'm standing here — what can I throw?" inverts every other platform's destination-first model. The Map tab implements this.

2. **Multi-player execute modeling.** Scenarios model 2–5 players with roles, colors, chronological action lists, and coordinated timing. No other platform structures team utility coordination this way.

3. **Audience-specific design language.** Built for one neurodivergent user who needs structure. Fixed tab order, stable scenario numbers (voice protocol), no hidden modes, no clever interactions. No platform in the ecosystem designs for this use case.

4. **CT position guide.** Loose recommendations per defensive position with recommended lineup references. Most platforms focus exclusively on T-side offense.

5. **Structural defaults.** Plant spots, round timings, and spawn rush matchups as first-class tab content. No competitor surfaces this information alongside lineup reference.

### Missing Ecosystem Integration Opportunities

| Integration | Value | Effort |
|---|---|---|
| Refrag deep-links ("Practice in NADR") | Natural complement — reference ↔ training | Low (URL construction) |
| Workshop map references | "Load yprac Dust 2 to practice" | Low (static links) |
| Console command export | Full practice config (`sv_cheats 1; ...`) | Medium |
| Steam deep-link improvements | Currently doesn't warn about limitations | Low |

---

## 9. Technical Debt

### CRITICAL (blocks core value)

| ID | Issue | File | Impact |
|---|---|---|---|
| **C-1** | All 5 scenarios have `actions: []` | `src/data/dust2.json` | Headline interaction ("do scenario 4") leads to empty view. The architecture works; the content doesn't exist. |
| **C-2** | 7 of 10 lineups are orphans | `src/data/dust2.json` | 70% of lineups have no context (not referenced by scenarios or CT positions). User sees them only via Map tab or Instant Smokes. |
| **C-3** | `activeThrowFromKey` not cleared on navigation | `src/reducer.ts:80-85` | When user navigates away from Map tab, the selected marker state leaks. Returning to Map tab shows stale selection. |
| **C-4a** | 7/10 lineup source URLs are dead (NadeKing 404) | `src/data/dust2.json` | NadeKing.com restructured; lineup pages return 404. "Source: NadeKing ↗" links in lineup detail views lead to broken pages. |
| **C-4** | ~~CLI silently invents data on parse failure~~ **RESOLVED** | `scripts/new-lineup.mjs` | Already fixed — `new-lineup.mjs` lines 178-179 exit with error on parse failure. The default landing `{x:50,y:50}` is a documented placeholder, not invented data. |
| **C-5** | Mobile spawn dot touch target ~7×7px | `src/components/SpawnPicker.tsx` | WCAG 2.1 SC 2.5.8 requires 44×44px minimum. Current dots are ~5x below minimum. Note: a prior attempt to fix this with oversized invisible hit circles was tried and removed (lines 143-150) because adjacent spawns' hit zones overlapped, routing clicks to wrong spawns. Fix requires design rethink (list picker, tooltip, or long-press menu). |

### HIGH

| ID | Issue | File | Impact |
|---|---|---|---|
| **H-1** | Spawn picker not keyboard-accessible | `SpawnPicker.tsx` | No arrow-key navigation between spawn dots. Blocks keyboard-only users. |
| **H-2** | Boot validator has 6+ gap areas | `loadDust2.ts` | Duplicate IDs, side mismatches, bounds checks, playerCount validation — all missing. Manual JSON editing is the only authoring path, making these live traps. |
| **H-3** | `SELECT_LINEUP` from home creates orphan state | `reducer.ts` | Clicking a lineup from CT guide or Map tab doesn't set `activeScenarioId`, but BACK logic depends on it. Currently works (goes to home) but is fragile. |
| **H-4** | ErrorBoundary uses dark theme on cream page | `ErrorBoundary.tsx` | Visual jarring when error occurs. Decoupled from theme.ts intentionally but looks wrong. |
| **H-5** | No visual snapshots for Defaults and Instant Smokes tabs | `tests/e2e/` | Layout regressions on these tabs would slip past the test suite. |
| **H-6** | `prefers-reduced-motion` not respected | All components | Radar viewBox animation (400ms easeInOutCubic) plays regardless of user motion preference. |
| **H-7** | Script CLI duplicates parseSetposCommand logic | `scripts/new-lineup.mjs` | `parseSetposForCli` is a copy of `src/utils/parseSetposCommand.ts`. Divergence risk (scripts are ESM .mjs, src is TS — sharing requires build step or import map). |

### MEDIUM

| ID | Issue | File | Impact |
|---|---|---|---|
| **M-1** | Old `DECISIONS.md` coexists with `DECISIONS_LEDGER.md` | `docs/` | No deprecation marker on the older file. Future readers may follow stale ADRs. |
| **M-2** | `SELECT_TAB` doesn't push history state | `reducer.ts` | Browser back doesn't undo tab switches within home view. Minor UX friction. |
| **M-3** | No automated WCAG audit | CI pipeline | No axe-core, lighthouse, or similar in test suite. Accessibility issues found manually. |
| **M-4** | Google Fonts loaded from external CDN | `index.html` | Privacy implication (Google sees every page load). Could self-host or use `font-display: swap`. |
| **M-5** | `spawnRushes[].fromSpawnId` not validated | `loadDust2.ts` | Spawn rush references to spawn IDs are not checked at boot. Documented as W-12 in DECISIONS_LEDGER. |
| **M-6** | All lineups at `difficulty: "medium"` | `dust2.json` | No difficulty variety. Either all truly medium, or difficulty hasn't been calibrated. |
| **M-7** | All lineups missing `throw` screenshot slot | `dust2.json` | 10 of 10 lineups have position+aim+result but no throw screenshot. Consistent gap. |
| **M-8** | No E2E tests in CI | `ci.yml` | Playwright runs locally only. Visual regressions could ship if developer forgets to run. |

### LOW

| ID | Issue | File | Impact |
|---|---|---|---|
| **L-1** | `screenshots` field uses optional slots with no schema enforcement | `types.ts` | Any key could be misspelled (e.g., `posiiton`) without boot error. |
| **L-2** | Steam deep-link browser support varies | `steamDeepLink.ts` | `steam://` protocol doesn't work in all browsers/OS configs. No warning shown to user. |
| **L-3** | `airTimeSeconds` unpopulated on all lineups | `dust2.json` | Field exists in schema but never used. Either remove from type or populate. |
| **L-4** | `source` field unpopulated on all lineups | `dust2.json` | Attribution field exists but never filled. |
| **L-5** | `roleOrder` unpopulated on all scenarios | `dust2.json` | Optional field exists but not used. Role tabs render in array order. |
| **L-6** | PWA manifest minimal | `manifest.json` | Single icon (SVG), no categories, no screenshots. PWA installability limited. |

---

## 10. Documentation Inventory

The project maintains 14 documents in `docs/`. They follow a deliberate "three-hat" structure (R-7 in DECISIONS_LEDGER):

### Core Document Set

| Document | Lines | Hat | Purpose |
|---|---|---|---|
| `USER_REQUIREMENTS.md` | 268 | BA (Business Analyst) | What the owner asked for. 24 functional requirements, 7 anti-requirements, 12 open questions. Draft v2, marked for owner review. |
| `SOLUTION_DESIGN.md` | 400 | Architect | How it's structured. Product shape, entities, use cases, surface behaviors, data shape, testing layers, 20-point behavior contract. |
| `DECISIONS_LEDGER.md` | 314 | "Annoying Junior" | Everything not nailed down. 16 open questions (Q-1..Q-16), 14 resolved decisions (R-1..R-14), 13 worries (W-1..W-13), 10-point commit checklist. |
| `CLEAN_ROOM_BRIEF.md` | 605 | Portable rebuild | All three hats distilled for LLM rebuild. Product summary, entities, workflows, views, data shape, 7 architecture decisions with WHY, 10 pitfalls, 15-point verification checklist. |

### Analysis & Context Documents

| Document | Lines | Purpose |
|---|---|---|
| `FULL_PICTURE.md` | 996 | Deep synthesis: why the product exists, audience constraint, 12 hidden architectural rules, load-bearing gap analysis, Refrag context, iteration history, 10 editorial insights. Most comprehensive single document. |
| `FULL_PICTURE_v4.md` | 393 | Earlier iteration of synthesis. Superseded by FULL_PICTURE.md but not deprecated. |
| `AUDIT_2026_05_22.md` | 289 | Systematic bug sweep: 5 CRITICAL + 9 HIGH + 14 MEDIUM + 13 LOW findings. |
| `V6_AUDIT_FINDINGS.md` | ~100+ | 10-agent synthesis of v6 branch: 3 real bugs, 4 real gaps, 10 polish items. |
| `CS2_UTILITY_ECOSYSTEM_RESEARCH.md` | 1,239 | 15K-word ecosystem study: 12+ platforms, utility theory, per-map analysis, synthesis. |
| `CS2_UTILITY_ENCYCLOPEDIA.md` | 962 | Domain theory reference: utility mechanics, CS2 vs CS:GO, economy, roles, timing, anti-patterns. |
| `REFRAG_LINEUPS.md` | 302 | Refrag-specific lineup data for Dust 2, NADR commands, CS2 mechanical notes. |

### Operational Documents

| Document | Lines | Purpose |
|---|---|---|
| `USER_GUIDE.md` | 378 | Step-by-step walkthrough for end users. CLI usage, deployment, troubleshooting. |
| `DECISIONS.md` | 85 | 5 architecture decision records (old-style ADRs, superseded by DECISIONS_LEDGER). |

### Key Architectural Decisions (from DECISIONS_LEDGER)

| ID | Decision | Status |
|---|---|---|
| R-1 | React 18 + Vite + TypeScript strict | Locked |
| R-2 | Single JSON data file (no DB) | Locked (trigger: scenarios > 30 OR second author) |
| R-3 | GitHub Pages, not Proxmox | Locked (trigger: server-mediated features) |
| R-4 | No router library | Locked (trigger: URL sharing becomes needed) |
| R-5 | Co-located screenshots in public/ | Locked (trigger: > 200 files / 60-100 MB) |
| R-7 | Three-hat doc set is THE contract | Locked |
| R-11 | Four-tab fixed order | Locked |
| R-12 | Same-radius rule for spawn picker | Locked (generic architectural rule) |
| R-13 | Origin-first Map tab | Locked |
| R-14 | Same-radius rule for Map markers | Locked (5 E2E + 4 visual snapshots) |

### Anti-Requirements (explicit non-goals)

| ID | Rule |
|---|---|
| AR-1 | No AI-generated coordinates (violated by C-4) |
| AR-2 | No scraping external sites at runtime |
| AR-3 | No hand-tuned percentages |
| AR-4 | No invented data for multi-player executes |
| AR-5 | No backend/DB/auth |
| AR-6 | No admin UI in v6 |
| AR-7 | No backseat optimization / unnecessary features |

---

## 11. Critical Questions for the Owner

These questions surface from cross-referencing the codebase state against the ecosystem research, prior audits, and the DECISIONS_LEDGER open questions. They are ordered by impact.

### Content Priority

**Q1. Are populated scenarios the highest-priority work?**
All 5 scenarios have `actions: []`. The headline interaction ("let's do scenario 4") currently leads to an empty view. The architecture is complete and tested — one editorial session populating 2–3 scenarios with lineup references would unlock more product value than any engineering work. Candidate: Scenario 3 (Mid Control) could reference `xbox_smoke`; Scenario 4 (B Execute) could chain `xbox_smoke` → `b_window_smoke` → `b_tunnel_flash`.

**Q2. Should lineup count expand before scenarios are populated?**
10 lineups is thin (ecosystem leader yprac has 1,400+). But populating scenarios with existing lineups would validate the scenario architecture first. Which comes first — more lineups, or wiring existing ones into scenarios?

**Q3. Should this project expand beyond Dust 2?**
ADR-002 has a trigger clause ("scenarios > 30 OR second author"). The current version history shows consistent scope narrowing (v1 had 8 maps → v6 has 1). Is Dust 2-only the permanent scope, or is multi-map eventually desired?

### Feature Decisions

**Q4. Is FR-13 (flat list view of all lineups) still wanted?**
Documented as "NOT IMPLEMENTED" in USER_REQUIREMENTS. The Map tab partially fills this role (every lineup is accessible from there). Is a dedicated list view still needed? (DECISIONS_LEDGER Q-12)

**Q5. Should a T-side role guide mirror the CT position guide?**
The CT position guide shows "if you're A Anchor, learn these lineups." No T-side parallel exists. Refrag's 7-role taxonomy (IGL, AWPer, Star Rifler, Entry, Support, Anchor, Lurker) could inform this. Is it wanted?

**Q6. Is Refrag integration (deep-links to NADR practice) desired?**
The ecosystem research identifies Refrag as a natural partner (training layer) rather than competitor. A "Practice this in Refrag" link from each lineup card would be low-effort, high-value. Wanted?

### Bugs & Accessibility

**Q7. Are the 5 CRITICAL audit bugs blocking or known-acceptable?**
C-1 (empty scenarios) and C-2 (orphan lineups) are content gaps, not code bugs. C-3 (Map tab state leak), C-4 (CLI data invention), and C-5 (mobile touch targets) are code defects. Which need fixing before the next content push?

**Q8. Is mobile a primary target?**
C-5 documents that spawn dots are ~7×7px on mobile (WCAG requires 44×44px). The 2×2 walkthrough grid never collapses. Is mobile a real use case, or is this primarily used on desktop during game prep?

### Process & Workflow

**Q9. What's the screenshot capture workflow?**
All 10 lineups have 3/4 screenshot slots filled (throw slot consistently missing). Is this manual (take screenshot in CS2 → save to public/screenshots/) or should capture be automated? (DECISIONS_LEDGER Q-2)

**Q10. Is the instant smokes radius (1500 wu) correctly calibrated?**
The InstantSmokesTab uses a 1500 world-unit proximity heuristic to determine which lineups qualify as "from spawn." Does this match in-game intuition? (DECISIONS_LEDGER Q-13)

**Q11. Is the map cluster radius (150 wu) correctly calibrated?**
The Map tab clusters lineups within 150 world units into a single marker. Does this match what "same position" means in-game? (DECISIONS_LEDGER Q-14)

**Q12. Should the project have a CLAUDE.md?**
No CLAUDE.md file exists. The three-hat doc set (URD + SOLUTION_DESIGN + DECISIONS_LEDGER) plus CLEAN_ROOM_BRIEF serve a similar purpose for LLM context, but a CLAUDE.md would provide session-start conventions (preferred testing commands, commit conventions, anti-patterns to avoid). Worth adding?

---

*End of audit. This document covers every file, module, and configuration in the repository as of commit b6891f7. For ecosystem context, see `docs/CS2_UTILITY_ECOSYSTEM_RESEARCH.md`. For domain theory, see `docs/CS2_UTILITY_ENCYCLOPEDIA.md`. For architectural decisions, see `docs/DECISIONS_LEDGER.md`.*
