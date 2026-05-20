import { expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";

/** Wait until async map data has loaded and the playbook is interactive. */
export async function waitForMapLoaded() {
  await waitFor(
    () => {
      expect(screen.getAllByText(/Must Learn — The Core 5/i).length).toBeGreaterThan(0);
    },
    { timeout: 3000 }
  );
}
