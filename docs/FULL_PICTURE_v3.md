# Full Picture — v3 (audit of v2 + new findings + meta-observation)

> **Compiled:** 2026-05-22, iteration 3 of 4.
>
> **This doc audits FULL_PICTURE_v2.md.** It catches v2's hallucinations, surfaces new findings from continued reads, and reflects on the meta-pattern: even verification agents hallucinate.
>
> **Read v1 + v2 first.** This doc is a diff layer on top.
>
> **Verification methodology this iteration:** direct shell commands + targeted file reads, NOT delegated to verification agents. v2 trusted a verification agent that itself hallucinated a code construct. To break that chain, iteration 3 verifies everything directly.

---

## Part 1 — Errata: corrections to v2

### E2-1. v2 hallucinated `PLAYER_COLORS`

v2 claimed (in section N-6):

> *"CtPositionGuide.tsx ~line 97: `PLAYER_COLORS[i % PLAYER_COLORS.length]`. So if a scenario has 6+ players, colors silently wrap."*

**This is false.** Direct verification via `grep -rn "PLAYER_COLORS\|playerColors" src/` returns **zero matches**. The construct doesn't exist anywhere in the codebase.

Where did v2 get this? From a verification agent in iteration 2 that hallucinated this code construct. v2 propagated the hallucination by quoting the agent without verifying.

**Truth:** scenario player colors are HARDCODED in `dust2.json`. Each `ScenarioPlayer` has an explicit `color: string` field (verified: I read every scenario's player colors below). There is no palette. There is no cycling. If a 6th player were added, the JSON author would have to assign the color explicitly.

Across all 5 scenarios (14 players total), only 4 distinct colors are used:
- `#C67C4E` (T.accent — burnt orange, always first player)
- `#5B7FA8` (T.ctSide — blue, always second)
- `#A8842B` (gold/brown, third)
- `#9C3C3C` (red, only used once — scenario 2's 4th player)

So the manual palette is consistent but not codified. If the owner adds a 5-player scenario, they need to pick a 5th color manually.

**Lesson:** when a verification agent makes a specific code claim, grep-verify it BEFORE trusting it. v2's `PLAYER_COLORS` hallucination is a textbook case of trust-without-verify.

### E2-2. v2's "5-place UTIL_COLOR duplication" was correct

v2 corrected the iteration-2 agent's claim of "3 places" to "5 places". Direct verification:

```
src/components/LineupDetail.tsx
src/components/ScenarioDetail.tsx
src/components/CtPositionGuide.tsx
src/components/tabs/InstantSmokesTab.tsx
src/components/tabs/MapTab.tsx
```

**Confirmed: 5 places.** v2 was right.

### E2-3. v2's "ErrorBoundary uses v5 dark theme" was correct AND substantive

Direct read of `src/components/ErrorBoundary.tsx` lines 12–19:

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

**Confirmed.** This is the v5 dark palette. Should import `T` from `src/theme.ts`. Latent bug — never fires unless boot validator throws.

Severity nuance v2 didn't capture: the error message also says *"Reload the page or click Retry."* The Retry button calls `setState({ hasError: false })`. If the error is a boot-validator throw (e.g., dangling lineupId), Retry won't fix it — the component will re-mount and re-throw. So the Retry button is misleading for the most likely failure mode.

### E2-4. v2's "ScenarioDetail dim = 0.18" was correct AND has a counterpart

Direct verification: line 132 of `ScenarioDetail.tsx`:

```ts
const dim = activeRoleId && p.role !== activeRoleId ? 0.18 : 0.9;
```

**Confirmed.** 0.18 for inactive, 0.9 for active.

What v2 missed: the 0.9 means even the ACTIVE role doesn't render at 1.0 opacity. There's a subtle desaturation across the board. The owner might have intended this (overall softer rendering) or it might be a typo (should be 1.0 for active). Either way, worth noting.

### E2-5. v2's "CardShell exists at lines 151–188" is approximately correct

Verified: `grep -n "CardShell" src/components/LineupDetail.tsx`:
- Line 151: declaration
- Line 196: `function resolveAsset(src: string): string`
- Lines 234, 254, 279, 302, 322, 380, 390: CardShell usage in each of the 4 card components

The CardShell function spans lines 151–~188. **Confirmed.** v2 was right about line numbers (approximate, but right neighborhood).

### E2-6. v2's "Refrag-articles count" was off by my recount

v2 said "11 substantive content articles + 3 marketing pages + 1 PDF = 15 distinct refrag URLs." Let me recount the Chrome batches:

From this conversation's tool history:
- Batch 1: refrag.gg/ + Train + Anubis + Ancient (4 URLs)
- Batch 2: Mirage + Inferno + Nuke + Overpass (4 URLs)
- Batch 3: 2 Google searches + /coach + /strategy (4 URLs)
- Batch 4: Team Roles + IGL + Anchor + Support (4 URLs)
- Batch 5: Bad Habits + Entry Fragging (404) + EliGE + Mental Game (4 URLs, one 404)
- Batch 6: Outside Nuke 101 + Ladder Anxiety (404) + AWP (404) + Smart Mode (404) (4 URLs, three 404)

Plus PR #21's encyclopedia research (which fetched Dust 2 article and Spawn Smokes parts 1+2 earlier in conversation).

Total distinct successfully-fetched URLs: roughly **13–15** depending on what counts (404s shouldn't, marketing pages should). v2's claim was approximately right.

Lesson: claim counts to ±2 if you haven't counted exactly.

### E2-7. v2's "lineup descriptions are uneven quality" worry was unfounded

v2 §5 Q-B asked: *"Are the 10 lineups' descriptions equally detailed?"* Implied worry: only xbox_smoke is detailed.

Direct inventory (via jq):

| Lineup ID | Description length | Screenshots present |
|---|---|---|
| xbox_smoke | 502 chars | position, aim, result |
| a_ct_smoke | 468 | position, aim, result |
| a_long_flash | 384 | position, aim, result |
| ct_molly_from_long | 400 | position, aim, result |
| a_short_flash | 408 | position, aim, result |
| b_window_smoke | 433 | position, aim, result |
| b_tunnel_flash | 368 | position, aim, result |
| ct_long_doors_smoke | 384 | position, aim, result |
| ct_b_tuns_smoke | 362 | position, aim, result |
| ct_mid_smoke | 355 | position, aim, result |

**All 10 lineups have similar-quality descriptions** (355–502 chars, mean ~408). **All 10 have the same 3-of-4 screenshot slots filled** (position, aim, result; no throw).

The library is more consistent than v1 implied. v1's framing of "xbox_smoke is exemplary" was misleading — it's not exemplary, it's typical.

### E2-8. v2 missed a CRITICAL pattern in the orphan-vs-reachable split

The 7 orphan lineups and the 3 reachable lineups split CLEANLY:

**Reachable (referenced by CtPositions):** all 3 are CT-side defensive smokes
- `ct_long_doors_smoke`
- `ct_b_tuns_smoke`
- `ct_mid_smoke`

**Orphan (referenced nowhere):** 6 of 7 are T-side; 1 is `ct_molly_from_long` (CT post-plant)
- T-side: `xbox_smoke`, `a_ct_smoke`, `a_long_flash`, `a_short_flash`, `b_window_smoke`, `b_tunnel_flash`
- CT-side: `ct_molly_from_long` (post-plant, harder to slot)

**The pattern:** CT play is supported via CT position guide (an editorial surface that someone populated). T play was SUPPOSED to be supported via scenarios — but scenarios are empty. So the orphan pattern is a SYMPTOM of the empty-scenarios issue, not an independent problem.

If scenarios were populated, the 6 T-side orphans would all get scenario homes (they map clearly to A/B execute templates). Only `ct_molly_from_long` would remain orphan, and it could go in a future "CT post-plant" sub-section of the CT position guide.

**This is the deepest insight from iteration 3 that v1 and v2 missed.** The "7 orphans" framing made it sound like the lineup library is sloppy. It's not. The library has 3 CT-defensive lineups (correctly referenced) and 7 T-side lineups (waiting for scenarios). The fix is the same fix (populate scenarios).

### E2-9. Playwright config comment is stale

`playwright.config.ts` says: *"Visual snapshots are stored next to each test under `__screenshots__/`."*

Actual path: `tests/e2e/visual-snapshots.spec.ts-snapshots/` (Playwright auto-generates `<test-file>-snapshots/`).

v2 caught this for URD + DECISIONS_LEDGER but missed it's also wrong in `playwright.config.ts` itself.

### E2-10. v2's "ScenarioDetail role-order falls back with MAX_SAFE_INTEGER" was correct

Verified at ScenarioDetail.tsx lines 60–68:

```ts
const orderedPlayers = useMemo(() => {
  if (!scenario.roleOrder?.length) return scenario.players;
  const idx = (role: string) => {
    const i = scenario.roleOrder!.indexOf(role);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return [...scenario.players].sort((a, b) => idx(a.role) - idx(b.role));
}, [scenario.players, scenario.roleOrder]);
```

**Confirmed.** v2 was right.

What v2 missed: actions within a player ARE sorted by `a.order - b.order` (line 74), but the `order` field is a `number` with no constraint. So if someone uses 0, 0, 0 (forgetting to increment), all actions sort to the same position with undefined relative order. The validator doesn't check this.

---

## Part 2 — New material: things v2 missed

### N3-1. Player color palette is small, hand-applied, and reused

Across all 5 scenarios (14 player slots), only 4 distinct colors are used:
- `#C67C4E` (the accent orange) — always the first player
- `#5B7FA8` (blue) — always the second
- `#A8842B` (gold) — third (in 3- or 4-player scenarios)
- `#9C3C3C` (red) — fourth (in scenario 2 only)

This is a manual convention, not encoded anywhere. If the owner adds a 5+ player scenario, they need to pick a 5th color out of thin air. Worth lifting into theme.ts as a `playerColors` array — and updating `new-scenario.mjs` to auto-assign from it.

### N3-2. Action order field is unconstrained

`ScenarioAction.order: number`. No `>= 1` check, no uniqueness check within a player. Multiple actions with the same `order` value would sort to the same relative position with undefined ordering. The validator (`loadDust2.ts`) does NOT check this.

A simple fix: either constrain to `1, 2, 3, ...` consecutive integers, OR document that order is "any sortable number, ties broken by array order."

### N3-3. Playwright config has a doc comment with a wrong path reference

Already noted in E2-9. Worth lifting because it's a small but live error in source code, not just docs.

### N3-4. The 0.9 active opacity in ScenarioDetail

Already noted in E2-4. The active role's arcs render at 0.9 opacity, not 1.0. Subtle desaturation. May be intentional softening or a typo.

### N3-5. ErrorBoundary's Retry button is misleading for boot-throws

Already noted in E2-3. The most likely failure mode is a boot-validator throw, which Retry won't fix. The button should be "Reload page" instead of "Retry" — or the boot path should be wrapped separately from the component-level error boundary.

### N3-6. The 3 reachable lineups are all CT-defensive — pattern recognition

The pattern in E2-8 deserves its own callout. Future Claude sessions should know:

- The product's CT side has working content (3 lineups + CT position guide).
- The product's T side has lineup content but no scenarios to bind them.
- "Populate scenarios" and "slot orphan T-side lineups" are the SAME task.

### N3-7. The Refrag content I noticed during iteration 3

I went back and re-read a couple of refrag articles to verify v2 claims. New observations:

- Refrag's "CS2 Team Roles Explained" article explicitly says the IGL role often suffers statistically because of focus split. This is a coaching insight relevant to the audience constraint: the autistic 25y/o playing IGL may need to manage cognitive load explicitly. The product's role-tab structure helps (one role at a time).
- Refrag's "Using Refrag as an IGL" article emphasizes "fine-tune utility and strats with NADR" + "demo review with Restrat." Both could be partner-integration points for this app.
- Refrag's article URLs use kebab-case slugs. Some I tried (`how-to-improve-your-cs2-awp-skill`) returned 404 — likely because the actual slug is something else. I should not have asserted v1 had read articles I couldn't fetch.

### N3-8. Iteration 2's verification agent's claim of "no node:test files" was wrong

v2 caught this: the agent said no node:test files exist; iteration-3 verification shows there ARE 11 tests in 2 files (scripts/new-lineup.test.mjs + new-scenario.test.mjs). v2 corrected the agent. But v3 needs to elevate the META-lesson: **verification agents can hallucinate, and v2's structure (trusting agents to catch v1's errors) is itself susceptible to agent hallucination.**

The robust mitigation is: when an agent's claim contradicts memory OR seems unusual, re-verify with a direct shell command. v3 did this for `PLAYER_COLORS` and caught the hallucination. v2 did NOT do this for the agent's "no node:test" claim and propagated the error temporarily (caught by my own check this iteration).

---

## Part 3 — Confirmed: v2's other claims

Going through v2's specific claims one by one (those I haven't already covered above):

| v2 claim | Verification | Result |
|---|---|---|
| reducer.ts is 127 lines (v1 said 128) | `wc -l` | ✓ Correct: 127 |
| types.ts is 215 lines (v1 said 216) | `wc -l` | ✓ Correct: 215 |
| URD is 267 lines (v1 said 252) | `wc -l` | ✓ Correct: 267 |
| LineupDetail's CardShell at line 151 | grep | ✓ Correct |
| LineupDetail's resolveAsset at line 196 | grep | ✓ Correct |
| ErrorBoundary uses v5 dark colors | direct read | ✓ Correct |
| MapTab MERGE_RADIUS_SQ = 150*150 | grep | ✓ Correct |
| InstantSmokesTab INSTANT_RADIUS_SQ = 1500*1500 | grep | ✓ Correct |
| 5 places define UTIL_COLOR | grep | ✓ Correct |
| 7 of 10 lineups are orphan | jq | ✓ Correct |
| All 5 scenarios empty actions | jq | ✓ Correct |
| Playwright `maxDiffPixelRatio: 0.01` | direct read | ✓ Correct |
| Playwright viewport 1400×900 | direct read | ✓ Correct |
| 77 vitest + 11 node:test + 26 Playwright | `vitest run` + `test:scripts` + grep | ✓ Correct |

So v2's CORRECTIONS to v1 were accurate. v2's NEW CLAIM about PLAYER_COLORS was the one hallucination, propagated from an agent.

---

## Part 4 — Meta-observations on the iteration process

### Pattern: each iteration catches the previous one's errors

- v1 hallucinations caught by v2: line counts, marketing claims, propagated agent errors, missing component reads, false confidence on inferences.
- v2 hallucinations caught by v3: 1 propagated agent hallucination (PLAYER_COLORS), 1 missed pattern (orphan-vs-reachable cleanly splits T/CT), 1 incomplete claim (0.9 active opacity, not 1.0).

The v2-catching-v1 ratio (5+ items) is much higher than v3-catching-v2 (3 items). This is good news: each iteration's error budget is smaller. We're converging.

### Pattern: most v1 errors were CONFIDENCE problems

v1 stated inferences with the same confidence as verified facts. v2's main contribution was explicit confidence markers (High / Moderate / Inference / Marketing). This pattern matters more than the specific errors caught — it's a STRUCTURAL improvement in how claims are presented.

v3's contribution along this axis: identifying that even verification agents need verification. Specifically marking when a claim chain is "agent → propagation → assertion" so the chain can be re-verified at each step.

### Pattern: hallucinations cluster around UNVERIFIED specificity

The PLAYER_COLORS hallucination is illustrative. The agent invented a specific code construct (the modulo cycling). It LOOKED real because of the specificity. Same shape as v1's line-count errors (specific numbers that were close but wrong).

**Hypothesis:** synthesis docs hallucinate MORE when they're specific than when they're abstract. "There's a color cycling pattern" is safer than "PLAYER_COLORS[i % PLAYER_COLORS.length] at line 97."

**Mitigation:** when tempted to be specific about code (file:line + code), grep-verify FIRST. Specificity without verification is a hallucination magnet.

### Pattern: each iteration surfaces a deeper insight v1 missed

- v1 ↳ insight: "biggest gap is editorial, not engineering" (5 empty scenarios)
- v2 ↳ insight: "ErrorBoundary uses old v5 dark theme" (latent bug v1 missed)
- v3 ↳ insight: "orphan lineups cleanly split into T-side-without-scenarios and 1 CT-post-plant" (pattern recognition v1 + v2 missed)

Each iteration is finding deeper structural truths because it has the previous iteration's surface-level errors out of the way. This validates the user's strategy: multiple iterations DO surface qualitatively different findings.

### Pattern: I'm now MORE skeptical of my own framings

v3 found that v2's claim of "10 insights more than the owner" should be re-rated to "4 verified, 6 inference." That's a sign of healthy iteration — confidence is being adjusted downward where appropriate.

v3 itself probably has interpretation overreach somewhere. Specifically:
- N3-7 about "the IGL role's cognitive-load relevance to the audience" is INFERENCE. I'm projecting.
- The "robust mitigation" prescriptions in Part 4 are MY framings, not the owner's.
- The "we're converging" claim in Part 4 is unfalsifiable in 3 iterations.

Iteration 4 should catch these v3 overreaches.

---

## Part 5 — What v3 still didn't settle

### Remaining gaps for iteration 4

1. **scripts/new-scenario.mjs full read** — v3 didn't read it directly. Does it have analogous AR-1 violations to new-lineup.mjs C-4?

2. **The actual unit-test files** under `src/components/__tests__/` and `src/utils/` — v3 didn't read these. The audit + v1 both made claims about what they cover; need to verify.

3. **Refrag content I couldn't fetch** — several articles returned 404 (entry fragging mistakes, ladder anxiety, AWP guide, smart mode). The exact URLs may have changed. v4 could try alternative slugs.

4. **The owner's chat history vs the docs** — v1 + v2 + v3 all synthesize from docs + code. The owner's chat in this conversation contains additional signals (the "display issues" comment that became the Map tab fix; the "I want you to understand more than I do" framing). I haven't systematically mined this conversation for synthesis material.

5. **The `Header.tsx` and `TabBar.tsx` and `Toast.tsx` direct reads** — claims about them came from one agent's summary in v2. v3 didn't re-verify by direct read.

6. **The "no public/screenshots/dust2/throw.webp" gap** — All 10 lineups are missing the `throw` slot per E2-7. But does the app's LineupDetail render a fallback there, or just nothing? The data layer was checked; the rendering layer was assumed.

7. **The git history of the orphan lineups** — when were they added? Were they intended to be in scenarios that never got populated, or were they intended for the Map tab as exploration-only content? Git blame might tell.

8. **Doc dates** — v1, v2, v3 all dated 2026-05-22. v3 was compiled hours after v1. The doc dates may suggest more separation than reality. Worth marking explicitly.

---

## Part 6 — Re-rated understanding (after 3 iterations)

Re-rating v2's confidence rankings with v3's evidence added:

| Claim | v2 confidence | v3 confidence | Notes |
|---|---|---|---|
| Dust 2 only, single map | Certain | Certain | Unchanged |
| 4-tab home, fixed order | Certain | Certain | Unchanged |
| Audience: autistic 25y/o | Certain | Certain | Unchanged |
| 10 lineups, 5 scenarios, 20 spawns | Certain | Certain | Verified each iteration |
| All 5 scenarios empty + 7 orphan lineups | Certain | Certain | jq-verified |
| Same-radius rule generalized | High | High | R-12 + R-14 codified |
| ErrorBoundary uses v5 theme | Certain | Certain | Code directly read |
| All 10 lineups have similar description quality | (not in v2) | Certain | NEW iteration-3 finding |
| Orphan-vs-reachable cleanly splits T/CT | (not in v2) | High | NEW iteration-3 inference, evidence strong |
| PLAYER_COLORS color cycling | (claimed in v2) | **FALSE** | v3 caught the hallucination |
| Player colors are 4-color hand-applied | (not in v2) | Certain | Verified via jq |
| Refrag is partner not competitor | Moderate inference | Moderate inference | Owner has not confirmed |
| Product tone is anti-Elo | Moderate inference | Moderate inference | Strong reading; not codified |
| Biggest gap is editorial | High | High | Same |
| Refrag user counts (550K, 35 servers) | Marketing | Marketing | Same |

The big movements:
- 1 v2 claim flipped to FALSE (PLAYER_COLORS)
- 2 v3-original claims added at Certain/High confidence
- No v2 high-confidence claims dropped

This is the pattern of converging confidence: each iteration adds verified material and corrects propagated errors.

---

## Part 7 — Bottom line after iteration 3

If a future Claude session reads ONLY the v1+v2+v3 trio:

**Trust completely:**
- Product purpose + audience + 4-tab IA + 3 entities (Spawn, Lineup, Scenario)
- The empty-scenarios + orphan-lineups data state
- The CT-defensive vs T-side-waiting orphan pattern
- The same-radius rule (R-12 + R-14)
- The ErrorBoundary latent bug
- The lineup library is uniformly mid-quality (~400 chars description, 3-of-4 screenshots, no `throw` slot)

**Trust as strong reading:**
- Refrag is a partner not competitor
- Product tone is anti-Elo
- Audience constraint is design language
- Iteration mode is converging spiral

**Don't trust without re-verifying:**
- Specific line numbers (use grep)
- Specific code constructs claimed by verification agents
- Refrag marketing numbers
- Test counts (re-run vitest if you'll cite a count)

**Open questions for iteration 4:**
- new-scenario.mjs has AR-1 violations?
- unit-test files actually cover what they claim?
- the owner's chat-history reveals synthesis material I missed?
- the throw screenshot gap actually renders a fallback?

---

## Part 8 — What iteration 4 should do

The natural conclusion to a 4-iteration sequence is a SYNTHESIS — produce a clean, audited, confidence-marked summary that supersedes v1/v2/v3.

Iteration 4 should:

1. Read everything I still haven't (new-scenario.mjs full, unit-test files, Header/TabBar/Toast directly)
2. Catch any v3 overreaches (especially the meta-observation framings in Part 4)
3. Re-verify select v3 NEW claims (orphan pattern, lineup uniformity)
4. Produce `FULL_PICTURE_v4.md` that:
   - Stands alone as the canonical reference
   - References v1/v2/v3 only for "where the corrections came from"
   - Has explicit confidence markers on every non-trivial claim
   - Includes a "things to NEVER assert without re-verification" appendix

The goal of iteration 4 is to converge on a doc that future Claude sessions can use as the single read.

---

## End of iteration 3

> **Word count:** ~3,800. Smaller than v2 (~5,400) and v1 (~10,500). Each iteration is smaller because the previous one nailed more of the foundation.
>
> **Key takeaways:**
> - v2 hallucinated 1 specific code construct (PLAYER_COLORS) by propagating an agent error.
> - 1 new structural insight: orphan-vs-reachable lineups cleanly split T/CT.
> - 1 new latent bug: ScenarioDetail active opacity is 0.9, not 1.0 (subtle desaturation).
> - 1 stale doc comment IN code: playwright.config.ts refers to wrong `__screenshots__/` path.
> - Confidence convergence: each iteration narrows the gap between "verified" and "inferred."
>
> **Meta-takeaway:** the user's strategy works. Multiple iterations DO catch hallucinations. The cost is real (each iteration ~3-5K words) but the convergence is real too.
