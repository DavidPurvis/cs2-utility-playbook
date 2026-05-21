import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { BONUS_MAP_IDS, getMapLabel, getMapPool, MAP_LIST, PREMIER_MAP_IDS } from "./data/mapMeta.js";
import {
  deriveFilteredMapData,
  getCombinedHiddenLineupIds,
  getConfiguredHiddenLineupIds,
  sanitizeHiddenLineupOverridesByMap,
} from "./data/lineupFilters.js";
import { loadMapModule } from "./data/loadMapModule.js";
import { getRadarMetadata } from "./data/radarMetadata.js";
import { readJsonStorage, readStorage, writeJsonStorage, writeStorage } from "./lib/storage.js";
import { resolveHybridPoint } from "./lib/mapCoordinates.js";
import { MapDataContext, useMapData } from "./context/MapDataContext.jsx";
import { T, THROW, UTIL, ROUND_TYPES } from "./lib/theme.js";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import { SideToggle } from "./components/SideToggle.jsx";
import { TrainingView } from "./components/TrainingView.jsx";
import { ScreenshotGallery } from "./components/ScreenshotGallery.jsx";

const SELECTABLE_MAP_IDS = [...PREMIER_MAP_IDS, ...BONUS_MAP_IDS];
const HIDDEN_LINEUP_OVERRIDES_KEY = "cs2_hidden_lineup_overrides";

// ── BADGES ───────────────────────────────────────────────────────

function ThrowBadge({ type }) {
  const t = THROW[type];
  if (!t) return null;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      background: t.color + "14", border: `1px solid ${t.color}30`, color: t.color,
      borderRadius: T.radiusSm, padding: "2px 7px",
      fontSize: 10.5, fontWeight: 600, fontFamily: T.fontMono,
      letterSpacing: 0.4, lineHeight: 1.4,
    }}>{t.icon} {t.short}</span>
  );
}

function UtilBadge({ type }) {
  const u = UTIL[type];
  if (!u) return null;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12, fontWeight:600, color:u.color }}>
      <span style={{ fontSize: 14 }}>{u.icon}</span> {u.label}
    </span>
  );
}

function RoundTypeBadges({ types }) {
  if (!types || types.length === 0) return null;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, flexWrap:"wrap" }}>
      {types.map(rt => {
        const r = ROUND_TYPES[rt];
        if (!r) return null;
        return (
          <span key={rt} title={r.label}
            style={{ fontSize: 9.5, fontWeight: 700, color: r.color, background: r.color + "12",
              border: `1px solid ${r.color}30`, borderRadius: 3, padding: "1.5px 5px", letterSpacing: 0.6,
              fontFamily: T.fontMono }}>
            {r.short}
          </span>
        );
      })}
    </span>
  );
}

function MustStar({ size = 13 }) {
  return <span style={{ color: T.gold, fontSize: size, fontWeight: 800 }} title="Must learn">★</span>;
}

function SiteTag({ site, side }) {
  const c = side === "T" ? T.tSide : T.ctSide;
  return (
    <span style={{ fontSize: 9.5, fontWeight: 700, padding: "2px 6px", borderRadius: 3,
      background: c + "14", color: c, border: `1px solid ${c}30`,
      fontFamily: T.fontMono, letterSpacing: 0.6 }}>{site}</span>
  );
}

function SectionLabel({ children, color, style, nowrap }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, color: color || T.textDim,
      textTransform: "uppercase", letterSpacing: 1.8,
      fontFamily: T.fontUI,
      whiteSpace: nowrap ? "nowrap" : undefined,
      ...style,
    }}>{children}</div>
  );
}

// ── PRIMARY ACTION ───────────────────────────────────────────────

function PrimaryPractice({ onClick, size = "md", label = "PRACTICE" }) {
  const dims = {
    lg: { pad: "12px 18px", fs: 13 },
    md: { pad: "9px 14px",  fs: 12 },
    sm: { pad: "5px 11px",  fs: 11 },
  }[size];
  return (
    <button type="button" className="pa-btn-hov pa-row-cta"
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
      style={{
        background: T.accent, border: `1px solid ${T.accent}`,
        borderRadius: 6, color: "#001a14",
        fontSize: dims.fs, fontWeight: 700, letterSpacing: 0.6,
        padding: dims.pad, cursor: "pointer", whiteSpace: "nowrap",
        fontFamily: T.fontUI,
      }}>▶ {label}</button>
  );
}

function PracticePill({ onClick, label = "PRACTICE" }) {
  return (
    <button type="button" className="pa-row-cta pa-btn-hov"
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
      style={{
        background: "transparent", border: `1px solid ${T.borderLt}`,
        borderRadius: 6, color: T.textSec,
        fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6,
        padding: "5px 10px", cursor: "pointer", whiteSpace: "nowrap",
        fontFamily: T.fontUI,
      }}>▶ {label}</button>
  );
}

function GhostButton({ onClick, children, color, style }) {
  const c = color || T.textSec;
  return (
    <button type="button" className="pa-btn-hov" onClick={onClick}
      style={{
        background: "transparent", border: `1px solid ${T.borderAlt}`,
        borderRadius: 6, color: c, fontSize: 11.5, fontWeight: 600,
        padding: "7px 12px", cursor: "pointer", letterSpacing: 0.2,
        ...style,
      }}>{children}</button>
  );
}

// ── ACCORDION ────────────────────────────────────────────────────

function Accordion({ title, count, accent, defaultOpen, children, glyph, subtitle, rightSlot }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const ac = accent || T.accent;
  return (
    <div style={{
      background: T.bgPanel,
      border: `1px solid ${open ? ac + "33" : T.border}`,
      borderRadius: T.radiusLg, overflow: "hidden",
      transition: "border-color .14s ease",
    }}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          width: "100%", padding: "16px 18px",
          background: "transparent", border: "none", cursor: "pointer",
          color: T.textPri, gap: 12, textAlign: "left",
          fontFamily: T.fontUI,
        }}>
        <div style={{ display:"flex", alignItems:"center", gap: 12, minWidth: 0 }}>
          {glyph && <span style={{ fontSize: 18, color: ac, lineHeight: 1 }}>{glyph}</span>}
          <div style={{ minWidth: 0 }}>
            <div style={{ display:"flex", alignItems:"center", gap: 10, flexWrap:"wrap" }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: T.textPri, letterSpacing: -0.1 }}>{title}</span>
              {count != null && (
                <span style={{
                  fontSize: 10, fontWeight: 700, color: ac, background: ac + "14",
                  border: `1px solid ${ac}30`, borderRadius: 999,
                  padding: "1px 8px", fontFamily: T.fontMono, letterSpacing: 0.4,
                }}>{count}</span>
              )}
            </div>
            {subtitle && (
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 4, lineHeight: 1.4 }}>{subtitle}</div>
            )}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {rightSlot}
          <span style={{
            color: open ? ac : T.textFaint, fontSize: 12,
            transition: "transform .18s ease, color .14s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}>▾</span>
        </div>
      </button>
      {open && (
        <div style={{
          padding: "0 18px 18px",
          display: "flex", flexDirection: "column", gap: 10,
          borderTop: `1px solid ${T.border}`, paddingTop: 14,
        }}>{children}</div>
      )}
    </div>
  );
}

// ── MUST LEARN HERO ─────────────────────────────────────────────

function MustLearnHero({ side, onPractice, compact }) {
  const { LINEUPS, MUST_LEARN } = useMapData();
  const items = MUST_LEARN.map(id => LINEUPS[id]).filter(Boolean);
  return (
    <div style={{
      background: `linear-gradient(170deg, ${T.gold}10 0%, ${T.gold}03 50%, transparent 100%), ${T.bgPanel}`,
      border: `1px solid ${T.gold}33`, borderRadius: T.radiusLg, overflow: "hidden",
    }}>
      <div style={{ padding: compact ? "14px 16px 12px" : "16px 18px 14px", borderBottom: `1px solid ${T.gold}1a` }}>
        <div style={{ display:"flex", alignItems:"center", gap: 10 }}>
          <span style={{ color: T.gold, fontSize: compact ? 14 : 16 }}>★</span>
          <SectionLabel color={T.gold} nowrap>Must Learn · Core 5</SectionLabel>
        </div>
        {!compact && (
          <div style={{ fontSize: 12.5, color: T.textSec, marginTop: 6, lineHeight: 1.5 }}>
            Both sides, all sites. Learn these first.
          </div>
        )}
        {compact && (
          <div style={{ fontSize: 11.5, color: T.textDim, marginTop: 4 }}>
            Sticky reference · one tap to practice
          </div>
        )}
      </div>
      <div role="list">
        {items.map((L, i) => {
          const sideC = L.side === "T" ? T.tSide : T.ctSide;
          return (
            <div key={L.id} role="listitem" data-row tabIndex={0}
              onClick={() => onPractice(L.id)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPractice(L.id); } }}
              aria-label={`Practice ${L.name}`}
              style={{
                display: "flex", alignItems: "center",
                gap: compact ? 10 : 12,
                padding: compact ? "10px 16px" : "12px 18px",
                borderTop: i === 0 ? "none" : `1px solid ${T.border}`,
              }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, width: 28, flexShrink: 0 }}>
                <span style={{ fontSize: compact ? 16 : 20, color: UTIL[L.util]?.color, lineHeight: 1 }}>
                  {UTIL[L.util]?.icon}
                </span>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: sideC, letterSpacing: 0.8, fontFamily: T.fontMono }}>{L.side}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: compact ? 13 : 14, fontWeight: 600,
                  color: T.textPri, letterSpacing: -0.1,
                }}>{L.name}</div>
                <div style={{
                  fontSize: 11, color: T.textDim, marginTop: 3,
                  display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap",
                }}>
                  {!compact && <ThrowBadge type={L.throw} />}
                  <span>{L.area}</span>
                </div>
              </div>
              <PracticePill onClick={() => onPractice(L.id)} label={compact ? "▶" : "PRACTICE"} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── FILTER CHIPS ─────────────────────────────────────────────────

function FilterChips({ value, onChange }) {
  const opts = [
    { id: "ALL", label: "All", color: T.textPri },
    ...Object.entries(ROUND_TYPES).map(([k, v]) => ({ id: k, label: v.short, color: v.color })),
  ];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        <SectionLabel>Round filter</SectionLabel>
        <span style={{ fontSize: 10.5, color: T.textFaint, letterSpacing: 0 }}>
          affects Combos &amp; Belts
        </span>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {opts.map(o => {
          const active = value === o.id;
          return (
            <button key={o.id} type="button" className="pa-btn-hov"
              onClick={() => onChange(o.id)}
              style={{
                fontSize: 11, fontWeight: 600, padding: "5px 11px",
                background: active ? o.color + "18" : "transparent",
                color: active ? o.color : T.textSec,
                border: `1px solid ${active ? o.color + "55" : T.borderLt}`,
                borderRadius: 999, cursor: "pointer", letterSpacing: 0.5,
                fontFamily: o.id === "ALL" ? T.fontUI : T.fontMono,
              }}>{o.label}</button>
          );
        })}
      </div>
    </div>
  );
}

// ── COMBO CARD ───────────────────────────────────────────────────

function ComboCard({ combo, onPractice, onStepCombo }) {
  const { LINEUPS } = useMapData();
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: T.bgPanel,
      border: `1px solid ${open ? T.accent + "30" : T.border}`,
      borderRadius: T.radius, overflow: "hidden",
      transition: "border-color .14s ease",
    }}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{
          padding: "14px 16px", cursor: "pointer", width: "100%",
          background: "transparent", border: "none", textAlign: "left",
          color: T.textPri, fontFamily: T.fontUI,
        }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display:"flex", alignItems:"center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.textPri, letterSpacing: -0.1 }}>{combo.name}</div>
              <SiteTag site={combo.site} side={combo.side} />
              <RoundTypeBadges types={combo.roundTypes} />
            </div>
            <div style={{ fontSize: 12.5, color: T.textSec, marginTop: 5, lineHeight: 1.5 }}>{combo.desc}</div>
            <div style={{ display: "flex", gap: 4, marginTop: 8, alignItems: "center" }}>
              {combo.lineups.map((l, i) => {
                const u = UTIL[LINEUPS[l.lineup]?.util];
                return <span key={i} style={{ fontSize: 14, color: u?.color || T.textDim, lineHeight: 1 }}>{u?.icon || "·"}</span>;
              })}
              <span style={{ marginLeft: 6, fontSize: 10.5, color: T.textDim, letterSpacing: 0.3 }}>
                {combo.lineups.length} lineups
              </span>
            </div>
          </div>
          <span style={{
            color: open ? T.accent : T.textFaint, fontSize: 12, lineHeight: 1, paddingTop: 4,
            transition: "transform .18s ease, color .14s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}>▾</span>
        </div>
      </button>
      {open && (
        <div style={{
          padding: "14px 16px 16px",
          display: "flex", flexDirection: "column", gap: 10,
          borderTop: `1px solid ${T.border}`,
        }}>
          <div style={{ background: T.bgCallout, border: `1px solid ${T.accent}28`, borderRadius: 6, padding: "10px 12px" }}>
            <SectionLabel color={T.accent} style={{ marginBottom: 4 }}>Callout</SectionLabel>
            <div style={{ fontSize: 12.5, color: T.textCallout, lineHeight: 1.5, fontFamily: T.fontMono, letterSpacing: 0 }}>{combo.callout}</div>
          </div>
          <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, overflow: "hidden" }}>
            {combo.lineups.map((l, i) => {
              const L = LINEUPS[l.lineup];
              if (!L) return null;
              return (
                <div key={i} data-row tabIndex={0}
                  onClick={() => onPractice(l.lineup)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPractice(l.lineup); } }}
                  aria-label={`Practice ${L.name}`}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px",
                    borderBottom: i < combo.lineups.length - 1 ? `1px solid ${T.border}` : "none",
                  }}>
                  <span style={{ fontSize: 18, color: UTIL[L.util]?.color, lineHeight: 1, flexShrink: 0 }}>{UTIL[L.util]?.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.textPri,
                      display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", letterSpacing: -0.05 }}>
                      {L.name}
                      {L.mustLearn && <MustStar size={11} />}
                      <ThrowBadge type={L.throw} />
                    </div>
                    {l.who && <div style={{ fontSize: 11.5, color: T.textDim, marginTop: 3 }}>{l.who}</div>}
                  </div>
                  <PracticePill onClick={() => onPractice(l.lineup)} />
                </div>
              );
            })}
          </div>
          {combo.tip && (
            <div style={{ background: T.bgTip, border: `1px solid ${T.borderLt}`, borderRadius: 6, padding: "10px 12px" }}>
              <SectionLabel color={T.textTip} style={{ marginBottom: 4 }}>Tip</SectionLabel>
              <div style={{ fontSize: 12.5, color: T.textSec, lineHeight: 1.5 }}>{combo.tip}</div>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
            <PrimaryPractice onClick={() => onStepCombo(combo.id)} size="md" label="STEP THROUGH COMBO" />
          </div>
        </div>
      )}
    </div>
  );
}

// ── BELT CARD ────────────────────────────────────────────────────

function BeltCard({ belt, onPractice, onStepBelt, carrierName }) {
  const { LINEUPS } = useMapData();
  const [open, setOpen] = useState(false);
  const displayName = carrierName ? `${carrierName}'s ${belt.name.replace("Utility Belt", "Belt")}` : belt.name;
  const calloutText = belt.callout.replace("[Name]", carrierName || "Carrier");
  return (
    <div style={{
      background: T.bgPanel,
      border: `1px solid ${open ? T.gold + "33" : T.border}`,
      borderRadius: T.radius, overflow: "hidden",
      transition: "border-color .14s ease",
    }}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{
          padding: "14px 16px", cursor: "pointer", width: "100%",
          background: "transparent", border: "none", textAlign: "left",
          color: T.textPri, fontFamily: T.fontUI,
        }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display:"flex", alignItems:"center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 16, color: T.gold }}>◆</span>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.gold, letterSpacing: -0.1 }}>{displayName}</div>
              <SiteTag site={belt.site} side={belt.side} />
              <RoundTypeBadges types={belt.roundTypes} />
            </div>
            <div style={{ fontSize: 12.5, color: T.textSec, marginTop: 5, lineHeight: 1.5 }}>{belt.desc}</div>
          </div>
          <span style={{
            color: open ? T.gold : T.textFaint, fontSize: 12, lineHeight: 1, paddingTop: 4,
            transition: "transform .18s ease, color .14s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}>▾</span>
        </div>
      </button>
      {open && (
        <div style={{
          padding: "14px 16px 16px",
          display: "flex", flexDirection: "column", gap: 10,
          borderTop: `1px solid ${T.border}`,
        }}>
          <div style={{ background: T.gold + "0a", border: `1px solid ${T.gold}28`, borderRadius: 6, padding: "10px 12px" }}>
            <SectionLabel color={T.gold} style={{ marginBottom: 4 }}>Pre-Round Setup</SectionLabel>
            <div style={{ fontSize: 12.5, color: T.textGold, lineHeight: 1.5 }}>{belt.preRound}</div>
          </div>
          <div style={{ background: T.bgCallout, border: `1px solid ${T.accent}28`, borderRadius: 6, padding: "10px 12px" }}>
            <SectionLabel color={T.accent} style={{ marginBottom: 4 }}>Callout</SectionLabel>
            <div style={{ fontSize: 12.5, color: T.textCallout, lineHeight: 1.5, fontFamily: T.fontMono }}>{calloutText}</div>
          </div>
          <SectionLabel style={{ marginTop: 4 }}>Throw Order</SectionLabel>
          <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, overflow: "hidden" }}>
            {belt.sequence.map((s, i) => {
              const L = LINEUPS[s.lineup];
              if (!L) return null;
              const isCarrier = !s.carrier || s.carrier === "carrier";
              return (
                <div key={i} data-row tabIndex={0}
                  onClick={() => onPractice(s.lineup)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPractice(s.lineup); } }}
                  aria-label={`Practice ${L.name}`}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px",
                    borderBottom: i < belt.sequence.length - 1 ? `1px solid ${T.border}` : "none",
                    opacity: isCarrier ? 1 : 0.92,
                  }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: 12,
                    background: T.gold + "1a", color: T.gold,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, flexShrink: 0, fontFamily: T.fontMono,
                  }}>{s.step}</span>
                  <span style={{ fontSize: 18, color: UTIL[L.util]?.color, lineHeight: 1, flexShrink: 0 }}>{UTIL[L.util]?.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.textPri,
                      display:"flex", alignItems:"center", gap: 6, flexWrap: "wrap", letterSpacing: -0.05 }}>
                      {L.name}
                      <ThrowBadge type={L.throw} />
                      {!isCarrier && (
                        <span style={{ fontSize: 9.5, fontWeight: 700, color: T.austin,
                          background: T.austin + "14", border: `1px solid ${T.austin}38`,
                          borderRadius: 3, padding: "1.5px 5px", letterSpacing: 0.6, fontFamily: T.fontMono }}>2ND PLAYER</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11.5, color: T.textDim, marginTop: 3, lineHeight: 1.4 }}>{s.note}</div>
                  </div>
                  <PracticePill onClick={() => onPractice(s.lineup)} />
                </div>
              );
            })}
          </div>
          {belt.teamRole && (
            <div style={{ background: T.bgTip, border: `1px solid ${T.borderLt}`, borderRadius: 6, padding: "10px 12px" }}>
              <SectionLabel color={T.textTip} style={{ marginBottom: 4 }}>What Everyone Else Does</SectionLabel>
              <div style={{ fontSize: 12.5, color: T.textSec, lineHeight: 1.5 }}>{belt.teamRole}</div>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
            <PrimaryPractice onClick={() => onStepBelt(belt.id)} size="md" label="STEP THROUGH BELT" />
          </div>
        </div>
      )}
    </div>
  );
}

// ── SCENARIO CARD ────────────────────────────────────────────────

function ScenarioCard({ scenario }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: T.bgPanel,
      border: `1px solid ${open ? T.textTip + "33" : T.border}`,
      borderRadius: T.radius, overflow: "hidden",
      transition: "border-color .14s ease",
    }}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{
          padding: "12px 16px", cursor: "pointer", width: "100%",
          background: "transparent", border: "none", textAlign: "left",
          color: T.textPri, fontFamily: T.fontUI,
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <SiteTag site={scenario.side} side={scenario.side} />
          <div style={{ fontSize: 13.5, fontWeight: 600, color: T.textPri, letterSpacing: -0.05 }}>{scenario.title}</div>
        </div>
        <span style={{
          color: open ? T.textTip : T.textFaint, fontSize: 12,
          transition: "transform .18s ease, color .14s ease",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
        }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: "12px 16px 16px", borderTop: `1px solid ${T.border}` }}>
          <ul style={{ margin: 0, paddingLeft: 18, color: T.textSec, fontSize: 12.5, lineHeight: 1.65 }}>
            {scenario.bullets.map((b, i) => <li key={i} style={{ marginTop: 6 }}>{b}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── ALL LINEUPS PANEL ───────────────────────────────────────────

function AllLineupsPanel({ side, onPractice }) {
  const { LINEUPS } = useMapData();
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const all = Object.values(LINEUPS).filter(L => L.side === side);
    const needle = q.trim().toLowerCase();
    if (!needle) return all;
    return all.filter(L =>
      L.name.toLowerCase().includes(needle) ||
      (L.area || "").toLowerCase().includes(needle) ||
      (L.purpose || "").toLowerCase().includes(needle)
    );
  }, [LINEUPS, side, q]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ position: "relative" }}>
        <input type="text" placeholder="Search by name, area, or purpose…"
          value={q} onChange={e => setQ(e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box",
            background: T.bg, border: `1px solid ${T.borderLt}`, borderRadius: T.radiusSm,
            color: T.textPri, fontSize: 13, padding: "10px 12px 10px 34px",
            fontFamily: T.fontUI, outline: "none",
            transition: "border-color .14s ease",
          }}
          onFocus={e => e.target.style.borderColor = T.accent + "60"}
          onBlur={e => e.target.style.borderColor = T.borderLt}
        />
        <span style={{ position: "absolute", left: 12, top: 10, color: T.textDim, fontSize: 13, fontFamily: T.fontMono }}>⌕</span>
        {q && (
          <button type="button" onClick={() => setQ("")} style={{
            position: "absolute", right: 8, top: 8, background: "transparent", border: "none",
            color: T.textDim, fontSize: 14, cursor: "pointer", padding: 4,
          }}>✕</button>
        )}
      </div>
      <SectionLabel>{list.length} lineup{list.length === 1 ? "" : "s"} · {side} side</SectionLabel>
      <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, overflow: "hidden" }}>
        {list.map((L, i) => (
          <div key={L.id} data-row tabIndex={0}
            onClick={() => onPractice(L.id)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPractice(L.id); } }}
            aria-label={`Practice ${L.name}`}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px",
              borderBottom: i < list.length - 1 ? `1px solid ${T.border}` : "none",
            }}>
            <span style={{ fontSize: 18, color: UTIL[L.util]?.color, lineHeight: 1, flexShrink: 0 }}>{UTIL[L.util]?.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.textPri,
                display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", letterSpacing: -0.05 }}>
                {L.name}
                {L.mustLearn && <MustStar size={11} />}
                <ThrowBadge type={L.throw} />
              </div>
              <div style={{ fontSize: 11.5, color: T.textDim, marginTop: 3 }}>{L.area}</div>
            </div>
            <PracticePill onClick={() => onPractice(L.id)} />
          </div>
        ))}
        {list.length === 0 && (
          <div style={{ padding: "20px 14px", textAlign: "center", color: T.textDim, fontSize: 12.5 }}>
            No lineups match &quot;{q}&quot;.{" "}
            <button type="button" onClick={() => setQ("")} style={{
              background: "transparent", border: "none", color: T.accent, cursor: "pointer", fontSize: 12.5, fontWeight: 600,
              padding: 0, marginLeft: 4,
            }}>Clear search →</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── PRACTICE MODAL (multi-lineup) ────────────────────────────────

function PracticeModal({ context, onClose }) {
  const { LINEUPS } = useMapData();
  const [stepIdx, setStepIdx] = useState(0);
  const [lineupIdx, setLineupIdx] = useState(context.currentIdx ?? 0);
  const [imgFailed, setImgFailed] = useState(false);
  const validIds = useMemo(() => {
    const ids = Array.isArray(context.ids) ? context.ids : [];
    return ids.filter((lineupId) => Boolean(LINEUPS[lineupId]));
  }, [context.ids, LINEUPS]);

  useEffect(() => { setStepIdx(0); setImgFailed(false); }, [lineupIdx]);
  useEffect(() => { setImgFailed(false); }, [stepIdx]);
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  useEffect(() => {
    if (lineupIdx < validIds.length) return;
    setLineupIdx(validIds.length > 0 ? validIds.length - 1 : 0);
  }, [lineupIdx, validIds.length]);
  useEffect(() => {
    if (validIds.length === 0) onClose();
  }, [validIds.length, onClose]);

  const id = validIds[lineupIdx];
  const L = LINEUPS[id];
  if (!L) return null;

  const steps = [
    { title: "Stand here", body: L.stand, img: L.screenshots?.stand },
    { title: "Aim here",   body: L.aim,   img: L.screenshots?.aim },
    { title: `Throw — ${THROW[L.throw]?.label || L.throw}`, body: L.notes || "Throw it.", throwType: L.throw, img: L.screenshots?.result },
  ];
  const cur = steps[stepIdx];
  const lastStep = stepIdx === steps.length - 1;
  const lastLineup = lineupIdx === validIds.length - 1;
  const showNextLineup = context.type !== "single" && lastStep && !lastLineup;
  const ctxLabel = context.type === "combo" ? "COMBO" : context.type === "belt" ? "BELT" : "PRACTICE";

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "#000c", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}>
      <div onClick={(e) => e.stopPropagation()} className="pa-modal" style={{
        background: T.bgPanel, border: `1px solid ${T.borderAlt}`, borderRadius: T.radiusLg,
        width: "100%", maxHeight: "90vh", overflow: "auto",
        boxShadow: "0 24px 80px #000a, 0 0 0 1px " + T.borderAlt }}>

        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <SectionLabel color={T.accent}>
              {ctxLabel} {context.type !== "single" && `· ${lineupIdx + 1} of ${validIds.length}`}
            </SectionLabel>
            <div style={{ fontSize: 17, fontWeight: 700, color: T.textPri, marginTop: 4, letterSpacing: -0.2 }}>{L.name}</div>
            {context.type !== "single" && context.title && (
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 3 }}>{context.title}</div>
            )}
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: T.textDim,
            fontSize: 22, cursor: "pointer", padding: 4, lineHeight: 1, borderRadius: 4 }}>✕</button>
        </div>

        <div style={{ padding: 20 }}>
          {context.type !== "single" && (
            <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
              {validIds.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 4,
                  background: i <= lineupIdx ? T.accent : T.border,
                  borderRadius: 2, opacity: i <= lineupIdx ? 1 : 0.45,
                  transition: "background .18s ease",
                }} />
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
            {steps.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3,
                background: i <= stepIdx ? T.accent : T.border, borderRadius: 2,
                transition: "background .18s ease" }} />
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, color: T.textDim, fontFamily: T.fontMono,
              width: 22, height: 22, display: "inline-flex", alignItems: "center", justifyContent: "center",
              background: T.bgHover, border: `1px solid ${T.border}`, borderRadius: 4,
            }}>{stepIdx + 1}</span>
            <div style={{ fontSize: 17, fontWeight: 700, color: T.textPri, letterSpacing: -0.2 }}>{cur.title}</div>
          </div>

          {cur.throwType && <div style={{ marginBottom: 12 }}><ThrowBadge type={cur.throwType} /></div>}

          {cur.img && !imgFailed ? (
            <div style={{ marginBottom: 14, borderRadius: 8, overflow: "hidden", border: `1px solid ${T.borderAlt}`, background: T.bgDeep }}>
              <img src={cur.img} alt={cur.title} style={{ width: "100%", display: "block" }}
                onError={() => setImgFailed(true)} />
            </div>
          ) : cur.img && imgFailed ? (
            <div style={{ marginBottom: 14, borderRadius: 8, border: `1px dashed ${T.danger}66`, background: T.bgDeep, padding: "20px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: T.danger }}>Screenshot failed to load</div>
              {L.video && (
                <a href={L.video} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 10, fontWeight: 700, color: T.danger, textDecoration: "none", marginTop: 6, display: "inline-block" }}>
                  ▶ Watch video instead
                </a>
              )}
            </div>
          ) : (
            <div style={{ marginBottom: 14, borderRadius: 8, border: `1px dashed ${T.borderAlt}`,
              background: T.bgDeep, padding: "28px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 24, opacity: 0.3 }}>◐</div>
              <div style={{ fontSize: 11.5, color: T.textDim, marginTop: 6 }}>No screenshot yet</div>
              {L.video && (
                <a href={L.video} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 10, fontWeight: 700, color: T.accent, textDecoration: "none", marginTop: 6, display: "inline-block" }}>
                  ▶ Watch video instead
                </a>
              )}
            </div>
          )}

          <div style={{ fontSize: 14, color: T.textPri, lineHeight: 1.6, padding: "12px 14px",
            background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
            {cur.body}
          </div>

          {lastStep && (L.video || L.source) && (
            <div style={{ marginTop: 10 }}>
              <ScreenshotGallery screenshots={{}} source={L.source} video={L.video} austincs={L.austincs} lineup={L} />
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button type="button" className="pa-btn-hov"
              disabled={stepIdx === 0 && lineupIdx === 0}
              onClick={() => {
                if (stepIdx > 0) setStepIdx(stepIdx - 1);
                else if (lineupIdx > 0) { setLineupIdx(lineupIdx - 1); setStepIdx(2); }
              }}
              style={{ flex: 1, padding: "11px",
                background: (stepIdx === 0 && lineupIdx === 0) ? T.bg : T.bgHover,
                border: `1px solid ${T.borderLt}`, borderRadius: 6,
                color: (stepIdx === 0 && lineupIdx === 0) ? T.textFaint : T.textSec,
                fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: T.fontUI }}>
              ← Back
            </button>
            {!lastStep ? (
              <button type="button" className="pa-btn-hov"
                onClick={() => setStepIdx(stepIdx + 1)}
                style={{ flex: 1, padding: "11px",
                  background: T.accent, border: `1px solid ${T.accent}`,
                  borderRadius: 6, color: "#001a14", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  fontFamily: T.fontUI, letterSpacing: 0.3 }}>
                Next →
              </button>
            ) : showNextLineup ? (
              <button type="button" className="pa-btn-hov"
                onClick={() => setLineupIdx(lineupIdx + 1)}
                style={{ flex: 1, padding: "11px",
                  background: T.accent, border: `1px solid ${T.accent}`,
                  borderRadius: 6, color: "#001a14", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  fontFamily: T.fontUI, letterSpacing: 0.3 }}>
                Next lineup →
              </button>
            ) : (
              <button type="button" className="pa-btn-hov"
                onClick={onClose}
                style={{ flex: 1, padding: "11px",
                  background: T.accent, border: `1px solid ${T.accent}`,
                  borderRadius: 6, color: "#001a14", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  fontFamily: T.fontUI, letterSpacing: 0.3 }}>
                Done ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAP SHEET ────────────────────────────────────────────────────

function MapSheet({ open, onClose, current, onPick }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 900,
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: T.bgPanel, border: `1px solid ${T.borderAlt}`,
        borderTopLeftRadius: 16, borderTopRightRadius: 16,
        width: "100%", maxWidth: 720, padding: "16px 18px 28px",
        boxShadow: "0 -24px 80px #000a",
      }}>
        <div style={{ width: 40, height: 4, background: T.borderAlt, borderRadius: 2,
          margin: "2px auto 14px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <SectionLabel>Switch map</SectionLabel>
          <button onClick={onClose} style={{ background: "transparent", border: "none",
            color: T.textDim, fontSize: 18, cursor: "pointer", padding: 4 }}>✕</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
          {MAP_LIST.filter(m => getMapPool(m.id) === "premier").map(m => {
            const active = m.id === current;
            return (
              <button key={m.id} type="button" className="pa-btn-hov"
                onClick={() => onPick(m.id)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4,
                  background: active ? T.accent + "12" : T.bgHover,
                  border: `1px solid ${active ? T.accent + "55" : T.borderLt}`,
                  borderRadius: T.radius, padding: "14px 16px", cursor: "pointer",
                  fontFamily: T.fontUI,
                }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: active ? T.accent : T.textPri, letterSpacing: -0.1 }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 10.5, color: T.textDim, letterSpacing: 0.8, textTransform: "uppercase", fontFamily: T.fontMono }}>
                  Premier
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 16 }}><SectionLabel>Bonus</SectionLabel></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8, marginTop: 8 }}>
          {MAP_LIST.filter(m => getMapPool(m.id) === "bonus").map(m => (
            <button key={m.id} type="button" className="pa-btn-hov"
              onClick={() => onPick(m.id)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4,
                background: T.bgHover, border: `1px dashed ${T.borderLt}`,
                borderRadius: T.radius, padding: "14px 16px", cursor: "pointer",
                fontFamily: T.fontUI,
              }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.textPri, letterSpacing: -0.1 }}>{m.label}</div>
              <div style={{ fontSize: 10.5, color: T.textDim, letterSpacing: 0.8, textTransform: "uppercase", fontFamily: T.fontMono }}>
                Bonus
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TOAST ────────────────────────────────────────────────────────

function Toast({ msg, onDone }) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [msg, onDone]);
  if (!msg) return null;
  return (
    <div className="pa-toast" role="status" style={{
      position: "fixed", left: "50%", top: 76, transform: "translateX(-50%)",
      background: T.bgPanel, border: `1px solid ${T.accent}45`,
      color: T.accent, fontSize: 12, fontWeight: 600, letterSpacing: 0.3,
      padding: "9px 16px", borderRadius: 999, zIndex: 1100,
      boxShadow: "0 8px 24px #000c, 0 0 0 1px " + T.borderAlt,
      fontFamily: T.fontUI,
    }}>{msg}</div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  INTERACTIVE MAP — real radar with position dots + landing markers
// ══════════════════════════════════════════════════════════════════

function dominantUtil(pos, LINEUPS) {
  const counts = {};
  for (const id of pos.lineups) {
    const u = LINEUPS[id]?.util;
    if (u) counts[u] = (counts[u] || 0) + 1;
  }
  let best = null, max = 0;
  for (const [k, v] of Object.entries(counts)) {
    if (v > max) { best = k; max = v; }
  }
  return best;
}

function InteractiveMap({ mapId, side, onPractice }) {
  const mapData = useMapData();
  const { LINEUPS, SETUP_POSITIONS, RADAR_URL, MAP_NAME } = mapData;
  const [selectedPos, setSelectedPos] = useState(null);
  const [hoveredLineup, setHoveredLineup] = useState(null);
  const [selectedSpawn, setSelectedSpawn] = useState(null);
  const [mapMode, setMapMode] = useState("positions");
  const mapMeta = useMemo(() => getRadarMetadata(mapId), [mapId]);
  const resolvePoint = useCallback((point) => resolveHybridPoint(point, mapMeta), [mapMeta]);

  const svgKeyHandler = useCallback((onClick) => (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); }
  }, []);

  useEffect(() => { setSelectedPos(null); setSelectedSpawn(null); }, [MAP_NAME]);

  const spawns = useMemo(
    () => (mapData.SPAWNS?.[side] || [])
      .map((sp) => {
        const plotPos = resolvePoint(sp.pos);
        return plotPos ? { ...sp, plotPos } : null;
      })
      .filter(Boolean),
    [side, mapData.SPAWNS, resolvePoint]
  );
  const positions = useMemo(
    () => SETUP_POSITIONS
      .filter((p) => p.side === side)
      .map((p) => {
        const plotPos = resolvePoint(p.pos);
        return plotPos ? { ...p, plotPos } : null;
      })
      .filter(Boolean),
    [side, SETUP_POSITIONS, resolvePoint]
  );
  const selected = positions.find((p) => p.id === selectedPos) || null;
  const activeSpawn = spawns.find((s) => s.id === selectedSpawn) || null;

  const spawnLineups = useMemo(() => {
    if (!activeSpawn) return [];
    return activeSpawn.lineups.map((id) => LINEUPS[id]).filter(Boolean);
  }, [activeSpawn, LINEUPS]);

  const selectedLineups = useMemo(() => {
    if (!selected) return [];
    return selected.lineups.map((id) => LINEUPS[id]).filter(Boolean);
  }, [selected, LINEUPS]);

  const dominantByPosId = useMemo(() => {
    const out = {};
    for (const pos of positions) out[pos.id] = dominantUtil(pos, LINEUPS);
    return out;
  }, [positions, LINEUPS]);

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[
          { id: "positions", label: "Setup Positions" },
          { id: "spawns",    label: "Spawn Instant Utility" },
        ].map(m => {
          const active = mapMode === m.id;
          return (
            <button key={m.id} type="button" className="pa-btn-hov"
              onClick={() => { setMapMode(m.id); setSelectedPos(null); setSelectedSpawn(null); setHoveredLineup(null); }}
              style={{
                flex: 1, padding: "9px 12px", fontSize: 12, fontWeight: 600,
                background: active ? T.accent + "14" : T.bgHover,
                border: `1px solid ${active ? T.accent + "55" : T.borderLt}`,
                borderRadius: 6,
                color: active ? T.accent : T.textSec,
                cursor: "pointer", letterSpacing: 0.2, fontFamily: T.fontUI,
              }}>{m.label}</button>
          );
        })}
      </div>

      {mapMode === "spawns" && spawns.length > 0 && (
        <div style={{ display:"flex", gap:4, marginBottom:10, flexWrap:"wrap" }}>
          {spawns.map((sp) => {
            const active = selectedSpawn === sp.id;
            const hasLineups = sp.lineups.length > 0;
            return (
              <button key={sp.id} className="pa-btn-hov"
                onClick={() => { setSelectedSpawn(active ? null : sp.id); setHoveredLineup(null); }}
                style={{
                  flex:"1 1 auto", padding:"6px 10px", fontSize:10, fontWeight:700, cursor:"pointer",
                  background: active ? T.accent+"20" : T.bgPanel,
                  border: `1px solid ${active ? T.accent+"60" : hasLineups ? T.accent+"25" : T.borderLt}`,
                  borderRadius:T.radiusSm,
                  color: active ? T.accent : hasLineups ? T.textPri : T.textDim,
                  opacity: hasLineups || active ? 1 : 0.5,
                }}>
                {sp.name}
                {hasLineups && <span style={{ marginLeft:4, fontSize:9, color:T.accent }}>{sp.lineups.length}</span>}
              </button>
            );
          })}
        </div>
      )}

      <div style={{ borderRadius: T.radius, overflow: "hidden", border: `1px solid ${T.borderAlt}`, position: "relative", background: T.bgDeep, lineHeight: 0 }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" role="img"
          aria-label={`${MAP_NAME} radar`}
          style={{ width: "100%", height: "auto", display: "block", verticalAlign: "top", aspectRatio: "1" }}>
          {RADAR_URL ? (
            <image href={RADAR_URL} x={0} y={0} width={100} height={100}
              preserveAspectRatio="xMidYMid meet"
              opacity={selected || activeSpawn ? 0.6 : 0.85} />
          ) : (
            <>
              <rect x={0} y={0} width={100} height={100} fill={T.bgDeep} />
              <text x={50} y={50} textAnchor="middle" dominantBaseline="middle"
                fontSize={3} fill={T.textDim} fontFamily={T.fontMono}>
                {`Radar image not available — ${MAP_NAME}`}
              </text>
            </>
          )}

          {mapMode === "spawns" && spawns.map((sp) => {
            const isActive = selectedSpawn === sp.id;
            const hasLineups = sp.lineups.length > 0;
            const spawnX = sp.plotPos.x;
            const spawnY = sp.plotPos.y;
            return (
              <g key={`spawn-${sp.id}`}>
                {isActive && (
                  <circle cx={spawnX} cy={spawnY} r={4}
                    fill="none" stroke={T.accent} strokeWidth={0.4} opacity={0.6}>
                    <animate attributeName="r" from="3" to="6" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle cx={spawnX} cy={spawnY}
                  r={isActive ? 2.8 : 2}
                  fill={isActive ? T.accent : hasLineups ? T.gold : T.textDim}
                  opacity={isActive ? 0.95 : hasLineups ? 0.8 : 0.4}
                  stroke="#000" strokeWidth={0.3}
                  role="button" tabIndex={0} aria-label={sp.name}
                  style={{ cursor:"pointer", pointerEvents:"all", outline:"none" }}
                  onClick={() => { setSelectedSpawn(isActive ? null : sp.id); setHoveredLineup(null); }}
                  onKeyDown={svgKeyHandler(() => { setSelectedSpawn(isActive ? null : sp.id); setHoveredLineup(null); })}
                />
                {!isActive && hasLineups && (
                  <text x={spawnX} y={spawnY + 0.6}
                    textAnchor="middle" fill="#000" fontSize="1.8" fontWeight="900"
                    style={{ pointerEvents:"none" }}>
                    {sp.lineups.length}
                  </text>
                )}
              </g>
            );
          })}

          {mapMode === "spawns" && activeSpawn && spawnLineups.map((L) => {
            const targetPos = resolvePoint(L.radarTarget);
            if (!targetPos) return null;
            const isHovered = hoveredLineup === L.id;
            const color = UTIL[L.util]?.color || "#888";
            return (
              <g key={`spawnline-${L.id}`}>
                <line x1={activeSpawn.plotPos.x} y1={activeSpawn.plotPos.y}
                  x2={targetPos.x} y2={targetPos.y}
                  stroke={color} strokeWidth={isHovered ? 0.6 : 0.35}
                  strokeDasharray={isHovered ? "none" : "1.2,0.8"}
                  opacity={isHovered ? 0.9 : 0.5} />
                <circle cx={targetPos.x} cy={targetPos.y}
                  r={isHovered ? 2.5 : 1.8}
                  fill={color} opacity={isHovered ? 1 : 0.7}
                  stroke="#000" strokeWidth={0.3}
                  role="button" tabIndex={0} aria-label={L.name}
                  style={{ cursor:"pointer", pointerEvents:"all", outline:"none" }}
                  onClick={() => onPractice(L.id)}
                  onKeyDown={svgKeyHandler(() => onPractice(L.id))}
                  onMouseEnter={() => setHoveredLineup(L.id)}
                  onMouseLeave={() => setHoveredLineup(null)}
                  onFocus={() => setHoveredLineup(L.id)}
                  onBlur={() => setHoveredLineup(null)} />
                {isHovered && (
                  <text x={targetPos.x} y={targetPos.y - 3}
                    textAnchor="middle" fill="#fff" fontSize="2.2" fontWeight="700"
                    style={{ pointerEvents:"none" }}>
                    {L.name}
                  </text>
                )}
              </g>
            );
          })}

          {mapMode === "positions" && selected && selectedLineups.map((L) => {
            const targetPos = resolvePoint(L.radarTarget);
            if (!targetPos) return null;
            const isHovered = hoveredLineup === L.id;
            const color = UTIL[L.util]?.color || "#888";
            const throwPos = resolvePoint(L.radarPos);
            const lineStart = throwPos || selected.plotPos;
            if (!lineStart) return null;
            return (
              <g key={`line-${L.id}`}>
                {throwPos && isHovered && (
                  <circle cx={throwPos.x} cy={throwPos.y} r={1.4}
                    fill="#ffffff" opacity={0.85}
                    stroke={color} strokeWidth={0.35}
                    style={{ pointerEvents:"none" }} />
                )}
                <line x1={lineStart.x} y1={lineStart.y}
                  x2={targetPos.x} y2={targetPos.y}
                  stroke={color} strokeWidth={isHovered ? 0.6 : 0.35}
                  strokeDasharray={isHovered ? "none" : "1.2,0.8"}
                  opacity={isHovered ? 0.9 : 0.5} />
                <circle cx={targetPos.x} cy={targetPos.y}
                  r={isHovered ? 2.5 : 1.8}
                  fill={color} opacity={isHovered ? 1 : 0.7}
                  stroke="#000" strokeWidth={0.3}
                  role="button" tabIndex={0} aria-label={L.name}
                  style={{ cursor:"pointer", pointerEvents:"all", outline:"none" }}
                  onClick={() => onPractice(L.id)}
                  onKeyDown={svgKeyHandler(() => onPractice(L.id))}
                  onMouseEnter={() => setHoveredLineup(L.id)}
                  onMouseLeave={() => setHoveredLineup(null)}
                  onFocus={() => setHoveredLineup(L.id)}
                  onBlur={() => setHoveredLineup(null)} />
                {isHovered && (
                  <text x={targetPos.x} y={targetPos.y - 3}
                    textAnchor="middle" fill="#fff" fontSize="2.2" fontWeight="700"
                    style={{ pointerEvents:"none" }}>
                    {L.name}
                  </text>
                )}
              </g>
            );
          })}

          {mapMode === "positions" && positions.map((pos) => {
            const isSelected = selectedPos === pos.id;
            const util = dominantByPosId[pos.id];
            const color = util ? (UTIL[util]?.color || T.textDim) : T.textDim;
            const hasMustLearn = pos.lineups.some((id) => LINEUPS[id]?.mustLearn);
            const posX = pos.plotPos.x;
            const posY = pos.plotPos.y;
            if (isSelected) {
              return (
                <g key={pos.id}>
                  <circle cx={posX} cy={posY} r={4}
                    fill="none" stroke={T.accent} strokeWidth={0.4} opacity={0.6}>
                    <animate attributeName="r" from="3" to="5" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={posX} cy={posY} r={2.8}
                    fill={T.accent} opacity={0.9}
                    stroke="#000" strokeWidth={0.4}
                    role="button" tabIndex={0} aria-label={`Deselect ${pos.name}`}
                    style={{ cursor:"pointer", pointerEvents:"all", outline:"none" }}
                    onClick={() => setSelectedPos(null)}
                    onKeyDown={svgKeyHandler(() => setSelectedPos(null))} />
                  <text x={posX} y={posY + 0.7}
                    textAnchor="middle" fill="#000" fontSize="2.2" fontWeight="900"
                    style={{ pointerEvents:"none" }}>
                    {pos.lineups.length}
                  </text>
                </g>
              );
            }
            return (
              <g key={pos.id} role="button" tabIndex={0} aria-label={pos.name}
                style={{ cursor:"pointer", pointerEvents:"all", outline:"none" }}
                onClick={() => { setSelectedPos(pos.id); setHoveredLineup(null); }}
                onKeyDown={svgKeyHandler(() => { setSelectedPos(pos.id); setHoveredLineup(null); })}>
                {hasMustLearn && (
                  <circle cx={posX} cy={posY} r={3.8}
                    fill="none" stroke={T.gold} strokeWidth={0.4} opacity={0.6} />
                )}
                <circle cx={posX} cy={posY} r={2.4}
                  fill={color} opacity={0.85} stroke="#000" strokeWidth={0.3} />
                <text x={posX} y={posY + 0.7}
                  textAnchor="middle" fill="#000" fontSize="2" fontWeight="900"
                  style={{ pointerEvents:"none" }}>
                  {pos.lineups.length}
                </text>
              </g>
            );
          })}
        </svg>

        <div style={{ position:"absolute", bottom:6, left:8, fontSize:9, fontWeight:700, color:"#ffffff55", background:"#00000088", padding:"2px 6px", borderRadius:3 }}>
          {mapMode === "spawns"
            ? (activeSpawn ? `${activeSpawn.name} — ${spawnLineups.length} instant lineup${spawnLineups.length !== 1 ? "s" : ""}` : "Select a spawn to see instant utility")
            : (selected ? `${selected.name}` : "Click a position to see available lineups")}
        </div>
        {(selected || activeSpawn) && (
          <button onClick={() => { setSelectedPos(null); setSelectedSpawn(null); }}
            style={{ position:"absolute", top:8, right:8, background:"#000a", border:`1px solid ${T.borderAlt}`, borderRadius:4, color:T.textSec, fontSize:10, fontWeight:700, padding:"4px 8px", cursor:"pointer" }}>
            ✕ Clear
          </button>
        )}
      </div>

      {mapMode === "spawns" && activeSpawn && (
        <div style={{ marginTop:10, background:T.bgPanel, border:`1px solid ${T.accent}30`, borderRadius:T.radius, overflow:"hidden" }}>
          <div style={{ padding:"10px 14px", borderBottom:`1px solid ${T.border}` }}>
            <div style={{ fontSize:15, fontWeight:700, color:T.textPri }}>{activeSpawn.name}</div>
            <div style={{ fontSize:11, color:T.textSec, marginTop:2 }}>
              {spawnLineups.length} instant lineup{spawnLineups.length !== 1 ? "s" : ""} from this spawn
            </div>
          </div>
          {spawnLineups.length > 0 ? (
            <div style={{ background:T.bg }}>
              {spawnLineups.map((L) => (
                <div key={L.id} data-row tabIndex={0}
                  onClick={() => onPractice(L.id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPractice(L.id); } }}
                  onMouseEnter={() => setHoveredLineup(L.id)}
                  onMouseLeave={() => setHoveredLineup(null)}
                  style={{
                    display:"flex", alignItems:"center", gap:10,
                    padding:"10px 14px",
                    borderBottom:`1px solid ${T.border}`,
                    background: hoveredLineup === L.id ? T.bgHover : "transparent",
                    transition:"background 0.15s",
                  }}>
                  <span style={{ fontSize:18, color: UTIL[L.util]?.color, lineHeight: 1, flexShrink: 0 }}>{UTIL[L.util]?.icon}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:T.textPri, display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                      {L.name}
                      {L.mustLearn && <MustStar size={11} />}
                      <ThrowBadge type={L.throw} />
                      <span style={{ fontSize:9, fontWeight:700, color:T.gold, background:T.gold+"15", border:`1px solid ${T.gold}30`, borderRadius:3, padding:"1.5px 5px" }}>INSTANT</span>
                    </div>
                    <div style={{ fontSize:11, color:T.textDim, marginTop:2, lineHeight:1.4 }}>{L.purpose}</div>
                  </div>
                  <PracticePill onClick={() => onPractice(L.id)} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding:"16px 14px", textAlign:"center", color:T.textDim, fontSize:12 }}>
              No instant utility from this spawn yet.
            </div>
          )}
        </div>
      )}

      {mapMode === "positions" && selected && (
        <div style={{ marginTop:10, background:T.bgPanel, border:`1px solid ${T.accent}30`, borderRadius:T.radius, overflow:"hidden" }}>
          <div style={{ padding:"10px 14px", borderBottom:`1px solid ${T.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:T.textPri }}>{selected.name}</div>
                <div style={{ fontSize:11, color:T.textSec, marginTop:2 }}>
                  {selected.lineups.length} lineup{selected.lineups.length !== 1 ? "s" : ""} from this position
                </div>
              </div>
              <SiteTag site={selected.area} side={side} />
            </div>
            {selected.tip && (
              <div style={{ fontSize:11, color:T.textDim, marginTop:6, lineHeight:1.5, fontStyle:"italic" }}>{selected.tip}</div>
            )}
          </div>
          <div style={{ background:T.bg }}>
            {selectedLineups.map((L) => (
              <div key={L.id} data-row tabIndex={0}
                onClick={() => onPractice(L.id)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPractice(L.id); } }}
                onMouseEnter={() => setHoveredLineup(L.id)}
                onMouseLeave={() => setHoveredLineup(null)}
                style={{
                  display:"flex", alignItems:"center", gap:10,
                  padding:"10px 14px",
                  borderBottom:`1px solid ${T.border}`,
                  background: hoveredLineup === L.id ? T.bgHover : "transparent",
                  transition:"background 0.15s",
                }}>
                <span style={{ fontSize:18, color: UTIL[L.util]?.color, lineHeight: 1, flexShrink: 0 }}>{UTIL[L.util]?.icon}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:T.textPri, display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                    {L.name}
                    {L.mustLearn && <MustStar size={11} />}
                    <ThrowBadge type={L.throw} />
                    {L.instant && (
                      <span style={{ fontSize:9, fontWeight:700, color:T.gold, background:T.gold+"15", border:`1px solid ${T.gold}30`, borderRadius:3, padding:"1.5px 5px" }}>INSTANT</span>
                    )}
                  </div>
                  <div style={{ fontSize:11, color:T.textDim, marginTop:2, lineHeight:1.4 }}>{L.purpose}</div>
                </div>
                <PracticePill onClick={() => onPractice(L.id)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {mapMode === "positions" && !selected && (
        <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:6 }}>
          {positions.map((pos) => {
            const hasMustLearn = pos.lineups.some((id) => LINEUPS[id]?.mustLearn);
            return (
              <button key={pos.id} className="pa-btn-hov"
                onClick={() => setSelectedPos(pos.id)}
                style={{
                  flex:"1 1 140px", padding:"8px 10px",
                  background:T.bgPanel, border:`1px solid ${hasMustLearn ? T.gold+"40" : T.borderLt}`,
                  borderRadius:6, cursor:"pointer", textAlign:"left",
                }}>
                <div style={{ fontSize:12, fontWeight:700, color:T.textPri, display:"flex", alignItems:"center", gap:4 }}>
                  {hasMustLearn && <span style={{ color:T.gold, fontSize:10 }}>★</span>}
                  {pos.name}
                </div>
                <div style={{ fontSize:10, color:T.textDim, marginTop:2 }}>
                  {pos.lineups.length} lineup{pos.lineups.length !== 1 ? "s" : ""}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── MAP BLOCK — inline in Playbook ──────────────────────────────

function MapBlock({ mapId, side, onPractice }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{
      background: T.bgPanel,
      border: `1px solid ${T.accent}28`,
      borderRadius: T.radiusLg, overflow: "hidden",
    }}>
      <div style={{
        padding: "14px 18px", borderBottom: collapsed ? "none" : `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16, color: T.accent, lineHeight: 1 }}>▣</span>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.textPri, letterSpacing: -0.1 }}>
              Map · <span style={{ color: side === "T" ? T.tSide : T.ctSide }}>{side} side</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: T.textDim, marginTop: 4, lineHeight: 1.4 }}>
            Click any position or spawn dot for the lineups thrown from there.
          </div>
        </div>
        <button type="button" className="pa-btn-hov"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand map" : "Collapse map"}
          style={{
            background: "transparent", border: `1px solid ${T.borderLt}`,
            borderRadius: 6, color: T.textDim, cursor: "pointer",
            padding: "5px 10px", fontSize: 10.5, fontWeight: 600,
            fontFamily: T.fontMono, letterSpacing: 0.8,
          }}>{collapsed ? "SHOW" : "HIDE"}</button>
      </div>
      {!collapsed && (
        <div style={{ padding: 18 }}>
          <InteractiveMap mapId={mapId} side={side} onPractice={onPractice} />
        </div>
      )}
    </div>
  );
}

function SetPiecesDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10, marginBottom: 2 }}>
      <div style={{ flex: 1, height: 1, background: T.border }} />
      <span style={{
        fontSize: 10, fontWeight: 700, color: T.textDim,
        textTransform: "uppercase", letterSpacing: 2,
        fontFamily: T.fontUI,
      }}>Set Pieces</span>
      <div style={{ flex: 1, height: 1, background: T.border }} />
    </div>
  );
}

// ── EMPTY STATE ──────────────────────────────────────────────────

function EmptyState({ filter, kind, onResetFilter }) {
  const ftxt = ROUND_TYPES[filter]?.label || filter;
  return (
    <div style={{ background: T.bg, border: `1px dashed ${T.borderLt}`, borderRadius: 6,
      padding: "16px 14px", textAlign: "center" }}>
      <div style={{ fontSize: 13, color: T.textSec, marginTop: 4 }}>
        No {kind}s for <b style={{ color: T.textPri }}>{ftxt}</b> rounds on this side.
      </div>
      <button type="button" className="pa-btn-hov" onClick={onResetFilter}
        style={{
          marginTop: 10, background: T.accent + "15", border: `1px solid ${T.accent}40`,
          borderRadius: T.radiusSm, color: T.accent, fontSize: 11, fontWeight: 800,
          padding: "6px 12px", cursor: "pointer",
        }}>
        Show all rounds →
      </button>
    </div>
  );
}

// ── PLAYBOOK VIEW (responsive 2-column) ──────────────────────────

function PlaybookView({ mapId, side, filter, onFilter, onPractice, onStepCombo, onStepBelt, carrierName }) {
  const { LINEUPS, MUST_LEARN, COMBOS, UTILITY_BELTS, SCENARIOS } = useMapData();

  const sideCombos    = useMemo(() => COMBOS.filter(c => c.side === side), [COMBOS, side]);
  const sideBelts     = useMemo(() => UTILITY_BELTS.filter(b => b.side === side), [UTILITY_BELTS, side]);
  const sideScenarios = useMemo(() => SCENARIOS.filter(s => s.side === side), [SCENARIOS, side]);

  const applyFilter = (items) => filter === "ALL" ? items : items.filter(x => x.roundTypes?.includes(filter));
  const filteredCombos = applyFilter(sideCombos);
  const filteredBelts  = applyFilter(sideBelts);

  return (
    <div className="pa-two-col">
      <div className="pa-col-main" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="pa-must-mobile">
          <MustLearnHero side={side} onPractice={onPractice} />
        </div>

        <MapBlock mapId={mapId} side={side} onPractice={onPractice} />

        <Accordion title="All Lineups" glyph="▣" accent={T.accent}
          subtitle="Searchable reference — every grenade on this side"
          defaultOpen={true}>
          <AllLineupsPanel side={side} onPractice={onPractice} />
        </Accordion>

        <SetPiecesDivider />
        <FilterChips value={filter} onChange={onFilter} />

        <Accordion title="Combos" glyph="◈" accent={T.accent}
          count={filteredCombos.length}
          subtitle="2-3 player coordinated setups">
          <ErrorBoundary>
            {filteredCombos.length === 0 ? (
              <EmptyState filter={filter} kind="combo" onResetFilter={() => onFilter("ALL")} />
            ) : filteredCombos.map(c => (
              <ComboCard key={c.id} combo={c} onPractice={onPractice} onStepCombo={onStepCombo} />
            ))}
          </ErrorBoundary>
        </Accordion>

        <Accordion title="Utility Belts" glyph="◆" accent={T.gold}
          count={filteredBelts.length}
          subtitle="One carrier · full execute sequence">
          <ErrorBoundary>
            {filteredBelts.length === 0 ? (
              <EmptyState filter={filter} kind="belt" onResetFilter={() => onFilter("ALL")} />
            ) : filteredBelts.map(b => (
              <BeltCard key={b.id} belt={b} onPractice={onPractice} onStepBelt={onStepBelt} carrierName={carrierName} />
            ))}
          </ErrorBoundary>
        </Accordion>

        <Accordion title="Scenarios" glyph="▲" accent={T.textTip}
          count={sideScenarios.length}
          subtitle="Game-sense reminders, no lineups">
          {sideScenarios.map(s => <ScenarioCard key={s.id} scenario={s} />)}
        </Accordion>

        <div style={{ height: 20 }} />
      </div>

      <div className="pa-col-rail pa-rail-desktop">
        <div className="pa-rail-sticky">
          <MustLearnHero side={side} onPractice={onPractice} compact />
        </div>
      </div>
    </div>
  );
}

// ── STUDY VIEW ───────────────────────────────────────────────────

function StudyView({ side, names, onPractice }) {
  const { LINEUPS, MUST_LEARN, COMBOS, UTILITY_BELTS } = useMapData();
  const [picking, setPicking] = useState(false);
  const [name, setName] = useState(names[0] || "");
  const [showCombos, setShowCombos] = useState(false);
  const [copied, setCopied] = useState(false);

  const greeting = name ? `${name}'s Study Sheet` : "Study Sheet";

  const copyShareUrl = async () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("p", name || "");
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  return (
    <div className="pa-content-narrow" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: `linear-gradient(180deg, ${T.gold}15, transparent)`,
        border: `1px solid ${T.gold}33`, borderRadius: T.radius, padding: "20px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: T.gold, letterSpacing: 3, textTransform: "uppercase" }}>
          ★ Study Sheet
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: T.textHighlight, marginTop: 8, letterSpacing: -0.3 }}>{greeting}</div>
        <div style={{ fontSize: 12, color: T.textSec, marginTop: 6 }}>
          Distraction-free. Print-friendly. Shareable with <code style={{ fontFamily: T.fontMono, color: T.textPri }}>?p=</code>.
        </div>
        <button type="button" className="pa-btn-hov" onClick={() => setPicking(true)}
          style={{
            marginTop: 12, background: T.bgPanel, border: `1px solid ${T.borderLt}`,
            borderRadius: 999, color: T.textSec, fontSize: 11, fontWeight: 800,
            padding: "6px 14px", cursor: "pointer",
          }}>
          {name ? "Change player" : "Pick a player"} ▾
        </button>
      </div>

      <MustLearnHero side={side} onPractice={onPractice} />

      <div className="no-print" style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        <GhostButton onClick={copyShareUrl}>
          {copied ? "✓ Link copied" : "⇗ Copy share link"}
        </GhostButton>
        <GhostButton onClick={() => window.print()}>Print sheet</GhostButton>
        <GhostButton onClick={() => setShowCombos(!showCombos)}>
          {showCombos ? "Hide combos" : "Show combos & belts"}
        </GhostButton>
      </div>

      {showCombos && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <SectionLabel>Combos</SectionLabel>
          <ErrorBoundary>
            {COMBOS.map(c => (
              <ComboCard key={c.id} combo={c} onPractice={onPractice} onStepCombo={() => {}} />
            ))}
          </ErrorBoundary>
          <SectionLabel color={T.gold}>Utility Belts</SectionLabel>
          <ErrorBoundary>
            {UTILITY_BELTS.map(b => (
              <BeltCard key={b.id} belt={b} onPractice={onPractice} onStepBelt={() => {}} carrierName={name || null} />
            ))}
          </ErrorBoundary>
        </div>
      )}

      {picking && (
        <div onClick={() => setPicking(false)} style={{ position:"fixed", inset:0, background:"#000c",
          zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: T.bgPanel, border: `1px solid ${T.borderAlt}`, borderRadius: 12,
            maxWidth: 400, width: "100%" }}>
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: T.gold, letterSpacing: 2, textTransform: "uppercase" }}>Study Sheet</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: T.textPri, marginTop: 2 }}>Who is studying?</div>
            </div>
            <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
              {names.filter(Boolean).map((n, i) => (
                <button key={i} type="button" className="pa-btn-hov"
                  onClick={() => { setName(n); setPicking(false); }}
                  style={{ padding: "12px 14px", background: T.bg, border: `1px solid ${T.borderLt}`,
                    borderRadius: 6, color: T.textPri, fontSize: 14, fontWeight: 700, cursor: "pointer", textAlign: "left" }}>
                  {n}
                </button>
              ))}
              {names.filter(Boolean).length === 0 && (
                <div style={{ fontSize: 12, color: T.textDim, padding: "6px 4px", lineHeight: 1.5 }}>
                  Add player names in Roster to personalize the sheet.
                </div>
              )}
              <button type="button" className="pa-btn-hov"
                onClick={() => { setName(""); setPicking(false); }}
                style={{ padding: "10px 14px", background: T.bgPanel, border: `1px dashed ${T.borderLt}`,
                  borderRadius: 6, color: T.textDim, fontSize: 12, fontWeight: 700, cursor: "pointer", textAlign: "center" }}>
                Anonymous
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ROSTER MODAL ────────────────────────────────────────────────

function RosterModal({
  open,
  onClose,
  names,
  onChange,
  mapId,
  mapLabel,
  knownLineupIds,
  configHiddenLineupIds,
  hiddenLineupOverrideIds,
  onAddHiddenLineupId,
  onRemoveHiddenLineupId,
}) {
  const [lineupIdInput, setLineupIdInput] = useState("");
  const [adminMsg, setAdminMsg] = useState("");
  const lineupIdLookup = useMemo(() => new Set(knownLineupIds), [knownLineupIds]);

  const handleAddHiddenLineupId = useCallback(() => {
    const lineupId = lineupIdInput.trim();
    if (!lineupId) return;
    if (!lineupIdLookup.has(lineupId)) {
      setAdminMsg(`Unknown lineup ID for ${mapLabel}: "${lineupId}"`);
      return;
    }
    if (configHiddenLineupIds.includes(lineupId) || hiddenLineupOverrideIds.includes(lineupId)) {
      setAdminMsg(`"${lineupId}" is already hidden.`);
      return;
    }
    onAddHiddenLineupId(lineupId);
    setLineupIdInput("");
    setAdminMsg(`Hidden "${lineupId}" for ${mapLabel}.`);
  }, [
    lineupIdInput,
    lineupIdLookup,
    mapLabel,
    configHiddenLineupIds,
    hiddenLineupOverrideIds,
    onAddHiddenLineupId,
  ]);

  if (!open) return null;

  const datalistId = `lineup-ids-${mapId}`;

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"#000c",
      zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: T.bgPanel, border: `1px solid ${T.borderAlt}`, borderRadius: 12,
        maxWidth: 560, width: "100%" }}>
        <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: T.accent, letterSpacing: 2, textTransform: "uppercase" }}>
              Team Roster
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: T.textPri, marginTop: 2 }}>
              Names appear on belts &amp; the study sheet
            </div>
          </div>
          <button type="button" onClick={onClose} style={{ background: "transparent", border: "none",
            color: T.textDim, fontSize: 22, cursor: "pointer", padding: 0, lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, fontSize: 10, fontWeight: 800, color: T.textDim, letterSpacing: 1 }}>P{i + 1}</div>
              <input type="text" placeholder={i === 0 ? "Belt carrier (default)" : "Player"}
                value={names[i] || ""}
                onChange={e => { const next = [...names]; next[i] = e.target.value; onChange(next); }}
                style={{
                  flex: 1, boxSizing: "border-box",
                  background: T.bg, border: `1px solid ${T.borderLt}`, borderRadius: T.radiusSm,
                  color: T.textPri, fontSize: 13, padding: "9px 12px",
                  fontFamily: T.fontUI, outline: "none",
                }} />
            </div>
          ))}

          <div style={{ marginTop: 8, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: T.gold, letterSpacing: 2, textTransform: "uppercase" }}>
              Lineup Visibility (Admin)
            </div>
            <div style={{ fontSize: 11.5, color: T.textSec, marginTop: 4, lineHeight: 1.5 }}>
              Hide lineup IDs on <b style={{ color: T.textPri }}>{mapLabel}</b>. Overrides save in localStorage and only affect this browser.
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <input
                type="text"
                list={knownLineupIds.length > 0 ? datalistId : undefined}
                aria-label="Hidden lineup ID"
                placeholder={knownLineupIds[0] ? `e.g. ${knownLineupIds[0]}` : "lineup_id"}
                value={lineupIdInput}
                onChange={(e) => setLineupIdInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddHiddenLineupId();
                  }
                }}
                style={{
                  flex: 1, boxSizing: "border-box",
                  background: T.bg, border: `1px solid ${T.borderLt}`, borderRadius: T.radiusSm,
                  color: T.textPri, fontSize: 12.5, padding: "9px 12px",
                  fontFamily: T.fontMono, outline: "none",
                }}
              />
              <button
                type="button"
                className="pa-btn-hov"
                onClick={handleAddHiddenLineupId}
                style={{
                  background: T.accent + "18", border: `1px solid ${T.accent}50`,
                  borderRadius: T.radiusSm, color: T.accent, fontSize: 11, fontWeight: 800,
                  padding: "0 12px", cursor: "pointer", whiteSpace: "nowrap",
                }}
              >
                Hide lineup
              </button>
            </div>
            {knownLineupIds.length > 0 && (
              <datalist id={datalistId}>
                {knownLineupIds.map((lineupId) => (
                  <option key={lineupId} value={lineupId} />
                ))}
              </datalist>
            )}

            {adminMsg && (
              <div style={{ fontSize: 11, color: T.textDim, marginTop: 6 }}>
                {adminMsg}
              </div>
            )}

            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              {[...configHiddenLineupIds, ...hiddenLineupOverrideIds].length === 0 && (
                <div style={{ fontSize: 11.5, color: T.textDim }}>
                  No hidden lineup IDs for this map.
                </div>
              )}

              {configHiddenLineupIds.map((lineupId) => (
                <div key={`cfg-${lineupId}`} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                  background: T.bg, border: `1px solid ${T.borderLt}`, borderRadius: 6, padding: "8px 10px",
                }}>
                  <span style={{ fontSize: 12, color: T.textPri, fontFamily: T.fontMono }}>{lineupId}</span>
                  <span style={{
                    fontSize: 9, fontWeight: 800, letterSpacing: 0.8,
                    textTransform: "uppercase", color: T.gold,
                    background: `${T.gold}18`, border: `1px solid ${T.gold}40`,
                    borderRadius: 3, padding: "2px 6px",
                  }}>
                    config
                  </span>
                </div>
              ))}

              {hiddenLineupOverrideIds.map((lineupId) => (
                <div key={`ovr-${lineupId}`} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                  background: T.bg, border: `1px solid ${T.borderLt}`, borderRadius: 6, padding: "8px 10px",
                }}>
                  <span style={{ fontSize: 12, color: T.textPri, fontFamily: T.fontMono }}>{lineupId}</span>
                  <button
                    type="button"
                    className="pa-btn-hov"
                    aria-label={`Show ${lineupId}`}
                    onClick={() => {
                      onRemoveHiddenLineupId(lineupId);
                      setAdminMsg(`Showing "${lineupId}" again on ${mapLabel}.`);
                    }}
                    style={{
                      background: "transparent", border: `1px solid ${T.borderLt}`,
                      borderRadius: 4, color: T.textSec, fontSize: 10.5, fontWeight: 700,
                      padding: "4px 8px", cursor: "pointer",
                    }}
                  >
                    Show again
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ROSTER NUDGE ────────────────────────────────────────────────

function RosterNudge({ onOpen, onDismiss }) {
  return (
    <div style={{
      background: T.bgPanel, border: `1px solid ${T.accent}40`,
      borderRadius: T.radius, padding: "14px 16px",
      display: "flex", gap: 12, alignItems: "flex-start",
    }}>
      <span style={{ fontSize: 24 }}>👥</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: T.textPri }}>Add your team&apos;s names</div>
        <div style={{ fontSize: 11, color: T.textDim, marginTop: 4, lineHeight: 1.5 }}>
          The belt carrier&apos;s name appears on Utility Belt cards, and you can share a personalized Study Sheet with each player.
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button type="button" className="pa-btn-hov" onClick={onOpen}
            style={{
              background: T.accent + "22", border: `1px solid ${T.accent}50`,
              borderRadius: T.radiusSm, color: T.accent, fontSize: 11, fontWeight: 800,
              padding: "6px 12px", cursor: "pointer",
            }}>Add names</button>
          <button type="button" onClick={onDismiss}
            style={{
              background: "transparent", border: "none",
              color: T.textDim, fontSize: 11, fontWeight: 700, padding: "6px 8px", cursor: "pointer",
            }}>Not now</button>
        </div>
      </div>
    </div>
  );
}

// ── HEADER ───────────────────────────────────────────────────────

function Header({ mapLabel, side, onSide, onOpenMaps, onOpenRoster, tab, onTab }) {
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 50,
      background: T.bg + "f5",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      borderBottom: `1px solid ${T.border}`,
    }}>
      <div className="pa-shell">
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", flexWrap: "wrap", justifyContent: "space-between" }}>
          <div className="pa-brand" style={{ alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 7,
              background: `linear-gradient(135deg, ${T.accent}, ${T.accent}88)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 900, color: "#001a10",
              boxShadow: `0 0 0 1px ${T.accent}40`,
              flexShrink: 0,
            }}>◆</div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15, flexShrink: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.textHighlight, letterSpacing: -0.2, whiteSpace: "nowrap" }}>
                CS2 Playbook
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.textDim, letterSpacing: 1.2, marginTop: 3, whiteSpace: "nowrap", fontFamily: T.fontMono }}>
                UTILITY · v1
              </div>
            </div>
          </div>

          <button type="button" className="pa-btn-hov" onClick={onOpenMaps}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              background: T.bgPanel, border: `1px solid ${T.borderLt}`,
              cursor: "pointer", color: T.textPri,
              padding: "8px 14px", borderRadius: T.radius, flexShrink: 0,
            }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: T.textDim, letterSpacing: 2, textTransform: "uppercase" }}>Map</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: T.textHighlight, letterSpacing: -0.3 }}>{mapLabel}</div>
              <span style={{ color: T.textDim, fontSize: 11 }}>▾</span>
            </div>
          </button>

          <TabBar tab={tab} onTab={onTab} variant="top" />

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
            <SideToggle side={side} onSideChange={onSide} />
            <button type="button" className="pa-btn-hov" onClick={onOpenRoster}
              title="Team roster"
              style={{
                background: T.bgPanel, border: `1px solid ${T.borderLt}`,
                borderRadius: T.radius, color: T.textSec, fontSize: 14,
                height: 36, padding: "0 12px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6, fontWeight: 800,
              }}>
              <span style={{ fontSize: 14 }}>👥</span>
              <span style={{ fontSize: 11, letterSpacing: 1 }}>ROSTER</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TAB BAR ──────────────────────────────────────────────────────

function TabBar({ tab, onTab, variant = "bottom" }) {
  const tabs = [
    { id: "playbook", label: "Playbook", glyph: "◆" },
    { id: "study",    label: "Study",    glyph: "★" },
    { id: "train",    label: "Train",    glyph: "▲" },
  ];
  if (variant === "top") {
    return (
      <div className="pa-tabbar-top" style={{
        gap: 4, padding: "4px", background: T.bgPanel, border: `1px solid ${T.borderLt}`,
        borderRadius: T.radius, flexShrink: 0,
      }}>
        {tabs.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} type="button" className="pa-btn-hov"
              onClick={() => onTab(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: active ? T.accent + "20" : "transparent",
                border: `1px solid ${active ? T.accent + "50" : "transparent"}`,
                borderRadius: T.radiusSm,
                color: active ? T.accent : T.textSec,
                padding: "6px 12px", cursor: "pointer",
                fontSize: 12, fontWeight: 800, letterSpacing: 0.5,
              }}>
              <span style={{ fontSize: 14, opacity: active ? 1 : 0.6 }}>{t.glyph}</span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <div className="pa-tabbar-bottom" style={{
      position: "sticky", bottom: 0, zIndex: 50,
      background: T.bgPanel, borderTop: `1px solid ${T.border}`,
      padding: "6px 4px 10px",
    }}>
      {tabs.map(t => {
        const active = tab === t.id;
        return (
          <button key={t.id} type="button" className="pa-btn-hov"
            onClick={() => onTab(t.id)}
            style={{
              flex: 1, background: "transparent", border: "none",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              padding: "8px 4px", cursor: "pointer",
              color: active ? T.accent : T.textDim,
            }}>
            <span style={{ fontSize: 18, lineHeight: 1, opacity: active ? 1 : 0.55 }}>{t.glyph}</span>
            <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1, textTransform: "uppercase" }}>{t.label}</span>
            <span style={{
              width: 16, height: 2, borderRadius: 1,
              background: active ? T.accent : "transparent", marginTop: 1,
            }} />
          </button>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  APP
// ══════════════════════════════════════════════════════════════════

function useToast() {
  const [msg, setMsg] = useState(null);
  return { msg, set: setMsg, clear: useCallback(() => setMsg(null), []) };
}

export default function CS2Playbook() {
  const [tab, setTab] = useState("playbook");
  const [side, setSide] = useState("T");
  const [filter, setFilter] = useState("ALL");
  const [currentMap, setCurrentMap] = useState(() => {
    const saved = readStorage("cs2_current_map", "ancient");
    return SELECTABLE_MAP_IDS.includes(saved) ? saved : "ancient";
  });
  const [rawMapData, setRawMapData] = useState(null);
  const [mapLoadError, setMapLoadError] = useState(null);
  const [mapsOpen, setMapsOpen] = useState(false);
  const [rosterOpen, setRosterOpen] = useState(false);
  const [rosterDismissed, setRosterDismissed] = useState(false);
  const [names, setNames] = useState(() => {
    const stored = readJsonStorage("cs2_player_names", null);
    if (Array.isArray(stored) && stored.length === 5 && stored.every((v) => typeof v === "string")) return stored;
    return ["", "", "", "", ""];
  });
  const [practice, setPractice] = useState(null);
  const [hiddenLineupOverridesByMap, setHiddenLineupOverridesByMap] = useState(() => {
    const stored = readJsonStorage(HIDDEN_LINEUP_OVERRIDES_KEY, {});
    return sanitizeHiddenLineupOverridesByMap(stored);
  });
  const toast = useToast();

  const mapLabel = getMapLabel(currentMap);
  const carrierName = names.find(n => n && n.trim()) || null;
  const showRosterNudge = !rosterDismissed && !names.some(n => n && n.trim());
  const configHiddenLineupIds = useMemo(
    () => getConfiguredHiddenLineupIds(currentMap),
    [currentMap]
  );
  const hiddenLineupOverrideIds = useMemo(
    () => hiddenLineupOverridesByMap[currentMap] || [],
    [hiddenLineupOverridesByMap, currentMap]
  );
  const hiddenLineupIds = useMemo(
    () => getCombinedHiddenLineupIds(currentMap, hiddenLineupOverridesByMap),
    [currentMap, hiddenLineupOverridesByMap]
  );
  const mapData = useMemo(
    () => deriveFilteredMapData(rawMapData, hiddenLineupIds),
    [rawMapData, hiddenLineupIds]
  );

  // Load map data
  useEffect(() => {
    let cancelled = false;
    setRawMapData(null);
    setMapLoadError(null);
    (async () => {
      try {
        const mod = await loadMapModule(currentMap);
        if (!cancelled) { setRawMapData(mod); setMapLoadError(null); }
      } catch {
        if (cancelled) return;
        try {
          const mod = await loadMapModule("ancient");
          if (!cancelled) { setRawMapData(mod); setMapLoadError("fallback"); }
        } catch {
          if (!cancelled) setMapLoadError("fatal");
        }
      }
    })();
    return () => { cancelled = true; };
  }, [currentMap]);

  // URL params
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const mapParam = params.get("map");
      const lineupParam = params.get("lineup");
      if (mapParam && SELECTABLE_MAP_IDS.includes(mapParam)) setCurrentMap(mapParam);
      if (lineupParam) {
        setPractice({ type: "single", ids: [lineupParam], currentIdx: 0, title: null });
      }
      if (params.has("p")) setTab("study");
    } catch { /* ignore */ }
  }, []);

  // Persist names
  useEffect(() => {
    const handle = setTimeout(() => writeJsonStorage("cs2_player_names", names), 300);
    return () => clearTimeout(handle);
  }, [names]);
  useEffect(() => {
    writeJsonStorage(HIDDEN_LINEUP_OVERRIDES_KEY, hiddenLineupOverridesByMap);
  }, [hiddenLineupOverridesByMap]);

  const addHiddenLineupOverride = useCallback((mapId, lineupIdRaw) => {
    const lineupId = typeof lineupIdRaw === "string" ? lineupIdRaw.trim() : "";
    if (!mapId || !lineupId) return;
    setHiddenLineupOverridesByMap((prev) => {
      const current = Array.isArray(prev[mapId]) ? prev[mapId] : [];
      if (current.includes(lineupId)) return prev;
      return { ...prev, [mapId]: [...current, lineupId] };
    });
  }, []);

  const removeHiddenLineupOverride = useCallback((mapId, lineupIdRaw) => {
    const lineupId = typeof lineupIdRaw === "string" ? lineupIdRaw.trim() : "";
    if (!mapId || !lineupId) return;
    setHiddenLineupOverridesByMap((prev) => {
      const current = Array.isArray(prev[mapId]) ? prev[mapId] : [];
      const nextIds = current.filter((id) => id !== lineupId);
      if (nextIds.length === current.length) return prev;
      const next = { ...prev };
      if (nextIds.length > 0) next[mapId] = nextIds;
      else delete next[mapId];
      return next;
    });
  }, []);

  const handlePractice = useCallback((id) => {
    if (!mapData?.LINEUPS?.[id]) return;
    setPractice({ type: "single", ids: [id], currentIdx: 0, title: null });
  }, [mapData]);

  const handleStepCombo = useCallback((comboId) => {
    if (!mapData) return;
    const c = mapData.COMBOS.find(x => x.id === comboId);
    if (!c) return;
    const ids = c.lineups.map((l) => l.lineup).filter((id) => Boolean(mapData.LINEUPS[id]));
    if (ids.length === 0) return;
    setPractice({ type: "combo", ids, currentIdx: 0, title: c.name });
  }, [mapData]);

  const handleStepBelt = useCallback((beltId) => {
    if (!mapData) return;
    const b = mapData.UTILITY_BELTS.find(x => x.id === beltId);
    if (!b) return;
    const ids = b.sequence.map((s) => s.lineup).filter((id) => Boolean(mapData.LINEUPS[id]));
    if (ids.length === 0) return;
    setPractice({ type: "belt", ids, currentIdx: 0, title: b.name });
  }, [mapData]);

  const pickMap = useCallback((id) => {
    if (id !== currentMap) {
      setCurrentMap(id);
      setMapsOpen(false);
      writeStorage("cs2_current_map", id);
      const nameNew = getMapLabel(id);
      toast.set(side !== "T" ? `${nameNew} · side reset to T` : nameNew);
      if (side !== "T") setSide("T");
      setFilter("ALL");
      setPractice(null);
    } else {
      setMapsOpen(false);
    }
  }, [currentMap, side, toast]);

  // Escape handler
  useEffect(() => {
    const h = (e) => {
      if (e.key !== "Escape") return;
      if (practice) { setPractice(null); return; }
      if (rosterOpen) { setRosterOpen(false); return; }
      if (mapsOpen) { setMapsOpen(false); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [practice, rosterOpen, mapsOpen]);

  const mapLoading = rawMapData === null && mapLoadError !== "fatal";
  const mapLoadFatal = mapLoadError === "fatal";

  return (
    <MapDataContext.Provider value={mapData}>
    <div style={{
      minHeight: "100vh", background: T.bg, color: T.textPri,
      fontFamily: T.fontUI, display: "flex", flexDirection: "column",
    }}>
      <Header
        mapLabel={mapLabel} side={side} onSide={setSide}
        onOpenMaps={() => setMapsOpen(true)}
        onOpenRoster={() => setRosterOpen(true)}
        tab={tab} onTab={setTab}
      />

      <div className="pa-shell" style={{ flex: 1, width: "100%" }}>
        <div className="pa-content">
          {mapLoadFatal && (
            <div style={{ padding: 32, textAlign: "center", color: T.danger, fontSize: 13 }}>
              Could not load map data. Reload the page or pick another map.
            </div>
          )}

          {mapLoading && (
            <div style={{ padding: 32, textAlign: "center", color: T.textSec, fontSize: 13 }}>
              Loading {mapLabel}…
            </div>
          )}

          {mapLoadError === "fallback" && mapData && (
            <div style={{ marginBottom: 14, padding: "10px 12px", background: `${T.gold}12`, border: `1px solid ${T.gold}40`, borderRadius: T.radius, fontSize: 12, color: T.textGold, lineHeight: 1.5 }}>
              Could not load {mapLabel}. Showing Ancient data instead.
            </div>
          )}

          {mapData && !mapLoadFatal && tab === "playbook" && (
            <>
              {showRosterNudge && (
                <div style={{ marginBottom: 14 }}>
                  <RosterNudge onOpen={() => setRosterOpen(true)} onDismiss={() => setRosterDismissed(true)} />
                </div>
              )}
              <PlaybookView
                mapId={currentMap}
                side={side} filter={filter} onFilter={setFilter}
                onPractice={handlePractice}
                onStepCombo={handleStepCombo}
                onStepBelt={handleStepBelt}
                carrierName={carrierName}
              />
            </>
          )}

          {mapData && !mapLoadFatal && tab === "study" && (
            <StudyView side={side} names={names.filter(Boolean)} onPractice={handlePractice} />
          )}

          {tab === "train" && <TrainingView />}
        </div>
      </div>

      <TabBar tab={tab} onTab={setTab} variant="bottom" />

      <MapSheet open={mapsOpen} onClose={() => setMapsOpen(false)}
        current={currentMap} onPick={pickMap} />
      <RosterModal open={rosterOpen} onClose={() => setRosterOpen(false)}
        names={names}
        onChange={setNames}
        mapId={currentMap}
        mapLabel={mapLabel}
        knownLineupIds={Object.keys(rawMapData?.LINEUPS || {})}
        configHiddenLineupIds={configHiddenLineupIds}
        hiddenLineupOverrideIds={hiddenLineupOverrideIds}
        onAddHiddenLineupId={(lineupId) => addHiddenLineupOverride(currentMap, lineupId)}
        onRemoveHiddenLineupId={(lineupId) => removeHiddenLineupOverride(currentMap, lineupId)}
      />
      {practice && mapData && (
        <PracticeModal context={practice} onClose={() => setPractice(null)} />
      )}
      <Toast msg={toast.msg} onDone={toast.clear} />
    </div>
    </MapDataContext.Provider>
  );
}
