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
  status: "completed" | "in-progress" | "paused";
  tags: string[];
  caseSlug?: string;
  featured: boolean;
}

export const researchCode = {
  label: "bn-edge-removal-public",
  href: "https://github.com/koshikai/bn-edge-removal-public",
  description: "卒業研究（エッジ除去制御）の公開コード",
};

export const researchTopics: ResearchTopic[] = [
  {
    slug: "bn-edge-removal",
    title: "強化学習 × 遺伝子ネットワーク制御",
    context: "卒業研究",
    problem:
      "遺伝子ネットワークの離散モデル（ブーリアンネットワーク）で、休薬期間のような時間制約を守りながら、系を目標の状態集合へ導きたい。",
    method:
      "信号時相論理（STL）で制約を書き、その進行状況をフラグとして状態に持たせてマルコフ決定過程（MDP）にする。表形式の Q 学習で、各時刻にどのエッジを遮断するかを学ぶ。",
    result:
      "Wnt5a 経路モデルでは、休薬 2 ステップの制約下で全 128 初期状態（128/128）が目標集合に到達し、到達後も維持した。皮質形成モデルでも 32 状態すべて（32/32）で到達と維持を確認した。いずれも発表時の設定で、Wnt5a は seed 11 の 1 run。",
    metric: { value: "128/128", label: "Wnt5a・休薬 2 ステップ制約下の全 128 状態" },
    status: "completed",
    tags: ["Reinforcement Learning", "Boolean Network", "STL"],
    caseSlug: "research-workflow",
    featured: true,
  },
  {
    slug: "winter-rail-risk",
    title: "データ分析 × 鉄道の冬期リスク",
    context: "大学院 PBL（4 人チームの技術リーダー）",
    problem:
      "積雪・凍結による分岐器の不転換リスクを定量化し、現場の除雪判断に使える形で示したい。",
    method:
      "気温が全件 0.0℃ になっていた原因（アメダスの観測地点の紐付け誤り）を特定してデータを直し、変数変換で多重共線性を抑えたロジスティック回帰で要因を推定した。",
    result:
      "6 時間累積降水 5mm 以上かつ気温 -8℃ 以下の条件で、Precision 32.0%、Lift 19.9 倍（全体の発生率 1.59% に対する比）だった。該当は 261 時間で、再現率は 2.6% にとどまる。JR 北海道の社員から、除雪班の事前配置基準として活用を検討したいとのフィードバックを得た。",
    metric: { value: "19.9×", label: "Lift（6 時間降水 5mm 以上・-8℃ 以下）" },
    status: "completed",
    tags: ["Python", "Logistic Regression", "Data Quality"],
    caseSlug: "jr-hokkaido-pbl",
    featured: false,
  },
  {
    slug: "input-spec-price",
    title: "時間制約 × 到達可能性",
    context: "学部ラインの続き",
    problem:
      "休薬期間や除去本数の上限のような時間的な入力仕様を課すと、到達できる初期状態と最小の除去回数がどれだけ変わるかを知りたい。",
    method:
      "学習を使わず、状態空間をすべて列挙して最短の除去列を厳密に数える。計算が終わる規模を少しずつ上げながら、条件ごとの差を集計している。",
    result:
      "条件を足すほど到達できる初期状態は減り、必要な除去回数も変わる。いまは条件ごとの集計表を作っている段階で、数値はまだ出していない。",
    status: "in-progress",
    tags: ["Boolean Network", "Exhaustive Search", "Python"],
    featured: false,
  },
  {
    slug: "c2d-transfer",
    title: "強化学習 × モデル間の知識転移",
    context: "修士研究",
    problem:
      "同じ生物学的機構を粗く／詳しく記述した 2 つのモデルで、粗いモデルで得た制御知識を詳細なモデルに持ち込み、学習をやり直すコストを減らしたい。",
    method:
      "粗いモデルの方策をそのまま移す方法を評価し、次にノードの対応付けを明示して候補を絞る方法と、グラフニューラルネットワーク（GNN）で方策を蒸留する方法を試した。",
    result:
      "方策をそのまま移す方法は、粗から細・細から粗のどちらでも成立しなかった。ノードの対応付けを明示すると到達成功率が上がり、グラフニューラルネットワークによる蒸留でさらに上がった。ただし到達後の維持は弱く、別のモデルへの一般化は示せていない。この線はいま保留している（2026-10-26 に判断、11-07 に継続を確認、再開条件は未定）。関連して、エッジ除去制御の転移で集約と照合項の寄与を分ける確認的評価を行い、交互作用は検出できなかった（2026-11-12 に完了・凍結）。",
    status: "paused",
    tags: ["Transfer Learning", "GNN", "PyTorch"],
    caseSlug: "transfer-line",
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
    status: "presented",
    international: true,
  },
  {
    title:
      "Edge Removal Control of Boolean Networks with STL Specifications Using Reinforcement Learning",
    venue: "ITC-CSCC 2026",
    date: "2026.07",
    format: "口頭発表",
    status: "presented",
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
