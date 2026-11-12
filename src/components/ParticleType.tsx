import { useEffect, useRef } from "react";

/**
 * ParticleType — 見出しの代わりに置く粒子の文字。
 *
 * `build → operate → research` を粒子で組み替える。サイトの 3 軸を、
 * スクリーンショットではなく動きで示すためのもの。ヒーローの「最初の一瞬」で
 * 目を引く役なので、静かに整えるより、動きそのものを見せ場にしている。
 *
 * - 文字はオフスクリーンに描いて画素を拾い、点の集合にする。だから語を
 *   変えても字形はフォントのまま崩れない
 * - 点は最小距離つきの散布（Poisson disk）で置き、輪郭を内側より密にする。
 *   点の数が少なくても字形が締まって見える
 * - 粒子は 3D 空間に置き、ゆっくり首を振るカメラから透視投影で描く。
 *   奥の粒は小さく暗く遅く、手前は大きく明るく速く見える（視差）
 * - 組み替えは「ほどける → 渦を巻いて奥行き方向へ散る → 吸い寄せられて着地」。
 *   速く動く粒には彗星状の尾を付け、動きの方向が残像として読めるようにする
 * - アクセントの赤は「熱」として扱う。普段はほとんど出さず、離陸・着地・
 *   カーソル・クリックの衝撃波で一時的に熱が入り、冷めて墨色へ戻る
 * - 組み上がった直後に短い「定着」の間（スキャン線・枠の吸着・揺らぎ停止）を置く
 * - 動きを減らす設定では現在の語を静止画で描いて止める
 * - 画面外・非表示タブでは rAF を止める。DPR は 2 まで
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

/** 1 フレーム分のカメラ。三角関数はフレームごとに 1 回だけ計算して使い回す */
export type Camera = {
  cosY: number;
  sinY: number;
  cosP: number;
  sinP: number;
  focal: number;
};

/** 投影結果。毎粒子でオブジェクトを作らないよう、呼び出し側が使い回す */
export type Projected = { x: number; y: number; z: number; scale: number };

type WordShape = {
  points: GlyphPoint[];
  /** 点同士のおおよその間隔。点の大きさをこれに比例させる */
  spacing: number;
  size: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

type Particle = {
  /** 現在の基準位置（2D、カーソルの変位・揺らぎを足す前） */
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
  /** 0: 待機 1: 飛行中 2: 着地済み。離陸・着地の瞬間に一度だけ熱を入れるため */
  state: 0 | 1 | 2;
  /** 輪郭らしさ。始点と終点の値を補間する */
  edge: number;
  se: number;
  te: number;
  /** 固有の奥行き。0 が奥（小さく淡い）、1 が手前 */
  z: number;
  seed: number;
  /** ほどける量: 平面内の散り（fx, fy）、奥行き方向の散り（kz）、渦の回転量（spin） */
  fx: number;
  fy: number;
  kz: number;
  spin: number;
  /** 始点の奥行き。イントロで奥の雲から来るときだけ使う */
  sz: number;
  /** 赤の熱。0..1 で、毎フレーム冷める */
  heat: number;
  /** 常に少しだけ赤い火種か */
  spark: boolean;
  /** カーソル・衝撃波による画面上の変位とその速度（ばねで基準位置へ戻る） */
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  /** 前フレームの画面位置。尾の長さに使う */
  lx: number;
  ly: number;
  hasLast: boolean;
};

const TAU = Math.PI * 2;
/** 着地してから次の語へ行くまで。最初の SETTLE_MS は「定着」の間 */
const HOLD_MS = 3600;
const SETTLE_MS = 1300;
/** スキャン線が字面を上から下へ走る時間 */
const SCAN_MS = 620;
const MORPH_MS = 2400;
const INTRO_MS = 2600;
/** 粒子 1 つの飛行時間（モーフ全体に対する割合）。残りを動き出しの時差に使う */
const FLIGHT = 0.6;
const MAX_PARTICLES = 4200;
const MIN_PARTICLES = 900;
/** 輪郭上の点の間隔を内側の何倍にするか。小さいほど縁が締まる */
const EDGE_RATIO = 0.58;
/** 明度の段階数 × 熱の段階数ぶんだけ fillStyle を作り、描画を段階ごとにまとめる */
const LEVELS = 14;
const HEAT_STEPS = 4;
/** 熱の段階ごとの、墨 → アクセントの混ぜ具合 */
const HEAT_MIX = [0, 0.45, 0.78, 1];
/** 熱が冷める速さ（1/秒）。1 秒弱で墨へ戻り、「走って消える」波に見える */
const HEAT_DECAY = 3;
/** 静止時に字面を斜めに横切る光の帯の周期 */
const WAVE_MS = 4600;
/** 変位を戻すばね。減衰を臨界より弱くして、着地や渦のあとに小さな揺れを残す */
const SPRING = 80;
const DAMPING = 7.5;
/** 尾の長さを何フレーム分の移動量にするか */
const TRAIL_FRAMES = 2.2;
const SHOCK_MS = 1400;
const MAX_SHOCKS = 4;

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
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const smoothstep = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};

function shuffleInPlace<T extends { [i: number]: number; length: number }>(a: T, random: () => number): T {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

/**
 * 「ほどけ」の強さ。飛行の進み u（0..1）に対して 0 → 山 → 0。
 *
 * 山を前寄り（u ≈ 0.38）に置く。素早くほどけて、残りの時間をかけて
 * 吸い寄せられるように組み上がると、着地が「決まった」感触になる。
 */
export function morphEnvelope(u: number): number {
  if (u <= 0 || u >= 1) return 0;
  return Math.sin(Math.PI * u ** 0.72) ** 1.3;
}

/** 熱を描画用の段階に丸める。段階ごとに fillStyle をまとめるため */
export function heatStep(heat: number): number {
  return heat < 0.12 ? 0 : heat < 0.38 ? 1 : heat < 0.68 ? 2 : 3;
}

/** 2 色を k（0..1）で混ぜる。熱の段階ごとの中間色を作る */
export function mixRgb(a: readonly number[], b: readonly number[], k: number): [number, number, number] {
  const t = clamp01(k);
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

export function makeCamera(yaw: number, pitch: number, focal: number): Camera {
  return { cosY: Math.cos(yaw), sinY: Math.sin(yaw), cosP: Math.cos(pitch), sinP: Math.sin(pitch), focal };
}

/**
 * 中心からの座標 (x, y, z) をカメラで回して透視投影する。z は正が手前。
 *
 * 手前に寄りすぎた粒が画面を覆わないよう、奥行きを focal の 62% で頭打ちにする
 * （倍率の上限は約 2.6 倍）。
 */
export function projectPoint(x: number, y: number, z: number, cam: Camera, out: Projected): Projected {
  // ヨー（縦軸まわり）→ ピッチ（横軸まわり）の順に回す
  const x1 = x * cam.cosY + z * cam.sinY;
  const z1 = -x * cam.sinY + z * cam.cosY;
  const y2 = y * cam.cosP - z1 * cam.sinP;
  const z2 = y * cam.sinP + z1 * cam.cosP;
  const zc = Math.min(z2, cam.focal * 0.62);
  const scale = cam.focal / (cam.focal - zc);
  out.x = x1 * scale;
  out.y = y2 * scale;
  out.z = z2;
  out.scale = scale;
  return out;
}

/**
 * カーソルの渦。粒子からカーソルへの差 (dx, dy) に対して、
 * 接線方向（spin、正で画面上の時計回り）と放射方向（radial、正で外向き）の
 * 加速度を out に書き、影響の強さ（0..1 のガウス）を返す。
 *
 * 単純な反発だと「避けられる」だけだが、接線成分があると字面が渦状にねじれ、
 * カーソルの周りに流れができる。
 */
export function vortexAccel(
  dx: number,
  dy: number,
  reach: number,
  spin: number,
  radial: number,
  out: { x: number; y: number },
): number {
  const d2 = dx * dx + dy * dy;
  const f = Math.exp(-d2 / (reach * reach));
  const d = Math.sqrt(d2) + 1e-3;
  const nx = dx / d;
  const ny = dy / d;
  out.x = (nx * radial - ny * spin) * f;
  out.y = (ny * radial + nx * spin) * f;
  return f;
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
    // 画素の読み出しは語の組み立て時だけ。CPU 側に置いて読み出しを速くする
    const offCtx = off.getContext("2d", { willReadFrequently: true });
    if (!offCtx) return;

    let width = 0;
    let height = 0;
    let inkRgb = "23, 23, 26";
    let accentRgb = "192, 57, 43";
    // 暗い背景では同じ alpha でも点が沈むので、明るさの下限を上げ、加算合成で光らせる
    let dark = false;
    /** [熱の段階 × 明度段階] の fillStyle。毎フレーム文字列を作らない */
    let styles: string[] = [];
    let haloStyles: string[] = [];

    let shapes: WordShape[] = [];
    let particles: Particle[] = [];
    let index = 0;
    let fromIndex = 0;
    let frame = 0;
    let visible = true;
    let ready = false;
    let morphing = false;
    let morphMs = MORPH_MS;
    /** モーフごとに渦の向きを反転させ、毎回同じ動きに見えないようにする */
    let spinDir = 1;
    let phaseStart = 0;
    /** 経過時間（ms）。rAF が止まっている間は進まないので、復帰しても途中から再開できる */
    let clock = 0;
    let introDone = false;

    // 全体の状態。いずれも目標値へ指数的に寄せ、切り替えで飛ばないようにする
    let idleAmt = 0;
    let waveGain = 0;
    let camYaw = 0;
    let camPitch = 0;
    /** 枠（ブラケット）の開き。ばねで動かし、定着の瞬間に一度締まりすぎてから戻す */
    let bracketOpen = 1;
    let bracketVel = 0;

    // 描画の並べ替え用。粒子 + 塵の数ぶんを使い回す
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let pr = new Float32Array(0);
    let ptx = new Float32Array(0);
    let pty = new Float32Array(0);
    let bucketOf = new Uint8Array(0);
    let drawOrder = new Int32Array(0);
    let haloList = new Int32Array(0);
    let haloLevel = new Uint8Array(0);
    const STYLE_COUNT = LEVELS * HEAT_STEPS;
    const bucketCount = new Int32Array(STYLE_COUNT + 1);
    const HIDDEN = 255;

    // 奥行きの手がかりになる背景の塵。字にはならず、カメラの視差で漂う
    let dustCount = 0;
    let dX = new Float32Array(0);
    let dY = new Float32Array(0);
    let dZ = new Float32Array(0);
    let dSeed = new Float32Array(0);
    let dEmber = new Uint8Array(0);

    /** 生のポインタ位置と、それを追いかける滑らかなカーソル */
    const pointer = { x: 0, y: 0, inside: false };
    const cursor = { x: 0, y: 0, vx: 0, vy: 0, presence: 0, live: false };
    const shocks: { x: number; y: number; t: number }[] = [];

    const P: Projected = { x: 0, y: 0, z: 0, scale: 1 };
    const V = { x: 0, y: 0 };

    const readTheme = () => {
      inkRgb = readColor("--foreground", "23, 23, 26");
      accentRgb = readColor("--accent", "192, 57, 43");
      const bg = readColor("--background", "250, 250, 247").split(",").map(Number);
      dark = (0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]) / 255 < 0.5;
      const ink = inkRgb.split(",").map(Number);
      const acc = accentRgb.split(",").map(Number);
      styles = [];
      for (let h = 0; h < HEAT_STEPS; h++) {
        const c = mixRgb(ink, acc, HEAT_MIX[h]).join(", ");
        for (let l = 0; l < LEVELS; l++) styles.push(`rgba(${c}, ${((l + 1) / LEVELS).toFixed(3)})`);
      }
      // 光暈は shadowBlur の代わりに、大小 2 枚の薄い円を重ねて作る（ぼかしより桁違いに軽い）
      haloStyles = dark
        ? [`rgba(${accentRgb}, 0.07)`, `rgba(${accentRgb}, 0.14)`]
        : [`rgba(${accentRgb}, 0.05)`, `rgba(${accentRgb}, 0.1)`];
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

    /** 語を描いて画素を拾い、ちょうど n 点の字形にする */
    const shapeWord = (word: string, font: string, n: number): WordShape => {
      const size = Math.round(fontFor(width, height, word));
      const mask = rasterize(word, font, size);
      const { points, spacing } = scatterGlyph(mask, n);
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      for (const p of points) {
        // 画素中心に揃ったままだと高 DPR で格子が透けるので、画素内で少し散らす
        p.x += (Math.random() - 0.5) * 0.5;
        p.y += (Math.random() - 0.5) * 0.5;
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      }
      return { points, spacing, size, minX, maxX, minY, maxY };
    };

    /** ほどけ方（散る向き・奥行き・渦）を粒子ごとに決める */
    const setUnravel = (p: Particle, size: number, spinScale: number) => {
      // 散る向きは場所でゆるく揃える。完全にばらばらだと煙ではなく砂嵐に見える
      const angle = (Math.sin(p.sx * 0.013 + p.sy * 0.004) + Math.cos(p.sy * 0.017 - p.sx * 0.006)) * Math.PI + p.seed * 1.6;
      const amp = size * (0.12 + 0.42 * Math.random());
      p.fx = Math.cos(angle) * amp;
      p.fy = Math.sin(angle) * amp;
      // 奥行き方向へ大きく散らす。手前へ来た粒が大きく速く横切るのが見せ場
      p.kz = (Math.random() * 2 - 1) * size * 1.7;
      // 渦の向きは全体で揃え、量だけばらす。字全体がねじれて解ける
      p.spin = spinDir * (0.45 + 0.75 * p.seed) * spinScale;
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
        p.sz = 0;
        p.state = 0;
        // 進行方向に垂直へ膨らませる。向きは粒子ごとにばらし、すれ違う流れにする
        const dx = p.tx - p.sx;
        const dy = p.ty - p.sy;
        const dist = Math.hypot(dx, dy) || 1;
        const bend = (p.seed - 0.5) * 0.9 * dist;
        p.bx = (p.sx + p.tx) / 2 - (dy / dist) * bend;
        p.by = (p.sy + p.ty) / 2 + (dx / dist) * bend - dist * 0.1 * p.z;
        setUnravel(p, to.size, 1);
        // 左から右へ波が渡るように動き出す。完全に揃うと機械的なので 3 割は乱す。
        // 着地も同じ順になるので、着地の赤が左から右へ走る
        p.delay = slack * (0.72 * clamp01((t.x - to.minX) / span) + 0.28 * Math.random());
      }
    };

    /**
     * 初回だけ、奥行きのある渦の雲から最初の語を組み上げる。
     * ページを開いた瞬間に「集まって字になる」動きを見せるため。
     */
    const launchIntro = () => {
      const to = shapes[index];
      const span = to.maxX - to.minX || 1;
      const slack = 1 - FLIGHT;
      const cx = width / 2;
      const cy = height / 2;
      for (const p of particles) {
        // 平たい輪だと横縞の流れになるので、上下にも広がる球殻状の雲から寄せる
        const theta = Math.random() * TAU;
        const phi = Math.acos(Math.random() * 2 - 1);
        const radius = Math.max(width, height) * (0.3 + 0.35 * Math.random());
        p.sx = cx + Math.cos(theta) * Math.sin(phi) * radius;
        p.sy = cy + Math.cos(phi) * radius * 0.6;
        p.sz = Math.sin(theta) * Math.sin(phi) * radius * 1.1;
        p.bx = (p.sx + p.tx) / 2;
        p.by = (p.sy + p.ty) / 2;
        p.x = p.sx;
        p.y = p.sy;
        p.se = 0;
        p.state = 0;
        setUnravel(p, to.size, 1.25);
        p.delay = slack * (0.55 * clamp01((p.tx - to.minX) / span) + 0.45 * Math.random());
      }
      morphing = true;
      morphMs = INTRO_MS;
      fromIndex = index;
      phaseStart = clock;
      bracketOpen = 1;
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
        const z = Math.random() ** 1.5;
        const spark = Math.random() < 0.015;
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
          state: 2,
          edge: t.edge,
          se: t.edge,
          te: t.edge,
          // 火種は手前に置き、点在する差し色として拾えるようにする
          z: spark ? 0.6 + 0.4 * z : z,
          seed: Math.random(),
          fx: 0,
          fy: 0,
          kz: 0,
          spin: 0,
          sz: 0,
          heat: 0,
          spark,
          ox: 0,
          oy: 0,
          vx: 0,
          vy: 0,
          lx: 0,
          ly: 0,
          hasLast: false,
        };
      });
      fromIndex = index;
      morphing = false;
      morphMs = MORPH_MS;
      phaseStart = clock;

      // 塵は面積に比例させる。多すぎると字の背景がざらつくので上限を低めに置く
      dustCount = Math.round(Math.min(380, Math.max(120, (width * height) / 1400)));
      dX = new Float32Array(dustCount);
      dY = new Float32Array(dustCount);
      dZ = new Float32Array(dustCount);
      dSeed = new Float32Array(dustCount);
      dEmber = new Uint8Array(dustCount);
      for (let i = 0; i < dustCount; i++) {
        dX[i] = (Math.random() * 2 - 1) * width * 0.7;
        dY[i] = (Math.random() * 2 - 1) * height * 0.6;
        dZ[i] = Math.random();
        dSeed[i] = Math.random();
        // ごく一部だけ赤い残り火にする。普段の赤は「少なめ」を守る
        dEmber[i] = Math.random() < 0.03 ? 1 : 0;
      }

      const total2 = n + dustCount;
      px = new Float32Array(total2);
      py = new Float32Array(total2);
      pr = new Float32Array(total2);
      ptx = new Float32Array(total2);
      pty = new Float32Array(total2);
      bucketOf = new Uint8Array(total2);
      drawOrder = new Int32Array(total2);
      haloList = new Int32Array(n);
      haloLevel = new Uint8Array(n);
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

    /** 字の枠（ブラケット）・定着のスキャン線・次の語までの残り時間を描く */
    const drawHud = (
      cam: Camera,
      box: { minX: number; maxX: number; minY: number; maxY: number },
      fontSize: number,
      breathe: number,
      flash: number,
      scan: number,
      hold: number,
      animate: boolean,
    ) => {
      const cx = width / 2;
      const cy = height / 2;
      const pad = fontSize * (0.13 + 0.38 * bracketOpen);
      const x0 = (box.minX - cx - pad) * breathe;
      const x1 = (box.maxX - cx + pad) * breathe;
      const y0 = (box.minY - cy - pad) * breathe;
      const y1 = (box.maxY - cy + pad) * breathe;
      // 四隅をカメラで投影する。枠も字と一緒に傾くので、同じ空間にあるように見える
      const corners = [
        [x0, y0],
        [x1, y0],
        [x1, y1],
        [x0, y1],
      ].map(([x, y]) => {
        projectPoint(x, y, 0, cam, P);
        return [cx + P.x, cy + P.y];
      });
      const arm = Math.min(fontSize * 0.18, 26);
      const along = (a: number[], b: number[]) => {
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
        const k = Math.min(1, arm / len);
        return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
      };
      const bracketPath = () => {
        ctx.beginPath();
        for (let c = 0; c < 4; c++) {
          const here = corners[c];
          const prev = corners[(c + 3) % 4];
          const next = corners[(c + 1) % 4];
          const a = along(here, prev);
          const b = along(here, next);
          ctx.moveTo(a[0], a[1]);
          ctx.lineTo(here[0], here[1]);
          ctx.lineTo(b[0], b[1]);
        }
      };
      ctx.lineWidth = 1.25;
      ctx.lineCap = "square";
      // 組み替え中は枠を薄くして粒子の動きを主役にし、定着で一度赤く光らせる
      const baseAlpha = (dark ? 0.32 : 0.26) * (1 - 0.6 * clamp01(bracketOpen));
      bracketPath();
      ctx.strokeStyle = `rgba(${inkRgb}, ${baseAlpha.toFixed(3)})`;
      ctx.stroke();
      if (flash > 0.02) {
        ctx.strokeStyle = `rgba(${accentRgb}, ${(0.9 * flash).toFixed(3)})`;
        ctx.stroke();
      }
      if (!animate) return;

      // 定着のスキャン線: 字面を上から下へ一度だけ走り、「焼き付けた」合図にする
      if (scan > 0 && scan < 1) {
        const sy = (box.minY - cy + (box.maxY - box.minY) * easeOutCubic(scan)) * breathe;
        projectPoint(x0, sy, 0, cam, P);
        const ax = cx + P.x;
        const ay = cy + P.y;
        projectPoint(x1, sy, 0, cam, P);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(cx + P.x, cy + P.y);
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(${accentRgb}, ${(0.75 * (1 - scan)).toFixed(3)})`;
        ctx.stroke();
      }

      // 次の語までの残り時間。下辺の外側に細い線で示し、切り替わりを予告する
      if (hold > 0) {
        const bl = corners[3];
        const br = corners[2];
        const gap = 7;
        const tx0 = bl[0];
        const ty0 = bl[1] + gap;
        const tx1 = br[0];
        const ty1 = br[1] + gap;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(tx0, ty0);
        ctx.lineTo(tx1, ty1);
        ctx.strokeStyle = `rgba(${inkRgb}, ${dark ? 0.1 : 0.08})`;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(tx0, ty0);
        ctx.lineTo(tx0 + (tx1 - tx0) * hold, ty0 + (ty1 - ty0) * hold);
        ctx.strokeStyle = `rgba(${accentRgb}, 0.55)`;
        ctx.stroke();
      }
    };

    /**
     * 1 フレーム進めて描く。animate が false なら時間を進めず、
     * カメラ・揺らぎ・熱・尾・カーソルを抜いた静止画になる（動きを減らす設定用）。
     */
    const render = (dt: number, animate: boolean) => {
      if (particles.length === 0) return;
      const s = dt / 1000;
      if (animate) {
        clock += dt;
        if (!morphing && clock - phaseStart > HOLD_MS) {
          fromIndex = index;
          index = (index + 1) % words.length;
          spinDir = -spinDir;
          assignTargets(shapes[fromIndex], shapes[index]);
          morphing = true;
          morphMs = MORPH_MS;
          phaseStart = clock;
        }
        updateCursor(dt);
        for (let k = shocks.length - 1; k >= 0; k--) if (clock - shocks[k].t > SHOCK_MS) shocks.splice(k, 1);
      }

      const progress = morphing ? clamp01((clock - phaseStart) / morphMs) : 1;
      const from = shapes[fromIndex];
      const to = shapes[index];
      const mix = easeInOutCubic(progress);
      const lerp = (a: number, b: number) => a + (b - a) * mix;
      const spacing = lerp(from.spacing, to.spacing);
      const fontSize = lerp(from.size, to.size);
      // 点の半径は間隔に比例させる。語ごとに文字サイズが違っても面の密度感が揃う
      const dotBase = spacing * 0.3;
      const cx = width / 2;
      const cy = height / 2;
      const t = clock;
      const morphPulse = morphing ? Math.sin(Math.PI * progress) : 0;

      // --- 定着: 着地直後は揺らぎを止めて字を締め、少しずつ呼吸を戻す ---
      const lockAge = morphing ? -1 : clock - phaseStart;
      const flash = animate && lockAge >= 0 ? Math.exp(-lockAge / 280) : 0;
      const scan = animate && lockAge >= 0 && lockAge < SCAN_MS ? lockAge / SCAN_MS : 0;
      const scanY = from.minY + (from.maxY - from.minY) * easeOutCubic(scan);
      const scanW = Math.max(4, (to.maxY - to.minY) * 0.07);
      const hold = animate && lockAge >= 0 ? clamp01(lockAge / HOLD_MS) : 0;

      if (animate) {
        const idleTarget = morphing ? 0.2 : smoothstep((lockAge - 260) / (SETTLE_MS - 260));
        idleAmt += (idleTarget - idleAmt) * (1 - Math.exp(-s * 5));
        waveGain += ((morphing ? 0 : idleTarget) - waveGain) * (1 - Math.exp(-s * 3));

        // カメラ: 待機中もゆっくり首を振り、カーソルの方へ向き、組み替え中は大きく振る
        const cnx = Math.max(-1.4, Math.min(1.4, (cursor.x / width - 0.5) * 2));
        const cny = Math.max(-1.4, Math.min(1.4, (cursor.y / height - 0.5) * 2));
        const yawTarget =
          Math.sin(t * 0.00021) * 0.13 - cnx * 0.3 * cursor.presence + morphPulse * 0.22 * spinDir;
        const pitchTarget = Math.sin(t * 0.00016 + 1.3) * 0.07 + cny * 0.2 * cursor.presence;
        const ck = 1 - Math.exp(-s * 2.6);
        camYaw += (yawTarget - camYaw) * ck;
        camPitch += (pitchTarget - camPitch) * ck;

        // 枠のばね: 組み替え中は開き、着地で締まる。減衰を弱めて一度締まりすぎる
        const target = morphing ? Math.min(1, morphPulse * 1.6) : 0;
        bracketVel += ((target - bracketOpen) * 260 - bracketVel * 17) * s;
        bracketOpen += bracketVel * s;
      }
      const yaw = animate ? camYaw : 0;
      const pitch = animate ? camPitch : 0;
      const focal = Math.max(width, height) * 1.6;
      const cam = makeCamera(yaw, pitch, focal);
      // 呼吸: 字全体がごくわずかに膨らんで縮む
      const breathe = animate ? 1 + 0.012 * Math.sin((t / 5200) * TAU) * idleAmt : 1;
      const depthSpread = fontSize * 0.28;

      const waveT = (t % WAVE_MS) / WAVE_MS;
      const bandW = fontSize * 0.55;
      // 周期の 7 割で横切り、残りは間を置く。常に流れていると「波」ではなく雑音に見える
      const bandX = -bandW * 2 + (waveT / 0.7) * (width + bandW * 4);
      const bandOn = animate && waveT < 0.7 ? waveGain : 0;

      const reach = fontSize * 0.68;
      const cut2 = reach * reach * 6;
      const presence = animate ? cursor.presence : 0;
      const cursorSpeed = Math.min(1, Math.hypot(cursor.vx, cursor.vy) / 1400);
      // 止まっているときは回すだけ（渦）、速く動くと押し出す（航跡）。
      // 中心へ吸い込むと粒が一点に溜まって黒い塊になるので、わずかに外向きを残す
      const vortexSpin = SPRING * reach * (0.26 + 0.46 * cursorSpeed);
      const vortexRadial = SPRING * reach * (0.05 + 0.4 * cursorSpeed);
      const cool = animate ? Math.exp(-s * HEAT_DECAY) : 1;
      const frameScale = 16.7 / Math.max(dt, 1);
      const maxTrail = fontSize * 0.26;
      const shockW = fontSize * 0.22;

      // 奥の粒でも面として読める下限を残し、手前でも真っ黒にはしない
      const alphaFloor = dark ? 0.4 : 0.28;
      const alphaRange = dark ? 0.52 : 0.54;
      const fade = 26;
      bucketCount.fill(0);
      let haloCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        let bump = 0;
        let e = 1;

        if (morphing && animate) {
          const u = clamp01((progress - p.delay) / FLIGHT);
          if (u > 0 && p.state === 0) {
            // 離陸: ごく弱い熱だけ入れる。赤は着地の波に取っておき、ここでは温める程度
            p.state = 1;
            if (p.heat < 0.26) p.heat = 0.26;
          }
          e = easeInOutCubic(u);
          const w = 1 - e;
          p.x = w * w * p.sx + 2 * w * e * p.bx + e * e * p.tx;
          p.y = w * w * p.sy + 2 * w * e * p.by + e * e * p.ty;
          p.edge = p.se + (p.te - p.se) * e;
          bump = morphEnvelope(u);
          if (u >= 1 && p.state === 1) {
            // 着地: 熱を満タンにし、進入方向へ小さく弾ませる。ばねで揺れて止まり「決まる」
            p.state = 2;
            p.heat = 1;
            const ax = p.tx - p.bx;
            const ay = p.ty - p.by;
            const al = Math.hypot(ax, ay) || 1;
            p.vx += (ax / al) * fontSize * 0.3;
            p.vy += (ay / al) * fontSize * 0.3;
          }
        } else if (!animate) {
          p.x = p.tx;
          p.y = p.ty;
          p.edge = p.te;
        }

        let wx = p.x - cx;
        let wy = p.y - cy;
        let wz = (p.z - 0.5) * depthSpread;

        if (animate) {
          if (bump > 0) {
            wx += p.fx * bump;
            wy += p.fy * bump;
            wz += p.kz * bump;
          }
          if (p.sz !== 0 && morphing) wz += p.sz * (1 - e);
          if (idleAmt > 0.001) {
            // 漂い: 手前ほど大きく速く。奥は小さくゆっくりで、層の違いが見える
            const sp = 0.35 + 0.65 * p.z;
            const amp = spacing * 0.42 * sp * idleAmt;
            wx += Math.sin(t * 0.00055 * (0.6 + p.z) + p.seed * 40) * amp;
            wy += Math.cos(t * 0.00047 * (0.6 + p.z) + p.seed * 27) * amp;
            // 奥行き方向の波を字面に流す。透視で大きさと明るさの波として見える
            wz += Math.sin((p.x - cx) * 0.012 - t * 0.0017) * fontSize * 0.09 * idleAmt;
            wz += Math.sin(t * 0.0009 + p.seed * 20) * fontSize * 0.035 * idleAmt;
          }
          wx *= breathe;
          wy *= breathe;
          if (bump > 0) {
            // 渦: 字の中心を通る縦軸まわりに回す。散った粒が立体的な竜巻になる
            const a = p.spin * bump;
            const c = Math.cos(a);
            const sn = Math.sin(a);
            const nx = wx * c - wz * sn;
            wz = wx * sn + wz * c;
            wx = nx;
          }
        }

        projectPoint(wx, wy, wz, cam, P);
        let x = cx + P.x;
        let y = cy + P.y;
        const scale = P.scale;

        if (animate) {
          // --- カーソルと衝撃波: 画面上の変位をばねで基準位置へ戻す ---
          let ax = -SPRING * p.ox - DAMPING * p.vx;
          let ay = -SPRING * p.oy - DAMPING * p.vy;
          // 手前の粒ほど強く動かす。奥は鈍く、層が分かれて見える
          const depthGain = 0.45 + 0.9 * p.z;
          let active = false;
          if (presence > 0) {
            const dx = x + p.ox - cursor.x;
            const dy = y + p.oy - cursor.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < cut2) {
              const f = vortexAccel(dx, dy, reach, vortexSpin, vortexRadial, V) * presence * depthGain;
              ax += V.x * presence * depthGain;
              ay += V.y * presence * depthGain;
              // 動きに引きずられる航跡
              ax += cursor.vx * f * SPRING * 0.028;
              ay += cursor.vy * f * SPRING * 0.028;
              // 螺旋の波紋: 距離と角度で位相をずらし、外へ流れる腕を作る。静止時も渦が回る
              const d = Math.sqrt(d2) + 1e-3;
              const phase = (d / reach) * 7 - t * 0.006 + Math.atan2(dy, dx) * 2;
              const ripple = Math.sin(phase) * f * SPRING * reach * 0.06;
              ax += (dx / d) * ripple;
              ay += (dy / d) * ripple;
              // 熱: 止まっていれば淡く、速く横切るほど赤い航跡が残る
              const h = f * (0.2 + 0.9 * cursorSpeed);
              if (h > p.heat) p.heat = h;
              active = true;
            }
          }
          for (let k = 0; k < shocks.length; k++) {
            const sh = shocks[k];
            const age = t - sh.t;
            const ring = age * 0.75;
            const dx = x - sh.x;
            const dy = y - sh.y;
            const d = Math.sqrt(dx * dx + dy * dy) + 1e-3;
            const off = (d - ring) / shockW;
            if (off > -3 && off < 3) {
              const g = Math.exp(-off * off) * (1 - age / SHOCK_MS);
              ax += (dx / d) * g * SPRING * fontSize * 0.3 * depthGain;
              ay += (dy / d) * g * SPRING * fontSize * 0.3 * depthGain;
              if (g * 0.95 > p.heat) p.heat = g * 0.95;
              active = true;
            }
          }
          if (active || p.ox * p.ox + p.oy * p.oy > 0.0004 || p.vx * p.vx + p.vy * p.vy > 0.01) {
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

        // 透視の奥行きと、粒固有の奥行きの両方で明るさを決める
        const depthN = clamp01(0.5 + P.z / (fontSize * 1.2));
        let alpha = alphaFloor + alphaRange * (0.55 * p.z ** 0.9 + 0.45 * depthN) + 0.1 * p.edge;
        let radius = dotBase * scale * (0.66 + 0.56 * p.z) * (1 + 0.08 * p.edge);

        if (animate) {
          if (bandOn > 0) {
            // 光の帯: 斜めの帯が通る所だけ明るく大きく、少し浮く
            const band = (x + (y - height / 2) * 0.45 - bandX) / bandW;
            if (band > -3 && band < 3) {
              const g = Math.exp(-band * band) * bandOn;
              alpha += g * 0.3;
              radius *= 1 + g * (0.15 + 0.35 * p.z);
              y -= g * (0.6 + 1.6 * p.z);
            }
          }
          // 定着: 全体を一瞬明るくし、スキャン線が通る行を焼き付けるように太らせる
          alpha += flash * 0.2;
          if (scan > 0) {
            const g = Math.exp(-(((p.y - scanY) / scanW) ** 2)) * (1 - scan);
            alpha += g * 0.4;
            radius *= 1 + g * 0.45;
          }
          // 飛行中は少し淡くする。密集した瞬間が黒い塊に見えないように
          alpha *= 1 - bump * 0.22;
          p.heat *= cool;
        }
        if (radius > dotBase * 3) radius = dotBase * 3;

        // 枠の縁で切れて見えないよう、縁の手前で溶かす
        const edgeDist = Math.min(x, width - x, y, height - y);
        if (edgeDist < fade) alpha *= clamp01(edgeDist / fade);
        if (alpha <= 0.02) {
          bucketOf[i] = HIDDEN;
          p.hasLast = false;
          continue;
        }

        // 尾: 前フレームからの移動を数フレーム分に伸ばした彗星形。速い粒ほど長い
        let tx = 0;
        let ty = 0;
        if (animate && p.hasLast) {
          tx = (x - p.lx) * TRAIL_FRAMES * frameScale;
          ty = (y - p.ly) * TRAIL_FRAMES * frameScale;
          const len2 = tx * tx + ty * ty;
          if (len2 < 2.5) {
            tx = ty = 0;
          } else if (len2 > maxTrail * maxTrail) {
            const k = maxTrail / Math.sqrt(len2);
            tx *= k;
            ty *= k;
          }
        }
        p.lx = x;
        p.ly = y;
        p.hasLast = animate;

        const heat = p.spark && p.heat < 0.5 ? 0.5 : p.heat;
        const hs = heatStep(heat);
        if (animate && heat > 0.45) {
          haloList[haloCount] = i;
          haloLevel[haloCount] = heat > 0.75 ? 1 : 0;
          haloCount++;
        }
        const level = Math.max(0, Math.min(LEVELS - 1, Math.round(alpha * LEVELS) - 1));
        const bucket = hs * LEVELS + level;
        px[i] = x;
        py[i] = y;
        pr[i] = radius;
        ptx[i] = tx;
        pty[i] = ty;
        bucketOf[i] = bucket;
        bucketCount[bucket + 1]++;
      }

      // --- 背景の塵: 字の外の空間に奥行きを与える。組み替え中は突風のように流す ---
      const n = particles.length;
      const gust = 1 + 4 * morphPulse;
      const dustSpin = morphPulse * 0.35 * spinDir;
      const dsc = Math.cos(dustSpin);
      const dss = Math.sin(dustSpin);
      const zSpan = focal * 0.95;
      for (let j = 0; j < dustCount; j++) {
        const i = n + j;
        const z = dZ[j];
        if (animate) {
          // 手前ほど速く流れる。透視の視差と合わせて、層ごとに速さが分かれる
          dX[j] += (6 + 26 * z) * gust * s;
          dY[j] += Math.sin(t * 0.0004 + dSeed[j] * 30) * (3 + 6 * z) * s;
          if (dX[j] > width * 0.7) dX[j] -= width * 1.4;
        }
        let wx = dX[j];
        let wz = (z - 0.58) * zSpan;
        if (dustSpin !== 0) {
          const nx = wx * dsc - wz * dss;
          wz = wx * dss + wz * dsc;
          wx = nx;
        }
        projectPoint(wx, dY[j], wz, cam, P);
        let x = cx + P.x;
        let y = cy + P.y;
        if (presence > 0) {
          // 塵は状態を持たせず、渦の流れに沿ってその場でずらすだけにする（軽さ優先）
          const dx = x - cursor.x;
          const dy = y - cursor.y;
          vortexAccel(dx, dy, reach * 1.3, 1, 0, V);
          const k = reach * 0.3 * presence * (0.4 + z);
          x += V.x * k;
          y += V.y * k;
        }
        const edgeDist = Math.min(x, width - x, y, height - y);
        const depthN = clamp01(0.5 + P.z / (focal * 0.6));
        let alpha = (dark ? 0.1 : 0.07) + 0.3 * depthN;
        if (animate) alpha *= 0.65 + 0.35 * Math.sin(t * 0.0021 + dSeed[j] * 50);
        if (edgeDist < fade) alpha *= clamp01(edgeDist / fade);
        if (alpha <= 0.02) {
          bucketOf[i] = HIDDEN;
          continue;
        }
        const radius = Math.min(2.6, Math.max(0.35, 0.6 * P.scale * P.scale * (dark ? 1.1 : 1)));
        const level = Math.max(0, Math.min(LEVELS - 1, Math.round(alpha * LEVELS) - 1));
        const bucket = (dEmber[j] ? 2 * LEVELS : 0) + level;
        px[i] = x;
        py[i] = y;
        pr[i] = radius;
        ptx[i] = 0;
        pty[i] = 0;
        bucketOf[i] = bucket;
        bucketCount[bucket + 1]++;
      }

      // 明度・熱の段階ごとにまとめて塗る。粒子ごとに fillStyle を変えるより桁違いに軽い
      const totalCount = n + dustCount;
      for (let b = 1; b < bucketCount.length; b++) bucketCount[b] += bucketCount[b - 1];
      const cursorPos = bucketCount.slice();
      for (let i = 0; i < totalCount; i++) {
        const b = bucketOf[i];
        if (b !== HIDDEN) drawOrder[cursorPos[b]++] = i;
      }

      ctx.clearRect(0, 0, width, height);
      // 暗い背景では重なりを加算して、点の集まりが発光して見えるようにする
      ctx.globalCompositeOperation = dark ? "lighter" : "source-over";

      // 熱い粒の光暈。大きく淡い円と小さめの円の 2 段で、ぼかしを使わずに滲ませる
      if (haloCount > 0) {
        for (let lv = 0; lv < 2; lv++) {
          ctx.fillStyle = haloStyles[lv];
          ctx.beginPath();
          for (let k = 0; k < haloCount; k++) {
            if (lv === 1 && haloLevel[k] === 0) continue;
            const i = haloList[k];
            if (bucketOf[i] === HIDDEN) continue;
            const r = pr[i] * (lv === 0 ? 4.2 : 2.4);
            ctx.moveTo(px[i] + r, py[i]);
            ctx.arc(px[i], py[i], r, 0, TAU);
          }
          ctx.fill();
        }
      }

      for (let b = 0; b < STYLE_COUNT; b++) {
        const startAt = bucketCount[b];
        const endAt = bucketCount[b + 1];
        if (startAt === endAt) continue;
        ctx.fillStyle = styles[b];
        ctx.beginPath();
        for (let k = startAt; k < endAt; k++) {
          const i = drawOrder[k];
          const r = pr[i];
          const x = px[i];
          const y = py[i];
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, TAU);
          const tx = ptx[i];
          const ty = pty[i];
          if (tx !== 0 || ty !== 0) {
            // 尾の三角形は円と同じ回り向きで足す。逆向きだと nonzero 規則で重なりが抜ける
            const len = Math.sqrt(tx * tx + ty * ty);
            const nx = (-ty / len) * r * 0.7;
            const ny = (tx / len) * r * 0.7;
            const tailX = x - tx;
            const tailY = y - ty;
            const cross = (x + nx - tailX) * (y - ny - tailY) - (y + ny - tailY) * (x - nx - tailX);
            ctx.moveTo(tailX, tailY);
            if (cross > 0) {
              ctx.lineTo(x + nx, y + ny);
              ctx.lineTo(x - nx, y - ny);
            } else {
              ctx.lineTo(x - nx, y - ny);
              ctx.lineTo(x + nx, y + ny);
            }
            ctx.closePath();
          }
        }
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      const box = {
        minX: lerp(from.minX, to.minX),
        maxX: lerp(from.maxX, to.maxX),
        minY: lerp(from.minY, to.minY),
        maxY: lerp(from.maxY, to.maxY),
      };
      if (!animate) bracketOpen = 0;
      drawHud(cam, box, fontSize, breathe, flash, scan, hold, animate);

      if (animate && morphing && progress >= 1) {
        morphing = false;
        fromIndex = index;
        phaseStart = clock;
        introDone = true;
        for (const q of particles) {
          q.sz = 0;
          q.state = 2;
        }
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
      // 止まっていた間の位置から尾が伸びないよう、前フレームの位置を捨てる
      for (const p of particles) p.hasLast = false;
      frame = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const drawStill = () => {
      for (const p of particles) {
        p.ox = p.oy = p.vx = p.vy = 0;
        p.heat = 0;
        p.sz = 0;
        p.state = 2;
        p.hasLast = false;
      }
      shocks.length = 0;
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
    const onPointerDown = (event: PointerEvent) => {
      if (frame === 0) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      // 押した点から衝撃波を広げる。タッチでも触れる唯一の干渉なので touch も受ける
      if (shocks.length >= MAX_SHOCKS) shocks.shift();
      shocks.push({ x, y, t: clock });
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
      // テーマ切り替え時（View Transition スナップショット取得前を含む）に直ちに再描画
      if (reduceQuery.matches) {
        drawStill();
      } else if (frame !== 0) {
        render(0, false);
      }
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
      if (reduceQuery.matches) {
        drawStill();
      } else {
        // 開いた瞬間の見せ場。リサイズでの組み直しでは繰り返さない
        if (!introDone) launchIntro();
        start();
      }
    });

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
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
      window.removeEventListener("pointerdown", onPointerDown);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceQuery.removeEventListener("change", onMotionPreference);
    };
  }, [words]);

  if (words.length === 0) return null;

  return (
    <div ref={wrapRef} className={`particle-stage relative aspect-[16/9] w-full ${className}`.trim()}>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
      <span className="sr-only">{label ?? words.join(" / ")}</span>
    </div>
  );
}
