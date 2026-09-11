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

サイトは build · operate · research の3軸で構成し、グローバルナビは Works / Engineering / Research / About の4項目。事例（Cases）はナビに置かず、各軸のページから個別の事例へ遷移する。

| パス | 内容 |
|------|------|
| `/` | トップ（Hero → 3軸の概要 → Works → Engineering → Research → About への導線） |
| `/works` | 作品一覧（build） |
| `/engineering` | デプロイ経路・自宅基盤・技術と使用例（operate） |
| `/research` | 研究（Problem / Method / Result）・発表・関連コンテンツ |
| `/about` | 経歴・受賞・講座・連絡先・募集状況（任意） |
| `/cases` | 全事例の索引（フッターから） |
| `/cases/[slug]` | 事例詳細（MDX）。`axis` で所属する軸が決まる |
| `/llm-benchmarks` | Research 配下の独立ページ |
| `/healthz` | ヘルスチェック |
| `/manifest.webmanifest` | Web App Manifest |

## データとコンポーネント

表示内容はコンポーネントに直接書かず、`src/lib/` のデータから描画する。トップと各ページは同じデータを読む。

| データ | 内容 |
|------|------|
| `profile.ts` | 名前・リード文・連絡先・学歴・募集状況（`availability` が null なら非表示） |
| `works.ts` | 作品。開始時期・状態・担当範囲はリポジトリで確認できる事実だけを書く |
| `engineering.ts` | 技術と使用例（evidence）、運用上の事実、自宅基盤の層、デプロイ経路 |
| `research.ts` | 研究トピック（P/M/R）、発表、講座、関連コンテンツ |
| `cases.ts` | 事例のメタデータと `axis`（build / operate / research） |

`src/lib/content.test.ts` が、事例へのリンク切れやトップに出す作品・研究の数を検査する。

主なコンポーネント: `SiteHeader` / `PrimaryNav`（`aria-current` 付き）、`WorkCard`、`DeployPipeline`、`HomelabStack`、`CapabilityTable`、`ResearchCard`、`CaseList`、`ThemeToggle`（ライト既定・ダークを選んだときだけ localStorage に保存）。

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
7. **テーマ**: ライトが既定。ダークは手動切り替えのみ（localStorage 永続化、`@variant dark`）。デザイン判断はライト基準で行う
8. **フォント**: Inter（可変）+ Noto Sans JP（unicode-range 分割版）+ JetBrains Mono。明朝体は使わない

## 関連リポジトリ

数学ナレッジベースと MCP サーバーは **`koshikai/mathkb`**（private）に分離されています。DB スキーマ・MCP ツール・内部デプロイ構成はそちらを参照してください。
