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
  test: {
    globals: false,
    environment: "node",
    include: ["tests/**/*.test.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["tests/**/*.js", "data/**/*.js"],
    },
  },
});
