import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../App.jsx";

describe("App smoke", () => {
  it("renders playbook header and premier map buttons", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getAllByText(/Must Learn — The Core 5/i).length).toBeGreaterThan(0);
    });
    expect(screen.getByText(/CS2 UTILITY PLAYBOOK/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ancient" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mirage" })).toBeInTheDocument();
  });

  it("shows Must Learn section on playbook view", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getAllByText(/Must Learn — The Core 5/i).length).toBeGreaterThan(0);
    });
  });
});
