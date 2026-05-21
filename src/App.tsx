import { useCallback, useRef, useState, type ReactNode } from "react";
import { T } from "./theme";
import { Tabs, type TabDef } from "./components/Tabs";
import { SpawnMap } from "./components/SpawnMap";
import { useMapData } from "./hooks/useMapData";
import { AdminProvider, useAdminMode } from "./hooks/useAdminMode";
import { EditableDataProvider, useEditableData } from "./hooks/useEditableData";
import { AdminGate } from "./components/admin/AdminGate";
import { AdminPanel } from "./components/admin/AdminPanel";
import { UtilityEditor, type UtilityEditorHandle } from "./components/admin/UtilityEditor";

function ScenariosTabPlaceholder() {
  const { scenarios } = useEditableData();
  return (
    <div
      style={{
        padding: 24,
        background: T.bgPanel,
        border: `1px dashed ${T.borderLt}`,
        borderRadius: T.radius,
        color: T.textDim,
        fontSize: 13,
        lineHeight: 1.6,
      }}
    >
      <h2 style={{ margin: 0, marginBottom: 6, fontSize: 16, color: T.textPri }}>
        Scenarios coming soon{" "}
        <span style={{ color: T.textDim, fontWeight: 400 }}>· {scenarios.length}</span>
      </h2>
      Wire-up for the Scenarios feature lands in Phase 6. For now, the data layer ships an empty
      list (<code style={{ color: T.accent }}>src/data/maps/dust2/scenarios.json</code>) you can
      populate via admin mode once the Scenario editor ships.
    </div>
  );
}

function AdminFooterLink() {
  const { isAdmin, openPrompt } = useAdminMode();
  return (
    <button
      type="button"
      onClick={openPrompt}
      title={isAdmin ? "Already in admin mode" : "Enter admin mode"}
      style={{
        background: "transparent",
        border: "none",
        color: isAdmin ? T.accent : T.textDim,
        cursor: "pointer",
        fontSize: 11,
        fontFamily: T.fontMono,
        letterSpacing: 0.3,
        textDecoration: "underline",
        padding: 0,
      }}
    >
      {isAdmin ? "admin · on" : "admin"}
    </button>
  );
}

function ClickToPlaceBanner() {
  return (
    <div
      role="status"
      style={{
        marginBottom: 10,
        padding: "8px 12px",
        background: T.accentBg,
        border: `1px solid ${T.accent}55`,
        borderRadius: T.radiusSm,
        color: T.accent,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.4,
        textAlign: "center",
      }}
    >
      Click anywhere on the radar to set the landing position.
    </div>
  );
}

function AppInner() {
  const { isAdmin } = useAdminMode();
  const { config, spawns } = useEditableData();

  // Admin click-to-place wiring: the editor toggles clickPlace on, the
  // user clicks the radar, and we hand the percent coords straight to
  // the editor's imperative handle (no transient prop, no effect cascade).
  const [clickPlace, setClickPlace] = useState(false);
  const editorRef = useRef<UtilityEditorHandle | null>(null);

  const handleMapClick = useCallback((percent: { x: number; y: number }) => {
    editorRef.current?.applyClickedLanding(percent);
    setClickPlace(false);
  }, []);

  const clickable = isAdmin && clickPlace;

  const tabs: TabDef[] = [
    {
      id: "scenarios",
      label: "Scenarios",
      content: <ScenariosTabPlaceholder />,
    },
    {
      id: "spawns",
      label: "Spawn Positions",
      content: (
        <div>
          {clickable && <ClickToPlaceBanner />}
          <SpawnMap
            config={config}
            spawns={spawns}
            clickable={clickable}
            onMapClick={handleMapClick}
          />
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        color: T.textPri,
        fontFamily: T.fontUI,
      }}
    >
      <header
        style={{
          padding: "14px 24px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          aria-hidden
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            background: T.accentBg,
            border: `1px solid ${T.accent}55`,
            color: T.accent,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: T.fontMono,
            fontWeight: 900,
            fontSize: 14,
            letterSpacing: 0.5,
          }}
        >
          D2
        </div>
        <div>
          <div style={{ fontSize: 10, color: T.textDim, letterSpacing: 1.5, textTransform: "uppercase" }}>
            CS2 Utility
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.1 }}>Dust 2 Playbook</div>
        </div>
      </header>

      <main
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: 20,
        }}
      >
        <Tabs tabs={tabs} defaultId="scenarios" />
      </main>

      <footer
        style={{
          padding: "18px 24px",
          borderTop: `1px solid ${T.border}`,
          color: T.textDim,
          fontSize: 11,
          fontFamily: T.fontMono,
          letterSpacing: 0.3,
          textAlign: "center",
          display: "flex",
          gap: 16,
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <span>Dust 2 Playbook · CMS edition · all coordinates verified against in-game setpos</span>
        <span style={{ color: T.borderAlt }}>·</span>
        <AdminFooterLink />
      </footer>
      <AdminGate />
      <AdminPanel
        slots={{
          utilities: (
            <UtilityEditor ref={editorRef} onSetClickToPlace={setClickPlace} />
          ),
        }}
      />
    </div>
  );
}

function BootGate({ children }: { children: ReactNode }) {
  const { errors } = useMapData();
  if (errors.length === 0) return <>{children}</>;
  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        color: T.textPri,
        fontFamily: T.fontUI,
        padding: 24,
      }}
    >
      <div
        role="alert"
        style={{
          maxWidth: 720,
          margin: "40px auto",
          padding: 16,
          background: T.bgPanel,
          border: `1px solid ${T.danger}55`,
          borderRadius: T.radius,
          color: T.danger,
          fontSize: 13,
          fontFamily: T.fontMono,
        }}
      >
        <strong>{errors.length} data validation issue(s):</strong>
        <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
          {errors.slice(0, 10).map((e, i) => (
            <li key={i}>
              <code>{e.file}</code> · <code>{e.path}</code>: {e.message}
            </li>
          ))}
          {errors.length > 10 && <li>…and {errors.length - 10} more</li>}
        </ul>
        <div style={{ marginTop: 12, color: T.textDim }}>
          Fix the JSON files under <code>src/data/maps/dust2/</code> then reload.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <BootGate>
        <EditableDataProvider>
          <AppInner />
        </EditableDataProvider>
      </BootGate>
    </AdminProvider>
  );
}
