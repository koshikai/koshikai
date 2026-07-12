# Agent Guidelines

このファイルは、このリポジトリで作業する AI エージェント向けのガイドラインです。

## 技術スタック

- Next.js 16（App Router）、React 19、React Compiler
- TypeScript（strict）
- Bun 1.0 以上（ローカル、MCP、依存管理）
- Node.js 22（Web アプリの Docker build / runtime）
- Tailwind CSS v4
- Vitest、Testing Library、happy-dom
- ESLint 9、eslint-config-next
- Zod v4
- MDX（ケーススタディ）
- PostgreSQL、pgvector（MathKB MCP）

## 現行プロダクト構成

- Web アプリは公開ポートフォリオ専用です。
- Web variant 切り替えはありません。復活を前提にした分岐を追加しないでください。
- MathKB は PostgreSQL データ層と独立 MCP サーバーとして残っています。

## 重要なパス

| パス | 用途 |
|---|---|
| `src/app/` | ポートフォリオの App Router ページ |
| `src/components/` | React コンポーネント |
| `src/content/cases/` | MDX ケーススタディ |
| `src/lib/site-config.ts` | サイト metadata 設定 |
| `src/mcp/server.ts` | MathKB MCP サーバー |
| `src/lib/mathkb/` | DB、リポジトリ、embedding |
| `db/` | PostgreSQL schema、role、seed |
| `scripts/` | 運用スクリプト |
| `Dockerfile` | ポートフォリオ image |
| `Dockerfile.mcp` | MCP image |

## 必須検証

```bash
bun run lint
bun run test -- --run
bun run build
```

依存関係を変更した場合は `bun audit` も実行してください。ポートフォリオ build に DB 接続は不要です。

## コーディング規約

- TypeScript strict mode を維持する
- Next.js の page / layout は default export を使う
- テストは対象と同じディレクトリに `*.test.ts` / `*.test.tsx` で配置する
- MDX component の拡張は `mdx-components.tsx` で行う
- ユーザー向け秘密情報や実接続情報を commit しない
- 既存の未コミット変更を上書きしない

## 主要な環境変数

- Web: `SITE_URL`
- DB: `MATHKB_DATABASE_URL`（`DATABASE_URL` fallback）、`MATHKB_DATABASE_SSL`、`MATHKB_POOL_MAX`
- Embedding: `MATHKB_ENABLE_EMBEDDINGS`
- MCP: `MCP_BIND_HOST`、`MCP_PORT`、`MCP_PATH`、`MCP_ALLOWED_HOSTS`、`MCP_TRANSPORT`
- Compose 内部接続: `MCP_DATABASE_URL`

詳細は `.env.example`、`README.md`、`docs/mcp.md` を参照してください。

## 開発フロー

1. `bun run dev` でポートフォリオを開発
2. lint、test、build を実行
3. 必要に応じて MCP を HTTP または stdio で検証
4. `main` への push で GitHub Actions が自動デプロイ

## ドキュメント

- `README.md`: 概要とクイックスタート
- `docs/architecture.md`: 現行アーキテクチャ
- `docs/deployment.md`: CI/CD と Docker 運用
- `docs/mcp.md`: MCP と DB の仕様
- `docs/ci-optimization-plan.md`: CI 最適化の履歴と残課題
