"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * ライトが既定。OS のダーク設定には追従せず、明示的に選んだときだけダークにする。
 * デザインの判断をライト基準で行うため、初見の人は必ずライトで見る。
 * layout の初期化スクリプトも stored === "dark" のときだけ dark クラスを付ける。
 */
type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

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

function getSnapshot(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function getServerSnapshot(): Theme {
  return "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // 別タブでの変更を含め、設定が変わったら見た目へ反映する。
  // ハイドレーション中の theme はサーバー値（light）なので、それをそのまま
  // 当てると初期化スクリプトが付けた dark が一瞬外れる。実際の保存値を読む。
  useEffect(() => {
    applyTheme(getSnapshot());
  }, [theme]);

  const toggle = useCallback(() => {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    try {
      if (next === "light") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage が使えない環境では、その場の見た目だけ切り替える
      applyTheme(next);
    }
    for (const listener of listeners) listener();
  }, []);

  const label = theme === "dark" ? "ライトモードに切り替える" : "ダークモードに切り替える";
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="focus-ring -mr-2 flex h-11 w-11 items-center justify-center rounded text-muted transition-colors hover:text-foreground"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
