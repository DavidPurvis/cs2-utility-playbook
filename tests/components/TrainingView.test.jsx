import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrainingView } from "../../components/TrainingView.jsx";
import { TRAINING, WARMUP } from "../../data/training.js";

describe("TrainingView", () => {
  it("renders warmup and training section headers", () => {
    render(<TrainingView />);
    expect(screen.getByText(/Warmup — before you queue/i)).toBeInTheDocument();
    expect(screen.getByText(/Training — dedicated sessions/i)).toBeInTheDocument();
  });

  it("lists every warmup and training exercise by name", () => {
    render(<TrainingView />);
    for (const ex of WARMUP) {
      expect(screen.getAllByText(ex.name).length).toBeGreaterThan(0);
    }
    for (const ex of TRAINING) {
      expect(screen.getAllByText(ex.name).length).toBeGreaterThan(0);
    }
  });

  it("exposes LAUNCH links for each exercise", () => {
    render(<TrainingView />);
    const links = screen.getAllByRole("link", { name: /LAUNCH/i });
    expect(links.length).toBeGreaterThanOrEqual(WARMUP.length + TRAINING.length);
  });
});
