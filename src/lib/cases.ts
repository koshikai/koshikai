import type { ComponentType } from "react";

export interface CaseItem {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  publishedAt: string;
}

export const caseItems: CaseItem[] = [
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
  },
  {
    slug: "karigallery",
    title: "KariGallery: 決済・認証統合ギャラリー",
    summary:
      "Auth.js と Stripe API を統合し、ブラウザ画像圧縮や最新の Prisma v7.7 を活用した商用レベルの SaaS 基盤。",
    tags: ["Auth.js", "Stripe", "Prisma v7.7", "Image Processing"],
    publishedAt: "2026-04-21",
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

const caseMdxModules: Record<
  string,
  () => Promise<{ default: ComponentType }>
> = {
  infrastructure: () => import("@/content/cases/infrastructure.mdx"),
  nosmoke: () => import("@/content/cases/nosmoke.mdx"),
  karigallery: () => import("@/content/cases/karigallery.mdx"),
  shuukatsu: () => import("@/content/cases/shuukatsu.mdx"),
  "home-backup": () => import("@/content/cases/home-backup.mdx"),
  "deploy-automation": () => import("@/content/cases/deploy-automation.mdx"),
  "research-workflow": () => import("@/content/cases/research-workflow.mdx"),
};

export function getCaseBySlug(slug: string) {
  return caseItems.find((item) => item.slug === slug);
}

export async function getCaseContentComponent(slug: string) {
  const loader = caseMdxModules[slug];
  if (!loader) return null;
  const module = await loader();
  return module.default;
}
