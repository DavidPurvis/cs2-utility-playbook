/**
 * The 2×2 walkthrough — the headline view for "how do I throw this lineup."
 *
 * Each lineup is decomposed into four chronological cards:
 *   1. Position — where to stand. Screenshot (if available) + setpos
 *      string + Copy button. Falls back to a radar crop centered on
 *      throwFrom.
 *   2. Aim     — crosshair alignment. Screenshot + description.
 *   3. Throw   — throw mechanics. throwStyle / movement / setang +
 *      steam:// deep-link to load the lineup in CS2 directly.
 *   4. Result  — where the utility lands. Screenshot + landing
 *      coordinate.
 *
 * The 2×2 grid stays 2×2 even on mobile (cards halved, not collapsed
 * vertically) per N5. CSS lives in index.html on `.walkthrough-grid`.
 *
 * Image dimensions are enforced via `aspect-ratio: 16/9` + `object-fit:
 * cover` so a mismatched-size screenshot doesn't ragger the layout.
 */
import { useMemo, type ReactNode } from "react";
import { Radar } from "./Radar";
import { CopyButton } from "./CopyButton";
import { worldToPercent } from "../utils/coordinates";
import { formatSetposCommand } from "../utils/parseSetposCommand";
import { formatSteamDeepLink } from "../utils/steamDeepLink";
import { T } from "../theme";
import type { CopyResult } from "./CopyButton";
import type { Lineup, MapConfig } from "../types";

const SLOT_LABEL: Record<"position" | "aim" | "throw" | "result", string> = {
  position: "1. Position",
  aim: "2. Aim",
  throw: "3. Throw",
  result: "4. Result",
};

const UTIL_COLOR: Record<Lineup["type"], string> = {
  smoke: T.utilSmoke,
  flash: T.utilFlash,
  molotov: T.utilMolly,
  he: T.utilHE,
};

export interface LineupDetailProps {
  lineup: Lineup;
  config: MapConfig;
  onBack: () => void;
  onCopy: (result: CopyResult, text: string) => void;
}

export function LineupDetail({ lineup, config, onBack, onCopy }: LineupDetailProps) {
  const setposString = useMemo(
    () => formatSetposCommand(lineup.throwFrom.world, lineup.throwAngle),
    [lineup.throwFrom.world, lineup.throwAngle]
  );
  const steamUrl = useMemo(
    () => formatSteamDeepLink(lineup.throwFrom.world, lineup.throwAngle),
    [lineup.throwFrom.world, lineup.throwAngle]
  );
  const color = UTIL_COLOR[lineup.type];

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          style={{
            background: T.bgPanel,
            border: `1px solid ${T.border}`,
            color: T.textSec,
            borderRadius: T.radiusSm,
            padding: "6px 12px",
            fontSize: 12,
            fontFamily: T.fontMono,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
        <h2 style={{ margin: 0, fontSize: 18, color: T.textPri }}>{lineup.name}</h2>
        <span
          style={{
            background: T.bgSubtle,
            color: color,
            border: `1px solid ${color}55`,
            fontSize: 11,
            fontFamily: T.fontMono,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 4,
          }}
        >
          {lineup.type.toUpperCase()} · {lineup.side} · {lineup.area}
        </span>
        <span style={{ color: T.textDim, fontFamily: T.fontMono, fontSize: 11 }}>
          {lineup.throwStyle} · {lineup.movement} · {lineup.difficulty}
          {lineup.airTimeSeconds !== undefined && ` · ${lineup.airTimeSeconds}s air`}
        </span>
      </div>

      <div className="walkthrough-grid">
        <CardPosition lineup={lineup} config={config} setposString={setposString} onCopy={onCopy} />
        <CardAim lineup={lineup} />
        <CardThrow lineup={lineup} steamUrl={steamUrl} setposString={setposString} onCopy={onCopy} />
        <CardResult lineup={lineup} config={config} />
      </div>

      {lineup.description && (
        <section
          style={{
            marginTop: 14,
            padding: 14,
            background: T.bgPanel,
            border: `1px solid ${T.border}`,
            borderRadius: T.radius,
            fontSize: 13,
            color: T.textSec,
            lineHeight: 1.55,
            whiteSpace: "pre-wrap",
          }}
        >
          <div style={{ fontSize: 10, color: T.textDim, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 6 }}>
            Notes
          </div>
          {lineup.description}
        </section>
      )}

      {lineup.source && (
        <div style={{ marginTop: 10, fontSize: 11, color: T.textDim, fontFamily: T.fontMono }}>
          Source:{" "}
          <a
            href={lineup.source.url}
            target="_blank"
            rel="noreferrer noopener"
            style={{ color: T.accentDk, textDecoration: "underline" }}
          >
            {lineup.source.name} ↗
          </a>
        </div>
      )}
    </div>
  );
}

// ── Cards ────────────────────────────────────────────────────────

function CardShell({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: ReactNode;
}) {
  return (
    <article
      style={{
        background: T.bgPanel,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          padding: "8px 12px",
          background: T.bgSubtle,
          borderBottom: `1px solid ${T.border}`,
          color: accent,
          fontSize: 11,
          fontFamily: T.fontMono,
          fontWeight: 800,
          letterSpacing: 0.6,
          textTransform: "uppercase",
        }}
      >
        {title}
      </header>
      <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
    </article>
  );
}

function CardImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      style={{
        width: "100%",
        aspectRatio: "16 / 9",
        objectFit: "cover",
        borderRadius: T.radiusSm,
        background: T.bgSubtle,
        display: "block",
      }}
    />
  );
}

function CardPosition({
  lineup,
  config,
  setposString,
  onCopy,
}: {
  lineup: Lineup;
  config: MapConfig;
  setposString: string;
  onCopy: (result: CopyResult, text: string) => void;
}) {
  const pos = lineup.screenshots?.position;
  return (
    <CardShell title={SLOT_LABEL.position} accent={T.textPri}>
      {pos ? (
        <CardImage src={pos} alt={`${lineup.name} — position`} />
      ) : (
        <PositionFallback lineup={lineup} config={config} />
      )}
      <code
        style={{
          fontFamily: T.fontMono,
          fontSize: 11,
          color: T.textSec,
          background: T.bgSubtle,
          padding: "6px 8px",
          borderRadius: T.radiusSm,
          wordBreak: "break-all",
        }}
      >
        {setposString}
      </code>
      <CopyButton text={setposString} label="Copy setpos" onResult={onCopy} />
    </CardShell>
  );
}

function PositionFallback({ lineup, config }: { lineup: Lineup; config: MapConfig }) {
  const pct = worldToPercent(lineup.throwFrom.world.x, lineup.throwFrom.world.y, config);
  return (
    <div data-testid="position-fallback" style={{ width: "100%", aspectRatio: "16 / 9" }}>
      <Radar config={config} ariaLabel={`Throw origin for ${lineup.name}`}>
        {() =>
          pct ? (
            <g transform={`translate(${pct.x}, ${pct.y})`}>
              <circle r={3.5} fill={T.accent} stroke="#FFFFFF" strokeWidth={0.5} />
              <circle r={1.4} fill="#FFFFFF" />
            </g>
          ) : null
        }
      </Radar>
    </div>
  );
}

function CardAim({ lineup }: { lineup: Lineup }) {
  const aim = lineup.screenshots?.aim;
  return (
    <CardShell title={SLOT_LABEL.aim} accent={T.textPri}>
      {aim ? (
        <CardImage src={aim} alt={`${lineup.name} — aim`} />
      ) : (
        <div
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            background: T.bgSubtle,
            borderRadius: T.radiusSm,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.textDim,
            fontSize: 12,
            fontFamily: T.fontMono,
            textAlign: "center",
            padding: 16,
          }}
        >
          No aim screenshot recorded yet — line up by description below.
        </div>
      )}
    </CardShell>
  );
}

function CardThrow({
  lineup,
  steamUrl,
  setposString,
  onCopy,
}: {
  lineup: Lineup;
  steamUrl: string;
  setposString: string;
  onCopy: (result: CopyResult, text: string) => void;
}) {
  const thr = lineup.screenshots?.throw;
  const setangText = lineup.throwAngle
    ? `setang ${lineup.throwAngle.pitch} ${lineup.throwAngle.yaw} ${lineup.throwAngle.roll}`
    : null;
  return (
    <CardShell title={SLOT_LABEL.throw} accent={T.textPri}>
      {thr ? (
        <CardImage src={thr} alt={`${lineup.name} — throw`} />
      ) : (
        <div
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            background: T.bgSubtle,
            borderRadius: T.radiusSm,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: T.textPri,
            fontFamily: T.fontMono,
            gap: 6,
            padding: 16,
            textAlign: "center",
          }}
        >
          <strong style={{ fontSize: 18 }}>{lineup.throwStyle.toUpperCase()}</strong>
          <span style={{ fontSize: 12, color: T.textDim }}>{lineup.movement}</span>
          {setangText && (
            <code style={{ fontSize: 11, color: T.textSec }}>{setangText}</code>
          )}
        </div>
      )}
      <a
        href={steamUrl}
        // Steam protocol — copy as fallback if click is blocked
        onContextMenu={async (e) => {
          e.preventDefault();
          try {
            await navigator.clipboard.writeText(steamUrl);
            onCopy("ok", steamUrl);
          } catch {
            onCopy("error", steamUrl);
          }
        }}
        style={{
          background: T.accentBg,
          color: T.accentDk,
          border: `1px solid ${T.accent}55`,
          borderRadius: T.radiusSm,
          padding: "6px 12px",
          fontSize: 11,
          fontFamily: T.fontMono,
          fontWeight: 700,
          cursor: "pointer",
          textDecoration: "none",
          textAlign: "center",
        }}
        aria-label="Open in CS2"
      >
        ▶ Open in CS2 (steam://)
      </a>
      <CopyButton text={setposString} label="Copy setpos+setang" onResult={onCopy} />
    </CardShell>
  );
}

function CardResult({ lineup, config }: { lineup: Lineup; config: MapConfig }) {
  const res = lineup.screenshots?.result;
  const landing = lineup.landingAt.world
    ? worldToPercent(lineup.landingAt.world.x, lineup.landingAt.world.y, config)
    : lineup.landingAt.percent ?? null;
  return (
    <CardShell title={SLOT_LABEL.result} accent={T.textPri}>
      {res ? (
        <CardImage src={res} alt={`${lineup.name} — result`} />
      ) : (
        <div data-testid="result-fallback" style={{ width: "100%", aspectRatio: "16 / 9" }}>
          <Radar config={config} ariaLabel={`Landing position for ${lineup.name}`}>
            {() =>
              landing ? (
                <g transform={`translate(${landing.x}, ${landing.y})`}>
                  <circle r={4} fill={UTIL_COLOR[lineup.type]} stroke="#FFFFFF" strokeWidth={0.5} />
                </g>
              ) : null
            }
          </Radar>
        </div>
      )}
      {landing && (
        <span style={{ fontSize: 11, color: T.textDim, fontFamily: T.fontMono }}>
          lands at {landing.x.toFixed(1)}%, {landing.y.toFixed(1)}% on radar
        </span>
      )}
    </CardShell>
  );
}
