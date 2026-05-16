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
    slug: "nosmoke",
    title: "NoSmoke: 洗練された PWA 支援アプリ",
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
  },
  {
    slug: "deploy-automation",
    title: "デプロイ作業の自動化",
    summary:
      "手動更新で発生していた再現性の課題を、CI/CD と運用手順の整備で改善したケース。",
    tags: ["CI/CD", "GitHub Actions", "Self-hosted Runner"],
    publishedAt: "2026-04-21",
  },
  {
    slug: "research-workflow",
    title: "研究ワークフローの実装",
    summary:
      "検証条件の明確化と記録を徹底し、研究プロセスの再現性を高めたケース。",
    tags: ["Research", "Reproducibility", "Experiment Design"],
    publishedAt: "2026-04-21",
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
