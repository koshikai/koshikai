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
