/**
 * Research のデータ。
 *
 * トップでは Problem / Method / Result だけを見せ、学会名・受賞・講座名は
 * /research と /about の経歴欄に置く（固有名詞を主役にしないため）。
 */

export interface ResearchTopic {
  slug: string;
  title: string;
  context: string;
  problem: string;
  method: string;
  result: string;
  /** Result の中で強調する数値。無ければ出さない */
  metric?: { value: string; label: string };
  status: "completed" | "in-progress";
  tags: string[];
  caseSlug?: string;
  featured: boolean;
}

export const researchTopics: ResearchTopic[] = [
  {
    slug: "bn-edge-removal",
    title: "制約付きネットワーク制御 × 強化学習",
    context: "卒業研究",
    problem:
      "遺伝子ネットワークのモデル（ブーリアンネットワーク）を、休薬期間などの時間的制約を守りながら目標状態へ安定化させたい。",
    method:
      "制約を状態に組み込んで MDP として定式化し、Q 学習で「どの相互作用をいつ遮断するか」の方策を学習した。",
    result:
      "2 つの生物学モデルで、すべての初期状態から目標状態への安定化に成功した。",
    metric: { value: "96/96", label: "初期状態で安定化（Wnt5a）" },
    status: "completed",
    tags: ["Reinforcement Learning", "STL", "Python"],
    caseSlug: "research-workflow",
    featured: true,
  },
  {
    slug: "winter-rail-risk",
    title: "鉄道の冬期運行リスク分析",
    context: "大学院 PBL（4 人チームの技術リーダー）",
    problem:
      "積雪・凍結による分岐器の不転換リスクを定量化し、現場の除雪判断に使える形で示したい。",
    method:
      "データ異常の原因（観測地点の紐付け誤り）を特定して修復し、多重共線性を解消したロジスティック回帰で要因を推定した。",
    result:
      "複合条件でリスクの高い時間帯を絞り込み、現場担当者から除雪班の事前配置基準として活用を検討するとの評価を得た。",
    metric: { value: "43.2×", label: "Lift（複合条件）" },
    status: "completed",
    tags: ["Python", "Logistic Regression", "Data Quality"],
    caseSlug: "jr-hokkaido-pbl",
    featured: true,
  },
  {
    slug: "c2d-transfer",
    title: "粒度の異なるモデル間での制御知識の転移",
    context: "修士研究",
    problem:
      "同じ生物学的機構を粗く／詳しく記述した 2 つのモデルで、粗いモデルで得た制御知識を詳細なモデルに持ち込み、学習をやり直すコストを減らしたい。",
    method:
      "GNN でネットワーク構造と意味情報を埋め込み、ノード対応付けと Action-Prior Transfer による方策の適応を検討している。",
    result:
      "単純な直接転移では失敗することを定量的に確認し、その限界を踏まえた転移手法を検証中。",
    status: "in-progress",
    tags: ["Transfer Learning", "GNN", "PyTorch"],
    featured: false,
  },
];

export const featuredResearch = researchTopics.filter((topic) => topic.featured);

export type PublicationStatus = "presented" | "accepted";

export interface Publication {
  title: string;
  venue: string;
  date: string;
  format: string;
  status: PublicationStatus;
  international: boolean;
  award?: string;
}

/**
 * 発表・採択。status は「採択まで確認済み」なら accepted のままにし、
 * 発表を終えたことを確認してから presented に上げる。
 */
export const publications: Publication[] = [
  {
    title:
      "A Reinforcement Learning Approach to Set Stabilization of Boolean Networks by Edge Removal Control",
    venue: "SICE FES 2026",
    date: "2026.09",
    format: "ポスター発表",
    status: "accepted",
    international: true,
  },
  {
    title:
      "Edge Removal Control of Boolean Networks with STL Specifications Using Reinforcement Learning",
    venue: "ITC-CSCC 2026",
    date: "2026.07",
    format: "口頭発表",
    status: "accepted",
    international: true,
  },
  {
    title: "ブーリアンネットワークのモデルフリーエッジ除去制御",
    venue: "第70回システム制御情報学会研究発表講演会（SCI'26）",
    date: "2026.05",
    format: "口頭発表",
    status: "presented",
    international: false,
    award: "学生発表賞",
  },
];

export interface Course {
  name: string;
  org: string;
  completedAt: string;
}

export const courses: Course[] = [
  { name: "グローバル消費インテリジェンス寄付講座（GCI）", org: "東京大学 松尾研究室", completedAt: "2025.09" },
  { name: "LLM 大規模言語モデル講座 基礎編", org: "東京大学 松尾・岩澤研究室", completedAt: "2025.12" },
  { name: "Deep Learning 基礎講座", org: "東京大学 松尾・岩澤研究室", completedAt: "2026.01" },
];

/** Research 配下の独立コンテンツ */
export const researchNotes = [
  {
    title: "LLM Benchmarks",
    description: "主要 LLM の公表ベンチマークを、出典と測定条件をそろえて比較したスナップショット。",
    href: "/llm-benchmarks",
  },
];

export const researchCode = {
  label: "bn-edge-removal-public",
  href: "https://github.com/koshikai/bn-edge-removal-public",
  description: "卒業研究（エッジ除去制御）の公開コード",
};
