/**
 * TKT-023 — node:test for new-lineup.mjs's setpos regex.
 *
 * The CLI duplicates the parse-setpos regex from parseSetposCommand.ts
 * (rather than importing it; the CLI is plain .mjs with no build step).
 * These tests lock that duplicate against the source's canonical
 * inputs — if the source drifts, this test fails on CI before the
 * drift hits production.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseSetposForCli } from "./new-lineup.mjs";

test("parses a full cs2util-style setpos+setang", () => {
  const r = parseSetposForCli(
    "setpos -299.968933 -1163.764160 136.822464;setang -12.173467 91.437721 0.000000"
  );
  assert.ok(r);
  assert.deepStrictEqual(r.world, { x: -299.968933, y: -1163.76416, z: 136.822464 });
  assert.deepStrictEqual(r.angle, { pitch: -12.173467, yaw: 91.437721, roll: 0 });
});

test("parses setpos alone without z", () => {
  const r = parseSetposForCli("setpos -657.27 -755.88");
  assert.ok(r);
  assert.deepStrictEqual(r.world, { x: -657.27, y: -755.88 });
  assert.equal(r.angle, undefined);
});

test("parses setang alone (no world)", () => {
  const r = parseSetposForCli("setang 0 90 0");
  assert.ok(r);
  assert.equal(r.world, undefined);
  assert.deepStrictEqual(r.angle, { pitch: 0, yaw: 90, roll: 0 });
});

test("accepts reordered setang;setpos input", () => {
  const r = parseSetposForCli("  setang 0 90 0  ; setpos 1 2 3 ");
  assert.ok(r);
  assert.deepStrictEqual(r.world, { x: 1, y: 2, z: 3 });
  assert.deepStrictEqual(r.angle, { pitch: 0, yaw: 90, roll: 0 });
});

test("returns null on garbage input", () => {
  assert.equal(parseSetposForCli(""), null);
  assert.equal(parseSetposForCli("not a command"), null);
  assert.equal(parseSetposForCli("setpos one two"), null);
});

test("accepts signed decimals", () => {
  const r = parseSetposForCli("setpos -0.5 100 -64.25;setang -45.5 180 0");
  assert.ok(r);
  assert.deepStrictEqual(r.world, { x: -0.5, y: 100, z: -64.25 });
  assert.deepStrictEqual(r.angle, { pitch: -45.5, yaw: 180, roll: 0 });
});
