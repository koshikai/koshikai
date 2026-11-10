import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { maskFromAlpha, pairByColumns, ParticleType, scatterGlyph } from "./ParticleType";

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
