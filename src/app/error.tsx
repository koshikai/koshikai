"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main id="main-content" className="flex min-h-screen items-center justify-center bg-page-gradient px-6 py-12">
      <section className="w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white/80 p-10 text-center shadow-[0_30px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300">
          <RefreshCw className="h-7 w-7" />
        </div>

        <p className="mt-6 text-sm font-bold tracking-[0.3em] text-red-700 uppercase dark:text-red-300">
          Error
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          問題が発生しました
        </h1>

        <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
          予期しないエラーが発生しました。再試行するか、トップページからやり直してください。
        </p>

        {process.env.NODE_ENV === "development" && (
          <pre className="mt-4 overflow-x-auto rounded-xl bg-zinc-100 p-4 text-left text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {error.message}
            {error.digest && <div className="mt-2 text-zinc-400">Digest: {error.digest}</div>}
          </pre>
        )}

        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-sky-500"
          >
            <RefreshCw className="h-4 w-4" />
            再試行
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-bold text-zinc-700 transition-colors hover:border-sky-300 hover:text-sky-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-sky-700 dark:hover:text-sky-200"
          >
            <ArrowLeft className="h-4 w-4" />
            トップへ戻る
          </Link>
        </div>
      </section>
    </main>
  );
}
