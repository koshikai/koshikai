import { useEffect, useRef } from "react";

/**
 * ParticleType — 見出しの代わりに置く粒子の文字。
 *
 * `build → operate → research` を粒子で組み替える。サイトの 3 軸を、
 * スクリーンショットではなく動きで示すためのもの。
 *
 * - 文字はオフスクリーンに描いて画素を拾い、点の集合にする。だから語を
 *   変えても字形はフォントのまま崩れない
 * - 粒子が多いほど「線」に見える。少ないと薄い点線に見えて安っぽくなるので
 *   サンプリング間隔は文字サイズに比例させ、点の総数は 1000 以上を保つ
 * - 動きを減らす設定では最初の語を静止画で描いて止める
 * - 画面外・非表示タブでは rAF を止める
 * - 色はトークンから読む（テーマ切り替えで読み直す）
 */
type ParticleTypeProps = {
  /** 巡回する語。空配列なら何も描かない */
  words?: readonly string[];
  /** 表示される読み上げ用テキスト（canvas は aria-hidden） */
  label?: string;
  className?: string;
};

type Particle = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  /** 組み替え中にだけ使う揺らぎの位相 */
  phase: number;
  accent: boolean;
};

const HOLD_MS = 3400;
const MORPH_MS = 1400;
const MAX_PARTICLES = 4200;

/** 語が枠の 90% に収まる文字サイズ（等幅の前進幅は約 0.6em） */
function fontFor(width: number, height: number, word: string): number {
  const byWidth = (width * 0.9) / (Math.max(word.length, 1) * 0.6);
  return Math.min(byWidth, height * 0.62, 220);
}

function readColor(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!value) return fallback;
  if (value.startsWith("#")) {
    const hex =
      value.length === 4
        ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
        : value.slice(0, 7);
    const int = Number.parseInt(hex.slice(1), 16);
    return `${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}`;
  }
  const parts = value.match(/[\d.]+/g);
  return parts && parts.length >= 3 ? `${parts[0]}, ${parts[1]}, ${parts[2]}` : fallback;
}

export function ParticleType({ words = [], label, className = "" }: ParticleTypeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || words.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d");
    if (!offCtx) return;

    let width = 0;
    let height = 0;
    let ink = "23, 23, 26";
    let accent = "192, 57, 43";
    // 暗い背景では同じ alpha でも点が沈むので、明るさの下限を上げる
    let dark = false;

    let particles: Particle[] = [];
    let index = 0;
    let frame = 0;
    let visible = true;
    let swappedAt = 0;
    let morphing = false;
    let morphStart = 0;
    let clock = 0;

    const pointer = { x: -9999, y: -9999 };

    /** 語を描いて画素を拾い、点の集合にする */
    const sampleWord = (word: string): Array<[number, number]> => {
      const size = Math.round(fontFor(width, height, word));
      off.width = Math.max(1, Math.round(width));
      off.height = Math.max(1, Math.round(height));
      offCtx.clearRect(0, 0, off.width, off.height);
      offCtx.fillStyle = "#000";
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.font = `500 ${size}px ${getComputedStyle(document.body).getPropertyValue("--font-mono") || "ui-monospace"}`;
      offCtx.fillText(word, off.width / 2, off.height / 2);

      const data = offCtx.getImageData(0, 0, off.width, off.height).data;
      // 点の間隔は文字サイズに比例させる。固定値だと小さい画面で薄くなる
      const gap = Math.max(2, Math.round(size / 56));
      const points: Array<[number, number]> = [];
      for (let y = 0; y < off.height; y += gap) {
        for (let x = 0; x < off.width; x += gap) {
          if (data[(y * off.width + x) * 4 + 3] > 128) points.push([x, y]);
          if (points.length >= MAX_PARTICLES) return points;
        }
      }
      return points;
    };

    /** 目標座標を差し替える。対応を毎回ずらして、粒子が一方向に固まらないようにする */
    const assignTargets = (points: Array<[number, number]>) => {
      const shuffled = points.slice();
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      for (let i = 0; i < particles.length; i++) {
        const target = shuffled[i % shuffled.length];
        particles[i].tx = target[0];
        particles[i].ty = target[1];
      }
    };

    const build = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ink = readColor("--foreground", "23, 23, 26");
      accent = readColor("--accent", "192, 57, 43");
      const bg = readColor("--background", "250, 250, 247").split(",").map(Number);
      dark = (0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]) / 255 < 0.5;

      // すべての語で共通の粒子数（最小の語に合わせる）を決めてから配置する
      const sets = words.map(sampleWord);
      const count = Math.min(MAX_PARTICLES, ...sets.map((s) => s.length));
      const base = sets[0];
      particles = [];
      for (let i = 0; i < count; i++) {
        const [x, y] = base[i];
        particles.push({ x, y, tx: x, ty: y, phase: Math.random() * Math.PI * 2, accent: Math.random() < 0.035 });
      }
      assignTargets(sets[index]);
    };

    const draw = (dt: number) => {
      clock += dt;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        const ease = morphing ? 0.085 : 0.02;
        p.x += (p.tx - p.x) * ease;
        p.y += (p.ty - p.y) * ease;

        let x = p.x;
        let y = p.y;
        if (morphing) y += Math.sin(clock * 1.6 + p.phase) * 1.1;

        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 110) {
          const push = (1 - distance / 110) * 22;
          x += (dx / (distance || 1)) * push;
          y += (dy / (distance || 1)) * push;
        }

        // 明度の波を通す。静止していても面が死なない
        const wave = 0.5 + 0.5 * Math.sin((p.tx + p.ty) * 0.011 - clock * 2.1);
        const size = p.accent ? 2.3 : 1.9;
        ctx.fillStyle = p.accent
          ? `rgba(${accent}, ${((dark ? 0.55 : 0.4) + wave * 0.45).toFixed(3)})`
          : `rgba(${ink}, ${((dark ? 0.5 : 0.34) + wave * 0.4).toFixed(3)})`;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }
    };

    let last = 0;
    const loop = (now: number) => {
      const dt = last ? Math.min(48, now - last) : 16;
      last = now;

      if (!morphing && now - swappedAt > HOLD_MS) {
        morphing = true;
        morphStart = now;
      }
      if (morphing && now - morphStart > MORPH_MS) {
        morphing = false;
        swappedAt = now;
        index = (index + 1) % words.length;
        assignTargets(sampleWord(words[index]));
      }

      draw(dt);
      frame = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (frame !== 0 || reduceQuery.matches) return;
      last = 0;
      swappedAt = performance.now();
      frame = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    const onMotionPreference = () => {
      stop();
      last = 0;
      if (reduceQuery.matches) draw(16);
      else start();
    };

    const resizeObserver = new ResizeObserver(() => {
      const previous = index;
      build();
      index = previous;
      if (reduceQuery.matches) draw(16);
    });
    resizeObserver.observe(wrap);

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible) start();
        else stop();
      },
      { threshold: 0 },
    );
    visibilityObserver.observe(canvas);

    const themeObserver = new MutationObserver(() => {
      ink = readColor("--foreground", "23, 23, 26");
      accent = readColor("--accent", "192, 57, 43");
      const bg = readColor("--background", "250, 250, 247").split(",").map(Number);
      dark = (0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]) / 255 < 0.5;
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // フォントが読み込まれてから拾わないと、代替フォントの形で固定される
    const ready = document.fonts?.ready ?? Promise.resolve();
    void ready.then(() => {
      build();
      if (reduceQuery.matches) draw(16);
      else start();
    });

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reduceQuery.addEventListener("change", onMotionPreference);

    return () => {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceQuery.removeEventListener("change", onMotionPreference);
    };
  }, [words]);

  if (words.length === 0) return null;

  return (
    <div ref={wrapRef} className={`relative aspect-[16/9] w-full ${className}`.trim()}>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
      <span className="sr-only">{label ?? words.join(" / ")}</span>
    </div>
  );
}
