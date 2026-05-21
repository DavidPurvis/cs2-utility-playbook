#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dist = "dist";
const required = ["index.html", "404.html", "manifest.json", "robots.txt", "icon.svg"];

let failed = false;
for (const file of required) {
  const path = join(dist, file);
  if (!existsSync(path)) {
    console.error(`Missing dist/${file}`);
    failed = true;
  }
}

const index = readFileSync(join(dist, "index.html"), "utf8");
if (!index.includes("/cs2-utility-playbook/assets/") && !index.includes('src="/cs2-utility-playbook/')) {
  if (!index.includes("assets/")) {
    console.error("index.html does not reference built assets");
    failed = true;
  }
}

// TKT-025: radar image must be bundled into dist/. The walkthrough
// view depends on it for fallback radar crops; missing it silently
// would degrade the experience for every lineup card.
const radar = join(dist, "maps/dust2/radar.png");
if (!existsSync(radar)) {
  console.error(`Missing ${radar} — radar image not bundled.`);
  failed = true;
}
// And at least one screenshot under public/screenshots/ should make
// it through. We don't check every file (10 dirs × 4 slots) — just
// a sentinel — to keep the check fast.
const sentinelShot = join(dist, "screenshots/dust2/xbox_smoke/position.webp");
if (!existsSync(sentinelShot)) {
  console.error(`Missing ${sentinelShot} — screenshots not bundled (or xbox_smoke moved).`);
  failed = true;
}

if (failed) process.exit(1);
console.log("dist/ verification passed");
