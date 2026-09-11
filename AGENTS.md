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
- **MDX**: @next/mdx（コンテンツ管理用）

## 重要なファイル・ディレクトリ

| パス | 用途 |
|------|------|
| `src/app/` | Next.js App Router ページ（`/works` `/engineering` `/research` `/about` など） |
| `src/components/` | React コンポーネント |
| `src/lib/` | 表示データ（`profile` / `works` / `engineering` / `research` / `cases`）。内容はここを編集する |
| `src/content/cases/` | MDX ケーススタディコンテンツ |
| `scripts/` | 運用スクリプト |
| `docker-compose.prod.yaml` | 本番 Docker Compose 構成 |
| `Dockerfile` | アプリ用 Docker イメージ |

## ビルド・テスト・検証

必ず以下のコマンドで検証してください：

```bash
# Lint
bun run lint

# テスト
bun run test -- --run

# ビルド（DB 接続不要）
bun run build
```

## コーディング規約

- TypeScript の `strict` モード有効
- React 19 + React Compiler 有効
- コンポーネントはデフォルトエクスポート（Next.js ページ要件）
- テストファイルは対象ファイルと同じディレクトリに配置（`*.test.ts` / `*.test.tsx`）
- MDX コンポーネントは `mdx-components.tsx` で拡張

## 環境変数

主要な変数は以下です。詳細は `README.md` を参照してください。

```bash
SITE_URL=https://koshikai.dev  # canonical / metadata 用 URL
```

## 開発フロー

1. `bun run dev` でローカル開発
2. `bun run lint` / `bun run test` で検証
3. `bun run build` でビルド確認
4. `main` ブランチへの push で GitHub Actions 経由で自動デプロイ（Proxmox self-hosted runner）

**`main` への push は公開である。** `.github/workflows/deploy.yml` の `paths-ignore` は
`docs/**` と `**.md` だけなので、`src/` 配下を触った push はビルドとデプロイまで自動で進む。
「置いただけ」では止まらない。

## 公開してはいけないもの

このリポジトリは **Public** で、履歴も含めて誰でも読める。次のものはコミットしない。

- インターン・受託・社外の案件に由来するコード、資料、データ、リポジトリ名、URL。
  過去に置いた限定共有ページは機密保持のため削除し、2026-09 に Git 履歴からも消した
- 自宅ネットワークの IP アドレスや機種名（構成図は IP を伏せた版を使う）
- 作品として公開していない private リポジトリの内部実装やデータ

## コンテンツの掲載ルール

- 作品の開始時期・稼働状況・担当範囲は、リポジトリやデプロイ設定で確認できる事実だけを書く
- 実際に使っていない技術は載せない。技術を載せるときは使用例（作品・事例）へのリンクを添える
- トップの Hero 周辺に所属・学会名・受賞・講座名は出さない（About / Research に置く）

## ドキュメント

- `README.md`: プロジェクト概要・クイックスタート
- `docs/deployment.md`: デプロイ構成の詳細
- `docs/architecture.md`: アーキテクチャ概要

## 関連リポジトリ

- **`koshikai/mathkb`**（private）: 数学ナレッジベースの MCP サーバーと DB スキーマ。2026-08 に本リポジトリから分離。数学KB 関連の作業はそちらで行うこと。
