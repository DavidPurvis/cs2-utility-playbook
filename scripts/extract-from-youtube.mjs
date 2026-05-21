#!/usr/bin/env node
/**
 * Pull setpos commands from a YouTube video page (description,
 * pinned comment, transcript). For AustinCS / cs2util-style lineup
 * videos that put the setpos command in the description or pinned
 * comment, this gives us the exact in-game coordinate.
 *
 * Usage:
 *   node scripts/extract-from-youtube.mjs https://www.youtube.com/watch?v=...
 *   node scripts/extract-from-youtube.mjs <video-id>
 *
 * What it does:
 *   1. Fetches the YouTube watch page
 *   2. Parses the ytInitialData JSON blob for description, title, channel
 *   3. Greps for `setpos -123.45 678.9 [z];setang ...` patterns
 *   4. Also fetches the auto-generated transcript (if available)
 *      and greps that
 *   5. Prints all setpos commands found with context, ready to paste
 *      into data/lineup-additions.json
 *
 * Note: this CAN'T watch the video. If the setpos only appears as
 * console text on-screen (no OCR text in description / transcript),
 * we won't find it — the user would need to copy it manually from
 * the console UI in the video.
 */

const SETPOS_RE = /setpos\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*;\s*setang\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g;
const SETPOS_LOOSE_RE = /setpos\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)(?:\s+(-?\d+(?:\.\d+)?))?/g;

function videoId(arg) {
  if (!arg) return null;
  const m = arg.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : (/^[A-Za-z0-9_-]{11}$/.test(arg) ? arg : null);
}

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  if (!res.ok) throw new Error(`${url} returned ${res.status}`);
  return res.text();
}

function extractYtInitialData(html) {
  const m = html.match(/var\s+ytInitialData\s*=\s*(\{[\s\S]*?\});<\/script>/);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}

function gatherText(obj, out = []) {
  if (!obj) return out;
  if (typeof obj === "string") { out.push(obj); return out; }
  if (Array.isArray(obj)) { for (const v of obj) gatherText(v, out); return out; }
  if (typeof obj === "object") for (const v of Object.values(obj)) gatherText(v, out);
  return out;
}

function findSetposIn(text) {
  const exact = [];
  const loose = [];
  const exactSet = new Set();
  let m;
  while ((m = SETPOS_RE.exec(text)) !== null) {
    const key = `${m[1]} ${m[2]} ${m[3]}`;
    if (exactSet.has(key)) continue;
    exactSet.add(key);
    exact.push({
      pos: [Number(m[1]), Number(m[2]), Number(m[3])],
      ang: [Number(m[4]), Number(m[5]), Number(m[6])],
      raw: m[0],
    });
  }
  while ((m = SETPOS_LOOSE_RE.exec(text)) !== null) {
    const key = `${m[1]} ${m[2]} ${m[3] ?? ""}`;
    if (exactSet.has(key)) continue;
    exactSet.add(key);
    loose.push({ pos: [Number(m[1]), Number(m[2]), m[3] ? Number(m[3]) : null], raw: m[0] });
  }
  return { exact, loose };
}

async function fetchTranscriptText(vid) {
  // YouTube's "timedtext" endpoint can return transcript XML/JSON for
  // public videos with auto-captions. May fail; that's fine.
  try {
    const tt = await fetchPage(`https://www.youtube.com/api/timedtext?v=${vid}&lang=en`);
    if (!tt || tt.length < 50) return "";
    // Strip XML tags
    return tt.replace(/<[^>]+>/g, " ");
  } catch { return ""; }
}

async function main() {
  const arg = process.argv[2];
  const vid = videoId(arg);
  if (!vid) {
    console.error("Usage: node scripts/extract-from-youtube.mjs <youtube-url-or-id>");
    process.exit(2);
  }
  const url = `https://www.youtube.com/watch?v=${vid}`;
  console.log(`Fetching ${url} ...`);
  const html = await fetchPage(url);
  const data = extractYtInitialData(html);

  let title = "(unknown)";
  const channel = "(unknown)";
  let description;
  if (data) {
    const allText = gatherText(data);
    title = allText.find((t) => t.length > 5 && t.length < 200 && !t.includes("\n")) ?? title;
    description = allText.filter((t) => t.length > 100).join("\n\n");
  } else {
    description = (html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1]) ?? "";
  }

  console.log(`\nTitle:    ${title}`);
  console.log(`Channel:  ${channel}`);
  console.log(`Length:   description chars=${description.length}`);

  console.log(`\n=== setpos in description / page ===`);
  const fromPage = findSetposIn(description + "\n" + html);
  if (fromPage.exact.length === 0 && fromPage.loose.length === 0) {
    console.log("(none found)");
  }
  for (const f of fromPage.exact) {
    console.log(`  EXACT setpos+setang: pos=${JSON.stringify(f.pos)} ang=${JSON.stringify(f.ang)}`);
    console.log(`    raw: ${f.raw}`);
  }
  for (const f of fromPage.loose) {
    console.log(`  LOOSE setpos: pos=${JSON.stringify(f.pos)}`);
    console.log(`    raw: ${f.raw}`);
  }

  console.log(`\n=== setpos in auto-transcript (if available) ===`);
  const tt = await fetchTranscriptText(vid);
  if (!tt) {
    console.log("(no transcript fetched)");
  } else {
    const fromTt = findSetposIn(tt);
    if (fromTt.exact.length === 0 && fromTt.loose.length === 0) console.log("(none found)");
    for (const f of fromTt.exact) console.log(`  EXACT: ${f.raw}`);
    for (const f of fromTt.loose) console.log(`  LOOSE: ${f.raw}`);
  }

  // Pull chapter timestamps (e.g. "5:23 Long Corner Smoke") as a
  // lineup TODO list. AustinCS lineup videos always have these.
  console.log(`\n=== Video chapters (timestamp → name) ===`);
  const chapterLines = (description.match(/^\s*\d{1,2}:\d{2}(?::\d{2})?\s+[^\n]+/gm) ?? [])
    .concat(html.match(/(\d{1,2}:\d{2}(?::\d{2})?)\s+([^\n<"]{4,80})/g) ?? []);
  // Dedupe by timestamp
  const seen = new Set();
  const chapters = [];
  for (const raw of chapterLines) {
    const m = raw.trim().match(/(\d{1,2}:\d{2}(?::\d{2})?)\s+(.+)/);
    if (!m) continue;
    const ts = m[1];
    if (seen.has(ts)) continue;
    seen.add(ts);
    chapters.push({ ts, name: m[2].trim() });
  }
  if (chapters.length === 0) {
    console.log("(no chapters found)");
  } else {
    for (const c of chapters) console.log(`  ${c.ts}  ${c.name}`);
    console.log(`\nLineup additions JSON template (paste into data/lineup-additions.json after adding setpos values):`);
    const template = chapters
      .filter((c) => /smoke|flash|mol|nade|he|grenade/i.test(c.name) && !/intro|thank|chapter|^[A-Z][a-z]+$/.test(c.name))
      .map((c) => ({
        id: `_TODO_${c.name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")}`,
        map: "_TODO_",
        name: c.name,
        util: "_TODO_",
        side: "_TODO_",
        area: "_TODO_",
        throwPos: ["_TODO_x", "_TODO_y", "_TODO_z"],
        landingPos: ["_TODO_x", "_TODO_y", "_TODO_z"],
        throw: "_TODO_",
        source: { name: "AustinCS", url: `${url}&t=${c.ts.replace(":", "m")}s` },
        notes: `From AustinCS @ ${c.ts}`,
      }));
    console.log(JSON.stringify({ lineups: template }, null, 2));
  }
  console.log(`\nIf the setpos is shown on-screen in the video console but not in any text we can fetch, you'll need to pause the video, copy the setpos line from the console UI, and paste it into the throwPos field above.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
