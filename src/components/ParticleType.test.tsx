import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  heatStep,
  makeCamera,
  maskFromAlpha,
  mixRgb,
  morphEnvelope,
  pairByColumns,
  ParticleType,
  projectPoint,
  scatterGlyph,
  vortexAccel,
} from "./ParticleType";

/** 決まった列を返す乱数。テストの結果を実行ごとに揺らさない */
function seeded(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** w×h の画像に、矩形 (x0, y0)-(x1, y1) を不透明で塗った RGBA 配列 */
function rectAlpha(w: number, h: number, x0: number, y0: number, x1: number, y1: number) {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) data[(y * w + x) * 4 + 3] = 255;
  return data;
}

describe("maskFromAlpha", () => {
  it("塗り画素と、4 近傍に空きがある輪郭画素を拾う", () => {
    const mask = maskFromAlpha(rectAlpha(10, 10, 2, 2, 7, 7), 10, 10);
    expect(mask.ink.length).toBe(25);
    // 5×5 の外周 16 画素が輪郭、内側 3×3 は輪郭ではない
    expect(mask.edge.reduce((a, b) => a + b, 0)).toBe(16);
  });
});

describe("scatterGlyph", () => {
  const mask = maskFromAlpha(rectAlpha(200, 120, 20, 20, 180, 100), 200, 120);

  it("指定した数ちょうどの点を返す（語ごとに粒子数を揃えるため）", () => {
    for (const n of [300, 900, 1500]) {
      expect(scatterGlyph(mask, n, seeded(n)).points).toHaveLength(n);
    }
  });

  it("点はすべて塗りの中にあり、輪郭にも点が載る", () => {
    const { points } = scatterGlyph(mask, 800, seeded(3));
    for (const p of points) {
      expect(p.x).toBeGreaterThanOrEqual(20);
      expect(p.x).toBeLessThanOrEqual(180);
      expect(p.y).toBeGreaterThanOrEqual(20);
      expect(p.y).toBeLessThanOrEqual(100);
    }
    expect(points.some((p) => p.edge === 1)).toBe(true);
  });

  it("輪郭の点は内側より密に並ぶ", () => {
    const { points, spacing } = scatterGlyph(mask, 800, seeded(5));
    const edgeCount = points.filter((p) => p.edge === 1).length;
    // 外周の長さ / 内側の間隔 より多ければ、内側より詰まっている
    const perimeter = 2 * (160 + 80);
    expect(edgeCount).toBeGreaterThan(perimeter / spacing);
  });

  it("塗りがなければ空を返す", () => {
    const empty = maskFromAlpha(new Uint8ClampedArray(40 * 4), 10, 4);
    expect(scatterGlyph(empty, 100).points).toEqual([]);
  });
});

describe("pairByColumns", () => {
  it("1 対 1 の対応を作る", () => {
    const random = seeded(7);
    const a = Array.from({ length: 400 }, () => ({ x: random() * 100, y: random() * 50 }));
    const b = Array.from({ length: 400 }, () => ({ x: random() * 300, y: random() * 50 }));
    const pairs = pairByColumns(a, [0, 100], b, [0, 300], seeded(9));
    expect(new Set(pairs).size).toBe(400);
  });

  it("左にある点は左へ、右にある点は右へ送る（中央で交差させない）", () => {
    const random = seeded(11);
    const a = Array.from({ length: 600 }, () => ({ x: random() * 100, y: random() * 50 }));
    const b = Array.from({ length: 600 }, () => ({ x: 500 + random() * 200, y: random() * 50 }));
    const pairs = pairByColumns(a, [0, 100], b, [500, 700], seeded(13));
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      const from = a[i].x / 100;
      const to = (b[pairs[i]].x - 500) / 200;
      // 帯の幅（約 1/8）＋境目の揺らぎまでは許す
      expect(Math.abs(from - to)).toBeLessThan(0.2);
      sum += Math.abs(from - to);
    }
    expect(sum / a.length).toBeLessThan(0.06);
  });
});

describe("morphEnvelope", () => {
  it("飛行の前後では 0 で、途中だけ膨らむ（着地点で字がずれない）", () => {
    expect(morphEnvelope(0)).toBe(0);
    expect(morphEnvelope(1)).toBe(0);
    expect(morphEnvelope(-0.2)).toBe(0);
    expect(morphEnvelope(1.3)).toBe(0);
    for (let u = 0.05; u < 1; u += 0.05) {
      const v = morphEnvelope(u);
      expect(v).toBeGreaterThan(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it("山は前半にある（素早くほどけて、ゆっくり組み上がる）", () => {
    let peakU = 0;
    let peak = -1;
    for (let u = 0; u <= 1; u += 0.001) {
      const v = morphEnvelope(u);
      if (v > peak) {
        peak = v;
        peakU = u;
      }
    }
    expect(peakU).toBeGreaterThan(0.3);
    expect(peakU).toBeLessThan(0.45);
    expect(peak).toBeCloseTo(1, 2);
  });
});

describe("heatStep", () => {
  it("熱を 0..3 の段階へ単調に丸める", () => {
    expect(heatStep(0)).toBe(0);
    expect(heatStep(0.1)).toBe(0);
    expect(heatStep(0.2)).toBe(1);
    expect(heatStep(0.5)).toBe(2);
    expect(heatStep(1)).toBe(3);
    let prev = 0;
    for (let h = 0; h <= 1; h += 0.01) {
      const s = heatStep(h);
      expect(s).toBeGreaterThanOrEqual(prev);
      prev = s;
    }
  });
});

describe("mixRgb", () => {
  it("両端で元の色を返し、途中は線形に混ぜる", () => {
    const a = [0, 100, 200];
    const b = [200, 100, 0];
    expect(mixRgb(a, b, 0)).toEqual([0, 100, 200]);
    expect(mixRgb(a, b, 1)).toEqual([200, 100, 0]);
    expect(mixRgb(a, b, 0.5)).toEqual([100, 100, 100]);
    // 範囲外は丸める
    expect(mixRgb(a, b, 2)).toEqual([200, 100, 0]);
  });
});

describe("projectPoint", () => {
  const out = { x: 0, y: 0, z: 0, scale: 0 };

  it("正面のカメラで z=0 なら、そのままの位置・等倍", () => {
    projectPoint(120, -40, 0, makeCamera(0, 0, 1000), out);
    expect(out.x).toBeCloseTo(120);
    expect(out.y).toBeCloseTo(-40);
    expect(out.scale).toBeCloseTo(1);
  });

  it("手前（z > 0）は大きく外へ、奥は小さく中心へ寄る", () => {
    const cam = makeCamera(0, 0, 1000);
    const near = { ...projectPoint(100, 0, 200, cam, out) };
    const far = { ...projectPoint(100, 0, -200, cam, out) };
    expect(near.scale).toBeGreaterThan(1);
    expect(far.scale).toBeLessThan(1);
    expect(near.x).toBeGreaterThan(100);
    expect(far.x).toBeLessThan(100);
  });

  it("カメラに近づきすぎた点でも倍率は頭打ちになる", () => {
    projectPoint(0, 0, 5000, makeCamera(0, 0, 1000), out);
    expect(Number.isFinite(out.scale)).toBe(true);
    expect(out.scale).toBeLessThan(2.7);
  });

  it("ヨーで回すと、奥行きの違う点の左右がずれる（視差）", () => {
    const cam = makeCamera(0.2, 0, 1000);
    const front = projectPoint(0, 0, 50, cam, out).x;
    const back = projectPoint(0, 0, -50, cam, out).x;
    expect(front).toBeGreaterThan(0);
    expect(back).toBeLessThan(0);
  });
});

describe("vortexAccel", () => {
  const out = { x: 0, y: 0 };

  it("接線成分は半径方向に直交し、spin の符号で回る向きが変わる", () => {
    vortexAccel(10, 0, 50, 1, 0, out);
    expect(out.x).toBeCloseTo(0);
    expect(out.y).toBeGreaterThan(0);
    vortexAccel(10, 0, 50, -1, 0, out);
    expect(out.y).toBeLessThan(0);
  });

  it("radial が正なら外へ、負なら中心へ向く", () => {
    vortexAccel(0, 10, 50, 0, 1, out);
    expect(out.y).toBeGreaterThan(0);
    vortexAccel(0, 10, 50, 0, -1, out);
    expect(out.y).toBeLessThan(0);
  });

  it("影響は距離で減衰する", () => {
    const nearF = vortexAccel(5, 0, 50, 1, 0, out);
    const farF = vortexAccel(150, 0, 50, 1, 0, out);
    expect(nearF).toBeGreaterThan(farF);
    expect(farF).toBeLessThan(0.001);
  });
});

describe("ParticleType", () => {
  it("canvas は読み上げから外し、語を読み上げ用テキストとして残す", () => {
    const { container, getByText } = render(<ParticleType words={["build", "operate"]} label="build / operate" />);
    expect(container.querySelector("canvas")?.getAttribute("aria-hidden")).toBe("true");
    expect(getByText("build / operate")).toBeTruthy();
  });

  it("語がなければ何も描かない", () => {
    const { container } = render(<ParticleType words={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
