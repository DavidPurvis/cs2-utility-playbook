import { useState, type ReactNode } from "react";
import { T } from "../theme";

export interface TabDef {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  tabs: TabDef[];
  defaultId?: string;
}

export function Tabs({ tabs, defaultId }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultId ?? tabs[0]?.id ?? "");
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        role="tablist"
        style={{
          display: "flex",
          gap: 6,
          borderBottom: `1px solid ${T.border}`,
          paddingBottom: 0,
        }}
      >
        {tabs.map((tab) => {
          const selected = tab.id === active?.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveId(tab.id)}
              style={{
                background: "transparent",
                color: selected ? T.accent : T.textSec,
                border: "none",
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: T.fontUI,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                borderBottom: selected ? `2px solid ${T.accent}` : `2px solid transparent`,
                marginBottom: -1,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel">{active?.content}</div>
    </div>
  );
}
