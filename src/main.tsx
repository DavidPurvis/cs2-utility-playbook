import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { loadDustData } from "./data/loadDust2";

const root = document.getElementById("root");
if (!root) throw new Error("#root element not found in index.html");

// Validate data BEFORE mounting React. If the data file is corrupt,
// loadDustData() returns an Error instead of throwing — so we can
// render a styled fallback without React or the theme (which could
// also fail if the module graph is broken).
const dataResult = loadDustData();

if (dataResult instanceof Error) {
  root.innerHTML = `
    <div style="
      max-width: 560px;
      margin: 80px auto;
      padding: 24px;
      font-family: system-ui, -apple-system, sans-serif;
      background: #FFF5F5;
      border: 2px solid #C53030;
      border-radius: 8px;
      color: #1A1A1A;
    ">
      <h1 style="margin: 0 0 12px; font-size: 18px; color: #C53030;">
        Data validation failed
      </h1>
      <p style="margin: 0 0 8px; font-size: 14px; line-height: 1.5;">
        The app could not start because <code>dust2.json</code> failed
        structural validation at boot time.
      </p>
      <pre style="
        margin: 0 0 16px;
        padding: 12px;
        background: #FFF;
        border: 1px solid #E2E2E2;
        border-radius: 4px;
        font-size: 12px;
        overflow-x: auto;
        white-space: pre-wrap;
        word-break: break-word;
      ">${dataResult.message}</pre>
      <button
        onclick="location.reload()"
        style="
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          background: #C53030;
          color: #FFF;
          border: none;
          border-radius: 4px;
        "
      >
        Reload
      </button>
    </div>
  `;
} else {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
