/**
 * Full-detail view for a single scenario: name + description on the
 * left, ScenarioMap on the right (or top on mobile), and a numbered
 * timeline at the bottom. Clicking a timeline row highlights the
 * matching marker pair on the map.
 *
 * Missing utilities (referenced ids that don't exist, or ones with no
 * landing data) are surfaced in a warning band — the spec says we do
 * NOT invent coords, so the user sees the gap explicitly.
 */
import { useMemo, useState } from "react";
import { T } from "../theme";
import { ScenarioMap, findMissingActions } from "./ScenarioMap";
import { UtilityIcon } from "./shared/UtilityIcon";
import type { MapConfig, Scenario, Utility } from "../types/map";

export interface ScenarioDetailProps {
  config: MapConfig;
  scenario: Scenario;
  utilities: Utility[];
  onBack: () => void;
}

interface TimelineRow {
  key: string;        // playerIdx-actionIdx
  order: number;
  playerLabel: string;
  playerColor: string;
  playerRole: string;
  utility: Utility | null;
  utilityIdRef: string;
  description?: string;
  timing?: string;
}

export function ScenarioDetail({ config, scenario, utilities, onBack }: ScenarioDetailProps) {
  const [highlight, setHighlight] = useState<string | null>(null);

  const utilIndex = useMemo(() => {
    const m = new Map<string, Utility>();
    for (const u of utilities) m.set(u.id, u);
    return m;
  }, [utilities]);

  const timeline: TimelineRow[] = useMemo(() => {
    const rows: TimelineRow[] = [];
    scenario.players.forEach((p, pi) => {
      p.actions.forEach((a, ai) => {
        rows.push({
          key: `${pi}-${ai}`,
          order: a.order,
          playerLabel: p.label,
          playerColor: p.color,
          playerRole: p.role,
          utility: utilIndex.get(a.utilityId) ?? null,
          utilityIdRef: a.utilityId,
          description: a.description,
          timing: a.timing,
        });
      });
    });
    return rows.sort((a, b) => a.order - b.order || a.key.localeCompare(b.key));
  }, [scenario, utilIndex]);

  const missing = useMemo(() => findMissingActions(scenario, utilities), [scenario, utilities]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            background: T.bgPanel,
            border: `1px solid ${T.borderLt}`,
            color: T.textSec,
            borderRadius: T.radiusSm,
            padding: "5px 10px",
            fontSize: 11,
            fontFamily: T.fontMono,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
        <h2 style={{ margin: 0, fontSize: 18, color: T.textPri }}>{scenario.name}</h2>
        <span
          style={{
            background: scenario.side === "T" ? T.tSideBg : T.ctSideBg,
            color: scenario.side === "T" ? T.tSide : T.ctSide,
            border: `1px solid ${scenario.side === "T" ? T.tSide : T.ctSide}55`,
            padding: "2px 6px",
            fontSize: 10,
            fontFamily: T.fontMono,
            fontWeight: 800,
            borderRadius: 3,
          }}
        >
          {scenario.side} · {scenario.targetArea}
        </span>
        <span style={{ fontSize: 10, color: T.textDim, fontFamily: T.fontMono, textTransform: "uppercase" }}>
          {scenario.difficulty} · {scenario.playerCount}-man
        </span>
      </div>

      {scenario.description && (
        <p style={{ margin: 0, color: T.textSec, fontSize: 13, lineHeight: 1.5 }}>{scenario.description}</p>
      )}

      {missing.length > 0 && (
        <div
          role="alert"
          style={{
            padding: 8,
            border: `1px solid ${T.danger}55`,
            background: T.bgPanel,
            borderRadius: T.radiusSm,
            color: T.danger,
            fontSize: 11,
            fontFamily: T.fontMono,
          }}
        >
          {missing.length} action(s) cannot render — utility data missing:
          <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
            {missing.map((m, i) => (
              <li key={i}>
                player {m.playerIdx + 1} action {m.actionIdx + 1}: {m.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 360px)",
          gap: 12,
          alignItems: "start",
        }}
      >
        <ScenarioMap
          config={config}
          scenario={scenario}
          utilities={utilities}
          highlightedActionKey={highlight}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <PlayerLegend scenario={scenario} />
          <h3 style={{ margin: 0, marginTop: 8, fontSize: 12, color: T.textDim, letterSpacing: 0.6, textTransform: "uppercase" }}>
            Timeline
          </h3>
          <ol
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {timeline.map((row) => (
              <TimelineRowItem
                key={row.key}
                row={row}
                highlighted={highlight === row.key}
                onHover={() => setHighlight(row.key)}
                onUnhover={() => setHighlight(null)}
              />
            ))}
          </ol>

          {scenario.notes && (
            <div
              style={{
                marginTop: 10,
                padding: 8,
                background: T.bgPanel,
                border: `1px solid ${T.borderLt}`,
                borderRadius: T.radiusSm,
                fontSize: 12,
                color: T.textSec,
                lineHeight: 1.5,
              }}
            >
              <div style={{ fontSize: 10, color: T.textDim, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>
                Notes
              </div>
              {scenario.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PlayerLegend({ scenario }: { scenario: Scenario }) {
  return (
    <div
      style={{
        background: T.bgPanel,
        border: `1px solid ${T.borderLt}`,
        borderRadius: T.radiusSm,
        padding: 8,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div style={{ fontSize: 10, color: T.textDim, letterSpacing: 0.6, textTransform: "uppercase" }}>Players</div>
      {scenario.players.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: p.color,
              border: `1px solid ${T.bgDeep}`,
              display: "inline-block",
            }}
          />
          <strong style={{ color: T.textPri }}>{p.label}</strong>
          <span style={{ color: T.textDim, fontFamily: T.fontMono, fontSize: 11 }}>{p.role}</span>
        </div>
      ))}
    </div>
  );
}

function TimelineRowItem({
  row,
  highlighted,
  onHover,
  onUnhover,
}: {
  row: TimelineRow;
  highlighted: boolean;
  onHover: () => void;
  onUnhover: () => void;
}) {
  return (
    <li
      onMouseEnter={onHover}
      onMouseLeave={onUnhover}
      onFocus={onHover}
      onBlur={onUnhover}
      tabIndex={0}
      style={{
        display: "grid",
        gridTemplateColumns: "auto auto 1fr auto",
        alignItems: "center",
        gap: 6,
        padding: "5px 8px",
        background: highlighted ? T.bgHover : T.bg,
        border: `1px solid ${highlighted ? row.playerColor + "88" : T.borderLt}`,
        borderRadius: T.radiusSm,
        fontSize: 12,
        cursor: "default",
      }}
    >
      <span
        style={{
          color: row.playerColor,
          fontFamily: T.fontMono,
          fontWeight: 800,
          fontSize: 11,
          minWidth: 14,
          textAlign: "right",
        }}
      >
        {row.order}.
      </span>
      <span
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: 999,
          background: row.playerColor,
        }}
      />
      <div style={{ minWidth: 0 }}>
        {row.utility ? (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <UtilityIcon type={row.utility.type} size={12} />
            <span style={{ color: T.textPri, fontWeight: 600 }}>{row.utility.name}</span>
          </div>
        ) : (
          <span style={{ color: T.danger, fontFamily: T.fontMono, fontSize: 11 }}>
            unknown utility: {row.utilityIdRef}
          </span>
        )}
        {(row.description || row.timing) && (
          <div style={{ color: T.textDim, fontSize: 11, lineHeight: 1.3 }}>
            {row.timing && <span style={{ color: T.textSec, fontFamily: T.fontMono, marginRight: 4 }}>{row.timing}</span>}
            {row.description}
          </div>
        )}
      </div>
      <span style={{ color: T.textDim, fontFamily: T.fontMono, fontSize: 10 }}>{row.playerLabel}</span>
    </li>
  );
}
