/**
 * Stable id helpers so TabBar and Home agree on the
 * `aria-controls` / `aria-labelledby` linkage.
 *
 * Lives in its own file (not in TabBar.tsx) so Vite's Fast Refresh
 * doesn't complain about a component file exporting non-component
 * helpers.
 */
import type { HomeTab } from "../reducer";

export function tabButtonId(tab: HomeTab): string {
  return `home-tab-${tab}`;
}

export function tabPanelId(tab: HomeTab): string {
  return `home-tabpanel-${tab}`;
}
