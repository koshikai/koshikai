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
    title: "1. 依存をそろえる",
    body: "uv でプロジェクトを作り、numpy / pandas / matplotlib / marimo を入れる。",
    command: "uv init\nuv add numpy pandas matplotlib marimo",
  },
  {
    title: "2. ダミーデータを作る",
    body: "手書きメモ確定仕様（チラー2台の30分差起動・4方位外気湿度・通年/詳細2層データ）を生成。",
    command: "uv run scripts/generate_dummy_data.py",
  },
  {
    title: "3. ノートブック・アプリを開く",
    body: "01〜07の番号順分析ノートブック、およびBM向け意思決定支援アプリ（決定版）を起動。",
    command:
      "uv run marimo edit notebooks/01_startup_trend_analysis.py\nuv run marimo run notebooks/07_risk_guaranteed_decision_app.py",
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
            室温・外気温・外気湿度・消費電力の時系列から起動時刻を検出し、
            過剰予冷電力の削減試算、熱力学エンタルピー回帰モデル、およびBM（ビルメンテナンス）向けの安心保証型意思決定アプリ一式。
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
            このコードで扱っていること（01〜07シリーズ）
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-[1.9] text-muted">
            <li>
              <strong className="text-foreground">① 起動時刻検出とチラー固定インターバル:</strong>{" "}
              消費電力の立ち上がりから起動時刻を自動検出。チラーAとチラーBの30分固定インターバル制御や、月曜早朝（3:14）の蓄熱負荷を捉える。
            </li>
            <li>
              <strong className="text-foreground">② 室温降下と予冷時間（所要時間）:</strong>{" "}
              FCU 4系統（NE/NW/SE/SW）のプルダウン降温速度を解析し、設定温度到達までに必要な予冷時間を算出。
            </li>
            <li>
              <strong className="text-foreground">③ 過剰予冷電力とコスト削減額の試算:</strong>{" "}
              8:00到達差分（タイムマージン）から無駄な維持運転消費電力を算出し、省エネ効果を可視化。
            </li>
            <li>
              <strong className="text-foreground">④ 予熱時間回帰モデル:</strong>{" "}
              起動時室温差（ΔT）と外気温から最適起動時刻を逆算する重回帰モデルを構築。
            </li>
            <li>
              <strong className="text-foreground">⑥ 外気湿度・エンタルピー（潜熱負荷）解析:</strong>{" "}
              湿球温度 Twb と比エンタルピー h を熱力学計算し、夏場の多湿・除湿負荷による予冷遅れを定量化。
            </li>
            <li>
              <strong className="text-foreground">⑦ BM向け意思決定支援アプリ（決定版）:</strong>{" "}
              クレーム安心保証レベル（90%/95%/99%）と安心帯バンド付きタイムラインシミュレーションを提供。
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
