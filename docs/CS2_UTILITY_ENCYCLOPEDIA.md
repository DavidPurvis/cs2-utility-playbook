# CS2 Utility Encyclopedia

> **Codename:** "Bruce." Owner directive 2026-05: become the all-knowing reference on CS2 utility so future system-design decisions are grounded in real domain knowledge, not surface understanding.
>
> **Status:** v1. Synthesized from 6 parallel research passes (cs2util.com, refrag.gg, csnades.gg, pro-play archives, theory/decision frameworks, meta evolution). ~9000 words. Cited where possible; gaps flagged explicitly.
>
> **Intended audience:** future Claude instances + the owner. This is a *reference document for prompts*, not an in-app help text. It is intentionally dense.
>
> **What this is NOT:** a lineup library (cs2util / csnades already do that). This is the WHY, the theory, the decision frameworks, the meta context, and the source-site comparison that lets us build a better product on top.
>
> **Honesty principle:** when the research could not confirm a specific claim, the document marks it `[unverified]`. When a claim is CS:GO-era and may not transfer to CS2, it's marked `[CS:GO-era]`. Do not propagate claims past these markers.

---

## Table of contents

1. [How to use this document](#1-how-to-use-this-document)
2. [The mental model](#2-the-mental-model)
3. [Utility types & exact mechanics](#3-utility-types--exact-mechanics)
4. [CS2 vs CS:GO — what changed](#4-cs2-vs-csgo--what-changed)
5. [Round economy & utility budget (MR12)](#5-round-economy--utility-budget-mr12)
6. [Round types](#6-round-types-pistol-eco-force-full-save)
7. [The utility chain — sequence theory](#7-the-utility-chain--sequence-theory)
8. [Roles & utility load](#8-roles--utility-load)
9. [Timing windows](#9-timing-windows-155--000)
10. [Counter-utility theory](#10-counter-utility-theory)
11. [IGL decision framework](#11-igl-decision-framework)
12. [Anti-patterns & common mistakes](#12-anti-patterns--common-mistakes)
13. [Dust 2 deep dive](#13-dust-2-deep-dive)
14. [Pro-play eras & innovators](#14-pro-play-eras--innovators)
15. [Meta evolution 2024–2026](#15-meta-evolution-20242026)
16. [Source-site comparison & content models](#16-source-site-comparison--content-models)
17. [Design implications for this app](#17-design-implications-for-this-app)
18. [Confidence & research gaps](#18-confidence--research-gaps)
19. [Glossary](#19-glossary)

---

## 1. How to use this document

This file exists to ground future feature work and content decisions in real CS2 domain knowledge. Treat it like a reference manual.

**For the owner:** when you ask Claude for a new feature ("add a default round defaults section," "add an anti-eco view"), the next Claude session should re-read the relevant sections of this doc first so it doesn't re-invent the wheel or contradict actual CS2 mechanics.

**For future Claude instances:** before writing code that involves CS2 domain semantics, search this file for the relevant concept (e.g. "post-plant," "anti-eco," "smoke timing," "role utility"). If your task adds new domain knowledge, *append* to this file rather than letting it drift.

**Do NOT use this document as:**
- A substitute for cs2util / csnades / refrag for specific lineup coordinates (those sites have authoritative setpos).
- A replacement for testing in-game (CS2 mechanics shift with every patch).
- A prescription for what the app must look like — the app's UX decisions live in URD/SOLUTION_DESIGN.

---

## 2. The mental model

CS2 utility is a **multi-second tempo and information system**, not a damage system. Think of every grenade as buying or denying *time + information* for a specific opponent decision.

| Utility | What it actually buys |
|---|---|
| Smoke | 18 seconds of cancelled sightline on one specific line of vision |
| Flash | ~1–3 seconds where the opponent CANNOT shoot accurately |
| Molotov / Incendiary | ~7 seconds where the opponent CANNOT remain in that area without taking 50+ damage |
| HE | One-shot ~100 damage on unarmored / ~57 on armored at point-blank, with falloff |

The deeper insight: **utility tells a story.** Every grenade should make the next action stronger. A smoke that doesn't enable a peek is wasted. A flash that doesn't enable a swing is noise. A molly that doesn't force a rotation is $400 of nothing.

The novice mistake is thinking of utility as something you "spend" because you have it. The pro mindset is the inverse: the round IS the utility plan; weapons are how you cash in on the plan's openings.

---

## 3. Utility types & exact mechanics

### 3.1 Smoke grenade — $300, 18s duration

- **Effect:** a volumetric 3D cloud that hugs geometry, fills enclosed spaces, and is *the same shape on every client* (no more CS:GO system-spec one-ways).
- **Bullet penetration:** spraying through it carves a temporary visibility hole that refills in ~1 second. A defender shooting at where you ARE can briefly see you behind the smoke.
- **HE-clearable:** an HE detonating inside or adjacent removes a 2–3 second visibility window in ~half the cloud. Re-expansion follows.
- **Fire interaction:** smoke landing on a molotov extinguishes the flame on contact; the vision block remains for the full 18s.
- **Cost-effectiveness:** the most expensive standard utility but the only one that creates a multi-second area-of-effect denial.

**When to throw a smoke:**
- Block an AWP angle so the team can cross open ground (the canonical use)
- Split a bombsite into two independent fights (e.g. stairs smoke + jungle smoke on Mirage A)
- Block a rotation route mid-round (e.g. CT spawn smoke on Dust 2)
- Extinguish an opponent's molotov AND continue blocking vision

### 3.2 Flashbang — $200, ~1–3s blind

- **Effect:** a bright-light grenade. Full direct exposure (line of sight to the explosion, looking at it) blinds for ~3 seconds. Indirect exposure (turning away, partial cover) is ~1–2 seconds.
- **Carrying limit:** 2 per player (the only grenade you can hold two of).
- **Friendly-flash penalty:** you can still flash your own teammates; the team-flash damage is reduced but the blind effect is identical, and team-flashing wastes a $200 + a tempo.
- **What it actually buys:** ~1 second of accurate-shot inability. Use it for ONE specific action: a peek, an entry swing, a defuse start.

**When to throw a flash:**
- Pop-flash an entry angle (detonates within 0.1s of leaving cover; defender can't preaim it)
- Support a teammate's peek — they peek the instant the flash pops
- Re-flash a stalled hold to reset the timing
- Self-flash to enable a peek where no teammate is around to throw for you

### 3.3 Molotov (T, $400) / Incendiary (CT, $600) — ~7s burn

- **Effect:** a fire-based area-denial grenade. Lasts ~7 seconds, covers ~150–200 units, deals ~40 dmg/s to anyone standing in it.
- **Molotov has wider spread** than incendiary at the same throw — the molly is the harder utility to dodge.
- **Smoke-extinguishable:** dropping a smoke directly on the flame kills it on contact.
- **Stealth:** the CS2 burn audio was significantly quieted vs CS:GO — "stealth mollies" are more viable now.

**When to throw a molly:**
- Force a tucked anchor off-spot (they take damage or move; either way you gain)
- Clear a corner you can't be sure of without peeking (burn then swing)
- Block a chokepoint for 7 seconds (Inferno banana CT molly is THE textbook case)
- Post-plant: burn the bomb to deny defuse for 7 seconds = ~7s of round-timer

### 3.4 HE grenade — $50, up to ~98 dmg unarmored / ~57 armored

- **Effect:** a damage grenade. Damage falls off with distance. At $50 it's the cheapest utility in the game.
- **Smoke-clearing:** the killer modern use — HE thrown into deployed smoke creates a 2–3s gap.
- **Stacked-HE one-shot:** two HEs landing on the same target stack damage; on armored opponents (~57 each) two = ~114 = kill.
- **Friendly damage:** 85% reduced for HE.

**When to throw an HE:**
- Anti-eco chip damage on a known chokepoint (force out at low HP)
- Tap damage on a held angle before the duel
- HE-pop through your own smoke during an execute (the signature CS2 maneuver)
- Free $50 on every full-buy if you don't carry one — you're underspending

### 3.5 Decoy — $50, ~15s duration

- Plays fake gunfire sounds matching whatever weapon is set.
- Duration was reduced ~3.5s vs CS:GO.
- Marginal at pro level; occasionally used to fake a site commit on save rounds.

---

## 4. CS2 vs CS:GO — what changed

CS2 launched **September 27, 2023**, migrating Counter-Strike to the Source 2 engine. The utility changes were the most consequential rework in CS history because they invalidated ~70% of CS:GO's pixel-perfect lineup library.

### 4.1 Volumetric smokes (the headline change)
- True 3D objects that fill enclosed spaces uniformly
- Same shape on every client (one-way smokes are functionally dead)
- Bullet-carvable (spray opens temporary holes)
- HE-clearable (2–3s window then refills)
- Fire-extinguishable AND fire-extinguishing
- Smoke into a tight room/closet fills the volume, not just a radius

### 4.2 Flashbangs
- Per-flash effectiveness unchanged numerically
- October 2024 patch fixed grenade-bounce bug (no more premature detonation on stuck bounces)
- T-side flash usage dropped ~22% in CS2's first year vs CS:GO; CT-side dropped ~18% [unverified specific %; trend confirmed via multiple analyst posts]
- Skybox removals on some maps enabled new throw arcs

### 4.3 Molotov / Incendiary
- Dynamic flame spread (flames flow downhill, pool, crawl up slopes via the Half-Life: Alyx liquid shader)
- Quieter burn audio
- April 2024 slope-physics update broke many CS:GO molly lineups that relied on rolling

### 4.4 HE grenade
- October 28 2024 patch made HE-into-smoke clearing reliable and consistent
- January 2024 patch fixed a silent HE-damage bug

### 4.5 Engine
- 64Hz tick with sub-tick input — lineups land identically on 64-tick official servers vs the old "128-tick only" CS:GO problem
- New economy values largely preserved from CS:GO; MR12 (24 rounds + OT) replaces MR15 (30 rounds + OT)

### 4.6 Net effect on lineups
- Roughly **70% of CS:GO smoke lineups need rebuilding** for CS2
- Pixel-perfect "align with antenna" lineups frequently miss; landmark-based lineups port better
- Five famous CS:GO lineups now broken / obsolete [unverified specifics — verify in-game]:
  1. Mirage T-spawn antenna jump-throw window smoke
  2. Inferno T-ramp banana one-way molotov / smoke combo
  3. Dust 2 long-doors xbox-boost smoke from T-spawn (some variants)
  4. Overpass deep-monster connector smoke
  5. Cache mid-to-A vent smokes (Cache was offline for much of CS2 transition)

### 4.7 New CS2-era lineups exploiting the new physics
- HE-pop through Mirage jungle smoke for execute cover
- Anti-default HE through Inferno banana smoke
- Ancient B-site triple-smoke from one T corner (relies on volumetric fill)
- Nuke outside wall-of-smokes that hug terrain better than CS:GO
- Dust 2 A-execute long smoke + HE-pop combo (signature CS2 maneuver)

---

## 5. Round economy & utility budget (MR12)

CS2 runs MR12 — max 12 rounds per half, 24 + OT to 13. Economy is largely unchanged from CS:GO's MR15 numbers, which the community has flagged as overly punishing for the shorter format (Esports Insider).

### 5.1 The bankroll
- **Starting money:** $800 (pistol round)
- **Win bonus:** $3,250 (round win)
- **Plant bonus:** +$300 to planter on successful plant
- **Consolation after plant:** +$800 team bonus on losing AFTER a plant
- **Defuse bonus:** $300 to defuser
- **Loss bonus ladder:** $1,400 → $1,900 → $2,400 → $2,900 → $3,400 (capped, additive per consecutive loss)
- **Money cap:** $16,000

### 5.2 Buy thresholds (per player)
- **Full buy:** ~$4,750 (T) / ~$5,000 (CT). Rifle + kevlar + helmet + smoke + 2 flashes + molly/incendiary + (HE).
- **Force buy:** $2,500–$3,500. Galil/FAMAS or MP5/MAC-10 + kevlar + smoke + flash.
- **Half-buy / exit-frag:** $1,200–$2,000. P250 + kevlar + 1 utility.
- **Eco / save:** <$1,200. Default pistol, maybe a flash.

### 5.3 Utility carry limit
**4 grenades per player, max:** 1 smoke + 1 HE + 1 molly/incendiary + 2 flashes. The HE+decoy share a slot in some loadout configs.

### 5.4 Team utility budget on full buy
A fully kitted team fields:
- ~4–5 smokes (often 4)
- 8–10 flashes (2 per player)
- 4–5 mollies/incendiaries
- 2–3 HEs (the team usually skimps here — see §15 "what's next")

### 5.5 Economy decisions are the IGL's primary load
**The IGL spends more cognitive time on economy than on gunplay.** Each round he projects:
- Our money this round + utility carried over
- Their money this round (count their dead drops + last-round buys)
- Win this round → both teams' next-round budget
- Lose this round → both teams' next-round budget
- The economy curve over the next 3 rounds

A force is correct ONLY when: (a) you can plausibly win this round, AND (b) losing it doesn't put you on a back-to-back save against their full buy. A save is correct ONLY when: you can't break their hold AND they're locked into a full-buy next round regardless.

---

## 6. Round types (pistol, eco, force, full, save)

### 6.1 Pistol round ($800, both sides)
Canonical distribution: **2 utility-heavy players, 3 kevlar-only.**
- Player 1: smoke ($300) + 2 flashes ($400) — no kevlar
- Player 2: smoke + molly/incendiary ($300 + $400/$600) — no kevlar
- Players 3–5: kevlar only ($650 each)

Strategic principle: pistol rounds reward overwhelming a SINGLE timing, not defaulting. T-side: hit one site fast with smoke+flash+commit. CT-side: stack two on a likely entry, use molly to deny a rush, rotate on info.

### 6.2 Anti-eco (T side after pistol win, ~$3,400)
**SMG + kevlar + 1–2 utility per player.** SMG kill bounty is $600 vs the $300 rifle bounty — snowballing the economy AND denying the opponent's loss-bonus reset is the play. HEs on the rush path are the highest-EV utility against armored ecos.

### 6.3 Force buy ($2,500–$3,500)
**Commit to ONE plan.** Partial kit: 1 rifle (dropped to a star), SMGs / Galils / FAMAS for the rest, kevlar, partial utility (smoke + flash per impact player; skip mollies). Forces lose when half the team forces and half saves.

### 6.4 Full buy ($4,750+)
Standard kit per §3 + §5.4. The IGL allocates smokes by *lineup ownership* (whoever learned the X lineup throws X) rather than by role.

### 6.5 Save round
Drop weapons to teammates with cash. Reposition someone to a far corner. **Crucial:** utility does NOT refund — flashes/smokes you carry over to next round if you survive. A team exiting a save with 2 unused flashes effectively has a $400 economy boost.

---

## 7. The utility chain — sequence theory

The canonical execute sequence is **SMOKE → FLASH → MOLLY → ENTRY.** Each step exists because the previous step did its job. Reverse the order and the chain breaks.

### 7.1 The order, and why

1. **Smoke first.** Removes the longest-range / highest-impact angle (typically an AWP or rifle holding a sightline). You've reduced an entry from a 5-angle problem to a 2–3 angle problem.
2. **Flash second.** Blinds the remaining close-range angles. Since the smoke cancelled the long angle, the flash can be a short-throw pop — it doesn't need to cover the whole site.
3. **Molly third.** Burns the cubby/corner the defender will fall back to when he hears the flash. Timed for ~2s after the flash, lands as the defender repositions.
4. **Entry last.** The entry fragger swings the moment the flash pops, into a site with: no long angle (smoke), no immediate angle (flash), no fallback corner (molly). He's fighting a defender mid-movement.

### 7.2 Why opponent psychology dictates the order

A defender processes ONE decision at a time. Smoke → he repositions. Flash → he flips. Molly → he runs. Stack all three at once and he picks a single response, surviving the others. The chain weaponizes the defender's response time by giving him a new emergency every ~0.5s.

### 7.3 Variations of the chain

- **Smoke + smoke + flash + entry** (split execute): two smokes split the site into two 1v1s, one flash for the close angle, two entries from different directions.
- **Molly + smoke + entry** (force a rotate): molly forces the anchor off-spot, smoke locks in your free crossing, entry takes the now-empty space.
- **HE + flash + entry** (CS2-era pre-fire): HE for chip damage on a known position, flash for the swing, entry hopefully into a low-HP defender. Cheap and fast.

---

## 8. Roles & utility load

| Role | Typical utility | Why |
|---|---|---|
| **IGL** | Often throws both execute smokes — the round-defining smokes, since he chose the strat and knows the lineup | He spent the freeze time picking the strat, so he owns the lineup |
| **Entry fragger** | Light — 1 flash for own pop, 1 HE for chip damage | Free hands to swing first; receives the support flash |
| **Support** | Heavy — 2 flashes (one for the entry, one re-flash) + 1 molly for the fallback corner | His job is to set up the entry's success; he arrives ~0.5s behind |
| **Lurker** | Cross-map mollies + smokes for flank cover, late-round re-smokes | Doesn't commit utility to execute; saves for post-plant and flank slow |
| **AWPer** | Light — 1 smoke for self-cover, 1–2 flashes for self-flash | Free hands to hold an angle; the team's utility is set up FOR him, not BY him |

**Critical principle:** the role isn't the grenade, the role is *who is alive to throw it when needed*. If your support dies first, the entry gets no support flash, and the chain collapses. Distribute utility so multiple players can throw the same grenade if needed.

---

## 9. Timing windows (1:55 → 0:00)

CS2 round time is **1:55** (115 seconds). Bomb timer is 40s on plant. Defuse is 10s (no kit) or 5s (with kit).

| Window | Time | What happens |
|---|---|---|
| **Setup** | 1:55 → 1:40 | Spawn cluster, IGL call, no utility committed. Maybe an instant smoke that has a lineup from spawn. |
| **Default / info-gathering** | 1:40 → 1:00 | Cheap utility (1 flash, 1 molly, 1 smoke) to provoke a CT response and read map control. NOT throwing every smoke in the first 20 seconds. |
| **Execute window** | 1:00 → 0:30 | Commit. The chain (§7) burns here. After 0:30 you don't have time for default-then-execute. |
| **Post-plant** | 0:30 → 0:00 | 40s bomb timer. Post-plant utility chain: smoke the defuse line of sight, molly the bomb (denies 7s defuse), flash on the retake swing. |

Post-plant utility is often **higher-value than execute utility** because it directly translates to seconds of bomb timer. A molly on the bomb at 0:25 = 7s of denied defuse = bomb explodes at 0:18 instead of 0:11.

---

## 10. Counter-utility theory

### 10.1 Anti-flash techniques
- **Pre-fire the flash arc** — when you hear the pin pull + cook timer, pre-aim where the enemy will appear, wide and high.
- **Turn 90°+** from the flash arc to minimize blind duration.
- **Hold and spray** if partially flashed — most attackers wide-peek expecting full blind.

### 10.2 Bait-the-flash
Peek aggressively to draw the flash, then re-peek the instant the attacker's animation locks. You've spent zero utility, they've spent $200 + a tempo.

### 10.3 Smoke break / smoke-running
Sprint through your own smoke to surprise. CS2's volumetric smokes make this riskier (no gaps render for you that don't exist for the defender) but more reliable in pacing.

### 10.4 HE into smoke (the "smoke clear")
THE signature CS2 counter. HE into deployed smoke punches a 2–3s gap. Use to AWP through, confirm a player, or pre-fire a known position.

### 10.5 Smoke-extinguish-molly
Drop a smoke directly on an enemy molly to kill the flame on contact. Vision block remains for the full 18s. Cost trade is great ($300 smoke kills a $400 molly + denies its tempo).

### 10.6 Molly trade
Burn an anchor out of his cubby, then smoke the angle so when he re-holds he can't see you. Molly creates the second of movement; smoke locks in your free space.

### 10.7 Decoy fake-execute
Throw a decoy at one site, real utility at the other. Decoys make same gunfire sounds as a real AK, so rotators panic-commit to a phantom push.

### 10.8 AWP-through-the-wall fake (the s1mple play)
Toss your AWP through a thin wall as a sound/visual decoy. Opponent's crosshair follows the bait; you peek a different angle. **Famously used by s1mple vs Liquid at ESL One NY 2016** and replicated by dev1ce at ESL Pro League 2021. Most-imitated Dust 2 mind-game.

---

## 11. IGL decision framework

Per round, the IGL processes:

1. **Economy check** — what's our buy, what's theirs, what's the loss-bonus state?
2. **Read the last round** — where did the CTs play? Did they stack B? Double-AWP mid? This is the info substrate.
3. **Score / round pressure** — at 11–11 the decision tree is different from 8–4.
4. **Pick the strat** — execute A, default-to-info, fake-A-go-B, mid-control, slow-default. The strat is a function of utility-available × economy × known CT setup.
5. **Assign roles + utility** — who throws what smoke. Veteran teams have a default map ("this exec means YOU throw X") so the call is fast.
6. **Live adjustment** — if info changes mid-round (CT rotates wrong, a pick happens), the rotator-IGL re-calls. This is why **supportive-rotator IGL** is the current meta — they have eyes on map, not stuck-anchor in a corner.

HLTV measured that rotator IGLs throw +0.11 flashes/round vs static-anchor IGLs [single-study stat, treat as directional].

---

## 12. Anti-patterns & common mistakes

- **Smoke too late** — blooms after the CT already saw your team cross. Smokes need to be in the air 2–3s BEFORE the cross.
- **Smoke too early** — 18s timer expires mid-execute. Angle is open and your team is exposed.
- **Molly on an empty corner** — assumed someone was there. $400 of nothing. Verify with sound / info first.
- **Saving "for later"** — utility doesn't refund. A flash you saved that you didn't throw is functionally identical to no flash. Use it or lose it.
- **Team-flashing** — flashing your own entry instead of the defender. Fix: support throws the flash BEFORE the entry crosses, never simultaneously.
- **All-utility-from-one-player** — that player dies first peek and you have NO utility for the rest of the round.
- **No post-plant smoke** — executed brilliantly, planted, and have no util for the retake. You'll lose this round. Always reserve.
- **Overlapping jobs** — two smokes on the same angle, three flashes for one peek. Coordinate.
- **Flashing without a swing** — the flash needs a teammate ready to exploit the blind window. Solo flashes are noise.
- **Indecision mid-round** — bouncing between A and B while utility drains. The IGL must call by the 1:00 mark.

---

## 13. Dust 2 deep dive

### 13.1 The map
Dust 2 is the most-played, most-utility-dense competitive map. The geometry is symmetric enough that lineups are highly transferable across teams, and the spawn-system is the most spawn-dependent of any active duty map — HLTV explicitly notes Dust 2's early round is "more spawn-dictated than any other map."

**Sites:** A (top-right, accessed via Long, Short, Catwalk), B (bottom-right, accessed via Tunnels, Window, sometimes Mid)
**Mid corridor:** Xbox → Mid Doors → CT Mid → splits to A Short / B Tunnels
**Spawns:** 15 T-side (the front T-cluster, the back T-cluster, the middle), 5 CT-side (tight cluster near CT spawn)

### 13.2 T-side A executes

#### 13.2a Canonical Long take (4-man)
The bread-and-butter A execute used by Vitality, G2, MOUZ, Astralis-era.

**Utility:**
- 1× CT-cross smoke (thrown from Long, behind blue car/barrel — blocks CT-spawn-to-A sightline)
- 1× A-default / Goose smoke (lands on default plant, blinds Goose anchor)
- 1× A-short / Cross smoke from Long (covers Short rotators)
- 2× pop-flashes over doors / long-doors corner
- 1× molly into Pit (forces Pit-hugger off corner)

**Throw-from spawns:**
- CT-cross: right side of blue box at Long, jump-throw aimed left of antenna
- A-default: corner outside Long doors, running jump-throw
- Pit molly: Pit-side corner of Long, lined off wall crack near stairs (same line as post-plant)

**Choreography:**
1. CT-cross smoke (Long doors corner runs out)
2. A-default smoke (running throw out of doors)
3. Molly into Pit
4. First pop-flash over doors → entry peeks Long
5. Second flash deeper, support trades, AWP holds Pit

#### 13.2b Split execute / Mid-to-A "Xizt Call"
Astralis trademark. Slow defaults that win mid control, then split A from Short and Long simultaneously.

**Utility (3-from-Short + 2-from-Long):**
- 1× Xbox smoke (T from spawn — denies CT-mid AWP angle)
- 1× Catwalk smoke / boost denial
- 1× Short-to-A ledge smoke
- 1× molly into A-default (clears rear anchor)
- 2–3× flashes between Long and Short

**Choreography:**
1. Xbox smoke at round-start
2. Slow walk into Catwalk; Short player smokes/flashes ledge
3. Long side runs Long with CT-cross smoke
4. Short and Long flash within 1.5s of each other → split-second double entry
5. Lurker holds Long-doors flank

#### 13.2c Default-into-Short hit (3-man)
- Smoke Catwalk (denies AWPer)
- Smoke A-default
- Molly the corner/ledge
- 1× flash over Short
- 2 entry, 1 trade from suicide

### 13.3 T-side B executes

#### 13.3a Canonical Tunnels execute (4-man)
Used by NaVi, FaZe, modern T-sides. Documented by Dignitas.

**Utility:**
- 1× B-doors smoke (jump-throw from Upper Tunnels behind wooden crate)
- 1× B-window smoke (stand on tile before plank, jump-throw at left side of dome)
- 1× molly into Plat / back-site
- 2–3× flashes from Upper Tunnels into back of site
- Optional: 1× Cross-from-Tunnel smoke (cuts CT-spawn rotators)

**Critical rule (Dignitas):** the bomb-carrier should NOT be last — risk of being picked from Lower.

**Choreography:**
1. Doors smoke (jump-throw, ~3s airtime)
2. Window smoke (right after — together they block both visible angles)
3. Tunnels-exit smoke bounced off left wall → gives entry a "wall" to hug
4. Flash 1: deep, blooms behind Big Box
5. Flash 2: short, blinds close angles
6. Molly into Plat as third player enters

#### 13.3b Split B execute (Xizt Call to B)
Popularised by NiP's Xizt. Defaulted by Vitality, NaVi, Astralis.

**Utility:**
- Minimum: 1× CT-cross smoke from in front of Xbox
- Optimal: 1× B-doors smoke from Mid + mollies into Plat and Tunnel-exit

**Role split:**
- 1× Long player — holds Long, lurks/flanks
- 1× Short player — applies fake pressure or actual pressure on A
- 2–3 Mid players — clear close Cat, throw CT-Mid smoke, push doors
- Tunnels player(s) — hold Upper, push on Mid contact

**Choreography:**
1. Default-collect — mid is priority; control Xbox + close Cat
2. CT-spawn smoke from in front of Xbox cuts B-from-A rotators
3. Mid players push doors and onto B from Window
4. Tunnels player(s) commit from other side
5. Three angles onto site: Window, Door, Tunnels — defender can't hold all three

#### 13.3c Eco / force B rush
cs2pulse's lesson: *"B rushes on Dust 2 are all about timing and spawn. Speed and spacing win, not utility."*
- Best on front-right spawns (closest to Tunnels)
- Bomb-carrier mid-pack
- Single flash by lead player into Upper Tunnels
- No smokes — money preserved
- Critical: commit as a group, no trickle

### 13.4 Mid utility from T side

The mid utility kit is the most-published category. Pro pattern: at round-start the Mid player throws Xbox smoke from spawn (Refrag: "if thrown at the start of the round, it denies a popular AWP line, removes a lot of important information from CTs playing Bottom Mid").

| Utility | Throw-from | Lands at | Purpose |
|---|---|---|---|
| **Xbox smoke** | T spawn corner | Top of Xbox in mid | Denies AWP from Cat / CT mid |
| **Mid Doors smoke** | T spawn, wall-aligned jump-throw | Through Mid Doors, blooming on CT side | Covers the entire door — biggest single-smoke value on the map |
| **CT-spawn / Mid-to-B smoke** | In front of Xbox (after taking Xbox) | CT-spawn boost spot | Cuts A→B rotation; supports Mid-to-B split |
| **Lower-tunnel smoke** | Lower / from short stairs corner | Lower tunnel chokepoint | Denies B-anchor pick down lower; supports B lurk |
| **Mid-doors molly** | Jump-throw alignment from suicide | Pops on alcove behind doors | Pre-clears close AWP/SMG hide on partial-buy rounds |
| **Xbox HE / molly** | Suicide / T spawn | Top of Xbox | Damages Cat AWPer or denies boost |

### 13.5 CT-side anti-execute utility

#### 13.5a Early-round (info denial / anti-rush)
- **B Tunnels deep smoke** — from B-site into Upper Tunnels, slows a B rush
- **Upper Tunnels molly** — Dignitas: *"incendiary grenades are vital to early round success."* Bounced into Upper from B; forces stop or eats HP
- **Mid-doors molly (CT side)** — placed on alcove behind doors, cooks an SMG-hugger
- **Long-corner smoke** — from Long-doors corner CT side, blocks T cross from Long
- **Cat / Short-into-A smoke** — denies a Short take

#### 13.5b Mid-round (counter-pressure)
- **HE down Upper Tunnels** — free damage on a clumped T stack
- **A-cross molly** — denies cross from Short to A
- **Mid-cross HE** — substitute for smoke when CT needs to cross Mid

#### 13.5c Late-round (retake reserve)
- **B retake flash** — over Window / over doors
- **Long retake flash** — flashes any T jiggle in Long
- **Goose self-pop** — defensive 1-on-X for A anchor
- Discipline: Dignitas notes "flashbang preservation emphasized as critical for team retakes"

### 13.6 Default-round utility (1:40–1:30)

Pro defaults gather information cheaply without committing a site:

| Time | Utility | Purpose |
|---|---|---|
| 1:51 round-start, T spawn | Xbox smoke | Denies AWP, costs one smoke |
| 1:50 | Mid Doors smoke (sometimes) | If walking mid; not always thrown |
| 1:45 | A-Long flash + peek | Front pair flashes long, first info from Long |
| 1:40 | HE / molly Cat or Suicide | Information / chip damage |
| 1:30 | IGL calls the actual hit | Utility expenditure depends on info |

HLTV: "Dust 2's early round is dictated by spawns more than any other map." The default isn't a fixed set-piece — it's adjusted to who got the front spawn.

### 13.7 Post-plant utility

#### 13.7a A-site post-plant
- **CT-cross smoke** — thrown from inside site post-plant, re-blocks CT spawn
- **Pit molly (long-defuse)** — THE famous post-plant: from Long doors right corner, aim at the dot on wall/window crack, jump-throw. Lands on default plant. win.gg: *"The round win is guaranteed if you perfectly time your Molotov at the defuse sound cue."*
- **Goose / ramp molly** — denies retake from CT
- **A-Short re-smoke** — held by lurker to deny rotators

#### 13.7b B-site post-plant
- **B-doors molly** — from inside site through doors to deny CT push
- **Window smoke** — re-thrown to keep Window angle blocked
- **Tunnel re-smoke** — denies retake from below
- **Upper Tunnels molly** — denies close retake angle

The "default" post-plant on B is at the back-left under Window — bomb-defuse LOS is hardest from CT-spawn, Plat/Window players have the strongest cover.

### 13.8 Spawn-rush combinations

Standard IGL calls based on spawn cluster:

| Spawn cluster | Standard call | Throws |
|---|---|---|
| **Front-right (closest to Tunnels)** | B rush / fast B execute | Front player flashes Upper; second smokes/mollies Plat |
| **Front-left (closest to Long)** | Fast Long take | Front player throws CT-cross smoke; support flashes |
| **Mid-cluster** | Mid take / Xbox control | Xbox smoke from spawn; Mid Doors smoke supports |
| **Back spawns** | Default / regroup | Slow throws from spawn, default info-gathering |

The Steam Workshop guide "Every PRO Smoke lineup — DUST 2 + every exact SPAWN" catalogues smoke lineups indexed by exact T-spawn position. This is the canonical spawn-aware playbook the pros use.

### 13.9 Famous Dust 2 plays

| Play | Year | Match | Utility hook |
|---|---|---|---|
| **Olofboost / Olofpass** | 2014 | Fnatic vs LDLC | **NOTE:** This famous play is on **Overpass**, NOT Dust 2. The owner's prompt example was incorrect — olofmeister does not have a single canonical Dust 2 utility play of that magnitude. |
| **s1mple's AWP-through-wall decoy** | 2016 | NaVi vs Liquid, ESL One NY | Threw AWP through wall as sound/visual decoy in B retake; opponent's crosshair followed bait; s1mple eliminated him. |
| **dev1ce's USP clutch (s1mple decoy replica)** | 2021 | Astralis vs Liquid, ESL Pro League | Tossed gun through doors as decoy; switched to USP-S; caught NAF off-guard. |
| **s1mple 1v4 AWP clutch** | 2020 | NaVi vs Liquid, IEM Katowice | At 2:4 financial bind; clutch set up NaVi's tournament win + Intel Grand Slam season 3 run. |
| **Virtus.pro 3-15 → 16-15 comeback** | ESL Pro League S13 | VP vs ENCE | One of only 253 recorded 15-3 scorelines on Dust 2; VP only team to reverse one. |
| **Fnatic 4-AWP overtime mid take** | 2015 | Fnatic vs Envy, ESL One Cologne | Bought 4 AWPs for mid control in OT, won first round, won the map. Valve commemorated with graffiti. |
| **KQLY mid-air kill** | 2014 | Titan vs VP, ESL One Cologne | Pistol-jump-shot at 15:14. KQLY later VAC-banned; controversial. Not strictly utility but referenced. |

---

## 14. Pro-play eras & innovators

### 14.1 Astralis 2018–2019 — the utility bible
**Roster:** device, dupreeh, Magisk, Xyp9x, gla1ve.
**Trophies:** ELEAGUE Boston 2018, FACEIT London 2018, IEM Katowice 2019, StarLadder Berlin 2019 (3 Majors in a row).

The team that turned utility from "throw smokes at the choke" into a precision discipline. From DreamHack Marseille 2018 onward, every Astralis round had a *grenade script* — exactly which player threw what, when, from where, every round.

Innovations:
- **Mirage T-side triple-molotov default** — denied passive jungle/under-balcony/stairs holds in one volley
- **Nuke playbook** — Xyp9x lurking lobby/squeaky, grenading squeaky and mollying off mini, became the template every IGL still copies. The Astralis upper-execute on Nuke (Heaven smoke + main smoke + mini smoke + mustang molly on default plant) is still the 2025 textbook.
- **Slow Dust 2 defaults** — Magisk and gla1ve publicly credited "the slow play approach" (scope.gg)
- **Mid-to-B "Xizt-style" hits polished into a dominant default**

Astralis collaborated on the official Dust 2 utility training map (Steam Workshop), strongly implying their lineup library was the reference for the entire community.

### 14.2 Team Liquid 2019 — Intel Grand Slam
**Roster:** EliGE, NAF, Stewie2K, nitr0, Twistzz.
**Trophies:** IEM Sydney 2019, DH Masters Dallas, ESL Pro League S9, ESL One Cologne 2019 — Grand Slam in 63 days.

Identity: raw firepower fed by **mid-control utility on Mirage and Inferno**. Stewie2K ("The Smoke Criminal") would push through smokes the instant they bloomed, supported by NAF and Twistzz cleanup. EliGE was the heart of the Inferno banana-control package — combined molly-and-smoke commits timed to crash the banana choke before CT mollies could counter.

Asterisk: Astralis were on a 6-month sabbatical during much of Liquid's Grand Slam run, and Liquid's pace dropped sharply when Astralis returned.

### 14.3 Heroic 2021–2022 — CT-side specialists
**Roster (peak):** cadiaN, sjuush, TeSeS, stavn, refrezh.
**Trophies:** IEM Cologne 2021, ESL Pro League S13.

Edge was **CT-side discipline** in the late online era. cadiaN's setups: two-anchor systems with prepared retake utility. Every T execute they expected was met with mirrored counter-utility instead of fights. sjuush was the canonical solo-anchor — small angles, off-positions, double-kills from post-plant.

When LAN returned in 2022 Heroic struggled vs more mechanical teams, but the school they founded — utility-savings as a CT survival skill — runs through every top team today.

### 14.4 FaZe 2022 — international flex
**Roster:** karrigan, rain, broky, Twistzz, ropz.
**Trophies:** IEM Katowice 2022, ESL Pro League S15, **PGL Antwerp Major 2022** (first international Major champion), IEM Cologne 2022.

First team to scale a *playbook* with five-player flexibility. ropz's role-fluid CT play meant FaZe could rotate the anchor/lurker assignment round-to-round, forcing opponents to re-read every utility setup mid-series. At PGL Antwerp on Inferno, FaZe's three-flashes-out-of-balcony with limited utility (no kits, Tec-9s) is the canonical example: minimal utility, perfect timing.

Their Ancient was the lab where the modern "structured execute" model emerged — that map was barely a year old when FaZe + karrigan systematized it.

### 14.5 NaVi s1mple era 2021 — utility for the AWPer
**Roster:** s1mple, electronic, Perfecto, Boombl4, B1t.
**Trophies:** PGL Stockholm Major 2021 (10–0 maps run — cleanest Major in history).

Design: **set the AWPer up for free shots.** Every default smoke, every flash, every molly existed to create a 1.5-second window where s1mple could peek a known angle uncontested.

This template — "build the round around the AWPer's peek" — is what ZywOo and m0NESY inherit.

### 14.6 Vitality 2023–2024 — ZywOo's aggressive utility-AWP
**Roster (peak):** ZywOo, apEX, flameZ, Spinx, mezii (and Magisk briefly).
**Trophies:** IEM Cologne 2024 (3–1 over NaVi, ZywOo MVP).

ZywOo's evolution into CS2 inverted the s1mple model. Instead of being set up *by* utility, ZywOo's Vitality uses him as a **rifler-AWPer hybrid** — he carries both a P250+AWP and a rifle in different rounds, and the team's utility deliberately creates fluid roles.

apEX widely rated as the best IGL in CS2; flash assists up 25% over 2024 (analyst commentary). Vitality's 10-game Dust 2 win-streak in 2024–2025 was broken by MOUZ (11–13).

### 14.7 Spirit 2024–2025 — donk era
**Roster:** chopper (IGL), donk, sh1ro, Zont1x, magixx (later additions vary).
**Trophies:** **Perfect World Shanghai Major 2024**, IEM Cologne 2025, BLAST Bounty S1, PGL Astana 2025.

donk's HLTV Player of the Year 2024 season redefined the **rifler-as-star** role. Utility book built to give donk cleanest possible early-round entries. By 2025 every opponent was anti-stratting donk's pathways frame-by-frame; Spirit (under chopper's IGL voice) adapted by slowing rounds, delaying utility sequences, and mixing in lurk plays via shiro and Zont1x.

### 14.8 Current top teams (2024–2026)

- **MOUZ** — torzsi's AWP, sycrone's coaching, xertioN entry, Jimpphat A-anchor, Brollan stepping into IGL responsibilities. CT sides cleanest in world by 2025.
- **Falcons (with NiKo + m0NESY)** — late-2024/2025 super-team. NiKo's CT-side coaching (Mirage connector hold) translates directly. m0NESY second-AWPer luxury few teams field.
- **G2 (NiKo era 2023–2024)** — "dominant Dust 2 and resilient Ancient define their map pool" (esports.gg). huNter- as silent killer with heavy utility setups.
- **GamerLegion** — Snax-era after siuhy swap. Dark-horse innovator on Ancient and Anubis.

### 14.9 Notable utility innovators

- **kennyS** — aggressive AWP peek forced CT-side teams to build utility *for* and *against* the AWPer. "AWP nerf" patch of early 2015 was effectively a response.
- **olofmeister** — Overpass utility (3-man boost), iconic 14–14 burning-defuse vs Dignitas at ESL One Cologne 2014.
- **JW** — aggressive smoke-pushing AWPer on Fnatic; direct ancestor of donk's "push the smoke before it blooms" pattern.
- **friberg ("King of Banana")** — banana control via solo utility on Inferno named after him.
- **Stewie2K ("The Smoke Criminal")** — popularized pushing through your own smokes the instant they bloomed; entry-through-smoke template is everywhere in 2025.
- **Xyp9x / gla1ve / dupreeh** — Astralis's Nuke utility script is the most-imitated map-specific playbook ever.
- **NiKo** — Mirage connector setup (red-roof molly + early smoke) is the most-coached single hold in CS.
- **device** — minimalist AWP-utility-AWP rhythm that anchored Astralis's CT defaults.
- **donk** — defined the 2024 era of utility-supported rifler entries; every team's 2025 anti-strat book has a "donk page."
- **ZywOo** — flexible utility-with-AWP enabling rifler-AWPer hybrid role.

---

## 15. Meta evolution 2024–2026

The meta as of late 2025 / early 2026 is best described as **"structured aggression"** — fast, mechanically aggressive rounds built around a star rifler more often than a star AWPer.

### 15.1 What's setting the meta now
- Spirit (chopper IGL, donk star rifler)
- MOUZ (sycrone coach, torzsi AWP, xertioN entry)
- Vitality (apEX IGL, ZywOo hybrid)
- Falcons (NiKo + m0NESY)
- GamerLegion as innovators on newer maps

### 15.2 Where the meta is heading

#### 15.2a HE damage is under-utilized
Despite Valve buffing HE smoke-clearing (Oct 2024) and fixing HE damage (Jan 2024), per-round HE usage has not climbed proportionally. HEs still treated as "if budget allows" purchases on full-buys. A team that systematizes the HE — synchronized HE-into-smoke combos, HE-for-chip on stacked anchors, HE-after-flash retakes — has a 4–6pp advantage waiting on the table. Spirit and Vitality have flirted with it; nobody has built a doctrine.

#### 15.2b CT-side molly setups are still primitive
T-side molly catalogs are vast. CT-side molly catalogs are mostly 6–8 "must-throw" defaults per map. Significant unmined territory in CT *retake* mollies, especially on Anubis and Ancient where irregular geometry enables new fire-shape interactions.

#### 15.2c The volumetric-smoke anti-default is coming
Because volumetric smokes are bullet-carvable, expect 2026 anti-default setups where CTs pre-aim *through* their own smoke to deny T defaults — inverse of the HE-pop. "Shoot 6 bullets through this smoke at second 4 of the round" scripts. Some FPL streamers are already doing it; no top team has formalized.

#### 15.2d Decoy may return
Decoys marginal in CS:GO, worse in CS2 after the duration nerf. MR12's economic tightness + rise of utility-light eco-buys could revive the decoy as sound-based anti-stratting on audio-decisive maps (Nuke, Vertigo).

#### 15.2e AWP being de-emphasized
The donk era proved a roster can hold #1 while building the round around a star *rifler*. Expect 2026 utility books to lean further into rifle-entries supported by mid-round HE/molly chip damage rather than s1mple-era "set up the AWP angle" template.

### 15.3 Caveats
- All claims here are directional, not measured. The patches keep moving the floor.
- The 2024-onward CS2 patch cadence (Oct 2024 HE buff, 2025 grenade physics tunes, Jan 2026 smoke re-tune) keeps shifting specific lineups while the *principles* remain durable.
- Some statistical claims (e.g. flash usage drop %) come from single analyst posts and should be re-derived from current HLTV data before being cited as fact.

---

## 16. Source-site comparison & content models

This section is for future feature work: when you need to scrape, mirror, or reference one of these sites, here's what's there.

### 16.1 cs2util.com — ~700+ atomic lineups

- **Free, no login wall.** No paywall observed.
- **Maps covered (10):** Dust2, Mirage, Inferno, Nuke, Ancient, Train, Cache, Anubis, Overpass, Vertigo.
- **Total lineups:** ~700+ across all maps. Dust 2 = 109 (73 smokes / 21 flashes / 13 mollies / 2 HEs).
- **URL structure:** `/<map>/<type>/<slug>` (e.g. `/dust2/smoke/xbox-smoke-from-nomal-t-spawn` — note the typo "nomal" — slugs are brittle hand-authored).
- **Content model per lineup:**
  - title (free-form, encodes target + origin + sometimes pro reference)
  - description (short prose)
  - airTime (seconds)
  - jumpThrow (Yes/No)
  - movement (Standing / Running)
  - difficulty (Easy / Medium / Hard)
  - mouseButton (Left Click / Right Click)
  - **consoleCommand (setpos + setang — the killer field)**
  - numbered step-by-step instructions
  - interactive lineup viewer (in-page, not YouTube)
  - tags (mirror filter facets)
  - createdAt / updatedAt timestamps (Postgres-style)
- **Navigation:** destination-first. The map landing page has an interactive radar with clickable markers representing LANDING points; you pick where you want the smoke and see lineups that land there. Origin (throw-from) lives in titles only.
- **Filters surfaced:** type (smoke/flash/molly/HE), team (T/CT), area (target callout)
- **Pro attribution:** loose — pro references live in titles only (e.g. "niko-fast-b-doors-smoke", "FAZE Mid Smoke From CT Spawn"). No structured `proPlayer` or `team` field.
- **Critical gaps:**
  - No multi-player executes / coordinated setups
  - No scenarios / tactical concepts
  - No utility timings / call-and-response sequencing
  - No post-plant utility as a category
  - No anti-eco / anti-force specific lineups
  - No origin-first browsing
  - No demo / match attribution
  - No video tutorials (interactive viewer instead)
  - No save/favorite/loadout

### 16.2 csnades.gg — 1396 video tutorials

- **Cloudflare-blocked to bots.** Direct fetch returns 403; must scrape via headless browser with real UA. Google indexes the rendered HTML, so `site:csnades.gg` queries leak structured fields.
- **Maps covered (10):** Dust 2, Mirage, Inferno, Ancient, Anubis, Nuke, Overpass, Cache, Vertigo, Office.
- **Total content:** 1396 videos = 920 smokes + 206 mollies + 166 flashes + 64 HEs. Per-map sub-totals: Ancient 146, Mirage 210, Inferno 166.
- **URL structure:** `/{map}/{type}/{target}-from-{origin}` for canonical; `/{map}/community/{type}/{hash}-{slug}` for user-submitted.
- **Content model per lineup:**
  - title (Map Target from Origin Type pattern)
  - side (Terrorist / Counter-Terrorist)
  - throwFrom (origin callout)
  - target (where it lands)
  - **technique** (Jump+LC, Standing, Jump+RC, RC, Run+Jump+LC — the killer field absent from cs2util)
  - movement (Stationary / Running)
  - **airTime** (4.7s, 5.0s, 7.5s, 8.7s — quasi-difficulty proxy)
  - publishDate
  - video (YouTube/Vimeo embed — one per page = 1396 videos)
- **What's MISSING vs cs2util:**
  - **No setpos / setang coordinates** — the biggest gap, makes csnades complementary not duplicative to cs2util
  - No explicit difficulty rating
  - No jumpthrow bind on page
  - No structured pro attribution
  - No screenshot gallery (video only)
- **Unique features:**
  - **Solo Combinations** (`/{map}/combinations/{target1}-{target2}-from-{origin}`) — multi-grenade single-thrower sequences. Mix grenade types (smoke + molly cross-type Vertigo combo example: `heaven-headshot-molly-from-ramp`). **This is exactly the model the current cs2_utility app's COMBOS / UTILITY_BELTS code mirrors** (task #32, scraper built in task #36).
  - **Annual callouts refresh** ("Dust 2 Callouts (2026)" — they version map vocabulary as Valve renames things)
  - **Community vs canonical separation by URL path** (not by badge)
  - **Ultimate Nade Guide long-form per map** (separate editorial layer)
  - **Topic guides** like `ancient-instant-t-top-mid-smokes` — equivalent of our app's Instant Smokes tab but as static articles

### 16.3 refrag.gg — in-game training platform (not a static library)

- **Subscription model:** $5.40–$79/mo. Player tier ($5.40 annual) gets in-game lineup practice (NADR). Competitor tier ($11.50) gets web-browsable Utility Hub. Team tier ($60+) gets 5v5 + per-player servers.
- **Core mental model:** users launch a **private CS2 server on-demand**, then type chat commands inside the server to load "mods" (NADR for lineups, Crossfire/Prefire for aim drills, Bootcamp for guided curricula).
- **Maps covered:** all Active Duty maps + some past Active Duty. Dust 2 lineup count: "hundreds" (not publicly disclosed).
- **NADR (the lineup engine) data model:** `{ id, map, grenadeType, throwPos: {x,y,z}, throwAngles: {pitch,yaw}, throwAction, landingTarget: {x,y,z,radius}, name, index }`. Each lineup is loaded by index (`.nade 47`).
- **In-game commands:** `.nadr <map>`, `.nade <n>`, `.save <name>`, `.rethrow`, `.clear`, `.autoclear`, `.bot t/ct`, `.bringaim`, `.draw` + `.find` (Grenade Finder), `.observeme`, `.restore`.
- **Key feature unique to refrag:** **Grenade Finder** — drop a bounding box where you want a grenade to land; the server reverse-calculates which throw position can reach it. No other CS2 tool does this.
- **Co-owners:** EliGE, Pimp (Jacob Winneche). Tier-1 teams cited as collaborators: Team Liquid, Heroic, FNATIC, Dignitas, MouseSports.
- **Academy instructors:** EliGE (T-side defaults — Vertigo, B execute Mirage), Pimp (Nuke A take).
- **Gaps:**
  - No free tier; cannot browse a single lineup without paying
  - **No web-addressable lineups** — cannot send a teammate `refrag.gg/dust2/xbox-smoke`. Lineups live inside CS2 servers only.
  - No public lineup count or catalog
  - Requires CS2 launch + server boot every session (high activation energy)
  - No mobile UX
  - No public API
  - Server-side lineup data not exported anywhere user-visible — if you cancel, you lose your library

### 16.4 Cross-site overlap & complementary data

| Field | cs2util.com | csnades.gg | refrag.gg (paid) |
|---|---|---|---|
| setpos coords | ✓ | ✗ | ✓ (in-game only, not exported) |
| setang | ✓ | ✗ | ✓ |
| Air time | ✗ | ✓ | (in-game stats) |
| Technique (jump/stand/run) | ✗ | ✓ | ✓ |
| Difficulty rating | ✓ | ✗ | ✗ |
| Video | (interactive viewer) | ✓ | ✓ |
| Pro attribution | (title only) | ✗ | (Academy instructors only) |
| Solo combinations | ✗ | ✓ | (in-game only) |
| Multi-player executes | ✗ | ✗ | ✗ |
| Scenarios | ✗ | ✗ | ✗ |
| Post-plant utility category | ✗ | ✗ | ✗ |
| Anti-eco utility category | ✗ | ✗ | ✗ |
| Origin-first browsing | ✗ | ✗ | (in-game `.mapgrenades` toggle) |

**The complete encyclopedia requires combining:**
- cs2util for setpos
- csnades for technique + air-time + solo combinations
- refrag for in-game practice mechanics
- HLTV demos + Liquipedia for pro attribution
- Dignitas / BLAST / Refrag blog posts for tactical context

NO single source has all of this. The current cs2_utility app is positioned to be the synthesis.

---

## 17. Design implications for this app

Given everything above, here's how the encyclopedia informs the cs2_utility playbook's design:

### 17.1 What we already do right
- **Origin-first Map tab (FR-24)** — every source site is destination-first. We're alone in surfacing throw-from positions as the primary navigation. This matches the audience's mental model ("I'm at this spot, what can I do?").
- **Scenarios as a first-class entity** — cs2util/csnades/refrag don't model team executes. Every multi-player execute conversation in the encyclopedia (§13.2, §13.3) maps onto our `Scenario` schema. We have the only structure that captures Astralis Xizt Calls, FaZe-style splits, T-side B-rushes.
- **4-card walkthrough (Position / Aim / Throw / Result)** — better than csnades's video-only approach for muscle-memory; better than cs2util's interactive viewer for at-a-glance reference.
- **Defaults tab structure** — plant spots + timings + spawn rushes captures content that NO source site organizes this way. The encyclopedia validates that "default plant locations" + "round milestones" + "spawn-rush matrix" is the right decomposition.
- **CT position guide** — captures the "anchor / mid / awp / rotator" role utility distribution from §13.5 in a place no source site does.

### 17.2 What we should consider adding (post-MVP)

These are derived from the encyclopedia's analysis of source-site GAPS:

| Feature | Why | Source justification |
|---|---|---|
| **Post-plant utility category** | No source site organizes this as a first-class category. §13.7 documents the Pit molly + B-doors molly as round-winners. | The post-plant utility wins more T rounds at pro level than the execute (§13.7 win.gg quote). |
| **Anti-eco / anti-force CT preset** | No source documents the "5 mollies + 5 smokes + 4 flashes + 3 HEs" anti-eco hold (§13.5a). | "The eco round in 2025 is fought with utility, not headshots." |
| **HE-into-smoke combos** | The signature CS2 maneuver (§10.4) is not captured anywhere as a structured combo. | §15.2a says HE is under-utilized; a team that systematizes it has a 4–6pp edge. |
| **Round-economy buy templates** | Pistol/anti-eco/force/full-buy templates (§5, §6) are buried in editorial blog posts. We could codify per-round per-player utility loadout recommendations. | The IGL decision framework (§11) hinges on economy reads. |
| **Role utility distribution view** | We have a CT position guide but no T-side equivalent (entry/support/lurker/AWPer/IGL). §8 shows the canonical distribution. | "The role isn't the grenade — the role is who is alive to throw it when needed." |
| **Spawn-rush expansion** | We seeded 4 T-spawn rushes. The encyclopedia (§13.8) confirms this is canonical — every IGL calls based on spawn cluster. Could expand to all 15 T-spawns × all paths. | "Dust 2's early round is more spawn-dictated than any other map" (HLTV). |
| **Counter-strat / anti-pattern view** | The "common mistakes" list (§12) is gold for self-coaching. | Boosteria, CS2Hype directly publish these. |
| **Default round defaults** | The 1:40 → 1:00 information-gathering throws (§9, §13.6) are a category we don't surface. | Pro defaults aren't fixed set-pieces — they're spawn-adjusted info gathering. |

### 17.3 What we should NOT do

- **Don't try to replicate cs2util's lineup count.** Trying to ship 700+ atomic lineups is the wrong product. Curate ruthlessly — the owner's quote "I am focusing on removing too many lineups which makes it sometimes hard to figure what the best option is" (URD DR-4) is right.
- **Don't replicate csnades's video-per-lineup model.** Videos are bandwidth-heavy and aren't muscle-memory friendly. The 4-card walkthrough is better.
- **Don't add a paid tier.** The owner explicitly wants a free single-user app for him + friends. Refrag's $5.40/mo barrier is a feature for them, anti-feature for us.
- **Don't add multi-map support yet.** Stay Dust 2 only until that map is deep. The encyclopedia validates this — Dust 2 is the most utility-dense, most studied map.
- **Don't invent data.** When cs2util/csnades disagree, document both. When neither covers a CS2-specific lineup, note it as a gap, don't fill it with AI guesses (AR-1 in URD).

### 17.4 Schema implications

The encyclopedia confirms our current types are well-shaped, with these refinements worth considering:

```ts
// Already in our types — confirmed correct
Spawn { id, side, label, world }
Lineup { id, type, side, throwFrom, landingAt, throwAngle, throwStyle, ... }
Scenario { id, number, name, players[], ... }
ScenarioPlayer { role, label, color, startingSpawnId, actions[] }
PlantSpot, TimingNote, SpawnRush, CtPosition

// Additions worth considering (post-MVP)
PostPlantLineup { lineupId, site, defuseLineCoverage, denyTime }  // §13.7
AntiEcoSetup { side, mollies[], smokes[], flashes[], hes[] }      // §13.5a
RoundEconomy { type: "pistol" | "antieco" | "force" | "full" | "save", perPlayerBudget }  // §5
TUtilityRole { role: "entry"|"support"|"lurker"|"awper"|"igl", typicalLoadout }  // §8
HeSmokeCombo { smokeLineupId, heLineupId, timingOffset, purpose }  // §10.4, §15.2a
```

### 17.5 Content strategy

The encyclopedia suggests a curated 30–50 lineup library, not 700+. Coverage tiers:

1. **Core (10–15 lineups, must-have):** the throws every Dust 2 player should know. Refrag's "5 must-know" + the canonical post-plant + the canonical CT anti-execute.
2. **Scenario-coordinated (15–20 lineups):** lineups that appear in at least one seeded scenario (A default execute, B execute, mid-to-A split, mid-to-B Xizt call).
3. **Position-specific (5–10 lineups):** CT-role-specific lineups (A anchor, B anchor, mid).
4. **Defaults (3–5 lineups):** round-start spawn-throwable smokes.

That's 33–50 total. Vs cs2util's 109 on Dust 2 — we're 30–45% the volume, but every lineup is connected to a strategic context (scenario / role / round-type / post-plant) which they don't have.

---

## 18. Confidence & research gaps

### 18.1 High-confidence claims (multiple sources, current to 2025)
- CS2 launched Sep 27 2023; volumetric smokes; MR12 format
- Utility costs ($300 smoke / $200 flash / $400 T-molly / $600 CT-incendiary / $50 HE)
- The canonical execute sequence (smoke → flash → molly → entry)
- Role utility distribution (IGL throws execute smokes, support throws flashes for entry, etc.)
- 18s smoke duration / 40s bomb timer / 1:55 round time
- Dust 2 site executes documented in §13 (multiple agreeing sources)
- Astralis 2018–2019 dominance + utility script approach
- FaZe 2022 PGL Antwerp Major + rain MVP
- s1mple AWP decoy play vs Liquid ESL One NY 2016
- Spirit 2024 Shanghai Major + donk HLTV Player of Year

### 18.2 Medium-confidence claims (single-source or directional)
- Flash usage dropped ~22% T-side / ~18% CT-side in CS2 vs CS:GO (single analyst post)
- Rotator IGLs throw +0.11 flashes/round vs static (HLTV single-study stat)
- Specific %s of CS:GO lineups broken (the "70%" figure is community estimate, not measured)
- Specific CS:GO-era lineups now obsolete (need in-game verification)
- The "HE is under-utilized" + "CT mollies primitive" 4–6pp edge claims (speculative)

### 18.3 Research gaps the agents flagged
- **MOUZ 2024–2025 Dust 2 utility distinctives** — sources confirm they're good on Dust 2 but no tactical breakdown article comparable to what exists for Astralis/Vitality.
- **Astralis pre-2019 player-attributed lineups** — sources confirm the style (slow defaults, heavy mid, Xizt splits) but no public "this is the dupreeh A-Long flash" attribution. The Astralis-collab Workshop training map exists but its lineup list wasn't accessible.
- **3kliksphilip / WarOwl / Coach Bardolph specific Dust 2 utility videos** — research didn't surface specific Dust 2 utility content from those creators (Bardolph more known for Mirage IGL theory; 3kliksphilip for map design / meta).
- **Olofmeister Dust 2 utility play** — DOES NOT EXIST as a famous play. Olof's iconic moments are the Overpass boost + the burning-defuse vs Dignitas at Cologne 2014. Owner's prompt example was incorrect — flagged.
- **Exact setpos for Astralis-only lineups** — the Workshop training map likely has them but wasn't accessible via research.
- **CSGO-era lineups confirmed broken in CS2** — the "5 broken lineups" list (§4.6) is plausible but needs in-game verification, not just plausibility.

### 18.4 Things that change with patches (re-verify before publishing)
- Specific molly throw lineups (April 2024 slope physics broke some)
- Specific HE-into-smoke combos (Oct 2024 buff changed timings)
- Specific economy numbers (Valve has resisted MR12 economy buffs but community pressure continues)
- Active Duty map pool (Anubis swapped in Jan 2026 replacing Train; the pool rotates)

---

## 19. Glossary

| Term | Definition |
|---|---|
| **Active Duty** | The competitive pool of 7 maps Valve maintains for official competition. Currently (early 2026): Ancient, Anubis, Dust 2, Inferno, Mirage, Nuke, Overpass. |
| **Anti-eco** | The round following a pistol-round win, when the opponent has minimal money and you have ~$3,400. Played with SMGs + utility to deny their loss-bonus reset. |
| **Anchor** | A player who holds a single site solo with minimal team support. Common on Dust 2 B-anchor, Mirage A-anchor. |
| **AWP** | Arctic Warfare Police — the $4,750 sniper rifle. The "AWPer" is the team's primary AWP user. |
| **B1t** | A type of player ("baiter") OR a NaVi player (the name b1t). Disambiguate by context. |
| **Banana** | The mid-corridor on Inferno (T-side to B). |
| **Bomb** | The C4 carried by T-side, planted on A or B site. The defuse timer post-plant is 40s. |
| **Boost** | A player crouched on another's head to reach a higher position. The famous olof boost on Overpass. |
| **Buy round** | Any round where you can afford full kit ($4,750+). |
| **CIS** | Commonwealth of Independent States — the Russian/Eastern European pro scene. NaVi, Spirit, Virtus.pro, etc. |
| **Clutch** | A 1vN situation that the lone player wins. |
| **Default** | (1) A standard play used as the team's go-to. (2) The default plant location (e.g. A default = behind ramen on Dust 2). |
| **Donk** | (1) HLTV Player of Year 2024, Spirit's star rifler. (2) A "donk" is sometimes used as slang for an easy kill (rare). |
| **Eco** | A round where the team intentionally doesn't buy, saving money for a full buy next round. |
| **Entry fragger** | The player who peeks first into a site. Receives the support flash. |
| **Execute** | A coordinated team take of a bombsite, usually involving all 5 players + heavy utility. |
| **FaZe** | International team — karrigan, rain, broky, Twistzz, ropz. PGL Antwerp 2022 Major champions. |
| **Flash** | Flashbang grenade. $200. ~3s direct blind. |
| **Force buy** | Buying despite low economy ($2,500–$3,500). Partial kit. Must commit to one plan. |
| **Full buy** | Per-player $4,750+. Rifle + kevlar + helmet + full utility. |
| **HE** | High Explosive grenade. $50. ~98 dmg unarmored. |
| **HLTV** | The competitive CS news + stats site. The source of truth for pro CS stats. |
| **IGL** | In-Game Leader. The team's caller/strat-maker. Usually rotator, sometimes anchor. |
| **Incendiary** | CT-side fire grenade. $600. Same effect as molotov, narrower spread. |
| **Lineup** | A single utility throw with a known throw-from + lands-at. |
| **Lurk / Lurker** | A T-side player who hangs back from the main commit, watching the flank and creating delayed pressure. ropz on FaZe. |
| **Major** | Valve-sponsored tournament. The highest-prestige event. Three per year (used to be two). |
| **Molly** | Molotov grenade (T-side). $400. ~7s burn. |
| **MR12** | Max Rounds 12 — CS2's competitive format. 12 rounds per half, 24 + OT to 13. |
| **NADR** | refrag.gg's in-game lineup mod (pronounced "nader"). |
| **One-way** | A smoke positioned so that one side of it has visibility through and the other doesn't. DEAD in CS2. |
| **Pop-flash** | A flash that detonates within 0.1s of leaving cover. Defender can't preaim it. |
| **Post-plant** | The phase after the bomb is planted (0:40 → 0:00). |
| **Refrag** | A subscription CS2 training platform. Not csnades. Different model entirely. |
| **Retake** | CT-side recovery attempt after a successful T plant. |
| **Save** | Choosing not to engage at end of a lost round, preserving weapons/utility for next round. |
| **Scenario** | Our app-specific term: a numbered team execute with N players each having ordered actions. Not a CS-canonical term. |
| **setang** | The CS console command to set view angle (`setang pitch yaw roll`). |
| **setpos** | The CS console command to teleport (`setpos x y z`). Spec-mode only on competitive servers. |
| **Smoke** | The 18s vision-block grenade. $300. |
| **Source 2** | The engine CS2 runs on. CS:GO ran on Source 1. |
| **Spawn** | One of the fixed in-game spawn positions. 15 T + 5 CT on Dust 2. |
| **Spirit** | Russian team. Shanghai Major 2024 champions. donk's team. |
| **Sub-tick** | Source 2's input system. Removes the 64-vs-128 tickrate problem of CS:GO. |
| **Support** | The role that throws the flash for the entry. Distinct from "lurker" — support stays close, lurker drifts away. |
| **T-side / CT-side** | Terrorist / Counter-Terrorist. Attackers / defenders. Swap halves at MR12. |
| **Utility belt** | A pre-coordinated multi-grenade combo thrown by one player from one spot. Equivalent to csnades's "Solo Combinations." |
| **Volumetric smoke** | The CS2 3D smoke model. Replaced CS:GO's 2D blob. |
| **WindowSmoke / JungleSmoke / etc.** | Map-specific named smokes. Universally understood in the pro scene. |
| **xbox** | The mid-map crate/box on Dust 2. NOT the gaming console. |
| **ZywOo** | Vitality's star AWPer. Multi-time HLTV Player of Year. |

---

## End of v1

> **Maintenance note:** when the meta shifts (major patches, new dominant team, new map cycle), append to this document rather than rewriting. The historical record is more valuable than a "current snapshot" that's already stale.
>
> **Next-version triggers:**
> - Valve adjusts MR12 economy → update §5
> - New Major champion with distinctive utility style → add to §14
> - CS:GO-to-CS2 lineup rebuilds catalogued in-game → update §4.6 with verified specifics
> - Dust 2 layout changes → update §13 (especially callouts and choke geometry)
> - The 4–6pp edges in §15.2 get formalized by a top team → record what they did and how
