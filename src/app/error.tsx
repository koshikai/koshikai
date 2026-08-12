"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main
      id="main-content"
      className="flex flex-1 items-center justify-center bg-background px-6 py-12 text-foreground"
    >
      <section role="alert" className="w-full max-w-2xl border-t border-border pt-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center border border-border text-accent">
          <RefreshCw className="h-6 w-6" aria-hidden="true" />
        </div>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
          Error
        </p>

        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground">
          問題が発生しました
        </h1>

        <p className="mt-4 text-sm leading-[1.9] text-muted">
          予期しないエラーが発生しました。再試行するか、トップページからやり直してください。
        </p>

        {process.env.NODE_ENV === "development" && (
          <pre className="mt-4 overflow-x-auto rounded-sm border border-border bg-surface p-4 text-left font-mono text-xs text-foreground">
            {error.message}
            {error.digest && <div className="mt-2 text-muted">Digest: {error.digest}</div>}
          </pre>
        )}

        <div className="mt-8 flex justify-center gap-6">
          <button
            onClick={reset}
            className="focus-ring inline-flex min-h-11 items-center gap-2 border border-accent bg-accent px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-background transition-opacity hover:opacity-90"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            再試行
          </button>
          <Link
            href="/"
            className="focus-ring group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-foreground transition-colors hover:text-accent"
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
