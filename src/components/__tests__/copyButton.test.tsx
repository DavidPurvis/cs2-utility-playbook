/**
 * CopyButton test coverage.
 *
 * Exercises the three clipboard code paths (modern API success,
 * execCommand fallback, both-fail error), default + custom labels,
 * and stopPropagation preventing parent onClick leaks.
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CopyButton } from "../CopyButton";

beforeEach(() => {
  // Reset clipboard mock between tests.
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: vi.fn() },
    writable: true,
    configurable: true,
  });
  // jsdom doesn't implement execCommand — stub it so spyOn works.
  if (typeof document.execCommand !== "function") {
    document.execCommand = vi.fn();
  }
});

describe("CopyButton", () => {
  it("renders with default label 'Copy setpos'", () => {
    render(<CopyButton text="setpos 1 2 3" onResult={vi.fn()} />);
    expect(screen.getByRole("button", { name: /copy setpos/i })).toBeTruthy();
  });

  it("renders with custom label", () => {
    render(<CopyButton text="foo" label="Copy setang" onResult={vi.fn()} />);
    expect(screen.getByRole("button", { name: /copy setang/i })).toBeTruthy();
  });

  it("clipboard success calls onResult with 'ok'", async () => {
    (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    const onResult = vi.fn();
    render(<CopyButton text="setpos 1 2 3" onResult={onResult} />);

    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(onResult).toHaveBeenCalledWith("ok", "setpos 1 2 3"));
  });

  it("clipboard rejects, execCommand succeeds → 'fallback'", async () => {
    (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("denied")
    );
    // Mock execCommand to succeed.
    const execSpy = vi.spyOn(document, "execCommand").mockReturnValue(true);
    const onResult = vi.fn();
    render(<CopyButton text="setpos 1 2 3" onResult={onResult} />);

    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(onResult).toHaveBeenCalledWith("fallback", "setpos 1 2 3"));
    execSpy.mockRestore();
  });

  it("both clipboard and execCommand fail → 'error'", async () => {
    (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("denied")
    );
    const execSpy = vi.spyOn(document, "execCommand").mockReturnValue(false);
    const onResult = vi.fn();
    render(<CopyButton text="setpos 1 2 3" onResult={onResult} />);

    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(onResult).toHaveBeenCalledWith("error", "setpos 1 2 3"));
    execSpy.mockRestore();
  });

  it("e.stopPropagation prevents parent onClick from firing", async () => {
    (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    const parentClick = vi.fn();
    const onResult = vi.fn();

    render(
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div onClick={parentClick}>
        <CopyButton text="test" onResult={onResult} />
      </div>
    );

    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(onResult).toHaveBeenCalled());
    expect(parentClick).not.toHaveBeenCalled();
  });
});
