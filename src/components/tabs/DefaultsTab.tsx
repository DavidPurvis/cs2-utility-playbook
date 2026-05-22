/**
 * Defaults tab — three structured sections for the structure-craving
 * audience (one autistic 25-year-old per owner directive):
 *
 *   1. Plant spots — default bomb-plant locations per site, rendered as
 *      labeled markers on a small radar.
 *   2. Round timings — a flat checklist of "if you're at this point in
 *      the round, do this." Bucketed by phase (buy / early / mid / late).
 *   3. Spawn rushes — for each T-side spawn the owner has documented:
 *      "If you rush from here, you'll beat CT spawns X, Y, Z to point P."
 *
 * The data lives under `dustData.defaults` and is editable freely in
 * `src/data/dust2.json`. The boot validator does light shape checking
 * but does NOT cross-validate spawn-rush spawn ids — see W-12 in
 * DECISIONS_LEDGER.md if that becomes a problem.
 */
import { useMemo, type CSSProperties, type ReactNode } from "react";
import { Radar } from "../Radar";
import { T } from "../../theme";
import type { DustData, PlantSpot, SpawnRush, TimingNote } from "../../types";

const PHASE_ORDER: TimingNote["phase"][] = ["buy", "early", "mid", "late"];
const PHASE_LABEL: Record<TimingNote["phase"], string> = {
  buy: "Buy / freeze (0:00–0:15)",
  early: "Early round (0:15–0:30)",
  mid: "Mid round (0:30–1:00)",
  late: "Late round / post-plant",
};

export function DefaultsTab({ data }: { data: DustData }) {
  const tNotes = useMemo(
    () => groupBy(data.defaults.timings, (n) => n.phase),
    [data.defaults.timings]
  );
  const spawnsById = useMemo(() => {
    const m = new Map(data.spawns.map((s) => [s.id, s]));
    return m;
  }, [data.spawns]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Section title="Default plant spots" hint="Per site — recommended bomb drop locations for organized T executes.">
        <PlantsView plants={data.defaults.plants} config={data.config} />
      </Section>

      <Section title="Round timings" hint="When things should happen. If you're past a milestone with the item undone, the round is already off-script.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {PHASE_ORDER.map((phase) => {
            const notes = tNotes.get(phase) ?? [];
            if (notes.length === 0) return null;
            return <PhaseColumn key={phase} title={PHASE_LABEL[phase]} notes={notes} />;
          })}
        </div>
      </Section>

      <Section title="Spawn rushes (T side)" hint="If you rush from this spawn, you'll outrun the listed CT spawns to the contest path. Loose — depends on what utility you used.">
        <SpawnRushTable rushes={data.defaults.spawnRushes} spawnLabel={(id) => spawnsById.get(id)?.label ?? id} />
      </Section>
    </div>
  );
}

// ── plants ──────────────────────────────────────────────────────────

function PlantsView({ plants, config }: { plants: PlantSpot[]; config: DustData["config"] }) {
  if (plants.length === 0) return <EmptyPanel>No default plant spots authored yet. Edit <code>src/data/dust2.json</code>.</EmptyPanel>;
  const bySite = groupBy(plants, (p) => p.site);
  return (
    <div className="app-grid">
      <div style={{ maxWidth: 540 }}>
        <Radar config={config} ariaLabel="Default plant spots on Dust 2">
          {() =>
            plants.map((p) => (
              <g key={p.id} transform={`translate(${p.percent.x}, ${p.percent.y})`}>
                <circle r={1.6} fill="#000" opacity={0.55} />
                <circle r={1.3} fill={T.accent} stroke="#000" strokeWidth={0.25} />
                <text
                  x={0}
                  y={-2.2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={1.4}
                  fontWeight={800}
                  fill={T.accentDk}
                  stroke="#000"
                  strokeWidth={0.22}
                  paintOrder="stroke fill"
                  fontFamily={T.fontMono}
                >
                  {p.site}
                </text>
                <title>{p.name}</title>
              </g>
            ))
          }
        </Radar>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[...bySite.entries()].map(([site, list]) => (
          <div
            key={site}
            style={{
              background: T.bgPanel,
              border: `1px solid ${T.border}`,
              borderRadius: T.radius,
              padding: 12,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <strong style={{ color: T.textPri, fontSize: 14 }}>{site} site</strong>
            {list.map((p) => (
              <div
                key={p.id}
                style={{
                  padding: 10,
                  background: T.bg,
                  border: `1px solid ${T.borderStr}`,
                  borderRadius: T.radiusSm,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <strong style={{ color: T.textPri, fontSize: 13 }}>{p.name}</strong>
                <span style={{ color: T.textSec, fontSize: 12, lineHeight: 1.5 }}>{p.description}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── timings ─────────────────────────────────────────────────────────

function PhaseColumn({ title, notes }: { title: string; notes: TimingNote[] }) {
  return (
    <div
      style={{
        background: T.bgPanel,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ fontSize: 10, color: T.textDim, fontFamily: T.fontMono, letterSpacing: 0.6, textTransform: "uppercase" }}>{title}</div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {notes.map((n) => {
          const sideColor = n.side === "T" ? T.tSide : n.side === "CT" ? T.ctSide : T.textDim;
          return (
            <li key={n.id} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                {n.side && (
                  <span
                    style={{
                      background: n.side === "T" ? T.tSideBg : T.ctSideBg,
                      color: sideColor,
                      border: `1px solid ${sideColor}55`,
                      fontSize: 10,
                      fontFamily: T.fontMono,
                      fontWeight: 800,
                      padding: "1px 6px",
                      borderRadius: 3,
                    }}
                  >
                    {n.side}
                  </span>
                )}
                <strong style={{ color: T.textPri, fontSize: 13 }}>{n.label}</strong>
              </span>
              <span style={{ color: T.textSec, fontSize: 12, lineHeight: 1.5 }}>{n.body}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ── spawn rushes ────────────────────────────────────────────────────

function SpawnRushTable({ rushes, spawnLabel }: { rushes: SpawnRush[]; spawnLabel: (id: string) => string }) {
  if (rushes.length === 0) return <EmptyPanel>No spawn rushes authored yet.</EmptyPanel>;
  return (
    <div
      style={{
        background: T.bgPanel,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        overflow: "hidden",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: T.fontUI,
        }}
      >
        <thead>
          <tr style={{ background: T.bgSubtle, borderBottom: `1px solid ${T.border}` }}>
            <th style={th}>From spawn</th>
            <th style={th}>Contest path</th>
            <th style={th}>You'll beat</th>
            <th style={th}>You'll lose to</th>
            <th style={th}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {rushes.map((r) => (
            <tr key={r.id} style={{ borderTop: `1px solid ${T.border}` }}>
              <td style={td}>
                <Chip color={T.tSide}>{spawnLabel(r.fromSpawnId).toLowerCase()}</Chip>
              </td>
              <td style={td}>{r.contestPath}</td>
              <td style={td}>
                {r.beatsSpawnIds.map((id) => (
                  <Chip key={id} color={T.success}>{spawnLabel(id).toLowerCase()}</Chip>
                ))}
              </td>
              <td style={td}>
                {(r.losesToSpawnIds ?? []).map((id) => (
                  <Chip key={id} color={T.danger}>{spawnLabel(id).toLowerCase()}</Chip>
                ))}
                {(!r.losesToSpawnIds || r.losesToSpawnIds.length === 0) && (
                  <span style={{ color: T.textDim, fontSize: 11 }}>—</span>
                )}
              </td>
              <td style={{ ...td, color: T.textSec, fontSize: 12 }}>{r.description ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th: CSSProperties = {
  padding: "10px 12px",
  textAlign: "left",
  fontSize: 11,
  fontFamily: "monospace",
  color: "#6F6A60",
  textTransform: "uppercase",
  letterSpacing: 0.5,
  fontWeight: 800,
};
const td: CSSProperties = {
  padding: "10px 12px",
  fontSize: 13,
  verticalAlign: "top",
};

function Chip({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: T.bgPanel,
        color,
        border: `1px solid ${color}55`,
        borderRadius: 999,
        padding: "2px 8px",
        fontSize: 11,
        fontFamily: T.fontMono,
        fontWeight: 700,
        marginRight: 4,
      }}
    >
      {children}
    </span>
  );
}

// ── shared ──────────────────────────────────────────────────────────

function Section({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <header>
        <h2 style={{ margin: 0, fontSize: 18, color: T.textPri }}>{title}</h2>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: T.textDim, lineHeight: 1.5 }}>{hint}</p>
      </header>
      {children}
    </section>
  );
}

function EmptyPanel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: 16,
        background: T.bgPanel,
        border: `1px dashed ${T.border}`,
        borderRadius: T.radius,
        color: T.textDim,
        fontSize: 13,
        lineHeight: 1.5,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
}

function groupBy<T, K>(list: T[], key: (item: T) => K): Map<K, T[]> {
  const m = new Map<K, T[]>();
  for (const item of list) {
    const k = key(item);
    const existing = m.get(k);
    if (existing) existing.push(item);
    else m.set(k, [item]);
  }
  return m;
}
