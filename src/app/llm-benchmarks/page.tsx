import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { SplitHeading } from "@/components/SplitHeading";
import { getSiteConfig } from "@/lib/site-config";
import { BENCHMARK_DATASET_VERIFIED_AT } from "@/lib/benchmarks-data";
import { splitIntoChunks } from "@/lib/chunks";
import { BenchmarkView } from "./BenchmarkView";

const site = getSiteConfig();

const title = "LLM Benchmarks Comparison (Oct 2026 Snapshot)";
const description =
  "2026年最新世代フロンティアモデル（Claude Opus 5.5 / Fable 5.1 / Sonnet 5.5, GPT-6 Astra / GPT-6.1 Sol, Gemini 4 Argon / 3.8 Flash, Grok 4.7, GLM-5.3, Muse Spark 1.3, Qwen3.8 Max, Kimi K3, DeepSeek V4.1 Flash等）の定量的ベンチマーク比較グラフ。掲載は一次情報または明示した第三者リーダーボードに実在する値のみです。";

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
    <div className="bg-background text-foreground">
      <main
        id="main-content"
        className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16 lg:py-20"
      >
        <div className="mb-12">
          <Link
            href="/research"
            className="focus-ring group inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
            Research
          </Link>
        </div>

        <header className="border-t border-border pt-6 mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Evaluation Data (Oct 2026 Snapshot)
          </p>
          <SplitHeading
            as="h1"
            text="最新 LLM ベンチマーク測定比較"
            chunks={splitIntoChunks("最新 LLM ベンチマーク測定比較")}
            delayStart={60}
            delayStep={24}
            className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          />
          <p className="mt-6 max-w-2xl text-base leading-[1.9] text-muted">
            2026年に発表された最新世代フロンティアモデル（Claude Opus 5.5 / Fable 5.1 / Sonnet 5.5, GPT-6 Astra / GPT-6.1 Sol, Gemini 4 Argon / 3.8 Flash, Grok 4.7, GLM-5.3, Muse Spark 1.3, Kimi K3, Qwen3.8 Max, DeepSeek V4.1 Flash / V4 Pro）の評価スナップショットです。
            掲載しているのは各開発元の公表値または明示した第三者リーダーボードに実在する値のみで、推定値による穴埋めは行っていません。
            コストは Artificial Analysis の Cost per Task（同一タスク1回の API 実行コスト）で全モデル横並びに比較できます。
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
                  各社が公表する指標は揃っておらず（例: OpenAI は GPT-6 系で SWE-bench Pro を公表していない）、全モデル×全指標の表は一次情報では埋まりません。空欄を推定値で埋めるより N/A のまま示す方針です。
                </li>
                <li>
                  <strong className="text-foreground">同じ指標でも実行条件で数値が変わります。</strong>{" "}
                  Terminal-Bench 4.0 の GPT-6 Astra は Codex (max) で 58.2%、Claude Fable 5.1 は Claude Code (max) で 57.9% です。各スコアには条件と出典を併記しています。
                </li>
                <li>
                  <strong className="text-foreground">列をまたいだ比較はできません。</strong>{" "}
                  指標ごとに出典系統を1つに固定しているため、列内の比較のみ意味を持ちます。
                </li>
                <li>
                  <strong className="text-foreground">コストはタスク実行コストで統一しています。</strong>{" "}
                  「コスト/タスク (USD)」は Artificial Analysis が同一ハーネスで計測する Cost per Task で、ベンダーごとの入出力単価やキャッシュ価格の違いに依存しません。
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
