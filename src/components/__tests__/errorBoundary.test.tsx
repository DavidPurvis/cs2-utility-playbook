/**
 * ErrorBoundary test coverage.
 *
 * Tests the app's last line of defense: the React error boundary.
 * Verifies render-error capture, contextual fallback labels,
 * dev-mode diagnostics, retry recovery, and componentDidCatch logging.
 */
import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorBoundary } from "../ErrorBoundary";

/** Throws on every render until `allow` is set to true. */
let allowRender = false;
function ThrowOnRender({ message = "kaboom" }: { message?: string }) {
  if (!allowRender) throw new Error(message);
  return <div data-testid="child">recovered</div>;
}

afterEach(() => {
  allowRender = false;
});

describe("ErrorBoundary", () => {
  it("renders children normally when no error occurs", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">hello</div>
      </ErrorBoundary>
    );
    expect(screen.getByTestId("child").textContent).toBe("hello");
  });

  it("catches render error and shows fallback", () => {
    // Suppress React's noisy error logging during expected boundary catches.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <ThrowOnRender />
      </ErrorBoundary>
    );
    expect(screen.getByText(/Something broke/)).toBeTruthy();
    spy.mockRestore();
  });

  it("shows error message in DEV mode", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <ThrowOnRender message="data is null" />
      </ErrorBoundary>
    );
    // import.meta.env.DEV is true in vitest — error message should appear.
    expect(screen.getByText(/data is null/)).toBeTruthy();
    spy.mockRestore();
  });

  it("Retry button clears error and re-renders children", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <ThrowOnRender />
      </ErrorBoundary>
    );
    // Fallback is showing.
    expect(screen.getByText(/Something broke/)).toBeTruthy();
    // Now allow the child to render and click Retry.
    allowRender = true;
    fireEvent.click(screen.getByRole("button", { name: /retry/i }));
    expect(screen.getByTestId("child").textContent).toBe("recovered");
    spy.mockRestore();
  });

  it("label prop appears in fallback message", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary label="Map radar">
        <ThrowOnRender />
      </ErrorBoundary>
    );
    expect(screen.getByText(/Something broke in Map radar/)).toBeTruthy();
    spy.mockRestore();
  });

  it("fallback without label shows generic text", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <ThrowOnRender />
      </ErrorBoundary>
    );
    // Should say "Something broke." with no label suffix.
    const strong = screen.getByText(/Something broke/);
    expect(strong.textContent).toBe("Something broke.");
    spy.mockRestore();
  });

  it("componentDidCatch logs to console.error in DEV", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <ThrowOnRender message="test-catch-log" />
      </ErrorBoundary>
    );
    // componentDidCatch should have called console.error with [ErrorBoundary] prefix.
    const catchCall = spy.mock.calls.find(
      (call) => typeof call[0] === "string" && call[0].includes("[ErrorBoundary]")
    );
    expect(catchCall).toBeTruthy();
    spy.mockRestore();
  });
});
