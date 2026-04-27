# Architecture

このドキュメントでは、koshikai.dev のシステムアーキテクチャについて説明します。

## 全体構成

```
┌─────────────────────────────────────────────────────────────┐
│                         GitHub                               │
│  ┌─────────────────┐        ┌──────────────────────────┐   │
│  │   Source Code   │───────▶│   GitHub Actions         │   │
│  │   (main branch) │        │   - Build Docker images  │   │
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
│  │  ┌──────────────┐    ┌──────────────┐    ┌────────┐  │  │
│  │  │ koshikai-app │    │ mathkb-app   │    │ mathkb │  │  │
│  │  │  (public)    │    │  (internal)  │    │ -mcp   │  │  │
│  │  │   :3002      │    │   :3103      │    │ :3104  │  │  │
│  │  └──────────────┘    └──────────────┘    └────────┘  │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │              mathkb-nocodb (:8180)               │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL (mathkb DB)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ mathkb_app  │  │ mcp_reader  │  │   mathkb_nocodb     │ │
│  │  (R/W)      │  │  (Read-only)│  │      (R/W)          │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## App Modes

1つのアプリケーションコードベースで、2つのモードを提供します。

### Portfolio Mode（`SITE_VARIANT=portfolio`）

- 公開ポートフォリオサイト
- MDX ベースのコンテンツ表示
- DB 接続不要（ビルド時）

### MathKB Mode（`SITE_VARIANT=mathkb`）

- 内部限定の数学ナレッジベース
- PostgreSQL 全文検索対応
- タグ・分野フィルタリング
- `robots.txt` 全拒否、`sitemap.xml` 空

## データベース設計

### テーブル構成

| テーブル | 説明 |
|----------|------|
| `notes` | 数学ノートの本体 |
| `tags` | タグ定義 |
| `note_tags` | ノートとタグの中間テーブル |

### `notes` テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| `id` | serial | PK |
| `slug` | text | URL 用一意識別子 |
| `title` | text | タイトル |
| `field` | text | 分野名 |
| `summary` | text | 要約 |
| `body_markdown` | text | Markdown 本文 |
| `body_plain` | text | `body_markdown` から自動生成 |
| `is_public` | boolean | 公開フラグ |
| `created_at` | timestamp | 作成日時 |
| `updated_at` | timestamp | 更新日時 |
| `search_document` | tsvector | 全文検索用生成カラム |

### 全文検索

- `pg_trgm` 拡張を使用
- `body_markdown` → `body_plain` 変換は PostgreSQL trigger で自動実行
- `search_document` は `title`, `body_plain`, `field` から生成される `tsvector`

## MCP サーバーアーキテクチャ

### 実装済みツール（読み取り専用）

| ツール名 | 説明 |
|----------|------|
| `search_notes` | 全文検索・フィルタ（`limit` default 10, max 50） |
| `get_note` | slug 指定で単一ノート取得 |
| `list_fields` | 分野一覧取得 |
| `list_tags` | タグ一覧取得 |

### 通信方式

- **HTTP**: `mcp:http` スクリプトで SSE エンドポイント提供
- **Stdio**: `mcp:stdio` スクリプトでローカル連携

### セキュリティ

- `mcp_reader` ロールは読み取り専用
- `MCP_ALLOWED_HOSTS` で Host ヘッダー制限可能
- 書き込みツールは未実装（意図的）

## コンポーネント構成

### ポートフォリオ用

- `PortfolioHome`: トップページ
- `ProjectCard`: プロジェクトカード
- `ResearchSection`: 研究・開発セクション
- `VariantSwitcher`: モード切り替え UI（開発時）

### MathKB 用

- `MathKbHome`: KB トップページ（検索・一覧）
- `MarkdownArticle`: Markdown レンダリング
- `SetupNotice`: DB 未設定時のセットアップ案内

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
5. **pg**: PostgreSQL 接続用（`pg` パッケージ使用）
