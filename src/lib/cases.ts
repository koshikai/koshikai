import type { ComponentType } from "react";

export type Axis = "build" | "operate" | "research";

export interface CaseItem {
  slug: string;
  /** どの軸の事例か。Works / Engineering / Research の各ページがこれで絞り込む */
  axis: Axis;
  title: string;
  summary: string;
  tags: string[];
  publishedAt: string;
  challenge?: string;
  action?: string;
  result?: string;
  learning?: string;
}

export const caseItems: CaseItem[] = [
  {
    slug: "immich-distributed",
    axis: "operate",
    title: "分散インフラ基盤の構築と運用",
    summary:
      "自宅サーバー上で Proxmox と LXC により 10 以上のサービスを統合運用。GPU オフロードによる Immich 分散処理と IaC 自動化で、低コストなインフラを実現。",
    tags: ["Proxmox", "Immich", "GPU Offloading", "MCP", "IaC"],
    publishedAt: "2026-04-21",
    challenge:
      "単一ノードでは処理しきれない機械学習タスクと、増え続けるサービスの運用コスト。",
    action:
      "Proxmox + LXC でサービスを統合し、Windows GPU へ ML 処理をオフロード。IaC と MCP で運用を自動化。",
    result:
      "機械学習処理を GPU 側へ逃がしたことで、数日かかっていた初期スキャンが数時間に短縮。常時稼働の省電力サーバーと処理性能を両立。",
    learning:
      "リソースの適切な配置と、運用ルールの自動化が継続可能なインフラには不可欠。",
  },
  {
    slug: "smoke-it",
    axis: "build",
    title: "Smoke it.: 喫煙習慣を記録し、改善を支援する AI コーチ付き PWA",
    summary:
      "ワンタップ記録・傾向の可視化・記録データを踏まえた AI コーチで、喫煙習慣を客観的に振り返り、改善を考えられるようにした PWA。",
    tags: ["Next.js", "PWA", "AI Coach", "PostgreSQL", "Web Push"],
    publishedAt: "2026-04-21",
    challenge:
      "既存アプリは登録が面倒で続かず、見た目が医療的すぎ、自分のデータも手元に残らなかった。",
    action:
      "オフラインでも記録できる PWA とワンタップ記録（Optimistic UI）を実装し、傾向の可視化と、直近の記録を文脈に渡す AI コーチを組み込んだ。",
    result:
      "記録の手間を最小化し、タイムラインとグラフで自分のパターンを把握できるようになった。記録だけでなく相談できる相手がいる形にした。",
    learning:
      "AI 連携では、どのデータをどの粒度で渡すかが回答の質を左右する。全履歴ではなく直近 4 週間の集計に絞った。",
  },
  {
    slug: "karigallery",
    axis: "build",
    title: "KariGallery: 決済フローまで実装したイラストギャラリー",
    summary:
      "友人のイラストを管理・公開するギャラリー。Stripe Checkout の決済フローまで実装・検証し、法的手続きの負荷を踏まえて本番決済は行わない判断をした。",
    tags: ["Auth.js", "Stripe", "Prisma v7.7", "Image Processing"],
    publishedAt: "2026-04-21",
    challenge:
      "友人のイラストを一箇所で管理・公開したい。加えて決済機能の技術検証も行いたい。",
    action:
      "Prisma v7 と Auth.js で基盤を構築。Stripe と連携し決済フローを実装し、Sandbox 環境で動作確認。",
    result:
      "技術的には販売可能な状態だが、法的手続きの負荷を考慮し本番決済は停止。現在は偽名のダミーデータで運用中。",
    learning:
      "個人開発では技術面だけでなく、法律・運用の準備コストも判断材料に含める必要があること。",
  },
  {
    slug: "home-backup",
    axis: "operate",
    title: "自宅バックアップ基盤の構築",
    summary:
      "スマホ故障をきっかけに、写真と動画を守るための自宅バックアップ運用を設計・継続したケース。",
    tags: ["Home Server", "Backup", "Proxmox"],
    publishedAt: "2026-04-21",
    challenge:
      "スマホの突発的な故障によるデータ喪失リスクと、クラウド依存コストの上昇、復旧手順の未整理。",
    action:
      "Proxmox 上に自動バックアップを再設計し、定期的な世代バックアップ保持と復旧手順のドキュメント化を実施。",
    result:
      "バックアップが日常の運用に組み込まれ、障害時の対処手順が明確になった。「保存されているはず」という曖昧さを減らせた。",
    learning:
      "システムの信頼性は高度な技術選定だけでなく、手順の明文化と運用のセット設計で担保されること。",
  },
  {
    slug: "deploy-automation",
    axis: "operate",
    title: "デプロイ作業の自動化",
    summary:
      "手動更新で発生していた再現性の課題を、CI/CD と運用手順の整備で改善したケース。",
    tags: ["CI/CD", "GitHub Actions", "Self-hosted Runner"],
    publishedAt: "2026-04-21",
    challenge:
      "手動作業の多さによるミスのリスク、手順の属人化、および反映状態の履歴追跡が困難なこと。",
    action:
      "GitHub Actions と self-hosted runner を用いた自動デプロイフローの整備と、検証環境の固定化。",
    result:
      "反復コストの大幅削減と反映手順の再現性の向上。トラブル時の確認ポイントが明確になり復旧が容易に。",
    learning:
      "自動化の本質的な価値は、作業の高速化だけでなく「判断と処理の一貫性」を作り出せることにある。",
  },
  {
    slug: "jr-hokkaido-pbl",
    axis: "research",
    title: "JR北海道 冬期運行リスクのデータ分析",
    summary:
      "大学院PBLとして、JR北海道の冬期ポイント不転換リスクをデータで定量化。データ品質の修復から多重共線性の解消まで、現場活用を前提とした統計分析を実施し、JR社員から実際の業務計画への活用を検討するフィードバックを得た。",
    tags: ["Python", "Logistic Regression", "Data Analysis", "PBL"],
    publishedAt: "2026-06-23",
    challenge:
      "初期データで追分駅の気温が全件 0.0℃ という異常を発見。さらにモデル構築後に多重共線性（VIF > 2500）と深夜帯の Exposure Bias が重なり、推定値が実態とかけ離れた。",
    action:
      "アメダス観測地点の誤りを特定してデータを修復。変数変換で VIF を 1.3 以下に改善し、運行時間帯に絞って再推定。JR社員への発表では統計用語を平易な表現に変換した。",
    result:
      "複合条件で Precision 30.3%・Lift 43.2 倍を達成。JR北海道社員から「除雪班の事前配置基準として活用を検討する」という具体的なフィードバックを得た。",
    learning:
      "データ異常の原因を放置せず特定する姿勢と、分析結果を現場の言語に翻訳する力が、技術を実際に使われるものにする鍵だと学んだ。",
  },
  {
    slug: "research-workflow",
    axis: "research",
    title: "研究ワークフローの実装",
    summary:
      "検証条件の明確化と記録を徹底し、研究プロセスの再現性を高めたケース。",
    tags: ["Research", "Reproducibility", "Experiment Design"],
    publishedAt: "2026-04-21",
    challenge:
      "曖昧な実験条件による結果比較の困難さ、履歴管理不足による再検証の遅れ、検証品質のばらつき。",
    action:
      "探索速度よりも再現性を優先し、条件固定と記録ルールを先に整備。知識基盤と連携した再現実験環境の構築。",
    result:
      "実験の実行から図・論文のビルドまでを CLI で再実行できるようにし、再検証の時間を約 80% 削減。提案手法の結果（32/32・96/96）を同じ条件で再現できる状態にした。",
    learning:
      "再現性の高い研究ワークフローは、結論の信頼性を高めるだけでなく、結果的に次のアプローチへの改善速度を高めること。",
  },
];

const caseMdxModules: Record<string, () => Promise<{ default: ComponentType }>> =
  Object.fromEntries(
    caseItems.map((item) => [
      item.slug,
      () => import(`@/content/cases/${item.slug}.mdx`),
    ]),
  );

export function getCaseBySlug(slug: string) {
  return caseItems.find((item) => item.slug === slug);
}

export function getCasesByAxis(axis: Axis) {
  return caseItems.filter((item) => item.axis === axis);
}

/** 軸ごとの表示名と、その軸を扱うトップレベルページ */
export const AXES: Record<Axis, { label: string; section: string; href: string }> = {
  build: { label: "Build", section: "Works", href: "/works" },
  operate: { label: "Operate", section: "Engineering", href: "/engineering" },
  research: { label: "Research", section: "Research", href: "/research" },
};

export async function getCaseContentComponent(slug: string) {
  const loader = caseMdxModules[slug];
  if (!loader) return null;
  const mdxModule = await loader();
  return mdxModule.default;
}
