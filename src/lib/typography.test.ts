import { describe, expect, it } from "vitest";
import { hasJapanese, tagClassName } from "./typography";

describe("hasJapanese", () => {
  it("detects kana and kanji", () => {
    expect(hasJapanese("卒業論文")).toBe(true);
    expect(hasJapanese("ポスター発表")).toBe(true);
    expect(hasJapanese("ひらがな")).toBe(true);
    // ラベル内に一部でも日本語があれば日本語扱いにする
    expect(hasJapanese("口頭発表 (Oral)")).toBe(true);
  });

  it("leaves latin-only labels alone", () => {
    expect(hasJapanese("Q-learning")).toBe(false);
    expect(hasJapanese("Next.js 16.2")).toBe(false);
    expect(hasJapanese("International")).toBe(false);
  });
});

describe("tagClassName", () => {
  it("drops mono / uppercase / wide tracking for Japanese labels", () => {
    const jp = tagClassName("学生発表賞");
    expect(jp).toContain("font-sans");
    expect(jp).not.toContain("uppercase");
    expect(jp).not.toContain("font-mono");
    expect(jp).not.toContain("text-[10px]");
  });

  it("keeps the mono label styling for latin labels", () => {
    const en = tagClassName("Transfer Learning");
    expect(en).toContain("font-mono");
    expect(en).toContain("uppercase");
  });
});
