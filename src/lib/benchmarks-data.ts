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
 * 4. 価格は AA リーダーボードの Cost per Task（同一ハーネス・同一スナップショットの
 *    タスク実行コスト）を唯一の出典とする。ベンダー公称の入出力単価は混ぜない。
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
  /** モデルのイメージカラー（ベンダーブランド色を基調にした 6 桁 hex） */
  color: string;
  /** 発表日 (YYYY-MM-DD)。確認できない場合は null。 */
  releaseDate: string | null;
  releaseDateSource: BenchmarkSource | null;
  /** null = そのモデルにはその指標の公表値が存在しない（N/A） */
  scores: Record<string, BenchmarkScore | null>;
  /**
   * AA リーダーボードの Cost per Task（USD）。
   * ベンチマーク1タスクを実行する API コストで、指標と同じ条件設定の値。
   */
  pricing: BenchmarkScore | null;
}

/** データセットの最終検証月 (YYYY-MM)。 */
export const BENCHMARK_DATASET_VERIFIED_AT = "2026-08";

const AA_LEADERBOARD: BenchmarkSource = {
  label: "Artificial Analysis — Models leaderboard",
  url: "https://artificialanalysis.ai/leaderboards/models",
};

const AA_GPQA: BenchmarkSource = {
  label: "Artificial Analysis — GPQA Diamond",
  url: "https://artificialanalysis.ai/evaluations/gpqa-diamond",
};

const AA_HLE: BenchmarkSource = {
  label: "Artificial Analysis — Humanity's Last Exam",
  url: "https://artificialanalysis.ai/evaluations/humanitys-last-exam",
};

const AA_GDPVAL_V2: BenchmarkSource = {
  label: "Artificial Analysis — GDPval-AA v2",
  url: "https://artificialanalysis.ai/evaluations/gdpval-aa",
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

const AA_V4_FLASH_0731_ARTICLE: BenchmarkSource = {
  label:
    "Artificial Analysis — DeepSeek V4 Flash 0731 scores 50 on the Intelligence Index",
  url: "https://artificialanalysis.ai/articles/deepseek-v4-flash-0731-scores-50-on-the-artificial-analysis-intelligence-index-10-points-above-previous-deepseek-v4-flash",
};

const DEEPSEEK_API_CHANGELOG: BenchmarkSource = {
  label: "DeepSeek API Docs — Change Log",
  url: "https://api-docs.deepseek.com/updates/",
};

const CURSORBENCH_32: BenchmarkSource = {
  label: "Cursor — CursorBench 3.2",
  url: "https://cursor.com/cursorbench",
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
    id: "hle",
    name: "Humanity's Last Exam (AA-HLE)",
    category: "Reasoning",
    description:
      "専門家レベルの知識・推論を問う公開問題セット（数学・物理・生物など）への正答率。AA が独自ハーネスで計測した値。",
    sourcePolicy: "Artificial Analysis の同一ハーネスによる計測値のみ",
    unit: "%",
    scaleMax: 100,
  },
  {
    id: "gdpval_aa_v2",
    name: "GDPval-AA v2",
    category: "Agentic Knowledge",
    description:
      "AA が設計したエージェント型の知識労働タスク（ウェブ調査・レポート作成・情報統合など）の成績を Elo レーティングで比較。Intelligence Index の構成評価の1つ。",
    sourcePolicy: "Artificial Analysis の同一ハーネスによる計測値のみ",
    unit: "Elo",
    scaleMax: 2000,
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
  {
    id: "cursorbench_32",
    name: "CursorBench 3.2",
    category: "Coding Agent",
    description:
      "実 Cursor セッション由来の曖昧なマルチファイル課題を Cursor エージェントで解決させる成功率。IDE エージェントとモデルの組み合わせを測るベンダー自走ハーネスで、生のモデル性能とは別物。",
    sourcePolicy:
      "Cursor 公式 CursorBench ページの公表値のみ（effort 設定は行ごとに併記）",
    unit: "%",
    scaleMax: 100,
  },
];

export const LLM_BENCHMARK_SCORES: ModelBenchmarkScore[] = [
  {
    modelId: "claude-opus-5",
    modelName: "Claude Opus 5",
    developer: "Anthropic",
    color: "#CC785C",
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
      hle: {
        value: 52.6,
        configuration: "max effort",
        source: AA_HLE,
        measuredAt: "2026-08",
        verification: "verified",
      },
      gdpval_aa_v2: {
        value: 1858,
        configuration: "max effort",
        source: AA_GDPVAL_V2,
        measuredAt: "2026-08",
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
      cursorbench_32: {
        value: 70.0,
        configuration: "Cursor エージェント / Max effort",
        source: CURSORBENCH_32,
        measuredAt: "2026-08",
        verification: "verified",
      },
    },
    pricing: {
      value: 2.34,
      configuration: "max effort",
      source: AA_LEADERBOARD,
      measuredAt: "2026-08",
      verification: "verified",
    },
  },
  {
    modelId: "claude-fable-5",
    modelName: "Claude Fable 5",
    developer: "Anthropic",
    color: "#F0B429",
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
      hle: {
        value: 53.3,
        configuration: "Adaptive Reasoning / max effort",
        source: AA_HLE,
        measuredAt: "2026-08",
        verification: "verified",
      },
      gdpval_aa_v2: {
        value: 1746,
        configuration: "max effort",
        source: AA_GDPVAL_V2,
        measuredAt: "2026-08",
        verification: "verified",
      },
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
      cursorbench_32: {
        value: 70.5,
        configuration: "Cursor エージェント / Max effort",
        source: CURSORBENCH_32,
        measuredAt: "2026-08",
        verification: "verified",
      },
    },
    pricing: {
      value: 3.15,
      configuration: "with fallback / max effort",
      source: AA_LEADERBOARD,
      measuredAt: "2026-08",
      verification: "verified",
    },
  },
  {
    modelId: "gpt-5-6-sol",
    modelName: "GPT-5.6 Sol",
    developer: "OpenAI",
    color: "#10A37F",
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
      hle: {
        value: 47.2,
        configuration: "max effort",
        source: AA_HLE,
        measuredAt: "2026-08",
        verification: "verified",
      },
      gdpval_aa_v2: {
        value: 1733,
        configuration: "max effort",
        source: AA_GDPVAL_V2,
        measuredAt: "2026-08",
        verification: "verified",
      },
      // OpenAI は launch 時に SWE-bench 系を公表していない
      swe_bench_pro: null,
      // 公式 Terminal-Bench リーダーボードには Terra / Luna のみ掲載
      terminal_bench_21: null,
      cursorbench_32: {
        value: 67.2,
        configuration: "Cursor エージェント / Max effort",
        source: CURSORBENCH_32,
        measuredAt: "2026-08",
        verification: "verified",
      },
    },
    pricing: {
      value: 1.86,
      configuration: "max effort",
      source: AA_LEADERBOARD,
      measuredAt: "2026-08",
      verification: "verified",
    },
  },
  {
    modelId: "kimi-k3",
    modelName: "Kimi K3",
    developer: "Moonshot AI",
    color: "#4F46E5",
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
      hle: {
        value: 44.3,
        configuration: "—",
        source: AA_HLE,
        measuredAt: "2026-08",
        verification: "verified",
      },
      gdpval_aa_v2: {
        value: 1687,
        configuration: "max effort",
        source: AA_GDPVAL_V2,
        measuredAt: "2026-08",
        verification: "verified",
      },
      swe_bench_pro: null,
      terminal_bench_21: null,
      cursorbench_32: {
        value: 60.8,
        configuration: "Cursor エージェント / Max effort",
        source: CURSORBENCH_32,
        measuredAt: "2026-08",
        verification: "verified",
      },
    },
    pricing: {
      value: 0.86,
      configuration: "max effort",
      source: AA_LEADERBOARD,
      measuredAt: "2026-08",
      verification: "verified",
    },
  },
  {
    modelId: "claude-sonnet-5",
    modelName: "Claude Sonnet 5",
    developer: "Anthropic",
    color: "#9C6B53",
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
      hle: {
        value: 39.6,
        configuration: "max effort",
        source: AA_HLE,
        measuredAt: "2026-08",
        verification: "verified",
      },
      gdpval_aa_v2: {
        value: 1600,
        configuration: "max effort",
        source: AA_GDPVAL_V2,
        measuredAt: "2026-08",
        verification: "verified",
      },
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
      cursorbench_32: {
        value: 61.5,
        configuration: "Cursor エージェント / Max effort",
        source: CURSORBENCH_32,
        measuredAt: "2026-08",
        verification: "verified",
      },
    },
    pricing: {
      value: 1.72,
      configuration: "max effort",
      source: AA_LEADERBOARD,
      measuredAt: "2026-08",
      verification: "verified",
    },
  },
  {
    modelId: "gemini-3-6-flash",
    modelName: "Gemini 3.6 Flash",
    developer: "Google",
    color: "#4285F4",
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
      hle: {
        value: 38.3,
        configuration: "—",
        source: AA_HLE,
        measuredAt: "2026-08",
        verification: "verified",
      },
      gdpval_aa_v2: {
        value: 1423,
        configuration: "high effort",
        source: AA_GDPVAL_V2,
        measuredAt: "2026-08",
        verification: "verified",
      },
      swe_bench_pro: null,
      terminal_bench_21: null,
      cursorbench_32: {
        value: 53.5,
        configuration: "Cursor エージェント / High effort（Flash に Max ティアなし）",
        source: CURSORBENCH_32,
        measuredAt: "2026-08",
        verification: "verified",
      },
    },
    pricing: {
      value: 0.56,
      configuration: "—",
      source: AA_LEADERBOARD,
      measuredAt: "2026-08",
      verification: "verified",
    },
  },
  {
    modelId: "deepseek-v4-flash",
    modelName: "DeepSeek V4 Flash",
    developer: "DeepSeek",
    color: "#8CA0FF",
    releaseDate: "2026-07-31",
    releaseDateSource: DEEPSEEK_API_CHANGELOG,
    scores: {
      aa_intelligence_index: {
        value: 50,
        configuration: "Flash 0731 / Reasoning / max effort",
        source: AA_LEADERBOARD,
        measuredAt: "2026-07",
        verification: "verified",
      },
      gpqa_diamond: {
        value: 91,
        configuration: "Flash 0731 / Reasoning / max effort（AA 計測）",
        source: AA_V4_FLASH_0731_ARTICLE,
        measuredAt: "2026-07",
        verification: "verified",
      },
      hle: {
        value: 32.1,
        configuration: "Flash 0731 / max effort",
        source: AA_HLE,
        measuredAt: "2026-08",
        verification: "verified",
      },
      gdpval_aa_v2: {
        value: 1559,
        configuration: "Flash 0731 / Reasoning / max effort",
        source: AA_GDPVAL_V2,
        measuredAt: "2026-08",
        verification: "verified",
      },
      // SWE-bench Pro はベンダー公称値のみでリーダーボード未掲載
      swe_bench_pro: null,
      // Terminal-Bench 公式リーダーボードに DeepSeek エントリなし
      terminal_bench_21: null,
      // CursorBench 3.2 に DeepSeek エントリなし
      cursorbench_32: null,
    },
    pricing: {
      value: 0.03,
      configuration: "Flash 0731 / max effort",
      source: AA_LEADERBOARD,
      measuredAt: "2026-08",
      verification: "verified",
    },
  },
  {
    modelId: "gemini-3-1-pro",
    modelName: "Gemini 3.1 Pro",
    developer: "Google",
    color: "#0B57D0",
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
      hle: {
        value: 44.7,
        configuration: "Preview",
        source: AA_HLE,
        measuredAt: "2026-08",
        verification: "verified",
      },
      // GDPval-AA v2 は AA リーダーボードにエントリなし
      gdpval_aa_v2: null,
      swe_bench_pro: null,
      terminal_bench_21: {
        value: 65.8,
        configuration: "Gemini CLI / high effort（±1.7%）",
        source: TBENCH_21,
        measuredAt: "2026-07",
        verification: "verified",
      },
      // CursorBench 3.2 未掲載
      cursorbench_32: null,
    },
    pricing: {
      value: 0.34,
      configuration: "Preview",
      source: AA_LEADERBOARD,
      measuredAt: "2026-08",
      verification: "verified",
    },
  },
  {
    modelId: "qwen-3-7-max",
    modelName: "Qwen 3.7 Max",
    developer: "Alibaba Cloud",
    color: "#8B5CF6",
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
      hle: {
        value: 38.1,
        configuration: "—",
        source: AA_HLE,
        measuredAt: "2026-08",
        verification: "verified",
      },
      gdpval_aa_v2: {
        value: 1270,
        configuration: "—",
        source: AA_GDPVAL_V2,
        measuredAt: "2026-08",
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
      // CursorBench 3.2 未掲載
      cursorbench_32: null,
    },
    pricing: {
      value: 1.28,
      configuration: "—",
      source: AA_LEADERBOARD,
      measuredAt: "2026-08",
      verification: "verified",
    },
  },
  {
    modelId: "deepseek-v4",
    modelName: "DeepSeek V4 Pro",
    developer: "DeepSeek",
    color: "#4D6BFE",
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
      hle: {
        value: 35.9,
        configuration: "max effort",
        source: AA_HLE,
        measuredAt: "2026-08",
        verification: "verified",
      },
      gdpval_aa_v2: {
        value: 1304,
        configuration: "max effort",
        source: AA_GDPVAL_V2,
        measuredAt: "2026-08",
        verification: "verified",
      },
      swe_bench_pro: null,
      terminal_bench_21: null,
      // CursorBench 3.2 未掲載
      cursorbench_32: null,
    },
    pricing: {
      value: 0.05,
      configuration: "max effort",
      source: AA_LEADERBOARD,
      measuredAt: "2026-08",
      verification: "verified",
    },
  },
];
