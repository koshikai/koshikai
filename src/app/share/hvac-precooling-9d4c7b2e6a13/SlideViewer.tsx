"use client";

import { useCallback, useEffect, useState } from "react";

import { ChevronLeft, ChevronRight, Download, Presentation } from "lucide-react";
import {
  buildCombinedNotes,
  hvacSlides,
  hvacSlidesPptxHref,
} from "@/lib/hvac-slides";

/**
 * 発表スライドのビューア。
 *
 * スライドは自己完結SVGなので、img ではなくインラインで置く。
 * img にすると中の文字が選択・検索できず、拡大したときの見え方も落ちる。
 * 埋め込む文字列はビルド時に取り込む自前の生成物で、利用者の入力は通らない。
 */
export function SlideViewer() {
  const { slides, hasNotes } = hvacSlides;
  const [current, setCurrent] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);

  const total = slides.length;
  const slide = slides[current];

  const go = useCallback(
    (next: number) => {
      setCurrent((prev) => {
        const value = prev + next;
        if (value < 0) return 0;
        if (value > total - 1) return total - 1;
        return value;
      });
    },
    [total],
  );

  // 発表資料を見るページなので、左右キーで送れないと不便になる。
  // 入力欄にフォーカスがあるときは横取りしない。
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go]);

  if (!slide) {
    return <p className="text-sm text-muted">表示できるスライドがない。</p>;
  }

  const pptxHref = hvacSlidesPptxHref(hvacSlides);
  const navButton =
    "focus-ring inline-flex items-center gap-1 rounded-sm border border-border px-3 py-2 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-muted cursor-pointer";

  return (
    <section aria-label="発表スライド">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-mono text-sm text-foreground">
            {slide.index}. {slide.title}
          </h2>
          <p className="mt-1 font-mono text-[11px] text-muted">
            全 {total} ページ / 左右キーでも送れる
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {hasNotes ? (
            <button
              type="button"
              onClick={() => setNotesOpen((open) => !open)}
              aria-expanded={notesOpen}
              className={navButton}
            >
              <Presentation className="h-3.5 w-3.5" aria-hidden="true" />
              {notesOpen ? "発表者ノートを隠す" : "発表者ノートを見る"}
            </button>
          ) : null}
          {pptxHref ? (
            <a
              href={pptxHref}
              download
              className="focus-ring inline-flex items-center gap-2 rounded-sm border border-accent bg-accent-weak px-3 py-2 font-mono text-xs tracking-[0.08em] text-accent transition-colors hover:bg-accent hover:text-background"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              PPTX をダウンロード
            </a>
          ) : null}
        </div>
      </div>

      {/*
        スライドの地は白で固定なので、ダークテーマでも枠を付けて
        「背景が抜けている」ように見えないようにする。
      */}
      <div
        className="overflow-hidden rounded-sm border border-border bg-white [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
        style={{ aspectRatio: `${slide.width} / ${slide.height}` }}
        role="img"
        aria-label={`スライド ${slide.index}: ${slide.title}`}
        dangerouslySetInnerHTML={{ __html: slide.svg }}
      />

      <div className="mt-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={current === 0}
          className={navButton}
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          前へ
        </button>
        <p className="font-mono text-xs text-muted">
          {slide.index} / {total}
        </p>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={current === total - 1}
          className={navButton}
        >
          次へ
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      {notesOpen && hasNotes ? (
        <div className="mt-4 rounded-sm border border-border bg-subtle/20 p-5">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
            発表者ノート — {slide.index}. {slide.title}
          </p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-[1.9] text-muted">
            {slide.notes ?? "このページのノートはない。"}
          </p>
        </div>
      ) : null}

      <nav aria-label="スライド一覧" className="mt-6 flex flex-wrap gap-2">
        {slides.map((item, index) => {
          const selected = index === current;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={selected ? "true" : undefined}
              onClick={() => setCurrent(index)}
              className={`focus-ring inline-flex max-w-full items-center gap-2 rounded-sm border px-3 py-2 text-left font-mono text-[11px] transition-colors cursor-pointer ${
                selected
                  ? "border-accent bg-accent-weak text-accent"
                  : "border-border text-muted hover:border-accent hover:text-accent"
              }`}
            >
              <span className="tabular-nums">
                {String(item.index).padStart(2, "0")}
              </span>
              <span className="truncate">{item.title}</span>
            </button>
          );
        })}
      </nav>

      {hasNotes ? (
        <details className="mt-6 rounded-sm border border-border bg-subtle/20 p-5">
          <summary className="focus-ring cursor-pointer font-mono text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
            発表者ノート全文
          </summary>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-[1.9] text-muted">
            {buildCombinedNotes(hvacSlides)}
          </p>
        </details>
      ) : null}
    </section>
  );
}
