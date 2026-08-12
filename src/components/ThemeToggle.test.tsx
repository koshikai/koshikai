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
    expect(screen.getByRole("button")).toHaveAccessibleName(/システム設定に追従/);
  });

  it("keeps a stored light preference even when the system prefers dark", async () => {
    prefersDark = true;
    localStorage.setItem("theme", "light");
    render(<ThemeToggle />);

    await waitFor(() => expect(document.documentElement).not.toHaveClass("dark"));
  });

  it("persists the selected theme", async () => {
    localStorage.setItem("theme", "light");
    render(<ThemeToggle />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  // 一度でも切り替えると localStorage に固定され、OS 設定へ戻す手段が無かった
  it("cycles back to following the system preference", async () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");

    expect(localStorage.getItem("theme")).toBeNull();

    fireEvent.click(button); // system -> light
    expect(localStorage.getItem("theme")).toBe("light");

    fireEvent.click(button); // light -> dark
    expect(localStorage.getItem("theme")).toBe("dark");

    fireEvent.click(button); // dark -> system
    await waitFor(() => expect(localStorage.getItem("theme")).toBeNull());
    expect(button).toHaveAccessibleName(/システム設定に追従/);
  });

  it("follows the system preference again once it is back to system", async () => {
    localStorage.setItem("theme", "dark");
    render(<ThemeToggle />);
    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));

    fireEvent.click(screen.getByRole("button")); // dark -> system
    await waitFor(() => expect(document.documentElement).not.toHaveClass("dark"));

    prefersDark = true;
    for (const listener of listeners) {
      listener({ matches: true } as MediaQueryListEvent);
    }
    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));
  });
});
