import { WARMUP, TRAINING, TOOL_COLORS } from "../data/training.js";
import { T } from "../lib/theme.js";

function ToolBadge({ tool }) {
  const color = TOOL_COLORS[tool] || T.textSec;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 10,
        fontWeight: 800,
        color,
        background: color + "15",
        border: `1px solid ${color}30`,
        borderRadius: 3,
        padding: "2px 7px",
        letterSpacing: 0.5,
      }}
    >
      {tool}
    </span>
  );
}

function ExerciseLaunchLink({ href }) {
  const steam = href.startsWith("steam:");
  return (
    <a
      href={href}
      {...(steam ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 12px",
        background: T.accent + "15",
        border: `1px solid ${T.accent}40`,
        borderRadius: T.radiusSm,
        color: T.accent,
        fontSize: 10,
        fontWeight: 800,
        textDecoration: "none",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      LAUNCH
    </a>
  );
}

export function TrainingView() {
  return (
    <div style={{ padding: "0 14px", maxWidth: 720, margin: "0 auto", paddingBottom: 32 }}>
      <div style={{ marginTop: 16 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 900,
            color: T.textDim,
            textTransform: "uppercase",
            letterSpacing: 2,
            marginBottom: 10,
          }}
        >
          Warmup — before you queue
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {WARMUP.map((ex) => (
            <div
              key={ex.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: 6,
              }}
            >
              <ToolBadge tool={ex.tool} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.textPri }}>{ex.name}</div>
                <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>{ex.note}</div>
              </div>
              <span style={{ fontSize: 11, color: T.textMute, whiteSpace: "nowrap", flexShrink: 0 }}>
                {ex.duration}
              </span>
              <ExerciseLaunchLink href={ex.launch} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 900,
            color: T.textDim,
            textTransform: "uppercase",
            letterSpacing: 2,
            marginBottom: 10,
          }}
        >
          Training — dedicated sessions
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {TRAINING.map((ex) => (
            <div
              key={ex.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: 6,
              }}
            >
              <ToolBadge tool={ex.tool} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.textPri }}>{ex.name}</div>
                <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>{ex.note}</div>
              </div>
              <span style={{ fontSize: 11, color: T.textMute, whiteSpace: "nowrap", flexShrink: 0 }}>
                {ex.duration}
              </span>
              <ExerciseLaunchLink href={ex.launch} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
