# Rebuild Plan: CS2 Utility Playbook

**Date:** 2026-05-22
**Author:** Claude Opus 4.6 (automated, full-context synthesis)
**Inputs:**
- `docs/CS2_UTILITY_ECOSYSTEM_RESEARCH.md` — 15K-word ecosystem study
- `docs/CODEBASE_AUDIT.md` — complete codebase audit
- `docs/PHILOSOPHY_MAP.md` — research-to-codebase bridge analysis

---

## Executive Summary

This plan rebuilds the Dust 2 Playbook through **incremental evolution**, not rewrite. The current codebase is ~4,700 lines of TypeScript with 123 tests (77 Vitest + 11 node:test + 35 Playwright), strict mode, and a CI pipeline that gates every PR. The architecture is sound. The problem is content: all 5 scenarios have empty actions, 7 of 10 lineups are orphans, difficulty ratings are uncalibrated, and tactical context — while present in lineup descriptions — lacks structural separation. Throwing away working code to rewrite it would waste months on engineering that already works while the product's actual deficit — populated scenarios and expanded content — goes unaddressed.

The rebuild has three phases:

**MVP (4-6 weeks):** Populate scenarios with real actions, write tactical descriptions for every lineup, calibrate difficulty ratings, fix the 5 CRITICAL bugs, add URL routing for sharing, and expand the lineup count from 10 to ~30. Zero architectural changes — this is almost entirely content authoring with targeted bug fixes. When MVP ships, "let's do scenario 4" actually works.

**v2 (6-10 weeks after MVP):** Teach the WHY. Add asymmetric utility pairing (T/CT lineups for the same area shown side-by-side), T-side role guide (mirrors existing CT guide), practice config export, solo/team lineup labels, content freshness tracking, and an onboarding flow. The data model gains 6 new fields; 2 new components are built; existing components get minor enhancements.

**v3 (ongoing):** Scale and polish. Expand to ~50+ lineups, add optional video embeds for movement-dependent throws, Refrag deep-links (if URLs become addressable), filtered Map tab views, and evaluate whether multi-map support is warranted based on how the populated single-map experience feels.

The single most important change: **populated scenarios that turn architecture into a working team playbook.** Every lineup already has tactical descriptions; the rebuild structurally separates WHY (via `tacticalPurpose`) from HOW (via `description`) and populates every scenario with real actions, descriptions, and timing. The app stops being an empty shell and starts delivering the team coordination value that no competitor offers.

**What we cut:** Nothing from the current app — everything that exists works. What we never add: destination-first browsing (our niche is origin-first), video content platform (screenshots serve reference better), multi-map as a near-term goal (depth beats breadth), community submissions (single author, trusted data), backend/auth/database (AR-5), analytics platform (Leetify/SCOPE.gg own this).

**Risk:** The highest-risk item is content quality. Every P0 priority requires domain expertise (CS2 Dust 2 utility knowledge) that cannot be automated. The rebuild plan front-loads content authoring so the owner validates the product's core value proposition before any significant engineering work begins.

---

## 1. Strategic Decisions

### 1.1 Full Rewrite or Incremental Rebuild?

**Decision: Incremental rebuild.**

The audit (CODEBASE_AUDIT.md §6) documents a codebase with zero TODO/FIXME markers, TypeScript strict mode with every strictness flag enabled, a single authoritative coordinate conversion module, and 123 tests across 3 frameworks. The CI pipeline gates every PR with typecheck + lint + test + build. There are exactly 2 production dependencies.

A rewrite would mean:

- Rebuilding the coordinate system (`coordinates.ts`, 131 lines, 34 tests, round-trip assertions) — already correct and tested.
- Rebuilding the boot validator (`loadDust2.ts`, 98 lines) — already catches dangling refs.
- Rebuilding the reducer (`reducer.ts`, 127 lines, 11 test cases covering all 9 actions and 3 BACK paths) — already correct.
- Rebuilding 35 Playwright E2E tests with visual snapshot baselines — already committed and passing.
- Rebuilding the same-radius architectural rule (R-12, R-14) — already enforced by E2E regression tests.

None of this needs rebuilding. The architecture handles everything the philosophy map says we need to do next. The gaps are:

1. Empty scenarios (content, not code)
2. Missing tactical descriptions (content, not code)
3. Uncalibrated difficulty ratings (data, not code)
4. 6 new fields on the Lineup type (5-minute schema change)
5. URL routing (one new dependency)
6. 2 new components (T-side role guide, asymmetric pairing view)

Every one of these is an additive change to a working system. A rewrite buys nothing and risks introducing regressions in proven code.

**What "incremental" means concretely:** We keep every file, every test, every CI workflow. We ADD new fields to `types.ts`, ADD new data to `dust2.json`, ADD new components to `src/components/`, and FIX the 5 documented CRITICAL bugs. The existing ~4,700 lines of source code remain intact except for targeted modifications.

### 1.2 Keep the Current Tech Stack or Change It?

**Decision: Keep the stack. Add one dependency: a client-side router.**

Current stack: React 18 + TypeScript 5 + Vite 5 + 2 production dependencies. The philosophy map (§3) identifies zero engineering limitations in the stack. Every P0 and P1 priority is content work or data-only changes. The stack is not limiting what we need to do.

**The one addition:** A lightweight client-side router. The current app uses `history.pushState` manually in `App.tsx` and dispatches `BACK` on `popstate`. This works for the 3-view stack but doesn't support URL sharing (e.g., linking a teammate directly to scenario 4 or a specific lineup). The DECISIONS_LEDGER documents URL sharing as ADR-004 trigger clause — the trigger is now met because populated scenarios need to be shareable with teammates.

**Router choice:** `wouter` (1.5KB gzipped, zero dependencies, hooks-based). Not React Router (45KB, over-engineered for a 3-view app). Wouter gives us `/scenario/4`, `/lineup/xbox_smoke`, and `/map` routes with hash-based fallback for GitHub Pages. The existing `useReducer` stays as the state owner — the router is a thin URL-to-dispatch layer, not a state replacement.

**What we don't change and why:**

| Current Choice | Why It Stays |
|---|---|
| React 18 | No features in React 19 that we need. Upgrade when the ecosystem stabilizes. |
| TypeScript strict | Already maximal strictness. No change needed. |
| Vite 5 | Fast, works, no issues. |
| No CSS framework | ~3,900 lines of production source code. A CSS framework would weigh more than the app. |
| No state library | `useReducer` handles 7 state fields and 9 actions. Adding Zustand or Redux for this would be over-engineering. |
| GitHub Pages | Free, sufficient, no server-side features needed. |
| No backend | AR-5 is load-bearing. Single JSON data file is correct for single-author, single-map, <100 entities. |

**Trigger for reconsidering:** If the app grows past 30 scenarios OR a second content author is added (R-2 trigger clause in DECISIONS_LEDGER), revisit the single-JSON approach. The replacement would be a flat-file CMS like Contentlayer or MDX, not a database — the app should remain statically deployable.

### 1.3 MVP Scope

**MVP ships when "let's do scenario 4" works end-to-end.** That means: populated scenarios with real actions, each action referencing a real lineup, each lineup having a tactical description explaining WHY it matters. The user opens the app, picks a scenario, sees the radar with colored arcs, clicks a role, sees their action list with timing cues, clicks a lineup, and gets the 2x2 walkthrough with tactical context.

**MVP includes:**

| Item | Type | Justification |
|---|---|---|
| Populate 3-5 scenarios with real actions | Content | P0 in priority matrix. Unlocks headline feature. See PHILOSOPHY_MAP.md §1.7. |
| Write `tacticalPurpose` for all lineups | Content | P0. Research Part 3 says WHY is half the learning. See PHILOSOPHY_MAP.md §2.2. |
| Calibrate difficulty ratings | Data | P1. All 10 lineups at "medium" is contradicted by research §4.4. |
| Expand lineup count to ~25-30 | Content | Research §5.5 recommends minimum 5 smokes + flashes + mollies per map. Current 10 is below minimum viable. |
| Fix C-3: Map tab state leak | Code | CRITICAL bug. `activeThrowFromKey` not cleared on navigation. |
| Fix C-4: CLI data invention | Code | CRITICAL bug. Violates AR-1 (no AI-generated coordinates). |
| Fix C-5: Mobile touch targets | Code | CRITICAL bug. WCAG violation. 7×7px vs. 44×44px minimum. |
| Add URL routing | Code | Enables scenario/lineup sharing with teammates. Required for voice protocol use case. |
| Fill `throw` screenshot slot | Content | 10/10 lineups missing the throw screenshot. Consistent gap. |
| Add `patchVersion` and `lastVerified` fields | Schema | Content freshness. CS2 patches break lineups (research §4.3). |

**MVP excludes (deferred to v2):**

| Item | Why Deferred |
|---|---|
| Asymmetric utility pairing | Requires content (T/CT descriptions) that doesn't exist yet. Build the content in MVP, build the pairing view in v2. |
| T-side role guide | Mirrors CT guide pattern but needs lineups organized by role first. MVP populates lineups; v2 organizes them. |
| Practice config export | Nice-to-have, not blocking core value. |
| Onboarding flow | MVP audience is the existing user who already knows the app. Onboarding is for when the app is shared more broadly. |
| Solo/team lineup labels | Useful but not blocking the core scenario-first flow. |

**v2 includes:** Asymmetric utility teaching (T/CT pairing view), T-side role guide, practice config export (full console command block), solo/team lineup labels, content freshness UI (badge showing last-verified date), onboarding "Start Here" flow, keyboard navigation for spawn picker (H-1), `prefers-reduced-motion` support (H-6), additional visual snapshot coverage.

**v3 ambitions:** Expand to 50+ lineups, optional video embeds for jump/run throws, Refrag deep-links (contingent on Refrag having addressable URLs), filtered Map tab (by utility type, by difficulty), evaluate multi-map based on how single-map feels populated, HE-into-smoke combinations as structured content.

### 1.4 What We Cut Entirely

Nothing is cut from the current app. Every existing feature — the 4-tab home, the scenario system, the 2x2 walkthrough, the spawn picker, the origin-first Map tab, the CT position guide, the Defaults tab, the boot validator — stays. The current codebase has already converged through 6 iterations of scope narrowing (v1 had 8 maps and an admin UI; v6 has 1 map and no admin UI). Everything that survived 6 rounds of pruning has earned its place.

**What we never build:**

| Anti-feature | Why Never |
|---|---|
| Destination-first browsing | Our differentiator is origin-first (PHILOSOPHY_MAP.md §1.6). Adding destination-first makes us a worse cs2util. |
| Video content platform | NadeKing (1.45M subscribers, 3,000+ videos) owns this. Screenshots serve our reference use case better. Optional `videoUrl` field for jump throws is the ceiling. |
| Multi-map (near-term) | The project's history is convergent: 8 maps → 1 map. Depth on Dust 2 beats shallow coverage of 9 maps. Evaluate after Dust 2 feels complete (~50+ lineups, all scenarios populated). [OWNER INPUT NEEDED: Is Dust 2-only the permanent scope?] |
| Community submissions | AR-7: single author, trusted data. Community content introduces quality variance that directly conflicts with the audience's need for trust and predictability. |
| Backend / database / auth | AR-5. Single JSON file is correct for <100 entities with one author. |
| Admin UI | Removed in v6 for good reason. CLI tools + JSON editing are sufficient and don't add code surface area. |
| Analytics platform | Leetify and SCOPE.gg own diagnostic analytics. We're reference, not diagnostic. |
| In-game overlay | Browser-based by design. Refrag is the practice layer. |
| Dark mode | Not requested, not needed. The warm cream palette is the design language. [OWNER INPUT NEEDED: Is dark mode desired?] |

### 1.5 The Single Most Important Change

**Every piece of content teaches WHY, not just WHERE.**

The current app has tactical context in lineup descriptions — the Xbox smoke description already explains it blocks the CT AWP and is the most important T-side smoke — but this content is mixed with positioning and aim instructions rather than structurally separated. The philosophy map (§2.2) documents the structural gap: tactical purpose is buried in multi-paragraph descriptions alongside mechanical how-to text.

The rebuild adds a dedicated `tacticalPurpose` field to every lineup, structurally separating the WHY from the HOW. The 2x2 walkthrough renders this above the cards as a distinct element. The scenario action descriptions explain how each throw fits into the team execute's logic. The result: a user who opens the walkthrough sees the tactical purpose at a glance — not buried in a wall of positioning instructions.

> **Note (from VERIFICATION_AND_STATE.md):** The existing `description` field already contains tactical context on all 10 lineups. A dedicated `tacticalPurpose` field structurally separates WHY from HOW but the content gap is smaller than originally assumed — this is a structural improvement, not a content gap.

This is the synthesis view from the research (Part 3): understand principle → learn lineup → drill → apply → adapt. The current app covers step 2. The rebuild covers steps 1-2 and sets up steps 3-5.

---

## 2. Architecture Plan

### 2.1 System Architecture

The system architecture does not change. The app remains a static single-page application with no backend.

```
Build time:
  dust2.json ──→ loadDust2.ts (validate + enrich) ──→ bundled into SPA
  screenshots/ ──→ Vite copies to dist/
  index.html ──→ Vite bundles with React app

Deploy time:
  dist/ ──→ GitHub Pages (static hosting)
  No server. No API calls. No database.

Runtime:
  Browser loads index.html
    → React mounts App component
    → loadDust2() validates dust2.json at boot (throws on bad data)
    → dustData (immutable) flows to all components as props
    → useReducer manages UI state (views, tabs, selections)
    → wouter router syncs URL ↔ state
    → User interactions → dispatch actions → re-render

  ┌──────────────────────────────────────────────────────┐
  │                    Browser                            │
  │                                                      │
  │  ┌─────────────────────────────────────────────────┐  │
  │  │ wouter Router (URL ↔ dispatch bridge)           │  │
  │  └────────────────────┬────────────────────────────┘  │
  │                       │                               │
  │  ┌────────────────────▼────────────────────────────┐  │
  │  │ App.tsx (state owner: useReducer)                │  │
  │  │   dustData: DustData (immutable, loaded at boot)│  │
  │  │   state: UiState (7 fields, 9 actions)          │  │
  │  └────────┬──────────┬──────────┬──────────────────┘  │
  │           │          │          │                      │
  │  ┌────────▼──┐ ┌─────▼────┐ ┌──▼───────────┐         │
  │  │  Home     │ │ Scenario │ │ Lineup       │         │
  │  │  (4 tabs) │ │ Detail   │ │ Detail       │         │
  │  │           │ │          │ │ (2x2 + WHY)  │         │
  │  │ Defaults  │ │ Radar +  │ │              │         │
  │  │ Scenarios │ │ Roles +  │ │ Tactical     │         │
  │  │ Instant   │ │ Actions  │ │ Purpose +    │         │
  │  │ Map       │ │          │ │ Walkthrough  │         │
  │  └───────────┘ └──────────┘ └──────────────┘         │
  │                                                      │
  │  Data flow: dustData ──→ components (read-only)      │
  │  State flow: dispatch(action) → reducer → re-render  │
  │  URL flow: route change → dispatch → state → render  │
  └──────────────────────────────────────────────────────┘
```

### 2.2 Data Model Redesign

The current schema (`src/types.ts`, 215 lines) is well-designed. The rebuild adds fields, not entities. One new entity (TPosition) mirrors the existing CtPosition.

#### Changes from current schema

**Lineup — 7 new fields:**

```typescript
export interface Lineup {
  // --- existing fields (unchanged) ---
  id: string;
  name: string;
  type: UtilityType;
  side: Side;
  area: string;
  throwFrom: { world: WorldPoint; label?: string };
  landingAt: { world?: WorldPoint; percent?: PercentPoint; label?: string };
  throwAngle?: ThrowAngle;
  throwStyle: ThrowStyle;
  movement: Movement;
  difficulty: Difficulty;
  airTimeSeconds?: number;
  description?: string;
  screenshots?: { position?: string; aim?: string; throw?: string; result?: string };
  source?: { name: string; url: string };

  // --- new fields (v2 rebuild) ---
  tacticalPurpose: string;           // WHY this lineup exists. 1-3 sentences.
                                     // Required for MVP. Renders above the 2x2 walkthrough.
                                     // Example: "Blocks CT AWPer's mid-doors sightline,
                                     // enabling safe T crossing to lower tunnels or B."

  soloViable: boolean;               // Can one player execute this without team coordination?
                                     // True: position-clearing mollies, one-way plays.
                                     // False: execute smokes that need companion utility.

  roundTypes?: RoundType[];          // When is this lineup appropriate?
                                     // Omit = all round types.

  relatedLineupIds?: string[];       // For asymmetric pairing — the CT counterpart
                                     // to a T-side lineup, or vice versa.
                                     // Boot validator checks ref integrity.

  videoUrl?: string;                 // Optional YouTube/video URL for movement-dependent
                                     // lineups (jump throws, run throws). v3.

  patchVersion?: string;             // CS2 patch when last verified. e.g. "2026-01-15"
  lastVerified?: string;             // ISO date. Renders freshness badge if >90 days old.
}

export type RoundType = "eco" | "force" | "full";
```

**Why each field exists:**

| Field | Justification |
|---|---|
| `tacticalPurpose` | PHILOSOPHY_MAP.md §2.2: "The app teaches WHERE to stand and HOW to throw, but never WHY." Research Part 3: understanding beats memorization. This is the single most important content addition. |
| `soloViable` | PHILOSOPHY_MAP.md §2.4: "A player browsing the Map tab sees execute smokes alongside solo mollies. The app treats them identically." Research §5.2: platforms that don't differentiate create false expectations. |
| `roundTypes` | Research §5.4: "No platform teaches what to buy and throw on eco vs. force vs. full buy." The $300 smoke matters differently when you have $1,500 vs. $5,000. |
| `relatedLineupIds` | PHILOSOPHY_MAP.md §2.3: asymmetric utility logic. xbox_smoke (T) and ct_mid_smoke (CT) target the same area with opposite purpose. Linking them teaches the asymmetry. |
| `videoUrl` | PHILOSOPHY_MAP.md §1.5: "The gap matters only for movement-dependent lineups where a screenshot can't convey the timing." Optional, v3. |
| `patchVersion` / `lastVerified` | Research §4.3: CS2 patches break lineups. April 2024 slope physics update, October 2024 HE clearing, January 2026 smoke re-tune. Users need to know if content is current. |

**New entity — TPosition (mirrors CtPosition):**

```typescript
export interface TPosition {
  id: string;
  label: string;              // e.g. "Entry Fragger", "Support", "Lurker"
  description: string;        // 1-2 sentence role summary
  recommendedLineupIds: string[];
  utilityFocus: string;       // Freeform: what to carry / when to throw
  defaultScenarioRole?: string; // Maps to ScenarioPlayer.role for cross-reference
}
```

**Why:** PHILOSOPHY_MAP.md §3 rates T-side role guide as P2 — mirrors existing CT guide pattern. Research documents Refrag's 7-role taxonomy. The CT guide exists (`CtPosition`, 5 entries); T-side players need the same structure. Deferred to v2 because it requires enough lineups organized by role.

**DustData — updated root bundle:**

```typescript
export interface DustData {
  config: MapConfig;
  spawns: Spawn[];
  lineups: Lineup[];           // now with tacticalPurpose, soloViable, etc.
  scenarios: Scenario[];       // now with populated actions
  ctPositions: CtPosition[];   // unchanged
  tPositions: TPosition[];     // NEW (v2)
  defaults: DustDefaults;      // unchanged
}
```

**What does NOT change:**

| Entity | Why Unchanged |
|---|---|
| `Spawn` | 20 spawns (15T + 5CT) are complete for Dust 2. No changes needed. |
| `Scenario` | Schema is correct. The problem is empty `actions[]`, not schema. |
| `ScenarioAction` | Schema has `description` and `timing` fields already — just need content. |
| `ScenarioPlayer` | Role, label, color, startingSpawnId, actions — all correct. |
| `CtPosition` | 5 entries, working as designed. |
| `MapConfig` | Single map config, correct. |
| `DustDefaults` | PlantSpot, TimingNote, SpawnRush — all working. |
| `WorldPoint`, `PercentPoint`, `PixelPoint` | Coordinate model is proven. |

### 2.3 API Design

**There is no API. This is correct.**

The app is a static SPA deployed to GitHub Pages (R-3 in DECISIONS_LEDGER). All data is bundled into the JavaScript at build time from `dust2.json`. There are no runtime API calls, no database queries, no server-side rendering.

**Why no API is the right choice:**
- Single author (the owner). No multi-user write access needed.
- Single map. <100 entities total. A JSON file handles this trivially.
- AR-5 explicitly prohibits backend/DB/auth.
- GitHub Pages is free and sufficient. A server costs money and adds operational complexity for zero benefit.
- The data changes infrequently (content authoring sessions, not real-time updates).

**If an API were ever needed** (trigger: second author OR >30 scenarios per R-2 trigger clause), it would be:

- A git-based content API: content authored as JSON/YAML files in the repository, PRs as the review/publish workflow, GitHub Actions as the build/deploy pipeline. No custom server.
- Alternatively: a headless CMS (Contentlayer, Keystatic, Tina) that writes to the git repo and triggers rebuilds. Still statically deployed, still no custom server.

This is not planned for any phase. Documenting it here so the trigger is clear.

### 2.4 Content Management Approach

**Current workflow:** Manual JSON editing in `dust2.json` (904 lines) + CLI tools (`npm run new-lineup`, `npm run new-scenario`). Boot validator catches dangling refs at startup.

**Rebuild workflow (MVP):**

1. **Author:** The owner (single author, by design).
2. **Authoring tool:** Enhanced CLIs + direct JSON editing.
3. **Review:** Boot validator (`loadDust2.ts`) runs on every `npm run dev` and `npm run build`. Rejects dangling refs, duplicate IDs, side mismatches, and missing required fields. Enhanced in MVP to close the 6 validator gaps documented in CODEBASE_AUDIT.md §9 (H-2).
4. **Publish:** `git push` to main → GitHub Actions runs full validation gate → deploys to GitHub Pages.
5. **Update:** Same workflow. Edit JSON, validate, push.

**CLI enhancements for MVP:**

| Enhancement | Current Gap | Fix |
|---|---|---|
| `--tactical-purpose` flag on `new-lineup` | New field, no CLI support | Add required flag |
| `--solo` flag on `new-lineup` | New field | Add boolean flag |
| Error on parse failure (C-4 fix) | CLI invents data on bad `--throw` input | Throw error instead of inventing coordinates |
| `populate-scenario` subcommand | No way to add actions to existing scenario via CLI | New CLI that appends actions to an existing scenario by ID |
| Validation summary on save | CLI writes JSON silently | Print entity count + ref check summary after write |

**Content creation pipeline for a single lineup:**

```
1. Launch CS2 → load de_dust2 with practice config
2. Navigate to throw position → `getpos_exact` → copy coordinates
3. Align crosshair → `getpos_exact` → copy setang values
4. Take screenshots: position (F12), aim (F12), throw (F12), result (F12)
5. Save screenshots to public/screenshots/dust2/<lineup_id>/
6. Run: npm run new-lineup --id <id> --name <name> --type smoke \
     --side T --area Mid --style jump --movement standing \
     --difficulty easy --throw "setpos x y z" --landing "setpos x y z" \
     --tactical-purpose "Blocks CT AWPer sightline enabling safe mid crossing" \
     --solo false
7. Verify: npm run dev → check walkthrough renders correctly
8. Commit + push
```

[OWNER INPUT NEEDED: Is the screenshot workflow manual (take in CS2, copy to public/)? Or should we build a capture automation script? The current gap (all 10 lineups missing the `throw` screenshot) suggests the manual workflow has friction. A script that launches CS2, teleports to setpos, and captures screenshots via Steam overlay API would reduce friction but adds engineering complexity.]

### 2.5 Handling CS2 Game Updates

CS2 patches break lineups (research §4.3 documents 6 major physics-affecting patches since CS2 launch). The rebuild addresses this with:

**1. Content freshness fields (`patchVersion`, `lastVerified`):**
Each lineup records when it was last verified in-game. The UI renders a freshness badge:
- Green: verified within 90 days
- Yellow: 90-180 days old
- Red: >180 days or older than a known physics-affecting patch

**2. Patch changelog awareness:**
A new file `src/data/patches.json` records CS2 patch dates that affect utility physics:

```json
[
  { "date": "2024-04-15", "impact": "slope_physics", "description": "Molly slope physics update" },
  { "date": "2024-10-28", "impact": "he_clearing", "description": "HE smoke-clearing made reliable" },
  { "date": "2026-01-15", "impact": "smoke_retune", "description": "Smoke behavior re-tuned" }
]
```

The boot validator cross-references each lineup's `patchVersion` against the patches list. If a lineup was last verified before a relevant patch, it renders a warning: "This lineup was verified before the January 2026 smoke re-tune. It may need re-testing."

**3. Map geometry changes:**
When Valve changes Dust 2 geometry (rare but has happened), ALL lineups need re-verification. The `lastVerified` field makes this audit tractable: sort by oldest, re-test in-game, update dates.

**4. New maps entering the pool:**
Not relevant for MVP (Dust 2 only). If multi-map is ever pursued, new maps would be separate JSON files (`mirage.json`, `inferno.json`) following the same schema, loaded by a map-aware boot validator.

### 2.6 Frontend Architecture

**Component hierarchy (after rebuild):**

```
App.tsx (state owner, router integration)
├── Router (wouter — URL ↔ dispatch bridge)
├── Header.tsx (breadcrumb navigation — unchanged)
├── Toast.tsx (singleton notification — unchanged)
├── ErrorBoundary.tsx (theme fix: H-4)
│
├── Route: / → Home.tsx (4-tab shell — unchanged)
│   ├── TabBar.tsx (unchanged)
│   ├── DefaultsTab.tsx (unchanged)
│   ├── ScenariosTab.tsx (unchanged)
│   │   ├── ScenarioGrid.tsx → ScenarioCard.tsx (unchanged)
│   │   ├── SpawnPicker.tsx (C-5 fix: touch targets, H-1: keyboard nav)
│   │   └── CtPositionGuide.tsx (unchanged)
│   ├── InstantSmokesTab.tsx (unchanged)
│   └── MapTab.tsx (C-3 fix: clear activeThrowFromKey on nav)
│
├── Route: /scenario/:id → ScenarioDetail.tsx
│   └── (now renders populated actions with tactical descriptions)
│
├── Route: /lineup/:id → LineupDetail.tsx
│   └── TacticalPurpose.tsx (NEW — renders above 2x2 grid)
│
├── Route: /start → OnboardingFlow.tsx (NEW — v2)
│
└── Components shared across routes:
    ├── Radar.tsx (unchanged)
    ├── CopyButton.tsx (unchanged)
    ├── FreshnessBadge.tsx (NEW — lineup age indicator)
    ├── TPositionGuide.tsx (NEW — v2, mirrors CtPositionGuide)
    └── AsymmetricPair.tsx (NEW — v2, side-by-side T/CT view)
```

**State management:** `useReducer` stays. The reducer gains one new action:

```typescript
| { type: "NAVIGATE"; path: string }  // wouter route change → dispatch
```

All existing actions remain unchanged. The router layer translates URL changes into existing dispatch calls (`SELECT_SCENARIO`, `SELECT_LINEUP`, `SELECT_TAB`).

**Rendering strategy:** Client-side SPA. No SSR, no SSG, no ISR. The entire app is <200KB bundled (including the JSON data). GitHub Pages serves it as static files. First paint is near-instant because there are no API calls — all data is bundled.

### 2.7 CS:GO-Legacy vs. CS2-Current Content

**This app has no CS:GO content.** All 10 lineups were authored for CS2 using the volumetric smoke system. All setpos/setang coordinates were captured in CS2. There is no legacy content to migrate or distinguish.

The `patchVersion` field handles the CS2-internal versioning problem (patches that change smoke physics, molly slope behavior, or HE clearing). This is a CS2-to-CS2 freshness problem, not a CS:GO-to-CS2 migration problem.

If CS:GO lineups were ever imported as reference (unlikely), they would be tagged with a `legacy: true` flag and rendered with a warning. But this is not planned — the research documents that ~70% of CS:GO lineups needed rebuilding for CS2 (§4.3), making import more work than authoring from scratch.

---

## 3. Feature Specification — Phase by Phase

### Phase 1: MVP

#### F-MVP-1: Populated Scenarios

**User perspective:** The user opens the Scenarios tab, picks "Scenario 4: B Execute," and sees a radar with colored arcs showing 3 players' throw trajectories. They click the "Support" role tab and see: "1. Xbox Smoke (t+0s) — Blocks mid-doors AWP angle for safe B rotation. 2. B Window Smoke (t+3s) — Blocks window angle so entry can push upper tunnels." Each action is clickable → opens the 2x2 walkthrough.

**Pedagogical purpose:** PHILOSOPHY_MAP.md §1.7 — "The architecture exists but the content is empty. One editorial session wiring existing lineups into 2-3 scenarios would prove the concept and unlock more product value than any engineering work." Research Part 3 Synthesis View: team context first, individual drill second.

**Implementation:** Pure content authoring. Edit `dust2.json` to populate `scenarios[].players[].actions[]` with references to existing lineup IDs. Add `description` and `timing` fields to each ScenarioAction. No code changes — the ScenarioDetail component already renders actions when present.

[OWNER INPUT NEEDED: Which lineups go in which scenarios? The owner's actual team playbook determines this. Candidate wiring based on current lineup inventory:
- Scenario 1 (A Default Execute): `a_ct_smoke` + `a_long_flash` + `ct_molly_from_long`
- Scenario 3 (Mid Control): `xbox_smoke` + `a_short_flash`
- Scenario 4 (B Execute): `xbox_smoke` + `b_window_smoke` + `b_tunnel_flash`
These reference 7 of 10 existing lineups, reducing orphans from 7 to ~3.]

**Acceptance criteria:**
- At least 3 of 5 scenarios have ≥2 players with ≥1 action each
- Every `ScenarioAction.lineupId` passes boot validation
- Every action has a non-empty `description`
- ScenarioDetail renders arcs and action lists correctly (existing E2E tests cover rendering)
- Orphan lineup count drops from 7 to ≤3

**Dependencies:** None. Can start immediately.

**Complexity:** M (content authoring, not code)

---

#### F-MVP-2: Tactical Purpose for Every Lineup

**User perspective:** The user opens the Xbox Smoke walkthrough. Above the 2x2 grid, they see: "**Why this matters:** Blocks the CT AWPer's sightline from mid-doors to T-spawn, enabling safe passage to lower tunnels or B. Without this smoke, the CT AWPer controls the entire center of the map with a single angle. This is the single most important smoke on Dust 2."

**Pedagogical purpose:** PHILOSOPHY_MAP.md §2.2 documents the gap with specific examples. Research Part 3: the Understanding School says knowing WHY is half the learning. The Synthesis View says the optimal path starts with understanding the principle.

**Implementation:**
- Schema: Add `tacticalPurpose: string` to `Lineup` type (required field). Update boot validator to reject lineups without it.
- Content: Write 1-3 sentence tactical purpose for each of the 10 existing lineups plus all new lineups added in MVP.
- UI: New `TacticalPurpose` component (10-20 lines) rendered above the 2x2 grid in LineupDetail. Styled as a callout block with the existing warm cream palette.

**Acceptance criteria:**
- Every lineup in `dust2.json` has a non-empty `tacticalPurpose`
- `TacticalPurpose` component renders in LineupDetail above the 2x2 grid
- Boot validator rejects lineups missing `tacticalPurpose`
- Content review: each purpose answers "why does this lineup exist?" not "what does it do?"

**Dependencies:** None.

**Complexity:** S (5 lines of schema, 15 lines of component, content authoring per lineup)

---

#### F-MVP-3: Difficulty Calibration

**User perspective:** The lineup walkthrough shows "Easy" (green), "Medium" (amber), or "Hard" (red) badge. Easy lineups are standing throws with forgiving aim points. Hard lineups are jump+run throws with pixel-precise alignment. The user can identify which lineups to learn first.

**Pedagogical purpose:** PHILOSOPHY_MAP.md §1.3 — "All 10 lineups are medium. The field renders on the walkthrough card but communicates nothing because there's no variance." Research §4.4: difficulty progression is a core pedagogical principle. Assumption A8 is CONTRADICTED.

**Implementation:** Data-only change. Reassess each lineup's difficulty based on:
- `easy`: standing throw, forgiving aim window (±5° tolerance), lands reliably
- `medium`: requires specific positioning, moderate aim precision, one mechanic (jump OR walk)
- `hard`: jump+run, pixel-precise aim, tight timing window, high failure rate

No code changes — the difficulty badge already renders in LineupDetail.

**Acceptance criteria:**
- At least 2 lineups rated "easy", at least 1 rated "hard"
- Difficulty distribution roughly matches throw complexity
- No code changes required

**Dependencies:** None.

**Complexity:** S (data-only, 10 entries to review)

---

#### F-MVP-4: Lineup Volume Expansion

**User perspective:** The app has ~25-30 lineups instead of 10. Each bombsite has at least 3 T-side lineups (smoke + flash + molotov). CT-side has retake utility for both sites. The Map tab shows 15-20 markers instead of 7.

**Pedagogical purpose:** Research §5.5 Phase 1: "Learn 5 smokes for one map." Phase 2: "Add 2 pop-flashes + 2 mollies per site." Current 10 lineups is below minimum viable (Assumption A9 CONTRADICTED). The priority matrix (PHILOSOPHY_MAP.md §3) rates this P3 but for MVP we need enough lineups to populate scenarios.

**Implementation:** Content authoring via `npm run new-lineup` CLI. Each lineup requires in-game coordinate capture + 3-4 screenshots. Target additions:

| Gap | Lineups Needed | Priority |
|---|---|---|
| A-site T execute smokes | 2-3 (A cross, CT-spawn, short) | HIGH — needed for scenario population |
| B-site T execute smokes | 1-2 (B doors, platform) | HIGH — needed for scenario population |
| A-site T flash | 1 (long doors pop-flash) | HIGH — entry support |
| B-site T flash | 1 (upper tunnels) | MEDIUM |
| A-site molotov | 1-2 (site clear, car) | MEDIUM |
| B-site molotov | 1 (back platform) | MEDIUM |
| CT retake — A | 2-3 (ramp smoke, long flash, site molly) | MEDIUM — CT content is thin |
| CT retake — B | 1-2 (window smoke, tunnels molly) | MEDIUM |
| HE lineups | 1-2 (mid-doors HE-clear, chip damage) | MEDIUM — HE is a CS2 signature |

[OWNER INPUT NEEDED: Which specific lineups to add? This requires in-game knowledge of which throws the owner and their team actually use. The list above is a template based on research §4.6 (Dust 2 canonical utility). The owner should prioritize lineups their team already throws but hasn't documented.]

**Acceptance criteria:**
- Total lineup count ≥25
- Every scenario has enough lineups to populate its actions
- At least 1 HE lineup exists
- T:CT ratio is roughly 2:1 (matches the offensive-heavy teaching priority — Assumption A6)
- Boot validator passes

**Dependencies:** F-MVP-2 (each new lineup needs `tacticalPurpose`), F-MVP-3 (each needs calibrated difficulty).

**Complexity:** XL (content authoring — each lineup requires in-game capture)

---

#### F-MVP-5: Fix CRITICAL Bugs (C-3, C-4, C-5)

**User perspective:** Map tab no longer shows a stale highlighted marker when returning from another view. CLI errors visibly instead of inventing coordinates. Spawn dots on mobile are tappable without pixel-hunting.

**Implementation:**

- **C-3 (Map tab state leak):** In `reducer.ts`, clear `activeThrowFromKey` when navigating away from the Map tab. Add `activeThrowFromKey: null` to the `SELECT_SCENARIO`, `SELECT_LINEUP`, and `BACK` (from home) cases. ~3 lines changed.

- **C-4 (CLI data invention):** ~~Already fixed.~~ `new-lineup.mjs` lines 178-179 already exit with error on parse failure. The default landing `{x:50,y:50}` is a documented placeholder, not invented data. No code change needed.

- **C-5 (Mobile touch targets):** Needs design rethink. A prior attempt to fix this with oversized invisible hit circles was tried and removed (SpawnPicker.tsx lines 143-150) — adjacent spawns' hit zones overlapped, routing clicks to the wrong spawn via SVG z-order. The fix requires an alternative interaction model (list-based picker, tooltip panel, or long-press menu) rather than larger invisible targets. [OWNER INPUT NEEDED] on preferred approach.

**Acceptance criteria:**
- C-3: Navigate Home → Map tab → click marker → select scenario → press Back → Map tab shows no highlighted marker
- C-5: Deferred pending design decision on interaction model
- All existing tests pass (no regressions)

**Dependencies:** None.

**Complexity:** S for C-3 (~5 lines). C-5 is M-L depending on design approach.

---

#### F-MVP-6: URL Routing

**User perspective:** The user can share `https://.../#/scenario/4` with a teammate. The teammate opens the link and lands directly on Scenario 4. The user can also bookmark `/#/lineup/xbox_smoke` for quick access during warmup.

**Pedagogical purpose:** The voice protocol ("do scenario 4") only works if every player can look up the same scenario. URL sharing makes the playbook a team reference, not just a personal tool.

**Implementation:**
- Add `wouter` dependency (~1.5KB gzipped).
- Create a thin `RouterBridge.tsx` component that maps routes to dispatch calls:
  - `/#/` → GO_HOME
  - `/#/scenario/:id` → SELECT_SCENARIO
  - `/#/lineup/:id` → SELECT_LINEUP
  - `/#/tab/:name` → SELECT_TAB
- Hash-based routing (required for GitHub Pages — no server-side redirect available).
- Modify `App.tsx` to wrap content in `<Router>` and replace manual `history.pushState` calls with `wouter`'s `navigate()`.
- Add `<Link>` components to ScenarioCard and lineup references for accessible navigation.

**Acceptance criteria:**
- Direct navigation to `/#/scenario/a_default` loads ScenarioDetail
- Direct navigation to `/#/lineup/xbox_smoke` loads LineupDetail
- Browser back button works (existing BACK logic preserved)
- All existing E2E tests pass (routes resolve correctly)
- Sharing a URL with a teammate loads the correct view

**Dependencies:** None.

**Complexity:** M (new dependency, routing layer, modify App.tsx)

---

#### F-MVP-7: Content Freshness Fields

**User perspective:** Each lineup walkthrough shows a small badge: "Verified May 2026" (green) or "Last verified 8 months ago" (yellow). Lineups verified before a known physics-affecting CS2 patch show: "Verified before the January 2026 smoke re-tune — may need re-testing."

**Implementation:**
- Add `patchVersion?: string` and `lastVerified?: string` to Lineup type.
- Create `src/data/patches.json` with known physics-affecting CS2 patches.
- Create `FreshnessBadge.tsx` component (30-40 lines) that compares `lastVerified` against current date and patch dates.
- Render badge in LineupDetail below the header.
- Populate `lastVerified` on all existing and new lineups during content authoring.

**Acceptance criteria:**
- Badge renders correctly for fresh (<90 days), aging (90-180), and stale (>180 / pre-patch) lineups
- Badge does not render if `lastVerified` is missing (graceful fallback)
- Boot validator warns (does not throw) on missing `lastVerified`

**Dependencies:** F-MVP-2 (schema changes done together).

**Complexity:** S (schema + 1 small component + data population)

---

#### F-MVP-8: Boot Validator Hardening

**User perspective:** None — this is developer-facing. But it prevents bad content from shipping.

**Implementation:** Close the 6 validator gaps documented in CODEBASE_AUDIT.md §3 (H-2):

1. `scenario.playerCount !== scenario.players.length` → error
2. `ScenarioPlayer.startingSpawnId` references invalid spawn → error
3. Duplicate `scenario.number`, `lineup.id`, or `spawn.id` → error
4. Side mismatch (T scenario with CT-only lineup) → warning
5. `ScenarioAction.order` bounds/duplicates → error
6. `defaults.spawnRushes[].fromSpawnId` / `.beatsSpawnIds[]` validity → error

**Acceptance criteria:**
- Each validation gap has a test in `loadDust2.test.ts`
- Bad data throws at boot with a clear error message
- All existing tests pass (validator changes are additive)

**Dependencies:** None.

**Complexity:** M (6 new validation checks + 6+ new tests)

---

### Phase 2: v2

#### F-V2-1: Asymmetric Utility Pairing

**User perspective:** On the Xbox Smoke (T-side) walkthrough, a section below the 2x2 grid shows: "**CT Counterpart:** CT Mid Smoke — CTs smoke mid-doors to hide their setup. Same location, opposite purpose. T-side enables crossing; CT-side denies information." Clicking the CT lineup opens its walkthrough.

**Pedagogical purpose:** PHILOSOPHY_MAP.md §2.3: "The asymmetric logic of utility is what separates a player who memorizes 10 lineups from a player who understands Dust 2's tactical geometry." Research §4.5: same position, opposite tactical intent.

**Implementation:**
- `relatedLineupIds` field already added in MVP schema.
- New `AsymmetricPair.tsx` component (60-80 lines): renders a compact card for each related lineup with side badge, name, and 1-sentence purpose delta.
- Rendered in LineupDetail below the TacticalPurpose block and above the 2x2 grid.
- Content: populate `relatedLineupIds` for lineups that have T/CT counterparts.

**Acceptance criteria:**
- Lineups with `relatedLineupIds` show the pairing section
- Clicking a related lineup navigates to its walkthrough
- Lineups without `relatedLineupIds` show nothing (graceful absence)

**Dependencies:** MVP complete (enough lineups with T/CT pairs).

**Complexity:** M

---

#### F-V2-2: T-Side Role Guide

**User perspective:** On the Scenarios tab (T-side view), alongside the scenario grid, a "T-Side Roles" panel shows: "Entry Fragger — Takes first fight after utility clears the path. Carry: 1 flash, 1 smoke. Recommended lineups: A Long Flash, B Tunnel Flash." Clicking a recommended lineup opens the walkthrough.

**Pedagogical purpose:** PHILOSOPHY_MAP.md §3 rates this P2. Mirrors existing CT Position Guide. Research documents Refrag's 7-role taxonomy. The CT guide exists; T-side players need equivalent structure.

**Implementation:**
- New `TPosition` entity (defined in MVP schema changes).
- New `TPositionGuide.tsx` component (mirrors `CtPositionGuide.tsx`, ~160 lines).
- Rendered in ScenariosTab when T-side is active in spawn picker.
- Content: 3-5 T-side role definitions with recommended lineup references.

**Acceptance criteria:**
- TPositionGuide renders when spawn picker shows T-side
- Each role has at least 1 recommended lineup
- Recommended lineup chips are clickable → navigate to walkthrough
- Boot validator checks `TPosition.recommendedLineupIds` ref integrity

**Dependencies:** MVP (enough T-side lineups to recommend per role).

**Complexity:** M

---

#### F-V2-3: Practice Config Export

**User perspective:** On the lineup walkthrough, a "Practice Setup" button expands a copyable console command block:

```
sv_cheats 1; mp_warmup_end; mp_roundtime_defuse 60; mp_freezetime 0;
mp_buy_anywhere 1; mp_buytime 9999; mp_maxmoney 65535; mp_startmoney 65535;
sv_infinite_ammo 1; mp_restartgame 1; cl_grenadepreview 1;
setpos -342.13 1326.58 1.03; setang -1.68 -119.82 0.00
```

**Pedagogical purpose:** Research §1.5: CS2 native practice mode setup requires 8+ console commands that most players don't memorize. One-click copy reduces friction between "I want to practice this lineup" and actually doing it. PHILOSOPHY_MAP.md §1.4: "bridges reference to practice."

**Implementation:**
- New `PracticeConfig.tsx` component (40-50 lines) that composes the standard practice setup commands with the lineup's specific setpos/setang.
- Rendered in LineupDetail below the 2x2 grid as a collapsible section.
- Uses existing `CopyButton` component for clipboard.

**Acceptance criteria:**
- Practice config block renders for every lineup
- Copy button works (existing CopyButton behavior)
- Commands are valid CS2 console syntax
- Includes `cl_grenadepreview 1` (CS2-specific, per research §1.5)

**Dependencies:** None (can technically be done in MVP, deferred for scope).

**Complexity:** S

---

#### F-V2-4: Solo/Team Lineup Labels

**User perspective:** On the Map tab, lineup cards show a small badge: "Solo" (can execute alone) or "Team" (needs coordination). On the Instant Smokes tab, solo-viable lineups are marked. The user planning a solo-queue game knows which lineups work without teammates.

**Pedagogical purpose:** PHILOSOPHY_MAP.md §2.4. Research §5.2: "platforms that don't differentiate solo-queue and team utility create false expectations."

**Implementation:**
- `soloViable` field already added in MVP schema.
- Small badge component (10 lines) rendered on lineup cards in MapTab, InstantSmokesTab, and ScenarioDetail action lists.
- Content: populate `soloViable` for all lineups during MVP content authoring.

**Acceptance criteria:**
- Badge renders on lineup cards in Map, Instant Smokes, and Scenario views
- At least 30% of lineups marked solo-viable (position-clearing mollies, one-ways, independent smokes)

**Dependencies:** MVP (field exists, content populated).

**Complexity:** S

---

#### F-V2-5: Onboarding Flow

**User perspective:** A first-time user (or a teammate receiving a shared link) sees a "Start Here" page explaining: "This is a Dust 2 utility playbook organized by team executes. Pick a scenario to see what your team throws. Pick a role to see your specific lineups. Tap any lineup for the step-by-step walkthrough."

**Pedagogical purpose:** Research §5.5 Phase 1: "Pick one map. Learn 3 T-side smokes." The onboarding flow guides a new user to their first useful interaction within 30 seconds.

**Implementation:**
- New `OnboardingFlow.tsx` component (80-120 lines).
- Route: `/#/start`.
- 3-step flow: (1) "What do you play?" → T-side / CT-side, (2) "Start with a scenario" → highlights Scenario 1 (simplest), (3) "Pick your role" → opens ScenarioDetail with role pre-selected.
- Persists onboarding-complete state in localStorage so it doesn't show again.

**Acceptance criteria:**
- New user lands on onboarding if no localStorage flag
- 3-step flow leads to a specific scenario with a specific role selected
- "Skip" option available at every step
- localStorage flag prevents re-showing

**Dependencies:** MVP (populated scenarios — the onboarding must lead to real content).

**Complexity:** M

---

#### F-V2-6: Accessibility Fixes (H-1, H-6)

**User perspective:** Spawn picker dots are navigable with arrow keys. Animations respect `prefers-reduced-motion`.

**Implementation:**
- H-1 (keyboard nav): Add `tabIndex`, `onKeyDown` handler with arrow-key navigation between spawn dots. Focus ring visible on keyboard focus.
- H-6 (reduced motion): Wrap radar viewBox animation in `@media (prefers-reduced-motion: reduce)` → instant transition.

**Acceptance criteria:**
- Spawn picker navigable with Tab + arrow keys
- Focus ring visible on keyboard-focused spawn dot
- Radar animation disabled when `prefers-reduced-motion: reduce` is set
- New E2E test: keyboard navigation through spawn picker

**Dependencies:** None.

**Complexity:** M

---

### Phase 3: v3

#### F-V3-1: Lineup Volume to 50+

**User perspective:** The Map tab is dense with markers. Every position on Dust 2 where utility can be thrown has a marker. Origin-first browsing becomes a spatial index of "where should I stand?"

**Pedagogical purpose:** PHILOSOPHY_MAP.md §1.6: "The feature's value scales with content volume. With 50+ lineups, the origin-first view shows every position where utility is possible."

**Dependencies:** MVP complete, v2 in progress.

**Complexity:** XL (ongoing content authoring)

---

#### F-V3-2: Video Embeds for Movement-Dependent Lineups

**User perspective:** For a jump+run throw, the walkthrough shows a 5-second looping video clip demonstrating the movement timing. Standing throws keep screenshots only.

**Pedagogical purpose:** PHILOSOPHY_MAP.md §1.5: "The gap matters only for movement-dependent lineups where a screenshot can't convey the timing."

**Implementation:**
- `videoUrl` field already in schema.
- Conditional video player component (30-40 lines): if `videoUrl` exists AND `throwStyle` is jump/run/jump+run, render embedded video. Otherwise, render screenshot.
- Video hosting: YouTube embeds (no self-hosting). YouTube's `?loop=1&controls=0` params for clean inline playback.

**Dependencies:** Video content creation per lineup.

**Complexity:** M (code is simple; content creation is the effort)

---

#### F-V3-3: Filtered Map Tab

**User perspective:** The Map tab has filter toggles: Smokes / Flashes / Mollies / HE. Toggling "Smokes" dims all non-smoke markers. A difficulty filter shows only Easy lineups for focused learning.

**Implementation:**
- Filter bar component (40-50 lines) above the radar.
- MapTab state: `activeFilters: { types: UtilityType[], difficulties: Difficulty[] }`.
- Markers not matching active filters render at 20% opacity.

**Dependencies:** Enough lineup volume to make filtering useful (F-V3-1).

**Complexity:** M

---

#### F-V3-4: Refrag Deep-Links

**User perspective:** On the lineup walkthrough, a "Practice in Refrag" button links to the corresponding Refrag lineup for in-game drill.

**Pedagogical purpose:** PHILOSOPHY_MAP.md §1.4: "The opportunity is not to BUILD practice tooling but to BRIDGE to it." Research §1.1: Refrag is the natural complement (training layer) to our reference layer.

**Implementation:**
- Optional `refragIndex?: number` field on Lineup type.
- Refrag NADR uses `.nade <index>` command. If Refrag lineup indices are stable and documented, we store the index and render a "Practice in Refrag" button with instructions.

[OWNER INPUT NEEDED: Does Refrag have stable, documented lineup indices for Dust 2? The research notes that Refrag has "no web-addressable lineups" — if indices aren't stable across updates, this feature isn't viable.]

**Dependencies:** Refrag having addressable lineup references.

**Complexity:** S (if feasible) or N/A (if not)

---

## 4. Content Architecture Plan

### 4.1 Content Taxonomy

```
Dust 2 (map)
├── Side: T-side
│   ├── Area: A-site
│   │   ├── Utility Type: Smoke
│   │   │   ├── A Cross Smoke (execute)
│   │   │   ├── CT Spawn Smoke (rotation denial)
│   │   │   └── Short Smoke (flank denial)
│   │   ├── Utility Type: Flash
│   │   │   ├── Long Doors Pop-Flash (entry)
│   │   │   └── Short Flash (support)
│   │   ├── Utility Type: Molotov
│   │   │   ├── Car Molly (position clear)
│   │   │   └── CT Molly from Long (position clear)
│   │   └── Utility Type: HE
│   │       └── A Site HE (chip damage)
│   ├── Area: B-site
│   │   ├── Smoke: B Doors, Platform
│   │   ├── Flash: Upper Tunnels, B Entry
│   │   ├── Molotov: Back Platform, Close B
│   │   └── HE: B Window HE-clear
│   └── Area: Mid
│       ├── Smoke: Xbox/Mid-Doors (the single most important smoke)
│       ├── Flash: Mid Flash
│       └── HE: Mid-Doors HE-into-Smoke
│
├── Side: CT-side
│   ├── Area: A-site (retake)
│   │   ├── Smoke: Long Doors, Ramp
│   │   ├── Flash: Retake Flash
│   │   └── Molotov: Default Plant Molly
│   ├── Area: B-site (retake)
│   │   ├── Smoke: Tunnels, Window
│   │   └── Molotov: Default Plant Molly
│   └── Area: Mid
│       ├── Smoke: Mid-Doors (information denial)
│       └── Incendiary: Lower Tunnels
│
├── Scenarios (team executes)
│   ├── 1. A Default Execute (3-player, beginner)
│   ├── 2. A Split via Short (4-player, intermediate)
│   ├── 3. Mid Control (2-player, beginner)
│   ├── 4. B Execute (3-player, intermediate)
│   └── 5. Full B Rush (5-player, advanced)
│
├── Defaults (structural knowledge)
│   ├── Plant Spots: Default A, Safe A, Default B, Safe B
│   ├── Round Timings: 7 timing notes across buy/early/mid/late
│   └── Spawn Rushes: 4 T-side rush matchups
│
├── CT Positions (defensive roles)
│   ├── A Anchor, B Anchor, Mid Control, Aggressive AWP, Rotator
│
└── T Positions (offensive roles) — v2
    ├── Entry Fragger, Support, Lurker, AWPer, IGL/Caller
```

### 4.2 Per-Lineup Content Template

Every lineup entry contains the following data points. Fields marked **required** must be populated before the lineup ships. Fields marked **recommended** should be populated but are not blocking.

```typescript
{
  // --- Identity ---
  id: string,                    // REQUIRED. snake_case slug. Unique across all lineups.
  name: string,                  // REQUIRED. Display name. e.g., "Xbox Smoke"
  type: UtilityType,             // REQUIRED. smoke | flash | molotov | he
  side: Side,                    // REQUIRED. T | CT
  area: string,                  // REQUIRED. Landing area callout. e.g., "Mid", "A", "B"

  // --- Position data ---
  throwFrom: {
    world: WorldPoint,           // REQUIRED. Exact setpos coordinates from CS2 console.
    label?: string               // RECOMMENDED. Callout name. e.g., "T-Spawn", "Long Doors"
  },
  landingAt: {
    world?: WorldPoint,          // REQUIRED (preferred). Exact landing setpos.
    percent?: PercentPoint,      // Fallback if world coords unavailable.
    label?: string               // RECOMMENDED. Landing callout. e.g., "Xbox", "CT Spawn"
  },
  throwAngle?: ThrowAngle,       // RECOMMENDED. setang values for crosshair alignment.

  // --- Execution ---
  throwStyle: ThrowStyle,        // REQUIRED. normal | jump | run | jump+run | crouch
  movement: Movement,            // REQUIRED. standing | walking | running
  difficulty: Difficulty,        // REQUIRED. Calibrated, not defaulted to "medium".
  airTimeSeconds?: number,       // RECOMMENDED. Flight time in seconds.

  // --- Pedagogical context ---
  tacticalPurpose: string,       // REQUIRED. 1-3 sentences explaining WHY.
  description?: string,          // RECOMMENDED. Brief execution cue. e.g., "Aim at the
                                 // antenna tip, jump-throw at the peak"
  soloViable: boolean,           // REQUIRED. Can one player execute without coordination?
  roundTypes?: RoundType[],      // RECOMMENDED. eco | force | full. Omit = all.
  relatedLineupIds?: string[],   // RECOMMENDED. T/CT counterpart IDs.

  // --- Media ---
  screenshots?: {
    position?: string,           // RECOMMENDED. Path to position screenshot.
    aim?: string,                // RECOMMENDED. Path to aim screenshot.
    throw?: string,              // RECOMMENDED. Path to throw/release screenshot.
    result?: string              // RECOMMENDED. Path to result screenshot.
  },
  videoUrl?: string,             // v3. YouTube URL for movement-dependent throws.

  // --- Attribution and freshness ---
  source?: {
    name: string,                // RECOMMENDED. Attribution. e.g., "Refrag", "cs2util"
    url: string                  // RECOMMENDED. Source URL.
  },
  patchVersion?: string,         // RECOMMENDED. CS2 patch date when last verified.
  lastVerified?: string          // RECOMMENDED. ISO date of last in-game verification.
}
```

**Total data points per lineup: 25 fields (12 required, 13 recommended/optional).**

### 4.3 Content Creation Pipeline

```
 ┌──────────────────────────────────────────────────────────┐
 │                    AUTHORING                              │
 │                                                          │
 │  1. In-game capture                                      │
 │     └─ Load de_dust2 with practice config                │
 │     └─ Navigate to position → getpos_exact               │
 │     └─ Align crosshair → getpos_exact (setang)           │
 │     └─ Take 4 screenshots (position, aim, throw, result) │
 │     └─ Verify throw lands correctly (3 attempts)          │
 │                                                          │
 │  2. Data entry                                           │
 │     └─ npm run new-lineup (with all required flags)      │
 │     └─ OR: edit dust2.json directly                      │
 │     └─ Write tacticalPurpose (1-3 sentences)             │
 │     └─ Set difficulty, soloViable, roundTypes             │
 │     └─ Set patchVersion, lastVerified                    │
 │                                                          │
 │  3. Screenshot placement                                 │
 │     └─ Save .webp files to public/screenshots/dust2/<id>/│
 │     └─ File names: position.webp, aim.webp, etc.         │
 └──────────────────────┬───────────────────────────────────┘
                        │
 ┌──────────────────────▼───────────────────────────────────┐
 │                    VALIDATION                             │
 │                                                          │
 │  4. Local validation                                     │
 │     └─ npm run dev → boot validator runs                 │
 │     └─ Checks: ref integrity, required fields, ID        │
 │        uniqueness, side consistency, bounds               │
 │     └─ Visual check: walkthrough renders correctly       │
 │                                                          │
 │  5. Test gate                                            │
 │     └─ npm run validate (typecheck + lint + test + build)│
 └──────────────────────┬───────────────────────────────────┘
                        │
 ┌──────────────────────▼───────────────────────────────────┐
 │                    PUBLISHING                             │
 │                                                          │
 │  6. git commit + push to main                            │
 │     └─ CI runs full validation gate                      │
 │     └─ Deploy workflow publishes to GitHub Pages          │
 │                                                          │
 │  7. Post-deploy verification                             │
 │     └─ Visit live site, check new lineup renders         │
 └──────────────────────────────────────────────────────────┘
```

**Freshness maintenance cycle (quarterly):**

```
 1. Check CS2 patch notes since last verification
 2. If physics-affecting patch occurred:
    └─ Sort lineups by lastVerified (oldest first)
    └─ Re-test each in-game (throw 3 times, verify landing)
    └─ Update lastVerified date
    └─ Note any broken lineups → fix or remove
 3. Commit updated dates
```

### 4.4 Teaching the WHY

The content model enforces contextual explanation through three mechanisms:

**1. `tacticalPurpose` (required on every lineup):**
Boot validator rejects lineups without this field. The content guideline: answer "If I don't throw this, what goes wrong?" not "This smoke lands at Xbox." Examples:

- Good: "Blocks the CT AWPer's mid-doors sightline, enabling safe T crossing to lower tunnels or B. Without this, the CT AWPer controls the entire center of the map."
- Bad: "Smoke that lands at Xbox on mid."

**2. `ScenarioAction.description` (required on populated scenarios):**
Each action in a scenario explains its role in the sequence. The content guideline: answer "Why does this come at this point in the execute?" Examples:

- Good: "After the Xbox smoke blocks mid-doors, throw this to block the CT rotation through CT-spawn. This gives your team 3-5 extra seconds before B reinforcements arrive."
- Bad: "Throw the B window smoke."

**3. `ScenarioAction.timing` (recommended):**
Human-readable timing cue that explains WHEN in the round to throw. Examples: "t+0s (immediate on round start)", "t+3s (after Xbox smoke lands)", "on IGL call." This teaches the timing discipline that research §4.4 identifies as the key differentiator at MG-DMG rank.

---

## 5. User Experience Architecture

### 5.1 Complete User Flows

**Flow 1: Team Execute Lookup (primary use case)**

```
User opens app during warmup
  → Sees Scenarios tab (default, headline feature)
  → Scenario grid shows 5 cards, sorted by number
  → Clicks "Scenario 4: B Execute"
    → ScenarioDetail: radar with colored arcs, role tabs
    → Clicks "Support" role tab
      → Sees chronological action list:
        "1. Xbox Smoke (t+0s) — Blocks mid-doors for safe rotation"
        "2. B Window Smoke (t+3s) — Blocks window angle for entry"
      → Clicks "Xbox Smoke" action
        → LineupDetail: tactical purpose + 2x2 walkthrough
        → Copies setpos command → pastes in CS2 console
        → Practices the throw
        → Presses Back → returns to ScenarioDetail
      → Reviews remaining actions for their role
  → Tells teammates: "Let's do scenario 4. I'm support."
```

**Flow 2: Spatial Exploration (secondary use case)**

```
User is mid-round, standing near long doors
  → Opens Map tab
  → Sees markers on radar, finds the one near their position
  → Clicks marker → panel shows 3 lineups throwable from that spot
    → "A Long Flash (easy, solo)" / "A Cross Smoke (medium, team)" / "CT Molly (medium, solo)"
  → Clicks A Long Flash → walkthrough
  → Learns a new lineup they can use from a position they already visit
```

**Flow 3: Quick Reference During Warmup**

```
User wants to verify the Xbox smoke aim point
  → Opens app → navigates to /#/lineup/xbox_smoke (bookmarked)
  → Sees 2x2 walkthrough immediately
  → Copies setang command → verifies crosshair in-game
  → Closes app, ready for match
```

**Flow 4: CT-Side Role Check**

```
User is playing CT-side, anchoring A
  → Opens Scenarios tab → spawn picker shows CT-side
  → CT Position Guide shows "A Anchor: smoke long, molly default.
    Recommended: CT Long Doors Smoke, A Site Retake Molly"
  → Clicks CT Long Doors Smoke → walkthrough
  → Learns the smoke for their defensive role
```

**Flow 5: First-Time User (v2 — onboarding)**

```
User receives shared link from teammate
  → Opens /#/start
  → Step 1: "What side do you play more?" → T-side
  → Step 2: "Start with this scenario" → Scenario 1 (A Default, beginner)
  → Step 3: "Pick your role" → Entry
  → Lands on ScenarioDetail with Entry role pre-selected
  → Sees their action list with tactical context
  → Understands the app's structure in 30 seconds
```

### 5.2 Onboarding Experience

**MVP (no dedicated onboarding):** The app opens to the Scenarios tab. The user sees the scenario grid. The scenarios have populated descriptions that explain what each one is. The mental model is immediately clear: pick a scenario, pick a role, learn your lineups.

**v2 (dedicated onboarding):** The `/#/start` route (F-V2-5) guides first-time users through 3 choices that lead them to their first useful interaction. After completion, a localStorage flag prevents re-showing. Existing users are never interrupted.

### 5.3 The Core Learning Loop

```
DISCOVER → UNDERSTAND → PRACTICE → APPLY → ADAPT

  ┌──────────────────────────────────────────────────────────┐
  │ DISCOVER                                                 │
  │ "What does my team do for the B execute?"                │
  │ → Scenario 4 → role tab → action list                   │
  │ → OR: Map tab → click position → see available lineups  │
  └────────────────────────┬─────────────────────────────────┘
                           │
  ┌────────────────────────▼─────────────────────────────────┐
  │ UNDERSTAND                                               │
  │ "Why does this smoke matter?"                            │
  │ → tacticalPurpose: "Blocks CT AWPer's mid-doors..."     │
  │ → Scenario context: "This comes after the Xbox smoke..."│
  │ → Asymmetric pair: "CT version does the opposite..."    │
  └────────────────────────┬─────────────────────────────────┘
                           │
  ┌────────────────────────▼─────────────────────────────────┐
  │ PRACTICE                                                 │
  │ "How do I execute this throw?"                           │
  │ → 2x2 walkthrough: position / aim / throw / result      │
  │ → Copy setpos + setang → paste in CS2 console           │
  │ → Practice config export (v2) for full practice setup   │
  │ → Repeat 30 times until automatic                       │
  └────────────────────────┬─────────────────────────────────┘
                           │
  ┌────────────────────────▼─────────────────────────────────┐
  │ APPLY                                                    │
  │ "Let's do scenario 4."                                   │
  │ → Voice comm with teammates during match                │
  │ → Each player knows their role and their lineups        │
  │ → Execute happens with correct timing and coordination  │
  └────────────────────────┬─────────────────────────────────┘
                           │
  ┌────────────────────────▼─────────────────────────────────┐
  │ ADAPT (supported by content, not by app features)        │
  │ "The enemy read our A execute. What now?"                │
  │ → Tactical purpose explains WHY → user understands      │
  │   which element to change (timing, fake, different role) │
  │ → Map tab spatial knowledge: "What else can I throw      │
  │   from this position?" → improvise mid-round            │
  └──────────────────────────────────────────────────────────┘
```

The app directly supports DISCOVER → UNDERSTAND → PRACTICE. APPLY happens in-game with the team. ADAPT is supported by tactical content (descriptions, asymmetric pairs) that build the user's mental model beyond rote execution.

### 5.4 Progression and Mastery Tracking

**The app does not track user progress.** This is deliberate.

The audience is one player. Adding a progress system (checkmarks, completion percentages, spaced repetition) adds engineering complexity for a single user who already knows what they've practiced. The overhead of marking lineups "learned" would create busywork that conflicts with the audience's need for simplicity and predictability.

**What the app does instead:**

1. **Difficulty labels** tell the user which lineups to learn first (easy) and which to save for later (hard).
2. **Scenario ordering** (by number) creates an implicit learning sequence: Scenario 1 is the simplest execute, Scenario 5 is the most complex.
3. **Freshness badges** tell the user when they need to re-verify a lineup.
4. **The Defaults tab** is implicitly "Phase 0" content — structural knowledge (plant spots, timings, spawn rushes) that other platforms assume you already have.

**If progress tracking were ever wanted** (trigger: the app is used by multiple people on the team, each with different practice histories), it would be localStorage-based per-device progress tracking. No backend, no account system. But this is not planned.

### 5.5 Skill Level Adaptation

**The app does not adapt to different skill levels.** This is deliberate.

The audience is one player at a specific skill level (~MG-DMG per PHILOSOPHY_MAP.md §4). Building for one skill level means:

- Content is calibrated for MG-DMG: all tactical descriptions assume basic CS2 knowledge but not prior utility expertise.
- Difficulty ratings are calibrated to this player: "easy" means easy for an MG-DMG player, not for a Silver.
- The scenario complexity range (beginner → advanced) maps to team coordination complexity, not individual mechanical skill.

**If multi-level support were ever wanted** (trigger: the app is shared with a broader audience), it would be:
- A skill-level selector (Silver / MG / Supreme / FACEIT) that filters content by difficulty range.
- Different `tacticalPurpose` text depths per skill level (beginner: 1 sentence; advanced: 3 sentences with counter-utility awareness).
- This is not planned for any phase.

### 5.6 Bridging Memorization and Understanding

The gap between "I memorized the lineup" and "I understand when to use it" is addressed by three content-level mechanisms:

1. **`tacticalPurpose` on every lineup:** Forces the content to explain WHY before teaching HOW. The user reads the purpose text ABOVE the 2x2 walkthrough, so the first thing they see is the reason the lineup exists, not the aim point.

2. **Scenario context:** When a lineup is accessed through a scenario, the action description explains how this throw fits into the team execute. The user doesn't just learn "Xbox Smoke goes here" — they learn "Xbox Smoke is step 1 of the B execute because it blocks the mid-doors angle that would otherwise pick your teammates rotating through lower tunnels."

3. **Asymmetric pairing (v2):** Showing the CT counterpart to a T-side lineup teaches the user that utility purpose depends on context, not just position. This is the bridge from memorization (I know WHERE) to understanding (I know WHY for BOTH sides).

---

## 6. Implementation Roadmap

### 6.1 MVP Task List (ordered)

| # | Task | Type | Size | Blocks | Parallel? |
|---|---|---|---|---|---|
| 1 | Add `tacticalPurpose`, `soloViable`, `patchVersion`, `lastVerified` to `Lineup` type | Schema | S | 2, 3, 4, 8 | Yes — with #5, #6 |
| 2 | Write tactical purpose for all 10 existing lineups | Content | M | 4 | After #1 |
| 3 | Calibrate difficulty ratings for all 10 existing lineups | Data | S | — | After #1, parallel with #2 |
| 4 | Author 15-20 new lineups (in-game capture + data entry) | Content | XL | 7 | After #1, #2 |
| 5 | Fix C-3: Clear `activeThrowFromKey` on nav | Code | S | — | Yes — with #1, #6 |
| 6 | Fix C-4: CLI error on parse failure | Code | S | — | Yes — with #1, #5 |
| 7 | Populate 3-5 scenarios with real actions | Content | M | — | After #4 (needs enough lineups) |
| 8 | Harden boot validator (6 new checks) | Code | M | — | After #1 |
| 9 | Fix C-5: Mobile touch targets (44×44px hit area) | Code | S | — | Any time |
| 10 | Add `TacticalPurpose` component to LineupDetail | Code | S | — | After #1 |
| 11 | Add `FreshnessBadge` component | Code | S | — | After #1 |
| 12 | Create `src/data/patches.json` | Data | S | 11 | Any time |
| 13 | Add wouter router + route definitions | Code | M | — | Any time |
| 14 | Fill `throw` screenshot slot for all lineups | Content | L | — | Parallel with #4 |
| 15 | Update E2E tests for new content + routes | Test | M | — | After #7, #13 |

### 6.2 Dependency Graph

```
                    ┌──────────┐
                    │ 1. Schema│
                    │ changes  │
                    └──┬───┬───┘
                       │   │
            ┌──────────┘   └──────────┐
            ▼                         ▼
    ┌───────────────┐        ┌───────────────┐
    │ 2. Tactical   │        │ 8. Validator  │
    │ purpose (10)  │        │ hardening     │
    └───────┬───────┘        └───────────────┘
            │
            ▼
    ┌───────────────┐      ┌─────────┐  ┌─────────┐  ┌─────────┐
    │ 4. New lineups│      │ 5. C-3  │  │ 6. C-4  │  │ 9. C-5  │
    │ (15-20)       │      │ fix     │  │ fix     │  │ fix     │
    └───────┬───────┘      └─────────┘  └─────────┘  └─────────┘
            │                (independent — run any time)
            ▼
    ┌───────────────┐      ┌──────────┐  ┌──────────┐
    │ 7. Populate   │      │ 10. Tact.│  │ 11. Fresh│
    │ scenarios     │      │ Purpose  │  │ Badge    │
    └───────┬───────┘      │ component│  │ component│
            │              └──────────┘  └──────────┘
            ▼
    ┌───────────────┐      ┌──────────┐
    │ 15. E2E test  │      │ 13. URL  │
    │ updates       │      │ router   │
    └───────────────┘      └──────────┘
                            (independent)
```

### 6.3 Parallelization Opportunities

**Can run in parallel from day 1:**
- Tasks 1 + 5 + 6 + 9 (schema changes + 3 bug fixes — different files, no dependencies)
- Tasks 10 + 11 + 12 (new small components + patches.json — independent)
- Task 13 (router — independent of all content work)

**Can run in parallel after task 1:**
- Tasks 2 + 3 (write tactical purposes + calibrate difficulties — same data file but different fields)
- Task 8 (validator hardening — depends on schema but not content)

**Sequential bottleneck:**
- Task 4 (new lineups) → Task 7 (populate scenarios) → Task 15 (E2E updates)
- This is the critical path. Lineup authoring is the slowest task because each lineup requires in-game capture.

### 6.4 Highest-Risk Unknowns

| Risk | Impact | Mitigation |
|---|---|---|
| Content quality of `tacticalPurpose` | HIGH — bad descriptions undermine the core philosophy change | Write 3 exemplar descriptions first, get owner feedback before writing the rest. [OWNER INPUT NEEDED: Review exemplar descriptions before bulk authoring.] |
| Scenario action wiring | HIGH — wrong lineup assignments make scenarios tactically incoherent | The owner must define which lineups go in which scenarios based on their team's actual playbook. Cannot be automated or guessed. |
| Lineup volume (15-20 new) | MEDIUM — each requires in-game capture | Front-load the lineups needed for scenario population. Remaining lineups can trickle in. |
| wouter router + GitHub Pages hash routing | LOW — well-documented pattern | Proof-of-concept in 30 minutes: create a test route, deploy, verify direct navigation works. |
| Boot validator false positives | LOW — new checks might reject valid edge cases | Run the hardened validator against the existing data first. Only add checks that pass current data. |

**De-risking strategy:** The first week's work is tasks 1-3 + 5-6 (schema, bug fixes, tactical purposes for existing lineups) plus a router proof-of-concept. This validates the three riskiest areas (content quality, schema changes, routing) before the heavy content authoring (task 4) begins.

---

## 7. Migration Plan

This is an incremental rebuild, not a rewrite. There is no "migration" in the traditional sense — no data migration, no service cutover, no parallel running. The existing app evolves in-place.

### 7.1 What Carries Over (Everything)

| Asset | Status |
|---|---|
| All source code (~4,700 lines) | Kept, modified in-place |
| All tests (114 cases across 3 frameworks) | Kept, extended |
| All content data (dust2.json, 904 lines) | Kept, extended with new fields |
| All screenshots (10 lineup × 3 slots) | Kept, throw slot filled |
| All CI/CD workflows | Kept, unchanged |
| All documentation (14 docs) | Kept |
| GitHub Pages deployment | Kept |
| PWA manifest | Kept |

### 7.2 What Needs Transformation

| Asset | Transformation |
|---|---|
| `src/types.ts` | Add 7 fields to `Lineup`, add `TPosition` type, add `RoundType` type |
| `src/data/dust2.json` | Add `tacticalPurpose`, `soloViable`, `patchVersion`, `lastVerified` to all 10 existing lineups. Recalibrate `difficulty`. Add 15-20 new lineup entries. Populate `scenarios[].players[].actions[]`. |
| `src/data/loadDust2.ts` | Add 6 new validation checks |
| `src/reducer.ts` | Clear `activeThrowFromKey` on navigation (C-3 fix). Add `NAVIGATE` action. |
| `src/App.tsx` | Integrate wouter router. Replace manual `history.pushState` with router navigation. |
| `src/components/LineupDetail.tsx` | Add TacticalPurpose and FreshnessBadge rendering |
| `src/components/SpawnPicker.tsx` | Add invisible hit area circles for C-5 fix |
| `scripts/new-lineup.mjs` | Fix C-4 (error on parse failure). Add `--tactical-purpose`, `--solo` flags. |
| `package.json` | Add `wouter` dependency |

### 7.3 Existing Users

The app is a personal tool for one user deployed on GitHub Pages. There is no user base to migrate, no accounts to port, no backwards compatibility to maintain. The URL changes (hash routing) will break any existing bookmarks to the root URL — but since the current app has no URL routing, there are no deep-link bookmarks to break.

### 7.4 Cutover Strategy

There is no cutover. Changes are deployed incrementally to the same GitHub Pages URL via the same CI/CD pipeline. Each PR goes through the full validation gate. The user sees changes immediately after merge to main.

**Recommended merge sequence:**
1. PR 1: Schema changes + bug fixes (tasks 1, 5, 6, 8, 9) — purely additive, no content changes
2. PR 2: Tactical purposes + difficulty calibration for existing 10 lineups (tasks 2, 3) — data-only
3. PR 3: New lineups batch 1 (task 4, first 8-10 lineups) — content
4. PR 4: Populate scenarios (task 7) + new components (tasks 10, 11, 12) — the big unlock
5. PR 5: URL router (task 13) — independent feature
6. PR 6: New lineups batch 2 (task 4, remaining lineups) + E2E updates (task 15) — content + tests

Each PR is independently deployable. If any PR causes issues, it can be reverted without affecting the others.

---

## 8. Quality and Maintenance Plan

### 8.1 Testing Strategy

| Layer | Framework | What's Tested | Coverage Target |
|---|---|---|---|
| **Unit** | Vitest | Coordinate math, setpos parsing, bounds, steam deep-links, freshness calculation | All utility functions with edge cases |
| **Reducer** | Vitest | All state transitions including new NAVIGATE action, C-3 fix verification | Every action × every relevant state combination |
| **Data validation** | Vitest | Boot validator: all 12+ checks (existing 6 + new 6) | Every validation rule with positive and negative cases |
| **Component** | Vitest + RTL | TacticalPurpose, FreshnessBadge, AsymmetricPair (v2), TPositionGuide (v2) | Render tests + interaction tests |
| **Integration** | Vitest + RTL | Home tabs, ScenarioDetail with populated actions, LineupDetail with tactical purpose | Key user flows end-to-end in JSDOM |
| **E2E** | Playwright | Visual snapshots (all tabs), spawn click precision, map marker clicks, route navigation, scenario action rendering | All visual baselines updated for new content |
| **Content** | Boot validator | Ref integrity, required fields, ID uniqueness, side consistency, bounds, freshness | Runs on every build — bad data cannot ship |
| **Accessibility** | Playwright + axe-core | WCAG 2.1 AA compliance, touch targets, keyboard navigation, color contrast | New: automated WCAG audit in E2E (M-3 fix) |

**New tests added by rebuild:**

| Test | Framework | Purpose |
|---|---|---|
| Validator: duplicate IDs | Vitest | H-2 gap |
| Validator: side mismatch | Vitest | H-2 gap |
| Validator: playerCount consistency | Vitest | H-2 gap |
| Validator: missing tacticalPurpose | Vitest | New required field |
| C-3: Map tab state clear on nav | Vitest (reducer) | CRITICAL bug fix verification |
| C-5: Touch target size | Playwright | WCAG compliance |
| Route: direct navigation | Playwright | URL sharing |
| Route: back button | Playwright | Router integration |
| Populated scenario rendering | Playwright | Visual baseline for non-empty scenarios |
| Keyboard nav: spawn picker | Playwright | H-1 accessibility fix |
| axe-core WCAG audit | Playwright | M-3 — automated accessibility |

### 8.2 Content Freshness Strategy

**Detection:** The `lastVerified` field on each lineup records when it was last tested in-game. The `patches.json` file records CS2 patches that affect utility physics. The boot validator cross-references these at build time and logs warnings for stale content. The `FreshnessBadge` component shows freshness state to the user.

**Triggers for re-verification:**
1. A CS2 patch affects smoke physics, molly behavior, or map geometry
2. A lineup's `lastVerified` date is >180 days old
3. The owner notices a lineup landing incorrectly during gameplay

**Re-verification workflow:**
1. Load de_dust2 with practice config
2. Teleport to the lineup's `setpos` coordinates
3. Execute the throw 3 times
4. If it lands correctly: update `lastVerified` to today
5. If it doesn't: fix the coordinates or mark the lineup as broken
6. Commit + push

**Estimated cadence:** Quarterly review of all lineups, plus ad-hoc re-verification after physics-affecting patches. For ~30 lineups at 2 minutes each, this is a 1-hour quarterly task.

### 8.3 Performance Budget

| Metric | Budget | Current | Notes |
|---|---|---|---|
| Bundle size (gzipped) | <200KB | ~150KB | React + app code + JSON data |
| First Contentful Paint | <1.5s | ~0.8s | No API calls, all data bundled |
| Time to Interactive | <2.0s | ~1.0s | Single-page app, minimal JS |
| Lighthouse Performance | >90 | Not measured | Add to CI as informational (not blocking) |
| Largest Contentful Paint | <2.5s | ~1.5s | Radar PNG is the largest asset |

**Monitoring:** No runtime analytics (no backend). Performance tracked via:
- Lighthouse CI (run in deploy workflow, report in PR comment, non-blocking)
- Bundle size tracking (Vite's `build` output logged in CI)
- Manual spot-checks on mobile devices

**Risk:** Lineup expansion to 50+ entries increases the JSON data size. At 30 fields × 50 lineups × ~200 bytes per field, the JSON adds ~300KB uncompressed, ~30KB gzipped. Well within budget.

### 8.4 Analytics Plan

**The app has no runtime analytics. This is deliberate (AR-5, no backend).**

**Pedagogical validation** (is our teaching approach working?) is measured through:

1. **Owner observation:** The app serves one player and their team. The owner can directly observe whether teammates execute scenarios correctly after using the app. This is the most direct validation possible.

2. **In-game results:** Does the team win more rounds when they use the playbook? The owner tracks this informally. Leetify's team utility metrics (flash assists, unused utility upon death) provide quantitative backup.

3. **Content usage patterns:** Which scenarios get called most often in voice comms? Which lineups does the owner practice most? This is qualitative feedback from the owner, not tracked in-app.

4. **Freshness feedback:** Do lineups land correctly in competitive matches? If a lineup fails, the owner re-verifies and updates. The freshness badge prevents the owner from using stale content.

**If analytics were ever wanted** (trigger: app shared with a wider audience), a privacy-respecting solution would be:
- Plausible Analytics (self-hosted, no cookies, GDPR-compliant, ~1KB script)
- Track: page views per route, lineup views, scenario views, copy button clicks
- Do NOT track: user identity, session duration, scroll depth, or any PII

This is not planned for any phase.

---

## First 10 Tasks

If the owner says "go" tomorrow, do these in this order:

1. **Add schema fields to `types.ts`.** Add `tacticalPurpose: string`, `soloViable: boolean`, `roundTypes?: RoundType[]`, `relatedLineupIds?: string[]`, `videoUrl?: string`, `patchVersion?: string`, `lastVerified?: string` to the `Lineup` interface. Add `TPosition` interface. Add `RoundType` type. ~30 lines of type definitions.

2. **Fix C-3, C-4, C-5.** Three targeted bug fixes totaling ~20 lines of code across `reducer.ts`, `scripts/new-lineup.mjs`, and `SpawnPicker.tsx`. Ship as one PR. Run existing tests to verify no regressions.

3. **Write tactical purposes for all 10 existing lineups.** Edit `dust2.json`. Each lineup gets 1-3 sentences in the `tacticalPurpose` field explaining WHY it exists. Also populate `soloViable`, `lastVerified`, and `patchVersion`. Also recalibrate `difficulty` ratings. This is the first content-quality checkpoint — review with the owner before proceeding.

4. **Build `TacticalPurpose` component.** 15-line React component rendered in `LineupDetail.tsx` above the 2x2 grid. Shows the `tacticalPurpose` text in a callout block styled with the existing warm cream palette.

5. **Build `FreshnessBadge` component.** 30-line component + `patches.json` data file. Rendered in LineupDetail below the header.

6. **Harden boot validator.** Add 6 new validation checks to `loadDust2.ts` + 6+ new test cases. Run against existing data to verify no false positives.

7. **Author first batch of new lineups (8-10).** In-game capture of coordinates + screenshots for the lineups needed to populate scenarios. Priority: A-site execute smokes, B-site execute smokes, A-site flash, B-site flash. Use the enhanced CLI with `--tactical-purpose` flag.

8. **Populate 3 scenarios with real actions.** Wire the newly authored lineups into Scenarios 1, 3, and 4. Write `description` and `timing` for each ScenarioAction. Verify ScenarioDetail renders correctly with populated actions.

9. **Add URL routing with wouter.** Add dependency, create `RouterBridge.tsx`, modify `App.tsx`. Hash-based routing for GitHub Pages compatibility. Test: share a URL, verify it loads the correct view.

10. **Update E2E tests.** New visual snapshot baselines for populated scenarios. Route navigation tests. Spawn picker touch target test. Validator test coverage for new checks.

---

*This plan rebuilds the Dust 2 Playbook through incremental evolution: content first, code second, always justified by the research and audit. The highest-impact work requires zero engineering — populate scenarios, write tactical purposes, calibrate difficulties. The engineering work (routing, new components, validator hardening) is targeted and additive. Nothing is thrown away. For source analysis, see `docs/CS2_UTILITY_ECOSYSTEM_RESEARCH.md`, `docs/CODEBASE_AUDIT.md`, and `docs/PHILOSOPHY_MAP.md`.*
