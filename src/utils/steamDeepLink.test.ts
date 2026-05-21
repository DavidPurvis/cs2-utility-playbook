import { describe, expect, it } from "vitest";
import { formatSteamDeepLink } from "./steamDeepLink";

describe("formatSteamDeepLink", () => {
  it("formats a basic setpos as a steam://rungameid/730 URL", () => {
    const url = formatSteamDeepLink({ x: -657.27, y: -755.88, z: 64 });
    expect(url).toMatch(/^steam:\/\/rungameid\/730\/\//);
    expect(url).toContain("setpos%20-657.27%20-755.88%2064");
  });

  it("includes setang when an angle is provided", () => {
    const url = formatSteamDeepLink({ x: 0, y: 0, z: 0 }, { pitch: -12.17, yaw: 91.44, roll: 0 });
    expect(url).toContain("setang%20-12.17%2091.44%200");
  });

  it("omits z when not present", () => {
    const url = formatSteamDeepLink({ x: 100, y: 200 });
    expect(url).toContain("setpos%20100%20200");
    // No trailing space-z encoding (i.e., the setpos part ends right after y).
    expect(url).not.toMatch(/setpos%20100%20200%20[^+]/);
  });

  it("includes sv_cheats 1 and the map command (lineups depend on cheats for setpos)", () => {
    const url = formatSteamDeepLink({ x: 0, y: 0, z: 0 });
    expect(url).toContain("sv_cheats%201");
    expect(url).toContain("map%20de_dust2");
  });
});
