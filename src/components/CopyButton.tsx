/**
 * Clipboard-copy button with graceful degradation.
 *
 * Tries `navigator.clipboard.writeText` first (HTTPS / localhost). If
 * that throws (e.g. dev on a LAN IP, or denied permission), falls back
 * to the legacy `document.execCommand("copy")` via a temporary hidden
 * textarea. If both fail, surfaces an error toast with the text still
 * shown so the user can copy it manually.
 *
 * The button doesn't render its own toast; instead it calls
 * `onResult` which lets the parent (App.tsx) dispatch to its global
 * Toast. This keeps the toast singleton consistent.
 */
import type { MouseEvent as ReactMouseEvent } from "react";
import { T } from "../theme";

export type CopyResult = "ok" | "fallback" | "error";

async function copyWithFallback(text: string): Promise<CopyResult> {
  try {
    await navigator.clipboard.writeText(text);
    return "ok";
  } catch {
    // fall through
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok ? "fallback" : "error";
  } catch {
    return "error";
  }
}

export interface CopyButtonProps {
  text: string;
  label?: string;
  onResult: (result: CopyResult, text: string) => void;
}

export function CopyButton({ text, label = "Copy setpos", onResult }: CopyButtonProps) {
  const onClick = async (e: ReactMouseEvent) => {
    // If nested inside a clickable card, don't trigger the card's onClick too.
    e.stopPropagation();
    const result = await copyWithFallback(text);
    onResult(result, text);
  };
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: T.accentBg,
        color: T.accentDk,
        border: `1px solid ${T.accent}55`,
        borderRadius: T.radiusSm,
        padding: "6px 12px",
        fontSize: 11,
        fontFamily: T.fontMono,
        fontWeight: 700,
        cursor: "pointer",
        transition: `background ${T.transitionFast}, transform ${T.transitionFast}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = T.accent;
        e.currentTarget.style.color = "#FFFFFF";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = T.accentBg;
        e.currentTarget.style.color = T.accentDk;
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = `2px solid ${T.accent}`;
        e.currentTarget.style.outlineOffset = "2px";
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = "none";
      }}
    >
      {label}
    </button>
  );
}
