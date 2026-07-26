import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { getSiteConfig } from "@/lib/site-config";
import { BENCHMARK_DATASET_VERIFIED_AT } from "@/lib/benchmarks-data";
import { BenchmarkView } from "./BenchmarkView";

const site = getSiteConfig();

const title = "LLM Benchmarks Comparison (2026 Snapshot)";
const description =
  "2026年最新世代フロンティアモデル（Claude 5, GPT-5.6 Sol, Gemini 3.6 Flash/3.1 Pro, Qwen 3.7 Max, Kimi K3等）の定量的ベンチマーク比較グラフ。出典未確定の参考値を含みます。";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/llm-benchmarks",
  },
  openGraph: {
    title,
    description,
    url: `${site.baseUrl}/llm-benchmarks`,
    siteName: site.name,
    locale: site.locale,
    type: "article",
  },
};

export default function LlmBenchmarksPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main
        id="main-content"
        className="mx-auto w-full max-w-5xl px-6 py-12 sm:py-16 lg:py-20"
      >
        <div className="mb-12">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
            Back to top
          </Link>
        </div>

        <header className="border-t border-border pt-6 mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Evaluation Data (2026 Mid-Year Snapshot)
          </p>
          <h1 className="mt-3 text-balance font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            最新 LLM ベンチマーク測定比較
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-[1.9] text-muted">
            2026年に発表された最新世代フロンティアモデル（Claude Opus 5 / Fable 5 / Sonnet 5, GPT-5.6 Sol, Gemini 3.6 Flash / 3.1 Pro, Kimi K3, Qwen 3.7 Max, DeepSeek V4 Pro）の評価スナップショットです。
            掲載しているのは各開発元の公表値または明示した第三者リーダーボードに実在する値のみで、推定値による穴埋めは行っていません。
          </p>
        </header>

        {/* データの読み方に関する注記 */}
        <aside
          role="note"
          aria-labelledby="dataset-notice-heading"
          className="mb-12 rounded-sm border border-border bg-subtle/30 p-5"
        >
          <div className="flex items-start gap-3">
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-muted"
              aria-hidden="true"
            />
            <div>
              <h2
                id="dataset-notice-heading"
                className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-foreground"
              >
                データの読み方
              </h2>
              <ul className="mt-3 space-y-2 text-sm leading-[1.9] text-muted">
                <li>
                  <strong className="text-foreground">N/A は「未公表」を意味します。</strong>{" "}
                  各社が公表する指標は揃っておらず（例: OpenAI は GPT-5.6 で SWE-bench 系を公表していない）、全モデル×全指標の表は一次情報では埋まりません。空欄を推定値で埋めるより N/A のまま示す方針です。
                </li>
                <li>
                  <strong className="text-foreground">同じ指標でも実行条件で数値が変わります。</strong>{" "}
                  Terminal-Bench 2.1 の Claude Fable 5 は Claude Code (xhigh) で 83.8%、Terminus 2 (high) で 80.4% です。各スコアには条件と出典を併記しています。
                </li>
                <li>
                  <strong className="text-foreground">列をまたいだ比較はできません。</strong>{" "}
                  指標ごとに出典系統を1つに固定しているため、列内の比較のみ意味を持ちます。
                </li>
              </ul>
              <p className="mt-3 font-mono text-[11px] text-muted">
                出典確認: {BENCHMARK_DATASET_VERIFIED_AT}
              </p>
            </div>
          </div>
        </aside>

        {/* インタラクティブ比較コンポーネント (グラフ / テーブル) */}
        <BenchmarkView />
      </main>
    </div>
  );
}
