#!/usr/bin/env node
/**
 * Manual lineup updater.
 *
 * Primary source: cs2util.com (sitemap + list/detail pages)
 * Backup source: csnades.gg (gap-fill / enrichment only)
 *
 * Usage:
 *   npm run update:lineups
 *   npm run update:lineups -- --map mirage
 *   npm run update:lineups -- --all-maps
 *   npm run update:lineups -- --no-csnades-backup
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MAP_IDS } from "../data/mapMeta.js";
import { buildImportDataset, buildImportReport } from "../lib/lineupIngestion/buildImport.js";
import { CS2UTIL_BASE, CS2UTIL_TYPES, CSNADES_BASE } from "../lib/lineupIngestion/constants.js";
import { inferResolution } from "../lib/lineupIngestion/coords.js";
import {
  decodeHydrationPayload,
  extractLineupObjectBySlug,
  extractObjectsFromText,
} from "../lib/lineupIngestion/htmlParse.js";
import {
  isCsnadesLineupObject,
  isCs2UtilLineupObject,
  normalizeCsnadesRecord,
  normalizeCs2UtilRecord,
} from "../lib/lineupIngestion/normalize.js";
import { parseCs2UtilSitemap } from "../lib/lineupIngestion/sitemap.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const RAW_DIR = path.join(projectRoot, "data", "imports", "raw");
const STAGING_DIR = path.join(projectRoot, "data", "imports", "staging");
const REQUEST_TIMEOUT_MS = 20_000;
const DETAIL_CONCURRENCY = 8;

function parseArgs(argv) {
  const options = {
    mapIds: [...MAP_IDS],
    useCsnadesBackup: true,
    fetchDetails: true,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--all-maps") {
      options.mapIds = [...MAP_IDS];
    } else if (arg === "--map") {
      const mapId = argv[i + 1];
      if (!mapId) throw new Error("--map requires a map id");
      if (!MAP_IDS.includes(mapId)) throw new Error(`Unknown map id: ${mapId}`);
      options.mapIds = [mapId];
      i += 1;
    } else if (arg === "--no-csnades-backup") {
      options.useCsnadesBackup = false;
    } else if (arg === "--skip-details") {
      options.fetchDetails = false;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`Usage: npm run update:lineups [-- options]

Options:
  --all-maps            Fetch all supported maps (default)
  --map <id>            Fetch a single map (e.g. mirage)
  --no-csnades-backup   Skip csnades.gg gap-fill / enrichment
  --skip-details        Skip cs2util detail-page instruction enrichment
  -h, --help            Show this help
`);
}

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; cs2-utility-playbook updater/1.0)",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.text();
  } finally {
    clearTimeout(timeout);
  }
}

async function mapPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function runWorker() {
    while (nextIndex < items.length) {
      const current = nextIndex;
      nextIndex += 1;
      results[current] = await worker(items[current], current);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => runWorker());
  await Promise.all(workers);
  return results;
}

function groupDetailPagesByMap(detailPages) {
  const byMap = {};
  for (const page of detailPages) {
    if (!byMap[page.mapId]) byMap[page.mapId] = [];
    byMap[page.mapId].push(page);
  }
  return byMap;
}

async function fetchCs2UtilSitemap(mapIds) {
  const xml = await fetchText(`${CS2UTIL_BASE}/sitemap.xml`);
  return parseCs2UtilSitemap(xml, { mapIds, types: CS2UTIL_TYPES });
}

async function fetchCs2UtilData({ mapIds, sitemap, fetchDetails }) {
  const warnings = [];
  const failures = [];
  const byMap = {};
  const records = [];
  const detailPagesByMap = groupDetailPagesByMap(sitemap.detailPages);

  for (const mapId of mapIds) {
    const mapRecords = [];
    const bySlug = new Map();

    for (const utilType of CS2UTIL_TYPES) {
      const url = `${CS2UTIL_BASE}/${mapId}/${utilType}`;
      try {
        const html = await fetchText(url);
        const decoded = decodeHydrationPayload(html);
        const objects = extractObjectsFromText(decoded, "{\"id\":\"", isCs2UtilLineupObject);

        for (const obj of objects) {
          if (obj.mapId && obj.mapId !== mapId) continue;
          const normalized = normalizeCs2UtilRecord(obj, {
            mapId,
            pageUrl: `${CS2UTIL_BASE}/${mapId}/${obj.type}/${obj.positionId}`,
          });
          if (!normalized) {
            failures.push({
              mapId,
              slug: obj.positionId,
              reason: "normalize_failed",
              source: "cs2util",
            });
            continue;
          }
          bySlug.set(normalized.slug, normalized);
        }
      } catch (err) {
        warnings.push(`[cs2util] ${mapId}/${utilType} list fetch failed: ${err.message}`);
      }
    }

    if (fetchDetails) {
      const detailPages = (detailPagesByMap[mapId] || []).filter((page) => CS2UTIL_TYPES.includes(page.type));
      await mapPool(detailPages, DETAIL_CONCURRENCY, async (page) => {
        const existing = bySlug.get(page.slug);
        if (existing?.instructions) return;

        try {
          const html = await fetchText(page.url);
          const obj = extractLineupObjectBySlug(html, page.slug);
          if (!obj || !isCs2UtilLineupObject(obj)) {
            if (!existing) {
              failures.push({
                mapId,
                slug: page.slug,
                reason: "detail_parse_failed",
                source: "cs2util",
              });
            }
            return;
          }

          const normalized = normalizeCs2UtilRecord(obj, { mapId, pageUrl: page.url });
          if (!normalized) {
            failures.push({
              mapId,
              slug: page.slug,
              reason: "detail_normalize_failed",
              source: "cs2util",
            });
            return;
          }

          bySlug.set(page.slug, normalized);
        } catch (err) {
          warnings.push(`[cs2util] detail ${page.url} failed: ${err.message}`);
          if (!existing) {
            failures.push({
              mapId,
              slug: page.slug,
              reason: "detail_fetch_failed",
              source: "cs2util",
            });
          }
        }
      });
    }

    for (const rec of bySlug.values()) mapRecords.push(rec);
    byMap[mapId] = mapRecords;
    records.push(...mapRecords);
  }

  return {
    source: "cs2util",
    byMap,
    records,
    warnings,
    failures,
    sitemap: {
      listPages: sitemap.listPages.filter((url) => mapIds.some((id) => url.includes(`/${id}/`))),
      detailPages: sitemap.detailPages.filter((page) => mapIds.includes(page.mapId)),
      detailPagesByMap,
    },
  };
}

async function fetchCsnadesData(mapIds) {
  const warnings = [];
  const byMap = {};
  const records = [];

  for (const mapId of mapIds) {
    const url = `${CSNADES_BASE}/${mapId}`;
    try {
      const html = await fetchText(url);
      const decoded = decodeHydrationPayload(html);
      const objects = extractObjectsFromText(decoded, "{\"id\":\"nade_", isCsnadesLineupObject);
      const resolution = inferResolution(objects);

      const mapRecords = objects
        .map((obj) => normalizeCsnadesRecord(obj, { mapId, resolution }))
        .filter(Boolean);

      byMap[mapId] = mapRecords;
      records.push(...mapRecords);
    } catch (err) {
      warnings.push(`[csnades] ${mapId} fetch failed: ${err.message}`);
      byMap[mapId] = [];
    }
  }

  return { source: "csnades", byMap, records, warnings };
}

function ensureOutputDirs() {
  mkdirSync(RAW_DIR, { recursive: true });
  mkdirSync(STAGING_DIR, { recursive: true });
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  console.log(`[update:lineups] Maps: ${options.mapIds.join(", ")}`);
  console.log("[update:lineups] Fetching cs2util sitemap...");
  const sitemap = await fetchCs2UtilSitemap(options.mapIds);

  console.log("[update:lineups] Fetching cs2util lineup data...");
  const cs2util = await fetchCs2UtilData({
    mapIds: options.mapIds,
    sitemap,
    fetchDetails: options.fetchDetails,
  });

  let csnades = null;
  if (options.useCsnadesBackup) {
    console.log("[update:lineups] Fetching csnades backup data...");
    csnades = await fetchCsnadesData(options.mapIds);
  }

  console.log("[update:lineups] Building import staging dataset...");
  const importData = buildImportDataset({
    cs2utilRecordsByMap: cs2util.byMap,
    csnadesRecordsByMap: csnades?.byMap || {},
    sitemapDetailPagesByMap: cs2util.sitemap.detailPagesByMap,
    failures: cs2util.failures,
    useCsnadesBackup: options.useCsnadesBackup,
  });

  const generatedAt = new Date().toISOString();
  const report = buildImportReport({
    generatedAt,
    mapIds: options.mapIds,
    cs2util,
    csnades,
    importData,
    sitemap: cs2util.sitemap,
    failures: cs2util.failures,
    options: {
      mapIds: options.mapIds,
      useCsnadesBackup: options.useCsnadesBackup,
      fetchDetails: options.fetchDetails,
    },
  });

  ensureOutputDirs();

  writeJson(path.join(RAW_DIR, "cs2util.json"), {
    generatedAt,
    source: "cs2util",
    byMap: cs2util.byMap,
    count: cs2util.records.length,
    sitemap: cs2util.sitemap,
    failures: cs2util.failures,
    warnings: cs2util.warnings,
  });

  if (csnades) {
    writeJson(path.join(RAW_DIR, "csnades.json"), {
      generatedAt,
      source: "csnades",
      byMap: csnades.byMap,
      count: csnades.records.length,
      warnings: csnades.warnings,
    });
  }

  writeJson(path.join(STAGING_DIR, "lineups-import.json"), {
    generatedAt,
    mode: "cs2util_primary",
    byMap: importData.byMap,
    count: importData.records.length,
  });
  writeJson(path.join(STAGING_DIR, "lineups-import-report.json"), report);

  console.log("[update:lineups] Done.");
  console.log(`  cs2util:          ${cs2util.records.length}`);
  console.log(`  csnades:          ${csnades?.records.length ?? 0}`);
  console.log(`  sitemap details:  ${cs2util.sitemap.detailPages.length}`);
  console.log(`  imported:         ${importData.records.length}`);
  console.log(`  backup filled:    ${report.importCounts.backupFilledFromCsnades}`);
  console.log(`  failures:         ${cs2util.failures.length}`);
  if (report.warnings.length) {
    console.log("  warnings:");
    for (const warning of report.warnings.slice(0, 20)) console.log(`   - ${warning}`);
    if (report.warnings.length > 20) console.log(`   ... and ${report.warnings.length - 20} more`);
  }
  console.log(`  wrote: ${path.relative(projectRoot, path.join(STAGING_DIR, "lineups-import.json"))}`);
}

main().catch((err) => {
  console.error("[update:lineups] Failed:", err);
  process.exit(1);
});
