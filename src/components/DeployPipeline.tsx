"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { pipelineSteps } from "@/lib/engineering";

/**
 * このサイト自体のデプロイ経路。「運用できる」を文章で主張する代わりに、
 * いま見ているページがどう届いているかをそのまま見せる。
 * 縦並びにしておけば、スマホでも横スクロールなしで同じ図が読める。
 *
 * スクロールで図に入ると、上から順にステップが点灯し、次のステップへ
 * 伸びるラインが繋がっていく。到達点である /healthz だけは最初から
 * 塗りつぶしで置き、「ここへ向かう」ことが読み取れるようにする。
 */
export function DeployPipeline() {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [inView, setInView] = useState(false);

  // JS 起動後にのみ演出を有効化する (SSR/No-JS では通常表示)
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
      // 図の上半分が見えた時点で始める。セクション側の Reveal より
      // 少し遅らせ、見出しが落ち着いてから点灯が始まるようにする。
      { threshold: 0.2, rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stateClass = `${armed ? "rev" : ""} ${inView ? "in" : ""}`.trim();

  return (
    <figure id="pipeline" ref={ref} className={`pipeline rounded border border-border bg-background ${stateClass}`}>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border px-5 py-3">
        <span className="text-sm font-medium text-foreground">このサイトが届くまで</span>
        <span className="font-mono text-[11px] text-muted">.github/workflows/deploy.yml</span>
      </figcaption>
      <ol role="list" className="list-none px-5 py-4">
        {pipelineSteps.map((step, i) => {
          const isGoal = i === pipelineSteps.length - 1;
          return (
            <li
              key={step.label}
              className="pipeline-step relative flex items-baseline gap-4 py-1.5"
              // 150ms の助走 + 170ms 刻みで、上から順に点いていく
              style={{ "--pi": `${150 + i * 170}ms` } as CSSProperties}
            >
              {!isGoal && (
                <span aria-hidden="true" className="pipeline-line absolute left-[0.6875rem] top-[1.35rem] h-full w-px" />
              )}
              <span
                aria-hidden="true"
                className={`pipeline-dot relative z-10${isGoal ? " pipeline-dot-goal" : ""}`}
              >
                {i + 1}
              </span>
              <span className="font-mono text-[13px] text-foreground">{step.label}</span>
              <span className="ml-auto text-right text-xs text-muted">{step.detail}</span>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
