/**
 * Smoke test stub.
 *
 * Exists only so `node --test scripts/*.test.mjs` has a glob target
 * during Phase 1 — before the real script tests (`new-lineup.test.mjs`,
 * `new-scenario.test.mjs`) land in Phase 6. Without this stub the glob
 * is empty and the validate chain fails.
 *
 * Delete this file in Phase 6 (TKT-027) once the real script tests
 * exist.
 */
import { test } from "node:test";

test("scripts test runner smoke", () => {
  // Intentionally empty. Existence is the only assertion.
});
