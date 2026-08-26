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
| `src/app/` | Next.js App Router ページ |
| `src/components/` | React コンポーネント |
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

## 限定共有ページ

`src/app/share/hvac-precooling-9d4c7b2e6a13/` は、空調の最適起動分析コードを
限定共有するページ。`robots: noindex, nofollow` を設定し sitemap にも載せていないが、
**認証はない。URL を知れば誰でも見られる。**

| パス | 役割 |
| :--- | :--- |
| `src/content/hvac-code.json` | **手で編集しない。** 別リポジトリから生成される |
| `src/lib/hvac-code.ts` | 上記JSONの読み込みと、結合ソース・展開スクリプトの生成 |
| `src/app/share/hvac-precooling-9d4c7b2e6a13/` | ページ本体とコードビューア |

`hvac-code.json` は `koshikai/panasonic-ew` リポジトリで次を実行すると更新される。

```bash
uv run scripts/export_for_web.py --out <このリポジトリ>/src/content/hvac-code.json
```

### 更新するときの注意

**コードだけ新しくなり、説明文が古いまま残りやすい。** JSON を差し替えたら、
次の3つに書かれたノートブック名・コマンド・分析内容が実態と合っているか必ず確認する。

- `page.tsx` の冒頭説明と「このコードで扱っていること」「動かし方」
- `CodeViewer.tsx` のセットアップ手順
- `hvac-code.ts` の `buildUnpackScript` が出力する案内

過去に、削除済みのノートブックを起動するコマンドが案内に残っていたことがある。

## ドキュメント

- `README.md`: プロジェクト概要・クイックスタート
- `docs/deployment.md`: デプロイ構成の詳細
- `docs/architecture.md`: アーキテクチャ概要

## 関連リポジトリ

- **`koshikai/mathkb`**（private）: 数学ナレッジベースの MCP サーバーと DB スキーマ。2026-08 に本リポジトリから分離。数学KB 関連の作業はそちらで行うこと。
