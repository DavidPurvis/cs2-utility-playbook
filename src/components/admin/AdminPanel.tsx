import { useState, type ReactNode } from "react";
import { useAdminMode } from "../../hooks/useAdminMode";
import { useViewport } from "../../hooks/useViewport";
import { T } from "../../theme";

type PanelTab = "utilities" | "scenarios" | "calibration" | "data";

const TABS: Array<{ id: PanelTab; label: string }> = [
  { id: "utilities", label: "Utilities" },
  { id: "scenarios", label: "Scenarios" },
  { id: "calibration", label: "Calibration" },
  { id: "data", label: "Data" },
];

interface Slots {
  utilities: ReactNode;
  scenarios: ReactNode;
  calibration: ReactNode;
  data: ReactNode;
}

export interface AdminPanelProps {
  slots: Partial<Slots>;
}

/**
 * Floating right-side panel that appears whenever admin mode is on.
 * Hosts four tabs the user populates in later phases. Phase 4 ships
 * the shell with placeholder content; phases 5-8 fill the slots in.
 */
export function AdminPanel({ slots }: AdminPanelProps) {
  const { isAdmin, logout } = useAdminMode();
  const { isMobile } = useViewport();
  const [tab, setTab] = useState<PanelTab>("utilities");
  const [collapsed, setCollapsed] = useState(false);

  if (!isAdmin) return null;

  const content =
    tab === "utilities" ? slots.utilities :
    tab === "scenarios" ? slots.scenarios :
    tab === "calibration" ? slots.calibration :
    slots.data;

  return (
    <aside
      style={
        isMobile && !collapsed
          ? {
              position: "fixed",
              left: 8,
              right: 8,
              bottom: 8,
              top: "auto",
              maxHeight: "70vh",
              background: T.bgPanel,
              border: `1px solid ${T.accent}55`,
              borderRadius: T.radius,
              boxShadow: "0 -12px 28px rgba(0,0,0,0.55)",
              color: T.textPri,
              fontFamily: T.fontUI,
              display: "flex",
              flexDirection: "column",
              zIndex: 40,
              overflow: "hidden",
            }
          : {
              position: "fixed",
              top: isMobile ? "auto" : 80,
              right: isMobile ? 8 : 16,
              bottom: isMobile ? 8 : undefined,
              width: collapsed ? 56 : 360,
              maxWidth: "calc(100vw - 32px)",
              maxHeight: isMobile ? undefined : "calc(100vh - 96px)",
              background: T.bgPanel,
              border: `1px solid ${T.accent}55`,
              borderRadius: T.radius,
              boxShadow: "0 12px 28px rgba(0,0,0,0.45)",
              color: T.textPri,
              fontFamily: T.fontUI,
              display: "flex",
              flexDirection: "column",
              zIndex: 40,
              overflow: "hidden",
            }
      }
    >
      <header
        style={{
          padding: "10px 12px",
          background: T.accentBg,
          borderBottom: `1px solid ${T.accent}33`,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: T.accent,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            flex: 1,
          }}
        >
          {collapsed ? "Adm" : "Admin mode"}
        </span>
        {!collapsed && (
          <button
            type="button"
            onClick={logout}
            title="Log out of admin mode"
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: T.textDim,
              background: "transparent",
              border: `1px solid ${T.borderLt}`,
              borderRadius: T.radiusSm,
              padding: "3px 7px",
              cursor: "pointer",
            }}
          >
            Log out
          </button>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? "Expand" : "Collapse"}
          aria-label={collapsed ? "Expand admin panel" : "Collapse admin panel"}
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: T.accent,
            background: "transparent",
            border: `1px solid ${T.accent}55`,
            borderRadius: T.radiusSm,
            padding: "1px 7px",
            cursor: "pointer",
            minWidth: 24,
          }}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </header>

      {!collapsed && (
        <>
          <nav
            role="tablist"
            style={{
              display: "flex",
              gap: 0,
              borderBottom: `1px solid ${T.border}`,
              background: T.bg,
            }}
          >
            {TABS.map((t) => {
              const active = t.id === tab;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  style={{
                    flex: 1,
                    background: "transparent",
                    color: active ? T.accent : T.textSec,
                    border: "none",
                    borderBottom: active ? `2px solid ${T.accent}` : `2px solid transparent`,
                    padding: "10px 6px",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    cursor: "pointer",
                    fontFamily: T.fontUI,
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </nav>
          <div
            role="tabpanel"
            style={{
              padding: 12,
              overflow: "auto",
              fontSize: 13,
              lineHeight: 1.5,
              color: T.textSec,
            }}
          >
            {content ?? (
              <div style={{ color: T.textDim, fontSize: 12 }}>
                {tab[0]!.toUpperCase() + tab.slice(1)} editor ships in a later phase.
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
