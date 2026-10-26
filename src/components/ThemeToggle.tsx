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

  const toggle = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    const commit = () => {
      try {
        if (next === "light") localStorage.removeItem(STORAGE_KEY);
        else localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // localStorage が使えない環境では、その場の見た目だけ切り替える
      }
      // View Transition は更新後の DOM を同期的に撮るので、クラスはここで直接切り替える
      applyTheme(next);
      for (const listener of listeners) listener();
    };

    const canAnimate =
      typeof document.startViewTransition === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canAnimate) {
      commit();
      return;
    }

    // ボタンの位置を中心に、新しいテーマが円形に広がる
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const transition = document.startViewTransition(commit);
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 650,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {});
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
