import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./ThemeToggle";

let prefersDark = false;

function installMatchMedia() {
  vi.stubGlobal("matchMedia", vi.fn(() => ({
    get matches() {
      return prefersDark;
    },
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })));
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    prefersDark = false;
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    installMatchMedia();
  });

  afterEach(() => vi.unstubAllGlobals());

  // デザインはライト基準で決めているので、OS がダークでも初見はライトで見せる
  it("defaults to light even when the system prefers dark", async () => {
    prefersDark = true;
    render(<ThemeToggle />);

    await waitFor(() => expect(document.documentElement).not.toHaveClass("dark"));
    expect(screen.getByRole("button")).toHaveAccessibleName("ダークモードに切り替える");
  });

  it("restores a stored dark preference", async () => {
    localStorage.setItem("theme", "dark");
    render(<ThemeToggle />);

    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));
    expect(screen.getByRole("button")).toHaveAccessibleName("ライトモードに切り替える");
  });

  it("toggles between light and dark and persists only the dark choice", async () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");

    fireEvent.click(button); // light -> dark
    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));
    expect(localStorage.getItem("theme")).toBe("dark");

    fireEvent.click(button); // dark -> light
    await waitFor(() => expect(document.documentElement).not.toHaveClass("dark"));
    expect(localStorage.getItem("theme")).toBeNull();
  });
});
