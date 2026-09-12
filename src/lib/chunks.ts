/**
 * 見出しを「折り返してよい単位」に分ける。
 *
 * 1 文字ずつ inline-block にすると、どの文字の間でも改行できるようになり、
 * 「確かめる」が「確 / かめる」のように割れる。日本語の改行は語の境界で
 * 起きてほしいので、Intl.Segmenter の分かち書きを単位として返す。
 *
 * 分かち書きの結果には、そのままでは使えない癖があるため 3 点を手当てする:
 * - 句読点は前の語に繋げる（行頭に「、」が来るのを防ぐ）
 * - 1 文字のひらがな（助詞・助動詞）は前の語に繋げる（「自分 / で」→「自分で」）
 * - 1 文字の漢字は次の語と繋げる（「動 / かし」→「動かし」。前へ付けると
 *   「自分で動」のように語が壊れる）
 *
 * 分割はサーバー側で行い、結果を SplitHeading に渡す。クライアントでも
 * 同じ計算をするとハイドレーション時に食い違う余地が残るため。
 */
const PUNCTUATION = /^[、。，．！？!?]+$/;
const SINGLE_HIRAGANA = /^\p{Script=Hiragana}$/u;
const SINGLE_KANJI = /^\p{Script=Han}$/u;

export function splitIntoChunks(text: string): string[] {
  const segmenter = new Intl.Segmenter("ja", { granularity: "word" });
  const chunks: string[] = [];
  /** 次の語と繋げるために保留している 1 文字（漢字） */
  let pending = "";

  for (const { segment } of segmenter.segment(text)) {
    if (pending) {
      chunks.push(pending + segment);
      pending = "";
      continue;
    }
    if (SINGLE_KANJI.test(segment)) {
      pending = segment;
      continue;
    }
    if ((SINGLE_HIRAGANA.test(segment) || PUNCTUATION.test(segment)) && chunks.length > 0) {
      chunks[chunks.length - 1] += segment;
      continue;
    }
    chunks.push(segment);
  }

  if (pending) chunks.push(pending);

  return chunks;
}
