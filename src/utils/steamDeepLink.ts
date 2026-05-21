/**
 * Formats a `steam://rungameid/730` URL that, when clicked, launches
 * CS2 and runs:
 *
 *   map de_dust2
 *   sv_cheats 1
 *   setpos <x> <y> [z]
 *   setang <pitch> <yaw> <roll>   (only when provided)
 *
 * The Steam protocol handler concatenates "+" between commands. The
 * leading `//` after 730 is the rungameid argument separator, then the
 * "+map de_dust2" etc. payload follows. Spaces between args are
 * URL-encoded as %20 to survive copy-paste through chat / SMS without
 * mangling.
 *
 * Caveat: `setpos` only takes effect when `sv_cheats 1` is on, which
 * Steam will enable on launch. On official servers cheats are off — this
 * deep-link is intended for practice / community servers.
 */

import type { ThrowAngle, WorldPoint } from "../types";

const RUNGAMEID = "steam://rungameid/730";

export function formatSteamDeepLink(world: WorldPoint, angle?: ThrowAngle): string {
  const parts: string[] = ["map de_dust2", "sv_cheats 1"];

  const setpos =
    world.z !== undefined
      ? `setpos ${world.x} ${world.y} ${world.z}`
      : `setpos ${world.x} ${world.y}`;
  parts.push(setpos);

  if (angle) {
    parts.push(`setang ${angle.pitch} ${angle.yaw} ${angle.roll}`);
  }

  // "+cmd1+cmd2+cmd3..." with spaces inside each cmd URL-encoded.
  const payload = parts.map((p) => "+" + p.replaceAll(" ", "%20")).join("");
  return `${RUNGAMEID}//${payload}`;
}
