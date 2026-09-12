"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal — スクロールで進入したときに、わずかに下から現れる。
 *
 * .rev はマウント後の次フレームで付ける。JS 無効時は付かないので
 * 中身はそのまま表示され、コンテンツが隠れたままにならない。
 * 動きを減らす設定では CSS 側で最終状態に固定する。
 */
type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** 兄弟要素と少しずらしたいときの遅延 (ms) */
  delay?: number;
  /** IntersectionObserver の threshold */
  threshold?: number;
};

export function Reveal({ children, className = "", delay = 0, threshold = 0.1 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setArmed(true));
    return () => cancelAnimationFrame(id);
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
      { threshold, rootMargin: "0px 0px -50px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`reveal ${armed ? "rev" : ""} ${inView ? "in" : ""} ${className}`.trim()}
      style={delay ? ({ "--rd": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
