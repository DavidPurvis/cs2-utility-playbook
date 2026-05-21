/**
 * Admin form to add / edit a Scenario. The shape mirrors what the
 * Scenarios tab renders:
 *   - metadata (name, description, side, targetArea, difficulty, count)
 *   - 2-5 players, each with role/label/color + a list of actions
 *   - each action references an existing Utility by id
 *
 * The editor never invents data: actions can only pick from utilities
 * that already exist in the bundle. If the user wants a new utility,
 * they make it in the Utilities tab first and then come back.
 */
import { useMemo, useState, type CSSProperties } from "react";
import { useEditableData } from "../../hooks/useEditableData";
import { validateScenario } from "../../utils/schemas";
import { T } from "../../theme";
import { UtilityIcon } from "../shared/UtilityIcon";
import type {
  Scenario,
  ScenarioAction,
  ScenarioDifficulty,
  ScenarioPlayer,
  Side,
} from "../../types/map";

const DIFFICULTIES: ScenarioDifficulty[] = ["beginner", "intermediate", "advanced"];
const SIDES: Side[] = ["T", "CT"];
const PLAYER_COUNTS: Array<2 | 3 | 4 | 5> = [2, 3, 4, 5];

// A reasonable distinct palette for up to 5 players.
const DEFAULT_COLORS = ["#3ed5b8", "#f08e3c", "#5fa8e8", "#c084fc", "#f0d24a"];

interface FormPlayer {
  role: string;
  label: string;
  color: string;
  actions: Array<{
    order: string; // free-text edit; coerced on save
    utilityId: string;
    description: string;
    timing: string;
  }>;
}

interface FormState {
  id: string;
  name: string;
  description: string;
  side: Side;
  targetArea: string;
  difficulty: ScenarioDifficulty;
  playerCount: 2 | 3 | 4 | 5;
  players: FormPlayer[];
  notes: string;
}

function freshPlayer(idx: number): FormPlayer {
  return {
    role: "",
    label: `Player ${String.fromCharCode(65 + idx)}`,
    color: DEFAULT_COLORS[idx] ?? "#9ad0ff",
    actions: [],
  };
}

function emptyForm(): FormState {
  return {
    id: "",
    name: "",
    description: "",
    side: "T",
    targetArea: "",
    difficulty: "intermediate",
    playerCount: 3,
    players: [freshPlayer(0), freshPlayer(1), freshPlayer(2)],
    notes: "",
  };
}

function scenarioToForm(s: Scenario): FormState {
  return {
    id: s.id,
    name: s.name,
    description: s.description,
    side: s.side,
    targetArea: s.targetArea,
    difficulty: s.difficulty,
    playerCount: s.playerCount,
    players: s.players.map((p) => ({
      role: p.role,
      label: p.label,
      color: p.color,
      actions: p.actions.map((a) => ({
        order: String(a.order),
        utilityId: a.utilityId,
        description: a.description ?? "",
        timing: a.timing ?? "",
      })),
    })),
    notes: s.notes ?? "",
  };
}

function formToScenario(f: FormState): { scenario: Scenario | null; errors: string[] } {
  const errors: string[] = [];
  if (!/^[a-z][a-z0-9_-]*$/.test(f.id)) errors.push("id must be lowercase slug (a-z, 0-9, _-)");
  if (!f.name.trim()) errors.push("name is required");
  if (!f.targetArea.trim()) errors.push("target area is required");
  if (f.players.length !== f.playerCount)
    errors.push(`playerCount=${f.playerCount} but ${f.players.length} player(s) defined`);

  const players: ScenarioPlayer[] = f.players.map((p, pi) => {
    if (!p.label.trim()) errors.push(`player ${pi + 1}: label required`);
    if (!p.color.trim()) errors.push(`player ${pi + 1}: color required`);
    const actions: ScenarioAction[] = p.actions.map((a, ai) => {
      const order = Number(a.order);
      if (!Number.isFinite(order)) errors.push(`player ${pi + 1} action ${ai + 1}: order must be a number`);
      if (!a.utilityId) errors.push(`player ${pi + 1} action ${ai + 1}: pick a utility`);
      return {
        order,
        utilityId: a.utilityId,
        ...(a.description.trim() ? { description: a.description.trim() } : {}),
        ...(a.timing.trim() ? { timing: a.timing.trim() } : {}),
      };
    });
    return {
      role: p.role.trim() || "—",
      label: p.label.trim(),
      color: p.color.trim(),
      actions,
    };
  });

  if (errors.length > 0) return { scenario: null, errors };

  const scenario: Scenario = {
    id: f.id,
    name: f.name.trim(),
    description: f.description.trim(),
    map: "dust2",
    side: f.side,
    targetArea: f.targetArea.trim(),
    difficulty: f.difficulty,
    playerCount: f.playerCount,
    players,
    ...(f.notes.trim() ? { notes: f.notes.trim() } : {}),
  };

  const v = validateScenario(scenario);
  if (!v.ok) for (const e of v.errors) errors.push(`${e.path}: ${e.message}`);
  return errors.length === 0 ? { scenario, errors: [] } : { scenario: null, errors };
}

export function ScenarioEditor() {
  const { scenarios, utilities, upsertScenario, deleteScenario } = useEditableData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [errors, setErrors] = useState<string[]>([]);

  const sortedScenarios = useMemo(
    () => [...scenarios].sort((a, b) => a.id.localeCompare(b.id)),
    [scenarios]
  );

  const startNew = () => {
    setEditingId(null);
    setForm(emptyForm());
    setErrors([]);
  };
  const startEdit = (s: Scenario) => {
    setEditingId(s.id);
    setForm(scenarioToForm(s));
    setErrors([]);
  };
  const cancel = () => {
    setEditingId(null);
    setForm(emptyForm());
    setErrors([]);
  };
  const save = () => {
    const { scenario, errors } = formToScenario(form);
    if (!scenario) {
      setErrors(errors);
      return;
    }
    upsertScenario(scenario);
    cancel();
  };

  // Reconcile player array when playerCount changes.
  const setPlayerCount = (count: 2 | 3 | 4 | 5) => {
    setForm((prev) => {
      const players = [...prev.players];
      while (players.length < count) players.push(freshPlayer(players.length));
      while (players.length > count) players.pop();
      return { ...prev, playerCount: count, players };
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <strong style={{ color: T.textPri, fontSize: 12 }}>Scenarios</strong>
        <span style={{ color: T.textDim, fontSize: 11 }}>· {scenarios.length}</span>
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
        {sortedScenarios.map((s) => (
          <li
            key={s.id}
            style={{
              padding: "6px 8px",
              border: `1px solid ${T.borderLt}`,
              borderRadius: T.radiusSm,
              background: editingId === s.id ? T.bgHover : T.bg,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
            }}
          >
            <span style={{ flex: 1, color: T.textPri }}>{s.name}</span>
            <span style={{ color: T.textDim, fontSize: 10, fontFamily: T.fontMono }}>
              {s.side}·{s.playerCount}
            </span>
            <button
              type="button"
              onClick={() => startEdit(s)}
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
                if (confirm(`Delete scenario "${s.name}"?`)) deleteScenario(s.id);
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

      <ScenarioFormCard
        form={form}
        setForm={setForm}
        setPlayerCount={setPlayerCount}
        errors={errors}
        onSave={save}
        onCancel={cancel}
        isEditing={editingId !== null}
        utilityOptions={utilities}
      />
    </div>
  );
}

interface FormCardProps {
  form: FormState;
  setForm: (f: FormState | ((p: FormState) => FormState)) => void;
  setPlayerCount: (n: 2 | 3 | 4 | 5) => void;
  errors: string[];
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
  utilityOptions: Array<{ id: string; name: string; type: import("../../types/map").UtilityType }>;
}

function ScenarioFormCard({
  form,
  setForm,
  setPlayerCount,
  errors,
  onSave,
  onCancel,
  isEditing,
  utilityOptions,
}: FormCardProps) {
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

  const updatePlayer = (pi: number, mut: (p: FormPlayer) => FormPlayer) =>
    setForm((prev) => ({
      ...prev,
      players: prev.players.map((p, i) => (i === pi ? mut(p) : p)),
    }));

  const addAction = (pi: number) =>
    updatePlayer(pi, (p) => ({
      ...p,
      actions: [
        ...p.actions,
        {
          order: String(p.actions.length + 1),
          utilityId: "",
          description: "",
          timing: "",
        },
      ],
    }));

  const removeAction = (pi: number, ai: number) =>
    updatePlayer(pi, (p) => ({ ...p, actions: p.actions.filter((_, i) => i !== ai) }));

  const updateAction = (pi: number, ai: number, mut: (a: FormPlayer["actions"][number]) => FormPlayer["actions"][number]) =>
    updatePlayer(pi, (p) => ({ ...p, actions: p.actions.map((a, i) => (i === ai ? mut(a) : a)) }));

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
          {isEditing ? "Edit scenario" : "New scenario"}
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
          <div style={labelStyle}>id</div>
          <input style={fieldStyle} value={form.id} onChange={(e) => set("id", e.target.value)} placeholder="a_default_3_man" />
        </div>
        <div>
          <div style={labelStyle}>name</div>
          <input style={fieldStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="A-site default 3-man" />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
        <div>
          <div style={labelStyle}>side</div>
          <select style={fieldStyle} value={form.side} onChange={(e) => set("side", e.target.value as Side)}>
            {SIDES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <div style={labelStyle}>target area</div>
          <input style={fieldStyle} value={form.targetArea} onChange={(e) => set("targetArea", e.target.value)} placeholder="A site" />
        </div>
        <div>
          <div style={labelStyle}>difficulty</div>
          <select style={fieldStyle} value={form.difficulty} onChange={(e) => set("difficulty", e.target.value as ScenarioDifficulty)}>
            {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <div style={labelStyle}>players</div>
          <select
            style={fieldStyle}
            value={String(form.playerCount)}
            onChange={(e) => setPlayerCount(Number(e.target.value) as 2 | 3 | 4 | 5)}
          >
            {PLAYER_COUNTS.map((c) => <option key={c} value={c}>{c}-man</option>)}
          </select>
        </div>
      </div>

      <div>
        <div style={labelStyle}>description</div>
        <textarea
          style={{ ...fieldStyle, minHeight: 50, resize: "vertical" }}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="One-line summary that shows up on the scenario card"
        />
      </div>

      {form.players.map((player, pi) => (
        <PlayerCard
          key={pi}
          index={pi}
          player={player}
          fieldStyle={fieldStyle}
          labelStyle={labelStyle}
          utilityOptions={utilityOptions}
          onMutate={(mut) => updatePlayer(pi, mut)}
          onAddAction={() => addAction(pi)}
          onUpdateAction={(ai, mut) => updateAction(pi, ai, mut)}
          onRemoveAction={(ai) => removeAction(pi, ai)}
        />
      ))}

      <div>
        <div style={labelStyle}>notes</div>
        <textarea
          style={{ ...fieldStyle, minHeight: 40, resize: "vertical" }}
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Optional: round-context, fallback if smoke fails, etc."
        />
      </div>

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
        Save {isEditing ? "changes" : "new scenario"}
      </button>
    </div>
  );
}

interface PlayerCardProps {
  index: number;
  player: FormPlayer;
  fieldStyle: CSSProperties;
  labelStyle: CSSProperties;
  utilityOptions: Array<{ id: string; name: string; type: import("../../types/map").UtilityType }>;
  onMutate: (mut: (p: FormPlayer) => FormPlayer) => void;
  onAddAction: () => void;
  onUpdateAction: (ai: number, mut: (a: FormPlayer["actions"][number]) => FormPlayer["actions"][number]) => void;
  onRemoveAction: (ai: number) => void;
}

function PlayerCard({
  index,
  player,
  fieldStyle,
  labelStyle,
  utilityOptions,
  onMutate,
  onAddAction,
  onUpdateAction,
  onRemoveAction,
}: PlayerCardProps) {
  return (
    <div
      style={{
        border: `1px solid ${T.borderLt}`,
        borderRadius: T.radiusSm,
        padding: 8,
        background: T.bg,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            display: "inline-block",
            width: 12,
            height: 12,
            borderRadius: 999,
            background: player.color,
            border: `1px solid ${T.bgDeep}`,
          }}
        />
        <strong style={{ fontSize: 12, color: T.textPri }}>Player {index + 1}</strong>
        <input
          type="color"
          value={player.color}
          onChange={(e) => onMutate((p) => ({ ...p, color: e.target.value }))}
          style={{
            width: 22,
            height: 22,
            background: "transparent",
            border: `1px solid ${T.borderLt}`,
            borderRadius: 3,
            padding: 0,
            cursor: "pointer",
          }}
          aria-label={`Player ${index + 1} color`}
        />
        <button
          type="button"
          onClick={onAddAction}
          style={{
            marginLeft: "auto",
            background: T.accentBg,
            color: T.accent,
            border: `1px solid ${T.accent}55`,
            borderRadius: 3,
            padding: "2px 6px",
            fontSize: 10,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + Action
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        <div>
          <div style={labelStyle}>label</div>
          <input
            style={fieldStyle}
            value={player.label}
            onChange={(e) => onMutate((p) => ({ ...p, label: e.target.value }))}
          />
        </div>
        <div>
          <div style={labelStyle}>role</div>
          <input
            style={fieldStyle}
            value={player.role}
            onChange={(e) => onMutate((p) => ({ ...p, role: e.target.value }))}
            placeholder="entry · support · lurk"
          />
        </div>
      </div>

      {player.actions.length === 0 ? (
        <div style={{ fontSize: 11, color: T.textDim, fontStyle: "italic" }}>
          No actions yet — click <strong>+ Action</strong> to assign a utility.
        </div>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
          {player.actions.map((action, ai) => {
            const u = utilityOptions.find((o) => o.id === action.utilityId);
            return (
              <li
                key={ai}
                style={{
                  display: "grid",
                  gridTemplateColumns: "50px 1fr auto",
                  gap: 4,
                  padding: 4,
                  border: `1px solid ${T.borderLt}`,
                  borderRadius: 3,
                  background: T.bgPanel,
                }}
              >
                <input
                  style={{ ...fieldStyle, padding: "4px 6px" }}
                  value={action.order}
                  onChange={(e) => onUpdateAction(ai, (a) => ({ ...a, order: e.target.value }))}
                  placeholder="#"
                />
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {u && <UtilityIcon type={u.type} size={12} />}
                    <select
                      style={{ ...fieldStyle, padding: "4px 6px" }}
                      value={action.utilityId}
                      onChange={(e) => onUpdateAction(ai, (a) => ({ ...a, utilityId: e.target.value }))}
                    >
                      <option value="">— pick utility —</option>
                      {utilityOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          [{opt.type}] {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 4 }}>
                    <input
                      style={{ ...fieldStyle, padding: "4px 6px", fontFamily: T.fontMono, fontSize: 11 }}
                      value={action.timing}
                      onChange={(e) => onUpdateAction(ai, (a) => ({ ...a, timing: e.target.value }))}
                      placeholder="t+0s"
                    />
                    <input
                      style={{ ...fieldStyle, padding: "4px 6px" }}
                      value={action.description}
                      onChange={(e) => onUpdateAction(ai, (a) => ({ ...a, description: e.target.value }))}
                      placeholder="optional cue / call"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveAction(ai)}
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
            );
          })}
        </ul>
      )}
    </div>
  );
}
