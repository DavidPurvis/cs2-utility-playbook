# Clean-Room Brief — Dust 2 Playbook

> **Intended reader:** another LLM (Claude Opus 4.7 with 1M context, or any future implementer). You have NEVER seen the source code of this project. You are reading this single document, the URD (`USER_REQUIREMENTS.md`), the SOLUTION_DESIGN.md, and the DECISIONS_LEDGER.md. From those four files alone you must be able to **rebuild this system from scratch and arrive at the same observable behavior** — without copying any of the existing source.
>
> This is clean-room engineering, applied reflexively. If something in here can only be understood by reading source files I produced, it's a defect in this brief.

---

## Part 0 — Reading order

1. **§1 — The product in one paragraph.** Read this first; if it doesn't match your understanding, stop and re-read the URD.
2. **§2 — The three first-class entities.** The whole product is built from these. Internalize them before going further.
3. **§3 — The user's primary workflow.** What a real person does on a real call.
4. **§4 — The five views and their behaviors.** Everything observable.
5. **§5 — The data file and what's in it.** Where every behavior gets its values.
6. **§6 — The technology footprint.** What you'll need to set up.
7. **§7 — Architecture decisions and why each was made.** Locks the major forks.
8. **§8 — Testing — the regression net.** What gets exercised at every commit.
9. **§9 — The full historical context.** How we got here. (Skip if rebuilding; useful if maintaining.)
10. **§10 — Pitfalls and anti-patterns.** The bugs I hit and how to avoid them.
11. **§11 — Verification checklist.** The 15 behaviors the owner uses to confirm "yes, this is what I asked for."

---

## Part 1 — The product in one paragraph

> The Dust 2 Playbook is a personal, single-page web app for one CS2 player and his friends, hosted statically (no backend). The primary audience is **"an autistic 25-year-old that needs structure when playing cs2"** (owner's direct words) — every layout decision favors a labelled, sectioned, predictable structure over compactness or cleverness. Its purpose is to make team coordination on Discord trivially fast: someone says "let's do scenario 4, I'm A-man," everyone clicks Scenarios tab → scenario 4, picks their role, walks through their utility lineups in chronological order via a four-card visual sequence (where to stand → how to aim → how to throw → where it lands), and the team executes in sync. The home view is organized into four FIXED-ORDER tabs: Defaults (plant spots, round timings, spawn-rush matrix), Scenarios (team executes + spawn picker + CT position guide), Instant smokes (lineups throwable from spawn at round start), and Map (origin-first radar — click a throw-from position to see what's available from there). The Map tab is deliberately the INVERSE of cs2util.com / csnades.gg (which are destination-first). Lineups, scenarios, spawn positions, defaults, and a curated CT-side position guide all live as JSON data in the repo; the owner edits the JSON (directly or via two CLI helpers) and pushes; CI runs ~114 automated tests; GitHub Pages publishes the result within 60 seconds. The visual design is warm cream + burnt-orange accent (Claude's design language). The app deliberately omits multi-map support, authentication, real-time multiplayer, dark mode, analytics, and any in-app authoring UI.

---

## Part 2 — The three first-class entities

If a feature can't be described in terms of these, it doesn't belong. Internalize.

### 2.1 Spawn — a fixed in-game position

A Spawn is one of the **20 fixed player-spawn coordinates on Dust 2** (15 T-side, 5 CT-side). It exists for two reasons:

- **As a voice-call reference.** "I'm spawning at ct-3." The label MUST include the side prefix so there's no ambiguity. Labels are `t-1` through `t-15` and `ct-1` through `ct-5`.
- **As a visual anchor on the radar.** The owner picks a spawn dot on the home page to mark "I am here." This does NOT filter scenarios or lineups — it's a reference only.

A spawn has:
- A stable id (`dust2-t-s1`, `dust2-ct-s3`, etc.).
- A side: `T` or `CT`.
- A label: `T-1`, `T-2`, …, `CT-5`.
- A world position with `x`, `y`, optional `z` (the actual `setpos` values from CS2).

Spawns are read-only data; the user never adds or edits them. The set is fixed by Valve's overview metadata.

### 2.2 Lineup — a single utility throw

A Lineup is one specific utility throw (a smoke, flash, molotov, or HE). It has a position the player stands at, a screen-space alignment, a throw mechanic, and a landing location.

A Lineup has:
- `id` — a unique snake_case slug (e.g. `xbox_smoke`, `a_long_flash`).
- `name` — display name.
- `type` — one of `smoke`, `flash`, `molotov`, `he`.
- `side` — `T` or `CT`.
- `area` — free-text callout, e.g. "A", "B", "Mid".
- `throwFrom` — `{ world: { x, y, z? } }`. The exact `setpos` coordinate.
- `landingAt` — `{ world: { x, y, z? } }` OR `{ percent: { x, y } }`. At least one must be present.
- `throwAngle` (optional) — `{ pitch, yaw, roll }`. The `setang` values.
- `throwStyle` — `normal`, `jump`, `run`, `jump+run`, `crouch`.
- `movement` — `standing`, `walking`, `running`.
- `difficulty` — `easy`, `medium`, `hard`.
- `airTimeSeconds` (optional).
- `description` (optional, free-text).
- `screenshots` (optional) — `{ position?, aim?, throw?, result? }`. Each is a relative path under `public/screenshots/dust2/<lineup_id>/<slot>.webp`.
- `source` (optional) — `{ name, url }` crediting the source.

**Lineups don't exist independently in the user's mental model.** They're always reached via a scenario or via the CT position guide. The owner sees lineups as the atomic unit of "throw this smoke" knowledge.

### 2.3 Scenario — a coordinated team execute

A Scenario is a named, **numbered** team execute. The number is the headline identifier on voice ("let's do scenario 4").

A Scenario has:
- `id` — snake_case slug.
- `number` — a positive integer, unique across all scenarios.
- `name` — display name.
- `description` — 1–2 sentences for the home card.
- `side` — `T` or `CT`.
- `targetArea` — e.g. "A site", "B site", "Mid".
- `difficulty` — `beginner`, `intermediate`, `advanced`.
- `playerCount` — 2, 3, 4, or 5.
- `players` — an array of length === `playerCount`. Each player has:
  - `role` — a freeform string. The owner picks ("a-man", "b-man", "lurker", "anchor"…). NOT an enum.
  - `label` — display label, e.g. "Player A — Entry".
  - `color` — a hex string. Used for the player's arcs on the radar.
  - `startingSpawnId` (optional) — references a `Spawn.id`. Rendered as a player-color dot on the radar.
  - `actions` — chronological list of throws. Each action has `order` (1, 2, 3 in sequence), `lineupId` (references a Lineup), optional `description`, optional `timing` string (e.g. "t+5s").
- `roleOrder` (optional) — `string[]` of role names to enforce a stable left-to-right order on the role tabs.
- `notes` (optional).

**Empty scenarios are valid.** A seeded scenario shell with `actions: []` renders on the home grid and the scenario detail; the user populates actions over time. The role tabs always render; the empty state for the action list says "Pick a role above to see that player's chronological lineups."

### 2.4 CtPosition — a loose role guide for the CT side

A secondary entity for CT players to know what utility to learn when playing a given role.

A CtPosition has:
- `id` — slug.
- `label` — display name (e.g. "A Anchor").
- `description` — 1–2 sentences.
- `spawnHint` (optional) — where to spawn / walk.
- `recommendedLineupIds` — array of lineup references (may be empty).
- `utilityFocus` — free-text paragraph: "what to carry and when."

These are deliberately loose. Not a strict prescription. The owner said: *"This does not need to be hyper specific but more as these would be helpful to know if you are playing here kind of thing."*

### 2.5 Defaults — round-level references that don't depend on a scenario

A bundle of three lists that populate the Defaults tab. Edited freely in `dust2.json defaults`.

**PlantSpot** — a default bomb-plant location.
- `id`, `site` (`A` or `B`), `name`, `description`, `percent` (the radar coordinates).

**TimingNote** — a single round-timing milestone.
- `id`, `label`, `body`, optional `side` (`T` / `CT`), `phase` (`buy` | `early` | `mid` | `late`).

**SpawnRush** — one row of the T-spawn rush matrix.
- `id`, `fromSpawnId` (references a T-side Spawn), `contestPath` (free text, e.g. "mid doors"), `beatsSpawnIds: string[]`, optional `losesToSpawnIds: string[]`, optional `description`.

The boot loader does shape checking on `defaults` but does NOT cross-validate the spawn-id references inside `spawnRushes` — that gap is tracked as DECISIONS_LEDGER W-12.

---

## Part 3 — The user's primary workflow

Spell-out, step-by-step. This is the workflow that justifies the entire product:

### Scene: a Discord call, three players queuing matchmaking

1. **Caller:** "Let's do scenario 4. I'm A-man."
2. **Other players** open the live URL `https://davidpurvis.github.io/cs2-utility-playbook/` on a second monitor or their phone.
3. **They see the home page:** a 2-column grid of 5 scenario cards on the left, a spawn picker on the right. Each card has a circular number chip (1, 2, 3, 4, 5).
4. **Each player clicks the card labeled "4"** ("B Execute with Mid Smoke" by default seed).
5. **The scenario detail opens.** The radar on the left shows colored arcs for each player. The role tabs on the right read "Player A — Entry," "Player B — Support," "Lurker."
6. **Each player clicks their role tab.** When they click "Player A — Entry," only Player A's arcs stay bright on the radar; the others dim. The right column lists Player A's chronological actions: "1. Smoke mid doors (t+0s)," "2. Flash B tunnels (t+3s)," etc.
7. **The match starts.** Player A reads step 1. He clicks it → the 2×2 walkthrough opens:
   - **Card 1 — Position.** Shows a screenshot of where to stand in T spawn. Below: `setpos -299.969 -1163.764;setang -12.173 91.437 0`. Below that: a "Copy setpos" button.
   - **Card 2 — Aim.** Screenshot of the crosshair alignment.
   - **Card 3 — Throw.** Screenshot OR text fallback ("JUMP" + setang). A "Open in CS2" button with a `steam://rungameid/730/...` link.
   - **Card 4 — Result.** Screenshot of where the smoke lands.
8. **Player A** clicks "Copy setpos," pastes it into the CS2 console, walks to the spot, aligns the crosshair like Card 2, throws like Card 3.
9. **He presses Esc** — back to scenario detail. Clicks step 2. The walkthrough opens for the next action.
10. **Meanwhile**, Player B and Player C are doing the same thing from their own role tabs. Everyone is in sync.

### Secondary workflow: the owner adds a new lineup

1. Owner finds a new smoke on cs2util.com.
2. Opens terminal at the repo.
3. Runs: `npm run new-lineup -- --id b_double_flash --name "B Double Flash" --type flash --side T --area B --style normal --movement standing --difficulty medium --throw "setpos -1729 1064 64;setang -3 90 0"`
4. The CLI validates everything, appends an entry to `src/data/dust2.json`, prints the diff.
5. (Optional) Owner saves screenshots to `public/screenshots/dust2/b_double_flash/{position,aim,throw,result}.webp`.
6. `git add` → `git commit` → `git push`.
7. CI runs 99 tests + builds + deploys. Live in ~60 seconds.

### Tertiary workflow: the owner picks a CT role on a defense round

1. Owner is on CT side, second half. Opens the site, clicks `CT-side` toggle.
2. Below the CT spawn picker, the CT position guide appears.
3. Owner sees: "A Anchor," "B Anchor," "Mid Control," "Aggressive AWP," "Rotator / Late."
4. He picks "B Anchor" — reads the description ("Solo hold B site"), spawn hint ("Spawn near CT-2 or CT-4"), utility focus ("Smoke B tunnels at 0:10 left").
5. The card has a clickable chip: "B Tunnels Smoke from B Site." He clicks → 4-card walkthrough opens.
6. He copies the setpos, gets in position, throws on the round.

---

## Part 4 — The views

Every observable behavior in the app belongs to one of these surfaces. The home view is sectioned into **four labelled, fixed-order tabs**; the drill-down views (scenario detail, lineup walkthrough) sit on top of that. Spec-level, no code.

### View 4.1 — Header (always visible)

- Sticky at the top of every view.
- Left: breadcrumb trail. Always starts with "Dust 2 Playbook" (clickable; returns to home).
- After "Dust 2 Playbook," subsequent crumbs are scenario name (when in scenario or lineup view) and lineup name (when in lineup view).
- The current view's crumb is NOT clickable (it's where you are).
- Background matches the page cream; subtle 1px bottom border.

### View 4.2 — Home: the four-tab bar

- Always visible at the top of the home content area, below the page header.
- Four tabs in FIXED order: **Defaults · Scenarios · Instant smokes · Map**. The order is part of the contract — the audience needs muscle memory.
- Each tab has a primary label + a one-line hint sub-text (e.g. "plant spots · timings · spawn rushes" under Defaults).
- Default tab on first load: **Scenarios** (the headline coordination flow).
- Active tab visual: accent-orange bottom border + raised cream-panel background + `aria-selected="true"`.
- Tab clicks swap only the content area; the header, footer, and tab bar itself don't move.
- Reducer action: `SELECT_TAB`. The reducer's `activeTab` is `"defaults" | "scenarios" | "instant_smokes" | "map"`.

### View 4.3 — Home tab: Defaults

Three labelled sections, top to bottom:

1. **Default plant spots** (`<h2>Default plant spots</h2>`):
   - Two-column body. Left: a radar with one marker per plant (small dot + label "A" / "B" overlaid).
   - Right: per-site cards stacked vertically. Each card lists every plant at that site as a labelled sub-row (name + description).
2. **Round timings** (`<h2>Round timings</h2>`):
   - Four-column responsive grid. One column per phase (Buy 0:00–0:15 · Early 0:15–0:30 · Mid 0:30–1:00 · Late / post-plant).
   - Each column is a vertical list. Each item: optional T/CT chip, bold label, body paragraph.
   - Empty phases render nothing (no empty column).
3. **Spawn rushes (T side)** (`<h2>Spawn rushes (T side)</h2>`):
   - A 5-column table: From spawn · Contest path · You'll beat · You'll lose to · Notes.
   - Spawn chips (small pill, side-colored) for fromSpawnId / beats / loses-to references. Notes is plain text.

Empty-state panels for any section with zero data: cream-dashed panel with "No plants authored yet. Edit `src/data/dust2.json`." (etc.).

### View 4.4 — Home tab: Scenarios

This is what the v6 "home" used to be. Two-column responsive grid (stacks on ≤ 767px viewport).

- **Left column — Scenario grid:**
  - Title "Scenarios" with subtitle "5 curated · numbered for 'let's do scenario 4' coordination."
  - Cards sorted by scenario number ascending.
  - Each card: number chip (circular, accent-orange), side + area pill, player count meta in the top-right corner, name as `<h3>`, description (line-clamped to 3 lines), difficulty label.
  - Cards on hover: subtle border-color intensify, shadow lift.
  - Card is a `<button>`; clicking opens scenario detail.
  - Empty state (zero scenarios): cream-bordered dashed panel with CLI hint.

- **Right column — Spawn picker:**
  - Header "Where am I?" + subtitle "Pick your spawn for visual reference."
  - Side toggle: two pill-buttons `T-side` / `CT-side`. Selected button has filled background in the side's color.
  - Radar zoomed to the active side's spawn cluster (computed dynamically from the spawn positions + 7-unit padding).
  - **Spawn icon (FR-19, FR-20 — read carefully, the contract is precise):**
    - Single shape: a small filled circle (cream when unpicked, side-colored when picked) with a side-colored stroke ring and a black halo for legibility.
    - **The number lives INSIDE the dot** — e.g. "6", "15" — in mono with a black text-stroke (`paintOrder="stroke fill"`).
    - **No "t-" / "ct-" prefix on the icon.** The side toggle above conveys side; the prefix would force the dot too small.
    - **The dot IS the click target.** No oversized invisible hit zone. Clicking the visible icon selects; clicking off the dot does not.
    - **Picked and unpicked dots share the same radius** (0.95 viewBox units). Picked state is signalled by fill + text color only — never by inflating the dot. Earlier inflated-picked-dot covered the adjacent unpicked spawn's click center and broke the swap. Keep them equal.
  - Below the radar, a chip:
    - When no spawn picked: cream pill "Click a spawn dot to mark 'I am here' for visual reference."
    - When picked: side-colored pill **with the FULL label** ("Spawn: T-6") and a "clear" button on the right.
  - When CT side is active, **the CT position guide appears below** the chip.

### View 4.5 — CT position guide (sits inside Scenarios tab when CT side is picked)

- Title "CT positions" + subtitle "loose guide — 'if you're playing here, learn these'."
- 5 stacked cards by default. Each card:
  - Position label (e.g. "A Anchor") with an inline spawn hint in muted mono font.
  - Description paragraph.
  - "**Focus:** ..." paragraph with the utility-focus free text.
  - 0+ recommended-lineup chips. Each chip: a small colored dot (matching utility type) + lineup name. Clicking a chip opens the lineup walkthrough directly (no scenario context — BACK from the walkthrough returns home, not to scenario).
- Presence gated by side toggle, not by spawn pick.

### View 4.6 — Home tab: Instant smokes

- Lineups whose `throwFrom` is within ~1500 world units of a spawn (the smokes you can deploy at round start without moving more than a few seconds).
- Grouped by side (T section, then CT section).
- Each entry: lineup name, type pill (smoke / flash / etc.), area, throw style, and the spawn it's "instant from" (e.g. "Xbox Smoke from T Spawn — instant from T-6").
- Clicking an entry opens the 4-card walkthrough.
- Empty state: "No instant smokes recorded — every lineup currently requires more than a few seconds of movement from the nearest spawn."

### View 4.7 — Home tab: Map

- **Origin-first** radar view (FR-24) — INVERSE of cs2util.com / csnades.gg, which are destination-first.
- Renders the full radar with one marker per UNIQUE throw-from position across all lineups. Lineups within ~150 world units of each other share a single marker (cluster).
- Marker visual: small ring + colored dot (color = dominant utility type at that spot). If the cluster has > 1 lineup, a small count badge appears in the center.
- Right panel:
  - When no marker is active: a cream-dashed panel "{N} throw-from positions on the map. Click a marker to see lineups available there."
  - When a marker is active: a panel listing every lineup throwable from that spot. Each row is clickable → opens the 4-card walkthrough. Above the list: a monospace `setpos x y z` block for the throw-from coordinates (so the user can paste it into CS2 console).
- Re-clicking the active marker (or the "clear" button on the panel) deselects.

### View 4.8 — Scenario detail

- Header bar below the breadcrumb header: `← Back` button, "Scenario N" pill (accent-orange), scenario name as `<h2>`, meta string (side · target area · difficulty · N-man).
- Description paragraph below the header.
- Two-column body:
  - **Left** — radar (square, max-width 800px):
    - Renders the full Dust 2 radar (viewBox `0 0 100 100`).
    - For each player in the scenario: a `startingSpawnId` dot (player's color, larger ring + filled center) if the player has one.
    - For each action: an arc from the lineup's `throwFrom` to its `landingAt`, drawn as a dashed line in the player's color, with a small ring at the origin and a colored circle at the landing.
    - When a role is active, all OTHER roles' arcs dim to 18% opacity. The active role's arcs stay at 90% opacity.
  - **Right** — role tabs + action list:
    - Tabs along the top: one per player. Each tab has a colored dot prefix + the player's label.
    - Active tab: solid background in the player's color, white text.
    - Below the tabs:
      - If no role active: instructional empty state "Pick a role above to see that player's chronological lineups."
      - If active role has zero actions: "Player X has no actions yet. Add lineups via `npm run new-scenario` or edit `src/data/dust2.json` directly."
      - If active role has actions: ordered list of `StepRow`s, sorted by `order` ascending.
- **StepRow** layout: numbered badge in the player's color, lineup name, lineup type+throw-style+area meta, timing+description if present, chevron on the right. Whole row is clickable → opens lineup walkthrough.

### View 4.9 — Lineup walkthrough (the 2×2 grid)

- Header bar: `← Back`, lineup name, utility-type pill (color matches type), meta string (style · movement · difficulty · air-time).
- Below: a 2×2 grid (`grid-template-columns: 1fr 1fr`). **Locked at 2×2 even on 375px-wide mobile viewports** — cards just shrink. Never collapses to 1×4 vertical.
- Card 1 — **Position**:
  - Header pill "1. POSITION" in mono.
  - Image at `aspect-ratio: 16/9, object-fit: cover` OR fallback (a small radar centered on `throwFrom`).
  - Below the image: monospace `setpos x y z` (or `setpos x y;setang p y r` when an angle is present) in a subtle background pill.
  - Below that: "Copy setpos" button. Background `T.accentBg`, hover transitions to filled accent.
- Card 2 — **Aim**: image OR text fallback "No aim screenshot recorded yet — line up by description below."
- Card 3 — **Throw**:
  - Image OR text fallback rendering the throw style ("JUMP", "RUN", etc.) in large mono + the setang values.
  - "Open in CS2 (steam://)" link button that, when clicked, fires a `steam://rungameid/730//+map de_dust2+sv_cheats 1+setpos … +setang …` deep link.
  - "Copy setpos+setang" button.
- Card 4 — **Result**: image OR radar crop centered on `landingAt` + a small caption "lands at X%, Y% on radar."
- Below the 2×2 grid: the lineup's `description` paragraph (in a notes-style panel), then a source link if present.
- Clipboard copy uses `navigator.clipboard.writeText` with an `execCommand` fallback. Failure shows a red toast w/ the text shown selectable so the user can manually copy.

---

## Part 5 — The data file

There is exactly one JSON file that contains every editable piece of data: `src/data/dust2.json`. Its top-level shape:

```json
{
  "config": { ... },       // Valve overview constants for radar projection
  "spawns": [ ... ],       // §2.1, exactly 20 entries
  "lineups": [ ... ],      // §2.2, 10 today, grows over time
  "scenarios": [ ... ],    // §2.3, 5 seeded shells
  "ctPositions": [ ... ],  // §2.4, 5 seeded
  "defaults": {            // §2.5 — Defaults tab data
    "plants": [ ... ],     //   PlantSpot[]
    "timings": [ ... ],    //   TimingNote[]
    "spawnRushes": [ ... ] //   SpawnRush[]
  }
}
```

**Boot validation** runs at module load via a single function `assertDustData` which throws if:
- The top-level isn't an object with the four required arrays + config.
- Any lineup is missing both `landingAt.world` and `landingAt.percent`.
- Any scenario action's `lineupId` doesn't match any lineup in the lineups array.
- Any `CtPosition.recommendedLineupIds[i]` doesn't match a lineup id.
- `defaults` is shape-checked (must be `{ plants, timings, spawnRushes }` with each entry having required fields) but cross-validation of spawn-id references inside `spawnRushes` is NOT enforced — see DECISIONS_LEDGER W-12.
- Any CT position's `recommendedLineupIds` references a missing lineup.

Other invariants the validator does NOT (yet) enforce, but probably should over time:
- `scenario.playerCount === scenario.players.length`
- `player.startingSpawnId` references a real spawn (and matches the scenario's side)
- Scenario numbers are unique across all scenarios
- Lineup ids are unique
- IDs match the `^[a-z][a-z0-9_]*$` regex everywhere

(See DECISIONS_LEDGER.md for the discussion of which of these to add.)

### Config block

Valve's overview metadata for Dust 2. Four numbers determine the world↔percent projection used everywhere on the radar:

- `pos_x: -2476` — world X at the LEFT edge of the radar PNG
- `pos_y: 3239` — world Y at the TOP edge of the radar PNG
- `scale: 4.4` — world units per pixel × sourceResolution
- `sourceResolution: 1024` — radar image native side length

Formula:
```
percent.x = ((world.x - pos_x) / (scale * sourceResolution)) * 100
percent.y = 100 - ((world.y - pos_y) / (scale * sourceResolution)) * 100
```

The 100 - flip on Y is because world Y increases upward but percent Y increases downward (image coordinates).

This formula is the most-tested code in the project. If it breaks, every dot, every arc, every crop is wrong. 16 unit tests pin it against every spawn position on the map.

### Radar PNG

`public/maps/dust2/radar.png` — a 1024×1024 RGBA PNG of the Valve PSD-style minimap. Teal/grey geometric outlines, green spawn-area markers, orange site markers. Bundled into `dist/maps/dust2/radar.png` by Vite. The `radarImage` field in `config` is the relative path; the renderer prefixes `import.meta.env.BASE_URL` so it works both in dev (`/`) and on GitHub Pages (`/cs2-utility-playbook/`).

### Screenshots

`public/screenshots/dust2/<lineup_id>/{position,aim,throw,result}.webp` — co-located with the repo, not hot-linked. 30 webp files today (10 lineups × 3 slots — `throw` slot is empty for all v6 seed data). The walkthrough's `CardImage` resolves `src` via the same BASE_URL prefix.

---

## Part 6 — The technology footprint

**Stack:**
- React 18.3 + TypeScript strict mode.
- Vite 5.4 for build + dev server.
- Vitest 2.1 + Testing Library for unit/component tests.
- node:test for CLI tests (no vitest needed; uses Node's built-in).
- Playwright 1.60 for E2E + visual regression.

**No backend.** No DB. No auth. Static GitHub Pages hosting.

**No router library.** Navigation is state-driven via a `useReducer` with `popstate` listener for browser-back support.

**No CSS framework.** Inline `style={}` attributes on every component, plus a tiny CSS reset block in `index.html` for media queries (which inline-style can't do).

**No state management library.** `useReducer` in the root component owns ALL UI state.

**No icon library.** SVG glyphs inline or simple `div`s for tiny chips.

**Dependencies (`dependencies`):** `react`, `react-dom`. Two packages. That's it.

**Dev dependencies:** typescript, vite, vitest, jsdom, eslint, typescript-eslint, @testing-library/react, @testing-library/jest-dom, @playwright/test. Standard set.

**Scripts** (in `package.json`):
- `dev` — Vite dev server.
- `build` — tsc strict + vite build.
- `validate` — typecheck + lint + vitest + node:test + build (the pre-commit gate).
- `test`, `test:scripts`, `test:e2e`, `test:e2e:update` — test subsets.
- `new-lineup`, `new-scenario` — CLI helpers.
- `postbuild` — verify dist contents (radar PNG + screenshots present).

---

## Part 7 — Architecture decisions (with WHY each was made)

| Decision | Choice | Why |
|---|---|---|
| Framework | React 18 + Vite | Owner's muscle memory; test toolchain already worked. Tried alternatives in v3+v4 planning; net win was minimal. |
| Data shape | Single JSON file | Single author; per-file Markdown wins nothing. JSON validates with one function. |
| Hosting | GitHub Pages | Free, atomic deploy, zero ops. Owner asked about Proxmox; answer is "stay on Pages unless you need server-side features." |
| Routing | No router library; `useReducer` + `popstate` | Three views, no URL-share requirement. ~50 LOC vs adding a 2-10 KB dep. |
| Screenshots | Local in `public/screenshots/dust2/` | Cs2util CDN can break mid-call. Local files cost ~6 MB total but eliminate the failure mode. |
| Admin UI | None — JSON edit + CLI | Owner explicitly chose this after seeing the 2000-LOC admin UI in v5. |
| Spawn picker hit area | The visible dot only (no overlay) | Tried oversized transparent zones; they overlapped between adjacent spawns. Final design: dot enlarged + halo, no separate hit zone. |
| Spawn labels | Side prefix (`t-1`, `ct-3`) lowercase | Voice ambiguity. Single number could mean either side. |
| CT-side help | Inline position guide on home | Owner wants to know "what to learn when playing this role" without leaving the spawn picker. Lives below the picker when CT is active. |
| Walkthrough layout | 2×2 grid, stays 2×2 on mobile | Owner is a visual learner; wants all four cards in view simultaneously. |
| Visual regression | Playwright `toHaveScreenshot` | Captures the bugs that pass unit/component tests but break visually. |
| Test gate | `validate` chain runs on every push | Catches schema breaks, lint errors, type errors, behavior regressions before deploy. |

---

## Part 8 — Testing: the regression net

Every reported bug becomes a test that, had it existed, would have caught the bug. Current count: **114 tests across 6 layers.**

| Layer | Count | Time | Purpose |
|---|---|---|---|
| Pure utility unit | 49 | ~50ms | Coord math, setpos parsing, bounds, steam URL formatting |
| Data integrity unit | 5 | ~10ms | Boot validator: missing landingAt, dangling refs, malformed shape |
| Reducer | 11 | ~10ms | Every state transition + the BACK edge cases |
| Component (RTL) | 12 | ~80ms | Three user journeys: Home, ScenarioDetail, Walkthrough |
| CLI parity (node:test) | 11 | ~50ms | new-lineup + new-scenario flag parsing + setpos regex |
| **E2E (Playwright)** | **26** | **~9s** | **Spawn click (8 spawn-click-target + 5 spawn-hitbox), home tabs (6), radar load (4), visual snapshots (3)** |

`npm run validate` runs all except E2E (kept off the critical path for sub-second feedback). `npm run test:e2e` runs E2E against a Vite dev server it spins up automatically.

### How a new bug becomes a test

1. User reports a behavior that's wrong.
2. Identify which layer would catch it (often E2E for visual / interaction bugs).
3. Write the test that reproduces the bug. Confirm it FAILS against current main.
4. Implement the fix. Confirm the test PASSES.
5. Commit both fix + test in the same PR. The test now blocks the bug from ever returning.

---

## Part 9 — Full historical context (skip if rebuilding)

The project went through five major architectural pivots before reaching v6. Each was a learning. Listing them here so the next implementer (or future-you) doesn't repeat the wrong patterns.

### v1 — Multi-map AI-guessed data (DEAD)
Original concept: a CS2 utility reference for all Premier-pool maps (Dust 2, Mirage, Inferno, Ancient, Nuke, Anubis, Overpass, Cache). Lineup coordinates were AI-generated, then scraped from cs2util.com / refrag / csnades and hand-tuned. After five rounds of "the dots aren't in the right places," the owner declared the philosophy wrong: *"the app generates / scrapes / approximates data on the user's behalf, then the user is expected to trust it."* This whole approach was abandoned.

### v2 — CMS-driven rebuild on a single map (DEAD)
The user pivoted: Dust 2 only, all data in JSON files in the repo, admin UI for in-app editing, password-gated, no AI guesses, no scraping. Built it: 2000+ LOC of admin UI, layered localStorage data store, JSON export workflow. Worked technically but the user said: *"this current program is completely overcomplicated making it very annoying to work with."*

### v3, v4, v5 — Iterative simplification plans (DEAD as plans; partial v5 shipped)
Five rounds of stress-tested architecture planning. Each round added findings to a plan file (`velvet-moseying-cook.md`). v5 went so far as to **drop the multi-player scenario feature entirely**. That was wrong — the owner reframed in v6.

### v6 — Scenario-first playbook (CURRENT)
The pivot that stuck. Owner clarified:

> "utility belts, 2 man, and 3 man executes are what I am really looking forward to. In most online cs2 utility tools they have you select the destination of the smoke then select the place you want to throw it on which is nice but makes it hard to figure how to coordinate multiple things at once with the design. I want the user to think where are all of the places I am willing to throw utility from. I have also set it up where it should be easy to remember the throw in chronological order so you find the coordinates to go to, then you find the lineup, and then you throw the utility with whatever jump it should be lastly there should be a 4 finished card that shows how the utility lands. This is more of playbook than it is a utility guide."

That message defined the whole product:
- **Scenarios as headline** — restored from v5.
- **Origin-first thinking** — pick where you're throwing from, not what you're hitting.
- **4-card chronological walkthrough** — position → aim → throw → result.
- **It's a playbook, not an encyclopedia.**

The v6 plan went through five rounds of stress-testing (71 findings absorbed) before implementation. Implementation followed test-driven development; six atomic phase commits.

### Post-v6 corrections
- **Spawn dots too small / overlapping** → resized + 3-cluster layout.
- **Map labels ambiguous on voice** → side-prefixed labels (`t-1`, `ct-3`).
- **Dots blending into radar** → black halo + text stroke.
- **CT side needs role guidance** → added CT position guide.
- **Click hitbox off** → identified overlapping hit-zone bug; visible dot is now the only click target.
- **Map background "not loading"** → investigated; renders correctly locally. Possibly an owner expectation mismatch about radar style. Open question.

### v6.1 — Audience clarification + four-tab home (2026-05)

Owner clarified the primary audience: **"an autistic 25-year-old that needs structure when playing cs2."** This is a design constraint, not a demographic — every layout decision now favors a labelled, sectioned, predictable structure over compactness.

Restructured home into **four fixed-order tabs**:

1. **Defaults** — plant spots per site, round timings bucketed by phase, T-spawn rush matrix. New `defaults` data section + new types `PlantSpot` / `TimingNote` / `SpawnRush`.
2. **Scenarios** — the existing scenario grid + spawn picker + CT position guide moved into its own tab so it's not the only thing on home.
3. **Instant smokes** — lineups whose `throwFrom` is within ~1500 world units of a spawn (the smokes you can deploy at round start without moving).
4. **Map** — **origin-first** radar (FR-24). Click a throw-from marker to see lineups available from there. Inverse of cs2util.com / csnades.gg.

### v6.2 — Number-in-dot spawn icon (2026-05)

Owner reported: *"I can't select t-15 then select t-14 because the t-15 clickable area is above t-14 clickable. I want the number instead of the spawn icon without 'ct-' or 't-' prefix."*

Root cause: the label "t-15" was floating ABOVE the dot with `pointer-events: none`. Users clicked the visible label (inert) and missed the small dot below.

Fix:
- The number lives INSIDE the dot. The visible icon IS the click target.
- "t-" / "ct-" prefix dropped from the radar (the side toggle above the picker already disambiguates).
- Picked and unpicked dots share the same radius (0.95 viewBox units). Inflating the picked dot covers the adjacent unpicked spawn's click center and breaks the swap — discovered while iterating on this fix.

Locked by 8 E2E tests including the exact T-15 → T-14 regression and the CT-3 → CT-4 overlap-stealing case.

The history matters because:
1. If you see code that looks like multi-map support, it's dead leftovers.
2. If you see references to "the admin UI," that's v2 — deleted in v6 Phase 2.
3. If you see plans labeled v3/v4/v5, those are dead. v6 is the only one shipped.
4. If you see a single-page home with no tabs, that's pre-v6.1 — the four-tab structure is canonical.
5. If you see a spawn icon with the side prefix in its label, that's pre-v6.2 — the bare number inside the dot is canonical.

---

## Part 10 — Pitfalls and anti-patterns

The bugs I hit. Listed so you can skip past them.

### P-1 · SVG transparent fills don't catch clicks

SVG's default `pointer-events: visiblePainted` excludes transparent fills from hit-testing. If you add an invisible hit zone, you need `pointerEvents="all"` explicitly. **But the real fix is usually to not need an oversized hit zone at all** — see P-2.

### P-2 · Oversized hit zones overlap adjacent spawns

If two spawns are close together and each has a wide invisible hit zone, the zones overlap. SVG z-order then routes clicks to whichever spawn rendered LATER. User clicks CT-3, hits CT-4. The fix: make the visible dot the hit target. No invisible overlay.

### P-3 · React's onLoad on `<img>` (and SVG `<image>`) doesn't fire for cached images

If the browser has the image cached, the load event fires before React attaches the handler. A loading-state flag stays false forever; placeholder rect stays on top of the real image. **The fix:** check imperatively via `image.complete` in a `useLayoutEffect`, or default the loaded state based on a ref check on mount. (Currently not a problem because the radar isn't usually cached on first paint, but documented as a latent risk.)

### P-4 · Vite's `import.meta.env.BASE_URL` matters everywhere assets are referenced

The dev server serves at `http://localhost:5173/cs2-utility-playbook/`. Assets need their paths prefixed with that base. I forgot this for the walkthrough screenshots in `LineupDetail`; they showed alt-text placeholders on the live site for a few hours. **Fix:** every `<img src=...>` for a public/ asset runs through a `resolveAsset()` helper that prefixes BASE_URL.

### P-5 · `<button>` cannot contain `<button>`

HTML disallows it. React renders the nested button anyway but emits a hydration warning and accessibility tools get confused. **Fix:** use `<div role="button" tabindex={0}>` for the outer; reserve `<button>` for the leaf.

### P-6 · React.memo takes a comparator, not a key

Often miswritten. The right form is `memo(Component, (prev, next) => prev.x === next.x && ...)`. Parent callbacks must be memoized via `useCallback` for memo to help; otherwise the comparator always fails.

### P-7 · The boot validator must check ref integrity for EVERY entity that references another

If `Scenario.players[].actions[].lineupId` references a lineup that doesn't exist, the UI silently fails to render an arc. Same for `CtPosition.recommendedLineupIds[]`. The fix: every reference goes through `assertDustData`. Throw at load time, not render time.

### P-8 · Mobile 2×2 walkthrough wants to collapse to 1×4

If the CSS grid uses `repeat(auto-fill, minmax(...))`, narrow viewports stack the cells vertically. **Force 2×2 explicitly** via `grid-template-columns: 1fr 1fr` (no minmax). Cards shrink to fit; never collapse.

### P-9 · CI run on PR vs run on main

The workflow triggers on `pull_request` and on `push: main`. After a PR is merged, new commits to the feature branch don't trigger the `pull_request` event (the PR is closed). They also don't trigger `push: main` because the branch is a feature branch. **Result:** orphan commits get no CI. The fix: open a new PR for follow-up work or push to main directly (depending on protection rules).

### P-10 · Screenshot baselines drift across operating systems

Playwright pixel-diff snapshots taken on macOS may fail on Linux CI due to font rendering. **The fix:** generate baselines in the same environment that runs them (CI). Or use Playwright's `mask` feature to ignore text regions.

---

## Part 11 — Verification checklist

Run through this list to confirm a clean-room rebuild produces the same product:

| # | Behavior | Confirms |
|---|---|---|
| 1 | Home page loads at the deploy URL with 5 numbered scenario cards | Scenarios shape + sorting + grid rendering |
| 2 | The spawn picker on home shows a zoomed cluster of 15 T-side spawns | Cluster bounds math; spawn picker side toggle |
| 3 | Toggling to CT side shows 5 CT spawns AND a CT position guide below | Side toggle + position guide conditional |
| 4 | Each spawn dot has a black-haloed colored dot + a label "t-1" or "ct-1" above | Render details, paintOrder text stroke |
| 5 | Clicking a spawn dot updates the chip below; clicking CT-3 selects CT-3 specifically | No hit-zone overlap |
| 6 | Picked spawn persists when you navigate to scenario detail and back | Reducer parallel state |
| 7 | Clicking a scenario card opens a detail view with the full radar showing arcs | Scenario navigation; arc rendering |
| 8 | Role tabs across the top; clicking one dims other roles' arcs to 18% | Active role filter |
| 9 | Clicking an action row opens the 4-card walkthrough | SELECT_LINEUP transition |
| 10 | Walkthrough renders 2×2 cards: Position, Aim, Throw, Result. Missing screenshots render fallbacks. | Card layout + fallback matrix |
| 11 | Copy setpos button writes a valid `setpos x y z;setang p y r` to the clipboard | Clipboard wrapper |
| 12 | Esc / browser back navigates up one level | popstate + keydown handlers; smart BACK |
| 13 | `npm run new-lineup -- --help` prints flag list | CLI |
| 14 | `npm run new-scenario -- --help` prints + rejects unknown lineup ids | CLI ref check |
| 15 | All 99 tests green on `npm run validate` + `npm run test:e2e` | Regression net |

---

## Part 12 — How to consume this brief

If you are an LLM rebuilding this product:

1. **Read this brief first**, end to end.
2. **Then read USER_REQUIREMENTS.md** for the verbatim quotes that defined each requirement.
3. **Then read SOLUTION_DESIGN.md** for the architect-level shape.
4. **Then read DECISIONS_LEDGER.md** to know which decisions to ask the owner about vs which were already locked.
5. **Do not read the source code.** Rebuild from these four documents.
6. After rebuilding, validate against the verification checklist in §11.
7. If a behavior in your rebuild doesn't match the checklist, the deviation is a bug in YOUR rebuild — go back to the brief and find the requirement you missed.
8. If the checklist itself is unclear or contradictory, flag it. The brief is wrong, not your rebuild.

If you are the human owner reading this:

1. Confirm that §1 (the product in one paragraph) describes what you want.
2. Confirm that §3 (the user's primary workflow) is how you actually use it.
3. Audit §11 (the verification checklist) — every yes is a contract.
4. If anything is wrong, annotate the URD; the requirements rule everything.

---

> Last updated: 2026-05-21. ~99 tests green. Live deploy reflects PR #16 merged; PR #17 stacks the spawn label / CT guide / USER_GUIDE work atop; PR #18 (to be opened from this commit) adds the spawn-hitbox fix + E2E suite + the three-hat document set.
