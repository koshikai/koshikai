import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { caseItems } from "@/lib/cases";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "課題発見から実装、運用改善までの取り組みをまとめたケース一覧。",
};

export default function CasesPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.2),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_55%,_#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_28%),linear-gradient(180deg,_#09090b_0%,_#111827_60%,_#09090b_100%)]">
      <main id="main-content" className="mx-auto w-full max-w-5xl px-6 py-10 sm:px-8 sm:py-14">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-bold text-zinc-700 transition-colors hover:border-sky-300 hover:text-sky-700 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200 dark:hover:border-sky-700 dark:hover:text-sky-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to top
          </Link>
        </div>

        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
          <h1 className="text-balance text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Case Studies
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-300">
            課題をどのように切り分け、何を選び、運用しながら改善したかを
            事例ごとにまとめています。
          </p>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          {caseItems.map((item) => (
            <article
              key={item.slug}
              className="flex flex-col rounded-3xl border-2 border-zinc-200 bg-white/80 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] dark:border-zinc-700 dark:bg-zinc-900/50"
            >
              <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                {item.publishedAt}
              </p>
              <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                {item.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/cases/${item.slug}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-sky-700 hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-200"
              >
                詳しく見る
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
