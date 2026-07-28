# Architecture

## 全体像

このリポジトリには、公開ポートフォリオと MathKB MCP サーバーという2つの独立した実行系があります。Web アプリの variant 切り替えはありません。

```text
GitHub main
  └─ GitHub Actions
      ├─ lint / test / audit（依存変更時）
      ├─ Web image  ──> GHCR ──> koshikai-app :3002
      └─ MCP image  ──> GHCR ──> mathkb-mcp  :3104 ──> PostgreSQL
```

デプロイ先は Proxmox 上の self-hosted GitHub Actions runner と Docker Compose です。

## 公開ポートフォリオ

- Next.js 16 App Router / React 19
- `src/app/page.tsx` と `src/components/PortfolioHome.tsx` がトップページを構成
- `src/content/cases/*.mdx` を `src/lib/cases.ts` が読み込み、`/cases` と `/cases/[slug]` で表示
- `src/lib/site-config.ts` が metadata、canonical、sitemap の設定を提供
- `SITE_URL` 未設定時は `https://koshikai.dev`
- DB 接続不要
- `DOCKER_BUILD=true` のとき Next.js standalone output を生成

主な route:

| Route | 用途 |
|---|---|
| `/` | ポートフォリオトップ |
| `/cases` | ケーススタディ一覧 |
| `/cases/[slug]` | MDX ケーススタディ詳細 |
| `/llm-benchmarks` | LLM ベンチマーク比較（`src/lib/benchmarks-data.ts`） |
| `/healthz` | Web container health check |
| `/robots.txt` | crawler 設定 |
| `/sitemap.xml` | sitemap |
| `/manifest.webmanifest` | Web App Manifest |
| `/opengraph-image` | OGP image |

## MathKB MCP

MathKB はUIを持たず、以下のMCP・データ層で構成します。

- `src/mcp/server.ts`: MCP protocol adapter
- `src/lib/mathkb/repository.ts`: SQL repository
- `src/lib/mathkb/db.ts`: PostgreSQL pool
- `src/lib/mathkb/embedding.ts`: multilingual-e5-small embedding
- `db/mathkb.sql`: schema と index
- `db/mathkb.roles.sql`: DB role と権限

MCP は stdio と stateless Streamable HTTP に対応します。HTTP は既定で `0.0.0.0:3004/mcp`、health check は `/healthz` です。

### データモデル

| Table | 用途 |
|---|---|
| `notes` | ノート本体、全文検索文書、384次元 embedding |
| `tags` | タグ定義 |
| `note_tags` | ノートとタグの関連 |

検索は PostgreSQL の `tsvector`、`pg_trgm`、pgvector HNSW index を利用します。`body_plain` と `updated_at` は trigger で更新されます。

### DB ロール

| Role | 権限 | 想定用途 |
|---|---|---|
| `mcp_reader` | SELECT | MCP 読み取り専用 |
| `mcp_writer` | SELECT / INSERT / UPDATE、`note_tags`のDELETE | MCP 作成・更新・タグ置換。ノート削除不可 |
| `mathkb_nocodb` | SELECT / INSERT / UPDATE / DELETE | 管理用途 |

ノート削除ツールは公開しません。削除は管理経路から行います。

## セキュリティ

Web アプリは production で HSTS、CSP、`X-Frame-Options`、`X-Content-Type-Options`、Referrer Policy、Permissions Policy を返します。container は非 root user で動作します。

MCP HTTP は以下を備えます。

- `MCP_ALLOWED_HOSTS` による Host allowlist（production HTTPでは必須）
- IP ごとの in-memory rate limit（60 requests/minute）
- Zod による tool input validation
- DB role による最小権限化

認証機構は実装されていないため、MCP port をインターネットへ直接公開しないでください。LAN firewall、VPN、SSH tunnel、認証付き reverse proxy のいずれかを使用します。

## Docker image

### Web

1. `oven/bun:1.3.13` で依存関係を導入
2. `node:22-slim` に Bun を導入して Next.js を build
3. `node:22-slim` で standalone server を非 root 実行

portfolio runnerにはMCP用のonnxruntimeを追加せず、Next.js standalone出力だけを配置します。

### MCP

`oven/bun:1.3.13` で production dependencies と TypeScript source を配置し、`bun run mcp:http` を実行します。
