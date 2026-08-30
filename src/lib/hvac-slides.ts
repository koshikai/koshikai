import slideData from "@/content/hvac-slides.json";

/** 公開ページに載せる 1 枚分のスライド。 */
export interface HvacSlide {
  /** 1 始まりの通し番号。ページ番号としてそのまま出す。 */
  index: number;
  /** SVG のファイル名から拡張子を除いたもの。アンカーとキーに使う。 */
  id: string;
  /** ページ見出し。サムネイルと目次のラベルにする。 */
  title: string;
  /** viewBox の寸法。縦横比の維持に使う。 */
  width: number;
  height: number;
  /**
   * 自己完結 SVG の文字列。外部参照はなく、画像は data URI で埋まっている。
   *
   * ビルド時に取り込む自前の生成物であり、利用者の入力は通らない。
   * エクスポート側（export_slides_for_web.py）で script・foreignObject・
   * on* 属性・javascript: を検出したら公開を止めている。
   */
  svg: string;
  /** 発表者ノート。--no-notes で書き出した場合は null。 */
  notes: string | null;
}

export interface HvacSlideDeck {
  /** エクスポートを実行した日 (YYYY-MM-DD)。 */
  generatedAt: string;
  /** 元リポジトリのコミットハッシュ。取得できなかった場合は null。 */
  revision: string | null;
  /** 発表者ノートを載せているか。 */
  hasNotes: boolean;
  /** public/slides/ に置いた配布用 PPTX のファイル名。無ければ null。 */
  pptxFile: string | null;
  slides: HvacSlide[];
}

export const hvacSlides: HvacSlideDeck = slideData as HvacSlideDeck;

export const hvacSlideCount: number = hvacSlides.slides.length;

/** 配布用 PPTX の公開パス。用意していなければ null。 */
export function hvacSlidesPptxHref(deck: HvacSlideDeck): string | null {
  return deck.pptxFile ? `/slides/${deck.pptxFile}` : null;
}

/**
 * 発表者ノートを 1 つのテキストにまとめる。
 *
 * 発表前に通しで読み返す用途を想定しているので、
 * どのページの話かが分かるよう見出しを付ける。
 */
export function buildCombinedNotes(deck: HvacSlideDeck): string {
  return deck.slides
    .filter((slide) => slide.notes)
    .map((slide) => `## ${slide.index}. ${slide.title}\n\n${slide.notes}`)
    .join("\n\n");
}
