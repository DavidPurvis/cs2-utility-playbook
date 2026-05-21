# Data sources for multi-spot lineups and N-man executes

I surveyed the public CS2 utility ecosystem looking for **structured, machine-extractable** data we could use to add 1-man belts and 2/3-man executes without inventing anything.

## What "good" looks like

A usable entry has all of:
1. **Exact in-game `setpos`** for every lineup involved (so dots are spawnable)
2. **Per-player role** (who throws what)
3. **Timing / order** (which goes first)
4. **A verified source** we can credit

Approximate descriptions don't qualify — those are exactly what got us into trouble.

---

## Sources surveyed

### ✅ cs2util.com — individual lineups only
- **What we get:** 617 individual lineups across all maps, each with exact `setpos` from posCommand
- **What's missing:** no concept of combos / belts / executes in their data model
- **Already in our `data/imports/staging/lineups-import.json`**

### ✅ csnades.gg — has "Solo Combinations"
- **What we get:** Named 1-player utility belts. Example: Dust 2 has "Window + Doors from Outside B Tunnels" — one player throws B Window smoke + B Doors smoke from a single standing position
- **Component lineups:** each combination references 2+ individual nades
- **What's missing:** no setpos on the combination page itself, but the component nades match cs2util naming closely
- **Per-map counts (Dust 2 has 1 listed publicly):** likely 1–5 per map
- **Action item:** scrape combination names + component nade names, cross-reference to cs2util slug → we get setpos for each spot in the belt automatically

### ⚠️ refrag.gg blog — narrative only
- **What we get:** Strat guides ("CS2 Utility Secrets: 5 Must-Know Nades", etc.) describing lineups and executes in text
- **What's missing:** no setpos, no structured combo definitions
- **Already in our codebase** as the "refrag" source on individual lineups

### ⚠️ AustinCS (@austincsgo) — chapter timestamps
- **What we get:** Long-form lineup videos with chapter markers (`5:23 Long Corner Smoke`, etc.)
- **What's missing:** setpos shown only as console text inside video frames — not in description, not in transcript
- **Has belt content:** "Full Utility Belts" video covers each map; "Instant Smokes for Each Map" series
- **Action item:** `scripts/extract-from-youtube.mjs` pulls chapter names + URLs as a TODO list. Human watches each segment, copies setpos manually from the on-screen console, pastes into `lineup-additions.json`.

### ⚠️ CS Tactics YouTube — utility belt videos
- **What we get:** "Full Utility Belts on EVERY MAP for 2026!" (8 chapters, one per map); per-map "Every SMOKE, MOLLY, and FLASH you MUST know" videos
- **What's missing:** same as AustinCS — setpos only on-screen
- **Same extraction approach as AustinCS**

### ⚠️ NadeKing (nadeking.com) — narrative + video
- **What we get:** Articles + embedded videos for team execute concepts (we already cite them on a few existing lineups)
- **What's missing:** no formal combo schema, no setpos in articles

### ❌ HLTV pro match demos
- **What's there:** every pro game has a downloadable .dem file. `markus-wa/demoinfocs-golang` can extract smoke entity positions
- **Why it's hard:** demos give SMOKE LANDING positions, not player setpos. Also no labels — you'd need to manually annotate which smoke is "Xbox" etc.
- **Useful for landing positions** (the part of our data that's currently inaccurate), not for executes
- **Action item (future):** demo parsing pipeline could fix the landing inaccuracy systematically

### ❌ BLAST.tv strat articles
- **What we get:** Sometimes structured articles like "How FaZe executes A on Mirage"
- **What's missing:** narrative only, no setpos
- **Already cited** on some existing lineups

### ❌ Liquipedia
- **What we get:** Map strat pages
- **What's missing:** mostly text, no setpos

### ❌ Pro player educational YouTube (fl0m, Skyed, donk, etc.)
- **Same story:** good content, no structured data

### ❌ Reddit r/GlobalOffensive
- **Same story:** community discussions, varied quality, no structured data

---

## What we can do right now without inventing

### 1-MAN UTILITY BELTS — partial coverage from csnades

`scripts/scrape-csnades-combinations.mjs` (TODO):
- Crawl `https://csnades.gg/<map>/combinations`
- For each combination page: get name + linked component lineup names
- Match each component to a cs2util slug (via fuzzy slug compare on slug/name)
- Emit a `UTILITY_BELTS` entry with `sequence: [{lineup: <cs2util-slug>, step: N}, ...]`
- Result: maybe 1–5 verified belts per map

### 2/3-MAN EXECUTES — manual, one at a time

There's **no public source** that gives us:
- "Player A throws smoke X at setpos (X1,Y1,Z1)"
- "Player B throws smoke Y at setpos (X2,Y2,Z2)"
- "Player C throws molly Z at setpos (X3,Y3,Z3)"

…all in one structured place. The closest is refrag/blast/austincs writing it up in prose.

**Practical path:**
1. Watch an AustinCS / CS Tactics execute video (e.g. "A site execute Mirage")
2. For each smoke shown, copy the setpos from the on-screen console
3. Add each as a normal lineup via `data/lineup-additions.json`
4. THEN add a new `COMBOS` entry that references the new lineup ids with `who: "Player A"` etc.

`scripts/extract-from-youtube.mjs` already prints the chapter list as a fill-in JSON skeleton. The setpos values are the only manual part.

### MULTI-SPOT LINEUPS (same standing position, multiple smokes)

These are 1-MAN BELTS by another name. csnades calls them "Solo Combinations". Same workflow as above.

---

## What I am NOT going to do

- ❌ Invent setpos values from descriptions
- ❌ Estimate "Player A throws here" from a video without seeing the actual coord
- ❌ Pull AI-generated "common executes" — those aren't verified data
- ❌ Use csnades's video-only entries without a setpos cross-reference

If the dot's coordinate can't be traced to an exact `setpos`, the lineup isn't getting added. That bar stays.
