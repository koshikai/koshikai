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
    body: "実データが手元にないうちは、生成スクリプトで 1 分粒度の室温・外気温・消費電力を作って動作を確認する。",
    command: "uv run scripts/generate_dummy_data.py",
  },
  {
    title: "3. ノートブックを開く",
    body: "起動時刻の分析と、任意の CSV を眺める汎用ビューアの 2 つがある。",
    command:
      "uv run marimo edit notebooks/hvac_startup_analysis.py\nuv run marimo edit notebooks/csv_explorer.py",
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
            オフィスビル空調の最適起動時刻
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-[1.9] text-muted">
            始業時刻に室温を設定温度へ到達させるには、朝の何時に熱源を起動すればよいか。
            室温・外気温・消費電力の時系列から起動時刻を検出し、
            到達したかどうかと、そのために使った電力量を突き合わせて調べる。
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
              <strong className="text-foreground">起動時刻は記録されていない。</strong>{" "}
              消費電力の立ち上がりから検出する。日中にサーモが切れて再起動した箇所を
              拾わないよう、探索範囲を始業時刻より前に限っている。
            </li>
            <li>
              <strong className="text-foreground">朝の室温は外気より高い。</strong>{" "}
              躯体が日中の熱を蓄えて夜間に放出するためで、ダミーデータもこれを再現するよう
              室内空気と躯体の 2 質点モデルにしてある。最適起動制御が扱う現象そのもの。
            </li>
            <li>
              <strong className="text-foreground">列名は決め打ちにしない。</strong>{" "}
              現場ごとにヘッダーの表記が違うため、時刻列・方位・設定温度・電力を
              中身から推定する。日本語ヘッダーや Shift-JIS、欠測行があっても読める。
            </li>
            <li>
              <strong className="text-foreground">起動を早めるほど電力量は増える。</strong>{" "}
              到達したかどうかと消費電力量を並べ、条件の近い日どうしで比べる。
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
