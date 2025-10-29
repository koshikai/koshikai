"use client";

import { useEffect, useState } from "react";

function getPreferred(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(getPreferred());
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-colors"
    >
      <span className="relative inline-block h-4 w-4">
        {/* Sun/Moon icon */}
        {theme === "dark" ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M21.64 13.03A9 9 0 0 1 11 2.36c.32-.05.66-.08 1-.08a9 9 0 1 1-9 9c0-.34.03-.68.08-1a9 9 0 0 0 18.56 2.75z"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zm8.84-5.96l1.79 1.8 1.79-1.8-1.79-1.79-1.79 1.79zM20 11v2h3v-2h-3zm-8-7h2V1h-2v3zM4.84 19.16l1.79-1.79-1.79-1.8-1.67 1.67 1.67 1.92zM12 6a6 6 0 1 0 0 12A6 6 0 0 0 12 6z"/>
          </svg>
        )}
      </span>
      <span className="hidden sm:block">{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}

