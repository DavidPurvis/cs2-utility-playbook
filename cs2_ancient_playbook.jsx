import { useState, useEffect, useMemo, useCallback, createContext, useContext, Component } from "react";
import MAPS, { MAP_LIST } from "./data/maps";
import { WARMUP, TRAINING, TOOL_COLORS } from "./data/training";

const MapDataContext = createContext(null);
function useMapData() { return useContext(MapDataContext); }

/*
  CS2 UTILITY PLAYBOOK — v4 (Multi-Map)

  Built for amateur teams (silver to DMG) with 9-5 jobs.
  Focus: memorable 2-3 player combos + one-player utility belts.
  Covers the full Premier map pool: Ancient, Dust II, Inferno,
  Mirage, Nuke, Anubis, Overpass.

  Data lives in ./data/<mapname>.js — this file is UI only.
*/

// ── THEME ─────────────────────────────────────────────────────
const T = {
  bg:        "#060a10",
  bgCard:    "#090d14",
  bgPanel:   "#080c14",
  bgDeep:    "#0a0e14",
  bgHover:   "#0c1520",
  bgPlay:    "#0a1018",
  border:    "#111a22",
  borderLt:  "#151e2d",
  borderAlt: "#1a2233",
  accent:    "#00ffaa",
  gold:      "#ffcc33",
  textPri:   "#dde8f0",
  textSec:   "#88aabb",
  textDim:   "#556677",
  textMute:  "#445566",
  textFaint: "#334455",
  tSide:     "#ffaa44",
  ctSide:    "#44aaff",
  danger:    "#ff4466",
  fontMono:  "'Courier New',monospace",
  fontUI:    "'Segoe UI',-apple-system,sans-serif",
  radius:    8,
  radiusSm:  4,
};

// ── THROW TYPES ────────────────────────────────────────────────
const THROW = {
  JT:    { label: "Jump Throw",     short: "Jump+LMB", color: "#ffaa00", icon: "⬆" },
  WJT:   { label: "W + Jump Throw", short: "W+Jump",   color: "#ff6644", icon: "🏃" },
  LMB:   { label: "Left Click",     short: "LMB",      color: "#44bbff", icon: "🖱" },
  RMB:   { label: "Right Click",    short: "RMB",      color: "#44ddbb", icon: "🤏" },
  WALK2: { label: "2-Step Walk+JT", short: "WW+Jump",  color: "#ff44aa", icon: "👣" },
  RUN:   { label: "Run + LMB",      short: "W+LMB",    color: "#ffcc44", icon: "💨" },
};

// ── UTILITY TYPES ──────────────────────────────────────────────
const UTIL = {
  SMOKE: { label: "Smoke",   icon: "💨", color: "#8899bb" },
  FLASH: { label: "Flash",   icon: "⚡", color: "#ffee55" },
  MOLLY: { label: "Molotov", icon: "🔥", color: "#ff6633" },
  HE:    { label: "HE",      icon: "💥", color: "#ff4444" },
};

// ── ROUND TYPES ────────────────────────────────────────────────
const ROUND_TYPES = {
  PISTOL: { label: "Pistol", short: "PISTOL", color: "#cc66ff" },
  ECO:    { label: "Eco",    short: "ECO",    color: "#ff4466" },
  FORCE:  { label: "Force",  short: "FORCE",  color: "#ffaa44" },
  FULL:   { label: "Full",   short: "FULL",   color: "#44ff88" },
};

// ═══════════════════════════════════════════════════════════════
//  COMPONENTS
// ═══════════════════════════════════════════════════════════════

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding:12, background:T.bgPanel, border:`1px solid ${T.danger}`, borderRadius:T.radius, color:T.danger, fontSize:12 }}>
          <strong>Something broke in this section.</strong>
          <div style={{ marginTop:4, color:T.textSec, fontSize:11 }}>
            {String(this.state.error?.message || this.state.error)}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ThrowBadge({ type }) {
  const t = THROW[type];
  if (!t) return null;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:3,
      background:t.color+"18", border:`1px solid ${t.color}40`, color:t.color,
      borderRadius:T.radiusSm, padding:"2px 7px",
      fontSize:11, fontWeight:700, fontFamily:T.fontMono,
    }}>
      {t.icon} {t.short}
    </span>
  );
}

function UtilBadge({ type }) {
  const u = UTIL[type];
  if (!u) return null;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:3, fontSize:12, fontWeight:700, color:u.color }}>
      {u.icon} {u.label}
    </span>
  );
}

function RoundTypeBadges({ types }) {
  if (!types || types.length === 0) return null;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:3, flexWrap:"wrap" }}>
      {types.map(rt => {
        const r = ROUND_TYPES[rt];
        if (!r) return null;
        return (
          <span key={rt} title={r.label}
            style={{ fontSize:9, fontWeight:800, color:r.color, background:r.color+"15", border:`1px solid ${r.color}40`, borderRadius:3, padding:"1px 5px", letterSpacing:0.5 }}>
            {r.short}
          </span>
        );
      })}
    </span>
  );
}

function MustLearnStar({ size = 14 }) {
  return (
    <span style={{ color:T.gold, fontSize:size, fontWeight:900 }} title="Must learn — top priority">★</span>
  );
}

function ScreenshotGallery({ screenshots, source, video, austincs }) {
  const imgs = Object.entries(screenshots || {}).filter(([, v]) => v);
  const hasAustin = austincs?.video;
  const hasLinks = !!source || !!video || hasAustin;
  const noScreenshots = imgs.length === 0;
  if (noScreenshots && !hasLinks) return null;
  return (
    <div style={{ marginTop:10 }}>
      {imgs.length > 0 ? (
        <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:6 }}>
          {imgs.map(([label, url]) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer" style={{ flexShrink:0 }}>
              <div style={{ width:200, height:113, borderRadius:6, overflow:"hidden", border:`1px solid ${T.borderAlt}`, position:"relative", background:T.bgDeep }}>
                <img src={url} alt={label} style={{ width:"100%", height:"100%", objectFit:"cover" }} loading="lazy"
                  onError={(e) => { e.target.style.display = "none"; const fb = e.target.parentElement.querySelector(".fallback"); if (fb) fb.style.display = "flex"; }}
                />
                <div className="fallback" style={{ display:"none", position:"absolute", inset:0, alignItems:"center", justifyContent:"center", color:T.textMute, fontSize:11 }}>
                  Click to view
                </div>
                <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(transparent,#000a)", padding:"10px 6px 4px", fontSize:9, fontWeight:700, color:"#ffffffaa", textTransform:"uppercase", letterSpacing:1 }}>
                  {label === "stand" ? "📍 Stand" : label === "aim" ? "🎯 Aim" : "✅ Result"}
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : hasLinks && (
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", background:T.bg, border:`1px solid ${T.border}`, borderRadius:6, marginBottom:6 }}>
          <span style={{ fontSize:11, color:T.textDim }}>No screenshot yet</span>
          {video && (
            <a href={video} target="_blank" rel="noopener noreferrer"
              style={{ fontSize:10, fontWeight:700, color:T.danger, textDecoration:"none", background:`${T.danger}10`, border:`1px solid ${T.danger}22`, borderRadius:3, padding:"3px 7px" }}>
              ▶ Watch video instead
            </a>
          )}
        </div>
      )}
      {hasLinks && (
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop: imgs.length > 0 ? 4 : 0 }}>
          {video && imgs.length > 0 && (
            <a href={video} target="_blank" rel="noopener noreferrer"
              style={{ fontSize:10, fontWeight:700, color:T.danger, textDecoration:"none", background:`${T.danger}10`, border:`1px solid ${T.danger}22`, borderRadius:3, padding:"3px 7px" }}>
              ▶ Watch on YouTube
            </a>
          )}
          {source && (
            <a href={source.url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize:10, fontWeight:700, color:T.ctSide, textDecoration:"none", background:`${T.ctSide}10`, border:`1px solid ${T.ctSide}22`, borderRadius:3, padding:"3px 7px" }}>
              📸 {source.name}
            </a>
          )}
          {hasAustin && (
            <a href={austincs.video + (austincs.timestamp ? `&t=${austincs.timestamp}` : "")} target="_blank" rel="noopener noreferrer"
              style={{ fontSize:10, fontWeight:700, color:"#ff8844", textDecoration:"none", background:"#ff884410", border:"1px solid #ff884422", borderRadius:3, padding:"3px 7px" }}>
              🎬 AustinCS{austincs.timestamp ? ` @ ${austincs.timestamp}` : ""}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function PracticeModal({ lineupId, onClose }) {
  const { LINEUPS } = useMapData();
  const [step, setStep] = useState(0);
  if (!lineupId) return null;
  const L = LINEUPS[lineupId];
  if (!L) return null;
  const steps = [
    { title: "1. Stand here", body: L.stand, img: L.screenshots?.stand },
    { title: "2. Aim here",   body: L.aim,   img: L.screenshots?.aim },
    { title: `3. Throw — ${THROW[L.throw]?.label || L.throw}`, body: L.notes || "Throw it.", img: L.screenshots?.result, throwType: L.throw },
  ];
  const cur = steps[step];
  return (
    <div onClick={onClose}
      style={{ position:"fixed", inset:0, background:"#000c", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background:T.bgPanel, border:`1px solid ${T.borderAlt}`, borderRadius:12, maxWidth:500, width:"100%", maxHeight:"90vh", overflow:"auto" }}>
        <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:10, fontWeight:800, color:T.accent, letterSpacing:2, textTransform:"uppercase" }}>Practice Mode</div>
            <div style={{ fontSize:15, fontWeight:800, color:T.textPri, marginTop:2 }}>{L.name}</div>
          </div>
          <button onClick={onClose}
            style={{ background:"transparent", border:"none", color:T.textDim, fontSize:24, cursor:"pointer", padding:0, lineHeight:1 }}>
            ✕
          </button>
        </div>
        <div style={{ padding:16 }}>
          <div style={{ display:"flex", gap:4, marginBottom:14 }}>
            {steps.map((_, i) => (
              <div key={i} style={{ flex:1, height:3, background: i <= step ? T.accent : T.border, borderRadius:2 }} />
            ))}
          </div>
          <div style={{ fontSize:18, fontWeight:800, color:T.textPri, marginBottom:8 }}>{cur.title}</div>
          {cur.throwType && (
            <div style={{ marginBottom:10 }}>
              <ThrowBadge type={cur.throwType} />
            </div>
          )}
          {cur.img ? (
            <div style={{ marginBottom:12, borderRadius:8, overflow:"hidden", border:`1px solid ${T.borderAlt}`, background:T.bgDeep }}>
              <img src={cur.img} alt={cur.title} style={{ width:"100%", display:"block" }} />
            </div>
          ) : (
            <div style={{ marginBottom:12, borderRadius:8, border:`1px dashed ${T.borderAlt}`, background:T.bgDeep, padding:"20px 12px", textAlign:"center" }}>
              <div style={{ fontSize:11, color:T.textDim }}>No screenshot yet</div>
              {L.video && (
                <a href={L.video} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize:10, fontWeight:700, color:T.danger, textDecoration:"none", marginTop:6, display:"inline-block" }}>
                  ▶ Watch video instead
                </a>
              )}
            </div>
          )}
          <div style={{ fontSize:14, color:T.textPri, lineHeight:1.6, padding:12, background:T.bg, borderRadius:6, border:`1px solid ${T.border}` }}>
            {cur.body}
          </div>
          {step === steps.length - 1 && (L.video || L.source) && (
            <div style={{ marginTop:10 }}>
              <ScreenshotGallery screenshots={{}} source={L.source} video={L.video} austincs={L.austincs} />
            </div>
          )}
          <div style={{ display:"flex", gap:8, marginTop:14 }}>
            <button disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}
              style={{ flex:1, padding:"10px", background: step === 0 ? T.bg : T.bgCard, border:`1px solid ${T.borderLt}`, borderRadius:6, color: step === 0 ? T.textFaint : T.textSec, fontSize:13, fontWeight:700, cursor: step === 0 ? "not-allowed" : "pointer" }}>
              ← Back
            </button>
            {step < steps.length - 1 ? (
              <button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                style={{ flex:1, padding:"10px", background:T.accent+"20", border:`1px solid ${T.accent}50`, borderRadius:6, color:T.accent, fontSize:13, fontWeight:800, cursor:"pointer" }}>
                Next →
              </button>
            ) : (
              <button onClick={onClose}
                style={{ flex:1, padding:"10px", background:T.accent+"20", border:`1px solid ${T.accent}50`, borderRadius:6, color:T.accent, fontSize:13, fontWeight:800, cursor:"pointer" }}>
                Done ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LineupRow({ lineupId, who, onPractice }) {
  const { LINEUPS } = useMapData();
  const L = LINEUPS[lineupId];
  if (!L) return null;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", borderBottom:`1px solid ${T.border}` }}>
      <span style={{ fontSize:14 }}>{UTIL[L.util]?.icon}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:700, color:T.textPri, display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
          {L.name}
          {L.mustLearn && <MustLearnStar size={11} />}
          <ThrowBadge type={L.throw} />
        </div>
        {who && <div style={{ fontSize:11, color:T.textDim, marginTop:2 }}>{who}</div>}
      </div>
      <button onClick={(e) => { e.stopPropagation(); onPractice(lineupId); }}
        style={{ background:T.accent+"15", border:`1px solid ${T.accent}40`, borderRadius:T.radiusSm, color:T.accent, fontSize:10, fontWeight:800, padding:"4px 8px", cursor:"pointer", whiteSpace:"nowrap" }}>
        PRACTICE
      </button>
    </div>
  );
}

function ComboCard({ combo, onPractice }) {
  const { LINEUPS } = useMapData();
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background:T.bgPanel, border:`1px solid ${open ? "#ffffff15" : T.border}`, borderRadius:10, overflow:"hidden" }}>
      <div onClick={() => setOpen(!open)} style={{ padding:"12px 14px", cursor:"pointer" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <div style={{ fontSize:15, fontWeight:800, color:T.textPri }}>{combo.name}</div>
            <span style={{ fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:3,
              background: combo.side === "T" ? T.tSide+"15" : T.ctSide+"15",
              color: combo.side === "T" ? T.tSide : T.ctSide,
              border: `1px solid ${combo.side === "T" ? T.tSide+"30" : T.ctSide+"30"}` }}>
              {combo.site}
            </span>
            <RoundTypeBadges types={combo.roundTypes} />
          </div>
          <span style={{ color:T.textFaint, fontSize:11 }}>{open ? "▲" : "▼"}</span>
        </div>
        <div style={{ fontSize:12, color:T.textSec, marginTop:4, lineHeight:1.5 }}>{combo.desc}</div>
        <div style={{ display:"flex", gap:3, marginTop:6 }}>
          {combo.lineups.map((l, i) => (
            <span key={i} style={{ fontSize:16 }}>{UTIL[LINEUPS[l.lineup]?.util]?.icon || "·"}</span>
          ))}
        </div>
      </div>
      {open && (
        <div style={{ padding:"0 14px 14px", display:"flex", flexDirection:"column", gap:8 }}>
          <div style={{ background:"#001a0f", border:`1px solid ${T.accent}20`, borderRadius:6, padding:10 }}>
            <div style={{ fontSize:9, fontWeight:900, color:T.accent, textTransform:"uppercase", letterSpacing:2, marginBottom:3 }}>🎙 Callout</div>
            <div style={{ fontSize:12, color:"#88ccaa", fontFamily:T.fontMono }}>{combo.callout}</div>
          </div>
          <div style={{ background:T.bg, border:`1px solid ${T.border}`, borderRadius:6 }}>
            {combo.lineups.map((l, i) => (
              <LineupRow key={i} lineupId={l.lineup} who={l.who} onPractice={onPractice} />
            ))}
          </div>
          {combo.tip && (
            <div style={{ background:"#0a0a18", border:`1px solid ${T.borderLt}`, borderRadius:6, padding:10 }}>
              <div style={{ fontSize:9, fontWeight:900, color:"#8888ff", textTransform:"uppercase", letterSpacing:2, marginBottom:3 }}>💡 Tip</div>
              <div style={{ fontSize:12, color:T.textSec, lineHeight:1.5 }}>{combo.tip}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UtilityBeltCard({ belt, onPractice, names }) {
  const { LINEUPS } = useMapData();
  const [open, setOpen] = useState(false);
  const carrierName = names.find((n) => n && n.trim()) || null;
  const displayName = carrierName ? `${carrierName}'s ${belt.name.replace("Utility Belt", "Belt")}` : belt.name;
  const calloutText = belt.callout.replace("[Name]", carrierName || "Carrier");
  return (
    <div style={{ background:T.bgPanel, border:`1px solid ${open ? T.gold+"33" : T.border}`, borderRadius:10, overflow:"hidden" }}>
      <div onClick={() => setOpen(!open)} style={{ padding:"12px 14px", cursor:"pointer" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontSize:18 }}>🎒</span>
            <div style={{ fontSize:15, fontWeight:800, color:T.gold }}>{displayName}</div>
            <span style={{ fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:3,
              background:T.tSide+"15", color:T.tSide, border:`1px solid ${T.tSide}30` }}>
              {belt.site}
            </span>
            <RoundTypeBadges types={belt.roundTypes} />
          </div>
          <span style={{ color:T.textFaint, fontSize:11 }}>{open ? "▲" : "▼"}</span>
        </div>
        <div style={{ fontSize:12, color:T.textSec, marginTop:4, lineHeight:1.5 }}>{belt.desc}</div>
      </div>
      {open && (
        <div style={{ padding:"0 14px 14px", display:"flex", flexDirection:"column", gap:8 }}>
          <div style={{ background:`${T.gold}10`, border:`1px solid ${T.gold}30`, borderRadius:6, padding:10 }}>
            <div style={{ fontSize:9, fontWeight:900, color:T.gold, textTransform:"uppercase", letterSpacing:2, marginBottom:3 }}>🛒 Pre-Round Setup</div>
            <div style={{ fontSize:12, color:"#d4b066", lineHeight:1.5 }}>{belt.preRound}</div>
          </div>
          <div style={{ background:"#001a0f", border:`1px solid ${T.accent}20`, borderRadius:6, padding:10 }}>
            <div style={{ fontSize:9, fontWeight:900, color:T.accent, textTransform:"uppercase", letterSpacing:2, marginBottom:3 }}>🎙 Callout</div>
            <div style={{ fontSize:12, color:"#88ccaa", fontFamily:T.fontMono }}>{calloutText}</div>
          </div>
          <div style={{ fontSize:10, fontWeight:800, color:T.textDim, textTransform:"uppercase", letterSpacing:2, marginTop:2 }}>
            Throw Order
          </div>
          <div style={{ background:T.bg, border:`1px solid ${T.border}`, borderRadius:6 }}>
            {belt.sequence.map((s, i) => {
              const L = LINEUPS[s.lineup];
              if (!L) return null;
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px",
                  borderBottom: i < belt.sequence.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <span style={{ width:22, height:22, borderRadius:11, background:T.gold+"20", color:T.gold,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900, flexShrink:0 }}>
                    {s.step}
                  </span>
                  <span style={{ fontSize:14 }}>{UTIL[L.util]?.icon}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:T.textPri, display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                      {L.name}
                      <ThrowBadge type={L.throw} />
                    </div>
                    <div style={{ fontSize:11, color:T.textDim, marginTop:2 }}>{s.note}</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); onPractice(s.lineup); }}
                    style={{ background:T.accent+"15", border:`1px solid ${T.accent}40`, borderRadius:T.radiusSm,
                      color:T.accent, fontSize:10, fontWeight:800, padding:"4px 8px", cursor:"pointer", whiteSpace:"nowrap" }}>
                    PRACTICE
                  </button>
                </div>
              );
            })}
          </div>
          {belt.teamRole && (
            <div style={{ background:"#0a0a18", border:`1px solid ${T.borderLt}`, borderRadius:6, padding:10 }}>
              <div style={{ fontSize:9, fontWeight:900, color:"#8888ff", textTransform:"uppercase", letterSpacing:2, marginBottom:3 }}>👥 What Everyone Else Does</div>
              <div style={{ fontSize:12, color:T.textSec, lineHeight:1.5 }}>{belt.teamRole}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ScenarioCard({ scenario }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background:T.bgPanel, border:`1px solid ${T.border}`, borderRadius:T.radius, overflow:"hidden" }}>
      <div onClick={() => setOpen(!open)}
        style={{ padding:"10px 14px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:3,
            background: scenario.side === "T" ? T.tSide+"15" : T.ctSide+"15",
            color: scenario.side === "T" ? T.tSide : T.ctSide,
            border: `1px solid ${scenario.side === "T" ? T.tSide+"30" : T.ctSide+"30"}` }}>
            {scenario.side}
          </span>
          <div style={{ fontSize:13, fontWeight:700, color:T.textPri }}>{scenario.title}</div>
        </div>
        <span style={{ color:T.textFaint, fontSize:11 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ padding:"0 14px 14px" }}>
          <ul style={{ margin:0, paddingLeft:18, color:T.textSec, fontSize:12, lineHeight:1.6 }}>
            {scenario.bullets.map((b, i) => (
              <li key={i} style={{ marginTop:4 }}>{b}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MustLearnSection({ onPractice, big }) {
  const { LINEUPS, MUST_LEARN } = useMapData();
  const labelSize = big ? 13 : 11;
  const titleSize = big ? 16 : 13;
  const tagSize   = big ? 12 : 10;
  return (
    <div style={{ marginTop:12, background:`linear-gradient(135deg, ${T.gold}08, ${T.gold}03)`, border:`1px solid ${T.gold}33`, borderRadius:T.radius, padding:12 }}>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
        <span style={{ fontSize:14, color:T.gold }}>★</span>
        <div style={{ fontSize:labelSize, fontWeight:900, color:T.gold, textTransform:"uppercase", letterSpacing:2 }}>
          Must Learn — The Core 5
        </div>
      </div>
      {!big && (
        <div style={{ fontSize:11, color:T.textSec, marginBottom:10, lineHeight:1.5 }}>
          If everyone on the team only learns 5 lineups, learn these. Both sides, all sites.
        </div>
      )}
      <div style={{ display:"flex", flexDirection:"column", gap: big ? 8 : 4 }}>
        {MUST_LEARN.map((id) => {
          const L = LINEUPS[id];
          if (!L) return null;
          return (
            <div key={id}
              style={{ display:"flex", alignItems:"center", gap:big ? 12 : 8, background:T.bg, border:`1px solid ${T.border}`, borderRadius:6, padding: big ? "12px 14px" : "8px 10px" }}>
              <span style={{ fontSize: big ? 24 : 16 }}>{UTIL[L.util]?.icon}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:titleSize, fontWeight:700, color:T.textPri }}>{L.name}</div>
                <div style={{ fontSize:tagSize, color:T.textDim, marginTop: big ? 3 : 1, display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                  <ThrowBadge type={L.throw} />
                  <span>{L.side} side · {L.area}</span>
                </div>
              </div>
              <button onClick={() => onPractice(id)}
                style={{ background:T.accent+"15", border:`1px solid ${T.accent}40`, borderRadius:T.radiusSm,
                  color:T.accent, fontSize: big ? 12 : 10, fontWeight:800, padding: big ? "8px 14px" : "5px 10px", cursor:"pointer", whiteSpace:"nowrap" }}>
                PRACTICE
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LineupCard({ lineupId, onPractice }) {
  const { LINEUPS } = useMapData();
  const [open, setOpen] = useState(false);
  const L = LINEUPS[lineupId];
  if (!L) return null;
  return (
    <div onClick={() => setOpen(!open)}
      style={{
        background: open ? T.bgHover : T.bgCard,
        border: `1px solid ${open ? "#ffffff18" : T.border}`,
        borderRadius: T.radius, padding: "10px 12px", cursor: "pointer",
      }}>
      <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
          <UtilBadge type={L.util} />
          <ThrowBadge type={L.throw} />
          {L.mustLearn && <MustLearnStar />}
        </div>
        <span style={{ color:T.textFaint, fontSize:11 }}>{open ? "▲" : "▼"}</span>
      </div>
      <div style={{ marginTop:5, display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
        <div style={{ fontSize:13, fontWeight:700, color:T.textPri }}>{L.name}</div>
        <button onClick={(e) => { e.stopPropagation(); onPractice(lineupId); }}
          style={{ background:T.accent+"15", border:`1px solid ${T.accent}40`, borderRadius:T.radiusSm,
            color:T.accent, fontSize:10, fontWeight:800, padding:"4px 8px", cursor:"pointer", whiteSpace:"nowrap" }}>
          PRACTICE
        </button>
      </div>
      {open && (
        <div style={{ marginTop:10, display:"flex", flexDirection:"column", gap:8 }}>
          <div style={{ fontSize:12, color:T.textSec, lineHeight:1.5, background:T.bg, borderRadius:6, padding:8, border:`1px solid ${T.border}` }}>
            <strong style={{ color:"#aabbcc" }}>Purpose:</strong> {L.purpose}
          </div>
          <div style={{ background:T.bg, borderRadius:6, padding:8, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, fontWeight:800, color:T.textDim, textTransform:"uppercase", letterSpacing:1.5, marginBottom:3 }}>📍 Stand</div>
            <div style={{ fontSize:12, color:"#c0d0e0", lineHeight:1.5 }}>{L.stand}</div>
          </div>
          <div style={{ background:T.bg, borderRadius:6, padding:8, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, fontWeight:800, color:T.textDim, textTransform:"uppercase", letterSpacing:1.5, marginBottom:3 }}>🎯 Aim & Throw</div>
            <div style={{ fontSize:12, color:"#c0d0e0", lineHeight:1.5 }}>{L.aim}</div>
          </div>
          {L.notes && (
            <div style={{ background:"#080e08", borderRadius:6, padding:8, border:"1px solid #1a2818" }}>
              <div style={{ fontSize:10, fontWeight:800, color:"#5a5", textTransform:"uppercase", letterSpacing:1.5, marginBottom:3 }}>💡 Tip</div>
              <div style={{ fontSize:12, color:"#99bb99", lineHeight:1.5 }}>{L.notes}</div>
            </div>
          )}
          <ScreenshotGallery screenshots={L.screenshots} source={L.source} video={L.video} austincs={L.austincs} />
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  INTERACTIVE MAP — position-based lineup navigation
// ═══════════════════════════════════════════════════════════════

function InteractiveMap({ side, onPractice }) {
  const mapData = useMapData();
  const { LINEUPS, SETUP_POSITIONS, RADAR_URL, MAP_NAME } = mapData;
  const SPAWNS = mapData.SPAWNS || { T: [], CT: [] };
  const [selectedPos, setSelectedPos] = useState(null);
  const [hoveredLineup, setHoveredLineup] = useState(null);
  const [selectedSpawn, setSelectedSpawn] = useState(null);
  const [mapMode, setMapMode] = useState("positions"); // "positions" or "spawns"

  useEffect(() => { setSelectedPos(null); setSelectedSpawn(null); }, [MAP_NAME]);

  const spawns = useMemo(() => SPAWNS[side] || [], [side, SPAWNS]);

  const positions = useMemo(
    () => SETUP_POSITIONS.filter((p) => p.side === side),
    [side, SETUP_POSITIONS]
  );

  const selected = positions.find((p) => p.id === selectedPos) || null;
  const activeSpawn = spawns.find((s) => s.id === selectedSpawn) || null;

  const spawnLineups = useMemo(() => {
    if (!activeSpawn) return [];
    return activeSpawn.lineups.map((id) => LINEUPS[id]).filter(Boolean);
  }, [activeSpawn, LINEUPS]);

  const selectedLineups = useMemo(() => {
    if (!selected) return [];
    return selected.lineups
      .map((id) => LINEUPS[id])
      .filter(Boolean);
  }, [selected, LINEUPS]);

  const dominantUtil = (pos) => {
    const counts = {};
    for (const id of pos.lineups) {
      const u = LINEUPS[id]?.util;
      if (u) counts[u] = (counts[u] || 0) + 1;
    }
    let best = "SMOKE";
    let max = 0;
    for (const [k, v] of Object.entries(counts)) {
      if (v > max) { best = k; max = v; }
    }
    return best;
  };

  return (
    <div style={{ padding:"0 14px" }}>
      {/* Mode toggle: Positions vs Spawns */}
      <div style={{ display:"flex", gap:4, marginTop:10 }}>
        {[
          { id: "positions", label: "Setup Positions" },
          { id: "spawns",    label: "Instant Utility (Spawns)" },
        ].map((m) => {
          const active = mapMode === m.id;
          return (
            <button key={m.id} onClick={() => { setMapMode(m.id); setSelectedPos(null); setSelectedSpawn(null); setHoveredLineup(null); }}
              style={{
                flex:1, padding:"8px 6px", fontSize:11, fontWeight:800, cursor:"pointer",
                background: active ? T.accent+"15" : T.bgCard,
                border: `1px solid ${active ? T.accent+"40" : T.borderLt}`,
                borderRadius:T.radiusSm, color: active ? T.accent : T.textDim, letterSpacing:0.5,
              }}>
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Spawn selector bar */}
      {mapMode === "spawns" && spawns.length > 0 && (
        <div style={{ display:"flex", gap:4, marginTop:8, flexWrap:"wrap" }}>
          {spawns.map((sp) => {
            const active = selectedSpawn === sp.id;
            const hasLineups = sp.lineups.length > 0;
            return (
              <button key={sp.id}
                onClick={() => { setSelectedSpawn(active ? null : sp.id); setHoveredLineup(null); }}
                style={{
                  flex:"1 1 auto", padding:"6px 10px", fontSize:10, fontWeight:700, cursor:"pointer",
                  background: active ? T.accent+"20" : T.bgCard,
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

      <div style={{ marginTop:mapMode === "spawns" ? 8 : 14, borderRadius:T.radius, overflow:"hidden", border:`1px solid ${T.borderAlt}`, position:"relative", background:T.bgDeep, lineHeight:0 }}>
        {/*
          Radar + overlays live in ONE SVG so dots use the same 0–100 space as the bitmap.
          A separate <img> + absolutely positioned SVG can misalign (aspect / subpixel / Safari).
        */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          role="img"
          aria-label={`${MAP_NAME} radar`}
          style={{ width:"100%", height:"auto", display:"block", verticalAlign:"top" }}
        >
          <image
            href={RADAR_URL}
            x={0}
            y={0}
            width={100}
            height={100}
            preserveAspectRatio="none"
            opacity={selected || activeSpawn ? 0.6 : 0.85}
          />

          {/* Spawn mode: show spawn dots and utility landing lines */}
          {mapMode === "spawns" && spawns.map((sp) => {
            const isActive = selectedSpawn === sp.id;
            const hasLineups = sp.lineups.length > 0;
            return (
              <g key={`spawn-${sp.id}`}>
                {isActive && (
                  <circle cx={sp.pos.x} cy={sp.pos.y} r={4}
                    fill="none" stroke={T.accent} strokeWidth={0.4} opacity={0.6}>
                    <animate attributeName="r" from="3" to="6" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle cx={sp.pos.x} cy={sp.pos.y}
                  r={isActive ? 2.8 : 2}
                  fill={isActive ? T.accent : hasLineups ? "#ffcc33" : T.textDim}
                  opacity={isActive ? 0.95 : hasLineups ? 0.8 : 0.4}
                  stroke="#000" strokeWidth={0.3}
                  style={{ cursor:"pointer", pointerEvents:"all" }}
                  onClick={() => { setSelectedSpawn(isActive ? null : sp.id); setHoveredLineup(null); }}
                />
                {!isActive && hasLineups && (
                  <text x={sp.pos.x} y={sp.pos.y + 0.6}
                    textAnchor="middle" fill="#000" fontSize="1.8" fontWeight="900"
                    style={{ pointerEvents:"none" }}>
                    {sp.lineups.length}
                  </text>
                )}
              </g>
            );
          })}

          {/* Spawn mode: lines from active spawn to utility landing positions */}
          {mapMode === "spawns" && activeSpawn && spawnLineups.map((L) => {
            if (!L.radarTarget) return null;
            const isHovered = hoveredLineup === L.id;
            const color = UTIL[L.util]?.color || "#888";
            return (
              <g key={`spawnline-${L.id}`}>
                <line
                  x1={activeSpawn.pos.x} y1={activeSpawn.pos.y}
                  x2={L.radarTarget.x} y2={L.radarTarget.y}
                  stroke={color} strokeWidth={isHovered ? 0.6 : 0.35}
                  strokeDasharray={isHovered ? "none" : "1.2,0.8"}
                  opacity={isHovered ? 0.9 : 0.5}
                />
                <circle
                  cx={L.radarTarget.x} cy={L.radarTarget.y}
                  r={isHovered ? 2.5 : 1.8}
                  fill={color} opacity={isHovered ? 1 : 0.7}
                  stroke="#000" strokeWidth={0.3}
                  style={{ cursor:"pointer", pointerEvents:"all" }}
                  onClick={() => onPractice(L.id)}
                  onMouseEnter={() => setHoveredLineup(L.id)}
                  onMouseLeave={() => setHoveredLineup(null)}
                />
                {isHovered && (
                  <text x={L.radarTarget.x} y={L.radarTarget.y - 3}
                    textAnchor="middle" fill="#fff" fontSize="2.2" fontWeight="700"
                    style={{ pointerEvents:"none" }}>
                    {L.name}
                  </text>
                )}
              </g>
            );
          })}

          {/* Position mode: existing behavior */}
          {mapMode === "positions" && selected && selectedLineups.map((L) => {
            if (!L.radarTarget) return null;
            const isHovered = hoveredLineup === L.id;
            const color = UTIL[L.util]?.color || "#888";
            return (
              <g key={`line-${L.id}`}>
                <line
                  x1={selected.pos.x} y1={selected.pos.y}
                  x2={L.radarTarget.x} y2={L.radarTarget.y}
                  stroke={color} strokeWidth={isHovered ? 0.6 : 0.35}
                  strokeDasharray={isHovered ? "none" : "1.2,0.8"}
                  opacity={isHovered ? 0.9 : 0.5}
                />
                <circle
                  cx={L.radarTarget.x} cy={L.radarTarget.y}
                  r={isHovered ? 2.5 : 1.8}
                  fill={color} opacity={isHovered ? 1 : 0.7}
                  stroke="#000" strokeWidth={0.3}
                  style={{ cursor:"pointer", pointerEvents:"all" }}
                  onClick={() => onPractice(L.id)}
                  onMouseEnter={() => setHoveredLineup(L.id)}
                  onMouseLeave={() => setHoveredLineup(null)}
                />
                {isHovered && (
                  <text x={L.radarTarget.x} y={L.radarTarget.y - 3}
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
            const util = dominantUtil(pos);
            const color = UTIL[util]?.color || "#888";
            const hasMustLearn = pos.lineups.some((id) => LINEUPS[id]?.mustLearn);
            if (isSelected) {
              return (
                <g key={pos.id}>
                  <circle cx={pos.pos.x} cy={pos.pos.y} r={4}
                    fill="none" stroke={T.accent} strokeWidth={0.4} opacity={0.6}>
                    <animate attributeName="r" from="3" to="5" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={pos.pos.x} cy={pos.pos.y} r={2.8}
                    fill={T.accent} opacity={0.9}
                    stroke="#000" strokeWidth={0.4}
                    style={{ cursor:"pointer", pointerEvents:"all" }}
                    onClick={() => setSelectedPos(null)}
                  />
                  <text x={pos.pos.x} y={pos.pos.y + 0.7}
                    textAnchor="middle" fill="#000" fontSize="2.2" fontWeight="900"
                    style={{ pointerEvents:"none" }}>
                    {pos.lineups.length}
                  </text>
                </g>
              );
            }
            return (
              <g key={pos.id}
                style={{ cursor:"pointer", pointerEvents:"all" }}
                onClick={() => { setSelectedPos(pos.id); setHoveredLineup(null); }}>
                {hasMustLearn && (
                  <circle cx={pos.pos.x} cy={pos.pos.y} r={3.8}
                    fill="none" stroke={T.gold} strokeWidth={0.4} opacity={0.6} />
                )}
                <circle cx={pos.pos.x} cy={pos.pos.y} r={2.4}
                  fill={color} opacity={0.85}
                  stroke="#000" strokeWidth={0.3}
                />
                <text x={pos.pos.x} y={pos.pos.y + 0.7}
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
            ? (activeSpawn ? `🎯 ${activeSpawn.name} — ${spawnLineups.length} instant lineup${spawnLineups.length !== 1 ? "s" : ""}` : "Select a spawn to see instant utility")
            : (selected ? `📍 ${selected.name}` : "Click a position to see available lineups")}
        </div>
        {(selected || activeSpawn) && (
          <button
            onClick={() => { setSelectedPos(null); setSelectedSpawn(null); }}
            style={{ position:"absolute", top:8, right:8, background:"#000a", border:`1px solid ${T.borderAlt}`, borderRadius:4, color:T.textSec, fontSize:10, fontWeight:700, padding:"4px 8px", cursor:"pointer" }}>
            ✕ Clear
          </button>
        )}
      </div>

      {/* Spawn mode detail panel */}
      {mapMode === "spawns" && activeSpawn && (
        <div style={{ marginTop:10, background:T.bgPanel, border:`1px solid ${T.accent}30`, borderRadius:T.radius, overflow:"hidden" }}>
          <div style={{ padding:"10px 14px", borderBottom:`1px solid ${T.border}` }}>
            <div style={{ fontSize:15, fontWeight:800, color:T.textPri }}>
              🎯 {activeSpawn.name}
            </div>
            <div style={{ fontSize:11, color:T.textSec, marginTop:2 }}>
              {spawnLineups.length} instant lineup{spawnLineups.length !== 1 ? "s" : ""} from this spawn
            </div>
          </div>
          {spawnLineups.length > 0 ? (
            <div style={{ background:T.bg }}>
              {spawnLineups.map((L) => (
                <div key={L.id}
                  onMouseEnter={() => setHoveredLineup(L.id)}
                  onMouseLeave={() => setHoveredLineup(null)}
                  style={{
                    display:"flex", alignItems:"center", gap:8,
                    padding:"10px 14px",
                    borderBottom:`1px solid ${T.border}`,
                    background: hoveredLineup === L.id ? T.bgHover : "transparent",
                    transition:"background 0.15s",
                  }}>
                  <span style={{ fontSize:16 }}>{UTIL[L.util]?.icon}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:T.textPri, display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                      {L.name}
                      {L.mustLearn && <MustLearnStar size={11} />}
                      <ThrowBadge type={L.throw} />
                      <span style={{ fontSize:9, fontWeight:800, color:T.gold, background:T.gold+"15", border:`1px solid ${T.gold}30`, borderRadius:3, padding:"1px 5px" }}>INSTANT</span>
                    </div>
                    <div style={{ fontSize:11, color:T.textDim, marginTop:2, lineHeight:1.4 }}>{L.purpose}</div>
                  </div>
                  <button onClick={() => onPractice(L.id)}
                    style={{ background:T.accent+"15", border:`1px solid ${T.accent}40`, borderRadius:T.radiusSm, color:T.accent, fontSize:10, fontWeight:800, padding:"6px 10px", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
                    PRACTICE
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding:"16px 14px", textAlign:"center", color:T.textDim, fontSize:12 }}>
              No instant utility from this spawn yet. Try a different spawn.
            </div>
          )}
        </div>
      )}

      {/* Position mode detail panel */}
      {mapMode === "positions" && selected && (
        <div style={{ marginTop:10, background:T.bgPanel, border:`1px solid ${T.accent}30`, borderRadius:T.radius, overflow:"hidden" }}>
          <div style={{ padding:"10px 14px", borderBottom:`1px solid ${T.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:15, fontWeight:800, color:T.textPri }}>
                  📍 {selected.name}
                </div>
                <div style={{ fontSize:11, color:T.textSec, marginTop:2 }}>
                  {selected.lineups.length} lineup{selected.lineups.length !== 1 ? "s" : ""} from this position
                </div>
              </div>
              <span style={{ fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:3,
                background: side === "T" ? T.tSide+"15" : T.ctSide+"15",
                color: side === "T" ? T.tSide : T.ctSide,
                border: `1px solid ${side === "T" ? T.tSide+"30" : T.ctSide+"30"}` }}>
                {selected.area}
              </span>
            </div>
            {selected.tip && (
              <div style={{ fontSize:11, color:T.textDim, marginTop:6, lineHeight:1.5, fontStyle:"italic" }}>
                {selected.tip}
              </div>
            )}
          </div>
          <div style={{ background:T.bg }}>
            {selectedLineups.map((L) => (
              <div key={L.id}
                onMouseEnter={() => setHoveredLineup(L.id)}
                onMouseLeave={() => setHoveredLineup(null)}
                style={{
                  display:"flex", alignItems:"center", gap:8,
                  padding:"10px 14px",
                  borderBottom:`1px solid ${T.border}`,
                  background: hoveredLineup === L.id ? T.bgHover : "transparent",
                  transition:"background 0.15s",
                }}>
                <span style={{ fontSize:16 }}>{UTIL[L.util]?.icon}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.textPri, display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                    {L.name}
                    {L.mustLearn && <MustLearnStar size={11} />}
                    <ThrowBadge type={L.throw} />
                  </div>
                  <div style={{ fontSize:11, color:T.textDim, marginTop:2, lineHeight:1.4 }}>{L.purpose}</div>
                </div>
                <button onClick={() => onPractice(L.id)}
                  style={{ background:T.accent+"15", border:`1px solid ${T.accent}40`, borderRadius:T.radiusSm, color:T.accent, fontSize:10, fontWeight:800, padding:"6px 10px", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
                  PRACTICE
                </button>
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
              <button key={pos.id}
                onClick={() => setSelectedPos(pos.id)}
                style={{
                  flex:"1 1 140px", padding:"8px 10px",
                  background:T.bgCard, border:`1px solid ${hasMustLearn ? T.gold+"40" : T.borderLt}`,
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

// ═══════════════════════════════════════════════════════════════
//  STUDY SHEET (buddy cheat sheet)
// ═══════════════════════════════════════════════════════════════

function StudyPicker({ names, onPick, onClose }) {
  const filledNames = names.filter((n) => n && n.trim());
  return (
    <div onClick={onClose}
      style={{ position:"fixed", inset:0, background:"#000c", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background:T.bgPanel, border:`1px solid ${T.borderAlt}`, borderRadius:12, maxWidth:400, width:"100%" }}>
        <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:10, fontWeight:800, color:T.gold, letterSpacing:2, textTransform:"uppercase" }}>Study Sheet</div>
            <div style={{ fontSize:15, fontWeight:800, color:T.textPri, marginTop:2 }}>Who is studying?</div>
          </div>
          <button onClick={onClose}
            style={{ background:"transparent", border:"none", color:T.textDim, fontSize:24, cursor:"pointer", padding:0, lineHeight:1 }}>
            ✕
          </button>
        </div>
        <div style={{ padding:14, display:"flex", flexDirection:"column", gap:6 }}>
          {filledNames.length === 0 && (
            <div style={{ fontSize:12, color:T.textDim, padding:"6px 4px", lineHeight:1.5 }}>
              Add player names in the Team Roster to personalize the sheet, or just open an anonymous version below.
            </div>
          )}
          {filledNames.map((n, i) => (
            <button key={i} onClick={() => onPick(n.trim())}
              style={{ padding:"12px 14px", background:T.bg, border:`1px solid ${T.borderLt}`, borderRadius:6,
                color:T.textPri, fontSize:14, fontWeight:700, cursor:"pointer", textAlign:"left" }}>
              {n.trim()}
            </button>
          ))}
          <button onClick={() => onPick("")}
            style={{ padding:"10px 14px", background:T.bgCard, border:`1px dashed ${T.borderLt}`, borderRadius:6,
              color:T.textDim, fontSize:12, fontWeight:700, cursor:"pointer", textAlign:"center", marginTop:filledNames.length ? 6 : 0 }}>
            No name — just give me the sheet
          </button>
        </div>
      </div>
    </div>
  );
}

function StudySheetView({ name, onExit, onPractice }) {
  const { COMBOS, UTILITY_BELTS } = useMapData();
  const [showCombos, setShowCombos] = useState(false);
  const [copied, setCopied] = useState(false);
  const greeting = name ? `${name}'s Study Sheet` : "Study Sheet";
  const subtitle = name ? `Hi ${name}.` : "Anonymous study mode.";

  const copyShareUrl = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("p", name || "");
      navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore (Safari private mode, etc.)
    }
  };

  return (
    <div style={{ fontFamily:T.fontUI, background:T.bg, color:T.textPri, minHeight:"100vh", maxWidth:720, margin:"0 auto", padding:"0 14px 40px" }}>
      <div style={{ background:`linear-gradient(180deg, ${T.gold}10, ${T.bg})`, borderBottom:`1px solid ${T.gold}33`, padding:"20px 16px 14px", margin:"0 -14px", textAlign:"center" }}>
        <div style={{ fontSize:10, fontWeight:900, color:T.gold, letterSpacing:4, textTransform:"uppercase" }}>
          ★ Study Sheet
        </div>
        <div style={{ fontSize:24, fontWeight:900, color:"#eef4f8", letterSpacing:-.5, marginTop:4 }}>
          {greeting}
        </div>
        <div style={{ fontSize:12, color:T.textSec, marginTop:6 }}>{subtitle}</div>
      </div>

      <MustLearnSection onPractice={onPractice} big />

      <div style={{ display:"flex", gap:8, marginTop:16, flexWrap:"wrap" }}>
        <button onClick={copyShareUrl}
          style={{ flex:"1 1 200px", padding:"10px 14px", background:copied ? T.accent+"20" : T.bgCard, border:`1px solid ${copied ? T.accent+"60" : T.borderLt}`, borderRadius:6, color:copied ? T.accent : T.textSec, fontSize:12, fontWeight:800, cursor:"pointer" }}>
          {copied ? "✓ Link copied" : "🔗 Copy share link"}
        </button>
        <button onClick={() => setShowCombos((v) => !v)}
          style={{ flex:"1 1 200px", padding:"10px 14px", background:T.bgCard, border:`1px solid ${T.borderLt}`, borderRadius:6, color:T.textSec, fontSize:12, fontWeight:800, cursor:"pointer" }}>
          {showCombos ? "▲ Hide combos" : "▼ Show combos & belts"}
        </button>
      </div>

      {showCombos && (
        <div style={{ marginTop:16 }}>
          <div style={{ fontSize:11, fontWeight:800, color:T.textDim, textTransform:"uppercase", letterSpacing:2, marginBottom:8 }}>
            Combos — How These Lineups Get Used Together
          </div>
          <ErrorBoundary>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {COMBOS.map((c) => (
                <ComboCard key={c.id} combo={c} onPractice={onPractice} />
              ))}
            </div>
          </ErrorBoundary>
          <div style={{ fontSize:11, fontWeight:800, color:T.gold, textTransform:"uppercase", letterSpacing:2, marginTop:16, marginBottom:8 }}>
            🎒 Utility Belts
          </div>
          <ErrorBoundary>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {UTILITY_BELTS.map((b) => (
                <UtilityBeltCard key={b.id} belt={b} onPractice={onPractice} names={name ? [name] : [""]} />
              ))}
            </div>
          </ErrorBoundary>
        </div>
      )}

      <button onClick={onExit}
        style={{ width:"100%", marginTop:24, padding:"12px 14px", background:T.bgCard, border:`1px solid ${T.borderLt}`, borderRadius:T.radius, color:T.textDim, fontSize:13, fontWeight:700, cursor:"pointer" }}>
        ← Exit Study Mode (back to full playbook)
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  TRAINING VIEW — warmup + training exercises with launch links
// ═══════════════════════════════════════════════════════════════

function ToolBadge({ tool }) {
  const color = TOOL_COLORS[tool] || T.textSec;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", fontSize:10, fontWeight:800,
      color, background:color+"15", border:`1px solid ${color}30`,
      borderRadius:3, padding:"2px 7px", letterSpacing:0.5,
    }}>
      {tool}
    </span>
  );
}

/** steam:// opens best in same tab; https opens in new tab */
function ExerciseLaunchLink({ href }) {
  const steam = href.startsWith("steam:");
  return (
    <a href={href} {...(steam ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      style={{
        display:"inline-flex", alignItems:"center", padding:"6px 12px",
        background:T.accent+"15", border:`1px solid ${T.accent}40`, borderRadius:T.radiusSm,
        color:T.accent, fontSize:10, fontWeight:800, textDecoration:"none", whiteSpace:"nowrap", flexShrink:0,
      }}>
      LAUNCH
    </a>
  );
}

function TrainingView() {
  return (
    <div style={{ padding:"0 14px", maxWidth:720, margin:"0 auto", paddingBottom:32 }}>
      <div style={{ marginTop:16 }}>
        <div style={{ fontSize:12, fontWeight:900, color:T.textDim, textTransform:"uppercase", letterSpacing:2, marginBottom:10 }}>
          Warmup — before you queue
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          {WARMUP.map((ex) => (
            <div key={ex.id} style={{
              display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
              background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:6,
            }}>
              <ToolBadge tool={ex.tool} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.textPri }}>{ex.name}</div>
                <div style={{ fontSize:11, color:T.textDim, marginTop:2 }}>{ex.note}</div>
              </div>
              <span style={{ fontSize:11, color:T.textMute, whiteSpace:"nowrap", flexShrink:0 }}>{ex.duration}</span>
              <ExerciseLaunchLink href={ex.launch} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop:24 }}>
        <div style={{ fontSize:12, fontWeight:900, color:T.textDim, textTransform:"uppercase", letterSpacing:2, marginBottom:10 }}>
          Training — dedicated sessions
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          {TRAINING.map((ex) => (
            <div key={ex.id} style={{
              display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
              background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:6,
            }}>
              <ToolBadge tool={ex.tool} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.textPri }}>{ex.name}</div>
                <div style={{ fontSize:11, color:T.textDim, marginTop:2 }}>{ex.note}</div>
              </div>
              <span style={{ fontSize:11, color:T.textMute, whiteSpace:"nowrap", flexShrink:0 }}>{ex.duration}</span>
              <ExerciseLaunchLink href={ex.launch} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════

export default function CS2Playbook() {
  const [currentMap, setCurrentMap] = useState(() => {
    try { return localStorage.getItem("cs2_current_map") || "ancient"; } catch { return "ancient"; }
  });
  const [side, setSide] = useState("T");
  const [names, setNames] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cs2_player_names")) || ["", "", "", "", ""];
    } catch {
      return ["", "", "", "", ""];
    }
  });
  const [showRoster, setShowRoster] = useState(false);
  const [showLineupRef, setShowLineupRef] = useState(false);
  const [areaFilter, setAreaFilter] = useState("ALL");
  const [roundFilter, setRoundFilter] = useState("ALL");
  const [practiceId, setPracticeId] = useState(null);
  const [view, setView] = useState("playbook"); // "playbook", "map", or "study"
  const [section, setSection] = useState("maps"); // "maps" or "training"
  const [studyName, setStudyName] = useState(null);
  const [studyPickerOpen, setStudyPickerOpen] = useState(false);

  const mapModule = MAPS[currentMap]?.module || MAPS.ancient.module;
  const mapData = useMemo(() => mapModule, [mapModule]);

  const switchMap = useCallback((id) => {
    setCurrentMap(id);
    setSide("T");
    setAreaFilter("ALL");
    setRoundFilter("ALL");
    setShowLineupRef(false);
    setPracticeId(null);
    try { localStorage.setItem("cs2_current_map", id); } catch {}
  }, []);

  // On mount: read ?p= URL param for study mode
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has("p")) setStudyName(params.get("p") || "");
    } catch {}
  }, []);

  // Sync study mode to URL
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (studyName === null) {
        url.searchParams.delete("p");
      } else {
        url.searchParams.set("p", studyName);
      }
      window.history.replaceState({}, "", url.toString());
    } catch {}
  }, [studyName]);

  // Debounced localStorage write for names
  useEffect(() => {
    const handle = setTimeout(() => {
      try {
        localStorage.setItem("cs2_player_names", JSON.stringify(names));
      } catch {}
    }, 300);
    return () => clearTimeout(handle);
  }, [names]);

  const mapAreas = useMemo(() => {
    const areas = new Set();
    for (const L of Object.values(mapData.LINEUPS || {})) {
      if (L.area) areas.add(L.area);
    }
    return ["ALL", ...Array.from(areas).sort()];
  }, [mapData]);

  const filteredCombos = useMemo(
    () => (mapData.COMBOS || []).filter((c) => c.side === side && (roundFilter === "ALL" || c.roundTypes.includes(roundFilter))),
    [side, roundFilter, mapData]
  );
  const filteredBelts = useMemo(
    () => (mapData.UTILITY_BELTS || []).filter((b) => b.side === side && (roundFilter === "ALL" || b.roundTypes.includes(roundFilter))),
    [side, roundFilter, mapData]
  );
  const filteredScenarios = useMemo(() => (mapData.SCENARIOS || []).filter((s) => s.side === side), [side, mapData]);
  const filteredLineups = useMemo(() => {
    const all = Object.values(mapData.LINEUPS || {}).filter((l) => l.side === side);
    return areaFilter === "ALL" ? all : all.filter((l) => l.area === areaFilter);
  }, [side, areaFilter, mapData]);

  const openPractice = useCallback((id) => setPracticeId(id), []);
  const closePractice = useCallback(() => setPracticeId(null), []);

  const updateName = useCallback((i, value) => {
    setNames((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  }, []);

  const openStudyMode = useCallback((name) => {
    setStudyName(name);
    setStudyPickerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const exitStudyMode = useCallback(() => {
    setStudyName(null);
    setView("playbook");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Study mode takes over the whole view (from URL param)
  if (studyName !== null) {
    return (
      <MapDataContext.Provider value={mapData}>
        <StudySheetView name={studyName} onExit={exitStudyMode} onPractice={openPractice} />
        {practiceId && <PracticeModal lineupId={practiceId} onClose={closePractice} />}
      </MapDataContext.Provider>
    );
  }

  const namedCount = names.filter((n) => n && n.trim()).length;
  const mapLabel = MAPS[currentMap]?.label || "Ancient";

  return (
    <MapDataContext.Provider value={mapData}>
    <div style={{ fontFamily:T.fontUI, background:T.bg, color:T.textPri, minHeight:"100vh", maxWidth:720, margin:"0 auto", paddingBottom:40 }}>
      {/* Header with gear icon for roster */}
      <div style={{ background:`linear-gradient(180deg,#0a1018,${T.bg})`, borderBottom:`1px solid ${T.border}`, padding:"16px 16px 10px", position:"relative" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:10, fontWeight:900, color:T.accent, letterSpacing:4, textTransform:"uppercase", marginBottom:2 }}>
            CS2 UTILITY PLAYBOOK
          </div>
          <div style={{ fontSize:18, fontWeight:900, color:"#eef4f8", letterSpacing:-.5 }}>
            {section === "training" ? "Training" : mapLabel}
          </div>
        </div>
        <button onClick={() => setShowRoster(true)}
          style={{
            position:"absolute", top:16, right:16,
            background:"transparent", border:`1px solid ${T.borderLt}`, borderRadius:6,
            color: namedCount > 0 ? T.textSec : T.textDim,
            fontSize:16, cursor:"pointer", padding:"4px 8px", lineHeight:1,
          }}
          title="Team Roster">
          ⚙
        </button>
      </div>

      {/* Top-level nav: Maps | Training */}
      <div style={{ display:"flex", gap:0, padding:"0 14px", marginTop:0, borderBottom:`1px solid ${T.border}` }}>
        {[
          { id: "maps",     label: "Maps" },
          { id: "training", label: "Training" },
        ].map((s) => {
          const active = section === s.id;
          return (
            <button key={s.id} onClick={() => {
              setSection(s.id);
              if (s.id === "training") {
                setStudyPickerOpen(false);
                setView("playbook");
              }
            }}
              style={{
                flex:1, padding:"10px 8px", fontSize:13, fontWeight:900, cursor:"pointer",
                background:"transparent", border:"none",
                borderBottom: active ? `2px solid ${T.accent}` : "2px solid transparent",
                color: active ? T.accent : T.textDim, letterSpacing:1.5,
              }}>
              {s.label}
            </button>
          );
        })}
      </div>

      {/* TRAINING section */}
      {section === "training" && <TrainingView />}

      {/* MAPS section */}
      {section === "maps" && (
        <>
          {/* Map selector — large, prominent */}
          <div style={{ display:"flex", gap:6, padding:"12px 14px 0", flexWrap:"wrap" }}>
            {MAP_LIST.map((m) => {
              const active = currentMap === m.id;
              return (
                <button key={m.id} onClick={() => switchMap(m.id)}
                  style={{
                    flex:"1 1 90px", padding:"12px 6px", fontSize:12, fontWeight:900, cursor:"pointer",
                    background: active ? T.accent+"18" : T.bgCard,
                    border: `2px solid ${active ? T.accent+"70" : T.borderLt}`,
                    borderRadius:8, color: active ? T.accent : T.textSec,
                    letterSpacing:0.5, transition:"all 0.15s",
                  }}>
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* View tabs: Playbook | Map | Study */}
          <div style={{ display:"flex", gap:0, padding:"0 14px", marginTop:10 }}>
            {[
              { id: "playbook", label: "Playbook" },
              { id: "map",      label: "Map" },
              { id: "study",    label: "Study" },
            ].map((tab) => {
              const active = tab.id === "study"
                ? (view === "study" || studyPickerOpen)
                : view === tab.id;
              return (
                <button key={tab.id} onClick={() => {
                  if (tab.id === "study") {
                    setView("study");
                    setStudyPickerOpen(true);
                  } else {
                    setStudyPickerOpen(false);
                    setView(tab.id);
                  }
                }}
                  style={{
                    flex:1, padding:"10px 8px", fontSize:12, fontWeight:800, cursor:"pointer",
                    background: active ? T.bgPanel : T.bg,
                    border: `1px solid ${active ? T.accent+"40" : T.borderLt}`,
                    borderBottom: active ? `2px solid ${T.accent}` : `1px solid ${T.borderLt}`,
                    borderRadius: "6px 6px 0 0",
                    color: active ? T.accent : T.textDim, letterSpacing:1,
                  }}>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* MAP VIEW */}
          {view === "map" && (
            <>
              <div style={{ padding:"0 14px" }}>
                <div style={{ display:"flex", gap:8, marginTop:10 }}>
                  {["T", "CT"].map((s) => (
                    <button key={s}
                      onClick={() => setSide(s)}
                      style={{
                        flex:1, padding:"10px",
                        background: side === s ? (s === "T" ? "#1a1408" : "#081018") : T.bgCard,
                        border: `1px solid ${side === s ? (s === "T" ? T.tSide+"40" : T.ctSide+"40") : T.borderLt}`,
                        borderRadius:6, cursor:"pointer",
                        color: side === s ? (s === "T" ? T.tSide : T.ctSide) : T.textDim,
                        fontSize:13, fontWeight:900, letterSpacing:2,
                      }}>
                      {s === "T" ? "T SIDE — ATTACK" : "CT SIDE — DEFEND"}
                    </button>
                  ))}
                </div>
              </div>
              <InteractiveMap side={side} onPractice={openPractice} />
            </>
          )}

          {/* PLAYBOOK VIEW */}
          {view === "playbook" && (
          <div style={{ padding:"0 14px" }}>
            <MustLearnSection onPractice={openPractice} />

            {/* Side selector */}
            <div style={{ display:"flex", gap:8, marginTop:16 }}>
              {["T", "CT"].map((s) => (
                <button key={s}
                  onClick={() => { setSide(s); setAreaFilter("ALL"); setRoundFilter("ALL"); }}
                  style={{
                    flex:1, padding:"10px",
                    background: side === s ? (s === "T" ? "#1a1408" : "#081018") : T.bgCard,
                    border: `1px solid ${side === s ? (s === "T" ? T.tSide+"40" : T.ctSide+"40") : T.borderLt}`,
                    borderRadius:6, cursor:"pointer",
                    color: side === s ? (s === "T" ? T.tSide : T.ctSide) : T.textDim,
                    fontSize:13, fontWeight:900, letterSpacing:2,
                  }}>
                  {s === "T" ? "T SIDE — ATTACK" : "CT SIDE — DEFEND"}
                </button>
              ))}
            </div>

            {/* Round-type filter */}
            <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
              {[["ALL", "ALL"], ["PISTOL", "PISTOL"], ["ECO", "ECO"], ["FORCE", "FORCE"], ["FULL", "FULL"]].map(([key, label]) => {
                const active = roundFilter === key;
                const color = ROUND_TYPES[key]?.color || T.accent;
                return (
                  <button key={key} onClick={() => setRoundFilter(key)}
                    style={{
                      flex:1, minWidth:55, padding:"6px 4px", fontSize:10, fontWeight:800, cursor:"pointer",
                      background: active ? color + "15" : T.bgCard,
                      border: `1px solid ${active ? color + "40" : T.borderLt}`,
                      borderRadius:T.radiusSm,
                      color: active ? color : T.textDim,
                      letterSpacing:1,
                    }}>
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Combos */}
            {filteredCombos.length > 0 && (
              <div style={{ marginTop:20 }}>
                <div style={{ fontSize:11, fontWeight:800, color:T.textDim, textTransform:"uppercase", letterSpacing:2, marginBottom:8 }}>
                  Combos — 2-3 player setups
                </div>
                <ErrorBoundary>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {filteredCombos.map((c) => (
                      <ComboCard key={c.id} combo={c} onPractice={openPractice} />
                    ))}
                  </div>
                </ErrorBoundary>
              </div>
            )}

            {/* Utility Belts */}
            {filteredBelts.length > 0 && (
              <div style={{ marginTop:20 }}>
                <div style={{ fontSize:11, fontWeight:800, color:T.gold, textTransform:"uppercase", letterSpacing:2, marginBottom:8 }}>
                  🎒 Utility Belts
                </div>
                <ErrorBoundary>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {filteredBelts.map((b) => (
                      <UtilityBeltCard key={b.id} belt={b} onPractice={openPractice} names={names} />
                    ))}
                  </div>
                </ErrorBoundary>
              </div>
            )}

            {filteredCombos.length === 0 && filteredBelts.length === 0 && (
              <div style={{ marginTop:20, padding:16, textAlign:"center", background:T.bgPanel, border:`1px solid ${T.border}`, borderRadius:T.radius, color:T.textDim, fontSize:12 }}>
                No combos or belts match the current round filter. Try clearing the filter.
              </div>
            )}

            {/* Scenarios */}
            {filteredScenarios.length > 0 && (
              <div style={{ marginTop:20 }}>
                <div style={{ fontSize:11, fontWeight:800, color:T.textDim, textTransform:"uppercase", letterSpacing:2, marginBottom:8 }}>
                  Scenarios
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {filteredScenarios.map((s) => <ScenarioCard key={s.id} scenario={s} />)}
                </div>
              </div>
            )}

            {/* All lineups reference */}
            <div style={{ marginTop:24 }}>
              <button onClick={() => setShowLineupRef(!showLineupRef)}
                style={{ width:"100%", padding:"10px 14px", background:T.bgCard, border:`1px solid ${T.borderLt}`,
                  borderRadius:T.radius, color:"#7788aa", fontSize:13, fontWeight:700, cursor:"pointer",
                  display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span>All {side}-Side Lineups ({filteredLineups.length})</span>
                <span style={{ fontSize:10 }}>{showLineupRef ? "HIDE ▲" : "SHOW ▼"}</span>
              </button>
              {showLineupRef && (
                <div style={{ marginTop:8 }}>
                  <div style={{ display:"flex", gap:6, marginBottom:8 }}>
                    {mapAreas.map((area) => (
                      <button key={area} onClick={() => setAreaFilter(area)}
                        style={{
                          flex:1, padding:"6px 8px", fontSize:11, fontWeight:800, cursor:"pointer",
                          background: areaFilter === area ? "#0d1a28" : T.bgCard,
                          border: `1px solid ${areaFilter === area ? T.accent + "40" : T.borderLt}`,
                          borderRadius:T.radiusSm,
                          color: areaFilter === area ? T.accent : T.textDim,
                          letterSpacing:1,
                        }}>
                        {area.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <ErrorBoundary>
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {filteredLineups.map((L) => (
                        <LineupCard key={L.id} lineupId={L.id} onPractice={openPractice} />
                      ))}
                    </div>
                  </ErrorBoundary>
                </div>
              )}
            </div>

            {/* Throw type reference */}
            <div style={{ marginTop:20, background:T.bgPanel, border:`1px solid ${T.border}`, borderRadius:T.radius, padding:12 }}>
              <div style={{ fontSize:10, fontWeight:900, color:T.textMute, textTransform:"uppercase", letterSpacing:2, marginBottom:8 }}>
                Throw Types
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {Object.entries(THROW).map(([k, t]) => (
                  <div key={k}
                    style={{ display:"flex", alignItems:"center", gap:4, background:T.bg, borderRadius:T.radiusSm, padding:"3px 7px", border:`1px solid ${t.color}18` }}>
                    <ThrowBadge type={k} />
                    <span style={{ fontSize:10, color:"#667788" }}>{t.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:8, fontSize:11, color:T.textDim, lineHeight:1.5, padding:8, background:T.bg, borderRadius:T.radiusSm, border:`1px solid ${T.border}` }}>
                <strong style={{ color:"#88aa44" }}>Jump Throw Bind:</strong>{" "}
                <code style={{ color:T.accent, background:`${T.accent}0f`, padding:"1px 4px", borderRadius:2, fontFamily:"monospace", fontSize:10 }}>
                  alias "+jt" "+jump;+attack"; alias "-jt" "-jump;-attack"; bind "v" "+jt"
                </code>
                <br />
                Hold left-click → press V (jump throw).
              </div>
            </div>
          </div>
          )}
        </>
      )}

      {/* Practice Modal */}
      {practiceId && <PracticeModal lineupId={practiceId} onClose={closePractice} />}

      {/* Team Roster Modal */}
      {showRoster && (
        <div onClick={() => setShowRoster(false)}
          style={{ position:"fixed", inset:0, background:"#000c", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ background:T.bgPanel, border:`1px solid ${T.borderAlt}`, borderRadius:12, maxWidth:400, width:"100%" }}>
            <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:10, fontWeight:800, color:T.accent, letterSpacing:2, textTransform:"uppercase" }}>Settings</div>
                <div style={{ fontSize:15, fontWeight:800, color:T.textPri, marginTop:2 }}>Team Roster</div>
              </div>
              <button onClick={() => setShowRoster(false)}
                style={{ background:"transparent", border:"none", color:T.textDim, fontSize:24, cursor:"pointer", padding:0, lineHeight:1 }}>
                ✕
              </button>
            </div>
            <div style={{ padding:14, display:"flex", flexDirection:"column", gap:6 }}>
              <div style={{ fontSize:11, color:T.textDim, marginBottom:4 }}>
                Names persist across reloads. The first name becomes the default belt carrier.
              </div>
              {names.map((n, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ color:T.textDim, fontSize:10, fontWeight:800, fontFamily:"monospace", minWidth:30 }}>P{i + 1}</span>
                  <input type="text" placeholder={`Player ${i + 1}...`} value={n}
                    onChange={(e) => updateName(i, e.target.value)}
                    style={{ flex:1, background:T.bg, border:`1px solid ${T.borderAlt}`, borderRadius:T.radiusSm,
                      padding:"5px 8px", color:T.textPri, fontSize:13, outline:"none" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Study Picker Modal */}
      {studyPickerOpen && (
        <StudyPicker
          names={names}
          onPick={openStudyMode}
          onClose={() => {
            setStudyPickerOpen(false);
            setView("playbook");
          }}
        />
      )}
    </div>
    </MapDataContext.Provider>
  );
}
