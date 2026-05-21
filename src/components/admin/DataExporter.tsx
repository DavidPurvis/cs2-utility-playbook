/**
 * Admin panel data tab — bundle export, individual file export, JSON
 * import, and override resets. This is the only way edits get out of
 * localStorage and into the repo: the user exports, drops the file(s)
 * into src/data/maps/dust2/, commits, and pushes. The next deploy bakes
 * them into the shipped JSON.
 */
import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { useEditableData } from "../../hooks/useEditableData";
import { validateBundle } from "../../utils/schemas";
import { readOverride, type FileKey } from "../../utils/storage";
import { T } from "../../theme";
import type {
  MapConfig,
  MapDataBundle,
  Scenario,
  Spawn,
  Utility,
} from "../../types/map";

type FileRecord = {
  key: FileKey;
  label: string;
  filename: string;
  bundleKey: keyof MapDataBundle;
};

const FILES: FileRecord[] = [
  { key: "dust2-map-config", label: "Map config",  filename: "map-config.json", bundleKey: "config"    },
  { key: "dust2-spawns",     label: "Spawns",      filename: "spawns.json",     bundleKey: "spawns"    },
  { key: "dust2-utilities",  label: "Utilities",   filename: "utilities.json",  bundleKey: "utilities" },
  { key: "dust2-scenarios",  label: "Scenarios",   filename: "scenarios.json",  bundleKey: "scenarios" },
];

function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2) + "\n"], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

interface BundleShape {
  config: MapConfig;
  spawns: Spawn[];
  utilities: Utility[];
  scenarios: Scenario[];
}

export function DataExporter() {
  const { config, spawns, utilities, scenarios, importBundle, resetAll, resetFile } =
    useEditableData();
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<{ kind: "ok" | "err"; message: string } | null>(null);
  const [dirtyTick, setDirtyTick] = useState(0); // re-read overrides after resets

  const bundle: BundleShape = useMemo(
    () => ({ config, spawns, utilities, scenarios }),
    [config, spawns, utilities, scenarios]
  );

  const dirty = useMemo(() => {
    void dirtyTick; // include in deps so a reset re-evaluates
    const out: Record<FileKey, boolean> = {
      "dust2-map-config": readOverride("dust2-map-config") !== null,
      "dust2-spawns": readOverride("dust2-spawns") !== null,
      "dust2-utilities": readOverride("dust2-utilities") !== null,
      "dust2-scenarios": readOverride("dust2-scenarios") !== null,
    };
    return out;
  }, [dirtyTick]);

  const onExportBundle = () => {
    downloadJson("dust2-bundle.json", bundle);
    setStatus({ kind: "ok", message: "Downloaded dust2-bundle.json" });
  };

  const onExportFile = (f: FileRecord) => {
    downloadJson(f.filename, bundle[f.bundleKey]);
    setStatus({ kind: "ok", message: `Downloaded ${f.filename}` });
  };

  const onPickImport = () => fileInput.current?.click();

  const onImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset so the same file can be picked again
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      // Two accepted shapes:
      //   - Full bundle: { config?, spawns?, utilities?, scenarios? }
      //   - Single file: an array (spawns/utilities/scenarios) or a
      //     config record. We disambiguate by filename.
      let candidate: Partial<BundleShape>;
      if (Array.isArray(parsed)) {
        const lower = file.name.toLowerCase();
        if (lower.includes("spawn")) candidate = { spawns: parsed as Spawn[] };
        else if (lower.includes("utilit")) candidate = { utilities: parsed as Utility[] };
        else if (lower.includes("scenario")) candidate = { scenarios: parsed as Scenario[] };
        else {
          setStatus({
            kind: "err",
            message: `Array JSON file "${file.name}" doesn't include spawn/utilit/scenario in its name — rename it or paste into the bundle file instead.`,
          });
          return;
        }
      } else if (parsed && typeof parsed === "object") {
        const obj = parsed as Record<string, unknown>;
        if ("config" in obj || "spawns" in obj || "utilities" in obj || "scenarios" in obj) {
          candidate = obj as Partial<BundleShape>;
        } else {
          // Treat as a bare map-config file.
          candidate = { config: obj as unknown as MapConfig };
        }
      } else {
        setStatus({ kind: "err", message: "JSON must be an object or an array" });
        return;
      }

      const validation = validateBundle(candidate);
      if (!validation.ok) {
        setStatus({
          kind: "err",
          message: `Schema check failed: ${validation.errors.slice(0, 3).map((er) => `${er.path}: ${er.message}`).join(" · ")}${
            validation.errors.length > 3 ? ` …(+${validation.errors.length - 3} more)` : ""
          }`,
        });
        return;
      }
      importBundle(candidate);
      setDirtyTick((t) => t + 1);
      const keys = Object.keys(candidate).filter((k) => (candidate as Record<string, unknown>)[k] !== undefined);
      setStatus({ kind: "ok", message: `Imported ${keys.join(", ")} from ${file.name}` });
    } catch (err) {
      setStatus({ kind: "err", message: `Could not parse JSON: ${(err as Error).message}` });
    }
  };

  const onResetAll = () => {
    if (!confirm("Reset every override back to shipped JSON? Unsaved admin edits will be lost.")) return;
    resetAll();
    setDirtyTick((t) => t + 1);
    setStatus({ kind: "ok", message: "Reset all files to shipped JSON" });
  };

  const onResetFile = (f: FileRecord) => {
    if (!confirm(`Reset ${f.label} back to shipped JSON?`)) return;
    resetFile(f.key);
    setDirtyTick((t) => t + 1);
    setStatus({ kind: "ok", message: `Reset ${f.label}` });
  };

  const dirtyCount = Object.values(dirty).filter(Boolean).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 11, color: T.textDim, lineHeight: 1.5 }}>
        Export the bundle, drop the file(s) into{" "}
        <code style={{ color: T.accent }}>src/data/maps/dust2/</code>, commit, push.
      </div>

      <div
        style={{
          padding: 8,
          background: dirtyCount > 0 ? T.accentBg : T.bgPanel,
          border: `1px solid ${dirtyCount > 0 ? T.accent + "55" : T.borderLt}`,
          borderRadius: T.radiusSm,
          fontSize: 11,
          color: dirtyCount > 0 ? T.accent : T.textDim,
        }}
      >
        {dirtyCount === 0 ? (
          <>No unsaved overrides — every file matches the shipped JSON.</>
        ) : (
          <strong>{dirtyCount} file(s) have unsaved overrides — export before closing.</strong>
        )}
      </div>

      <button
        type="button"
        onClick={onExportBundle}
        style={{
          background: T.accent,
          color: "#001018",
          border: "none",
          borderRadius: T.radiusSm,
          padding: "8px 12px",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Export bundle (dust2-bundle.json)
      </button>

      <div style={{ fontSize: 10, color: T.textDim, letterSpacing: 0.4, textTransform: "uppercase" }}>
        Export individual files
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        {FILES.map((f) => (
          <li
            key={f.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 8px",
              border: `1px solid ${T.borderLt}`,
              borderRadius: T.radiusSm,
              background: T.bg,
              fontSize: 12,
            }}
          >
            <span
              aria-hidden
              title={dirty[f.key] ? "Has unsaved override" : "Matches shipped JSON"}
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: 999,
                background: dirty[f.key] ? T.accent : T.borderAlt,
              }}
            />
            <span style={{ flex: 1, color: T.textPri }}>{f.label}</span>
            <code style={{ color: T.textDim, fontSize: 10, fontFamily: T.fontMono }}>{f.filename}</code>
            <button
              type="button"
              onClick={() => onExportFile(f)}
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
              Export
            </button>
            <button
              type="button"
              onClick={() => onResetFile(f)}
              disabled={!dirty[f.key]}
              style={{
                background: "transparent",
                color: dirty[f.key] ? T.danger : T.textDim,
                border: `1px solid ${dirty[f.key] ? T.danger + "55" : T.borderLt}`,
                borderRadius: 3,
                padding: "2px 6px",
                fontSize: 10,
                cursor: dirty[f.key] ? "pointer" : "default",
              }}
            >
              Reset
            </button>
          </li>
        ))}
      </ul>

      <div style={{ fontSize: 10, color: T.textDim, letterSpacing: 0.4, textTransform: "uppercase", marginTop: 4 }}>
        Import
      </div>
      <input
        ref={fileInput}
        type="file"
        accept=".json,application/json"
        onChange={onImport}
        style={{ display: "none" }}
      />
      <button
        type="button"
        onClick={onPickImport}
        style={{
          background: T.bgPanel,
          color: T.accent,
          border: `1px solid ${T.accent}55`,
          borderRadius: T.radiusSm,
          padding: "8px 12px",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Import JSON file…
      </button>

      <button
        type="button"
        onClick={onResetAll}
        disabled={dirtyCount === 0}
        style={{
          background: "transparent",
          color: dirtyCount === 0 ? T.textDim : T.danger,
          border: `1px solid ${dirtyCount === 0 ? T.borderLt : T.danger + "55"}`,
          borderRadius: T.radiusSm,
          padding: "8px 12px",
          fontSize: 12,
          fontWeight: 700,
          cursor: dirtyCount === 0 ? "default" : "pointer",
        }}
      >
        Reset all overrides
      </button>

      {status && (
        <div
          role="status"
          style={{
            fontSize: 11,
            padding: 6,
            background: status.kind === "ok" ? T.accentBg : T.bgPanel,
            border: `1px solid ${status.kind === "ok" ? T.accent + "55" : T.danger + "55"}`,
            color: status.kind === "ok" ? T.accent : T.danger,
            borderRadius: T.radiusSm,
            fontFamily: T.fontMono,
            wordBreak: "break-word",
          }}
        >
          {status.message}
        </div>
      )}
    </div>
  );
}
