# 越海 斗 (KOSHI Kaito)

こんにちは 👋 ウェブアプリと深層学習が好きな大学生です。  
ポートフォリオ: **[koshikai.dev](https://koshikai.dev)**

自宅サーバー（Proxmox）の運用を楽しみながら、生活や運用の課題を発見して実装し、改善するのが好きです。

## 🚀 作っているもの

| プロジェクト | 説明 | 状態 |
|---|---|---|
| [koshikai.dev](https://koshikai.dev) | ポートフォリオサイト（このリポジトリ） | 公開中 |
| **Smoke it.** | 喫煙記録 PWA。AI コーチ・週間レポート・バッジ・Web Push 付き | 🔒 非公開 |
| **KariGallery** | アート作品の管理・閲覧アプリ（モダンプレミアムな UI） | 🔒 非公開 |
| **mathkb** | 数学ナレッジベースの MCP サーバー（pgvector によるセマンティック検索対応） | 🔒 非公開 |
| **sunny-room** | PLATEAU 3D 都市モデルを使った日照シミュレーション Web アプリ | 🔒 非公開 |
| [bn-edge-removal-public](https://github.com/koshikai/bn-edge-removal-public) | BatchNorm の構造削除に関する研究 | 公開 |

## 🛠️ スキル

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-f9f9f9?style=flat-square&logo=bun&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Proxmox](https://img.shields.io/badge/Proxmox-E57000?style=flat-square&logo=proxmox&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white)

## 🔬 研究

深層学習の構造学習・モデル解釈を研究中。研究関連のリポジトリは [research-template](https://github.com/koshikai/research-template) からたどれます。

## 📫 連絡先

- ポートフォリオ: <https://koshikai.dev>
- GitHub: [@koshikai](https://github.com/koshikai)

---

<!-- 以下はこのリポジトリのドキュメント -->

# koshikai.dev

Next.js で構築した公開ポートフォリオサイトです。数学ナレッジベースと MCP サーバーは [`koshikai/mathkb`](https://github.com/koshikai/mathkb)（private）に分離しています。

## 構成

- `src/app/`: App Router ページ、メタデータ、ヘルスチェック
- `src/components/`: ポートフォリオ UI
- `src/content/cases/`: MDX ケーススタディ
- `src/lib/`: サイト設定（`site-config.ts`）、ケース読み込み（`cases.ts`）、ベンチマークデータ
- `src/test/setup.ts`: Vitest の共通セットアップ
- `docs/`: 詳細ドキュメント
- `scripts/`: サーバー準備スクリプト
- `public/images/`: 図版とスクリーンショット
- `docker-compose.prod.yaml`: 本番デプロイ構成

主な route は `/`、`/cases`、`/cases/[slug]`、`/llm-benchmarks`、`/healthz` です。詳細は [`docs/architecture.md`](./docs/architecture.md) を参照してください。

## ローカル開発

前提: Bun 1.0 以上。

```bash
bun install
cp .env.example .env.local
bun run dev
```

ポートフォリオはデータベース接続なしで起動・ビルドできます。`SITE_URL` を省略した場合、canonical URL には `https://koshikai.dev` が使われます。

## 環境変数

| 変数 | 必須 | 既定値 | 用途 |
|---|---:|---|---|
| `SITE_URL` | いいえ | `https://koshikai.dev` | metadata、canonical、sitemap のベース URL |

## デプロイ

`main` への push で GitHub Actions が lint、test、Docker image build、GHCR への push、Proxmox 上の self-hosted runner でのデプロイを実行します。Markdown と `docs/**` だけの変更では workflow は起動しません。

詳細は [`docs/deployment.md`](./docs/deployment.md)、全体構成は [`docs/architecture.md`](./docs/architecture.md) を参照してください。

## 検証

```bash
bun run lint
bun run test -- --run
bun run build
bun audit
```
