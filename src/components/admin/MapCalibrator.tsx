/**
 * Admin tool for adjusting the radar image's world↔percent translation.
 *
 * Three numbers, all from Valve's overview metadata:
 *   - pos_x: world X at the LEFT edge of the radar PNG
 *   - pos_y: world Y at the TOP edge of the radar PNG
 *   - scale: world units per pixel × sourceResolution (typically 1024)
 *
 * The user nudges these until every spawn dot sits inside the matching
 * spawn area on the radar. Edits route through useEditableData so the
 * Spawn Positions tab (and any utility / scenario marker) updates live
 * in the background. A miniature preview inside the panel mirrors the
 * full Spawn map so the user can stay on the Calibration tab.
 */
import { useMemo, type CSSProperties } from "react";
import { useEditableData } from "../../hooks/useEditableData";
import { useMapData } from "../../hooks/useMapData";
import { worldToPercent } from "../../utils/coordinates";
import { MapRenderer } from "../MapRenderer";
import { MapMarker } from "../shared/MapMarker";
import { T } from "../../theme";
import type { MapConfig } from "../../types/map";

const STEP = { pos: 50, scale: 0.05 };

export function MapCalibrator() {
  const { config, spawns, updateConfig, resetFile } = useEditableData();
  const { bundle } = useMapData();
  const baseline = bundle.config;

  const dirty = useMemo(
    () =>
      config.pos_x !== baseline.pos_x ||
      config.pos_y !== baseline.pos_y ||
      config.scale !== baseline.scale ||
      config.sourceResolution !== baseline.sourceResolution,
    [config, baseline]
  );

  const set = (patch: Partial<MapConfig>) => updateConfig(patch);

  const reset = () => {
    if (!confirm("Reset map calibration back to the shipped values?")) return;
    resetFile("dust2-map-config");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 11, color: T.textDim, lineHeight: 1.5 }}>
        Tweak Valve's overview constants until every spawn dot sits
        inside its in-game spawn area. The Spawn Positions tab updates
        live as you drag.
      </div>

      <NumberRow
        label="pos_x"
        title="World X at the LEFT edge of the radar PNG"
        value={config.pos_x}
        step={STEP.pos}
        onChange={(v) => set({ pos_x: v })}
        baseline={baseline.pos_x}
      />
      <NumberRow
        label="pos_y"
        title="World Y at the TOP edge of the radar PNG"
        value={config.pos_y}
        step={STEP.pos}
        onChange={(v) => set({ pos_y: v })}
        baseline={baseline.pos_y}
      />
      <NumberRow
        label="scale"
        title="world units per pixel × sourceResolution"
        value={config.scale}
        step={STEP.scale}
        onChange={(v) => set({ scale: v })}
        baseline={baseline.scale}
      />
      <NumberRow
        label="sourceResolution"
        title="Native radar PNG side length (px). Almost always 1024."
        value={config.sourceResolution}
        step={64}
        onChange={(v) => set({ sourceResolution: v })}
        baseline={baseline.sourceResolution}
      />

      <button
        type="button"
        onClick={reset}
        disabled={!dirty}
        style={{
          marginTop: 4,
          background: "transparent",
          color: dirty ? T.danger : T.textDim,
          border: `1px solid ${dirty ? T.danger + "55" : T.borderLt}`,
          borderRadius: T.radiusSm,
          padding: "6px 10px",
          fontSize: 11,
          fontWeight: 700,
          cursor: dirty ? "pointer" : "default",
        }}
      >
        Reset to shipped values
      </button>

      <div style={{ fontSize: 10, color: T.textDim, letterSpacing: 0.4, textTransform: "uppercase", marginTop: 4 }}>
        Preview
      </div>
      <div style={{ width: "100%", maxWidth: 320, alignSelf: "center" }}>
        <MapRenderer config={config}>
          {() =>
            spawns.map((spawn) => {
              const pct = worldToPercent(spawn.world.x, spawn.world.y, config);
              if (!pct) return null;
              return (
                <MapMarker
                  key={spawn.id}
                  x={pct.x}
                  y={pct.y}
                  size={2}
                  color={spawn.side === "T" ? T.tSide : T.ctSide}
                  shape="ring"
                  title={`${spawn.side} ${spawn.label}`}
                />
              );
            })
          }
        </MapRenderer>
      </div>
    </div>
  );
}

interface NumberRowProps {
  label: string;
  title: string;
  value: number;
  step: number;
  onChange: (v: number) => void;
  baseline: number;
}

function NumberRow({ label, title, value, step, onChange, baseline }: NumberRowProps) {
  const dirty = value !== baseline;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "90px 1fr auto", gap: 6, alignItems: "center" }}>
      <label
        title={title}
        style={{
          fontSize: 11,
          color: dirty ? T.accent : T.textDim,
          fontFamily: T.fontMono,
          letterSpacing: 0.4,
        }}
      >
        {label}
        {dirty && (
          <span style={{ color: T.accent, marginLeft: 4 }} aria-hidden>
            *
          </span>
        )}
      </label>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (Number.isFinite(n)) onChange(n);
        }}
        style={{
          padding: "5px 8px",
          background: T.bg,
          border: `1px solid ${dirty ? T.accent + "55" : T.borderLt}`,
          borderRadius: T.radiusSm,
          color: T.textPri,
          fontFamily: T.fontMono,
          fontSize: 12,
          outline: "none",
          width: "100%",
        }}
      />
      <div style={{ display: "flex", gap: 2 }}>
        <button
          type="button"
          onClick={() => onChange(value - step)}
          title={`-${step}`}
          style={btn}
        >
          −
        </button>
        <button
          type="button"
          onClick={() => onChange(value + step)}
          title={`+${step}`}
          style={btn}
        >
          +
        </button>
      </div>
    </div>
  );
}

const btn: CSSProperties = {
  background: "transparent",
  color: "#a3afc1",
  border: "1px solid #242c3c",
  borderRadius: 3,
  padding: "2px 7px",
  fontSize: 11,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "monospace",
};
