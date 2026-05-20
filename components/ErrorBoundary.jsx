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
    if (import.meta.env?.DEV) {
      console.error("[ErrorBoundary]", error, info?.componentStack);
    }
  }

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
          {import.meta.env?.DEV && (
            <div style={{ marginTop: 4, color: T.textSec, fontSize: 11 }}>
              {String(this.state.error?.message || this.state.error)}
            </div>
          )}
          {!import.meta.env?.DEV && (
            <div style={{ marginTop: 4, color: T.textSec, fontSize: 11 }}>
              Reload the page or switch maps. If it keeps happening, report it to your team lead.
            </div>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
