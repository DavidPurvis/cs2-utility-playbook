# Philosophy Map: Research ↔ Codebase Bridge

**Date:** 2026-05-22
**Inputs:** `docs/CS2_UTILITY_ECOSYSTEM_RESEARCH.md` (ecosystem research) + `docs/CODEBASE_AUDIT.md` (codebase audit)
**Purpose:** Map the relationship between how utility SHOULD be taught (per the research) and what this codebase ACTUALLY does. This is the analytical foundation for deciding what to build, what to skip, and why.

---

## 1. Pedagogical Alignment Analysis

The research identifies seven major pedagogical approaches to teaching CS2 utility. For each: does our app use it, how well, and what would it take to add or improve it?

---

### 1.1 Lineup Memorization

**What the research says:** The dominant approach across the ecosystem. CS2UTIL, CSNADES.gg, lineups.gg, Smoke Baron, and most workshop maps treat utility as a pattern-matching and motor-skill problem. Learn the position, learn the aim point, drill until automatic. The unit of learning is the individual lineup. Progress is measured by how many you know and how consistently you land them. (Research Part 3, "The Memorization School")

**What our app does:** The 2x2 walkthrough (`src/components/LineupDetail.tsx`, 413 lines) is a memorization tool. Four cards — Position, Aim, Throw, Result — give the user everything needed to reproduce a lineup: screenshot of where to stand, screenshot of crosshair alignment, throw mechanics (style + movement), and the expected result. The `setpos`/`setang` console commands are copyable for instant in-game teleportation. Steam deep-links launch CS2 directly at the practice position.

**How well we execute vs. best-in-class:**

| Dimension | Our App | Best-in-Class | Verdict |
|---|---|---|---|
| Setpos/setang coords | Yes, copyable | CS2UTIL: yes | **Match** |
| Difficulty rating | Field exists but all 10 lineups are "medium" | CS2UTIL: Easy/Medium/Hard calibrated per lineup | **Gap** — data exists, not calibrated |
| Screenshot quality | 3/4 slots filled (throw missing), .webp format | CS2UTIL: interactive 2D viewer with step markers | **Adequate** — different medium, not inferior |
| Volume | 10 lineups (Dust 2 only) | yprac: 1,400+ across all maps; CS2UTIL: 700+ | **Massive gap** — 140x behind leader |
| Drill support | None (browser-only reference) | yprac: in-game guided mode with trajectory overlay | **Missing entirely** |
| Team context | Scenario system provides team context for each lineup | No competitor does this | **Unique advantage** |

**Assessment:** Our memorization tool is technically competent — setpos coords match cs2util, the 2x2 walkthrough is clear and structured. But our volume is 140x behind the ecosystem leader, our difficulty ratings are uncalibrated, and we have zero drill capability. The team context provided by scenarios (when populated) is our only competitive edge in this category.

**What it would take to improve:**
- Calibrate difficulty ratings: data-only change, zero code. Effort: LOW.
- Increase lineup volume: content authoring via `npm run new-lineup`. Effort: HIGH (each lineup requires in-game capture of coordinates + 3-4 screenshots).
- Add drill capability: would require Refrag deep-links or practice config export. Effort: LOW for links, MEDIUM for config generator.

---

### 1.2 Tactical Reasoning (The "Why")

**What the research says:** The second school of thought, represented by voo/Gosu Academy, Elmapuddy, and n0thing. Their thesis: understanding beats memorization. The specific lineup is the least important part — what matters is knowing which sightlines need blocking, which positions need clearing, and why. A player who understands the geometry can derive good-enough utility on any map. (Research Part 3, "The Understanding School")

The research identifies this as the harder but more durable approach. Memorization-only players are brittle — they can't adapt when the enemy reads their pattern, when geometry changes in a patch, or when they play an unfamiliar map. Understanding-oriented players can improvise.

**What our app does:** Our app has the **architecture** for teaching WHY, but the content is empty.

- `Lineup.description` (optional string field, `src/types.ts:90`) is populated on all 10 lineups with multi-paragraph tactical context — e.g., the xbox_smoke description explains it blocks the CT AWP from mid doors and is the most important T-side smoke on Dust II. The descriptions contain both WHY (tactical purpose) and HOW (positioning + aim instructions), mixed together rather than structurally separated.

- `ScenarioAction.description` (optional string, `src/types.ts:115`) could explain each step's purpose within the execute — e.g., "After support smoke peeks, throw this flash." Currently unpopulated because all scenarios have `actions: []`.

- `ScenarioAction.timing` (optional string, `src/types.ts:116`) could explain WHEN in the round to throw — e.g., "t+3s after round start." Also unpopulated.

- `Scenario.description` (string, `src/types.ts:133`) exists and IS populated on all 5 scenarios — but describes the scenario's goal, not the tactical reasoning behind each step.

- `CtPosition.utilityFocus` (string, `src/types.ts:159`) gives loose WHY guidance — e.g., "smoke long, molly default." This is the closest thing to tactical reasoning currently in the app, but it's freeform text, not structured.

**How well we execute vs. best-in-class:**

| Dimension | Our App | Best-in-Class | Verdict |
|---|---|---|---|
| Why a lineup exists | Description populated with tactical context on all 10 lineups | Elmapuddy: full video narrative explaining pro-level reasoning | **Partial** — descriptions contain WHY content but lack structured separation from HOW instructions |
| Why a sequence matters | Scenario description exists but actions empty | Refrag Utility Hub: in-depth explanation of how/when/why per nade | **Empty** — same issue |
| Tactical principles | Not present in app (documented in CS2_UTILITY_ENCYCLOPEDIA.md) | voo: teaches strategic decision-making frameworks | **Not in product** — in docs only |
| Counter-utility awareness | Not modeled | Research §4.1: counter-utility is a core concept at FACEIT 9+ | **Missing entirely** |

**Assessment:** This is the biggest philosophical gap. The research's synthesis view (Part 3, "The Synthesis View") argues that the optimal learning path is: understand principle → learn lineup → drill → apply → adapt. Our app skips step 1 entirely and has no mechanism for step 5. The data model supports it (description fields exist), but the content doesn't deliver it.

**What it would take to improve:**
- Populate `Lineup.description` with tactical purpose: data-only change. Effort: LOW per lineup, but requires domain expertise to write well.
- Populate `ScenarioAction.description` and `timing`: requires populating scenarios first (C-1). Effort: MEDIUM (content + thought).
- Add a "Tactical Notes" section to the walkthrough view: MEDIUM code change (new component or expansion of LineupDetail).
- Embed the 8 derivation principles from Research §5.6 into the app: HIGH effort, fundamental feature addition.

---

### 1.3 Progressive Complexity

**What the research says:** The research documents dramatically different utility needs across skill levels (§4.4):

- **Silver/Gold Nova:** Learning literally 3 smokes per map creates outsized advantage.
- **MG/DMG:** Timing coordination matters more than new lineups.
- **Supreme/Global/FACEIT 6-8:** Adaptive utility — reading the enemy and adjusting.
- **FACEIT 9-10+:** Coordinated team utility with counter-utility.
- **Tier-1 Pro:** Utility IS the round; weapons cash in on utility's openings.

Platforms that implement progressive complexity: yprac (difficulty per lineup), Refrag (bootcamp curricula with skill levels), CSDB.gg (Easy/Medium/Hard ratings). The research's recommended learning path (§5.5) is structured in 4 phases spanning weeks to months.

**What our app does:** The difficulty system exists in the type definitions but is functionally inert.

- `Lineup.difficulty`: `"easy" | "medium" | "hard"` — all 10 lineups are `"medium"`. No easy lineups for beginners, no hard lineups for advanced players. The field renders on the walkthrough card but communicates nothing because there's no variance.

- `Scenario.difficulty`: `"beginner" | "intermediate" | "advanced"` — scenarios have varying difficulties (2 intermediate, 1 advanced, 2 beginner) but since all scenarios are empty, this is theoretical.

- No learning path, no "start here" guidance, no progression from simple to complex.

- The Defaults tab (`src/components/tabs/DefaultsTab.tsx`, 324 lines) teaches structural knowledge (plant spots, round timings, spawn rushes) that is foundational — this is implicitly "Phase 0" content that other platforms don't surface at all.

**How well we execute vs. best-in-class:**

| Dimension | Our App | Best-in-Class | Verdict |
|---|---|---|---|
| Difficulty ratings | Field exists, all "medium" | yprac: calibrated per lineup across 1,400+ | **Inert** |
| Suggested order | No ordering beyond tab layout | Refrag Bootcamp: structured multi-day curriculum | **Missing** |
| Skill-level targeting | One-size-fits-all | Research §5.5: 4-phase learning path | **Missing** |
| Foundational knowledge | Defaults tab (plants, timings, rushes) | No competitor surfaces this | **Unique strength** |

**Assessment:** The type system supports progressive complexity, but the content doesn't use it. The Defaults tab is an underappreciated asset — no other platform teaches plant spots, round timings, and spawn rush matchups as structured reference data. This IS foundational knowledge that other platforms assume you already have.

**What it would take to improve:**
- Calibrate difficulty ratings on existing lineups: data-only. Effort: LOW.
- Add "easy" lineups (e.g., the simplest T-spawn smokes): content authoring. Effort: MEDIUM.
- Add a "Start Here" flow or suggested learning order: MEDIUM code (new component or tab content).
- Implement a multi-phase learning path: HIGH effort, fundamental feature.

---

### 1.4 Interactive Practice

**What the research says:** The shift from video-first to interactive-first is the defining trend in CS2 utility education (Research §5.8). The best practice tools:
- **Refrag NADR:** In-game practice on live CS2 servers. Load lineup by index, rethrow instantly, Grenade Finder reverse-calculates throw positions from landing targets. 550,000+ users.
- **yprac Hub:** Workshop map with guided mode — teleports to position, shows crosshair marker, displays trajectory, places ghost grenade at landing spot. 1,400+ lineups.
- **CS2 native practice:** `cl_grenadepreview 1` shows trajectory arc before throwing. Sub-tick eliminates tickrate inconsistency.

**What our app does:** Zero interactive practice. The app is a browser-based reference tool. Users view the walkthrough, copy setpos/setang commands, then switch to CS2 to practice manually.

The Steam deep-link (`src/utils/steamDeepLink.ts`, 41 lines) launches CS2 with practice commands pre-loaded — this is the closest thing to practice integration. But it's a one-way launch, not an interactive practice session.

**How well we execute vs. best-in-class:**

| Dimension | Our App | Best-in-Class | Verdict |
|---|---|---|---|
| In-game practice | None | Refrag NADR: full in-game practice with rethrow | **Missing entirely** |
| Practice config export | Partial (setpos/setang copy, Steam deep-link) | CS2 native: full practice config commands | **Partial** |
| Guided drill mode | None | yprac: teleport + aim marker + trajectory + ghost | **Missing entirely** |
| Rethrow capability | None | Refrag: `.rethrow` command | **Missing entirely** |

**Assessment:** We are a reference layer, not a practice layer. This is an intentional architectural boundary — the app is browser-based (AR-5: no backend), and in-game practice requires CS2 running. The opportunity is not to BUILD practice tooling but to BRIDGE to it.

**What it would take to improve:**
- Practice config export (full console command block for copy-paste): LOW effort, no architecture change.
- Refrag deep-links ("Practice this in NADR"): LOW effort if Refrag has addressable lineup URLs. Research suggests they don't (no web-addressable lineups), but the NADR `.nade` index command could be documented per lineup.
- yprac workshop references: LOW effort (static links to relevant workshop map).

---

### 1.5 Video Demonstration

**What the research says:** Video is the dominant medium in the CS2 utility ecosystem. CSNADES.gg has 1,396 video tutorials. NadeKing has 3,000+ videos and 1.45M YouTube subscribers. NadeKing's implicit thesis: utility learning should be entertaining enough that players voluntarily practice it. (Research §1.3)

The research notes a shift from video-first to interactive-first (§5.8), but video remains the accessibility standard. Most players discover lineups through YouTube before ever visiting a lineup database.

**What our app does:** Screenshots only. Each lineup has 4 screenshot slots (position, aim, throw, result). Currently 3/4 slots are filled per lineup (throw slot consistently missing). Images are .webp format, stored in `public/screenshots/dust2/<lineup_id>/`.

No video content. No YouTube embeds. No GIF demonstrations.

**How well we execute vs. best-in-class:**

| Dimension | Our App | Best-in-Class | Verdict |
|---|---|---|---|
| Visual medium | Static screenshots | CSNADES.gg: original video per lineup | **Different medium**, not inferior for reference use |
| Motion demonstration | None | NadeKing: full throw demonstration with commentary | **Missing** for movement-dependent lineups (jump throws, run throws) |
| Discoverability | None (no public content) | NadeKing: 328M+ YouTube views drive discovery | **Not applicable** — personal tool, not public platform |

**Assessment:** The absence of video is not a pedagogical failure — it's a scope decision. Screenshots serve reference use (quick lookup during warmup) better than video. For a personal tool used by one player, the overhead of producing and hosting video is unjustified. The gap matters only for movement-dependent lineups (jump throws, run+jump throws) where a screenshot can't convey the timing.

**What it would take to improve:**
- YouTube embed field on Lineup type: LOW code change. But requires finding/creating videos per lineup.
- GIF capture of throw motion: MEDIUM effort per lineup (screen recording + conversion).
- Short looping video clips (<5s) for movement-dependent lineups only: targeted improvement, not blanket video coverage.

**Recommendation:** Do NOT pursue comprehensive video. Add a `videoUrl` optional field for lineups where movement timing is critical (jump throws, run throws), embed YouTube if available. This addresses the pedagogical gap without changing the app's content philosophy.

---

### 1.6 Map-Based Exploration

**What the research says:** Every major platform uses some form of map-based navigation. CS2UTIL's interactive 2D map viewer, SCOPE.gg's clickable grenade positions, Smoke Baron's map overviews. But ALL of them are **destination-first**: click where you want the grenade to land, see options for throwing it. (Research Part 2, "Content Organization Models — A Taxonomy")

The research explicitly notes that **no platform offers origin-first browsing**: "I'm standing at T-spawn, what can I throw from here?" (Research §5.4, "The missing")

**What our app does:** The Map tab (`src/components/tabs/MapTab.tsx`, 290 lines) implements origin-first browsing. Every unique `throwFrom` position is a marker on the radar. Lineups within ~150 world units cluster into a single marker. Click a marker → see all lineups throwable from that position → click a lineup → open the 2x2 walkthrough.

This is the app's most distinctive feature. It inverts the mental model: instead of "I want to smoke CT spawn — where do I stand?", it's "I'm standing here — what can I throw?"

**How well we execute vs. best-in-class:**

| Dimension | Our App | Best-in-Class (destination-first) | Verdict |
|---|---|---|---|
| Browsing paradigm | Origin-first (unique) | CS2UTIL: destination-first | **Unique — no comparison** |
| Map interaction | Click markers → panel → walkthrough | CS2UTIL: click destination → step-by-step instructions | **Different but functional** |
| Clustering | Auto-cluster within 150 wu | CS2UTIL: manual categorization by target | **Algorithmic vs editorial** |
| Visual density | Low (10 lineups = few markers) | CS2UTIL: 109 lineups on Dust 2 alone | **Content-limited** |

**Assessment:** Origin-first is a genuine innovation, but its value is unproven because we have so few lineups. With 10 lineups, the Map tab has ~7 markers. With 50+ lineups, the origin-first view would show every position on the map where utility is possible — this becomes a spatial index of "where should I stand?" that no competitor offers. The feature's value scales with content volume.

**What it would take to improve:**
- More lineups: the Map tab improves automatically as content grows. No code needed.
- Filter by utility type on Map tab: MEDIUM code change (add type filter buttons, dim non-matching markers).
- Show landing positions as ghost markers: MEDIUM code change (draw landing dots connected by arcs to origin markers).

---

### 1.7 Team Coordination

**What the research says:** This is the single biggest gap in the entire CS2 utility learning ecosystem. The research is unambiguous: "No platform models coordinated utility sequences across multiple players. Every resource treats utility as an individual activity, but CS2 is a team game." (Research §5.4)

The research traces this gap to the ecosystem's heritage. The Astralis era (§5.0) established scripted team utility as the professional standard, but no educational platform has made this teachable to non-pros. Solo Combinations on CSNADES.gg model multi-grenade sequences from one player, but not multi-player coordination.

Pro teams solve this with private Discord channels, scrimmage protocols, and coaching — none of which are accessible to the target audience of this app.

**What our app does:** The scenario system (`src/types.ts:128-141`, `src/components/ScenarioDetail.tsx`, 349 lines) is the architecture for team coordination:

- Each scenario models 2-5 players
- Each player has a role (freeform: "entry", "support", "lurker"), label, color, and starting spawn
- Each player has a chronological action list: ordered lineup references with optional description and timing
- The ScenarioDetail view renders colored arcs on the radar from throw origin to landing, with role tabs filtering the action list
- Scenarios have stable numbers for voice protocol ("let's do scenario 4")

This is the app's most architecturally ambitious feature. **No competitor has anything like it.** The closest is Smoke Baron's "350+ grenade combinations for advanced team plays" — but those are editorial content, not structured data.

**The problem:** All 5 scenarios have `actions: []`. The architecture exists but the content is empty. The headline interaction ("do scenario 4") leads to an empty view.

**How well we execute vs. best-in-class:**

| Dimension | Our App | Best-in-Class | Verdict |
|---|---|---|---|
| Multi-player modeling | Full architecture (roles, colors, ordering, timing) | No competitor has this | **Unique** |
| Content | Zero populated executes | n/a | **Empty** |
| Voice protocol | Stable scenario numbers | Astralis-era scripted calls (non-public) | **Aligned with pro practice** |
| Role-based views | Role tabs with color-coded arcs | No competitor has this | **Unique** |
| Radar visualization | Arcs from origin to landing, dimmed for inactive roles | No competitor has this | **Unique** |

**Assessment:** This is simultaneously the app's greatest strength and greatest weakness. The architecture is production-quality, tested, and unique. The content is completely absent. One editorial session wiring existing lineups into 2-3 scenarios would prove the concept and unlock more product value than any engineering work.

**What it would take to improve:**
- Populate 2-3 scenarios with existing lineups: ZERO code, pure content authoring via `npm run new-scenario` or manual JSON editing. Effort: LOW (hours, not days).
- Add inter-player timing coordination (visual timeline): HIGH code effort, new component.
- Add "practice this role" mode (isolate one player's actions as a drill sequence): MEDIUM code effort.

---

## 2. Content Philosophy Audit

### 2.1 Our Organizational Hierarchy vs. the Ecosystem

**The ecosystem standard:** Map → Utility Type → Landing Target. This is destination-first: the user knows what they want to smoke and is looking for a specific throw position. CS2UTIL, CSNADES.gg, lineups.gg, CSDB.gg, Smoke Baron — all follow this pattern.

**Our hierarchy:** Map → Usage Context (tab) → Entity. The four tabs represent different ways a player might NEED utility:

| Tab | Usage Context | Implicit Question |
|---|---|---|
| Defaults | Structural knowledge | "What do I need to know before any round?" |
| Scenarios | Team coordination | "What does my team do for this execute?" |
| Instant Smokes | Round-start opportunity | "What can I throw right now from spawn?" |
| Map | Spatial exploration | "I'm standing here — what's available?" |

This is **usage-context-first**, not utility-type-first or destination-first. The hierarchy reflects HOW the user encounters utility in a match, not HOW utility is taxonomically organized. This is a deliberate departure from the ecosystem standard.

**Research verdict:** The research doesn't evaluate usage-context-first organization because no platform has tried it. The closest analogue is CSDB.gg's side-first organization (Map → Side → Position), which the research rates favorably as "role-aware reference." Our approach goes further by organizing around tactical situations rather than spatial positions.

**Is our hierarchy the right one?** For our specific audience (one player who plays Dust 2 with a regular stack), usage-context-first is correct. The user doesn't think "I need a smoke lineup" — they think "we're doing the A execute" (scenarios) or "what can I throw from here?" (map) or "the round just started, what's quickest?" (instant smokes). The hierarchy matches the user's mental model during a match.

For a general-purpose platform serving thousands of users, utility-type-first is more scalable. But we're not building a general-purpose platform.

### 2.2 Does Our Content Teach WHY or Just HOW?

**The HOW (what we do well):**

The 2x2 walkthrough is a precise HOW tool. For each of the 10 lineups, the user gets:
- Exact position (screenshot + setpos coordinates)
- Exact aim point (screenshot + setang coordinates)
- Throw mechanics (style: normal/jump/run/jump+run/crouch; movement: standing/walking/running)
- Expected result (screenshot + landing coordinates)

This is sufficient to reproduce the lineup in-game. The setpos/setang precision matches or exceeds CS2UTIL.

**The WHY (what's missing):**

Examining the actual data in `src/data/dust2.json`:

- `xbox_smoke` — The user sees: "Xbox Smoke, smoke, T-side, Mid area, jump throw, medium difficulty." What they DON'T see: "This is the single most important smoke on Dust 2. It blocks the CT AWPer's sightline from mid-doors to T-spawn, enabling safe passage to lower tunnels or B. Without this smoke, the CT AWPer controls the entire center of the map with a single angle." (Research §4.6, Dust 2)

- `a_ct_smoke` — The user sees the position, aim, throw, result. What they DON'T see: "Blocks CT rotations from B through CT-spawn. Adds 3-5 seconds to the rotation time. This smoke is what makes an A execute work — without it, CTs rotate freely and arrive before you can plant."

- `ct_long_doors_smoke` (CT-side) — The user sees it's a CT smoke for the A area. What they DON'T see: the asymmetric purpose — "Same corridor as the T-side long push, but opposite intent. CTs smoke to DELAY the T push, buying time for rotation. Ts smoke to ENABLE crossing."

The `description` field exists on all 10 lineups and already contains tactical context — explaining why to throw, when, and what happens if you don't. However, tactical purpose is mixed with how-to instructions rather than structurally separated, making it harder to scan for the "why" at a glance.

**The research's verdict on WHY:** Part 3 ("The Synthesis View") argues the optimal learning path requires understanding the principle BEFORE learning the specific lineup. Without WHY, the user builds a brittle skill set — they can throw the Xbox smoke but don't know to skip it on eco rounds (save the $300) or to throw it later in the round as a fake (hold it for 20 seconds, then smoke mid while actually executing B).

### 2.3 Asymmetric Utility Logic

**What the research says:** Section 4.5 ("The Asymmetric Logic of Map Control Through Utility") documents a core insight: the same physical location on a map requires different utility from each side because the tactical context is fundamentally different.

The research gives multiple examples:
- Mirage A-site: T-side smokes block DEFENDERS (crossfire isolation). CT-side smokes block ATTACKERS (post-plant denial). Same physical area, opposite direction.
- Inferno Banana: T-side utility is about TAKING territory (offensive). CT-side utility is about HOLDING territory (defensive). Same corridor, opposite purpose.
- Dust 2 mid-doors: Ts smoke to CROSS safely. CTs smoke to HIDE their setup. Same position, opposite information intent.

**What our app does:** The data model supports T and CT sides (`Side = "T" | "CT"` in `src/types.ts:18`). We have 7 T-side lineups and 3 CT-side lineups. The Instant Smokes tab separates T and CT columns.

But we never explicitly teach the asymmetry. The user sees `xbox_smoke` (T-side, Mid) and `ct_mid_smoke` (CT-side, Mid) as two independent lineups. The app doesn't surface the relationship: "These two smokes land in similar areas but serve opposite purposes. The T-side smoke enables crossing; the CT-side smoke hides defensive positioning."

**This is a critical gap.** The asymmetric logic of utility is what separates a player who memorizes 10 lineups from a player who understands Dust 2's tactical geometry. A player who grasps the asymmetry can derive new utility — "if the T-side smokes mid to cross, the CT counter is to push through the smoke before it blooms, or to HE-clear it." Without the asymmetry, they can only execute rote patterns.

**What it would take to address:**
- Add a `tacticalPurpose` or `tacticalContext` field to Lineup type: LOW code change.
- Populate purpose text per lineup explaining the side-specific intent: MEDIUM content effort.
- Add visual pairing of T/CT lineups that target the same area: MEDIUM code (new component showing mirrored utility for the same location).
- Embed the asymmetric principles from Research §4.5 into the Defaults tab or a new "Concepts" section: MEDIUM-HIGH effort.

### 2.4 Solo Queue vs. Team Utility

**What the research says:** Section 5.2 warns that platforms which don't differentiate solo-queue and team utility create false expectations: "A coordinated 3-smoke execute doesn't work when your random teammates don't know the other two smokes."

The research identifies one-way smokes and position-clearing mollies as pure solo-queue tools (one player, no coordination needed), while execute smokes and support flashes are team-dependent (require synchronized teammates).

**What our app does:** The scenario system inherently models TEAM utility (2-5 players, coordinated actions). The Map tab and Instant Smokes tab surface ALL lineups regardless of whether they require coordination.

But there's no explicit label. A player browsing the Map tab sees `a_ct_smoke` (a T-side execute smoke) alongside `ct_molly_from_long` (a position-clearing molly). The smoke is useless without coordinated teammates throwing the companion smokes; the molly works as a solo play. The app treats them identically.

**What it would take to address:**
- Add a `soloViable` boolean or `coordinationType` enum to Lineup type: LOW code change.
- Label lineups as "solo" or "team-dependent" in the walkthrough and Map tab: LOW code change.
- Filter Map tab or Instant Smokes by solo-viability: MEDIUM code change.

### 2.5 Rank Bracket Differentiation

**What the research says:** Research §4.4 documents five skill tiers with fundamentally different utility needs. What changes at Silver is different from what changes at MG, which is different from what changes at FACEIT 9+. The recommended learning path (§5.5) is structured in 4 phases spanning weeks to months, with different resources appropriate at each phase.

**What our app does:** Nothing. All content is presented identically regardless of the user's skill level. There is no "start here for beginners" flow, no skill-level filter, no progressive unlock.

**But this may be correct for our audience.** The app serves one specific player at a specific skill level. If that player is ~MG-DMG (implied by the content depth and team play focus), the app doesn't need to serve Silver or Global players. The absence of rank differentiation is a scope decision, not a gap — as long as the content is calibrated for the right level.

**The risk:** If the content is calibrated for one rank and the user improves past that rank, the app becomes less useful. The research's Phase 3-4 progression (adaptive utility, counter-utility, IGL allocation) is not addressable by the current architecture.

---

## 3. Feature Gap Analysis with Strategic Priority

Every gap from the audit's §8 ("What's Missing"), evaluated against the research.

### Priority Matrix

| Feature Gap | Pedagogical Importance | Competitive Importance | Technical Complexity | Priority |
|---|---|---|---|---|
| **Populate scenarios** | CRITICAL — unlocks headline feature, team coordination pedagogy | No competitor has this; validation proves unique concept | ZERO code, content only | **P0 — Do first** |
| **Tactical context per lineup** (description field) | CRITICAL — Research Part 3 says WHY is half the learning | Refrag Utility Hub, Elmapuddy provide this | ZERO code, content only | **P0 — Do alongside scenarios** |
| **Difficulty calibration** | HIGH — Research §4.4 says progression is core | yprac, CSDB.gg have this | ZERO code, data-only | **P1 — Quick win** |
| **Asymmetric utility teaching** | HIGH — Research §4.5 says this is foundational | No competitor does this explicitly | LOW-MEDIUM code + content | **P1 — Unique opportunity** |
| **Practice config export** (console command block) | MEDIUM — bridges reference to practice | CS2UTIL has setpos; we have it too | LOW code | **P2 — Easy add** |
| **Refrag deep-links** | MEDIUM — natural partner integration | Refrag is complement, not competitor | LOW code (if URLs exist) | **P2 — Easy add** |
| **T-side role guide** | MEDIUM — mirrors existing CT guide; Research documents Refrag's 7-role taxonomy | No competitor has role-based lineup allocation | MEDIUM code (mirrors CtPositionGuide) | **P2 — Extends existing pattern** |
| **Solo/team lineup labels** | MEDIUM — Research §5.2 warns about false expectations | No competitor differentiates | LOW code + data | **P2 — Quick win** |
| **More lineups** (volume) | MEDIUM — 10 is thin, but quality > quantity for personal tool | Competitors have 100x-1400x more | HIGH content effort | **P3 — Ongoing** |
| **HE content** | MEDIUM — Research §4.1 documents HE-into-smoke as signature CS2 maneuver | CS2UTIL has HE lineups | ZERO code, content only | **P3 — Content gap** |
| **Decoy content** | LOW — Research §4.1 notes decoys are "most underused utility" | Minimal coverage anywhere | ZERO code, content only | **P4 — Low value** |
| **Video/GIF for movement-dependent lineups** | LOW — Screenshots adequate for reference; video for jump throws specifically | CSNADES.gg, NadeKing dominate video | MEDIUM code + HIGH content | **P4 — Only for jump throws** |
| **Difficulty progression / learning path** | LOW for personal tool — user is one skill level | Refrag Bootcamp has this | HIGH code (new feature) | **P4 — Wrong niche** |
| **Community features** | NONE — violates AR-7, single-author by design | cs2util, CSDB.gg have this | HIGH code + backend | **P5 — Anti-requirement** |
| **Analytics / performance tracking** | NONE — Leetify/SCOPE.gg own this | Leetify, SCOPE.gg | HIGH code + backend | **P5 — Anti-requirement** |
| **Multi-map** | NONE — converging scope (v1 had 8 maps → v6 has 1) | Every platform has all maps | MASSIVE code + content | **P5 — Anti-requirement** |
| **In-game overlay** | NONE — browser-only by design | Refrag NADR | Impossible without CS2 plugin | **P5 — Out of scope** |
| **Destination-first browsing** | NONE — our origin-first is the differentiator | Every other platform has this | MEDIUM code | **P5 — Deliberately avoided** |

### Impact vs. Effort Quadrant

```
                        HIGH IMPACT
                            │
         P0: Populate       │  P1: Difficulty
         scenarios          │  calibration
         P0: Tactical       │  P1: Asymmetric
         context            │  teaching
                            │
  LOW EFFORT ───────────────┼─────────────── HIGH EFFORT
                            │
         P2: Practice       │  P4: Video for
         config export      │  jump throws
         P2: Solo/team      │  P3: More lineups
         labels             │  (volume)
         P2: Refrag links   │
                            │
                        LOW IMPACT
```

**The verdict:** The highest-impact, lowest-effort work is ALL content authoring, not engineering. Populate scenarios, write tactical descriptions, calibrate difficulties. Zero code changes required for the top 3 priorities.

---

## 4. Philosophy Statement Draft

### Who We're Building For

**Primary user:** One neurodivergent (autistic) player in the Master Guardian to Distinguished Master Guardian range (~5K-12K Premier Rating). Plays with a regular 2-5 player stack on Dust 2. Needs structure and predictability in learning. Has basic CS2 mechanical skills (can aim, move, buy) but lacks systematic utility knowledge. Uses voice comms with teammates during matches.

**Not our user:** Solo-queue grinders, professional players, players who learn best from video, players who want to explore multiple maps, players who already know 50+ lineups and want a reference database.

### Our Pedagogical Theory

**Thesis:** Utility is best learned in **team context first**, then drilled individually, then explored spatially.

This inverts the ecosystem's default sequence:

| Ecosystem Default | Our Sequence |
|---|---|
| 1. Learn individual lineup | 1. Learn the team execute (scenario) |
| 2. Learn more individual lineups | 2. Understand your role's specific lineups (role tab) |
| 3. Hope for team coordination | 3. Drill each lineup individually (walkthrough) |
| 4. (Never happens for most players) | 4. Explore what else you can throw from positions you visit (map tab) |

**Why this works for our audience:** The user plays with the same teammates. They need a shared vocabulary ("do scenario 4") and shared expectations ("I throw the Xbox smoke, you throw the A-cross smoke, you flash long doors"). Individual lineup mastery is necessary but not sufficient — what makes utility effective is coordination, and coordination requires a shared plan.

The research supports this indirectly: the Astralis era (§5.0) established that scripted team utility beats individual mechanical superiority. But no educational tool has made scripted team utility accessible to non-professionals. Our scenario system is that tool.

### What Makes Us Different

Every other platform in the ecosystem starts with the grenade and works outward. We start with the team and work inward.

| Other Platforms | Us |
|---|---|
| "Here's a smoke" | "Here's what your team does" |
| Destination-first | Origin-first |
| Individual skill | Team fluency |
| Exhaustive coverage | Curated for one map, one team |
| General audience | One specific player |
| Entertainment or reference | Structure and predictability |

### What We Deliberately Don't Do

| Anti-feature | Why Not |
|---|---|
| Destination-first browsing | Our niche is origin-first — adding destination-first would make us a worse version of cs2util |
| Video content | Screenshots serve reference better for quick lookup; video is NadeKing's niche |
| Multi-map support | Convergent scope: depth on one map beats shallow coverage of nine |
| Community submissions | AR-7: single author, trusted data. No invented data (AR-1, AR-4) |
| In-game overlay | Browser-based reference layer; Refrag is the practice layer |
| Analytics | Leetify/SCOPE.gg own this; we're reference, not diagnostic |
| Difficulty progression | Personal tool for one skill level; not a curriculum for all ranks |

### What Mastery Looks Like

For our user, mastery is **team fluency** — not individual lineup count.

**Level 1 (Foundation):** The user can open the app during warmup, look at a scenario, and tell their teammates what each person throws. They can execute their own lineups from the 2x2 walkthrough.

**Level 2 (Coordination):** The user says "scenario 4" and every teammate knows their role without looking at the app. The execute happens with correct timing. Smoke → flash → entry is coordinated, not sequential.

**Level 3 (Adaptation):** The user understands WHY each lineup exists, not just WHERE to throw it. When the enemy reads their default execute, they can adjust — skip a smoke, change timing, swap roles, call an audible. This requires the tactical reasoning that our description fields should teach.

**Level 4 (Spatial Mastery):** The user no longer needs scenarios as scripts. They understand Dust 2's utility geometry from the Map tab — they know what's throwable from every position and can improvise mid-round. The origin-first map becomes their mental model of the map.

The app gets the user from Level 0 (no utility knowledge) to Level 2 (team fluency) directly. Levels 3-4 require the tactical content (descriptions, asymmetric logic) that doesn't exist yet but is architecturally supported.

---

## 5. Assumptions to Validate

Every assumption the codebase makes about users, utility, learning, or content — evaluated against the research.

### SUPPORTED by the research

| # | Assumption | Where in Codebase | Research Evidence | Verdict |
|---|---|---|---|---|
| A1 | Scenarios should have stable numbers for voice protocol | `Scenario.number` in `types.ts:131` | §5.0: Astralis era established numbered scripted utility; pro teams use call numbers | **SUPPORTED** |
| A2 | The user needs structure, not flexibility | Fixed tab order (R-11), no user customization | §4.4: neurodivergent learners benefit from predictable structure; audience constraint is the design language | **SUPPORTED** |
| A3 | Smokes are the most important utility type | 6 of 10 lineups are smokes (60%) | §4.1: smokes cancel sightlines, which is the foundation of site executes; §4.6: every map's canonical utility starts with smokes | **SUPPORTED** |
| A4 | Dust 2 mid-doors smoke is the highest-priority individual lineup | `xbox_smoke` is the first lineup in the data file | §4.6 Dust 2: "The single most important smoke on Dust 2. Blocks the CT AWPer's sightline from mid-doors to T-spawn" | **SUPPORTED** |
| A5 | The 2x2 walkthrough format (Position/Aim/Throw/Result) is adequate for teaching individual lineups | `LineupDetail.tsx` with 4 cards | §5.5 Phase 1: "Learn N smokes using CS2UTIL (has setpos coordinates for instant practice)" — our format matches the recommended reference tool's approach | **SUPPORTED** |
| A6 | T-side execute utility is the priority content | 7 of 10 lineups are T-side | §4.4 MG-DMG: "the hardest problem is getting the bomb down" — T-side executes are the bottleneck at the target skill level | **SUPPORTED** |
| A7 | Boot validation should crash on bad data rather than degrade gracefully | `loadDust2.ts` throws on dangling refs | Audience constraint: user needs to trust the data. Silent failures would erode trust and create confusion | **SUPPORTED** (by design intent, not research directly) |

### CONTRADICTED by the research

| # | Assumption | Where in Codebase | Research Evidence | Verdict |
|---|---|---|---|---|
| A8 | All lineups at "medium" difficulty is acceptable | All 10 lineups: `difficulty: "medium"` in `dust2.json` | §4.4: dramatically different utility needs at each rank bracket; §5.5: recommended path starts with Easy lineups | **CONTRADICTED** — difficulty should be calibrated |
| A9 | 10 lineups is sufficient for Dust 2 | 10 lineups total (7T + 3CT) | §5.5 Phase 1: learn 5 smokes for one map; Phase 2: add 2 pop-flashes + 2 mollies per site. For Dust 2 (2 sites + mid), minimum is ~15 smokes + 6 flashes + 6 mollies = ~27 lineups | **CONTRADICTED** — current volume is below minimum viable for the recommended learning path |
| A10 | Lineup content doesn't need tactical descriptions | `Lineup.description` exists but is unused | Part 3 "The Understanding School": "understanding which sightlines need blocking, which positions need clearing, which timing windows need creating, and why" is essential. §5.1: Refrag Utility Hub explains "how, when, and why" per nade | **CONTRADICTED** — WHY is half the learning |
| A11 | Scenario shells without actions are useful | 5 scenarios with `actions: []` | §5.0: Astralis's power came from SCRIPTS — specific grenades assigned to specific players with specific timing. Empty scenarios are architectural demonstrations, not learning tools | **CONTRADICTED** — empty scenarios teach nothing |
| A12 | No HE or decoy lineups needed | 0 HE, 0 decoy in data | §4.1: HE-into-smoke is "the signature CS2 maneuver"; HE chip damage is economically efficient. Decoys are underused but have legitimate meta applications at FACEIT 9+ | **PARTIALLY CONTRADICTED** — HE should be present; decoy is lower priority |

### INCONCLUSIVE (research doesn't resolve)

| # | Assumption | Where in Codebase | Research Evidence | Verdict |
|---|---|---|---|---|
| A13 | Origin-first browsing is more natural than destination-first | Map tab: `MapTab.tsx` | §5.4 notes origin-first is "missing" from the ecosystem but doesn't evaluate whether it's better. No platform has tested it. The ecosystem is unanimously destination-first — could mean it's the wrong model, or could mean nobody has tried the right one | **INCONCLUSIVE** — untested innovation |
| A14 | Screenshots are adequate as the visual medium (vs. video) | 3/4 slots per lineup, .webp format | §1.3: video is the ecosystem standard. But §5.8 notes a shift toward interactive-first. Screenshots serve reference use (quick lookup) better than video; video serves initial learning better | **INCONCLUSIVE** — depends on use case (reference vs. initial learning) |
| A15 | The app should stay Dust 2-only | Single map, ADR-002 trigger clause | §5.5 Phase 2: "Expand to a second map." The recommended learning path requires multiple maps. But for a personal tool for one player who primarily plays Dust 2, single-map depth may exceed multi-map breadth | **INCONCLUSIVE** — depends on user's actual play patterns |
| A16 | Instant Smokes radius of 1500 world units is correct | `InstantSmokesTab.tsx` proximity heuristic | No research data on what distance constitutes "from spawn." This is an in-game-feel calibration that requires testing | **INCONCLUSIVE** — needs in-game validation |
| A17 | Map cluster radius of 150 world units is correct | `MapTab.tsx` clustering threshold | No research data on spatial granularity. Needs in-game validation: do two positions 150 wu apart feel like "the same spot"? | **INCONCLUSIVE** — needs in-game validation |
| A18 | CT position guide should be "loose recommendations" rather than prescriptive scripts | `CtPosition.utilityFocus` is freeform text, `recommendedLineupIds` is a suggestions list | Research §4.4 FACEIT 9+: role-based utility is important. But research also notes karrigan's FaZe demonstrated that rigid role assignments limit adaptability (§5.0). Both approaches have merit | **INCONCLUSIVE** — loose is safer for the target audience, but prescriptive might be more useful |
| A19 | The user doesn't need round-type-specific utility | No eco/force/full-buy differentiation | §5.4: "No platform teaches what to buy and throw on eco vs. force vs. full buy." This is identified as a gap in the ENTIRE ecosystem. Whether it matters for our specific user depends on their typical economy management | **INCONCLUSIVE** — gap in entire ecosystem, but unclear if it matters for one player on one map |
| A20 | Post-plant utility doesn't need first-class status | No post-plant category in data model | §5.4: "Post-plant utility as a first-class category — arguably the highest-leverage utility in the game." Research identifies this as a gap everywhere. For Dust 2, post-plant mollies on both sites are high-value | **INCONCLUSIVE** — research says it's critical, but the data model could encode this via Lineup.area or Scenario context without a new category |

---

*This document bridges the ecosystem research (what the world does) with the codebase audit (what we do). Use it to prioritize the next phase of work: content authoring first (P0), then targeted code improvements (P1-P2), then evaluate whether P3+ items are worth pursuing based on how the populated app feels in practice.*
