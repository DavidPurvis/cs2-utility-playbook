# v6 Branch Audit — 10-Agent Synthesis

> **Branch:** `feat/v6-playbook-rewrite` · **Date:** 2026-05-21
>
> Ten agents analyzed the v6 branch from independent angles (UX, code quality, tests, data model, accessibility, mobile, plan-vs-code, bug hunt, maintenance, visual). This document is the synthesis. Each agent finding is categorized as:
>
> - **REAL BUG** — code defect, concrete fix available
> - **REAL GAP** — feature you asked for that isn't built
> - **REAL POLISH** — quality concern (a11y, perf, maintenance) worth addressing
> - **NON-ISSUE** — agent was wrong; verified against the code
> - **SCOPE DECISION** — depends on what you actually want; URD §10 question
>
> No softening. Findings are ranked by impact. Agent disagreements are reconciled by reading the code directly.

---

## A. REAL BUGS (fix before merge)

### B-1 · Spawn picker not keyboard-accessible
- **Consensus:** Agent 2 + Agent 5 (BLOCKER per Agent 5)
- **File:** `src/components/SpawnPicker.tsx:102-129`
- **Issue:** Spawn dots are `<g>` SVG elements with `onClick`. No `role="button"`, no `onKeyDown`, no `tabIndex`. A user navigating with Tab cannot reach or activate the spawn dots.
- **Impact:** The "where am I" reference is impossible to use without a mouse. Violates NFR-4 (accessibility).
- **Fix:** Wrap each spawn dot in a `<g role="button" tabIndex={0} onKeyDown={...}>` with Enter/Space handling, or move click handling to a transparent overlay `<button>`.

### B-2 · `SELECT_LINEUP` from home creates orphan state
- **Reporter:** Agent 8
- **File:** `src/reducer.ts:53-58`
- **Issue:** `case "SELECT_LINEUP"` unconditionally sets `view: "lineup"` without checking that `activeScenarioId` is non-null. Dispatched from home, it puts the user in a lineup view with no scenario context; the breadcrumb (`App.tsx:101-109`) skips the scenario crumb because `activeScenario` resolves to null.
- **Impact:** Today, only `StepRow` dispatches `SELECT_LINEUP` from within a populated scenario, so this isn't reachable. But FR-13 (list view) would dispatch from home — and an orphan state would render.
- **Fix:** Either reject the action when `activeScenarioId` is null, or accept the orphan view and refactor breadcrumb logic to handle it explicitly.

### B-3 · ErrorBoundary uses dark theme on a cream page
- **Consensus:** Agent 2 + Agent 10
- **File:** `src/components/ErrorBoundary.tsx:12-19`
- **Issue:** ErrorBoundary defines local color constants from the v5 dark palette: `bg: "#0a0e15"`, `bgPanel: "#11161f"`, `textPri: "#e6ebf2"`, etc. The surrounding page is cream (`#FAF9F6`). If an error fires, the fallback UI is dark-on-light visual chaos.
- **Impact:** Latent. Has not fired yet because the v6 happy path doesn't throw.
- **Fix:** Import from `theme.ts` and use `T.bg`, `T.bgPanel`, `T.textPri`, `T.dangerBg`, `T.danger`.

---

## B. REAL GAPS (requirements explicitly asked for, not delivered)

### G-1 · Flat list view of lineups (FR-13)
- **Reporter:** URD §4 (cross-referenced from your spawn-zoom message)
- **Your quote:** *"Include a way for utility can be look at in a list view instead of a map as an alternative"*
- **Current state:** Not implemented. v6 surfaces lineups only via scenario steps → 2×2 walkthrough.
- **Impact:** Direct contradiction of an explicit request. Reachable today only via a scenario you've populated; there is no way to look at lineup #7 without first authoring a scenario action that references it.

### G-2 · Boot validator gaps allow corrupt data to render
- **Reporter:** Agent 4 (5 sub-findings)
- **File:** `src/data/loadDust2.ts`
- **What is not validated:**
  - `Scenario.playerCount !== Scenario.players.length` is accepted silently. Header text lies.
  - `ScenarioPlayer.startingSpawnId` references are not checked against the spawn list. A typo silently breaks the radar.
  - Duplicate `Scenario.id` / `Lineup.id` / `Spawn.id` are accepted; the lookup map keeps only one.
  - Side mismatch: a T-side scenario can have a player whose `startingSpawnId` points at a CT spawn.
  - `ScenarioAction.order` is not range-checked.
- **Impact:** No fire today (the seeded data is clean), but the moment you hand-author scenarios via JSON edit (FR-10), one of these will catch you.
- **Fix:** Extend `assertDustData` with five sub-asserts. ~30 LOC.

### G-3 · Keyboard navigation test coverage (TKT-021 partial)
- **Reporter:** Agent 7
- **File:** `src/components/__tests__/walkthrough.test.tsx`
- **Plan said:** TKT-021 should include component tests for keyboard nav (Enter expands card; Esc backs).
- **Current state:** Esc handler exists in `App.tsx:88-96`; no test asserts on it. Tab order untested.
- **Impact:** A regression in the keyboard handler ships invisible to CI.

### G-4 · README missing scenario schema + concepts
- **Reporter:** Agent 9
- **File:** `README.md`
- **Gaps:**
  - No documented JSON schema for a Scenario object.
  - No paragraph defining Spawn vs Lineup vs Scenario in plain English.
  - Reducer navigation model is undocumented (have to read `reducer.ts`).
- **Impact:** Cold-start friction. Three months from now, you (or anyone you share the repo with) will read source code to figure out what a Scenario is.

---

## C. REAL POLISH (quality concerns, not bugs)

| # | Finding | Source | File:line | Severity |
|---|---|---|---|---|
| P-1 | Visible focus rings missing on most buttons (Header, ScenarioCard, RoleTabs, BackButton, SpawnPicker side toggles) | Agent 5 | multiple components | SERIOUS |
| P-2 | Mobile touch targets <44×44 (role tabs, side tabs, back buttons, step number circles, scenario badges) | Agent 5 + Agent 6 | `ScenarioCard.tsx:59`, `ScenarioDetail.tsx:311`, `SpawnPicker.tsx:77`, `LineupDetail.tsx:74` | MEDIUM |
| P-3 | Inline style mutations in hover/focus event handlers (CopyButton, ScenarioCard) can desync under re-render | Agent 2 | `CopyButton.tsx:70-84`, `ScenarioCard.tsx:41-50` | MEDIUM |
| P-4 | Radar doesn't visually emphasize the active player's spawn dot when a role tab is selected | Agent 1 | `ScenarioDetail.tsx:126-179` | MEDIUM (violates origin-first design intent) |
| P-5 | Role tabs lack action count indicator (`(0)` / `(3)`) | Agent 1 | `ScenarioDetail.tsx:183-221` | LOW |
| P-6 | Breadcrumb in LineupDetail doesn't show role context (jumps to scenario list, not back to the role) | Agent 1 | `App.tsx:98-109` | LOW |
| P-7 | No memoization on per-arc / per-card rendering — every hover re-renders the entire arc layer | Agent 2 | `ScenarioDetail.tsx:131-176` | LOW (matters at >30 lineups) |
| P-8 | Some tests assert with loose substring checks instead of exact value matches | Agent 3 | `steamDeepLink.test.ts:23-27`, `walkthrough.test.tsx:41-45`, `home.test.tsx:73` | LOW |
| P-9 | Header may wrap awkwardly at 375px viewport (back button + badge + title + meta) | Agent 6 | `ScenarioDetail.tsx:79-115` | LOW |
| P-10 | Spacing scale is loose (magic numbers 2/4/6/8/10/12 used inline rather than tokens) | Agent 10 | many components | LOW |

---

## D. NON-ISSUES (agent was wrong — verified against code)

| Agent | Claimed issue | Verdict |
|---|---|---|
| Agent 1 | "CTA points to `npm run new-scenario` but command doesn't exist" | WRONG. CLI exists at `scripts/new-scenario.mjs`; npm script registered in `package.json:13`. |
| Agent 2 | "Stale closure on Radar viewBox effect — re-runs on every render" | WRONG. Deps array uses primitive values, not object identity. Effect correctly re-runs only when one of x/y/width/height changes. |
| Agent 2 | "Unguarded `.side` access on `spawns.find()` result" | WRONG. `SpawnPicker.tsx:69` already null-checks: `if (sp && sp.side !== s)`. |
| Agent 5 | "Esc handler only outside home view is a UX inconsistency" | INTENTIONAL. Home has no modal to close. |
| Agent 7 | "USER_REQUIREMENTS.md is unplanned scope creep" | NON-ISSUE. Created during the same session at your direction. |

---

## E. SCOPE DECISIONS (need your call)

| ID | Question | Source |
|---|---|---|
| S-1 | Should the home-page spawn pick stay disconnected from scenarios, or should picking a spawn highlight matching scenarios? | Agent 1 |
| S-2 | Should role tabs show action counts before you click? | Agent 1 |
| S-3 | Should the breadcrumb in a lineup view show `Scenario 1 › A-man › Step 2`? | Agent 1 |
| S-4 | Should the v6 dark ErrorBoundary be rewritten as cream, or is it intentional that errors switch palettes? | Agent 10 (assume: rewrite to cream) |
| S-5 | Curate down from 10 lineups, or keep all 10 as the starter set? | URD OQ-2 |
| S-6 | Should I seed scenario actions with recommended utility composition per site, or leave empty? | URD OQ-3 |

---

## F. Cross-reference to URD requirements

Findings that map to existing URD requirements:

| Finding | URD requirement | Status change |
|---|---|---|
| G-1 (list view missing) | FR-13 | Was ✗ Not implemented; still ✗ |
| G-2 (validator gaps) | DA-4 ("if missing don't invent") | Implied but not strictly enforced; recommend adding NFR-8 for runtime data integrity |
| B-1 (keyboard a11y) | NFR-4 (WCAG-AA) | NFR-4 needs strengthening: explicit "keyboard navigation works for every interactive element" |
| P-2 (touch targets) | NFR-5 (mobile responsive) | NFR-5 needs strengthening: explicit 44×44 minimum |
| B-3 (ErrorBoundary palette) | DR-1 (Claude design) | Implementation incomplete |

Findings that suggest URD additions (await your verdict):

- **NFR-8 (proposed):** "All keyboard-reachable interactive elements show a visible focus ring (`outline: 2px solid T.accent`)." — covers B-1 + P-1.
- **NFR-9 (proposed):** "Boot validator rejects every form of internal data inconsistency before render — duplicate IDs, mismatched counts, dangling spawn refs, side conflicts." — covers G-2.
- **NFR-10 (proposed):** "Mobile touch targets ≥44×44px for every interactive element." — covers P-2.

---

## G. Recommended next actions (ordered by ROI)

1. **Fix B-1, B-2, B-3** — the three real bugs. ~1 hour total.
2. **Extend boot validator (G-2)** — five new sub-asserts in `loadDust2.ts`. ~30 minutes.
3. **Add README §Concepts + Scenario schema (G-4)** — 80–100 LOC of docs. ~30 minutes.
4. **Decide on S-1..S-6** scope questions, then either implement or document the deferrals.
5. **Decide on G-1 (list view)** — restore as a top-level view, surface inside another view, or formally drop.
6. **P-1 + P-2** focus rings and touch targets — apply via a `Button` helper component or CSS pseudo-class refactor. ~1 hour.
7. **TKT-021 keyboard tests (G-3)** — extend walkthrough.test.tsx. ~15 minutes.
8. **P-3, P-4, P-5, P-6** — UX polish based on Agent 1's findings. ~2 hours total.

Process note: I am NOT auto-applying these fixes. The URD and this audit exist for your review first. Once you direct what to keep / amend / drop / add, I implement.

---

## H. What I am NOT claiming

To stay honest:

- I did not run the dev server and manually click through every view at every viewport size. The mobile audit was done from static CSS / inline style inspection plus the live media-query rules. **You should verify visually before declaring done.**
- I did not test cross-browser. Safari and Firefox may surface different issues than Chrome.
- I did not test on a real phone. The 375px viewport is jsdom + Chrome emulation, not iOS Safari with notch / safe-area-insets.
- I did not run Lighthouse or axe-core. The accessibility findings are from agent-level code reading + my reconciliation; a real automated audit might surface more.
- The 10 agent reports each capped at 400–600 words. They had to compress; some findings might be partial.

If you want any of the above run for real, say so and I will.
