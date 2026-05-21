import { useMemo } from "react";
import type { PlayerSlot, Scenario } from "../data/types";
import { DUST2_LINEUPS_BY_ID } from "../data/dust2-lineups";
import { T, PLAYER_STYLE, UTIL_STYLE, THROW_STYLE } from "../lib/theme";
import { PlayerSlotPicker } from "./PlayerSlotPicker";

export interface ScenarioViewProps {
  scenario: Scenario;
  activePlayer: PlayerSlot | null;
  onActivePlayerChange: (p: PlayerSlot | null) => void;
  onClose: () => void;
  onExport?: () => void;
}

export function ScenarioView({
  scenario,
  activePlayer,
  onActivePlayerChange,
  onClose,
  onExport,
}: ScenarioViewProps) {
  const availablePlayers = useMemo(
    () => scenario.roles.map((r) => r.player) as PlayerSlot[],
    [scenario]
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(6,10,16,0.78)",
        zIndex: 50,
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
        padding: 16,
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={scenario.name}
        style={{
          background: T.bgDeep,
          border: `1px solid ${T.borderAlt}`,
          borderRadius: T.radiusLg,
          width: "100%",
          maxWidth: 1100,
          alignSelf: "flex-start",
          marginTop: 32,
          marginBottom: 32,
          color: T.textPri,
          display: "flex",
          flexDirection: "column",
          gap: 0,
          overflow: "hidden",
        }}
      >
        <header
          style={{
            padding: "18px 22px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "flex-start",
            gap: 16,
            flexWrap: "wrap",
            background: T.bgPanel,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 10,
                color: T.gold,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                fontFamily: T.fontMono,
              }}
            >
              Scenario · Site {scenario.site} · {scenario.playerCount}P
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>{scenario.name}</div>
            <div style={{ fontSize: 13, color: T.textSec, marginTop: 8, lineHeight: 1.5 }}>
              {scenario.description}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
              {scenario.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 10,
                    color: T.textDim,
                    background: T.bgHover,
                    padding: "2px 6px",
                    borderRadius: 3,
                    border: `1px solid ${T.border}`,
                    fontFamily: T.fontMono,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "transparent",
                border: `1px solid ${T.border}`,
                color: T.textDim,
                cursor: "pointer",
                padding: "4px 10px",
                fontSize: 12,
                borderRadius: T.radiusSm,
              }}
            >
              ✕ Close
            </button>
            <PlayerSlotPicker
              available={availablePlayers}
              active={activePlayer}
              onChange={onActivePlayerChange}
            />
            {onExport && (
              <button
                type="button"
                onClick={onExport}
                style={{
                  background: T.accentBg,
                  border: `1px solid ${T.accent}55`,
                  color: T.accent,
                  cursor: "pointer",
                  padding: "5px 11px",
                  fontSize: 11,
                  fontWeight: 700,
                  borderRadius: T.radiusSm,
                  letterSpacing: 0.3,
                  textTransform: "uppercase",
                }}
              >
                Export JSON
              </button>
            )}
          </div>
        </header>

        <div
          style={{
            padding: 22,
            display: "grid",
            gap: 14,
          }}
          className="scenario-roles"
          data-players={scenario.playerCount}
        >
          {scenario.roles.map((role) => {
            const style = PLAYER_STYLE[role.player];
            const dim = activePlayer && activePlayer !== role.player ? 0.45 : 1;
            return (
              <div
                key={role.player}
                style={{
                  border: `1px solid ${style.color}55`,
                  borderLeft: `4px solid ${style.color}`,
                  background: style.bg,
                  borderRadius: T.radius,
                  padding: 14,
                  opacity: dim,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: style.color,
                      color: "#001018",
                      fontWeight: 900,
                      fontSize: 14,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: T.fontMono,
                    }}
                  >
                    {role.player}
                  </span>
                  <div>
                    <div style={{ fontSize: 12, color: T.textDim, fontFamily: T.fontMono, letterSpacing: 0.5 }}>
                      Player {role.player}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.textPri }}>{role.role}</div>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: T.textSec,
                    lineHeight: 1.55,
                    background: T.bgInstr,
                    border: `1px solid ${T.border}`,
                    borderRadius: T.radiusSm,
                    padding: 10,
                    whiteSpace: "pre-line",
                  }}
                >
                  {role.instructions}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: T.textDim,
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                    }}
                  >
                    Lineups ({role.lineupIds.length})
                  </div>
                  {role.lineupIds.map((lid) => {
                    const l = DUST2_LINEUPS_BY_ID[lid];
                    if (!l) return null;
                    const util = UTIL_STYLE[l.type];
                    const throwInfo = THROW_STYLE[l.throwType];
                    return (
                      <div
                        key={lid}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "6px 8px",
                          background: T.bgPanel,
                          border: `1px solid ${T.borderLt}`,
                          borderLeft: `3px solid ${util.color}`,
                          borderRadius: T.radiusSm,
                        }}
                      >
                        <span style={{ color: util.color, fontSize: 16 }} aria-hidden>
                          {util.icon}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: T.textPri }}>
                            {l.name}
                          </div>
                          <div style={{ fontSize: 10, color: T.textDim }}>
                            {l.throwFrom} → {l.landsAt}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: util.color,
                            background: util.bg,
                            padding: "2px 5px",
                            borderRadius: 3,
                            border: `1px solid ${util.color}33`,
                            fontFamily: T.fontMono,
                            letterSpacing: 0.4,
                          }}
                        >
                          {throwInfo.short}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
