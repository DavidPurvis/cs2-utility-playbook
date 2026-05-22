# Decisions Ledger — Dust 2 Playbook

> **Hat:** Senior developer acting as an annoying junior — the kid in the classroom who reminds the teacher of the homework she didn't assign.
>
> **Mandate:** flag every decision that isn't 100% nailed down. Every assumption. Every open question. Worry more about the program than the people working on the program.
>
> **Format:** each item is a question, the current default I'm operating under, why I picked that default, and what the owner needs to confirm or override. The owner OWNS the right column — annotate it KEEP / OVERRIDE / NEW DEFAULT.
>
> **What's the difference between this and the URD?**
>
> - URD = what the owner explicitly asked for.
> - This file = everything the owner did NOT explicitly nail down but that someone had to decide anyway. **Without this document, those decisions live silently inside the code.**

---

## A. Open questions (need owner decision)

### Q-1 · Should the CT position guide list be editable in JSON only, or also via CLI?

- **Default:** JSON only. There is no `npm run new-position` CLI helper.
- **Why:** the position set is small (5 entries) and tweaked rarely.
- **Owner verdict:** ____________________

### Q-2 · The screenshot used for the "Throw" card has no source in the v6 data — all 10 lineups have `position`, `aim`, `result` but never `throw`. Is that intentional, or do we need to capture throw frames?

- **Default:** the Throw card renders a text fallback (throw style + setang) when `throw` is missing. The data file makes `throw` optional.
- **Why:** the seed data came from cs2util.com which doesn't expose throw frames.
- **Owner verdict:** capture throw frames yourself? or leave as text fallback indefinitely? ____________________

### Q-3 · Lineup IDs are case-sensitive (`xbox_smoke` ≠ `Xbox_Smoke`). The CLI enforces lowercase via regex. But the boot validator doesn't reject case variants in scenario references. Should it?

- **Default:** case-sensitive everywhere. A typo like `Xbox_smoke` in a scenario's `lineupId` fails the boot validator (no fuzzy match).
- **Why:** strict. Better to fail loudly than guess.
- **Owner verdict:** ____________________

### Q-4 · The `radar.png` is the Valve PSD-style radar (teal/grey geometric outlines). Should it instead be the textured satellite-style minimap (orange sand)?

- **Default:** Valve PSD. That's what's in `public/maps/dust2/radar.png` currently.
- **Why:** PSD is the standard CS2 minimap; consistent with anything else on the web.
- **Owner verdict:** owner said "map in the background is no longer loading" — investigated locally, image loads fine. Could this complaint actually be "I expected a different radar style"? ____________________

### Q-5 · CT position cards reference lineups via `recommendedLineupIds`. The current data only references existing CT-side smoke lineups; A Anchor doesn't have a recommendation for a flash because there isn't a CT-side flash in the dataset yet. Should I seed empty placeholders, or wait for the owner to author them?

- **Default:** chips render only for existing references. Cards without recommendations show only the description + utility-focus text.
- **Why:** "do not invent data" rule (AR-1).
- **Owner verdict:** ____________________

### Q-6 · The CLI helper `new-lineup.mjs` defaults `landingAt` to a percent-based center of the radar (`{percent: {x:50, y:50}}`) when `--landing` is omitted. Owner can fix it after authoring. Is that the right default or should the CLI refuse to write without a landing?

- **Default:** write with the placeholder, owner edits later.
- **Why:** unblocks fast capture from console without needing a second setpos.
- **Owner verdict:** ____________________

### Q-7 · Mobile experience (375px viewport) — the 2×2 walkthrough is locked at 2×2 (per requirement N5), but at that width the cards are tiny (~170px square). Is that acceptable, or should we add a "tap a card to fullscreen it" interaction on mobile?

- **Default:** small but readable. No tap-to-zoom.
- **Why:** simpler; the owner specifically wanted to see all 4 at once.
- **Owner verdict:** ____________________

### Q-8 · The Steam deep-link uses `+sv_cheats 1`. On official matchmaking servers cheats are off, so the link only works on practice / community servers. Should the link encode that limitation in the button label?

- **Default:** button label says "Open in CS2 (steam://)" with no warning.
- **Why:** the owner is using this for personal/practice anyway.
- **Owner verdict:** ____________________

### Q-9 · The "loose" CT position cards have a single `utilityFocus` free-text field. The owner described it as "not hyper specific." If we want to enrich it later (e.g., "smoke long at 0:10" timing tags), do we add structured fields or keep it freeform?

- **Default:** freeform text.
- **Why:** matches the user's "loose guide" framing.
- **Owner verdict:** ____________________

### Q-10 · There are no automated **accessibility** tests. The audit found that the SVG spawn picker is technically keyboard-inaccessible. Should we add Playwright tests that exercise Tab navigation + Enter activation?

- **Default:** no a11y tests; the owner is a mouse/touch user.
- **Why:** the existing tests already cover click-based selection. Keyboard a11y is a secondary requirement.
- **Owner verdict:** ____________________

### Q-11 · The deploy is GitHub Pages. The owner asked earlier if Proxmox would be "easier" — answered "no" in `docs/DECISIONS.md` ADR-003. Status of that question?

- **Default:** Pages. ADR-003 locks it pending a server-side feature trigger.
- **Owner verdict:** ____________________

### Q-12 · The URD section §4 lists FR-13 (list view of all lineups) as ✗ Not implemented. Is this still wanted, or has the CT position guide + scenario action lists sufficiently surfaced lineups?

- **Default:** not implemented. The audit flagged it as the biggest miss. *(2026-05: Instant Smokes tab partially answers this — a flat list of a SUBSET. A full "all lineups" list is still missing.)*
- **Owner verdict:** ____________________

### Q-13 · Instant Smokes radius threshold (1500 world units)

- **Default:** lineups whose `throwFrom` is within 1500 world units of a spawn count as "instant from spawn."
- **Why:** roughly the distance covered in 3–4 seconds of running. Captures throws from spawn and from one-step-out-of-spawn.
- **Risk:** too loose → list bloats with throws that aren't really "instant." Too tight → useful throws missed.
- **Owner verdict:** does this threshold match what you'd call "instant"? ____________________

### Q-14 · Map tab cluster radius (150 world units)

- **Default:** lineups whose `throwFrom` is within 150 world units of each other share a single marker.
- **Why:** roughly one player-width. Captures lineups thrown from "the same spot" with minor pixel-perfect variation (left-foot vs right-foot of a corner).
- **Risk:** too loose → distinct throw spots collapse into one marker. Too tight → adjacent spots look like cluttered duplicates.
- **Owner verdict:** does this match your "same spot" intuition? ____________________

### Q-15 · Spawn rush matrix direction — T-only, or both sides?

- **Default:** matrix is T-side only ("if I rush from T-6, I beat CT-2 to mid"). No CT-side analogue.
- **Why:** owner's quote specifies "If I were to rush with best spawn who would I beat on the opposite team" — T-side rushes are the canonical case.
- **Owner verdict:** do you want a parallel CT-side matrix ("if I anchor from CT-3, T-X will reach me before T-Y")? ____________________

### Q-16 · Defaults tab data depth

- **Default:** 4 plant spots (A-default, A-goose, B-default, B-window), 7 timings, 4 spawn rushes — starter set.
- **Owner verdict:** flesh out more (plant per smoke style, post-plant timings, rushes from every T-spawn)? Or is this depth sufficient? ____________________

---

## B. Resolved decisions (with the WHY recorded so we don't re-litigate)

### R-1 · Spawn dots use a SHRUNKEN visible-only click target (no transparent overflow zone)

- **Decided:** 2026-05-21 turn 4 (after owner reported "clickable area is off").
- **What we tried:** A wide r=2.6 transparent hit circle with `pointerEvents="all"`.
- **Why we rolled back:** adjacent CT spawns are only ~1.7 viewBox-units apart in cluster zoom. The r=2.6 hit zones overlapped; SVG z-order routed clicks to the later-drawn spawn, so clicking CT-3 selected CT-4.
- **Final shape:** visible dot is the only click target. Dot enlarged 0.85 → 1.05 (picked 1.4) to compensate.
- **Test:** `tests/e2e/spawn-hitbox.spec.ts` — 5 cases including CT-3 and CT-4 specifically.

### R-2 · Spawn labels render `t-1`..`t-15` and `ct-1`..`ct-5`

- **Decided:** 2026-05-21 turn 4.
- **What we changed:** labels in `dust2.json` from `S1`..`S15` to `T-1`..`T-15`; render lowercase in the picker.
- **Why:** voice ambiguity ("spawn 3" → which side?). Side prefix eliminates miscommunication on Discord calls.
- **Tooltip text:** simplified from `"T S6 — setpos ..."` to `"T-6 — setpos ..."` (no more redundant side).

### R-3 · Black halo on dots + paint-order stroke on text labels

- **Decided:** 2026-05-21 turn 4.
- **Why:** the radar has green spawn-area patches and grey building patches. Bare colored dots without an outline blend into both. A black halo (55% opacity) + SVG `paintOrder="stroke fill"` on text creates legibility-on-anything.

### R-4 · CT position guide as data, not hardcoded

- **Decided:** 2026-05-21 turn 4.
- **Why:** the owner explicitly wanted to edit roles over time. Hardcoding would force a code change for every adjustment.
- **Schema:** `ctPositions: CtPosition[]` in `dust2.json`. Boot validator ref-checks `recommendedLineupIds`.

### R-5 · `SELECT_LINEUP` from home (via CT-guide chip) is a valid transition

- **Decided:** 2026-05-21 turn 4 (resolving audit finding B-2).
- **What we changed:** reducer's BACK from a lineup view checks if `activeScenarioId` is set; if not, returns home directly (skips the orphan scenario view).
- **Why:** the CT position guide opens lineups without a scenario context. Pre-fix, BACK landed users on a blank "scenario view with null scenario."

### R-6 · Visual regression via Playwright `toHaveScreenshot`

- **Decided:** 2026-05-21 turn 5 (in response to owner's "tons of issues like that in the past").
- **Why:** unit tests can't see what the user sees. Playwright pixel-diff baselines catch layout breaks, missing images, color regressions, font-rendering changes.
- **Tolerance:** `maxDiffPixelRatio: 0.01` — 1% pixel drift allowed to survive font hinting differences across machines.
- **Baselines:** committed under `tests/e2e/__screenshots__/`. Updated via `npm run test:e2e:update` after intentional UI changes.

### R-7 · The three-hat document set IS the intermediary

- **Decided:** 2026-05-21 turn 5.
- **The three hats:**
  - **Business Analyst** → writes `USER_REQUIREMENTS.md`. Lists what the owner asked for, verbatim quote → requirement → status.
  - **Project Manager / Architect** → writes `SOLUTION_DESIGN.md`. Translates requirements into observable behavior + data shape + navigation, without code.
  - **Annoying-junior-dev** → writes **this file**. Surfaces every decision that wasn't explicit in the URD.
- **Plus** `CLEAN_ROOM_BRIEF.md` — a digest another LLM could rebuild from without copying code.

### R-8 · CLI helpers exist for lineups and scenarios but NOT for CT positions

- **Decided:** 2026-05-21 turn 4.
- **Why:** CT positions are a small set (5–10 max). The CLI scaffolding cost > the convenience.
- **Tradeoff:** owner edits `ctPositions` in JSON manually.

### R-9 · Pages deploy stays on `npm run validate` (vitest + node:test), NOT including Playwright E2E

- **Decided:** 2026-05-21 turn 5.
- **Why:** E2E adds 30+ seconds and requires a dev server. Keeps the deploy fast.
- **When does E2E run?** Locally via `npm run test:e2e`. Could be added to CI later if false-positive rate stays low.
- **Concern:** an E2E regression might ship to production without catching it. Mitigated by the unit + component tests covering most paths.

### R-10 · Hat 3 (this document) gets updated EVERY commit that introduces a new decision

- **Mandate:** if the next commit makes a choice that wasn't explicit in the URD, the choice goes in §B with the WHY.
- **Why:** prevents the "wait, why did we…" tax six months from now.

### R-11 · Home is sectioned into four FIXED-ORDER tabs

- **Decided:** 2026-05-21 (owner reframe — "the primary audience is an autistic 25-year-old that needs structure").
- **Tabs:** Defaults · Scenarios · Instant smokes · Map. Default is Scenarios on first load.
- **Why this order:** Defaults first (the "what's true on every round" reference) → Scenarios (the headline coordination flow) → Instant smokes (the fast-path subset of lineups) → Map (the deep-explore view). Mirrors the user's mental zoom from "general rules" → "team play" → "this round" → "free exploration."
- **Why fixed:** the structure-craving audience needs muscle memory. Reordering tabs across sessions would break that.
- **Test:** `tests/e2e/home-tabs.spec.ts > all four tab buttons are present in order`.

### R-12 · Spawn icon is a single shape: dot WITH bare number inside (no prefix, no floating label)

- **Decided:** 2026-05-21 (owner: "I can't select t-15 then select t-14 because the t-15 clickable area is above t-14 clickable. I want the number instead of the spawn icon without 'ct-' or 't-' prefix.").
- **What we changed:** the radar icon now shows just "15" / "3" INSIDE the dot, no "t-" / "ct-" prefix, no separate text element floating above.
- **What stayed:** the chip below the picker still shows the full label ("Spawn: T-6") for unambiguous reference.
- **Why no prefix on the icon:** the side toggle above the picker already disambiguates. Showing "t-15" forced the dot too small to comfortably land on at cluster zoom.
- **Why picked/unpicked dots share radius:** earlier inflated-picked-dot covered the adjacent unpicked spawn's click center, making the swap fail. Picked state is now signalled by fill + text color only.
- **Tests:** `tests/e2e/spawn-click-target.spec.ts` — 8 cases including the exact T-15 → T-14 regression and CT-3 → CT-4 overlap-stealing case.

### R-13 · Map tab is ORIGIN-FIRST, not destination-first

- **Decided:** 2026-05-21 (owner reframe: "this is a different approach from websites like cs2util.com and csnades.gg that show the place you are trying to smoke then shows you where you can throw it from").
- **What:** the Map tab marker is a throw-from position. Clicking it reveals lineups thrown FROM that spot.
- **Why:** owner's mental model is "I'm at this spot, what can I do?" — not "I want to smoke X, where do I throw from?"
- **Cluster radius:** 150 world units (see Q-14).
- **Trade-off:** users coming from cs2util / csnades will need a moment to adjust. Worth it for the owner's preferred ergonomics.

## C. Things I'm worried about (the annoying junior is anxious)

These aren't questions for the owner; they're things I'm tracking that could bite us. The annoying junior is supposed to be paranoid.

### W-1 · The dust2.json file is now 1000+ lines. It will keep growing. At what point does it need to be split per-entity?

- **Trigger:** if scenarios > 30 or lineups > 50, consider file-per-entity in `src/data/dust2/{lineups,scenarios,ctPositions}/*.json` aggregated at build time.
- **Indicator:** PR diffs become hard to review.

### W-2 · The screenshot baselines under `tests/e2e/__screenshots__/` will drift on different operating systems

- **Cause:** font rendering differs Mac vs Linux. CI ubuntu vs my local Mac.
- **Mitigation:** baselines should be regenerated on CI (or in a Docker container) for true cross-platform stability. Currently baselines are generated locally.
- **Risk:** Playwright tests in CI may fail with "snapshot differs."
- **Fix path:** if CI flakes, regenerate baselines inside a CI run with `--update-snapshots` and commit those.

### W-3 · The CLI tests duplicate the setpos regex from `parseSetposCommand.ts`. If the regex ever changes, both copies must update.

- **Mitigation:** `scripts/new-lineup.test.mjs` mirrors the canonical inputs from `parseSetposCommand.test.ts`. Any drift fails CI.
- **Indicator:** if a setpos test passes in one suite and fails in the other, the regex copies diverged.

### W-4 · GitHub Pages caches aggressively. After a push, the live site can serve stale assets for ~5 minutes.

- **Mitigation:** Vite generates content-hashed asset names. New deploys break old caches.
- **Concern:** users may see stale HTML pointing at new asset hashes — but the HTML is also hash-named on deploy.

### W-5 · The radar PNG is 175 KB. On a slow 3G connection it could take 2+ seconds to load. The "Loading radar…" overlay used to mask this but my fix may have left it permanently hidden.

- **Status:** verified locally that the overlay shows during initial load and hides on `onLoad`. But: if a user has the image already cached, `onLoad` fires BEFORE React attaches the listener, leaving the loaded state false forever and the overlay covering the radar.
- **Mitigation:** The `radar-loads.spec.ts` E2E test asserts the overlay text is NOT visible after page load — catches the failure mode if it returns.

### W-6 · The owner has merged PR #13, #14, #15, #16 already. PR #17 is pending. The branch model is "long-running feature branch off main, merge often, never reuse." It's working, but the merge cadence is high.

- **Concern:** if multiple commits stack on a branch without merging, the cherry-pick / rebase risk grows.
- **Mitigation:** merge fast, branch fresh each time.

### W-7 · The `npm run new-lineup` CLI doesn't currently write to `git` — it just edits the JSON. If the owner forgets to `git add` the new file, the screenshots may ship without the lineup that references them.

- **Mitigation:** the README + USER_GUIDE document this. Could be tightened by having the CLI run `git add` itself.
- **Current state:** documented, owner-managed.

### W-8 · The CT position guide assumes the owner knows what an "anchor" is. New users coming to this code (if any) won't.

- **Mitigation:** glossary in USER_REQUIREMENTS.md §13.
- **Concern:** the glossary could fall out of sync with the actual entity vocabulary. Owner verdict needed on whether to add a CI check that catches glossary drift.

### W-9 · There are no tests for the `App` component's `popstate` handler, the keydown-Esc handler, or the asymmetric BACK rule for lineup-without-scenario.

- **Status:** reducer-level test covers the new BACK rule (R-5). App-level integration test would be the next addition.
- **Priority:** medium. The unit-level reducer test catches the core logic; App-level adds another layer of confidence.

### W-10 · "Drastically increase testing" is a directive without a stopping condition. I could keep adding tests forever.

- **Current discipline:** every reported bug becomes a test. New features get unit + (where possible) component + E2E coverage.
- **Stopping criterion:** when the bug rate going INTO main approaches zero AND CI runtime stays under 60 seconds.
- **Question to owner:** is that the right criterion, or should we adopt a coverage % target?

### W-11 · The visual snapshot baselines in `tests/e2e/visual-snapshots.spec.ts-snapshots/` cover home (T + CT side) and scenario detail. They do NOT cover the Defaults / Instant smokes / Map tabs.

- **Risk:** a visual regression on those tabs (e.g. layout broken by a CSS change) wouldn't be caught by the snapshot suite.
- **Mitigation path:** add three more snapshot tests — one per uncovered tab. Owner gut-check before doing so: does the snapshot churn cost outweigh the regression-catch value?
- **Tracked:** documenting here so this gap is explicit, not silent.

### W-12 · The `defaults.spawnRushes[].fromSpawnId` / `.beatsSpawnIds` / `.losesToSpawnIds` are NOT cross-validated by the boot loader

- **Risk:** a typo like `fromSpawnId: "t-99"` (no such spawn) would render a broken row in the Defaults tab without throwing.
- **Why not fixed yet:** the rest of the validator (scenarios, ctPositions) does check these; spawnRushes was added late and not back-filled.
- **Fix path:** extend `loadDust2.ts` to walk `defaults.spawnRushes` and verify every spawn id resolves. Owner verdict needed on whether to ALSO fail if `defaults.plants[].percent` is outside [0..100] (defensive vs strict trade-off).

### W-13 · The Map tab's marker clustering is greedy / order-dependent

- **Cause:** `clusterThrowFroms()` iterates lineups in array order, adding each to the first existing cluster within radius or creating a new cluster. Re-ordering the lineup array could re-partition clusters.
- **Mitigation:** cluster keys are recomputed as sorted-id-joins, so the visible identity is stable regardless of which lineup created the cluster. The CLUSTER PARTITIONING itself can change.
- **Real-world impact:** low for the current 10 lineups; possibly noticeable past ~50 lineups. Re-architect to a proper density-based clustering (e.g. DBSCAN-lite) if this bites.

---

## D. The annoying junior's commit-time checklist

Before pushing ANY change, the annoying junior asks:

1. Did this change introduce a new decision that isn't already in the URD? → add to §A (open) or §B (resolved) of THIS document.
2. Did this change touch the data shape in `dust2.json`? → update `src/types.ts`, the loader's validator, and add a loadDust2 test case.
3. Did this change touch the visible UI? → regenerate visual snapshots OR mark a snapshot diff as expected.
4. Did this change fix a reported bug? → write a regression test that would have caught the bug (E2E preferred).
5. Did this change deprecate a behavior? → update USER_REQUIREMENTS.md status from ✓ to ✗ with a `superseded` note.
6. Did this change touch the navigation reducer? → cover every new branch with a test.
7. Did this change touch the screenshot resolver (`resolveAsset`)? → verify both dev (`/`) and prod (`/cs2-utility-playbook/`) BASE_URL.
8. Did this change touch an enum (utility type, throw style, side, etc.)? → search every consumer.
9. Did this change rename a field? → run the boot validator + the byte-equality data tests.
10. Did this change add a dependency? → justify it in `docs/DECISIONS.md` ADR table.

If any answer is "yes" and the corresponding action isn't done, the annoying junior STOPS the commit.

---

> Last updated: 2026-05-21 — after 4-tab home restructure (Defaults/Scenarios/Instant smokes/Map) + number-in-dot spawn icon contract (R-11, R-12, R-13; W-11, W-12, W-13).
