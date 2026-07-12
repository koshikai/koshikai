"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const themeQuery = "(prefers-color-scheme: dark)";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const media = window.matchMedia(themeQuery);
    const applySystemTheme = (event: MediaQueryListEvent | MediaQueryList) => {
      if (localStorage.getItem("theme") === null) {
        document.documentElement.classList.toggle("dark", event.matches);
      }
    };
    const applyStoredTheme = (event: StorageEvent) => {
      if (event.key !== "theme") return;
      document.documentElement.classList.toggle(
        "dark",
        event.newValue === "dark" || (event.newValue === null && media.matches),
      );
    };

    applySystemTheme(media);
    media.addEventListener("change", applySystemTheme);
    window.addEventListener("storage", applyStoredTheme);
    return () => {
      media.removeEventListener("change", applySystemTheme);
      window.removeEventListener("storage", applyStoredTheme);
    };
  }, []);

  const toggle = useCallback(() => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }, [isDark]);

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "ライトモードに切り替え" : "ダークモードに切り替え"}
      className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center border border-border bg-background text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
}
