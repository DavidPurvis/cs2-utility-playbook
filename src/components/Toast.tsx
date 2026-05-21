/**
 * Single global toast container.
 *
 * Stateless. The parent (App.tsx) owns the toast state via
 * `useState<ToastState | null>` and uses `useEffect` keyed on the
 * toast's `id` to schedule auto-dismiss. This avoids
 * `set-state-in-effect` inside the Toast component itself; the
 * parent's effect is fine because it synchronizes the toast state
 * with an external system (the setTimeout).
 *
 * `aria-live="polite"` so screen readers announce without
 * interrupting current speech.
 */
import { T } from "../theme";

export type ToastState = { kind: "ok" | "error"; msg: string; id: number } | null;

export interface ToastProps {
  state: ToastState;
}

export function Toast({ state }: ToastProps) {
  if (!state) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        padding: "10px 16px",
        background: state.kind === "ok" ? T.successBg : T.dangerBg,
        color: state.kind === "ok" ? T.success : T.danger,
        border: `1px solid ${state.kind === "ok" ? T.success : T.danger}55`,
        borderRadius: T.radius,
        fontSize: 13,
        fontFamily: T.fontUI,
        fontWeight: 600,
        boxShadow: T.shadowMd,
        maxWidth: "calc(100vw - 32px)",
      }}
    >
      {state.msg}
    </div>
  );
}
