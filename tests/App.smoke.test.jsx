import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../App.jsx";

describe("App smoke", () => {
  it("renders playbook header and map selector", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getAllByText(/MUST LEARN/i).length).toBeGreaterThan(0);
    });
    expect(screen.getByText(/CS2 Playbook/i)).toBeInTheDocument();
    expect(screen.getByText(/Ancient/)).toBeInTheDocument();
  });

  it("shows Must Learn section on playbook view", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getAllByText(/MUST LEARN/i).length).toBeGreaterThan(0);
    });
  });
});
