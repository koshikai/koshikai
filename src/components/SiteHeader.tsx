import Link from "next/link";
import { Container } from "@/components/ui";
import { PrimaryNav } from "@/components/PrimaryNav";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <Container className="flex flex-wrap items-center justify-between gap-x-6">
        <Link
          href="/"
          className="focus-ring inline-flex min-h-14 items-center font-mono text-sm font-medium tracking-tight text-foreground transition-colors hover:text-accent"
        >
          koshikai<span className="text-muted">.dev</span>
        </Link>

        {/* スマホではロゴと切り替えボタンの下にナビを1行で並べる */}
        <div className="order-last -mx-2 w-[calc(100%+1rem)] border-t border-border sm:order-none sm:mx-0 sm:w-auto sm:flex-1 sm:border-t-0">
          <PrimaryNav />
        </div>

        <ThemeToggle />
      </Container>
    </header>
  );
}
