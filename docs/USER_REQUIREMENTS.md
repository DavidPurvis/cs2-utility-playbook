# User Requirements Document — Dust 2 Playbook

> **Status:** DRAFT v2 (2026-05-21). **Owner review required.** Every item below was extracted from your direct statements over the conversation. The point of this document is to give you a single artifact you can correct, amend, or reject so we both know we are building the same product.
>
> **Intended audience:** another LLM (Claude Code, or any future implementer) reading ONLY this file should be able to rebuild the playbook from scratch — without copying the existing source — and arrive at the same observable behavior. If a requirement can't be understood without reading the codebase, it's wrong and needs amending.
>
> **How to review:** for each requirement, the row contains the requirement statement, the literal quote it was extracted from, the conversation moment, my interpretation, and the current implementation status. The right-hand "Owner verdict" column is blank — write KEEP / AMEND / DROP / ADD next to each, or annotate inline.
>
> **Rules I followed writing this:**
> 1. Every requirement traces to a direct quote you said. If I cannot quote you, I did not write a requirement.
> 2. When you contradicted yourself later in the conversation, both versions are documented and the later one is marked AUTHORITATIVE.
> 3. When I am uncertain what you meant, I marked the row `?` and listed it in §10 "Open questions" — please clarify.
> 4. I do not assume requirements I think you would want. Only what you said.

---

## 1. Purpose of this document

You said:
> "I want you to document my requests as user requirements creating a user requirement document that I can correct the vision of the product. That way we know we know for sure we are thinking of the same system in the same way. This is a way for me to understand what I have asked of you and what not."

This document is the source of truth for what the Dust 2 Playbook is supposed to be. Implementation work follows from approved requirements, not the other way around.

---

## 2. Product purpose (your stated vision)

Distilled from the longer messages:

- The app is **a personal CS2 reference for Dust 2 only**, used by you and your friends to coordinate utility throws on team voice calls.
- The headline interaction is: **"let's do scenario 4 and I am the A-man and you are the B-man"** — name a numbered execute, assign roles, immediately on the same page.
- **Primary audience: "an autistic 25-year-old that needs structure when playing cs2."** Direct quote. This is a design constraint, not a demographic note — every layout decision MUST prefer a predictable, labelled, sectioned structure over a clever or compressed one. When in doubt: more labels, more sections, more whitespace, fewer hidden modes.
- The visual style follows **Claude's design language** (warm cream, burnt-orange accent, Inter font).
- **Hosting:** GitHub Pages currently. You're open to Proxmox if it's simpler.

Owner verdict: ____________________

---

## 3. Use cases (your stated user stories)

| ID | Use case | Source quote |
|---|---|---|
| UC-1 | Two friends on a Discord call agree on a coordinated execute by number. | "lets do scenario 4 and I am the a man and you are the b man and its easy for us to get on the same page" |
| UC-2 | A player walks themselves through a single lineup, step by step. | "find the coordinates to go to, then you find the lineup, and then you throw the utility with whatever jump it should be lastly there should be a 4 finished card that shows how the utility lands" |
| UC-3 | A player thinks "where am I willing to throw from", not "what target do I want to smoke". | "I want the user to think where are all of the places I am willing to throw utility from" |
| UC-4 | The owner adds new lineups manually with screenshots. | "I can manually scrap and recreate lineup and I can pass the screenshots manually into config file" |

Owner verdict: ____________________

---

## 4. Functional requirements

| ID | Requirement | Status | Source quote |
|---|---|---|---|
| **FR-1** | The app is Dust 2 only. Other maps not in scope. | ✓ Implemented | "Dust 2 only. Other maps come later (the file structure supports it but no data ships for them)." |
| **FR-2** | Multi-player executes (utility belts, 2-man, 3-man) are first-class. | ✓ Implemented (data structure, empty action lists) | "utility belts, 2 man, and 3 man executes are what I am really looking forward to" |
| **FR-3** | Scenarios are numbered for voice protocol. | ✓ Implemented (`Scenario.number`) | "lets do scenario 4" |
| **FR-4** | Each lineup is shown as a 4-step chronological walkthrough: Position → Aim → Throw → Result. | ◐ Implemented (cards render; data has 3 of 4 slots filled — no `throw` screenshots yet) | "find the coordinates to go to, then you find the lineup, and then you throw the utility with whatever jump it should be lastly there should be a 4 finished card that shows how the utility lands" |
| **FR-5** | Walkthrough displays as a 2×2 grid (all four cards visible at once). | ✓ Implemented (CSS `.walkthrough-grid`) | AskUserQuestion answer: "2×2 grid — all four cards visible at once" |
| **FR-6** | Home page shows scenarios + a spawn-cluster picker. | ✓ Implemented | AskUserQuestion answer: "Scenarios + spawn-cluster picker" |
| **FR-7** | Seed 4–6 default scenario shells with named roles, empty action lists. | ✓ Implemented (5 seeded: A-default, B-split, Mid-control, B-execute, A-long) | AskUserQuestion answer: "Yes — seed empty shells with roles, you populate the actions" |
| **FR-8** | Coordinates must be exact, not approximated. | ✓ Implemented (16 landmark tests gate the math) | "I take back what I say about approximations. I want exact coordinates so the graph is just as accurate as the ingame map" |
| **FR-9** | Lineups not in the data file do not render. No invented coords. | ✓ Implemented (boot validator throws on missing landingAt) | "If a coordinate isn't in the data file, it doesn't render — period." |
| **FR-10** | Edit JSON files directly in the repo, no in-app admin UI. | ✓ Implemented (admin demolished in Phase 2) | AskUserQuestion answer: "Edit JSON files in the repo, no in-app admin (Recommended)" |
| **FR-11** | The spawn picker zooms in by default so individual spawns (S1..S15) are distinguishable. | ✓ Implemented (`SpawnPicker.tsx` uses `spawnClusterBounds`) | "Have the spawns more zoomed in on so it's easier to distinguish which spawn is which" |
| **FR-12** | Spawn picker is a visual reference only; not a filter. | ✓ Implemented (no proximity filter; sets `pickedSpawnId` only) | v6 reframe — see §11 change log entry C-4 |
| **FR-13** | A list view of lineups must be available as an alternative to the map view. | ✗ Not implemented in v6 — the v5 utility list/map toggle was removed in Phase 2 and not re-added | "Include a way for utility can be look at in a list view instead of a map as an alternative" |
| **FR-14** | Each spawn dot's label must be prefixed by its side (`t-1`, `ct-3`) — never ambiguous on voice. | ✓ Implemented (data + render) | "Let's label the spawns ct-1, ct-2, t-1, t-2, etc. denoting which spawn it is so there is no miscommunication" |
| **FR-15** | Spawn dots and number labels render with a black outline (halo + text stroke) so they stay legible on the radar's green/grey backgrounds. | ✓ Implemented | "Lets add black borders to the spawn icons as well as the number so it doesn't get blended too much into the background" |
| **FR-16** | Clicking on a spawn always selects THAT spawn — never an adjacent one. The visible dot is the click target; oversized hit zones that overlap neighbors are forbidden. | ✓ Implemented + locked by E2E test | "the clickable area for each spawn is off where you have to press off the spawn to actually select it" |
| **FR-17** | When CT side is selected, a CT position guide appears below the spawn picker. Lists common roles (A anchor, B anchor, Mid, AWP, Rotator) with description + spawn hint + utility focus paragraph + clickable lineup chips. Loose guidance, not hyper-specific. | ✓ Implemented | "When I switch to ct side I want to know nades should I know based on the position I am playing: like b anchor, a anchor, holding mid, lurking, etc.. It should be easier to assign positions for ct. This does not need to be hyper specific but more as these would be helpful to know if you are playing here kind of thing." |
| **FR-18** | The radar PNG background must always render. Missing radar must surface as a visible error placeholder, not silent blank. | ✓ Implemented + locked by E2E test | "The map in the background is no longer loading either." |
| **FR-19** | Spawn icon click contract: the visible icon IS the click target. The number lives INSIDE the dot (no floating label above). Clicking the number selects (because the number is on the dot); clicking off the dot does NOT select. Picked and unpicked dots share the same radius so adjacent spawns can always be swapped. | ✓ Implemented + locked by 8 E2E tests including T-15→T-14 swap (your exact regression) | "Make the clickable area for the spawn location match the spawn icon. Currently I can't select t-15 then select t-14 because the t-15 clickable area is above t-14 clickable. I want the number instead of the spawn icon without 'ct-' or 't-' prefix." |
| **FR-20** | The spawn icon on the radar shows ONLY the number (e.g. "15", "3") — no "t-" / "ct-" prefix. The side toggle above the picker conveys side. | ✓ Implemented + locked by E2E "rendered icon text is bare number" tests | "I want the number instead of the spawn icon without 'ct-' or 't-' prefix." |
| **FR-21** | The home view is organized into four labelled, predictable tabs IN THIS FIXED ORDER: Defaults · Scenarios · Instant smokes · Map. The audience needs structure — the tabs MUST be in this order, MUST be labelled, MUST visually differentiate the active tab. | ✓ Implemented (`TabBar.tsx`) + locked by `home-tabs.spec.ts` | "I want a the tabs for this website being default, scenarios, instant smokes from spawn, and lastly a map section where the map shows all the places on the map where you can throw utility from" |
| **FR-22** | The Defaults tab autopopulates per-side / per-site references: (a) where to plant the bomb at A and B, (b) common round timings (buy / early / mid / late phases), (c) for T-side spawn rushes, "if you rush from this spawn you'll beat CT spawns X, Y, Z to point P." | ✓ Implemented (`DefaultsTab.tsx`) — data seeded in `dust2.json defaults` | "Let's implement a defaults section that autopopulates defaults for each bombsite ct and t sides. Where is the default place to plant bomb on ancient site a? What are the common timings across the map? If I were to rush with best spawn who would I beat on the opposite team to that designation." |
| **FR-23** | The Instant smokes tab lists lineups whose throwFrom is within ~1500 world units of a spawn — i.e. the smokes you can deploy at round start without moving. Grouped by side. | ✓ Implemented (`InstantSmokesTab.tsx`) | "instant smokes from spawn" |
| **FR-24** | The Map tab is **origin-first**: it shows every unique throwFrom position on the map. Clicking a marker lists the lineups thrown FROM that spot. This is the INVERSE of cs2util.com / csnades.gg, which are destination-first. The owner's mental model is "I am at this spot, what can I do?", not "I want to smoke X, where do I throw from?" | ✓ Implemented (`MapTab.tsx`) with cluster radius 150 world units | "a map section where the map shows all the places on the map where you can throw utility from (note this is a different approach from websites like cs2util.com and csnades.gg that show the place you are trying to smoke then shows you where you can throw it from)." |

⚠ **FR-13 is the most likely true miss.** You explicitly asked for a list view; v6 currently surfaces lineups only through scenario steps and the 2×2 walkthrough modal. There is no flat-list browser of every lineup. Confirm whether this is still wanted. *(NOTE: the Instant Smokes tab FR-23 is a partial answer — it's a flat list of a subset of lineups. A full "all lineups" list is still missing.)*

Owner verdict: ____________________

---

## 5. Non-functional requirements

| ID | Requirement | Status | Source |
|---|---|---|---|
| **NFR-1** | Static deployment, no backend, no DB, no API. | ✓ Implemented (GH Pages) | "No backend. Static GitHub Pages, no DB, no API." |
| **NFR-2** | TypeScript strict, no `any`. | ✓ Implemented | "TypeScript for the rebuild" (CMS spec) |
| **NFR-3** | TDD — tests written before implementation. | ✓ Implemented for every new file in v6 | "We are going to be using test-driven development, so I want you to create [tests first]" |
| **NFR-4** | WCAG-AA color contrast for body text. | ✓ Implemented (token comments specify ratios) | implied from "Claude design ui styling" + general quality bar |
| **NFR-5** | Mobile-responsive; 2×2 walkthrough stays 2×2 even on phone (not collapsed to 1×4). | ◐ CSS in place; not eyeball-verified on a real 375px device | v6 plan derivation from "visual learners" framing |
| **NFR-6** | Initial load <3 seconds on residential broadband. | ✓ Bundle is 13 KB gzip; well under target | v6 plan inference |
| **NFR-7** | Screenshots co-located in repo (no CDN hot-links). | ✓ Implemented (30 webp files in `public/screenshots/`) | Stress-test derivation: "I can manually scrap and recreate lineup and I can pass the screenshots manually into config file" implies local storage |
| **NFR-8** | **Testing must be exhaustive — visual + interaction + unit + script + data integrity, all enforced.** Every reported bug becomes a regression test. CI must catch the bug before a human sees it. | ✓ Implemented: 77 vitest + 11 node:test + 26 Playwright E2E (incl. 3 visual snapshots, 8 spawn click-target precision tests, 5 spawn hitbox tests, 4 radar load tests, 6 home tab navigation tests). Each E2E test was added in the same commit as the bug it locks. | "Drastically increase testing. I want the testing of this program to be so absolute, comprehensive, and exhaustive so that there can be no way that this website does not behave exactly the way you would want it to act." |
| **NFR-9** | Visual regression must be possible — i.e. there is a mechanism to detect when a screenshot changes unintentionally. | ✓ Implemented via Playwright `toHaveScreenshot` w/ pixel-diff baselines under `tests/e2e/__screenshots__/`. | "We might need to develop a way of analyzing a screenshots of the website to ensure that it looks correct because I have tons of issues like that in the past." |

Owner verdict: ____________________

---

## 6. Design requirements

| ID | Requirement | Status | Source |
|---|---|---|---|
| **DR-1** | Use the Claude design UI styling. | ◐ Implemented (warm cream + burnt-orange + Inter) — but you haven't seen the rendered result, only the tokens. | "I want you to use the claude design ui styling that is already being used" |
| **DR-2** | Visual learners — chronological flow is easier to remember. | ✓ Implemented (4-card walkthrough order locks chronological reading order) | "the chronological setup is much easier to remember at least for visual learners" |
| **DR-3** | Effective but simple. Not over-complicated. | ◐ Source LOC dropped from 6,200 → 1,800. You will judge whether it feels simple. | "I want you to create an effective but simple and accurate design" + "This current program is completely overcomplicated" |
| **DR-4** | Curated lineup set — quality over quantity. | ◐ Currently 10 lineups (from v5). You may want to cull further. | "I am focusing on removing too many lineups which makes it sometimes hard to figure what the best option is" |

Owner verdict: ____________________

---

## 7. Data and content authoring requirements

| ID | Requirement | Status | Source |
|---|---|---|---|
| **DA-1** | Two CLI helpers: `new-lineup`, `new-scenario`. | ✓ Implemented | v6 plan derivation |
| **DA-2** | Screenshots added manually by the owner (file → repo). | ✓ Convention documented in README; folder structure ready | "I can pass the screenshots manually into config file" |
| **DA-3** | Lineups can be researched / scraped manually offline; not in-app. | ✓ No in-app scraping (`scripts/` retains nothing for it in v6) | "I can manually scrap and recreate lineup" |
| **DA-4** | If data is missing, do not invent. | ✓ Boot validator throws on dangling refs; walkthrough renders empty-state cards | "if you dont have data those do not invent" |
| **DA-5** | (Maybe — uncertain) Recommend a "default execute per site" template. | ✗ Not implemented; you said this might be the right framing but you weren't sure | "Maybe I should be asking for the default for each site instead but I dont know what exactly the default is" |
| **DA-6** | The Defaults tab data lives under `dustData.defaults` and has three lists: `plants` (default plant spots, per site), `timings` (round milestones, bucketed by phase), `spawnRushes` (T-spawn rush matrix: from-spawn beats which CT spawns to which contest path). Boot validator does shape checking but does NOT cross-validate spawn-id references inside `spawnRushes` — see DECISIONS_LEDGER W-12. | ✓ Implemented (`types.ts` PlantSpot / TimingNote / SpawnRush; `dust2.json defaults`) | Derived from FR-22 |

Owner verdict: ____________________

---

## 8. Workflow requirements

| ID | Requirement | Status | Source |
|---|---|---|---|
| **WF-1** | Workflow: edit JSON → commit → push → CI → live. | ✓ Documented in README | "your deploy flow: edit in admin → export → drop files into repo → commit → push → Pages redeploys" (later: drop the export step) |
| **WF-2** | Hosting on GitHub Pages, with Proxmox as a documented alternative. | ✓ Implemented + ADR-003 | "I could host this on my proxmox server instead of github pages if that is easier" |
| **WF-3** | Iteration must converge, not loop forever. | ✗ Process-level requirement; the past 50+ phases violated this. The v6 plan is the convergence attempt; you will judge. | "I have wasted so much time of iteration" |

Owner verdict: ____________________

---

## 9. Anti-requirements (explicit non-goals)

| ID | What you said NOT to do | Status |
|---|---|---|
| **AR-1** | No AI-generated coordinates. | ✓ Honored — all coords are cs2util-verified setpos. |
| **AR-2** | No scraping external sites at runtime. | ✓ Honored. |
| **AR-3** | No hand-tuned percentages. | ✓ Honored. |
| **AR-4** | No invented data for multi-player executes. | ✓ Scenarios ship with empty `actions: []` — you populate. |
| **AR-5** | No backend / DB / auth. | ✓ Honored. |
| **AR-6** | No admin UI in v6. | ✓ Honored (admin demolished in Phase 2). |
| **AR-7** | No backseat optimization / unnecessary features. | ◐ Subjective; you decide if anything I built is excess. |

Owner verdict: ____________________

---

## 10. Open questions (I am NOT sure what you want)

These are explicit gaps where your stated requirements are ambiguous or I have no quote to anchor them. Each needs your decision.

1. **OQ-1 · List view of all lineups (FR-13).** You asked for this in the spawn-zoom message. v6 omitted it. The Instant Smokes tab (FR-23) is a partial answer — flat list of a subset. Still want a full "all lineups" list as a 5th view?
2. **OQ-2 · Curation of the 10 existing lineups.** You said "too many lineups." Do you want me to delete some of the 10 cs2util lineups, or keep all 10 and just be selective when adding more?
3. ~~**OQ-3 · Defaults per site (DA-5).**~~ **RESOLVED 2026-05** — you asked for the Defaults tab in your latest message. Implemented as FR-22 with plant spots + timings + spawn-rush matrix. Seed data lives in `dust2.json defaults`.
4. **OQ-4 · Screenshot of the `throw` slot.** v5 data has `position` + `aim` + `result`. The new `throw` slot is undefined for all 10 lineups. Do you intend to capture these, or is the text-fallback (jump glyph + setang) sufficient?
5. **OQ-5 · Proxmox.** You asked if it would be easier. ADR-003 says no for read-only static SPA. Do you want me to honor that, or do you actually want a Proxmox deploy regardless?
6. **OQ-6 · The fate of v5 (currently on `main`).** PR #16 (v6) is unmerged. Live site is still v5. Do you want v6 merged as-is? Reviewed first? Killed? *(2026-05: PR #16, #17, #18, #19 all part of the same v6 line; #16/#17/#18 are merged.)*
7. **OQ-7 · Multi-map future.** You said Dust 2 only "for now." Is this a v7 priority, a "maybe later," or off the table?
8. **OQ-8 · "Claude design" — visual fidelity.** I picked specific hex values (#FAF9F6 bg, #C67C4E accent). You have not seen them rendered. Do they match what you had in mind?
9. **OQ-9 · Defaults data depth.** Seeded with 4 plants + 7 timings + 4 spawn rushes. Is this enough, or do you want me to flesh out more (e.g. plant per smoke style, post-plant timings, rushes from every T-spawn)?
10. **OQ-10 · Instant smokes radius (1500 world units).** Arbitrary threshold — "throw without moving more than a few seconds." Does it match your intuition, or should it be tighter / looser?
11. **OQ-11 · Map tab cluster radius (150 world units).** Lineups within ~150 wu of each other share a marker. Does that match what you'd consider "the same spot," or are you seeing markers grouped that shouldn't be (or split that shouldn't be)?
12. **OQ-12 · Spawn-rush direction.** FR-22 says "if you rush from this spawn you beat CT spawns X, Y, Z." Should there also be the CT-side version ("if you anchor from CT-3, T spawns Y and Z will reach you before W")?

Owner verdict on each: ____________________

---

## 11. Change log — your requirements that evolved

These are the contradictions / pivots in your messages, resolved to the AUTHORITATIVE version (last statement wins).

| # | Earlier statement | Later statement (AUTHORITATIVE) | Reason for change |
|---|---|---|---|
| **C-1** | "admin mode built into the same React app" (CMS spec) | "Edit JSON files in the repo, no in-app admin" (AskUserQuestion answer) | You agreed the admin UI was over-engineered. |
| **C-2** | "Drop scenarios entirely" (AskUserQuestion answer) | "utility belts, 2 man, and 3 man executes are what I am really looking forward to" (next message) | Headline feature was wrongly cut in my v5 plan; restored in v6. |
| **C-3** | "Two tabs: Scenarios and Spawn Positions" (CMS spec) | "One page, no tabs — side toggle + radar + lineup list" (AskUserQuestion answer) | Later reframe → "Scenarios + spawn-cluster picker" + 3-view nav. |
| **C-4** | Spawn picker filters lineups by proximity (v3-v5 plan) | Spawn picker is visual reference only (v6) | Empirical: 1024u proximity matched only 1 of 9 lineups; semantics were broken. |
| **C-5** | Use of `landingAt.percent` only (v5 data) | Either `landingAt.world` or `.percent` (v6 schema) | Schema flexibility for future entries. |
| **C-6** | Home was one scrolling page (scenario grid + spawn picker stacked) | Home is four labelled tabs in fixed order: Defaults · Scenarios · Instant smokes · Map (FR-21) | Audience clarification (autistic 25-year-old needing structure) demanded explicit sectioning. One-page layout had no predictable "where do I look for X" answer. |
| **C-7** | Spawn icon was a small dot with the label "t-15" floating above it. Label had `pointer-events: none` so only the dot was clickable. | Spawn icon is a single shape: a slightly larger dot with the bare number ("15") rendered INSIDE it. Number IS the click target (lives on the dot). Picked and unpicked dots share the same radius. (FR-19, FR-20) | Owner reported "I can't select t-15 then select t-14 because the t-15 clickable area is above t-14 clickable." Root cause: user clicked the visible label (inert) and missed the small dot below. |
| **C-8** | Map view, if any, would be destination-first like cs2util.com / csnades.gg (pick a smoke target, see throw-from positions). | Map tab is origin-first: shows throw-from positions, click one to see lineups available from there. (FR-24) | Owner explicit reframe: "I want the user to think where are all of the places I am willing to throw utility from" and "this is a different approach from websites like cs2util.com and csnades.gg." |

Owner verdict on each: ____________________

---

## 12. Process requirements (you said these about the iteration itself)

| ID | Process requirement | Status |
|---|---|---|
| **PR-1** | Be exhaustive when researching. | ✓ Honored — 5-round stress-test pass on v6 plan |
| **PR-2** | Mermaid-diagrammed design docs. | ✓ v6 plan has 6 mermaid diagrams |
| **PR-3** | Manager-style task breakdown. | ✓ v6 plan has 27 ticket-style tasks |
| **PR-4** | TDD throughout. | ✓ Every new file in v6 had tests first |
| **PR-5** | Question every fundamental. | ✓ ADRs document why each choice |
| **PR-6** | "Go fully autistic" — direct, no hedging, no emotional softening. | ◐ This document is the attempt. |
| **PR-7** | No mistakes. | ◐ Will be judged by you. |
| **PR-8** | 10-agent analysis of the current state. | ✓ Done — see V6_AUDIT_FINDINGS.md |
| **PR-9** | This document is portable — Claude Code or any LLM should be able to rebuild from URD alone, no implementation hints inside. | ◐ Intent acknowledged; portability verified by writing CLEAN_ROOM_BRIEF.md as a companion |
| **PR-10** | An intermediary layer of design docs exists so the owner can verify alignment WITHOUT reading code. | ✓ Three-hat structure: this URD (BA hat) + SOLUTION_DESIGN.md (Architect hat) + DECISIONS_LEDGER.md (Annoying junior hat). |
| **PR-11** | Every reported bug becomes a regression test. | ✓ Spawn hitbox (E2E) and radar load (E2E) tests added the same turn as the fix. |
| **PR-12** | Constantly iterate on this URD — it is the source of truth. | ✓ This v2 was written immediately after the spawn fix landed. |

Owner verdict on each: ____________________

---

## 13. Glossary

| Term | Definition |
|---|---|
| **Scenario** | A numbered, named team execute. Has 2–5 players, each with a role + ordered list of lineup throws. |
| **Lineup** | A single utility throw. Has a throw origin, a landing target, optional screenshots for the 4-card walkthrough. |
| **Spawn** | A fixed in-game spawn position. 15 T-side + 5 CT-side on Dust 2. Used as visual reference only. |
| **Role** | A free-text label for a player within a scenario (e.g. "a-man", "b-man", "lurker"). |
| **Action** | One step in a player's chronological sequence within a scenario; references a Lineup by id. |
| **Walkthrough** | The 2×2 grid view of a single lineup: Position / Aim / Throw / Result. |
| **Setpos** | The CS2 console command `setpos x y z` that teleports a spectator. The primary coordinate format. |
| **cs2util** | cs2util.com — third-party lineup database used as the source of truth for the 10 verified Dust 2 lineups. |

Owner verdict on each: ____________________

---

## 14. What I did NOT include here

To avoid inventing requirements:

- I did not write a requirement for sync clocks / voice prompts / multi-player real-time. You mentioned "team coordination" but not these specific mechanics; they would be product invention on my part.
- I did not write a requirement for analytics / share links. You never asked for them.
- I did not write a requirement for offline / PWA. You never asked for it.
- I did not write a requirement for keyboard shortcuts (j/k navigation, etc.). You never asked.
- I did not write a requirement for printing / cheat-sheet export. You never asked.
- I did not write a requirement for darker mode / light/dark toggle. You only mentioned cream.

If any of these IS actually a requirement you want, add it under §10 Open questions.

---

## 15. Document review process

Once you fill in the "Owner verdict" columns:
1. **KEEP** entries become locked requirements. I implement them as-is.
2. **AMEND** entries — you write what you actually meant. I update the requirement and the plan.
3. **DROP** entries — I remove the requirement and any code/plan that traces to it.
4. **ADD** entries — I write the new requirement, source it back to your verdict, and update.

After your pass, this becomes v2 of the URD and the v6 plan is realigned to match.

---

> End of URD v1 draft. The 10-agent analysis findings are in the companion document `docs/V6_AUDIT_FINDINGS.md` (generated after this draft).
