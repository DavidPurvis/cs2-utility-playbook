import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SideToggle } from "../../components/SideToggle.jsx";

describe("SideToggle", () => {
  it("calls onSideChange and resetFilters when switching sides", async () => {
    const user = userEvent.setup();
    const onSideChange = vi.fn();
    const resetFilters = vi.fn();
    render(<SideToggle side="T" onSideChange={onSideChange} resetFilters={resetFilters} />);

    await user.click(screen.getByRole("tab", { name: "CT" }));
    expect(onSideChange).toHaveBeenCalledWith("CT");
    expect(resetFilters).toHaveBeenCalled();
  });

  it("renders T and CT tabs", () => {
    render(<SideToggle side="CT" onSideChange={() => {}} />);
    expect(screen.getByRole("tab", { name: "T" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "CT" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "CT" })).toHaveAttribute("aria-selected", "true");
  });
});
