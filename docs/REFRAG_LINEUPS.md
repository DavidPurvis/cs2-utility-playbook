# Refrag Utility Secrets — Lineup Reference

> **Compiled:** 2026-05-22 from refrag.gg's "Utility Secrets" blog series + the owner-attached PDF `Utility Secrets: Spawn Smokes Tier List (Part 1)`.
>
> **Purpose:** A reference for adding refrag-documented lineups to `src/data/dust2.json` and to the Instant Smokes tab. Use this to know what refrag has BEFORE you go in-game to capture setpos coords.
>
> **Important caveat:** Refrag deliberately does NOT publish setpos / setang coords on their free blog. Those live behind their paid NADR tier ($5.40+/mo) and are accessible only inside a Refrag CS2 server (see DECISIONS_LEDGER + CS2_UTILITY_ENCYCLOPEDIA §16.3). To add any of these lineups to our app's data, the owner needs to capture the setpos manually in-game.
>
> **What this doc gives you:** for each lineup — the throw-from description, the aim landmark, the throw mechanic (jumpthrow / left-click / shift-walk), the target callout, and the source image URL. Enough to find the spot in-game and capture the setpos yourself.

---

## 1. The Utility Secrets series at a glance

Refrag's free blog has these "Utility Secrets" posts (Google site-indexed, ~10 articles 2025–2026):

| Article | Date | Maps | # Lineups |
|---|---|---|---|
| 5 Must-Know Nades for Train | Jan 21 2025 | Train | 5 |
| 7 Must-Know Nades for Anubis | Feb 12 2025 | Anubis | 7 |
| 5 Must-Know Nades for Ancient | Feb 22 2025 | Ancient | 5 |
| **5 Must-Know Nades for Dust 2** | **Mar 6 2025** | **Dust 2** | **5** |
| 6 Must-Know Nades for Mirage | Mar 12 2025 | Mirage | 6 |
| 5 Must-Know Nades for Inferno | Mar 26 2025 | Inferno | 5 |
| 7 Must-Know Nades for Nuke | Apr 3 2025 | Nuke | 7 |
| 5 Must-Know Nades for Overpass | Jul 20 2025 | Overpass | 5 |
| **Spawn Smokes Tier List (Part 1)** | **Nov 9 2025** | **Ancient, Mirage, Overpass** | **10** |
| **Spawn Smokes Tier List (Part 2)** | **Nov 15 2025** | **Nuke, Train, Dust 2, Inferno** | **~8** |

For this app (Dust 2 only), the directly relevant articles are bolded.

### URL pattern

- Map-specific: `https://refrag.gg/blog/cs2-utility-secrets-{N}-must-know-nades-for-{map}/` (Overpass uses `cs2-{N}-must-know-nades-for-overpass`)
- Spawn smokes: `https://refrag.gg/blog/cs2-spawn-smokes-guide-{1|2}/`
- Image CDN: `https://refrag.gg/cdn-cgi/imagedelivery/5wML_ikJr-qv52ESeLE6CQ/wordpress.refrag.gg/{YYYY}/{MM}/{filename}.jpg/public`

---

## 2. Dust 2 catalog from Refrag (7 lineups)

Cross-compiled from the standalone Dust 2 article and Spawn Smokes Part 2. Each entry lists: throw-from, aim, mechanic, image filenames.

### 2.1 Xbox Smoke (T side) — from Dust 2 article

- **Throw from:** "tucked into this corner" near T spawn (which specific spawn — Refrag doesn't say explicitly; visually inferable from `Dust2-Xbox-Lineup-Spot.jpg`)
- **Aim:** "this mark on the lip of the roof"
- **Mechanic:** Jumpthrow (no W)
- **Purpose:** denies a popular AWP line, removes CT bottom-mid info, enables mid defaults / pocket strats. *"One of the easiest pieces of utility to throw in the game."*
- **Side:** T
- **Target:** Xbox (top of mid box)
- **Images:**
  - Position: `Dust2-Xbox-Lineup-Spot.jpg`
  - Aim: `Dust2-Xbox-Lineup.jpg`
  - Result: `Dust2-Xbox-Smoke.jpg`
- **Source:** https://refrag.gg/blog/cs2-utility-secrets-5-must-know-nades-for-dust2/

### 2.2 Xbox Smoke (T side) — VARIANT from Spawn Smokes Part 2

A separate Xbox-smoke lineup from a DIFFERENT corner than 2.1. Refrag explicitly calls it "the easiest way" — implies the standalone-article Xbox smoke (2.1) is also alternative-easy.

- **Throw from:** "this corner" — different spot than 2.1 per the spawn-smokes-2 image set
- **Aim:** different point — see `Dust2-Xbox-smoke-lineup.jpg`
- **Mechanic:** Jumpthrow
- **Side:** T
- **Target:** Xbox
- **Images:**
  - Position: `Dust2-Xbox-smoke-lineup-spot.jpg`
  - Aim: `Dust2-Xbox-smoke-lineup.jpg`
  - Result: `Dust2-Xbox-smoke.jpg`
- **Source:** https://refrag.gg/blog/cs2-spawn-smokes-guide-2/

> **Note:** the filenames differ in casing between articles (`Lineup-Spot.jpg` vs `lineup-spot.jpg`) — that's how Refrag keeps the two distinct.

### 2.3 Short Smoke (T side) — Spawn Smokes Part 2

From the same corner as 2.2 — single setpos, two different aims yield two different smokes.

- **Throw from:** SAME corner as 2.2 (Xbox variant)
- **Aim:** "look here" — `Dust2-Short-Smoke-Lineup.jpg`
- **Mechanic:** W+Jumpthrow
- **Side:** T
- **Target:** A Short
- **Images:**
  - Position: SAME as 2.2 — `Dust2-Xbox-smoke-lineup-spot.jpg`
  - Aim: `Dust2-Short-Smoke-Lineup.jpg`
  - Result: `Dust2-Short-Smoke.jpg`
- **Source:** https://refrag.gg/blog/cs2-spawn-smokes-guide-2/
- **NOTE:** this is a quasi-combo lineup — one spawn position, two smokes. Maps onto our SoloCombination concept from csnades.gg (DECISIONS_LEDGER R-?). Worth modeling as a paired lineup if added.

### 2.4 Mid-to-B Smoke (T side)

- **Throw from:** "tucked into the corner of Xbox"
- **Aim:** "this spot on the right side of the thin plank"
- **Mechanic:** **Jumpthrow whilst crouching** ← unusual mechanic; record this
- **Purpose:** denies CT info on cross-to-B; transitions from mid default to B split; can also manipulate CT focus to leave A open
- **Side:** T
- **Target:** CT-side / B-cross
- **Important context:** *"significant change in how it's thrown as the game has transitioned from Global Offensive to CS2"* — old CS:GO lineups for this don't work; this is the CS2-era version
- **Images:**
  - Position: `Dust2-Mid-B-Lineup-Spot.jpg`
  - Aim: `Dust2-Mid-B-Lineup.jpg`
  - Result: `Dust2-Mid-B-Smoke.jpg`
- **Source:** https://refrag.gg/blog/cs2-utility-secrets-5-must-know-nades-for-dust2/

### 2.5 CT Cross Smoke / Long Cross Smoke (T side)

- **Throw from:** "right side of this blue box" (Long doors area)
- **Aim:** "here, just in from the corner of the roofing"
- **Mechanic:** **left-click throw** (no jumpthrow)
- **Purpose:** *"essentially the only way to finish a Long Take without getting picked apart by the variety of elevations on the CT-to-A cross"*
- **Side:** T
- **Target:** CT-spawn-to-A cross sightline
- **Images:**
  - Position: `Dust2-Long-Cross-Lineup-Spot.jpg`
  - Aim: `Dust2-Long-Cross-Lineup.jpg`
  - Result: `Dust2-Long-Cross-Smoke.jpg`
- **Source:** https://refrag.gg/blog/cs2-utility-secrets-5-must-know-nades-for-dust2/

### 2.6 Long Take Flashes (T side)

- **Throw from:** "center of the wall" (Long doors area, on the wall)
- **Aim:** "top of the white arrow and move up in a straight line until you reach the top of the wall"
- **Mechanic:** Jumpthrow
- **Purpose:** support flashes for Long take entry
- **Side:** T
- **Target:** A Long
- **Type:** **flash**, not smoke
- **Images:**
  - Position: `Dust2-Long-Flash-Lineup-Spot.jpg`
  - Aim: `Dust2-Long-Flash-Lineup.jpg`
  - No "result" image (flashes don't have a static landing visual)
- **Source:** https://refrag.gg/blog/cs2-utility-secrets-5-must-know-nades-for-dust2/

### 2.7 B Door Smoke (T side)

- **Throw from:** "left-hand side of the wooden crate" inside Upper Tunnels
- **Aim:** see `Dust2-B-Door-Lineup.jpg`
- **Mechanic:** **left-click throw** (no jumpthrow)
- **Purpose:** *"crucial smoke when it comes to taking control of the B Site, should really be thrown every time you execute"*
- **Side:** T
- **Target:** B Doors
- **Images:**
  - Position: `Dust2-B-Door-Lineup-Spot.jpg`
  - Aim: `Dust2-B-Door-Lineup.jpg`
  - Result: `Dust2-B-Door-Smoke.jpg`
- **Source:** https://refrag.gg/blog/cs2-utility-secrets-5-must-know-nades-for-dust2/

---

## 3. Spawn Smokes Part 1 — full breakdown (from PDF)

PDF attached by owner: `Utility Secrets: Spawn Smokes Tier List (Part 1) - Refrag.pdf` (22 pages). Page renders saved at `/tmp/refrag_part1_pages/page01.png … page22.png` for owner reference (NOT committed to repo — refrag's content).

### Ancient (5 lineups)

| # | Smoke | Side | Throw from | Mechanic | PDF pages | Image filename(s) |
|---|---|---|---|---|---|---|
| 3.1 | **Elbow** | CT | CT spawn — "indent on the roof" landmark | Shift-walk into position, **jumpthrow** | 2-4 | `Ancient-Elbow-Smoke-Spawn.jpg`, `Pos1`, `Pos2`, `Smoke.jpg` |
| 3.2 | **Red** | T | T spawn (specific one shown in image) | **W+Jumpthrow** | 4-6 | `Ancient-Red-Smoke-Spawn.jpg`, `Lineup.jpg`, `Smoke.jpg` |
| 3.3 | **Heaven** | T | Same spawn as Red (3.2) | Jumpthrow | 6-7 | `Ancient-Heaven-Smoke-Lineup.jpg`, `Smoke.jpg` |
| 3.4 | **Jaguar** | T | Same spawn as Red+Heaven | Jumpthrow | 8-9 | `Ancient-Jaguar-Smoke-Lineup.jpg`, `Smoke.jpg` |
| 3.5 | **Donut** | T | Different spawn from Red set | **W+Jumpthrow** | 9-11 | `Ancient-Donut-Smoke-Spawn.jpg`, `Lineup.jpg`, `Smoke.jpg` |

Note: 3.2, 3.3, 3.4 all use the same T-spawn — three smokes from one spot, similar pattern to our Dust 2 Xbox+Short combo from 2.2/2.3.

### Mirage (3 lineups)

| # | Smoke | Side | Throw from | Mechanic | PDF pages | Image filename(s) |
|---|---|---|---|---|---|---|
| 3.6 | **Window** | T | T spawn (specific one) | **W+Jumpthrow** | 11-13 | `Mirage-Window-Smoke-Spawn.jpg`, `Lineup.jpg`, `Smoke.jpg` |
| 3.7 | **Connector** | T | T-Spawn, corner of the bin (not strictly spawn) | Jumpthrow | 13-15 | `Mirage-Con-Smoke-Spot.jpg`, `Lineup.jpg`, `Smoke.jpg` |
| 3.8 | **Top Mid** | T | Same bin area as Connector | **left-click** (no jumpthrow) | 15-17 | `Mirage-TopMid-Smoke-Spot.jpg`, `Lineup.jpg`, `Smoke.jpg` |

Note: Connector + Top Mid are NOT instant-from-spawn — Refrag includes them because they're close enough to count. Owner's app should probably tag these as "near-spawn" rather than "instant."

### Overpass (2 lineups)

| # | Smoke | Side | Throw from | Mechanic | PDF pages | Image filename(s) |
|---|---|---|---|---|---|---|
| 3.9 | **Monster** | CT | CT spawn — "this corner" | Jumpthrow | 17-19 | `Overpass-Spawn-Smokes-Lineup-Spot.jpg`, `Overpass-Monster-Smoke-Lineup.jpg`, `Smoke.jpg` |
| 3.10 | **Short** | CT | SAME corner as Monster | Jumpthrow | 19-20 | `Overpass-Spawn-Smokes-Lineup-Spot.jpg` (shared), `Overpass-Short-Smoke-Lineup.jpg`, `Smoke.jpg` |

Two smokes, one spawn position — another combo lineup pattern.

---

## 4. Spawn Smokes Part 2 — full breakdown (from live site)

Not in the attached PDF, but pulled from `https://refrag.gg/blog/cs2-spawn-smokes-guide-2/`.

### Nuke (1 setup, 2 smokes from same corner)

| # | Smoke | Side | Throw from | Mechanic | Image filename(s) |
|---|---|---|---|---|---|
| 4.1a | **Outside Smoke #1** | T | T-Spawn, "this corner" | Jumpthrow (with specific aim) | `Nuke-Outside-Smokes-Lineup-Spot.jpg`, `Nuke-Outside-Smoke-Pos1.jpg` |
| 4.1b | **Outside Smoke #2** | T | SAME corner | **W+Jumpthrow** (different aim) | `Nuke-Outside-Smoke-Pos2.jpg`, `Nuke-Outside-Smokes.jpg` |

Two-smoke wall combo.

### Train (3 lineups)

| # | Smoke | Side | Throw from | Mechanic | Image filename(s) |
|---|---|---|---|---|---|
| 4.2 | **Camera Smoke** | T | T-Spawn corner | Jumpthrow | `Train-Camera-Smoke-Lineup-Spot.jpg`, `Lineup.jpg`, `Smoke.jpg` |
| 4.3 | **Sandwich Smoke** | T | T-Spawn (different spot) | Jumpthrow | `Train-Sandwich-Smoke-Lineup-Spot.jpg`, `Lineup.jpg`, `Smoke.jpg` |
| 4.4 | **A Main Smoke** | CT | CT spawn corner, **shift-walk** to a guttering landmark, then jumpthrow whilst walking | Shift-walk + walking-jumpthrow (complex) | `Train-A-Main-Smoke-Lineup-Spot.jpg`, `Pos1.jpg`, `Pos2.jpg`, `Smoke.jpg` |

Train notes: A Main Smoke is multi-step (shift-walk to landmark, then walking-jumpthrow) — more complex than typical jumpthrow lineups. Worth flagging "difficulty: hard" if added.

### Dust 2 (2 lineups — already covered in §2.2 + §2.3)

See entries 2.2 (Xbox spawn smoke) and 2.3 (Short spawn smoke) above.

### Inferno (2 lineups)

| # | Smoke | Side | Throw from | Mechanic | Image filename(s) |
|---|---|---|---|---|---|
| 4.5 | **CT Mid Take Smoke** | CT | "Center of this wall" | Jumpthrow | `Inferno-Mid-Smoke-lineup-spot.jpg`, `lineup.jpg`, `Inferno-mid-cutoff-smoke.jpg` |
| 4.6 | **Banana Smoke** | CT | CT spawn, "corner of the chair" | Jumpthrow | `Inferno-Banana-spawn-smoke-lineup-spot.jpg`, `lineup.jpg`, `Inferno-Banana-smoke.jpg` |

---

## 5. What our app should do with this

### 5.1 Direct adds (Dust 2 only)

The 7 Dust 2 lineups in §2 are direct candidates for adding to `src/data/dust2.json`. For each, the owner needs to:

1. Launch CS2, go to Workshop Dust 2 with `sv_cheats 1`
2. Use Refrag's image as a landmark to find the spot
3. Type `getpos` in console to capture setpos + setang
4. Test the throw — if it works, add to the JSON with the captured coords
5. (Optional) Capture screenshots that match Refrag's 3-card pattern (spot, aim, result)

### 5.2 Lineup vs Combo modeling

Two of the seven (2.2 + 2.3, Xbox+Short from the same corner) form a **solo combination** — one spawn position, two smokes. This matches csnades.gg's "Solo Combinations" model. Worth either:

- Modeling them as two independent lineups that share the same `throwFrom`, OR
- Adding a `Combination` type that bundles multiple lineups thrown sequentially from one spot (would map onto the same concept on Mirage Window+Connector+TopMid, Overpass Monster+Short, Ancient Red+Heaven+Jaguar, Nuke Outside #1+#2).

### 5.3 Instant Smokes tab

Refrag's spawn-smokes framework validates our Instant Smokes tab concept (FR-23) — both articles open with the claim that knowing spawn smokes is foundational for "quick, effective defaults." The 7 Dust 2 lineups in §2 are all candidates for the Instant Smokes tab (current threshold: throwFrom within 1500 wu of a spawn).

If 1500 wu is too tight to include the "tucked-in-Xbox-corner" lineups (2.4 Mid-to-B), the threshold could be relaxed or a `spawnAdjacent: true` flag added.

### 5.4 Mechanic vocabulary

Refrag's articles use these throw mechanics — make sure our `throwStyle` enum covers them:

| Refrag term | Our enum (`throwStyle`) |
|---|---|
| Jumpthrow | `jump` |
| W+Jumpthrow | `jump` with `movement: running` |
| Left-click (no jumpthrow) | `normal` |
| Shift-walk + jumpthrow | not currently representable — needs `crouch` or a new value? |
| Jumpthrow whilst crouching | `crouch` |
| Walking-jumpthrow | needs new value? |

The "shift-walk to a landmark then throw" pattern is multi-step and would need either a richer mechanic enum OR free-text instructions on the lineup.

---

## 6. Image copyright + redistribution

The 22 PDF page renders and all the URL'd JPGs are Refrag's content. **Do NOT commit them to this repo.** Reference them inline in our documentation but link back to the source URLs for the images themselves.

The PDF renders saved at `/tmp/refrag_part1_pages/` are for local owner reference only — they will not be committed.

---

## 7. Source URLs (canonical)

- **Spawn Smokes Tier List Part 1:** https://refrag.gg/blog/cs2-spawn-smokes-guide-1/
- **Spawn Smokes Tier List Part 2:** https://refrag.gg/blog/cs2-spawn-smokes-guide-2/
- **5 Must-Know Nades For Dust 2:** https://refrag.gg/blog/cs2-utility-secrets-5-must-know-nades-for-dust2/
- **CS2 Utility Encyclopedia §16.3 (refrag):** `docs/CS2_UTILITY_ENCYCLOPEDIA.md` — full content-model analysis of refrag's platform

### Image CDN URL template

```
https://refrag.gg/cdn-cgi/imagedelivery/5wML_ikJr-qv52ESeLE6CQ/wordpress.refrag.gg/{YYYY}/{MM}/{filename}.jpg/public
```

For the Dust 2 article (Mar 2025): `wordpress.refrag.gg/2025/03/{filename}.jpg`.
For Spawn Smokes (Nov 2025): `wordpress.refrag.gg/2025/11/{filename}.jpg`.

---

## 8. Next-step suggestions for the owner

When you're ready to add these to the app:

1. **Start with the Dust 2 article 5 lineups** (2.1, 2.4, 2.5, 2.6, 2.7) — refrag explicitly calls these "must know." Capture setpos for each in-game.
2. **Skip 2.2/2.3 initially** — there's already an `xbox_smoke` in our data; the spawn-smokes-2 Xbox is a variant, not a new lineup. Consider after 2.1 is verified.
3. **Long Flash (2.6)** is the only FLASH in the Refrag Dust 2 set — would expand the flash category in our app (which currently has minimal flashes).
4. **Add Mid-to-B (2.4)** — the CS2-era rebuild of a famous CS:GO lineup. High educational value.
5. **B Door Smoke (2.7)** is a B-execute staple — would complement existing B-execute scenarios.

When capturing setpos in-game, use the script pattern from `scripts/new-lineup.mjs` — it accepts `--throw "setpos X Y Z;setang P Y R"` as a flag.
