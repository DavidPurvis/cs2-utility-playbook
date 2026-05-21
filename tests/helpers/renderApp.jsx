import { vi } from "vitest";
import { render } from "@testing-library/react";
import App from "../../App.jsx";

/** Render the full app with jsdom defaults (localStorage, location). */
export function renderApp(options = {}) {
  const { url = "/", storage = {} } = options;

  window.history.replaceState({}, "", url);

  const store = { ...storage };
  const getItem = vi.fn((key) => (key in store ? store[key] : null));
  const setItem = vi.fn((key, value) => {
    store[key] = value;
  });
  vi.stubGlobal("localStorage", { getItem, setItem, removeItem: vi.fn(), clear: vi.fn() });

  const view = render(<App />);
  return { ...view, storage: store, getItem, setItem };
}
