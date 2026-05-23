/**
 * App header: title + breadcrumb trail to the current view.
 *
 * Breadcrumb behavior:
 *   - "Dust 2 Playbook" is always present; clicking dispatches GO_HOME.
 *   - When inside a scenario, the scenario name appears as the second
 *     crumb, clickable → dispatches BACK to scenario (a no-op if already
 *     there).
 *   - When inside a lineup, both scenario + lineup name are visible.
 */
import { T } from "../theme";

export interface HeaderProps {
  /** Each entry: { label, onClick? }. onClick === undefined → not clickable (current view). */
  crumbs: Array<{ label: string; onClick?: () => void }>;
}

export function Header({ crumbs }: HeaderProps) {
  return (
    <header
      style={{
        padding: "14px 24px",
        borderBottom: `1px solid ${T.border}`,
        background: T.bg,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <nav aria-label="breadcrumb" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <span key={c.label} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              {c.onClick && !isLast ? (
                <button
                  type="button"
                  onClick={c.onClick}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    color: T.textSec,
                    cursor: "pointer",
                    fontSize: i === 0 ? 17 : 14,
                    fontWeight: i === 0 ? 800 : 600,
                    fontFamily: T.fontUI,
                    letterSpacing: i === 0 ? -0.2 : 0,
                  }}
                >
                  {c.label}
                </button>
              ) : (
                <span
                  style={{
                    color: T.textPri,
                    fontSize: i === 0 ? 17 : 14,
                    fontWeight: i === 0 ? 800 : 600,
                  }}
                >
                  {c.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden style={{ color: T.textMute, fontSize: 13 }}>›</span>
              )}
            </span>
          );
        })}
      </nav>
    </header>
  );
}
