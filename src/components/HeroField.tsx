import { useEffect, useRef } from "react";

/**
 * HeroField — ヒーローの背後に敷く地形線のレイヤー。
 *
 * 文字だけのファーストビューに奥行きを足すためのもの。色も飾りも増やさず、
 * 罫線と同じ濃さの細線だけで「面がそこにある」ことを伝える。マウスを動かすと
 * 近くの線がわずかに持ち上がり、いちばん近い 1 本だけアクセント色になる。
 *
 * - 線の濃さは --foreground の alpha で作る（テーマを切り替えても同じ濃さになる）
 * - 動きを減らす設定では 1 枚だけ描いて止める（追従もしない）
 * - 画面外・非表示タブでは rAF を止める
 */
const LINE_COUNT = 15;
const GRID_STEP = 96;
const LIFT_RADIUS = 300;
const LIFT_HEIGHT = 26;
const MAX_DPR = 2;

function toRgb(value: string): [number, number, number] {
  const raw = value.trim();
  if (raw.startsWith("#")) {
    const hex =
      raw.length === 4
        ? `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`
        : raw.slice(0, 7);
    const int = Number.parseInt(hex.slice(1), 16);
    return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
  }
  const parts = raw.match(/[\d.]+/g);
  return parts && parts.length >= 3
    ? [Number(parts[0]), Number(parts[1]), Number(parts[2])]
    : [128, 128, 128];
}

type Palette = {
  ink: string;
  accent: string;
  /** 暗い背景では同じ alpha でも線が強く出るので、濃さを落とす */
  dark: boolean;
};

function readPalette(): Palette {
  const styles = getComputedStyle(document.documentElement);
  const ink = toRgb(styles.getPropertyValue("--foreground") || "#17171a");
  const accent = toRgb(styles.getPropertyValue("--accent") || "#c0392b");
  const background = toRgb(styles.getPropertyValue("--background") || "#fafaf7");
  const luminance = (0.299 * background[0] + 0.587 * background[1] + 0.114 * background[2]) / 255;
  return {
    ink: `${ink[0]}, ${ink[1]}, ${ink[2]}`,
    accent: `${accent[0]}, ${accent[1]}, ${accent[2]}`,
    dark: luminance < 0.5,
  };
}

/** 左右の端を切らずに消すための水平グラデーション */
function edgeStroke(ctx: CanvasRenderingContext2D, width: number, rgb: string, alpha: number) {
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, `rgba(${rgb}, 0)`);
  gradient.addColorStop(0.08, `rgba(${rgb}, ${alpha})`);
  gradient.addColorStop(0.9, `rgba(${rgb}, ${alpha})`);
  gradient.addColorStop(1, `rgba(${rgb}, 0)`);
  return gradient;
}

export function HeroField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let palette = readPalette();

    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let startedAt = 0;
    // ポインタは目標値へ遅れて追いつく。直接動かすと線が跳ねる
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = Math.round(rect.width);
      height = Math.round(rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawGrid = () => {
      ctx.strokeStyle = edgeStroke(ctx, width, palette.ink, palette.dark ? 0.038 : 0.05);
      ctx.beginPath();
      for (let x = GRID_STEP; x < width; x += GRID_STEP) {
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, height);
      }
      for (let y = GRID_STEP; y < height; y += GRID_STEP) {
        ctx.moveTo(0, Math.round(y) + 0.5);
        ctx.lineTo(width, Math.round(y) + 0.5);
      }
      ctx.stroke();
    };

    const draw = (now: number) => {
      if (startedAt === 0) startedAt = now;
      const time = now - startedAt;
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      const phase = reduceQuery.matches ? 0 : time * 0.00022;

      ctx.clearRect(0, 0, width, height);

      // --- 罫線と同じ濃さの方眼。面の位置を示すだけで、模様にはしない ---
      // モバイル幅では文字に近く、本文の区切り線と紛らわしいので引かない
      ctx.lineWidth = 1;
      if (width >= 640) {
        drawGrid();
      }

      // --- 地形線。ポインタの真下だけが持ち上がる ---
      const top = height * 0.08;
      const span = height * 0.84;
      const step = span / (LINE_COUNT - 1);
      const nearest = Math.round((pointer.y - top) / step);
      const points = 72;

      for (let i = 0; i < LINE_COUNT; i++) {
        const baseY = top + i * step;
        const amplitude = 12 + 7 * Math.sin(i * 0.9 + 0.4);
        const isNearest =
          pointer.active && Math.abs(i - nearest) === 0 && pointer.y > top - step && pointer.y < top + span + step;

        ctx.beginPath();
        for (let p = 0; p <= points; p++) {
          const t = p / points;
          const x = t * width;
          let y =
            baseY +
            Math.sin(t * Math.PI * 2 * 1.15 + phase + i * 0.55) * amplitude +
            Math.sin(t * Math.PI * 2 * 2.35 - phase * 0.8 + i * 1.3) * amplitude * 0.32;

          if (pointer.active) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const distance = Math.hypot(dx, dy);
            if (distance < LIFT_RADIUS) {
              const falloff = 1 - distance / LIFT_RADIUS;
              y -= falloff * falloff * LIFT_HEIGHT;
            }
          }

          if (p === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = isNearest
          ? edgeStroke(ctx, width, palette.accent, palette.dark ? 0.38 : 0.55)
          : edgeStroke(ctx, width, palette.ink, (palette.dark ? 0.125 : 0.16) - (i % 2) * 0.045);
        ctx.lineWidth = isNearest ? 1.25 : 1;
        ctx.stroke();
      }
    };

    const loop = (now: number) => {
      draw(now);
      frame = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (frame !== 0) return;
      if (reduceQuery.matches) {
        draw(0);
        return;
      }
      frame = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      // 動きを減らす設定では追従もしない（静止した地形として置いておく）
      if (event.pointerType === "touch" || reduceQuery.matches) return;
      const rect = canvas.getBoundingClientRect();
      pointer.tx = event.clientX - rect.left;
      pointer.ty = event.clientY - rect.top;
      if (!pointer.active) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
        pointer.active = true;
      }
    };

    const onPointerLeave = () => {
      pointer.active = false;
      pointer.tx = -9999;
      pointer.ty = -9999;
    };

    const onMotionPreference = () => {
      stop();
      draw(0);
      start();
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };

    // テーマ切り替え（.dark）で線の色を読み直す
    const themeObserver = new MutationObserver(() => {
      palette = readPalette();
      if (frame === 0) draw(0);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const sizeObserver = new ResizeObserver(() => {
      resize();
      if (frame === 0) draw(0);
    });
    sizeObserver.observe(canvas);

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible) start();
        else stop();
      },
      { threshold: 0 },
    );
    visibilityObserver.observe(canvas);

    resize();
    draw(0);
    start();

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reduceQuery.addEventListener("change", onMotionPreference);

    return () => {
      stop();
      sizeObserver.disconnect();
      visibilityObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceQuery.removeEventListener("change", onMotionPreference);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 h-full w-full [mask-image:linear-gradient(to_bottom,black_38%,transparent_66%)] sm:[mask-image:linear-gradient(to_bottom,black_62%,transparent)] ${className}`}
    />
  );
}
