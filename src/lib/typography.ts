/** ひらがな・カタカナ・漢字・半角カナ */
const JAPANESE = /[぀-ゟ゠-ヿ㐀-鿿ｦ-ﾟ]/;

export function hasJapanese(text: string): boolean {
  return JAPANESE.test(text);
}

/**
 * バッジ・タグの class。日本語を含むラベルだけ組版を切り替える。
 *
 * 既定の `font-mono` + `uppercase` + 広いトラッキングは英数字のラベルを
 * 想定した設定で、日本語には次の3点で噛み合わない:
 *
 * - `uppercase` は日本語に効かないので、狙った「ラベルらしさ」が出ない
 * - JetBrains Mono は日本語グリフを持たず、日本語部分だけ別書体に落ちる
 *   （"口頭発表 (Oral)" のように1つのラベル内で書体が混ざる）
 * - 10px + 0.15em の字間は漢字の可読限界を下回る
 *
 * タグ配列には "Q-learning" と "卒業論文" が同居するため、配列単位ではなく
 * ラベル単位で判定する。
 */
export function tagClassName(label: string): string {
  const base = "rounded-sm border border-border px-2 py-0.5 text-muted";
  return hasJapanese(label)
    ? `${base} font-sans text-xs leading-relaxed`
    : `${base} font-mono text-[10px] uppercase tracking-[0.15em]`;
}
