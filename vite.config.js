/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  base: "/cs2-utility-playbook/",
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    sourcemap: "hidden",
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "node",
    environmentMatchGlobs: [
      ["tests/**/*.test.tsx", "jsdom"],
      ["tests/**/*.test.jsx", "jsdom"],
    ],
    setupFiles: ["tests/setup.ts"],
    include: [
      "tests/**/*.test.ts",
      "tests/**/*.test.tsx",
      "tests/**/*.test.js",
      "tests/**/*.test.jsx",
    ],
    // Forks pool — child-process pool sidesteps tinypool worker_threads
    // crash observed on Node 24.
    pool: "forks",
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: [
        "App.tsx",
        "main.tsx",
        "lib/**/*.ts",
        "lib/**/*.tsx",
        "components/**/*.tsx",
        "data/**/*.ts",
      ],
    },
  },
});
