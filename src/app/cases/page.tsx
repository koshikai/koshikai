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
    <div className="min-h-screen bg-background text-foreground">
      <main
        id="main-content"
        className="mx-auto w-full max-w-5xl px-6 py-12 sm:py-16 lg:py-20"
      >
        <div className="mb-12">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
            Back to top
          </Link>
        </div>

        <header className="border-t border-border pt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Case Studies
          </p>
          <h1 className="mt-3 text-balance font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            事例集
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-[1.9] text-muted">
            課題をどのように切り分け、何を選び、運用しながら改善したかを
            事例ごとにまとめています。
          </p>
        </header>

        <section className="mt-14">
          {caseItems.map((item) => (
            <article key={item.slug} className="border-t border-border last:border-b">
              <Link
                href={`/cases/${item.slug}`}
                className="group grid gap-4 py-8 transition-colors sm:grid-cols-[8rem_1fr] sm:gap-8"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                  {item.publishedAt}
                </p>
                <div>
                  <h2 className="flex items-start justify-between gap-4 font-serif text-lg font-semibold text-foreground transition-colors group-hover:text-accent sm:text-xl">
                    <span>{item.title}</span>
                    <ArrowRight
                      className="mt-1 h-4 w-4 shrink-0 text-muted transition-[transform,color] group-hover:translate-x-1 group-hover:text-accent motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-[1.9] text-muted">
                    {item.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
