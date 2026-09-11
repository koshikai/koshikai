"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavActive, primaryNav } from "@/lib/navigation";

/**
 * 4 項目なら 390px 幅でも1行に収まるので、ハンバーガーメニューにはしない。
 * 開閉のための JS と、開かないと行き先が見えない状態の両方を避けられる。
 */
export function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="グローバルナビゲーション">
      <ul role="list" className="flex list-none items-center justify-between gap-1 sm:justify-start sm:gap-2">
        {primaryNav.map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`focus-ring relative inline-flex min-h-11 items-center px-2 text-sm transition-colors sm:px-3 ${
                  active ? "font-medium text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-2 -bottom-px h-px bg-accent sm:inset-x-3"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
