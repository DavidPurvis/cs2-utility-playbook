import { describe, expect, it } from "vitest";
import { MAP_IDS } from "../data/mapMeta.js";
import MAPS from "../data/maps-registry.js";
import { RADAR_METADATA, VALVE_RADAR_SOURCE_RESOLUTION } from "../data/radarMetadata.js";
import demoinfocsSnapshot from "./fixtures/demoinfocsRadarMetadata.json";

const FETCH_TIMEOUT_MS = 30_000;
const EXPECTED_RADAR_DIMENSIONS = [1024, 2048];

function readPngDimensions(buffer) {
  if (buffer.length < 24) throw new Error("PNG buffer too short");
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") throw new Error("Not a PNG file");
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

async function fetchRadarBuffer(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return Buffer.from(await res.arrayBuffer());
  } finally {
    clearTimeout(timeout);
  }
}

describe("radar metadata compatibility", () => {
  it("provides metadata for every supported map id", () => {
    for (const mapId of MAP_IDS) {
      const meta = RADAR_METADATA[mapId];
      expect(meta, `${mapId} metadata`).toBeDefined();
      expect(typeof meta.pos_x).toBe("number");
      expect(typeof meta.pos_y).toBe("number");
      expect(typeof meta.scale).toBe("number");
      expect(meta.scale, `${mapId} scale`).toBeGreaterThan(0);
      expect(meta.sourceResolution, `${mapId} sourceResolution`).toBe(VALVE_RADAR_SOURCE_RESOLUTION);
    }
  });

  it("keeps radar URL + metadata present together for every map module", () => {
    for (const mapId of MAP_IDS) {
      const mod = MAPS[mapId]?.module;
      expect(mod, `${mapId} module`).toBeDefined();
      expect(typeof mod.RADAR_URL).toBe("string");
      expect(mod.RADAR_URL.length, `${mapId} RADAR_URL`).toBeGreaterThan(0);
      expect(RADAR_METADATA[mapId], `${mapId} has metadata entry`).toBeDefined();
    }
  });

  it("matches demoinfocs overview metadata where available", () => {
    for (const [mapId, expected] of Object.entries(demoinfocsSnapshot.maps)) {
      const actual = RADAR_METADATA[mapId];
      expect(actual.pos_x).toBe(expected.pos_x);
      expect(actual.pos_y).toBe(expected.pos_y);
      expect(actual.scale).toBe(expected.scale);
    }
  });

  for (const mapId of MAP_IDS) {
    it(`downloads ${mapId} MurkyYT radar as a square PNG`, async () => {
      const mod = MAPS[mapId].module;
      const buffer = await fetchRadarBuffer(mod.RADAR_URL);
      const { width, height } = readPngDimensions(buffer);
      expect(width, "width").toBe(height);
      expect(EXPECTED_RADAR_DIMENSIONS, `${mapId} radar dimension`).toContain(width);
    }, FETCH_TIMEOUT_MS + 5000);
  }
});
