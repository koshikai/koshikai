import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/ThemeToggle";
import { isNavActive, primaryNav } from "@/lib/navigation";

/**
 * 全ページ共通のヘッダー。上端から浮かせた小さなバーで、
 * 狭い画面では行き先を全画面のメニューにまとめる。
 * 見た目は `styles/site-chrome.css`。
 */
export function SiteHeader() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  // 下へ読み進めている間はバーを引っ込め、少しでも戻ったら出す
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (Math.abs(y - last) > 8) {
          setHidden(y > last && y > 160);
          last = y;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="site-nav" data-hidden={hidden && !open}>
        <Link to="/" className="site-nav-brand" onClick={() => setOpen(false)}>
          koshikai
        </Link>
        <nav aria-label="グローバルナビゲーション" className="site-nav-links">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              aria-current={isNavActive(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <ThemeToggle className="site-nav-btn" />
        <button
          type="button"
          className="site-nav-btn site-nav-menu-btn"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
        >
          <span className="site-nav-burger" aria-hidden="true" />
        </button>
      </header>

      {open && (
        <nav id="site-menu" aria-label="メニュー" className="site-menu">
          {primaryNav.map((item, i) => (
            <Link
              key={item.href}
              to={item.href}
              aria-current={isNavActive(pathname, item.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
              style={{ "--i": i } as React.CSSProperties}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
