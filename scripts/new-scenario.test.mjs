/**
 * TKT-024 — node:test for new-scenario.mjs's player-string parser.
 *
 * The CLI accepts player roster + action lists via a single --players
 * flag like `"a-man:lineup1,lineup2; b-man:lineup3"`. The parser
 * splits role:actions, validates each lineupId reference, and emits
 * a ScenarioPlayer[] structure. These tests lock the parsing rules.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePlayersForCli } from "./new-scenario.mjs";

test("parses a 2-role string with multiple actions each", () => {
  const r = parsePlayersForCli("a-man:xbox_smoke,long_flash; b-man:b_window_smoke", new Set(["xbox_smoke", "long_flash", "b_window_smoke"]));
  assert.equal(r.players.length, 2);
  assert.equal(r.players[0].role, "a-man");
  assert.deepStrictEqual(r.players[0].actions.map((a) => a.lineupId), ["xbox_smoke", "long_flash"]);
  assert.deepStrictEqual(r.players[0].actions.map((a) => a.order), [1, 2]);
  assert.equal(r.players[1].role, "b-man");
  assert.deepStrictEqual(r.players[1].actions.map((a) => a.lineupId), ["b_window_smoke"]);
});

test("accepts an empty action list (role:)", () => {
  const r = parsePlayersForCli("lurker:", new Set());
  assert.equal(r.players.length, 1);
  assert.equal(r.players[0].role, "lurker");
  assert.deepStrictEqual(r.players[0].actions, []);
});

test("rejects an unknown lineupId reference", () => {
  assert.throws(
    () => parsePlayersForCli("a-man:does_not_exist", new Set(["xbox_smoke"])),
    /unknown lineup.*does_not_exist/i
  );
});

test("ignores whitespace around roles, ids, and separators", () => {
  const r = parsePlayersForCli("  a-man : xbox_smoke , long_flash  ;  b-man : b_window_smoke  ", new Set(["xbox_smoke", "long_flash", "b_window_smoke"]));
  assert.equal(r.players[0].role, "a-man");
  assert.deepStrictEqual(r.players[0].actions.map((a) => a.lineupId), ["xbox_smoke", "long_flash"]);
});

test("returns empty player array for empty input", () => {
  const r = parsePlayersForCli("", new Set());
  assert.deepStrictEqual(r.players, []);
});
