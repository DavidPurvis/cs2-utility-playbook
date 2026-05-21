import { useState, type FormEvent } from "react";
import { useAdminMode } from "../../hooks/useAdminMode";
import { T } from "../../theme";

/**
 * Password prompt that opens when the user clicks the footer "Admin"
 * link OR visits with `?admin=1`. On success, admin mode flips on for
 * the rest of the tab session.
 */
export function AdminGate() {
  const { promptOpen, loginError, login, closePrompt } = useAdminMode();
  const [value, setValue] = useState("");

  if (!promptOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ok = login(value);
    if (ok) setValue("");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Enter admin password"
      onClick={closePrompt}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(6,10,16,0.78)",
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: T.bgPanel,
          border: `1px solid ${T.borderAlt}`,
          borderRadius: T.radius,
          padding: 22,
          width: "100%",
          maxWidth: 360,
          color: T.textPri,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 10, color: T.textDim, letterSpacing: 1.5, textTransform: "uppercase" }}>
            Admin
          </div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Enter password</div>
        </div>
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="password"
          style={{
            padding: "10px 12px",
            background: T.bg,
            border: `1px solid ${T.borderLt}`,
            borderRadius: T.radiusSm,
            color: T.textPri,
            fontSize: 14,
            fontFamily: T.fontUI,
            outline: "none",
          }}
        />
        {loginError && (
          <div style={{ color: T.danger, fontSize: 12 }}>{loginError}</div>
        )}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={closePrompt}
            style={{
              padding: "8px 14px",
              background: "transparent",
              color: T.textSec,
              border: `1px solid ${T.borderLt}`,
              borderRadius: T.radiusSm,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              padding: "8px 14px",
              background: T.accentBg,
              color: T.accent,
              border: `1px solid ${T.accent}55`,
              borderRadius: T.radiusSm,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Unlock
          </button>
        </div>
        <div style={{ fontSize: 11, color: T.textDim, marginTop: 4 }}>
          This isn't real security — it's a misclick gate. The password lives in the source bundle.
        </div>
      </form>
    </div>
  );
}
