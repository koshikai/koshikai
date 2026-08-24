import codeData from "@/content/hvac-code.json";

/** 公開ページに載せる 1 ファイル分のコード。 */
export interface HvacCodeFile {
  /** リポジトリルートからの相対パス。タブのラベルにも使う。 */
  path: string;
  /** 表示用の言語ラベル。シンタックスハイライトはしていない。 */
  language: string;
  /** そのファイルが何をするかの 1 行説明。 */
  description: string;
  lines: number;
  code: string;
}

export interface HvacCodeBundle {
  /** エクスポートを実行した日 (YYYY-MM-DD)。 */
  generatedAt: string;
  /** 元リポジトリのコミットハッシュ。取得できなかった場合は null。 */
  revision: string | null;
  files: HvacCodeFile[];
}

export const hvacCode: HvacCodeBundle = codeData as HvacCodeBundle;

export const hvacCodeTotalLines: number = hvacCode.files.reduce(
  (sum, file) => sum + file.lines,
  0,
);

/**
 * 全ファイルを 1 つのテキストにまとめる。
 *
 * git が使えない環境へコードを移すのがこのページの目的なので、
 * 貼り付けた先でファイルを復元できるよう、区切りにパスを明示する。
 */
export function buildCombinedSource(bundle: HvacCodeBundle): string {
  const header = [
    "# オフィスビル空調の最適起動時刻 — 分析コード一式",
    `# エクスポート日: ${bundle.generatedAt}`,
    bundle.revision ? `# リビジョン: ${bundle.revision}` : null,
    "#",
    "# 以下、ファイルごとに `===== ファイル: <パス> =====` で区切ってある。",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const body = bundle.files
    .map(
      (file) =>
        `===== ファイル: ${file.path} =====\n\n${file.code.replace(/\n+$/, "")}\n`,
    )
    .join("\n");

  return `${header}\n\n${body}`;
}
