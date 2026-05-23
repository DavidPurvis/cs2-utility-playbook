import { Component, type ErrorInfo, type ReactNode } from "react";
import { T } from "../theme";

interface Props {
  children: ReactNode;
  /** Optional label shown in the fallback: "Something broke in {label}." */
  label?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches uncaught render errors and shows a themed fallback.
 *
 * Previously hardcoded a v5-era dark-theme palette (#0a0e15 bg etc.)
 * which clashed visibly on the cream app. 2026-05 audit fix: imports
 * theme tokens from T.
 *
 * Retry-button policy: the most likely failure mode is the boot-time
 * `assertDustData` throw from `loadDust2.ts` — re-mounting the same
 * children re-throws the same error. So in PROD we hide the Retry
 * button and ask the user to reload (which would clear any transient
 * state). In DEV we keep Retry visible because failures during local
 * iteration are often state-dependent and Retry is fine.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, info?.componentStack);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    if (typeof window !== "undefined") window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    const isDev = import.meta.env.DEV;
    return (
      <div
        role="alert"
        style={{
          padding: 16,
          background: T.dangerBg,
          border: `1px solid ${T.danger}`,
          borderRadius: T.radius,
          color: T.danger,
          fontSize: 13,
          fontFamily: T.fontUI,
          maxWidth: 720,
          margin: "20px auto",
        }}
      >
        <strong style={{ fontSize: 15, display: "block" }}>
          Something broke{this.props.label ? ` in ${this.props.label}` : ""}.
        </strong>
        {isDev ? (
          <pre
            style={{
              marginTop: 8,
              color: T.textSec,
              fontSize: 11,
              fontFamily: T.fontMono,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {String(this.state.error?.message ?? this.state.error)}
          </pre>
        ) : (
          <div style={{ marginTop: 8, color: T.textSec, fontSize: 12, lineHeight: 1.5 }}>
            Please reload the page. If the issue persists, the data file
            may need attention.
          </div>
        )}
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              background: T.bgPanel,
              border: `1px solid ${T.danger}55`,
              borderRadius: T.radiusSm,
              color: T.danger,
              fontFamily: T.fontUI,
            }}
          >
            Reload page
          </button>
          {isDev && (
            <button
              type="button"
              onClick={this.handleRetry}
              style={{
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                background: "transparent",
                border: `1px solid ${T.border}`,
                borderRadius: T.radiusSm,
                color: T.textSec,
                fontFamily: T.fontUI,
              }}
            >
              Retry (dev)
            </button>
          )}
        </div>
      </div>
    );
  }
}
