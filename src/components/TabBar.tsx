/**
 * Four-tab navigation bar for the Home view.
 *
 * Tab order matters — the owner reads left-to-right and expects the
 * primary activity (Scenarios) in a fixed spot. Tab labels are explicit
 * verbs / nouns: no clever wording, no icons-without-text. Predictable.
 *
 * Implements the WAI-ARIA Tabs pattern (audit H-5):
 *  - role="tablist" on the container (was already present)
 *  - role="tab" + aria-selected on each button (was already present)
 *  - aria-controls pointing to the panel id (NEW — see Home.tsx wraps
 *    its content in role="tabpanel" with matching id)
 *  - tabIndex management — only the active tab participates in TAB
 *    nav; inactive tabs are -1 (NEW)
 *  - keyboard navigation — ArrowLeft / ArrowRight cycle, Home / End
 *    jump to first / last (NEW)
 */
import { useRef, type KeyboardEvent } from "react";
import { T } from "../theme";
import type { HomeTab } from "../reducer";
import { tabButtonId, tabPanelId } from "./tabIds";

interface TabDef {
  id: HomeTab;
  label: string;
  hint: string; // short one-liner shown below the tab title
}

const TABS: TabDef[] = [
  { id: "defaults",       label: "Defaults",       hint: "plant spots · timings · spawn rushes" },
  { id: "scenarios",      label: "Scenarios",      hint: "numbered team executes (2-5 man)" },
  { id: "instant_smokes", label: "Instant utility", hint: "throw at round start from spawn" },
  { id: "map",            label: "Map",            hint: "every position you can throw from" },
];

export interface TabBarProps {
  active: HomeTab;
  onChange: (tab: HomeTab) => void;
}

export function TabBar({ active, onChange }: TabBarProps) {
  // One ref slot per tab so the keyboard handler can imperatively
  // focus the newly-active tab after an arrow-key dispatch.
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const nextIdx =
      e.key === "ArrowRight" || e.key === "Right"
        ? (index + 1) % TABS.length
        : e.key === "ArrowLeft" || e.key === "Left"
          ? (index - 1 + TABS.length) % TABS.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? TABS.length - 1
              : -1;
    if (nextIdx < 0) return;
    e.preventDefault();
    onChange(TABS[nextIdx]!.id);
    // .focus() works regardless of tabIndex; the tabIndex change is
    // only for TAB-key navigation in/out of the tablist.
    tabRefs.current[nextIdx]?.focus();
  }

  return (
    <nav
      role="tablist"
      aria-label="Home sections"
      style={{
        display: "flex",
        gap: 4,
        padding: "10px 20px 0",
        maxWidth: 1280,
        margin: "0 auto",
        flexWrap: "wrap",
        borderBottom: `1px solid ${T.border}`,
        background: T.bg,
      }}
    >
      {TABS.map((tab, index) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            id={tabButtonId(tab.id)}
            role="tab"
            aria-selected={isActive}
            aria-controls={tabPanelId(tab.id)}
            tabIndex={isActive ? 0 : -1}
            type="button"
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 2,
              background: isActive ? T.bgPanel : "transparent",
              border: "none",
              borderTop: `1px solid ${isActive ? T.border : "transparent"}`,
              borderLeft: `1px solid ${isActive ? T.border : "transparent"}`,
              borderRight: `1px solid ${isActive ? T.border : "transparent"}`,
              borderBottom: `2px solid ${isActive ? T.accent : "transparent"}`,
              borderRadius: `${T.radiusSm}px ${T.radiusSm}px 0 0`,
              padding: "10px 16px 12px",
              cursor: "pointer",
              color: isActive ? T.textPri : T.textSec,
              fontFamily: T.fontUI,
              marginBottom: -1, // sit on top of the bottom border
              transition: `background ${T.transitionFast}, color ${T.transitionFast}`,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 0.1,
                color: isActive ? T.textPri : T.textSec,
              }}
            >
              {tab.label}
            </span>
            <span
              style={{
                fontSize: 11,
                color: isActive ? T.textDim : T.textMute,
                fontFamily: T.fontMono,
                letterSpacing: 0.1,
              }}
            >
              {tab.hint}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
