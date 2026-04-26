import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SetupNotice } from "./SetupNotice";

describe("SetupNotice", () => {
  it("renders the setup required heading", () => {
    render(<SetupNotice message="Test setup message" />);

    expect(screen.getByRole("heading", { name: /内部KBはまだ接続されていません/i })).toBeInTheDocument();
  });

  it("displays the provided message", () => {
    const message = "MATHKB_DATABASE_URL is missing.";
    render(<SetupNotice message={message} />);

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("shows the setup badge", () => {
    render(<SetupNotice message="Another message" />);

    expect(screen.getByText("Setup Required")).toBeInTheDocument();
  });
});
