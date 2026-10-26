"use client";

import { useEffect, useRef, useState } from "react";
import { Compass } from "lucide-react";

/**
 * CursorCompass — 404 のコンパス。ポインタが動いたら、その方向に針を向ける。
 *
 * 動かすまではゆっくり回り続け (行き先を探している)、カーソルが動いた時点で
 * 回転をやめてカーソルを指す。lucide の針は右上を向いているため +45deg ずらす。
 * 動きを減らす設定やタッチ操作では追従せず、元の見た目のままにする。
 */
const NEEDLE_OFFSET = 45;

export function CursorCompass({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // 最短回りで追従させるため、角度は 360 を超えて積算する
    let current = 0;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const target = (Math.atan2(dy, dx) * 180) / Math.PI + NEEDLE_OFFSET;
      current += ((target - current + 540) % 360) - 180;
      el.style.transform = `rotate(${current.toFixed(1)}deg)`;
      setTracking(true);
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Compass
      ref={ref}
      className={`${className} ${tracking ? "compass-track" : "notfound-compass"}`.trim()}
      aria-hidden="true"
    />
  );
}
