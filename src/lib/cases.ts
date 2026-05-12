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
    title: "Immich 分散アーキテクチャの構築",
    summary:
      "Proxmox と Windows GPU をネットワーク越しに連携させ、機械学習タスクを効率的に分散処理する写真管理基盤の構築。",
    tags: ["Immich", "Distributed", "GPU Offloading", "Docker", "Proxmox"],
    publishedAt: "2026-04-21",
    challenge:
      "単一の NAS 故障による全データの消失リスクと、家族全員での共有漏れ。",
    action:
      "Proxmox + Docker で Immich を構築。ストレージは ZFS ミラーで冗長化し、バックアップを自動化。",
    result:
      "家族全員がどこからでも写真をアップロード可能になり、データ消失リスクを最小化。",
    learning:
      "計算リソースとストレージを適切に分離し、メンテナンス性を高める構成の重要性。",
  },
  {
    slug: "infrastructure",
    title: "高度な分散インフラ・AI自動化基盤",
    summary:
      "Proxmox VE と GPU オフロードによる分散構成、および AI エージェント用 MCP サーバーの自動同期スクリプト群の開発。",
    tags: ["Proxmox", "LXC", "GPU Pass-through", "IaC", "MCP"],
    publishedAt: "2026-04-21",
  },
  {
    slug: "nosmoke",
    title: "NoSmoke: 洗練された PWA 支援アプリ",
    summary:
      "Next.js 16.2 と Optimistic UI による、ネイティブ級の操作感を持つ禁煙支援 PWA の開発。",
    tags: ["Next.js", "PWA", "Prisma", "Framer Motion", "Recharts"],
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
    title: "KariGallery: 決済・認証統合ギャラリー",
    summary:
      "Auth.js と Stripe API を統合し、ブラウザ画像圧縮や最新の Prisma v7.7 を活用した商用レベルの SaaS 基盤。",
    tags: ["Auth.js", "Stripe", "Prisma v7.7", "Image Processing"],
    publishedAt: "2026-04-21",
    challenge:
      "散らばったイラスト資産を、一箇所で管理しつつ決済や公開まで行いたい。",
    action:
      "Prisma v7 と Auth.js で基盤を刷新。Stripe と連携し、安全な課金フローを実装。",
    result:
      "アセットのアップロードから公開、販売までが一元管理可能になった。",
    learning:
      "サードパーティ API との堅牢な連携と、拡張性を重視した DB スキーマ設計。",
  },
  {
    slug: "shuukatsu",
    title: "就職活動・自己史分析プロジェクト",
    summary:
      "React 19, Tailwind CSS v4, Bun 等の最新スタックを用いた、自己史インポートとエピソード管理ツール。",
    tags: ["React 19", "Tailwind CSS v4", "Bun", "PostgreSQL"],
    publishedAt: "2026-04-21",
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
