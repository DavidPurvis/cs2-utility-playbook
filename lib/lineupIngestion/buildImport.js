import { findBestCsnadesMatch } from "./matching.js";
import { mergeCsnadesEnrichment, toImportRecord } from "./normalize.js";

export function buildImportDataset({
  cs2utilRecordsByMap,
  csnadesRecordsByMap,
  sitemapDetailPagesByMap = {},
  failures = [],
  useCsnadesBackup = true,
}) {
  const byMap = {};
  const records = [];
  const backupFills = [];
  const usedCsnadesByMap = new Map();
  const mapIds = new Set([
    ...Object.keys(cs2utilRecordsByMap),
    ...Object.keys(sitemapDetailPagesByMap),
    ...failures.map((f) => f.mapId),
  ]);

  for (const mapId of mapIds) {
    const cs2Records = cs2utilRecordsByMap[mapId] || [];
    byMap[mapId] = [];
    const csnRecords = csnadesRecordsByMap[mapId] || [];
    const usedCsn = usedCsnadesByMap.get(mapId) || new Set();
    usedCsnadesByMap.set(mapId, usedCsn);

    const cs2BySlug = new Map(cs2Records.map((r) => [r.slug, r]));

    for (const cs2 of cs2Records) {
      let importRec = toImportRecord(cs2, { backupFilledFromCsnades: false, importStatus: "primary" });

      if (useCsnadesBackup && !cs2.landingAt) {
        const match = findBestCsnadesMatch(
          { slug: cs2.slug, from: cs2.from, to: cs2.to, name: cs2.title, title: cs2.title },
          csnRecords,
          { used: usedCsn, minScore: 0.55 }
        );
        if (match) {
          usedCsn.add(match.index);
          importRec = mergeCsnadesEnrichment(
            toImportRecord(cs2),
            toImportRecord(match.record, { importStatus: "enriched" }),
            { matchScore: match.score }
          );
          backupFills.push({
            mapId,
            slug: cs2.slug,
            reason: "landing_coords_enrichment",
            matchScore: match.score,
            csnadesSlug: match.record.slug,
          });
        }
      }

      byMap[mapId].push(importRec);
      records.push(importRec);
    }

    if (useCsnadesBackup) {
      for (const failure of failures.filter((f) => f.mapId === mapId)) {
        const match = findBestCsnadesMatch(
          { slug: failure.slug, from: failure.from || "", to: failure.to || "", name: failure.slug },
          csnRecords,
          { used: usedCsn, minScore: 0.5 }
        );

        if (match) {
          usedCsn.add(match.index);
          const importRec = toImportRecord(match.record, {
            backupFilledFromCsnades: true,
            importStatus: "backup_only",
          });
          byMap[mapId].push(importRec);
          records.push(importRec);
          backupFills.push({
            mapId,
            slug: failure.slug,
            reason: failure.reason,
            matchScore: match.score,
            csnadesSlug: match.record.slug,
          });
        }
      }

      for (const page of sitemapDetailPagesByMap[mapId] || []) {
        if (cs2BySlug.has(page.slug)) continue;
        const alreadyFilled = backupFills.some((b) => b.mapId === mapId && b.slug === page.slug);
        if (alreadyFilled) continue;

        const direct = csnRecords.find((r) => r.slug === page.slug);
        const match = direct
          ? { index: csnRecords.indexOf(direct), score: 1, record: direct }
          : findBestCsnadesMatch(
              { slug: page.slug, from: "", to: page.slug, name: page.slug },
              csnRecords,
              { used: usedCsn, minScore: 0.55 }
            );

        if (match) {
          usedCsn.add(match.index);
          const importRec = toImportRecord(match.record, {
            backupFilledFromCsnades: true,
            importStatus: "backup_only",
          });
          byMap[mapId].push(importRec);
          records.push(importRec);
          backupFills.push({
            mapId,
            slug: page.slug,
            reason: "cs2util_missing",
            matchScore: match.score,
            csnadesSlug: match.record.slug,
          });
        }
      }
    }
  }

  return { byMap, records, backupFills };
}

export function buildImportReport({
  generatedAt,
  mapIds,
  cs2util,
  csnades,
  importData,
  sitemap,
  failures,
  options,
}) {
  const byMapCounts = {};
  for (const mapId of mapIds) {
    const importRecords = importData.byMap[mapId] || [];
    byMapCounts[mapId] = {
      cs2util: (cs2util.byMap[mapId] || []).length,
      csnades: (csnades?.byMap?.[mapId] || []).length,
      sitemapDetailPages: (sitemap.detailPagesByMap[mapId] || []).length,
      imported: importRecords.length,
      backupFilled: importRecords.filter((r) => r.source.backupFilledFromCsnades).length,
      primaryOnly: importRecords.filter((r) => r.source.importStatus === "primary").length,
    };
  }

  return {
    generatedAt,
    mode: "cs2util_primary",
    description: "Primary lineup import from cs2util.com with optional csnades.gg backup fill.",
    options,
    sourceCounts: {
      cs2util: cs2util.records.length,
      csnades: csnades?.records?.length || 0,
      sitemapDetailPages: sitemap.detailPages.length,
    },
    importCounts: {
      total: importData.records.length,
      primary: importData.records.filter((r) => r.source.importStatus === "primary").length,
      enriched: importData.records.filter((r) => r.source.importStatus === "enriched").length,
      backupOnly: importData.records.filter((r) => r.source.importStatus === "backup_only").length,
      backupFilledFromCsnades: importData.records.filter((r) => r.source.backupFilledFromCsnades).length,
    },
    byMapCounts,
    failures,
    backupFills: importData.backupFills,
    warnings: [
      ...cs2util.warnings,
      ...(csnades?.warnings || []),
    ],
  };
}
