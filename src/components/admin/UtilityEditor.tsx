import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import { useEditableData } from "../../hooks/useEditableData";
import { parseSetposCommand } from "../../utils/parseSetposCommand";
import { validateUtility } from "../../utils/schemas";
import { T } from "../../theme";
import { UtilityIcon } from "../shared/UtilityIcon";
import type {
  Difficulty,
  Movement,
  Side,
  ThrowStyle,
  Utility,
  UtilityType,
} from "../../types/map";

const UTIL_TYPES: UtilityType[] = ["smoke", "flash", "molotov", "he"];
const SIDES: Side[] = ["T", "CT"];
const THROW_STYLES: ThrowStyle[] = ["normal", "jump", "run", "jump+run", "crouch"];
const MOVEMENTS: Movement[] = ["standing", "walking", "running"];
const DIFFS: Difficulty[] = ["easy", "medium", "hard"];

interface FormState {
  id: string;
  name: string;
  type: UtilityType;
  side: Side;
  area: string;
  setposCmd: string; // free-text paste: parsed into throwFrom.world + throwAngle
  landingMode: "world" | "percent";
  landingWorld: { x: string; y: string; z: string };
  landingPercent: { x: string; y: string };
  throwStyle: ThrowStyle;
  movement: Movement;
  difficulty: Difficulty;
  airTimeSeconds: string;
  description: string;
  sourceName: string;
  sourceUrl: string;
  screenshotStand: string;
  screenshotAim: string;
  screenshotResult: string;
}

function emptyForm(): FormState {
  return {
    id: "",
    name: "",
    type: "smoke",
    side: "T",
    area: "",
    setposCmd: "",
    landingMode: "world",
    landingWorld: { x: "", y: "", z: "" },
    landingPercent: { x: "", y: "" },
    throwStyle: "normal",
    movement: "standing",
    difficulty: "medium",
    airTimeSeconds: "",
    description: "",
    sourceName: "",
    sourceUrl: "",
    screenshotStand: "",
    screenshotAim: "",
    screenshotResult: "",
  };
}

function utilityToForm(u: Utility): FormState {
  const w = u.throwFrom.world;
  const a = u.throwAngle;
  const setpos = w
    ? `setpos ${w.x} ${w.y}${w.z !== undefined ? ` ${w.z}` : ""}${
        a ? `;setang ${a.pitch} ${a.yaw} ${a.roll}` : ""
      }`
    : "";
  const hasWorld = !!u.landingAt.world;
  return {
    id: u.id,
    name: u.name,
    type: u.type,
    side: u.side,
    area: u.area,
    setposCmd: setpos,
    landingMode: hasWorld ? "world" : "percent",
    landingWorld: hasWorld
      ? {
          x: String(u.landingAt.world!.x),
          y: String(u.landingAt.world!.y),
          z: u.landingAt.world!.z !== undefined ? String(u.landingAt.world!.z) : "",
        }
      : { x: "", y: "", z: "" },
    landingPercent: u.landingAt.percent
      ? { x: String(u.landingAt.percent.x), y: String(u.landingAt.percent.y) }
      : { x: "", y: "" },
    throwStyle: u.throwStyle,
    movement: u.movement,
    difficulty: u.difficulty,
    airTimeSeconds: u.airTimeSeconds !== undefined ? String(u.airTimeSeconds) : "",
    description: u.description ?? "",
    sourceName: u.source?.name ?? "",
    sourceUrl: u.source?.url ?? "",
    screenshotStand: u.screenshots?.stand ?? "",
    screenshotAim: u.screenshots?.aim ?? "",
    screenshotResult: u.screenshots?.result ?? "",
  };
}

function formToUtility(f: FormState): { utility: Utility | null; errors: string[] } {
  const errors: string[] = [];
  if (!/^[a-z][a-z0-9_]*$/.test(f.id)) errors.push("id must be lowercase snake_case (a-z, 0-9, _)");
  if (!f.name.trim()) errors.push("name is required");
  if (!f.area.trim()) errors.push("area is required");

  const parsed = parseSetposCommand(f.setposCmd);
  if (!parsed?.world) errors.push("paste a valid `setpos x y z` command");

  let landingAt: Utility["landingAt"] = {};
  if (f.landingMode === "world") {
    const lx = Number(f.landingWorld.x);
    const ly = Number(f.landingWorld.y);
    const lz = f.landingWorld.z.trim() ? Number(f.landingWorld.z) : undefined;
    if (!Number.isFinite(lx) || !Number.isFinite(ly)) errors.push("landing world x/y must be numbers");
    else landingAt = { world: { x: lx, y: ly, ...(lz !== undefined && Number.isFinite(lz) ? { z: lz } : {}) } };
  } else {
    const px = Number(f.landingPercent.x);
    const py = Number(f.landingPercent.y);
    if (!Number.isFinite(px) || !Number.isFinite(py)) errors.push("landing percent x/y must be numbers");
    else if (px < 0 || px > 100 || py < 0 || py > 100) errors.push("landing percent must be 0-100");
    else landingAt = { percent: { x: px, y: py } };
  }

  if (errors.length > 0 || !parsed?.world) return { utility: null, errors };

  const u: Utility = {
    id: f.id,
    name: f.name.trim(),
    type: f.type,
    side: f.side,
    area: f.area.trim(),
    throwFrom: { world: parsed.world },
    landingAt,
    throwStyle: f.throwStyle,
    movement: f.movement,
    difficulty: f.difficulty,
    ...(parsed.angle ? { throwAngle: parsed.angle } : {}),
    ...(f.airTimeSeconds.trim() && Number.isFinite(Number(f.airTimeSeconds))
      ? { airTimeSeconds: Number(f.airTimeSeconds) }
      : {}),
    ...(f.description.trim() ? { description: f.description.trim() } : {}),
    ...(f.sourceName.trim() && f.sourceUrl.trim()
      ? { source: { name: f.sourceName.trim(), url: f.sourceUrl.trim() } }
      : {}),
    ...((f.screenshotStand || f.screenshotAim || f.screenshotResult)
      ? {
          screenshots: {
            ...(f.screenshotStand.trim() ? { stand: f.screenshotStand.trim() } : {}),
            ...(f.screenshotAim.trim() ? { aim: f.screenshotAim.trim() } : {}),
            ...(f.screenshotResult.trim() ? { result: f.screenshotResult.trim() } : {}),
          },
        }
      : {}),
  };

  // Final schema validation as a belt-and-suspenders check.
  const v = validateUtility(u);
  if (!v.ok) for (const e of v.errors) errors.push(`${e.path}: ${e.message}`);
  return errors.length === 0 ? { utility: u, errors: [] } : { utility: null, errors };
}

export interface UtilityEditorProps {
  /** Called when the user toggles click-to-place mode so MapRenderer can become clickable. */
  onSetClickToPlace?: (active: boolean) => void;
}

/** Imperative API the parent can call when a click lands on the radar. */
export interface UtilityEditorHandle {
  applyClickedLanding: (percent: { x: number; y: number }) => void;
}

export const UtilityEditor = forwardRef<UtilityEditorHandle, UtilityEditorProps>(
  function UtilityEditor({ onSetClickToPlace }, ref) {
  const { utilities, upsertUtility, deleteUtility } = useEditableData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [errors, setErrors] = useState<string[]>([]);
  const [clickPlace, setClickPlace] = useState(false);

  useEffect(() => {
    onSetClickToPlace?.(clickPlace);
  }, [clickPlace, onSetClickToPlace]);

  // Parent calls this imperatively when the radar is clicked while
  // we're in click-to-place mode. Running in the event handler avoids
  // an effect-driven render cascade.
  useImperativeHandle(
    ref,
    () => ({
      applyClickedLanding(percent) {
        setForm((f) => ({
          ...f,
          landingMode: "percent",
          landingPercent: {
            x: percent.x.toFixed(2),
            y: percent.y.toFixed(2),
          },
        }));
        setClickPlace(false);
      },
    }),
    []
  );

  const startEdit = (u: Utility) => {
    setEditingId(u.id);
    setForm(utilityToForm(u));
    setErrors([]);
  };
  const startNew = () => {
    setEditingId(null);
    setForm(emptyForm());
    setErrors([]);
  };
  const cancel = () => {
    setEditingId(null);
    setForm(emptyForm());
    setErrors([]);
    setClickPlace(false);
  };

  const save = () => {
    const { utility, errors } = formToUtility(form);
    if (!utility) {
      setErrors(errors);
      return;
    }
    upsertUtility(utility);
    cancel();
  };

  const sorted = useMemo(
    () => [...utilities].sort((a, b) => a.id.localeCompare(b.id)),
    [utilities]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <strong style={{ color: T.textPri, fontSize: 12 }}>Utilities</strong>
        <span style={{ color: T.textDim, fontSize: 11 }}>· {utilities.length}</span>
        <button
          type="button"
          onClick={startNew}
          style={{
            marginLeft: "auto",
            background: T.accentBg,
            color: T.accent,
            border: `1px solid ${T.accent}55`,
            borderRadius: T.radiusSm,
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + New
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        {sorted.map((u) => (
          <li
            key={u.id}
            style={{
              padding: "6px 8px",
              border: `1px solid ${T.borderLt}`,
              borderRadius: T.radiusSm,
              background: editingId === u.id ? T.bgHover : T.bg,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
            }}
          >
            <UtilityIcon type={u.type} />
            <span style={{ flex: 1, color: T.textPri }}>{u.name}</span>
            <span style={{ color: T.textDim, fontSize: 10, fontFamily: T.fontMono }}>
              {u.side}·{u.area}
            </span>
            <button
              type="button"
              onClick={() => startEdit(u)}
              style={{
                background: "transparent",
                color: T.textSec,
                border: `1px solid ${T.borderLt}`,
                borderRadius: 3,
                padding: "2px 6px",
                fontSize: 10,
                cursor: "pointer",
              }}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm(`Delete utility "${u.name}"?`)) deleteUtility(u.id);
              }}
              style={{
                background: "transparent",
                color: T.danger,
                border: `1px solid ${T.danger}55`,
                borderRadius: 3,
                padding: "2px 6px",
                fontSize: 10,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <UtilityFormCard
        form={form}
        setForm={setForm}
        errors={errors}
        onSave={save}
        onCancel={cancel}
        clickPlace={clickPlace}
        setClickPlace={setClickPlace}
        isEditing={editingId !== null}
      />
    </div>
  );
});

interface FormCardProps {
  form: FormState;
  setForm: (f: FormState | ((prev: FormState) => FormState)) => void;
  errors: string[];
  onSave: () => void;
  onCancel: () => void;
  clickPlace: boolean;
  setClickPlace: (v: boolean) => void;
  isEditing: boolean;
}

function UtilityFormCard({ form, setForm, errors, onSave, onCancel, clickPlace, setClickPlace, isEditing }: FormCardProps) {
  const fieldStyle: CSSProperties = {
    padding: "6px 8px",
    background: T.bg,
    border: `1px solid ${T.borderLt}`,
    borderRadius: T.radiusSm,
    color: T.textPri,
    fontSize: 12,
    fontFamily: T.fontUI,
    outline: "none",
    width: "100%",
  };
  const labelStyle: CSSProperties = {
    fontSize: 10,
    color: T.textDim,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  };

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div
      style={{
        border: `1px solid ${T.borderAlt}`,
        borderRadius: T.radius,
        padding: 10,
        background: T.bgPanel,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <strong style={{ fontSize: 12, color: T.textPri }}>
          {isEditing ? "Edit utility" : "New utility"}
        </strong>
        <button
          type="button"
          onClick={onCancel}
          style={{
            marginLeft: "auto",
            background: "transparent",
            color: T.textDim,
            border: `1px solid ${T.borderLt}`,
            borderRadius: 3,
            padding: "2px 8px",
            fontSize: 10,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        <div>
          <div style={labelStyle}>id (snake_case)</div>
          <input style={fieldStyle} value={form.id} onChange={(e) => set("id", e.target.value)} placeholder="e.g. xbox_smoke" />
        </div>
        <div>
          <div style={labelStyle}>name</div>
          <input style={fieldStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Xbox Smoke from T Spawn" />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
        <div>
          <div style={labelStyle}>type</div>
          <select style={fieldStyle} value={form.type} onChange={(e) => set("type", e.target.value as UtilityType)}>
            {UTIL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <div style={labelStyle}>side</div>
          <select style={fieldStyle} value={form.side} onChange={(e) => set("side", e.target.value as Side)}>
            {SIDES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <div style={labelStyle}>area</div>
          <input style={fieldStyle} value={form.area} onChange={(e) => set("area", e.target.value)} placeholder="Mid · A · B" />
        </div>
      </div>

      <div>
        <div style={labelStyle}>setpos command (paste from cs2util or in-game console)</div>
        <textarea
          style={{ ...fieldStyle, fontFamily: T.fontMono, fontSize: 11, height: 50, resize: "vertical" }}
          value={form.setposCmd}
          onChange={(e) => set("setposCmd", e.target.value)}
          placeholder="setpos -299.969 -1163.764 136.822;setang -12.173 91.437 0.000"
        />
      </div>

      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span style={labelStyle}>landing</span>
          <div role="tablist" style={{ display: "flex", gap: 2, marginLeft: 6 }}>
            {(["world", "percent"] as const).map((m) => {
              const active = form.landingMode === m;
              return (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => set("landingMode", m)}
                  style={{
                    background: active ? T.accentBg : T.bg,
                    color: active ? T.accent : T.textSec,
                    border: `1px solid ${active ? T.accent + "55" : T.borderLt}`,
                    borderRadius: 3,
                    padding: "2px 6px",
                    fontSize: 10,
                    cursor: "pointer",
                  }}
                >
                  {m}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setClickPlace(!clickPlace)}
            style={{
              marginLeft: "auto",
              background: clickPlace ? T.accent : T.bg,
              color: clickPlace ? "#001018" : T.accent,
              border: `1px solid ${T.accent}55`,
              borderRadius: 3,
              padding: "2px 8px",
              fontSize: 10,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {clickPlace ? "Click map to place" : "+ Click to place"}
          </button>
        </div>
        {form.landingMode === "world" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            <input style={fieldStyle} placeholder="world x" value={form.landingWorld.x} onChange={(e) => set("landingWorld", { ...form.landingWorld, x: e.target.value })} />
            <input style={fieldStyle} placeholder="world y" value={form.landingWorld.y} onChange={(e) => set("landingWorld", { ...form.landingWorld, y: e.target.value })} />
            <input style={fieldStyle} placeholder="world z (opt)" value={form.landingWorld.z} onChange={(e) => set("landingWorld", { ...form.landingWorld, z: e.target.value })} />
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            <input style={fieldStyle} placeholder="percent x (0-100)" value={form.landingPercent.x} onChange={(e) => set("landingPercent", { ...form.landingPercent, x: e.target.value })} />
            <input style={fieldStyle} placeholder="percent y (0-100)" value={form.landingPercent.y} onChange={(e) => set("landingPercent", { ...form.landingPercent, y: e.target.value })} />
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
        <div>
          <div style={labelStyle}>throw</div>
          <select style={fieldStyle} value={form.throwStyle} onChange={(e) => set("throwStyle", e.target.value as ThrowStyle)}>
            {THROW_STYLES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <div style={labelStyle}>movement</div>
          <select style={fieldStyle} value={form.movement} onChange={(e) => set("movement", e.target.value as Movement)}>
            {MOVEMENTS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <div style={labelStyle}>difficulty</div>
          <select style={fieldStyle} value={form.difficulty} onChange={(e) => set("difficulty", e.target.value as Difficulty)}>
            {DIFFS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <div style={labelStyle}>air time (s)</div>
          <input style={fieldStyle} placeholder="5.4" value={form.airTimeSeconds} onChange={(e) => set("airTimeSeconds", e.target.value)} />
        </div>
      </div>

      <div>
        <div style={labelStyle}>description / notes</div>
        <textarea
          style={{ ...fieldStyle, height: 60, resize: "vertical" }}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <details style={{ fontSize: 11, color: T.textDim }}>
        <summary style={{ cursor: "pointer" }}>Source + screenshots</summary>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 6 }}>
          <input style={fieldStyle} placeholder="source name" value={form.sourceName} onChange={(e) => set("sourceName", e.target.value)} />
          <input style={fieldStyle} placeholder="source url" value={form.sourceUrl} onChange={(e) => set("sourceUrl", e.target.value)} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 6, marginTop: 6 }}>
          <input style={fieldStyle} placeholder="/screenshots/dust2/stand.jpg" value={form.screenshotStand} onChange={(e) => set("screenshotStand", e.target.value)} />
          <input style={fieldStyle} placeholder="/screenshots/dust2/aim.jpg" value={form.screenshotAim} onChange={(e) => set("screenshotAim", e.target.value)} />
          <input style={fieldStyle} placeholder="/screenshots/dust2/result.jpg" value={form.screenshotResult} onChange={(e) => set("screenshotResult", e.target.value)} />
        </div>
      </details>

      {errors.length > 0 && (
        <div style={{ fontSize: 11, color: T.danger, padding: 6, background: T.bg, borderRadius: T.radiusSm }}>
          {errors.map((e, i) => <div key={i}>· {e}</div>)}
        </div>
      )}

      <button
        type="button"
        onClick={onSave}
        style={{
          background: T.accent,
          color: "#001018",
          border: "none",
          borderRadius: T.radiusSm,
          padding: "8px 14px",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Save {isEditing ? "changes" : "new utility"}
      </button>
    </div>
  );
}
