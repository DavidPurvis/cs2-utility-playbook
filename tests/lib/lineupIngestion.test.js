import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildImportDataset } from "../../lib/lineupIngestion/buildImport.js";
import { parseSetposXY, percentFromPixelPoint, roundPercent } from "../../lib/lineupIngestion/coords.js";
import {
  decodeHydrationPayload,
  extractLineupObjectBySlug,
  extractObjectsFromText,
} from "../../lib/lineupIngestion/htmlParse.js";
import { pairScore, stringSimilarity } from "../../lib/lineupIngestion/matching.js";
import {
  isCs2UtilLineupObject,
  normalizeCs2UtilRecord,
  normalizeCsnadesRecord,
} from "../../lib/lineupIngestion/normalize.js";
import { parseCs2UtilSitemap } from "../../lib/lineupIngestion/sitemap.js";
import { parseFromTo } from "../../lib/lineupIngestion/text.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIR = path.join(__dirname, "..", "fixtures", "lineup-ingestion");

function readFixture(name) {
  return readFileSync(path.join(FIXTURE_DIR, name), "utf8");
}

describe("lineup ingestion helpers", () => {
  it("parses cs2util sitemap detail URLs for supported maps only", () => {
    const parsed = parseCs2UtilSitemap(readFixture("cs2util-sitemap.xml"), {
      mapIds: ["mirage", "dust2"],
    });

    expect(parsed.listPages).toEqual(["https://www.cs2util.com/mirage/smoke"]);
    expect(parsed.detailPages).toEqual([
      {
        mapId: "mirage",
        type: "smoke",
        slug: "topmid-smoke-from-t-spawn",
        url: "https://www.cs2util.com/mirage/smoke/topmid-smoke-from-t-spawn",
      },
      {
        mapId: "dust2",
        type: "smoke",
        slug: "xbox-smoke-from-t-spawn",
        url: "https://www.cs2util.com/dust2/smoke/xbox-smoke-from-t-spawn",
      },
    ]);
  });

  it("prefers Valve-derived percent from setpos over cs2util mapPos", () => {
    const normalized = normalizeCs2UtilRecord(
      {
        positionId: "topmid-smoke-from-t-spawn",
        mapId: "mirage",
        type: "smoke",
        team: "t",
        mapPos: { x: 71, y: 97 },
        pos: "setpos 1422.972412 36.468750 -104.128754;setang 0 0 0",
        translations: { en: { name: "Top Mid Smoke From T Spawn" } },
      },
      { mapId: "mirage" }
    );

    expect(normalized.throwFrom.percent).toEqual({ x: 90.878, y: 32.745 });
    expect(normalized.throwFrom.world).toEqual({ worldX: 1422.972412, worldY: 36.46875 });
  });

  it("extracts and normalizes cs2util detail payload", () => {
    const html = readFixture("cs2util-detail-snippet.html");
    const obj = extractLineupObjectBySlug(html, "topmid-smoke-from-t-spawn");
    expect(isCs2UtilLineupObject(obj)).toBe(true);

    const normalized = normalizeCs2UtilRecord(obj, { mapId: "mirage" });
    expect(normalized).toMatchObject({
      mapId: "mirage",
      grenadeType: "SMOKE",
      team: "T",
      slug: "topmid-smoke-from-t-spawn",
      title: "Top Mid Smoke From TSpawn",
      instructions: "Press against the trash bin.\nLine up with the utility pole.\nThrow with left click.",
      throwFrom: {
        percent: { x: 90.878, y: 32.745 },
        world: { worldX: 1422.972412, worldY: 36.46875 },
      },
      posCommand: expect.stringContaining("setpos"),
    });
  });

  it("extracts and normalizes csnades embedded payload", () => {
    const decoded = decodeHydrationPayload(readFixture("csnades-snippet.html"));
    const [obj] = extractObjectsFromText(decoded, "{\"id\":\"nade_", () => true);
    const normalized = normalizeCsnadesRecord(obj, { mapId: "mirage", resolution: 1024 });

    expect(normalized).toMatchObject({
      mapId: "mirage",
      grenadeType: "SMOKE",
      team: "T",
      slug: "top-mid-from-t-spawn",
      from: "T Spawn",
      to: "Top Mid",
      throwFrom: {
        percent: { x: 44.434, y: 85.352 },
      },
      landingAt: {
        percent: { x: 47.266, y: 35.742 },
      },
    });
  });

  it("parses from/to labels and setpos commands", () => {
    expect(parseFromTo({ name: "B Long Smoke From Ruins 2" })).toEqual({
      to: "B Long Smoke",
      from: "Ruins 2",
    });
    expect(parseSetposXY("setpos 1422.972412 36.468750 -104.128754;setang 0 0 0")).toEqual({
      worldX: 1422.972412,
      worldY: 36.46875,
    });
    expect(percentFromPixelPoint({ x: 512, y: 256 }, 1024)).toEqual({ x: 50, y: 25 });
    expect(roundPercent({ x: 44.44444, y: 88.88888 })).toEqual({ x: 44.444, y: 88.889 });
  });

  it("scores similar lineup labels for backup matching", () => {
    const left = { slug: "topmid-smoke-from-t-spawn", from: "T Spawn", to: "Top Mid", name: "Top Mid Smoke" };
    const right = { slug: "top-mid-from-t-spawn", from: "T Spawn", to: "Top Mid", name: "top mid from t spawn" };
    expect(stringSimilarity(left.to, right.to)).toBeGreaterThan(0.8);
    expect(pairScore(left, right)).toBeGreaterThan(0.7);
  });

  it("builds import dataset with csnades enrichment for missing landing coords", () => {
    const cs2 = normalizeCs2UtilRecord(
      {
        id: "abc",
        positionId: "topmid-smoke-from-t-spawn",
        mapId: "mirage",
        type: "smoke",
        team: "t",
        mapPos: { x: 71, y: 97 },
        translations: { en: { name: "Top Mid Smoke From T Spawn" } },
      },
      { mapId: "mirage" }
    );
    const csn = normalizeCsnadesRecord(
      {
        id: "nade_1",
        slug: "top-mid-from-t-spawn",
        team: "t",
        type: "smoke",
        titleFrom: "T Spawn",
        titleTo: "Top Mid",
        throwFrom: { x: 455, y: 874 },
        throwTo: { x: 484, y: 366 },
      },
      { mapId: "mirage", resolution: 1024 }
    );

    const importData = buildImportDataset({
      cs2utilRecordsByMap: { mirage: [cs2] },
      csnadesRecordsByMap: { mirage: [csn] },
      sitemapDetailPagesByMap: { mirage: [] },
      failures: [],
      useCsnadesBackup: true,
    });

    expect(importData.records).toHaveLength(1);
    expect(importData.records[0].source.backupFilledFromCsnades).toBe(true);
    expect(importData.records[0].landingAt.percent).toEqual({ x: 47.266, y: 35.742 });
    expect(importData.backupFills[0].reason).toBe("landing_coords_enrichment");
  });

  it("uses csnades backup when cs2util record is missing", () => {
    const csn = normalizeCsnadesRecord(
      {
        id: "nade_2",
        slug: "ct-from-outside-a",
        team: "t",
        type: "smoke",
        titleFrom: "Outside A",
        titleTo: "CT",
        throwFrom: { x: 139, y: 592 },
        throwTo: { x: 339, y: 187 },
      },
      { mapId: "ancient", resolution: 1024 }
    );

    const importData = buildImportDataset({
      cs2utilRecordsByMap: { ancient: [] },
      csnadesRecordsByMap: { ancient: [csn] },
      sitemapDetailPagesByMap: {
        ancient: [{ mapId: "ancient", type: "smoke", slug: "ct-from-outside-a", url: "https://csnades.gg/ancient/smokes/ct-from-outside-a" }],
      },
      failures: [],
      useCsnadesBackup: true,
    });

    expect(importData.records).toHaveLength(1);
    expect(importData.records[0].source.importStatus).toBe("backup_only");
    expect(importData.records[0].source.primary).toBe("csnades");
  });
});
