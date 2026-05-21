# Adding new lineups

This app only renders lineups whose **throw position is an exact in-game `setpos` value**. Don't add a lineup if you can't get the setpos — the dot would be a guess.

## Quick steps

1. Open `data/lineup-additions.json`.
2. Append a new object to the `lineups` array. Required fields are documented in the `_doc` block at the top of that file (and enforced by `data/lineup-additions.schema.json`).
3. Run `node scripts/apply-additions.mjs` (or `--dry-run` first).
4. Tests + lint + build.
5. Commit.

## How to get exact setpos values

The `throwPos` field MUST be an exact in-game coordinate. Don't eyeball it.

| Source | How |
|---|---|
| **In-game (best)** | Stand at the spot, run `getpos` in console, copy the `setpos x y z` line. |
| **cs2util.com** | Open the lineup page → "Console Command" field → copy the `setpos x y z` part. |
| **AustinCS / YouTube** | Run `node scripts/extract-from-youtube.mjs <url>`. If the channel includes setpos in description, the script prints it. Otherwise pause the video at the moment the setpos command shows in console and copy it. |
| **demo files** | `getpos` after spectating the player. Slow but accurate. |

## How to get landing positions

`landingPos` should ALSO be a setpos-quality coordinate — where the smoke center actually deploys, not your visual estimate.

- **Easiest:** stand in-game where the smoke lands, run `getpos`.
- **Acceptable fallback:** cs2util's `landingAt.percent` (the dot on their 2D map). Less precise but at least sourced. Encode as `{ "source": "percent", "x": 67.5, "y": 31.0 }`.
- **Not acceptable:** an eyeball estimate from the radar image. The script will refuse.

## Example

```json
{
  "lineups": [
    {
      "id": "xbox_smoke_normal_t_spawn",
      "map": "dust2",
      "name": "Xbox Smoke from Normal T Spawn",
      "util": "SMOKE",
      "side": "T",
      "area": "Mid",
      "throwPos": [-299.969, -1163.764, 136.983],
      "landingPos": { "source": "percent", "x": 46.387, "y": 38.867 },
      "throw": "JT",
      "mustLearn": true,
      "purpose": "Cuts the AWPer's mid-doors angle so your team can cross safely.",
      "stand": "Stand in T Spawn near the right-side wall, aligned with the corner of the dark doorframe overhead.",
      "aim": "Look up at the antenna/wire above T Spawn. Crosshair just below where the wire meets the wall.",
      "notes": "Whoever has the closest spawn throws this. Must land before CTs set up mid AWP.",
      "video": "https://www.youtube.com/watch?v=9Xbkm14yqyU",
      "screenshots": {
        "stand": "https://assets.cs2util.com/dust2/smoke/xbox/xbox-smoke-from-nomal-t-spawn-lineup-mini.webp",
        "aim":   "https://assets.cs2util.com/dust2/smoke/xbox/xbox-smoke-from-nomal-t-spawn-lineup.webp",
        "result": "https://assets.cs2util.com/dust2/smoke/xbox/xbox-smoke-from-nomal-t-spawn-cover.webp"
      },
      "source": {
        "name": "cs2util",
        "url": "https://www.cs2util.com/dust2/smoke/xbox-smoke-from-nomal-t-spawn"
      }
    }
  ]
}
```

After running `apply-additions.mjs` this lineup is inserted into `data/dust2.js` with the radarPos/radarTarget rendered as the correct world-coord / percent literal.

## What NOT to do

- **Don't invent setpos values.** If you don't know it, leave the lineup out. The script refuses to add a lineup without `throwPos` and `landingPos`.
- **Don't add combos / utility belts** that reference lineups you haven't added yet. They'll fail validation. Add lineups first, then the combo.
- **Don't change `radarMetadata.js`** — `pos_x` / `pos_y` / `scale` are Valve's overview constants and must match the radar PNG.

## Workflow for a YouTube lineup video (e.g. AustinCS)

```
node scripts/extract-from-youtube.mjs https://www.youtube.com/watch?v=VIDEO_ID
```

The script prints:
- The chapter list (lineup names + timestamps)
- A JSON skeleton with one entry per chapter that looks like a lineup
- Any `setpos` strings it found in the description / transcript

Take that skeleton, fill in the setpos values (which you may need to copy manually from the video's on-screen console), and paste into `data/lineup-additions.json`.
