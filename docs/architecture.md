# Architecture

このドキュメントでは、koshikai.dev のシステムアーキテクチャについて説明します。

## 全体構成

```text
┌─────────────────────────────────────────────────────────────┐
│                         GitHub                               │
│  ┌─────────────────┐        ┌──────────────────────────┐   │
│  │   Source Code   │───────▶│   GitHub Actions         │   │
│  │   (main branch) │        │   - Build Docker image   │   │
│  └─────────────────┘        │   - Push to GHCR         │   │
│                             └───────────┬──────────────┘   │
└─────────────────────────────────────────┼───────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      Proxmox Host                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Self-hosted GitHub Actions Runner            │  │
│  └──────────────────────────┬───────────────────────────┘  │
│                             │                              │
│  ┌──────────────────────────▼───────────────────────────┐  │
│  │              Docker Engine + Compose                  │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                  koshikai-app                    │  │  │
│  │  │                    (public)                      │  │  │
│  │  │                     :3002                        │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## アプリ構成

- 公開ポートフォリオサイト
- MDX ベースのコンテンツ表示（ケーススタディ）
- DB 接続不要（ビルド・実行時とも）

## ルーティング

| パス | 内容 |
|------|------|
| `/` | ポートフォリオトップ |
| `/cases` | ケーススタディ一覧 |
| `/cases/[slug]` | ケーススタディ詳細（MDX） |
| `/healthz` | ヘルスチェック |
| `/manifest.webmanifest` | Web App Manifest |

## コンポーネント構成

- `PortfolioHome`: トップページ
- `ProjectCard`: プロジェクトカード
- `ResearchSection`: 研究・開発セクション
- `ThemeToggle`: ダークモード手動切り替え（Cookie 永続化）

## ビルド・出力

### 開発時

```bash
bun run dev        # Next.js dev server (Turbopack)
bun run test       # Vitest ウォッチモード
```

### 本番ビルド

```bash
bun run build      # standalone 出力（Docker 時）
```

- `DOCKER_BUILD=true` の場合、`output: "standalone"` が有効
- `.next/standalone` に最小限の実行ファイルが出力される

## 技術的制約・留意点

1. **Bun vs Node**: ローカル開発は Bun、Docker ビルドは Node.js 22 + Bun インストール
2. **React Compiler**: 有効化済み（`reactCompiler: true`）
3. **Tailwind v4**: PostCSS 経由で使用
4. **MDX**: コンテンツ管理用に使用（`pageExtensions` に `mdx` を含む）
5. **OGP 画像**: `next/og` の `ImageResponse` で動的生成（1200x630）
6. **PWA**: `manifest.ts` で Web App Manifest を動的生成
7. **ダークモード**: システム設定 + 手動切り替え（Cookie 永続化、`@variant dark`）

## 関連リポジトリ

数学ナレッジベースと MCP サーバーは **`koshikai/mathkb`**（private）に分離されています。DB スキーマ・MCP ツール・内部デプロイ構成はそちらを参照してください。
