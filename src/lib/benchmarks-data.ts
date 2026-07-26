/**
 * LLM ベンチマーク比較データ。
 *
 * 設計方針（2026-07 の出典検証を経て全面改訂）:
 *
 * 1. 掲載するのは「一次情報または明示された第三者リーダーボードに実在する値」のみ。
 *    未公表のセルは null（N/A）とし、推定値・補間値は一切置かない。
 * 2. スコアは値・測定条件（ハーネス / effort）・出典・測定日をセット単位で持つ。
 *    同じ Terminal-Bench 2.1 でも Claude Code(xhigh) と Terminus 2(high) では
 *    3ポイント以上変わるため、条件なしの数値は比較に使えない。
 * 3. 1つの指標につき出典を1系統に揃える。ベンダー公称値と第三者ハーネス値を
 *    同じ列に混ぜない。
 */

export type VerificationStatus = "verified" | "unverified";

export interface BenchmarkSource {
  label: string;
  url: string;
}

export interface BenchmarkMetric {
  id: string;
  name: string;
  category: string;
  description: string;
  /** この指標の値をどこから取っているか（列単位で1系統に固定する） */
  sourcePolicy: string;
  unit: string;
  /** バー描画時の最大値。指標により % ではなく指数の場合がある。 */
  scaleMax: number;
}

export interface BenchmarkScore {
  value: number;
  /** 値を再現するために必要な条件（エージェント / effort / サブセット等） */
  configuration: string;
  source: BenchmarkSource;
  /** 出典を確認した年月 (YYYY-MM) */
  measuredAt: string;
  verification: VerificationStatus;
}

export interface ModelBenchmarkScore {
  modelId: string;
  modelName: string;
  developer: string;
  /** 発表日 (YYYY-MM-DD)。確認できない場合は null。 */
  releaseDate: string | null;
  releaseDateSource: BenchmarkSource | null;
  /** null = そのモデルにはその指標の公表値が存在しない（N/A） */
  scores: Record<string, BenchmarkScore | null>;
}

/** データセットの最終検証月 (YYYY-MM)。 */
export const BENCHMARK_DATASET_VERIFIED_AT = "2026-07";

const AA_LEADERBOARD: BenchmarkSource = {
  label: "Artificial Analysis — Models leaderboard",
  url: "https://artificialanalysis.ai/leaderboards/models",
};

const AA_GPQA: BenchmarkSource = {
  label: "Artificial Analysis — GPQA Diamond",
  url: "https://artificialanalysis.ai/evaluations/gpqa-diamond",
};

const TBENCH_21: BenchmarkSource = {
  label: "Terminal-Bench 2.1 official leaderboard",
  url: "https://www.tbench.ai/leaderboard/terminal-bench/2.1",
};

const SWE_BENCH_PRO_BOARD: BenchmarkSource = {
  label: "SWE-bench Pro leaderboard (MorphLLM 集計)",
  url: "https://www.morphllm.com/swe-bench-pro",
};

const ANTHROPIC_OPUS_5: BenchmarkSource = {
  label: "Anthropic — Claude Opus 5 発表",
  url: "https://www.anthropic.com/news/claude-opus-5",
};

const VELLUM_SONNET_5: BenchmarkSource = {
  label: "Vellum — Claude Sonnet 5 Benchmarks Explained",
  url: "https://www.vellum.ai/blog/claude-sonnet-5-benchmarks-explained",
};

const LLM_STATS_KIMI: BenchmarkSource = {
  label: "llm-stats.com — Kimi K3",
  url: "https://llm-stats.com/models/compare/kimi-k3-vs-qwen3-max",
};

const BENCHLM_GEMINI_36: BenchmarkSource = {
  label: "BenchLM.ai — Gemini 3.6 Flash",
  url: "https://benchlm.ai/models/gemini-3-6-flash",
};

const CODINGFLEET_QWEN: BenchmarkSource = {
  label: "CodingFleet — DeepSeek V4 Pro vs Qwen 3.7 Max",
  url: "https://codingfleet.com/blog/deepseek-v4-pro-vs-qwen-3-7-max/",
};

const AA_GPT_56: BenchmarkSource = {
  label: "Artificial Analysis — GPT-5.6 has landed",
  url: "https://artificialanalysis.ai/articles/gpt-5-6-has-landed",
};

const OFFICECHAI_GEMINI_36: BenchmarkSource = {
  label: "OfficeChai — Gemini 3.6 Flash benchmarks",
  url: "https://officechai.com/ai/gemini-3-6-flash-benchmarks/",
};

export const BENCHMARK_METRICS: BenchmarkMetric[] = [
  {
    id: "aa_intelligence_index",
    name: "AA Intelligence Index v4.1",
    category: "Composite",
    description:
      "GDPval-AA v2 / Terminal-Bench v2.1 / SciCode / HLE / GPQA Diamond / CritPt / AA-LCR など9評価の複合指数。",
    sourcePolicy: "Artificial Analysis の同一ハーネスによる計測値のみ",
    unit: "pts",
    scaleMax: 100,
  },
  {
    id: "gpqa_diamond",
    name: "GPQA Diamond",
    category: "Reasoning",
    description: "大学院レベルの物理・化学・生物の選択式問題（Diamond サブセット）。",
    sourcePolicy:
      "Artificial Analysis を基準とし、未計測分のみ他出典を明示して補完",
    unit: "%",
    scaleMax: 100,
  },
  {
    id: "swe_bench_pro",
    name: "SWE-bench Pro",
    category: "Software Engineering",
    description:
      "実リポジトリの Issue をエージェントに自律解決させ、テスト通過率で評価する。",
    sourcePolicy: "SWE-bench Pro リーダーボード集計値およびベンダー公表値",
    unit: "%",
    scaleMax: 100,
  },
  {
    id: "terminal_bench_21",
    name: "Terminal-Bench 2.1",
    category: "Agent Operations",
    description: "CLI / OS 操作をエージェントに自律実行させるタスクの完了率。",
    sourcePolicy:
      "Terminal-Bench 公式リーダーボードに掲載されたエントリのみ（未掲載モデルは N/A）",
    unit: "%",
    scaleMax: 100,
  },
];

export const LLM_BENCHMARK_SCORES: ModelBenchmarkScore[] = [
  {
    modelId: "claude-opus-5",
    modelName: "Claude Opus 5",
    developer: "Anthropic",
    releaseDate: "2026-07-24",
    releaseDateSource: ANTHROPIC_OPUS_5,
    scores: {
      aa_intelligence_index: {
        value: 61,
        configuration: "max effort",
        source: AA_LEADERBOARD,
        measuredAt: "2026-07",
        verification: "verified",
      },
      gpqa_diamond: {
        value: 93.7,
        configuration: "Adaptive Reasoning / high effort",
        source: AA_GPQA,
        measuredAt: "2026-07",
        verification: "verified",
      },
      swe_bench_pro: {
        value: 79.2,
        configuration: "Anthropic システムカード Table 8.1.A",
        source: ANTHROPIC_OPUS_5,
        measuredAt: "2026-07",
        verification: "verified",
      },
      // 公式 Terminal-Bench リーダーボード未掲載
      terminal_bench_21: null,
    },
  },
  {
    modelId: "claude-fable-5",
    modelName: "Claude Fable 5",
    developer: "Anthropic",
    releaseDate: null,
    releaseDateSource: null,
    scores: {
      aa_intelligence_index: {
        value: 60,
        configuration: "max effort",
        source: AA_LEADERBOARD,
        measuredAt: "2026-07",
        verification: "verified",
      },
      gpqa_diamond: null,
      swe_bench_pro: {
        value: 80.3,
        configuration: "リーダーボード集計値",
        source: SWE_BENCH_PRO_BOARD,
        measuredAt: "2026-07",
        verification: "verified",
      },
      terminal_bench_21: {
        value: 83.8,
        configuration: "Claude Code / xhigh effort（±1.2%）",
        source: TBENCH_21,
        measuredAt: "2026-07",
        verification: "verified",
      },
    },
  },
  {
    modelId: "gpt-5-6-sol",
    modelName: "GPT-5.6 Sol",
    developer: "OpenAI",
    releaseDate: "2026-07-09",
    releaseDateSource: AA_GPT_56,
    scores: {
      aa_intelligence_index: {
        value: 59,
        configuration: "max effort",
        source: AA_LEADERBOARD,
        measuredAt: "2026-07",
        verification: "verified",
      },
      gpqa_diamond: {
        value: 94.1,
        configuration: "Artificial Analysis 計測",
        source: AA_GPQA,
        measuredAt: "2026-07",
        verification: "verified",
      },
      // OpenAI は launch 時に SWE-bench 系を公表していない
      swe_bench_pro: null,
      // 公式 Terminal-Bench リーダーボードには Terra / Luna のみ掲載
      terminal_bench_21: null,
    },
  },
  {
    modelId: "kimi-k3",
    modelName: "Kimi K3",
    developer: "Moonshot AI",
    releaseDate: "2026-07-16",
    releaseDateSource: LLM_STATS_KIMI,
    scores: {
      aa_intelligence_index: {
        value: 57,
        configuration: "—",
        source: AA_LEADERBOARD,
        measuredAt: "2026-07",
        verification: "verified",
      },
      gpqa_diamond: {
        value: 93.5,
        configuration: "第三者集計（ハーネス非公開）",
        source: LLM_STATS_KIMI,
        measuredAt: "2026-07",
        verification: "verified",
      },
      swe_bench_pro: null,
      terminal_bench_21: null,
    },
  },
  {
    modelId: "claude-sonnet-5",
    modelName: "Claude Sonnet 5",
    developer: "Anthropic",
    releaseDate: "2026-06-30",
    releaseDateSource: VELLUM_SONNET_5,
    scores: {
      aa_intelligence_index: {
        value: 53,
        configuration: "max effort",
        source: AA_LEADERBOARD,
        measuredAt: "2026-07",
        verification: "verified",
      },
      gpqa_diamond: null,
      swe_bench_pro: {
        value: 63.2,
        configuration: "ベンダー公表値",
        source: VELLUM_SONNET_5,
        measuredAt: "2026-07",
        verification: "verified",
      },
      terminal_bench_21: {
        value: 74.6,
        configuration: "Claude Code / high effort（±1.6%）",
        source: TBENCH_21,
        measuredAt: "2026-07",
        verification: "verified",
      },
    },
  },
  {
    modelId: "gemini-3-6-flash",
    modelName: "Gemini 3.6 Flash",
    developer: "Google",
    releaseDate: "2026-07-21",
    releaseDateSource: OFFICECHAI_GEMINI_36,
    scores: {
      aa_intelligence_index: {
        value: 50,
        configuration: "—",
        source: AA_LEADERBOARD,
        measuredAt: "2026-07",
        verification: "verified",
      },
      gpqa_diamond: {
        value: 92.8,
        configuration: "Artificial Analysis 計測（BenchLM 経由）",
        source: BENCHLM_GEMINI_36,
        measuredAt: "2026-07",
        verification: "verified",
      },
      swe_bench_pro: null,
      terminal_bench_21: null,
    },
  },
  {
    modelId: "gemini-3-1-pro",
    modelName: "Gemini 3.1 Pro",
    developer: "Google",
    releaseDate: null,
    releaseDateSource: null,
    scores: {
      aa_intelligence_index: {
        value: 46,
        configuration: "Preview",
        source: AA_LEADERBOARD,
        measuredAt: "2026-07",
        verification: "verified",
      },
      gpqa_diamond: {
        value: 94.1,
        configuration: "Preview / Artificial Analysis 計測",
        source: AA_GPQA,
        measuredAt: "2026-07",
        verification: "verified",
      },
      swe_bench_pro: null,
      terminal_bench_21: {
        value: 65.8,
        configuration: "Gemini CLI / high effort（±1.7%）",
        source: TBENCH_21,
        measuredAt: "2026-07",
        verification: "verified",
      },
    },
  },
  {
    modelId: "qwen-3-7-max",
    modelName: "Qwen 3.7 Max",
    developer: "Alibaba Cloud",
    releaseDate: null,
    releaseDateSource: null,
    scores: {
      aa_intelligence_index: {
        value: 46,
        configuration: "—",
        source: AA_LEADERBOARD,
        measuredAt: "2026-07",
        verification: "verified",
      },
      gpqa_diamond: {
        value: 92.4,
        configuration: "ベンダー公表値",
        source: CODINGFLEET_QWEN,
        measuredAt: "2026-07",
        verification: "verified",
      },
      swe_bench_pro: {
        value: 60.6,
        configuration: "第三者集計",
        source: CODINGFLEET_QWEN,
        measuredAt: "2026-07",
        verification: "verified",
      },
      terminal_bench_21: null,
    },
  },
  {
    modelId: "deepseek-v4",
    modelName: "DeepSeek V4 Pro",
    developer: "DeepSeek",
    releaseDate: null,
    releaseDateSource: null,
    scores: {
      aa_intelligence_index: {
        value: 44,
        configuration: "max effort",
        source: AA_LEADERBOARD,
        measuredAt: "2026-07",
        verification: "verified",
      },
      gpqa_diamond: null,
      swe_bench_pro: null,
      terminal_bench_21: null,
    },
  },
];
