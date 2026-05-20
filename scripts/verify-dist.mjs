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

if (failed) process.exit(1);
console.log("dist/ verification passed");
