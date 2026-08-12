"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

/**
 * テーマの「設定」。解決後の見た目（dark クラス）とは別物であることに注意。
 * system は localStorage にキーを持たない状態で表す（layout の初期化スクリプトが
 * storedTheme === null をシステム追従として扱うのに合わせる）。
 */
type ThemePreference = "system" | "light" | "dark";

const ORDER: ThemePreference[] = ["system", "light", "dark"];
const STORAGE_KEY = "theme";
const themeQuery = "(prefers-color-scheme: dark)";

/** 同一タブ内の変更は storage イベントが飛ばないので、自前で購読者に通知する */
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

function getServerSnapshot(): ThemePreference {
  return "system";
}

function applyPreference(preference: ThemePreference) {
  const dark =
    preference === "dark" ||
    (preference === "system" && window.matchMedia(themeQuery).matches);
  document.documentElement.classList.toggle("dark", dark);
}

const LABELS: Record<ThemePreference, string> = {
  system: "テーマ: システム設定に追従（クリックでライトモード）",
  light: "テーマ: ライトモード（クリックでダークモード）",
  dark: "テーマ: ダークモード（クリックでシステム設定に戻す）",
};

export function ThemeToggle() {
  const preference = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // system のときだけ OS 側の変更に追従する
  useEffect(() => {
    const media = window.matchMedia(themeQuery);
    const onChange = () => {
      if (getSnapshot() === "system") applyPreference("system");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // 別タブでの変更を含め、設定が変わったら見た目へ反映する
  useEffect(() => {
    applyPreference(preference);
  }, [preference]);

  const cycle = useCallback(() => {
    const next = ORDER[(ORDER.indexOf(getSnapshot()) + 1) % ORDER.length];
    try {
      if (next === "system") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage が使えない環境では、その場の見た目だけ切り替える
      applyPreference(next);
    }
    for (const listener of listeners) listener();
  }, []);

  const Icon =
    preference === "system" ? Monitor : preference === "dark" ? Moon : Sun;

  return (
    <button
      onClick={cycle}
      aria-label={LABELS[preference]}
      title={LABELS[preference]}
      className="focus-ring fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center border border-border bg-background text-muted transition-colors hover:text-accent"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
