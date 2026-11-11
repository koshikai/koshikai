import { Link, useLocation } from "@tanstack/react-router";
import { AvailabilityNote } from "@/components/AvailabilityNote";
import { primaryNav } from "@/lib/navigation";
import { profile } from "@/lib/profile";

const linkClass =
  "focus-ring inline-flex min-h-11 items-center transition-colors hover:text-foreground";

/**
 * 全ページ共通のフッター。1 行の細い帯にまとめる。
 * トップは直前に連絡先のセクションがあるので、連絡先のリンクと上の余白を省く。
 */
export function Footer() {
  const isHome = useLocation({ select: (location) => location.pathname === "/" });
  const { email, links } = profile.contact;

  return (
    <footer
      className={`mx-auto w-full ${
        // 幅と左右の余白は、それぞれのページの本文に合わせる
        isHome ? "max-w-[1240px] px-[clamp(20px,5vw,48px)]" : "mt-24 max-w-6xl px-5 sm:px-8"
      }`}
    >
      {profile.availability && (
        <div className="border-t border-border py-6">
          <AvailabilityNote />
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border pt-6 pb-10 text-xs text-muted">
        <p>
          © {new Date().getFullYear()} koshikai ·{" "}
          <Link
            to="/engineering"
            hash="pipeline"
            className="focus-ring underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
          >
            自宅の Proxmox から配信
          </Link>
        </p>
        <div className="flex flex-wrap gap-x-8">
          <nav aria-label="フッターナビゲーション" className="flex flex-wrap gap-x-5">
            {primaryNav.map((item) => (
              <Link key={item.href} to={item.href} className={linkClass}>
                {item.label}
              </Link>
            ))}
            <Link to="/cases" className={linkClass}>
              Cases
            </Link>
          </nav>
          {!isHome && (
            <ul role="list" aria-label="連絡先" className="flex list-none flex-wrap gap-x-5">
              {email && (
                <li>
                  <a href={`mailto:${email}`} className={linkClass}>
                    Email
                  </a>
                </li>
              )}
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {link.label}
                    <span className="sr-only">（{link.handle}、新しいタブで開く）</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
