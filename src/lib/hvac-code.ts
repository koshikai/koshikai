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

/**
 * 別のPCで全ファイルを一発復元・展開できる Python スクリプトを生成する。
 *
 * 実行方法:
 *   1. このスクリプトを unpack.py として保存（または標準入力から実行）
 *   2. python unpack.py を実行すると、全ファイルがディレクトリ構造ごと自動展開される。
 */
export function buildUnpackScript(bundle: HvacCodeBundle): string {
  const filesObj: Record<string, string> = {};
  for (const f of bundle.files) {
    filesObj[f.path] = f.code;
  }

  const jsonStr = JSON.stringify(filesObj);

  return `# ==============================================================================
# オフィスビル空調 最適起動分析システム — 自動展開・復元スクリプト
#
# 【使い方】
# 1. 任意の空フォルダ（例: hvac-precooling）を作成し、ターミナルを開く
# 2. このスクリプトを unpack.py として保存し、実行:
#      python unpack.py
# 3. 依存ライブラリのインストールと起動:
#      uv sync
#      uv run scripts/generate_dummy_data.py
#      uv run scripts/fit_models.py
#      uv run streamlit run app.py
# ==============================================================================
import json
import os

FILES = json.loads(${JSON.stringify(jsonStr)})

print("=== 空調最適起動分析プロジェクトのファイル復元を開始します ===")
for path, code in FILES.items():
    dirname = os.path.dirname(path)
    if dirname:
        os.makedirs(dirname, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print(f"  [復元] {path}")

print(f"\\n合計 {len(FILES)} ファイルの復元が完了しました。")
print("-" * 60)
print("次のコマンドで環境セットアップとアプリ起動ができます:")
print("  uv sync")
print("  uv run scripts/generate_dummy_data.py")
print("  uv run scripts/fit_models.py")
print("  uv run streamlit run app.py")
print("-" * 60)
`;
}

