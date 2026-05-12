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
