import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScreenshotGallery } from "../../components/ScreenshotGallery.jsx";

describe("ScreenshotGallery", () => {
  it("renders without throwing when source is a string and austincs is boolean", () => {
    render(
      <ScreenshotGallery
        screenshots={{}}
        source="NadeKing"
        video="https://youtube.com/watch?v=1"
        austincs={false}
      />
    );
    expect(screen.getByText(/NadeKing/)).toBeInTheDocument();
  });

  it("shows per-field empty state with video fallback", () => {
    render(
      <ScreenshotGallery
        screenshots={{ stand: "", aim: "", result: "" }}
        video="https://youtube.com/watch?v=abc"
        austincs={{ video: "", timestamp: "", note: "" }}
      />
    );
    expect(screen.getByText(/No screenshot yet/i)).toBeInTheDocument();
  });
});
