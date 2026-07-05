import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground"
    >
      <section className="w-full max-w-2xl border-t border-border pt-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center border border-border text-accent">
          <Compass className="h-6 w-6" aria-hidden="true" />
        </div>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
          404
        </p>

        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground">
          ページが見つかりません
        </h1>

        <p className="mt-4 text-sm leading-[1.9] text-muted">
          URL を確認するか、トップページから目的のページへ戻ってください。
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-foreground transition-colors hover:text-accent"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
            トップへ戻る
          </Link>
        </div>
      </section>
    </main>
  );
}
