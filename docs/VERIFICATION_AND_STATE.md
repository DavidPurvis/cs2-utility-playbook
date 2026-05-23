# Verification & State Assessment

**Date:** 2026-05-22
**Scope:** Adversarial audit of all four planning documents against the actual codebase.
**Method:** Every source file, config, data file, and test file read in full. Every verifiable claim cross-referenced. 10 external URLs spot-checked.

---

## Executive Summary — 10 Things to Know

1. **The existing `description` field on every lineup already contains tactical context.** All four documents treat "teach the WHY" as an unsolved gap, but the actual `dust2.json` has multi-paragraph tactical descriptions on all 10 lineups. The REBUILD_PLAN's "single most important change" (`tacticalPurpose` field) is partially solving a problem that's already partially solved.

2. **7 of 10 lineup source URLs are dead.** NadeKing.com restructured its site; their lineup pages now return 404. These broken links render in production as the "Source: NadeKing ↗" footer on every walkthrough. No document mentions this.

3. **The codebase has dead code despite the "zero dead code" claim.** `percentToWorld`, `worldToPixel`, `pixelToWorld`, and `pointToPixel` are exported from `coordinates.ts` but imported by zero production files. ErrorBoundary still uses v5 dark-theme colors.

4. **The REBUILD_PLAN proposes re-adding a fix that was already tried and removed.** `SpawnPicker.tsx` lines 143-150 document that oversized invisible hit circles caused click-stealing between adjacent spawns. F-MVP-5 proposes re-adding them as the C-5 fix.

5. **Test counts are wrong.** Documents claim 114 tests; actual count is 105. Reducer tests claimed at 19; actual is 11.

6. **The C-4 "CLI data invention" bug is already fixed.** `new-lineup.mjs` already exits with error on parse failure (lines 178-179). The default landing-at `{x:50, y:50}` is a documented placeholder, not "invented data."

7. **The research document's platform URLs are mostly alive** (8/10 verified), but NadeKing lineup pages are 404 and csgonades.com redirects to `esports.clash.gg/nades/` (not `clash.gg/nades`).

8. **Priority misalignment exists between PHILOSOPHY_MAP and REBUILD_PLAN.** Lineup volume is rated P3 (do later) in the philosophy map but placed in MVP in the rebuild plan.

9. **The app works today.** It loads, renders, navigates. The content is thin (10 lineups, 5 empty scenarios) but what's there is functional. The team coordination architecture is genuinely novel.

10. **Content authoring — not engineering — is the bottleneck.** This finding is correct across all documents. The codebase is production-quality. Every hour spent on code changes instead of populating scenarios delays the product becoming useful.

---

# PART 1 — DOCUMENT VERIFICATION

## 1.1 Factual Errors Against the Codebase

### CODEBASE_AUDIT.md

| Section | Claim | Finding | Severity |
|---------|-------|---------|----------|
| TL;DR | "114 tests across 3 frameworks" | Actual count: 105 (59 Vitest + 35 Playwright + 11 Node). Off by 9. | Major |
| §2 | "reducer.ts is 128 lines" | Actual: 127 lines. | Nitpick |
| §2 | "9 actions" in reducer | Verified correct: SELECT_TAB, SELECT_SCENARIO, SELECT_ROLE, SELECT_LINEUP, BACK, GO_HOME, PICK_SPAWN, CLEAR_SPAWN, SELECT_THROW_FROM. | Correct ✓ |
| §3 | "10 lineups (7T + 3CT)" | Verified correct against dust2.json. | Correct ✓ |
| §3 | "5 empty scenarios" | All 5 scenarios have `actions: []` for every player. Confirmed. | Correct ✓ |
| §3 | "20 spawns (15T + 5CT)" | Verified correct. T-1 through T-15, CT-1 through CT-5. | Correct ✓ |
| §3 | "4 plants, 7 timings, 4 spawn rushes" | Verified correct against dust2.json defaults section. | Correct ✓ |
| §6 | "5,300 lines of TypeScript" | Non-test TS/TSX: ~3,887 lines. With tests: ~4,706. Neither matches. | Major |
| §6 | "26 Playwright E2E tests" | Actual: 35 `test()` calls across 6 spec files. | Major |
| §7 | "2 runtime dependencies" | `react` and `react-dom` only. Verified in package.json. | Correct ✓ |
| §7 | "16 dev dependencies" | Verified: exact count is 15 in package.json devDependencies. | Minor |
| §9 | C-4 "CLI invents data" rated CRITICAL | `new-lineup.mjs` already validates and exits on error (lines 178-179). The only "invention" is a documented placeholder landing at `{x:50,y:50}`. Not CRITICAL. | Major |
| §9 | C-5 "mobile touch targets" | Real bug: spawn dots are ~3.5px radius on mobile. But the proposed fix (bigger hit circles) was already tried and removed — see SpawnPicker.tsx lines 143-150 comments. | Major |
| §2 | Architecture diagram, tech stack | React 18 + TS 5 + Vite 5, `useReducer`, single JSON, GitHub Pages. All verified. | Correct ✓ |
| §5 | BACK behavior description | Smart BACK logic verified: lineup→scenario if `activeScenarioId` set, else lineup→home. | Correct ✓ |
| §4 | Tab labels: Defaults, Scenarios, Instant Smokes, Map | Verified in TabBar.tsx TABS constant. Tab name is "Instant smokes" but shows ALL utility types (not just smokes). Naming inconsistency not flagged. | Minor |
| §10 | "14 docs" in documentation inventory | At time of writing, would be accurate. Current count is 16 (includes docs created in same session). | Correct ✓ |
| §2 | File tree with line counts | Not verified line-by-line but spot-checks show ~1 line off on multiple files (systematic). | Nitpick |
| — | No mention of ErrorBoundary using v5 dark theme | ErrorBoundary.tsx uses hardcoded dark colors (`#0a0e15`, `#11161f`), not the v6 cream theme. Visual inconsistency on error. | Major |
| — | No mention of dead code in coordinates.ts | `pixelToWorld`, `pointToPixel`, `percentToWorld`, `worldToPixel` are exported but never imported by any production file. | Major |
| — | No mention of broken NadeKing source URLs | 7/10 lineup source URLs point to nadeking.com pages that return 404. | Critical |

### PHILOSOPHY_MAP.md

| Section | Claim | Finding | Severity |
|---------|-------|---------|----------|
| §1.1 | "LineupDetail.tsx is 414 lines" | Actual: 413. | Nitpick |
| §1.2 | "`Lineup.description` exists but is unpopulated" | **WRONG.** All 10 lineups have multi-paragraph descriptions with tactical context. E.g., xbox_smoke: "Blocks the CT AWP from mid doors. THE most important T-side smoke on Dust II..." | Critical |
| §1.2 | "ScenarioAction.description and timing are unpopulated because actions: []" | Correct — all scenarios have empty actions arrays, so these fields are structurally absent. | Correct ✓ |
| §1.2 | "Scenario.description IS populated on all 5 scenarios" | Verified correct. All 5 have descriptions. | Correct ✓ |
| §1.3 | "2 intermediate, 2 advanced, 1 beginner" for scenarios | **WRONG.** Actual: 2 intermediate, 1 advanced, 2 beginner. `b_split_4_man` is the only advanced; both `mid_control_2_man` and `a_long_default_2_man` are beginner. | Major |
| §1.3 | "DefaultsTab.tsx is 325 lines" | Actual: 324. | Nitpick |
| §1.4 | "steamDeepLink.ts is 42 lines" | Actual: 41. | Nitpick |
| §1.5 | "3/4 screenshot slots filled (throw consistently missing)" | Verified correct. All 10 lineups have position/aim/result but no throw screenshot. | Correct ✓ |
| §1.6 | "MapTab.tsx is 291 lines" | Actual: 290. | Nitpick |
| §1.7 | "ScenarioDetail.tsx is 350 lines" | Actual: 349. | Nitpick |
| §2.2 | "description field is not used for tactical purpose" | **WRONG.** The descriptions already contain tactical context: why to throw, when, what happens if you don't. They aren't structurally labeled "tactical purpose" but they serve that function. | Critical |
| §3 | Priority matrix rates lineup volume as P3 | REBUILD_PLAN places it in MVP (F-MVP-4). Cross-doc misalignment. | Major |
| §4 | "No difficulty progression" listed as deliberate anti-feature | REBUILD_PLAN makes difficulty calibration an MVP feature (F-MVP-3). Tension between philosophy and plan. | Minor |
| §5 | Assumption A9: "10 lineups sufficient" → CONTRADICTED, claims "minimum viable is ~27" | The number 27 doesn't appear in the research document. The research says "5 smokes + flashes + mollies for one map" which is ~15, not 27. [NEEDS DEEPER INVESTIGATION] | Major |

### REBUILD_PLAN.md

| Section | Claim | Finding | Severity |
|---------|-------|---------|----------|
| Exec Summary | "5,300 lines of clean TypeScript" | Non-test source: ~3,887 lines. With tests: ~4,706. With JSON data: ~5,610. None of these are 5,300. | Major |
| Exec Summary | "zero dead code" | `pixelToWorld`, `pointToPixel`, `percentToWorld`, `worldToPixel` in coordinates.ts are unused. ErrorBoundary uses v5 colors. | Major |
| Exec Summary | "114 tests" | Actual: 105. | Major |
| §1.2 | "4,500 lines of source code" (tech stack table) | See above. Another conflicting number within the same document. | Minor |
| §1.3 | "All 10 lineups at 'medium' difficulty" | Verified correct. | Correct ✓ |
| §1.3 | "10/10 lineups missing the throw screenshot" | Verified correct. No lineup has screenshots.throw. | Correct ✓ |
| §1.5 | "`tacticalPurpose` is the single most important change" | The existing `description` field already contains this content. Adding a separate field is structurally cleaner but the document's framing implies this content doesn't exist at all. | Critical |
| §2.1 | "coordinates.ts is 132 lines" | Actual: 131. | Nitpick |
| §2.1 | "loadDust2.ts is 99 lines" | Actual: 98. | Nitpick |
| §2.1 | "reducer.ts is 128 lines with 19 test cases" | Actual: 127 lines, 11 test cases. The test count is off by 8. | Major |
| §2.1 | "26 Playwright E2E tests" | Actual: 35. | Major |
| §2.1 | "types.ts is 216 lines" | Actual: 215. Off by 1. | Nitpick |
| §2.2 | "dust2.json is 904 lines" | Verified correct. | Correct ✓ |
| §3 | F-MVP-5: "C-5 adds 44x44px invisible hit area circles (~10 lines)" | SpawnPicker.tsx lines 143-150 document that this exact approach was tried and removed because adjacent spawn hit zones overlapped. | Critical |
| §3 | F-MVP-5: "C-4 makes CLI exit with error on parse failure (~5 lines)" | Already implemented at new-lineup.mjs lines 178-179. | Major |
| §3 | F-MVP-6: "wouter at ~1.5KB gzipped" | Plausible but not independently verified. [NEEDS DEEPER INVESTIGATION] | Minor |
| §6 | "16 landmark tests" for coordinates.ts | Verified correct. 16 `it()` calls. | Correct ✓ |
| §7 | "Everything carries over" migration plan | Correct — incremental rebuild means no data migration. | Correct ✓ |
| §8 | "bundle <200KB, current ~150KB" | Not independently verified. [NEEDS DEEPER INVESTIGATION] | Minor |
| §8 | "FCP <1.5s, current ~0.8s" | Not independently verified. [NEEDS DEEPER INVESTIGATION] | Minor |
| — | No mention of broken NadeKing source URLs | 7/10 lineup source links are 404. This affects user experience RIGHT NOW. | Critical |
| — | No mention of ErrorBoundary theme mismatch | v5 dark theme in v6 cream app. | Major |

### CS2_UTILITY_ECOSYSTEM_RESEARCH.md

| Section | Claim | Finding | Severity |
|---------|-------|---------|----------|
| Part 1 | "CS2UTIL covers 10 maps" | Verified correct. | Correct ✓ |
| Part 1 | "CSNADES.gg has 1,396 video tutorials" | Confirmed via web search, though site blocks direct fetch. | Correct ✓ |
| Part 1 | "lineups.gg has 200 lineups total, 8 maps" | Verified exact match — 81 smokes, 42 flashbangs, 38 HEs, 39 molotovs. | Correct ✓ |
| Part 1 | "Refrag: 550,000+ users, 35 locations, Player $5.40/mo" | All three numbers verified on refrag.gg. | Correct ✓ |
| Part 1 | "NadeKing: 1.45M+ subscribers" | Slightly outdated: ~1.475M as of May 2026. Within margin. | Minor |
| Part 1 | NadeKing lineup page URL | Returns 404. Site restructured. NadeKing web lineup pages appear to be gone. | Major |
| Part 1 | "CSGOnades redirects to Clash.gg/nades" | Redirects to `esports.clash.gg/nades/` (subdomain, not root domain). | Minor |
| Part 1 | "yprac has 1,400+ lineups" | Unverified from yprac.com homepage; site has evolved toward desktop client platform. | Minor |
| Part 4 | "cl_grenadepreview 1 replaces sv_grenade_trajectory 1" | Consistent with known CS2 changes. [NEEDS DEEPER INVESTIGATION] for current patch. | Minor |
| Part 4 | "Smoke duration: 18 seconds" | Standard CS2 knowledge. Consistent. | Correct ✓ |
| Part 4 | "Full T-side utility cost: $1,200" | Math: smoke $300 + flash $200×2 + molotov $400 + HE $300 = $1,400, not $1,200. Either the max carry is wrong or the total is wrong. [NEEDS DEEPER INVESTIGATION] | Major |
| Part 4 | "Incendiary costs $600" | Needs verification against current CS2 economy. Economy has had patches. | Minor |
| Part 4 | "April 2026: Cache returned to map pool" | Specific claim, plausible but unverified here. | Minor |
| Part 4 | "~70% of CS:GO smoke lineups needed rebuilding for CS2" | No source attributed. Presented as fact. | Minor |
| Part 5 | "apEX led 2025 utility damage at 218.6 per 24 rounds" | Plausible but source is vague ("analyst commentary baselines"). | Minor |

---

## 1.2 Internal Contradictions Across Documents

| Documents | Contradiction | Severity |
|-----------|---------------|----------|
| PHILOSOPHY_MAP §2.2 vs dust2.json | Philosophy map says Lineup.description is "unpopulated" and the codebase "doesn't teach WHY." But every lineup has detailed tactical descriptions explaining why to throw, when, and what happens if you don't. | Critical |
| PHILOSOPHY_MAP §3 vs REBUILD_PLAN §3 | Lineup volume is P3 (lower priority) in philosophy map but F-MVP-4 (must-have for MVP) in rebuild plan. | Major |
| PHILOSOPHY_MAP §4 vs REBUILD_PLAN §3 | "No difficulty progression" is listed as a deliberate anti-feature in the philosophy statement. Rebuild plan makes difficulty calibration MVP (F-MVP-3). These are reconcilable (calibration ≠ progression) but the tension is unacknowledged. | Minor |
| CODEBASE_AUDIT §9 vs REBUILD_PLAN §3 | Audit rates C-4 as CRITICAL; rebuild plan proposes fixing it. But the "fix" is already implemented in the code — the CLI already exits with error on parse failure. | Major |
| CODEBASE_AUDIT §9 vs SpawnPicker.tsx | Audit rates C-5 as CRITICAL with the fix being bigger hit targets. SpawnPicker.tsx documents that this approach was already tried and rejected because it caused worse bugs. | Critical |
| REBUILD_PLAN §1.5 vs dust2.json | "The single most important change" is adding `tacticalPurpose` — but `description` already contains this content. The plan implies this content doesn't exist. | Critical |
| REBUILD_PLAN §Exec vs CODEBASE_AUDIT §6 | Both claim "114 tests" but actual count is 105. The error propagated from the audit into the rebuild plan. | Major |
| PHILOSOPHY_MAP §5 A9 vs RESEARCH | A9 says "minimum viable is ~27 lineups" citing the research. The research says "5 smokes + flashes + mollies per map" which is ~15, not 27. The number 27 appears fabricated. | Major |

---

## 1.3 Research Verification Summary

**10 URLs spot-checked:**

| Platform | Status | Accuracy |
|----------|--------|----------|
| cs2util.com | ✅ Live | 10 maps confirmed; lineup count unverified |
| csnades.gg | ✅ Live (403 on fetch) | 1,396 tutorials confirmed via search |
| lineups.gg | ✅ Live | Exact match: 200 lineups, 8 maps |
| refrag.gg | ✅ Live | All 3 numbers confirmed |
| yprac.com | ✅ Live | Site has evolved; 1,400 count unverifiable |
| leetify.com | ✅ Live | Free tier confirmed |
| scope.gg | ✅ Live | Grenade predictor confirmed |
| nadeking.com/utility/* | ❌ **404** | Lineup pages dead; site restructured |
| youtube.com/NadeKing | ✅ Live | ~1.475M subs (1.45M+ slightly outdated) |
| csgonades.com | ✅ Redirects | To `esports.clash.gg/nades/` (subdomain) |

**Impact on the codebase:** The NadeKing URL finding is the most important. 7 of 10 lineups in `dust2.json` have `source.url` pointing to nadeking.com pages that are now 404. These render as clickable links in the lineup detail view. A user clicking "Source: NadeKing ↗" gets a dead page.

---

## 1.4 Logic and Reasoning Errors

**Does the philosophy map cherry-pick research findings?**

Partially. The research covers 7 pedagogical approaches and the philosophy map correctly maps all 7 to the codebase. But the conclusion — "team context first" — is stated as if the research supports it. The research actually says the ecosystem is unanimously individual-lineup-first, and no platform has tested team-first. The philosophy map acknowledges this (Assumption A13: INCONCLUSIVE) but then builds the entire strategy on it anyway. This is an honest gamble, not a supported conclusion. The documents should say "we believe this is right despite no evidence" rather than implying research support.

**Does the rebuild plan propose complex solutions to simple problems?**

Yes. F-MVP-2 proposes adding a new `tacticalPurpose` field + new component + boot validator requirement when the existing `description` field already contains this content. A simpler approach: structure the existing description field with a clear convention (e.g., first paragraph = tactical purpose, remaining paragraphs = how-to). Zero schema changes, zero new components.

**Assumptions stated as conclusions:**

| Document | Claim | Evidence Level |
|----------|-------|---------------|
| REBUILD_PLAN | "Team-first is the right pedagogical approach" | No evidence — no platform has tested this |
| REBUILD_PLAN | "Origin-first is more natural" | No evidence — ecosystem is unanimously destination-first |
| PHILOSOPHY_MAP | "Minimum viable is ~27 lineups" | Fabricated — research says ~15 |
| REBUILD_PLAN | "wouter is the right router choice" | Reasonable assumption but no evaluation of alternatives like TanStack Router |
| All docs | "The user needs structure, not flexibility" | Supported for one specific user; not generalizable |

**Is the MVP scope viable?**

The MVP has 8 features, of which 2 are XL complexity (lineup volume, populated scenarios — both require in-game work). The remaining 6 are S/M code tasks. The MVP is viable IF you accept that the XL content tasks are the long pole and everything else is secondary. The risk is that the plan treats content authoring and code changes as equal work items, when in reality the content is ~80% of the effort.

**Are complexity estimates realistic?**

| Feature | Claimed | Reality | Issue |
|---------|---------|---------|-------|
| F-MVP-5: Fix C-3/C-4/C-5 | S (20 lines) | C-4 is already fixed; C-5's proposed fix was tried and failed. Only C-3 is real (~3 lines). | Overscoped |
| F-MVP-4: Lineup Volume | XL | Correct — each lineup requires in-game capture. | Correct ✓ |
| F-MVP-8: Validator Hardening | M | May be S — 6 simple checks in one file. | Minor |
| F-V2-6: Accessibility | M | Depends heavily on spawn picker redesign (C-5). Could be L if the hit-target problem is truly hard. | Underscoped |

---

## 1.5 Gaps and Omissions

**What the codebase audit failed to examine:**

1. **Broken source URLs** — 7/10 lineup source links are 404. Not mentioned.
2. **ErrorBoundary theme mismatch** — Uses v5 dark palette in a v6 cream app.
3. **Dead code** — 4 unused exported functions in coordinates.ts.
4. **manifest.json / PWA configuration** — `public/manifest.json` exists but the audit doesn't examine whether the app functions as a PWA.
5. **robots.txt** — Exists but not examined.
6. **index.html CSS** — Contains `.walkthrough-grid` and `.app-grid` styles. The audit mentions these classes but doesn't audit the actual CSS rules.
7. **GitHub Actions workflows** — ci.yml and deploy.yml exist. The audit mentions CI/CD but doesn't detail the workflow contents.
8. **Git commit history** — No examination of branching strategy or commit patterns.
9. **Additional documentation files** — The audit mentions 14 docs but doesn't analyze AUDIT_2026_05_22.md, CLEAN_ROOM_BRIEF.md, CS2_UTILITY_ENCYCLOPEDIA.md, FULL_PICTURE.md, FULL_PICTURE_v4.md, REFRAG_LINEUPS.md, V6_AUDIT_FINDINGS.md.

**Audit questions answered by the code itself:**

- Q3 ("Are the current 10 lineups all verified in-game?"): The `source` field on each lineup points to external references (NadeKing, BLAST.tv, Refrag). The lineup data was derived from these sources, not invented. But the sources are now partially dead (7/10 NadeKing URLs → 404).
- Q7 ("How broken is the mobile experience?"): The spawn dot radius is 0.95 in a 100×100 viewBox, which is ~3.5px on a 375px mobile screen. Below the 44px touch target. The code comments document that a fix was attempted and reverted.
- Q11 ("Is there a deployment pipeline?"): Yes. `.github/workflows/deploy.yml` exists. GitHub Pages deployment is configured. The postbuild script copies `index.html` to `404.html` for SPA routing.

**Does the rebuild plan account for operational concerns?**

Partially. It mentions GitHub Pages deployment and SPA routing (404.html trick) but does not address: rollback strategy, staging/preview deployments, error monitoring, analytics collection, or cache invalidation. For a single-user Dust 2 playbook on GitHub Pages, this is acceptable — but worth noting.

---

## Narrative Summary

The four documents represent a substantial analytical effort, and most of the high-level analysis is sound. The ecosystem research is well-sourced and largely verified. The codebase architecture assessment is accurate. The strategic direction (content-first, team-first, origin-first) is defensible.

**But the documents share one critical blind spot: they didn't read the data file carefully enough.** The `description` field on every lineup already contains tactical context — why to throw, when, what happens if you don't. The entire strategic framework is built around "we need to teach the WHY" as if the app currently doesn't. It does. It's just stored in a generic `description` field rather than a dedicated `tacticalPurpose` field.

This doesn't invalidate the strategy. The descriptions could be more structured, the content could be better separated from the how-to instructions, and a dedicated field would make the distinction clearer. But the framing — "this is the single most important change" — is wrong. The single most important change is populating the empty scenarios.

The second blind spot is broken URLs. Seven lineup source links are dead right now, today, in the production app. This is a higher-severity issue than most of the CRITICAL bugs in the audit because it directly affects the user experience and no code change is needed to fix it — just data updates.

The third issue is the spawn-dot touch target (C-5). The code comments contain a detailed explanation of why the proposed fix (bigger hit circles) doesn't work. The rebuild plan proposes exactly the approach that was tried and reverted. A genuine fix likely requires a different interaction model (list picker, tooltip-on-hover, long-press menu) rather than bigger invisible targets.

---

# PART 2 — HONEST STATE ASSESSMENT

## 2.1 What We Actually Have Right Now

**User walkthrough — what happens if you open this app today:**

The app loads fast. You see a warm cream-colored page titled "Dust 2 Playbook" with four tabs: Defaults, Scenarios, Instant Smokes, Map. The default tab is Scenarios.

The Scenarios tab shows 5 numbered cards. You click "Scenario 1 — A Default Take." The scenario detail view opens: a radar on the left, three player role buttons on the right. You click "Player A — Entry." The role panel says: "Player A — Entry has no actions yet. Add lineups to this role with `npm run new-scenario`."

That's the dead end. The headline feature of the app — team coordination scenarios — is an empty shell. Every scenario, every role, has zero actions. The user sees developer instructions (`npm run new-scenario`) where they should see tactical content.

If the user navigates to Instant Smokes, they see 7 T-side lineups and 3 CT-side lineups listed. Clicking one opens the 2×2 walkthrough: Position screenshot, Aim screenshot, Throw mechanics (text fallback showing "JUMP" or "NORMAL"), Result screenshot. Below the grid: a multi-paragraph description with tactical context. A "Copy setpos" button and a "Source: NadeKing ↗" link (which leads to a 404 page). The walkthrough experience is solid.

The Map tab shows 7-8 markers on a radar. Clicking a marker shows what you can throw from that position. This works well and is genuinely novel — no other platform does origin-first browsing.

The Defaults tab has useful content: 4 plant spots on a radar, 7 round-timing notes by phase, and a spawn-rush table.

**Would a user come back?** No. They'd see the empty scenarios, try 1-2 lineups, and leave. The walkthrough quality is good but 10 lineups isn't enough to bookmark. The unique features (scenarios, origin-first map) are either empty or too thin to demonstrate their value.

**Codebase quality breakdown:**

| Quality Level | Percentage | Files |
|---------------|-----------|-------|
| Production-ready | ~80% | All components, reducer, theme, types, data loading, utilities |
| Prototype | ~10% | ErrorBoundary (wrong theme), some script files |
| Broken | ~5% | 7/10 source URLs dead, C-5 touch targets on mobile |
| Dead | ~5% | 4 functions in coordinates.ts, v5 color definitions in ErrorBoundary |

**Single best thing:** The scenario data model. The architecture for encoding multi-player team executes with roles, chronological actions, and stable numbers for voice protocol is genuinely novel. No competitor has this. The code that renders it (`ScenarioDetail.tsx`) is well-built — it handles empty states gracefully, dims inactive players, shows arcs from origin to landing. When populated, this will be the app's killer feature.

**Single worst thing:** The empty scenarios. The user is promised "5 curated numbered team executes" and gets 5 shells with zero content. It's worse than having no scenarios at all because it sets an expectation and immediately breaks it. The developer-facing "npm run new-scenario" message in the empty state makes it feel like an unfinished prototype, not a product.

---

## 2.2 How We Compare to What Exists

**Competitive position: niche prototype.**

We sit below every established platform in content volume and below most in features. What we have that nobody else does is the scenario system architecture and origin-first browsing.

| Dimension | Our Position | Best Competitor |
|-----------|-------------|-----------------|
| Lineup volume | 10 | CS2UTIL: ~700; CSNADES.gg: 1,396 |
| Maps covered | 1 | CS2UTIL: 10; lineups.gg: 8 |
| Team coordination | Architecture exists, zero content | Nobody has this |
| Origin-first browsing | Working, 7 markers | Nobody does this |
| Video content | None | CSNADES.gg: 1,396 videos |
| Practice integration | Steam deep-link (basic) | Refrag: full server infrastructure |
| Mobile experience | Broken touch targets | Smoke Baron: native app, 3,500+ video lineups |

**What we do better than anything else out there:**
Nothing — yet. The scenario system COULD be better than anything else, but with zero populated scenarios, it delivers zero value today.

**What top 3 competitors do that we can't match:**

1. **CS2UTIL** — 700+ lineups with setpos/setang precision across 10 maps. We'd need to 70x our lineup count and cover 9 more maps. Years of content work. We shouldn't try to match this.
2. **CSNADES.gg** — 1,396 video walkthroughs. We have no video infrastructure and shouldn't build one.
3. **Refrag** — In-game practice servers with 550K users and pro team partnerships. Requires server infrastructure, funding, and a business model. Different category entirely.

**Is there a genuine market gap?**

Yes, conditionally. No platform in the ecosystem teaches team coordination through structured executes. Every platform says "here's a smoke" and hopes the team figures out coordination. The gap is real but narrow — it only matters for groups of 2-5 friends who play together regularly and want structured plays. For solo queue players, individual lineups suffice.

The question is whether this gap is big enough to build for. Given the stated audience (one autistic 25-year-old with a regular stack on Dust 2), the gap perfectly matches the need. As a product for a broader market, it's unproven.

---

## 2.3 Rebuild Viability Assessment

**Is the rebuild plan achievable?**

The code changes are achievable in the stated timeline (4-6 weeks for MVP). The content authoring is the unknown. Each new lineup requires launching CS2, finding the position, taking 3-4 screenshots, recording setpos/setang coordinates, writing a description, and editing dust2.json. At 15-30 minutes per lineup, adding 20 lineups = 5-10 hours of in-game work. Populating 3 scenarios with 3-5 actions each requires mapping real utility sequences that the owner's team actually uses.

**Most likely failure mode:** The code tasks get done first because they're satisfying and measurable. Content authoring gets deferred because it requires launching CS2, playing the game, and doing tedious data entry. The app gains URL routing and a FreshnessBadge component but still has 10 lineups and empty scenarios. Features without content.

**What should be cut:**

1. **F-MVP-7 (Content Freshness Fields):** Nobody needs freshness badges when you have 10 lineups. Add this when you have 30+.
2. **F-MVP-8 (Boot Validator Hardening):** The single-author JSON workflow doesn't need 6 new validation checks. Fix bugs when they appear.
3. **F-MVP-6 (URL Routing):** Nice but not essential for a single user. Defer to v2.
4. **F-MVP-5 (Bug Fixes):** C-3 is 3 lines, do it. C-4 is already fixed. C-5 needs a design rethink, not a code fix.

**What's the minimum genuinely useful product?**

Three things make this useful enough to bookmark:

1. **3 populated scenarios** — with real lineup actions, descriptions, and timing. "Let's do scenario 1" works end-to-end.
2. **20+ lineups** — enough to cover the core A and B executes plus CT defaults.
3. **Fix the broken source URLs** — replace the 7 dead NadeKing links.

Everything else (routing, freshness, onboarding, accessibility) is improvement on a product that works.

**Timeline estimates:**

- **Solo developer (owner doing both code and in-game content):** Minimum useful product in 3-4 weekends. Most time is in-game lineup capture and scenario wiring, not code. Code changes for minimum useful: ~50 lines (fix C-3, fix broken URLs, maybe restructure descriptions).
- **Two-person team:** One person does in-game capture while the other does code tasks. Minimum useful in 2 weekends.

---

## 2.4 Strategic Recommendations

**Recommendation: Iterate on what exists. Not a rebuild, not a pivot.**

The codebase is clean. The architecture is right. The data model supports everything the plan envisions. The problem is not code — it's content. An "incremental rebuild" is the correct label, but 90% of the work is authoring, not engineering.

[OWNER INPUT NEEDED] The decision between "iterate" and "rebuild" depends on whether you're satisfied with the current code quality. If yes, iterate on content. If no, the rebuild plan's code tasks are reasonable — but prioritize content first regardless.

**Top 5 highest-impact changes (iterate path):**

1. **Fix the 7 broken NadeKing source URLs.** Replace with working alternatives or remove. 15 minutes. Immediate improvement to user experience. (Confidence: **High**)

2. **Populate scenarios 1, 3, and 5 with real actions.** Wire existing lineups into the scenario players' action arrays. Add `description` and `timing` to each action. 2-3 hours per scenario. This is the unlock — the moment "scenario 4" works, the app has value no competitor offers. (Confidence: **High**)

3. **Add 10-15 new lineups from in-game capture.** Priority: A-site smokes for execute (2-3), B-site smokes for execute (2-3), an HE lineup, a second molotov. Bring the total to 20-25. Use the existing CLI (`npm run new-lineup`). 4-6 hours in-game. (Confidence: **High**)

4. **Fix C-3 (Map tab state leak).** Add `activeThrowFromKey: null` to SELECT_SCENARIO and SELECT_LINEUP in reducer.ts. 3 lines of code. (Confidence: **High**)

5. **Add ErrorBoundary to v6 theme.** Replace the 6 hardcoded dark colors in ErrorBoundary.tsx with imports from `theme.ts`. 5 minutes. (Confidence: **High**)

**The one decision that matters more than any other:**

Stop writing documents and start populating scenarios. The planning documents (including this one) now total ~4,000+ lines across 4 files. The actual playbook data is 904 lines with empty scenario actions. The ratio of planning to content is roughly 4:1. Invert it. [OWNER INPUT NEEDED]

---

## 2.5 Confidence Levels

| Recommendation | Confidence | What Would Change My Mind |
|---------------|-----------|---------------------------|
| Iterate, don't rebuild | **High** | If the owner wants multi-map, a public-facing product, or features that require architectural changes (backend, auth, DB). |
| Populate scenarios as #1 priority | **High** | If the owner's team doesn't actually use coordinated executes — if they just solo queue, scenarios don't matter. |
| Content > code right now | **High** | If significant bugs exist that I missed in this audit. If the app doesn't actually load in production (I haven't tested the deployed version). |
| Fix broken URLs immediately | **High** | Nothing — this is objectively broken right now. |
| Don't add `tacticalPurpose` field | **Medium** | If the owner wants to structurally separate "why to throw" from "how to throw" in the UI with different visual treatment. A new field makes that cleaner than convention-based parsing of descriptions. But the content exists either way. |
| Defer URL routing to v2 | **Medium** | If the owner frequently shares specific lineup/scenario links with teammates. Then routing becomes critical for the team coordination use case. |
| C-5 needs a design rethink | **Medium** | If someone finds a CSS/SVG technique for mobile touch targets that doesn't cause the adjacent-spawn overlap issue. The problem is geometric: T-14 and T-15 are ~1.5 viewBox units apart with r=0.95 dots. Any hit circle >1.5 radius overlaps. |
| Origin-first browsing is the right bet | **Low** | No evidence either way. The ecosystem is unanimously destination-first. The owner prefers origin-first. Whether other users would too is unknown. |
| Team-first pedagogy works | **Low** | Untested hypothesis. Makes intuitive sense for a coordinated stack but could be wrong. Would need user testing. |

---

## If You Only Do Three Things

**1. Populate three scenarios with real actions.** Wire existing lineups into Scenarios 1, 3, and 5. This is the moment the app becomes useful — the moment "let's do scenario 1" works end-to-end. No other platform can do this. Everything else is optimization.

**2. Fix the seven broken NadeKing source URLs.** This is a production bug affecting 70% of lineup detail views right now. Replace with working links or remove the source section. Takes 15 minutes.

**3. Add 10-15 new lineups from in-game capture.** The app needs enough content to cover basic A and B executes. 10 lineups isn't enough for a single scenario to have a complete utility sequence. 20-25 makes "scenario 1" possible with real throws.

Everything else — routing, freshness badges, validators, new schema fields, accessibility fixes — is improvement on a product that works. None of it matters until the product works.
