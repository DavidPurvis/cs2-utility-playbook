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

- **Default:** not implemented. The audit flagged it as the biggest miss.
- **Owner verdict:** ____________________

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

---

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

> Last updated: 2026-05-21 — after spawn-hitbox fix + E2E suite landing + this document being created.
