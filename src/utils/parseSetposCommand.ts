/**
 * Parse the console command string that cs2util.com exposes for every
 * lineup:
 *
 *   setpos -299.968933 -1163.764160 136.822464;setang -12.173467 91.437721 0.000000
 *
 * Either half is optional. The function is lenient — it will accept
 * the setpos alone, the setang alone, or both in either order. Numbers
 * may have any sign and any number of decimals. Whitespace and case are
 * normalized.
 */
import type { ThrowAngle, WorldPoint } from "../types/map";

export interface ParsedSetposCommand {
  world?: WorldPoint;
  angle?: ThrowAngle;
}

const SETPOS_RE = /setpos\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)(?:\s+(-?\d+(?:\.\d+)?))?/i;
const SETANG_RE = /setang\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/i;

export function parseSetposCommand(input: string): ParsedSetposCommand | null {
  if (typeof input !== "string" || input.trim().length === 0) return null;
  const pos = SETPOS_RE.exec(input);
  const ang = SETANG_RE.exec(input);
  if (!pos && !ang) return null;
  const out: ParsedSetposCommand = {};
  if (pos) {
    const x = Number(pos[1]);
    const y = Number(pos[2]);
    const z = pos[3] !== undefined ? Number(pos[3]) : undefined;
    if (Number.isFinite(x) && Number.isFinite(y)) {
      out.world = { x, y, ...(z !== undefined && Number.isFinite(z) ? { z } : {}) };
    }
  }
  if (ang) {
    const pitch = Number(ang[1]);
    const yaw = Number(ang[2]);
    const roll = Number(ang[3]);
    if (Number.isFinite(pitch) && Number.isFinite(yaw) && Number.isFinite(roll)) {
      out.angle = { pitch, yaw, roll };
    }
  }
  return out.world || out.angle ? out : null;
}

/**
 * Inverse for displaying back what we'd write to a setpos command.
 */
export function formatSetposCommand(world: WorldPoint | undefined, angle?: ThrowAngle): string {
  const parts: string[] = [];
  if (world) {
    const z = world.z !== undefined ? ` ${world.z}` : "";
    parts.push(`setpos ${world.x} ${world.y}${z}`);
  }
  if (angle) {
    parts.push(`setang ${angle.pitch} ${angle.yaw} ${angle.roll}`);
  }
  return parts.join(";");
}
