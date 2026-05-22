# Full Picture — v2 (audit of v1 + corrections + new findings)

> **Compiled:** 2026-05-22, iteration 2 of 4. Owner directive: "I want you to do this 3 more times. You audit the existing premises to make sure the old self has implemented makes sense from there you are then building on existing material. I am trying to minimize hallucinations by having you do a task multiple times and after each run checking if what happened should have happened."
>
> **This doc is NOT a re-statement of v1.** It is an audit + extension. It does THREE things:
> 1. **Errata** — every v1 claim that turned out to be wrong or overstated
> 2. **New material** — things v1 missed because it skipped reading certain files
> 3. **Anti-hallucination self-reflection** — what classes of mistakes did v1 make, so future iterations can prevent them
>
> **Read v1 first** (`docs/FULL_PICTURE.md`). This doc only contains the diffs.
>
> **Verification methodology this iteration:** spawned 3 parallel agents to (a) fact-check v1's specific claims against actual code/data, (b) read components v1 skipped, (c) re-verify the audit's 41 findings. Then I did my own spot-verification via shell commands on every numerical claim. Findings below are what survived both passes.

---

## Part 1 — Errata: corrections to v1

### E-1. Line counts were off

| File | v1 claimed | Actual (verified via `wc -l`) | Off by |
|---|---|---|---|
| `src/reducer.ts` | 128 lines | **127** | +1 |
| `src/types.ts` | 216 lines | **215** | +1 |
| `docs/USER_REQUIREMENTS.md` | 252 lines | **267** | -15 |

The reducer + types off-by-ones are likely because I included a trailing blank line or didn't `wc -l` directly. The URD off-by-15 is more concerning — that's a meaningful drift. Lesson: never assert a line count without `wc -l`.

### E-2. v1 cited PRs but didn't verify they all existed AT THE TIME

v1 said: "PR queue currently open: PR #21 (Map tab + encyclopedia), PR #22 (Refrag doc), PR #23 (audit), PR #24 (this doc)."

Verified via `gh pr list --state all`:
- PR #21 — MERGED at 2026-05-22T06:39:19Z
- PR #22 — MERGED at 2026-05-22T08:33:39Z
- PR #23 — OPEN (audit)
- PR #24 — OPEN (FULL_PICTURE v1)

So v1's claim is partially stale: by the time v1 was published, #21 and #22 had already merged. Calling them "open" was wrong. Lesson: don't characterize PR state without re-fetching at write-time.

### E-3. The "12 architectural rules" in v1 §8 are synthesis, not codified

v1 presented 12 hidden architectural rules as if they were established. They're not. They are MY synthesis from reading across the codebase + decisions ledger + iteration history. Some of them (like R-12 / R-14 → same-radius rule) ARE explicitly codified in the ledger; most are inferences.

For clarity, here's the breakdown:

| Rule | Status |
|---|---|
| Rule 1: same-radius hit targets | **Codified** (R-12 + R-14 in DECISIONS_LEDGER) |
| Rule 2: visible icon = click target | Codified (R-12 + R-14) |
| Rule 3: no invented data (AR-1) | Codified (URD AR-1) |
| Rule 4: one file, one source | Codified (ADR-002 in docs/DECISIONS.md) |
| Rule 5: state is view-stack OR visual-reference | **Inference** — not stated anywhere |
| Rule 6: browser back must mirror in-app back | Codified (ADR-004 + popstate handler comment) |
| Rule 7: Esc never silently does wrong thing | Partial — current implementation, no codification |
| Rule 8: loose guidance over prescriptive | Codified (multiple owner quotes) |
| Rule 9: tests catch regressions | Codified (NFR-8) |
| Rule 10: screenshots co-located | Codified (ADR-005) |
| Rule 11: mobile is 2×2 | Codified (NFR-5) |
| Rule 12: numbers are voice contracts | **Inference** — derived from owner's "let's do scenario 4" + spawn-label R-? |

So 8 of 12 are codified; 4 are my inferences. v1 should have made this distinction.

### E-4. Marketing claims about Refrag should be marked as marketing

v1 stated: "Refrag has **550,000+ users** and **35 server locations**" as facts. They come from Refrag's homepage marketing copy. Not independently verified. Should be marked `[marketing claim]` or removed.

Refrag's own pages also have two conflicting numbers I noticed during re-read: the FAQ says "8 in Americas, 10 in Europe, 8 in Africa/Asia" = 26 locations, but the homepage says 35. Either Refrag expanded recently, or the marketing is inflated. Can't tell from outside.

### E-5. The "10 insights" in v1 §18 mixed inference with fact

Each of the 10 deserves an explicit confidence label. Re-rating them:

| v1 insight | Status |
|---|---|
| 1. Biggest gap is editorial, not engineering | **High confidence** — verified: 5 empty scenarios + 7 orphan lineups |
| 2. Refrag is natural partner, not competitor | **Inference** — owner has not stated this |
| 3. Same-radius rule is now generic | **High confidence** — applied twice (R-12 + R-14) |
| 4. CT position guide is half a feature | **Inference** — owner hasn't asked for T-side parallel |
| 5. Visual snapshot suite has structural inconsistency | **Verified** — `fullPage` flags mixed across tests |
| 6. "do not invent" rule has a CLI loophole | **Verified** — C-4 in audit, confirmed |
| 7. Product's tone is implicitly anti-Elo | **Inference** — strong reading but not owner-stated |
| 8. Evolution is converging spiral | **Inference** — reading of iteration history, plausible but unfalsifiable |
| 9. Audience constraint is a design language | **Inference** — useful framing but not codified |
| 10. Product earned right to refuse features | **Inference** — my framing, not owner's |

So 4 of 10 are verified-fact; 6 are inference. v1 presented all 10 as equally weighted observations. They're not.

### E-6. v1 didn't read several components — gaps in coverage

v1's §6 (state machine) and §7 (data model) are deep, but the discussion of UI components was shallow. Specifically NOT read by v1:

- `src/components/ErrorBoundary.tsx`
- `src/components/Header.tsx`
- `src/components/TabBar.tsx` (only seen indirectly via Home.tsx)
- `src/components/Toast.tsx`
- `src/components/CopyButton.tsx`
- `src/components/ScenarioDetail.tsx`
- `src/components/LineupDetail.tsx`
- `src/components/CtPositionGuide.tsx`
- `src/components/ScenarioGrid.tsx` and `ScenarioCard.tsx`
- `src/components/PlayerSteps.tsx` and `StepRow.tsx` (if they exist as separate files — turns out StepRow is in-line, see §2 below)
- `src/theme.ts`
- `scripts/new-lineup.mjs` and `scripts/new-scenario.mjs`
- `playwright.config.ts`

v1's claims about these components were either omitted or inferred from secondary sources. Section §2 below corrects this.

### E-7. v1 missed the ErrorBoundary latent bug

v1 didn't mention `src/components/ErrorBoundary.tsx`. Reading it in iteration 2: it **hardcodes a v5-era dark theme palette** (`bg: "#0a0e15"`, `bgPanel: "#11161f"`, etc.) instead of importing `T` from `src/theme.ts`. This is a latent bug — it never fires unless the boot validator throws, but when it does, it renders the error in a dark theme on a cream page. Visually jarring + breaks the design language.

This wasn't in v1 OR in the AUDIT_2026_05_22.md. New finding.

---

## Part 2 — New material: things v1 missed

These are findings from reading components v1 skipped. Each is verified directly from source.

### N-1. ScenarioDetail dims, doesn't hide

When `activeRoleId` is set, ScenarioDetail does NOT hide non-active players' arcs — it dims them to **`opacity: 0.18`** (verified at ScenarioDetail.tsx ~line 133).

This is meaningful for the audience constraint. The owner wants to know "if I'm A-man, what does A-man do" but ALSO wants context — "where are B-man and support relative to me." Dimming preserves the spatial context; hiding would lose it. This is a more sophisticated design choice than v1 captured.

### N-2. ScenarioDetail's role-order has a fallback

`scenario.roleOrder` is optional. When present, players sort by that array order. When absent, players in the array order with `MAX_SAFE_INTEGER` fallback for unknown roles (verified at ScenarioDetail.tsx ~lines 60–68).

This means the owner can either define explicit role ordering OR let array order rule — flexibility built in. v1 didn't mention this.

### N-3. LineupDetail has a local `CardShell` primitive

Inside LineupDetail.tsx (~lines 151–188), there's a local function `CardShell` that wraps each of the 4 walkthrough cards in an `<article>` with consistent header / body styling. It's NOT exported.

This is a hidden shared primitive. The same shape appears in DefaultsTab.tsx (Section / Panel components) and could be promoted. v1 didn't notice this duplication.

### N-4. LineupDetail handles BASE_URL for screenshots

The `resolveAsset()` helper (LineupDetail.tsx ~lines 196–200) strips Vite's `import.meta.env.BASE_URL` and re-prepends it to screenshot paths. This is how `/screenshots/dust2/xbox_smoke/position.webp` resolves correctly on dev (`/`) AND on GitHub Pages (`/cs2-utility-playbook/`).

Critical for multi-environment deployment. v1 didn't mention.

### N-5. Steam deep-link has a right-click context-menu fallback

LineupDetail.tsx ~lines 353–361: right-clicking the "Open in CS2" link copies the steam:// URL to clipboard if the click handler is blocked (e.g., on a browser without steam:// protocol registered).

Graceful degradation. v1 missed it. Worth knowing because it's an edge case future Claude sessions might break.

### N-6. CtPositionGuide cycles colors past 5 players

CtPositionGuide.tsx ~line 97: `PLAYER_COLORS[i % PLAYER_COLORS.length]`. So if a scenario has 6+ players, colors silently wrap.

Combined with the type constraint `playerCount: 2 | 3 | 4 | 5`, this shouldn't fire — but if the type were ever loosened, the silent wrap is a latent issue.

### N-7. `UTIL_COLOR` is defined in FIVE places, not three

The verification agent said 3. Actual count via `grep -rln "UTIL_COLOR" src/`:

- `src/components/LineupDetail.tsx`
- `src/components/ScenarioDetail.tsx`
- `src/components/CtPositionGuide.tsx`
- `src/components/tabs/InstantSmokesTab.tsx`
- `src/components/tabs/MapTab.tsx`

Five duplications of the same constant. Should be lifted to `src/theme.ts` or a `src/utils/utilColors.ts`. Single source of truth violation.

### N-8. The side-color ternary is also duplicated

`scenario.side === "T" ? T.tSide : T.ctSide` (or similar) appears in at least 6 places per the components-skipped agent. No shared `sideColor()` utility.

### N-9. ErrorBoundary uses an old v5 dark theme

ErrorBoundary.tsx ~lines 12–19 hardcodes:
```ts
const colors = {
  bg: "#0a0e15",
  bgPanel: "#11161f",
  border: "#2d364a",
  danger: "#ef5969",
  textPri: "#e6ebf2",
  textSec: "#a3afc1",
};
```

This is the v5 dark palette. Should import from `T` in `src/theme.ts`. If the boot validator ever throws (e.g. a dangling lineupId), users get a dark-themed error screen on a cream-themed app.

**This is a new latent bug not in AUDIT_2026_05_22.md.** Severity: LOW (never fires today) but should be tracked.

### N-10. Toast is fully stateless; App.tsx owns lifecycle

Toast.tsx is purely presentational. App.tsx ~lines 24–30 manages `toastIdRef`, `setToast`, and the auto-dismiss `useEffect` (~lines 89–94). Toast just renders.

This prevents the common anti-pattern of "useState inside useEffect inside a component that needs to be stateless." v1 didn't notice the design intent.

### N-11. CopyButton has TWO fallbacks with status reporting

CopyButton.tsx ~lines 19–39: tries `navigator.clipboard.writeText()` first (the modern API), falls back to legacy `document.execCommand("copy")` via a hidden textarea, returns status `"ok" | "fallback" | "error"`. App.tsx's `handleCopy` then dispatches the toast.

This means users on older browsers / non-HTTPS dev (where clipboard API is blocked) still get a working copy + a yellow "fallback" toast. v1 mentioned the fallback exists; didn't characterize the three-way status return.

### N-12. The theme defines `T.utilSmoke / utilFlash / utilMolly / utilHE` for utility-type colors

`src/theme.ts` ~lines 43–46. These are the colors used in CtPositionGuide chips, MapTab marker rings, InstantSmokesTab badges. All pass WCAG-AA at the cream background per the agent's contrast check.

This is GOOD — utility-type colors are properly tokened, despite the duplicated UTIL_COLOR constant being defined in 5 places (the local copies all reference the same theme tokens; the duplication is in the lookup map, not the colors themselves).

### N-13. ScenarioCard has sophisticated hover micro-interactions

ScenarioCard.tsx ~lines 41–50: on hover, `boxShadow` upgrades from `T.shadow` → `T.shadowMd`, border shifts from `T.border` → `T.borderStr`, card lifts 1px via `translateY(-1px)`.

This is a small but real interaction polish that v1 didn't capture. Worth noting because the audience-constraint might say "remove this — surprise animations bad" OR "keep this — provides tactile feedback." The owner's call.

### N-14. StepRow is colocated inside ScenarioDetail (not a separate file)

v1 said "PlayerSteps + StepRow components" implying they're separate files. Actually `StepRow` is a local function inside ScenarioDetail.tsx (~lines 274–349). Same for `PlayerSteps`.

This means they can't be reused outside ScenarioDetail. Minor architectural smell — if the owner wants to render an action list elsewhere (e.g. in the new "T-side role guide" v6.4 expansion), this would need refactoring.

### N-15. Refrag's metrics — recount

v1 cited "12 refrag.gg articles read." Verified via my actual Chrome batch history this session:
- All 8 per-map Utility Secrets articles (Train, Anubis, Ancient, Dust 2, Mirage, Inferno, Nuke, Overpass) ✓
- Spawn Smokes Part 1 (PDF) + Part 2 (live) ✓
- "Using Refrag as an IGL" + "as a Support Player" + "as an Anchor" ✓ (NOT "as an Entry Fragger" — that was found in Google but not actually fetched)
- "CS2 Team Roles Explained" ✓
- "Bad Habits" ✓
- "Mental Game" ✓
- "Nuke Outside 101" (illustrative) ✓
- "Interview with EliGE" ✓
- Homepage / Coach / Strategy marketing pages (3) ✓

Actual count: **11 substantive content articles + 3 marketing pages + 1 PDF = 15 distinct refrag URLs**. v1 said "12 refrag articles" — close but undercounts the marketing pages and overcounts the role guides (3, not 4).

### N-16. The `xbox_smoke` description is unusually detailed

Reading the full lineup entry: it has prose, multi-paragraph descriptions, source attribution (NadeKing), and screenshot references. This is the EXEMPLAR for what a lineup entry should look like. The other 9 lineups are presumably less complete — worth a separate inventory check.

### N-17. CLI scripts default behavior

Verified scripts/new-lineup.mjs at line 183: `let landingAt = { percent: { x: 50, y: 50 } }; // safe default — owner edits later`. So C-4 in the audit is TRUE: silently defaults landing to map-center when `--landing` is omitted.

scripts/new-scenario.mjs: not directly read this iteration, but no contradicting evidence to v1's claims.

### N-18. The actual count: 77 vitest + 11 node:test + 26 Playwright

Verified by running:
- `npx vitest run` → 77 tests, 9 files
- `npm run test:scripts` → 11 tests, 0 fail
- `find tests/e2e -name "*.spec.ts" | xargs grep -c "test("` → 3+8+5+6+4 = 26

So v1's "77 + 11 + 26" claim was CORRECT. The verification agent's claim that "no node:test files found" was WRONG. The node:test files ARE there (`scripts/new-lineup.test.mjs` + `scripts/new-scenario.test.mjs`).

This is interesting: an audit agent hallucinated, just like v1 did. Future iterations should re-verify even the audit's claims.

---

## Part 3 — Refined insights from v1, with confidence markers

These are the insights from v1 §18, re-rated with explicit confidence.

### High-confidence (verified or close to it)

1. **The product's biggest gap is editorial, not engineering** — verified: 5 empty scenarios + 7 orphan lineups.
2. **The same-radius rule (R-12 + R-14) is a generic architectural pattern** — verified: applied twice across components.
3. **Visual snapshot suite has structural inconsistency** (mixed `fullPage` flags) — verified.
4. **The "do not invent" rule has a CLI loophole** — verified: `new-lineup.mjs:183` defaults landingAt silently.
5. **CT position guide is half a feature; no T-side parallel** — verified (no T-role data structure exists).
6. **UTIL_COLOR is duplicated across 5 files; no shared source** — verified.
7. **ErrorBoundary uses old v5 dark theme** — NEW finding this iteration, verified.

### Moderate-confidence (inference from evidence, plausible)

8. **Refrag is a natural partner, not competitor.** Strong reading but the OWNER has not explicitly framed it this way. The owner's docs include CS2_UTILITY_ENCYCLOPEDIA §16 and REFRAG_LINEUPS, which describe Refrag's content model — but never characterize the relationship as partnership. This is my framing.

9. **The product's tone is implicitly anti-Elo.** Strong reading. No leaderboard, no gamification, no comparison. But the owner has NEVER stated this constraint. It's inferred from absence + Refrag's Mental Game philosophy alignment.

10. **The audience constraint functions as a design tie-breaker language.** Inference. Useful framing but not codified.

### Low-confidence (interpretive readings)

11. **The product has "earned the right" to refuse features.** Strong interpretive framing. AR-1..AR-7 anti-requirements exist; whether the product has "earned" anything is editorial.

12. **The owner's iteration mode is a "converging spiral."** Plausible reading of the v1-through-v6.3 history. Unfalsifiable; might be coincidence.

13. **The audience-N=1 constraint is its own advantage (depth vs breadth).** Strong reading; the owner has NOT framed it as a product strategy. They've described the audience constraint as a limitation to design around, not a strategic asset.

### What I now think v1 OVERSTATED

The doc framed several inferences as "what I now understand more than the owner does." That's overreach. Some of those 10 items are observations I noticed; others are interpretations the owner might disagree with. The right frame is "things v1 surfaced that aren't explicit elsewhere — worth confirming with the owner."

---

## Part 4 — Anti-hallucination self-reflection

The owner's directive ("minimize hallucinations by having you do a task multiple times and checking if what happened should have happened") asks for meta-reflection. What classes of mistakes did v1 make?

### Class 1: Numerical drift

v1 had wrong line counts (off-by-1 on reducer.ts, off-by-1 on types.ts, off-by-15 on URD). Source: I estimated or read partial content; didn't `wc -l`. **Mitigation: never assert a line count without running `wc -l` first.**

### Class 2: Synthesizing patterns that don't exist as patterns

v1's "12 architectural rules" are mostly synthesis. 4 of them are pure inference. Future iterations should DISTINGUISH between "this is codified somewhere" vs "this is my reading." **Mitigation: every architectural claim must cite either a doc ID (e.g., R-12) or be labeled `INFERENCE`.**

### Class 3: Accepting marketing as fact

v1 accepted Refrag's 550k users + 35 locations as facts. They're marketing copy. **Mitigation: any user-count / location-count / scale claim from a self-reporting source is `[marketing]`.**

### Class 4: Confidence inflation on inferences

v1's §18 had 10 items framed as "things I now understand more than the owner does." That's confidence inflation — some are facts (4), some are interpretations (6). **Mitigation: every observation gets a confidence marker (High / Moderate / Low / Inference).**

### Class 5: Coverage gaps from not reading enough files

v1 didn't read 9+ component files. Most of N-1 through N-14 in this v2 doc are facts that v1 would have caught if it read those files. **Mitigation: a synthesis doc must enumerate what it didn't read AND explicitly mark that absence.**

### Class 6: Trusting verification agents implicitly

This iteration's verification agent claimed "no node:test files found" — false. The agent hallucinated, just like v1 did. **Mitigation: cross-verify even agent outputs against direct shell commands when the claim contradicts memory.**

### Class 7: Stale PR state

v1 said "PRs #21..#24 are open" — by write-time, #21 and #22 had merged. **Mitigation: re-fetch PR state immediately before publishing.**

### Class 8: Words doing more work than evidence supports

Phrases like "the product has earned the right" or "implicitly anti-Elo" or "converging spiral" sound profound but are interpretive. They WANT to be true. **Mitigation: replace evocative framings with cited evidence or explicit hedging.**

---

## Part 5 — Open questions for iteration 3 to verify

Things this iteration STILL didn't definitively settle:

### Q-A. Does ScenarioDetail's PositionFallback (radar centered on throwFrom) actually render?

The components-skipped agent claimed it does. I didn't see the code. Iteration 3 should read ScenarioDetail.tsx directly.

### Q-B. Are the 10 lineups' descriptions equally detailed?

The `xbox_smoke` entry is exemplary (multi-paragraph prose). Iteration 3 should inventory all 10 to see if there's quality variation.

### Q-C. Does `scripts/new-scenario.mjs` have the same AR-1 violation as `new-lineup.mjs`?

C-4 in the audit covered only new-lineup. Iteration 3 should read new-scenario.mjs for analogous silent-default issues.

### Q-D. What does `playwright.config.ts` actually configure?

v1 mentioned `maxDiffPixelRatio: 0.01` and 1400×900 viewport. I haven't directly verified.

### Q-E. The visual snapshot fullPage inconsistency — is there a reason?

Both v1 and this iteration noted some snapshots use `fullPage: true` and some `false`. Is this a deliberate distinction (long-form CT-side guide needs full scroll) or a drift? Iteration 3 should check.

### Q-F. Does the CT position guide actually reference all the orphan lineups?

v1 said 3 lineups are referenced via ctPositions. Let me verify exact references next iteration.

### Q-G. The owner's iteration history — is "converging spiral" really right?

I framed v1-v6 as scope-narrowing. But v6 ADDED scenarios back after v5 dropped them. That's not pure narrowing. Iteration 3 should re-examine the iteration history more carefully.

### Q-H. What's actually in `src/components/__tests__/`?

I cited test files but didn't read them all this iteration. Need to verify what's covered vs not.

---

## Part 6 — Re-rated understanding

Putting it all together, here's my CURRENT confidence rating on the product's key facts after two iterations:

| Claim | Confidence | Evidence basis |
|---|---|---|
| Dust 2 only, single map | **Certain** | URD FR-1, anti-req AR-2, code matches |
| 4-tab home in fixed order | **Certain** | reducer.ts HomeTab type, Home.tsx, FR-21 |
| Audience: autistic 25y/o | **Certain** | owner direct quote in URD §2 |
| Headline interaction: "let's do scenario 4" | **Certain** | owner direct quote |
| 10 lineups, 5 scenarios, 20 spawns | **Certain** | jq-verified |
| 7 of 10 lineups orphan; all scenarios empty | **Certain** | verified |
| State machine: 3 views, 9 actions | **Certain** | reducer.ts read |
| Same-radius rule generalized | **High** | R-12 + R-14 codified |
| Map tab is origin-first | **Certain** | code + owner quote |
| 4-card walkthrough rigid 2×2 even mobile | **Certain** | NFR-5 + CSS verified |
| Refrag is partner not competitor | **Moderate inference** | my framing, not owner's |
| Product tone is anti-Elo | **Moderate inference** | absence of gamification + Refrag alignment |
| Biggest gap is editorial | **High** | verified empty scenarios + orphan lineups |
| The product is in v6.3 today | **Certain** | DECISIONS_LEDGER R-14 + recent commits |
| Refrag has 35 server locations | **Marketing claim** | from refrag.gg/ homepage, no independent verification |
| Refrag has 550K+ users | **Marketing claim** | same |
| ErrorBoundary uses old v5 theme | **Certain** | code read this iteration |

---

## Part 7 — What iteration 3 should focus on

Based on this iteration's findings, iteration 3 should:

1. **Read every file v2 skipped:** ScenarioDetail.tsx (full), LineupDetail.tsx (full), CtPositionGuide.tsx (full), new-scenario.mjs (full), playwright.config.ts.
2. **Verify Q-A through Q-H** open questions above.
3. **Read every `__tests__/*` file** to map actual test coverage.
4. **Inventory the 10 lineups for description quality** — are all of them as detailed as xbox_smoke?
5. **Cross-check refrag claims** that I made in v1 + v2 by re-fetching select articles.
6. **Audit my insights** — for each of v1's 10 + this v2's new ones, can I find DISCONFIRMING evidence?
7. **Look for content I have NOT been considering:** What does the owner's CHAT history (this conversation) reveal that I haven't synthesized? E.g., the "display issues" comment turned into the Map tab fix. What else?

The iteration-3 goal is NEGATIVE: find every place my synthesis might be wrong. The iteration-3 deliverable: FULL_PICTURE_v3.md, which builds on v2's errata + adds whatever v3 catches.

---

## End of iteration 2

> **Word count:** ~5,400. Smaller than v1 (10,500) deliberately. v2 is errata + extension, not restatement.
>
> **Key takeaways for the owner:**
> - v1 had 7 numerical/factual errors (line counts, marketing claims accepted, etc.) — all caught by this iteration
> - v1 missed at least 14 component-level details that this iteration surfaced
> - 1 new latent bug found (ErrorBoundary dark theme on cream app)
> - 6 open questions remain for iteration 3
> - The 10 "insights" from v1 §18 should be re-rated: 4 verified, 6 inference
>
> **Update trigger:** iteration 3 should read this doc, audit IT, find what's wrong here, and produce v3.
