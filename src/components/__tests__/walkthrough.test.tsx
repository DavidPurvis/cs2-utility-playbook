/**
 * Phase 4 TDD: LineupDetail 2×2 walkthrough (TKT-017).
 *
 * The 4-card chronological flow (Position → Aim → Throw → Result) is
 * the headline UX for "how do I throw this smoke." Tests lock:
 *   1. All four card headings are present in the rendered DOM.
 *   2. Missing screenshots fall back gracefully (radar crop, glyph,
 *      or text — never broken image).
 *   3. The Position card includes a setpos string the user can copy.
 *   4. The Throw card includes a `steam://` deep-link.
 *   5. Back button dispatches the back handler.
 */
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LineupDetail } from "../LineupDetail";
import { getDustData } from "../../data/loadDust2";
const dustData = getDustData();

const baseLineup = dustData.lineups.find((l) => l.id === "xbox_smoke")!;

describe("LineupDetail walkthrough (2×2)", () => {
  const noop = () => {};

  it("renders all four card headings", () => {
    render(<LineupDetail lineup={baseLineup} config={dustData.config} onBack={noop} onCopy={noop} />);
    expect(screen.getByText(/1\. Position/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Aim/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Throw/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. Result/i)).toBeInTheDocument();
  });

  it("shows the position fallback when screenshots.position is missing", () => {
    const noPos = {
      ...baseLineup,
      screenshots: { ...baseLineup.screenshots, position: undefined },
    };
    render(<LineupDetail lineup={noPos} config={dustData.config} onBack={noop} onCopy={noop} />);
    expect(screen.getByTestId("position-fallback")).toBeInTheDocument();
  });

  it("includes a setpos string the user can copy on the Position card", () => {
    render(<LineupDetail lineup={baseLineup} config={dustData.config} onBack={noop} onCopy={noop} />);
    // Expect the literal setpos text rendered somewhere on the card.
    const setposLine = `setpos ${baseLineup.throwFrom.world.x} ${baseLineup.throwFrom.world.y}`;
    expect(screen.getByText(new RegExp(setposLine.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")))).toBeInTheDocument();
  });

  it("includes a steam:// deep link on the Throw card", () => {
    render(<LineupDetail lineup={baseLineup} config={dustData.config} onBack={noop} onCopy={noop} />);
    const link = screen.getByRole("link", { name: /open in cs2/i });
    expect(link).toHaveAttribute("href", expect.stringMatching(/^steam:\/\/rungameid\/730/));
  });

  it("clicking the back button calls onBack", () => {
    const onBack = vi.fn();
    render(<LineupDetail lineup={baseLineup} config={dustData.config} onBack={onBack} onCopy={noop} />);
    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(onBack).toHaveBeenCalled();
  });
});
