"use client";

import { useRef } from "react";

/**
 * Tilt — ポインタの位置に合わせて、子要素がわずかに奥行きをもって傾く。
 *
 * 状態は持たず、CSS 変数 (--rx / --ry) だけを直接書き換える。移動のたびに
 * 再描画しないので軽い。傾けるのはマウス/ペンのときだけで、タッチでは何もしない。
 * 動きを減らす設定では CSS 側で transform を無効にする。
 */
type TiltProps = {
  children: React.ReactNode;
  /** 最大の傾き (deg) */
  max?: number;
  className?: string;
};

export function Tilt({ children, max = 5, className = "" }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // 中心を 0、端を ±1 とした位置
    const px = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const py = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    el.style.setProperty("--rx", `${(-py * max).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * max).toFixed(2)}deg`);
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.removeProperty("--rx");
    el.style.removeProperty("--ry");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      className={`tilt ${className}`.trim()}
    >
      {children}
    </div>
  );
}
