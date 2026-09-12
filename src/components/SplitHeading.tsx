"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType } from "react";

/**
 * SplitHeading — 1 文字ずつ立ち上がる見出し。
 *
 * 1. マウント直後の次フレームで .rev を付与 → 各文字がクリップ内に隠れる
 * 2. ビューポート進入で .in → 1 文字ずつ (既定 26ms 刻み) 上に立ち上がる
 *
 * 状態を同期 setState で立てないのは、React 19 の lint
 * (react-hooks/set-state-in-effect) に引っかかるうえ、SSR/JS 無効時に
 * 中身が隠れたままになるのを避けるため。.rev が付かない限り通常表示。
 *
 * 日本語は skew=false (垂直リフト)、欧文は skew=true (わずかな傾き付き)。
 */
type SplitHeadingProps = {
  /** レンダリングするタグ */
  as?: ElementType;
  /** 見出しテキスト (children との併用は不可) */
  text?: string;
  children?: string;
  className?: string;
  /** 見出しに付ける id (aria-labelledby から参照される) */
  id?: string;
  /**
   * 折り返してよい単位 (lib/chunks.ts の splitIntoChunks で作る)。
   * 省略すると 1 文字ずつになり、日本語では語の途中で折れる。
   * 分割はサーバー側で済ませ、ここには結果だけを渡す。
   */
  chunks?: readonly string[];
  /** 欧文向け: skewY + scaleY を伴う立ち上がり */
  skew?: boolean;
  /** 1 文字ごとの遅延 (ms)。ヒーローは 60-90 でドラマチックに */
  delayStep?: number;
  /** 最初の文字の遅延 (ms) */
  delayStart?: number;
  /** IntersectionObserver の threshold */
  threshold?: number;
};

export function SplitHeading({
  as: Tag = "h2",
  text,
  children,
  className = "",
  id,
  chunks,
  skew = false,
  delayStep = 26,
  delayStart = 40,
  threshold = 0.15,
}: SplitHeadingProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [reveal, setReveal] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const rid = requestAnimationFrame(() => setReveal(true));
    return () => cancelAnimationFrame(rid);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const content = (text ?? children ?? "").toString();
  const charClass = skew ? "sh sh-skew" : "sh";
  let charIndex = 0;

  const renderChar = (char: string) => (
    <span
      key={charIndex}
      className={charClass}
      style={{ "--ci": `${delayStart + charIndex++ * delayStep}ms` } as CSSProperties}
    >
      <span className="sh-i">{char}</span>
    </span>
  );

  return (
    <Tag
      ref={ref}
      id={id}
      className={`split-heading ${reveal ? "rev" : ""} ${inView ? "in" : ""} ${className}`.trim()}
      aria-label={content}
    >
      {/* 読み上げは素のテキストで 1 回だけ。装飾用の分割側は aria-hidden */}
      <span className="sr-only">{content}</span>
      <span aria-hidden="true">
        {chunks
          ? // 語のまとまりごとに inline-block で包む。改行はこの境界でだけ起きる。
            chunks.map((chunk, i) => (
              <span key={i} className="sh-chunk">
                {[...chunk].map(renderChar)}
              </span>
            ))
          : content
              .split(" ")
              .map((word, wi, all) => (
                <span key={wi} className="sh-word">
                  {[...word].map(renderChar)}
                  {wi < all.length - 1 && <span className="sh-gap"> </span>}
                </span>
              ))}
      </span>
    </Tag>
  );
}
