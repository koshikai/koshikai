import type { Metadata } from "next";
import { hvacCode } from "@/lib/hvac-code";
import { hvacSlideCount, hvacSlides } from "@/lib/hvac-slides";
import { CodeViewer } from "./CodeViewer";
import { SlideViewer } from "./SlideViewer";

/**
 * 限定共有ページ。
 *
 * URL を知っている人だけが見る前提なので、検索避けを効かせ、
 * sitemap.xml にも載せない。robots.txt にパスを書くと逆に露出するため書かない。
 */
export const metadata: Metadata = {
  title: "オフィスビル空調の最適起動時刻 — 成果発表資料と分析コード",
  description:
    "始業時刻に室温を設定温度へ到達させるための起動時刻を、消費電力と室温の時系列から求める。成果発表スライドと分析コード一式。",
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
    body: "unpack.py をダウンロード・実行して公開対象ファイルを展開し、uv sync で仮想環境とパッケージを一括導入。",
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
              <strong className="text-foreground">① 熱源起動時間と現状運用の分析:</strong>{" "}
              消費電力の立ち上がりから日別の起動時刻を自動検出。チラー2台の起動インターバル（30分差）と固定5:05運用の現状、室温降温挙動と過剰予冷課題を可視化。
            </li>
            <li>
              <strong className="text-foreground">② 冷却時間算出モデルの学習:</strong>{" "}
              起動から設定温度到達までに要する予冷時間モデル（PrecoolCurveModel）を学習。休日明けの躯体蓄熱影響の分離（+2.0℃上乗せ）と交差検証（LOO-MAE）、安心保証レベル（95%安全余裕）の算出。
            </li>
            <li>
              <strong className="text-foreground">③ 削減電力量・電気代シミュレーション:</strong>{" "}
              学習した最適起動モデルを平日実稼働データに適用し、現行固定起動と比較した削減電力量（kWh）・電気代削減額・CO2削減効果を日別および累計で定量化。
            </li>
            <li>
              <strong className="text-foreground">運用画面（Streamlit / app.py）:</strong>{" "}
              前日夕方に翌日の気温予報から、8:00 に間に合う範囲で最も遅い起動時刻を提示するBM向け意思決定支援システム。二軸トレードオフグラフ（始業前消費電力量 vs 到達リスク）とデバッグ機能付き。
            </li>
          </ul>
        </section>


        <section aria-labelledby="slides-heading" className="mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2
              id="slides-heading"
              className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-foreground"
            >
              成果発表資料（全 {hvacSlideCount} ページ）
            </h2>
            <p className="font-mono text-[11px] text-muted">
              エクスポート: {hvacSlides.generatedAt}
              {hvacSlides.revision ? ` / rev ${hvacSlides.revision}` : ""}
            </p>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-[1.9] text-muted">
            現場の状況、設計上の制約、モデルの作り方、検証結果、そして
            まだ確かめていないことまでを一続きで扱った発表資料。
            起動時刻と稼働日カレンダーと実測外気温レンジは実測、
            電力量・削減額・到達時刻のシミュレーションは合成データによる試算。
          </p>
          <div className="mt-6">
            <SlideViewer />
          </div>
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
