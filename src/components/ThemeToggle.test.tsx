import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./ThemeToggle";

const listeners = new Set<(event: MediaQueryListEvent) => void>();
let prefersDark = false;

function installMatchMedia() {
  vi.stubGlobal("matchMedia", vi.fn(() => ({
    get matches() {
      return prefersDark;
    },
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })));
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    prefersDark = false;
    listeners.clear();
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    installMatchMedia();
  });

  afterEach(() => vi.unstubAllGlobals());

  it("uses the system preference when no theme is stored", async () => {
    prefersDark = true;
    render(<ThemeToggle />);

    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));
    expect(screen.getByRole("button")).toHaveAccessibleName("ライトモードに切り替え");
  });

  it("keeps a stored light preference even when the system prefers dark", async () => {
    prefersDark = true;
    localStorage.setItem("theme", "light");
    render(<ThemeToggle />);

    await waitFor(() => expect(document.documentElement).not.toHaveClass("dark"));
  });

  it("persists the selected theme", async () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button", { name: "ダークモードに切り替え" }));

    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));
    expect(localStorage.getItem("theme")).toBe("dark");
  });
});
