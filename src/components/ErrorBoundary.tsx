import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const colors = {
  bg: "#0a0e15",
  bgPanel: "#11161f",
  border: "#2d364a",
  danger: "#ef5969",
  textPri: "#e6ebf2",
  textSec: "#a3afc1",
};

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

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div
        style={{
          padding: 12,
          background: colors.bgPanel,
          border: `1px solid ${colors.danger}`,
          borderRadius: 8,
          color: colors.danger,
          fontSize: 12,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <strong>Something broke in this section.</strong>
        {import.meta.env.DEV ? (
          <div style={{ marginTop: 4, color: colors.textSec, fontSize: 11 }}>
            {String(this.state.error?.message ?? this.state.error)}
          </div>
        ) : (
          <div style={{ marginTop: 4, color: colors.textSec, fontSize: 11 }}>
            Reload the page or click Retry. If it keeps happening, file an issue.
          </div>
        )}
        <button
          type="button"
          onClick={this.handleRetry}
          style={{
            marginTop: 8,
            padding: "6px 12px",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            background: colors.bg,
            border: `1px solid ${colors.border}`,
            borderRadius: 4,
            color: colors.textPri,
          }}
        >
          Retry
        </button>
      </div>
    );
  }
}
