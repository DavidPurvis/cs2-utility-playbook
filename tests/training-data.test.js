import { describe, expect, it } from "vitest";
import { TRAINING, TOOL_COLORS, WARMUP } from "../data/training.js";

const EX_KEYS = ["id", "name", "tool", "duration", "launch", "note"];

function validateExercise(ex, label) {
  const problems = [];
  for (const k of EX_KEYS) {
    if (ex[k] === undefined || ex[k] === "") problems.push(`${label}: missing "${k}"`);
  }
  if (ex.tool && !(ex.tool in TOOL_COLORS)) {
    problems.push(`${label}: tool "${ex.tool}" has no TOOL_COLORS entry`);
  }
  const launch = ex.launch;
  if (typeof launch === "string" && launch.length) {
    const ok = launch.startsWith("steam://") || launch.startsWith("https://") || launch.startsWith("http://");
    if (!ok) problems.push(`${label}: launch URL should start with steam:// or https://`);
  }
  return problems;
}

describe("training data", () => {
  it("has well-formed warmup and training entries", () => {
    const problems = [];
    for (const ex of WARMUP) problems.push(...validateExercise(ex, `WARMUP.${ex?.id || "?"}`));
    for (const ex of TRAINING) problems.push(...validateExercise(ex, `TRAINING.${ex?.id || "?"}`));
    if (problems.length > 0) {
      console.error(problems.join("\n"));
    }
    expect(problems).toEqual([]);
  });

  it("uses unique ids across warmup and training", () => {
    const ids = [...WARMUP, ...TRAINING].map((e) => e.id);
    const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dup.length > 0) {
      console.error("duplicate ids:", [...new Set(dup)].join(", "));
    }
    expect(dup).toEqual([]);
  });

  it("defines a color for every tool in use", () => {
    const tools = new Set([...WARMUP, ...TRAINING].map((e) => e.tool));
    for (const t of tools) {
      expect(TOOL_COLORS[t]).toBeDefined();
    }
  });
});
