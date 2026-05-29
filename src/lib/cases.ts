import type { ComponentType } from "react";

export interface CaseItem {
  slug: string;
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
      "低消費電力なサーバーで快適なセルフホスト環境を実現。運用の自動化率が大幅に向上。",
    learning:
      "リソースの適切な配置と、運用ルールの自動化が継続可能なインフラには不可欠。",
  },
  {
    slug: "smoke-it",
    title: "Smoke it.: 洗練された PWA 支援アプリ",
    summary:
      "Next.js 16.2 + PWA + Optimistic UI によるネイティブ級の禁煙記録アプリ。AI コーチ（OpenRouter）と 3D バッジ（Three.js）で継続を支援。",
    tags: ["Next.js", "PWA", "AI Coach", "Three.js", "Recharts"],
    publishedAt: "2026-04-21",
    challenge:
      "既存の禁煙アプリが複雑すぎたり、オフライン時の挙動が不安定だったりした。",
    action:
      "Next.js と PWA を組み合わせ、オフライン優先の UI を構築。グラフによる可視化を統合。",
    result:
      "自身の禁煙継続に成功し、軽量かつ信頼性の高いツールとしての実用性を証明。",
    learning:
      "ユーザーの心理的な障壁を下げるための、徹底的にスムーズな UI 操作感の追求。",
  },
  {
    slug: "karigallery",
    title: "KariGallery: ダミーデータ検証ギャラリー",
    summary:
      "友人のイラスト販売用に制作したが、現在は偽名によるダミーデータを表示。Stripe 決済は技術検証済み。",
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
      "バックアップ運用が日常に溶け込み、障害時のリスクを排除。「保存されているはず」の曖昧さを解消。",
    learning:
      "システムの信頼性は高度な技術選定だけでなく、手順の明文化と運用のセット設計で担保されること。",
  },
  {
    slug: "deploy-automation",
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
    slug: "research-workflow",
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
      "同一条件での再検証が容易になり、Cortical Development (32/32) や Wnt5a (96/96) での再現性を実証。",
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

export async function getCaseContentComponent(slug: string) {
  const loader = caseMdxModules[slug];
  if (!loader) return null;
  const mdxModule = await loader();
  return mdxModule.default;
}
