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

- 公開ポートフォリオサイト（TanStack Start + Vite + SSR + TanStack Router）
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
| `/cases/$slug` | 事例詳細（MDX）。`axis` で所属する軸が決まる |
| `/llm-benchmarks` | Research 配下の独立ページ |
| `/healthz` | ヘルスチェック |
| `/manifest.json` | Web App Manifest（`public/manifest.json`） |

## データとコンポーネント

表示内容はコンポーネントに直接書かず、`src/lib/` のデータから描画する。トップと各ページは同じデータを読む。

| データ | 内容 |
|------|------|
| `profile.ts` | 名前・リード文・連絡先・学歴・募集状況（`availability` が null なら非表示） |
| `works.ts` | 作品。開始時期・状態・担当範囲はリポジトリで確認できる事実だけを書く |
| `engineering.ts` | 技術と使用例（evidence）、運用上の事実、自宅基盤の層、デプロイ経路 |
| `research.ts` | 研究トピック（P/M/R）、発表、講座、関連コンテンツ |
| `cases.ts` | 事例のメタデータと `axis`（build / operate / research） |

`src/lib/content.test.ts` が、事例へのリンク切れやトップに出す作品・研究の数、`public/sitemap.xml` の網羅性を検査する。

主なコンポーネント: `SiteHeader` / `PrimaryNav`（`aria-current` 付き）、`WorkCard`、`DeployPipeline`、`HomelabStack`、`CapabilityTable`、`ResearchCard`、`CaseList`、`ThemeToggle`（ライト既定・ダークを選んだときだけ localStorage に保存）。

## ビルド・出力

### 開発時

```bash
bun run dev        # Vite dev server (:3000)
bun run test       # Vitest ウォッチモード
```

### 本番ビルド

```bash
bun run build      # Vite SSR + Client ビルド
bun run start      # server.mjs による本番配信
```

- `vite.config.ts` の `ssr: { noExternal: true }` により、`dist/server/server.js` にサーバー用依存関係がバンドルされ、`dist/client/` に静的アセットが出力される
- `server.mjs` が静的ファイル配信（`/assets/*` の `immutable` キャッシュ）、SSR ハンドラー呼び出し、およびセキュリティヘッダー付与を行う

## 技術的制約・留意点

1. **Bun vs Node**: ローカル開発は Bun、Docker ビルドは Node.js 22 + Bun、本番実行は `node:22-slim`（`node server.mjs`）
2. **Tailwind v4**: `@tailwindcss/vite` プラグイン経由で使用
3. **MDX**: `@mdx-js/rollup` でビルド時にコンパイルし、`mdx-components.tsx` のカスタムコンポーネントを適用して SSR 描画
4. **PWA / SEO**: `public/manifest.json`、`public/robots.txt`、`public/sitemap.xml` を静的配信し、各ルートの `head` で canonical / OpenGraph メタデータを設定
5. **テーマ**: ライトが既定。ダークは手動切り替えのみ（localStorage 永続化、`@variant dark`）。デザイン判断はライト基準で行う
6. **フォント**: Geist（可変）+ Noto Sans JP（unicode-range 分割版）+ Geist Mono。明朝体は使わない
