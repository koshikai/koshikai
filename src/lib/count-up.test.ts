import { describe, expect, it } from "vitest";
import { countFrame } from "./count-up";
import { featuredResearch } from "./research";

describe("countFrame", () => {
  it("最後まで進むと元の表記に戻る", () => {
    for (const value of ["4", "10+", "96/96", "43.2×"]) {
      expect(countFrame(value, 1)).toBe(value);
    }
  });

  it("トップに出す研究の数値も、最後は元の表記になる", () => {
    for (const topic of featuredResearch) {
      if (topic.metric) expect(countFrame(topic.metric.value, 1)).toBe(topic.metric.value);
    }
  });

  it("始めは 0 で、記号と小数の桁数は保つ", () => {
    expect(countFrame("10+", 0)).toBe("0+");
    expect(countFrame("96/96", 0)).toBe("0/0");
    expect(countFrame("43.2×", 0)).toBe("0.0×");
  });

  it("途中は数値だけが進む", () => {
    expect(countFrame("96/96", 0.5)).toBe("48/48");
    expect(countFrame("43.2×", 0.5)).toBe("21.6×");
  });

  it("範囲外の進み具合は丸める", () => {
    expect(countFrame("10+", -1)).toBe("0+");
    expect(countFrame("10+", 2)).toBe("10+");
  });

  it("数値を含まない文字列はそのまま返す", () => {
    expect(countFrame("n/a", 0.3)).toBe("n/a");
  });
});
