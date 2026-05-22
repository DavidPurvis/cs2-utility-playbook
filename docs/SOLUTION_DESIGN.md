# Solution Design — Dust 2 Playbook

> **Hat:** Project Manager / Architect.
>
> **Audience:** the owner, reviewing whether the system being built matches what was asked for. **No code knowledge required.** If a sentence in here can only be understood by reading source files, it's wrong and needs amending.
>
> **Pair documents:**
>
> - **USER_REQUIREMENTS.md** (Business Analyst hat) — what the owner asked for. Source of truth for *intent*.
> - **THIS FILE** (Architect hat) — how the system is structured to satisfy those requirements. Source of truth for *shape*.
> - **DECISIONS_LEDGER.md** (Annoying-junior-dev hat) — every decision still open, every assumption that needs the owner's sign-off.
> - **CLEAN_ROOM_BRIEF.md** — the whole project condensed to one document a future implementer could rebuild from.

---

## 1. Product shape — what the user sees

The app is a single web page hosted at `https://davidpurvis.github.io/cs2-utility-playbook/`. The primary audience is **"an autistic 25-year-old that needs structure when playing cs2"** (owner's words) — so the home view is split into **four labelled, fixed-order tabs**, not one scrolling page. A user (the owner or a friend on his Discord call) loads the page in a browser and progressively drills into the playbook in **three views** (with the home view itself sectioned into four tabs):

```
┌──────────────────────────────────────────────────────────────┐
│  HOME — four tabs, fixed order                               │
│  ─────────────────────────                                   │
│  [Defaults] [Scenarios] [Instant smokes] [Map]               │
│   plants    grid +       lineups       origin-first          │
│   timings   spawn        throwable     radar — click         │
│   spawn-    picker +     from spawn    a throw-from          │
│   rush      CT guide     at round 1    to see lineups        │
│   matrix                                                     │
└──────────────────────────────────────────────────────────────┘
                            │
                            │  click a Scenario card
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  SCENARIO DETAIL                                             │
│  ───────────────                                             │
│  Left:  Radar showing all players' throw → land arcs         │
│         (color-coded by role)                                │
│  Right: Role tabs ("Player A — Entry", "Player B — Long" …)  │
│         + ordered action list for the active role            │
└──────────────────────────────────────────────────────────────┘
                            │
                            │  click an action row
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  LINEUP DETAIL — the 4-card 2×2 walkthrough                  │
│  ────────────                                                │
│  ┌───────────────┐ ┌───────────────┐                         │
│  │ 1. Position   │ │ 2. Aim        │                         │
│  │ where to stand│ │ crosshair pic │                         │
│  └───────────────┘ └───────────────┘                         │
│  ┌───────────────┐ ┌───────────────┐                         │
│  │ 3. Throw      │ │ 4. Result     │                         │
│  │ jump/run mech │ │ where it lands│                         │
│  └───────────────┘ └───────────────┘                         │
└──────────────────────────────────────────────────────────────┘
```

`Esc` and the browser back button always return one level up. Breadcrumbs at the top of every view jump to any earlier level.

There is **no admin UI**. New lineups + scenarios + CT positions are added by editing one file (`src/data/dust2.json`) and committing — either by hand or via two CLI helpers (`npm run new-lineup`, `npm run new-scenario`).

---

## 2. Three first-class entities

The whole product is built around three things. If a feature can't be described in terms of these three, it doesn't belong.

| Entity | Definition | Where it shows up |
|---|---|---|
| **Spawn** | A fixed in-game spawn position on Dust 2. 15 on T side, 5 on CT side. Labeled `t-1`..`t-15` / `ct-1`..`ct-5` for unambiguous voice calls. | Spawn picker (visual reference only); referenced by scenario players via `startingSpawnId` |
| **Lineup** | A single utility throw. Has a throw origin position, a landing position, optional screenshots for the 4-card walkthrough, optional throw angle. | Walkthrough view; referenced by scenario actions; surfaced from CT position guide chips |
| **Scenario** | A numbered, named team execute. Has 2–5 players, each with a freeform role label, a color, and an ordered list of actions. Each action references a Lineup. | Scenario grid; scenario detail |

The fourth thing (lower-tier): a **CT Position** is a curated guide entry for a CT role (anchor, mid, awper…). Has a description, spawn hint, free-text utility focus, and 0+ referenced Lineups. Not as load-bearing as the three above.

---

## 3. Use cases — what the user does

Two primary use cases. Everything else is supporting these.

### UC-1 · Run a coordinated execute on a Discord call

> "Let's do scenario 4, I'm A-man."

1. Two or more players load the home page.
2. Caller names a scenario by number ("scenario 4").
3. Each player clicks that card → scenario detail.
4. Each player picks their role tab ("I'm A-man" → click Player A — Entry).
5. The radar dims non-active-role arcs; the action list filters to that player's ordered lineups.
6. They click the first action → 4-card walkthrough opens.
7. Card 1 tells them where to stand (`setpos` shown + copy button).
8. Card 2 shows the aim screenshot.
9. Card 3 shows the throw mechanic.
10. Card 4 shows the result (where the utility lands).
11. They throw; press Esc; back to the scenario; click step 2; repeat.

### UC-2 · Add a new lineup or scenario

> "I found a new lineup on cs2util — let me add it."

1. Owner opens terminal at the repo.
2. Runs `npm run new-lineup -- --help` to see the flag list.
3. Pastes a setpos command from cs2util into the `--throw` flag with all the other required metadata.
4. The CLI validates every enum, rejects duplicate ids, parses the setpos, appends a valid entry to `src/data/dust2.json`, prints a diff.
5. (Optional) Owner saves four screenshots under `public/screenshots/dust2/<lineup_id>/{position,aim,throw,result}.webp`.
6. `git diff` → `git add` → `git commit` → `git push`.
7. CI runs typecheck + lint + 76 vitest + 11 node:test + 12 Playwright E2E + vite build + deploy.
8. Live site reflects the new lineup within ~60 seconds.

---

## 4. The surfaces of behavior

Everything the user can observe is one of these. §4.1–4.6 are the four home tabs (the structured entry surfaces); §4.7–4.8 are the drill-down views once you click into something.

### 4.1 Home — tab bar (always visible)

- Four tabs in FIXED order: Defaults · Scenarios · Instant smokes · Map.
- Active tab visually distinct (accent-orange bottom border + raised panel background + `aria-selected="true"`).
- Default tab on first load is **Scenarios** (the headline interaction).
- Each tab has a short hint sub-text under its name, so the user knows what's inside without clicking ("plant spots · timings · spawn rushes" under Defaults, etc.).
- Tab clicks swap the content area; nothing else on the page changes.

### 4.2 Home — Defaults tab

Three labelled sections in order:

1. **Default plant spots** — radar on the left with site markers; on the right, per-site cards listing the canonical plant location + a short description (e.g. "A default — behind ramen for early defuse cover").
2. **Round timings** — four columns bucketed by phase (Buy 0:00–0:15 · Early 0:15–0:30 · Mid 0:30–1:00 · Late / post-plant). Each column is a vertical list of timing notes (side-tagged with T / CT chips where applicable).
3. **Spawn rushes (T side)** — a table: From spawn · Contest path · You'll beat · You'll lose to · Notes. Each row answers "if I rush from spawn X, who do I beat to point P." Loose, depends on what utility was thrown.

All three sections are seeded with starter data in `dust2.json defaults`; owner edits freely. Boot validator shape-checks but does NOT cross-validate spawn-id references inside spawn rushes (see DECISIONS_LEDGER W-12).

### 4.3 Home — Scenarios tab

- Scenario grid + spawn picker + CT position guide, two-column on desktop.
- **Scenario grid:** cards sorted by scenario number ascending (so "scenario 4" is always in slot 4 for muscle memory). Each card shows number chip, side+area pill, player count, name, brief description, difficulty. Cards are buttons; clicking opens the scenario detail.
- **Spawn picker:** always-visible side toggle `T-side` / `CT-side`. Radar zoomed onto the selected side's spawn cluster. Each spawn rendered as a small dot with the bare number INSIDE it (e.g. "6", "15" — no "t-" prefix; the side toggle conveys side). Dots have a black halo for legibility. Picked and unpicked dots share the same radius — picked state is signalled by fill + text color only. **The dot IS the click target** — clicking the visible icon selects, clicking off the dot does not. Below the radar, a chip displays the full picked spawn label (e.g. "T-6") with a "clear" button.
- **CT position guide** (only when CT side is selected): five seeded cards — A Anchor, B Anchor, Mid Control, Aggressive AWP, Rotator / Late. Each card has title + spawn hint, description, "Focus:" paragraph, 0+ clickable lineup chips. Clicking a chip opens the 4-card walkthrough for that lineup (using LineupDetail directly — no scenario context). The guide is loose, not hyper-specific.

### 4.4 Home — Instant smokes tab

- Lists lineups whose `throwFrom` is within ~1500 world units of a spawn — the smokes you can deploy at round start without moving more than a few seconds.
- Grouped by side. Each entry shows lineup name, type (smoke / flash / molotov / he), area, throw style, and the spawn it's "instant from."
- Clicking an entry opens the 4-card walkthrough.
- This is the "what can I throw RIGHT NOW from my spawn" view — complements the Map tab (origin-first) and the Scenarios tab (team coordination).

### 4.5 Home — Map tab

- **Origin-first** radar showing every unique `throwFrom` position across the lineup library. Inverse of cs2util.com / csnades.gg (which are destination-first).
- Markers cluster lineups within ~150 world units of each other into a single dot (with a count badge for multi-lineup clusters).
- Marker color reflects the dominant utility type at that spot (smoke / flash / molotov / he).
- Clicking a marker selects it (highlights accent-orange) and opens a side panel listing every lineup you can throw FROM that spot. Each lineup row is clickable → opens the 4-card walkthrough.
- The selected marker's `setpos` is displayed as monospaced code in the panel, so the user can paste it into CS2 console to land on that throw-from spot in-game.
- Re-clicking the active marker (or the "clear" button) deselects.

### 4.6 CT position guide

(See §4.3 — lives inside the Scenarios tab when CT side is picked on the spawn picker.)

### 4.7 Scenario detail

- Header: `← Back`, scenario number chip, name, side + area + difficulty + player-count meta.
- Description paragraph below the header.
- Two-column body:
  - **Left:** the full radar with every player's arcs (throw origin → landing) drawn, color-coded by role. Optional spawn dots for each player's `startingSpawnId`.
  - **Right:** role tabs (one per player); below them, the active player's chronological action list with step numbers and timing hints.
- Selecting a role tab dims all other roles' arcs on the radar to 18% opacity and filters the action list to that role.
- Clicking an action row opens that action's lineup walkthrough.
- Empty action list: "Pick a role above to see that player's chronological lineups."

### 4.8 Lineup walkthrough (2×2 grid)

- Header: `← Back`, lineup name, type / side / area chip, throw style + movement + difficulty meta.
- 2×2 grid of cards, top-left to bottom-right:
  - **Card 1 — Position.** Screenshot (if present) OR radar crop centered on `throwFrom`. Always shows the `setpos` text below. Always has a "Copy setpos" button.
  - **Card 2 — Aim.** Screenshot OR "no aim screenshot recorded yet" text fallback.
  - **Card 3 — Throw.** Screenshot OR text fallback (throw style + setang). Always has a `steam://rungameid/730//…` deep link to load CS2 with the lineup configured.
  - **Card 4 — Result.** Screenshot OR radar crop centered on `landingAt`. Always shows landing percent text.
- On mobile (375px), the grid stays 2×2 with halved card dimensions — never collapses to 1×4 vertical.
- Description paragraph and source link rendered below the grid if present in the data.

---

## 5. Navigation — the state machine

Three views, plus a parallel "picked spawn" state that survives navigation.

```
HOME ──SELECT_SCENARIO──▶ SCENARIO ──SELECT_LINEUP──▶ LINEUP
  ▲                          │                          │
  │                          │ SELECT_ROLE              │
  │                          │  (no view change)        │
  │                          ▼                          │
  │                       SCENARIO                      │
  │                          │                          │
  └──── BACK ◄───────────────┴──── BACK ─────────────── ┘
  ▲
  └──── SELECT_LINEUP from CT position guide ◄── LINEUP

State (one of two combinations):
  view + activeScenarioId + activeRoleId    (scenario mode)
  view + activeLineupId  ± activeScenarioId (lineup mode)

Independent of view: pickedSpawnId (visual reference).
```

**Back-button behavior is asymmetric and deliberate**:
- BACK from lineup → if `activeScenarioId` is set, go to scenario; otherwise go to home. (This rules out the "blank scenario view with no active scenario" failure mode.)
- BACK from scenario → home; clear scenario+role.
- BACK from home → no-op.
- Esc key → BACK (only when not on home — home has no modal to dismiss).
- Browser back button → BACK (via `popstate` listener).

`pickedSpawnId` survives every transition. Clearing it requires explicit action ("clear" button on the chip).

---

## 6. Data shape — what's in dust2.json

```yaml
config:                      # Valve overview constants for radar projection
  id, displayName, valveMapId, radarImage     # display + path
  pos_x, pos_y, scale, sourceResolution        # coord math

spawns: [
  { id, side, label, world }                   # 20 entries (15 T + 5 CT)
]

lineups: [
  {
    id, name, type, side, area,
    throwFrom: { world },
    landingAt: { world | percent },            # at least one of the two
    throwAngle?: { pitch, yaw, roll },
    throwStyle, movement, difficulty,
    airTimeSeconds?,
    description?,
    screenshots?: { position?, aim?, throw?, result? },
    source?: { name, url }
  }
]

scenarios: [
  {
    id, number, name, description,
    side, targetArea, difficulty,
    playerCount,                                  # 2..5
    roleOrder?: string[],
    players: [
      {
        role, label, color,
        startingSpawnId?,
        actions: [ { order, lineupId, timing?, description? } ]
      }
    ]
  }
]

ctPositions: [
  { id, label, description, spawnHint?,
    recommendedLineupIds: [],
    utilityFocus }                              # free text
]

defaults:                                       # Defaults tab data (FR-22)
  plants: [                                     # default plant spots
    { id, site, name, description, percent }   #   percent is %-space on radar
  ]
  timings: [                                    # round milestone notes
    { id, label, body, side?, phase }          #   phase: buy | early | mid | late
  ]
  spawnRushes: [                                # T-spawn rush matrix
    { id, fromSpawnId, contestPath,            #   "from T-6, contest mid"
      beatsSpawnIds: [], losesToSpawnIds?,
      description? }
  ]
```

**Validation rules enforced at boot** (see `src/data/loadDust2.ts`):
- Every lineup has at least one of `landingAt.world` or `landingAt.percent`.
- Every `ScenarioAction.lineupId` references a real lineup.
- Every `CtPosition.recommendedLineupIds[i]` references a real lineup.
- `defaults` shape-checked but spawn-id references inside `spawnRushes` are NOT cross-validated (gap, see DECISIONS_LEDGER W-12).
- Failure throws at module load → React's ErrorBoundary shows the error.

---

## 7. Testing — what catches regressions

| Layer | Where | What it asserts |
|---|---|---|
| Unit (vitest) | `src/utils/coordinates.test.ts` | 16 cases — world↔percent math for every landmark spawn |
| Unit (vitest) | `src/utils/parseSetposCommand.test.ts` | 6 cases — setpos/setang parsing edge cases |
| Unit (vitest) | `src/utils/bounds.test.ts` | 5 cases — cluster fitting + worldDistSq |
| Unit (vitest) | `src/utils/steamDeepLink.test.ts` | 4 cases — steam:// URL formatting |
| Unit (vitest) | `src/data/loadDust2.test.ts` | 5 cases — assertion function + ref integrity |
| Unit (vitest) | `src/reducer.test.ts` | 10 cases — state machine transitions, BACK edge cases |
| Component (vitest+RTL) | `src/components/__tests__/home.test.tsx` | 3 cases — scenario grid, click dispatch, spawn picker labels |
| Component (vitest+RTL) | `src/components/__tests__/scenarioDetail.test.tsx` | 4 cases — role tabs, action list, back |
| Component (vitest+RTL) | `src/components/__tests__/walkthrough.test.tsx` | 5 cases — all four cards render, fallbacks, copy, steam, back |
| CLI (node:test) | `scripts/new-lineup.test.mjs` | 6 cases — regex parity with parseSetposCommand |
| CLI (node:test) | `scripts/new-scenario.test.mjs` | 5 cases — player parsing, ref integrity |
| **E2E (Playwright)** | `tests/e2e/spawn-hitbox.spec.ts` | **5 cases — every spawn click selects THAT spawn, no overlap-stealing** |
| **E2E (Playwright)** | `tests/e2e/radar-loads.spec.ts` | **4 cases — radar visible, href correct, PNG fetches as a real PNG, no "Loading…" overlay stuck** |
| **E2E (Playwright)** | `tests/e2e/visual-snapshots.spec.ts` | **3 cases — pixel-diff baselines for home (T), home (CT), scenario detail** |

**Total: 76 vitest + 11 node:test + 12 Playwright = 99 automated tests.** Every reported bug becomes a new test.

Run commands:
- `npm run validate` → typecheck + lint + vitest + node:test + build (fast, runs on every commit)
- `npm run test:e2e` → Playwright suite (slower; runs on demand)
- `npm run test:e2e:update` → regenerate visual snapshot baselines after intentional UI changes

---

## 8. Visual design tokens

The palette is **Claude warm cream** — a deliberate move away from the v5 CS2-tactical dark theme.

| Token | Hex | Use |
|---|---|---|
| `T.bg` | `#FAF9F6` | Page background |
| `T.bgPanel` | `#FFFFFF` | Card surface |
| `T.bgSubtle` | `#F3F1EB` | Hover row background |
| `T.bgDeep` | `#EEEBE3` | Radar container |
| `T.textPri` | `#1F1B16` | Primary text (16:1 contrast) |
| `T.textSec` | `#5A544B` | Secondary text (7.5:1) |
| `T.textDim` | `#6F6A60` | Dim text — AA floor for body (5.1:1) |
| `T.accent` | `#C67C4E` | Claude burnt-orange — primary accent |
| `T.tSide` / `T.ctSide` | `#C67C4E` / `#5B7FA8` | T / CT side colors (desaturated for cream) |
| `T.utilSmoke` / `Flash` / `Molly` / `HE` | greys / golds / oranges / reds | Utility-type accents (all ≥4.5:1) |

Typography: **Inter** for UI, **JetBrains Mono** for setpos/labels.

Geometry: corner radius scale 6/10/14, generous 12–24px padding throughout. Shadows are subtle (alpha < 0.08).

---

## 9. The owner's expected behavior contract

This section is a checklist the owner can run through to validate the build matches expectations. Each item maps to a test or screenshot.

| # | Behavior | Test it | Owner verdict |
|---|---|---|---|
| 1 | Home page loads with 5 scenario cards numbered 1–5 | Visual snapshot `home-t-side.png` | __ |
| 2 | Clicking T-side toggle shows a zoomed T-spawn cluster; CT-side shows CT cluster | `radar-loads.spec.ts > CT-side picker` | __ |
| 3 | Each spawn icon shows the bare number INSIDE the dot ("6", "15") — no "t-" / "ct-" prefix; visible icon IS the click target | Visual snapshot + `spawn-click-target.spec.ts > rendered icon text is bare number` | __ |
| 4 | Clicking a spawn dot selects that EXACT spawn (chip updates). Switching from T-15 to T-14 (and CT-3 to CT-4) WORKS — no overlap-stealing. | `spawn-hitbox.spec.ts` × 5 + `spawn-click-target.spec.ts` × 8 incl. T-15→T-14 + CT-3→CT-4 regressions | __ |
| 5 | CT side reveals a position guide below the picker | Visual snapshot `home-ct-side.png` | __ |
| 6 | Clicking a scenario card opens the detail view with the radar showing arcs | `radar-loads.spec.ts > scenario` | __ |
| 7 | Selecting a role tab dims other roles' arcs and filters the action list | `scenarioDetail.test.tsx` | __ |
| 8 | Clicking an action opens the 2×2 walkthrough with all four card slots present | `walkthrough.test.tsx` | __ |
| 9 | Missing screenshots in any card slot render a fallback, never a broken image icon | `walkthrough.test.tsx > position-fallback` | __ |
| 10 | Copy-setpos button writes a valid setpos string to the clipboard | `walkthrough.test.tsx > copy` | __ |
| 11 | Esc / browser-back navigate up one level | `reducer.test.ts > BACK` | __ |
| 12 | `npm run new-lineup -- --help` prints the flag list | `new-lineup.test.mjs` | __ |
| 13 | `npm run new-scenario -- --help` prints flags and rejects unknown lineup ids | `new-scenario.test.mjs` | __ |
| 14 | `npm run validate` is green | CI on every push | __ |
| 15 | The live site at `/cs2-utility-playbook/` reflects the latest main commit within ~60 seconds | Deploy workflow | __ |
| 16 | Home shows four tabs in fixed order: Defaults · Scenarios · Instant smokes · Map. Default tab is Scenarios. | `home-tabs.spec.ts` × 6 | __ |
| 17 | Defaults tab shows three labelled sections: plant spots (radar + cards), round timings (4-column phase grid), spawn rushes (table) | `home-tabs.spec.ts > clicking Defaults tab` | __ |
| 18 | Instant smokes tab lists lineups whose `throwFrom` is within ~1500 wu of a spawn, grouped by side | `home-tabs.spec.ts > clicking Instant smokes` | __ |
| 19 | Map tab is origin-first: clicking a throw-from marker reveals lineups available from that spot. Inverse of cs2util / csnades. | `home-tabs.spec.ts > clicking Map tab` | __ |
| 20 | Active tab visually distinct (accent-orange bottom border, `aria-selected="true"`) | `home-tabs.spec.ts > active tab has visible accent` | __ |

---

## 10. What does NOT exist (and isn't planned to)

| Anti-feature | Why not |
|---|---|
| Admin UI in the browser | Owner explicitly chose JSON-edit + CLI workflow |
| Multiple maps | Dust 2 only for v6; data layer can extend but no other map data ships |
| Authentication / auth | Personal site, public read-only |
| Real-time multiplayer (sync clock, shared session) | Out of scope; teams coordinate via Discord, not via the app |
| Dark mode | Cream only — single design language |
| Analytics / telemetry | Privacy + zero need |
| URL-shareable scenarios | No router lib; deep-linking not requested |
| In-app screenshot capture | Owner adds screenshots manually as files |
| Scenarios that span multiple maps | Single-map scope |

---

## 11. The intermediary contract — how this document is used

The owner reviews this document to verify the system MATCHES the requirements. They do NOT need to read source code. If something here is wrong:

1. Owner annotates the table cell (e.g., "behavior 7 is wrong — I wanted X")
2. Architect (me wearing this hat) updates the design + the URD + opens follow-up work
3. The new tests / code follow

If something here is unclear (jargon, missing detail), it's a defect in the document, not in the user. Flag it under §"Open questions" in `DECISIONS_LEDGER.md`.

---

> Last updated: 2026-05-21 · post-spawn-hitbox-fix · 99 tests green · v6 live + PR #17 stacking the latest spawn/CT-position/USER_GUIDE work.
