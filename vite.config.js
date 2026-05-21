/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  base: "/cs2-utility-playbook/",
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    sourcemap: "hidden",
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/data/") && !id.includes("mapMeta") && !id.includes("loadMapModule")) {
            const match = id.match(/data\/([^.]+)\.js/);
            if (match) return `map-${match[1]}`;
          }
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },
  test: {
    globals: false,
    environment: "node",
    environmentMatchGlobs: [["tests/**/*.test.jsx", "jsdom"]],
    setupFiles: ["tests/setup.js"],
    include: ["tests/**/*.test.js", "tests/**/*.test.jsx"],
    // Use the child-process pool instead of worker_threads. Vitest 2.1.x ships
    // tinypool 1.1.x, whose worker-thread path can crash with
    // "RangeError: Maximum call stack size exceeded" during worker bootstrap
    // on Node 24 (observed on Node v24.14.0 on macOS). Forks sidestep that
    // path and run reliably on Node 18/20/22/24.
    pool: "forks",
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["App.jsx", "lib/**/*.js", "context/**/*.jsx", "components/**/*.jsx", "data/**/*.js", "tests/**/*.js"],
    },
  },
});
