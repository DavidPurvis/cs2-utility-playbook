import { Component } from "react";
import { T } from "../lib/theme.js";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, info?.componentStack);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 12,
            background: T.bgPanel,
            border: `1px solid ${T.danger}`,
            borderRadius: T.radius,
            color: T.danger,
            fontSize: 12,
          }}
        >
          <strong>Something broke in this section.</strong>
          {import.meta.env.DEV && (
            <div style={{ marginTop: 4, color: T.textSec, fontSize: 11 }}>
              {String(this.state.error?.message || this.state.error)}
            </div>
          )}
          {!import.meta.env.DEV && (
            <div style={{ marginTop: 4, color: T.textSec, fontSize: 11 }}>
              Try again or reload the page. If it keeps happening, report it to your team lead.
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
              background: T.bg,
              border: `1px solid ${T.borderAlt}`,
              borderRadius: T.radiusSm,
              color: T.textPri,
            }}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
