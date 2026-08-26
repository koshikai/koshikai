import type { Metadata } from "next";
import { hvacCode } from "@/lib/hvac-code";
import { CodeViewer } from "./CodeViewer";

/**
 * 限定共有ページ。
 *
 * URL を知っている人だけが見る前提なので、検索避けを効かせ、
 * sitemap.xml にも載せない。robots.txt にパスを書くと逆に露出するため書かない。
 */
export const metadata: Metadata = {
  title: "オフィスビル空調の最適起動時刻 — 分析コード",
  description:
    "始業時刻に室温を設定温度へ到達させるための起動時刻を、消費電力と室温の時系列から求める分析コード一式。",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

const SETUP_STEPS = [
  {
    title: "1. ファイルを展開して依存を解決",
    body: "unpack.py をダウンロード・実行して全ファイルを展開し、uv sync で仮想環境とパッケージを一括導入。",
    command: "python unpack.py\nuv sync",
  },
  {
    title: "2. データを準備・モデル学習",
    body: "ダミーデータを生成し、アプリが読む回帰モデルを学習して models/ へ書き出す。",
    command: "uv run scripts/generate_dummy_data.py\nuv run scripts/fit_models.py",
  },
  {
    title: "3. アプリ・ノートブックを開く",
    body: "翌日の気温予報から起動時刻を決める運用画面と、番号順の分析ノートブック。",
    command:
      "uv run streamlit run app.py\nuv run marimo edit notebooks/01_startup_trend_analysis.py",
  },
];


export default function HvacPrecoolingCodePage() {
  return (
    <div className="bg-background text-foreground">
      <main
        id="main-content"
        className="mx-auto w-full max-w-5xl px-6 py-12 sm:py-16 lg:py-20"
      >
        <header className="border-t border-border pt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Unlisted — URL を知っている人だけが見られるページ
          </p>
          <h1 className="mt-3 text-balance font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            オフィスビル空調の最適起動時刻 — 分析・意思決定支援システム
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-[1.9] text-muted">
            始業時刻（8:00）に室温を設定温度へ到達させるには、朝の何時に熱源（チラー）を起動すればよいか。
            起動時刻は前日のうちに人が決めるため、決定時点では翌朝の室温が分からない。
            そこで室温を経由せず、翌日の気温予報から必要な予冷時間を直接読む。
            消費電力・室温・外気温の時系列からの起動時刻検出、過剰予冷電力の削減試算、
            モデルの比較・選定、およびBM（ビルメンテナンス）向けの意思決定アプリ一式。
          </p>
          <p className="mt-4 font-mono text-[11px] text-muted">
            エクスポート: {hvacCode.generatedAt}
            {hvacCode.revision ? ` / rev ${hvacCode.revision}` : ""}
          </p>
        </header>

        <section
          aria-labelledby="overview-heading"
          className="mt-12 rounded-sm border border-border bg-subtle/30 p-5"
        >
          <h2
            id="overview-heading"
            className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-foreground"
          >
            このコードで扱っていること
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-[1.9] text-muted">
            <li>
              <strong className="text-foreground">① 起動時刻の検出:</strong>{" "}
              消費電力の立ち上がりから日別の起動時刻を検出。チラー2台の固定インターバル制御や、非稼働日の切り分けを扱う。
            </li>
            <li>
              <strong className="text-foreground">② 室温降下と予冷時間:</strong>{" "}
              FCU 4系統のプルダウン降温挙動を解析し、設定温度に到達するまでの所要時間を算出。読み込んだデータの点検もここで行う。
            </li>
            <li>
              <strong className="text-foreground">③ 過剰予冷電力の試算:</strong>{" "}
              到達時刻と 8:00 の差から、誰もいない部屋を冷やし続けている分の電力量を算出。
            </li>
            <li>
              <strong className="text-foreground">④ モデルの比較と選定:</strong>{" "}
              「外気温のみ」「室温差のみ」「両方の重回帰」を比較。重回帰は多重共線性で外気温の係数が負に振れるため、室温差のみを採用した。
            </li>
            <li>
              <strong className="text-foreground">⑥ 湿度・エンタルピーの検証:</strong>{" "}
              湿球温度と比エンタルピーを熱力学計算して比較。精度がほとんど変わらないため不採用とした、その判断の記録。
            </li>
            <li>
              <strong className="text-foreground">⑧ 通年データと年間外挿:</strong>{" "}
              月別の消費実態から、冷房期2週間の削減量を年間へ引き伸ばしてよい日数を確かめる。
            </li>
            <li>
              <strong className="text-foreground">⑨ 気温予報からの起動時刻決定:</strong>{" "}
              翌日の1時間ごとの気温予報から、8:00 に間に合う範囲で最も遅い起動時刻を求める運用画面。Streamlit 版（app.py）と marimo 版がある。
            </li>
          </ul>
        </section>


        <section aria-labelledby="setup-heading" className="mt-12">
          <h2
            id="setup-heading"
            className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-foreground"
          >
            動かし方
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {SETUP_STEPS.map((step) => (
              <div
                key={step.title}
                className="rounded-sm border border-border p-4"
              >
                <h3 className="font-mono text-xs text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-[1.8] text-muted">
                  {step.body}
                </p>
                <pre className="mt-3 overflow-x-auto rounded-sm bg-subtle/30 p-3 font-mono text-[11px] leading-[1.7] text-foreground">
                  {step.command}
                </pre>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 border-t border-border pt-10">
          <CodeViewer />
        </div>
      </main>
    </div>
  );
}
