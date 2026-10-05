/**
 * LLM ベンチマーク比較データ。
 *
 * 設計方針（2026-10 の出典検証を経て全面改訂）:
 *
 * 1. 掲載するのは「一次情報または明示された第三者リーダーボードに実在する値」のみ。
 *    未公表のセルは null（N/A）とし、推定値・補間値は一切置かない。
 * 2. スコアは値・測定条件（ハーネス / effort）・出典・測定日をセット単位で持つ。
 *    同じ Terminal-Bench 4.0 でも Claude Code(max) と Codex(max) では
 *    ハーネス（エージェント）が違えば数値が変わるため、条件なしの数値は比較に使えない。
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
export const BENCHMARK_DATASET_VERIFIED_AT = "2026-10";

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

const AA_GDPVAL_V21: BenchmarkSource = {
  label: "Artificial Analysis — GDPval-AA v2.1",
  url: "https://artificialanalysis.ai/evaluations/gdpval-aa",
};

const TBENCH_40: BenchmarkSource = {
  label: "Terminal-Bench 4.0 official leaderboard",
  url: "https://www.tbench.ai/leaderboard/terminal-bench/4.0",
};

const SWE_BENCH_PRO_BOARD: BenchmarkSource = {
  label: "SWE-bench Pro leaderboard (MorphLLM 集計 / llm-stats)",
  url: "https://www.morphllm.com/swe-bench-pro",
};

const CURSORBENCH_40: BenchmarkSource = {
  label: "Cursor — CursorBench 4.0",
  url: "https://cursor.com/cursorbench",
};

const LLM_STATS_KIMI: BenchmarkSource = {
  label: "llm-stats.com — Kimi K3",
  url: "https://llm-stats.com/models/compare/kimi-k3-vs-qwen3-max",
};

export const BENCHMARK_METRICS: BenchmarkMetric[] = [
  {
    id: "aa_intelligence_index",
    name: "AA Intelligence Index v4.3.2",
    category: "Composite",
    description:
      "GDPval-AA v2.1 / Terminal-Bench 4.0 / AA-Briefcase v1.1 / AutomationBench-AA / SciCode / HLE / GDP.pdf / CritPt / AA-Omniscience / AA-LCR v1.1 の10評価の複合指数。",
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
    id: "gdpval_aa_v21",
    name: "GDPval-AA v2.1",
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
    id: "terminal_bench_40",
    name: "Terminal-Bench 4.0",
    category: "Agent Operations",
    description: "CLI / OS 操作をエージェントに自律実行させるタスクの完了率。",
    sourcePolicy:
      "Terminal-Bench 公式リーダーボードに掲載されたエントリのみ（未掲載モデルは N/A）",
    unit: "%",
    scaleMax: 100,
  },
  {
    id: "cursorbench_40",
    name: "CursorBench 4.0",
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
    modelId: "claude-opus-5-5",
    modelName: "Claude Opus 5.5",
    developer: "Anthropic",
    color: "#CC785C",
    releaseDate: "2026-09-22",
    releaseDateSource: SWE_BENCH_PRO_BOARD,
    scores: {
      aa_intelligence_index: {
        value: 58,
        configuration: "max effort / with fallback",
        source: AA_LEADERBOARD,
        measuredAt: "2026-10",
        verification: "verified",
      },
      // AA の GPQA Diamond リーダーボードにエントリなし
      gpqa_diamond: null,
      hle: {
        value: 61.4,
        configuration: "max effort / with fallback",
        source: AA_HLE,
        measuredAt: "2026-10",
        verification: "verified",
      },
      gdpval_aa_v21: {
        value: 1867,
        configuration: "max effort / with fallback",
        source: AA_GDPVAL_V21,
        measuredAt: "2026-10",
        verification: "verified",
      },
      swe_bench_pro: {
        value: 89.9,
        configuration: "llm-stats 集計（59モデル・ベンダー自己申告）",
        source: SWE_BENCH_PRO_BOARD,
        measuredAt: "2026-10",
        verification: "verified",
      },
      // 公式 Terminal-Bench リーダーボード未掲載
      terminal_bench_40: null,
      cursorbench_40: {
        value: 57.8,
        configuration: "Cursor エージェント / Max effort",
        source: CURSORBENCH_40,
        measuredAt: "2026-10",
        verification: "verified",
      },
    },
    pricing: {
      value: 5.98,
      configuration: "max effort / with fallback",
      source: AA_LEADERBOARD,
      measuredAt: "2026-10",
      verification: "verified",
    },
  },
  {
    modelId: "claude-fable-5-1",
    modelName: "Claude Fable 5.1",
    developer: "Anthropic",
    color: "#F0B429",
    releaseDate: "2026-09-01",
    releaseDateSource: TBENCH_40,
    scores: {
      aa_intelligence_index: {
        value: 53,
        configuration: "max effort / with fallback",
        source: AA_LEADERBOARD,
        measuredAt: "2026-10",
        verification: "verified",
      },
      gpqa_diamond: {
        value: 93.7,
        configuration: "max effort / with fallback（Artificial Analysis 計測）",
        source: AA_GPQA,
        measuredAt: "2026-10",
        verification: "verified",
      },
      hle: {
        value: 59.1,
        configuration: "max effort / with fallback",
        source: AA_HLE,
        measuredAt: "2026-10",
        verification: "verified",
      },
      gdpval_aa_v21: {
        value: 1758,
        configuration: "max effort / with fallback",
        source: AA_GDPVAL_V21,
        measuredAt: "2026-10",
        verification: "verified",
      },
      // Scale / llm-stats の双方に SWE-bench Pro エントリなし
      swe_bench_pro: null,
      terminal_bench_40: {
        value: 57.9,
        configuration: "Claude Code / max effort（±3.8%）",
        source: TBENCH_40,
        measuredAt: "2026-10",
        verification: "verified",
      },
      cursorbench_40: {
        value: 51.8,
        configuration: "Cursor エージェント / Max effort",
        source: CURSORBENCH_40,
        measuredAt: "2026-10",
        verification: "verified",
      },
    },
    pricing: {
      value: 7.63,
      configuration: "max effort / with fallback",
      source: AA_LEADERBOARD,
      measuredAt: "2026-10",
      verification: "verified",
    },
  },
  {
    modelId: "claude-sonnet-5-5",
    modelName: "Claude Sonnet 5.5",
    developer: "Anthropic",
    color: "#9C6B53",
    releaseDate: null,
    releaseDateSource: null,
    scores: {
      aa_intelligence_index: {
        value: 56,
        configuration: "max effort / with fallback",
        source: AA_LEADERBOARD,
        measuredAt: "2026-10",
        verification: "verified",
      },
      // AA の GPQA Diamond リーダーボードにエントリなし
      gpqa_diamond: null,
      hle: {
        value: 55.0,
        configuration: "max effort / with fallback",
        source: AA_HLE,
        measuredAt: "2026-10",
        verification: "verified",
      },
      gdpval_aa_v21: {
        value: 1840,
        configuration: "max effort / with fallback",
        source: AA_GDPVAL_V21,
        measuredAt: "2026-10",
        verification: "verified",
      },
      swe_bench_pro: null,
      terminal_bench_40: null,
      cursorbench_40: {
        value: 55.5,
        configuration: "Cursor エージェント / Max effort",
        source: CURSORBENCH_40,
        measuredAt: "2026-10",
        verification: "verified",
      },
    },
    pricing: {
      value: 7.67,
      configuration: "max effort / with fallback",
      source: AA_LEADERBOARD,
      measuredAt: "2026-10",
      verification: "verified",
    },
  },
  {
    modelId: "gpt-6-astra",
    modelName: "GPT-6 Astra",
    developer: "OpenAI",
    color: "#10A37F",
    releaseDate: "2026-09-03",
    releaseDateSource: TBENCH_40,
    scores: {
      aa_intelligence_index: {
        value: 53,
        configuration: "max effort",
        source: AA_LEADERBOARD,
        measuredAt: "2026-10",
        verification: "verified",
      },
      gpqa_diamond: {
        value: 96.1,
        configuration: "max effort（Artificial Analysis 計測）",
        source: AA_GPQA,
        measuredAt: "2026-10",
        verification: "verified",
      },
      hle: {
        value: 54.7,
        configuration: "max effort",
        source: AA_HLE,
        measuredAt: "2026-10",
        verification: "verified",
      },
      gdpval_aa_v21: {
        value: 1542,
        configuration: "max effort",
        source: AA_GDPVAL_V21,
        measuredAt: "2026-10",
        verification: "verified",
      },
      // llm-stats は SWE-bench Verified のみ追跡、Pro のスコアは未記入
      swe_bench_pro: null,
      terminal_bench_40: {
        value: 58.2,
        configuration: "Codex / max effort（±2.8%）",
        source: TBENCH_40,
        measuredAt: "2026-10",
        verification: "verified",
      },
      // CursorBench 4.0 未掲載
      cursorbench_40: null,
    },
    pricing: {
      value: 3.26,
      configuration: "max effort",
      source: AA_LEADERBOARD,
      measuredAt: "2026-10",
      verification: "verified",
    },
  },
  {
    modelId: "gpt-6-1-sol",
    modelName: "GPT-6.1 Sol",
    developer: "OpenAI",
    color: "#0B7A5C",
    releaseDate: null,
    releaseDateSource: null,
    scores: {
      aa_intelligence_index: {
        value: 52,
        configuration: "max effort",
        source: AA_LEADERBOARD,
        measuredAt: "2026-10",
        verification: "verified",
      },
      gpqa_diamond: null,
      hle: {
        value: 52.9,
        configuration: "max effort",
        source: AA_HLE,
        measuredAt: "2026-10",
        verification: "verified",
      },
      gdpval_aa_v21: {
        value: 1575,
        configuration: "max effort",
        source: AA_GDPVAL_V21,
        measuredAt: "2026-10",
        verification: "verified",
      },
      swe_bench_pro: null,
      terminal_bench_40: null,
      cursorbench_40: null,
    },
    pricing: {
      value: 0.72,
      configuration: "max effort",
      source: AA_LEADERBOARD,
      measuredAt: "2026-10",
      verification: "verified",
    },
  },
  {
    modelId: "gemini-4-argon",
    modelName: "Gemini 4 Argon",
    developer: "Google",
    color: "#0B57D0",
    releaseDate: null,
    releaseDateSource: null,
    scores: {
      aa_intelligence_index: {
        value: 53,
        configuration: "high effort",
        source: AA_LEADERBOARD,
        measuredAt: "2026-10",
        verification: "verified",
      },
      // AA の GPQA Diamond リーダーボードにエントリなし
      gpqa_diamond: null,
      hle: {
        value: 57.1,
        configuration: "high effort",
        source: AA_HLE,
        measuredAt: "2026-10",
        verification: "verified",
      },
      gdpval_aa_v21: {
        value: 1627,
        configuration: "high effort",
        source: AA_GDPVAL_V21,
        measuredAt: "2026-10",
        verification: "verified",
      },
      swe_bench_pro: null,
      terminal_bench_40: null,
      cursorbench_40: null,
    },
    pricing: {
      value: 1.99,
      configuration: "high effort",
      source: AA_LEADERBOARD,
      measuredAt: "2026-10",
      verification: "verified",
    },
  },
  {
    modelId: "gemini-3-8-flash",
    modelName: "Gemini 3.8 Flash",
    developer: "Google",
    color: "#4285F4",
    releaseDate: "2026-09-02",
    releaseDateSource: TBENCH_40,
    scores: {
      aa_intelligence_index: {
        value: 41,
        configuration: "high effort",
        source: AA_LEADERBOARD,
        measuredAt: "2026-10",
        verification: "verified",
      },
      gpqa_diamond: {
        value: 95.3,
        configuration: "high effort（Artificial Analysis 計測）",
        source: AA_GPQA,
        measuredAt: "2026-10",
        verification: "verified",
      },
      hle: {
        value: 47.8,
        configuration: "high effort",
        source: AA_HLE,
        measuredAt: "2026-10",
        verification: "verified",
      },
      gdpval_aa_v21: {
        value: 1435,
        configuration: "high effort",
        source: AA_GDPVAL_V21,
        measuredAt: "2026-10",
        verification: "verified",
      },
      swe_bench_pro: null,
      terminal_bench_40: {
        value: 19.1,
        configuration: "mini-SWE-agent / high effort（±3.4%）",
        source: TBENCH_40,
        measuredAt: "2026-10",
        verification: "verified",
      },
      cursorbench_40: {
        value: 39.6,
        configuration: "Cursor エージェント / High effort（Flash に Max ティアなし）",
        source: CURSORBENCH_40,
        measuredAt: "2026-10",
        verification: "verified",
      },
    },
    pricing: {
      value: 1.24,
      configuration: "high effort",
      source: AA_LEADERBOARD,
      measuredAt: "2026-10",
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
        value: 44,
        configuration: "max effort",
        source: AA_LEADERBOARD,
        measuredAt: "2026-10",
        verification: "verified",
      },
      gpqa_diamond: {
        value: 93.5,
        configuration: "max effort（Artificial Analysis 計測）",
        source: AA_GPQA,
        measuredAt: "2026-10",
        verification: "verified",
      },
      hle: {
        value: 46.9,
        configuration: "max effort",
        source: AA_HLE,
        measuredAt: "2026-10",
        verification: "verified",
      },
      gdpval_aa_v21: {
        value: 1538,
        configuration: "max effort",
        source: AA_GDPVAL_V21,
        measuredAt: "2026-10",
        verification: "verified",
      },
      // Moonshot は SWE-bench Pro / Verified とも未公表
      swe_bench_pro: null,
      terminal_bench_40: null,
      cursorbench_40: null,
    },
    pricing: {
      value: 2.0,
      configuration: "max effort",
      source: AA_LEADERBOARD,
      measuredAt: "2026-10",
      verification: "verified",
    },
  },
  {
    modelId: "qwen-3-8-max",
    modelName: "Qwen3.8 Max",
    developer: "Alibaba Cloud",
    color: "#8B5CF6",
    releaseDate: null,
    releaseDateSource: null,
    scores: {
      aa_intelligence_index: {
        value: 45,
        configuration: "0902 スナップショット / max effort",
        source: AA_LEADERBOARD,
        measuredAt: "2026-10",
        verification: "verified",
      },
      gpqa_diamond: {
        value: 92.8,
        configuration: "0902 スナップショット / max effort（Artificial Analysis 計測）",
        source: AA_GPQA,
        measuredAt: "2026-10",
        verification: "verified",
      },
      hle: {
        value: 43.1,
        configuration: "0902 スナップショット / max effort",
        source: AA_HLE,
        measuredAt: "2026-10",
        verification: "verified",
      },
      gdpval_aa_v21: {
        value: 1671,
        configuration: "0902 スナップショット / max effort",
        source: AA_GDPVAL_V21,
        measuredAt: "2026-10",
        verification: "verified",
      },
      swe_bench_pro: {
        value: 67.7,
        configuration: "llm-stats 集計（ベンダー自己申告・2.4T 構成）",
        source: SWE_BENCH_PRO_BOARD,
        measuredAt: "2026-10",
        verification: "verified",
      },
      terminal_bench_40: null,
      cursorbench_40: null,
    },
    pricing: {
      value: 5.41,
      configuration: "0902 スナップショット / max effort",
      source: AA_LEADERBOARD,
      measuredAt: "2026-10",
      verification: "verified",
    },
  },
  {
    modelId: "deepseek-v4-1-flash",
    modelName: "DeepSeek V4.1 Flash",
    developer: "DeepSeek",
    color: "#8CA0FF",
    releaseDate: null,
    releaseDateSource: null,
    scores: {
      aa_intelligence_index: {
        value: 39,
        configuration: "max effort",
        source: AA_LEADERBOARD,
        measuredAt: "2026-10",
        verification: "verified",
      },
      // AA の GPQA Diamond リーダーボードにエントリなし
      gpqa_diamond: null,
      hle: {
        value: 39.2,
        configuration: "max effort",
        source: AA_HLE,
        measuredAt: "2026-10",
        verification: "verified",
      },
      gdpval_aa_v21: {
        value: 1600,
        configuration: "max effort",
        source: AA_GDPVAL_V21,
        measuredAt: "2026-10",
        verification: "verified",
      },
      // V4.1 Flash の SWE-bench Pro は未公表（集計にあるのは V4 Flash 0731）
      swe_bench_pro: null,
      terminal_bench_40: null,
      cursorbench_40: null,
    },
    pricing: {
      value: 0.27,
      configuration: "max effort",
      source: AA_LEADERBOARD,
      measuredAt: "2026-10",
      verification: "verified",
    },
  },
  {
    modelId: "deepseek-v4-pro",
    modelName: "DeepSeek V4 Pro",
    developer: "DeepSeek",
    color: "#4D6BFE",
    releaseDate: null,
    releaseDateSource: null,
    scores: {
      aa_intelligence_index: {
        value: 36,
        configuration: "0813 / max effort",
        source: AA_LEADERBOARD,
        measuredAt: "2026-10",
        verification: "verified",
      },
      // AA の GPQA Diamond リーダーボードにエントリなし
      gpqa_diamond: null,
      hle: {
        value: 41.0,
        configuration: "0813 / max effort",
        source: AA_HLE,
        measuredAt: "2026-10",
        verification: "verified",
      },
      gdpval_aa_v21: {
        value: 1455,
        configuration: "0813 / max effort",
        source: AA_GDPVAL_V21,
        measuredAt: "2026-10",
        verification: "verified",
      },
      swe_bench_pro: null,
      terminal_bench_40: null,
      cursorbench_40: null,
    },
    pricing: {
      value: 0.67,
      configuration: "0813 / max effort",
      source: AA_LEADERBOARD,
      measuredAt: "2026-10",
      verification: "verified",
    },
  },
];
