/**
 * Engineering（build をどう支え、どう operate しているか）のデータ。
 *
 * 掲載ルール: 実際に使った技術だけを載せる。各行の evidence は、
 * そのツールを使った作品・事例・このサイト自体へのリンクで裏付ける。
 * 監視基盤（observability）は現時点では載せない。
 */

export interface Evidence {
  label: string;
  href: string;
}

export interface Capability {
  area: string;
  tools: string[];
  evidence: Evidence[];
}

const SMOKE_IT: Evidence = { label: "Smoke it.", href: "/cases/smoke-it" };
const KARIGALLERY: Evidence = { label: "KariGallery", href: "/cases/karigallery" };
const MATHKB: Evidence = { label: "mathkb", href: "/works#mathkb" };
const THIS_SITE: Evidence = { label: "このサイト", href: "/engineering#pipeline" };
const HOMELAB: Evidence = { label: "分散インフラ基盤", href: "/cases/immich-distributed" };
const DEPLOY: Evidence = { label: "デプロイ自動化", href: "/cases/deploy-automation" };

export const capabilities: Capability[] = [
  {
    area: "Frontend",
    tools: ["TypeScript", "React", "Next.js", "PWA"],
    evidence: [SMOKE_IT, KARIGALLERY, THIS_SITE],
  },
  {
    area: "Backend",
    tools: ["Node.js", "Python", "FastAPI", "Auth.js"],
    evidence: [MATHKB, SMOKE_IT],
  },
  {
    area: "Database",
    tools: ["PostgreSQL", "Prisma", "pgvector"],
    evidence: [SMOKE_IT, KARIGALLERY, MATHKB],
  },
  {
    area: "Infrastructure",
    tools: ["Linux", "Docker", "Proxmox", "Nginx", "self-hosting"],
    evidence: [HOMELAB, THIS_SITE],
  },
  {
    area: "CI/CD",
    tools: ["Git", "GitHub Actions", "GHCR", "self-hosted runner"],
    evidence: [DEPLOY, THIS_SITE],
  },
  {
    area: "AI",
    tools: ["LLM", "RAG", "MCP", "pgvector"],
    evidence: [MATHKB, SMOKE_IT],
  },
];

/** 「作るだけでなく、自分で動かす」を支える運用上の事実 */
export const operationFacts = [
  {
    title: "自分のプロダクトは自分の基盤で動かす",
    body: "このサイト・Smoke it.・KariGallery・mathkb は、GitHub Actions でビルドしたイメージを自宅サーバー上の self-hosted runner が Docker Compose でデプロイしています。",
  },
  {
    title: "Proxmox で 10 以上のサービスを運用",
    body: "Proxmox VE と LXC の上で、リバースプロキシ（Nginx Proxy Manager）・DNS フィルタ・写真管理などを一貫した手順で管理しています。",
  },
  {
    title: "資源が足りなければ構成で解く",
    body: "写真管理の機械学習処理だけを GPU のある別マシンへオフロードし、常時稼働の省電力サーバーと処理性能を両立しました。",
  },
  {
    title: "壊れたときに戻せるようにする",
    body: "写真・動画の定期バックアップと保持方針を決め、復旧手順を文書にしています。",
  },
];

/**
 * 自宅基盤の構成を層ごとに要約したもの。IP アドレス・機種名・監視系は載せない。
 * 元になった詳細図は /cases/immich-distributed にある。
 */
export const homelabLayers = [
  { layer: "公開経路", items: ["Cloudflare Tunnel"] },
  { layer: "プロキシ / DNS", items: ["Nginx Proxy Manager", "AdGuard Home"] },
  { layer: "アプリ", items: ["koshikai.dev", "Smoke it.", "KariGallery", "mathkb"] },
  { layer: "データ", items: ["PostgreSQL", "Immich（写真・動画）"] },
  { layer: "オフロード", items: ["機械学習処理 → GPU マシン"] },
  { layer: "基盤", items: ["Proxmox VE", "LXC", "Docker"] },
];

/** このサイトのデプロイ経路。.github/workflows/deploy.yml と一致させる */
export const pipelineSteps = [
  { label: "git push", detail: "main" },
  { label: "GitHub Actions", detail: "lint · test · audit" },
  { label: "Docker build", detail: "multi-stage" },
  { label: "GHCR", detail: "image registry" },
  { label: "self-hosted runner", detail: "自宅 Proxmox" },
  { label: "Docker Compose", detail: "pull · up -d" },
  { label: "/healthz", detail: "healthcheck" },
];
