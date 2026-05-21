import { T } from "./theme";
import { Tabs, type TabDef } from "./components/Tabs";
import { SpawnMap } from "./components/SpawnMap";
import { useMapData } from "./hooks/useMapData";

function ScenariosTabPlaceholder() {
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
      <h2 style={{ margin: 0, marginBottom: 6, fontSize: 16, color: T.textPri }}>Scenarios coming soon</h2>
      Wire-up for the Scenarios feature lands in Phase 6. For now, the data layer ships an empty
      list (<code style={{ color: T.accent }}>src/data/maps/dust2/scenarios.json</code>) you can
      populate via admin mode once Phase 5 ships the Utility editor.
    </div>
  );
}

export default function App() {
  const { bundle, errors } = useMapData();

  const tabs: TabDef[] = [
    {
      id: "scenarios",
      label: "Scenarios",
      content: <ScenariosTabPlaceholder />,
    },
    {
      id: "spawns",
      label: "Spawn Positions",
      content: <SpawnMap config={bundle.config} spawns={bundle.spawns} />,
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
        {errors.length > 0 && (
          <div
            role="alert"
            style={{
              marginBottom: 14,
              padding: 10,
              background: T.bgPanel,
              border: `1px solid ${T.danger}55`,
              borderRadius: T.radiusSm,
              color: T.danger,
              fontSize: 12,
              fontFamily: T.fontMono,
            }}
          >
            <strong>{errors.length} data validation issue(s):</strong>
            <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
              {errors.slice(0, 6).map((e, i) => (
                <li key={i}>
                  <code>{e.file}</code> · <code>{e.path}</code>: {e.message}
                </li>
              ))}
              {errors.length > 6 && <li>…and {errors.length - 6} more</li>}
            </ul>
          </div>
        )}
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
        }}
      >
        Dust 2 Playbook · CMS edition · all coordinates verified against in-game setpos
      </footer>
    </div>
  );
}
