import { describe, expect, it } from "vitest";
import { formatSetposCommand, parseSetposCommand } from "./parseSetposCommand";

describe("parseSetposCommand", () => {
  it("parses a full cs2util-style command", () => {
    const r = parseSetposCommand(
      "setpos -299.968933 -1163.764160 136.822464;setang -12.173467 91.437721 0.000000"
    );
    expect(r).not.toBeNull();
    expect(r!.world).toEqual({ x: -299.968933, y: -1163.76416, z: 136.822464 });
    expect(r!.angle).toEqual({ pitch: -12.173467, yaw: 91.437721, roll: 0 });
  });

  it("parses setpos alone (no Z)", () => {
    const r = parseSetposCommand("setpos -657.27 -755.88");
    expect(r).not.toBeNull();
    expect(r!.world).toEqual({ x: -657.27, y: -755.88 });
    expect(r!.angle).toBeUndefined();
  });

  it("parses setang alone", () => {
    const r = parseSetposCommand("setang 0 90 0");
    expect(r).not.toBeNull();
    expect(r!.angle).toEqual({ pitch: 0, yaw: 90, roll: 0 });
    expect(r!.world).toBeUndefined();
  });

  it("ignores extra whitespace and reordering", () => {
    const r = parseSetposCommand("  setang 0 90 0   ; setpos 1 2 3 ");
    expect(r).not.toBeNull();
    expect(r!.world).toEqual({ x: 1, y: 2, z: 3 });
    expect(r!.angle).toEqual({ pitch: 0, yaw: 90, roll: 0 });
  });

  it("returns null on garbage input", () => {
    expect(parseSetposCommand("")).toBeNull();
    expect(parseSetposCommand("not a command")).toBeNull();
    expect(parseSetposCommand("setpos one two")).toBeNull();
  });

  it("round-trips through formatSetposCommand", () => {
    const original = "setpos -299.969 -1163.764 136.822;setang -12.173 91.437 0";
    const parsed = parseSetposCommand(original);
    expect(parsed).not.toBeNull();
    const reformatted = formatSetposCommand(parsed!.world, parsed!.angle);
    const reparsed = parseSetposCommand(reformatted);
    expect(reparsed!.world).toEqual(parsed!.world);
    expect(reparsed!.angle).toEqual(parsed!.angle);
  });
});
