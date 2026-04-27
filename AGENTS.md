# Agent Guidelines

このファイルは、このリポジトリで作業する AI エージェント向けのガイドラインです。

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **ランタイム**: Bun >= 1.0.0（ローカル開発）
- **Node.js**: 22（Docker ビルド時）
- **スタイリング**: Tailwind CSS v4
- **テスト**: Vitest + @testing-library/react + happy-dom
- **Lint**: ESLint (eslint-config-next)
- **バリデーション**: Zod v4
- **MDX**: @next/mdx（コンテンツ管理用）

## 重要なファイル・ディレクトリ

| パス | 用途 |
|------|------|
| `src/app/` | Next.js App Router ページ |
| `src/components/` | React コンポーネント |
| `src/lib/` | ユーティリティ・サービス層 |
| `src/mcp/server.ts` | MCP サーバー実装 |
| `src/content/cases/` | MDX ケーススタディコンテンツ |
| `db/` | PostgreSQL スキーマ・初期データ |
| `scripts/` | 運用スクリプト |
| `docker-compose.*.yaml` | Docker Compose 構成 |
| `Dockerfile` | アプリ用 Docker イメージ |
| `Dockerfile.mcp` | MCP サーバー用 Docker イメージ |

## ビルド・テスト・検証

必ず以下のコマンドで検証してください：

```bash
# Lint
bun run lint

# テスト
bun run test

# ビルド（公開ポートフォリオは DB 接続不要）
bun run build
```

`SITE_VARIANT=mathkb` でのビルド時は DB 接続が必要になります。未設定時はセットアップ案内を表示します。

## コーディング規約

- TypeScript の `strict` モード有効
- React 19 + React Compiler 有効
- コンポーネントはデフォルトエクスポート（Next.js ページ要件）
- テストファイルは対象ファイルと同じディレクトリに配置（`*.test.ts` / `*.test.tsx`）
- MDX コンポーネントは `mdx-components.tsx` で拡張

## App Modes

`SITE_VARIANT` 環境変数で動作モードを切り替えます：

- `portfolio`（デフォルト）: 公開ポートフォリオ
- `mathkb`: 内部限定の数学 KB UI

## 環境変数

主要な変数は以下です。詳細は `.env.mathkb.example` または `README.md` を参照してください。

```bash
SITE_VARIANT=portfolio | mathkb
SITE_URL=variant ごとの canonical / metadata 用 URL
MATHKB_DATABASE_URL=postgresql://user:password@host:5432/mathkb
MATHKB_APP_DATABASE_URL=postgresql://user:password@host:5432/mathkb
MCP_DATABASE_URL=postgresql://user:password@host:5432/mathkb
MATHKB_DATABASE_SSL=disable (default) | require
MATHKB_POOL_MAX=10 (default)
MCP_BIND_HOST=0.0.0.0
MCP_PORT=3004
MCP_PATH=/mcp
MCP_ALLOWED_HOSTS=comma-separated optional host allowlist
```

## 開発フロー

1. `bun run dev` でローカル開発（portfolio モード）
2. `bun run lint` / `bun run test` で検証
3. `bun run build` でビルド確認
4. `main` ブランチへの push で GitHub Actions 経由で自動デプロイ

## ドキュメント

- `README.md`: プロジェクト概要・クイックスタート
- `docs/deployment.md`: デプロイ構成の詳細
- `docs/architecture.md`: アーキテクチャ概要
