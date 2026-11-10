import { useEffect, useRef } from "react";

/**
 * ParticleType — 見出しの代わりに置く粒子の文字。
 *
 * `build → operate → research` を粒子で組み替える。サイトの 3 軸を、
 * スクリーンショットではなく動きで示すためのもの。
 *
 * - 文字はオフスクリーンに描いて画素を拾い、点の集合にする。だから語を
 *   変えても字形はフォントのまま崩れない
 * - 点は格子ではなく「最小距離つきの散布（Poisson disk）」で置き、輪郭には
 *   内側より密に点を並べる。格子だと斜めの線や曲線で縞が出て、間引くと縁が
 *   ほつれる。輪郭が詰まっていれば、点の数が少なくても字形は締まって見える
 * - 粒子数はすべての語で同じにし、語ごとにちょうどその数だけ点を作る。
 *   以前は最小の語に合わせて他の語をランダムに間引いており、それが穴の原因だった
 * - 組み替えは左右の位置関係を保ったまま対応付け、左から順に時差をつけて
 *   曲線で飛ばす。ランダムに対応付けると全粒子が中央を横切り、途中で団子になる
 * - 各粒子に奥行き（z）を持たせ、大きさ・明度・カーソルへの反応量を変える
 * - 動きを減らす設定では現在の語を静止画で描いて止める
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

/** 字形上の 1 点。edge は輪郭上なら 1 */
export type GlyphPoint = { x: number; y: number; edge: 0 | 1 };

/** 二値化した字形。ink は塗られた画素の添字、edge はそれぞれが輪郭か */
export type GlyphMask = {
  w: number;
  h: number;
  ink: Int32Array;
  edge: Uint8Array;
};

type WordShape = {
  points: GlyphPoint[];
  /** 点同士のおおよその間隔。点の大きさをこれに比例させる */
  spacing: number;
  size: number;
  minX: number;
  maxX: number;
};

type Particle = {
  /** 現在の基準位置（カーソルの変位・波を足す前） */
  x: number;
  y: number;
  /** モーフの始点・終点と、曲線の制御点 */
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  bx: number;
  by: number;
  /** モーフ全体（0..1）の中でこの粒子が動き出す時刻 */
  delay: number;
  /** 輪郭らしさ。始点と終点の値を補間する */
  edge: number;
  se: number;
  te: number;
  /** 奥行き。0 が奥（小さく淡い）、1 が手前 */
  z: number;
  seed: number;
  accent: boolean;
  /** カーソルによる変位とその速度（ばねで基準位置へ戻る） */
  ox: number;
  oy: number;
  vx: number;
  vy: number;
};

const HOLD_MS = 3400;
const MORPH_MS = 1700;
/** 粒子 1 つの飛行時間（モーフ全体に対する割合）。残りを動き出しの時差に使う */
const FLIGHT = 0.58;
const MAX_PARTICLES = 4200;
const MIN_PARTICLES = 900;
/** 輪郭上の点の間隔を内側の何倍にするか。小さいほど縁が締まる */
const EDGE_RATIO = 0.58;
/** 明度の段階数。fillStyle の切り替えを段階数ぶんに抑えて描画を軽くする */
const LEVELS = 16;
/** 静止時に字面を斜めに横切る光の帯の周期 */
const WAVE_MS = 4200;
/** カーソル変位を戻すばね。減衰を臨界より少し弱くして、戻りに小さな揺れを残す */
const SPRING = 70;
const DAMPING = 10;

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

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

function shuffleInPlace<T extends { [i: number]: number; length: number }>(a: T, random: () => number): T {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

/** アルファ画像を二値化し、塗り画素と輪郭画素（4 近傍に空きがある画素）を拾う */
export function maskFromAlpha(alpha: ArrayLike<number>, w: number, h: number, stride = 4): GlyphMask {
  const on = new Uint8Array(w * h);
  let count = 0;
  for (let i = 0; i < w * h; i++) {
    // 半透明の縁を 128 で切る。アンチエイリアスの外側を拾うと字が太って甘く見える
    if (alpha[i * stride + (stride - 1)] >= 128) {
      on[i] = 1;
      count++;
    }
  }
  const ink = new Int32Array(count);
  const edge = new Uint8Array(count);
  let k = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!on[i]) continue;
      ink[k] = i;
      edge[k] =
        x === 0 || x === w - 1 || y === 0 || y === h - 1 || !on[i - 1] || !on[i + 1] || !on[i - w] || !on[i + w]
          ? 1
          : 0;
      k++;
    }
  }
  return { w, h, ink, edge };
}

/**
 * 字形にちょうど n 個の点を散布する。
 *
 * 先に輪郭画素へ狭い間隔で点を打ち、残りを内側へ広い間隔で打つ（dart throwing）。
 * 点の数は間隔の 2 乗に反比例するので、間隔を数回補正して n に寄せ、
 * 端数は内側から間引く／足す。輪郭の点は削らない。
 */
export function scatterGlyph(mask: GlyphMask, n: number, random: () => number = Math.random): { points: GlyphPoint[]; spacing: number } {
  const { w, ink, edge } = mask;
  if (ink.length === 0 || n <= 0) return { points: [], spacing: 1 };

  const order = shuffleInPlace(Int32Array.from({ length: ink.length }, (_, i) => i), random);
  const edgeOrder: number[] = [];
  const innerOrder: number[] = [];
  for (const i of order) (edge[i] ? edgeOrder : innerOrder).push(i);

  const dart = (r: number) => {
    const re = r * EDGE_RATIO;
    // セルの一辺を内側の間隔 r にすると、近傍 3×3 を見るだけで衝突判定が済む
    const cell = r;
    const gw = Math.ceil(mask.w / cell) + 1;
    const gh = Math.ceil(mask.h / cell) + 1;
    const grid: (number[] | undefined)[] = new Array(gw * gh);
    const xs: number[] = [];
    const ys: number[] = [];
    const es: (0 | 1)[] = [];
    const tryAdd = (idx: number, rad: number, e: 0 | 1) => {
      const p = ink[idx];
      const px = (p % w) + 0.5;
      const py = Math.floor(p / w) + 0.5;
      const cx = Math.floor(px / cell);
      const cy = Math.floor(py / cell);
      const r2 = rad * rad;
      for (let gy = Math.max(0, cy - 1); gy <= Math.min(gh - 1, cy + 1); gy++) {
        for (let gx = Math.max(0, cx - 1); gx <= Math.min(gw - 1, cx + 1); gx++) {
          const list = grid[gy * gw + gx];
          if (!list) continue;
          for (const j of list) {
            const dx = xs[j] - px;
            const dy = ys[j] - py;
            if (dx * dx + dy * dy < r2) return;
          }
        }
      }
      const g = cy * gw + cx;
      (grid[g] ??= []).push(xs.length);
      xs.push(px);
      ys.push(py);
      es.push(e);
    };
    for (const i of edgeOrder) tryAdd(i, re, 1);
    for (const i of innerOrder) tryAdd(i, r, 0);
    return { xs, ys, es };
  };

  // 初期値は「面積 / 点数」の平方根。輪郭が密なぶん少し広めから始める
  let r = Math.max(1, Math.sqrt(ink.length / n) * 1.05);
  let best = dart(r);
  for (let iter = 0; iter < 6; iter++) {
    const m = best.xs.length;
    if (m >= n && m <= n * 1.05) break;
    r = Math.max(0.75, r * Math.sqrt(m / n));
    const next = dart(r);
    // n 以上で最も n に近いものを残す。足りない側は穴埋めが必要になるので後回し
    const score = (k: number) => (k >= n ? k - n : (n - k) * 4);
    if (score(next.xs.length) < score(m)) best = next;
  }

  const points: GlyphPoint[] = best.xs.map((x, i) => ({ x, y: best.ys[i], edge: best.es[i] }));
  if (points.length > n) {
    // 間引くのは内側だけ。輪郭を削るとほつれが戻る
    const inner = shuffleInPlace(
      points.map((p, i) => (p.edge ? -1 : i)).filter((i) => i >= 0),
      random,
    );
    const drop = new Set(inner.slice(0, points.length - n));
    const kept = points.filter((_, i) => !drop.has(i));
    // 内側が足りない極端に小さい字形では、輪郭も末尾から削る
    kept.length = Math.min(kept.length, n);
    return { points: kept, spacing: r };
  }
  while (points.length < n) {
    // 足りない分は塗り画素から重ねて補う。小さい画面で起きる程度の数なので目立たない
    const p = ink[Math.floor(random() * ink.length)];
    points.push({ x: (p % w) + random(), y: Math.floor(p / w) + random(), edge: 0 });
  }
  return { points, spacing: r };
}

/**
 * 2 つの点集合を、左右・上下の位置関係を保って 1 対 1 に対応付ける。
 *
 * それぞれを語の幅で正規化した x で並べ、同数ずつの縦の帯に切り、帯の中を y で
 * 並べて同じ順位どうしを組にする。1 次元の最適輸送を 2 段重ねた近似で、
 * 粒子の移動が近い場所どうしになるので、途中で中央に集まらない。
 * キーに少し揺らぎを混ぜて、帯の境目が縦縞として見えないようにする。
 */
export function pairByColumns(
  from: ArrayLike<{ x: number; y: number }>,
  fromSpan: [number, number],
  to: ArrayLike<{ x: number; y: number }>,
  toSpan: [number, number],
  random: () => number = Math.random,
): Int32Array {
  const n = Math.min(from.length, to.length);
  const columns = Math.max(1, Math.round(Math.sqrt(n / 10)));
  const order = (pts: ArrayLike<{ x: number; y: number }>, [lo, hi]: [number, number]) => {
    const span = hi - lo || 1;
    const keys = new Float64Array(n);
    for (let i = 0; i < n; i++) keys[i] = (pts[i].x - lo) / span + (random() - 0.5) * 0.03;
    const idx = Array.from({ length: n }, (_, i) => i).sort((a, b) => keys[a] - keys[b]);
    for (let c = 0; c < columns; c++) {
      const a = Math.floor((c * n) / columns);
      const b = Math.floor(((c + 1) * n) / columns);
      const band = idx.slice(a, b).sort((p, q) => pts[p].y - pts[q].y);
      for (let k = 0; k < band.length; k++) idx[a + k] = band[k];
    }
    return idx;
  };
  const a = order(from, fromSpan);
  const b = order(to, toSpan);
  // result[from の添字] = to の添字
  const result = new Int32Array(n);
  for (let k = 0; k < n; k++) result[a[k]] = b[k];
  return result;
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
    // 画素の読み出しが前提なので、GPU に置かず CPU 側に持たせる
    const offCtx = off.getContext("2d", { willReadFrequently: true });
    if (!offCtx) return;

    let width = 0;
    let height = 0;
    let ink = "23, 23, 26";
    let accent = "192, 57, 43";
    // 暗い背景では同じ alpha でも点が沈むので、明るさの下限を上げる
    let dark = false;
    /** [明度段階 × (墨, アクセント)] の fillStyle。毎フレーム文字列を作らない */
    let styles: string[] = [];

    let shapes: WordShape[] = [];
    let particles: Particle[] = [];
    let index = 0;
    let fromIndex = 0;
    let frame = 0;
    let visible = true;
    let ready = false;
    let morphing = false;
    let phaseStart = 0;
    /** 経過時間（ms）。rAF が止まっている間は進まないので、復帰しても途中から再開できる */
    let clock = 0;
    let waveGain = 1;

    // 描画の並べ替え用。粒子数ぶんを使い回す
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let pr = new Float32Array(0);
    let bucketOf = new Uint8Array(0);
    let drawOrder = new Int32Array(0);
    const bucketCount = new Int32Array(LEVELS * 2 + 1);

    /** 生のポインタ位置と、それを追いかける滑らかなカーソル */
    const pointer = { x: 0, y: 0, inside: false };
    const cursor = { x: 0, y: 0, vx: 0, vy: 0, presence: 0, live: false };

    const readTheme = () => {
      ink = readColor("--foreground", "23, 23, 26");
      accent = readColor("--accent", "192, 57, 43");
      const bg = readColor("--background", "250, 250, 247").split(",").map(Number);
      dark = (0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]) / 255 < 0.5;
      styles = [];
      for (const color of [ink, accent]) {
        for (let l = 0; l < LEVELS; l++) styles.push(`rgba(${color}, ${((l + 1) / LEVELS).toFixed(3)})`);
      }
    };

    /** 語を描いて画素を拾い、ちょうど n 点の字形にする */
    const shapeWord = (word: string, font: string, n: number): WordShape => {
      const size = Math.round(fontFor(width, height, word));
      const mask = rasterize(word, font, size);
      const { points, spacing } = scatterGlyph(mask, n);
      let minX = Infinity;
      let maxX = -Infinity;
      for (const p of points) {
        // 画素中心に揃ったままだと高 DPR で格子が透けるので、画素内で少し散らす
        p.x += (Math.random() - 0.5) * 0.5;
        p.y += (Math.random() - 0.5) * 0.5;
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
      }
      return { points, spacing, size, minX, maxX };
    };

    const rasterize = (word: string, font: string, size: number): GlyphMask => {
      off.width = Math.max(1, Math.round(width));
      off.height = Math.max(1, Math.round(height));
      offCtx.clearRect(0, 0, off.width, off.height);
      offCtx.fillStyle = "#000";
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.font = `500 ${size}px ${font}`;
      offCtx.fillText(word, off.width / 2, off.height / 2);
      const data = offCtx.getImageData(0, 0, off.width, off.height).data;
      return maskFromAlpha(data, off.width, off.height);
    };

    /** 次の語へ向けて、始点・終点・曲線・時差を決める */
    const assignTargets = (from: WordShape, to: WordShape) => {
      const pairs = pairByColumns(particles, [from.minX, from.maxX], to.points, [to.minX, to.maxX]);
      const span = to.maxX - to.minX || 1;
      const slack = 1 - FLIGHT;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const t = to.points[pairs[i]];
        p.sx = p.x;
        p.sy = p.y;
        p.se = p.edge;
        p.tx = t.x;
        p.ty = t.y;
        p.te = t.edge;
        // 進行方向に垂直へ膨らませる。向きは粒子ごとにばらし、すれ違う流れにする。
        // 手前の粒子ほど上へ持ち上げて、移動中に奥行きの差が見えるようにする
        const dx = p.tx - p.sx;
        const dy = p.ty - p.sy;
        const dist = Math.hypot(dx, dy) || 1;
        const bend = (p.seed - 0.5) * 0.9 * dist;
        p.bx = (p.sx + p.tx) / 2 - (dy / dist) * bend;
        p.by = (p.sy + p.ty) / 2 + (dx / dist) * bend - dist * 0.12 * p.z - to.size * 0.05 * p.z;
        // 左から右へ波が渡るように動き出す。完全に揃うと機械的なので 3 割は乱す
        p.delay = slack * (0.72 * clamp01((t.x - to.minX) / span) + 0.28 * Math.random());
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
      readTheme();

      const font = getComputedStyle(document.body).getPropertyValue("--font-mono").trim() || "ui-monospace";
      // 粒子数は語の面積から決める。目標の間隔は文字サイズに比例させ、
      // 小さい画面でも点線に見えない密度を保つ
      let total = 0;
      for (const word of words) {
        const size = Math.round(fontFor(width, height, word));
        const area = rasterize(word, font, size).ink.length;
        const gap = Math.max(2.2, size / 60);
        total += area / (gap * gap);
      }
      const n = Math.round(Math.min(MAX_PARTICLES, Math.max(MIN_PARTICLES, total / words.length)));
      shapes = words.map((word) => shapeWord(word, font, n));

      const current = shapes[index];
      particles = current.points.map((t) => {
        // 奥行きは奥に偏らせる。手前の大きな粒が多いと面がうるさくなる
        const z = Math.random() ** 1.6;
        const accentDot = Math.random() < 0.04;
        return {
          x: t.x,
          y: t.y,
          sx: t.x,
          sy: t.y,
          tx: t.x,
          ty: t.y,
          bx: t.x,
          by: t.y,
          delay: 0,
          edge: t.edge,
          se: t.edge,
          te: t.edge,
          // アクセントの粒は手前に置き、点在する差し色として拾えるようにする
          z: accentDot ? 0.55 + 0.45 * z : z,
          seed: Math.random(),
          accent: accentDot,
          ox: 0,
          oy: 0,
          vx: 0,
          vy: 0,
        };
      });
      fromIndex = index;
      morphing = false;
      phaseStart = clock;

      px = new Float32Array(n);
      py = new Float32Array(n);
      pr = new Float32Array(n);
      bucketOf = new Uint8Array(n);
      drawOrder = new Int32Array(n);
    };

    const updateCursor = (dt: number) => {
      const s = dt / 1000;
      if (pointer.inside) {
        if (!cursor.live) {
          cursor.x = pointer.x;
          cursor.y = pointer.y;
          cursor.vx = 0;
          cursor.vy = 0;
          cursor.live = true;
        }
        // 生の座標に直接反応させるとマウスの量子化でガタつくので、追従させてから使う
        const follow = 1 - Math.exp(-s * 22);
        const nx = cursor.x + (pointer.x - cursor.x) * follow;
        const ny = cursor.y + (pointer.y - cursor.y) * follow;
        const k = 1 - Math.exp(-s * 10);
        cursor.vx += ((nx - cursor.x) / Math.max(s, 0.001) - cursor.vx) * k;
        cursor.vy += ((ny - cursor.y) / Math.max(s, 0.001) - cursor.vy) * k;
        const speed = Math.hypot(cursor.vx, cursor.vy);
        if (speed > 2400) {
          cursor.vx *= 2400 / speed;
          cursor.vy *= 2400 / speed;
        }
        cursor.x = nx;
        cursor.y = ny;
        cursor.presence += (1 - cursor.presence) * (1 - Math.exp(-s * 6));
      } else {
        // 離れたときにぷつりと切らず、影響を溶かすように消す
        cursor.presence *= Math.exp(-s * 4);
        cursor.vx *= Math.exp(-s * 6);
        cursor.vy *= Math.exp(-s * 6);
        if (cursor.presence < 0.002) {
          cursor.presence = 0;
          cursor.live = false;
        }
      }
    };

    /**
     * 1 フレーム進めて描く。animate が false なら時間を進めず、
     * 揺らぎ・波・カーソルを抜いた静止画になる（動きを減らす設定用）。
     */
    const render = (dt: number, animate: boolean) => {
      if (particles.length === 0) return;
      if (animate) {
        clock += dt;
        if (!morphing && clock - phaseStart > HOLD_MS) {
          fromIndex = index;
          index = (index + 1) % words.length;
          assignTargets(shapes[fromIndex], shapes[index]);
          morphing = true;
          phaseStart = clock;
        }
        updateCursor(dt);
      }

      const s = dt / 1000;
      const progress = morphing ? clamp01((clock - phaseStart) / MORPH_MS) : 1;
      const from = shapes[fromIndex];
      const to = shapes[index];
      const mix = easeInOutCubic(progress);
      const spacing = from.spacing + (to.spacing - from.spacing) * mix;
      const fontSize = from.size + (to.size - from.size) * mix;
      // 点の半径は間隔に比例させる。語ごとに文字サイズが違っても面の密度感が揃う
      const dotBase = spacing * 0.3;

      // 光の帯は組み替え中は弱め、止まっている間だけはっきり見せる
      if (animate) waveGain += ((morphing ? 0.25 : 1) - waveGain) * (1 - Math.exp(-s * 3));
      const waveT = (clock % WAVE_MS) / WAVE_MS;
      const bandW = fontSize * 0.55;
      // 周期の 7 割で横切り、残りは間を置く。常に流れていると「波」ではなく雑音に見える
      const bandX = -bandW * 2 + (waveT / 0.7) * (width + bandW * 4);
      const bandOn = animate && waveT < 0.7 ? waveGain : 0;

      const reach = fontSize * 0.62;
      const invReach2 = 1 / (reach * reach);
      const cut2 = reach * reach * 6;
      const push = SPRING * reach * 0.2;
      const presence = animate ? cursor.presence : 0;
      const t = clock;

      // 奥の粒でも面として読める下限を残し、手前でも真っ黒にはしない。
      // 差を付けすぎるとゴマ塩のようにざらつく
      const alphaFloor = dark ? 0.36 : 0.3;
      const alphaRange = dark ? 0.5 : 0.52;
      bucketCount.fill(0);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        let flight = 0;

        if (morphing && animate) {
          const local = clamp01((progress - p.delay) / FLIGHT);
          const e = easeInOutCubic(local);
          const u = 1 - e;
          p.x = u * u * p.sx + 2 * u * e * p.bx + e * e * p.tx;
          p.y = u * u * p.sy + 2 * u * e * p.by + e * e * p.ty;
          p.edge = p.se + (p.te - p.se) * e;
          flight = Math.sin(Math.PI * local);
        } else if (!animate) {
          p.x = p.tx;
          p.y = p.ty;
          p.edge = p.te;
        }

        let x = p.x;
        let y = p.y;
        const depth = 0.45 + 0.9 * p.z;

        if (animate) {
          // 飛行中は流れ場で少し散らす。曲線だけだと軌跡が揃いすぎて糸のように見える
          if (flight > 0) {
            const angle = Math.sin(p.sx * 0.017 + t * 0.0011) * 2.4 + p.seed * 6.283;
            const amp = flight * fontSize * 0.07 * depth;
            x += Math.cos(angle) * amp;
            y += Math.sin(angle) * amp;
          }
          // 止まっていても粒が微かに漂う。手前ほど大きく動かして奥行きを出す
          x += Math.sin(t * 0.0006 + p.seed * 40) * 0.45 * p.z;
          y += Math.cos(t * 0.0005 + p.seed * 27) * 0.45 * p.z;

          // カーソル: 押し出し + 動きに引きずられる航跡 + 回り込む渦を、ばねで基準位置へ戻す
          let ax = -SPRING * p.ox - DAMPING * p.vx;
          let ay = -SPRING * p.oy - DAMPING * p.vy;
          if (presence > 0) {
            const dx = x + p.ox - cursor.x;
            const dy = y + p.oy - cursor.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < cut2) {
              const f = Math.exp(-d2 * invReach2) * presence * depth;
              const d = Math.sqrt(d2) + 0.001;
              const nx = dx / d;
              const ny = dy / d;
              ax += nx * f * push;
              ay += ny * f * push;
              ax += cursor.vx * f * SPRING * 0.03;
              ay += cursor.vy * f * SPRING * 0.03;
              // 速度と法線の外積の符号で回る向きを決める。カーソルの後ろで流れが巻く
              const swirl = (nx * cursor.vy - ny * cursor.vx) * f * SPRING * 0.025;
              ax -= ny * swirl;
              ay += nx * swirl;
            }
          }
          if (presence > 0 || p.ox * p.ox + p.oy * p.oy > 0.0004 || p.vx * p.vx + p.vy * p.vy > 0.01) {
            p.vx += ax * s;
            p.vy += ay * s;
            p.ox += p.vx * s;
            p.oy += p.vy * s;
          } else {
            p.ox = p.oy = p.vx = p.vy = 0;
          }
          x += p.ox;
          y += p.oy;
        }

        let alpha = alphaFloor + alphaRange * p.z ** 0.9 + 0.1 * p.edge;
        let radius = dotBase * (0.62 + 0.72 * p.z) * (1 + 0.08 * p.edge);

        if (animate) {
          // 光の帯: 斜めの帯が通る所だけ明るく大きく、少し浮く
          if (bandOn > 0) {
            const band = (x + (y - height / 2) * 0.45 - bandX) / bandW;
            if (band > -3 && band < 3) {
              const g = Math.exp(-band * band) * bandOn;
              alpha += g * 0.32;
              radius *= 1 + g * (0.18 + 0.36 * p.z);
              y -= g * (0.6 + 1.8 * p.z);
            }
          }
          // 帯とは別に、ごく弱いうねりを常に流して面を止めない
          y += Math.sin((x + y * 0.3) * 0.02 - t * 0.0014) * 0.5 * p.z;

          // カーソルの近くはレンズのように少し明るく大きく
          const off2 = p.ox * p.ox + p.oy * p.oy;
          if (off2 > 0.25) {
            const lens = Math.min(1, Math.sqrt(off2) / (reach * 0.3));
            alpha += lens * 0.12;
            radius *= 1 + lens * 0.15;
          }
          // 飛行中は少し淡くする。密集した瞬間が黒い塊に見えないように
          alpha *= 1 - flight * 0.3;
        }

        if (p.accent) alpha += 0.1;
        const level = Math.max(0, Math.min(LEVELS - 1, Math.round(alpha * LEVELS) - 1));
        const bucket = level + (p.accent ? LEVELS : 0);
        px[i] = x;
        py[i] = y;
        pr[i] = radius;
        bucketOf[i] = bucket;
        bucketCount[bucket + 1]++;
      }

      // 明度の段階ごとにまとめて塗る。粒子ごとに fillStyle を変えるより桁違いに軽い
      for (let b = 1; b < bucketCount.length; b++) bucketCount[b] += bucketCount[b - 1];
      const cursorPos = bucketCount.slice();
      for (let i = 0; i < particles.length; i++) drawOrder[cursorPos[bucketOf[i]]++] = i;

      ctx.clearRect(0, 0, width, height);
      // 暗い背景では重なりを加算して、点の集まりが発光して見えるようにする
      ctx.globalCompositeOperation = dark ? "lighter" : "source-over";
      for (let b = 0; b < LEVELS * 2; b++) {
        const startAt = bucketCount[b];
        const endAt = bucketCount[b + 1];
        if (startAt === endAt) continue;
        ctx.fillStyle = styles[b];
        ctx.beginPath();
        for (let k = startAt; k < endAt; k++) {
          const i = drawOrder[k];
          const r = pr[i];
          ctx.moveTo(px[i] + r, py[i]);
          ctx.arc(px[i], py[i], r, 0, Math.PI * 2);
        }
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      if (animate && morphing && progress >= 1) {
        morphing = false;
        fromIndex = index;
        phaseStart = clock;
      }
    };

    let last = 0;
    const loop = (now: number) => {
      // 長い間隔（タブ復帰直後など）でも一度に進みすぎないよう上限を置く
      const dt = last ? Math.min(48, now - last) : 16;
      last = now;
      render(dt, true);
      frame = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (frame !== 0 || !ready || reduceQuery.matches || !visible || document.hidden) return;
      last = 0;
      frame = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const drawStill = () => {
      for (const p of particles) {
        p.ox = p.oy = p.vx = p.vy = 0;
      }
      morphing = false;
      fromIndex = index;
      render(0, false);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      // 枠の少し外から効かせる。境界でいきなり反応が始まると硬く見える
      const margin = Math.min(rect.width, rect.height) * 0.15;
      pointer.inside =
        pointer.x > -margin && pointer.y > -margin && pointer.x < rect.width + margin && pointer.y < rect.height + margin;
    };
    const onPointerLeave = () => {
      pointer.inside = false;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    const onMotionPreference = () => {
      stop();
      if (reduceQuery.matches) drawStill();
      else start();
    };

    const rebuild = () => {
      build();
      if (reduceQuery.matches) drawStill();
    };

    // リサイズ中は連続で呼ばれる。散布は数十 ms かかるので、落ち着いてから一度だけ組み直す
    let resizeTimer = 0;
    let lastSize = "";
    const resizeObserver = new ResizeObserver(() => {
      const rect = wrap.getBoundingClientRect();
      const size = `${Math.round(rect.width)}x${Math.round(rect.height)}`;
      if (!ready || size === lastSize) return;
      lastSize = size;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(rebuild, 120);
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
      readTheme();
      // 静止画は次のフレームが来ないので、ここで描き直さないと旧テーマの色が残る
      if (reduceQuery.matches) drawStill();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // フォントが読み込まれてから拾わないと、代替フォントの形で固定される。
    // ready だけだとまだ要求されていない書体を待たないので、明示的に読み込む
    let disposed = false;
    const font = getComputedStyle(document.body).getPropertyValue("--font-mono").trim() || "ui-monospace";
    const fonts = document.fonts;
    const fontsReady = fonts
      ? Promise.all([fonts.load(`500 64px ${font}`).catch(() => undefined), fonts.ready])
      : Promise.resolve();
    void fontsReady.then(() => {
      if (disposed) return;
      ready = true;
      const rect = wrap.getBoundingClientRect();
      lastSize = `${Math.round(rect.width)}x${Math.round(rect.height)}`;
      build();
      if (reduceQuery.matches) drawStill();
      else start();
    });

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("blur", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);
    reduceQuery.addEventListener("change", onMotionPreference);

    return () => {
      disposed = true;
      stop();
      window.clearTimeout(resizeTimer);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
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
