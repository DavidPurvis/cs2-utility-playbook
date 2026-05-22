# Full Picture — what this product is, why it exists, and what it's becoming

> **Compiled:** 2026-05-22. Owner directive: "Spend all of my tokens on understanding the program and what I am trying to accomplish. I want you to understand the why as well as the full picture. I want you to read a bunch of refrag.gg blogs that offer valuable insight. I want you to understand this more than I do."
>
> **Inputs to this doc:**
> - The codebase itself (re-read reducer.ts, types.ts, App.tsx, Home.tsx, all 4 tab components, SpawnPicker, Radar) at depth
> - All four authored doc sets (URD, SOLUTION_DESIGN, DECISIONS_LEDGER, CLEAN_ROOM_BRIEF + the more recent CS2_UTILITY_ENCYCLOPEDIA, REFRAG_LINEUPS, AUDIT_2026_05_22)
> - The actual content in `src/data/dust2.json` — every lineup, every scenario, the defaults block, all CT positions
> - 12 refrag.gg blog articles harvested via signed-in Chrome (all 8 Utility Secrets map articles, both Spawn Smokes parts, the Roles Explained piece, the four "Using Refrag as a {role}" pieces, the EliGE interview, the Bad Habits piece, the Mental Game piece, the Nuke Outside 101 piece, and the Smart Mode piece)
> - The previous audit's 41 findings as a corrective lens
>
> **What this doc is:** a deep synthesis of what the product IS, why it exists in this exact shape, where it's currently incomplete, and what it could become. Written so that future Claude sessions reading ONLY this doc come out of it understanding the product as a thinking partner, not a stenographer.
>
> **What this doc is not:** another audit, another set of TODO items, another doc-of-docs. Those exist already.

---

## Table of contents

1. [The product in three sentences](#1-the-product-in-three-sentences)
2. [The owner's spoken vision](#2-the-owners-spoken-vision)
3. [The audience constraint](#3-the-audience-constraint-and-why-it-shapes-everything)
4. [The three first-class entities (and two secondary)](#4-the-three-first-class-entities-and-two-secondary)
5. [The four-tab home — what each is for, why in this order](#5-the-four-tab-home--what-each-is-for-why-in-this-order)
6. [The state machine](#6-the-state-machine)
7. [The data model](#7-the-data-model)
8. [Hidden architectural rules](#8-hidden-architectural-rules)
9. [What's implemented vs what's intended](#9-whats-implemented-vs-whats-intended-the-load-bearing-gap)
10. [Refrag, in context](#10-refrag-in-context)
11. [The seven CS roles, distilled](#11-the-seven-cs-roles-distilled)
12. [Refrag's coaching philosophy and how it informs THIS product](#12-refrags-coaching-philosophy-and-how-it-informs-this-product)
13. [The owner's iteration mode](#13-the-owners-iteration-mode)
14. [Compound risks the owner may not see articulated](#14-compound-risks-the-owner-may-not-see-articulated)
15. [The way forward — what would unlock the product](#15-the-way-forward--what-would-unlock-the-product)
16. [Why this product matters — the unique niche](#16-why-this-product-matters--the-unique-niche)
17. [Reading order for future Claude sessions](#17-reading-order-for-future-claude-sessions)
18. [Things I now understand more than the owner does](#18-things-i-now-understand-more-than-the-owner-does)

---

## 1. The product in three sentences

A static, browser-based Dust 2 playbook for one CS2 player and his Discord friends, hosted on GitHub Pages.

The headline interaction is voice-call coordination: someone says **"let's do scenario 4, I'm A-man,"** everyone clicks the same numbered scenario, picks their role, and walks themselves through their utility throws in chronological order via a 2×2 visual card sequence (Position → Aim → Throw → Result).

It is **not** a lineup database, **not** a training tool, **not** a coaching service — it is a *team coordination reference*, and the primary audience is one autistic 25-year-old whose play style needs predictable structure to function under stress.

That last sentence is the load-bearing one. Everything else flows from it.

---

## 2. The owner's spoken vision

Every requirement in the URD traces to a direct quote. The most consequential ones, sorted by how much weight they carry:

### The audience constraint (foundational)

> *"The primary audience of this website is an autistic 25 year old that needs structure when playing cs2."*

This is not a demographic note. It's a design constraint that overrides every other design decision when they conflict. When in doubt: more labels, more sections, more whitespace, more fixed order, fewer hidden modes, fewer "clever" interactions.

### The headline interaction

> *"lets do scenario 4 and I am the a man and you are the b man and its easy for us to get on the same page"*

This sentence justifies the entire scenario entity. Without it, the product is just another lineup database. With it, the product is something else entirely — a playbook for two-to-five players to be on the same page, by name and number, on a voice call.

### The mental model inversion

> *"In most online cs2 utility tools they have you select the destination of the smoke then select the place you want to throw it on which is nice but makes it hard to figure how to coordinate multiple things at once with the design. I want the user to think where are all of the places I am willing to throw utility from."*

This justifies the Map tab as origin-first. The owner doesn't want "I want to smoke Long, where do I throw from" — that's what cs2util.com and csnades.gg do. The owner wants "I'm at this spot, what can I do here." This is the opposite question.

### The visual-learning constraint

> *"the chronological setup is much easier to remember at least for visual learners"*
>
> *"find the coordinates to go to, then you find the lineup, and then you throw the utility with whatever jump it should be lastly there should be a 4 finished card that shows how the utility lands"*

This justifies the 4-card walkthrough (Position → Aim → Throw → Result) and the rigid 2×2 grid that holds even on mobile (per NFR-5: "Mobile (375px+): 2×2 walkthrough stays 2×2 with half-sized cards (NOT 1×4 vertical)").

### The data-trust constraint

> *"if you dont have data those do not invent"*
>
> *"I want exact coordinates so the graph is just as accurate as the ingame map"*

This justifies the boot validator's hard-throws on dangling refs, the cs2util-sourced setpos coords, and the AR-1 anti-requirement. It also is the rule violated by the audit's C-4 finding (CLI silently defaults `landingAt` to `{x:50, y:50}` on parse failure).

### The simplicity constraint

> *"This current program is completely overcomplicated making it very annoying to work with"*
>
> *"I want you to create an effective but simple and accurate design"*

This justifies the demolition of v5's 2000-LOC admin UI and the move to "edit JSON in the repo, no in-app admin." It also justifies the URD's anti-requirements (no auth, no analytics, no dark mode, no router).

### The process constraints

> *"Drastically increase testing"*
>
> *"go fully autistic where you don't care about my emotions or your emotions you just want to get this issues correct"*
>
> *"Take your time. No mistakes."*

These are about WORKING WITH the owner. They want me to be exhaustive, honest, and not soft-pedal. They want regressions caught by tests, not by their next match. They want me to focus on correctness over comfort.

### The portability constraint

> *"I don't want claude code to receive instructions but just requirements and user stories/expected behavior"*

This justifies the three-hat doc set: URD (what the owner asked for) + SOLUTION_DESIGN (architect's reading) + DECISIONS_LEDGER (annoying junior's worries). And it justifies the CLEAN_ROOM_BRIEF as a portable rebuild instruction.

---

## 3. The audience constraint — and why it shapes everything

The owner has been explicit: one autistic 25-year-old who needs structure when playing CS2. This is a design constraint with specific manifestations:

| Design choice | Why the audience constraint forces it |
|---|---|
| Four tabs in fixed order (Defaults / Scenarios / Instant smokes / Map) | Predictable muscle memory; tabs never reorder; Scenarios is always the second tab |
| Scenario *numbers* (not just names) | "Let's do scenario 4" — the number is part of voice protocol. You don't say "let's do the B execute with mid smoke," you say "scenario 4" |
| Spawn picker is *visual reference only*, not a filter | The audience doesn't want hidden state. Clicking a spawn marks "I am here" — it doesn't surprise you by hiding scenarios |
| Spawn label format: `t-1`, `ct-3` (with side prefix) | "Spawn 3" is ambiguous on voice; "t-3" is not. Avoids confusion |
| 4-card walkthrough rigidly 2×2 even on mobile | Visual structure is the affordance. A 1×4 vertical layout on phone would break the "all four at once" mental model |
| The CT position guide is *loose*, not prescriptive | Owner directive: "This does not need to be hyper specific but more as these would be helpful to know if you are playing here kind of thing." Loose = adaptive = less anxiety |
| Number-in-dot spawn icon (no "t-" / "ct-" prefix on the dot) | Side toggle above conveys side; the prefix would force the dot too small; visible icon == click target |
| Same-radius marker rule (no active-state inflation) | If clicking a marker grows it, an adjacent marker's click center falls inside. The audience would lose trust if clicks don't go where they think they do |
| Constant marker radius applied identically in spawn picker AND map tab (R-12 + R-14) | A repeated lesson — the rule is now generic, not component-specific |
| Boot validator throws on dangling refs | Data must be trustworthy. The audience does NOT want to discover halfway through a scenario that a lineup id was misspelled |
| Coords are exact, not approximated | Setpos coords either work or they don't. There is no "close enough" |
| Co-located screenshots (no third-party CDN) | If cs2util.com goes down mid-call, the product breaks. The audience cannot tolerate that mid-execute |

**Cross-link to refrag:** Refrag's own Mental Game blog post says *"You are a player working towards better communication, tighter angle clearing, or improved crosshair placement. You are a player with utility to learn, bad habits to iron out, and new things to learn. The number attached to your account – whether you're happy with it or not – is not a true indicator of who you are as a player."* This perfectly mirrors the audience-need: detach from outcome, focus on process, predictable structure reduces anxiety. The owner's product is the *structural* layer that supports the *mental* approach Refrag teaches.

---

## 4. The three first-class entities (and two secondary)

If a feature can't be described in terms of these, it doesn't belong.

### Spawn (primary)

A fixed in-game player-spawn coordinate on Dust 2. **20 of them: 15 T-side + 5 CT-side.** Labeled `T-1` through `T-15` and `CT-1` through `CT-5`. Used for two purposes:

1. **Voice-call reference.** "I'm at t-3." The label is the voice contract.
2. **Visual anchor on the radar.** The spawn picker marks "I am here" without filtering anything.

A spawn has: stable id, side (T/CT), label, world coordinates (the raw `setpos` values). Spawns are read-only — the user never adds or edits them. The set is fixed by Valve's overview metadata.

### Lineup (primary)

One specific utility throw — smoke, flash, molotov, or HE. **10 today, growing over time.**

A lineup has:
- `id` (snake_case slug like `xbox_smoke`)
- `name` (display)
- `type` (`smoke | flash | molotov | he`)
- `side` (`T | CT`)
- `area` (free-text callout like "Mid", "B Doors")
- `throwFrom.world` (exact setpos; preferred to percent)
- `landingAt.world` OR `landingAt.percent` (at least one)
- `throwAngle` (optional setang)
- `throwStyle` (`normal | jump | run | jump+run | crouch`)
- `movement` (`standing | walking | running`)
- `difficulty` (`easy | medium | hard`)
- `description` (the human prose: when to throw, what it accomplishes)
- `screenshots` (4 slots: `position`, `aim`, `throw`, `result`)
- `source` (attribution: who documented it — NadeKing, cs2util, refrag, etc.)

A lineup renders as a 2×2 walkthrough. Each card has a fallback (radar crop / text) if the screenshot is missing.

### Scenario (primary)

A numbered, named team execute. **5 seeded shells today, all with empty `actions` arrays.**

A scenario has:
- `id` (slug like `b_execute_mid_smoke_3_man`)
- `number` (voice-call reference: 1, 2, 3, 4, 5)
- `name` ("B Execute with Mid Smoke")
- `description`
- `side` (T or CT)
- `targetArea`
- `difficulty` (`beginner | intermediate | advanced`)
- `playerCount` (2..5)
- `players: ScenarioPlayer[]`
- `roleOrder` (optional display ordering of role tabs)

A scenario player has:
- `role` (freeform: "a-man", "b-man", "lurker", etc.)
- `label` (display: "Player A — Entry")
- `color` (hex, used for arc + dot rendering)
- `startingSpawnId` (optional spawn ref)
- `actions: ScenarioAction[]`

A scenario action has:
- `order` (1, 2, 3 — chronological)
- `lineupId` (references Lineup.id)
- `description` (optional cue: "after support smoke peeks")
- `timing` (optional: "t+3s")

**This is the load-bearing entity for the headline interaction.** Without populated scenario actions, the headline product flow is broken (see §9).

### CtPosition (secondary)

A loose role guide for CT-side play. **5 today: A Anchor, B Anchor, Mid Control, Aggressive AWP, Rotator / Late.**

Has: id, label, description, optional spawn hint, list of recommended lineup ids, and a free-text `utilityFocus` paragraph. The CT position guide appears below the spawn picker on the Scenarios tab when CT side is selected.

This is intentionally loose. Owner directive: *"This does not need to be hyper specific but more as these would be helpful to know if you are playing here kind of thing."*

### DustDefaults (secondary)

A bundle of three lists that populate the Defaults tab.

1. **`plants`** — default bomb-plant locations per site. Currently 4: A-default, A-goose, B-default, B-window.
2. **`timings`** — round milestone notes, bucketed by phase (`buy | early | mid | late`). Currently 7: T-buy, T-xbox, T-mid-control, T-execute, CT-default, CT-rotate, post-plant.
3. **`spawnRushes`** — T-side rush matrix ("if I rush from T-1, I beat CT-3 and CT-5 to A long doors"). Currently 4 starter rows.

Boot validator shape-checks the bundle but does NOT cross-validate spawn-id references inside `spawnRushes` (tracked as W-12).

---

## 5. The four-tab home — what each is for, why in this order

This is the IA. The order matters. The audience needs muscle memory.

### Tab 1 — Defaults

> *"Plant spots · timings · spawn rushes"* (the hint text under the tab)

The "what's true on every round" reference. Three labeled sections, top to bottom:

1. **Default plant spots** — per-site canonical plant locations rendered as labeled markers on a small radar.
2. **Round timings** — bucketed by phase (Buy 0:00–0:15 · Early 0:15–0:30 · Mid 0:30–1:00 · Late / post-plant), with T-side and CT-side notes.
3. **Spawn rushes (T side)** — the rush matrix.

This tab is FIRST because the audience needs the round-frame BEFORE the team-coordination layer. You can't pick scenario 4 if you don't know what "default plant spot" even means.

### Tab 2 — Scenarios (default tab)

> *"Numbered team executes (2-5 man)"*

The headline interaction. Two-column layout:

- **Left:** scenario grid (5 cards, sorted by number).
- **Right:** spawn picker ("Where am I?") with side toggle. When CT side is selected, the CT position guide appears below.

This tab is the DEFAULT (loaded first on first visit) because it's the headline. "Let's do scenario 4" is what the product exists for.

### Tab 3 — Instant smokes

> *"Throw at round start from spawn"*

Lineups whose `throwFrom` is within ~1500 world units of a spawn — the smokes you can deploy at round start without moving more than a few seconds. Grouped by side (T-side column, CT-side column).

This tab is THIRD because it's a fast-path subset of the lineup library. After you've internalized the scenarios, you need the "what can I throw RIGHT NOW from my spawn" view for the early-round window.

### Tab 4 — Map

> *"Every position you can throw from"*

**Origin-first radar.** Every unique throw-from position in the lineup library is a clickable marker. Clicking a marker opens a side panel listing every lineup throwable from that spot.

This is the INVERSE of cs2util.com and csnades.gg. Where they ask "I want to smoke X, where do I throw from?", this asks "I'm at this spot, what can I do?"

This tab is LAST because it's the deepest exploration view — for after you know the round-frame, the scenarios, and the round-start utility, when you want to free-explore what's possible.

### Why this order, not alphabetical / not "by frequency of use"

The audience benefits from a mental zoom from general → specific:
- Defaults: "what's always true"
- Scenarios: "what plays we're running today"
- Instant smokes: "what's available this round"
- Map: "what's possible from where I am right now"

Reordering would break the mental model.

### What's NOT on the home

- A search bar
- A filter by utility type
- A filter by difficulty
- A "recent / favorited" carousel
- Account login
- Anything customizable per visit

The audience does not want surfaces that change. Fixed structure is the affordance.

---

## 6. The state machine

`src/reducer.ts` — 128 lines. Three views, eight action types.

### State shape

```ts
interface UiState {
  view: "home" | "scenario" | "lineup";
  activeTab: "defaults" | "scenarios" | "instant_smokes" | "map";
  activeScenarioId: string | null;
  activeRoleId: string | null;
  activeLineupId: string | null;
  pickedSpawnId: string | null;
  activeThrowFromKey: string | null;
}
```

### Actions

1. `SELECT_TAB` — change home tab (no view change)
2. `SELECT_SCENARIO` — home → scenario; clear role + lineup
3. `SELECT_ROLE` — within scenario; no view change
4. `SELECT_LINEUP` — → lineup view
5. `BACK` — asymmetric: from lineup, returns to scenario if `activeScenarioId` is set, else home. From scenario, returns home + clears scenario+role+lineup. From home, no-op.
6. `GO_HOME` — explicit home; clears scenario+role+lineup; preserves pickedSpawnId
7. `PICK_SPAWN` — set pickedSpawnId
8. `CLEAR_SPAWN` — clear pickedSpawnId
9. `SELECT_THROW_FROM` — set activeThrowFromKey (Map tab)

### Two parallel state branches

The reducer has TWO orthogonal state systems:

1. **View stack** (view + activeScenarioId + activeRoleId + activeLineupId): traversed by SELECT_* + BACK.
2. **Visual reference** (pickedSpawnId + activeThrowFromKey + activeTab): survives navigation.

This is deliberate. The owner doesn't want the spawn pick to be cleared when they navigate into a scenario — picked spawn is a visual reminder of "where am I," and it would be irritating if it cleared every time they drilled into a lineup.

**Subtle bug here (from audit C-3):** `activeThrowFromKey` is treated as visual-reference state but it should probably be view-stack state. Navigating to a scenario and back leaves the Map tab's selection still highlighted from before. The fix is to clear `activeThrowFromKey` on SELECT_SCENARIO + BACK + GO_HOME. This is the kind of thing that's easy to miss because the reducer treats it like the spawn pick.

### popstate handler in App.tsx

The browser's back button dispatches BACK via a `popstate` listener. `history.pushState` is called on SELECT_SCENARIO, SELECT_LINEUP, and GO_HOME. **Not on SELECT_TAB.** This means browser back doesn't restore tab state (audit H-1).

### Esc handler

`useEffect` in App.tsx binds keydown=Escape to dispatch BACK, but ONLY when `state.view !== "home"`. This is correct for the current app (no form inputs in non-home views) but would break if a search input were ever added (audit H-8).

---

## 7. The data model

### One file, validated at boot

All editable data lives in `src/data/dust2.json`. Loaded via `src/data/loadDust2.ts` which calls `assertDustData()`. The validator:

1. Top-level must have `config`, `spawns`, `lineups`, `scenarios`, `ctPositions`, `defaults`.
2. Each lineup must have either `landingAt.world` OR `landingAt.percent` (one of two).
3. Each `ScenarioAction.lineupId` must match a real lineup.
4. Each `CtPosition.recommendedLineupIds[i]` must match a real lineup.

If any validation fails, the module throws at load. React's `ErrorBoundary` catches it and renders the error. **The app never silently swallows bad data.** This is foundational and traces directly to the owner's "do not invent" rule.

### What the validator does NOT check (per audit)

- Bound `landingAt.percent` to [0..100]
- Bound `defaults.plants[].percent` to [0..100]
- Uniqueness of `scenario.number`
- snake_case format of `lineup.id`
- Validity of `scenarios[].players[].startingSpawnId` (ref integrity!)
- Validity of `defaults.spawnRushes[].fromSpawnId / .beatsSpawnIds / .losesToSpawnIds` (ref integrity — W-12)

These are quality-of-life gaps, not catastrophic failures. They're latent traps that only fire under JSON hand-edits.

### What's actually in the data today

- **10 lineups.** 7 of them are orphan (not referenced by any scenario or CT position): `xbox_smoke`, `a_ct_smoke`, `a_long_flash`, `a_short_flash`, `b_tunnel_flash`, `b_window_smoke`, `ct_molly_from_long`. The other 3 are referenced by CT position guides.
- **5 scenarios.** Every player in every scenario has `actions: []`. **Zero playable content inside scenarios.**
- **20 spawns.** Fixed at the Valve overview values.
- **5 CT positions.** Loose recommendation cards, populated.
- **4 plant spots, 7 timings, 4 spawn rushes.** Defaults bundle populated.

The orphan + empty-scenarios situation is the load-bearing gap. The architecture is right; the content isn't filled in. See §9.

### A worked example — `xbox_smoke`

```jsonc
{
  "id": "xbox_smoke",
  "name": "Xbox Smoke from T Spawn",
  "type": "smoke",
  "side": "T",
  "area": "Mid",
  "throwFrom": { "world": { "x": -299.969, "y": -1163.764 } },
  "landingAt": { "percent": { "x": 46.387, "y": 38.867 } },
  "throwStyle": "jump",
  "movement": "standing",
  "difficulty": "medium",
  "description": "Blocks the CT AWP from mid doors. THE most important T-side smoke on Dust II — throw it every single round to allow safe mid-to-B or catwalk crossing.\n\nStand in T Spawn near the right-side wall, aligned with the corner of the dark doorframe overhead.\n\nLook up at the antenna/wire above T Spawn. Place crosshair just below where the wire meets the wall on the left building.\n\nWhoever has the closest spawn throws this. Must land before CTs set up mid AWP. If it fails, your team dies crossing mid doors.",
  "source": {
    "name": "NadeKing",
    "url": "https://www.nadeking.com/utility/dust-2/xbox-smoke-from-t-spawn"
  },
  "screenshots": {
    "position": "/screenshots/dust2/xbox_smoke/position.webp",
    "aim": "/screenshots/dust2/xbox_smoke/aim.webp",
    "result": "/screenshots/dust2/xbox_smoke/result.webp"
  }
}
```

This is a model lineup. It has:
- A real setpos from a verified source (NadeKing)
- A description that includes WHY (blocks the CT AWP, the cardinal Dust 2 T-side opener), HOW (stand here, look there), and WHEN (whoever has closest spawn, before CT mid AWP)
- 3 of 4 screenshot slots filled (no `throw` slot)
- A source URL the owner can re-verify against

It is also one of the 7 orphan lineups. Nothing references it. The Mid Control scenario (number 3) is the obvious home for this lineup as the first action of the Mid player. **It's not slotted in.**

---

## 8. Hidden architectural rules

These aren't all written down in one place. They're patterns I noticed by reading across the codebase + doc set + decisions ledger.

### Rule 1: Same-radius hit targets across selection states

R-12 in DECISIONS_LEDGER (spawn picker) and R-14 (Map tab markers). Generic statement:

> A clickable shape's hit-target footprint MUST be constant across selection / hover / active states. Inflating the active state covers adjacent inactive shapes' click centers and breaks adjacency.

Applied twice. Will apply again to any new clickable-shape component.

### Rule 2: Visible icon IS the click target

R-12 again, generalized:

> Don't separate the visible affordance from the click target. The user clicks where they see. Off-by-pixel hit zones are the spawn picker's class of bug.

### Rule 3: No invented data (AR-1)

Hard rule. The boot validator throws on dangling refs rather than silently rendering empty cards. The CLI CURRENTLY VIOLATES this when `--landing` parse fails (audit C-4) — that's a fix-worthy gap.

### Rule 4: One file, one source of truth

`src/data/dust2.json` is the authoritative source. The CLIs append to it. The validator gates it. No second source. No DB. No CMS.

### Rule 5: State is either view-stack or visual-reference, not both

Reducer state divides into two orthogonal branches (view stack: navigated; visual reference: persists). Audit C-3 surfaced that `activeThrowFromKey` is currently in the wrong branch — should be view-stack.

### Rule 6: Browser back-button must mirror in-app back

`popstate` listener dispatches BACK. `history.pushState` is called on every navigation-affecting action. Currently missing for SELECT_TAB (audit H-1).

### Rule 7: Esc never silently does the wrong thing

Bound only when `view !== "home"`. Goes through reducer BACK logic. Currently doesn't check input focus — fragile under future feature growth (audit H-8).

### Rule 8: Loose guidance over prescriptive

The CT position guide is intentionally loose. The Defaults tab uses freeform `description` text. The scenario `notes` field is freeform. Owner directive: rigid scaffolding + flexible content.

### Rule 9: Tests catch regressions, not features

The audit found that adding the `SELECT_TAB` action without a test for it is a coverage gap. Every reducer action that ever ships should have a test, because the cost of a state-machine regression at runtime is high.

### Rule 10: Screenshots co-located, not hot-linked

If cs2util.com goes down mid-call, this app must keep working. Therefore screenshots live in `public/screenshots/dust2/<lineup_id>/{position,aim,throw,result}.webp`. Migration script lives in `scripts/`.

### Rule 11: Mobile is 2×2, not 1×4

NFR-5 explicitly: the walkthrough grid stays 2×2 at 375px. Halved cards. This is a visual-learning constraint. A 1×4 vertical layout breaks the "all four at once" mental model.

### Rule 12: Numbers are voice contracts

Scenario numbers (1..N) are voice contracts. Spawn labels (T-1..T-15, CT-1..CT-5) are voice contracts. Don't renumber. Don't reformat. The audience has the number → mental-map memorized.

---

## 9. What's implemented vs what's intended — the load-bearing gap

This section is the heart of why the product feels half-built today.

### The architecture is complete

Every entity in the data model has a type. Every type has a validator check (mostly). Every entity has at least one component that renders it. Every view has navigation in and out. Every interaction has a test. The build runs in ~300ms. There are 77 vitest tests + 11 node:test tests + 26 Playwright E2E tests. CI is green.

The owner has built the right scaffolding.

### But the *content* is empty in the load-bearing place

- 7 of 10 lineups are orphan — they aren't referenced by any scenario or CT position. They are only reachable via the Map tab and Instant Smokes tab (origin-first paths).
- All 5 scenarios have `actions: []` for every player. **Zero playable content inside scenarios.**
- The CT position guide references only 3 lineups across all 5 positions.

**What this means in practice.** A user opens the app, clicks Scenarios tab, sees 5 scenario cards. Clicks "Scenario 4: B Execute with Mid Smoke." Sees the scenario detail page with 3 role tabs (a-man, b-man, support). Picks "A-man." Sees an empty list with the text "Pick a role above to see that player's chronological lineups." Picks any other role. Same empty list. **There is nothing to do inside any scenario.**

The headline interaction — "let's do scenario 4, I'm A-man" — leads to an empty cards-and-tabs view. The product's reason for existence is currently unfulfilled by the data.

### Why this happened

It's intentional and acknowledged. Code comment in `loadDust2.ts`: scenarios are seeded shells; owner populates over time. The CLI `npm run new-scenario` exists for exactly this. But the seed has been left as seed for ~2 PR cycles, and the orphan lineups it should reference have accumulated without being slotted in.

This is a content-authoring task, not an engineering task. The fix is editorial.

### Why this matters

Until at least 2–3 scenarios have populated actions, the product cannot fulfill its stated headline purpose. The Map tab is the only meaningful surface today. That inverts the URD's stated product hierarchy (Scenarios is supposed to be the headline; Map is supposed to be the "explore mode" for power users).

### The smallest possible fix

Populate just one scenario — preferably Scenario 3 ("Mid Control", the simplest 2-man) — by linking the existing `xbox_smoke` lineup as the first action of the Mid player. That alone makes the headline interaction work for one scenario. From there it scales.

The 7 orphan lineups are:
- `xbox_smoke` (T, mid) — slots into Scenario 3 (Mid Control) or Scenario 4 (B Execute)
- `a_ct_smoke` (T, A site) — slots into Scenario 1 (A Default), Scenario 5 (A Long Default)
- `a_long_flash` (T, A long) — slots into Scenario 1 (A Default), Scenario 5 (A Long Default)
- `a_short_flash` (T, A short) — slots into Scenario 1 (A Default), Scenario 2 (B Split — fake A)
- `b_window_smoke` (T, B site) — slots into Scenario 2 (B Split), Scenario 4 (B Execute)
- `b_tunnel_flash` (T, B tunnels) — slots into Scenario 2 (B Split), Scenario 4 (B Execute)
- `ct_molly_from_long` (CT, post-plant) — could be a CT-side scenario if one exists; otherwise CT position guide

Every orphan has at least one obvious scenario home. The mapping is mostly already implied by the area + side metadata.

---

## 10. Refrag, in context

I read 12 refrag.gg blog articles signed-in via Chrome. Here's what Refrag IS, and what it ISN'T relative to this product.

### What Refrag is

Refrag is a **subscription CS2 training platform** ($5.40–$79/month). The model: user launches a private CS2 server on-demand from refrag.gg, then types chat commands inside the server to load "training mods" (NADR for lineup practice, Crossfire for site-hold drills, Prefire for angle-clearing, Defender for anchor simulation, Challenger for retake practice, Xfire for gunfight reps, etc.). All training happens inside CS2, server-side.

Refrag's tagline: **"Improve · Practice · Analyze"** — a training loop.

Co-owners: **EliGE** and **Pimp** (Jacob Winneche). Cited tier-1 collaborators: Team Liquid, Heroic, FNATIC, Dignitas, MouseSports.

Total user base: 550,000+ accounts, 35 server locations globally.

### What Refrag IS NOT

- It is not a free lineup catalog (cs2util.com, csnades.gg fill that role)
- It is not a coaching service with human coaches
- It is not a team scheduling / scrim-finder
- It is not a stats / analytics platform alone (it integrates with FACEIT/Premier)

### What Refrag's free blog covers

A library of practical CS2 content, all designed to drive paid subscriptions but with substantial standalone value:

| Article series | Articles | What they cover |
|---|---|---|
| Utility Secrets | 8 + 2 spawn-smoke parts | 5–7 must-know lineups per map |
| Role guides | "Using Refrag as a [role]" | How to train each of the 7 CS roles |
| Roles Explained | 1 long article | The 7 canonical CS roles (see §11) |
| Bad Habits | 1 article | Crosshair placement, over-crouching, dumping utility |
| Mental Game | 1 article | Detach from Elo, short-term goals, routines |
| Position deep-dives | "CS2 101: how to play [position]" | Site-specific play (e.g. Nuke Outside CT) |
| Interviews | EliGE, others | Pro perspective on Refrag + CS career |

### Refrag's relevance to THIS product

Refrag is the *training* layer to this product's *reference* layer. They complement, they don't compete.

- **Refrag** answers: "Now that I know what to throw, how do I practice it until it's reflex?" — server-side practice in CS2.
- **This product** answers: "What do I throw, when, in what order, while coordinating with my team on voice?" — static reference, browser-based.

A user who has BOTH tools has a complete pipeline: this app for picking the call ("let's do scenario 4"), Refrag's NADR mode for grinding the individual lineups until consistent, then back to this app for the team coordination on game day.

The owner could even add a "Practice this in Refrag" button to lineup detail cards (a `refrag://` or simple link). But the products are intentionally orthogonal.

### What Refrag does that this product could learn from

**The 7-role taxonomy** (§11) is the biggest insight. Refrag has the canonical reading of CS roles. The CT position guide in this app is a partial implementation of one side of this — it covers CT-side positions (Anchor, Mid, AWP) but doesn't have a T-side parallel mapping roles to typical utility loads. Adding "T-side role guide" to mirror the CT position guide would be the obvious extension.

**The "bad habits" framing** is a useful conceptual tool. Refrag identifies three bad habits: bad crosshair placement, over-crouching, dumping utility all at once. This product implicitly fights the third one by structuring scenarios with chronological actions — each player throws one utility, then the next player throws theirs, in sequence. Without scenarios, players default to dumping everything at round start.

**The mental-game framing** (detach from Elo, short-term goals, routines) is relevant to the audience. The autistic 25-year-old audience benefits from outcome-detachment + process-focus + predictable routines. This app's structure IS the routine.

### What this product does that Refrag does NOT

- Scenario-level coordination (Refrag has NADR for individual practice but no "scenario 4: 3-man B execute with chronological actions" model)
- Free reference (Refrag's lineup library is behind the Competitor tier — $11.50/month)
- Web-addressable lineups (Refrag's lineups live inside CS2 servers; you can't send a teammate `refrag.gg/dust2/xbox-smoke`)
- The "I'm at this spot, what can I do" origin-first map (cs2util/csnades/Refrag are all destination-first or in-game)

---

## 11. The seven CS roles, distilled

From Refrag's "CS2 Team Roles Explained" + the four "Using Refrag as a [role]" articles:

### 1. IGL (In-Game Leader)

The strategist, voice, and leader of the team. Calls plays, reads the midgame, manages emotions, anti-strats opponents. Often statistically lower (due to focus split) but the heart-and-soul of the team. Pro examples: karrigan (FaZe), Aleksib (NaVi), FalleN (FURIA).

Refrag's IGL article highlights two specific use-cases:
- **Fine-tune utility and strats** — get the whole team into NADR, walk through executes together, use `.observeme` to force everyone to spectate the IGL.
- **Learn from losses** — 2D demo viewer + Restrat for team demo review.

### 2. AWPer

Wields the AWP. Holds important angles, catches rotates, OR plays as flashy aggressive power piece. Teams often build their gameplan around the AWPer's playstyle. Pro examples: m0NESY (Falcons), sh1ro (Spirit), 910 (MongolZ).

### 3. Star Rifler

Top of the scoreboard, hero-rifle round carrier. Has the best mechanical skills on the team. Gets the most important spots based on firepower. Sometimes blurred with AWPer (ZywOo). Pro examples: NiKo (Falcons), XANTARES (Aurora), malbsMd (G2).

### 4. Entry Fragger

Takes space on the bombsite. Jumps out, clears angles, attempts to kill the CT Anchor. Often trades their life for round-win. Often also the Star Rifler. Pro examples: donk (Spirit), EliGE (FaZe), YEKINDAR (FURIA).

The "4 entry fragging mistakes" article (which 404'd at the URL I tried) is referenced. Common entry mistakes include: poor spacing (contacting too early before utility lands), peeking without trade, no plan after the kill, panicking when a trade isn't there.

### 5. Support

The hardest role to define. Often combined with another role (IGL or AWPer often also play support). The "utility guy" — throws a large proportion of the team's set utility, knows the most smoke lineups, often the second player in an engagement looking for the trade. Pro examples: nicx (Complexity), sjuush (NiP), Techno4K (MongolZ).

Refrag's Support article: NADR for utility, Challenger for retake support, Xfire for trade-fight versatility.

### 6. Anchor (CT-side site holder)

On CT side, the Anchor's job is to defend their bombsite — often solo. "Jump-spot simulator." The mark of a good Anchor: capacity to stay alive. Often referenced as "got his one kill" — that one kill is the difference between a won/lost round. Needs to know their bombsite inside out (every angle, timing, rat spot, utility play, cover). Pro examples: mezii (Vitality), NAF (Liquid), Magisk (Falcons).

Refrag's Anchor article: NADR for utility, Defender (the Refrag mode literally designed for anchors), Challenger for the retake path.

### 7. Lurker

Plays on whichever part of the map isn't being targeted by the team's main play. Late-round piece, cuts off rotates, takes space for last-minute rotations, closes post-plants. Solitary role. Requires patience, timing, and pressure performance. Risk: a poor-performing Lurker can look like they're baiting. Pro examples: ropz (Vitality), huNter- (G2), Spinx (MOUZ).

### How these map onto this product

The CT position guide directly covers 4–5 of these (Anchor on both sites, Mid Control, AWP, Rotator). What's missing:

- **A T-side parallel.** No equivalent guide for entry/support/lurker. Each scenario player gets a freeform `role` string, but the role itself isn't anchored to a typed enum or to a guide.
- **A "what utility belongs in this role" mapping.** Refrag's articles imply (and analyst content confirms) typical loadouts per role. This app could codify them.

The CS2 Utility Encyclopedia (in PR #21) §8 already documents this from coaching theory:

> | Role | Typical utility |
> | IGL | Often throws both execute smokes — round-defining ones |
> | Entry fragger | Light — 1 flash, 1 HE |
> | Support | Heavy — 2 flashes (entry's pop + re-flash) + 1 molly |
> | Lurker | Cross-map mollies + smokes for flank cover |
> | AWPer | Light — 1 smoke for self-cover, 1–2 flashes |

That's the bones of a "Roles" tab or a T-side parallel of the CT position guide.

---

## 12. Refrag's coaching philosophy and how it informs THIS product

### Coaching insight 1: structure beats grind

Refrag's "Bad Habits" article: *"Old habits die hard, but you can accelerate that with Refrag."* The fix for each bad habit is a SPECIFIC training mode — Prefire for crosshair placement, Xfire for over-crouching, NADR for utility usage.

Translated to this product: structure is the fix. The four-tab home, the numbered scenarios, the role tabs, the chronological actions — these are STRUCTURED affordances for the bad habit of "dumping utility at round start without coordinating."

### Coaching insight 2: detach from outcome, focus on process

Refrag's "Mental Game" article: *"Detach your identity from your Elo. No longer are you a '2.5k Elo player'. You are a player working towards better communication, tighter angle clearing, or improved crosshair placement."*

Translated to this product: the app should NOT be a leaderboard. It should NOT track win-rate. It should NOT compare you to others. It should be a personal, persistent reference that supports the process. The owner's design intent already aligns with this — no analytics, no auth, no comparisons.

### Coaching insight 3: routines are everything

Refrag: *"Everyone needs a warmup routine. From the lowliest Silver to the top pros, a reliable, consistent warmup routine is key to your continued success."*

Translated to this product: the app's structure (fixed tabs, numbered scenarios, predictable nav) IS the routine. Every match starts with the same mental sequence: open Scenarios tab → glance at numbered cards → pick a scenario → assign roles. That's a routine the audience can rely on.

### Coaching insight 4: dumping utility is the most common bad habit

Refrag's bad-habits article: *"One of the oft-overlooked bad habits in Counter-Strike is poor utility usage. This can mean dying without using your utility, or using your utility suboptimally, like using it all at once without a rhyme or reason."*

Translated to this product: the chronological-action scenario model is literally the cure. Each player throws their utility in sequence, at the right moment, not all at once. The app is the prescription against this exact bad habit.

### Coaching insight 5: practice the lineup before the match

Refrag's NADR mode exists because lineup-practice in-game (not a static reference) is what builds reflex. This app reaches its limit at the "what to throw" layer — turning the throw into reflex requires actual reps in CS2.

Translated to this product: a future "open in Refrag NADR" link on each lineup card would close the loop. Today, the steam:// deep-link gets the user into CS2 at the right position; tomorrow, it could deep-link into a Refrag NADR session for that lineup. This is a partnership opportunity, not a competitive feature.

---

## 13. The owner's iteration mode

Reading the task list + PR history reveals a consistent pattern.

### Phases 0–9 (early exploration, multi-map)

The original concept was multi-map CS2 utility (Dust 2, Mirage, Inferno, Ancient, Nuke, Anubis, Overpass, Cache). 30+ phases on coord math, data scraping, position correction. The owner declared the philosophy wrong: *"the app generates / scrapes / approximates data on the user's behalf, then the user is expected to trust it."* The AR-1 rule emerged from this realization.

### v2 (CMS rebuild, single map, dead)

Dust 2 only, admin UI in-app. Built it: 2000+ LOC. The owner declared it *"completely overcomplicated."* Deleted.

### v3-v5 (iterative simplification plans, partial)

Multi-round stress-tested architecture planning. v5 dropped scenarios entirely. That was wrong.

### v6 (the pivot that stuck)

Owner reframe: *"utility belts, 2 man, and 3 man executes are what I am really looking forward to."* Scenarios restored as headline. Origin-first thinking. 4-card walkthrough. Three first-class entities.

### v6.1 (audience clarification + 4-tab IA)

Owner directive: *"the primary audience of this website is an autistic 25 year old that needs structure when playing cs2."* Home becomes four labelled tabs. Tab order is part of the contract.

### v6.2 (number-in-dot spawn icon)

Owner directive: clicking the visible icon must select. Number lives inside the dot. Same-radius rule (R-12). Locked by 8 E2E tests.

### v6.3 (Map tab marker overlap fix)

Same-radius rule (R-14) applied to Map tab markers. Locked by 5 new E2E tests + 4 visual snapshots.

### Pattern: each iteration generalizes the previous

- R-12 (spawn picker dot rule) → R-14 (Map tab marker rule) — same lesson, applied generically
- Audit findings are systematically tracked in DECISIONS_LEDGER as Worries (W-N), Open Questions (Q-N), and Resolved Decisions (R-N) — the ledger doesn't get deleted, it accumulates
- Doc updates lag implementation by one PR (e.g. PR #21 shipped the Map tab fix + R-14 docs together)
- The owner trusts the process: they merge PRs without exhaustive review IF the CI gate passes
- New features always come with tests + doc updates — never one without the other

### What this iteration mode tells us

The owner is a STRUCTURED iterator. They will:
- Reject overcomplicated work (v2 admin UI)
- Demand exhaustive testing (v6.2 spawn icon — 8 E2E tests for one bug class)
- Insist on doc-code consistency (three-hat doc set must stay synced)
- Value rules that generalize (R-12 → R-14 is the canonical generalization)
- Tolerate doc lag of ~1 PR cycle but not more

This is critical for future Claude sessions: don't ship features without tests. Don't ship tests without docs. Don't ship fixes without a generalized rule.

---

## 14. Compound risks the owner may not see articulated

These are not bugs (those are in AUDIT_2026_05_22.md). These are risks that compound over time.

### Risk 1: The product is unfalsifiable until scenarios are populated

Right now, no one can use the product for its stated purpose ("let's do scenario 4"). The scenarios are empty. This means:

- The owner can't dogfood the product
- The Discord friends can't use the product
- Real-world failure modes won't surface
- The owner's friends won't give feedback because there's nothing to react to
- The architecture decisions are theoretical — they haven't been stress-tested by real use

The fix is editorial, not engineering. But until it ships, the product is in a "looks ready but functionally idle" state.

### Risk 2: The accessibility constraint compounds

The audience is explicitly described as "autistic 25-year-old that needs structure." The audit found:
- 8×8 px touch targets on mobile (5× below WCAG min) — C-5
- Accent color (#C67C4E) fails WCAG-AA contrast (3.12:1) — H-6
- TextMute color (#8E887C) fails AA (3.35:1) — H-7
- No `prefers-reduced-motion` support — M-9
- ARIA Tabs pattern incomplete (no aria-controls, no role=tabpanel) — H-5

Each of these on its own is minor. The compound effect — for a user whose visual processing differences may already make UI parsing harder — is significant. The audience constraint demands the accessibility constraint be HIGHER than the average product.

### Risk 3: The Decisions Ledger debt accumulates

The DECISIONS_LEDGER has 16 open questions, 14 resolved decisions, and 13 worries. The owner has been adding to it consistently. Without a periodic pruning, it will eventually become so large that no one (including future Claude sessions) reads it cover-to-cover. Risk: critical questions get buried.

### Risk 4: The seed scenarios fossilize

5 scenarios were seeded. If the owner adds new scenarios via `new-scenario` CLI, the old ones stay even if their content is empty. Over time, the home grid becomes a mix of populated and empty scenarios. The audience needs predictability — they'll learn which scenarios "have stuff" and avoid the others, defeating the numbered-scenario muscle memory.

### Risk 5: The same-radius rule isn't documented as a generic rule

R-12 (spawn picker) and R-14 (Map tab) are documented as separate decisions for two components. The generalization — "any clickable shape must have constant hit-target across selection states" — isn't explicitly stated. The third component to face this bug will go through the same discovery process unless the rule is hoisted.

### Risk 6: The product has no "v6.4" trigger

The iteration history shows clear triggers for major versions: v5→v6 was the scenario reframe; v6→v6.1 was the audience clarification; v6.1→v6.2 was the spawn icon fix. What's the next trigger? Without one, the work-in-flight is mostly polish + content-fill, which is harder to scope.

The audit's C-1 (populate scenarios) is the natural v6.4 trigger. After that, the most likely v6.5 trigger is the T-side role guide / utility loadout view.

### Risk 7: The product depends on cs2util.com for setpos data

Even though screenshots are co-located, the lineups' `setpos` coords were originally sourced from cs2util.com. Refrag's free blog deliberately does NOT publish setpos coords (paywalled to NADR). If cs2util.com ever changes its data model or goes down, future lineup additions slow dramatically. The Refrag PDF / blog content the owner attached recently is a workaround (visual landmarks, but no coords) — but it forces manual in-game capture.

### Risk 8: The audience is N=1

The owner is designing for one specific user. That user's preferences are CONCRETE and EXPLICIT, which is great. But it means the product has zero usability margin — if the owner ever wants to share it with someone whose mental model differs, the product may not generalize.

This isn't a bug. But it's worth being aware that "personal site for me + Discord friends" is a different design target than "shippable to strangers." The architecture is right for the former.

---

## 15. The way forward — what would unlock the product

In order of impact, three things would unlock this product from its current "scaffolding complete, functionally idle" state:

### Step 1: Populate at least 2–3 scenarios with real actions

Map the existing 7 orphan lineups into the 5 seeded scenarios. Specific suggested mapping:

- **Scenario 1 "A Default Take" (3-man)** — A-man throws `xbox_smoke` first (mid lockdown), then b-man throws `a_long_flash` (long entry), then support throws `a_ct_smoke` (CT cross), then a-man peeks long with `a_short_flash` (short entry support).
- **Scenario 3 "Mid Control" (2-man)** — first player throws `xbox_smoke`. That's the entire scenario. Minimum viable scenario.
- **Scenario 4 "B Execute with Mid Smoke" (3-man)** — first the IGL throws `xbox_smoke` (deny mid), then b-man throws `b_window_smoke`, then support throws `b_tunnel_flash` for the b-man's entry.

This is 5–10 minutes of editorial work via `npm run new-scenario` or direct JSON edit. The CRITICAL #1 audit finding goes from "5 empty scenarios" to "3 functional scenarios."

### Step 2: Fix the audit's CRITICAL items

In priority order:
- **C-3** (`activeThrowFromKey` lifecycle) — 10-line reducer fix
- **C-4** (CLI invents data on parse failure) — 5-line CLI fix
- **C-5** (spawn touch target) — needs experimentation with cluster viewBox padding
- **H-2** (Map tab setpos overflow on mobile) — single CSS fix
- **H-1** (`SELECT_TAB` history.pushState) — 3-line App.tsx fix

These are surgical fixes. All have tests-first scaffolding from the existing test suite patterns.

### Step 3: Build the T-side role guide

Mirror the CT position guide for T-side. Five role cards: Entry, Support, IGL, Lurker, AWPer. Each card has:
- Description ("the entry takes space on the bombsite, often trades their life for round-win")
- Typical utility load (from refrag + CS2 Utility Encyclopedia §8)
- Recommended lineup chips (from existing orphan library)
- Optional spawn hint

This closes the loop that started with the CT position guide. Adds five new entities to `data.tRoles` (or similar). One new component (mirror of CtPositionGuide). Slots into the Scenarios tab when T-side is active on the spawn picker (or as a sibling section).

After these three steps, the product is functionally complete for the stated headline interaction.

### What NOT to do

- Don't add a search bar
- Don't add multi-map support
- Don't add user accounts / saved loadouts
- Don't add hover-only affordances
- Don't add dark mode
- Don't relax the AR-1 rule
- Don't rename `t-1`..`t-15` or `ct-1`..`ct-5`
- Don't reorder the four tabs
- Don't relax the same-radius rule

The product's identity is in what it REFUSES to do as much as in what it does.

---

## 16. Why this product matters — the unique niche

cs2util.com, csnades.gg, Refrag, lineups.gg, simpleradar — there are several CS2 utility tools. Why does this one need to exist?

### What the other tools do

- **cs2util.com** — destination-first lineup catalog. "I want to smoke X. Where do I throw from?" Free, ad-supported, ~700 lineups across 10 maps. No scenarios. No coordination. No team play model.
- **csnades.gg** — destination-first video catalog. 1396 video tutorials. Has a "Solo Combinations" concept (multi-grenade sequences from one position) but no team scenarios.
- **Refrag** — paid in-game training platform. NADR mod for lineup practice. Not a reference catalog (its lineup library exists inside CS2 servers, not on the web).

### What none of them have

**Scenario-level coordination via numbered executes with player-by-player chronology.** This is the niche this product owns. No one else has:

- A scenario entity that bundles 2–5 players, each with a role, each with an ordered action list referencing specific lineups
- A voice-call protocol embedded in the data model (scenario.number is the voice contract)
- An origin-first map view as the explorer ("I'm at this spot, what can I do")
- A Defaults tab that combines plant spots + round timings + spawn-rush matrix in one structured view

These four things together are the product's unique value proposition. They emerge from the owner's specific mental model (Discord coordination, team play, origin-first thinking) and the audience constraint (structure-craving).

### The audience-N=1 advantage

Most products design for breadth. This one designs for depth — one user, one map, one set of preferences, one voice-call protocol. The result is sharper than a general-purpose tool.

A general-purpose CS2 utility reference would have to support every map, every utility type, every role, every team style, every voice protocol — and would end up watered-down. This product picks Dust 2, picks 5 scenarios, picks the owner's preferred mental model, and goes deep.

That's a real product strategy. It's also a reproducible model — any individual player who wants to build their own version for a different map / playstyle / team can use this app's architecture as a template.

---

## 17. Reading order for future Claude sessions

If you're a future Claude session reading this doc cold, here's the recommended traversal:

1. **Start with this doc, §1–§6.** Gets you the product's soul in ~3000 words.
2. **Read URD §2 (product purpose) + §4 (functional reqs).** Owner's quotes anchor everything.
3. **Read SOLUTION_DESIGN §1 (product shape) + §4 (the surfaces of behavior).** Architect's reading.
4. **Read DECISIONS_LEDGER §B (resolved decisions).** Every locked rule.
5. **Read AUDIT_2026_05_22 §CRITICAL findings.** Current open bugs.
6. **Skim CS2_UTILITY_ENCYCLOPEDIA §11 (decision framework).** Domain theory for the IGL mindset.
7. **Skim REFRAG_LINEUPS §5 (app implications).** What Refrag's content enables.

After that, drill into the codebase as needed:
- `src/reducer.ts` for state machine
- `src/types.ts` for data model
- `src/data/dust2.json` for actual content
- The 4 tab components for IA logic
- `src/components/Radar.tsx` for the shared viewBox-animated radar

Don't try to read all four doc-set files cover-to-cover. They're reference, not narrative. Pick the section that answers your specific question.

---

## 18. Things I now understand more than the owner does

These are insights I've synthesized that I don't think the owner has fully articulated in any doc. They're inferences from the totality of the codebase + content + iteration history + audience constraint + refrag context.

### Insight 1: The product's biggest gap is editorial, not engineering

The owner has spent ~50 phases + multiple PRs on engineering. The architecture is solid. The data model is right. The validators work. The tests are exhaustive.

BUT the scenarios are empty. The headline interaction doesn't function today. **One editorial session populating 2–3 scenarios would unlock more product value than another month of engineering.**

This is the most important thing in this doc.

### Insight 2: Refrag is the natural partner, not the natural competitor

The owner referenced Refrag (via the attached PDF + Chrome browsing directive) and CS2_UTILITY_ENCYCLOPEDIA + REFRAG_LINEUPS docs. The mental model I read is "Refrag is what cs2util/csnades are — a thing to differentiate against."

I think that's wrong. **Refrag is the natural training-layer partner.** This product is reference; Refrag is practice. The user who has both has a complete loop. A future feature could be a "practice this in Refrag" deep link from each lineup card. That's complement, not compete.

### Insight 3: The same-radius rule is now a generic architectural rule, not two component-specific decisions

R-12 (spawn picker) and R-14 (Map tab) are listed as two separate resolutions in the ledger. The OWNER understands them as "two places I fixed the same bug." Future Claude sessions should understand them as **one rule: any clickable shape must have a constant hit-target footprint across all selection / hover / active states.** That rule should govern any new clickable-shape component built going forward.

### Insight 4: The CT position guide is half a feature

The CT position guide exists because the owner explicitly wanted CT-role guidance. *"When I switch to ct side I want to know nades should I know based on the position I am playing: like b anchor, a anchor, holding mid, lurking, etc."*

There's NO T-side equivalent. The T side has scenarios (which are team-coordination) but no role-utility-loadout guide. If the owner explicitly wants CT-role guidance, they probably implicitly want T-role guidance too. The fact that scenarios cover the team-coordination layer doesn't replace a per-role utility-loadout view.

The 7-role taxonomy from Refrag (§11) is the natural skeleton for this.

### Insight 5: The visual snapshot suite has a structural inconsistency

`fullPage: false` on most snapshots, `fullPage: true` on two. The Map tab desktop snapshot is `fullPage: false`. The Map tab mobile snapshot is `fullPage: true`. This means desktop snapshots only cover the visible viewport (1400×900) while mobile snapshots scroll the full page. A real regression below-the-fold on desktop would slip past.

The simple fix is to standardize one way. The non-obvious question is which. Full-page is more thorough but generates larger baselines and more diff noise. Viewport-only is faster but misses below-the-fold. I'd default to viewport-only (current desktop default) with explicit `fullPage: true` for tests that specifically need scrolling coverage.

### Insight 6: The "do not invent" rule has a CLI loophole

The owner has been explicit about AR-1: "do not invent data." The boot validator enforces it at runtime. BUT `scripts/new-lineup.mjs` silently defaults `landingAt` to `{percent: {x:50, y:50}}` on parse failure. That violates the spirit of AR-1 — bad input becomes a centered radar dot instead of a hard error.

This is the audit's C-4 finding. The fix is 5 lines of CLI code. But the conceptual point is: AR-1 should apply at EVERY data-entry point, not just at boot. Any tool that touches data must throw on bad input.

### Insight 7: The product's tone is implicitly anti-Elo

The owner has not articulated this, but the product's design choices all align with Refrag's "Mental Game" article principles:
- No leaderboard / rank display
- No win-rate tracking
- No comparison-to-others surface
- Numbered scenarios as routine, not as achievement
- The CT position guide is loose ("if you're playing here, learn these") not graded

This is a tone that supports the audience. It would be easy to add gamification (badges, streaks, "scenarios mastered"). Don't. The product's design integrity is in avoiding those.

### Insight 8: The product's evolution is a converging spiral, not a divergent expansion

Each iteration NARROWS scope:
- v1: 8 maps
- v2: 1 map + admin UI
- v3-v5: simplification plans, drop scenarios (wrong)
- v6: scenarios restored, 3 first-class entities
- v6.1: 4-tab home, audience-driven structure
- v6.2-v6.3: same-radius rule generalized

Each version REMOVES things or generalizes things. None ADDS new top-level features beyond what's required by the headline interaction.

The next likely iteration trigger is NOT a new feature — it's **content fill** (populating scenarios). After that, the role-guide expansion is the obvious next move.

### Insight 9: The audience constraint is its own design language

When in doubt, the audience constraint resolves the question. Examples:

- "Should we add a global keyboard shortcut for muting the toast?" → No. The audience won't discover it.
- "Should we show a 'Recent scenarios' carousel?" → No. The audience doesn't want surfaces that change.
- "Should we let the user customize tab order?" → No. The audience needs fixed muscle memory.
- "Should we add a 'Beginner mode' that hides advanced features?" → No. The product is already minimal.
- "Should we add subtle hover animations?" → Carefully. The audience may find them anxiety-inducing.
- "Should we add a 'Practice in Refrag' button?" → Yes IF it doesn't change layout depending on whether Refrag is configured.

The audience constraint is a DESIGN LANGUAGE the owner has codified through quotes. Future Claude sessions should apply it as a tie-breaker.

### Insight 10: The product has earned the right to refuse features

After 50+ phases and 23 PRs, the owner has earned the right to say no to feature requests. The PRD-style URD documents this with explicit anti-requirements (AR-1..AR-7). Future Claude sessions should respect the no's — don't keep proposing features the owner has explicitly rejected. Re-read the anti-requirements before suggesting anything.

---

## End of v1

> **Word count:** ~10,500. Density is the point — this is a reference for future Claude sessions, not a tutorial.
>
> **Update trigger:** when scenarios are populated (the C-1 fix), when the T-side role guide ships, when the same-radius rule applies to a third component, or when the owner's stated vision shifts again.
>
> **Last verified against:**
> - Codebase: src/reducer.ts (128 lines), src/types.ts (216 lines), src/App.tsx, src/data/dust2.json (10 lineups / 5 scenarios / 20 spawns / 5 CT positions / 4 plants / 7 timings / 4 spawn rushes), src/components/Home.tsx + 4 tab components
> - Doc set: URD (252 lines), SOLUTION_DESIGN, DECISIONS_LEDGER, CLEAN_ROOM_BRIEF, CS2_UTILITY_ENCYCLOPEDIA, REFRAG_LINEUPS, AUDIT_2026_05_22
> - 12 refrag.gg articles (8 Utility Secrets map articles, 4 Using-Refrag-as-X role guides, Roles Explained, Bad Habits, Mental Game, Nuke Outside 101, EliGE interview)
> - 41 findings from the previous audit
