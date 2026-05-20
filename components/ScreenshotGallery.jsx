import { useState } from "react";
import { T } from "../lib/theme.js";
import { withYouTubeTimestamp } from "../lib/youtube.js";
import { normalizeAustincs, normalizeExtraSources } from "../lib/lineupMedia.js";

function GalleryImage({ url, label }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        style={{
          width: 200,
          height: 113,
          borderRadius: 6,
          border: `1px solid ${T.borderAlt}`,
          background: T.bgDeep,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: T.textMute,
          fontSize: 11,
        }}
      >
        Image unavailable
      </div>
    );
  }
  return (
    <div
      style={{
        width: 200,
        height: 113,
        borderRadius: 6,
        overflow: "hidden",
        border: `1px solid ${T.borderAlt}`,
        position: "relative",
        background: T.bgDeep,
      }}
    >
      <img
        src={url}
        alt={label}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        loading="lazy"
        onError={() => setFailed(true)}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(transparent,#000a)",
          padding: "10px 6px 4px",
          fontSize: 9,
          fontWeight: 700,
          color: "#ffffffaa",
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {label === "stand" ? "📍 Stand" : label === "aim" ? "🎯 Aim" : "✅ Result"}
      </div>
    </div>
  );
}

const stopLinkBubble = (e) => e.stopPropagation();

export function ScreenshotGallery({ screenshots, source, video, austincs, lineup }) {
  const imgs = Object.entries(screenshots || {}).filter(([, v]) => v);
  const sources = normalizeExtraSources(lineup || { source });
  const austin = normalizeAustincs(austincs);
  const hasAustin = !!austin.video;
  const hasLinks = sources.length > 0 || !!video || hasAustin;
  const noScreenshots = imgs.length === 0;

  if (noScreenshots && !hasLinks) return null;

  return (
    <div style={{ marginTop: 10 }} onClick={stopLinkBubble}>
      {imgs.length > 0 ? (
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6 }}>
          {imgs.map(([label, url]) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={stopLinkBubble}
              style={{ flexShrink: 0 }}
            >
              <GalleryImage url={url} label={label} />
            </a>
          ))}
        </div>
      ) : (
        hasLinks && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 10px",
              background: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: 6,
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 11, color: T.textDim }}>No screenshot yet</span>
            {video && (
              <a
                href={video}
                target="_blank"
                rel="noopener noreferrer"
                onClick={stopLinkBubble}
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: T.danger,
                  textDecoration: "none",
                  background: `${T.danger}10`,
                  border: `1px solid ${T.danger}22`,
                  borderRadius: 3,
                  padding: "3px 7px",
                }}
              >
                ▶ Watch video instead
              </a>
            )}
          </div>
        )
      )}
      {hasLinks && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: imgs.length > 0 ? 4 : 0 }}>
          {video && imgs.length > 0 && (
            <a
              href={video}
              target="_blank"
              rel="noopener noreferrer"
              onClick={stopLinkBubble}
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: T.danger,
                textDecoration: "none",
                background: `${T.danger}10`,
                border: `1px solid ${T.danger}22`,
                borderRadius: 3,
                padding: "3px 7px",
              }}
            >
              ▶ Watch on YouTube
            </a>
          )}
          {sources.map((s) =>
            s.url ? (
              <a
                key={`${s.name}-${s.url}`}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={stopLinkBubble}
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: T.ctSide,
                  textDecoration: "none",
                  background: `${T.ctSide}10`,
                  border: `1px solid ${T.ctSide}22`,
                  borderRadius: 3,
                  padding: "3px 7px",
                }}
              >
                📸 {s.name}
              </a>
            ) : (
              <span
                key={s.name}
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: T.textDim,
                  background: T.bgCard,
                  border: `1px solid ${T.borderLt}`,
                  borderRadius: 3,
                  padding: "3px 7px",
                }}
              >
                📸 {s.name}
              </span>
            )
          )}
          {hasAustin && (
            <a
              href={withYouTubeTimestamp(austin.video, austin.timestamp)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={stopLinkBubble}
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#ff8844",
                textDecoration: "none",
                background: "#ff884410",
                border: "1px solid #ff884422",
                borderRadius: 3,
                padding: "3px 7px",
              }}
            >
              🎬 AustinCS{austin.timestamp ? ` @ ${austin.timestamp}` : ""}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
