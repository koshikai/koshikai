import Link from "next/link";
import { Container } from "@/components/ui";
import { AvailabilityNote } from "@/components/AvailabilityNote";
import { primaryNav } from "@/lib/navigation";
import { profile } from "@/lib/profile";

const linkClass =
  "focus-ring inline-flex min-h-9 items-center text-sm text-muted transition-colors hover:text-foreground";

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-xs text-muted">{title}</p>
      <ul role="list" className="mt-3 list-none space-y-0.5">
        {children}
      </ul>
    </div>
  );
}

export function Footer() {
  const { email, links } = profile.contact;

  return (
    <footer className="mt-24 border-t border-border bg-surface/60">
      <Container className="grid grid-cols-12 gap-x-6 gap-y-10 py-12 sm:py-14">
        <div className="col-span-12 md:col-span-5">
          <Link
            href="/"
            className="focus-ring font-mono text-sm font-medium text-foreground transition-colors hover:text-accent"
          >
            koshikai<span className="text-muted">.dev</span>
          </Link>
          <p className="mt-2 font-mono text-xs text-muted">build · operate · research</p>
          <AvailabilityNote className="mt-6" />
        </div>

        <nav aria-label="フッターナビゲーション" className="col-span-12 grid grid-cols-2 gap-6 sm:grid-cols-3 md:col-span-7">
          <Column title="Site">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </Column>
          <Column title="More">
            <li>
              <Link href="/cases" className={linkClass}>
                All case studies
              </Link>
            </li>
            <li>
              <Link href="/llm-benchmarks" className={linkClass}>
                LLM Benchmarks
              </Link>
            </li>
          </Column>
          <Column title="Contact">
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
          </Column>
        </nav>

        <div className="col-span-12 flex flex-col gap-1 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} koshikai</p>
          <p>
            Next.js ·{" "}
            <Link href="/engineering#pipeline" className="focus-ring underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground">
              自宅の Proxmox から配信
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
