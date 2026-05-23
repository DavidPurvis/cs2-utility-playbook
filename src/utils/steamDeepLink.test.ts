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

  it("handles negative coordinates in URL encoding", () => {
    const url = formatSteamDeepLink({ x: -500.5, y: -1200.3, z: -64 });
    expect(url).toContain("setpos%20-500.5%20-1200.3%20-64");
    // URL should still be parseable (no double-encoding issues).
    expect(url).toMatch(/^steam:\/\/rungameid\/730\/\//);
  });

  it("handles large coordinates", () => {
    const url = formatSteamDeepLink({ x: 99999.123, y: 88888.456, z: 77777.789 });
    expect(url).toContain("setpos%2099999.123%2088888.456%2077777.789");
  });

  it("handles all-negative angles", () => {
    const url = formatSteamDeepLink(
      { x: 0, y: 0, z: 0 },
      { pitch: -45.5, yaw: -90.1, roll: -180 }
    );
    expect(url).toContain("setang%20-45.5%20-90.1%20-180");
  });
});
