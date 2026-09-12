import { describe, expect, it } from "vitest";
import { splitIntoChunks } from "./chunks";

describe("splitIntoChunks", () => {
  // これが目的。語が割れた位置で改行されると読みにくい。
  it("keeps a multi-character word in one chunk", () => {
    expect(splitIntoChunks("確かめる")).toEqual(["確かめる"]);
  });

  it("attaches punctuation to the preceding chunk", () => {
    const chunks = splitIntoChunks("作って、公開して、使える");

    expect(chunks).toEqual(["作って、", "公開して、", "使える"]);
    for (const chunk of chunks) {
      expect(chunk.startsWith("、")).toBe(false);
    }
  });

  it("attaches single-character particles to the preceding chunk", () => {
    expect(splitIntoChunks("問いを立て、データと実験で確かめる")).toEqual([
      "問いを",
      "立て、",
      "データと",
      "実験で",
      "確かめる",
    ]);
  });

  // 「動 / かし」は前ではなく次と繋げる。逆向きに繋ぐと「自分で動」になる。
  it("attaches a single kanji to the following chunk", () => {
    const chunks = splitIntoChunks("作るだけでなく、自分で動かし続ける");

    expect(chunks).toEqual(["作る", "だけで", "なく、", "自分で", "動かし", "続ける"]);
    expect(chunks).not.toContain("自分で動");
  });

  it("leaves latin text alone", () => {
    expect(splitIntoChunks("koshikai")).toEqual(["koshikai"]);
  });

  it("keeps every character", () => {
    const text = "作って、公開して、使える状態にしたもの";

    expect(splitIntoChunks(text).join("")).toBe(text);
  });

  it("returns nothing for empty text", () => {
    expect(splitIntoChunks("")).toEqual([]);
  });
});
